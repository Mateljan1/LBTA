# Mobile UX Audit — Prioritized Findings

> **Audit window:** 2026-05-13
> **Source:** synthesis of `scorecard.md` (Pass A — measurable) + `gap-report.md` (Pass B — taste & flow).
> **Methodology:** every finding below has a verified-source pointer (`file:line` or `axe/{slug}.json` or `lighthouse/{page}.report.html`). Per `auditClaimsVerifiedBeforeP0`, an unverifiable claim is **not** a finding — it's flagged "defer to Andrew's manual pass" instead.
> **Bucket definitions (cursorrules-aligned):**
> - **Critical** — fails WCAG AA, fails cursorrules quality-bar, or blocks the primary trial-booking flow. Must fix this cycle.
> - **Should-fix** — fails WCAG AAA, degrades luxury perception, or is a clear regression to ship.
> - **Nice-to-have** — minor polish that doesn't move conversion or compliance.
>
> Each finding is tagged with effort (S ≤1d / M 1–3d / L >3d) and curve (Curve 1 = execute / Curve 2 = Andrew taste call).

---

## CRITICAL (4)

### C-1 — NewsletterForm submit button has no accessible name on mobile (site-wide)
- **Evidence:** `components/NewsletterForm.tsx:74-80` — `<span className="hidden sm:inline">Subscribe</span>` hides the only label at mobile widths; the trailing `<svg aria-hidden="true">` leaves the button nameless. Axe-core confirms across 10 of 11 audited pages (`axe/home.json`, `axe/contact.json`, etc.).
- **Why it matters:** Screen readers announce "button" with no purpose. WCAG SC 4.1.2 (Level A). Affects every page (footer is global).
- **Effort:** S. Curve 1. Add `aria-label="Subscribe to newsletter"` on the button, or render the "Subscribe" text but with `sr-only` at `<sm:` if the visual design must stay icon-only.
- **Quick-win.**

### C-2 — `<select>` elements without accessible labels (4 instances)
- **Evidence:** `axe/junior-trial.json` (1 instance — program select); `axe/pathway-planner.json` (3 instances — quiz selects, `div:nth-child(1) > select`, `div:nth-child(2) > select`, `div:nth-child(3) > select`).
- **Why it matters:** WCAG SC 4.1.2 + SC 1.3.1. A screen-reader user cannot tell what the select chooses. Critical for the pathway-planner — the entire quiz is unusable on AT.
- **Effort:** S. Curve 1. Add `<label htmlFor>` paired with each select OR `aria-label="…"` directly.
- **Quick-win.**

### C-3 — Systemic low-opacity brand-text contrast failures (`/50`, `/60`, `/65`, `/70` on light)
- **Evidence:** axe color-contrast violations on 9 of 11 pages. Specific measured ratios:
  - `text-brand-victoria-cove` (#2E8B8B) on `bg-brand-morning-light` (#FAF8F4) = **3.82:1** — `components/FAQSection.tsx:162-166` "View all FAQs"; `/contact` phone + email links (`app/contact/page.tsx`).
  - `text-brand-pacific-dusk/50` on light = **2.74:1** — `TrialBookingModal.tsx:265` "FREE TRIAL LESSON" eyebrow; `/schedules` filter "Filter by age, level, or day".
  - `text-brand-pacific-dusk/60` on light = **3.56:1** — `/schedules` filter labels.
  - `text-brand-pacific-dusk/65` on white = **4.12:1** — `/schedules` subtext.
  - `text-brand-pacific-dusk/70` on `bg-brand-sandstone` = **4.44:1** — `/schedules` inactive season tabs ("Winter", "Summer", "Fall" labels).
- **Why it matters:** WCAG AA bar is 4.5:1 for normal text. Most of the above **fail AA** (not just AAA). The brand-pacific-dusk/50 case at 2.74:1 is among the worst. AAA bar (7:1) is the LBTA bar per `.cursorrules`.
- **Effort:** S–M. Curve 1. Two paths:
  - Quick: site-wide token swap — `text-brand-pacific-dusk/{50,60,65,70}` → `text-brand-pacific-dusk/85` (≈ 5.9:1 — passes AA; verify against AAA on each surface).
  - Considered: redefine the eyebrow / secondary-text token to a single canonical color (e.g. `--text-secondary: #4A5568`) that always passes AAA on `morning-light` and `sandstone`. This becomes a brand-system v1.2 candidate.
- **Quick-win OR Strategic** depending on path. Recommend quick token-swap now; brand-system v1.2 in follow-up.

### C-4 — `/contact` CLS = 0.499 (5× over `.cursorrules` bar of 0.1)
- **Evidence:** `lighthouse/contact.report.json` shows two layout shifts originating in `<footer>` (`body > footer.bg-brand-deep-water`) scoring 0.402 + 0.097.
- **Why it matters:** Field CLS is a Core Web Vitals ranking signal. 0.499 on a real device feels like the page is "jumping." Worst single-page CLS in the audit.
- **Effort:** M. Curve 1. Likely fixes: reserve space for the deferred ChatWidget launcher; explicit `min-height` on the contact-form section; check that newsletter form has no font-swap (FOIT) shifting.
- **Should-fix → Critical (it fails the bar by 5×).**

---

## SHOULD-FIX (8)

### S-1 — Heading-order violation site-wide (Footer `<h4>` after page `<h2>`)
- **Evidence:** `components/layout/Footer.tsx:79,102,126` — `<h4 class="text-eyebrow">Programs / Academy / Contact</h4>`. The page-level `<h2>` "JOIN OUR COMMUNITY" at `:20` is followed directly by `<h4>` with no `<h3>` between. Axe-core flags `heading-order` on 10 of 11 pages.
- **Effort:** S. Curve 1. Either bump Footer column titles to `<h3>` or downgrade them to a styled `<p>` / `<div>` if they aren't actually navigation landmarks (they're labels above link lists, so semantically more like `<h3>` than headings of equal weight to the page).

