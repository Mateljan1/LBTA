# LBTA UTR Tracker App — Implementation Plan

## Overview
Build a Supabase‑backed UTR Match Play tracker that powers a public leaderboard and Color Ball passport, with a lightweight admin surface for Andrew/Saska, and integrate it into the existing LBTA Next.js site while respecting LBTA brand, data, and accessibility standards.

## Problem Statement
Right now the UTR Match Play series has strong marketing and an in‑person experience, but no live, season‑long tracker that shows standings or Color Ball progression. Match data and juniors’ progress live in spreadsheets and coach memory, which makes it hard for players and parents to see progress, for Andrew to run the season reliably, and for the website to reflect what’s actually happening on court.

We need a single, trusted tracker that:
- Stores player, match, and Color Ball data safely in Supabase
- Calculates points, tiers, badges, and Grand Finals eligibility per the v3.1 spec
- Exposes a public, mobile‑first UI on the LBTA site
- Gives Andrew/Saska an admin mode that feels fast and safe courtside

## Proposed Solution
**Architecture**
- Implement the tracker as a **Next.js App Router sub‑app** inside this repo (re‑using the existing stack: Next.js + Tailwind + TypeScript) with Supabase as the backing store.
- Add **Supabase tables and RLS policies** exactly as defined in the spec (`players`, `matches`, `color_ball_attendance`, `color_ball_badges`, `season_config`), created via Supabase CLI migrations (`supabase/migrations/*.sql`), not manual dashboard edits.
- Create a dedicated **UTR Tracker module** in `lib/` for:
  - Typed Supabase client helpers (read‑optimized queries, minimal writes)
  - Points engine (`calculateMatchPoints`, `calculateWeeklyPoints`, `calculateStandings`, `getUpsetOfWeek`) and Color Ball badge logic (`calculateAutoBadges`) implemented in TypeScript, mirroring the spec’s JavaScript reference.
  - A thin domain model layer so UI components never talk to raw Supabase rows.

**Routing & UI integration**
- Add a new **public page** (proposed: `app/utr-tracker/page.tsx`) that:
  - Renders the PUBLIC mode UI: top tabs for “Leaderboard” and “Color Ball Passport”, division tabs for UTR standings, standings table with expandable player rows, Upset of the Week callout, and Color Ball passport grid.
  - Reads from Supabase via server‑side data loaders (Server Components) and hydrates small client islands for tab switching and expansions.
  - Uses LBTA’s brand tokens and typography (Cormorant + DM Sans) while **mapping the spec’s design tokens** (navy/amber/teal) to closest `brand-*` colors; avoid Space Grotesk per `.cursorrules`.
- Add a **password‑protected admin surface** under `app/utr-tracker/admin/page.tsx`:
  - UTR match bulk paste UI (division + week selectors, paste field, preview table, “Save All”).
  - Color Ball attendance checklist UI and badge assignment.
  - Lightweight player roster editor (add/edit name, UTR, divisions, flags).
  - For first version, protect via a simple environment‑backed shared secret (e.g. `UTR_TRACKER_ADMIN_PASSWORD`) checked in a small API route + cookie, following the existing Coach Hub auth patterns (timing‑safe compare, rate limiting, no PII logging); future iterations can upgrade to full Supabase auth.

**Data & calculations**
- Treat the **Supabase schema as source of truth** for all UTR tracker data:
  - Seed `season_config` with `multipliers`, `tiers`, `current_week`, `total_weeks`, `grand_finals_min_weeks` via SQL migration.
  - Always compute standings, tiers, upset bonuses, and Grand Finals eligibility on the fly from `matches` + `season_config`; avoid denormalized “total_points” columns.
  - Store per‑match snapshot fields (`*_utr`, `player*_name`, provisional flags) so standings are resilient to later UTR changes (per spec).
  - For Color Ball, store weekly attendance + matches in `color_ball_attendance` and persisted coach badges in `color_ball_badges`, with auto badges derived on read.

**Brand, UX, and accessibility**
- Follow the LBTA **Brand Kit and `.cursorrules`**:
  - Use `brand-morning-light`, `brand-sandstone`, `brand-pacific-dusk`, `brand-victoria-cove`, `brand-thousand-steps` etc. instead of the spec’s raw hex values.
  - Typography: `font-headline` (Cormorant) for headings; `font-sans` (DM Sans) for body.
  - No generic emojis in core UI (use icons sparingly; for Color Ball badges we can keep emojis but ensure they fit the “no generic emoji in core chrome” rule).
