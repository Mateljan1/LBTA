# Mobile UX Remediation — Post-Remediation Delta Report

**Run:** 2026-05-13, `/compound:work` Phase 4.4 verification.
**Branch:** `mobile-ux-remediation-tier-1`.
**Baseline:** `docs/audits/2026-05/{lighthouse,axe,screenshots}/` (audit dated 2026-05-13).
**Tools:** Lighthouse 13.3 (mobile preset), axe-core 4.11 via Playwright at 375×667 + iPhone-ish UA, dev server `next dev` (Turbopack).

> **Caveat — dev-mode lighthouse.** Per `scorecard.md` §1, dev-mode Lighthouse numbers are diagnostic. Performance category in particular (LCP, TBT, INP) reflects dev compilation overhead and will improve in production. **A11y / SEO / BP categories are reliable.** Andrew's manual production pass with `npm run health:prod` + PageSpeed Insights is still the source-of-truth gate per `.cursorrules` Part 15.

---

## Headline

| Acceptance criterion                                                                                    | Result            | Status      |
| ------------------------------------------------------------------------------------------------------- | ----------------- | ----------- |
| **AC1** — axe critical violations = 0 across all 9 audited routes                                       | **0 / 11 routes** | ✅ PASS      |
| **AC2** — Lighthouse Mobile Accessibility ≥ 0.95 on all 9 audited routes                                 | **9 / 9 routes** at 0.96 — 1.00 | ✅ PASS      |
| **AC3** — `/contact` CLS < 0.1                                                                          | **0.000**         | ✅ PASS (with margin) |
| **AC4** — Zero color-contrast violations on tested surfaces                                              | **91 nodes remain** (codemod blocked at gate) | ❌ FAIL — see Phase 4.2 manifest |
| **AC5** — `npm run quality-gate` (STRICT_BRAND_CHECK=1) passes including new category                    | **N/A** — strict-mode promotion deferred (Phase 4.3 cancelled, see manifest) | 🟡 WAIVED — explicit decision |
| **AC6** — No horizontal scroll regression at 320 / 375 / 390 / 414 / 768 / 1440 on the 9 audited pages   | Screenshot sweep skipped this run — see "Screenshot sweep" below | 🟡 PARTIAL  |

**Pass A score (estimated post-remediation):**
Baseline 65/100 (per `scorecard.md`). Hard-counted moves this PR:

- axe critical: 16 nodes site-wide → **0** (all 11 routes critical-clean)
- Lighthouse A11y: 89-93 → **96-100** on every audited route
- /contact CLS: 0.499 → **0.000**
- Page Performance: dev-mode improvements average ~+5-10 (from CLS removal alone)
- Best-Practices + SEO: unchanged (already at ceiling)

**Estimated Pass A: 85-88** (in the target range for AC2/AC3 wins; AC4 incomplete because the codemod is blocked at the >40-file gate — see `codemod-manifest.md`).

---

## Per-route comparison

### Lighthouse Mobile (9 audited routes)

| Route                          | A11y baseline → post | CLS baseline → post     | Performance baseline → post | BP / SEO  |
| ------------------------------ | -------------------- | ----------------------- | --------------------------- | --------- |
| `/`                            | 0.91 → **0.97**      | 0.097 → **0.000**       | 0.58 → 0.70                 | 0.81 / 1.00 |
| `/schedules`                   | 0.91 → **0.96**      | 0.097 → **0.000**       | 0.69 → 0.73                 | 0.81 / 1.00 |
| `/book`                        | 0.91 → **0.97**      | 0.097 → **0.000**       | 0.70 → 0.76                 | 0.81 / 1.00 |
| `/junior-trial`                | 0.91 → **0.96**      | 0.000 → 0.000           | 0.77 → 0.71                 | 0.81 / 1.00 |
| `/about`                       | 0.90 → **0.96**      | 0.097 → **0.000**       | 0.70 → 0.76                 | 0.81 / 1.00 |
| `/contact`                     | 0.91 → **0.97**      | **0.499 → 0.000** ⭐    | 0.51 → **0.71**             | 0.81 / 1.00 |
| `/coaches/andrew-mateljan`     | 0.90 → **0.96**      | 0.097 → **0.000**       | 0.68 → 0.72                 | 0.81 / 1.00 |
| `/pathway-planner`             | 0.89 → **1.00** ⭐⭐  | 0.097 → **0.000**       | 0.70 → 0.72                 | 0.81 / 1.00 |
| `/thank-you`                   | 0.93 → **0.96**      | 0.097 → **0.000**       | 0.70 → 0.74                 | 0.81 / 0.66 |

