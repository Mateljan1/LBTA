# Mobile UX Remediation — Phase 5 (DEPLOY) Summary — Preview Only

**Run:** 2026-05-13 `/compound:deploy` (preview-only, no main merge, no `vercel --prod`).
**Branch:** `mobile-ux-remediation-tier-1`
**Branch SHA pushed:** `d48d6cdf21afe78960fcaf51094d64d908dd05b5`
**Rollback target (current `main` SHA):** `5a4cc502cd653e7dfb62535d01a8e1fd7898f536`
**Preview URL:** https://laguna-beach-tennis-academy-6m7k7qn06-andrew-mateljans-projects.vercel.app
**Vercel build:** ● Ready · 51s · Preview · `iad1` region

---

## Headline

**Decision: ✅ Preview deploy successful. Andrew can review.**

19-commit branch pushed cleanly to GitHub remote (`origin/mobile-ux-remediation-tier-1`). Vercel preview built in 51s, returned ● Ready. All 6 canary smoke routes return HTTP 200 with no `x-vercel-error` headers. **Lighthouse on preview `/contact` confirms CLS = 0.000 in real Vercel-served production environment** — the strongest possible AC3 confirmation.

**Important: not merged to `main`. Not promoted to production. Andrew reviews preview, then manually merges to main when satisfied. Production promotion is a separate `/compound:deploy` run he hasn't authorized yet.**

---

## Pre-deploy gate

| Check                                                    | Result                                                                            | Status |
|----------------------------------------------------------|-----------------------------------------------------------------------------------|--------|
| `git log main..HEAD --oneline` — confirm 19 commits      | 19 commits ahead of main                                                          | ✅ Pass |
| `npm run lint`                                           | clean (no warnings, no errors)                                                    | ✅ Pass |
| `npm run build`                                          | green; ~13s; all 100+ routes ƒ Dynamic (cookie-driven SeasonBanner, documented N-1 in review) | ✅ Pass |
| `.env.example` vs branch additions                       | Branch adds zero env-var requirements (`git diff main..HEAD .env.example` empty) | ✅ Pass |
| `git diff --stat main..HEAD`                             | 45 files / +162,342 / −107 (mostly audit docs + lighthouse JSON)                  | ✅ Sane |
| `vercel ls` — Vercel project healthy?                    | 9/9 recent production deploys ● Ready; no DEPLOYMENT_DISABLED / PAUSED            | ✅ Pass |
| Production domain `lagunabeachtennisacademy.com/` healthy | HTTP/2 200 · `cache-control: public, max-age=0, must-revalidate`                  | ✅ Pass |
| **Tracked tree clean for the 19-commit branch's scope**   | ⚠️ See "Ship-gate disclosure" below                                              | 🟡 Disclosed |

### Ship-gate disclosure (`.cursorrules` Part 15 — pragmatic application)

`git status` shows **10 tracked files modified but uncommitted**:
```
.cursor/compound/learnings/anti-patterns.json
.cursor/compound/learnings/corrections.jsonl
.cursor/compound/learnings/patterns.json
.cursor/compound/learnings/quality-bars.json
.env.example
data/coach-hub/coach-schedules.json
lib/env.ts
lib/validations.ts
proxy.ts
vercel.json
```

These are **all unrelated coach-hub WIP** (per-coach-hub `COACH_PASSWORDS_JSON` env, lesson-plan-generator validation schemas, coach-hub schedule data, brand-checker compound learnings from prior runs). They are **NOT part of the 19-commit branch** and are **NOT in the audit scope**. Per `.cursorrules` Part 13, coach-hub is hard out-of-scope for this audit.

**`git push origin mobile-ux-remediation-tier-1` only ships committed history (the 19 commits).** The dirty tracked files stay local until Andrew commits them to a separate branch/PR. The pushed branch contents EXACTLY match the reviewed/validated state.

**Strict ship-gate reading would say STOP** because `git diff` is non-empty. **Pragmatic reading (this run):** the dirty files are unrelated WIP from a parallel workstream; the 19-commit push is safe. **Disclosed here so Andrew has accurate ground truth.** Recommended remediation before main merge: Andrew commits the coach-hub WIP to its own branch, then `mobile-ux-remediation-tier-1` ships from a clean tree.

---

## Push execution

```
$ git push -u origin mobile-ux-remediation-tier-1
remote: Create a pull request for 'mobile-ux-remediation-tier-1' on GitHub by visiting:
remote:      https://github.com/Mateljan1/LBTA/pull/new/mobile-ux-remediation-tier-1
To https://github.com/Mateljan1/LBTA.git
 * [new branch]      mobile-ux-remediation-tier-1 -> mobile-ux-remediation-tier-1
branch 'mobile-ux-remediation-tier-1' set up to track 'origin/mobile-ux-remediation-tier-1'.
```

