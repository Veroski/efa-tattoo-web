import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface GalleryLightboxProps {
  images: string[];
  currentIndex: number;
  categoryTitle: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  currentIndex,
  categoryTitle,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const { t } = useTranslation();
  const [direction, setDirection] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  const goNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setDirection(1);
      onNavigate(currentIndex + 1);
    }
  }, [currentIndex, images.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      onNavigate(currentIndex - 1);
    }
  }, [currentIndex, onNavigate]);

  /* Keyboard navigation */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handle);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handle);
  }, [onClose, goNext, goPrev]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* Touch swipe */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t("gallery.ariaModal", { title: categoryTitle, current: currentIndex + 1, total: images.length })}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(5,4,3,0.97)" }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 md:px-8 py-5 z-10">
        <span className="text-white/30 text-[0.6rem] tracking-[0.3em] uppercase hidden sm:block">
          {categoryTitle}
        </span>
        <span className="text-white/20 text-[0.6rem] tracking-[0.15em] tabular-nums font-light">
          {currentIndex + 1} — {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-white/40 text-[0.6rem] tracking-[0.35em] uppercase hover:text-white transition-colors duration-300"
          aria-label={t("gallery.cerrar")}
        >
          {t("gallery.cerrar")}
        </button>
      </div>

      {/* ── Image ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={t("gallery.imageAlt", { title: categoryTitle, num: currentIndex + 1 })}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          custom={direction}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.2 }}
          className="max-h-[82vh] max-w-[92vw] md:max-w-[78vw] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </AnimatePresence>

      {/* ── Prev arrow ── */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/20 hover:text-white/70 transition-colors duration-300"
          aria-label={t("gallery.anterior")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 4l-8 8 8 8" />
          </svg>
        </button>
      )}

      {/* ── Next arrow ── */}
      {currentIndex < images.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-white/20 hover:text-white/70 transition-colors duration-300"
          aria-label={t("gallery.siguiente")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 4l8 8-8 8" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}
