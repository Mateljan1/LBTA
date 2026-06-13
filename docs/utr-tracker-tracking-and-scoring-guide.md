# UTR Tracker: Tracking + Scoring Guide

This document explains exactly how LBTA's UTR tracker numbers are produced, where data is stored, what each metric means, and how weekly score entry populates the public tracker.

Use this as the team reference for Andrew/Saska operations.

## 1) Where the tracker lives

- Public page (what families/players see): `/utr-tracker`
- Admin login: `/utr-tracker/admin/login`
- Admin operations page: `/utr-tracker/admin`

Core files:

- Public page data loading: `app/utr-tracker/page.tsx`
- Admin match entry UI: `components/utr-tracker/AdminMatches.tsx`
- Match import API: `app/api/utr-tracker/matches/route.ts`
- Points engine (single source of scoring logic): `lib/utr-tracker-points.ts`
- Supabase read/write functions: `lib/utr-tracker-supabase.ts`
- Request validation schemas: `lib/validations.ts`
- DB schema and seed config: `supabase/migrations/20260401_utr_tracker_schema.sql`

## 2) What is tracked (and where)

All tracker values come from Supabase tables:

- `players`
  - Roster source of truth (name, UTR, divisions, color-ball flags, etc.)
- `matches`
  - All singles/doubles results used for standings and win/loss totals
- `color_ball_attendance`
  - Weekly attendance + match completion data for Color Ball
- `color_ball_badges`
  - Coach-awarded and auto badge display data
- `season_config`
  - Multipliers, tier ranges, current week, total weeks, GF minimum weeks

## 3) Exactly how points are calculated

Scoring logic is in `lib/utr-tracker-points.ts`.

### Match points (per player, per match)

For **singles** and **doubles** (doubles uses team UTR totals):

- Win vs stronger opponent/team (`utrGap >= +1.0`): **12**
- Win vs similar opponent/team (`-1.0 <= utrGap < +1.0`): **10**
- Win vs lower opponent/team (`utrGap < -1.0`): **8**
- Close loss: **5**
- Non-close loss: **3**

Close loss detection includes tight/tiebreak patterns (examples: `7-6(...)`, `7-5`, `8-6`, `10-8`).

### Provisional UTR rule

If either singles player is provisional, winner gets:

- Win: **10**
- Close loss: **5**
- Regular loss: **3**

This prevents inflated "upset bonus" effects on provisional estimates.

### Weekly points formula

For each player/week:

- `matchPoints` = sum of match points for all matches that week
- `attendance` = **3** (if player played that week)
- `streak` = **2** (if player also played previous week)
- `raw = matchPoints + attendance + streak`
- `total = ceil(raw * weekMultiplier)`

If player did not play that week, weekly total is 0.

### Upset of the week bonus

In standings, each week/division gets highest singles upset winner:

- Bonus added to that player: `ceil(5 * weekMultiplier)`

### Standings totals

Per player:

- `totalPoints` = sum of all weekly totals + upset bonuses
- `wins/losses` = derived from `matches` rows (for doubles uses `winning_team`)
- `winPct` = `round(wins / (wins + losses) * 100)`
- `tier` = mapped by `season_config.tiers` point ranges
- `gfEligible` = `weeksPlayed >= grand_finals_min_weeks`
- `rank` = sort by `totalPoints` descending

## 4) What each visible number is for

On `/utr-tracker`:

- **Total points**: season ranking metric
- **Week delta (`This Week Δ`)**: current week points minus previous week points
- **Rank movement**: current rank vs previous-week recomputed rank
- **GF chip/status**: Grand Finals qualification pace
- **Tier badge**: progression level from configured thresholds
- **Around-you gaps**: points needed to pass player above / cushion over player below
- **Momentum cards**: biggest climb and biggest weekly gain
- **Color Ball passport counts/badges**: attendance and skill milestone progression

## 5) How data gets populated each week

### A) Roster first

In `/utr-tracker/admin`, update `Player Roster` first.

Why: match imports resolve names to roster rows. If name does not exist, import fails.

### B) Enter match lines

In `UTR Match Entry`:

- Choose `week`, `date`, `division`
- Default write mode should stay: `replace_week_division_date`
- Paste match lines
- Save

Accepted formats:

- Singles: `Player1, UTR, Player2, UTR, Score, WinnerSlot(1|2)`
- Doubles: `Player1, UTR, Player2, UTR, Player3, UTR, Player4, UTR, Score, WinnerSlot(1|2|3|4)`
- Provisional UTR: add `*` (example `3.5`*)

### C) API validation and write path

When saving:

1. UI parses each line (`components/utr-tracker/AdminMatches.tsx`)
2. API validates payload (`lib/validations.ts`)
3. API normalizes names and maps to roster IDs (`app/api/utr-tracker/matches/route.ts`)
4. Supabase write occurs (`lib/utr-tracker-supabase.ts`)
  - Replace mode calls `replace_utr_matches_scope` RPC when available
  - Fallback path clears selected scope then inserts rows

### D) Public tracker refresh

`/utr-tracker` reads fresh Supabase data and recalculates standings server-side on load.

## 6) Why numbers may look "off" (common causes)

- Imported with wrong `week` / `division` / `date`
- Used append mode unintentionally (duplicate-like stacking)
- Player name typo not matching roster
- Roster changed after import without reimporting affected week
- `season_config` multipliers/tiers/current week not aligned with plan
- Missing env/migrations in current deployment

## 7) Environment + migration requirements

Required for admin writes:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UTR_TRACKER_ADMIN_SECRET`

Apply schema with:

```bash
supabase db push
```

## 8) Verification checklist (weekly)

1. Login works at `/utr-tracker/admin/login`
2. Roster save works
3. Match save succeeds in replace mode
4. `/utr-tracker` updates standings as expected
5. Color Ball attendance/badges save and display correctly
6. Spot-check one player's manual point math vs tracker output

## 9) Quick score handoff template (copy/paste)

Send in this structure when handing scores for import:

- Week: `N`
- Date: `YYYY-MM-DD`
- Division: `sat_utr_singles | sun_singles | sun_doubles`
- Lines:
  - `Player A, 3.7, Player B, 4.1, 6-4 3-6 10-8, 1`
  - `Player C, 3.2*, Player D, 3.5, 7-6(5), 2`

For doubles:

- `P1, 3.9, P2, 4.0, P3, 3.8, P4, 4.1, 8-6, 3`

---

If the team wants, we can add a one-click "Scoring Explainer" accordion directly on `/utr-tracker` so parents and staff can always see the same rules used by the engine.