import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  size?: "full" | "half";
  bg?: string;
}

export default function PageHeader({
  title,
  subtitle,
  size = "half",
  bg = "#242020",
}: PageHeaderProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${size === "full" ? "h-screen" : "h-[55vh]"}`}
      style={{ backgroundColor: bg }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-white font-light tracking-[0.25em] uppercase text-center leading-none"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
          }}
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          style={{ originX: 0.5 }}
          className="h-px w-32 bg-[#c9b99a] mt-5"
        />

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/55 text-xs tracking-[0.45em] uppercase mt-5"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
