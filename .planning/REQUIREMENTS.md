# Requirements — EFA Tattoo Frontend Polish

**Phase:** 1–5 (simultaneous where possible)  
**Scope:** Typography, Hero structure, Academy integration  
**Timeline:** 1 week (by 2026-04-18)

---

## Requirement 1: Unified Font Stack

**Acceptance Criteria:**
- [ ] Single font family (`--font-body`: Jost) declared in `src/styles/globals.css`
- [ ] Zero references to Cormorant Garamond in `/src` (Grep result = empty)
- [ ] Zero references to `--font-heading` in `/src` (Grep result = empty)
- [ ] `index.html` loads zero Cormorant Garamond fonts
- [ ] `npm run build` shows zero font warnings
- [ ] All typography renders in Jost on desktop + mobile

**Details:**
- Remove `--font-heading: "Cormorant Garamond", Georgia, serif;` from globals.css
- Update `@theme inline` to declare only `--font-body`
- Audit components: `SectionLabel.tsx`, `PageHeader.tsx`, `Header.tsx`, `FooterStrip.tsx` — ensure no local `font-family` declarations
- Test across Chrome, Firefox, Safari (visual regression check)

---

## Requirement 2: Hero Section Cleanup

**Acceptance Criteria:**
- [ ] Hero displays only: h1 "EFA Tattoo" + gold separator line + 2 buttons
- [ ] Removed elements: sobretítulo ("Barcelona · Fine Line..."), subtítulo ("Arte sobre la piel..."), grid of 3 links (About / Galería / Academy)
- [ ] h1 styling intact: `font-light uppercase tracking-[0.2em]`
- [ ] h1 uses `--font-body` (Jost), not `--font-heading`
- [ ] Visual regression test on mobile + desktop (no unintended side effects)

**Details:**
- Delete motion.p blocks (lines 50–57, 80–88 in HeroSection.tsx)
- Delete grid of 3 links (lines 105–135)
- Keep motion.h1, motion.div (separator), motion.div (buttons)
- Preserve all Framer Motion animations

---

## Requirement 3: Academy Button Parity

**Acceptance Criteria:**
- [ ] Academy button exists as a Link to `/academy`
- [ ] Academy button className matches Reservar Cita exactly: `"group relative flex items-center justify-center overflow-hidden border border-[#c9b99a] bg-transparent px-10 py-4 transition-all duration-500 hover:bg-[#c9b99a]"`
- [ ] Academy button text styling matches: `"relative z-10 pl-[0.45em] text-[0.7rem] uppercase tracking-[0.45em] text-[#c9b99a] transition-colors duration-300 group-hover:text-[#141210]"`
- [ ] Two buttons stacked vertically with `gap-4` between them
- [ ] Hover state identical on both buttons
- [ ] Mobile responsive: buttons stay centered and usable on small screens

**Details:**
- Copy exact className and structure from Reservar Cita button to Academy button
- Wrap in `<Link to="/academy">` (React Router)
- Place both in `<motion.div className="mt-10 flex flex-col items-center gap-4">`

---

## Requirement 4: Shadow Content — Academy Testimonials

**Acceptance Criteria:**
- [ ] `src/components/academy/AcademyPage.tsx` contains commented block with testimonials array
- [ ] Array includes 3 testimonials with schema: `{ id, name, rating (1–5), text }`
- [ ] Component template (also commented) shows how to render testimonials
- [ ] Testimonials are **invisible in production** (`display: none` or commented out)
- [ ] Schema is consistent (matches Requirement 5)
- [ ] Comments clearly mark "SHADOW CONTENT" and provide activation instructions

**Details:**
- Testimonials array (3 entries, realistic names/text)
- AcademyTestimonials component (commented, hidden render)
- Activation instructions: "uncomment array and component, add to JSX"

---

## Requirement 5: Shadow Content — Booking Reviews

**Acceptance Criteria:**
- [ ] `src/components/tattoo/BookingSection.tsx` contains commented block with reviews array
- [ ] Array includes 3 reviews with schema: `{ id, name, rating (1–5), text }`
- [ ] Component template (also commented) shows how to render reviews
- [ ] Reviews are **invisible in production** (`display: none` or commented out)
- [ ] Schema matches Academy testimonials (same Review/Testimonial type)
- [ ] Comments clearly mark "SHADOW CONTENT" and provide activation instructions

**Details:**
- Reviews array (3 entries, realistic names/text, booking-focused)
- BookingReviews component (commented, hidden render)
- Activation instructions: "uncomment array and component, add to JSX"

---

## Constraints

- **No breaking changes** — existing pages must render without errors
- **No new dependencies** — use existing libraries only
- **No backend changes** — pure frontend refactor
- **No asset deletions** — keep all images, fonts in place (except Cormorant)
- **Autonomous deployment** — no external review gate

---

## Definitions of Done

1. All acceptance criteria for Req 1–5 are checked ✓
2. `npm run build` passes with zero errors, zero font warnings
3. Visual regression test passes (manual browser check: hero, buttons, responsive)
4. All Grep searches (Cormorant, font-heading) return empty
5. Shadow content verified as invisible in production
6. Code is clean, no commented-out code outside of intentional shadow content
7. Ready for autonomous merge to main

---

## Notes

- Testimonials (both shadow content arrays) are high-ROI for future conversions — schema is designed for easy activation
- Gold button consistency reinforces brand identity — exact pixel-perfect parity is intentional
- Typography unification simplifies maintenance and speeds up future design iterations