- Ensure **mobile‑first design** (320px+), 48px touch targets for interactive elements, and WCAG 2.1 AAA for contrast, using existing patterns from `app/programs/utr-match-play/page.tsx`.

**Ops & integration**
- Use **Supabase CLI** to manage schema:
  - Add a migration for the new tables and seed rows for `season_config`.
  - Document local setup in a short `README` section (linking to the existing Supabase instructions in `.cursorrules`).
- Do not surface prices or schedules in this tracker; link back to `/schedules` and `/programs/utr-match-play` for registration and calendar (to respect “/schedules is the single source of truth”).

## Implementation Steps

### Phase 1: Foundation — Data & Domain (Spec Phase 1, backend focus)
- [x] Step 1.1: **Supabase schema migration**
  - Create a Supabase migration that defines `players`, `matches`, `color_ball_attendance`, `color_ball_badges`, and `season_config` tables exactly as in the v3.1 spec, including indexes and RLS policies (`Public read`, `Admin write`).
  - Seed initial `season_config` rows for `multipliers`, `tiers`, `current_week`, `total_weeks`, `grand_finals_min_weeks`.
- [x] Step 1.2: **Supabase client + env wiring**
  - Add or extend a `lib/supabase-client` helper that can be safely used from Next.js server components and API routes (respecting existing `lib/leads-store.ts` patterns).
  - Document required env vars (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and, if needed, anonymous key) in `.env.example` and a short README section.
- [x] Step 1.3: **UTR domain models and types**
  - Define TypeScript types/interfaces for `Player`, `Match`, `ColorBallAttendance`, `ColorBallBadge`, and `SeasonConfig` in `lib/utr-tracker-types.ts`.
  - Add typed query helpers in `lib/utr-tracker-supabase.ts` (e.g. `getDivisionMatches`, `getDivisionPlayers`, `getColorBallAttendanceForWeek`), used by both public and admin UIs.
- [x] Step 1.4: **Points engine implementation**
  - Implement `calculateMatchPoints`, `isCloseLoss`, `calculateWeeklyPoints`, `getUpsetOfWeek`, and `calculateStandings` in `lib/utr-tracker-points.ts`, matching the spec’s JavaScript reference and points tables, including provisional‑UTR and doubles handling.
  - Add fast unit tests for the core edge cases (upset, close loss parsing, multipliers, Grand Finals eligibility).
- [ ] Step 1.5: **Color Ball passport engine**
  - Implement `calculateAutoBadges` and a helper that merges auto badges with coach‑awarded badges into a single “earned badges” list per player.
  - Add tests for streak detection, total matches, and week count thresholds (3, 5, 8).

### Phase 2: Public UI — Leaderboard & Color Ball (Spec Phase 1 MUST‑HAVE UI)
- [x] Step 2.1: **Public page shell and routing**
  - Create `app/utr-tracker/page.tsx` as a Server Component that:
    - Fetches current `season_config`, players, matches, attendance, and badges via `lib/utr-tracker-supabase`.
    - Passes data into client “islands” for tabbed navigation and interactive details.
  - Add basic meta (title/description) consistent with `/programs/utr-match-play`.
- [x] Step 2.2: **Leaderboard client island**
  - Build a `UtrLeaderboard` component (likely in `components/utr-tracker/UtrLeaderboard.tsx`) that:
    - Renders top‑level tabs for divisions (e.g. “UTR 2.0–5.0”, “Singles”, “Doubles”).
    - Shows a standings table with the specified columns (Rank, Player, Tier, Total Points, W‑L, Streak, Weeks, GF).
    - Supports row expansion to show week‑by‑week breakdown (using the weekly calculator) and match history (opponent, score, points).
    - Includes “Upset of the Week” callout per division using `getUpsetOfWeek`.
  - Ensure table is mobile‑friendly (stacked layout or horizontal scroll with clear affordances).
- [x] Step 2.3: **Color Ball Passport client island**
  - Build a `ColorBallPassportGrid` component that:
    - Shows cards for each Color Ball junior (color stage, badge count, badges grid, “next badge” hint).
    - Sorts cards either alphabetically or by badge count (configurable) without implying a ranking.
    - Handles card tap/click to open a detail view of all badges earned and conditions.
