# Schedule Calendar by Location — Implementation Plan

**Status:** Phases 1–3 done (data + UI). Remaining: print styles (4.1), optional PDF API (4.2), redirect/legacy HTML (5.1), and success-criteria verification.

## Overview

Add a **calendar view of the schedule by location** so players can see and **download** a visual schedule (by location, by class, by season: Winter, Spring, Summer, Fall). All content is driven from existing `/data/*.json` and `lib/programs-data.ts` (single source of truth). No hardcoded schedule or prices.

## Problem Statement

- Players want a **visual, at-a-glance** schedule (calendar style) **by location** (Moulton, Alta, LBHS).
- They want to **download** it (PDF or print-friendly page) for offline use.
- Schedules differ by **season** (Winter, Spring, Summer, Fall); each season has its own programs and dates.
- The existing `public/LBTA_Winter2026_Schedule.html` is **static and hand-maintained**, uses non-brand fonts (Playfair/Work Sans), and duplicates content that already exists in `data/winter2026.json` — it drifts and violates single-source-of-truth.

## Proposed Solution

1. **Data layer**: Add calendar-specific helpers in `lib/` that derive **by-location, by-day** schedule from existing program data. Handle per-slot location when `schedule[].location` exists; otherwise use program `location` and normalize (Moulton, Alta, LBHS) consistently with `formatLocation`.
2. **UI**: A **Schedule Calendar** view on the schedules flow — either a new page `/schedules/calendar` or a dedicated section on `/schedules` with:
   - **Season selector** (Winter / Spring / Summer / Fall)
   - **Location filter** (All, Moulton, Alta, LBHS)
   - **Visual layout**: By location → by day (Mon–Sun) → list of classes (program name, time, duration, ages/category). Optionally a simple **week grid** (days as columns, time blocks as rows) for a true “calendar” feel.
3. **Download**: 
   - **Print-friendly** CSS so “Print → Save as PDF” works from the calendar view (primary path).
   - Optional later: API route that returns a PDF (e.g. server-side HTML→PDF) for a “Download PDF” button.
4. **Brand**: Use Cormorant + DM Sans and brand tokens only; no Playfair, Work Sans, or hardcoded hex. Replace or deprecate `public/LBTA_Winter2026_Schedule.html` with this data-driven experience.

## Implementation Steps

### Phase 1: Data & location normalization

- [x] **1.1** Add `lib/calendar-schedule.ts` (or extend `lib/programs-data.ts`):
  - Export `DAY_ORDER: string[]` = `['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']` for consistent ordering.
  - Export `LOCATION_KEYS: string[]` = `['Moulton','Alta','LBHS']` (match `formatLocation` output).
  - Add `normalizeSlotLocation(slot: { location?: string }, programLocation: string): string` — if `slot.location` exists, map it to one of Moulton/Alta/LBHS (e.g. “LB High School” → LBHS, “Moulton Meadows” → Moulton); else use `formatLocation(programLocation)`. For compound program locations (e.g. “Moulton + Saturday at LBHS”), use slot day to infer (e.g. Saturday → LBHS) or slot.location when present.
  - Add `getScheduleByLocationByDay(season: SeasonKey): Record<string, Record<string, CalendarSlot[]>>` where key is location (Moulton/Alta/LBHS), then day. `CalendarSlot` = { programName, programId, category, ages, time, duration, coach?, location? }. Source programs from existing getters: `getWinter2026Programs()`, `getSpringProgramsForDisplay()`, `getSummerProgramsForDisplay()`, `getFall2026Programs()`. Flatten each program’s `schedule[]` into slots; assign location per slot using `normalizeSlotLocation`; group by location then day.
  - Add `getSeasonLabel(season: SeasonKey): string` and `getSeasonDates(season: SeasonKey): string` using existing season data from `getAllSeasons()` and spring/summer dates from `getSpringSummer2026()`.
- [x] **1.2** Add unit tests or at least a small script that asserts `getScheduleByLocationByDay('winter')` returns expected structure and that a known program (e.g. Little Tennis Stars) appears under correct location and days.

### Phase 2: Calendar UI component

- [x] **2.1** Create `components/schedules/ScheduleCalendarView.tsx` (client component):
  - Props: `season: SeasonKey`, `locationFilter: string` ('' = all, or Moulton/Alta/LBHS), `scheduleByLocationByDay` (from server), `seasonLabel`, `seasonDates`.
  - Render: Section heading “Schedule by location” + season selector (tabs or dropdown) + location filter (All / Moulton / Alta / LBHS).
  - For each location (filtered): show location name (use brand badge styles), then for each day in `DAY_ORDER` show list of slots (program name, time, duration, ages). Use brand typography (Cormorant headlines, DM Sans body) and tokens (e.g. `brand-pacific-dusk`, `brand-sandstone`).
  - Optional: add a **week-grid** variant (table: rows = time blocks, columns = days) for one location at a time for true calendar feel.
- [x] **2.2** Add print-only CSS (in component or `globals.css`): hide nav/footer/buttons when `@media print`; ensure calendar content has clear page breaks per location if needed; use same brand fonts for print.

### Phase 3: Integration on Schedules page

