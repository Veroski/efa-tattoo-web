import { useRef, useState } from "react";
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
  availability: string;
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

  const validateAndSetFile = (file: File | null) => {
    setImageError("");
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setImageError("Solo se admiten PNG, JPG o JPEG.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setImageError("El archivo no puede superar los 3 MB.");
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

      const res = await fetch("/api/ghl/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tattoo_img_url }),
      });
      if (!res.ok) throw new Error("Error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="px-[4vw] py-16 max-w-xl mx-auto">
        <div className="py-12 text-center space-y-3">
          <p className="text-[#c9b99a] text-xs tracking-[0.4em] uppercase">
            Solicitud recibida
          </p>
          <p className="text-white/60 text-sm tracking-wide font-light">
            Te contactaremos por WhatsApp para revisar tu idea y disponibilidad.
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
                <label htmlFor="b-name" className={labelClass}>Nombre y Apellidos</label>
                <input
                  id="b-name"
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={form.full_name}
                  onChange={set("full_name")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-city" className={labelClass}>Ciudad</label>
                <div className="relative">
                  <select
                    id="b-city"
                    required
                    value={form.city}
                    onChange={set("city")}
                    className={selectClass}
                  >
                    <option value="" disabled>¿Donde?</option>
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
                <label htmlFor="b-phone" className={labelClass}>WhatsApp / Tel.</label>
                <input
                  id="b-phone"
                  type="tel"
                  required
                  placeholder="+34 000 000 000"
                  value={form.phone}
                  onChange={set("phone")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-email" className={labelClass}>Email</label>
                <input
                  id="b-email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={set("email")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Idea del tatuaje */}
            <div>
              <label htmlFor="b-idea" className={labelClass}>Idea del tatuaje</label>
              <textarea
                id="b-idea"
                rows={1}
                required
                placeholder="Descripción breve del diseño"
                value={form.tattoo_idea}
                onChange={set("tattoo_idea")}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Zona del cuerpo + Disponibilidad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-zone" className={labelClass}>Zona del cuerpo</label>
                <input
                  id="b-zone"
                  type="text"
                  required
                  placeholder="Ej. Antebrazo"
                  value={form.body_zone}
                  onChange={set("body_zone")}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="b-availability" className={labelClass}>Disponibilidad</label>
                <input
                  id="b-availability"
                  type="text"
                  required
                  placeholder="Ej. Próxima semana"
                  value={form.availability}
                  onChange={set("availability")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Información adicional */}
            <div>
              <label htmlFor="b-extra" className={labelClass}>
                Información adicional{" "}
                <span className="text-white/30 normal-case tracking-normal">(opcional)</span>
              </label>
              <textarea
                id="b-extra"
                rows={1}
                placeholder="Detalles adicionales (alergias, fechas...)"
                value={form.additional_info}
                onChange={set("additional_info")}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Imagen de referencia */}
            <div>
              <label className={labelClass}>
                Imagen de referencia{" "}
                <span className="text-white/30 normal-case tracking-normal">(opcional)</span>
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
                    aria-label="Eliminar imagen"
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
                    PNG, JPG · máx 3 MB
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Imagen de referencia"
              />

              {imageError && (
                <p className="text-red-400/70 text-[0.63rem] tracking-wide mt-1">{imageError}</p>
              )}
            </div>

            {status === "error" && (
              <p className="text-red-400/80 text-[0.65rem] tracking-wide text-center">
                Error. Revisa los datos e inténtalo de nuevo.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#c9b99a] text-[#0a0a0a] border border-[#c9b99a] text-[0.65rem] font-bold
                tracking-[0.45em] uppercase py-3 hover:bg-transparent hover:text-white
                transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/20"
            >
              {status === "loading" ? "Enviando solicitud..." : "ENVIAR SOLICITUD"}
            </button>
          </form>
        </div>

        {/* Panel Informativo (Derecha) */}
        <div className="bg-[#0a0a0a]/80 border border-white/[0.05] p-6 sm:p-8 rounded-sm relative overflow-hidden flex flex-col justify-center backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#c9b99a]/30 to-transparent" />
          <h3 className="text-white/90 text-[0.7rem] tracking-[0.3em] uppercase mb-6 font-medium">Sobre tu solicitud</h3>
          
          <div className="space-y-6 text-white/50 text-[0.75rem] font-light leading-relaxed tracking-wide">
            <p>
              Enviar este formulario <span className="text-[#c9b99a]">no confirma una reserva automática</span>. Es una solicitud inicial para evaluar la viabilidad de tu idea artística.
            </p>
            <p>
              Nuestro equipo revisará tu propuesta cuidadosamente. Nos pondremos en contacto contigo directamente por <span className="text-[#c9b99a]">WhatsApp</span> para discutir el planteamiento visual, concretar fechas y presentarte un presupuesto a medida.
            </p>
            <p>
              Actualmente trabajamos con plazas muy limitadas por ciudad para asegurar la máxima exclusividad en cada obra.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
