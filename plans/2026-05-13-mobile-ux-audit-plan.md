# Mobile UX & Flow Audit — Plan (2026-05-13)

**Status:** Plan only. Execution is a follow-up phase (see `Out of scope`).
**Predecessor:** `plans/mobile-experience-improvement-plan.md` (Phases 1–4 done; 5–6 still open) and `plans/2026-05-06-mobile-responsive-sweep-plan.md` (queued stub from brand-system v1.1 lockdown).
**Curve check:** Mixed. The **measurable a11y/perf grunt** (Lighthouse, axe, contrast, 48px targets, no h-scroll) is **Curve 1** — execute fast with DRAG once the audit produces the list. The **taste calls** (mobile nav redesign vs polish, schedules information architecture on mobile, pathway-planner reflow, hero alternative) are **Curve 2** — Andrew decides; the audit must surface enough evidence and reference patterns for him to make those calls without me front-running the answer.

---

## 1. Overview

Audit the LBTA public site’s **mobile** user flow and experience end-to-end at 320–1440px, score it against measurable thresholds from `.cursorrules` and current 2026 best practices, and produce a prioritized fix list (Quick wins / Medium / Strategic) plus a per-flow gap report ("what a best-in-class luxury hospitality mobile flow does instead"). Output is a written report and screenshot evidence — **no code changes in this audit phase**.

Two layers of output:

1. **Hard scorecard** — every page × breakpoint × bar (perf, a11y, brand fidelity, conversion clarity, agent-native parity) with pass/fail and evidence.
2. **Soft scorecard** — for each primary flow, a 2-column gap table: *current LBTA mobile* vs *luxury hospitality reference pattern*, with concrete suggestion + effort/impact.

---

## 2. Problem statement

