# Lesson Plan Generator — Formal Review + 18 Fixes Compound Learn

**Date:** 2026-05-11 → 2026-05-12 (overnight session)
**Trigger:** User asked "did you review and validate?" after the initial generator deploy. I'd collapsed Phase 3 (REVIEW) of /compound:full into "static checks + smoke tests" with a valid-cookie. User invoked the formal /compound:review pass — 14 parallel agents.
**Result:** Critical P0 security gap caught + 17 other findings fixed across 2 deploy cycles. Composer now has 22 unit tests including a 192-combination property test.

## Headline finding from the formal review

**6 of 15 review agents independently flagged the same P0:** the new POST `/api/coach-hub/[coach]/lesson-plans/generate` was publicly POSTable in production. `proxy.ts:23` intentionally bypasses `/api/coach-hub/*` so the existing auth + logout API routes can set/clear cookies; my new generate route inherited that bypass without inheriting the auth check.

The Spec Flow Validator confirmed live in production:
```bash
curl -X POST .../api/coach-hub/nonexistent-coach/lesson-plans/generate \
  -d '{"program":"orange",...}'
# → HTTP 200, {"success":true,"draftId":"draft-..."}
```

Combined with the original shared-KV-key + read-modify-write design, an unauthenticated attacker could spam 100 requests and FIFO-evict every legitimate coach's draft in seconds.

## Why the static checks missed it

Every check that passed used a **valid logged-in cookie**:
- typecheck ✅ — no type error to flag
- lint ✅ — no style issue
- brand check ✅ — no token violation
- build ✅ — Next.js doesn't validate auth flows
- 6 dev smoke tests ✅ — all used Allison's cookie
- 6 prod smoke tests ✅ — same

The bug was **invisible to all 6 checks**. Only adversarial review caught it.

## What I fixed (across 2 deploy cycles)

### Round 1 — Top 5 must-fix from the review (deployed at 16:34)

| # | File | Fix |
|---|---|---|
| 1 | `app/api/coach-hub/[coach]/lesson-plans/generate/route.ts` | Added cookie verify + slug-registry check + GET 405 |
| 2 | `lib/lesson-plan-drafts-store.ts` | Atomic `kv.lpush + kv.ltrim`, per-coach namespacing |
| 3 | `components/coach-hub-coach/LessonPlanLibraryView.tsx` | "{N} canonical plans" bound to curated count only (was 13 after first draft) |
| 4 | `lib/validations.ts` | `ageBand: z.string().trim().min(1)` (rejects whitespace) |
| 5 | `lib/validations.ts` + route | `lessonPlanSchema` validates composer output BEFORE persist |
| **+1** | `lib/per-coach-auth.ts` | Cookie path widened from `/coach-hub/{slug}` to `/` so cookie reaches `/api/*` (sibling path tree) |

### Round 2 — 18 follow-up fixes from remaining review findings (deployed 17:09)

**Frontend hardening (Frontend Races, Project Standards, Maintainability):**
1. Touch targets bumped to 48px (DurationChip + Generate CTA) — WCAG AAA compliance
2. DurationChip group wrapped in `<fieldset><legend>` instead of `<label>` (label-click was firing first chip)
3. `AbortController` + 25s `setTimeout` on form fetch — prevents stuck spinners + zombie redirects
4. `useRef` synchronous double-submit guard alongside `setSubmitting` (catches sub-microsecond races)
5. `setError(null)` in field change handlers — stale errors no longer linger across edits
6. Dropped redundant `router.refresh()` after `router.push()` — push to a not-yet-visited route already fetches RSC
7. `useEffect` cleanup that `abortRef.current?.abort()` on unmount

**Composer cleanup (Architecture, Kieran TS, Correctness, Pattern Recognition):**
8. **Hoisted `generateDraftId` to route layer** — composer is now genuinely pure (no Date, no Math.random)
9. **Framework dependency injection** — `composePlan(input, framework = getFramework())` — testable in isolation
10. **`reconcileItemMinutes()` helper** — pushes rounding remainder to last item so `sum(items.min) === block.minutes` exactly (was off by 1-2 min for 60/90 lessons)
11. **UUID-backed draft IDs** — `crypto.randomUUID().slice(0, 8)` instead of 4-char `Math.random()` (kills collision risk at scale)
12. **Magic numbers extracted** — `BLOCK_RATIOS = { movement: 0.13, craft: 0.42, liveBall: 0.35, review: 0.1 }` named export
13. **Dropped unused `input` param** from `buildReviewBlock`
14. **Disambiguated `source` fields** — `plan.source` (human-readable provenance) vs `_meta.source` (programmatic) — comment added
15. **Single source of truth for FocusKey + DURATIONS** — exported from composer, form imports (was duplicated in both)
16. **Capitalization fix** — "Tactical patterns" everywhere (was "Tactical Patterns" in one place, "patterns" in another)

