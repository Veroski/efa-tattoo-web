import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionLabel from "@/components/shared/SectionLabel";

type CityOption = "" | "barcelona" | "zurich";
type FormStatus = "idle" | "loading" | "success" | "error";

interface BookingFormData {
  full_name: string;
  phone: string;
  email: string;
  city: CityOption;
  tattoo_idea: string;
  body_zone: string;
  availability: "Lo antes posible" | "Próximas semanas" | "Fecha concreta" | "";
  specific_date: string;
  additional_info: string;
}

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB — keeps base64 body under Vercel's 4.5 MB limit
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const initial: BookingFormData = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  tattoo_idea: "",
  body_zone: "",
  availability: "",
  specific_date: "",
  additional_info: "",
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full bg-white/[0.02] border border-white/10 text-white text-[0.75rem] py-2 px-3 outline-none " +
  "focus:border-[#c9b99a]/50 focus:bg-white/[0.04] transition-all duration-300 placeholder:text-white/20 tracking-wide font-light rounded-[1px]";

const selectClass =
  "w-full bg-[#0a0a0a] border border-white/10 text-white/70 text-[0.75rem] py-2 px-3 outline-none " +
  "focus:border-[#c9b99a]/50 transition-all duration-300 tracking-wide appearance-none rounded-[1px] font-light cursor-pointer";

const labelClass = "block text-white/60 text-[0.55rem] tracking-[0.3em] uppercase mb-1 pl-0.5";

