# Clone Guide: marinamolist.com → React

> **Source:** https://www.marinamolist.com/
> **Stack sugerido:** Next.js 14+ (App Router) + Tailwind CSS + Framer Motion

---

## 1. Visión General

Portafolio personal de tatuadora/fotógrafa. Diseño **minimalista oscuro**, muy visual, con e-commerce integrado. Squarespace v7.1 original — replicable en React con Next.js.

---

## 2. Paleta de Colores

| Token            | Valor aproximado    | Uso                                 |
|-----------------|---------------------|-------------------------------------|
| `--bg-primary`  | `#1a1814` (khaki oscuro) | Fondo principal                |
| `--text-primary`| `#ffffff`           | Texto principal sobre imágenes      |
| `--text-accent` | `#c9b99a` (khaki claro) | Subrayados decorativos, acentos |
| `--text-muted`  | `rgba(255,255,255,0.6)` | Texto secundario               |
| `--border`      | `rgba(255,255,255,0.15)` | Líneas separadoras            |

```css
/* globals.css */
:root {
  --bg-primary: #1a1814;
  --text-primary: #ffffff;
  --text-accent: #c9b99a;
  --max-width: 1445px;
  --gutter-mobile: 6vw;
  --gutter-desktop: 4vw;
}
```

---

## 3. Tipografía

- **Headings:** Sans-serif moderno, uppercase, tracking amplio — usar `Cormorant Garamond` o `Playfair Display` para elegancia, o `Inter` para neutralidad
- **Body:** Sans-serif limpio — `Inter` o `DM Sans`
- **Tamaños:** responsivos en `vw` / `clamp()`

```css
/* Recomendado */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Inter:wght@300;400;500&display=swap');

h1 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 8vw, 7rem); letter-spacing: 0.2em; text-transform: uppercase; }
body { font-family: 'Inter', sans-serif; font-size: 0.875rem; }
```

---

## 4. Estructura de Páginas

```
/                   → Home (hero + grid de trabajos)
/about              → Bio de la artista
/tattoo             → Portfolio tatuajes
/tattoo/book        → Formulario de reserva
/tattoo/gallery     → Galería
/tattoo/cities      → Ciudades (filtro)
/tattoo/shop        → Tienda
/photography        → Portfolio fotografía
/photography/gallery→ Galería fotos
/photography/prints → Venta de prints
```

---

## 5. Componentes React

### 5.1 Layout

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Nav fija con blur
│   │   ├── MobileMenu.tsx     # Hamburger + slide-out
│   │   └── Footer.tsx         # Links sociales + subscribe
│   ├── home/
│   │   ├── HeroSection.tsx    # Imagen full-width + título animado
│   │   ├── PortfolioGrid.tsx  # Grid de trabajos
│   │   └── SubscribeSection.tsx
│   ├── gallery/
│   │   ├── GalleryGrid.tsx
│   │   └── GalleryItem.tsx
│   ├── shop/
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   └── CartButton.tsx
│   └── ui/
│       ├── AnimatedUnderline.tsx
│       └── CountdownTimer.tsx
└── app/
    ├── page.tsx               # Home
    ├── about/page.tsx
    ├── tattoo/page.tsx
    └── photography/page.tsx