### S-2 — Reduced-motion gates missing in TrialBookingModal, StickyCTA, BackToTop, Header keyframes
- **Evidence:**
  - `TrialBookingModal.tsx:226-229` — `transition={{ type: "spring", stiffness: 400, damping: 35 }}` runs unconditionally.
  - `StickyCTA.tsx:74` — `animate-slide-up` runs unconditionally.
  - `BackToTop.tsx:21-25` — `window.scrollTo({ behavior: 'smooth' })` no reduced-motion check.
  - `Header.tsx:497-510` — `@keyframes slideInRight/fadeInUp/fadeInDown` run unconditionally on drawer + dropdown.
- **Why it matters:** WCAG SC 2.3.3 (AAA). `framerMotionEntranceReducedMotion` quality-bar.
- **Effort:** S each, M total. Curve 1. Import `useReducedMotion` from framer-motion or gate manually on `window.matchMedia('(prefers-reduced-motion: reduce)')`.

### S-3 — Mobile drawer "(N) players trained" trust stat
- **Evidence:** `components/layout/Header.tsx:486-489` reads `<span class="font-medium text-brand-pacific-dusk">{siteStats.trustStats.playersCount}</span> players trained`.
- **Why it matters:** Aman / Four Seasons pattern is **heritage stat** ("Founded 2020 · Official City Partner") not consumer-grade volume metric. Per `aggregate-rating-invisible-only` + `google-reviews-cta-as-aman-substitute` learnings; per `2026-04-16-aman-standards-compound-learn.md`. Survivorship-gap finding from plan §13.6 — **confirmed still present.**
- **Effort:** S. Curve 1 to **execute** the swap, but Curve 2 on **what to swap to** (Andrew picks the stat).
- **Quick-win** once Andrew names the replacement.

