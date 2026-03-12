# Schedule UX: pricingNote, Schedule Note, Server-Side Data, Time Format

**Date:** 2026-03-12  
**Compound:** Full loop (Plan → Work → Review → Validate → Deploy → Compound)

---

## Overview

Three improvements: (1) Surface `pricingNote` and schedule slot `note` in the UI; (2) Load schedule programs on the server and pass as props to trim client bundle; (3) Normalize time strings across program JSON to a single format (e.g. en-dash, "11:45 AM–12:45 PM").

---

## Problem Statement

- **pricingNote / schedule note:** Data already has `pricingNote` (e.g. "Friday Match Play: $65/mo or $25/session") and schedule items with `note` (e.g. "Separate pricing", "Training", "Match Play"); the UI does not show them, so users miss context.
- **Client bundle:** ProgramsSection is client and imports programs-data, which pulls winter/spring-summer/fall JSON into the client bundle (~34KB).
- **Time format:** Time strings mix hyphen vs en-dash and "11:45 AM-12:45 PM" vs "9:00-9:45 AM"; normalize for consistency and future edits.

---

## Proposed Solution

1. **UI:** Add optional `pricingNote` to Program/ProgramForDisplay; in ProgramRow (and optionally ProgramCard) render `pricingNote` under price/drop-in; render `slot.note` after time (e.g. "Sat 10:00–11:30 — Separate pricing"). Pass through `pricingNote` in `springSummerToProgram`.
2. **Server-side data:** Make `app/schedules/page.tsx` a Server Component; load `programsBySeason` (winter, spring, summer, fall) via programs-data getters; pass to a new client wrapper `SchedulesPageClient` with modal state; `ProgramsSection` receives `programsBySeason` and `onRegister` (no programs-data import). Other sections keep receiving year2026/camps/leagues as today or from server.
3. **Time format:** In `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, normalize every `schedule[].time` to: use Unicode en-dash (U+2013) between start and end; same period "9:00–9:45 AM"; span "11:45 AM–12:45 PM". Leave leagues-2026 as-is or align to same rule.

---

## Implementation Steps

### Phase 1: Types and data pass-through
- [ ] 1.1 Add `pricingNote?: string` to `Program` in ProgramCard.tsx (Schedule already has `note?`).
- [ ] 1.2 Add `pricingNote?: string` to `ProgramForDisplay` in programs-data.ts; in `springSummerToProgram` set `pricingNote: p.pricingNote`.
- [ ] 1.3 Winter/Fall programs from JSON already have pricingNote; ensure getWinter2026Programs and getFall2026Programs return type allows it (Program is used as ProgramForDisplay shape).

### Phase 2: UI — ProgramRow
- [ ] 2.1 In ProgramRow (desktop and mobile), after drop-in line, when `program.pricingNote` exists render a small line (e.g. `font-sans text-[11px] text-brand-pacific-dusk/60`).
- [ ] 2.2 In ProgramRow schedule block, when `slot.note` exists render it after time (e.g. " — " + slot.note) on same line or small line below; desktop and mobile.

### Phase 3: UI — ProgramCard (optional consistency)
- [ ] 3.1 In ProgramCard, if program has `pricingNote` (add to Program type and use in card), show under price area. If schedule slot has `note`, show after time in session list.

### Phase 4: Server-side schedule data
- [ ] 4.1 Create `SchedulesPageClient` ('use client'): props `programsBySeason: Record<SeasonKey, Program[]>`, season CTA, year2026 sections (camps, privateCoaching, etc.), onRegister state lives here; renders hero, anchor nav, ProgramsSection, PrivateCoachingSection, CampsSection, LeaguesSection, CTA, LuxuryRegistrationModal.
- [ ] 4.2 In `app/schedules/page.tsx` remove 'use client'; make it async Server Component; call getWinter2026Programs(), getSpringProgramsForDisplay(), getSummerProgramsForDisplay(), getFall2026Programs(); build programsBySeason; pass to SchedulesPageClient with year2026 data and getSeasonCTA().
- [ ] 4.3 ProgramsSection props: `programsBySeason: Record<SeasonKey, Program[]>`, `onRegister`; internal state activeSeason; `programs = programsBySeason[activeSeason]`; remove all programs-data imports from ProgramsSection.

### Phase 5: Time string normalization
- [ ] 5.1 Normalize all `schedule[].time` in winter2026.json, spring-summer-2026.json, fall2026.json: replace hyphen with en-dash (–); ensure pattern "HH:MM–HH:MM AM/PM" or "HH:MM AM–HH:MM PM" consistently (e.g. "11:45 AM–12:45 PM", "9:00–9:45 AM").

### Phase 6: Verification
- [ ] 6.1 Build and lint pass.
- [ ] 6.2 No regression: schedules page loads, season tabs work, register opens modal, price and new notes visible.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/ProgramCard.tsx` | Modify | Add pricingNote to Program; optionally render pricingNote and slot.note |
| `lib/programs-data.ts` | Modify | ProgramForDisplay.pricingNote; springSummerToProgram pass pricingNote |
| `components/schedules/ProgramRow.tsx` | Modify | Render pricingNote under price; render slot.note after time |
| `components/schedules/ProgramsSection.tsx` | Modify | Accept programsBySeason prop; remove programs-data import |
| `app/schedules/page.tsx` | Modify | Server Component; load programsBySeason; render SchedulesPageClient |
| `components/schedules/SchedulesPageClient.tsx` | Create | Client wrapper with modal state; receives programsBySeason and year data |
| `data/winter2026.json` | Modify | Normalize time strings (en-dash) |
| `data/spring-summer-2026.json` | Modify | Normalize time strings |
| `data/fall2026.json` | Modify | Normalize time strings |

---

## Code Review Summary (compound:review)

- **Security Sentinel:** ⚠️ WARNINGS — No XSS (notes from JSON, rendered as text); no secrets in props. Recommendation: add runtime validation (e.g. Zod) for year2026 and program data if JSON shape changes.
- **Performance Oracle:** ⚠️ WARNINGS — Server-side data load reduces client bundle (programs-data/season-utils not on client). Applied: trim `year2026` to only the five keys used by client; optional: load LeaguesSection data on server, `useMemo` for getPrice, `React.memo(ProgramRow)`.
- **Pattern / Architecture:** ⚠️ WARNINGS — Server/client split and Year2026Sections boundary correct. Applied: single shared type `SeasonDataForDisplay` (lib/season-utils), used by SchedulesPageClient and ProgramsSection; server builds `year2026` with only privateCoaching, monthlyPrograms, discounts, scholarships, camps.

## Success Criteria

- [x] pricingNote appears under price in ProgramRow when present.
- [x] Schedule slot note (e.g. "Separate pricing") appears with the slot when present.
- [x] Schedules page is server component; program list data passed as props; client bundle does not include program JSON.
- [x] All program schedule times use en-dash and consistent format.
- [x] Build passes; no lint errors.

---

## Relevant Learnings

- schedule-data-single-entry: use programs-data getters; after this change, only the server page calls them and passes data.
- program-data-shape-consistent-seasons: pricingNote is part of that shape.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| getSeasonCTA() or year2026 used in server context | getSeasonCTA is pure; year2026Data can be imported in server page and passed as props. |
| Large props payload | programsBySeason is four arrays of ~15 items each; serialized props are acceptable. |
