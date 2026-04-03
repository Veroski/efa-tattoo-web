import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";
import PageHeader from "@/components/shared/PageHeader";

const sections = [
  {
    title: "1. Identificación del titular",
    content: `El presente sitio web (en adelante, «el Sitio») es titularidad de Enric (nombre artístico EFA Tattoo), profesional autónomo del sector artístico y del tatuaje, con domicilio en Barcelona, España.\n\nEste aviso legal regula el acceso y uso del Sitio, que el usuario acepta de forma expresa y sin reservas desde el momento en que accede al mismo.`,
  },
  {
    title: "2. Objeto y actividad",
    content: `El Sitio tiene como finalidad la presentación del trabajo artístico del tatuador Enric bajo la marca EFA Tattoo, la captación de solicitudes de cita para sesiones de tatuaje y la difusión de la actividad formativa (Academia EFA).\n\nLa información publicada tiene carácter meramente informativo y no constituye, por sí sola, una oferta contractual vinculante.`,
  },
  {
    title: "3. Condiciones de uso",
    content: `El usuario se compromete a hacer un uso adecuado del Sitio conforme a la ley, la moral y el orden público, y en particular a:\n\n• No utilizar el Sitio para actividades ilícitas o contrarias a los derechos de terceros.\n• No introducir ni difundir contenido falso, difamatorio, injurioso o que vulnere derechos de propiedad intelectual.\n• No realizar acciones que puedan dañar, inutilizar o sobrecargar el Sitio.\n\nEl incumplimiento de estas condiciones puede dar lugar a la denegación del acceso sin previo aviso.`,
  },
  {
    title: "4. Propiedad intelectual e industrial",
    content: `Todos los contenidos del Sitio —incluyendo, sin carácter limitativo, textos, fotografías, ilustraciones, logotipos, diseño gráfico y código fuente— son propiedad del titular o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional de propiedad intelectual e industrial.\n\nQueda expresamente prohibida su reproducción, distribución, comunicación pública o transformación sin autorización escrita previa del titular.\n\nLas imágenes de tatuajes muestran trabajos propios de EFA Tattoo; su divulgación con fines distintos a los personales o informativos requiere autorización expresa.`,
  },
  {
    title: "5. Responsabilidad",
    content: `El titular no garantiza la disponibilidad y continuidad ininterrumpida del Sitio, ni la ausencia de errores en sus contenidos, aunque adoptará las medidas razonables para corregirlos.\n\nEl titular no será responsable de los daños derivados del uso indebido del Sitio ni del acceso a enlaces externos que pudieran encontrarse en el mismo. Los enlaces a terceros se facilitan únicamente como referencia informativa; el titular no controla ni asume responsabilidad sobre dichos contenidos.`,
  },
  {
    title: "6. Protección de datos",
    content: `El tratamiento de los datos personales que el usuario facilite a través del formulario de solicitud de cita se rige por la Política de Privacidad disponible en el Sitio, de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).`,
  },
  {
    title: "7. Cookies",
    content: `El Sitio puede emplear cookies propias y de terceros. En todo caso, las cookies analíticas y de marketing solo se activarán con el consentimiento previo del usuario, conforme a lo descrito en la Política de Privacidad y en el banner de cookies que se muestra al acceder por primera vez.`,
  },
  {
    title: "8. Legislación aplicable y jurisdicción",
    content: `El presente aviso legal se rige por la legislación española. Para cualquier controversia derivada del acceso o uso del Sitio, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a la jurisdicción de los Juzgados y Tribunales de la ciudad de Barcelona.`,
  },
  {
    title: "9. Modificaciones",
    content: `El titular se reserva el derecho a modificar, en cualquier momento y sin previo aviso, la presentación, configuración y contenido del Sitio, así como el presente aviso legal. Se recomienda al usuario revisarlo periódicamente.`,
  },
];



export default function AvisoLegalPage() {
  return (
    <main>
      <Header />
      <PageHeader
        title="Aviso Legal"
        subtitle="Términos y condiciones de uso"
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
          Última actualización: abril 2025
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
