# SEO Audit Report — EFA Tattoo Web

**Site:** https://www.efa-tattoo.com  
**Framework:** Vite + React 19 + React Router DOM (SPA puro)  
**Fecha de auditoría:** 2026-04-16  
**Páginas analizadas:** 7 (/, /about, /gallery, /tattoo, /academy, /privacidad, /aviso-legal)  
**Puntuación global: 42 / 100**

---

## Resumen ejecutivo

El mayor problema de este sitio es **estructural**: es una SPA (Single Page Application) renderizada completamente en el cliente con Vite + React Router. Esto significa que cuando Google (o cualquier crawler) accede a `/about`, `/gallery` o `/academy`, recibe exactamente el mismo HTML vacío que para `/`. Todo el contenido, títulos y meta tags se inyectan vía JavaScript después de la carga. Google puede ejecutar JS eventualmente, pero:

- El canonical hardcodeado en `index.html` apunta **siempre** a la homepage, sin importar la ruta → todas las páginas se canonizan a `/`.
- La meta description es **idéntica** para las 7 páginas.
- Los títulos de página se setean vía `document.title` en `useEffect` (JS-dependiente, invisible en el HTML inicial).
- No existe ningún dato estructurado (JSON-LD).

Sin resolver el problema de renderizado, el resto de mejoras tienen impacto limitado.

---

## Puntuaciones por categoría

| Categoría | Puntuación | Estado |
|---|---|---|
| Rastreabilidad e indexación | 25/100 | 🔴 Crítico |
| Meta tags y `<head>` | 30/100 | 🔴 Crítico |
| Estructura de encabezados | 55/100 | 🟡 Advertencia |
| Imágenes | 78/100 | 🟢 Bueno |
| Rendimiento | 62/100 | 🟡 Advertencia |
| Datos estructurados | 0/100 | 🔴 Crítico |
| Enlazado interno | 68/100 | 🟡 Advertencia |
| Mobile y accesibilidad | 72/100 | 🟡 Advertencia |

---

## Problemas críticos (deben corregirse)

### C1 — SPA sin SSR/SSG: el crawler recibe HTML vacío
**Archivo:** `index.html`, `src/main.tsx`  
**Impacto:** Muy alto — afecta a todas las páginas

El servidor sirve siempre el mismo `index.html` con `<div id="root"></div>`. El contenido real se pinta solo tras ejecutar el bundle JS. Aunque Googlebot renderiza JS, lo hace con retraso (días/semanas en sitios nuevos) y otros bots (Bing, Facebook, WhatsApp preview, LinkedIn) no lo ejecutan en absoluto.

**Solución recomendada:** Migrar a React Router con prerender estático en build time, o añadir `vite-plugin-ssg` / `vite-plugin-prerender`:

```bash
npm install vite-plugin-prerender -D
```

```ts
// vite.config.ts
import prerender from 'vite-plugin-prerender'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    prerender({
      staticDir: 'dist',
      routes: ['/', '/about', '/gallery', '/tattoo', '/academy', '/privacidad', '/aviso-legal'],
    }),
  ],
})
```

O migrar a un framework con SSR nativo (Remix, Next.js, Astro).

---

### C2 — Canonical hardcodeado a la homepage en todas las páginas
**Archivo:** `index.html:13`  
**Impacto:** Muy alto — le dice a Google que todas las páginas son duplicados de `/`

```html
<!-- ❌ Actualmente: todas las páginas tienen este canonical -->
<link rel="canonical" href="https://www.efa-tattoo.com/" />
```

El canonical debe cambiar dinámicamente según la ruta. Con prerender, cada página generada debe tener su propio canonical. Sin prerender, hay que hacerlo vía JS (react-helmet-async):

```tsx
// src/App.tsx — añadir en cada <Page>
import { Helmet } from 'react-helmet-async'

function GalleryPage() {
  return (
    <Page title="Galería de Tatuajes | EFA Tattoo Barcelona">
      <Helmet>
        <link rel="canonical" href="https://www.efa-tattoo.com/gallery" />
        <meta name="description" content="Más de 400 trabajos de tatuaje de Enric: línea fina, microrealismo y proyectos grandes en Barcelona." />
      </Helmet>
      ...
    </Page>
  )
}
```

