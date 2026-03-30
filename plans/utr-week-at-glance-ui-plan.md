# UTR Match Play — Week-at-a-glance banner (implementation plan)

## Overview

Add a **dark, poster-style “week at a glance” strip** after the series hero, matching the approved HTML reference: gradient **deep-water** canvas, **three-card** row (Color Ball · UTR divisions · Prizes), **Grand Finals** bar, **registration** row. **Data** (dates, division names, times) comes from `data/leagues-2026.json` via `lib/utr-match-play.ts`; **styling** uses existing **Tailwind brand tokens** (Cormorant headlines, DM Sans body, victoria-cove / sunset-cliff / sandstone).

## Problem statement

The hero already communicates the series headline; parents and players still benefit from a **scannable, shareable** summary that mirrors marketing collateral without duplicating hardcoded copy. The reference design used Google Fonts **Cormorant Garamond** — the site standard is **Cormorant** (headline) + **DM Sans** (body), applied here.

## Proposed solution

| Area | Approach |
|------|----------|
| Placement | Immediately after `<UtrSeriesHero />`, before light `#divisions` section |
| Week label | `getUtrSeasonWeekNumber()` + `formatUtrWeekendPairShort(week)` so the strip tracks **current week** during the season |
| Middle column | Rows from `getUtrDivisionsForPage()` indices 1–3 (Sat singles, Sun singles, Sun doubles) |
| Color Ball | Static age bands aligned with hero / JSON note (red / orange / green) |
| Copy | Registration row matches site policy: **no** “register on UTR” for drop-in; links to `#divisions` and `support@` |
| A11y | Semantic `<section>`, `aria-labelledby`, focus rings on links |

## Implementation steps (done)

- [x] Add `getUtrSeasonWeekNumber()` and `formatUtrWeekendPairShort()`; refactor `getUtrWeekBadgeLabel()` to use week number.
- [x] Create `components/programs/UtrWeekAtGlanceBanner.tsx` (Server Component).
- [x] Import banner in `app/programs/utr-match-play/page.tsx`.
- [x] Extend `lib/utr-match-play.test.ts` for weekend pair + week bounds.

## Files touched

| File | Action |
|------|--------|
| `lib/utr-match-play.ts` | Week helpers |
| `components/programs/UtrWeekAtGlanceBanner.tsx` | New UI |
| `app/programs/utr-match-play/page.tsx` | Mount banner |
| `lib/utr-match-play.test.ts` | Tests |

## Out of scope

- Replacing the hero with this layout.
- OG image / email HTML export (could reuse markup later).
- Stripe or payment CTAs (separate plan).

## Acceptance checklist

- [ ] Banner shows **correct week** and **Sat–Sun date range** for current calendar context.
- [ ] Division **names and times** match division cards below (same JSON).
- [ ] No forbidden marketing tone; drop-in copy matches **confirm-after-outreach** policy.
- [ ] `npm run ship:gate` passes.

## Risks

| Risk | Mitigation |
|------|------------|
| Week number edge cases near timezone boundaries | Uses same Sat–Fri window as `getUtrWeekBadgeLabel` logic |
| JSON division order changes | Prefer `find` by `match_day` + name in a follow-up if order is not guaranteed |
