# Plan de implementación — Landing + Academy + Citas

**Fecha:** 2026-04-15  
**Rama base:** `main`  
**Archivos clave:** `src/styles/globals.css`, `src/components/home/HeroSection.tsx`, `src/components/academy/AcademyPage.tsx`, `src/components/tattoo/BookingSection.tsx`

---

## Contexto del codebase

| Variable | Valor actual |
|---|---|
| `--font-body` | `"Jost"` — usada en párrafos, labels, botones |
| `--font-heading` | `"Cormorant Garamond"` — usada SOLO en `h1` del Hero vía `style={{ fontFamily: "var(--font-heading)" }}` |
| Color acento | `#c9b99a` |
| Fondo | `#1a1814` |

Los pequeños letreros del hero ("Barcelona · Fine Line · Micro-realismo") usan **Jost** (fuente heredada del body), con `text-[0.7rem] uppercase tracking-[0.55em]`.

---

## Tarea 1 — Tipografía global unificada

**Objetivo:** Toda la web usa Jost. Eliminar Cormorant Garamond.

### Pasos

1. **`src/styles/globals.css`**
   - Eliminar `--font-heading: "Cormorant Garamond", Georgia, serif;`
   - Actualizar `@theme inline`: eliminar `--font-heading` o reasignarla a Jost.
   - Resultado: una sola fuente declarada (`--font-body`).

2. **`src/components/home/HeroSection.tsx` — línea 65**
   - Cambiar `style={{ fontFamily: "var(--font-heading)" }}` → eliminar o sustituir por `fontFamily: "var(--font-body)"`.
   - Revisar weight/tracking: el h1 usa `font-light uppercase tracking-[0.2em]`, mantener esos valores (son correctos para Jost).

3. **Búsqueda global de residuos**
   - Grep `Cormorant` en `/src` → eliminar toda referencia encontrada.
   - Grep `font-heading` en `/src` → eliminar o convertir a `font-body`.
   - Verificar que `index.html` no carga Google Fonts de Cormorant Garamond (si existe la carga, eliminarla).

4. **Verificar elementos restantes**
   - `SectionLabel.tsx`, `PageHeader.tsx`, `Header.tsx`, `FooterStrip.tsx` — revisar que no declaren `font-family` localmente.

---

## Tarea 2 — Limpieza del Hero (`HeroSection.tsx`)

**Objetivo:** Hero minimalista — solo título + botón Reservar Cita.

### Qué eliminar

| Elemento | Líneas aproximadas | Acción |
|---|---|---|
| Sobretítulo (`<motion.p>` con "Barcelona · Fine Line...") | 50–57 | Eliminar bloque completo |
| Subtítulo (`<motion.p>` con "Arte sobre la piel...") | 80–88 | Eliminar bloque completo |
| Grid de 3 links (About / Galería / Academy) | 105–135 | Eliminar bloque completo |
| Separador horizontal `<motion.div h-px w-48>` | 72–78 | Mantener si queda bien sin subtítulo; opcional |

### Qué conservar

- `<motion.h1>` con "EFA Tattoo"
- `<Link to="/tattoo">` con botón "Reservar Cita"

### Resultado esperado en JSX (estructura simplificada)

```tsx
<div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-[4vw]">
  <motion.h1 ...>EFA Tattoo</motion.h1>

  <motion.div /* separador gold */ ... />

  <motion.div /* botones */ className="mt-10 flex flex-col items-center gap-4">
    <Link to="/tattoo" /* botón Reservar Cita */ ... />
    <Link to="/academy" /* botón Academy — mismo estilo */ ... />
  </motion.div>
</div>
```

---

## Tarea 3 — Botón Academy alineado y estilo idéntico a Reservar Cita

**Objetivo:** Academy pasa de ser un text-link a ser un botón con borde idéntico al de "Reservar Cita".

### Botón Reservar Cita (referencia exacta — líneas 96–103)

```tsx
className="group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-transparent px-10 py-4 transition-all duration-500 hover:bg-[#c9b99a]"
// texto interior:
className="relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#c9b99a] transition-colors duration-300 group-hover:text-[#141210]"
```

### Botón Academy — copiar estilo exacto

```tsx
<Link
  to="/academy"
  className="group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-transparent px-10 py-4 transition-all duration-500 hover:bg-[#c9b99a]"
>
  <span className="relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#c9b99a] transition-colors duration-300 group-hover:text-[#141210]">
    Academy
  </span>
</Link>
```

### Layout de los dos botones

```tsx
<motion.div className="mt-10 flex flex-col items-center gap-4">
  <Link to="/tattoo" /* Reservar Cita */ />
  <Link to="/academy" /* Academy */ />
</motion.div>
```

