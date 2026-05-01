# Compound Learn — 2026-03-18 (Drop-in Pricing + Private Booking with Coach)

**Source:** Implementation plan `plans/drop-in-and-private-booking-plan.md` + work completed same session  
**Scope:** UTR leagues drop-in pricing on schedules; private lesson flow from schedules and coach bios with coach pre-selection; Supabase + ActiveCampaign dual backup.

---

## Summary

- **Plan:** Drop-in pricing for UTR Circuit divisions; private booking with coach slug in URL and defaultCoach in modal; per-coach Book CTA on schedules; dual tracking (Supabase + AC) verified.
- **Work:** Data (leagues-2026.json drop_in), schema (utrDivisionSchema), LeagueRow/LeaguesSection, lib/coach-slug.ts, coach bios → /book?type=private&coach=slug, book page defaultCoach, PrivateLessonModal defaultCoach, PrivateCoachingSection per-coach Book links, book API comment for dual backup.
- **Learnings:** 1 correction, 2 patterns, 1 quality bar.

---

## CORRECTIONS (added to corrections.jsonl)

| Original | Correction |
|----------|------------|
| Coach bio or schedules linking to /book without type or coach context | Link to `/book?type=private&coach=<slug>` and resolve slug to display name on book page; pass defaultCoach to modal so the form pre-selects that coach. Single source for slug↔name: data/coaches.json via lib/coach-slug. |

---

## PATTERNS (added to patterns.json)

- **league-drop-in-in-data-and-ui** — When a league/division has both season price and per-session drop-in: add optional `drop_in` (number) to the division in data; extend schema (e.g. utrDivisionSchema) with `drop_in: z.number().optional()`; in the row component accept optional `dropIn` prop and render e.g. "Drop-in $X" under the main price (desktop and mobile). Single source in data.
- **contextual-private-booking-coach-slug** — When the user can start a private lesson request from a coach-specific context (bio, schedules table): use URL `/book?type=private&coach=<slug>`; book page reads coach param, resolves slug→display name (e.g. lib/coach-slug from data/coaches.json), passes defaultCoach to the private modal; modal accepts optional defaultCoach and on open sets form coach to that value so the user sees the right coach pre-selected.

---

## QUALITY BARS (added to quality-bars.json)

- **contextualBookingCoachPreSelect** (should) — When linking to private lesson booking from a coach context (coach bio, schedules “Book with [Coach]”), use `/book?type=private&coach=<slug>`, resolve slug to display name on the book page, and pass defaultCoach to the private lesson modal so the form pre-selects that coach.

---

## Files touched

- data/leagues-2026.json, lib/schedule-schemas.ts, components/schedules/LeagueRow.tsx, LeaguesSection.tsx
- lib/coach-slug.ts (new), app/book/page.tsx, components/PrivateLessonModal.tsx, components/schedules/PrivateCoachingSection.tsx
- app/coaches/* (andrew-mateljan, former-coach-removed, peter-defrantz, allison-cronk), app/api/book/route.ts
