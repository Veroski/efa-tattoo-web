import { Link } from "react-router-dom";

export default function FooterStrip() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-12 px-[4vw]">
      <div className="max-w-[1445px] mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link
            to="/"
            className="text-white/65 text-xs tracking-[0.4em] uppercase hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            EFA Tattoo
          </Link>

          <nav aria-label="Footer" className="flex items-center gap-6">
            <Link
              to="/tattoo#booking"
              className="text-white/50 text-[0.7rem] tracking-[0.3em] uppercase hover:text-white/80 transition-colors"
            >
              Reservar cita
            </Link>
            <span className="text-white/20" aria-hidden="true">·</span>
            <Link
              to="/academy"
              className="text-white/50 text-[0.7rem] tracking-[0.3em] uppercase hover:text-white/80 transition-colors"
            >
              Academia
            </Link>
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

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
          <p className="text-white/30 text-[0.65rem] tracking-wide">
            © {year} EFA Tattoo. Barcelona, España.
          </p>
          <p className="text-white/25 text-[0.65rem] tracking-wide">
            Fine Line · Micro-realismo · Seminarios
          </p>
        </div>
      </div>
    </footer>
  );
}
