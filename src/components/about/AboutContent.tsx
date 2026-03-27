import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
  return (
    <div className="overflow-hidden">

      {/* ─── 1. HERO ─── */}
      <section className="px-[4vw] py-16 md:py-24 max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] items-start">

          {/* Left — text */}
          <div className="relative z-10 md:pr-20 space-y-8">
            <motion.p
              {...fadeUp}
              className="text-[#c9b99a] text-[0.7rem] tracking-[0.6em] uppercase"
            >
              Historias a través del trazo y el conocimiento
            </motion.p>

            <motion.h2
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-white uppercase tracking-[0.22em] font-light leading-none"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)" }}
            >
              Meet Enric
            </motion.h2>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="space-y-5 text-white/70 text-sm leading-relaxed font-light tracking-wide max-w-[30rem]"
            >
              <p>
                Enric es un artista afincado en Barcelona, enfermero de formación y tatuador especializado en fine line y micro-realismo. Su trabajo refleja una conexión profunda con el cuerpo humano y la narración personal a través del trazo.
              </p>
              <p>
                Empezó tatuando mientras trabajaba en urgencias, traduciendo la precisión quirúrgica en un arte que no busca curar una herida, sino honrarla. Más de 7 años de práctica constante definen hoy su método: criterio, técnica y responsabilidad.
              </p>
            </motion.div>
          </div>

          {/* Right — portrait */}
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
              alt="Enric en el estudio — EFA Tattoo Barcelona"
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
            Especialidad
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            {/* Left — image */}
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
                alt="Enric en el estudio con monstera — EFA Tattoo"
                objectPosition="center 65%"
              />
            </motion.div>

            {/* Right — heading + features + CTA */}
            <div className="space-y-12">
              <motion.h2
                {...fadeUp}
                className="text-white uppercase tracking-[0.22em] font-light leading-tight"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
              >
                Pasión por<br />el tatuaje
              </motion.h2>

              <div className="space-y-0">
                {[
                  {
                    num: "01",
                    title: "Diseños únicos",
                    body: "Cada tatuaje es personalizado, capturando historias personales en trazo fino y preciso.",
                  },
                  {
                    num: "02",
                    title: "Precisión técnica",
                    body: "Enric combina formación médica con dominio artístico en cada pieza. Siete años perfeccionando su técnica.",
                  },
                  {
                    num: "03",
                    title: "Conexión personal",
                    body: "Cada tatuaje refleja una colaboración profunda entre la visión del cliente y el criterio del artista.",
                  },
                ].map((item, i) => (
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
                  Reservar cita
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

            {/* Left — tall image */}
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
                alt="Dragón con flores — proyecto grande EFA Tattoo"
                objectPosition="62% 38%"
                scale={1.45}
              />
            </motion.div>

            {/* Right — content */}
            <div className="space-y-10 md:pt-10">
              <div className="space-y-6">
                <motion.p
                  {...fadeUp}
                  className="text-white/40 text-[0.7rem] tracking-[0.55em] uppercase"
                >
                  Transmitiendo conocimiento
                </motion.p>
                <motion.h2
                  {...fadeUp}
                  transition={{ duration: 0.65, delay: 0.1 }}
                  className="text-white uppercase tracking-[0.22em] font-light leading-tight"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.7rem, 3.5vw, 3.2rem)" }}
                >
                  Enseñando<br />a tatuar mejor
                </motion.h2>
              </div>

              <motion.div
                {...fadeUp}
                transition={{ duration: 0.65, delay: 0.15 }}
                className="space-y-5 text-white/65 text-sm leading-relaxed font-light tracking-wide max-w-[28rem]"
              >
                <p>
                  Desde el trabajo real en estudio hasta el método desarrollado en 7 años de práctica, Enric enseña con una sensibilidad profunda hacia el detalle, la higiene y la ética del tatuador.
                </p>
                <p>
                  Con Enric, los alumnos no aprenden a imitar: aprenden a construir su propio criterio, con bases sólidas y un método que funciona en la realidad del estudio.
                </p>
              </motion.div>

              {/* Animated taglines */}
              <div className="space-y-5 pt-2">
                {["La técnica salva.", "El método libera."].map((line, i) => (
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
                  Explorar academia
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
            Creemos algo juntos
          </h2>
          <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide">
            Ponte en contacto para comenzar tu proceso, ya sea a través de un tatuaje o de nuestros seminarios de formación.
          </p>
          <a
            href="mailto:info@efatatto.com"
            className="inline-block text-white text-xs tracking-[0.55em] uppercase border-b border-[#c9b99a] pb-[3px] hover:text-[#c9b99a] transition-colors duration-300"
          >
            Ponerse en contacto
          </a>
        </motion.div>
      </section>

    </div>
  );
}
