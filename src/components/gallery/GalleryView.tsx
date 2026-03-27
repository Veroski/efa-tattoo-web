import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "./galleryData";
import GalleryLightbox from "./GalleryLightbox";

const BATCH_SIZE = 24;

/* ────────────────────────────────────────────
 * LazyImage — fades in on load, hides on error
 * ──────────────────────────────────────────── */
function LazyImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <button
      type="button"
      className="relative w-full overflow-hidden group cursor-zoom-in break-inside-avoid block mb-[10px] bg-[#1a1814]"
      onClick={onClick}
      aria-label={`Ver ${alt}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-auto block transition-all duration-700 ease-out ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
        style={{ minHeight: "80px" }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
        <span className="text-white/80 text-[0.55rem] tracking-[0.5em] uppercase translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          Ver detalle
        </span>
      </div>

      {/* Subtle border on hover */}
      <div className="absolute inset-0 border border-[#c9b99a]/0 group-hover:border-[#c9b99a]/20 transition-colors duration-500 pointer-events-none" />
    </button>
  );
}

/* ────────────────────────────────────────────
 * GalleryView — tabs + masonry + lightbox
 * ──────────────────────────────────────────── */
export default function GalleryView() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [fading, setFading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const category = categories.find((c) => c.id === activeId)!;
  const visibleImages = category.images.slice(0, visibleCount);
  const hasMore = visibleCount < category.images.length;

  /* ── Infinite scroll via IntersectionObserver ── */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + BATCH_SIZE, category.images.length),
          );
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, category.images.length]);

  /* ── Category switch with fade transition ── */
  const switchCategory = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setFading(true);
      setTimeout(() => {
        setActiveId(id);
        setVisibleCount(BATCH_SIZE);
        setFading(false);
        tabsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    },
    [activeId],
  );

  /* ── Lightbox navigation (auto-expands batch) ── */
  const handleLightboxNav = useCallback(
    (index: number) => {
      setLightboxIndex(index);
      if (index >= visibleCount) {
        setVisibleCount(
          Math.min(index + BATCH_SIZE, category.images.length),
        );
      }
    },
    [visibleCount, category.images.length],
  );

  return (
    <>
      {/* ═══════════════════════════════════════════
       *  STICKY CATEGORY NAVIGATION
       * ═══════════════════════════════════════════ */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-30 bg-[#141210]/[0.97] backdrop-blur-sm"
      >
        <div className="h-px bg-white/[0.06]" />

        <div className="max-w-[1500px] mx-auto px-[4vw] pt-[76px] pb-5">
          {/* Tab row */}
          <div className="flex gap-0.5 overflow-x-auto no-scrollbar -mx-2 px-2">
            {categories.map((cat) => {
              const isActive = cat.id === activeId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => switchCategory(cat.id)}
                  className={`relative whitespace-nowrap px-4 py-3 text-[0.6rem] tracking-[0.3em] uppercase transition-colors duration-300
                    ${isActive ? "text-[#c9b99a]" : "text-white/35 hover:text-white/65"}`}
                >
                  {cat.title}
                  <span
                    className={`ml-2 text-[0.5rem] tabular-nums ${
                      isActive ? "text-[#c9b99a]/50" : "text-white/20"
                    }`}
                  >
                    {cat.count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="gallery-tab-line"
                      className="absolute bottom-0 left-4 right-4 h-px bg-[#c9b99a]/80"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Category description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeId}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
              className="text-white/25 text-[0.68rem] tracking-wide mt-4 font-light"
            >
              {category.description}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="h-px bg-white/[0.06]" />
      </div>

      {/* ═══════════════════════════════════════════
       *  MASONRY GRID
       * ═══════════════════════════════════════════ */}
      <section
        className="px-[4vw] py-8 max-w-[1500px] mx-auto min-h-[50vh]"
        aria-label={`Galería — ${category.title}`}
      >
        <div
          className={`columns-2 md:columns-3 xl:columns-4 transition-opacity duration-200 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
          style={{ columnGap: "10px" }}
        >
          {visibleImages.map((src, i) => (
            <LazyImage
              key={src}
              src={src}
              alt={`${category.title} — trabajo ${i + 1}`}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>

        {/* Load-more sentinel */}
        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-14">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white/[0.06]" />
              <span className="text-white/20 text-[0.55rem] tracking-[0.35em] uppercase animate-pulse">
                Cargando
              </span>
              <div className="h-px w-8 bg-white/[0.06]" />
            </div>
          </div>
        )}

        {/* End marker */}
        {!hasMore && visibleImages.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-14">
            <div className="h-px w-12 bg-white/[0.06]" />
            <span className="text-white/15 text-[0.55rem] tracking-[0.4em] uppercase">
              {category.count} trabajos
            </span>
            <div className="h-px w-12 bg-white/[0.06]" />
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════
       *  LIGHTBOX
       * ═══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <GalleryLightbox
            key="lightbox"
            images={category.images}
            currentIndex={lightboxIndex}
            categoryTitle={category.title}
            onClose={() => setLightboxIndex(null)}
            onNavigate={handleLightboxNav}
          />
        )}
      </AnimatePresence>
    </>
  );
}
