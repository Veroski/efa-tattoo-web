import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";

type TattooExperience = "" | "menos_6_meses" | "6_12_meses" | "mas_1_año";
type MainDifficulty =
  | ""
  | "trazo_limpio"
  | "curacion_durabilidad"
  | "seguridad_confianza"
  | "conseguir_clientes";
type CanAttendWeekend = "" | "si" | "no";
type BudgetRange = "" | "menos_1000" | "1000_1500" | "mas_1500";
type FormStatus = "idle" | "loading" | "success" | "error";

type AcademyFormData = {
  full_name: string;
  email: string;
  phone: string;
  tattoo_experience: TattooExperience;
  main_difficulty: MainDifficulty;
  main_goal: string;
  can_attend_weekend: CanAttendWeekend;
  budget_range: BudgetRange;
};

type Option<T extends string> = { value: T; label: string };

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: "easeOut" as const },
};

const initialForm: AcademyFormData = {
  full_name: "",
  email: "",
  phone: "",
  tattoo_experience: "",
  main_difficulty: "",
  main_goal: "",
  can_attend_weekend: "",
  budget_range: "",
};

const experienceOptions: Option<TattooExperience>[] = [
  { value: "menos_6_meses", label: "Menos de 6 meses" },
  { value: "6_12_meses", label: "6–12 meses" },
  { value: "mas_1_año", label: "+1 año" },
];

const difficultyOptions: Option<MainDifficulty>[] = [
  { value: "trazo_limpio", label: "Trazo limpio" },
  { value: "curacion_durabilidad", label: "Curación / durabilidad" },
  { value: "seguridad_confianza", label: "Seguridad y confianza" },
  { value: "conseguir_clientes", label: "Conseguir clientes" },
];

const weekendOptions: Option<CanAttendWeekend>[] = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

const budgetOptions: Option<BudgetRange>[] = [
  { value: "menos_1000", label: "Menos de 1.000€" },
  { value: "1000_1500", label: "1.000€ – 1.500€" },
  { value: "mas_1500", label: "Más de 1.500€" },
];

const featureItems = [
  {
    title: "Grupos reducidos",
    description:
      "Máximo 4 alumnos por edición para garantizar una enseñanza 100% personalizada.",
  },
  {
    title: "Práctica supervisada",
    description:
      "Seguimiento individual durante toda la práctica. No estarás solo en ningún momento.",
  },
  {
    title: "Material incluido",
    description:
      "Dossier teórico completo, materiales fungibles para la práctica y caja de agujas FineLine.",
  },
  {
    title: "EFA Close System",
    description:
      "Guía profesional de cierres de venta. Cómo asesorar, dar precio y cerrar tatuajes sin inseguridad.",
  },
  {
    title: "Marketing masterclass",
    description:
      "Optimización de Instagram y sistema profesional de captación con acceso indefinido.",
  },
  {
    title: "Certificado oficial",
    description:
      "Reconocimiento real de nivel profesional avalado por EFA Tattoo.",
  },
];

const dayOneItems = [
  "Objetivos: dominio del 1RL en línea, sombra y relleno, entendiendo la cicatrización.",
  "Set-up, tipos de agujas, tintas y organización profesional del área.",
  "Ajuste de voltaje y stroke.",
  "Línea construida: movimiento pendular, tensión y respiración.",
  "Sombras y relleno con 1RL.",
  "Demo en piel real.",
  "Cuidados y curación.",
];

const dayTwoItems = [
  "Práctica en modelo real.",
  "Corrección personalizada y análisis final.",
  "Optimización de tu perfil de Instagram.",
];

const studentProfileItems = [
  "Tienen experiencia mínima. No es un curso de iniciación.",
  "Quieren dominar la línea fina con criterios reales y técnicos.",
  "Buscan corregir errores recurrentes y elevar su precisión.",
  "Desean aprender técnica aplicada directamente en piel real.",
  "Quieren subir precios y cerrar ventas con más seguridad.",
  "Buscan generar contenido profesional para su portfolio.",
  "Necesitan una metodología clara, paso a paso y aplicable.",
];

