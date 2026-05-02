import { useState, type ChangeEvent, type FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";
import { FocusRail, type FocusRailItem } from "@/components/ui/focus-rail";

const ACADEMY_GALLERY_MEDIA = [
  {
    id: 1,
    mediaSrc: "/videos/academy/testimonio_1.mp4",
    mediaSrcMobile: "/videos/academy/testimonio_1.mobile.mp4",
    posterSrc: "/videos/academy/posters/testimonio_1.webp",
  },
  {
    id: 2,
    mediaSrc: "/videos/academy/testimonio_2.mp4",
    mediaSrcMobile: "/videos/academy/testimonio_2.mobile.mp4",
    posterSrc: "/videos/academy/posters/testimonio_2.webp",
  },
  {
    id: 3,
    mediaSrc: "/videos/academy/testimonio_3.mp4",
    mediaSrcMobile: "/videos/academy/testimonio_3.mobile.mp4",
    posterSrc: "/videos/academy/posters/testimonio_3.webp",
  },
  {
    id: 4,
    mediaSrc: "/videos/academy/testimonio_4.mp4",
    mediaSrcMobile: "/videos/academy/testimonio_4.mobile.mp4",
    posterSrc: "/videos/academy/posters/testimonio_4.webp",
  },
  {
    id: 5,
    mediaSrc: "/videos/academy/testimonio_5.mp4",
    mediaSrcMobile: "/videos/academy/testimonio_5.mobile.mp4",
    posterSrc: "/videos/academy/posters/testimonio_5.webp",
  }
] as const;

type TattooExperience = "" | "menos_6_meses" | "6_12_meses" | "mas_1_aÃ±o";
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
        style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2rem, 4.2vw, 4.3rem)" }}
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
            className={`flex-1 cursor-pointer border px-4 py-2.5 text-center transition-all duration-150 select-none ${checked
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
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const address = "Carrer CÃ²rsega 163, Barcelona";
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
              eyebrow={t("academy.locationEyebrow")}
              title={t("academy.locationTitle")}
              description={t("academy.locationDesc")}
            />
            <div className="space-y-4 text-white/66">
              <div className="border border-white/8 bg-black/15 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[#c9b99a]">
                  {t("academy.locationCity")}
                </p>
                <p className="mt-3 text-sm leading-relaxed tracking-wide">
                  {t("academy.locationAddress")}
                  <br />
                  {t("academy.locationDistrict")}
                </p>
              </div>
              <p className="border-l border-[#c9b99a]/35 pl-4 text-sm italic leading-relaxed tracking-wide">
                {t("academy.locationQuote")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={googleMapsNavigationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center border border-[#c9b99a] px-6 py-4 text-[0.72rem] uppercase tracking-[0.35em] text-[#c9b99a] transition-colors hover:bg-[#c9b99a] hover:text-[#141210]"
              >
                {t("academy.locationDirections")}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center border border-white/18 px-6 py-4 text-[0.72rem] uppercase tracking-[0.35em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                {copied ? t("academy.locationCopied") : t("academy.locationCopy")}
              </button>
            </div>
          </div>
          <div className="relative min-h-[340px] border-t border-white/8 lg:border-l lg:border-t-0">
            <iframe
              src="https://maps.google.com/maps?q=Carrer+C%C3%B2rsega+163,+Barcelona&t=&z=15&ie=UTF8&iwloc=&output=embed"
              title={`${t("academy.locationTitle")} â€” Barcelona`}
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AcademyFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");

  const experienceOptions: Option<TattooExperience>[] = [
    { value: "menos_6_meses", label: t("academy.expOpt1") },
    { value: "6_12_meses", label: t("academy.expOpt2") },
    { value: "mas_1_aÃ±o", label: t("academy.expOpt3") },
  ];

  const difficultyOptions: Option<MainDifficulty>[] = [
    { value: "trazo_limpio", label: t("academy.diffOpt1") },
    { value: "curacion_durabilidad", label: t("academy.diffOpt2") },
    { value: "seguridad_confianza", label: t("academy.diffOpt3") },
    { value: "conseguir_clientes", label: t("academy.diffOpt4") },
  ];

  const weekendOptions: Option<CanAttendWeekend>[] = [
    { value: "si", label: t("academy.weekendYes") },
    { value: "no", label: t("academy.weekendNo") },
  ];

  const budgetOptions: Option<BudgetRange>[] = [
    { value: "menos_1000", label: t("academy.budgetOpt1") },
    { value: "1000_1500", label: t("academy.budgetOpt2") },
    { value: "mas_1500", label: t("academy.budgetOpt3") },
  ];

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
          {t("academy.successLabel")}
        </p>
        <h3
          className="mt-4 text-white uppercase tracking-[0.16em] font-light"
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)" }}
        >
          {t("academy.successTitle")}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed tracking-wide text-white/58">
          {t("academy.successText")}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center border border-white/18 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.35em] text-white/65 transition-colors hover:border-white/35 hover:text-white"
        >
          {t("academy.successReset")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="academy-full-name" className={legendClass}>
          {t("academy.formName")}
        </label>
        <input
          id="academy-full-name"
          type="text"
          name="full_name"
          required
          value={formData.full_name}
          onChange={handleChange}
          placeholder={t("academy.formNamePlaceholder")}
          className={inputClass}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="academy-email" className={legendClass}>
            {t("academy.formEmail")}
          </label>
          <input
            id="academy-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder={t("academy.formEmailPlaceholder")}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="academy-phone" className={legendClass}>
            {t("academy.formPhone")}
          </label>
          <input
            id="academy-phone"
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("academy.formPhonePlaceholder")}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 !mt-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[0.58rem] uppercase tracking-[0.4em] text-white/24">
          {t("academy.formSituacion")}
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          id="academy-tattoo-experience"
          name="tattoo_experience"
          label={t("academy.formExperience")}
          value={formData.tattoo_experience}
          options={experienceOptions}
          placeholder={t("academy.formExperiencePlaceholder")}
          onChange={handleChange}
        />
        <SelectField
          id="academy-main-difficulty"
          name="main_difficulty"
          label={t("academy.formDifficulty")}
          value={formData.main_difficulty}
          options={difficultyOptions}
          placeholder={t("academy.formDifficultyPlaceholder")}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="academy-main-goal" className={legendClass}>
          {t("academy.formGoal")}
        </label>
        <textarea
          id="academy-main-goal"
          name="main_goal"
          rows={2}
          style={{ minHeight: "4.5rem" }}
          required
          value={formData.main_goal}
          onChange={handleChange}
          placeholder={t("academy.formGoalPlaceholder")}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-center gap-3 !mt-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-[0.58rem] uppercase tracking-[0.4em] text-white/24">
          {t("academy.formDisponibilidad")}
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="space-y-1.5">
          <label className={legendClass}>
            {t("academy.formWeekend")}
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
          label={t("academy.formBudget")}
          value={formData.budget_range}
          options={budgetOptions}
          placeholder={t("academy.formBudgetPlaceholder")}
          onChange={handleChange}
        />
      </div>

      {status === "error" && (
        <div className="border border-[#7a2f2a] bg-[#2c1513] px-4 py-3 text-xs leading-relaxed tracking-wide text-[#f0b1aa]">
          {t("academy.formError")}
        </div>
      )}

      <div className="!mt-4 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.65rem] leading-relaxed tracking-wide text-white/32">
          {t("academy.formConsent")}
        </p>
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center gap-2.5 border border-[#c9b99a] px-7 py-3 text-[0.72rem] uppercase tracking-[0.38em] text-[#c9b99a] transition-colors hover:bg-[#c9b99a] hover:text-[#141210] disabled:cursor-not-allowed disabled:opacity-70 whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin border border-current border-t-transparent" />
              {t("academy.formSubmitting")}
            </>
          ) : (
            t("academy.formSubmit")
          )}
        </button>
      </div>
    </form>
  );
}

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Seminario Fine Line EFA Tattoo",
  "description": "FormaciÃ³n intensiva presencial de 2 dÃ­as para tatuadores. LÃ­nea fina, microrealismo, prÃ¡ctica en piel real y profesionalizaciÃ³n.",
  "url": "https://www.efa-tattoo.com/academy",
  "provider": { "@type": "Organization", "name": "EFA Tattoo", "url": "https://www.efa-tattoo.com" },
  "courseMode": "onsite",
  "educationalLevel": "Advanced",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "onsite",
    "location": {
      "@type": "Place",
      "name": "EFA Tattoo Studio",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Carrer CÃ²rsega 163",
        "addressLocality": "Barcelona",
        "addressCountry": "ES"
      }
    }
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Â¿El seminario EFA es para principiantes?",
      "acceptedAnswer": { "@type": "Answer", "text": "No, requiere experiencia mÃ­nima. No es un curso de iniciaciÃ³n para aprender a tatuar desde cero." }
    },
    {
      "@type": "Question",
      "name": "Â¿TatÃºo en piel real durante el seminario?",
      "acceptedAnswer": { "@type": "Answer", "text": "SÃ­, todos los alumnos trabajan en modelo real el segundo dÃ­a bajo supervisiÃ³n directa de Enric." }
    },
    {
      "@type": "Question",
      "name": "Â¿Debo llevar mi propio material al seminario?",
      "acceptedAnswer": { "@type": "Answer", "text": "Solo necesitas llevar tu mÃ¡quina y fuente. El resto estÃ¡ incluido: fungibles y caja de agujas FineLine." }
    },
    {
      "@type": "Question",
      "name": "Â¿Se entrega certificado oficial al finalizar el seminario?",
      "acceptedAnswer": { "@type": "Answer", "text": "SÃ­, certificado oficial firmado por EFA Tattoo con reconocimiento de nivel profesional." }
    },
    {
      "@type": "Question",
      "name": "Â¿Tengo acceso al contenido del seminario despuÃ©s?",
      "acceptedAnswer": { "@type": "Answer", "text": "SÃ­, acceso indefinido a la grabaciÃ³n del contenido teÃ³rico." }
    }
  ]
};

export default function AcademyPage() {
  const { t } = useTranslation();

  const galleryTextItems = t("academy.galleryVideoItems", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    meta: string;
  }>;

  const academyGalleryItems: FocusRailItem[] = ACADEMY_GALLERY_MEDIA.map((media, index) => {
    const text = galleryTextItems[index];
    return {
      id: media.id,
      title: text?.title ?? `Video ${index + 1}`,
      description: text?.description ?? "",
      meta: text?.meta ?? "",
      mediaSrc: media.mediaSrc,
      mediaSrcMobile: media.mediaSrcMobile,
      posterSrc: media.posterSrc,
      mediaType: "video",
    };
  });

  const featureItems = t("academy.features", { returnObjects: true }) as Array<{ title: string; description: string }>;
  const day1Items = t("academy.day1Items", { returnObjects: true }) as string[];
  const day2Items = t("academy.day2Items", { returnObjects: true }) as string[];
  const studentProfileItems = t("academy.profileItems", { returnObjects: true }) as string[];
  const faqs = t("academy.faqs", { returnObjects: true }) as Array<{ question: string; answer: string }>;

  return (
    <div className="min-h-screen bg-[#141210] text-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <Header />

      {/* â”€â”€ Hero â”€â”€ */}
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
              {t("academy.heroEyebrow")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08 }}
              className="mx-auto mt-8 max-w-5xl uppercase font-light leading-[0.9] tracking-[0.14em] text-white"
              style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
            >
              {(t("academy.heroTitle") as string).split("\n").map((line: string, i: number, arr: string[]) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mx-auto mt-8 max-w-2xl text-sm leading-relaxed tracking-[0.08em] text-white/66 md:text-lg"
            >
              {t("academy.heroSubtitle")}
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
                {t("academy.heroCta")}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* â”€â”€ La propuesta â”€â”€ */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={`${sectionWidth} relative`}>
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-white/5 md:block" />
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              {...fadeUp}
              className="mx-auto h-16 w-px bg-gradient-to-b from-transparent via-[#c9b99a]/45 to-transparent"
            />
            <SectionHeading
              eyebrow={t("academy.proposalEyebrow")}
              title={t("academy.proposalTitle")}
              description={t("academy.proposalDesc")}
              align="center"
            />
            <motion.p
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="mx-auto mt-12 max-w-3xl text-xl font-light leading-relaxed tracking-wide text-white/84 md:text-2xl"
            >
              {t("academy.proposalQuote")}
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mx-auto mt-12 h-16 w-px bg-gradient-to-b from-[#c9b99a]/45 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* â”€â”€ Features â”€â”€ */}
      <section id="academy-info" className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow={t("academy.featuresEyebrow")}
            title={t("academy.featuresTitle")}
            description={t("academy.featuresDesc")}
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

      {/* â”€â”€ Day cards â”€â”€ */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#11100e" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow={t("academy.structureEyebrow")}
            title={t("academy.structureTitle")}
            description={t("academy.structureDesc")}
          />
          <div className="mt-12 grid grid-cols-1 gap-px bg-white/8 border border-white/8 lg:grid-cols-2" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
            <motion.article {...fadeUp} className="bg-[#171411] p-8 md:p-10">
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
                {t("academy.day1Label")}
              </p>
              <h3
                className="mt-5 text-white uppercase tracking-[0.16em] font-light"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                }}
              >
                {t("academy.day1Title")}
              </h3>
              <div className="mt-8">
                <BulletList items={day1Items} />
              </div>
              <p className="mt-8 border-t border-white/8 pt-6 text-sm italic tracking-wide text-white/72">
                {t("academy.day1Quote")}
              </p>
            </motion.article>
            <motion.article
              {...fadeUp}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="bg-[#171411] p-8 md:p-10"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
                {t("academy.day2Label")}
              </p>
              <h3
                className="mt-5 text-white uppercase tracking-[0.16em] font-light"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.7rem, 3vw, 2.8rem)",
                }}
              >
                {t("academy.day2Title")}
              </h3>
              <div className="mt-8">
                <BulletList items={day2Items} />
              </div>
              <p className="mt-8 border-t border-white/8 pt-6 text-sm italic tracking-wide text-white/72">
                {t("academy.day2Quote")}
              </p>
            </motion.article>
          </div>
        </div>
      </section>

      {/* â”€â”€ Student profile â”€â”€ */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#1a1714" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow={t("academy.profileEyebrow")}
            title={t("academy.profileTitle")}
            description={t("academy.profileDesc")}
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
              {t("academy.profileNote")}
            </p>
            <p className="mt-3">
              {t("academy.profileNoteText")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* â”€â”€ Contact / Form â”€â”€ */}
      <section
        id="academy-contact"
        className="py-8 md:py-10"
        style={{ backgroundColor: "#11100e" }}
      >
        <div className={sectionWidth}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 text-center">
              <p className="text-[0.68rem] uppercase tracking-[0.5em] text-[#c9b99a]">{t("academy.contactEyebrow")}</p>
              <h2
                className="mt-3 text-white uppercase tracking-[0.16em] font-light leading-[0.95]"
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                {t("academy.contactTitle")}
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

      {/* â”€â”€ Media Rail â”€â”€ */}
      <section className="bg-[#0A0A0A] py-16 md:py-20 border-t border-white/5">
        <div className="mb-10 text-center px-6">
          <p className="text-[0.68rem] uppercase tracking-[0.5em] text-[#c9b99a]">
            {t("academy.galleryEyebrow", "La Experiencia")}
          </p>
          <h2
            className="mt-3 text-white uppercase tracking-[0.16em] font-light leading-[0.95]"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            {t("academy.galleryTitle", "Dentro del Seminario")}
          </h2>
        </div>
        <FocusRail
          items={academyGalleryItems}
          loop={true}
          className="max-w-[1920px] mx-auto !h-[650px]"
        />
      </section>

      <LocationCard />

      {/* â”€â”€ FAQ â”€â”€ */}
      <section className="py-18 md:py-24" style={{ backgroundColor: "#141210" }}>
        <div className={sectionWidth}>
          <SectionHeading
            eyebrow={t("academy.faqEyebrow")}
            title={t("academy.faqTitle")}
            description={t("academy.faqDesc")}
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

      {/* ============================================================
          SHADOW CONTENT â€” Testimonios Academy
          Para activar: cambiar `hidden` por el layout deseado
          ============================================================ */}

      {/*
      const ACADEMY_TESTIMONIALS = [
        {
          id: 1,
          name: "Laura M.",
          rating: 5,
          text: "El curso cambiÃ³ completamente mi forma de entender el fine line. Grupos pequeÃ±os, mucha prÃ¡ctica real.",
        },
        {
          id: 2,
          name: "Carlos R.",
          rating: 5,
          text: "Vine sin experiencia y salÃ­ con tÃ©cnica y confianza. La atenciÃ³n personalizada marcÃ³ la diferencia.",
        },
        {
          id: 3,
          name: "SofÃ­a D.",
          rating: 5,
          text: "AprendÃ­ mÃ¡s en un fin de semana que en meses por mi cuenta. Totalmente recomendado.",
        },
      ];

      function AcademyTestimonials() {
        return (
          <div style={{ display: "none" }} aria-hidden="true">
            {ACADEMY_TESTIMONIALS.map((t) => (
              <div key={t.id}>
                <p>{t.name}</p>
                <p>{"â˜…".repeat(t.rating)}</p>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        );
      }
      */}
    </div>
  );
}