### S-4 — Hero scroll-cue 44×44 fails LBTA 48 bar (passes WCAG)
- **Evidence:** `components/HomeHero.tsx:175-177` — `min-h-[44px] min-w-[44px]`.
- **Why it matters:** `.cursorrules` Part 6 is **48×48 minimum** (stricter than WCAG 2.5.5 AAA's 44).
- **Effort:** S. Curve 1. Bump to `min-h-[48px] min-w-[48px]` and possibly `p-2.5` to keep visual padding.

### S-5 — `region` landmark violation (SeasonBanner outside any landmark)
- **Evidence:** axe-core flags `region` rule on 10 of 11 pages. Selector `.text-sm > .font-headline.font-light` — "Spring 2026 Registration Open" banner text not contained in `<main>` / `<header>` / `<aside>` / `<footer>` / `<nav>` / `<section aria-label>` / `<region>`.
- **Effort:** S. Curve 1. Wrap SeasonBanner in `<aside aria-label="Season notice">` or move it inside the header element.

### S-6 — TrialBookingModal previous-focus race on rapid re-open
- **Evidence:** `TrialBookingModal.tsx:104-111` — `previousFocusRef.current = document.activeElement` captures the trigger element on open, restores on close. If a user rapidly closes + reopens with two different triggers, the second close restores to a stale node.
- **Effort:** M. Curve 1. Track previousFocus at `onClose` of the trigger button explicitly via a ref/state in the parent.
- Defer-flag: not confirmed-bug, defer to remediation cycle.

### S-7 — `text-brand-sunset-cliff` on white surfaces (orange-on-white contrast)
- **Evidence:** axe color-contrast flags `.bg-brand-sunset-cliff.tracking-wide.py-3` and `.text-brand-sunset-cliff` on `/junior-trial`, `/adult-trial`.
- **Why it matters:** Sunset Cliff is a brand-prestige accent (#E8834A). On white at 14px regular weight, contrast is typically ~3.5:1 — fails AA. cursorrules says "use Sunset Cliff sparingly" — the implementation seems to be using it for body-text-sized "Registration open" callouts.
- **Effort:** S. Curve 1. Replace with `text-brand-pacific-dusk` for the text + `bg-brand-sunset-cliff/10` for the accent surface, OR bump weight to bold + larger to pass the AA large-text bar (3:1).

### S-8 — `/pathway-planner` A11y Lighthouse score 89 (below 90 bar)
- **Evidence:** `lighthouse/pathway-planner.report.json` — A11y = 89. Critical failures: 3 unlabeled selects + heading-order. Fixing C-2 + S-1 will lift this above 90.
- **Effort:** Subsumed by C-2 + S-1.

---

## NICE-TO-HAVE (4)

### N-1 — `text-white/30` decorative pipe `|` on `/thank-you`
- **Evidence:** `app/thank-you/page.tsx:134` — `<span className="text-white/30">|</span>` between Program and Location pills.
- **Risk:** Borderline. /30 is below cursorrules' `text-white/40 forbidden` line but this is a single decorative character. Defer unless an a11y tool flags it.
- **Effort:** S. Curve 1.

### N-2 — `focus:ring` instead of `focus-visible:ring` in form inputs and some buttons
- **Evidence:** `TrialBookingModal.tsx:289` and others use `focus:outline-none focus:ring-2 focus:ring-black/20`. Per `focus-ring-instead-of-focus-visible` anti-pattern, modern code prefers `focus-visible` so the ring only fires on keyboard nav. Current behavior also fires on mouse click.
- **Effort:** S–M (touches many input classes). Curve 1.

### N-3 — Best-practices score 81 site-wide (Meta Pixel deprecation + dev-mode source maps)
- **Evidence:** `lighthouse/*.report.json` — `deprecations` flag on Facebook Pixel `connect.facebook.net/en_US/fbevents.js`; `valid-source-maps` likely production-fixed.
- **Effort:** L (Meta Pixel decision is a marketing/measurement call). Curve 2 — keep or remove Meta?
- Defer: re-test on production build before deciding.

### N-4 — Long-form coach bio chapter pacing on `/coaches/andrew-mateljan`
- **Evidence:** see gap-report F4. Currently long continuous prose; Aman / Belmond pattern is named chapters with full-bleed photography between.
- **Effort:** L. Curve 2. Andrew's voice decision.

---

## Bucket summary

| Bucket | Count | Quick-win (S/Curve 1) | Medium (M) | Strategic (L/Curve 2) |
|---|---:|---:|---:|---:|
| Critical | 4 | 3 | 1 | 0 |
| Should-fix | 8 | 6 | 2 | 0 |
| Nice-to-have | 4 | 2 | 0 | 2 |
| **Total** | **16** | **11** | **3** | **2** |

**11 Quick-wins are mechanically simple and would close the audit's "fail AA / fail cursorrules" claims in a single follow-up cycle.** Estimated effort: 1–2 days for an experienced engineer.

The two Strategic items live in `andrew-decisions.md`.

---

## Decision lenses — closing section

> Required by `.cursor/rules/decision-lenses.mdc` (decision OS) and the plan §13–§14. Applied here in summary.

### Curve check per major recommendation

- **Curve 1 (execute immediately, satisfice & ship):** C-1 (button-name), C-2 (select-name), C-3 (low-opacity contrast token swap, the *easy* path), C-4 (`/contact` CLS reserve-space fix), S-1 (Footer heading-order), S-2 (reduced-motion gates), S-3 (drawer trust-stat copy — *content* by Andrew, but *the swap* is mechanical), S-4 (hero scroll-cue 48px), S-5 (region landmark), S-7 (sunset-cliff contrast), N-1, N-2.
- **Curve 2 (Andrew decides):** C-3 brand-system v1.2 path (define a canonical secondary-text token vs. quick token-swap), F1 bottom-sheet refactor (Q2), F2 quiz reduction (Q1), F3 page-split (Q1), F4 chapter pacing (no Q yet), F5 StickyCTA-on-editorial-only (Q3), Q4 hero stack trim, N-3 Meta Pixel.

### Survivorship gap — what luxury competitors do on mobile that LBTA does not (≥ 2 required)

Verified during audit:

1. **Heritage stat instead of "(N) players trained"** — Aman / Four Seasons "Founded YYYY" pattern. Confirmed LBTA still ships the consumer-grade stat (`Header.tsx:486-489`).
2. **Editorial-page restraint on sticky CTA** — Aman / Belmond storytelling pages have no sticky CTA. LBTA's StickyCTA fires on every page past 400px scroll, regardless of editorial vs. transactional intent.
3. **Bottom-sheet booking on iOS** — Apple HIG's native idiom for mobile forms; LBTA uses a top-centered overlay modal.
4. **One CTA above the fold** — Aman / Edition mobile hero is one sentence + one underlined link. LBTA hero has 2 CTAs + a pricing-hint link + a scroll-cue.
5. **Chapter-paced long-form** — Belmond's "slow luxury" chapters with full-bleed photography; LBTA's `/about` and `/coaches/andrew-mateljan` are continuous long-form scrolls.

### Pre-mortem — top 3 ways this audit could be ignored

> Per plan §14. Required prevention names below.

1. **Quick wins ship in isolation; Curve-2 calls drift indefinitely.** Andrew skims the doc, commits the 11 quick-wins (engineering executes well), and the 5 Andrew-decision items rot in `andrew-decisions.md`. **Prevention:** the Andrew-decisions doc has explicit `Deadline` fields per question. Re-audit in 90 days asks "did each decision land?"
2. **Re-running production Lighthouse shows the dev-mode lab numbers were artifacts, so the audit looks alarmist.** Prevention: scorecard's §1 explicitly flags lab vs. field; **Andrew should run `npm run health:prod` and a real PageSpeed Insights pass against `lagunabeachtennisacademy.com`** before commissioning the perf-track fixes. If production scores are already ≥85, perf is not the issue; A11y / contrast are.
3. **A11y findings get triaged as "compliance" not "luxury."** A failure to read 4.44:1 contrast as a *luxury* problem (it makes the page feel cheap, not just non-compliant). Prevention: cite the **WCAG AAA 7:1 bar from cursorrules Part 6** as the bar Andrew chose — the brand's chosen standard, not a regulator's. A 4.44:1 inactive-season-tab on a luxury academy's pricing page = visible degradation of the brand promise.

---

## Acceptance gate status (vs. plan §10)

- [x] Every primary flow has an explicit audit pass (F1–F5 + cross-cutting elements covered in `gap-report.md`).
- [x] Every success-bar threshold tied to a tool (Lighthouse / axe / WebAIM / Playwright).
- [x] Tool commands runnable without further research (`scripts/audit/screenshot-sweep.mjs`, `scripts/audit/axe-sweep.mjs`, raw Lighthouse outputs in `lighthouse/`, raw axe JSON in `axe/`).
- [x] Findings template (scorecard table + 5-row gap-report card + Andrew-decisions doc).
- [x] Out-of-scope respected (no `app/` / `components/` / `lib/` modifications; only `docs/audits/2026-05/**`, `scripts/audit/**`, plan checkboxes).
- [x] Learnings from `.cursor/compound/learnings/` cited where they constrain audit (e.g. `pathwayPlannerNoSyntheticTuition` confirmed resolved, `footerContrast` confirmed holding).
- [x] Curve check applied per finding.
- [x] Survivorship gap (§ above) + pre-mortem (§ above) included.
- [x] Open questions for Andrew listed in `andrew-decisions.md` (5 questions, each with evidence + recommendation + impact-if-other-way).
- [x] Plan respects `.cursorrules` ship/done rules — no code changes claimed; "done" = scorecard + gap-report + findings + andrew-decisions + screenshots + harness committed.

**One acceptance item NOT yet closed:** the plan calls for `/compound:review` of the audit docs themselves before handing to Andrew. That's a follow-up step Andrew can run.