function SelectChevron() {
  return (
    <svg
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
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

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GOOGLE_REVIEWS = [
  { id: 1, name: "Laura Sánchez", time: "hace 2 semanas", text: "Increíble experiencia. El trato fue inmejorable y el tatuaje fine line quedó exactamente como lo imaginaba, súper delicado. El estudio transmite mucha paz y profesionalidad." },
  { id: 2, name: "Marc T.", time: "hace 1 mes", text: "Muy detallista y perfeccionista. El diseño lo clavó a la primera. Todo el proceso fue muy higiénico y me sentí muy cómodo. ¡Repetiré seguro!" },
  { id: 3, name: "Andrea V.", time: "hace 1 mes", text: "Tenía un poco de miedo por ser mi primer tatuaje, pero tienen una paciencia infinita. Me lo explicaron todo al detalle y dolió mucho menos de lo que pensaba." },
  { id: 4, name: "Carla R.", time: "hace 2 meses", text: "Me hice un proyecto de manga entera y no puedo estar más contenta. El nivel de detalle en las sombras y las líneas es espectacular." },
  { id: 5, name: "Javier M.", time: "hace 3 meses", text: "Un 10/10. El estudio es precioso, la limpieza impoluta y el resultado final superó mis expectativas. Muy recomendables." },
  { id: 6, name: "Elena Gómez", time: "hace 3 meses", text: "El mejor estudio en el que he estado. Te asesoran con el diseño para que se adapte perfectamente a tu cuerpo. Trato súper cercano y profesional." },
  { id: 7, name: "Pol F.", time: "hace 4 meses", text: "Resolvieron todas mis dudas por WhatsApp rapidísimo. El día de la cita fue genial, cero estrés y el tatuaje cicatrizó perfectamente." }
];

export default function BookingSection() {
  const [form, setForm] = useState<BookingFormData>(initial);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set =
    (k: keyof BookingFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const { t } = useTranslation();

  const validateAndSetFile = (file: File | null) => {
    setImageError("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setImageError(t("booking.imageError1"));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setImageError(t("booking.imageError2"));
      return;
    }
    setImageFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
  };

  const removeFile = () => {
    setImageFile(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      let tattoo_img_url = "";

      if (imageFile) {
        const base64 = await readFileAsBase64(imageFile);
        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, filename: imageFile.name, contentType: imageFile.type }),
        });
        if (!uploadRes.ok) throw new Error("Upload failed");
        const uploadData = await uploadRes.json();
        tattoo_img_url = uploadData.url ?? "";
      }

      let availability: string = form.availability;
      if (form.availability === "Fecha concreta" && form.specific_date) {
        const [y, m, d] = form.specific_date.split("-");
        availability = `Fecha concreta: ${d}/${m}/${y}`;
      }

      const res = await fetch("/api/ghl/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, availability, tattoo_img_url }),
      });
      if (!res.ok) throw new Error("Error");
      setStatus("success");
      if (typeof (window as any).fbq === "function") {
        (window as any).fbq("track", "Lead");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="px-[4vw] py-16 max-w-xl mx-auto">
        <div className="py-12 text-center space-y-3">
          <p className="text-[#c9b99a] text-xs tracking-[0.4em] uppercase">
            {t("booking.successTitle")}
          </p>
          <p className="text-white/60 text-sm tracking-wide font-light">
            {t("booking.successText")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reserva" className="px-[4vw] pb-10 pt-0 max-w-5xl mx-auto -mt-16 md:-mt-24 relative z-10 scroll-mt-24">
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-stretch">
        
        {/* Formulario (Izquierda) */}
        <div className="bg-gradient-to-b from-white/[0.08] to-[#0a0a0a] border border-white/[0.1] p-5 sm:p-7 rounded-sm relative overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Glow effect at the top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-[#c9b99a]/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            {/* Nombre + Ciudad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-name" className={labelClass}>{t("booking.name")}</label>
                <input
                  id="b-name"
                  type="text"
                  required
                  placeholder={t("booking.namePlaceholder")}
                  value={form.full_name}
                  onChange={set("full_name")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-city" className={labelClass}>{t("booking.city")}</label>
                <div className="relative">
                  <select
                    id="b-city"
                    required
                    value={form.city}
                    onChange={set("city")}
                    className={selectClass}
                  >
                    <option value="" disabled>{t("booking.cityPlaceholder")}</option>
                    <option value="barcelona">Barcelona</option>
                    <option value="zurich">Zurich</option>
                  </select>
                  <SelectChevron />
                </div>
              </div>
            </div>

            {/* Teléfono + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-phone" className={labelClass}>{t("booking.phone")}</label>
                <input
                  id="b-phone"
                  type="tel"
                  required
                  placeholder={t("booking.phonePlaceholder")}
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-email" className={labelClass}>{t("booking.email")}</label>
                <input
                  id="b-email"
                  type="email"
                  required
                  placeholder={t("booking.emailPlaceholder")}
                  value={form.email}
                  onChange={set("email")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Idea del tatuaje */}
            <div>
              <label htmlFor="b-idea" className={labelClass}>{t("booking.idea")}</label>
              <textarea
                id="b-idea"
                rows={1}
                required
                placeholder={t("booking.ideaPlaceholder")}
                value={form.tattoo_idea}
                onChange={set("tattoo_idea")}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Zona del cuerpo + Disponibilidad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-zone" className={labelClass}>{t("booking.zone")}</label>
                <input
                  id="b-zone"
                  type="text"
                  required
                  placeholder={t("booking.zonePlaceholder")}
                  value={form.body_zone}
                  onChange={set("body_zone")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-availability" className={labelClass}>{t("booking.availability")}</label>
                <div className="relative">
                  <select
                    id="b-availability"
                    required
                    value={form.availability}
                    onChange={set("availability")}
                    className={selectClass}
                  >
                    <option value="" disabled>{t("booking.availabilityPlaceholder")}</option>
                    <option value="Lo antes posible">{t("booking.availOpt1")}</option>
                    <option value="Próximas semanas">{t("booking.availOpt2")}</option>
                    <option value="Fecha concreta">{t("booking.availOpt3")}</option>
                  </select>
                  <SelectChevron />
                </div>
                {form.availability === "Fecha concreta" && (
                  <input
                    id="b-specific-date"
                    type="date"
                    required
                    value={form.specific_date}
                    onChange={set("specific_date")}
                    min={new Date().toISOString().split("T")[0]}
                    className={`${inputClass} mt-2`}
                  />
                )}
              </div>
            </div>



            {/* Información adicional */}
            <div>
              <label htmlFor="b-extra" className={labelClass}>
                {t("booking.extra")}{" "}
                <span className="text-white/30 normal-case tracking-normal">{t("booking.extraOptional")}</span>
              </label>
              <textarea
                id="b-extra"
                rows={1}
                placeholder={t("booking.extraPlaceholder")}
                value={form.additional_info}
                onChange={set("additional_info")}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Imagen de referencia */}
            <div>
              <label className={labelClass}>
                {t("booking.imageLabel")}{" "}
                <span className="text-white/30 normal-case tracking-normal">{t("booking.extraOptional")}</span>
              </label>

              {imageFile ? (
                <div className="flex items-center gap-3 border border-white/10 bg-white/[0.02] px-3 py-2 rounded-[1px]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="flex-shrink-0 text-[#c9b99a]">
                    <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
                    <path d="M1 9.5L4 7L6.5 9.5L9.5 6L13 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-white/60 text-[0.72rem] tracking-wide font-light truncate flex-1">
                    {imageFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
                    aria-label={t("booking.imageRemove")}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border border-dashed rounded-[1px] px-3 py-4 cursor-pointer
                    flex flex-col items-center gap-1.5 transition-all duration-300
                    ${isDragging
                      ? "border-[#c9b99a]/50 bg-[#c9b99a]/5"
                      : "border-white/12 bg-white/[0.01] hover:border-white/25 hover:bg-white/[0.03]"}
                  `}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="text-white/25">
                    <path d="M9 12V4M9 4L6 7M9 4L12 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 14H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <span className="text-white/35 text-[0.65rem] tracking-[0.2em] uppercase">
                    {t("booking.imageHint")}
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileChange}
                className="sr-only"
                aria-label={t("booking.imageLabel")}
              />

              {imageError && (
                <p className="text-red-400/70 text-[0.63rem] tracking-wide mt-1">{imageError}</p>
              )}
            </div>

            {status === "error" && (
              <p className="text-red-400/80 text-[0.65rem] tracking-wide text-center">
                {t("booking.errorMsg")}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#c9b99a] text-[#0a0a0a] border border-[#c9b99a] text-[0.65rem] font-bold
                tracking-[0.45em] uppercase py-3 hover:bg-transparent hover:text-white
                transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/20"
            >
              {status === "loading" ? t("booking.submitting") : t("booking.submit")}
            </button>
          </form>
        </div>

        {/* Panel Informativo (Derecha) */}
        <div className="bg-[#0a0a0a]/80 border border-white/[0.05] p-6 sm:p-8 rounded-sm relative overflow-hidden flex flex-col justify-center backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#c9b99a]/30 to-transparent" />
          <h3 className="text-white/90 text-[0.7rem] tracking-[0.3em] uppercase mb-6 font-medium">{t("booking.infoTitle")}</h3>

          <div className="space-y-6 text-white/50 text-[0.75rem] font-light leading-relaxed tracking-wide">
            <p>
              {t("booking.infoP1Pre")}<span className="text-[#c9b99a]">{t("booking.infoP1Highlight")}</span>{t("booking.infoP1Post")}
            </p>
            <p>
              {t("booking.infoP2Pre")}<span className="text-[#c9b99a]">{t("booking.infoP2Highlight")}</span>{t("booking.infoP2Post")}
            </p>
            <p>{t("booking.infoP3")}</p>
          </div>
        </div>

      </div>

      {/* ============================================================
          GOOGLE REVIEWS CAROUSEL
          ============================================================ */}
      <div className="mt-20 md:mt-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div className="space-y-2">
            <h3 className="text-white uppercase tracking-[0.2em] font-light text-xl lg:text-2xl w-full" style={{ fontFamily: "var(--font-body)" }}>
              {/* @ts-ignore */}
              {t("booking.reviewsTitle", "Lo que dicen nuestros clientes")}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-white text-lg font-medium">4.9</span>
              <div className="flex text-[#FFC107] text-lg">
                ★★★★★
              </div>
              <span className="text-white/40 text-[0.7rem] tracking-wide ml-1">
                {/* @ts-ignore */}
                {t("booking.reviewsSubtitle", "Basado en reseñas de Google")}
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] pt-4 pb-8">
          <style>
            {`
              @keyframes scrollMarquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-50% - 12px)); }
              }
              .animate-marquee {
                animation: scrollMarquee 40s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div
            className="flex w-max gap-6 animate-marquee"
          >
            {[...GOOGLE_REVIEWS, ...GOOGLE_REVIEWS].map((review, idx) => (
              <div
                key={`${review.id}-${idx}`}
                className="shrink-0 w-[300px] sm:w-[340px] md:w-[380px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-7 rounded-2xl flex flex-col gap-5 relative overflow-hidden backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(201,185,154,0.1)] transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.05] group"
              >
                {/* Edge Highlights */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 group-hover:ring-white/10 transition-all duration-500 pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1a1814] to-[#2a2620] border border-white/10 flex items-center justify-center text-white/90 text-sm font-medium font-body uppercase shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white/95 text-sm font-medium tracking-wide group-hover:text-[#c9b99a] transition-colors">{review.name}</p>
                      <p className="text-white/40 text-[0.7rem] tracking-wide mt-0.5">{review.time}</p>
                    </div>
                  </div>
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                    <GoogleIcon />
                  </div>
                </div>
                
                <div className="flex text-[#FFC107] text-[0.8rem] tracking-widest mt-[-0.2rem] relative z-10">
                  ★★★★★
                </div>
                
                <p className="text-white/70 text-[0.85rem] font-light leading-relaxed relative z-10 group-hover:text-white/80 transition-colors">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