- [ ] Step 2.4: **Shared layout and content blocks**
  - Add shared components for season schedule summary, “How points work”, registration links, and Grand Finals date, using existing copy patterns from `app/programs/utr-match-play/page.tsx` to keep voice and brand consistent.
  - Ensure all sections meet contrast and touch‑target standards (per `COMPOUND_LEARN` docs).

### Phase 3: Admin Mode — Data Entry & Roster (Spec Phase 1 admin)
- [x] Step 3.1: **Admin auth and layout**
  - Implement a simple admin login route (e.g. `app/utr-tracker/admin/login/page.tsx` + API route) using an env‑backed shared secret.
  - On successful login, set an HTTP‑only cookie; protect admin routes with middleware/proxy that validates the cookie (following Coach Hub “proxy.ts” pattern and security standards from `COMPOUND_LEARN`).
- [x] Step 3.2: **UTR match bulk‑paste UI**
  - Build a `UtrAdminMatches` component that:
    - Lets admin choose division and week, paste lines in the specified CSV‑like format (singles and doubles), preview parsed matches with calculated points, then “Save All” to insert rows into `matches`.
    - Validates inputs and surfaces parsing errors inline; logs only non‑PII status server‑side.
- [x] Step 3.3: **Color Ball attendance & badges UI**
  - Build a `ColorBallAdmin` component that:
    - Lists Color Ball players for a selected week with checkboxes for attended/completed, and numeric input for matches played.
    - Shows suggested auto badges (read‑only) alongside checkboxes for coach‑awarded badges, and persists selections to `color_ball_attendance` and `color_ball_badges`.
- [x] Step 3.4: **Player roster management**
  - Build a simple `PlayerRoster` admin view for:
    - Adding/editing players (name, UTR, divisions, color_ball_stage, drop‑in, provisional flag, joined_week).
    - Optional CSV import for initial season setup (Phase 1 can support manual entry; CSV import can be a sub‑task if time permits).
- [x] Step 3.5: **Admin UX polish and guardrails**
  - Add basic validation, error boundaries, and confirmations (e.g. “Save Week”, “Save All”) so courtside use feels safe and fast.
  - Ensure rate limiting and CSRF protections are in place for any mutating API routes, borrowing from existing `lib/rate-limit.ts` and `lib/validations.ts` patterns.

### Phase 4: Integration, Testing, and Launch
- [ ] Step 4.1: **Unit and integration tests**
  - Add tests for the points engine, score parser, upset detection, Color Ball badge logic, and Supabase query helpers (where feasible with mock data).
  - Optionally add a basic Playwright or browser MCP script to smoke‑test the public page (tabs, a few sample standings rows, and card expansions).
- [ ] Step 4.2: **Accessibility & performance pass**
  - Verify keyboard navigation, focus rings, reduced‑motion behavior (no scroll/animation violations), and Lighthouse scores (Performance/Accessibility/Best Practices/SEO all ≥ 90) for the new pages.
- [x] Step 4.3: **Docs, ops, and rollout**
  - Add a short `docs/utr-tracker-ops.md` describing:
    - How to run migrations and seed data.
    - How Andrew/Saska log into admin.
    - How/where the tracker is linked from the marketing page (`/programs/utr-match-play`) and `/schedules`.
  - Coordinate initial seed data and go‑live timing with Season 1 schedule; link from the marketing page once at least sample data is present.

## Current Implementation Status (April 2, 2026)

### Completed or Mostly Completed
- **Phase 1 foundations are largely in place**
  - `supabase/migrations/20260401_utr_tracker_schema.sql` exists and defines the five core tables plus indexes, seed config rows, and RLS policies.
  - `lib/utr-tracker-types.ts`, `lib/utr-tracker-supabase.ts`, `lib/utr-tracker-points.ts`, and `lib/utr-tracker-color-ball.ts` exist and are wired into the public page.
  - `lib/utr-tracker-points.test.ts` exists with core points-engine coverage.
- **Public tracker shell exists**
  - `app/utr-tracker/page.tsx` is live in-code and computes standings from Supabase + points engine.
  - `components/utr-tracker/UtrLeaderboard.tsx` and `components/utr-tracker/ColorBallPassportGrid.tsx` exist and render tabs/table/cards.