const faqs = [
  {
    question: "¿Es para principiantes?",
    answer: "No, requiere experiencia mínima.",
  },
  {
    question: "¿Tatúo sí o sí?",
    answer: "Sí, todos los alumnos trabajan en modelo real.",
  },
  {
    question: "¿Debo llevar mi material?",
    answer: "Solo máquina y fuente. El resto lo incluye el estudio.",
  },
  {
    question: "¿Se entrega certificado?",
    answer: "Sí, firmado por EFA Tattoo.",
  },
  {
    question: "¿Puedo acceder al contenido después?",
    answer: "Sí, acceso indefinido a la grabación.",
  },
];

const sectionWidth = "px-[4vw] max-w-[1500px] mx-auto";
const inputClass =
  "w-full border border-white/12 bg-[#161311] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#c9b99a]/65";
const legendClass =
  "mb-1.5 block text-[0.65rem] uppercase tracking-[0.3em] text-white/60";

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`space-y-4 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
    >
      {eyebrow && (
        <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-white uppercase tracking-[0.18em] font-light leading-[0.95]"
        style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4.2vw, 4.3rem)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-sm leading-relaxed tracking-wide text-white/62 md:text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed tracking-wide text-white/72 md:text-base"
        >
          <span
            className="mt-[0.35rem] h-[5px] w-[5px] flex-shrink-0 bg-[#c9b99a]"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SelectChevron() {
  return (
    <svg
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/34"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 4L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SelectField<T extends string>({
  id,
  name,
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  id: string;
  name: keyof AcademyFormData;
  label: string;
  value: T;
  options: Option<T>[];
  placeholder: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={legendClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`${inputClass} appearance-none pr-11 text-white/78`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <SelectChevron />
      </div>
    </div>
  );
}

function SegmentedChoices<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: keyof AcademyFormData;
  value: T;
  options: Option<T>[];
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={`flex-1 cursor-pointer border px-4 py-2.5 text-center transition-all duration-150 select-none ${
              checked
                ? "border-[#c9b99a] bg-[#c9b99a]/12 text-white"
                : "border-white/18 bg-white/4 text-white/55 hover:border-white/35 hover:bg-white/8 hover:text-white/80"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={onChange}
              required
              className="sr-only"
            />
            <span className="block text-[0.72rem] uppercase tracking-[0.3em]">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function LocationCard() {
  const [copied, setCopied] = useState(false);
  const address = "Carrer Còrsega 167, Barcelona";
  const googleMapsNavigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="py-18 md:py-24" style={{ backgroundColor: "#161311" }}>
      <div className={sectionWidth}>
        <div className="grid overflow-hidden border border-white/8 bg-[#1d1916] lg:grid-cols-[0.95fr_1.25fr]">
          <div className="space-y-8 p-8 md:p-12">
            <SectionHeading
              eyebrow="El espacio"
              title="EFA Tattoo Studio"
              description="Un espacio creativo diseñado para la concentración, la precisión técnica y el trabajo profesional durante todo el fin de semana."
            />
            <div className="space-y-4 text-white/66">
              <div className="border border-white/8 bg-black/15 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[#c9b99a]">
                  Barcelona, España
                </p>
                <p className="mt-3 text-sm leading-relaxed tracking-wide">
                  Carrer Còrsega 167
                  <br />
                  L&apos;Eixample, Barcelona
                </p>
              </div>
              <p className="border-l border-[#c9b99a]/35 pl-4 text-sm italic leading-relaxed tracking-wide">
                "Un espacio creativo diseñado para la inspiración, con
                iluminación cuidada y equipamiento de primer nivel."
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={googleMapsNavigationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-[#c9b99a] px-6 py-4 text-[0.72rem] uppercase tracking-[0.35em] text-[#c9b99a] transition-colors hover:bg-[#c9b99a] hover:text-[#141210]"
              >
                Cómo llegar
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center border border-white/18 px-6 py-4 text-[0.72rem] uppercase tracking-[0.35em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                {copied ? "Copiado" : "Copiar dirección"}
              </button>
            </div>
          </div>
          <div className="relative min-h-[340px] border-t border-white/8 lg:border-l lg:border-t-0">
            <iframe
              src="https://maps.google.com/maps?q=Carrer+C%C3%B2rsega+167,+Barcelona&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title="Mapa ubicación EFA Tattoo Studio"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: "grayscale(100%) contrast(1.05) brightness(0.88)" }}
            />
            <div className="absolute bottom-4 right-4 border border-white/12 bg-[#141210]/85 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-white/72 backdrop-blur">
              L&apos;Eixample
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AcademyForm() {
  const [formData, setFormData] = useState<AcademyFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/ghl/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setFormData(initialForm);
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="py-12 text-center">
        <p className="text-[0.68rem] uppercase tracking-[0.45em] text-[#c9b99a]">
          Solicitud recibida
        </p>
        <h3
          className="mt-4 text-white uppercase tracking-[0.16em] font-light"
          style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)" }}
        >
          Gracias por tu interés
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed tracking-wide text-white/58">
          Te contactaremos con la información sobre fechas, precios y disponibilidad.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center border border-white/18 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.35em] text-white/65 transition-colors hover:border-white/35 hover:text-white"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">

      {/* Row 1: Nombre */}
      <div className="space-y-1.5">
        <label htmlFor="academy-full-name" className={legendClass}>
          Nombre y apellidos
        </label>
        <input
          id="academy-full-name"
          type="text"
          name="full_name"
          required
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Nombre Apellidos"
          className={inputClass}
        />
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="academy-email" className={legendClass}>
            Correo electrónico
          </label>
          <input
            id="academy-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="academy-phone" className={legendClass}>
            Teléfono (WhatsApp)
          </label>
          <input
            id="academy-phone"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="+34 600 000 000"
            className={inputClass}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 !mt-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[0.58rem] uppercase tracking-[0.4em] text-white/24">
          Tu situación
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      {/* Row 3: Experiencia + Dificultad */}
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          id="academy-tattoo-experience"
          name="tattoo_experience"
          label="Tiempo tatuando"
          value={formData.tattoo_experience}
          options={experienceOptions}
          placeholder="Selecciona..."
          onChange={handleChange}
        />
        <SelectField
          id="academy-main-difficulty"
          name="main_difficulty"
          label="Principal dificultad"
          value={formData.main_difficulty}
          options={difficultyOptions}
          placeholder="Selecciona..."
          onChange={handleChange}
        />
      </div>

      {/* Row 4: Objetivo */}
      <div className="space-y-1.5">
        <label htmlFor="academy-main-goal" className={legendClass}>
          ¿Qué quieres mejorar con el seminario?
        </label>
        <textarea
          id="academy-main-goal"
          name="main_goal"
          rows={2}
          style={{ minHeight: "4.5rem" }}
          required
          value={formData.main_goal}
          onChange={handleChange}
          placeholder="Mejorar la limpieza de mis líneas y ganar seguridad para cobrar más."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 !mt-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[0.58rem] uppercase tracking-[0.4em] text-white/24">
          Disponibilidad
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      {/* Row 5: Weekend + Budget */}
      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="space-y-1.5">
          <label className={legendClass}>
            ¿Puedes asistir un fin de semana en Barcelona?
          </label>
          <SegmentedChoices
            name="can_attend_weekend"
            value={formData.can_attend_weekend}
            options={weekendOptions}
            onChange={handleChange}
          />
        </div>
        <SelectField
          id="academy-budget-range"
          name="budget_range"
          label="¿Cuánto estás dispuesto a invertir?"
          value={formData.budget_range}
          options={budgetOptions}
          placeholder="Selecciona tu rango"
          onChange={handleChange}
        />
      </div>

      {status === "error" && (
        <div className="border border-[#7a2f2a] bg-[#2c1513] px-4 py-3 text-xs leading-relaxed tracking-wide text-[#f0b1aa]">
          Error al enviar. Inténtalo de nuevo o escríbenos por Instagram.
        </div>
      )}

      {/* Submit */}
      <div className="!mt-4 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.65rem] leading-relaxed tracking-wide text-white/32">
          Al enviar, aceptas ser contactado sobre el seminario.
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2.5 border border-[#c9b99a] px-7 py-3 text-[0.72rem] uppercase tracking-[0.38em] text-[#c9b99a] transition-colors hover:bg-[#c9b99a] hover:text-[#141210] disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
              Enviando...
            </>
          ) : (
            "Solicitar información"
          )}
        </button>
      </div>
    </form>
  );
}

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#141210] text-white">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#141210]">
        <div className="absolute inset-0">
          <img
            src="/img/img_1.webp"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_68%] brightness-[0.22] grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,0.58)_0%,rgba(20,18,16,0.82)_60%,#141210_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_45%_at_50%_36%,rgba(201,185,154,0.08)_0%,transparent_72%)]" />
        </div>
        <div className="relative z-10 flex min-h-screen items-center">
          <div className={`${sectionWidth} w-full py-32 text-center md:py-40`}>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[0.72rem] uppercase tracking-[0.55em] text-[#c9b99a]"
            >
              Seminario EFA Tattoo
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="mx-auto mt-8 max-w-5xl uppercase font-light leading-[0.9] tracking-[0.14em] text-white"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
            >
              Seminarios
              <br />
              Línea Fina
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed tracking-[0.08em] text-white/66 md:text-lg"
            >
              Formación intensiva presencial para perfeccionar tu técnica,
              elevar tu criterio profesional y mejorar cómo entiendes la piel.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12"
            >
              <a
                href="#academy-contact"
                className="inline-flex items-center justify-center border border-[#c9b99a] px-10 py-4 text-[0.76rem] uppercase tracking-[0.42em] text-[#c9b99a] transition-colors hover:bg-[#c9b99a] hover:text-[#141210]"
              >
                Más información
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── La propuesta ── */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={`${sectionWidth} relative`}>
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/5 md:block" />
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              {...fadeUp}
              className="mx-auto h-16 w-px bg-gradient-to-b from-transparent via-[#c9b99a]/45 to-transparent"
            />
            <SectionHeading
              eyebrow="La propuesta"
              title="Un programa intensivo de dos días"
              description="Diseñado para tatuadores que ya no buscan trucos, sino criterio profesional. El objetivo no es solo perfeccionar tu línea fina o elevar tu precisión. El objetivo es cambiar cómo entiendes la piel para mejorar tu posicionamiento como artista."
              align="center"
            />
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mx-auto mt-12 max-w-3xl text-xl font-light leading-relaxed tracking-wide text-white/84 md:text-2xl"
            >
              "No es un curso más. Es un sistema para transformar tu forma de
              trabajar."
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-12 h-16 w-px bg-gradient-to-b from-[#c9b99a]/45 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="academy-info" className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow="La formación"
            title="Formación de alto nivel"
            description="Una experiencia intensiva presencial impartida por Enric, diseñada para eliminar vicios, perfeccionar tu línea fina y profesionalizar tu negocio."
          />
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 border border-white/8 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((item, index) => (
              <motion.article
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="bg-[#141210] p-7"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#c9b99a]/30 bg-[#201b17] text-[#c9b99a]">
                  <span className="text-sm font-light">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-sm uppercase tracking-[0.28em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed tracking-wide text-white/60">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Day cards ── */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#11100e" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow="Estructura"
            title="Formación intensiva de 2 días"
            description="Contenido técnico, demo y aplicación práctica de todo lo aprendido en una estructura pensada para fijar criterio, no solo acumular información."
          />
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 border border-white/8 lg:grid-cols-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <motion.article {...fadeUp} className="bg-[#171411] p-8 md:p-10">
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
                Día 1 · Teoría &amp; Demo
              </p>
              <h3
                className="mt-5 text-white uppercase tracking-[0.16em] font-light"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                }}
              >
                Contenido técnico y demostración
              </h3>
              <div className="mt-8">
                <BulletList items={dayOneItems} />
              </div>
              <p className="mt-8 border-t border-white/8 pt-6 text-sm italic tracking-wide text-white/72">
                "Entender el porqué de cada movimiento antes de tocar la piel."
              </p>
            </motion.article>
            <motion.article
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="bg-[#171411] p-8 md:p-10"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
                Día 2 · Práctica real
              </p>
              <h3
                className="mt-5 text-white uppercase tracking-[0.16em] font-light"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                }}
              >
                Aplicación práctica de todo lo aprendido
              </h3>
              <div className="mt-8">
                <BulletList items={dayTwoItems} />
              </div>
              <p className="mt-8 border-t border-white/8 pt-6 text-sm italic tracking-wide text-white/72">
                "El fine line es un entrenamiento mental más que físico."
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* ── Student profile ── */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow="Perfil del alumno"
            title="Este seminario es para tatuadores que..."
            description="No buscamos cantidad, buscamos calidad. Este programa está diseñado para artistas con base que quieren profesionalizar de verdad su técnica y su criterio."
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 border border-white/8 md:grid-cols-2">
            {studentProfileItems.map((item, index) => (
              <motion.div
                key={item}
                {...fadeUp}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="flex items-start gap-4 bg-[#141210] p-6 text-sm leading-relaxed tracking-wide text-white/68"
              >
                <span className="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center border border-[#c9b99a]/30 text-[0.62rem] text-[#c9b99a]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="pt-0.5">{item}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mx-auto mt-8 max-w-3xl border border-white/8 bg-[#141210] px-7 py-6 text-sm leading-relaxed tracking-wide text-white/58"
          >
            <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#c9b99a]">
              Nota importante
            </p>
            <p className="mt-3">
              Este no es un curso para aprender a tatuar desde cero. Es una
              especialización avanzada para optimizar tu técnica. Si nunca has
              cogido una máquina, este no es el curso adecuado para ti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact / Form ── */}
      <section
        id="academy-contact"
        className="py-8 md:py-10"
        style={{ backgroundColor: "#11100e" }}
      >
        <div className={sectionWidth}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 text-center">
              <p className="text-[0.68rem] uppercase tracking-[0.5em] text-[#c9b99a]">Solicitud</p>
              <h2
                className="mt-3 text-white uppercase tracking-[0.16em] font-light leading-[0.95]"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                ¿Te interesa el seminario?
              </h2>
            </div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative border border-white/8 bg-[#141210] p-5 md:p-6"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_8%_8%,rgba(201,185,154,0.06)_0%,transparent_70%)]" />
              <div className="relative">
                <AcademyForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <LocationCard />

      {/* ── FAQ ── */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#141210" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow="FAQ"
            title="Preguntas frecuentes"
            description="Todo lo que necesitas saber antes de asegurar tu plaza."
            align="center"
          />
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 border border-white/8 md:grid-cols-2">
            {faqs.map((item, index) => (
              <motion.article
                key={item.question}
                {...fadeUp}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="bg-[#1a1714] p-6"
              >
                <h3 className="text-sm uppercase tracking-[0.24em] text-white">
                  {item.question}
                </h3>
                <p className="mt-4 text-sm leading-relaxed tracking-wide text-white/62">
                  {item.answer}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <FooterStrip />
    </div>
  );
}
