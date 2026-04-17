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
import PageHeader from "@/components/shared/PageHeader";
import BookingSection from "@/components/tattoo/BookingSection";

const BASE_URL = "https://www.efa-tattoo.com";
const OG_IMAGE = `${BASE_URL}/og-banner.jpg`;

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
      <meta property="og:type" content="website" />
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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={OG_IMAGE} />
      {canonical && <link rel="alternate" hrefLang="es" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}
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

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "TattooParlor"],
      "@id": `${BASE_URL}/#business`,
      name: "EFA Tattoo",
      url: BASE_URL,
      logo: OG_IMAGE,
      image: OG_IMAGE,
      description: "Estudio de tatuaje especializado en fine line y microrealismo en Barcelona. Tatuador Enric, más de 7 años de experiencia.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Barcelona",
        addressRegion: "Cataluña",
        addressCountry: "ES",
      },
      geo: { "@type": "GeoCoordinates", latitude: 41.3851, longitude: 2.1734 },
      sameAs: ["https://www.instagram.com/efa_tattoo"],
      priceRange: "€€€",
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "10:00", closes: "19:00" },
      ],
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", bestRating: "5", reviewCount: "7" },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "EFA Tattoo Barcelona",
      description: "Estudio de tatuaje fine line y microrealismo en Barcelona — Enric",
      inLanguage: ["es", "en"],
    },
  ],
};

const tattooSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/tattoo#service`,
  name: "Tatuaje Fine Line y Microrealismo en Barcelona",
  serviceType: "Tattoo Studio",
  provider: { "@type": "LocalBusiness", name: "EFA Tattoo", url: BASE_URL },
  areaServed: { "@type": "City", name: "Barcelona" },
  description: "Servicio de tatuaje personalizado especializado en fine line, microrealismo y proyectos grandes. Reserva tu cita de forma online.",
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
  author: {
    "@type": "Person",
    name: "Enric",
    jobTitle: "Tattoo Artist",
    worksFor: { "@type": "Organization", name: "EFA Tattoo" },
  },
};


function HomePage() {
  return (
    <Page
      description="Enric, tatuador fine line y micro-realismo en Barcelona. Diseños únicos, precisión técnica y conexión personal. Reserva tu cita hoy."
      canonical={`${BASE_URL}/`}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
      </Helmet>
      <Header />
      <HeroSection />
      <FooterStrip />
    </Page>
  );
}

function AboutPage() {
  return (
    <Page
      title="Conoce a Enric · Tatuador Fine Line en Barcelona"
      description="Conoce a Enric, tatuador barcelonés con formación médica y más de 7 años especializándose en fine line y microrealismo. Arte con criterio."
      canonical={`${BASE_URL}/about`}
    >
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
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(gallerySchema)}</script>
      </Helmet>
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
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(tattooSchema)}</script>
      </Helmet>
      <Header />
      <PageHeader
        title={t("pages.tattooTitle")}
        subtitle={t("pages.tattooSubtitle")}
        size="half"
        bg="#1e1c1a"
      />
      <BookingSection />
      <FooterStrip />
    </Page>
  );
}

function AcademyPageWrapper() {
  return (
    <Page
      title="Seminario Fine Line Barcelona · Formación EFA 2026"
      description="Seminario intensivo de línea fina en Barcelona. 2 días, grupos de 4 alumnos, práctica en piel real. Formación avanzada para tatuadores con experiencia."
      canonical={`${BASE_URL}/academy`}
    >
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
