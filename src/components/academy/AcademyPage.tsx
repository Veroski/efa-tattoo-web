import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";

// ── Shared ──────────────────────────────────────────────────────────────────

function Img({ height, bg = "#1e1c1a" }: { height: string; bg?: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height, backgroundColor: bg }}>
      <div className="absolute inset-0 border border-white/5" />
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

// ── Accordion ────────────────────────────────────────────────────────────────

function Accordion({ items }: { items: { q: string; a: string; bg?: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={item.q} className="border-t border-white/10">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-6 text-left gap-6 group"
            aria-expanded={open === i}
          >
            <span className="text-white text-xs tracking-[0.25em] uppercase font-light group-hover:text-[#c9b99a] transition-colors">
              {item.q}
            </span>
            <span
              className="text-white/50 text-base flex-shrink-0 transition-transform duration-300"
              aria-hidden="true"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
                  <p className="text-white/65 text-sm leading-relaxed font-light tracking-wide">
                    {item.a}
                  </p>
                  {item.bg && <Img height="220px" bg={item.bg} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="border-t border-white/10" />
    </div>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────

type FormState = {
  name: string; email: string; motivation: string;
  specialty: string; city: string; availability: string;
  level: string; extra: string;
};

const initialForm: FormState = {
  name: "", email: "", motivation: "", specialty: "",
  city: "", availability: "", level: "", extra: "",
};

const fieldClass =
  "w-full bg-transparent border-b border-white/25 text-white text-sm py-3 outline-none " +
  "focus:border-[#c9b99a] transition-colors placeholder:text-white/35 tracking-wide";

const selClass =
  "w-full bg-[#1a1814] border-b border-white/25 text-white/65 text-sm py-3 outline-none " +
  "focus:border-[#c9b99a] transition-colors tracking-wide appearance-none cursor-pointer";

const labelClass = "block text-white/60 text-[0.7rem] tracking-[0.35em] uppercase mb-1";

function SelectChevron() {
  return (
    <svg
      className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      aria-hidden="true"
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EnrollmentForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sent, setSent] = useState(false);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  if (sent) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-[#c9b99a] text-xs tracking-[0.45em] uppercase">Solicitud recibida</p>
        <p className="text-white/60 text-sm font-light leading-relaxed">
          ¡Gracias! Te responderemos en los próximos días con disponibilidad y detalles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-7" noValidate>
      <div>
        <label htmlFor="acad-name" className={labelClass}>Nombre</label>
        <input id="acad-name" type="text" required placeholder="Tu nombre" value={form.name} onChange={set("name")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="acad-email" className={labelClass}>Email</label>
        <input id="acad-email" type="email" required placeholder="tu@email.com" value={form.email} onChange={set("email")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="acad-motivation" className={labelClass}>Motivación</label>
        <textarea
          id="acad-motivation"
          required rows={3}
          placeholder="¿Por qué quieres unirte a la academia? Cuéntame tu motivación."
          value={form.motivation} onChange={set("motivation")}
          className={`${fieldClass} resize-none`}
        />
      </div>
      <div>
        <label htmlFor="acad-specialty" className={labelClass}>Especialidad actual (opcional)</label>
        <input id="acad-specialty" type="text" placeholder="Ej. fine line, black & grey…" value={form.specialty} onChange={set("specialty")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="acad-city" className={labelClass}>Ciudad de preferencia</label>
        <input id="acad-city" type="text" required placeholder="Ciudad de interés para el seminario" value={form.city} onChange={set("city")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="acad-availability" className={labelClass}>Disponibilidad</label>
        <input id="acad-availability" type="text" required placeholder="Días y horarios posibles" value={form.availability} onChange={set("availability")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="acad-level" className={labelClass}>Nivel de experiencia</label>
        <div className="relative">
          <select id="acad-level" required value={form.level} onChange={set("level")} className={selClass}>
            <option value="" disabled>Seleccionar</option>
            <option>Principiante (menos de 1 año)</option>
            <option>Intermedio (1–3 años)</option>
            <option>Avanzado (más de 3 años)</option>
          </select>
          <SelectChevron />
        </div>
      </div>
      <div>
        <label htmlFor="acad-extra" className={labelClass}>Información adicional (opcional)</label>
        <input id="acad-extra" type="text" placeholder="Alergias, necesidades especiales u otra información" value={form.extra} onChange={set("extra")} className={fieldClass} />
      </div>

      <button
        type="submit"
        className="w-full border border-white/25 text-white text-xs tracking-[0.5em] uppercase py-4 hover:bg-white hover:text-[#1a1814] transition-colors duration-300"
      >
        Enviar solicitud
      </button>
      <p className="text-white/40 text-[0.65rem] tracking-wide text-center leading-relaxed">
        Enviar este formulario no confirma tu plaza. Recibirás confirmación y detalles de pago por email.
      </p>
    </form>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const howItWorks = [
  {
    q: "¿Cómo es el proceso del seminario?",
    a: "El seminario comienza con fundamentos teóricos del trazo fino: profundidad, saturación y ángulo. Luego pasamos a práctica intensiva en piel artificial y, en la sesión final, trabajamos sobre piel real bajo la supervisión directa de Enric.",
    bg: "#242120",
  },
  {
    q: "¿Qué nivel necesito para unirme?",
    a: "El seminario está diseñado para artistas que ya tatúan y quieren mejorar su técnica de línea fina. No es necesario un nivel avanzado, pero sí tener experiencia básica con la máquina. Si tienes dudas, escríbenos antes de solicitar tu plaza.",
    bg: "#1e1d1b",
  },
  {
    q: "¿Cómo me preparo para el seminario?",
    a: "Descansa bien, lleva ropa cómoda y trae tus propias agujas si ya tienes preferencia de marca. Te enviaremos una guía completa de materiales por email una semana antes del seminario.",
    bg: "#28251f",
  },
];

const faqs = [
  {
    q: "¿Cómo reservo mi plaza en el seminario?",
    a: "Rellena el formulario de solicitud con tu motivación, ciudad preferida y disponibilidad. También puedes escribirnos directamente a info@efatatto.com con los mismos datos. Te responderemos en los próximos días con disponibilidad y precio.",
  },
  {
    q: "¿Cuánto cuesta el seminario y qué incluye?",
    a: "El precio varía según la ciudad y el formato (presencial o intensivo). El coste medio por seminario presencial es de 350 €, e incluye todo el material didáctico, acceso al grupo privado de alumnos y seguimiento de 3 meses post-seminario. Se requiere un depósito no reembolsable de 80 € para confirmar la plaza, descontado del precio final.",
  },
  {
    q: "¿Qué pasa si necesito cancelar mi plaza?",
    a: "El depósito no es reembolsable. En caso de imprevisto, podemos reagendar tu plaza una vez con un mínimo de 7 días de antelación. Pasado ese plazo, la plaza se libera sin devolución.",
  },
  {
    q: "¿Qué pasa el día del seminario?",
    a: "Intenta llegar puntual. La parte teórica ocupa las primeras horas, seguida de práctica en piel artificial. Si el seminario incluye sesión en piel real, se realizará bajo supervisión estricta. Aceptamos pago en efectivo o transferencia bancaria.",
  },
  {
    q: "¿Puedo asistir si tengo alergia a los materiales?",
    a: "Infórmanos de cualquier alergia o sensibilidad antes del seminario. Lo trataremos en el formulario de solicitud y, si es necesario, lo consultaremos contigo antes de confirmar tu plaza.",
  },
];

const steps = [
  {
    n: "1",
    title: "Material y metodología",
    body: "Accedes a todo el material del seminario, protocolos, fichas de práctica y guías de ejecución para seguir mejorando de forma autónoma.",
  },
  {
    n: "2",
    title: "Trazo real",
    body: "Practicarás en piel artificial durante las sesiones intensivas y, en la sesión final, ejecutarás trazo real sobre piel bajo supervisión directa de Enric.",
  },
  {
    n: "3",
    title: "Comunidad y seguimiento",
    body: "Formarás parte del grupo privado de alumnos EFA con acceso directo a consultas y revisión de trabajos durante 3 meses post-seminario.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AcademyPage() {
  return (
    <div className="bg-[#1a1814] min-h-screen text-white">
      <Header />

      {/* ─── 1. HERO ─── */}
      <section
        className="relative w-full flex flex-col items-center justify-center text-center py-32 md:py-44 overflow-hidden"
        style={{ backgroundColor: "#141210" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
        <div className="relative z-10 space-y-5 px-[4vw]">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-white uppercase tracking-[0.3em] font-light leading-none"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            Academia
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-[#c9b99a] uppercase tracking-[0.3em] font-light"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.4rem)" }}
          >
            Seminario EFA 2026
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/55 text-xs tracking-[0.5em] uppercase"
          >
            Madrid · Barcelona · Valencia · Online
          </motion.p>
        </div>
      </section>

      {/* ─── 2. CÓMO FUNCIONA ─── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#141210" }}>
        <div className="px-[4vw] max-w-[1500px] mx-auto space-y-12">
          <motion.div {...fadeUp} className="space-y-5 max-w-2xl">
            <h2
              className="text-white uppercase tracking-[0.22em] font-light"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Cómo funciona
            </h2>
            <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide">
              Cada seminario comienza con tu idea y tu nivel actual. Trabajaremos juntos la técnica desde la base, y crearás trazo real desde el primer día. Una vez confirmada tu plaza, recibirás todo lo que necesitas para prepararte.
            </p>
          </motion.div>
          <Accordion items={howItWorks} />
        </div>
      </section>

      {/* ─── 3. LO QUE TE LLEVAS ─── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#1a1814" }}>
        <div className="px-[4vw] max-w-[1500px] mx-auto space-y-12">
          <motion.div {...fadeUp} className="space-y-5">
            <h2
              className="text-white uppercase tracking-[0.22em] font-light"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Lo que te llevas
            </h2>
            <p className="text-white/60 text-sm leading-relaxed font-light tracking-wide max-w-2xl">
              La formación no termina cuando sales del seminario. Estos son los recursos y habilidades que adquieres:
            </p>
          </motion.div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="grid grid-cols-1 md:grid-cols-[3rem_1fr_1fr] gap-6 md:gap-10 border-t border-white/10 py-10 items-start"
              >
                <span
                  className="text-[#c9b99a] font-light"
                  style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem" }}
                  aria-hidden="true"
                >
                  {step.n}.
                </span>
                <h3 className="text-white text-xs tracking-[0.35em] uppercase font-medium pt-1">
                  {step.title}
                </h3>
                <p className="text-white/65 text-sm leading-relaxed font-light tracking-wide">
                  {step.body}
                </p>
              </motion.div>
            ))}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </section>

      {/* ─── 4. FAQs ─── */}
      <section className="py-16 md:py-24" style={{ backgroundColor: "#141210" }}>
        <div className="px-[4vw] max-w-[1500px] mx-auto space-y-12">
          <motion.h2
            {...fadeUp}
            className="text-white uppercase tracking-[0.22em] font-light"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
          >
            Preguntas frecuentes
          </motion.h2>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ─── 5. SOLICITUD DE PLAZA (moved to bottom) ─── */}
      <section className="px-[4vw] py-20" style={{ backgroundColor: "#1a1814" }}>
        <motion.div {...fadeUp} className="max-w-2xl mx-auto space-y-10">
          <div className="space-y-3">
            <p className="text-white/45 text-[0.7rem] tracking-[0.6em] uppercase">Solicitud de plaza</p>
            <h2
              className="text-white uppercase tracking-[0.22em] font-light"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
            >
              Reserva tu seminario
            </h2>
            <p className="text-white/55 text-sm leading-relaxed font-light">
              Una vez revisada tu solicitud, te contactaremos con disponibilidad, precio y detalles de confirmación.
            </p>
          </div>
          <EnrollmentForm />
        </motion.div>
      </section>

      <FooterStrip />
    </div>
  );
}
