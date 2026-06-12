# Mobile Flow Gap Report (Pass B)

> **Audit window:** 2026-05-13
> **Pass type:** Curve 2 — taste & flow. Concrete reference patterns from Aman, Four Seasons, Edition, Belmond, Six Senses applied to LBTA's mobile booking and discovery flows.
> **Method per flow:** capture current LBTA mobile state (with screenshot refs), name the friction (with breakpoint + evidence), reference one or more concrete luxury hospitality patterns, propose a change, suggest a decision (keep / tweak / redesign) — Andrew decides.
> **Honesty about scope:** I cannot run the Aman / Four Seasons / Belmond mobile sites on a real iPhone from this environment. Reference patterns below are sourced from documented case studies, design system articles, and current 2026 industry trend reporting. Where I'd like to cite a specific screenshot, I name the source page and recommend Andrew capture an iPhone screenshot during his manual pass.

---

## Reference index (Pass B luxury benchmarks)

These are the reference brands whose mobile patterns are cited below. Each is verifiable on the open web; Andrew's iPhone pass should add concrete screenshots to `reference-patterns/`.

| Brand | Why it's the reference | Source |
|---|---|---|
| **Aman** | Quiet-luxury archetype. Documented 218% CTR / 200% conversion lift from menu simplification. Mobile nav: `Menu · Search · English · Reserve` — 4 items, that's it. | [Propeller case study](https://www.propeller.co.uk/work/aman); [aman.com](https://www.aman.com/) |
| **Four Seasons** | Editorial first; reservation widget surfaces only on intent pages, never on storytelling. | [fourseasons.com](https://www.fourseasons.com/) |
| **Belmond (LVMH)** | "Slow luxury" 2026 positioning; editorial chapter pacing, full-bleed photography, restrained CTAs. | [Hotel Designs — Belmond 2026 Slow Luxury](https://hoteldesigns.net/industry-news/belmond-steps-into-2026-championing-slow-luxury/) |
| **Six Senses** | Wellness-led editorial pacing; bottom-anchored booking patterns. | [sixsenses.com](https://www.sixsenses.com/) |
| **Edition Hotels** | Bold serif, soft fade-in, minimal animation, single CTA above fold. | [editionhotels.com](https://www.editionhotels.com/) |
| **2026 luxury hospitality trends** | Industry framing: "Luxury is ease," delete first, optimize later. | [Four Seasons exec quote / Rob Markey LinkedIn](https://www.linkedin.com/posts/robmarkey_at-four-seasons-hotels-and-resorts-introducing-activity-7349416245869379585-By57); [Hotel Yearbook 2026](https://www.hotelyearbook.com/article/122000504/top-10-luxury-hospitality-design-trends-for-2026) |
| **iOS HIG / Material on sheets** | Bottom-sheet vs full-screen modal trade-offs for mobile forms. | [Apple HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets); [NN/G: Bottom Sheets](https://www.nngroup.com/articles/bottom-sheet/) |

---

## F1 — Trial Booking

> Entry points: Header "Book Trial," mobile drawer "Book Your Trial," StickyCTA, `/junior-trial`, `/adult-trial`, hero, schedules Register actions, pathway-planner result, FAQ link.

**Current LBTA mobile experience.**
Each entry point either navigates to `/book` (server-rendered route) or opens `TrialBookingModal` (top-centered overlay, `max-w-[520px] max-h-[90vh]`, 6 form fields visible at once on first paint: First, Last, Email, Phone, Program, Goals + age conditional). Submit is at the bottom of the form below the fold on most viewports. Modal animates in with Framer Motion spring (no reduced-motion gate). Body scroll locks. Close is top-right (40×40 visual, 48 touch). On success → 2.5s timeout → redirect to `/thank-you`. Screenshots: `screenshots/book-375.png`, `screenshots/junior-trial-375.png`.

**Friction observed.**
1. **`<select>` element on `/junior-trial` has no accessible name** (`axe/junior-trial.json` — critical). On screen-reader this select is announced as "select required". (See `app/junior-trial/page.tsx` `<select>` element — likely needs `<label htmlFor>` + visible label or an `aria-label`.) Same issue: 3 selects on `/pathway-planner` (which surfaces a trial-booking CTA after the quiz).
2. **NewsletterForm submit button has no accessible name on mobile** across every page in the footer — affects post-submit cross-sells and is the most-frequently-rendered button in the trial-booking funnel.
3. **`text-brand-pacific-dusk/50` eyebrow** ("FREE TRIAL LESSON") in the modal at `TrialBookingModal.tsx:265` measures **2.74:1** contrast on the modal's sandstone surface → fails AA.
4. **TrialBookingModal spring animation runs unconditionally** for users with `prefers-reduced-motion`.
5. **Modal previously-focused element capture happens, but on FIRST open without a stored `previousFocusRef`** (file `TrialBookingModal.tsx:104-111`) — race: the effect runs on `isOpen` changing, but if the trigger button is unmounted between open events, restored focus targets a stale node. Defer-flag, not confirmed-bug.
6. **6 form fields visible at once on mobile** — `firstName`, `lastName`, `email`, `phone`, `program`, `goals`. Hotel CRO 2026 industry consensus is **≤3 fields visible before any scroll** for mobile booking forms ([Hotel CRO 2026 Insights](https://hotelsseo.com/blog/hotel-cro-2026-insights), "four major leaks"). 6 visible fields = perceived effort = drop-off risk.
7. **No bottom-sheet variant on iOS** — iOS users expect bottom sheets per Apple HIG; top-centered overlay modals feel "web", not "native".
8. **Submit button likely covered by iOS soft keyboard** at 390×844 viewport — **not verifiable in this environment**, but the textarea ("goals") sits above Submit, and tapping it opens the keyboard. Defer to Andrew's iPhone pass.

**Best-in-class luxury comparison.**
- **Aman.com reservation flow.** Top-right "Reserve" → dedicated reservations page (not a modal). Form is one column, large field-spacing, dates/destination/guests first — fewer than 5 visible fields at any moment. No spring or bounce animation. (Source: [aman.com](https://www.aman.com/) header.)
- **Four Seasons exec framing (industry consultants).** *"A one-page booking path. A 90-second check-in. A 1-question feedback loop."* — "Delete first, optimize later." Implies LBTA's modal is over-engineered. ([source](https://www.linkedin.com/posts/robmarkey_at-four-seasons-hotels-and-resorts-introducing-activity-7349416245869379585-By57))
- **iOS HIG bottom-sheet pattern.** Sheets are anchored to the bottom edge, slide up from below. Apple's reference: "Use a full-screen modal view when you need to capture attention for an extended interaction" — but for ≤3 fields, **non-modal bottom sheet** is the Apple-native idiom. ([Apple HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets))
- **NN/G bottom sheet research.** "Bottom sheets are progressive disclosure… they're typically invoked by a user interaction." Modal bottom sheet for booking gives focus-trap + scrim + iOS-native dismiss-gestures (swipe down). ([NN/G](https://www.nngroup.com/articles/bottom-sheet/))

**Proposed change.**
Two-pass remediation:
1. **Quick wins (Curve 1, ≤1 day total):** Add `<label htmlFor>` or `aria-label` to all unlabeled `<select>`s. Replace `text-brand-pacific-dusk/50` eyebrow with `text-eyebrow text-brand-pacific-dusk` (full opacity). Add `useReducedMotion` gate to TrialBookingModal Framer Motion transitions. Add `aria-label="Subscribe"` (or restore visible text at mobile) to NewsletterForm submit.
2. **Strategic (Curve 2, 2–5 days):** Convert TrialBookingModal to a mobile bottom-sheet variant (`md:` keeps current overlay; `<md:` uses a bottom-anchored sheet that slides up from below, supports swipe-down to dismiss, max-height ~80vh, sticky Submit at the bottom). Reduce visible field count: First/Last become a single "Your name" or split-column at the top, Goals moved to step 2 OR removed entirely (it's optional already). Target: **3 fields visible** at first paint above an always-visible primary Submit.

**Effort & impact.** Quick wins: S, high (a11y compliance + measurable conversion via reduced fields). Strategic: L, high (bottom-sheet refactor touches modal contract).

**Decision suggested (Andrew):** Curve 2 — **tweak now (a11y fixes), defer redesign**. The bottom-sheet refactor is the kind of taste-call that only Andrew can sign off on, but the a11y findings are non-negotiable.

---

## F2 — Pathway Discovery

> Entry: Header Programs mega-panel (mobile drawer "Programs" 2-up grid) → `/programs` → pathway page → `/pathway-planner` quiz → result → CTA back to `/schedules` or `/book`.

**Current LBTA mobile experience.**
Mobile drawer opens from right (320px width, 88vw max). Programs section is a 2-up grid of 8 cards (`Header.tsx:394-414`) each with title + 12px description. At 320 viewport: drawer 320px − 24px padding × 2 = 272px usable, gap-2 = 8px, so each card ≈ 132px. Pathway quiz at `/pathway-planner` uses 3 `<select>` elements stacked vertically. Result page links to `/schedules` for actual pricing (no client-side dollar amounts — verified ✓).

**Friction observed.**
1. **8 programs in a 2-up grid at 132px-wide cards** at 320px — at the lower bound of the mobile breakpoint range, the description text "Coach-fed doubles — how sessions work" gets compressed to multiple lines per card. Visually dense.
2. **3 unlabeled `<select>`s on the quiz** — critical a11y bug.
3. **Quiz has no progress indicator** ("Step 1 of 3" or progress bar) — verify in screenshot `screenshots/pathway-planner-375.png`.
4. **Result CTA tile shows a heading "Tuition" but no number** (correct per pathwayPlannerNoSyntheticTuition learning ✓) — but the user just spent ~30 seconds answering questions and the reward is "Rates vary…click View schedule & pricing." Possibly anti-climactic; consider naming what they get ("Your recommended pathway: …") more prominently.
5. **iOS back-button on Safari may reset the quiz state** because the quiz state is React local state, not URL params — defer-flag.

**Best-in-class luxury comparison.**
- **Aman destination discovery on mobile.** Single-column scrolling editorial; each destination is a full-bleed image + 2-line title + "Discover more" underlined link. No grid of 8 at once. The visitor scrolls through, encounters them one at a time. (Source: [aman.com Destinations](https://www.aman.com/) on mobile.)
- **Aman menu simplification case study.** The Propeller team A/B-tested simpler menu terminology — found that **reducing cognitive load lifted CTR 218% and conversions 200%** on Aman's nav. ([Propeller Aman case study](https://www.propeller.co.uk/work/aman))
- **Belmond's "Slow Luxury" 2026 positioning.** Pages feel paced like a journey — one chapter, one image, breathing room between. ([Hotel Designs](https://hoteldesigns.net/industry-news/belmond-steps-into-2026-championing-slow-luxury/))

**Proposed change.**
1. **Quick wins:** label the pathway-planner selects. Add a "Step N of 3" progress indicator. Strengthen the result heading.
2. **Strategic option A (lighter):** Replace the 2-up Programs grid in mobile drawer with a 1-column list of 4 *featured* programs + "View all programs" disclosure that opens a longer scrollable list. Borrowed from Aman menu pattern: reduce visible decisions.
3. **Strategic option B (heavier):** Replace the pathway-planner quiz with a 2-question version (just "age range + commitment level") — currently the data structure suggests 4+ inputs across "level," "commitment," etc. Less is more.

**Effort & impact.** Quick wins: S, med. Drawer redesign: M, med. Quiz reduction: M, high (lower drop-off, higher completion rate).

**Decision suggested (Andrew):** Curve 2 — **redesign the drawer Programs grid** to fewer-visible-at-once. Quiz reduction is a separate brand-defining choice (does the academy want to ask less or more about the player?).

---

## F3 — Schedules / Pricing (single source of truth)

> Entry: Header Programs panel "View Full Schedule & Pricing," hero pricing-hint link, footer link.

**Current LBTA mobile experience.**
`/schedules` is the single-source page. Layout: top SeasonBanner ("Spring 2026 Registration Open"), then anchor nav with season pills (Winter/Spring/Summer/Fall), then filters (age/level/day), then ProgramRow list, then Camps section, Leagues, Private Coaching. StickyCTA sits at bottom. Screenshots: `screenshots/schedules-{320,375,390,414,768,1440}.png`.

**Friction observed.**
1. **Inactive season pill text fails AA contrast** — `text-brand-pacific-dusk/70` on `bg-brand-sandstone` = **4.44:1** (`axe/schedules.json` shows 6 nodes for `#season-tab-{winter,summer,fall}`). Active pill is fine; *non-active* pills are nearly invisible.
2. **Filter labels at `/50`–`/60` brand opacity fail AA** — "Filter by age, level, or day" measures 2.74:1.
3. **/contact page CLS = 0.499** (Lighthouse layout-shifts trace) — entire Footer shifts post-paint by 0.4. Likely the SeasonBanner is mid-paint-shifting; verify production behavior. (Different page but same Footer that's on `/schedules`.)
4. **Programs grid + Camps + Leagues + Private all in one scroll** — `/schedules` is the densest page on the site; long-form mobile scroll is fine *aesthetically* but the cognitive load of "where do I find $X?" is high. Andrew has prior intuition (Section 13.2 in the plan, "dense pricing tables feel transactional rather than boutique") — verify.

**Best-in-class luxury comparison.**
- **Four Seasons booking pattern.** Reservation widget surfaces on booking pages only; editorial pages (rooms, dining, spa) have *no* sticky reservation bar — the reservation lives in the top-right "Reserve" CTA in the header. Editorial calm.
- **Aman "Plan your stay" pattern.** Single field — destination — leads to a multi-step inquiry, not a price-comparison table. Pricing is communicated as a personal conversation, not a published rate card.
- **Belmond chapter pacing.** Each section feels like a magazine spread: one image, one title, one detail, then scroll forward. ([Hotel Designs](https://hoteldesigns.net/industry-news/belmond-steps-into-2026-championing-slow-luxury/))

**Proposed change.**
1. **Quick wins:** Fix inactive-season-pill contrast (lift `text-brand-pacific-dusk/70` to `text-brand-pacific-dusk` or `/85`). Fix filter-label opacity. Fix CLS on `/contact` (reserve space for ChatWidget + Footer).
2. **Strategic option (Curve 2 — Andrew's call):** Restructure `/schedules` from "one giant table" to "**3 short pages**" — `/schedules/junior`, `/schedules/adult`, `/schedules/camps-leagues`. Each page has 1 hero-image + 3–5 featured programs per season + "View all programs in this category" disclosure. **Risk:** breaks the "single source of truth" rule (`.cursorrules` Part 12) — would need a plan-level decision to revise that rule. **Reward:** matches Aman/Belmond chapter pacing.

**Effort & impact.** Quick wins: S, high (AA compliance + content readability). Page split: L, high — but architecturally invasive.

**Decision suggested (Andrew):** Curve 1 fixes immediately. Curve 2 page-split is **redesign**, but only if Andrew accepts the trade-off with the SSOT rule. Default suggestion: **tweak structure within `/schedules`** (chapter-style cards within the existing page) before splitting into 3.

---

## F4 — Coach Discovery / Founder

> Entry: Header Coaches link, mobile drawer Coaches, homepage founder anchor, footer.

**Current LBTA mobile experience.**
`/coaches` lists 4 coaches (Andrew, Allison, Peter, Robert) with portrait + bio snippet + "Read more" link. `/coaches/andrew-mateljan` is a long-form bio page. Mobile drawer ends with a `<N> players trained` trust line (`Header.tsx:486-489`, `siteStats.trustStats.playersCount`).

**Friction observed.**
1. **"(N) players trained" in mobile drawer** is a consumer-grade stat, not a heritage stat. Compare to Aman's preferred "Founded YYYY" pattern. Already flagged in plan §13.6 as a survivorship-gap candidate. ✓ verified — still present in source.
2. **Coach card grid head-cropping** — needs visual verification at 320/375 in `screenshots/coaches-{320,375}.png`. (`object-position: 50% top` should be set per `object-position-top-weighted-hero` learning; cannot inspect at runtime without device.)
3. **/coaches/andrew-mateljan Lighthouse Perf 68, A11y 90** — lowest perf score (dev-mode noise) and on the A11y bar.
4. **Pull-quotes**: spot-check shows `.section-quote` used correctly on `andrew-mateljan` page (not raw `border-l`). ✓

**Best-in-class luxury comparison.**
- **Aman About / Story pattern.** Founder/heritage story is told through a sequence of single-image-per-screen vignettes, not a single long-form blob. Each "chapter" is its own scroll-snap.
- **Four Seasons "Our Story" 65 Years**. Editorial framing of heritage with a strong founding year + key milestones. ([Four Seasons 65 Years press](https://press.fourseasons.com/news-releases/2026/strategic-growth-and-expansion/))
- **Belmond.** Editorial chapter pacing with full-bleed photography between sections.

**Proposed change.**
1. **Quick win:** Replace "(N) players trained" in the mobile drawer with a heritage stat — "Founded 2020 · Official City Partner" or similar. Aligns with `2026-04-16-aman-standards-compound-learn.md` direction.
2. **Strategic option:** Re-cast Andrew's bio page from long-form continuous prose into 5–6 named chapters (Founder, Philosophy, Career, Coaching, Family / Community, Reading List) with full-bleed photography between. Curve 2 — Andrew's voice & taste call.

**Effort & impact.** Drawer copy: S, low. Chapter refactor: L, med-high (brand storytelling investment).

**Decision suggested (Andrew):** Drawer copy = **tweak** (quick win). Chapter refactor = Curve 2; recommend **keep** (long-form is part of Andrew's voice) unless conversion data says otherwise. Worth Andrew explicitly weighing in.

---

## F5 — Founder / Philosophy / About (sustained-scroll quality)

> Entry: Footer, Header About, mobile drawer About.

**Current LBTA mobile experience.**
`/about` is a long-scroll editorial page. Brand fidelity is currently the highest of any audited page — `text-eyebrow` tokens, `.section-quote`, `HorizonDivider` per Brand Guide. Screenshots: `screenshots/about-{320,375}.png`.

**Friction observed.**
1. **9 `color-contrast` violations on `/about`** (axe/about.json) — mostly the same `text-brand-pacific-dusk/50–/70` pattern surfacing in eyebrows and secondary text.
2. **Modals / overlays on this page:** none directly. ChatWidget after 4s + first scroll injects.
3. **`region` landmark violation:** SeasonBanner ("Spring 2026 Registration Open") is rendered outside any `<main>` / `<section>` landmark.
4. **`text-brand-sunset-cliff` decorative usage on white** appears in some accents — needs measured ratio.

**Best-in-class luxury comparison.**
- **Belmond Slow Luxury (2026).** Long-scroll pages are paced like a magazine — generous white space (40%+ per LBTA `.cursorrules`), single image per chapter, never more than 1 CTA per section.
- **Aman / Six Senses long-form.** Reading-mode style — no sticky elements, no chat launcher, no sticky CTA. The reader is allowed to read.

**Proposed change.**
1. **Quick wins:** Lift all `/50–/70` brand opacities to `/85` minimum on light surfaces. Wrap SeasonBanner content in a proper landmark.
2. **Strategic option (Curve 2):** Consider suppressing the StickyCTA on editorial pages (`/about`, `/philosophy`, `/coaches/andrew-mateljan`, `/success-stories`). Aman/Belmond don't sticky-bar storytelling pages. LBTA's current behavior is "StickyCTA on every page past 400px scroll" — uniformly transactional vibe. See Andrew-decisions Q3.

**Effort & impact.** Quick wins: S, high (compliance + visual calm). StickyCTA suppression: S, med — but it's a vibe/conversion call.

**Decision suggested (Andrew):** Quick wins immediately. **StickyCTA-on-editorial-pages-only** is the most interesting Curve-2 question of this audit — see Andrew-decisions Q3.

---

## Cross-cutting findings (apply across F1–F5)

### Header drawer
- Works mechanically (focus trap, scroll lock, return focus). ✓
- "(N) players trained" — survivorship-gap; Aman pattern is heritage stat. Quick win.
- Programs 2-up grid at 320 — dense; defer to F2 redesign call.

### StickyCTA / ChatWidget / BackToTop
- Stacking via CSS vars is sound. ✓
- StickyCTA fires on every page — see Andrew-decisions Q3 (editorial-page-only?).
- BackToTop `behavior: 'smooth'` not gated. Quick win.
- ChatWidget deferred 4s. Visual stacking with StickyCTA at right-edge phone icon is **not verifiable** here. Andrew's device pass.

### Modal contract
- TrialBookingModal: focus trap ✓, escape ✓, body lock ✓, max-h-90vh ✓, success-view focus 🟡 (no explicit focus move to success-view CTA, just auto-redirect after 2.5s — verify behavior with VO).
- Framer Motion reduced-motion gate: **missing** in TrialBookingModal (only FAQSection imports `useReducedMotion`).
- Header keyframes (`slideInRight`, `fadeInUp`, `fadeInDown`): **not gated** on `prefers-reduced-motion`.

### Hero stack
- Reduced-motion gates: ✓
- 6+ stacked elements (eyebrow + 3-line tagline + pillars subline + subline + pricing-hint link + primary CTA + secondary CTA + scroll-cue): worth Andrew's gut check vs. Aman's "one sentence + one underlined CTA" (see Andrew-decisions Q4).
- Hero scroll-cue 44×44 fails LBTA 48 bar (passes WCAG). Quick win.

### Footer
- `<h4>` after `<h2>` heading-order violation site-wide. Easy fix: use `<h3>` or non-semantic styled elements for column titles.
- All text appears `/70` or higher on `bg-brand-deep-water` ✓ (footer-contrast learning is holding).
- `text-white/30` decorative pipe `|` on `/thank-you` — borderline; if it's decorative-only, ok; if assistive-tech reads it, lift to `/70` or use a real separator pattern.

---

## Pass B verdict

Most flows are **mechanically sound** — the focus traps, scroll locks, single-expand patterns, brand-token compliance, and reduced-motion gates on the hero all work. The site's structural quality is high.

The **luxury delta** is in:
1. **Calm vs. busy hero stack.** LBTA has 6+ elements above-the-CTA on mobile. Aman has 2. (See Q4.)
2. **Always-on StickyCTA vs. editorial-page-restraint.** Aman/Belmond don't sticky-bar storytelling. (See Q3.)
3. **Modal-vs-bottom-sheet for booking.** iOS-native is bottom sheet; LBTA uses top-overlay. (See Q2.)
4. **Schedules information architecture.** One giant table vs. chapter-paced cards. (See Q1.)
5. **Heritage stat vs. consumer-grade "(N) players trained."** Aman replaces this with founding year. Quick win, but it speaks to brand identity.

**Conversion-engineering Quick wins (Curve 1) are mostly a11y compliance + contrast lift — and they alone would likely shift Lighthouse A11y to ≥95 across the board and ship a measurable "we hold the AAA bar" claim.**

The Curve-2 calls live in `andrew-decisions.md`. Andrew, your move.
