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

      let availability = form.availability;
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
          SHADOW CONTENT — Reseñas Citas
          Mismo schema que AcademyTestimonial para consistencia
          Para activar: cambiar `display: none` o importar componente
          ============================================================ */}

      {/*
      const BOOKING_REVIEWS = [
        {
          id: 1,
          name: "Marta L.",
          rating: 5,
          text: "Proceso súper cuidado desde la consulta hasta el resultado. Mi tatuaje quedó exactamente como lo imaginé.",
        },
        {
          id: 2,
          name: "Jordi P.",
          rating: 5,
          text: "Atención al detalle increíble. El trazo fine line que pedí salió perfecto.",
        },
        {
          id: 3,
          name: "Elena V.",
          rating: 5,
          text: "Primera vez tatuándome y me sentí muy cómoda. Profesionalidad total.",
        },
      ];

      function BookingReviews() {
        return (
          <div style={{ display: "none" }} aria-hidden="true">
            {BOOKING_REVIEWS.map((r) => (
              <div key={r.id}>
                <p>{r.name}</p>
                <p>{"★".repeat(r.rating)}</p>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        );
      }
      */}
    </section>
  );
}
