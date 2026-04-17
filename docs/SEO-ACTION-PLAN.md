# SEO Action Plan — EFA Tattoo Web

Plan de implementación paso a paso. Cada bloque incluye el código exacto listo para aplicar.

---

## PASO 1 — Instalar react-helmet-async (prerequisito para pasos 2-6)

```bash
npm install react-helmet-async
```

Envolver la app en `src/main.tsx`:

```tsx
// src/main.tsx
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
)
```

---

## PASO 2 — Meta tags dinámicos por página

Reemplazar la función `Page` en `src/App.tsx` para que acepte y gestione SEO completo:

```tsx
// src/App.tsx — reemplazar función Page y useDocumentTitle

import { Helmet } from 'react-helmet-async'

interface PageSEO {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
}

const BASE_TITLE = 'EFA Tattoo Barcelona'
const BASE_OG_IMAGE = 'https://www.efa-tattoo.com/og-image.jpg'

function Page({ title, description, canonical, ogImage, children }: PageSEO & { children: ReactNode }) {
  const fullTitle = title ? `${title} · ${BASE_TITLE}` : `${BASE_TITLE} · Fine Line & Microrealismo · Enric`

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
        {canonical && <link rel="canonical" href={canonical} />}
        <meta property="og:title" content={fullTitle} />
        {description && <meta property="og:description" content={description} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:image" content={ogImage ?? BASE_OG_IMAGE} />
        <meta name="twitter:title" content={fullTitle} />
        {description && <meta name="twitter:description" content={description} />}
        <meta name="twitter:image" content={ogImage ?? BASE_OG_IMAGE} />
      </Helmet>
      <main>{children}</main>
    </>
  )
}
```

Actualizar cada página en `src/App.tsx`:

```tsx
function HomePage() {
  return (
    <Page
      description="Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal. Reserva tu cita hoy."
      canonical="https://www.efa-tattoo.com/"
    >
      <Header />
      <HeroSection />
    </Page>
  )
}

function AboutPage() {
  return (
    <Page
      title="Conoce a Enric · Tatuador Fine Line en Barcelona"
      description="Conoce a Enric, tatuador barcelonés con formación médica y más de 7 años especializándose en fine line y microrealismo. Arte con criterio."
      canonical="https://www.efa-tattoo.com/about"
    >
      <Header />
      <AboutContent />
      <FooterStrip />
    </Page>
  )
}

function GalleryPage() {
  return (
    <Page
      title="Galería de Tatuajes · +400 Trabajos"
      description="Más de 400 tatuajes de línea fina, microrealismo, proyectos grandes y retratos de mascotas. Galería del estudio EFA Tattoo Barcelona."
      canonical="https://www.efa-tattoo.com/gallery"
    >
      <Header />
      <PageHeader title="Galería" subtitle="400 trabajos seleccionados" size="half" bg="#141210" />
      <GalleryView />
      <FooterStrip />
    </Page>
  )
}

function TattooPage() {
  return (
    <Page
      title="Reservar Cita · Fine Line Barcelona"
      description="Solicita tu cita de tatuaje en EFA Tattoo Barcelona. Fine line y microrealismo personalizados. Plazas muy limitadas — rellena el formulario."
      canonical="https://www.efa-tattoo.com/tattoo"
    >
      <Header />
      <PageHeader title="Reservar cita" subtitle="Solicitud de sesión" size="half" bg="#1e1c1a" />
      <BookingSection />
      <FooterStrip />
    </Page>
  )
}

function AcademyPageWrapper() {
  return (
    <Page
      title="Seminario Fine Line Barcelona · Formación EFA 2026"
      description="Seminario intensivo de línea fina en Barcelona. 2 días, grupos de 4 alumnos, práctica en piel real. Formación avanzada para tatuadores con experiencia."
      canonical="https://www.efa-tattoo.com/academy"
    >
      <AcademyPage />
    </Page>
  )
}

function NotFoundPage() {
  return (
    <Page title="Página no encontrada">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      ...
    </Page>
  )
}
```

Actualizar el Route de Academy:
```tsx
<Route path="/academy" element={<AcademyPageWrapper />} />
```

---

## PASO 3 — Eliminar canonical hardcodeado del index.html

```html
<!-- index.html — ELIMINAR esta línea -->
<link rel="canonical" href="https://www.efa-tattoo.com/" />

<!-- Y cambiar el title estático a algo neutral (será sobreescrito por Helmet) -->
<title>EFA Tattoo Barcelona</title>

<!-- Y limpiar los OG/Twitter estáticos (serán sobreescritos por Helmet): -->
<!-- Eliminar o dejar solo como fallback para bots sin JS -->
```

