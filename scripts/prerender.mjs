import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, "..");
const distDir = resolve(root, "dist");
const BASE = "https://www.efa-tattoo.com";
const OG_IMAGE = `${BASE}/og-banner.jpg`;

const ROUTES = {
  "/": {
    title: "EFA Tattoo Barcelona · Fine Line & Microrealismo · Enric",
    description: "Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal. Reserva tu cita hoy.",
    canonical: `${BASE}/`,
  },
  "/about": {
    title: "Conoce a Enric · Tatuador Fine Line en Barcelona · EFA Tattoo Barcelona",
    description: "Conoce a Enric, tatuador barcelonés con formación médica y más de 7 años especializándose en fine line y microrealismo. Arte con criterio.",
    canonical: `${BASE}/about`,
  },
  "/gallery": {
    title: "Galería de Tatuajes · +400 Trabajos · EFA Tattoo Barcelona",
    description: "Más de 400 tatuajes de línea fina, microrealismo, proyectos grandes y retratos de mascotas. Galería del estudio EFA Tattoo Barcelona.",
    canonical: `${BASE}/gallery`,
  },
  "/tattoo": {
    title: "Reservar Cita · Fine Line Barcelona · EFA Tattoo Barcelona",
    description: "Solicita tu cita de tatuaje en EFA Tattoo Barcelona. Fine line y microrealismo personalizados. Plazas muy limitadas — rellena el formulario.",
    canonical: `${BASE}/tattoo`,
  },
  "/academy": {
    title: "Seminario Fine Line Barcelona · Formación EFA 2026 · EFA Tattoo Barcelona",
    description: "Seminario intensivo de línea fina en Barcelona. 2 días, grupos de 4 alumnos, práctica en piel real. Formación avanzada para tatuadores con experiencia.",
    canonical: `${BASE}/academy`,
  },
  "/privacidad": {
    title: "Política de Privacidad · EFA Tattoo Barcelona",
    description: "Política de privacidad de EFA Tattoo. Información sobre el tratamiento de datos personales conforme al RGPD.",
    canonical: `${BASE}/privacidad`,
  },
  "/aviso-legal": {
    title: "Aviso Legal · EFA Tattoo Barcelona",
    description: "Aviso legal de EFA Tattoo Barcelona. Condiciones de uso del sitio web, propiedad intelectual y normativa aplicable.",
    canonical: `${BASE}/aviso-legal`,
  },
};

function buildHeadTags({ title, description, canonical }) {
  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${canonical}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <meta property="og:locale" content="es_ES" />
    <meta property="og:locale:alternate" content="en_GB" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:alt" content="EFA Tattoo Barcelona — Fine Line &amp; Microrealismo" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />`;
}

async function main() {
  const { render } = await import(resolve(distDir, "server/entry-server.mjs"));
  const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

  for (const [route, meta] of Object.entries(ROUTES)) {
    try {
      const html = render(route);
      const headTags = buildHeadTags(meta);

      const output = template
        .replace("<!-- PRERENDER_HEAD -->", headTags)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`);

      const outFile =
        route === "/"
          ? resolve(distDir, "index.html")
          : resolve(distDir, route.slice(1), "index.html");

      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, output, "utf-8");
      console.log(`  ✓ ${route}`);
    } catch (err) {
      console.error(`  ✗ ${route}:`, err.message);
    }
  }

  rmSync(resolve(distDir, "server"), { recursive: true, force: true });
  console.log("✅ Prerender complete");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