> Los dos botones quedan apilados verticalmente (igual que el diseño actual de "Reservar Cita"), alineados al centro, con `gap-4` entre ellos.

---

## Tarea 4 — Shadow content: Testimonios en Academy

**Objetivo:** Estructura de testimonios lista, invisible en producción.

### Archivo: `src/components/academy/AcademyPage.tsx`

Añadir al final del archivo (antes del `return` o en una sección comentada):

```tsx
/* ============================================================
   SHADOW CONTENT — Testimonios Academy
   Para activar: cambiar `hidden` por el layout deseado
   ============================================================ */

/*
const ACADEMY_TESTIMONIALS = [
  {
    id: 1,
    name: "Laura M.",
    rating: 5,
    text: "El curso cambió completamente mi forma de entender el fine line. Grupos pequeños, mucha práctica real.",
  },
  {
    id: 2,
    name: "Carlos R.",
    rating: 5,
    text: "Vine sin experiencia y salí con técnica y confianza. La atención personalizada marcó la diferencia.",
  },
  {
    id: 3,
    name: "Sofía D.",
    rating: 5,
    text: "Aprendí más en un fin de semana que en meses por mi cuenta. Totalmente recomendado.",
  },
];
*/

/* Componente listo para activar:
function AcademyTestimonials() {
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      {ACADEMY_TESTIMONIALS.map((t) => (
        <div key={t.id}>
          <p>{t.name}</p>
          <p>{"★".repeat(t.rating)}</p>
          <p>{t.text}</p>
        </div>
      ))}
    </div>
  );
}
*/
```

**Schema de cada testimonio:**

```ts
type AcademyTestimonial = {
  id: number;
  name: string;       // "Laura M."
  rating: number;     // 1–5
  text: string;       // cuerpo del testimonio
};
```

---

## Tarea 5 — Shadow content: Reseñas en sección Citas

**Objetivo:** Igual que Academy — estructura lista, invisible en producción.

### Archivo: `src/components/tattoo/BookingSection.tsx`

Añadir al final del archivo (en zona de comentarios):

```tsx
/* ============================================================
   SHADOW CONTENT — Reseñas Citas
   Mismo schema que AcademyTestimonial para consistencia
   Para activar: cambiar `display: none` o importar componente
   ============================================================ */

/*
const BOOKING_REVIEWS = [
  {
    id: 1,
    name: "Marta L.",
    rating: 5,
    text: "Proceso súper cuidado desde la consulta hasta el resultado. Mi tatuaje quedó exactamente como lo imaginé.",
  },
  {
    id: 2,
    name: "Jordi P.",
    rating: 5,
    text: "Atención al detalle increíble. El trazo fine line que pedí salió perfecto.",
  },
  {
    id: 3,
    name: "Elena V.",
    rating: 5,
    text: "Primera vez tatuándome y me sentí muy cómoda. Profesionalidad total.",
  },
];
*/

/* Componente listo para activar:
function BookingReviews() {
  return (
    <div style={{ display: "none" }} aria-hidden="true">
      {BOOKING_REVIEWS.map((r) => (
        <div key={r.id}>
          <p>{r.name}</p>
          <p>{"★".repeat(r.rating)}</p>
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  );
}
*/
```

**Schema compartido (consistente con Academy):**

```ts
type Review = {
  id: number;
  name: string;
  rating: number;  // 1–5
  text: string;
};
```

> Para activar en el futuro: descomentar el array y el componente, y añadir `<BookingReviews />` en el JSX del render.

---

## Orden de ejecución sugerido

```
1. globals.css         → eliminar Cormorant Garamond
2. HeroSection.tsx     → eliminar font-heading del h1 + limpiar sobretítulo/subtítulo/nav grid
3. HeroSection.tsx     → añadir botón Academy con mismo estilo
4. Grep residuos       → confirmar 0 referencias a Cormorant / font-heading
5. AcademyPage.tsx     → añadir shadow content testimonios (comentado)
6. BookingSection.tsx  → añadir shadow content reseñas (comentado)
7. Build local         → npm run build — verificar 0 errores
```

---

## Criterios de aceptación

- [ ] Solo existe una fuente en toda la web: Jost
- [ ] El hero muestra únicamente: título + línea dorada + dos botones (Reservar Cita / Academy)
- [ ] Los dos botones tienen borde, tamaño, tracking y hover idénticos
- [ ] No hay texto visible de subtítulo, sobretítulo ni links secundarios en el hero
- [ ] `npm run build` pasa sin errores ni warnings de fuente
- [ ] Los shadow contents existen en los archivos pero no renderizan nada visible en producción
- [ ] El schema de testimonios y reseñas es consistente (mismos campos)
