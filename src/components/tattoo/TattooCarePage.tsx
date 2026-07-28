import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";
import PageHeader from "@/components/shared/PageHeader";

const steps = [
  {
    title: "Nada más salir del estudio",
    items: [
      "Saldrás con un film protector sobre el tatuaje. Retíralo al cabo de 1–2 horas.",
      "Lava el tatuaje con agua y jabón (mejor jabón pH neutro, si no, el que tengas).",
      "Frota muy suave con la mano y seca a toques con papel de cocina, sin arrastrar, para no irritar la piel.",
    ],
  },
  {
    title: "Días 1 y 2",
    items: [
      "Solo lavar con agua y jabón, unas 3 veces al día. Nada de cremas todavía.",
      "Seca siempre a toques con papel de cocina limpio.",
    ],
  },
  {
    title: "A partir del día 3",
    items: [
      "Después de cada lavado, aplica una capa muy fina de crema: Bepanthol, Eucerin, Aquaphor o una hidratante de calidad.",
      "Repite el proceso 3 veces al día (lavar + crema) durante la primera semana / 10 días.",
      "Más crema no es mejor: si brilla o queda pegajoso, es demasiada.",
    ],
  },
  {
    title: "Segunda semana en adelante",
    items: [
      "Reduce a 1–2 veces al día (lavar + hidratar).",
      "A partir de la segunda semana ya no necesita cuidados especiales: haz vida normal.",
      "Sigue hidratándolo de vez en cuando hasta cumplir el primer mes. El tatuaje ya estará prácticamente curado.",
    ],
  },
  {
    title: "Verano: sol, playa y piscina",
    items: [
      "Primera semana: nada de sol directo. Si vas a estar expuesto, cúbrelo con ropa o un pañuelo transpirable que no deje la zona húmeda.",
      "Primera semana: evita bañarte en el mar o la piscina. Si el tatuaje está en una zona que no toca el agua (p. ej. la muñeca), puedes bañarte con cuidado.",
      "A partir de la segunda semana: puedes bañarte, pero sin quedarte en remojo: entra y sal para refrescarte, sin pasar mucho rato en el agua.",
      "Desde la segunda semana puedes usar crema solar (SPF 50) si quieres estar al sol sin taparlo. Siempre con cuidado y sin quemar la piel.",
    ],
  },
  {
    title: "Qué NO hacer durante la curación",
    items: [
      "No rasques ni arranques las costras o pieles: se irán solas. Si pica, aplica un poco de crema.",
      "Evita gimnasio, sudor intenso y saunas los primeros 4–5 días.",
      "No uses ropa ajustada que roce el tatuaje; mejor ropa holgada y limpia.",
      "Nada de alcohol, agua oxigenada, cremas con corticoides ni productos no indicados.",
      "No dejes que mascotas o superficies sucias entren en contacto con el tatuaje.",
    ],
  },
  {
    title: "Cuándo contactarme",
    items: [
      "Es normal: enrojecimiento leve, calor, picor y costras finas los primeros días.",
      "No es normal: dolor que va a más pasados 3–4 días, hinchazón importante, pus, mal olor, fiebre o líneas rojas que se extienden desde el tatuaje.",
      "Ante cualquier duda, escríbeme antes de aplicar nada por tu cuenta: @efa_tattoo.",
    ],
  },
];

export default function TattooCarePage() {
  return (
    <main>
      <Header />
      <PageHeader
        title="Cuidados del tatuaje"
        subtitle="Guía de cuidados · Fine Line"
        size="half"
        bg="#141210"
      />

      <section className="px-[4vw] py-20 max-w-[860px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="border-l border-[#c9b99a]/30 pl-6 mb-14"
        >
          <p className="text-white/75 text-lg leading-relaxed font-light">
            Tu tatuaje es una herida superficial: cómo lo cuides estas semanas define cómo se verá para siempre.
          </p>
          <p className="text-white/50 text-sm leading-relaxed tracking-wide mt-4">
            Sigue estos pasos y lávate siempre las manos antes de tocarlo.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.section
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
              className="border-l border-white/10 pl-6"
            >
              <p className="text-[#c9b99a] text-[0.68rem] tracking-[0.35em] uppercase mb-3">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="text-white/90 text-xl font-light tracking-[0.08em] mb-5">
                {step.title}
              </h2>
              <ul className="space-y-3">
                {step.items.map((item) => (
                  <li key={item} className="flex gap-3 text-white/55 text-sm leading-relaxed tracking-wide">
                    <span className="text-[#c9b99a]" aria-hidden="true">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-16 border-t border-white/10 pt-10 text-center"
        >
          <p className="text-white/75 text-lg font-light leading-relaxed">
            Gracias por confiar en mí. Cuida tu tatuaje como yo he cuidado cada línea.
          </p>
          <p className="text-[#c9b99a] text-[0.7rem] tracking-[0.35em] uppercase mt-5">
            Enric · EFA Tattoo
          </p>
        </motion.div>
      </section>

      <FooterStrip />
    </main>
  );
}