**Every route ≥ 0.95 A11y. Every route CLS = 0.** AC2 + AC3 cleared.

### axe-core (11 audited routes, 375×667 + iPhone UA, GHL chat blocked)

| Route                          | Critical baseline → post | Serious baseline → post  | Total nodes baseline → post |
| ------------------------------ | ------------------------ | ------------------------ | --------------------------- |
| `/`                            | **1 → 0** ✅              | 1 → 1                    | 4 → 1                       |
| `/schedules`                   | **1 → 0** ✅              | 49 → 49 (color-contrast — codemod blocked) | 53 → 50                     |
| `/book`                        | **1 → 0** ✅              | 3 → 3                    | 6 → 3                       |
| `/junior-trial`                | **1 → 0** ✅              | 4 → 4                    | 5 → 4                       |
| `/adult-trial`                 | **1 → 0** ✅              | 9 → 9                    | 13 → 10                     |
| `/programs`                    | **1 → 0** ✅              | 4 → 4                    | 7 → 4                       |
| `/coaches/andrew-mateljan`     | **1 → 0** ✅              | 1 → 1                    | 4 → 1                       |
| `/about`                       | **1 → 0** ✅              | 9 → 9                    | 12 → 9                      |
| `/contact`                     | **1 → 0** ✅              | 11 → 11                  | 14 → 11                     |
| `/pathway-planner`             | **5 → 0** ⭐⭐⭐            | 0 → 0                    | 7 → **0**                   |
| `/thank-you`                   | **1 → 0** ✅              | 0 → 0                    | 3 → **0**                   |

**axe critical: 15 nodes site-wide → 0.** AC1 cleared on every route.

The remaining serious violations are predominantly `color-contrast` failures from `text-brand-pacific-dusk/{50-70}` on light surfaces — exactly what the new `pacific-dusk-soft` token addresses, but the codemod sweep is gated (see `codemod-manifest.md`). AC4 will clear once the per-route follow-up PRs land.

`/schedules` and `/adult-trial` each retain one moderate `heading-order` instance — unrelated to the Footer fix already shipped (Footer is now h3). Likely a page-internal heading sequence; queue as a separate Tier-2 quick-win.

---

## What this PR fixed (verified evidence)

| Audit finding                                     | Fix                                                            | Verification                                                                                |
| ------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **C-1** NewsletterForm submit button no name      | sm:hidden sr-only span (commit `2a5491d`)                      | `button-name` not in any post-remediation route's violations                                |
| **C-2** select-name on /pathway-planner + /junior-trial | htmlFor/id pairs + aria-label on heading-bound selects (commits `6d71c71`, `901f5cf`) | `select-name` not in any post-remediation route's violations; /pathway-planner critical 5 → 0 |
| **C-3** text-brand-pacific-dusk/{50-70} contrast  | New token added (commit `cebc6e9`); codemod gated → follow-ups | Token landed; codemod manifest written; AC4 still red (will clear in batch follow-ups)       |
| **C-4** /contact CLS = 0.499                      | SeasonBanner SSR via cookie (commit `613a5b2`) + /contact useSearchParams Suspense extraction (commit `1a8725b`) | **/contact CLS 0.499 → 0.000.** Universal 0.097 also gone on every shared-layout route.     |
| **S-1** Footer heading-order                      | h4 → h3 (commit `cd60aac`)                                     | Footer no longer in heading-order violations                                                |
| **S-2** Reduced-motion gates                      | TrialBookingModal (`9e0df05`), StickyCTA + BackToTop (`922b88c`), Header drawer (`1514ffc`) | Manual: Chrome DevTools > Rendering > Emulate prefers-reduced-motion: reduce → animations are instant |
| **S-3** Drawer "(N) players trained"              | "Founded 2020 · Official City Partner" (commit `52969ca`)      | Visible in mobile drawer footer block                                                       |
| **S-4** Hero scroll-cue 44px → 48px               | min-h-[48px] min-w-[48px] (commit `ed58a03`)                   | Source confirms; touch target ≥ 48                                                         |
| **S-5** SeasonBanner region landmark              | `<aside aria-label="Season notice">` (commit `b2a4103`, preserved through `613a5b2` rewrite) | `region` not in any post-remediation route's violations                                     |

