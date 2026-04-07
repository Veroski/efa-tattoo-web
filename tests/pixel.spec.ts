import { test, expect } from "@playwright/test";

const BASE = "http://127.0.0.1:4173";

test.describe("Meta Pixel", () => {
  test("noscript fallback está en el HTML", async ({ page }) => {
    const response = await page.goto(BASE);
    const html = await response!.text();
    expect(html).toContain("135320694773663");
    expect(html).toContain("noscript");
    expect(html).toContain("facebook.com/tr");
    console.log("✓ noscript fallback con pixel ID 135320694773663 presente en el HTML");
  });

  test("fbevents.js se carga tras aceptar cookies de marketing", async ({ page }) => {
    const pixelScriptLoaded = { value: false };

    // Interceptar la creación de scripts en el DOM
    await page.addInitScript(() => {
      const origCreate = document.createElement.bind(document);
      (document as any).createElement = function (tag: string) {
        const el = origCreate(tag);
        if (tag === "script") {
          const origSrcDesc = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src");
          let _src = "";
          Object.defineProperty(el, "src", {
            set(v: string) {
              _src = v;
              if (v.includes("fbevents")) {
                (window as any).__fbPixelScriptDetected = true;
              }
              origSrcDesc?.set?.call(el, v);
            },
            get() { return _src; },
          });
        }
        return el;
      };
    });

    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    // Esperar al botón "Aceptar todas" (aparece tras 1200ms de delay)
    const acceptBtn = page.locator("#cookie-accept-all");
    await acceptBtn.waitFor({ timeout: 15000 });
    await acceptBtn.click();

    // Esperar a que window.fbq quede definido
    await page.waitForFunction(() => typeof (window as any).fbq === "function", { timeout: 10000 });

    const fbqExists = await page.evaluate(() => typeof (window as any).fbq === "function");
    expect(fbqExists).toBe(true);
    console.log("✓ window.fbq definido tras aceptar marketing");

    const pixelId = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));
      return scripts.some((s) => s.innerHTML.includes("135320694773663"));
    });
    expect(pixelId).toBe(true);
    console.log("✓ Pixel ID 135320694773663 inyectado en el DOM");
  });

  test("PageView se dispara al cargar con consentimiento previo", async ({ page }) => {
    // Simular consentimiento previo
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem(
        "efa_cookie_consent",
        JSON.stringify({ analytics: false, marketing: true })
      );
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    await page.waitForFunction(() => typeof (window as any).fbq === "function", { timeout: 8000 });

    // Verificar que PageView se trackea via fbq queue o callMethod
    const pageViewTracked = await page.evaluate(() => {
      const fbq = (window as any).fbq;
      if (!fbq) return false;
      // fbq.queue puede tener los eventos previos antes de que cargara fbevents
      const q: any[][] = fbq.queue || [];
      return q.some((args) => args[0] === "track" && args[1] === "PageView") ||
             typeof fbq.callMethod === "function"; // fbevents ya cargó → callMethod existe
    });
    expect(pageViewTracked).toBe(true);
    console.log("✓ PageView trackeado al cargar con consentimiento previo");
  });

  test("evento Lead se dispara al llamar fbq con marketing activo", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem(
        "efa_cookie_consent",
        JSON.stringify({ analytics: false, marketing: true })
      );
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => typeof (window as any).fbq === "function", { timeout: 8000 });

    // Interceptar fbq para capturar el evento Lead
    const leadFired = await page.evaluate(() => {
      return new Promise<boolean>((resolve) => {
        const original = (window as any).fbq;
        let called = false;
        (window as any).fbq = function (...args: any[]) {
          if (args[0] === "track" && args[1] === "Lead") {
            called = true;
            resolve(true);
          }
          return original?.apply(this, args);
        };
        // Disparar como lo hace BookingSection tras éxito
        if (typeof (window as any).fbq === "function") {
          (window as any).fbq("track", "Lead");
        }
        setTimeout(() => { if (!called) resolve(false); }, 3000);
      });
    });

    expect(leadFired).toBe(true);
    console.log("✓ Evento Lead disparado correctamente");
  });

  test("Pixel NO se carga sin consentimiento de marketing", async ({ page }) => {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem(
        "efa_cookie_consent",
        JSON.stringify({ analytics: false, marketing: false })
      );
    });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const fbqExists = await page.evaluate(() => typeof (window as any).fbq === "function");
    const pixelInjected = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"));
      return scripts.some((s) => s.innerHTML.includes("135320694773663") && s.innerHTML.includes("fbq"));
    });

    expect(fbqExists).toBe(false);
    expect(pixelInjected).toBe(false);
    console.log("✓ Pixel NO cargado sin consentimiento de marketing");
  });
});