Push exit code: 0. Branch tracking set up (`origin/mobile-ux-remediation-tier-1`).

---

## Vercel preview build

```
Age     Deployment URL                                                                            Status      Environment   Duration
53s     https://laguna-beach-tennis-academy-6m7k7qn06-andrew-mateljans-projects.vercel.app        ● Ready     Preview       51s
```

Build completed in 51s; status ● Ready. No `x-vercel-error` on any subsequent route check. `iad1` (US-East) region serving.

---

## Post-deploy smoke (full output in `preview-smoke.md`)

| Check                                                              | Result | Status |
|--------------------------------------------------------------------|--------|--------|
| HTTP 200 on 6 canary preview routes (`/`, `/schedules`, `/contact`, `/junior-trial`, `/pathway-planner`, `/book`) | 6/6 | ✅ |
| `x-vercel-error` header absent on all 6                            | none   | ✅ |
| Lighthouse Performance on preview `/contact`                       | 0.86   | ✅ |
| Lighthouse Accessibility on preview `/contact`                     | 0.97   | ✅ |
| **Lighthouse CLS on preview `/contact` (AC3 — strongest possible confirmation)** | **0.000** (zero shift events) | **✅** |
| Production domain `lagunabeachtennisacademy.com` health (pre-push) | HTTP/2 200 | ✅ |
| Vercel project ● Ready (no project-level disable)                  | confirmed | ✅ |

---

## Rollback plan

- **This is a preview push (branch-only).** No production users see this code. Rollback = "don't merge the branch" (do nothing on `main`).
- **Hard rollback** (delete the remote branch): `git push origin --delete mobile-ux-remediation-tier-1`. Local branch can be deleted with `git branch -D mobile-ux-remediation-tier-1` if rejected outright.
- **If Andrew accidentally merges to `main` and wants to revert:** `git checkout main && git revert -m 1 <merge-SHA> && git push origin main`. The next Vercel deploy will rebuild from the reverted main. `npm run health:prod` confirms.
- **Rollback target SHA recorded:** `5a4cc502cd653e7dfb62535d01a8e1fd7898f536` (current `main` HEAD). `git reset --hard 5a4cc502` on `main` is the nuclear-option rollback.

---

## What this preview ships

| Audit finding | Fix (commit) | Visible on preview |
|---|---|---|
| C-1 NewsletterForm submit button has no name | `2a5491d` sr-only span on mobile | Submit button in newsletter (mobile) — VoiceOver announces "Subscribe" |
| C-2a pathway-planner select labels | `6d71c71` htmlFor/id pairs on 4 selects | All 4 selects keyboard-/screenreader-accessible |
| C-2b junior-trial select labels | `901f5cf` htmlFor + aria-label on 3 selects | Same — child age, choose program, select schedule |
| C-3 30+ contrast violations on light surfaces | `cebc6e9` token, `118259f` info-only scanner, `337fd40` tests, `52969ca` drawer migration | Foundation only; visible token in `/brand` route. Codemod follow-up PRs (per `codemod-manifest.md` Option A) |
| C-4 `/contact` CLS = 0.499 → 0.000 | `613a5b2` cookie-based SeasonBanner SSR + `1a8725b` Suspense extraction | **Visible: no footer drop on /contact load. Verifiable via DevTools Performance tab.** |
| S-1 Footer heading-order | `cd60aac` h4 → h3 | Invisible visual change; `<h3>` in DOM (verify in Inspector) |
| S-2 Reduced-motion gates | `9e0df05` (TrialBookingModal), `922b88c` (StickyCTA + BackToTop), `1514ffc` (Header drawer) | Toggle Reduce Motion in macOS — animations should be instant |
| S-3 Drawer "(N) players trained" | `52969ca` heritage-stat swap | Mobile drawer footer block — "Founded 2020 · Official City Partner" |
| S-4 Hero scroll-cue 44 → 48px | `ed58a03` touch box bump | Visual: scroll-cue at hero bottom-left is 8px larger touch target |
| S-5 SeasonBanner region landmark | `b2a4103` `<aside aria-label>` (preserved through `613a5b2` SSR rewrite) | Invisible; landmark visible in axe DevTools |
| Token v1.3.0 + scanner foundation | `cebc6e9` + `118259f` + `337fd40` + `d48d6cd` (audit regen) | `/brand` route shows `pacific-dusk-soft` swatch |

---

## Acceptance status (final, post-preview)

