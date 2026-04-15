import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "efa_cookie_consent";

function loadScripts(prefs: CookiePreferences) {
  // Google Analytics (GA4) — replace G-XXXXXXXXXX with your actual ID
  const GA_ID = (window as any).__GA_ID__ || "G-XXXXXXXXXX";
  if (prefs.analytics && GA_ID !== "G-XXXXXXXXXX") {
    if (!document.getElementById("ga-script")) {
      const script = document.createElement("script");
      script.id = "ga-script";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      const inline = document.createElement("script");
      inline.id = "ga-inline";
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `;
      document.head.appendChild(inline);
    }
  }

  // Facebook Pixel
  const FB_PIXEL_ID = (window as any).__FB_PIXEL_ID__ || "135320694773663";
  if (prefs.marketing) {
    if (!document.getElementById("fb-pixel-script")) {
      const inline = document.createElement("script");
      inline.id = "fb-pixel-script";
      inline.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(inline);
    }
  }
}

function Toggle({
  enabled,
  onChange,
  disabled = false,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline-none ${
        disabled
          ? "cursor-not-allowed border-white/10 bg-white/10"
          : enabled
            ? "border-[#c9b99a]/60 bg-[#c9b99a]/20 cursor-pointer"
            : "border-white/15 bg-white/5 cursor-pointer"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full shadow-sm transition-transform duration-200 mt-[3px] ${
          disabled
            ? "translate-x-1 bg-white/25"
            : enabled
              ? "translate-x-[18px] bg-[#c9b99a]"
              : "translate-x-1 bg-white/35"
        }`}
      />
    </button>
  );
}

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as CookiePreferences;
      loadScripts(parsed);
    } else {
      // Small delay so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  function acceptAll() {
    const all: CookiePreferences = { analytics: true, marketing: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    loadScripts(all);
    setVisible(false);
  }

  function rejectAll() {
    const none: CookiePreferences = { analytics: false, marketing: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(none));
    setVisible(false);
  }

  function saveCustom() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    loadScripts(prefs);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cookie-banner"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-[440px] z-[9999]"
          role="dialog"
          aria-label={t("cookie.title")}
          aria-modal="false"
        >
          <div
            className="rounded-xl border border-white/10 backdrop-blur-xl overflow-hidden"
            style={{ background: "rgba(20,18,16,0.94)" }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-white/8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-white text-sm tracking-[0.12em] uppercase mb-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {t("cookie.title")}
                  </p>
                  <p className="text-white/50 text-[0.7rem] leading-relaxed tracking-wide">
                    {t("cookie.text")}{" "}
                    <Link
                      to="/privacidad"
                      className="text-[#c9b99a]/70 hover:text-[#c9b99a] transition-colors underline underline-offset-2"
                      onClick={() => setVisible(false)}
                    >
                      {t("cookie.policyLink")}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Expandable preferences */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="prefs-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-3">
                    {/* Essential */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white/80 text-[0.7rem] tracking-wide">
                          {t("cookie.essential")}
                        </p>
                        <p className="text-white/35 text-[0.62rem] mt-0.5">
                          {t("cookie.essentialDesc")}
                        </p>
                      </div>
                      <Toggle enabled={true} onChange={() => {}} disabled />
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white/80 text-[0.7rem] tracking-wide">
                          {t("cookie.analytics")}
                        </p>
                        <p className="text-white/35 text-[0.62rem] mt-0.5">
                          {t("cookie.analyticsDesc")}
                        </p>
                      </div>
                      <Toggle
                        enabled={prefs.analytics}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, analytics: v }))
                        }
                      />
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white/80 text-[0.7rem] tracking-wide">
                          {t("cookie.marketing")}
                        </p>
                        <p className="text-white/35 text-[0.62rem] mt-0.5">
                          {t("cookie.marketingDesc")}
                        </p>
                      </div>
                      <Toggle
                        enabled={prefs.marketing}
                        onChange={(v) =>
                          setPrefs((p) => ({ ...p, marketing: v }))
                        }
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  id="cookie-accept-all"
                  onClick={acceptAll}
                  className="flex-1 text-[0.65rem] tracking-[0.25em] uppercase bg-[#c9b99a]/15 border border-[#c9b99a]/30 text-[#c9b99a] py-2.5 rounded-lg hover:bg-[#c9b99a]/25 hover:border-[#c9b99a]/50 transition-all duration-200 cursor-pointer"
                >
                  {t("cookie.acceptAll")}
                </button>
                <button
                  id="cookie-reject-all"
                  onClick={rejectAll}
                  className="flex-1 text-[0.65rem] tracking-[0.25em] uppercase text-white/40 border border-white/10 py-2.5 rounded-lg hover:text-white/65 hover:border-white/20 transition-all duration-200 cursor-pointer"
                >
                  {t("cookie.essentialOnly")}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <button
                  id="cookie-toggle-prefs"
                  onClick={() => setExpanded((e) => !e)}
                  className="text-white/30 text-[0.62rem] tracking-wide hover:text-white/55 transition-colors cursor-pointer"
                >
                  {expanded ? t("cookie.hideOptions") : t("cookie.customize")}
                </button>
                {expanded && (
                  <button
                    id="cookie-save-custom"
                    onClick={saveCustom}
                    className="text-[#c9b99a]/60 text-[0.62rem] tracking-wide hover:text-[#c9b99a] transition-colors cursor-pointer"
                  >
                    {t("cookie.saveSelection")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
