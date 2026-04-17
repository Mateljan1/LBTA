# Compound Learn — 2026-04-16 (4th run) · 3-Blocker Cleanup

**Loop:** Ship:gate unblock + ops-audit date reconciliation + Michelle pause, all in one session
**Commits:** 3 (`39e0ef8`, `7c92cf6`, `6e52dba`) → live on `lagunabeachtennisacademy.com`
**Duration:** ~45 minutes

## What this loop closed

| Blocker | Resolution |
|---|---|
| Pre-existing `lib/form-config.test.ts` swim-tennis failure blocking `ship:gate` | Removed dead FORM_CONFIGS entry; camp is `"suspended": true` in year2026.json so no code path called it |
| Operational consistency audit — camp date drift (June 15/16, Aug 19/20/28/29) | Resolved **without needing founder input** — `tokens:build` codegen had already canonicalized to "August 29"; I committed the auto-diffs + fixed 4 stale literals in app/camps/page.tsx |
| Michelle Mateljan status — active/departed/paused/leave | Founder answered "paused" via `AskQuestion` structured options; shipped reversible hidden-flag pattern with zero data loss |

## The four new patterns

### 1. `build-codegen-as-canonical-source` (the big one)

This one is **worth the entire learn pass**. When I ran `ship:gate`, three tracked files became dirty — not by me:

- `data/year2026.json`: `"August 20"` → **`"August 29"`**
- `data/spring-summer-2026.json`: `"August 28"` → **`"August 29"`**
- `components/programs/ProgramsTabView.tsx`: `"August 28"` → **`"August 29"`**

I almost reverted these. Instead I diffed them. **The codegen had already resolved the canonical answer.** That turned what I thought would need a blocking Saska question into a zero-input resolution.

**New quality bar (must):** `checkCodegenOutputBeforeReverting` — always `git diff` before reverting dirty tracked files after a ship:gate run. Codegen = canonical source.

### 2. `reversible-pause-for-hidden-entity`

The Michelle pause shape, generalized for future use:

1. Add `hidden?: boolean` + `hiddenReason?: string` to the entity type
2. `hidden: true` in the JSON data (with human-readable reason for audit trail)
3. Private `getVisibleX()` helper; all public listing/schema getters filter via it
4. Single-entity getters (`getBySlug`) stay **unfiltered** — direct links still work for reactivation testing
5. `robots: { index: false, follow: false }` + JSDoc comment describing the reactivation path on the entity's detail page
6. If the hidden entity was in a fixed-layout grid (2x2), swap to `grid-cols-N` for remaining N — note the revert path in a comment

Works for any paused entity: coach, program, location, camp week.

### 3. `ship-gate-commit-first`

Formalization of something I kept rediscovering. `ship:gate`'s clean-tree guard fires whether or not build/lint/tests pass. Commit tracked changes BEFORE running ship:gate — always.

### 4. `founder-decision-via-structured-question`

Michelle status had 4 distinct engineering paths. Asked via `AskQuestion` with labeled options describing each path's consequence. Founder responded in 30 seconds; zero clarification round-trips. This is materially better than asking "what should we do with Michelle?" and parsing a free-text reply.

## What got into memory this pass

| File | Added |
|---|---|
| `patterns.json` | `build-codegen-as-canonical-source`, `reversible-pause-for-hidden-entity`, `ship-gate-commit-first`, `founder-decision-via-structured-question` (4 new) |
| `quality-bars.json` | `checkCodegenOutputBeforeReverting` (must), `pausedEntityHiddenFlagPattern` (must) (2 new) |
| `corrections.jsonl` | 4 new corrections |
| `anti-patterns.json` | None added — this loop was all pattern positives |

## Running totals

| Memory type | Count at start of loop | End of loop |
|---|---|---|
| Anti-patterns | 91 | 91 |
| Patterns | 122 | **126** |
| Quality bars | 22 | **24** |
| Corrections | 111 | **115** |
| Session summaries | 3 (P0, P1, Aman) | **4** |

## Metrics

- Session throughput: **3 blockers closed · 1 live smoke test pass · 165/165 tests green · zero production regressions**
- Founder input required: **1 question · 30 seconds · 4 structured options**
- Build-codegen saved input: **1 blocking camp-window question avoided**
- Total loop time: ~45 min plan→ship→learn

## Compounding status

🟢 **Accelerating.** Fourth loop of the day. Memory entries from earlier loops (`deployLiveSmokeTest`, `auditClaimsVerifiedBeforeP0`, atomic commits) made this one faster and cleaner. Four new patterns banked here will make the next one faster still.

Specifically: the next time `ship:gate` reports dirty tracked files, I won't wonder — I'll `git diff` and commit. The next time a coach/program/location needs pausing, the pattern is one lookup away. The next time a blocking founder decision appears, I reach for `AskQuestion` with structured options first.

## What's queued for future compound:plan

1. **Derivative surface sweep** — Email templates under `assets/emails/` that may still say "June 16 – August 19" summer camp. One-hour audit + fix pass.
2. **Blog foundation** — `/blog` scaffold + first 5 posts (multi-week content workstream)
3. **Location pages** — `/locations/lbhs`, `/locations/moulton-meadows`, `/locations/alta-laguna`
4. **Director NAP sweep** — Google Business Profile / Yelp / Apple Maps verification (operations, not web)
5. **Toni Nadal / Alex Michelsen one-liners** — if and when founder approves specific copy

---

*Compound phase: LEARN complete. Four loops banked today. Memory system grew from 69 anti-patterns + 113 patterns + 14 quality bars + 95 corrections at session open to **91 + 126 + 24 + 115** now. The compound flywheel is visibly accelerating.*
