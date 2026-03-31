import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GalleryItem {
  id: string;
  bg: string;
  alt: string;
  height?: string;
  style?: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = items.find((i) => i.id === selected);
  const closeRef = useRef<HTMLButtonElement>(null);

  // ESC key to close lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      document.addEventListener("keydown", handleKey);
      // Focus close button when modal opens
      requestAnimationFrame(() => closeRef.current?.focus());
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [selected]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <section
        className="px-[4vw] py-12 max-w-[1500px] mx-auto"
        aria-label="Galería de tatuajes"
      >
        <div className="columns-2 md:columns-3" style={{ columnGap: "11px" }}>
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.025 }}
              className="relative w-full overflow-hidden group break-inside-avoid block mb-[11px]"
              style={{ backgroundColor: item.bg, height: item.height ?? "300px" }}
              onClick={() => setSelected(item.id)}
              aria-label={`Ver ${item.alt}`}
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 group-hover:bg-black/50 transition-colors duration-500">
                <span className="text-white text-xs tracking-[0.4em] uppercase opacity-0 group-hover:opacity-90 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Ver detalle
                </span>
                {item.style && (
                  <span className="text-white/55 text-[0.65rem] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-70 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    {item.style}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && selectedItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            {/* Close button — receives focus on open */}
            <button
              ref={closeRef}
              className="absolute top-7 right-7 text-white/55 text-xs tracking-[0.45em] uppercase hover:text-white transition-colors"
              onClick={() => setSelected(null)}
              aria-label="Cerrar imagen"
            >
              ESC / Cerrar
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-lg w-full"
              style={{ maxHeight: "80vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image placeholder */}
              <div
                className="w-full"
                style={{
                  backgroundColor: selectedItem.bg,
                  aspectRatio: "3/4",
                }}
              />

              {/* Caption */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-white/65 text-xs tracking-[0.35em] uppercase">
                  {selectedItem.alt}
                </p>
                {selectedItem.style && (
                  <span className="text-[#c9b99a] text-[0.65rem] tracking-[0.35em] uppercase">
                    {selectedItem.style}
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
