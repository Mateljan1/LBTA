# Lead Pipeline Resilience — Implementation Plan
**Date:** 2026-05-13
**Author:** Andrew + AI agent (Opus 4.7)
**Trigger:** 13-day drought of website form leads (last book/newsletter lead 2026-05-01). Diagnostic showed backend pipeline healthy, but smoke test surfaced (1) `/contact` submit button blocked by sticky CTA on desktop, (2) mobile (375px) untested, (3) notification email path unverified.

## Overview
Close the three open holes from the lead-pipeline diagnostic and add automated regression guardrails so a silent break of this magnitude never happens again. The pipeline (Supabase + AC + Notion + Postmark + GHL) was confirmed healthy at the API layer; the failures live at the **conversion surface** (forms users actually touch) and in the **silent-failure detection** (we had no daily probe).

## Problem Statement
We had zero recorded `book` / `newsletter` / `register` leads for 13 consecutive days, against a prior 1–3/day base rate. Backend integrations all work (verified by direct curl probe → Supabase row + 200 response). Therefore the breakage either lives on the user-facing surface or is silently masked. Smoke test of the live production forms found:

1. **Contact-page submit blocked** — fixed "Book a Trial" CTA overlays the "Send Message" button on at least one viewport size, blocking real submissions. (Source: browser-use smoke test 2026-05-13.)
2. **Mobile (375px) is untested** — most LBTA traffic is mobile; this is the highest-probability hidden failure surface.
3. **Postmark notification path unverified** — Andrew may not be receiving "New Trial Request" emails, which would feel like "no leads" even if Supabase is filling. We have no automated check that the Postmark token is valid and the send path returns 200.

We also have **no daily synthetic probe** of the booking pipeline. The only reason we caught this at all is Andrew's gut feeling — that's not a system, that's luck.

## Proposed Solution
Three-part fix, in order of impact:

### Part A — Stop the bleeding (Bug #1)
Hide `StickyCTA` on conversion-form pages. The contact page IS the conversion form; pushing users to a different conversion (`/book`) **mid-form** is a UX anti-pattern AND introduces the z-index trap that's blocking submission. Same logic applies to other dedicated form pages (`/book`, `/junior-trial`, `/adult-trial`, `/apply-scholarship`, `/contact`). One central registry; route-level decision.

### Part B — Verify mobile + Postmark
Run a 375px browser smoke pass on all three forms (trial, contact, newsletter) and capture the Postmark notification arrival for the diagnostic probe I already submitted at 03:34 UTC. If Andrew confirms email arrival, Postmark is fine. If not, we add a token-validity check to the smoke test.

### Part C — Regression guardrails (the "never again" part)
Two layers:

1. **`scripts/smoke-leads.ts`** — extend the existing `health:prod` script with a real `POST /api/book` probe + Supabase verification + Postmark token ping (`GET https://api.postmarkapp.com/server` with the token; 200 = valid). Wire into `npm run health:prod` so every deploy validates the conversion path, not just GET routes.
2. **Form-page registry** — `lib/conversion-pages.ts` exports a list of pathname prefixes that are themselves conversion forms. `StickyCTA` reads it and self-suppresses. Single source of truth; new conversion pages can't accidentally regress.

(Source: Codebase Researcher — found `scripts/check-prod-health.ts`, `scripts/smoke-lead.js`, `components/StickyCTA.tsx`. Source: COMPOUND_LEARN — `2026-05-07-prod-health-check-compound-learn.md` established the "end-user-perspective verification" principle that this extends.)

## Implementation Steps

### Phase 1: Fix #1 — Stop the bleeding
- [ ] Step 1.1: Create `lib/conversion-pages.ts` exporting `CONVERSION_PAGE_PREFIXES = ['/contact', '/book', '/junior-trial', '/adult-trial', '/apply-scholarship']` and an `isConversionPage(pathname)` helper
- [ ] Step 1.2: Modify `components/StickyCTA.tsx` to early-return `null` when `isConversionPage(pathname)` is true
- [ ] Step 1.3: Add unit test `lib/conversion-pages.test.ts` covering each known conversion path + non-conversion paths

### Phase 2: Verify mobile + Postmark
- [ ] Step 2.1: Run a 375px browser smoke pass through trial booking, contact form, newsletter signup. Capture: console errors, network failures, any UX blockers. (parallel browser subagent)
- [ ] Step 2.2: Confirm Postmark — ask Andrew if the diagnostic probe email arrived; if no, add Postmark token-ping to smoke test (Step 3.1)

