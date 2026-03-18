# Drop-in Pricing + Private Lesson Booking Flow — Implementation Plan

## Overview

Add (1) visible drop-in pricing for UTR Circuit / Saturday Matchplay leagues on the schedules page, and (2) a cohesive private-lesson booking flow from schedules and coach bios—with coach pre-selection, confirmation, and dual tracking in Supabase and ActiveCampaign.

## Problem Statement

- **Drop-in:** The schedules page shows UTR divisions (Color Ball, UTR 2.0–4.0, etc.) with only season price (e.g. $349, $399). The Spring 2026 doc (LBTA_rec1_Spring2026_.docx) lists per-session drop-in prices; these are not visible in the UI.
- **Private booking:** Users cannot start a private-lesson request for a specific coach from the schedules section or from a coach bio. Coach bios link to `/book` without `type=private` or coach; the private flow exists but is not discoverable or pre-filled by context. When users “leave the flow” (e.g. from a program or coach page), they should be able to book a private with that coach and receive confirmation, with leads and signup intent stored in both Supabase and ActiveCampaign.

## Proposed Solution

- **Data:** Add optional `drop_in` (number) to UTR divisions in `data/leagues-2026.json` and pass it through `parseLeagues`. Extend `LeagueRow` to show “Season $X · Drop-in $Y” (or “$X/season or $Y drop-in”) when `drop_in` is present. Use values from the Spring 2026 doc: Color Ball $55, UTR 2.0–4.0 $65, UTR 3.0–5.0 $65, UTR 5.0–7.0 $65, Doubles Round Robin $65.
- **Private flow from schedules:** Keep “Book a Private Lesson” in PrivateCoachingSection; add per-coach “Book” links (e.g. `/book?type=private&coach=andrew-mateljan`) so users can book with a specific coach. Coach bio pages: change CTA from `/book` to `/book?type=private&coach=<slug>`.
- **Book page + modal:** Book page reads `searchParams.type` and `searchParams.coach`; when `type=private` and `coach` is a valid slug, open PrivateLessonModal and pass `defaultCoach` (display name resolved from slug). PrivateLessonModal accepts optional `defaultCoach` and pre-selects that coach in the form.
- **Confirmation & tracking:** Existing behavior is retained: book API returns success, thank-you page is used (with optional `?type=private`). Supabase `storeLead` already receives `payload: { bookingType, coach, option }` for private and `{ program, location }` for trial. ActiveCampaign already gets contact + tags + list. No change required for “two backups”; verify both are called and payload is complete.

(Source: Codebase — LeagueRow, LeaguesSection, leagues-2026.json, PrivateLessonModal, book API, storeLead; LBTA_rec1_Spring2026_.docx for UTR drop-in amounts.)

## Implementation Steps

### Phase 1: Data and schema
- [ ] 1.1 Add `drop_in` (number, optional) to each UTR division in `data/leagues-2026.json`: Color Ball 55, UTR 2.0–4.0 65, UTR 3.0–5.0 65, UTR 5.0–7.0 65, Doubles Round Robin 65.
- [ ] 1.2 In `lib/schedule-schemas.ts` (or wherever `parseLeagues` / UTR division type lives), allow optional `drop_in` on UTR division so TypeScript and runtime accept it.

### Phase 2: Leagues UI — drop-in
- [ ] 2.1 Extend `LeagueRow` props: add optional `dropIn?: number`. When present, render below (or beside) `price` a line such as “Drop-in $55” (desktop and mobile).
- [ ] 2.2 In `LeaguesSection`, for each `utr.divisions` item, pass `dropIn={div.drop_in}` (or equivalent from parsed leagues). Ensure parsed leagues type includes `drop_in`.

### Phase 3: Coach slug → name and book URL
- [ ] 3.1 Add a small helper or use `data/coaches.json`: map coach slug to display name (e.g. `andrew-mateljan` → `Andrew Mateljan`) for use on book page and in modal. Ensure book page and PrivateLessonModal can resolve `?coach=slug` to a name that matches `year2026.privateCoaching[].coach`.
- [ ] 3.2 Coach bio pages: change “Book” / “Book a lesson” link from `href="/book"` to `href="/book?type=private&coach=<slug>"` (andrew-mateljan, robert-lebuhn, peter-defrantz, allison-cronk).

### Phase 4: Book page and PrivateLessonModal — coach pre-select
- [ ] 4.1 Book page: when `searchParams.type === 'private'` and `searchParams.coach` is present, resolve slug to display name and pass `defaultCoach={displayName}` to PrivateLessonModal; open private modal by default (already handled by existing `isPrivate` from `type=private`).
- [ ] 4.2 PrivateLessonModal: add optional prop `defaultCoach?: string`. When provided, set initial `formData.coach` to `defaultCoach` (and keep it in sync if modal is opened with a new default).

