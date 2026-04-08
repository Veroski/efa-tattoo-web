import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Img({
  height,
  bg = "#1e1c1a",
  src,
  alt = "",
  objectPosition = "center",
  scale = 1,
  className = "",
}: {
  height: string;
  bg?: string;
  src?: string;
  alt?: string;
  objectPosition?: string;
  scale?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height, backgroundColor: bg }}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition, transform: `scale(${scale})`, transformOrigin: objectPosition }}
        />
      )}
      <div className="absolute inset-0 border border-white/5" />
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: "easeOut" as const },
};

export default function AboutContent() {
  const { t } = useTranslation();
  const features = t("about.features", { returnObjects: true }) as Array<{ num: string; title: string; body: string }>;

  return (
    <div className="overflow-hidden">

      {/* ─── 1. HERO ─── */}
      <section className="px-[4vw] py-16 md:py-24 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-start">

          <div className="relative z-10 md:pr-20 space-y-8">
            <motion.p
              {...fadeUp}
              className="text-[#c9b99a] text-[0.7rem] tracking-[0.6em] uppercase"
            >
              {t("about.eyebrow")}
            </motion.p>

            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-white uppercase tracking-[0.22em] font-light leading-none"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
            >
              {t("about.title")}
            </motion.h2>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="space-y-5 text-white/70 text-sm leading-relaxed font-light tracking-wide max-w-[30rem]"
            >
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-14 md:mt-0"
          >
            <Img
              height="520px"
              bg="#2a2520"
              src="/img/img_2.webp"
              alt={t("about.imgAlt1")}
              objectPosition="center 18%"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── 2. PASSION FOR TATTOOING ─── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#141210" }}>
        <div className="px-[4vw] max-w-[1500px] mx-auto">

          <motion.p
            {...fadeUp}
            className="text-white/40 text-[0.7rem] tracking-[0.6em] uppercase mb-10"
          >
            {t("about.specialtyEyebrow")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Img
                height="580px"
                bg="#1e1c1a"
                src="/img/img_1.webp"
                alt={t("about.imgAlt2")}
                objectPosition="center 65%"
              />
            </motion.div>

            <div className="space-y-12">
              <motion.h2
                {...fadeUp}
                className="text-white uppercase tracking-[0.22em] font-light leading-tight"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
              >
                {t("about.passionTitle").split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </motion.h2>

              <div className="space-y-0">
                {features.map((item, i) => (
                  <motion.div
                    key={item.num}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: i * 0.12 }}
                    className="grid grid-cols-[2.8rem_1fr] gap-4 border-t border-white/10 py-7"
                  >
                    <span className="text-[#c9b99a] text-[0.7rem] tracking-[0.3em] pt-[3px]">
                      {item.num}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-white text-xs tracking-[0.35em] uppercase font-medium">
                        {item.title}
                      </h3>
                      <p className="text-white/65 text-sm leading-relaxed font-light">
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/tattoo"
                  className="inline-block border border-white/25 text-white text-xs tracking-[0.45em] uppercase py-4 px-10 hover:bg-white hover:text-[#1a1814] transition-colors duration-300"
                >
                  {t("about.bookingCta")}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. ACADEMY / METHOD ─── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#1a1814" }}>
        <div className="px-[4vw] max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <Img
                height="640px"
                bg="#222020"
                src="/img/Proyectos%20grandes/proyectos_grandes_55.webp"
                alt={t("about.imgAlt3")}
                objectPosition="62% 38%"
                scale={1.45}
              />
            </motion.div>

            <div className="space-y-10 md:pt-10">
              <div className="space-y-6">
                <motion.p
                  {...fadeUp}
                  className="text-white/40 text-[0.7rem] tracking-[0.55em] uppercase"
                >
                  {t("about.academyEyebrow")}
                </motion.p>
                <motion.h2
                  {...fadeUp}
                  transition={{ duration: 0.65, delay: 0.1 }}
                  className="text-white uppercase tracking-[0.22em] font-light leading-tight"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
                >
                  {t("about.academyTitle").split("\n").map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </motion.h2>
              </div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="space-y-5 text-white/65 text-sm leading-relaxed font-light tracking-wide max-w-[28rem]"
              >
                <p>{t("about.academyP1")}</p>
                <p>{t("about.academyP2")}</p>
              </motion.div>

              <div className="space-y-5 pt-2">
                {([t("about.tagline1"), t("about.tagline2")] as string[]).map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                    className="relative inline-block text-white text-base font-light tracking-wide"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {line}
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                      style={{ originX: 0 }}
                      className="absolute bottom-0 left-0 right-0 h-px bg-[#c9b99a] block"
                    />
                  </motion.p>
                ))}
              </div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                <Link
                  to="/academy"
                  className="inline-block border border-white/25 text-white text-xs tracking-[0.45em] uppercase py-4 px-10 hover:bg-white hover:text-[#1a1814] transition-colors duration-300"
                >
                  {t("about.academyCta")}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. LET'S CREATE TOGETHER ─── */}
      <section className="px-[4vw] py-20 md:py-28 text-center" style={{ backgroundColor: "#141210" }}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="max-w-lg mx-auto space-y-8"
        >
          <h2
            className="text-white uppercase tracking-[0.3em] font-light"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.6rem)" }}
          >
            {t("about.finalTitle")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide">
            {t("about.finalText")}
          </p>
        </motion.div>
      </section>

    </div>
  );
}