---

### C3 — Meta description idéntica para todas las páginas
**Archivo:** `index.html:8-11`  
**Impacto:** Alto — Google ignora o penaliza descripciones duplicadas

```html
<!-- ❌ Actualmente: misma descripción para las 7 páginas -->
<meta name="description" content="Enric — tatuador especializado en fine line y micro-realismo en Barcelona. Seminarios de formación para artistas." />
```

Cada página necesita su propia descripción única y orientada a conversión (150-160 caracteres):

| Página | Meta description propuesta |
|---|---|
| `/` | `Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal. Reserva tu cita hoy.` |
| `/about` | `Conoce a Enric, tatuador barcelonés con formación médica y más de 7 años especializándose en fine line y microrealismo. Arte con criterio.` |
| `/gallery` | `Más de 400 tatuajes de línea fina, microrealismo, proyectos grandes y retratos de mascotas. Galería del estudio EFA Tattoo Barcelona.` |
| `/tattoo` | `Solicita tu cita de tatuaje en EFA Tattoo Barcelona. Fine line y microrealismo personalizados. Plazas muy limitadas — rellena el formulario.` |
| `/academy` | `Seminario intensivo de línea fina en Barcelona. 2 días, grupos de 4 alumnos, práctica en piel real. Formación avanzada para tatuadores con experiencia.` |
| `/privacidad` | `Política de privacidad de EFA Tattoo. Información sobre el tratamiento de datos personales conforme al RGPD.` |
| `/aviso-legal` | `Aviso legal de EFA Tattoo Barcelona. Condiciones de uso del sitio web, propiedad intelectual y normativa aplicable.` |

---

### C4 — Título de página demasiado corto y genérico
**Archivo:** `index.html:32`, `src/App.tsx:17-18`  
**Impacto:** Alto — el title es el factor on-page más importante

```html
<!-- ❌ Actualmente: 16 caracteres, sin keyword de intención de búsqueda -->
<title>EFA Tattoo - Enric</title>
```

Títulos propuestos (50-60 caracteres):

| Página | Title propuesto |
|---|---|
| `/` | `EFA Tattoo Barcelona · Fine Line & Microrealismo · Enric` |
| `/about` | `Conoce a Enric · Tatuador Fine Line en Barcelona · EFA` |
| `/gallery` | `Galería de Tatuajes · +400 Trabajos · EFA Tattoo Barcelona` |
| `/tattoo` | `Reservar Cita · EFA Tattoo Fine Line Barcelona` |
| `/academy` | `Seminario Fine Line Barcelona · Formación EFA Tattoo 2026` |
| `/privacidad` | `Política de Privacidad · EFA Tattoo` |
| `/aviso-legal` | `Aviso Legal · EFA Tattoo Barcelona` |

---

### C5 — Sin datos estructurados (JSON-LD): cero
**Archivo:** `index.html` (ausencia total)  
**Impacto:** Alto — pierde rich snippets, featured snippets y visibilidad local

El sitio no tiene ningún schema markup. Como mínimo necesita:

**LocalBusiness / TattooParlor (`index.html` o página home):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TattooParlor",
  "name": "EFA Tattoo",
  "url": "https://www.efa-tattoo.com",
  "image": "https://www.efa-tattoo.com/tattoo_transparent.webp",
  "description": "Estudio de tatuaje especializado en fine line y micro-realismo en Barcelona.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Carrer Còrsega 167",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
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
  "priceRange": "€€€"
}
</script>
```

**Person / Artist (página `/about`):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Enric",
  "jobTitle": "Tattoo Artist",
  "worksFor": { "@type": "Organization", "name": "EFA Tattoo" },
  "url": "https://www.efa-tattoo.com/about",
  "description": "Tatuador especializado en fine line y micro-realismo en Barcelona, con formación médica."
}
</script>
```