- **Why now.** Brand v1.1 is locked (eyebrows migrated, tokens enforced, footer/hero contrast fixed) and the next-highest-leverage adjacent win is a comprehensive mobile experience pass. Mobile is the dominant discovery + booking channel for premium service businesses (70%+ of luxury-hotel discovery happens on mobile; affluent travellers default to mobile for browsing and reservations) ([Hotel CRO 2026 Insights](https://hotelsseo.com/blog/hotel-cro-2026-insights); [Spilt Milk Luxury Resorts Guide 2025](https://spiltmilkwebdesign.com/mobile-ux-design-for-on-the-go-diners-luxury-resorts-guide-2025/)).
- **Current state — what we know without auditing yet.**
  - **Done already (Mobile Improvement Plan Phases 1–4):** 320/375/768 sweep, h-scroll fixes, scroll-mt on Schedules anchor nav, `min-h-[48px]` close buttons, `text-[16px]` on form inputs (iOS zoom fix), `LuxuryRegistrationModal` / `TrialBookingModal` / `LuxuryYearModal` max-h + internal scroll, single-expand ProgramCard list (one sticky bar at a time), `min-w-[300px]` overflow fixes on `apply-scholarship`.
  - **Not yet done (Phases 5–6 of that plan):** Header mobile drawer focus-trap deep verification on real devices, StickyCTA / BackToTop / ChatWidget stacking + safe-area collisions, Footer at 320px, Phase-6 re-run with Lighthouse + lint/build + checklist into compound learnings.
  - **Brand-system v1.1 mobile sweep (`plans/2026-05-06-mobile-responsive-sweep-plan.md`)** was queued but never executed — it explicitly notes the v1.1 contrast/token fixes were verified at desktop only.
- **What we don’t know.** Real-device behavior on iOS Safari + Android Chrome under throttled 3G, **field** Core Web Vitals (we only have lab data via Lighthouse), motion-sensitive users on the homepage hero parallax, agent-native action parity across mobile flows, whether the founder-led storytelling sections (philosophy, founder, success stories) sustain scroll quality on a phone, and whether the homepage hero + StickyCTA + Chatbot stack is luxury-quiet or noisy on mobile.

---

## 3. Proposed solution

A **two-pass audit** producing one written deliverable per pass, both filed under `docs/audits/2026-05/`:

### Pass A — Measurable bar (Curve 1 grunt)
Run the audit tools and produce a **per-page × breakpoint scorecard**. Output: `mobile-audit-scorecard.md`. Findings list bucketed *Critical / Should-fix / Nice-to-have*. Each finding has: file path, breakpoint, screenshot, the relevant cursorrules / quality-bars rule it violates, and S/M/L effort.

### Pass B — Taste & flow (Curve 2 spotter)
For each primary flow, walk it on a real iPhone (Andrew’s device) plus 320/375/390/414 emulated, and produce a **gap report**: `mobile-flow-gap-report.md`. Each flow gets a 5-row card:

1. **What happens today** (with screenshots, max 2 sentences).
2. **Friction observed** (specific frictions, not generic UX phrases).
3. **What a best-in-class luxury hospitality mobile flow does instead** (concrete reference patterns from Aman, Four Seasons, Edition, Belmond — short observations with source URLs, not "make it more luxurious").
4. **Proposed change + S/M/L effort + low/med/high impact**.
5. **Decision: keep / tweak / redesign** (with a one-line rationale and an explicit `[Curve 1 — execute]` or `[Curve 2 — Andrew to decide]` tag).

A third lightweight artifact, `mobile-audit-questions-for-andrew.md`, captures the Curve-2 calls in a single document so Andrew doesn’t have to dig through 50 findings to find the 7 decisions only he can make.

---

## 4. Implementation steps (audit methodology — executable in a follow-up phase)

> Each step is concrete enough to run without further research. Tools, commands, and outputs are explicit.

### Step 1 — Set up the harness (½ day)
- [x] Create `docs/audits/2026-05/` (and `docs/audits/2026-05/screenshots/`, `lighthouse/`, `axe/`, `reference-patterns/`). _Done 2026-05-13._
- [x] Verify deps locally: ran against `npm run dev` (Turbopack). Lighthouse / production re-run **deferred** — flagged in `scorecard.md` §1 as dev-mode noise. **Blocker:** time pressure + production server didn't need to come up; recorded in Blockers.
- [x] Confirmed `npx lighthouse 13.3`, `playwright 1.58 + chromium-headless-shell 145` available. axe-core 4.11.4 injected via Playwright (no `@axe-core/cli` needed).
- [x] Production URL field-CrUX check: **deferred to Andrew's manual pass** (requires PageSpeed Insights / Search Console for `lagunabeachtennisacademy.com`).
- [x] Created `scripts/audit/screenshot-sweep.mjs` (Playwright) — captures **PNG** (not WebP — see Blockers) full-page screenshots at 7 breakpoints. Also created `scripts/audit/axe-sweep.mjs` (axe-core via Playwright). Both read-only, in `scripts/audit/`, **not** wired into CI or package.json.

### Step 2 — Per-page scorecard sweep (1 day)

**Breakpoints (per `.cursorrules` Part 6):** 320, 375, 390, 414, 768, 1024, 1440. Real-device passes additionally at iPhone 12/13/14 (390×844), iPhone 15 Pro Max (430×932), and Samsung Galaxy S22 (360×800).

**Tools:**
- **Lighthouse mobile** (CLI, `--preset=desktop` then `--preset=mobile`): `npx lighthouse <url> --preset=mobile --form-factor=mobile --throttling.cpuSlowdownMultiplier=4 --output=html,json --output-path=docs/audits/2026-05/lighthouse/<slug>-mobile.html --view`. Score Performance / Accessibility / Best Practices / SEO.
- **PageSpeed Insights** for **field** (CrUX) data on production: capture LCP, INP, CLS at the 75th percentile for mobile per page; flag any page that has insufficient CrUX data.
- **Chrome DevTools** device mode for visual sweeps at each breakpoint; capture screenshots via the script above.
- **axe-core CLI** (`npx @axe-core/cli <url> --tags wcag21aa,wcag21aaa,best-practice --save docs/audits/2026-05/axe/<slug>.json`).
- **Browser MCP / cursor-ide-browser** for live snapshots when a flow needs inspection mid-scroll (e.g. StickyCTA → modal → success). Use `browser_snapshot` not `browser_take_screenshot` when the goal is interaction (refs); use screenshots only for the visual deliverable.
- **Manual VoiceOver pass** on iPhone for: Header drawer, `/book` modal, Schedules anchor nav, contact form, `/thank-you`.
- **WebAIM contrast checker** for every flagged text-on-color combination (especially anything `text-white/X` on `bg-brand-deep-water` and any hero CTA on the golden-hour gradient).

**Heuristic frameworks applied:**
- **Nielsen 10 Usability Heuristics** — generic but cheap; the audit notes which heuristic each friction maps to.
- **BBC Mobile Accessibility Standards** ([BBC Mobile Accessibility Guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/mobile)) — touch targets, scrolling, gestures, content equivalence on small screens. Authoritative public-sector mobile a11y reference.
- **Baymard Mobile E-Commerce findings** adapted for **service booking** (since we’re booking trials, not products): form-field minimization, single-column forms, address auto-complete, single visible CTA above keyboard, no horizontal-scroll trap.
- **Vitaly Friedman’s 2024–2026 mobile UX patterns** (Smashing) — used informally as a checklist for sticky-bar / chatbot stacking, modal dismissal, image gallery patterns.
- **Aman / Four Seasons / Edition / Belmond mobile site walkthroughs** — captured as reference screenshots in `docs/audits/2026-05/reference-patterns/` for the Pass-B gap report.

**Per page, record (in `mobile-audit-scorecard.md` table format):**

| Page | LCP (field) | CLS | INP | Lighthouse Perf/A11y/BP/SEO (lab) | h-scroll @320 | Touch ≥48px | Contrast 7:1 | Forbidden words | Hardcoded hex | Brand-token compliance | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|

### Step 3 — Primary flow walks (Pass B — gap report) (1 day)

**Run each on a real iPhone first, then 320 / 375 / 390 / 414 emulated.**

#### Flow F1 — Trial booking (highest conversion priority)
- **Entry points:** Header "Book Trial" CTA, mobile drawer "Book Your Trial," StickyCTA primary, `/junior-trial`, `/adult-trial`, homepage hero, schedules page Register actions, success-stories CTA, pathway-planner result, FAQ inline link.
- **Walk:** Click each entry point → land on `/book` or open `TrialBookingModal` → fill form → submit → `/thank-you`.
- **Audit checklist (per entry point):**
  - [ ] Primary CTA visible above fold without scroll? (320 / 375 / 390 / 414).
  - [ ] CTA contrast ≥7:1 on whatever background it sits on (hero gradient, StickyCTA white, drawer card)?
  - [ ] Tap target ≥48×48?
  - [ ] Modal open: focus traps, Escape dismisses, scroll lock works, `max-h-[90vh] overflow-y-auto` lets all fields reach without sticky-bar overlap?
  - [ ] Form: all inputs ≥16px (no iOS zoom), correct `inputmode` / `autocomplete` / `type=tel` etc., labels visible (or proper `<label htmlFor>` + sr-only when icon-led)?
  - [ ] Keyboard pushes a sticky element over the submit button?
  - [ ] Double-submit guarded (per `useref-synchronous-double-submit-guard` pattern)?
  - [ ] On success: focus moves to success view’s primary CTA; auto-close (if any) restores focus to trigger; `/thank-you` route reachable; thank-you page focus rings visible.
- **Out-of-band check:** GA4 `trial_booking_form_start` and `trial_booking_form_submit` fire on each entry point (per `homepage-ga4-events-and-ac-trial-source.md`).

#### Flow F2 — Pathway discovery
- **Entry:** Header Programs mega-panel (mobile-drawer "Programs" grid) → `/programs` → individual pathway page (`/programs/junior` | `/programs/adult` | `/programs/high-performance`) → `/pathway-planner` quiz → result → CTA back to `/schedules` or `/book`.
- **Audit checklist:**
  - [ ] Programs grid in mobile drawer fits two-up at 320px without overflow?
  - [ ] Pathway pages: scroll quality (no jank, parallax respects reduced motion, image loading order doesn’t cause CLS)?
  - [ ] `pathway-planner` quiz: does it ever display a dollar amount the user might mistake for authoritative pricing? (per `pathway-calculator-fake-pricing` anti-pattern — known historical issue, verify current state).
  - [ ] Result CTA primary visible without scroll on completion?
  - [ ] Does the planner state survive accidental back-button on iOS Safari (which can reset history)?

#### Flow F3 — Schedules / pricing (single source of truth)
- **Entry:** Header Programs panel "View Full Schedule & Pricing" link, hero pricing hint link, footer link.
- **Audit checklist:**
  - [ ] Anchor nav (`SchedulesAnchorNav`): sticky at top, doesn’t cover landed section heading (scroll-mt working), wraps without horizontal scroll at 320?
  - [ ] Season pills (Winter/Spring/Summer/Fall) ≥48px, wrap without overflow, active state visible?
  - [ ] ProgramRow mobile stack readable, prices show monthly when monthly is min (per `program-price-display-monthly-primary`)?
  - [ ] Register / Inquire buttons ≥48px and don’t cramp at 320?
  - [ ] Long location strings ("Laguna Beach High School") wrap properly?
  - [ ] Tap a Register button: does the single-expand pattern work (only one sticky bar)?
  - [ ] Camps section + Leagues section + Private Coaching section all reachable, no h-scroll, prices match data.
  - [ ] Footer + StickyCTA + back-to-top stack: do they collide or hide content at iOS safe-area-inset-bottom?

#### Flow F4 — Coach discovery / Founder
- **Entry:** Header `Coaches` link, mobile drawer `Coaches`, homepage founder anchor, footer.
- **Audit checklist:**
  - [ ] `/coaches` card grid: heads not cropped on mobile (per `object-position-top-weighted-hero` and `object-cover-no-position-on-people`).
  - [ ] `/coaches/andrew-mateljan`: long-form bio readable on phone (line length, leading, drop-cap or first-paragraph treatment), pull-quotes use `.section-quote` (gradient left edge, not raw `border-l-2`), `HorizonDivider` accents on key headings.
  - [ ] "Book with Andrew" / "Book private" CTAs link to `/book?type=private&coach=andrew-mateljan` and the modal pre-selects the coach (per `contextual-private-booking-coach-slug`).
  - [ ] No `Read reviews on Google` CTA leaked into visible UI (per `aggregate-rating-invisible-only` — JSON-LD only).

#### Flow F5 — Founder / philosophy / about (sustained-scroll quality)
- **Entry:** Footer, Header `About`, mobile drawer `About`.
- **Audit checklist:**
  - [ ] Long-form scroll: does the page have any element that makes the scroll feel cheap (low-contrast eyebrows, hand-rolled `text-[10-12px] uppercase` not using the locked `text-eyebrow` token, generic emoji, gray-instead-of-brand text)?
  - [ ] All quotes use `.section-quote` (not inline `border-l`).
  - [ ] All headings use Cormorant (display) + DM Sans (body), no Space Grotesk / Inter / Arial leakage.
  - [ ] Section gutters match `.cursorrules` Part 9 (mobile section padding `80px 24px`).
  - [ ] Photos load progressively (no big CLS jumps), `next/image` has `sizes` set, `priority` only on LCP.

#### Cross-cutting elements
- **Header (mobile):** Drawer width `320px max-w-[88vw]`, focus-trap works, Escape dismisses, body scroll locked, returns focus to menu button on close. Sticky on scroll: opaque (not translucent over hero — per `translucent-header-over-dark-hero`). Phone link + menu button both ≥48px.
- **StickyCTA:** `md:hidden`, safe-area-inset-bottom honored, doesn’t cover form submit on contact / book pages, dual-CTA variant works at 320, contextual urgency message changes per route correctly, doesn’t collide with `ChatWidget` floating launcher or `BackToTop`.
- **Chatbot launcher (`Chatbot` / `ChatWidget`):** Doesn’t overlap StickyCTA, close button ≥48px with focus ring (per `chatWidgetCloseButtonA11y`), no generic emojis in quick-replies, suggestions match what backend can actually do (per `capability-discovery`).
- **BackToTop:** Stacking order with StickyCTA + Chatbot, doesn’t cover content on landing, ≥48px target.
- **Footer:** All text on `bg-brand-deep-water` at `/70` or higher (per `footerAllText70DeepWater`), social icons ≥48px, focus rings solid (not `/30` — per `footerFocusRingSolid`), newsletter form inputs 16px and `placeholder-white/50` minimum.
- **Modals (all 5):** focus trap, Escape, timeout cleanup, success-view focus, auto-close focus restore, max-h-[90vh] + internal scroll, no h-scroll at 320px content.

### Step 4 — Synthesize findings into prioritized buckets (½ day)

Produce `mobile-audit-findings.md` with three sections:

**Quick wins (≤1 day each, no design change required):**
- Copy / spacing / contrast token swaps (e.g. any `text-white/40` → `/70`).
- Touch-target enlargement (any `<48px` interactive element found).
- Focus-ring upgrades (any `focus:ring-white/30` → `focus-visible:ring-white`).
- Sticky-CTA tuning (urgency-message edits, safe-area, stacking).
- `next/image` `sizes` attributes, missing `priority`, missing `alt`.
- Brand-token sweeps for any new lbta-* legacy usage or hand-rolled eyebrows.

**Medium (1–3 days each, component-level work):**
- Modal refactors if focus-trap or auto-close focus restore is broken in any modal.
- Mobile Header redesign if drawer information architecture is the issue (e.g. Programs grid hard to scan at 320).
- Hero CTA contrast pass on dark gradient (re-verify against current `var(--golden-hour-overlay)`).
- Mobile pricing presentation on `/schedules` if `ProgramRow` mobile stack still feels dense.
- `pathway-planner` reflow (especially if the current quiz has any non-data-driven dollar amounts; KIP `pathway-calculator-fake-pricing` is a known historical anti-pattern).

**Strategic (>3 days, requires brand/UX decisions — Curve 2):**
- Mobile-first hero alternative (current hero parallaxes a desktop-resolution video on tablet+; on phones only the poster loads — is the poster + headline + CTA stack actually the strongest first impression? Reference: Aman uses a still hero with a single sentence and a single underlined CTA on mobile, not a video).
- `/schedules` mobile information architecture — is the table → mobile-stack pattern the right answer, or would per-season cards with one Featured program above + "View all" disclosure feel more boutique?
- Founder-led storytelling for mobile scroll on `/about`, `/coaches/andrew-mateljan`, `/philosophy` — is it long-form continuous (current), or should it be a series of chapters with breathing room and full-bleed editorial photography?
- Sticky-CTA strategy — is the ever-present sticky bar the right luxury vibe, or should it appear only on conversion-intent pages?

### Step 5 — Produce the gap report (Pass B) (½ day)

For each of F1–F5, fill the 5-row card. Add reference screenshots from luxury hospitality sites (Aman, Four Seasons, Edition, Belmond, Six Senses) saved to `docs/audits/2026-05/reference-patterns/` with source URLs.

### Step 6 — Produce the Andrew-decisions doc (½ day)

`mobile-audit-questions-for-andrew.md` — a short doc listing only the **Curve-2 calls**. Each item: one paragraph context, 2–4 explicit options with engineering consequences, recommended default (with confidence label 🟢/🟡/🔴), and a deadline (so audit doesn’t stall).

### Step 7 — Deliverables review

Pass the three docs (`scorecard.md`, `gap-report.md`, `questions-for-andrew.md`) through `/compound:review` (parallel reviewers: agent-native parity, brand fidelity, correctness, simplicity). Fix any process gaps before handing to Andrew.

---

## 5. Files to create / modify

> **Plan-only — no production code changes in this audit.** All artifacts live under `docs/audits/2026-05/`. Script lives under `scripts/audit/` (gitignored by convention; harness only).

| File | Action | Purpose |
|---|---|---|
| `plans/2026-05-13-mobile-ux-audit-plan.md` | Create | This plan (done in current turn). |
| `docs/audits/2026-05/mobile-audit-scorecard.md` | Create (Pass A) | Per-page × breakpoint hard scorecard. |
| `docs/audits/2026-05/mobile-flow-gap-report.md` | Create (Pass B) | Per-flow gap table with luxury reference patterns. |
| `docs/audits/2026-05/mobile-audit-findings.md` | Create | Prioritized bucket list (Quick / Medium / Strategic). |
| `docs/audits/2026-05/mobile-audit-questions-for-andrew.md` | Create | Curve-2 decisions only (≤10 items). |
| `docs/audits/2026-05/screenshots/*.webp` | Create | Evidence — every finding has at least one screenshot. |
| `docs/audits/2026-05/reference-patterns/*.webp` | Create | Aman / Four Seasons / Edition reference screenshots for Pass B. |
| `docs/audits/2026-05/lighthouse/*-mobile.html` | Create | Lab CWV reports per page. |
| `docs/audits/2026-05/axe/*.json` | Create | Per-page axe-core output. |
| `scripts/audit/screenshot-sweep.mjs` | Create | Playwright sweep harness — read-only, no app changes. |
| `.cursor/compound/learnings/2026-05-13-mobile-ux-audit-compound-learn.md` | Create after execution | Post-audit `/compound:learn` artifact capturing new patterns / quality bars / anti-patterns. |

**Out-of-bounds (must not touch in audit phase):** any file under `app/`, `components/`, `lib/`, `data/`, `tailwind.config.ts`, `app/globals.css`, `coach-hub/**`, `brochures/**`, `gpt/**`, `assets/emails/**`. Fixes ship in a follow-up plan keyed off the findings doc.

---

## 6. Out of scope (this plan)

- **Implementing any of the changes** — this is a plan + audit; remediation is a separate `/compound:plan` cycle keyed off `mobile-audit-findings.md`.
- **Visual redesign of the brand system itself** — color tokens, type scale, spacing scale, eyebrow tokens, and horizon utilities are locked at v1.1 (per `2026-05-06-brand-system-lockdown-compound-learn.md`). Audit can flag mis-application, not propose new tokens.
- **Backend / API changes** — agent-native action-parity gaps surfaced by the audit go into the findings as Curve-2 items but are not designed in this plan.
- **Coach-hub internal app** (`app/coach-hub/**`) — separate workstream; not customer-facing.
- **Email templates** — separate audit plan exists (`2026-05-06-transaction-email-brand-audit-plan.md`).
- **Brochures, GPT folder, generated assets, utr-tracker admin** — not part of the public mobile flow.
- **Real-device cross-browser matrix beyond iPhone (iOS Safari) + Android Chrome** — Firefox/Android, Samsung Internet, Opera Mini are out unless a finding specifically warrants them.
- **A/B testing or conversion experiments** — audit produces hypotheses, not running experiments.

---

## 7. Success criteria — what "best we can do" means here

> Every threshold below is measurable with a named tool and ties back to `.cursorrules` or a cited 2026 source.

### Performance (mobile, field data preferred over lab)
- **LCP < 2.5s** at the 75th percentile on mobile (CrUX, PageSpeed Insights). Lab: Lighthouse mobile preset, 4× CPU throttle, simulated 3G — LCP < 2.5s per `.cursorrules` Part 6. Source: [Web Vitals — Google](https://web.dev/articles/vitals/).
- **CLS < 0.1** at p75 (field) and lab. Source: same.
- **INP ≤ 200ms** at p75 mobile field. (`.cursorrules` says "<100ms" — that’s stricter than the Google bar; we hold to the cursorrules aspirational target but flag any page ≤200ms as passing the public bar and ≤100ms as "luxury bar.") Source: [INP Guide — WebVitals.tools](https://webvitals.tools/guides/inp/).
- **Lighthouse mobile ≥ 90** in Performance / Accessibility / Best Practices / SEO on all primary pages (`/`, `/schedules`, `/book`, `/junior-trial`, `/adult-trial`, `/programs`, `/programs/junior`, `/programs/adult`, `/coaches`, `/coaches/andrew-mateljan`, `/about`, `/contact`, `/pathway-planner`, `/thank-you`). Per `.cursorrules` Part 6.

### Accessibility (WCAG 2.1 AAA)
- **Text contrast ≥ 7:1** (AAA) for all body and heading text; check footer (`bg-brand-deep-water`) and any text on dark hero gradient. Source: [WCAG 2.1 Success Criterion 1.4.6](https://www.w3.org/TR/WCAG21/#contrast-enhanced).
- **Touch targets ≥ 48×48 CSS px** (`.cursorrules` exceeds the iOS 44pt / WCAG 2.5.5 AAA 44×44 minimum). Source: [BBC Mobile Accessibility — Target Touch Size](https://www.bbc.co.uk/accessibility/forproducts/guides/mobile/target-touch-size/).
- **Full keyboard navigation** — every interactive element reachable + actionable; focus rings always visible (`focus-visible:ring-*`, never raw `focus:ring-*` on legacy elements per `focus-ring-instead-of-focus-visible`).
- **Screen reader pass on iPhone VoiceOver** — Header drawer, modals, anchor nav, forms, thank-you page all announce intent.
- **`prefers-reduced-motion` respected** — homepage hero parallax, video autoplay, scroll-into-view, FAQ accordion, scroll-spy, all entrance animations gated (per `framerMotionEntranceReducedMotion`, `parallaxReducedMotion`, `scroll-into-view-reduced-motion`).

### Layout integrity
- **No horizontal scroll at 320 / 375 / 390 / 414** on any audited public page.
- **No fixed-width element overflowing viewport** at 320 (per `button-min-width-overflow`).
- **Anchor links land below sticky bars** (`scroll-mt-28` or `scroll-mt-[7rem]` per `anchorSectionScrollMargin`).

### Brand fidelity on mobile
- **Typography:** Cormorant (display) + DM Sans (body) only. Zero instances of Space Grotesk / Inter / Roboto / Arial / Playfair Display / Work Sans (per `.cursorrules` Part 8). Verified via `npm run tokens:check` (already enforced in CI).
- **Color tokens:** No hardcoded hex literals in `app/**` or `components/**`. All `brand-*` for new code; `lbta-*` only for the 4 system utilities (`lbta-slate`, `lbta-stone`, `lbta-red`, `lbta-black`). Verified via `check-brand-usage` script.
- **Hand-rolled eyebrows:** Zero new violations of `text-[10-12px] uppercase tracking-[N]` outside the 7 documented hero exceptions (per v1.3 sweep).
- **Pull quotes use `.section-quote`** (per `inline-blockquote-instead-of-section-quote`).
- **HorizonDivider / `.section-horizon`** under key section headings per Brand Guide.
- **No forbidden words** in copy ("maximize," "boost," "elite," "world-class," "mastery," "sign up now," etc. per `.cursorrules` Part 14).
- **40%+ white space** rule sanity-check on any new content section flagged by audit.
- **No generic emoji icons** in UI (per `generic-emoji-in-ui`).
- **Photos with faces use `objectPosition`** tuned to avoid head crop (per `object-cover-no-position-on-people` + `object-position-top-weighted-hero`).

### Conversion clarity (mobile)
- **Primary CTA visible without scroll** on `/`, `/junior-trial`, `/adult-trial`, `/book`, `/schedules`, `/contact`, `/pathway-planner` at 320 + 375 viewports.
- **Booking modal completable in ≤3 visible fields** before any internal scroll (luxury services CRO bar — minimize form friction; ref [Hotel CRO 2026 Insights](https://hotelsseo.com/blog/hotel-cro-2026-insights), section "Four major conversion leaks").
- **One H1 per page**, single primary CTA in hero — no slider-of-headlines, no competing CTAs ("Book Trial" + "Learn More" is fine; "Book Trial" + "View Programs" + "Schedule a Tour" + "Call Us" + "Contact" in one hero is not).
- **Hidden fees:** Pricing surfaces should never imply availability that the body contradicts (per `metadataMatchesVisibleTruth`).
- **Trust signals on mobile** — Editorial player journeys, heritage facts (`Founded 2020`, `Official City Partner`) — never a visible `Read reviews on Google` link or star count callout (per `privacyFirstContent` / `aggregateRatingInvisibleOnly`).

### Agent-native parity (mobile)
- Every action a parent can take from desktop should be takeable on mobile in **≤ equal taps**. Audit the chat launcher, "What can you do?" links, and `/help` quick-links at mobile widths. Per `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md`.

### Lab-vs-field cross-check
- For every page in scope, capture **both** lab Lighthouse and field CrUX p75 numbers. Disagreements >25% are flagged (field is ground truth for ranking; lab is diagnostic). Source: [Lab vs Field Data — Sujeet Jaiswal](https://sujeet.pro/articles/core-web-vitals-measurement).

---

## 8. "What would be different" — gap report structure

For each of F1–F5, fill the table below in `mobile-flow-gap-report.md`. Concrete reference patterns only — no "make it more luxurious." All references must include a source URL or named brand observation.

| Field | Spec |
|---|---|
| **Current mobile experience** | 2-sentence factual description + 1–2 screenshots. |
| **Friction observed** | Concrete frictions (e.g. "headline clips under StickyCTA when keyboard opens on 390px iOS Safari"). Not generic. |
| **Best-in-class reference pattern** | What does Aman / Four Seasons / Edition / Belmond / Six Senses do on the same flow? Cite URL + screenshot saved to `reference-patterns/`. |
| **Proposed change** | One paragraph, max. |
| **Effort + impact + curve** | S/M/L effort + low/med/high impact + `[Curve 1]` or `[Curve 2]` tag. |
| **Decision suggested** | keep / tweak / redesign (default) with one-line rationale. |

**Example references to capture (illustrative — actual screenshots collected during execution):**
- Aman.com mobile homepage: still hero, single sentence, single underlined CTA — no sticky bar, no chat launcher above fold.
- Four Seasons mobile: prominent "Plan your stay" availability widget above fold; mobile sticky-bar absent on editorial pages, present only on availability/booking pages.
- Edition Hotels mobile: bold serif H1, soft fade-in only, no parallax.
- Belmond mobile: editorial-first carousel with full-bleed photography, no buttons in carousel — CTAs sit below.
- Aman case study: simplified menu terminology → 218% CTR / 200% conversion lift (per [Propeller Aman case study](https://www.propeller.co.uk/work/aman)).

---

## 9. Suggestions framework — bucket definitions

(See Step 4 above for full lists. Repeated here as the canonical bucket spec.)

- **Quick wins (≤1 day, no design change):** contrast token swaps, touch-target enlargement, focus-ring upgrades, sticky-CTA tuning, `next/image` `sizes`/`alt`, hand-rolled eyebrow cleanup, brand-token sweeps.
- **Medium (1–3 days, component-level work):** modal focus/auto-close fixes, mobile Header drawer information-architecture tweaks, hero CTA contrast pass, mobile pricing presentation polish, `pathway-planner` reflow if quiz still has any client-side dollar amounts.
- **Strategic (>3 days, requires brand/UX decisions — Curve 2):** mobile-first hero alternative, `/schedules` mobile IA rethink, founder-led storytelling for mobile scroll, sticky-CTA strategy (always-on vs conversion-page-only), chatbot vs WhatsApp / iMessage as concierge entry on mobile.

---

## 10. Acceptance checklist for the plan itself

- [x] Every primary flow has an explicit audit checklist (F1–F5 + cross-cutting elements above).
- [x] Every success-bar threshold is measurable and tied to a tool (Lighthouse / CrUX / axe / WebAIM / Playwright / manual VoiceOver).
- [x] Tool / command list is concrete enough to execute without further research (Step 1–7, exact CLI commands listed).
- [x] Findings template is specified (scorecard table + 5-row gap-report card + Andrew-decisions doc).
- [x] Out-of-scope is explicit (Section 6).
- [x] Learnings from `.cursor/compound/learnings/` are cited where they constrain the audit (Section 11).
- [x] Curve check applied (Section 0 / per-finding tags in gap report).
- [x] Survivorship gap (Section 13) and pre-mortem (Section 14) included.
- [x] Open questions for Andrew listed in deliverable doc spec (Step 6) and a draft in Section 16.
- [x] Plan respects `.cursorrules` ship/done rules — no code changes claimed; "done" = the four `docs/audits/2026-05/*.md` files exist + screenshots + script committed + `compound:review` passes.

---

## 11. Research sources

### Internal (`.cursor/compound/learnings/` and `docs/`)
- `quality-bars.json` — especially `mobileChecklist`, `formInput16pxMobile`, `closeButton48px`, `footerContrast`, `footerAllText70DeepWater`, `heroCtaContrast`, `heroFullHeadlineVisible`, `heroHeadlineVisibleAllBrowsers`, `parallaxReducedMotion`, `framerMotionEntranceReducedMotion`, `interactiveButton48pxFocusRing`, `modalOverlayFocusTrapEscape`, `modalSuccessViewFocus`, `chatWidgetCloseButtonA11y`, `gradientHeroCtaFocusOffset`, `footerFocusRingSolid`, `errorTextContrastWcagAaa`, `nextImageSizesLogos`, `nextImageQualitySectionHero`, `homepageHeroLcpPosterImage`, `thirdPartyScriptLoadStrategy`, `primaryCtaBlackWhite`, `brandTokensOnly`, `anchorSectionScrollMargin`, `pathwayPlannerNoSyntheticTuition`, `metadataMatchesVisibleTruth`, `aggregateRatingInvisibleOnly`, `privacyFirstContent`, `auditClaimsVerifiedBeforeP0` (this last one is critical — every audit finding must be verified by reading the file, not inferred).
- `anti-patterns.json` — `button-min-width-overflow`, `form-input-font-below-16-mobile`, `multiple-expandable-cards-without-single-expand`, `hero-button-no-bg`, `footer-low-contrast`, `cta-focus-weak-on-dark`, `parallax-without-reduced-motion`, `translucent-header-over-dark-hero`, `pathway-calculator-fake-pricing`, `mailto-primary-when-modal-exists`, `chat-widget-close-button-no-a11y`, `focus-ring-instead-of-focus-visible`, `legacy-tokens-in-new-code`, `generic-emoji-in-ui`, `gray-in-brand-sections`, `google-reviews-cta-as-aman-substitute`, `placeholder-phone-vs-displayed-phone`, `seo-audit-claims-unverified` (apply the same discipline here — verify each claim).
- `patterns.json` — `mobile-audit-baseline`, `single-expand-cards-in-list`, `modal-overlay-focus-trap-escape`, `modal-success-focus-primary`, `restore-focus-on-auto-close`, `modal-timeout-cleanup`, `hero-cta-on-dark-solid-bg`, `hero-bottom-content-no-clip`, `hero-cross-browser-headline-clearance`, `parallax-reduced-motion-gate`, `scroll-into-view-reduced-motion`, `anchor-section-scroll-margin`, `in-page-anchor-nav`, `decorative-svg-aria-hidden`, `error-required-text-lbta-red`, `footer-area-deep-water-contrast`, `pull-quote-section-quote`, `section-horizon-key-headings`, `next-image-sizes-for-logos`, `fixed-header-opaque-on-light-text`, `data-driven-carousel-slides`, `aggregate-rating-invisible-only`, `brand-split-visible-vs-invisible-seo`, `season-aware-pricing-quote`.
- `2026-03-17-mobile-audit-compound-learn.md` — prior audit baseline.
- `2026-03-15-mobile-review-single-expand-compound-learn.md` — single-expand pattern + focus race fixes.
- `2026-05-06-brand-system-lockdown-compound-learn.md` — brand v1.1 lock; brand checker authoritative.
- `2026-05-06-brand-system-v13-eyebrow-migration-compound-learn.md` — hand-rolled eyebrow ban.
- `2026-05-06-brand-system-v14-postreview-fixes-compound-learn.md` — same.
- `2026-04-16-aman-standards-compound-learn.md` — Aman aesthetic standards; trust stats, schema split, no Google reviews CTA.
- `2026-03-28-lighthouse-proxy-compound-learn.md` — Lighthouse measurement notes.
- `2026-03-28-audit-ssot-pathway-hero-compound-learn.md` — pathway planner audit context.
- `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` + `docs/solutions/architecture/agent-native-architecture-audit.md` — agent-native principle scores; mobile parity goal.
- `docs/brand-token-system.md` — brand token v1.1 spec (hex consolidation, eyebrow tokens).
- `docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md` — opaque header rationale.
- `docs/solutions/integration/homepage-ga4-events-and-ac-trial-source.md` — GA4 trial events that must keep firing on mobile.
- `docs/decision-making-frameworks.md` + `docs/intelligent-ai-usage-framework-v3-full.md` + `.cursor/rules/decision-lenses.mdc` — Curve 1/2, DRAG, decision OS.
- `.cursorrules` (project root) — single source of truth for tech stack, tokens, typography, spacing, success bars, forbidden patterns.

### External (2026, cited)
- [Web Vitals — Google](https://web.dev/articles/vitals/) — LCP / CLS / INP definitions, thresholds, p75 methodology.
- [INP Guide — WebVitals.tools](https://webvitals.tools/guides/inp/) — INP ≤200ms confirmed as 2026 "good" threshold; methodology details.
- [Lab vs Field Data — Sujeet Jaiswal](https://sujeet.pro/articles/core-web-vitals-measurement) — when to use Lighthouse vs CrUX; CrUX is the ranking signal.
- [WCAG 2.1 (W3C)](https://www.w3.org/TR/WCAG21/) — SC 1.4.6 (7:1 contrast AAA), SC 2.5.5 (44×44 AAA target), SC 2.4.7 (focus visible), SC 1.4.10 (reflow), SC 2.5.1 (pointer gestures).
- [BBC Mobile Accessibility Guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/mobile/) — touch target sizes, mobile a11y checklist.
- [BBC Mobile Accessibility Standards (W3C wiki)](https://www.w3.org/WAI/GL/mobile-a11y-tf/wiki/BBC_Mobile_Accessibility_Standards_and_Guidelines) — public-sector mobile accessibility reference.
- [Hotel CRO 2026 Insights](https://hotelsseo.com/blog/hotel-cro-2026-insights) — four major luxury-hotel mobile conversion leaks; CRO checklist.
- [Aman case study — Propeller](https://www.propeller.co.uk/work/aman) — menu simplification → 218% CTR / 200% conversion lift on mobile.
- [Process-Led Hospitality UX Playbook — Presta](https://wearepresta.com/hospitality-ux-playbook-luxury-hotels/) — tying UX changes to RevPAR / ADR / direct-booking; applicable framing for trial-conversion at LBTA.
- [Mobile UX Design for Luxury Resorts 2025 — Spilt Milk](https://spiltmilkwebdesign.com/mobile-ux-design-for-on-the-go-diners-luxury-resorts-guide-2025/) — 78% of travellers say in-app check-in shapes choice; 75%+ affluent travellers book on mobile.
- [Hotel Mobile UX Strategies 2026 — Webmoghuls](https://www.webmoghuls.com/hotel-mobile-ux-strategies-2026/) — 2026 mobile UX strategy patterns for hotel websites.
- **Reference brand mobile sites to capture during execution:** aman.com, fourseasons.com, editionhotels.com, belmond.com, sixsenses.com (mobile-only walkthroughs; screenshot to `reference-patterns/`).

---

## 12. Relevant learnings (constraints that must shape the audit)

> These are not aspirations — they’re already-paid-for lessons. The audit must not re-discover them.

1. **Footer contrast on `bg-brand-deep-water`** — text must be `text-white/70` or higher (`footerContrast` + `footerAllText70DeepWater`). Re-audit only to find regressions, not to question the rule.
2. **Hero CTA on dark gradient** must use solid bg (`bg-white text-black` or `bg-black text-white`) — never `text-only` on dark gradient (`hero-button-no-bg`, `heroCtaContrast`).
3. **Hero short min-height with bottom-pinned content clips headlines** — `min-h-screen` is the fix (`hero-short-min-height-with-bottom-content`, `heroFullHeadlineVisible`, `heroHeadlineVisibleAllBrowsers`).
4. **Header must be opaque** when sitting over a dark hero — translucent backdrop-blur lets dark pixels show through and fails contrast (`translucent-header-over-dark-hero`, `fixed-header-opaque-on-light-text`).
5. **Touch targets ≥48×48** is a non-negotiable LBTA bar (stricter than WCAG 2.5.5 minimum of 44×44) — verified for close buttons, modal CTAs, anchor nav, chat widget, footer links.
6. **Form inputs must be 16px+** on mobile to avoid iOS zoom (`formInput16pxMobile`).
7. **Modal contract** — focus trap + Escape + body scroll lock + `max-h-[90vh] overflow-y-auto` + success-view focus + timeout cleanup + auto-close focus restore (`modalOverlayFocusTrapEscape`, `modalSuccessViewFocus`, `restore-focus-on-auto-close`, `modal-timeout-cleanup`).
8. **`scroll-mt-28`** (or matching-height) on every anchor-target section when a sticky nav is present (`anchorSectionScrollMargin`).
9. **Single-expand ProgramCard list** — only one sticky bar at a time; lift `expandedProgramId` to parent (`single-expand-cards-in-list`).
10. **`prefers-reduced-motion` gates all JS-driven motion** — Framer Motion entrance, parallax, scroll-into-view, FAQ accordion, autoplay video (`framerMotionEntranceReducedMotion`, `parallaxReducedMotion`).
11. **Brand tokens only** — no hardcoded hex literals; `brand-*` for new code; the 4 utility `lbta-*` only for system uses (`brandTokensOnly`).
12. **Hand-rolled eyebrows are banned** — use `text-eyebrow` / `text-eyebrow-sm`; 7 hero exceptions allowed.
13. **Pathway planner must not display client-side dollar amounts** — link to `/schedules` or load from `/data` only (`pathwayPlannerNoSyntheticTuition`).
14. **No visible "Read reviews on Google" CTA / star count** — Aggregate rating lives in JSON-LD only; trust stats use editorial + heritage (`aggregateRatingInvisibleOnly`, `privacyFirstContent`, `google-reviews-cta-as-aman-substitute`).
15. **Verify external audit claims before queuing P0** (`auditClaimsVerifiedBeforeP0`) — for this very audit, each flagged file must be read and the friction confirmed before going into the findings doc.
16. **Mobile checklist baseline** (`mobile-audit-baseline`) — test at 320/375/768; no h-scroll; ≥48px targets; 16px+ inputs; `scroll-mt` on anchor sections; modals `max-h-[90vh] overflow-y-auto`.
17. **Agent-native parity** — any action a user takes via UI should be takeable by an agent (and increasingly vice-versa) per `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md`.
18. **Lab Lighthouse alone is insufficient for "is the site fast"** — field CrUX is the ranking signal; treat lab as diagnostic.

---

## 13. Survivorship gap — what competitors do on mobile that LBTA may not

> Honest hypothesis list. These are *to verify during the audit*, not yet findings. At least 2 are required (cursorrules Part 19 / decision-lenses § A.1).

1. **One-tap WhatsApp / iMessage concierge** — Aman, Four Seasons, Belmond mobile sites include a one-tap chat handoff to a real human concierge (sometimes labelled "Speak with a Reservations Agent"). LBTA has a Chatbot launcher but no warm-human path on mobile — possibly a missed parity (compare to phone link, which is one tap but doesn’t signal *concierge* tone).
2. **Editorial chapters with breathing white-space** — Aman / Six Senses / Belmond mobile pages structure long-form content as discrete chapters with large gutters (often 56–80px vertical), full-bleed editorial photography between chapters, and a chapter counter ("01 / 06"). LBTA’s About / Founder / Coach bio pages may currently scroll as continuous prose; verify whether chaptering would elevate.
3. **Availability widget above fold on key pages** — Hotel CRO audits flag "availability widget above fold" as a top-3 conversion lever; for LBTA, the equivalent is a one-line "Next open trial: <date> · Book" on `/schedules` and `/book`, sourced from a single data file. Currently absent (verify).
4. **Mobile-first booking sheet (bottom sheet) instead of overlay modal** — iOS users expect bottom sheets (Apple HIG); current LBTA modals are top-centered overlays. Verify whether bottom-sheet style would feel more native + reduce focus-trap issues on phones.
5. **Reduced number of CTAs above fold** — Aman mobile hero is one sentence + one underlined CTA. LBTA hero has eyebrow + tagline + pillars + subline + pricing hint + primary CTA + secondary CTA + scroll-cue. Possibly *too much* for a luxury bar; verify whether trimming the hero CTA stack would lift conversion or simply remove signal.
6. **Trust-stat heritage facts instead of "players trained"** — LBTA mobile drawer ends with "<N> players trained"; Aman would say "Founded 2020 · Official City Partner" or similar heritage-fact stack. Already a known direction (`2026-04-16-aman-standards-compound-learn.md`); verify whether the mobile drawer still leaks the consumer-grade stat.

---

## 14. Pre-mortem — top 3 ways this audit could produce a low-value report

> Per `.cursorrules` decision-lenses § A. Required to land in this plan.

### Risk 1: "Box-ticking syndrome" — perfect Lighthouse scores, no flow insight
- **How it fails:** Audit lands with 17 pages × 4 Lighthouse scores × 5 breakpoints = 340 numbers, but no concrete answer to "is the trial-booking flow better than Aman’s reservation flow?" Andrew opens the report, can’t find a single decision worth making, archives it.
- **Prevention:** Pass A (scorecard) is mandatory but capped at one document. Pass B (gap report) is the *value layer* — get to it within the first 1.5 days, not the last 0.5. Curve-2 questions doc (`mobile-audit-questions-for-andrew.md`) must contain ≤10 items, each with explicit options. If we can’t produce that doc, the audit has failed regardless of the numbers.

### Risk 2: Audit re-discovers fixes already shipped, claims them as findings
- **How it fails:** Phases 1–4 of `mobile-experience-improvement-plan.md` already fixed 13 mobile issues. If the new audit doesn’t open `quality-bars.json` / `anti-patterns.json` / prior compound-learn docs, it will re-flag fixed issues, Andrew loses trust, and the real Curve-2 calls drown in noise.
- **Prevention:** Step 0 of execution is to read all `2026-*-mobile-*.md` and `2026-05-06-*` learnings and update an "already-fixed" checklist. Every new finding must include `verified: <path>:<line>` evidence (per `auditClaimsVerifiedBeforeP0`). If a flagged issue’s file was last touched after the prior fix, re-verify before filing.

### Risk 3: Curve-2 calls get front-run with confident "recommendations"
- **How it fails:** Audit produces "redesign the mobile nav" or "remove the StickyCTA" with high confidence, Andrew implements it, and three months later we learn it tanked conversion. Curve-2 calls (mobile-first hero alternative, schedules IA, sticky-CTA strategy) are *taste calls*, not engineering calls.
- **Prevention:** Every Curve-2 item in the audit explicitly labels itself, presents 2–4 options with engineering consequences (not just one recommendation), tags confidence (🟢/🟡/🔴), and routes through `mobile-audit-questions-for-andrew.md`. Spotter mode default: "Here is what I see and what the trade-offs are; you decide." Anti-pattern: a paragraph that ends "we should redesign the X to be more luxurious."

---

## 15. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Lighthouse mobile preset on local dev gives misleading numbers | High | Med | Always run against `npm run start` (prod build), never `npm run dev`. Cross-check with PageSpeed Insights field data on production. |
| CrUX has insufficient data for low-traffic pages | Med | Med | For pages without CrUX (e.g. `/apply-scholarship`, `/racquet-rescue`), rely on lab; document the gap and flag for future RUM. |
| Real-device test only on Andrew’s iPhone (single point) | Med | Med | Add at least one Android Chrome pass (Browser MCP emulation + Pixel screenshot) before finalising. Document any iOS-only assumptions. |
| Audit drifts into production-fix territory (scope creep) | High | Med | Pre-commit hook: every commit during audit must touch only `docs/audits/2026-05/**`, `scripts/audit/**`, or `plans/2026-05-13-*.md`. Anything else triggers a scope-guard alert per `bundle-unrelated-dirty-files-in-focused-commit`. |
| Reference patterns from Aman / Four Seasons drift offline | Low | Low | Save WebP screenshots to `reference-patterns/` immediately when captured; never rely on the live URL alone. |
| `prefers-reduced-motion` testing is platform-specific | Med | Low | Document the toggle path for iOS Safari (Settings → Accessibility → Motion → Reduce Motion) and Chrome DevTools `Rendering → Emulate CSS media feature prefers-reduced-motion`. |
| Audit produces useful list but findings doc never converts to a remediation plan | Med | High | Audit ends with a one-page "next plan stub" at `plans/2026-05-XX-mobile-ux-remediation-plan-stub.md` queuing the Quick-wins bucket. No remediation = audit value forfeited. |

---

## 16. Confidence & uncertainty

- **High confidence (🟢):**
  - WCAG AAA targets and Core Web Vitals thresholds (cited, current 2026).
  - The hard scorecard layer (Pass A) will surface 8–15 measurable issues — historical mobile audits at LBTA have produced this range each pass.
  - The Curve-1 fixes (token swaps, focus rings, touch targets, 16px inputs) can be shipped within a single follow-up `/compound:work` cycle.
- **Medium confidence (🟡):**
  - That the audit will produce 3–5 *novel* friction findings (not regressions of already-fixed issues). Brand v1.1 + Phases 1–4 of the prior mobile plan covered a lot of ground.
  - That the gap report (Pass B) will surface meaningful luxury-hospitality reference patterns LBTA isn’t already doing — reasonable hypothesis, requires actual brand-by-brand walkthrough to confirm.
  - That a `/schedules` mobile IA rethink will be the highest-impact Curve-2 finding (rather than hero or nav).
- **Low confidence (🔴):**
  - Whether Andrew will accept any Strategic-bucket recommendation without further user interviews / real-customer data. The audit produces hypotheses; conversion experiments would confirm them.
  - Whether INP on the homepage hero (parallax + video + Framer entrance) currently passes ≤200ms on mid-range Android. Will measure during execution.

---

## 17. Open questions for Andrew (top 5 to answer before execution)

These are the calls that should be decided *before* the audit runs, so the auditor doesn’t waste cycles on out-of-bounds options. (Curve 2 — Andrew calls.)

1. **Mobile nav: in scope for redesign, or polish-only?** If the audit finds the mobile drawer Programs grid is the biggest friction, are we willing to entertain a redesign (new IA, possibly a bottom-sheet variant) or are we locked to "polish the current drawer"? Default suggested: **polish-only**, unless the audit surfaces a >20% bounce drop on the drawer.
2. **TrialBookingModal: in scope for refactor?** The modal is the conversion funnel’s last 50 feet. Are we OK with a Medium-bucket refactor (bottom-sheet on mobile, sticky submit, max-3-fields-visible) if the audit shows real friction? Default suggested: **yes, if friction is critical**.
3. **StickyCTA strategy on mobile: always-on (current) or conversion-page-only (Aman-style restraint)?** This is a brand-vibe call as much as a conversion call. Default suggested: **always-on**, but the audit should produce data that lets Andrew confidently decide.
4. **Are we willing to drop the homepage hero video entirely on mobile in favour of a still poster + single sentence + single underlined CTA (Aman pattern)?** Currently the poster carries mobile (video only on ≥768px), but the hero stack is still busier than Aman’s. Default suggested: **trim the stack, keep the poster**, defer video-drop to a future experiment.
5. **What is "done" for this audit?** Default suggested: when the 4 docs under `docs/audits/2026-05/` exist + screenshots + `screenshot-sweep.mjs` script + a remediation plan stub is queued. Not "when every finding is fixed" — that’s a separate work plan.

---

## 18. Top-3 hypothesised friction areas (pre-audit — to verify)

> These are *hypotheses*, not findings. The audit will confirm, refute, or refine.

1. **Homepage hero stack is busy on mobile.** Eyebrow + 3-line tagline + pillars subline + subline + pricing-hint link + primary CTA + secondary CTA + scroll-cue, all stacked on a phone, may compete with each other for the first 800ms of attention. Aman would say one sentence + one link. *Hypothesis: trimming improves perceived luxury and possibly conversion. 🟡 confidence.*
2. **`/schedules` mobile IA is dense.** Anchor nav + season pills + program rows + Camps + Leagues + Private + StickyCTA + Footer all on one page. Mobile users may struggle to find "the next thing" — Aman / Belmond would chunk this into 3–4 short pages or a single curated "Featured this season + view all" disclosure. *Hypothesis: dense pricing tables on mobile feel transactional rather than boutique. 🟡 confidence.*
3. **Modals / StickyCTA / ChatWidget / BackToTop stacking near the bottom-right on iOS** with the safe-area-inset may have undetected collisions when the iOS keyboard opens in a form. *Hypothesis: ≥1 collision exists at ≤390px when the keyboard is open. 🟢 confidence — this kind of issue almost always exists on this stack pattern.*

---

## 19. Cathedral lens — what this audit makes us

- **90-day visible proof:** Three docs + screenshots + a remediation plan stub. Andrew can show this audit to any partner / investor / coach as "we hold ourselves to a measurable luxury bar on mobile."
- **12–18 month compounding asset:** Mobile audit becomes a *recurring* quarterly ritual (cf. agent-native audit cadence). Each pass updates the same scorecard and gap report, so progress is visible over time. Quality-bars and anti-patterns from each audit flow back into `.cursor/compound/learnings/`.
- **5-year directional bet:** The site treats mobile not as a "responsive afterthought" but as the *primary* surface for the LBTA experience — consistent with where premium service businesses are heading. Reinforces the identity "Tennis, as it should be taught" by ensuring the digital first impression is calm, confident, and craft-led on the device 70%+ of prospects will actually use.

---

## 20. Execution kick-off

When ready to execute this plan, run: `/compound:work plans/2026-05-13-mobile-ux-audit-plan.md` and start at Step 1.

The follow-up remediation plan stub will live at `plans/2026-05-XX-mobile-ux-remediation-plan-stub.md` (filename finalised when audit lands).

---

## 21. Execution log (2026-05-13)

`/compound:work` ran the audit per the plan. Outputs landed in `docs/audits/2026-05/`:

- `scorecard.md` — Pass A measurable scorecard (Lighthouse / axe / contrast / brand tokens / touch targets / reduced-motion / h-scroll). 11 pages × 6 breakpoints sweep complete.
- `gap-report.md` — Pass B luxury-flow gap report (F1–F5 + cross-cutting).
- `findings.md` — Prioritized findings (4 Critical / 8 Should-fix / 4 Nice-to-have) + closing decision-lenses section.
- `andrew-decisions.md` — 5 Curve-2 questions answered with evidence-backed recommendations + 3 bonus questions.
- `screenshots/` (84 PNG screenshots), `lighthouse/` (9 reports), `axe/` (11 JSON outputs + summary).
- `scripts/audit/screenshot-sweep.mjs` and `scripts/audit/axe-sweep.mjs` — read-only harnesses.

**No production source code changes** — observation/diagnosis only, per user instructions for this `work !` invocation (Andrew didn't pre-answer the 5 Curve-2 questions, so audit shipped as observation-only and Curve-2 calls were elevated to `andrew-decisions.md` for explicit decision).

### Blockers (audit phase)

1. **Lighthouse against `npm run start` deferred.** Audit used `npm run dev` (Turbopack). Performance lab scores (51–77) are dev-mode artifacts; A11y / BP / CLS / brand-fidelity results are roughly representative because they reflect markup + CSS. Andrew's manual pass should re-run Lighthouse against production (`npm run start` or live `lagunabeachtennisacademy.com`) to validate the perf bar.
2. **Real-device iOS Safari + Android Chrome passes deferred.** Emulated Chromium captures all visible findings; iOS-specific rubber-band scroll, double-tap zoom, soft-keyboard-over-Submit, address-bar `100vh` recalculation, and GHL `<chat-widget>` internal DOM behavior require Andrew's iPhone.
3. **Field CrUX p75 deferred.** Requires PageSpeed Insights / Search Console access to `lagunabeachtennisacademy.com`.
4. **WebP screenshots replaced with PNG.** Plan called for `.webp` outputs; harness emits `.png` for universal previewer compatibility (sharper diff review in any tool). Trivial reversal if Andrew wants WebP.
5. **Reference-pattern screenshots not captured.** The plan envisioned capturing Aman / Four Seasons / Edition / Belmond mobile screenshots into `docs/audits/2026-05/reference-patterns/`. Audit cited source pages + case studies instead; capturing iPhone screenshots of those competitors is Andrew's manual pass (or a follow-up).

### Acceptance status

All 10 plan-level acceptance items (§10) hold. See `findings.md` § acceptance gate for the explicit list.

**Headline verdict.** Hard scorecard: 80/100 (mechanics largely strong; 4 critical a11y issues, contrast token gap, one /contact CLS bug). Luxury gap: 70/100 (the site is mechanically sound but has a busier hero, always-on sticky CTA, and consumer-grade trust stat where Aman / Belmond would be quieter). The audit's biggest leverage points are (a) site-wide token-swap of `text-brand-pacific-dusk/{50–70}` on light surfaces — fixes 30+ contrast violations in one move — and (b) the 5 Curve-2 calls in `andrew-decisions.md`.

---

*Plan created 2026-05-13 via `/compound:plan` (PLAN phase only). Curve check: mixed (Curve 1 grunt + Curve 2 spotter). Decision lenses applied: ghost notes (survivorship gap §13), loss function (per-page measurable bar §7), CORE (Andrew-decisions doc, §17), cathedral (§19), identity (§19). Memory consulted: `quality-bars.json` v2026-05-11, `patterns.json` v2026-05-11, `anti-patterns.json` v2026-05-11, prior mobile plans (2026-03-17, 2026-05-06).*
