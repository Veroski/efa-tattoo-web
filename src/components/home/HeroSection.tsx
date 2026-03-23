import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-[#141210]"
      aria-label="Inicio — EFA Tattoo"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2520] via-[#1a1814] to-[#0e0c0a]" />

      {/* Decorative horizontal lines */}
      <div className="absolute inset-x-0 top-[30%] h-px bg-white/[0.04]" />
      <div className="absolute inset-x-0 bottom-[25%] h-px bg-white/[0.04]" />

      {/* Decorative vertical lines */}
      <div className="absolute inset-y-0 left-[8%] w-px bg-white/[0.03]" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-white/[0.03]" />

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[4vw]">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[#c9b99a] text-[0.7rem] tracking-[0.55em] uppercase mb-8 select-none"
        >
          Barcelona · Fine Line · Micro-realismo
        </motion.p>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="text-white font-light tracking-[0.2em] uppercase text-center leading-none select-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem, 9vw, 8.5rem)",
          }}
        >
          EFA Tattoo
        </motion.h1>

        {/* Gold underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          style={{ originX: 0.5 }}
          className="h-px w-48 bg-[#c9b99a] mt-7 mb-7"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="text-white/65 text-sm font-light tracking-[0.12em] text-center max-w-xs leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Arte sobre la piel, hecho con criterio y precisión.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="flex items-center gap-5 mt-10"
        >
          <Link
            to="/tattoo"
            className="border border-[#c9b99a] text-[#c9b99a] text-[0.7rem] tracking-[0.45em] uppercase px-8 py-3 hover:bg-[#c9b99a] hover:text-[#141210] transition-colors duration-300"
          >
            Ver galería
          </Link>
          <Link
            to="/tattoo#booking"
            className="border border-white/30 text-white/80 text-[0.7rem] tracking-[0.45em] uppercase px-8 py-3 hover:bg-white hover:text-[#1a1814] transition-colors duration-300"
          >
            Reservar cita
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