### Phase 3: Regression guardrails
- [ ] Step 3.1: Create `scripts/smoke-leads.ts`:
  - GET canary routes (delegated to existing logic, or import from check-prod-health)
  - POST `/api/book` with a recognizable diagnostic payload (`firstName: 'HealthProbe'`, `email: 'health-probe+TIMESTAMP@lagunabeachtennisacademy.com'`)
  - Read SUPABASE_URL/SERVICE_ROLE_KEY (or accept skip when not provided), confirm row landed within 5s
  - Ping Postmark `/server` with `POSTMARK_SERVER_TOKEN`; 200 = valid, anything else = fail
  - Exit codes: 0 healthy / 1 form failure / 2 project-level dark / 3 Postmark token broken
- [ ] Step 3.2: Add `npm run smoke:leads` to `package.json` (separate from `health:prod` so it can run on a schedule)
- [ ] Step 3.3: Wire a Vercel cron at `app/api/cron/leads-canary/route.ts` running `0 */6 * * *` (every 6h) — submits a probe, verifies Supabase, pings Postmark; logs failures to console (Vercel log drains will alert)
- [ ] Step 3.4: Document the cleanup pattern: probes use email pattern `health-probe+*@lagunabeachtennisacademy.com` so you can SQL-filter them out of Coach Hub leads. Add filter to `lib/leads-query.ts` so synthetic probes don't pollute the leads table.

## Files to Create/Modify
| File | Action | Purpose |
|---|---|---|
| `lib/conversion-pages.ts` | Create | Single source of truth for "this page is a form, suppress competing CTAs" |
| `lib/conversion-pages.test.ts` | Create | Unit tests for the helper |
| `components/StickyCTA.tsx` | Modify | Self-suppress on conversion pages |
| `scripts/smoke-leads.ts` | Create | End-to-end pipeline canary (POST → Supabase → Postmark) |
| `scripts/diagnose-leads.ts` | Delete | Was a one-off diagnostic; logic now in smoke-leads |
| `package.json` | Modify | Add `smoke:leads` script |
| `app/api/cron/leads-canary/route.ts` | Create | Vercel cron — runs the canary every 6h |
| `vercel.json` | Modify | Add `leads-canary` cron entry |
| `lib/leads-query.ts` | Modify | Filter `health-probe+*@` synthetic rows from `getAllLeads()` |

```yaml
# files (machine-readable; keep in sync with table)
create:
  - lib/conversion-pages.ts
  - lib/conversion-pages.test.ts
  - scripts/smoke-leads.ts
  - app/api/cron/leads-canary/route.ts
modify:
  - components/StickyCTA.tsx
  - package.json
  - vercel.json
  - lib/leads-query.ts
delete:
  - scripts/diagnose-leads.ts
```

## Out of scope (this plan)
- Investigating WHY users stopped submitting between May 1 and the contact-page bug (likely marketing/ads issue — separate)
- GHL integration changes (we know it's a no-op when env unset; that's documented behavior)
- Notion lead DB schema changes
- ActiveCampaign automation tweaks
- Header z-index restructure (the bug surfaced as bottom StickyCTA on mobile; if 375px test surfaces a Header overlap on desktop, file separately)
- New mobile UX work beyond what the smoke test surfaces as broken