- [x] **3.1** Option B implemented:
  - **Option A**: Add a new section “Calendar by location” on `/schedules` below Programs (or in anchor nav) that renders `ScheduleCalendarView` with data passed from server (programsBySeason already loaded; compute `scheduleByLocationByDay(initialSeason)` on server and pass season + data). Include a “Print schedule” button that calls `window.print()`.
  - **Option B**: Add route `app/schedules/calendar/page.tsx` that loads programs for all seasons (or selected season), computes `scheduleByLocationByDay`, and renders full-page `ScheduleCalendarView` with season selector and “Print / Download PDF” CTA. Link from `/schedules` as “Download calendar” or “View calendar by location”.
- [x] **3.2** From Schedules page, link added: “View calendar by location” or “Download schedule (PDF)” that goes to calendar view or opens print dialog.

### Phase 4: Download / PDF

- [ ] **4.1** Ensure print styles are complete: calendar view is self-contained when printed (no duplicate site chrome), with title “LBTA [Season] Schedule by Location” and dates in header/footer if desired.
- [ ] **4.2** (Optional) Add API route `app/api/schedule-pdf/route.ts`: accepts `season` (and optionally `location`), builds HTML from same data (server-side render of a minimal calendar HTML string or use a shared React component with renderToString), then uses a PDF library (e.g. puppeteer, @react-pdf/renderer, or pdfn) to return PDF. Rate-limit and validate `season`. If deferred, document “Print → Save as PDF” as the supported download path.

### Phase 5: Deprecate legacy static HTML

- [ ] **5.1** Add a redirect or replace link: if any external link points to `public/LBTA_Winter2026_Schedule.html`, redirect to `/schedules/calendar?season=winter` (if using Option B) or to `/schedules#calendar` (if using Option A). Optionally remove or rename `public/LBTA_Winter2026_Schedule.html` to `LBTA_Winter2026_Schedule.legacy.html` and add a short comment that the canonical schedule is now the data-driven calendar.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/calendar-schedule.ts` | Create | Location/day aggregation, normalizeSlotLocation, getScheduleByLocationByDay, season labels/dates |
| `components/schedules/ScheduleCalendarView.tsx` | Create | Client component: calendar by location + day, season/location filters, print-friendly |
| `app/schedules/calendar/page.tsx` | Create (if Option B) | Full-page calendar with season selector and print CTA |
| `app/schedules/page.tsx` | Modify | Pass calendar data or link to calendar page |
| `components/schedules/SchedulesPageClient.tsx` | Modify | Add “Calendar by location” section (Option A) or link (Option B) |
| `components/schedules/SchedulesAnchorNav.tsx` | Modify (optional) | Add “Calendar” anchor if section exists |
| `app/globals.css` or component CSS | Modify | Print styles for calendar (hide nav/footer, page breaks) |
| `public/LBTA_Winter2026_Schedule.html` | Modify / Rename | Redirect or deprecate; document canonical calendar URL |
| `next.config.js` or `next.config.ts` | Modify (optional) | Redirect old schedule HTML to new calendar |

## Success Criteria

- [ ] Players can view schedule **by location** (Moulton, Alta, LBHS) and **by season** (Winter, Spring, Summer, Fall) on the site.
- [ ] Calendar view is **visual** (by location → by day → list of classes; optional week grid).
- [ ] Players can **download** via browser Print → Save as PDF (print-friendly layout).
- [ ] All schedule and pricing content comes from **single source** (`data/*.json` + `lib/programs-data.ts`); no hardcoded program names, times, or prices in calendar components.
- [ ] Brand: Cormorant + DM Sans, brand tokens only; no Playfair, Work Sans, or raw hex.
- [ ] Existing compound learnings respected: data-integrity (prices/copy from data), anchor scroll-margin if new in-page section, focus/aria for filters and buttons.

## Research Sources

- Existing: `lib/programs-data.ts` (`formatLocation`, getWinter2026Programs, getSpringProgramsForDisplay, getSummerProgramsForDisplay, getFall2026Programs`), `lib/season-utils.ts` (getAllSeasons, SeasonKey), `lib/schedule-schemas.ts` (program/slot shapes).
- Existing: `public/LBTA_Winter2026_Schedule.html` (structure by location/day; to be replaced by data-driven version).
- Web: Next.js PDF generation (print-first approach; optional API later).

## Relevant Learnings

- **quality-bars.json**: No hardcoded prices or duplicate program lists; single source in `/data` or `lib/programs-data`.
- **patterns.json**: `prices-in-data-only`; `single-source-dropdown-options` for season/location selectors (derive options from same data).
- **COMPOUND_LEARN.md**: Use brand tokens (e.g. `brand-pacific-dusk`, `brand-sandstone`); no Playfair/Work Sans; footer/dark text contrast (N/A for calendar if light background); anchor sections need `scroll-mt-28` if sticky nav present.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Compound program locations (e.g. “Mon/Wed Moulton; Fri LBHS”) | Use `schedule[].location` when present; else infer from program.location string (e.g. “Saturday at LBHS” → Saturday slots = LBHS) and default others via formatLocation. |
| Spring/Summer have different date ranges | Use `getSpringSummer2026().spring.dates` and `.summer.dates` for labels; keep single “Spring” or “Summer” calendar per season key. |
| Print layout too wide on mobile | Use responsive layout (stack by location, then by day) and print styles that reduce width or scale. |
| Legacy HTML linked externally | Add redirect in next.config or middleware from `/LBTA_Winter2026_Schedule.html` to new calendar URL. |

---

**Next step**: Execute Phase 1 (data layer), then Phase 2 (component), then Phase 3 (integration). Phase 4 (PDF API) can be a follow-up.