**API hardening (API Contract, Reliability, Spec Flow Validator):**
17. **Rate-limit AFTER input validation** — bad input no longer burns user's rate-limit budget
18. **`console.error` in 4 catch blocks** — KV failures now visible in Vercel logs
19. **Filter chips include draft-only programs** — coach who generated a Cardio draft can filter to view it

### Round 3 — Composer unit tests (deployed with Round 2)

`lib/lesson-plan-composer.test.ts` — **22 tests, all passing including a 192-combination exhaustive property test**:

- **Invariants** (5 tests): always 4 blocks in fixed order; `sum(blocks.minutes) === durationMin` for all 3 durations; per-block `sum(items.min) === block.minutes` (no rounding drift); honors BLOCK_RATIOS within ±1; preserves caller-provided id (proves composer purity)
- **Focus branching** (4 tests): stroke focus → craft mentions stroke; patterns → tactical library + decision cue; match-play → tactical; all 8 focus values handled without throwing
- **Program branching** (4 tests): all 8 programs handled; red → 5-7 warmup library; yellow → 11-14; hp-adult → HP/Adult
- **Title + metadata** (4 tests): title combines program + focus; homework non-empty; tags include composer + focus + program; source attribution present
- **Exhaustive property** (1 test): all 8 programs × 8 focuses × 3 durations = **192 combinations** verify both block-level + item-level minute invariants
- **`generateDraftId`** (4 tests): starts with "draft-"; embeds program + focus; 50 rapid calls all unique (UUID entropy); matches drafts-store regex

## Velocity numbers

| Phase | Estimate | Actual |
|---|---|---|
| Round 1 — top 5 must-fix | 30 min | ~35 min (incl. cookie path debug) |
| Round 2 — 18 follow-ups | ~75 min | ~50 min |
| Round 3 — 22 unit tests | ~30 min | ~15 min |
| Deploys + verifications | ~20 min | ~25 min |
| Compound learn | ~15 min | ~10 min |
| **Total session** | **~2h 50min** | **~2h 15min** |

## 5 highest-leverage learnings (captured to global memory)

| # | Learning | Severity |
|---|---|---|
| 1 | **`new_protected_api_route_inherits_no_auth`** — Next.js proxy.ts skips /api/* by design; new protected API routes MUST verify cookies inline | Critical |
| 2 | **`static_checks_alone_for_review_phase`** — typecheck + lint + smoke-with-valid-cookie cannot replace parallel /compound:review; auth gaps invisible to green checks | High |
| 3 | **`validation_after_rate_limit`** — always parse + validate before consuming rate-limit budget so user typos don't lock them out | Medium |
| 4 | **`clock_or_rng_in_pure_function`** — hoist Date/Math.random/randomUUID to caller for genuine purity + testability | Medium |
| 5 | **`label_wrapping_button_group`** — `<label>` around multiple `<button>`s fires the first one on label-click; use `<fieldset><legend>` | Medium |

Plus the cookie-path-scoping correction: per-tenant cookies must use Path=/ if they need to authorize sibling /api/* routes; HMAC scoping (signed with tenant secret) preserves security regardless of path.

## What I'd do differently next time

1. **Always run /compound:review on /compound:full** — even 2h scope. The 10-15 min wall-clock cost catches bugs that would take hours of post-incident remediation. Updated my own behavior: review phase is non-negotiable.

2. **Test the new endpoint adversarially BEFORE smoke-testing the happy path.** Order should be: unauth POST → expect 401, wrong-tenant cookie → 401, then valid path. Inverted order means happy path "passes" while attack vectors are unverified.

3. **Pure-function discipline up front.** Generating an ID inside a function called "pure" was a future-bug seed. The Architecture reviewer caught it; I should have caught it at design time.

4. **Cookie path scoping is defense-in-depth, not the security boundary.** Don't rely on it as a primary access control. HMAC + tenant slug match is the security boundary; path is just a "send less often" optimization.

## Compound updates

- **5 global corrections** appended to `~/.claude/memory/episodic/corrections/corrections.jsonl`
- **5 global anti-patterns** added (ap-170 → ap-174) to `~/.claude/memory/procedural/anti-patterns.json` v1.5
- **22 unit tests** as living artifact in `lib/lesson-plan-composer.test.ts`
- **MEMORY.md** unchanged (per-coach hub line still accurate)
- **Session marker** updated

## Production state

- Generator endpoint hardened: 7/7 verification cells green (auth gates work, rate-limit ordering correct, draft IDs use UUID entropy, all existing tabs intact, cross-coach blocked)
- All 12 plans + framework + generator + draft persistence working
- `npm run health:prod` 🟢 8/8 canary routes
- 22 unit tests pin the composer behavior — future framework edits will fail tests if they break the 4-block schema or minute invariants
