import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/*  Corner-accent frame for image panels                               */
/* ------------------------------------------------------------------ */
function CornerFrame({ position }: { position: "tl-br" | "tr-bl" }) {
  const tl = position === "tl-br";
  return (
    <>
      {/* primary corner */}
      <span
        className={`absolute w-10 h-10 transition-all duration-600 ease-out
          group-hover:w-14 group-hover:h-14
          ${tl ? "-top-2.5 -left-2.5 border-t border-l" : "-top-2.5 -right-2.5 border-t border-r"}
          border-[#c9b99a]/25 group-hover:border-[#c9b99a]/45`}
      />
      {/* opposite corner */}
      <span
        className={`absolute w-10 h-10 transition-all duration-600 ease-out
          group-hover:w-14 group-hover:h-14
          ${tl ? "-bottom-2.5 -right-2.5 border-b border-r" : "-bottom-2.5 -left-2.5 border-b border-l"}
          border-[#c9b99a]/25 group-hover:border-[#c9b99a]/45`}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Image panel with edge-blend gradients                              */
/* ------------------------------------------------------------------ */
function ImagePanel({
  src,
  alt,
  objectPosition,
  blendDirection,
  extraFilters = "",
}: {
  src: string;
  alt: string;
  objectPosition: string;
  blendDirection: "left" | "right";
  extraFilters?: string;
}) {
  const isLeft = blendDirection === "left";
  return (
    <div className="w-[24vw] min-w-[220px] max-w-[380px] aspect-[3/4] overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="eager"
        className={`w-full h-full object-cover ${objectPosition}
          brightness-[0.82] contrast-[1.08] ${extraFilters}
          transition-all duration-700 ease-out
          group-hover:brightness-[0.92] group-hover:scale-[1.03]`}
      />
      {/* Edge-blend: dissolve outer edge into bg */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLeft
            ? "bg-[linear-gradient(to_right,#141210_0%,transparent_18%)]"
            : "bg-[linear-gradient(to_left,#141210_0%,transparent_18%)]"
        }`}
      />
      {/* Edge-blend: dissolve top & bottom (hides light wall bg) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,#141210_0%,transparent_22%,transparent_82%,#141210_100%)]" />
      {/* Edge-blend: soften inner edge toward text */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLeft
            ? "bg-[linear-gradient(to_left,rgba(20,18,16,0.35)_0%,transparent_45%)]"
            : "bg-[linear-gradient(to_right,rgba(20,18,16,0.35)_0%,transparent_45%)]"
        }`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-[#141210]"
      aria-label="Inicio — EFA Tattoo"
    >
      {/* ── Ambient warm radials ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_25%_40%,rgba(201,185,154,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_78%_55%,rgba(201,185,154,0.035)_0%,transparent_60%)]" />

      {/* ── Left image panel (color, desaturated) ── */}
      <motion.div
        initial={{ opacity: 0, x: -36, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.25, ease: EASE_SMOOTH }}
        className="absolute left-[4vw] lg:left-[6vw] xl:left-[8vw]
                   top-[47%] -translate-y-[55%]
                   hidden md:block z-[1]"
      >
        <div className="relative group cursor-default">
          <CornerFrame position="tl-br" />
          <ImagePanel
            src="/img/img_1.webp"
            alt="EFA Tattoo — Enric en el estudio"
            objectPosition="object-[center_68%]"
            blendDirection="left"
            extraFilters="saturate-[0.65] group-hover:saturate-[0.85]"
          />
        </div>
      </motion.div>

      {/* ── Right image panel (B&W) ── */}
      <motion.div
        initial={{ opacity: 0, x: 36, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.4, ease: EASE_SMOOTH }}
        className="absolute right-[4vw] lg:right-[6vw] xl:right-[8vw]
                   top-[53%] -translate-y-[45%]
                   hidden md:block z-[1]"
      >
        <div className="relative group cursor-default">
          <CornerFrame position="tr-bl" />
          <ImagePanel
            src="/img/img_2.webp"
            alt="EFA Tattoo — Retrato del artista"
            objectPosition="object-[center_28%]"
            blendDirection="right"
          />
        </div>
      </motion.div>

      {/* ── Mobile: single background image ── */}
      <div className="absolute inset-0 md:hidden">
        <img
          src="/img/img_2.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[center_25%] brightness-[0.3] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#141210]/50 via-transparent to-[#141210]/70" />
      </div>

      {/* ── Center readability zone (desktop) ── */}
      <div className="absolute inset-0 hidden md:block bg-[radial-gradient(ellipse_38%_55%_at_50%_50%,rgba(20,18,16,0.75)_0%,rgba(20,18,16,0.25)_55%,transparent_80%)]" />

      {/* Decorative horizontal lines */}
      <div className="absolute inset-x-0 top-[30%] h-px bg-white/[0.04]" />
      <div className="absolute inset-x-0 bottom-[25%] h-px bg-white/[0.04]" />

      {/* Decorative vertical lines */}
      <div className="absolute inset-y-0 left-[8%] w-px bg-white/[0.03]" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-white/[0.03]" />

      {/* ── Main content ── */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[4vw]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 select-none text-[0.7rem] uppercase tracking-[0.55em] text-[#c9b99a]"
        >
          Barcelona · Fine Line · Micro-realismo
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="select-none text-center font-light uppercase leading-none tracking-[0.2em] text-white"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 9vw, 8.5rem)",
          }}
        >
          EFA Tattoo
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          style={{ originX: 0.5 }}
          className="mt-7 mb-7 h-px w-48 bg-[#c9b99a]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="max-w-xs text-center text-sm font-light leading-relaxed tracking-[0.12em] text-white/65"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Arte sobre la piel, hecho con criterio y precisión.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="mt-10 flex w-full max-w-2xl flex-col items-center gap-8 mx-auto"
        >
          <Link
            to="/tattoo"
            className="group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-transparent px-10 py-4 transition-all duration-500 hover:bg-[#c9b99a]"
          >
            <span className="relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#c9b99a] transition-colors duration-300 group-hover:text-[#141210]">
              Reservar Cita
            </span>
          </Link>

          <div className="grid w-full max-w-lg grid-cols-3 items-center text-center">
            <div className="flex justify-center">
              <Link
                to="/about"
                className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                About
                <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </div>

            <div className="flex justify-center">
              <Link
                to="/gallery"
                className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-[#c9b99a]"
              >
                Galería
                <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </div>

            <div className="flex justify-center">
              <Link
                to="/academy"
                className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                Academy
                <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