### Gaps to Finish
- **Admin mode is not implemented yet**
  - Missing `app/utr-tracker/admin/*` routes/pages.
  - Missing mutating API routes under `app/api/utr-tracker/*`.
  - Missing auth/session guard for admin access.
- **Public UI needs final data polish**
  - Leaderboard currently shows placeholder player label (`Player {id.slice(...)}`) rather than canonical names from player records.
  - No row-expansion details yet for week-by-week breakdown and match history.
  - Upset of the Week callout is not surfaced in the current leaderboard UI.
- **Operational and verification items are still open**
  - Missing `docs/utr-tracker-ops.md`.
  - No final accessibility/performance validation evidence captured.
  - No explicit link into tracker from `app/programs/utr-match-play/page.tsx` yet.

## Continue Here — /compound:work Execution Slice

Run the next execution pass in this order:

1. **Admin foundation first (unblocks all writes)**
   - Implement `app/utr-tracker/admin/login/page.tsx`.
   - Implement `app/api/utr-tracker/admin/login/route.ts`.
   - Implement admin session cookie validation and route protection for `app/utr-tracker/admin/page.tsx`.
2. **Mutating API routes second**
   - Build `app/api/utr-tracker/matches/route.ts`.
   - Build `app/api/utr-tracker/color-ball/route.ts`.
   - Apply request validation + rate limiting + timing-safe secret compare patterns.
3. **Admin UI third**
   - Build `components/utr-tracker/AdminMatches.tsx`.
   - Build `components/utr-tracker/ColorBallAdmin.tsx`.
   - Build `components/utr-tracker/PlayerRoster.tsx`.
   - Compose in `app/utr-tracker/admin/page.tsx`.
4. **Public UI completion fourth**
   - Replace placeholder player labels with actual names.
   - Add expandable rows (weekly breakdown + match history).
   - Add Upset of the Week block per active division.
5. **Integration + docs + launch checks last**
   - Create `docs/utr-tracker-ops.md`.
   - Add tracker link/CTA from `app/programs/utr-match-play/page.tsx`.
   - Run lint/typecheck/tests, then run a mobile-first browser validation pass.

## Step Dependencies
- Step `3.2` and `3.3` depend on `3.1` (admin auth/session).
- Step `3.2`, `3.3`, and `3.4` depend on API routes in `app/api/utr-tracker/*`.
- Step `2.2` public UI polish can run in parallel with admin UI after API contracts stabilize.
- Step `4.3` rollout updates should happen after public/admin verification is green.

## /compound:work Checkpoint (April 2, 2026)
- Completed in this work cycle:
  - Admin auth flow, signed-cookie route protection, and admin write APIs.
  - Public leaderboard/player-name/expanded-details polish and Upset of the Week callout.
  - Color Ball admin workflow and roster editor.
  - Ops runbook and marketing-page tracker link.
- Remaining open steps for next cycle:
  - `1.5` Color Ball badge-engine test coverage expansion.
  - `2.4` Shared layout/content blocks final polish against full spec.
  - `4.1` Add route/component integration tests for new admin APIs and forms.
  - `4.2` Capture accessibility/performance evidence with browser + Lighthouse passes.
- Blockers:
  - No hard code blockers. Remaining items are verification/polish depth.

## /compound:validate Checkpoint (April 2, 2026)
- Validation tracks run:
  - Functional behavior (code + runtime smoke checks)
  - API contract and auth behavior
  - Data integrity / calculations
  - UI/visual browser checks
- Fixes applied during validate:
  - Corrected admin cookie scope to `Path=/` so authenticated admin sessions can reach `/api/utr-tracker/*`.
  - Corrected doubles W/L logic in standings to use `winning_team` for partner records.
  - Added doubles regression test in `lib/utr-tracker-points.test.ts`.
- Current blockers (environment/runtime):
  - No hard blockers after env pull + `supabase db push`.
  - Runtime still has empty-state data for standings/passports (expected until real entries are created in admin).
- Validate decision:
  - Code quality gate: pass (`lint`, `test`, `build` all green).
  - Runtime gate: pass for route/auth/UI behavior; full data-rich validation pending seeded/admin-entered records.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `supabase/migrations/20260401_utr_tracker_schema.sql` | Create | Define UTR tracker tables, indexes, seed `season_config`, and RLS policies |