## Success Criteria
- [ ] `/contact`, `/book`, `/junior-trial`, `/adult-trial`, `/apply-scholarship` no longer render `StickyCTA` (no "Book a Trial" bottom bar competing with the page's own form submit)
- [ ] Mobile (375px) smoke pass: all 3 forms (trial, contact, newsletter) submit successfully OR every blocker is documented with a fix or follow-up plan
- [ ] Postmark notification path verified — either Andrew confirms email receipt OR `smoke:leads` reports the token as valid
- [ ] `npm run smoke:leads` runs in CI/locally, exits 0 when pipeline is healthy
- [ ] Vercel cron `leads-canary` deployed; first scheduled run succeeds
- [ ] All tests pass; `npm run quality-gate` clean; `health:prod` green
- [ ] No tracked lints introduced

## Acceptance checklist
| # | Acceptance item | Verification |
|---|---|---|
| A1 | StickyCTA suppressed on /contact | curl https://prod/contact and grep for "Book a Trial" inside the StickyCTA wrapper class — should be absent |
| A2 | StickyCTA still visible on /schedules, /about, /coaches | manual browser at 375px confirms it shows after scroll |
| A3 | /contact submit button is reachable on desktop AND mobile 375px | browser smoke test clicks and submits successfully |
| A4 | Newsletter form in footer submits successfully | browser smoke test |
| A5 | Postmark notifications reach Andrew | inbox check OR `smoke:leads` Postmark ping returns 200 |
| A6 | `npm run smoke:leads` runs end-to-end | exit 0; output shows POST /api/book ✓, Supabase row ✓, Postmark ✓ |
| A7 | leads-canary cron exists and is wired in vercel.json | grep vercel.json |
| A8 | Synthetic probe leads don't pollute Coach Hub view | open /coach-hub/leads after a probe; HealthProbe name should NOT appear |

## Research Sources
- Browser-use smoke test (2026-05-13) — surfaced sticky-CTA + submit-button overlap
- Live curl POST /api/book → 200 success — confirmed backend pipeline healthy
- Supabase query (`scripts/diagnose-leads.ts`) — confirmed 13-day drought of website leads, May 6 burst was Meta backfill
- Codebase: `components/StickyCTA.tsx` (md:hidden bottom z-30), `app/contact/page.tsx` line 504, `lib/email.ts` Postmark integration, `scripts/check-prod-health.ts`, `scripts/smoke-lead.js`
- Postmark API docs: `GET https://api.postmarkapp.com/server` with `X-Postmark-Server-Token` header returns 200 + server JSON when token is valid

## Relevant Learnings
- **`2026-05-07-prod-health-check-compound-learn.md`**: "End-user-perspective verification — `vercel ls Ready` is insufficient; only an actual HTTP request from outside Vercel proves the site is serving." This plan extends that principle from GET routes to POST conversion paths.
- **Pattern: `BRAND COLOR POLICY` in `lib/email.ts`**: documented exceptions are good and we should reuse the comment style for conversion-pages registry.
- **Anti-pattern (this incident): "Silent failure with no canary"** — we had a 13-day blind spot. Add to `anti-patterns.json`: any business-critical pipeline without a synthetic canary running ≥hourly is at risk of silent failure.

## Research conflicts & resolution
None — single owner of StickyCTA visibility decision (the component itself), and Postmark / Supabase paths are well-defined.

## Confidence & uncertainty
**Plan confidence: high** — small, surgical changes; backend already verified working; new code is mostly net-additive (smoke script + cron + helper).

**Uncertainty:**
- Whether the contact-page UX bug is actually fixed by hiding StickyCTA, or if there's also a Header z-index issue at certain scroll positions. Mitigation: mobile + desktop browser smoke after the fix.
- Whether Postmark is actually working (waiting on Andrew's inbox check). Mitigation: the new `smoke:leads` Postmark ping settles this independently.
- Cron timing — Vercel cron Hobby tier is daily-only; LBTA is on Pro so 6-hourly is fine. Verify before deploy.

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Hiding StickyCTA on /contact reduces /book conversions | We're already losing 100% of /contact submits to the bug. Net positive. Track in analytics. |
| Synthetic probes pollute Supabase leads | Explicit email pattern (`health-probe+*@…`) + filter in `getAllLeads()` |
| Postmark token rotation breaks notifications silently | New cron pings token every 6h; failure shows up in Vercel logs |
| New cron triggers AC / Notion / GHL on every probe | Diagnostic email pattern + storeLead source `health-canary` (not in AC integrations) — verify in Step 3.1 the smoke probe doesn't write to AC/GHL. **Gate**: must skip AC/Notion/GHL writes for diagnostic email pattern. |
| 6-hourly probe creates rate-limit load on /api/book | Probe uses unique email each run (timestamp); rate limiter is IP-based; cron source is internal Vercel IP. Negligible. |

## Step dependencies
- Step 1.1 → 1.2 → 1.3 (sequential within Phase 1)
- Phase 1 and Phase 2 are independent (parallelizable)
- Phase 3 depends on Phase 2 (need to know whether Postmark token check is needed in addition to or instead of inbox check)
- Step 3.1 → 3.2 (script must exist before script entry)
- Step 3.3 → 3.4 (cron must exist before filter is wired)

## Gate before Deploy
- All Acceptance items A1–A8 verified
- `npm run quality-gate` exits 0
- `npm run smoke:leads` exits 0 against local + against prod URL
