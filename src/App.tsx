import { type ReactNode, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AboutContent from "@/components/about/AboutContent";
import AcademyPage from "@/components/academy/AcademyPage";
import GalleryView from "@/components/gallery/GalleryView";
import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
import AvisoLegalPage from "@/components/legal/AvisoLegalPage";
import PrivacidadPage from "@/components/legal/PrivacidadPage";
import CookieBanner from "@/components/shared/CookieBanner";
import FooterStrip from "@/components/shared/FooterStrip";
import LocationSection from "@/components/shared/LocationSection";
import PageHeader from "@/components/shared/PageHeader";
import BookingSection from "@/components/tattoo/BookingSection";
import TattooCarePage from "@/components/tattoo/TattooCarePage";

const BASE_URL = "https://www.efa-tattoo.com";
const OG_IMAGE = `${BASE_URL}/og-banner.jpg`;
const STREET_ADDRESS = "Carrer Còrsega 163";

interface PageSEO {
  title?: string;
  description?: string;
  canonical?: string;
  children: ReactNode;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function SEOMeta({ title, description, canonical }: Omit<PageSEO, "children">) {
  const fullTitle = title
    ? `${title} · EFA Tattoo Barcelona`
    : "EFA Tattoo Barcelona · Fine Line & Microrealismo · Enric";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta property="og:site_name" content="EFA Tattoo Barcelona" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="EFA Tattoo Barcelona — Fine Line & Microrealismo" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}

function Page({ title, description, canonical, children }: PageSEO) {
  return (
    <>
      <SEOMeta title={title} description={description} canonical={canonical} />
      <main>{children}</main>
    </>
  );
}

// Para páginas que ya tienen su propio <main> (legales, academy)
function PageShell({ title, description, canonical, children }: PageSEO) {
  return (
    <>
      <SEOMeta title={title} description={description} canonical={canonical} />
      {children}
    </>
  );
}

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────

/**
 * Key pages, in the order we want Google to weigh them for sitelinks. Feeds both the
 * SiteNavigationElement graph and each page's breadcrumb trail, so the site structure
 * is described identically everywhere.
 */
const SITE_PAGES = [
  {
    name: "Reservar cita",
    path: "/tattoo",
    description: "Solicita tu cita de tatuaje fine line o microrealismo en Barcelona.",
  },
  {
    name: "Galería",
    path: "/gallery",
    description: "Más de 400 tatuajes de línea fina, microrealismo y retratos de mascotas.",
  },
  {
    name: "Academia",
    path: "/academy",
    description: "Seminario intensivo de línea fina en Barcelona para tatuadores con experiencia.",
  },
  {
    name: "Sobre Enric",
    path: "/about",
    description: "Conoce a Enric, tatuador fine line y microrealismo en Barcelona.",
  },
  {
    name: "Cuidados del tatuaje",
    path: "/cuidados-tatuaje",
    description: "Guía de cuidados para que tu tatuaje fine line cure correctamente.",
  },
];

function JsonLd({ data }: { data: object }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

/** Breadcrumb trail (Inicio › página) — the structural signal behind search sitelinks. */
function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${BASE_URL}${path}` },
    ],
  };
}

const businessNode = {
  "@type": ["LocalBusiness", "TattooParlor"],
  "@id": `${BASE_URL}/#business`,
  name: "EFA Tattoo",
  url: BASE_URL,
  logo: OG_IMAGE,
  image: OG_IMAGE,
  description:
    "Estudio de tatuaje especializado en fine line y microrealismo en Barcelona. Tatuador Enric, más de 7 años de experiencia.",
  address: {
    "@type": "PostalAddress",
    streetAddress: STREET_ADDRESS,
    addressLocality: "Barcelona",
    addressRegion: "Cataluña",
    addressCountry: "ES",
  },
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${STREET_ADDRESS}, Barcelona`,
  )}`,
  sameAs: ["https://www.instagram.com/efa_tattoo"],
  priceRange: "€€€",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    businessNode,
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "EFA Tattoo Barcelona",
      description: "Estudio de tatuaje fine line y microrealismo en Barcelona — Enric",
      inLanguage: ["es", "en"],
      publisher: { "@id": `${BASE_URL}/#business` },
    },
    ...SITE_PAGES.map((page, index) => ({
      "@type": "SiteNavigationElement",
      "@id": `${BASE_URL}/#nav-${page.path.slice(1)}`,
      position: index + 1,
      name: page.name,
      description: page.description,
      url: `${BASE_URL}${page.path}`,
      isPartOf: { "@id": `${BASE_URL}/#website` },
    })),
  ],
};

const tattooSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/tattoo#service`,
  name: "Tatuaje Fine Line y Microrealismo en Barcelona",
  serviceType: "Tattoo Studio",
  provider: { "@id": `${BASE_URL}/#business` },
  areaServed: { "@type": "City", name: "Barcelona" },
  description:
    "Servicio de tatuaje personalizado especializado en fine line, microrealismo y proyectos grandes. Reserva tu cita de forma online.",
  url: `${BASE_URL}/tattoo`,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "EUR",
    eligibleRegion: { "@type": "Country", name: "ES" },
  },
};

const gallerySchema = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Galería de Tatuajes EFA Tattoo — +400 Trabajos",
  description: "Galería de más de 400 tatuajes: fine line, microrealismo, proyectos grandes y retratos de mascotas realizados en el estudio EFA Tattoo Barcelona.",
  url: `${BASE_URL}/gallery`,
  author: { "@id": `${BASE_URL}/#enric` },
};

const tattooCareSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${BASE_URL}/cuidados-tatuaje#article`,
  headline: "Cuidados del tatuaje · Guía Fine Line",
  description:
    "Guía de cuidados para que tu tatuaje fine line cure correctamente: lavado, hidratación, señales de alarma y qué evitar.",
  url: `${BASE_URL}/cuidados-tatuaje`,
  inLanguage: "es",
  author: { "@id": `${BASE_URL}/#enric` },
  publisher: { "@id": `${BASE_URL}/#business` },
};


function HomePage() {
  return (
    <Page
      description="Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal. Reserva tu cita hoy."
      canonical={`${BASE_URL}/`}
    >
      <JsonLd data={homeSchema} />
      <Header />
      <HeroSection />
      <FooterStrip />
    </Page>
  );
}

function AboutPage() {
  return (
    <Page
      title="Enric · Tatuador Fine Line Barcelona"
      description="Conoce a Enric, tatuador barcelonés con formación médica y más de 7 años especializándose en fine line y microrealismo. Arte con criterio."
      canonical={`${BASE_URL}/about`}
    >
      <JsonLd data={breadcrumbSchema("Sobre Enric", "/about")} />
      <Header />
      <AboutContent />
      <FooterStrip />
    </Page>
  );
}

function GalleryPage() {
  const { t } = useTranslation();
  return (
    <Page
      title="Galería de Tatuajes · +400 Trabajos"
      description="Más de 400 tatuajes de línea fina, microrealismo, proyectos grandes y retratos de mascotas. Galería del estudio EFA Tattoo Barcelona."
      canonical={`${BASE_URL}/gallery`}
    >
      <JsonLd data={gallerySchema} />
      <JsonLd data={breadcrumbSchema("Galería", "/gallery")} />
      <Header />
      <PageHeader
        title={t("pages.galleryTitle")}
        subtitle={t("pages.gallerySubtitle")}
        size="half"
        bg="#141210"
      />
      <GalleryView />
      <FooterStrip />
    </Page>
  );
}

function TattooPage() {
  const { t } = useTranslation();
  return (
    <Page
      title="Reservar Cita · Fine Line Barcelona"
      description="Solicita tu cita de tatuaje en EFA Tattoo Barcelona. Fine line y microrealismo personalizados. Plazas muy limitadas — rellena el formulario."
      canonical={`${BASE_URL}/tattoo`}
    >
      <JsonLd data={tattooSchema} />
      <JsonLd data={breadcrumbSchema("Reservar cita", "/tattoo")} />
      <Header />
      <PageHeader
        title={t("pages.tattooTitle")}
        subtitle={t("pages.tattooSubtitle")}
        size="half"
        bg="#1e1c1a"
      />
      <BookingSection />
      <LocationSection copyPrefix="booking" />
      <FooterStrip />
    </Page>
  );
}

function AcademyPageWrapper() {
  return (
    <Page
      title="Seminario Fine Line Barcelona 2026"
      description="Seminario intensivo de línea fina en Barcelona. 2 días, grupos de 4 alumnos, práctica en piel real. Formación avanzada para tatuadores con experiencia."
      canonical={`${BASE_URL}/academy`}
    >
      <JsonLd data={breadcrumbSchema("Academia", "/academy")} />
      <AcademyPage />
    </Page>
  );
}

function PrivacidadPageWrapper() {
  return (
    <PageShell
      title="Política de Privacidad"
      description="Política de privacidad de EFA Tattoo. Información sobre el tratamiento de datos personales conforme al RGPD."
      canonical={`${BASE_URL}/privacidad`}
    >
      <PrivacidadPage />
    </PageShell>
  );
}

function AvisoLegalPageWrapper() {
  return (
    <PageShell
      title="Aviso Legal"
      description="Aviso legal de EFA Tattoo Barcelona. Condiciones de uso del sitio web, propiedad intelectual y normativa aplicable."
      canonical={`${BASE_URL}/aviso-legal`}
    >
      <AvisoLegalPage />
    </PageShell>
  );
}

function TattooCarePageWrapper() {
  return (
    <PageShell
      title="Cuidados del Tatuaje · Guía Fine Line"
      description="Cómo cuidar tu tatuaje fine line día a día: lavado, hidratación, qué evitar durante la cicatrización y señales de alarma. Guía de EFA Tattoo Barcelona."
      canonical={`${BASE_URL}/cuidados-tatuaje`}
    >
      <JsonLd data={tattooCareSchema} />
      <JsonLd data={breadcrumbSchema("Cuidados del tatuaje", "/cuidados-tatuaje")} />
      <TattooCarePage />
    </PageShell>
  );
}

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Page title="Página no encontrada">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <PageHeader title={t("pages.notFoundTitle")} subtitle={t("pages.notFoundSubtitle")} size="half" bg="#1e1c1a" />
      <section className="px-[4vw] py-16 max-w-[1445px] mx-auto">
        <p className="text-white/45 text-sm tracking-wide">
          {t("pages.notFoundText")}
        </p>
        <Link
          to="/"
          className="mt-8 inline-block text-white/60 text-[0.65rem] tracking-[0.35em] uppercase border-b border-white/20 pb-2 hover:text-white hover:border-white/60 transition-colors"
        >
          {t("pages.notFoundLink")}
        </Link>
      </section>
      <FooterStrip />
    </Page>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <CookieBanner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/tattoo" element={<TattooPage />} />
        <Route path="/academy" element={<AcademyPageWrapper />} />
        <Route path="/privacidad" element={<PrivacidadPageWrapper />} />
        <Route path="/aviso-legal" element={<AvisoLegalPageWrapper />} />
        <Route path="/cuidados-tatuaje" element={<TattooCarePageWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
