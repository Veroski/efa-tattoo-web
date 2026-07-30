import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const sectionWidth = "px-[4vw] max-w-[1500px] mx-auto";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: "easeOut" as const },
};

const ADDRESS = "Carrer Còrsega 163, Barcelona";

interface LocationSectionProps {
  /**
   * i18n prefix for the copy. Expects `<prefix>.locationEyebrow`, `.locationTitle`,
   * `.locationDesc`, `.locationQuote` — the rest of the keys are shared under `academy.*`.
   */
  copyPrefix?: string;
  backgroundColor?: string;
}

export default function LocationSection({
  copyPrefix = "academy",
  backgroundColor = "#161311",
}: LocationSectionProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const googleMapsNavigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

  const handleCopy = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(ADDRESS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="py-18 md:py-24" style={{ backgroundColor }}>
      <div className={sectionWidth}>
        <div className="grid overflow-hidden border border-white/8 bg-[#1d1916] lg:grid-cols-[0.95fr_1.25fr]">
          <div className="space-y-8 p-8 md:p-12">
            <motion.div {...fadeUp} className="max-w-3xl space-y-4">
              <p className="text-[0.72rem] uppercase tracking-[0.45em] text-[#c9b99a]">
                {t(`${copyPrefix}.locationEyebrow`)}
              </p>
              <h2
                className="text-white uppercase tracking-[0.18em] font-light leading-[0.95]"
                style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2rem, 4.2vw, 4.3rem)" }}
              >
                {t(`${copyPrefix}.locationTitle`)}
              </h2>
              <p className="text-sm leading-relaxed tracking-wide text-white/62 md:text-base">
                {t(`${copyPrefix}.locationDesc`)}
              </p>
            </motion.div>
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
                {t(`${copyPrefix}.locationQuote`)}
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
              title={`${t(`${copyPrefix}.locationTitle`)} — Barcelona`}
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
