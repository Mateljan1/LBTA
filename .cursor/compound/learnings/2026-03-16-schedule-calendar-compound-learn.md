# Schedule Calendar by Location — Compound Learn

**Date:** 2026-03-16  
**Feature:** Calendar view by location (Moulton, Alta, LBHS), by season, print/PDF; redirect old Winter schedule.

---

## What shipped

- **lib/calendar-schedule.ts** — Schedule by location → day from programs-data (single source).
- **ScheduleCalendarView** — Season + location filters, print-friendly; 48px touch targets.
- **/schedules/calendar** — Full-page calendar; `?season=winter` supported; Next 16 async `searchParams`.
- **Link** from /schedules: "View schedule by location (print or save as PDF)".
- **Redirect** `/LBTA_Winter2026_Schedule.html` → `/schedules/calendar?season=winter`; static file removed.

---

## Corrections captured

| Original | Correction |
|----------|------------|
| Next 16 page using searchParams synchronously | Page `async`; `searchParams` as `Promise<{ season?: string }>`; `await searchParams` before use. |
| Filter buttons with min-height below 48px | Location filter buttons: `min-h-[48px]` (WCAG touch target). |

---

## Pattern captured

- **schedule-by-location-single-source** — Calendar/print views by location must use only program getters from programs-data; normalize slot location (slot.location or formatLocation); no hardcoded names/prices.

---

## Review outcomes

- Security: PASS (season allowlisted, no XSS, static redirect).
- Data integrity: PASS (single source).
- Pattern: PASS (brand tokens, season tabs aligned with ProgramsSection).
- Optional later: arrow-key nav for season tabs; tabpanel + aria-controls.

---

## Deploy

- Commit: `feat(schedules): calendar by location, print/PDF, redirect old Winter schedule`
- Pushed to main; Vercel production deploy completed.
- Production: https://lbta-website.vercel.app (and project-specific URL).
