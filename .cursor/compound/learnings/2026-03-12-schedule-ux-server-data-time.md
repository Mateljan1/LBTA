# Schedule UX: pricingNote, server-side data, time format

**Date:** 2026-03-12  
**Plan:** `plans/schedule-ux-server-data-time-plan.md`  
**Compound:** Plan → Work → Review → Validate → Compound (deploy skipped)

## What we did

1. **Surface pricingNote and schedule note in UI**
   - Added `pricingNote?: string` to Program (ProgramCard) and ProgramForDisplay (programs-data); pass-through in springSummerToProgram.
   - ProgramRow: show `pricingNote` under price/drop-in; show `slot.note` after time as " — {note}" (desktop and mobile).
   - ProgramCard: show `pricingNote` in Investment section; show `slot.note` after time in schedule list.

2. **Server-side schedule data**
   - `app/schedules/page.tsx` is a Server Component (no 'use client'): calls getWinter2026Programs(), getSpringProgramsForDisplay(), getSummerProgramsForDisplay(), getFall2026Programs(), getAllSeasons(), getCurrentSeason(), getSeasonCTA(); builds programsBySeason and year2026; passes to SchedulesPageClient.
   - New `SchedulesPageClient.tsx`: client component; holds selectedProgram modal state; receives programsBySeason, seasons, initialSeason, seasonCta, year2026; renders hero, Breadcrumbs, SchedulesAnchorNav, ProgramsSection, PrivateCoachingSection, CampsSection, LeaguesSection, DarkSection, LuxuryRegistrationModal.
   - ProgramsSection: props programsBySeason, seasons, initialSeason, onRegister; no programs-data or JSON imports; programs = programsBySeason[activeSeason].

3. **Time string format**
   - Normalized all `schedule[].time` in data/winter2026.json, data/spring-summer-2026.json, data/fall2026.json to use Unicode en-dash (U+2013), e.g. "11:45 AM–12:45 PM".

4. **Review fixes**
   - Trimmed year2026 payload: server builds object with only privateCoaching, monthlyPrograms, discounts, scholarships, camps.
   - Consolidated season type: `SeasonDataForDisplay` in lib/season-utils.ts; SchedulesPageClient and ProgramsSection use it.

## Corrections

- When splitting server/client, ensure the client’s payload type (e.g. Year2026Sections) matches the actual JSON shape used by child components (PrivateCoachingSection, CampsSection); avoid a simplified type that causes build errors.
- Build the server payload explicitly (pick keys from JSON) so the client receives only what it needs; avoid passing the full imported JSON object when the type is a subset.

## Patterns

- **Schedules page data flow:** Server Component loads all schedule data (programs + year2026 slice); single client component receives props and owns modal state; sections receive data via props only.
- **Shared boundary types:** For data passed from server to client, define one type (e.g. SeasonDataForDisplay, Year2026Sections) and use it in both the server page and client components to avoid drift.

## Standards

- Schedule time strings in JSON: use en-dash (–) between start and end time; consistent format "HH:MM AM–HH:MM PM" or "HH:MM–HH:MM AM".
