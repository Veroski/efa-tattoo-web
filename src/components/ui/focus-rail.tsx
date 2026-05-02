"use client";

import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type FocusRailItem = {
  id: string | number;
  title: string;
  description?: string;
  mediaSrc: string;
  posterSrc?: string;
  mediaType?: "image" | "video";
  href?: string;
  meta?: string;
};

interface FocusRailProps {
  items: FocusRailItem[];
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

/**
 * Helper to wrap indices (e.g., -1 becomes length-1)
 */
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const BASE_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
} as const;

const TAP_SPRING = {
  type: "spring",
  stiffness: 450,
  damping: 18, 
  mass: 1,
} as const;

export function FocusRail({
  items,
  initialIndex = 0,
  loop = true,
  autoPlay = false,
  interval = 4000,
  className,
}: FocusRailProps) {
  const [active, setActive] = React.useState(initialIndex);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isInViewport, setIsInViewport] = React.useState(false);
  const [audioOptIn, setAudioOptIn] = React.useState(false);
  const [audioActive, setAudioActive] = React.useState(false);
  const lastWheelTime = React.useRef<number>(0);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const activeItem = items[activeIndex];

  const handlePrev = React.useCallback(() => {
    if (!loop && active === 0) return;
    setActive((p) => p - 1);
  }, [loop, active]);

  const handleNext = React.useCallback(() => {
    if (!loop && active === count - 1) return;
    setActive((p) => p + 1);
  }, [loop, active, count]);

  const onWheel = React.useCallback(
    (e: React.WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 400) return;

      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : e.deltaY;

      if (Math.abs(delta) > 20) {
        if (delta > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastWheelTime.current = now;
      }
    },
    [handleNext, handlePrev]
  );

  React.useEffect(() => {
    if (!autoPlay || isHovering) return;
    const timer = setInterval(() => handleNext(), interval);
    return () => clearInterval(timer);
  }, [autoPlay, isHovering, handleNext, interval]);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { threshold: 0.55 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (isInViewport) {
      setAudioActive(audioOptIn);
      return;
    }
    setAudioActive(false);
  }, [isInViewport, audioOptIn]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const onDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
  };

  const visibleIndices = [-2, -1, 0, 1, 2];

  const renderMedia = (
    item: FocusRailItem,
    { isBg = false, isActive = false }: { isBg?: boolean; isActive?: boolean } = {}
  ) => {
    const isVideo = item.mediaType === "video" || item.mediaSrc.endsWith(".mp4") || item.mediaSrc.endsWith(".webm");
    const className = isBg ? "h-full w-full object-cover blur-3xl saturate-200" : "h-full w-full rounded-2xl object-cover pointer-events-none";

    if (isVideo) {
      if (!isActive || isBg || !isInViewport) {
        return <img src={item.posterSrc ?? item.mediaSrc} alt={item.title} className={className} loading="lazy" />;
      }
      return (
        <video
          key={item.mediaSrc}
          src={item.mediaSrc}
          autoPlay
          muted={!audioActive}
          loop
          playsInline
          preload="metadata"
          poster={item.posterSrc}
          className={className}
        />
      );
    }
    return <img src={item.mediaSrc} alt={item.title} className={className} />;
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "group relative flex h-[600px] w-full flex-col overflow-hidden bg-[#0A0A0A] text-white outline-none select-none overflow-x-hidden rounded-sm border border-white/5",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onWheel={onWheel}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`bg-${activeItem.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {renderMedia(activeItem, { isBg: true, isActive: true })}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 md:px-8">
        {/* DRAGGABLE RAIL CONTAINER */}
        <motion.div
          className="relative mx-auto flex h-[360px] w-full max-w-6xl items-center justify-center perspective-[1200px] cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={onDragEnd}
        >
          {visibleIndices.map((offset) => {
            const absIndex = active + offset;
            const index = wrap(0, count, absIndex);
            const item = items[index];

            if (!loop && (absIndex < 0 || absIndex >= count)) return null;

            const isCenter = offset === 0;
            const dist = Math.abs(offset);

            const xOffset = offset * 280; // slightly tighter for better fit
            const zOffset = -dist * 180;
            const scale = isCenter ? 1 : 0.80; // a bit smaller back cards
            const rotateY = offset * -20;

            const opacity = isCenter ? 1 : Math.max(0.2, 1 - dist * 0.4);
            const blur = isCenter ? 0 : dist * 4;
            const brightness = isCenter ? 1 : 0.5;

            return (
              <motion.div
                key={absIndex}
                className={cn(
                  "absolute aspect-[4/5] w-[260px] md:w-[300px] rounded-2xl border-t border-white/15 bg-black shadow-2xl transition-shadow duration-300",
                  isCenter ? "z-20 shadow-[0_20px_50px_rgba(201,185,154,0.15)] ring-1 ring-white/10" : "z-10"
                )}
                initial={false}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale, 
                  rotateY: rotateY,
                  opacity: opacity,
                  filter: `blur(${blur}px) brightness(${brightness})`,
                }}
                transition={{
                  scale: TAP_SPRING,
                  default: BASE_SPRING,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (offset !== 0) setActive((p) => p + offset);
                }}
              >
                {renderMedia(item, { isActive: isCenter })}
                {isCenter && isInViewport && item.mediaType === "video" && !audioOptIn && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioOptIn(true);
                      setAudioActive(true);
                    }}
                    className="absolute bottom-3 right-3 z-30 rounded-full border border-white/30 bg-black/65 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-white backdrop-blur transition hover:border-white/50 hover:bg-black/80"
                    aria-label="Activar sonido"
                  >
                    Tap sonido
                  </button>
                )}

                {/* Lighting layers */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />
                <div className="absolute inset-0 rounded-2xl bg-black/10 pointer-events-none mix-blend-multiply" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Info & Controls */}
        <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col items-center justify-between gap-6 md:flex-row pointer-events-auto">
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left h-32 justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {activeItem.meta && (
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#c9b99a]">
                    {activeItem.meta}
                  </span>
                )}
                <h2 className="text-2xl font-light tracking-widest uppercase md:text-3xl text-white font-body">
                  {activeItem.title}
                </h2>
                {activeItem.description && (
                  <p className="max-w-md text-white/50 text-sm font-light leading-relaxed tracking-wide">
                    {activeItem.description}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-full bg-black/50 p-1 ring-1 ring-white/15 backdrop-blur-md">
              <button
                onClick={handlePrev}
                className="rounded-full p-3 text-white/40 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[40px] text-center text-[0.65rem] font-light tracking-[0.2em] text-[#c9b99a]">
                {activeIndex + 1} / {count}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full p-3 text-white/40 transition hover:bg-white/10 hover:text-white active:scale-95"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {activeItem.href && (
              <Link
                to={activeItem.href}
                className="group flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Visitar
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
