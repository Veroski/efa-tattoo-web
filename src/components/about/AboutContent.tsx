import { Helmet } from "react-helmet-async";
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Enric",
  "jobTitle": "Tattoo Artist",
  "description": "Tatuador especializado en fine line y micro-realismo en Barcelona, con formación de enfermero y más de 7 años de experiencia.",
  "worksFor": { "@type": "Organization", "name": "EFA Tattoo", "url": "https://www.efa-tattoo.com" },
  "url": "https://www.efa-tattoo.com/about",
  "sameAs": ["https://www.instagram.com/efa_tattoo"],
  "knowsAbout": ["Fine line tattoo", "Microrealismo", "Tatuaje Barcelona"],
};

export default function AboutContent() {
  const { t } = useTranslation();
  const features = t("about.features", { returnObjects: true }) as Array<{ num: string; title: string; body: string }>;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
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

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-white uppercase tracking-[0.22em] font-light leading-none"
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
            >
              {t("about.title")}
            </motion.h1>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="space-y-5 text-white/70 text-sm leading-relaxed font-light tracking-wide max-w-[30rem]"
            >
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </motion.div>
          </div>

          <div className="relative mt-14 md:mt-0 h-[500px] md:h-[650px] w-full group">
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 right-0 w-[75%] h-[75%] z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <Img
                height="100%"
                bg="#2a2520"
                src="/img/img_2.webp"
                alt={t("about.imgAlt1")}
                objectPosition="center 18%"
                className="transition-transform duration-[1.5s] group-hover:scale-105"
              />
            </motion.div>
            <motion.div
               initial={{ opacity: 0, x: -25, y: 25 }}
               whileInView={{ opacity: 1, x: 0, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
               className="absolute bottom-0 left-0 w-[60%] h-[55%] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-[8px] border-[#0c0a09] overflow-hidden"
            >
              <Img
                height="100%"
                bg="#1e1c1a"
                src="/img/img_1.webp"
                alt="Configuración del estudio EFA Tattoo — Barcelona"
                objectPosition="center 20%"
                className="transition-transform duration-[1.5s] group-hover:scale-105"
              />
            </motion.div>
          </div>
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
              className="group overflow-hidden rounded-sm shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
              <Img
                height="620px"
                bg="#1a1814"
                src="/img/Proyectos%20grandes/proyectos_grandes_55.webp"
                alt={t("about.imgAlt2")}
                objectPosition="center 30%"
                className="transition-transform duration-[1.5s] group-hover:scale-[1.03]"
              />
            </motion.div>

            <div className="space-y-12">
              <motion.h2
                {...fadeUp}
                className="text-white uppercase tracking-[0.22em] font-light leading-tight"
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
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

            <div className="relative h-[650px] md:h-[720px] w-full grid grid-cols-2 grid-rows-[2fr_1fr] gap-3 md:gap-4 group">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="col-span-2 row-span-1 overflow-hidden rounded-sm shadow-xl relative"
              >
                <Img
                  height="100%"
                  bg="#222020"
                  src="/img/Seminarios/practica.webp"
                  alt="Seminario Práctica"
                  objectPosition="center"
                  className="transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="col-span-1 row-span-1 overflow-hidden rounded-sm shadow-xl relative"
              >
                <Img
                  height="100%"
                  bg="#222020"
                  src="/img/Seminarios/items.webp"
                  alt="Seminario Materiales"
                  objectPosition="center"
                  className="transition-transform duration-[1.5s] group-hover:scale-[1.05]"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="col-span-1 row-span-1 overflow-hidden rounded-sm shadow-xl relative"
              >
                <Img
                  height="100%"
                  bg="#222020"
                  src="/img/Seminarios/certificados.webp"
                  alt="Seminario Certificados"
                  objectPosition="center"
                  className="transition-transform duration-[1.5s] group-hover:scale-[1.05]"
                />
              </motion.div>
            </div>

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
                  style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
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
                    style={{ fontFamily: "var(--font-body)" }}
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
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.5rem, 3vw, 2.6rem)" }}
          >
            {t("about.finalTitle")}
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide">
            {t("about.finalText")}
          </p>
        </motion.div>
      </section>

    </div>
    </>
  );
}