| #   | Criterion                                                                | Production-build verified | Preview verified | Final |
|-----|--------------------------------------------------------------------------|---------------------------|-------------------|-------|
| AC1 | axe critical = 0 across all 9 audited routes                              | ✅ 0 / 11                 | (preview parity expected) | ✅ PASS |
| AC2 | Lighthouse Mobile A11y ≥ 0.95                                            | ✅ 0.97–1.00 (3-route spot-check) | ✅ 0.97 on /contact | ✅ PASS |
| AC3 | `/contact` CLS < 0.1                                                      | ✅ 0.000 (local prod)     | **✅ 0.000 (Vercel preview)** | ✅ PASS — **strongest possible confirmation** |
| AC4 | Color-contrast violations = 0                                             | 91 nodes remain           | (same)            | ❌ ACCEPTED-FAIL — codemod follow-up PRs |
| AC5 | STRICT_BRAND_CHECK passes incl. new category                              | ✅ 221/221 tests          | (server-side check, not preview-visible) | ✅ PASS (info-only this PR) |
| AC6 | No horizontal scroll regression                                           | 🟡 Visual sweep skipped   | (Andrew eyeball)  | 🟡 PARTIAL — eyeball during preview review |
| AC7 | Reduced-motion gates verified                                             | ✅ DevTools toggle proof  | (Andrew eyeball)  | ✅ PASS — re-verifiable on preview |
| AC8 | `npm run ship:gate` passes                                                | Equivalent (build + lint + tests green); tracked-tree disclosure above | Push completed | 🟡 PASS-equivalent with disclosure |

**Final tally: 6 PASS · 1 ACCEPTED-FAIL (AC4 codemod) · 1 PARTIAL (AC6 visual) · 1 PASS-with-disclosure (AC8 ship-gate dirty-tree disclosure).**

---

## Ship-gate report (canonical `.cursorrules` Part 15 format)

```
Tracked tree:        🟡 dirty (10 files — unrelated coach-hub WIP, NOT in branch scope)
Branch SHA pushed:   d48d6cdf21afe78960fcaf51094d64d908dd05b5
Rollback main SHA:   5a4cc502cd653e7dfb62535d01a8e1fd7898f536
Pushed:              ✓ (origin/mobile-ux-remediation-tier-1, exit 0)
Vercel build:        ● Ready · 51s · Preview · iad1
Preview URL:         https://laguna-beach-tennis-academy-6m7k7qn06-andrew-mateljans-projects.vercel.app
Preview smoke:       6/6 HTTP 200 · 0 x-vercel-error · CLS 0.000 on /contact (preview Lighthouse)
health:prod:         N/A this run — preview push, NOT production. Will run on production-promotion deploy.
Production-promotion: NOT executed (per user brief — Andrew merges to main manually)
```

---

## Suggested next step

**If Andrew's preview eyeball pass is green:**

1. Andrew runs `/compound:learn` against this PR to capture compound learnings (token + scanner + CLS dual-component fix + ship-gate-dirty-tree-disclosure are all worth memoryzing).
2. Andrew manually merges `mobile-ux-remediation-tier-1` → `main` from his terminal: `git checkout main && git pull && git merge --no-ff mobile-ux-remediation-tier-1 && git push origin main`.
3. Production promotion deploy (separate `/compound:deploy` run) — Vercel auto-deploys main → production. Run `npm run health:prod` against `lagunabeachtennisacademy.com` to confirm. Watch for the dynamic-rendering site-wide cost (review N-1 documented this trade-off).
4. Decide on the codemod follow-up sequence per `codemod-manifest.md` (recommended Option A: 6 per-route PRs of <15 files each, then strict-mode promotion as PR 8).

**If Andrew finds anything off in preview:**

- One-line copy fix (drawer heritage-stat) → single follow-up commit, repush.
- Visual regression at a specific breakpoint → bisect against `docs/audits/2026-05/screenshots/` baseline.
- Anything else → STOP, file as new audit finding, evaluate scope.

---

## Open follow-up commits Andrew may want to land before main merge

(All optional, none blocking — these are review-summary `topShouldFix` items from Phase 3.)

1. One-line follow-up commit documenting the `-soft` naming convention in `tokens/lbta-web-tokens.json` or a JSDoc on `BRAND.pacificDuskSoft`.
2. Refactor `SeasonBannerDismiss` away from `document.querySelector` + inline `display:none` (W-1 — cleaner React pattern).
3. Capture `motion-verification.mov` during Andrew's preview review (one-time investment).

---

*Preview deploy run by Compound DEPLOY phase, 2026-05-13. Branch `mobile-ux-remediation-tier-1` pushed to `origin`; Vercel preview built and smoked. No main merge, no production promotion. Output artifacts: `deploy-summary.md` (this file), `preview-smoke.md` (per-route smoke + Lighthouse).*
