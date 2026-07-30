import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FooterStrip() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // Every key page links from every page — the internal-linking signal Google uses
  // to work out which subpages deserve sitelinks.
  const footerLinks = [
    { to: "/tattoo#reserva", label: t("footer.reservar") },
    { to: "/gallery", label: t("footer.galeria") },
    { to: "/about", label: t("footer.sobreEnric") },
    { to: "/academy", label: t("footer.academia") },
    { to: "/cuidados-tatuaje", label: t("footer.cuidados") },
  ];

  return (
    <footer className="border-t border-white/10 py-12 px-[4vw]">
      <div className="max-w-[1445px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link
            to="/"
            className="text-white/65 text-xs tracking-[0.4em] uppercase hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-body)" }}
          >
            EFA Tattoo
          </Link>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
          >
            {footerLinks.map((link, i) => (
              <span key={link.to} className="flex items-center gap-5">
                {i > 0 && (
                  <span className="text-white/20" aria-hidden="true">·</span>
                )}
                <Link
                  to={link.to}
                  className="text-white/50 text-[0.7rem] tracking-[0.3em] uppercase hover:text-white/80 transition-colors"
                >
                  {link.label}
                </Link>
              </span>
            ))}
            <span className="text-white/20" aria-hidden="true">·</span>
            <a
              href="https://instagram.com/efa_tattoo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 text-[0.7rem] tracking-[0.3em] uppercase hover:text-white/80 transition-colors"
            >
              Instagram
            </a>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
          <p className="text-white/30 text-[0.65rem] tracking-wide">
            {t("footer.copyright", { year })}
          </p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link
              to="/privacidad"
              className="text-white/25 text-[0.62rem] tracking-[0.2em] uppercase hover:text-white/50 transition-colors"
            >
              {t("footer.privacidad")}
            </Link>
            <span className="text-white/15" aria-hidden="true">·</span>
            <Link
              to="/aviso-legal"
              className="text-white/25 text-[0.62rem] tracking-[0.2em] uppercase hover:text-white/50 transition-colors"
            >
              {t("footer.avisoLegal")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
