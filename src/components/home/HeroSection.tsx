import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-[#141210]"
      aria-label={t("hero.ariaLabel")}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: EASE_SMOOTH }}
        className="absolute inset-0"
      >
        <img
          src="/img/img_1.webp"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-[58%_68%] md:object-[center_68%] brightness-[0.42] contrast-[1.08] grayscale-[0.42] saturate-[0.35]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_24%,rgba(20,18,16,0.34)_58%,rgba(20,18,16,0.7)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,18,16,0.7)_0%,rgba(20,18,16,0.18)_42%,rgba(20,18,16,0.44)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(255,255,255,0.06)_0%,transparent_72%)] mix-blend-screen" />
      </motion.div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_25%_40%,rgba(201,185,154,0.04)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_78%_55%,rgba(201,185,154,0.025)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_38%_55%_at_50%_50%,rgba(20,18,16,0.76)_0%,rgba(20,18,16,0.26)_55%,transparent_80%)]" />

      <div className="absolute inset-x-0 top-[30%] h-px bg-white/[0.04]" />
      <div className="absolute inset-x-0 bottom-[25%] h-px bg-white/[0.04]" />
      <div className="absolute inset-y-0 left-[8%] w-px bg-white/[0.03]" />
      <div className="absolute inset-y-0 right-[8%] w-px bg-white/[0.03]" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[4vw]">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
          className="select-none text-center font-light uppercase leading-none tracking-[0.2em] text-white"
          style={{
            fontFamily: "var(--font-body)",
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
          className="mt-7 mb-10 h-px w-48 bg-[#c9b99a]"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4 md:px-0"
        >
          <Link
            to="/tattoo"
            className="group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-transparent px-10 py-4 transition-all duration-500 hover:bg-[#c9b99a] w-full md:w-52"
          >
            <span className="relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#c9b99a] transition-colors duration-300 group-hover:text-[#141210]">
              Ver Cita
            </span>
          </Link>

          <Link
            to="/academy"
            className="group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-[#c9b99a] px-10 py-4 transition-all duration-500 hover:bg-transparent w-full md:w-52"
          >
            <span className="relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#141210] transition-colors duration-300 group-hover:text-[#c9b99a]">
              Ver Cursos
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3 }}
          className="mt-10 grid w-full max-w-lg grid-cols-3 items-center text-center"
        >
          <div className="flex justify-center">
            <Link
              to="/about"
              className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
            >
              {t("hero.navAbout")}
              <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          </div>

          <div className="flex justify-center">
            <Link
              to="/gallery"
              className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-[#c9b99a]"
            >
              {t("hero.navGallery")}
              <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          </div>

          <div className="flex justify-center">
            <Link
              to="/academy"
              className="relative group text-[0.65rem] uppercase tracking-[0.3em] pl-[0.3em] text-white/60 transition-colors duration-300 hover:text-white"
            >
              {t("hero.navAcademy")}
              <span className="absolute left-0 right-0 -bottom-1 h-px origin-left scale-x-0 bg-[#c9b99a] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
