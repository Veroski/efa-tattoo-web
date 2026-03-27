import { useEffect, type ReactNode } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AboutContent from "@/components/about/AboutContent";
import AcademyPage from "@/components/academy/AcademyPage";
import GalleryView from "@/components/gallery/GalleryView";
import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
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
  return (
    <Page title="Meet Enric">
      <Header />
      <AboutContent />
      <FooterStrip />
    </Page>
  );
}

function GalleryPage() {
  return (
    <Page title="Galería">
      <Header />
      <PageHeader
        title="Galería"
        subtitle="400 trabajos seleccionados"
        size="half"
        bg="#141210"
      />
      <GalleryView />
      <FooterStrip />
    </Page>
  );
}

function TattooPage() {
  return (
    <Page title="Tattoo">
      <Header />
      <PageHeader
        title="Reservar cita"
        subtitle="Solicitud de sesión"
        size="half"
        bg="#1e1c1a"
      />
      <BookingSection />
      <FooterStrip />
    </Page>
  );
}

function NotFoundPage() {
  return (
    <Page title="Not Found">
      <Header />
      <PageHeader title="Not Found" subtitle="La ruta que buscas no existe" size="half" bg="#1e1c1a" />
      <section className="px-[4vw] py-16 max-w-[1445px] mx-auto">
        <p className="text-white/45 text-sm tracking-wide">
          Esta ruta no existe. Vuelve al inicio para seguir navegando.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block text-white/60 text-[0.65rem] tracking-[0.35em] uppercase border-b border-white/20 pb-2 hover:text-white hover:border-white/60 transition-colors"
        >
          Volver al inicio
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/tattoo" element={<TattooPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