### Phase 5: Schedules — per-coach “Book” CTA
- [ ] 5.1 In PrivateCoachingSection (desktop table and mobile cards), add a “Book” (or “Book with [Name]”) link per coach pointing to `/book?type=private&coach=<slug>`. Use coaches.json or a static map to get slug from coach name (Andrew Mateljan → andrew-mateljan, etc.).

### Phase 6: Verification
- [ ] 6.1 Confirm book API continues to call `storeLead` with full payload (private: bookingType, coach, option; trial: program, location) and that ActiveCampaign receives contact + tags. No code change required if already correct.
- [ ] 6.2 Optional: add a short comment in book route or leads-store that “Leads and signup intent are stored in Supabase (leads table) and ActiveCampaign (contact + lists + tags) for redundancy.”

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/leagues-2026.json` | Modify | Add `drop_in` to each UTR division |
| `lib/schedule-schemas.ts` | Modify | Allow optional `drop_in` on UTR division type/parse |
| `components/schedules/LeagueRow.tsx` | Modify | Add `dropIn` prop and render “Drop-in $X” |
| `components/schedules/LeaguesSection.tsx` | Modify | Pass `dropIn` from division to LeagueRow |
| `app/coaches/andrew-mateljan/page.tsx` | Modify | Link to `/book?type=private&coach=andrew-mateljan` |
| `app/coaches/robert-lebuhn/page.tsx` | Modify | Link to `/book?type=private&coach=robert-lebuhn` |
| `app/coaches/peter-defrantz/page.tsx` | Modify | Link to `/book?type=private&coach=peter-defrantz` |
| `app/coaches/allison-cronk/page.tsx` | Modify | Link to `/book?type=private&coach=allison-cronk` |
| `app/book/page.tsx` | Modify | Read `coach` searchParam; resolve slug→name; pass defaultCoach to PrivateLessonModal |
| `components/PrivateLessonModal.tsx` | Modify | Accept `defaultCoach?: string`; pre-select coach in form |
| `components/schedules/PrivateCoachingSection.tsx` | Modify | Add per-coach “Book” link to `/book?type=private&coach=<slug>` |
| `lib/coach-slug.ts` or inline in book page | Create or inline | Slug ↔ display name map (use data/coaches.json or static map) |

## Out of scope (this plan)

- UTR league registration form or modal (currently “Register” goes to contact/inquire); only pricing display and private booking flow.
- Email confirmation content or new ActiveCampaign automations; existing thank-you and AC behavior remain.
- Changes to Supabase schema (existing `leads.payload` is sufficient).
- Drop-in registration flow (e.g. “Register for drop-in”); only showing drop-in price.

## Success Criteria

- [ ] UTR divisions on schedules page show both season price and drop-in price when `drop_in` is in data.
- [ ] From coach bio, “Book” goes to `/book?type=private&coach=<slug>` and private modal opens with that coach pre-selected.
- [ ] From schedules Private Coaching section, each coach has a “Book” link to the same URL; book page opens private modal with that coach pre-selected.
- [ ] Submitting private request still stores lead in Supabase (payload includes bookingType, coach, option) and syncs to ActiveCampaign; thank-you flow unchanged.
- [ ] Build and lint pass.

## Acceptance checklist

- [ ] [Drop-in visible] → Schedules page, UTR Circuit section: each division row shows e.g. “$349” and “Drop-in $55” (or equivalent).
- [ ] [Coach bio → private with coach] → Click “Book” on a coach bio → book page opens with private modal and correct coach selected.
- [ ] [Schedules → private with coach] → Click “Book” next to a coach in Private Coaching → same behavior.
- [ ] [Tracking] → Submit private form → verify (manual or log) storeLead called with payload containing coach/option; AC receives contact (existing behavior).

## Research Sources

- LBTA_rec1_Spring2026_.docx (extracted text: UTR Color Ball Drop-in $55, UTR 2.0–4.0 $65, UTR 3.0–5.0 $65, UTR 5.0–7.0 $65).
- Codebase: LeagueRow, LeaguesSection, leagues-2026.json, PrivateLessonModal, app/book/page.tsx, app/api/book/route.ts, lib/leads-store.ts, data/coaches.json.

## Relevant Learnings

- Single source of truth: prices in `/data` (COMPOUND_LEARN).
- Modal focus restore and success handling (modalSuccessViewFocus, modalTimeoutCleanup).
- Book API: generic 400, storeLead with payload for both private and trial.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Coach name in payload doesn’t match AC/ops expectations | Use same display name as year2026.privateCoaching (e.g. “Andrew Mateljan”); slug only in URL. |
| parseLeagues or schedule-schemas doesn’t expose drop_in | Extend schema and parse function; keep backward compatible (drop_in optional). |