---

## PASO 4 — JSON-LD en index.html (homepage — LocalBusiness)

Añadir en `index.html` dentro de `<head>` antes de `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "EFA Tattoo",
  "alternateName": "EFA Tattoo Barcelona",
  "url": "https://www.efa-tattoo.com",
  "image": "https://www.efa-tattoo.com/tattoo_transparent.webp",
  "logo": "https://www.efa-tattoo.com/tattoo_transparent.webp",
  "description": "Estudio de tatuaje especializado en fine line y micro-realismo en Barcelona. Seminarios de formación para artistas.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Còrsega 163",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "postalCode": "08029",
    "addressCountry": "ES"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.3977,
    "longitude": 2.1527
  },
  "sameAs": [
    "https://www.instagram.com/efa_tattoo"
  ],
  "priceRange": "€€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card",
  "areaServed": "Barcelona"
}
</script>
```

---

## PASO 5 — JSON-LD en About (Person)

En `src/components/about/AboutContent.tsx`, añadir al principio del componente:

```tsx
import { Helmet } from 'react-helmet-async'

export default function AboutContent() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Enric",
    "jobTitle": "Tattoo Artist",
    "description": "Tatuador especializado en fine line y micro-realismo en Barcelona, con formación de enfermero y más de 7 años de experiencia.",
    "worksFor": {
      "@type": "Organization",
      "name": "EFA Tattoo",
      "url": "https://www.efa-tattoo.com"
    },
    "url": "https://www.efa-tattoo.com/about",
    "sameAs": ["https://www.instagram.com/efa_tattoo"],
    "knowsAbout": ["Fine line tattoo", "Microrealismo", "Tatuaje Barcelona"]
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <div className="overflow-hidden">
        {/* resto del componente */}
      </div>
    </>
  )
}
```

También cambiar el `<h2>` principal a `<h1>` (`AboutContent.tsx:67`):

```tsx
// ❌ ANTES
<motion.h2
  {...fadeUp}
  transition={{ duration: 0.65, delay: 0.1 }}
  className="text-white uppercase tracking-[0.22em] font-light leading-none"
  ...
>

// ✅ DESPUÉS
<motion.h1
  {...fadeUp}
  transition={{ duration: 0.65, delay: 0.1 }}
  className="text-white uppercase tracking-[0.22em] font-light leading-none"
  ...
>
```

---

## PASO 6 — JSON-LD en Academy (Course + FAQ)

En `src/components/academy/AcademyPage.tsx`, añadir al inicio del componente principal:

```tsx
import { Helmet } from 'react-helmet-async'

// Dentro del componente AcademyPage, antes del return:
const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Seminario Fine Line EFA Tattoo",
  "description": "Formación intensiva presencial de 2 días para tatuadores. Línea fina, microrealismo, práctica en piel real y profesionalización.",
  "url": "https://www.efa-tattoo.com/academy",
  "provider": {
    "@type": "Organization",
    "name": "EFA Tattoo",
    "url": "https://www.efa-tattoo.com"
  },
  "courseMode": "onsite",
  "educationalLevel": "Advanced",
  "teaches": "Fine line tattoo technique, microrealismo, professional tattoo business",
  "numberOfCredits": 2,
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "onsite",
    "location": {
      "@type": "Place",
      "name": "EFA Tattoo Studio",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Carrer Còrsega 163",
        "addressLocality": "Barcelona",
        "addressCountry": "ES"
      }
    }
  }
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿El seminario EFA es para principiantes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, requiere experiencia mínima. No es un curso de iniciación para aprender a tatuar desde cero."
      }
    },
    {
      "@type": "Question",
      "name": "¿Tatúo en piel real durante el seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, todos los alumnos trabajan en modelo real el segundo día bajo supervisión directa de Enric."
      }
    },
    {
      "@type": "Question",
      "name": "¿Debo llevar mi propio material al seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Solo necesitas llevar tu máquina y fuente. El resto del material está incluido: fungibles y caja de agujas FineLine."
      }
    },
    {
      "@type": "Question",
      "name": "¿Se entrega certificado oficial al finalizar el seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, se entrega certificado oficial firmado por EFA Tattoo con reconocimiento de nivel profesional."
      }
    },
    {
      "@type": "Question",
      "name": "¿Tengo acceso al contenido del seminario después?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, tienes acceso indefinido a la grabación del contenido teórico."
      }
    }
  ]
}

return (
  <>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
    {/* resto del componente */}
  </>
)
```