```

---

### 5.2 Header con Blur

```tsx
// components/layout/Header.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  {
    label: 'TATTOO',
    href: '/tattoo',
    children: [
      { label: 'Book', href: '/tattoo/book' },
      { label: 'Gallery', href: '/tattoo/gallery' },
      { label: 'Cities', href: '/tattoo/cities' },
      { label: 'Shop', href: '/tattoo/shop' },
    ],
  },
  {
    label: 'PHOTOGRAPHY',
    href: '/photography',
    children: [
      { label: 'Gallery', href: '/photography/gallery' },
      { label: 'Prints', href: '/photography/prints' },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-[4vw] py-[1.7vw]
        ${scrolled ? 'backdrop-blur-md bg-black/30' : 'bg-transparent'}`}
    >
      <nav className="flex items-center justify-between max-w-[1445px] mx-auto">
        <Link href="/" className="text-white text-sm tracking-[0.3em] uppercase font-light">
          Marina Molist
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label} className="relative group">
              <Link
                href={item.href}
                className="text-white text-xs tracking-[0.2em] uppercase font-light
                  hover:opacity-60 transition-opacity duration-300"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="absolute top-full left-0 pt-2 hidden group-hover:block
                  bg-black/80 backdrop-blur-sm min-w-[120px]">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="block px-4 py-2 text-white/70 text-xs tracking-widest
                          uppercase hover:text-white transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="text-xs tracking-widest">{mobileOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>
    </header>
  );
}
```

---

### 5.3 Hero Section con Animación

```tsx
// components/home/HeroSection.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
  const [showTitle, setShowTitle] = useState(true);

  // Auto-toggle cada 3 segundos (como el original)
  useEffect(() => {
    const interval = setInterval(() => setShowTitle((v) => !v), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full h-screen overflow-hidden cursor-pointer"
      onClick={() => setShowTitle((v) => !v)}
    >
      {/* Hero image */}
      <Image
        src="/images/hero.jpg"
        alt="Marina Molist"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated title */}
      <AnimatePresence mode="wait">
        {showTitle && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <h1 className="text-white text-[clamp(2.5rem,8vw,7rem)] font-light
              tracking-[0.25em] uppercase text-center leading-none">
              Marina
              <br />
              Molist
            </h1>
            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0, originX: 1 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="h-[1px] w-48 bg-[#c9b99a] mt-4"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

---

### 5.4 Portfolio Grid

```tsx
// components/home/PortfolioGrid.tsx
import Image from 'next/image';
import Link from 'next/link';

interface WorkItem {
  id: string;
  src: string;
  alt: string;
  href: string;
  category: 'tattoo' | 'photography';
}

interface Props {
  items: WorkItem[];
}

export default function PortfolioGrid({ items }: Props) {
  return (
    <section className="px-[4vw] py-16 max-w-[1445px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="relative aspect-square overflow-hidden group"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700
                group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30
              transition-colors duration-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}
```

---

### 5.5 Subscribe Section

```tsx
// components/home/SubscribeSection.tsx
'use client';
import { useState } from 'react';

export default function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Integrar con Mailchimp / Resend / etc.
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-[4vw] text-center bg-[#1a1814]">
      <h2 className="text-white text-xs tracking-[0.4em] uppercase mb-6">
        Subscribe
      </h2>
      <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
        Sign up with your email address to receive news and exclusive prints.
        Privacy respected.
      </p>

      {submitted ? (
        <p className="text-[#c9b99a] text-sm tracking-widest">
          Thank you for signing up
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row
          items-center justify-center gap-3 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full bg-transparent border-b border-white/40 text-white
              text-sm py-2 px-0 placeholder:text-white/40 outline-none
              focus:border-white/80 transition-colors"
          />
          <button
            type="submit"
            className="text-white text-xs tracking-[0.3em] uppercase
              border border-white/40 px-6 py-2 hover:bg-white hover:text-black
              transition-colors duration-300 whitespace-nowrap"
          >
            Sign Up
          </button>
        </form>
      )}
    </section>
  );
}
```

---

## 6. Animaciones (Framer Motion)

```bash
npm install framer-motion
```

| Efecto                       | Implementación                                      |
|-----------------------------|-----------------------------------------------------|
| Fade título/menú (500ms)    | `AnimatePresence` + `opacity: 0→1`                 |
| Subrayado draw (izq→der)    | `scaleX: 0→1` con `originX: 0`                     |
| Hover imágenes              | `scale: 1.05` en `group-hover` (Tailwind)          |
| Menú mobile slide-in        | `x: '100%' → 0` con `transition: spring`           |
| Página transitions          | Wrap en `<motion.div>` con `layout`                |

---

## 7. E-Commerce (Tienda de Prints)

Opciones para replicar el shop:

| Opción           | Pros                          | Contras                    |
|-----------------|-------------------------------|----------------------------|
| **Stripe**      | Control total, sin comisiones | Más código                 |
| **Shopify Buy SDK** | Rápido de integrar        | Requiere cuenta Shopify    |
| **Medusa.js**   | Open source, self-hosted       | Más infraestructura        |
| **Gumroad**     | Cero código, ideal prints      | Menos control de diseño    |

**Recomendado para prints digitales/físicos:** Stripe + Vercel Functions:

```tsx
// app/api/checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { priceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    currency: 'eur',
    success_url: `${process.env.NEXT_PUBLIC_URL}/shop/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/shop`,
  });

  return Response.json({ url: session.url });
}
```

---

## 8. Formulario de Reserva (Tattoo)

```tsx
// app/tattoo/book/page.tsx
export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#1a1814] px-[4vw] py-32">
      <h1 className="text-white text-xs tracking-[0.4em] uppercase mb-12 text-center">
        Book a Session
      </h1>
      <form className="max-w-lg mx-auto space-y-8">
        {[
          { label: 'Name', type: 'text', name: 'name' },
          { label: 'Email', type: 'email', name: 'email' },
          { label: 'City', type: 'text', name: 'city' },
        ].map((field) => (
          <div key={field.name} className="relative">
            <input
              type={field.type}
              name={field.name}
              required
              className="peer w-full bg-transparent border-b border-white/30
                text-white text-sm py-3 outline-none focus:border-white
                transition-colors placeholder-transparent"
              placeholder={field.label}
            />
            <label className="absolute left-0 top-3 text-white/40 text-xs
              tracking-widest uppercase transition-all duration-300
              peer-focus:-top-4 peer-focus:text-[0.65rem] peer-focus:text-white/60
              peer-[:not(:placeholder-shown)]:-top-4
              peer-[:not(:placeholder-shown)]:text-[0.65rem]">
              {field.label}
            </label>
          </div>
        ))}
        <textarea
          name="description"
          rows={4}
          placeholder="Tattoo description"
          className="w-full bg-transparent border-b border-white/30 text-white
            text-sm py-3 outline-none resize-none focus:border-white
            placeholder:text-white/40 transition-colors"
        />
        <button
          type="submit"
          className="w-full border border-white/40 text-white text-xs
            tracking-[0.3em] uppercase py-4 hover:bg-white hover:text-black
            transition-colors duration-300"
        >
          Send Request
        </button>
      </form>
    </main>
  );
}
```

---

## 9. SEO y Metadata

```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Marina Molist', template: '%s | Marina Molist' },
  description: 'Tattoo artist & photographer based in Lisbon.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.marinamolist.com',
    siteName: 'Marina Molist',
  },
};
```

---

## 10. Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
RESEND_API_KEY=re_...       # Para emails de reserva
```

