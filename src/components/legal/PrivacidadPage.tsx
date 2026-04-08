import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";
import PageHeader from "@/components/shared/PageHeader";

export default function PrivacidadPage() {
  const { t } = useTranslation();
  const sections = t("privacy.sections", { returnObjects: true }) as Array<{ title: string; content: string }>;

  return (
    <main>
      <Header />
      <PageHeader
        title={t("pages.privacidadTitle")}
        subtitle={t("pages.privacidadSubtitle")}
        size="half"
        bg="#141210"
      />

      <section className="px-[4vw] py-20 max-w-[860px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-white/40 text-[0.68rem] tracking-[0.35em] uppercase mb-12"
        >
          {t("pages.lastUpdate")}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="space-y-10"
        >
          {sections.map((s) => (
            <motion.div
              key={s.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="border-l border-[#c9b99a]/20 pl-6"
            >
              <h2
                className="text-white/85 text-base font-light tracking-[0.12em] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.title}
              </h2>
              {s.content.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <div key={i} className="h-2" />
                ) : (
                  <p
                    key={i}
                    className="text-white/50 text-sm leading-relaxed tracking-wide"
                  >
                    {line}
                  </p>
                )
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      <FooterStrip />
    </main>
  );
}
