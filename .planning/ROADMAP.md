# Roadmap — EFA Tattoo Frontend Polish

**Timeline:** 2026-04-15 → 2026-04-18 (end of week)  
**Approval:** Autonomous (no external review)  
**Status:** Ready for Phase 1

---

## Phase Structure

Each phase is a discrete, testable increment. Phases 1–3 are critical path; Phases 4–5 can run in parallel.

---

## Phase 1: Global Typography Unification

**Goal:** Single font family (Jost) across entire site  
**Duration:** ~30 min  
**Files:** `src/styles/globals.css`, + grep cleanup

### Execution

1. Edit `src/styles/globals.css` — remove `--font-heading` declaration, ensure only `--font-body: "Jost"` exists
2. Grep `/src` for `Cormorant` — remove all references (likely only in globals.css)
3. Grep `/src` for `font-heading` — replace with `font-body` or delete
4. Verify `index.html` has zero Cormorant Garamond imports
5. Run `npm run build` — confirm zero font warnings
6. Commit: "chore: unify typography to Jost font family"

### Acceptance

- [ ] Only one font family in CSS output
- [ ] Zero Cormorant references in grep
- [ ] Build succeeds, zero font warnings
- [ ] Git commit created

**Next Phase Trigger:** Commit created + build passes ✓

---

## Phase 2: Hero Section Cleanup

**Goal:** Minimal hero — title + separator + 2 buttons  
**Duration:** ~45 min  
**Files:** `src/components/home/HeroSection.tsx`

### Execution

1. Open `src/components/home/HeroSection.tsx`
2. Delete sobretítulo block (motion.p, "Barcelona · Fine Line...", lines ~50–57)
3. Delete subtítulo block (motion.p, "Arte sobre la piel...", lines ~80–88)
4. Delete grid of 3 links (About / Galería / Academy, lines ~105–135)
5. Keep h1, separator (motion.div), and button container
6. Update h1 to use `--font-body` (if currently using `--font-heading`)
7. Run `npm run build` + visual regression test (browser check: desktop + mobile)
8. Commit: "feat: simplify hero section to title, separator, and buttons"

### Acceptance

- [ ] Hero displays only: h1 + separator + button container
- [ ] No visible sobretítulo, subtítulo, or link grid
- [ ] h1 styling intact (light, uppercase, correct tracking)
- [ ] Build succeeds
- [ ] Visual regression test passes (manual browser check)
- [ ] Git commit created

**Next Phase Trigger:** Commit created + visual check ✓

---

## Phase 3: Academy Button Parity

**Goal:** Add Academy button with identical style to Reservar Cita  
**Duration:** ~20 min  
**Files:** `src/components/home/HeroSection.tsx`

### Execution

1. In HeroSection.tsx, locate the Reservar Cita button (Link to `/tattoo`, lines ~96–103)
2. Copy the exact className and text span structure
3. Create a new Link to `/academy` with identical classes and structure
4. Place both buttons in a `<motion.div className="mt-10 flex flex-col items-center gap-4">` container
5. Verify hover state works on both buttons (browser test)
6. Run `npm run build` + visual regression test
7. Commit: "feat: add Academy button with matching style"

### Acceptance

- [ ] Academy button exists as Link to `/academy`
- [ ] Button className matches Reservar Cita exactly
- [ ] Button text styling matches exactly
- [ ] Two buttons stacked vertically, centered, gap-4 between them
- [ ] Hover state identical on both (gold fill, text color change)
- [ ] Mobile responsive
- [ ] Build succeeds
- [ ] Visual regression test passes
- [ ] Git commit created

**Next Phase Trigger:** Commit created + visual check ✓

---

## Phase 4: Shadow Content — Academy Testimonials

**Goal:** Structure testimonials for future activation  
**Duration:** ~15 min  
**Files:** `src/components/academy/AcademyPage.tsx`

### Execution

1. Open `src/components/academy/AcademyPage.tsx`
2. Add commented block at end of file with testimonials array (3 entries)
3. Add commented AcademyTestimonials component (renders testimonials with `display: none`)
4. Include activation instructions in comments
5. Verify testimonials are **not visible** in production (browser check)
6. Run `npm run build`
7. Commit: "docs: add shadow content for academy testimonials"

### Acceptance

- [ ] Testimonials array exists in comments with correct schema
- [ ] Component template exists in comments with hidden render (`display: none`)
- [ ] Zero visible testimonials on page (browser check)
- [ ] Activation instructions are clear and discoverable
- [ ] Schema: `{ id, name, rating, text }`
- [ ] Build succeeds
- [ ] Git commit created

**Parallel with Phase 5** ✓

---

## Phase 5: Shadow Content — Booking Reviews

**Goal:** Structure reviews for future activation  
**Duration:** ~15 min  
**Files:** `src/components/tattoo/BookingSection.tsx`

### Execution

1. Open `src/components/tattoo/BookingSection.tsx`
2. Add commented block at end of file with reviews array (3 entries)
3. Add commented BookingReviews component (renders reviews with `display: none`)
4. Include activation instructions in comments
5. Ensure schema matches Academy testimonials (same type)
6. Verify reviews are **not visible** in production (browser check)
7. Run `npm run build`
8. Commit: "docs: add shadow content for booking reviews"

### Acceptance

- [ ] Reviews array exists in comments with correct schema
- [ ] Component template exists in comments with hidden render (`display: none`)
- [ ] Zero visible reviews on page (browser check)
- [ ] Activation instructions are clear and discoverable
- [ ] Schema matches Academy testimonials: `{ id, name, rating, text }`
- [ ] Build succeeds
- [ ] Git commit created

**Parallel with Phase 4** ✓

---

## Completion Criteria

All of the following must be true:

- [ ] Phase 1 commit exists (typography)
- [ ] Phase 2 commit exists (hero cleanup)
- [ ] Phase 3 commit exists (Academy button)
- [ ] Phase 4 commit exists (shadow testimonials)
- [ ] Phase 5 commit exists (shadow reviews)
- [ ] `npm run build` passes with zero errors, zero font warnings
- [ ] Zero Cormorant Garamond references in grep
- [ ] Zero `--font-heading` references in grep
- [ ] Visual regression test passes (hero, buttons, mobile responsive)
- [ ] Shadow content verified as invisible in production
- [ ] Main branch is clean and ready for deploy

---

## Rollout Strategy

1. **Branch:** Work on feature branch `feat/frontend-polish-typography-hero`
2. **Testing:** Local build + browser visual regression check at each phase
3. **Review:** Autonomous (no external gate) — merge to main after Phase 5 complete
4. **Deploy:** Vercel auto-deploys main after merge
5. **Monitor:** Check preview URL for visual correctness, zero errors

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Font warnings at build | Early grep + CSS audit (Phase 1) ensures clean output |
| Visual regression on mobile | Manual browser check after each phase (hero, buttons, responsive) |
| Accidental content removal | Grep for deleted elements before commit, compare old/new branch |
| Shadow content accidentally visible | Use `display: none` + verified invisible in browser |

---

## Next Step

Run `/gsd-plan-phase 1` to begin Phase 1 execution (typography unification).

All setup complete. Ready to build.
