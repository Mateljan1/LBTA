# 2026-05-13 — Lead Pipeline Resilience (compound:learn)

**Trigger:** `/compound:full` invoked after a 13-day silent drought of website form leads (last `book`/`newsletter` row in Supabase 2026-05-01). The full Plan → Work → Review → Validate → Deploy → Compound loop was run in one session.

**Outcome:** Shipped `f011a63` (`fix(leads): suppress sticky CTA on conversion pages + add 6h pipeline canary`). Production deploy verified Ready; live canary endpoint returns HTTP 503 with detailed step output exposing the actual root cause: **POSTMARK_SERVER_TOKEN is revoked in production** (Postmark `/server` returns 401 with the same token Vercel hands `lib/email.ts` for `/email`). All notification emails to staff have been silently failing.

---

## Top corrections (most important)

### CR-1. "Healthy Vercel build" ≠ "Pipeline working" — Postmark token can rot silently

The incident: Vercel `vercel ls` showed Ready, `health:prod` showed all GET routes 200, `/api/book` returned 200, Supabase rows landed. Yet **all `notifyTrialRequest` / `notifyRegistration` / `notifyContactForm` calls in `lib/email.ts:sendEmail` returned 401 from Postmark** — silently logged to Vercel runtime logs and ignored (callers use `waitUntil(notify…)` which doesn't surface failures). Andrew received zero notification emails for an unknown duration and could not tell from the outside whether leads were arriving.

**Correction:** Any external-credentialed service (Postmark, AC, Notion, Stripe, GHL) on a critical path **must** have a synthetic canary that exercises the credential path and surfaces failures within hours, not days. `health:prod` checks GET routes; that is **necessary but not sufficient** for credential-dependent integrations.

**Implementation now in repo:** `app/api/cron/leads-canary/route.ts` runs every 6 hours via `vercel.json`, executes `lib/leads-canary.ts::runLeadCanary` (Supabase write + readback + Postmark `/server` ping + 7-day prune), returns HTTP 503 on any blocking step failure so the Vercel Crons dashboard surfaces it as a failed job. Token rotations now have a maximum-6-hour silent window instead of unbounded.

**Anti-resulting note (Duke):** The fact that we shipped many features successfully during the 13-day drought is not evidence the pipeline was healthy — Supabase + AC kept working, Postmark silently failed. Outcome ("looks deployed") was decoupled from decision quality ("we have a canary on every credentialed integration"). The canary closes that gap.

### CR-2. `storeLead` is fire-and-forget by design; canaries that wrap it cannot detect Supabase write failures

`lib/leads-store.ts::storeLead` swallows errors via `console.error` so the public `/api/book` handler never fails because of a downstream Supabase issue. Correct for the production form path (we'd rather lose a row than fail the user). **Wrong** for a canary, which exists *to* surface those failures.

**Correction:** Canaries write to Supabase **directly** with the supabase-js client (see `lib/leads-canary.ts::runLeadCanary` after review-r1), not through `storeLead`. Insert errors propagate as a failed step. The readback step is then a redundant cross-check, not the only real signal.

**Pattern:** Public form handlers fail-open (don't break user flow). Synthetic probes fail-loud (surface every error). Don't share fire-and-forget code paths between them.

### CR-3. Floating CTAs on conversion-form pages are an active anti-pattern

`<StickyCTA text="Book a Trial" href="/book" />` rendered on `/contact` was found by browser smoke test to be overlaying the page's own "Send Message" submit button on at least one viewport (desktop, possibly mobile). Beyond the z-index trap, it's a **conversion-architecture mistake**: pushing users from a contact-form page to a different conversion page mid-form distracts them from completing the form they were already filling.

**Correction:** Single source of truth registry — `lib/conversion-pages.ts` exports `CONVERSION_PAGE_PREFIXES` and `isConversionPage(pathname)`. `StickyCTA` (and any future floating CTA) reads the registry and self-suppresses. Pages currently in the registry: `/contact`, `/book`, `/junior-trial`, `/adult-trial`, `/apply-scholarship`, `/beginner-program`. Backed by `lib/conversion-pages.test.ts` (5/5 pass).

### CR-4. `--full` smoke modes that POST to production must require an explicit guard

`scripts/smoke-lead-canary.ts --full` would have created a real ActiveCampaign contact + Postmark email + Notion page on every invocation by default (because `SMOKE_BASE_URL` defaults to production). Surfaced by the security reviewer (W2). Footgun.

**Correction:** When mode mutates external systems AND target host matches `lagunabeachtennisacademy.com`, require `SMOKE_CONFIRM_PROD=yes`. Returns exit code 3 if missing, with a clear "what would happen if I let you" explanation. Pattern applies to any future "full smoke" / "warm cache" / "load test" script that hits prod.

### CR-5. WIP that breaks `npm run build` locally but isn't tracked is a real ship-gate footgun

The repo had multiple untracked WIP directories (`app/api/coach-hub/[coach]/`, `app/coach-hub/[coach]/`, `lib/coach-passwords.ts`) referencing schemas that don't exist in tracked `lib/validations.ts`. Locally, `npm run build` failed. Production build was fine because Vercel deploys from git and untracked files are not in the deploy artifact. Cost ~10 minutes of confusion mid-ship.

**Correction:** When `ship:gate` fails on a build error in untracked-only files, that's a known false-positive pattern — temporarily move the offending dirs to `/tmp` (`mv app/...[coach]/ /tmp/lbta-stash-...`), build, restore. This is the "untracked-orphan-deps-stash-restore-pattern" already in `patterns.json` from the prior `mobile-ux-remediation`; reuse it. Long-term: either commit the WIP behind a feature flag, or stop running WIP through the same compile path.

---

## Patterns to add to `patterns.json`

### `lead-pipeline-canary-cron`
**When:** Any business-critical workflow that depends on multiple external integrations (Supabase, transactional email, CRM, etc.) where silent failure of any one is invisible to the user.
**Pattern:**
1. Shared `lib/<x>-canary.ts` exposing `run<X>Canary(): Promise<CanaryResult>` with named `steps[]`.
2. Cron route `app/api/cron/<x>-canary/route.ts` — auth-gated by `Authorization: Bearer ${CRON_SECRET}`, returns 503 on any blocking-step failure (Vercel Crons dashboard surfaces as failed run).
3. Manual CLI `scripts/smoke-<x>-canary.ts` — same logic + optional `--full` mode that hits the public API; production guard via `SMOKE_CONFIRM_PROD=yes`.
4. Synthetic rows tagged with a sentinel `source` value (`health-canary`); `lib/<x>-query.ts::getAll` filters them out so they never pollute the team-facing UI.
5. Self-prune step (`delete where source = 'health-canary' and created_at < now() - interval 'N days'`) keeps the table flat. Treat prune as non-blocking for the canary's overall ok/fail (it's hygiene, not a health signal).
6. Schedule cadence: aim for **detection latency < daily Vercel cron at 6h**. Rationale: any silent break should be caught in <1 work shift.
**Reference:** `lib/leads-canary.ts`, `app/api/cron/leads-canary/route.ts`, `scripts/smoke-lead-canary.ts`, `vercel.json` cron entry `0 */6 * * *`.

### `conversion-page-registry-suppresses-competing-ctas`
**When:** App has dedicated conversion-form pages (contact, trial booking, scholarship, etc.) AND has site-wide floating/sticky CTAs that would compete with the page's own submit button.
**Pattern:**
- `lib/conversion-pages.ts`: `CONVERSION_PAGE_PREFIXES: readonly string[]` + `isConversionPage(pathname): boolean`. Match on prefix so nested routes (`/contact/thank-you`) inherit the suppression.
- Floating CTA components (`StickyCTA`, future bottom bars, future overlays) call `isConversionPage(usePathname())` and early-return null **before** any state hooks that affect layout (so CSS vars like `--lbta-sticky-cta-h` stay 0px on suppressed pages — no orphan padding).
- Unit tests pin the registry to known prefixes including non-matching false-positive guards (`/contacts` ≠ `/contact`).
**Reference:** `lib/conversion-pages.ts`, `components/StickyCTA.tsx`.

### `synthetic-probe-source-sentinel-filter`
**When:** A canary writes to a shared data store that is also read by a team-facing UI.
**Pattern:** Tag synthetic rows with a fixed sentinel value (`source: 'health-canary'` for Supabase leads). Filter at the query layer (`getAllLeads` adds `.neq('source', HEALTH_CANARY_SOURCE)`) so the UI can never show probe rows even if a future caller forgets to filter. Constant lives next to the canary code (`lib/leads-canary.ts::HEALTH_CANARY_SOURCE`) and is imported by both writer and reader — single source of truth.
**Reference:** `lib/leads-canary.ts`, `lib/leads-query.ts::getAllLeads`.

### `prod-write-script-confirmation-gate`
**When:** A CLI script can mutate production state (email send, real contact create, payment) but is convenient to invoke locally.
**Pattern:** Detect the production target (URL host match in our case) AND require an explicit env var (`SMOKE_CONFIRM_PROD=yes`) when the mutating mode is selected. Refuse with a non-zero exit code (we use 3 to distinguish from `1` failure / `2` env-missing) and a clear "what would happen if I ran" message. Default behavior stays safe.
**Reference:** `scripts/smoke-lead-canary.ts::looksLikeProduction` + the `SMOKE_CONFIRM_PROD` check.

---

## Anti-patterns to add to `anti-patterns.json`

### `silent-failure-on-credentialed-integration`
**Description:** Critical integration (Postmark, AC, Stripe webhook) authenticated via env-var token, with no synthetic canary exercising the credential path.
**Avoid:** Relying on user reports / gut feeling / outbound metric comparisons to detect credential expiry or rotation. We waited 13 days because Andrew "noticed it had been a while since a lead came in" — that's not a system.
**Instead:** Add a 6-hourly canary (or whatever cadence beats your business tolerance) that exercises the credential path and surfaces failures via the platform's own health-check UI (Vercel Crons dashboard, Datadog, etc.).
**Tags:** [observability, leads, credentials, vercel-cron]

### `canary-using-fire-and-forget-writer`
**Description:** Canary calls a "fire-and-forget" library function (`storeLead`, `notify…`) that intentionally swallows errors, then reports green based on the function not throwing.
**Avoid:** A canary that uses the same code path as the public form handler. If the writer is fire-and-forget for the form (correct design), the canary will report green when the underlying credential / RLS / network path is broken.
**Instead:** Canary writes to the data store directly with surfaced errors. Treat the canary as a different consumer with different failure semantics from the production form path.
**Tags:** [observability, canary, error-handling]

### `floating-cta-on-conversion-page`
**Description:** Site-wide sticky / floating "Book a Trial" CTA renders on a page whose primary purpose is itself a different conversion form (contact, scholarship, registration).
**Avoid:** `<StickyCTA>` (or future sticky overlays) rendered unconditionally across every page — leads to (a) z-index/overlap regressions on the page's own submit button, and (b) self-cannibalizing conversion architecture (the user is already converting; pushing them elsewhere distracts).
**Instead:** Central `lib/conversion-pages.ts` registry; floating components self-suppress on registered prefixes via `isConversionPage(pathname)`.
**Tags:** [ux, sticky-cta, conversion]

### `prod-write-script-default-target-prod`
**Description:** A CLI like `npm run smoke:foo -- --full` that POSTs to production by default with no confirmation gate.
**Avoid:** Running the script during normal dev work and creating real ActiveCampaign contacts, real transactional emails, real payments. Easy to forget which target your script is hitting.
**Instead:** When mutating mode + production target → require `SMOKE_CONFIRM_PROD=yes`. Exit 3 with a clear message otherwise. Default `SMOKE_BASE_URL` can still be prod for read-only canary mode (no mutation).
**Tags:** [scripts, production-safety, footgun]

---

## Quality bars to enforce

### `external-integration-must-have-canary`
**Rule:** Any production-critical external integration (transactional email, CRM contact write, payment confirmation, webhook receiver) must ship with a scheduled canary that exercises its credential + happy-path within 24 hours of deploy.
**Enforcement:** Code review checklist + plan-time gate ("Risks: how do we detect silent failure of <integration>?").

### `silent-error-handling-must-be-paired-with-observability`
**Rule:** When `console.error` / `waitUntil` / `try-catch (err) { /* swallow */ }` is the correct production behavior (don't break user flow), the same code path must have at least one alternate consumer (canary or test) that surfaces the swallowed error.
**Enforcement:** Project review checklist; flag during `/compound:review` as a Reliability finding.

### `--full smoke must require prod-confirm`
**Rule:** Any CLI that hits production with mutating side effects must require an explicit `SMOKE_CONFIRM_PROD=yes` (or equivalent) env var.
**Enforcement:** `/compound:review` — security agent flags any new `scripts/smoke-*.ts --full` mode that doesn't gate.

---

## Process learnings (about the compound:full loop itself)

### `parallel-review-agents-with-plan-summary`
The review phase ran 3 parallel reviewer subagents (`ce-correctness-reviewer`, `ce-security-reviewer`, `ce-maintainability-reviewer`) each given a plan-summary and a list of files. Wall clock: ~10 min for all three to return. Findings were dedup-friendly because each agent had a distinct lens — no overlap noise. **Pattern confirmed:** plan-aware review with explicit acceptance checklist + scoped file list yields actionable results in one shot.

### `live-canary-as-deploy-validation`
After push + Vercel auto-deploy, the deploy-proof step was: hit `https://prod/api/cron/leads-canary` with the production CRON_SECRET (pulled via `vercel env pull --environment production`) and inspect the JSON. This is **stronger** than `health:prod` (which only checks GET 200s) — the canary response is the literal output of the new cron logic running in the new deploy. Recommend adding this pattern to the `compound:deploy` agent prompts: when a deploy ships a new endpoint, the deploy-validation step should be "hit the new endpoint, not just GET /".

### `untracked-wip-stash-restore-during-build`
Repeated the pattern from prior compound runs (May 11 mobile UX): when `npm run build` fails on imports from untracked WIP files, stash to `/tmp`, build, restore. **No new learning** but worth re-emphasizing — this happens every multi-stream session in this repo and we should consider a `.next` ignore or a "wip" build profile that excludes the per-coach hub directory.

---

## Action items (for Andrew, outside this commit)

1. **Rotate `POSTMARK_SERVER_TOKEN`.** The token in production AND preview is invalid (401 from `/server`). Log into Postmark → server → API tokens → generate new server token → update Vercel env vars (Production + Preview) → redeploy. Canary will go green within 6 hours.
2. **Investigate notification gap window.** Optional: ask Postmark support for the date the current token was revoked. That tells us how many leads we received but didn't notify on. May be worth scanning Supabase `book`/`register`/`scholarship` rows from before May 1 for any we never followed up on.
3. **Confirm contact-page bug fully resolved.** Once Postmark is working, do one more 375px browser smoke pass on `/contact` to confirm the suppression fix landed and submit is reachable.
4. **Consider extending the canary** to also probe ActiveCampaign (a `GET /api/3/lists` with the API key would suffice) and Notion (`GET /v1/users/me`). Same pattern; ~1 hour of additional work; closes the same silent-failure gap for the other two integrations.

---

## Files touched

- `lib/conversion-pages.ts` (NEW)
- `lib/conversion-pages.test.ts` (NEW)
- `lib/leads-canary.ts` (NEW)
- `app/api/cron/leads-canary/route.ts` (NEW)
- `scripts/smoke-lead-canary.ts` (NEW)
- `scripts/cleanup-diagnostic-rows.ts` (NEW; one-shot, may be removed in a future commit)
- `components/StickyCTA.tsx` (modified)
- `lib/leads-query.ts` (modified — added health-canary filter)
- `vercel.json` (modified — added cron entry)
- `package.json` (modified — added `smoke:lead-canary` script)
- `plans/2026-05-13-lead-pipeline-resilience-plan.md` (NEW)
- `.cursor/compound/learnings/2026-05-13-lead-pipeline-resilience-compound-learn.md` (this file)

**Commit:** `f011a63 fix(leads): suppress sticky CTA on conversion pages + add 6h pipeline canary`
**Tests:** 226/226 vitest pass.
**Quality gate:** clean.
**Production:** deployed Ready; canary endpoint live; Postmark step exposes the prod token revocation.