| `lib/utr-tracker-types.ts` | Create | Shared TypeScript types for tracker entities |
| `lib/utr-tracker-supabase.ts` | Create | Typed Supabase query helpers for tracker data |
| `lib/utr-tracker-points.ts` | Create | Points engine and standings calculations |
| `lib/utr-tracker-color-ball.ts` | Create | Color Ball auto‑badge logic and helpers |
| `app/utr-tracker/page.tsx` | Create | Public tracker page shell and data wiring |
| `app/utr-tracker/admin/page.tsx` | Create | Admin dashboard (match entry, Color Ball, roster) |
| `app/utr-tracker/admin/login/page.tsx` | Create | Admin login UI |
| `app/api/utr-tracker/admin/login/route.ts` | Create | Admin login handler (shared‑secret auth) |
| `app/api/utr-tracker/matches/route.ts` | Create | Mutating API route for bulk inserting matches |
| `app/api/utr-tracker/color-ball/route.ts` | Create | API route for attendance + badges writes |
| `app/api/utr-tracker/players/route.ts` | Create | API route for roster writes/upserts |
| `components/utr-tracker/UtrLeaderboard.tsx` | Create | Leaderboard tabbed UI component |
| `components/utr-tracker/ColorBallPassportGrid.tsx` | Create | Color Ball passport cards UI |
| `components/utr-tracker/AdminMatches.tsx` | Create | Admin match bulk‑paste UI |
| `components/utr-tracker/ColorBallAdmin.tsx` | Create | Admin Color Ball checklist and badges UI |
| `components/utr-tracker/PlayerRoster.tsx` | Create | Admin player roster management UI |
| `lib/utr-tracker-auth.ts` | Create | Edge-safe UTR admin cookie verification helpers |
| `lib/utr-tracker-auth-server.ts` | Create | Server-only cookie signing and Set-Cookie builders |
| `lib/utr-tracker-api-auth.ts` | Create | Shared API auth guard for UTR admin routes |
| `docs/utr-tracker-ops.md` | Create | Operational runbook for tracker and admin |
| `app/programs/utr-match-play/page.tsx` | Modify | Add contextual link/CTA into the new tracker page (once live) |
| `proxy.ts` | Modify | Protect `/utr-tracker/admin` routes using signed admin cookie |

```yaml
# files (for tooling; do not edit by hand)
create:
  - supabase/migrations/20260401_utr_tracker_schema.sql
  - lib/utr-tracker-types.ts
  - lib/utr-tracker-supabase.ts
  - lib/utr-tracker-points.ts
  - lib/utr-tracker-color-ball.ts
  - app/utr-tracker/page.tsx
  - app/utr-tracker/admin/page.tsx
  - app/utr-tracker/admin/login/page.tsx
  - app/api/utr-tracker/admin/login/route.ts
  - app/api/utr-tracker/matches/route.ts
  - app/api/utr-tracker/color-ball/route.ts
  - app/api/utr-tracker/players/route.ts
  - components/utr-tracker/UtrLeaderboard.tsx
  - components/utr-tracker/ColorBallPassportGrid.tsx
  - components/utr-tracker/AdminMatches.tsx
  - components/utr-tracker/ColorBallAdmin.tsx
  - components/utr-tracker/PlayerRoster.tsx
  - lib/utr-tracker-auth.ts
  - lib/utr-tracker-auth-server.ts
  - lib/utr-tracker-api-auth.ts
  - docs/utr-tracker-ops.md
modify:
  - app/programs/utr-match-play/page.tsx
  - proxy.ts
```

## Out of scope (this plan)
- Full Supabase auth integration (email login, per‑user accounts) for players/parents.
- Phase 2 and Phase 3 items from the spec (Tier progress bar visuals, social media match card export, full season health dashboard), beyond the pieces explicitly called out above.
- Complex CSV import tooling for historical seasons beyond a minimal one‑time bootstrap (if needed).
- Automated integration with external UTR Sports APIs (all data entry is via the admin UI for now).
- Any pricing or schedule changes — these remain owned by `/schedules` and `/data/*.json`.

## Success Criteria
- [ ] Supabase schema and RLS match the spec, and migrations apply cleanly with Supabase CLI in this repo.
- [ ] Public `/utr-tracker` page loads successfully in production, on mobile and desktop, with leaderboard and Color Ball tabs working and rendering real data from Supabase.
- [ ] Points, tiers, and Grand Finals eligibility calculations match the spec’s examples and edge cases (provisional UTR, doubles, multipliers, upsets).
- [ ] Admins can log in, paste match data, mark Color Ball attendance, award badges, and edit player roster, with changes appearing on the public view within one reload.
- [ ] Lighthouse for `/utr-tracker` on mobile shows ≥ 90 in all categories, with no accessibility violations related to the new UI.

