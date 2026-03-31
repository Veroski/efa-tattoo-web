import { useState } from "react";
import SectionLabel from "@/components/shared/SectionLabel";

interface BookingFormState {
  name: string;
  email: string;
  placement: string;
  style: string;
  size: string;
  message: string;
}

const initial: BookingFormState = {
  name: "", email: "", placement: "", style: "", size: "", message: "",
};

const inputClass =
  "w-full bg-transparent border-b border-white/25 text-white text-sm py-3 outline-none " +
  "focus:border-[#c9b99a] transition-colors placeholder:text-white/35 tracking-wide";

const selectClass =
  "w-full bg-[#1a1814] border-b border-white/25 text-white/70 text-sm py-3 outline-none " +
  "focus:border-[#c9b99a] transition-colors tracking-wide appearance-none";

const labelClass = "block text-white/60 text-[0.7rem] tracking-[0.35em] uppercase mb-1";

// Chevron SVG for select elements
function SelectChevron() {
  return (
    <svg
      className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookingSection() {
  const [form, setForm] = useState<BookingFormState>(initial);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof BookingFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="booking" className="px-[4vw] py-16 max-w-xl mx-auto scroll-mt-24">
      {/* Info strip */}
      <dl className="grid grid-cols-2 gap-6 mb-14 border border-white/10 p-6">
        {[
          { label: "Tiempo de respuesta", value: "3–5 días laborables" },
          { label: "Depósito",            value: "Requerido al reservar" },
          { label: "Consulta previa",     value: "Por email, gratuita"  },
          { label: "Tamaño mínimo",       value: "2 cm"                 },
        ].map((info) => (
          <div key={info.label}>
            <dt className="text-white/55 text-[0.7rem] tracking-[0.4em] uppercase mb-1">
              {info.label}
            </dt>
            <dd className="text-white/80 text-sm tracking-wide">{info.value}</dd>
          </div>
        ))}
      </dl>

      <SectionLabel text="Solicitar sesión" className="mb-10" />

      {submitted ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-[#c9b99a] text-xs tracking-[0.4em] uppercase">
            Solicitud recibida
          </p>
          <p className="text-white/60 text-sm tracking-wide font-light">
            Me pondré en contacto contigo en 3–5 días laborables.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          <div>
            <label htmlFor="booking-name" className={labelClass}>Nombre completo</label>
            <input
              id="booking-name"
              type="text"
              required
              placeholder="Tu nombre"
              value={form.name}
              onChange={set("name")}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="booking-email" className={labelClass}>Correo electrónico</label>
            <input
              id="booking-email"
              type="email"
              required
              placeholder="tu@email.com"
              value={form.email}
              onChange={set("email")}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="booking-placement" className={labelClass}>Zona del cuerpo</label>
            <input
              id="booking-placement"
              type="text"
              required
              placeholder="Ej. antebrazo interior"
              value={form.placement}
              onChange={set("placement")}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="booking-style" className={labelClass}>Estilo</label>
              <div className="relative">
                <select
                  id="booking-style"
                  required
                  value={form.style}
                  onChange={set("style")}
                  className={selectClass}
                >
                  <option value="" disabled>Seleccionar</option>
                  <option>Fine Line</option>
                  <option>Micro-realismo</option>
                  <option>Realismo</option>
                  <option>Otro / Custom</option>
                </select>
                <SelectChevron />
              </div>
            </div>
            <div>
              <label htmlFor="booking-size" className={labelClass}>Tamaño</label>
              <div className="relative">
                <select
                  id="booking-size"
                  required
                  value={form.size}
                  onChange={set("size")}
                  className={selectClass}
                >
                  <option value="" disabled>Seleccionar</option>
                  <option>Pequeño (2–5 cm)</option>
                  <option>Mediano (5–15 cm)</option>
                  <option>Grande (15+ cm)</option>
                  <option>Manga / Pieza de espalda</option>
                </select>
                <SelectChevron />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="booking-message" className={labelClass}>Describe tu idea</label>
            <textarea
              id="booking-message"
              rows={4}
              placeholder="Referencias, preguntas o cualquier detalle que quieras compartir…"
              value={form.message}
              onChange={set("message")}
              className={`${inputClass} resize-none`}
            />
          </div>

          <button
            type="submit"
            className="w-full border border-white/30 text-white text-xs
              tracking-[0.4em] uppercase py-4 hover:bg-white hover:text-[#1a1814]
              transition-colors duration-300"
          >
            Enviar solicitud
          </button>

          <p className="text-white/40 text-[0.65rem] tracking-wide text-center leading-relaxed">
            Enviar este formulario no confirma la reserva. Se solicitará un depósito una vez aprobada la solicitud.
          </p>
        </form>
      )}
    </section>
  );
}