**Course / Event (página `/academy`):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Seminario Fine Line EFA Tattoo",
  "description": "Formación intensiva presencial de 2 días para tatuadores. Línea fina, microrealismo y profesionalización.",
  "provider": {
    "@type": "Organization",
    "name": "EFA Tattoo",
    "url": "https://www.efa-tattoo.com"
  },
  "courseMode": "onsite",
  "locationCreated": {
    "@type": "Place",
    "name": "EFA Tattoo Studio",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrer Còrsega 167",
      "addressLocality": "Barcelona",
      "addressCountry": "ES"
    }
  }
}
</script>
```

**FAQPage (página `/academy`):** Ver sección de oportunidades.

---

### C6 — La página `/academy` no establece `document.title`
**Archivo:** `src/App.tsx:121-136`, `src/components/academy/AcademyPage.tsx`  
**Impacto:** Medio-alto — la pestaña del navegador y el title en SERP muestran "EFA Tattoo"

`AcademyPage` se renderiza directamente sin estar envuelta en `<Page title="...">`. Es el único caso así en el routing.

```tsx
// src/App.tsx — ANTES
<Route path="/academy" element={<AcademyPage />} />

// DESPUÉS — envolver en Page con título
function AcademyPageWrapper() {
  const { t } = useTranslation()
  return (
    <Page title="Seminario Fine Line Barcelona · EFA Tattoo 2026">
      <AcademyPage />
    </Page>
  )
}
<Route path="/academy" element={<AcademyPageWrapper />} />
```

Pero ojo: si el componente ya tiene `<Header />` y `<FooterStrip />` internamente, envolver en `<Page>` añadiría un `<main>` extra. Revisar la estructura al implementar.

---

### C7 — OG tags y Twitter Card son estáticos e idénticos para todas las páginas
**Archivo:** `index.html:14-26`  
**Impacto:** Alto — previews en redes sociales incorrectos para páginas internas

```html
<!-- ❌ og:url siempre apunta a la homepage -->
<meta property="og:url" content="https://www.efa-tattoo.com/" />
```

Además falta `twitter:image`. Cada página necesita sus propios OG tags. Usar `react-helmet-async` para gestionarlos dinámicamente.

---

## Advertencias (deberían corregirse)

### W1 — La página `/about` no tiene `<h1>`
**Archivo:** `src/components/about/AboutContent.tsx:67`

`AboutContent` usa `<h2>` para "Conoce a Enric". Al ser la única ruta que no pasa por `PageHeader`, es la única página sin `<h1>`. Cambiar a `<h1>` el primer heading visible de la sección About.

```tsx
// ❌ AboutContent.tsx:67
<motion.h2 ...>
  {t("about.title")}
</motion.h2>

// ✅ Cambiar a h1
<motion.h1 ...>
  {t("about.title")}
</motion.h1>
```

---

### W2 — H1 de la homepage demasiado genérico
**Archivo:** `src/components/home/HeroSection.tsx:52`

```tsx
// ❌ "EFA Tattoo" — nombre de marca sin keyword
<motion.h1 ...>EFA Tattoo</motion.h1>
```

Opciones: mantener el nombre pero añadir un subtítulo visible con keyword como segundo elemento de peso. El `<p>` con `t("hero.tagline")` ("Barcelona · Fine Line · Micro-realismo") existe pero con `aria-hidden` implícito. Asegurarse de que sea accesible y visible para crawlers.

---

### W3 — Alt text hardcodeado en inglés en About
**Archivo:** `src/components/about/AboutContent.tsx:114`

```tsx
// ❌ No traducido
alt="Studio setup details"

// ✅ Usar texto descriptivo en español o la clave i18n correspondiente
alt="Configuración del estudio — EFA Tattoo Barcelona"
```

---

### W4 — Sitemap.xml sin fechas de última modificación
**Archivo:** `public/sitemap.xml`

```xml
<!-- ❌ Sin <lastmod> -->
<url>
  <loc>https://www.efa-tattoo.com/gallery</loc>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>

