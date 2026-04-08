import { useEffect, type ReactNode } from "react";
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

function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | EFA Tattoo` : "EFA Tattoo";
  }, [title]);
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

function Page({ title, children }: { title?: string; children: ReactNode }) {
  useDocumentTitle(title);
  return <main>{children}</main>;
}

function HomePage() {
  return (
    <Page>
      <Header />
      <HeroSection />
    </Page>
  );
}

function AboutPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("pages.aboutTitle")}>
      <Header />
      <AboutContent />
      <FooterStrip />
    </Page>
  );
}

function GalleryPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("pages.galleryTitle")}>
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
    <Page title={t("pages.tattooTitle")}>
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

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Page title={t("pages.notFoundTitle")}>
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
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
        <Route path="/aviso-legal" element={<AvisoLegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
