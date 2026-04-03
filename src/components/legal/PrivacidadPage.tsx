import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import FooterStrip from "@/components/shared/FooterStrip";
import PageHeader from "@/components/shared/PageHeader";

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content: `Los datos personales facilitados a través de este sitio web son tratados por el titular del estudio EFA Tattoo, con domicilio en Barcelona, España.\n\nEste sitio web opera bajo el nombre comercial EFA Tattoo y es gestionado por su titular como profesional autónomo.`,
  },
  {
    title: "2. Datos que recogemos",
    content: `Recogemos únicamente los datos que el usuario nos facilita voluntariamente a través del formulario de solicitud de cita:\n\n• Nombre y apellidos\n• Dirección de correo electrónico\n• Número de teléfono\n• Descripción del tatuaje deseado e imágenes de referencia opcionales\n\nNo recogemos datos sensibles ni realizamos perfiles automatizados.`,
  },
  {
    title: "3. Finalidad del tratamiento",
    content: `Los datos se utilizan exclusivamente para:\n\n• Gestionar la solicitud de cita y comunicarnos contigo respecto a ella\n• Coordinar el proceso de reserva a través de WhatsApp o correo electrónico\n\nNo utilizamos tus datos para envíos de publicidad sin consentimiento expreso previo.`,
  },
  {
    title: "4. Base legal",
    content: `La base legal del tratamiento es la ejecución de una relación precontractual (art. 6.1.b RGPD): el usuario facilita sus datos para solicitar información o gestionar una cita, lo cual implica el inicio de una relación contractual.`,
  },
  {
    title: "5. Conservación de los datos",
    content: `Los datos se conservan durante el tiempo necesario para gestionar la solicitud y, si se formaliza la relación, durante el plazo legalmente exigible para cumplir con las obligaciones fiscales y mercantiles aplicables. Una vez finalizada la relación, se procederá a su supresión salvo exigencia legal de conservación.`,
  },
  {
    title: "6. Comunicación a terceros",
    content: `Los datos no se ceden a terceros salvo obligación legal. La comunicación entre el estudio y el cliente se realiza a través de herramientas de mensajería (WhatsApp) y correo electrónico, cuyos proveedores pueden actuar como encargados del tratamiento con sus propias políticas de privacidad.`,
  },
  {
    title: "7. Cookies y métricas",
    content: `Este sitio puede utilizar cookies analíticas (Google Analytics) y cookies de marketing (Facebook Pixel) únicamente si el usuario otorga su consentimiento explícito a través del banner de cookies que aparece al acceder al sitio por primera vez.\n\n• Cookies esenciales: necesarias para el funcionamiento básico del sitio, siempre activas.\n• Cookies analíticas: permiten obtener estadísticas anónimas de visitas (Google Analytics 4).\n• Cookies de marketing: empleadas para la medición y optimización de campañas publicitarias en redes sociales (Facebook Pixel).\n\nPuedes modificar tus preferencias en cualquier momento borrando las cookies de tu navegador, lo que hará que el banner vuelva a aparecer.`,
  },
  {
    title: "8. Tus derechos",
    content: `En virtud del RGPD y la LOPDGDD puedes ejercer los siguientes derechos:\n\n• Acceso: conocer qué datos tratamos sobre ti.\n• Rectificación: corregir datos inexactos.\n• Supresión: solicitar la eliminación de tus datos cuando ya no sean necesarios.\n• Oposición y limitación: oponerte al tratamiento o solicitar que se limite.\n• Portabilidad: recibir tus datos en formato electrónico.\n\nPuedes ejercer estos derechos contactando con nosotros a través del formulario de solicitud de cita indicando expresamente el derecho que deseas ejercer. Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
  },
  {
    title: "9. Seguridad",
    content: `Adoptamos las medidas técnicas y organizativas adecuadas para proteger tus datos frente a acceso no autorizado, pérdida o destrucción accidental, de acuerdo con el nivel de riesgo del tratamiento.`,
  },
  {
    title: "10. Modificaciones",
    content: `Esta política puede actualizarse para adaptarse a cambios legales o funcionales del sitio. La fecha de la última modificación aparecerá indicada al pie de esta página. Te recomendamos revisarla periódicamente.`,
  },
];



export default function PrivacidadPage() {
  return (
    <main>
      <Header />
      <PageHeader
        title="Privacidad"
        subtitle="Política de privacidad"
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