<!-- ✅ Añadir lastmod -->
<url>
  <loc>https://www.efa-tattoo.com/gallery</loc>
  <lastmod>2026-04-16</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>
```

---

### W5 — Sin hreflang para contenido bilingüe ES/EN
**Archivo:** `index.html`, `src/i18n/`

El sitio tiene traducciones ES/EN (i18next) pero las URLs no cambian con el idioma y no hay `<link rel="alternate" hreflang>`. Si hay intención de posicionar en inglés, se debe:
1. Añadir rutas separadas (`/en/`, `/en/gallery`, etc.) o usar subdominios.
2. Añadir tags `hreflang` en el `<head>`.

Si no hay intención de SEO en inglés, eliminar la traducción o mantenerla solo para UX.

---

### W6 — Google Fonts carga de manera potencialmente bloqueante
**Archivo:** `index.html:27-33`

```html
<!-- Puede bloquear el First Contentful Paint -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
```

La fuente usa `display=swap` ✅ (ya incluido en la URL), pero para evitar layout shifts, añadir `font-display: optional` si la fuente no es crítica para el branding. Lo que falta es añadir `crossorigin` al primer preconnect:

```html
<!-- ✅ Añadir crossorigin al segundo preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
```

---

### W7 — Página 404 sin `noindex`
**Archivo:** `src/App.tsx:99-118`

La ruta `path="*"` renderiza `NotFoundPage` pero no previene su indexación:

```tsx
// ✅ Añadir en NotFoundPage (con react-helmet-async)
<Helmet>
  <meta name="robots" content="noindex, follow" />
</Helmet>
```

---

### W8 — Título y descripción del `og:image` usan imagen con fondo transparente
**Archivo:** `index.html:19`

```html
<meta property="og:image" content="https://www.efa-tattoo.com/tattoo_transparent.webp" />
```

Una imagen con transparencia puede mostrarse con fondo negro o blanco según la plataforma. Se recomienda una imagen OG dedicada de 1200×630px con fondo sólido y el logo/foto de Enric con texto.

---

### W9 — Sin `twitter:image`
**Archivo:** `index.html`

Existe `twitter:card`, `twitter:title` y `twitter:description`, pero falta `twitter:image`:

```html
<meta name="twitter:image" content="https://www.efa-tattoo.com/og-image.jpg" />
```

---

## Oportunidades (nice to have)

### O1 — Schema FAQPage para la Academia
La sección FAQ de `/academy` es perfecta para un rich snippet de preguntas frecuentes en Google:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿El seminario es para principiantes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, requiere experiencia mínima. No es un curso de iniciación."
      }
    },
    {
      "@type": "Question",
      "name": "¿Tatúo sí o sí en el seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, todos los alumnos trabajan en modelo real el segundo día."
      }
    },
    {
      "@type": "Question",
      "name": "¿Debo llevar mi material al seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Solo máquina y fuente. El resto lo incluye el estudio: materiales fungibles y caja de agujas FineLine."
      }
    },
    {
      "@type": "Question",
      "name": "¿Se entrega certificado oficial?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, certificado firmado por EFA Tattoo con reconocimiento real de nivel profesional."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo acceder al contenido después del seminario?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, acceso indefinido a la grabación del contenido."
      }
    }
  ]
}
</script>
```

---

### O2 — Metatags de geolocalización para SEO local
Para mejorar el posicionamiento en búsquedas locales de Barcelona:

```html
<meta name="geo.region" content="ES-CT" />
<meta name="geo.placename" content="Barcelona" />
<meta name="geo.position" content="41.3977;2.1527" />
<meta name="ICBM" content="41.3977, 2.1527" />
```

---

### O3 — BreadcrumbList schema
Para páginas de segundo nivel, añadir breadcrumb schema:

```html
<!-- Ejemplo para /academy -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.efa-tattoo.com/" },
    { "@type": "ListItem", "position": 2, "name": "Academy", "item": "https://www.efa-tattoo.com/academy" }
  ]
}
</script>
```

---

