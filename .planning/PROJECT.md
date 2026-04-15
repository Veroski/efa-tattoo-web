# EFA Tattoo — Landing + Academy + Citas

**Date:** 2026-04-15  
**Status:** Initialization  
**Owner:** Veroski

---

## Vision

Transform EFA Tattoo's frontend into a clean, unified, professional web presence:
1. **Single font family** (Jost) across the entire site — remove Cormorant Garamond
2. **Minimal hero** — just title + gold separator + two buttons (Reservar Cita / Academy)
3. **Hidden testimonials** — shadow content structure ready for future activation

---

## Success Criteria

- [ ] Only Jost font exists in production (zero Cormorant references)
- [ ] Hero is minimal: h1 + gold line + 2 identical buttons
- [ ] Academy button matches Reservar Cita style exactly (border, hover, spacing)
- [ ] No visible content removed (only subtle, intentional cleanup)
- [ ] Shadow content properly structured (testimonials commented, ready to activate)
- [ ] Build passes with zero font warnings
- [ ] Team can deploy and verify visually

---

## Key Files to Modify

| File | Task | Priority |
|------|------|----------|
| `src/styles/globals.css` | Remove Cormorant Garamond declaration | P0 |
| `src/components/home/HeroSection.tsx` | Clean typography + structure | P0 |
| `src/components/academy/AcademyPage.tsx` | Add shadow testimonials | P1 |
| `src/components/tattoo/BookingSection.tsx` | Add shadow reviews | P1 |

---

## Constraints & Decisions

- **No backend changes** — pure frontend refinement
- **No visible feature removal** — only structure and typography updates
- **Shadow content is commented** — discoverable but not rendered
- **Autonomous approval** — no external review gate
- **Tight timeline** — complete by end of week (2026-04-18)

---

## Domain Insights

*(From research)*

- **User personas:** Booking clients (portfolio-first), academy prospects (instructor credibility), style seekers (fine-line aesthetic)
- **Success metric:** Booking conversion >40% from portfolio view, <2 clicks to form
- **Competitive pattern:** Minimal, portfolio-driven design with consistent CTAs ← Your approach aligns well
- **Accessibility:** Gold (#c9b99a) on dark (#1a1814) = 4.5:1 contrast ✓ WCAG AA compliant

---

## Next Steps

1. Run `/gsd-plan-phase 1` to begin typography unification
2. Monitor build output for font warnings
3. Test hero visually in browser before committing
4. PR review (autonomous, no external gate)

---

## Notes

- Domain research shows tattoo studios succeed with portfolio-first, minimal nav approach — your plan aligns with market best practices
- Testimonials (shadow content) are critical for trust; ensuring schema is ready now speeds up future activation
- Gold border button style is strong and consistent — replicating for Academy maintains brand clarity