---

## 11. Setup Inicial

```bash
# Crear proyecto
npx create-next-app@latest marina-clone --typescript --tailwind --app --src-dir

# Instalar dependencias
cd marina-clone
npm install framer-motion
npm install stripe @stripe/stripe-js   # Si incluyes shop
npm install resend                      # Si incluyes formulario de contacto

# Fuentes (next/font recomendado)
# Ya incluido en Next.js, configurar en app/layout.tsx
```

```tsx
// app/layout.tsx (fuentes)
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-heading',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
});
```

---

## 12. Checklist de Fidelidad

- [ ] Fondo oscuro `#1a1814` en todas las páginas
- [ ] Header transparente con blur al hacer scroll
- [ ] Hero full-screen con imagen + título animado
- [ ] Auto-toggle título/nav cada 3 segundos
- [ ] Underline draw animation en título principal
- [ ] Grid de fotos sin padding, hover con scale sutil
- [ ] Tipografía uppercase + tracking amplio
- [ ] Menú mobile con hamburger + slide-in
- [ ] Submenús en hover para Tattoo y Photography
- [ ] Sección Subscribe centrada con input minimal
- [ ] Integración social: Instagram + Pinterest
- [ ] Shop con Stripe (EUR como moneda por defecto)
- [ ] Formulario de reserva con labels flotantes
- [ ] Responsive: mobile-first, breakpoint principal 768px
- [ ] `max-width: 1445px` centrado con `margin: 0 auto`