### O4 — Añadir `<link rel="preload">` para la imagen hero
La imagen hero (`/img/img_1.webp`) es el LCP (Largest Contentful Paint) de la homepage. Añadir preload mejora el Core Web Vital:

```html
<link rel="preload" as="image" href="/img/img_1.webp" fetchpriority="high" />
```

---

### O5 — Imagen OG dedicada (1200×630px)
Crear una imagen específica para compartir en redes con: foto de tatuaje + logo EFA Tattoo + "Barcelona · Fine Line · Microrealismo". Guardar como `/public/og-image.jpg`.

---

### O6 — Añadir enlazado interno contextual
Actualmente las páginas tienen pocos enlaces internos contextuales. Algunos candidatos:
- En `/about`, el texto menciona la Academy → enlazar a `/academy`
- En `/gallery`, añadir CTA a `/tattoo` (ya existe en FooterStrip)
- En `/tattoo`, enlazar al `/about` para reforzar confianza
- En `/academy`, el texto de "estudio" puede enlazar a `/about`

---

### O7 — Añadir `robots.txt` más completo
El actual es correcto pero mínimo. Añadir referencia explícita a rutas de sistema:

```
User-agent: *
Allow: /

# Disallow admin/assets que no necesitan indexación
Disallow: /src/
Disallow: /*.json$

Sitemap: https://www.efa-tattoo.com/sitemap.xml
```

---

## Lo que está bien ✅

- **robots.txt** existe y no bloquea páginas importantes
- **sitemap.xml** existe con las 7 rutas principales, prioridades y changefreq correctos
- **lang="es"** en `<html>` correcto
- **charset UTF-8** declarado
- **viewport meta** presente y correcto
- **preconnect** a Google Fonts declarado
- **OG tags base** presentes (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`)
- **Twitter Card** base presente (`summary_large_image`)
- **Todas las imágenes son WebP** (formato moderno)
- **Imágenes de galería** tienen `width` y `height` (evita CLS) + `loading="lazy"` + `fetchPriority`
- **EAGER loading** en las primeras 3 imágenes de galería
- **Alt texts** en imágenes de galería generados dinámicamente con número y categoría
- **`lang` attr** presente en `<html lang="es">`
- **Favicon** presente
- **Cookie consent** implementado antes de cargar tracking

---

## Resumen de acciones por prioridad

| # | Acción | Prioridad | Esfuerzo |
|---|---|---|---|
| 1 | Implementar prerender estático (vite-plugin-prerender) | 🔴 Crítica | Alto |
| 2 | Canonical dinámico por página (react-helmet-async) | 🔴 Crítica | Medio |
| 3 | Meta description única por página | 🔴 Crítica | Bajo |
| 4 | Title tag único y rico en keywords por página | 🔴 Crítica | Bajo |
| 5 | JSON-LD LocalBusiness en homepage | 🔴 Crítica | Bajo |
| 6 | Envolver AcademyPage en `<Page title="...">` | 🔴 Crítica | Bajo |
| 7 | `<h1>` en página About | 🟡 Alta | Bajo |
| 8 | OG tags dinámicos por página | 🟡 Alta | Bajo |
| 9 | `twitter:image` | 🟡 Alta | Bajo |
| 10 | JSON-LD Course + FAQ en /academy | 🟡 Alta | Bajo |
| 11 | JSON-LD Person en /about | 🟡 Alta | Bajo |
| 12 | `lastmod` en sitemap.xml | 🟡 Media | Bajo |
| 13 | Alt text corregido en /about | 🟡 Media | Bajo |
| 14 | `noindex` en página 404 | 🟡 Media | Bajo |
| 15 | Imagen OG dedicada 1200×630 | 🟢 Baja | Medio |
| 16 | Metatags de geolocalización | 🟢 Baja | Bajo |
| 17 | BreadcrumbList schema | 🟢 Baja | Bajo |
| 18 | Preload imagen hero | 🟢 Baja | Bajo |
| 19 | hreflang si SEO en inglés es objetivo | 🟢 Baja | Alto |

---

*Auditoría realizada con SearchFit SEO plugin · Para monitorización continua: https://searchfit.ai*