---

## PASO 7 — Sitemap.xml con lastmod

Reemplazar `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.efa-tattoo.com/</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/about</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/gallery</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/tattoo</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/academy</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/privacidad</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
  <url>
    <loc>https://www.efa-tattoo.com/aviso-legal</loc>
    <lastmod>2026-04-16</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.2</priority>
  </url>
</urlset>
```

---

## PASO 8 — Correcciones menores en index.html

```html
<!-- index.html final recomendado -->
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/webp" href="/tattoo_transparent.webp" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Preload de imagen hero para LCP -->
    <link rel="preload" as="image" href="/img/img_1.webp" fetchpriority="high" />
    <!-- Meta base (Helmet las sobreescribe por ruta) -->
    <meta name="description" content="Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal." />
    <!-- OG base fallback -->
    <meta property="og:title" content="EFA Tattoo Barcelona · Fine Line & Microrealismo · Enric" />
    <meta property="og:description" content="Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.efa-tattoo.com/" />
    <meta property="og:image" content="https://www.efa-tattoo.com/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="EFA Tattoo Barcelona · Fine Line & Microrealismo" />
    <meta name="twitter:description" content="Enric, tatuador fine line y micro-realismo en Barcelona." />
    <meta name="twitter:image" content="https://www.efa-tattoo.com/og-image.jpg" />
    <!-- SEO local Barcelona -->
    <meta name="geo.region" content="ES-CT" />
    <meta name="geo.placename" content="Barcelona" />
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
    <!-- JSON-LD LocalBusiness -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TattooParlor",
      "name": "EFA Tattoo",
      "url": "https://www.efa-tattoo.com",
      "image": "https://www.efa-tattoo.com/og-image.jpg",
      "description": "Estudio de tatuaje especializado en fine line y micro-realismo en Barcelona.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Carrer Còrsega 163",
        "addressLocality": "Barcelona",
        "addressRegion": "Cataluña",
        "addressCountry": "ES"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 41.3977,
        "longitude": 2.1527
      },
      "sameAs": ["https://www.instagram.com/efa_tattoo"],
      "priceRange": "€€€"
    }
    </script>
    <title>EFA Tattoo Barcelona · Fine Line & Microrealismo · Enric</title>
  </head>
  <body>
    <noscript>
      <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=135320694773663&ev=PageView&noscript=1" />
    </noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## PASO 9 — Prerender estático (opcional pero muy recomendado)

Si se quiere prerender sin migrar de framework:

```bash
npm install vite-plugin-prerender -D
```

```ts
// vite.config.ts
import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import prerender from "vite-plugin-prerender"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/", "/about", "/gallery", "/tattoo", "/academy", "/privacidad", "/aviso-legal"],
      renderer: new prerender.PuppeteerRenderer({
        renderAfterDocumentEvent: "render-event",
        headless: true,
      }),
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
```

Y en `src/main.tsx`, emitir el evento cuando la app esté lista:

```tsx
ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
)

// Notificar al prerenderizador
document.dispatchEvent(new Event("render-event"))
```

---

## PASO 10 — Corrección alt text en AboutContent

**Archivo:** `src/components/about/AboutContent.tsx:114`

```tsx
// ❌ ANTES
alt="Studio setup details"

// ✅ DESPUÉS
alt="Configuración del estudio EFA Tattoo — Barcelona"
```

---

## Checklist de validación post-implementación

- [ ] `npm run build` sin errores
- [ ] Abrir `/about` en DevTools → inspeccionar `<head>` → verificar title y canonical correctos
- [ ] Abrir `/academy` en DevTools → inspeccionar `<head>` → verificar title y JSON-LD
- [ ] Probar preview de enlace en Telegram/WhatsApp con URL de página interior (verifica OG tags)
- [ ] Validar JSON-LD en https://validator.schema.org/
- [ ] Validar OG tags en https://developers.facebook.com/tools/debug/
- [ ] Validar Twitter Card en https://cards-dev.twitter.com/validator
- [ ] Enviar sitemap en Google Search Console
- [ ] Ejecutar Lighthouse (Performance + SEO) en cada página principal
- [ ] Verificar que Google puede indexar correctamente en Search Console → Inspección de URL

---

*Generado por SearchFit SEO plugin · https://searchfit.ai*
