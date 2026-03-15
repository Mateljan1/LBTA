# Plan implementation status — 2026-03-11

Review of the codebase against the three plans to see what’s already done.

---

## 1. Schedules Page UX Overhaul (`plans/schedules-page-ux-overhaul-plan.md`)

**Status: DONE** (core); **optional Phase 4 not implemented**

| Requirement | In code? | Evidence |
|-------------|----------|----------|
| Sticky in-page nav (Programs, Private Lessons, Camps, Leagues) | ✅ | `components/schedules/SchedulesAnchorNav.tsx` — sticky `top-16`, anchor links, smooth scroll |
| Nav order: Private Lessons second | ✅ | `SECTIONS` array: programs → private → camps → leagues |
| Section order: Programs → Private → Camps → Leagues | ✅ | `app/schedules/page.tsx`: ProgramsSection → PrivateCoachingSection → CampsSection → LeaguesSection |
| `scroll-margin-top` so headings not under nav | ✅ | All four sections: `id="programs"` etc. + `scroll-mt-28` on section root |
| 48px touch targets, focus ring, keyboard | ✅ | `min-h-[48px]`, `focus:ring-2 focus:ring-brand-victoria-cove` |
| Mobile: horizontal scroll nav | ✅ | `overflow-x-auto`, `whitespace-nowrap` |
| No modal on load | ✅ | No filter/modal in schedules page |
| **Phase 4: Active section highlighting** | ❌ | No `IntersectionObserver` or `aria-current` in `SchedulesAnchorNav.tsx` |

**Conclusion:** Phases 1–3 are implemented. Only the optional “active section” highlight (Phase 4) is missing.

---

## 2. Apply Brand Guide to Website (`plans/apply-brand-guide-to-website-plan.md`)

**Status: DONE**

| Requirement | In code? | Evidence |
|-------------|----------|----------|
| `--horizon` token in `:root` | ✅ | `app/globals.css`: `--horizon: linear-gradient(90deg, #2E8B8B, #E8834A 35%, #C4963C 50%, #E8834A 65%, #2E8B8B)` |
| `.horizon-line` / `.horizon-line-thin` use `var(--horizon)` | ✅ | `background: var(--horizon)` in both |
| `.section-quote` (gradient left border) | ✅ | In `globals.css` with border-image gradient (Victoria Cove → Sunset Cliff) |
| PullQuote uses gradient quote style | ✅ | `components/ui/PullQuote.tsx`: `className={… section-quote …}` |
| `.section-horizon` utility | ✅ | In `globals.css`; used on homepage and about |
| HorizonDivider / section-horizon on key sections | ✅ | Homepage, about, programs, philosophy, coaches, etc. use HorizonDivider; homepage and about use `.section-horizon` |
| .cursorrules Brand Guide reference | ✅ | Part 10 and Part 7: “Brand Guide”, “HorizonDivider or .section-horizon”, “.section-quote” |

**Conclusion:** Brand guide application is implemented as specified.

---

## 3. Canva image setup (`plans/canva-image-setup.md`)

**Status: REFERENCE DOC — not an implementation to “do” in code**

This plan is a **process guide** for people creating assets in Canva: canvas sizes, export format, WebP conversion (e.g. Squoosh), and where to put files in the repo (`public/images/hero/`, `public/images/coaches/`, etc.). There is no feature or component to build; the doc is the deliverable.

- **Doc:** Present at `plans/canva-image-setup.md`.
- **Project structure:** Matches the doc (e.g. `public/images/hero/`, `public/images/coaches/`, `public/images/programs/`, `public/logos/` exist and are used by the site).

**Conclusion:** Nothing to implement in code. Use the doc when creating or exporting images for the site.

---

## Summary

| Plan | Status | What’s left (if any) |
|------|--------|----------------------|
| **Schedules UX** | Done (core) | Optional: active section highlighting in sticky nav (Phase 4) |
| **Brand guide** | Done | Nothing |
| **Canva** | N/A (doc only) | Use the doc when producing assets; no code work |
