import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { setLanguage, type Lang } from "@/i18n";

export default function Header() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileTattooOpen, setMobileTattooOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  const navItems = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.about"), href: "/about" },
    {
      label: t("nav.tattoo"),
      href: "/tattoo",
      children: [
        { label: t("nav.gallery"), href: "/gallery" },
        { label: t("nav.reservar"), href: "/tattoo" },
      ],
    },
    { label: t("nav.academy"), href: "/academy" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileTattooOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function LangToggle({ mobile = false }: { mobile?: boolean }) {
    return (
      <div className={`flex items-center gap-1 ${mobile ? "" : ""}`}>
        <button
          type="button"
          onClick={() => setLanguage("es")}
          className={`text-[0.6rem] tracking-[0.2em] transition-colors duration-200 ${
            lang === "es"
              ? "text-[#c9b99a]"
              : "text-white/35 hover:text-white/65"
          }`}
        >
          ES
        </button>
        <span className="text-white/20 text-[0.55rem]">|</span>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`text-[0.6rem] tracking-[0.2em] transition-colors duration-200 ${
            lang === "en"
              ? "text-[#c9b99a]"
              : "text-white/35 hover:text-white/65"
          }`}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-[4vw] py-5
        ${scrolled ? "backdrop-blur-md bg-black/35" : "bg-transparent"}`}
    >
      <nav className="flex items-center justify-between max-w-[1445px] mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-xs tracking-[0.35em] uppercase font-light hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-body)" }}
        >
          EFA Tattoo
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} className="relative group">
                <div className="flex items-center gap-2">
                  <Link
                    to={item.href}
                    className={`text-xs tracking-[0.25em] uppercase font-light transition-colors duration-300 ${
                      active ? "text-[#c9b99a]" : "text-white/80 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <span className="text-white/40 text-[0.55rem] transition-transform duration-300 group-hover:translate-y-[1px]">
                      ▾
                    </span>
                  )}
                </div>

                {active && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-[3px] left-0 right-0 h-px bg-[#c9b99a]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {item.children && (
                  <div className="absolute left-1/2 top-full z-20 w-max min-w-0 -translate-x-1/2 pt-1">
                    <div
                      className="pointer-events-none border border-white/10 bg-[#16130f]/95 p-1
                        opacity-0 backdrop-blur-md transition-all duration-200
                        group-hover:pointer-events-auto group-hover:opacity-100"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block whitespace-nowrap border border-transparent px-4 py-3 text-[0.65rem] uppercase
                            tracking-[0.35em] text-white/70 transition-colors duration-300
                            hover:border-white/10 hover:bg-white/5 hover:text-[#c9b99a]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}

          {/* Instagram */}
          <li>
            <a
              href="https://instagram.com/efa_tattoo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
              aria-label={t("nav.instagramLabel")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </li>

          {/* Language toggle */}
          <li>
            <LangToggle />
          </li>
        </ul>

        {/* Mobile right side: lang + menu toggle */}
        <div className="md:hidden flex items-center gap-4">
          <LangToggle mobile />
          <button
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => {
              setMobileOpen((open) => {
                if (open) setMobileTattooOpen(false);
                return !open;
              });
            }}
            aria-label={mobileOpen ? t("nav.close") : t("nav.menu")}
            aria-expanded={mobileOpen}
          >
            <span className="text-[0.7rem] tracking-[0.3em] uppercase">
              {mobileOpen ? t("nav.close") : t("nav.menu")}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden absolute top-full left-0 right-0 bg-[#1a1814]/97 backdrop-blur-md border-t border-white/10"
          >
            <ul className="space-y-6 py-8 px-[6vw]">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {item.children ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <Link
                          to={item.href}
                          className={`text-xs tracking-[0.3em] uppercase font-light ${
                            isActive(item.href) ? "text-[#c9b99a]" : "text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className="text-white/60 hover:text-white transition-colors p-1"
                          onClick={() => setMobileTattooOpen((open) => !open)}
                          aria-expanded={mobileTattooOpen}
                          aria-controls="mobile-tattoo-submenu"
                          aria-label={t("nav.tattooOptions")}
                        >
                          <span
                            className="block text-sm transition-transform duration-300"
                            style={{ transform: mobileTattooOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                          >
                            +
                          </span>
                        </button>
                      </div>

                      <AnimatePresence>
                        {mobileTattooOpen && (
                          <motion.div
                            id="mobile-tattoo-submenu"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden space-y-3 border-l border-white/10 pl-4"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                to={child.href}
                                className="block text-white/65 text-xs tracking-[0.25em] uppercase font-light hover:text-white transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`text-xs tracking-[0.3em] uppercase font-light ${
                        isActive(item.href) ? "text-[#c9b99a]" : "text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.li>
              ))}

              <motion.li
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.06 }}
              >
                <a
                  href="https://instagram.com/efa_tattoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 text-xs tracking-[0.3em] uppercase font-light hover:text-white/80 transition-colors"
                >
                  Instagram ↗
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