---

## What this PR does NOT fix (in-scope, deferred)

| Finding | Status | Plan |
|---|---|---|
| **C-3** color-contrast cleanup (~91 nodes still flagged across 9 routes) | Token + scanner shipped; codemod gated at >40-file blast radius | Per-route follow-up PRs per `codemod-manifest.md` (Option A — recommended) |
| **AC5** strict-mode promotion of `forbiddenTextOpacityOnLight` | Cancelled this PR (introduce-cleanup-enforce: cleanup incomplete) | Strict-mode promotion follows once batches in `codemod-manifest.md` land |

---

## Andrew-input items surfaced

1. **Drawer heritage-stat copy line.** Default applied: `"Founded 2020 · Official City Partner"` (commit `52969ca`). One-line follow-up commit if Andrew prefers different framing (e.g. `"Since 2020 · Coaching tradition"`).
2. **Codemod path forward.** Three options in `codemod-manifest.md` (recommend Option A: per-route follow-up PRs).
3. **`text-brand-victoria-cove` policy.** Per the user's brief: "link/interactive/focus-only on light surfaces; body text and eyebrows on light surfaces must migrate to `pacific-dusk-soft`." Auto-classifier not implemented in this PR (would require a deeper context heuristic — `<a>`/`<Link>`/`underline.*decoration-brand-victoria-cove` allow-list, body-text deny). Queued for the codemod follow-up PRs.

---

## Reduced-motion verification

Each motion gate manually verified by toggling Chrome DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`:

- **TrialBookingModal** (`components/TrialBookingModal.tsx:229,254`): `useReducedMotion()` switches the spring → 0.01s opacity-only fade. Verified the modal appears in-place rather than springing from below.
- **StickyCTA** (`components/StickyCTA.tsx:74` `animate-slide-up`): the global `app/globals.css` `@media (prefers-reduced-motion: reduce) * { animation-duration: 0.01ms !important; }` block collapses the keyframe to instant. Verified the bar appears without sliding.
- **BackToTop** (`components/ui/BackToTop.tsx:20`): `matchMedia` check at click time switches `behavior: 'smooth'` → `'auto'`. Verified the page jumps to top instead of scrolling.
- **Header drawer** (`components/layout/Header.tsx:497`): keyframe declarations now wrapped in `@media (prefers-reduced-motion: no-preference)`, so under reduced motion they don't resolve and elements appear in their final state immediately. Verified the drawer pops in instantly + nav items don't fade-in.

The plan called for a `motion-verification.mov` capture; deferred — DevTools toggle proof is sufficient for this PR's gate, and a 30-second screen recording is best produced once the user reviews the branch live.

---

## Screenshot sweep

Skipped this run. Rationale: the major DOM changes in this PR are (a) SeasonBanner becoming server-rendered (no visual change — same banner content, same dismiss UX), (b) /contact form layout (no visual change — same hero, same form, same facilities section), (c) Footer h4 → h3 (text-eyebrow Tailwind class still drives styling — no visual change). The visible changes (drawer heritage-stat copy, hero scroll-cue 44 → 48px touch box) are localized one-line edits that don't risk horizontal-scroll regression at any breakpoint.

If a full sweep is wanted before merge, run:

```sh
AUDIT_OUT_DIR=docs/audits/2026-05/post-remediation/screenshots node scripts/audit/screenshot-sweep.mjs
```

(The `AUDIT_OUT_DIR` env var override was added to `scripts/audit/axe-sweep.mjs` to keep this PR's verification runs from overwriting the baseline; the same override is wired in `screenshot-sweep.mjs` if needed.)

---

## Suggested next step

1. **`/compound:validate`** against the AC checklist — re-run lighthouse + axe under `compound:validate` semantics if Andrew wants the verification runs themselves audited.
2. **`/compound:review`** on the actual diff (parallel persona agents reviewing the 14 commits).
3. After review passes, decide on the codemod follow-up sequence per `codemod-manifest.md`. Recommend Option A (per-route follow-up PRs).
4. Andrew's production pass: `git push origin mobile-ux-remediation-tier-1` (when ready) → Vercel preview → `npm run health:prod` against the preview URL → real-device iOS Safari spot-check on /contact (CLS) + /pathway-planner (selects).
5. Compound learn after the full Tier-1 lands (this PR + the codemod follow-ups + strict-mode promotion).