## Acceptance checklist
- [ ] Run Supabase migration for the tracker schema on a fresh database; verify all five tables, indexes, and RLS policies exist as defined.
- [ ] Seed `season_config` and verify a dev instance of the public page shows standings using seeded or test data.
- [ ] Confirm `calculateMatchPoints`, `isCloseLoss`, `calculateWeeklyPoints`, `getUpsetOfWeek`, and `calculateStandings` pass unit tests for singles, doubles, provisional, and upset scenarios.
- [ ] Confirm `calculateAutoBadges` awards exactly the badges described in the spec for a curated set of attendance scenarios.
- [ ] From a mobile device, load `/utr-tracker`: switch between divisions, expand at least one player row, and view Color Ball cards without horizontal scroll or clipping.
- [ ] Log into admin, create a new test player + at least one test match and Color Ball attendance record; verify they appear correctly in the public UI.
- [ ] Run lint, typecheck, and relevant tests; ensure no new lints or type errors are introduced.
- [ ] Confirm marketing pages (`/programs/utr-match-play`, `/schedules`) still render correctly and link into the tracker where appropriate.

## Research Sources
- **Primary build spec:** `LBTA_UTR_Tracker_Cursor_Spec_v3.1` (Sections 1–12: schema, points engine, Color Ball badges, UI flows, edge cases).
- **Existing LBTA UTR marketing page:** `app/programs/utr-match-play/page.tsx` (season copy, brand tone, Color Ball context).
- **Compound learnings & standards:** `plans/COMPOUND_LEARN.md` (LBTA‑wide patterns around Supabase, API design, brand tokens, accessibility, deploy conventions).
- **LBTA project rules:** `.cursorrules` (brand colors, typography, Supabase CLI workflow, data single‑source‑of‑truth).

## Relevant Learnings
- **Supabase & schema discipline:** Use Supabase CLI migrations (`supabase db push`) only; avoid manual dashboard changes, and keep all SQL in `supabase/migrations/*.sql` so the tracker stays reproducible and versioned.
- **Data single source of truth:** The tracker’s season/points logic must be driven either from `season_config` in Supabase or from `/data` files, but not duplicated in components; follow the existing patterns for `/data` and `lib/*-data.ts`.
- **Security & logging:** Mutating routes must use rate limiting, Zod validation, and PII‑safe logging; do not log full match payloads or player names/emails in production.
- **Brand & UX:** Reuse patterns from the existing UTR Match Play page (section spacing, HorizonDivider, section‑quote, focus rings, mobile‑first layout) instead of inventing a new mini‑design system for the tracker.
- **Deploy definition:** When this tracker ships, “deploy” means: commit clean tree, `npm run ship:gate`, push to GitHub, and `vercel --prod` with a quick smoke test of `/utr-tracker` and the admin flows.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Supabase schema drift between environments (local vs. production) | Use Supabase CLI migrations as the only source of truth; document migration commands and run them in staging/production via the same scripts. |
| Points engine or badge logic diverges from the spec over time | Centralize all logic in `lib/utr-tracker-points.ts` and `lib/utr-tracker-color-ball.ts` with unit tests that encode the spec’s tables and examples; run tests in `npm run ship:gate`. |
| Admin UI feels heavy or confusing for courtside use | Keep admin flows minimal and linear (division + week → paste → preview → save); test on mobile; defer advanced features (dashboards, filters) to later phases. |
| Performance issues from expensive Supabase queries | Use indexed columns (`week`, `division`, `player_id`) and read‑optimized queries (e.g. fetch one season’s matches at once, compute in memory); consider simple caching if needed, but only after measurement. |
| Brand or UX inconsistency with main site | Reuse existing layout, typography, and token patterns from `app/programs/utr-match-play/page.tsx` and `components/ui`; have at least one focused review pass for brand consistency before deploy. |
| Admin auth too weak or misconfigured | Follow Coach Hub auth patterns (timing‑safe secret compare, cookie‑based session, middleware/proxy gate, rate limiting, no PII logging); add a short script or manual test checklist to verify 400/401 and access protection. |

