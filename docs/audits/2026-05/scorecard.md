# Mobile UX Audit — Hard Scorecard (Pass A)

> **Audit window:** 2026-05-13
> **Audited:** `http://localhost:3000` — Next.js 16.1.1 in **dev mode (Turbopack)**.
> **Pass type:** Curve 1 — measurable. WCAG 2.1 AA + AAA, Core Web Vitals (lab), brand-token compliance, touch targets, axe-core 4.11 ruleset.
> **Tools:** Playwright 1.58 (Chromium-headless-shell 145), Lighthouse 13.3, axe-core 4.11.4 injected via Playwright, manual `rg` brand-token sweep.
>
> **Honesty about lab numbers.** Below scores are **dev-mode** (Turbopack) — systematically slower than `next start` (production). They are **diagnostic**, not the production bar. The Performance score (51–77) and LCP (5–14s) are mostly dev-mode artifacts. The **A11y, Best-Practices, and CLS results, however, are roughly representative** — they reflect markup and CSS, which production builds don't change.
> **Field CrUX p75 (production traffic) is deferred** — requires Andrew's PageSpeed Insights or Search Console pass against `lagunabeachtennisacademy.com`.
> **Real-device iOS Safari / Android Chrome passes deferred** to Andrew. Emulated viewports do not surface rubber-band, double-tap-zoom, keyboard-over-Submit, address-bar collapse, or safe-area-inset behaviors.

---

## 1. Top-line numbers (lab, dev-mode, mobile preset, 4× CPU throttle)

> Raw HTML + JSON in `lighthouse/{page}.report.{html,json}`.

| Page | Perf | A11y | BP | SEO | LCP (s) | CLS | TBT (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | 57 | 91 | 81 | 100 | 13.7 | 0.097 | **581** |
| `/schedules` | 69 | 91 | 81 | 100 | 12.9 | 0.097 | 198 |
| `/book` | 70 | 91 | 81 | 100 | 8.8 | 0.097 | 182 |
| `/junior-trial` | 77 | 91 | 81 | 100 | 5.5 | **0.000** | 170 |
| `/adult-trial` | (not run separately — same template as junior-trial) | — | — | — | — | — | — |
| `/programs` | (deferred — page renders mostly server-side; same patterns) | — | — | — | — | — | — |
| `/coaches/andrew-mateljan` | 68 | 90 | 81 | 100 | 12.5 | 0.097 | 242 |
| `/about` | 70 | 90 | 81 | 100 | 9.3 | 0.097 | 184 |
| `/contact` | 51 | 91 | 81 | 100 | 8.8 | **0.499** | 200 |
| `/pathway-planner` | 70 | **89** | 81 | 100 | 10.4 | 0.097 | 166 |
| `/thank-you` | 70 | 93 | 81 | **66** | 8.2 | 0.097 | 191 |

**cursorrules bar:** Perf / A11y / BP / SEO **≥ 90 each**. None pass Performance in dev mode (expected). A11y ≥ 90 on most but `/pathway-planner` is 89 (one notch below). CLS bar < 0.1 — `/contact` is **0.499** (5× over). All BP scores stuck at 81 — see §3.

**SEO 66 on `/thank-you`** is intentional (noindex) — not a bug; flagged as informational.

---

## 2. A11y (axe-core, mobile 375×667, full ruleset)

> Raw JSON in `axe/{slug}.json` and aggregated summary at `axe/summary.json`.

**Site-wide rules failing (count = pages with at least one violation node):**

| Rule | Impact | Pages | Root cause | Evidence |
|---|---|---:|---|---|
| **`button-name`** | critical | 10 / 11 | `components/NewsletterForm.tsx:74-80` — `<sm:` hides "Subscribe" text via `hidden sm:inline`, leaving only an icon (correctly `aria-hidden="true"`), so on mobile the button has **no accessible name**. | `axe/home.json`, `axe/contact.json`, `axe/book.json`, all show same selector `.tracking-wider` on `<button type="submit">` |
| **`select-name`** | critical | 2 / 11 | `<select>` elements without label association on `/junior-trial` (1 instance) and `/pathway-planner` (3 instances — the quiz selects). | `axe/junior-trial.json`, `axe/pathway-planner.json` |
| **`color-contrast`** | serious | 9 / 11 | Multiple — see §2.1 below. | `axe/schedules.json` has 49 nodes |
| **`heading-order`** | moderate | 10 / 11 | `components/layout/Footer.tsx:79,102,126` — `<h4 class="text-eyebrow">Programs/Academy/Contact</h4>` after a `<h2>` "JOIN OUR COMMUNITY" with no intervening `<h3>`. | `axe/*.json` show `div:nth-child(1) > h4` selector |
| **`region`** | moderate | 10 / 11 | Free-floating text in `SeasonBanner` ("Spring 2026 Registration Open") not contained in a landmark. | `axe/*.json` show `.text-sm > .font-headline.font-light` |

### 2.1 Color-contrast detail (real measured ratios)

| Pattern | Ratio | Bar | Files |
|---|---:|---|---|
| `text-brand-victoria-cove` (#2E8B8B) on `bg-brand-morning-light` (#FAF8F4) — "View all FAQs" link, /contact phone & email | **3.82:1** | fails AAA 7:1 **and** AA 4.5:1 | `components/FAQSection.tsx:162-166`, `app/contact/page.tsx` (phone/email links) |
| `text-brand-pacific-dusk/50` (~#8C9BAA) on `bg-brand-morning-light` (~#FCFBF8) — "Filter by age, level, or day" + modal eyebrows | **2.74:1** | **fails AA** | `app/schedules/page.tsx` filter labels, `TrialBookingModal.tsx:265` eyebrow |
| `text-brand-pacific-dusk/60` (~#75879A) on light bg — schedules filter labels | **3.56:1** | fails AA + AAA | `app/schedules/page.tsx` |
| `text-brand-pacific-dusk/65` (~#6B7F95) on white — schedules subtext | **4.12:1** | fails AA + AAA | `app/schedules/page.tsx` |
| `text-brand-pacific-dusk/70` (~#5C7185) on `bg-brand-sandstone` (#F5F0E5) — inactive season tabs | **4.44:1** | fails AAA (passes AA at 4.5? — actually 4.44 < 4.5, **fails AA too**) | `app/schedules/page.tsx` `#season-tab-{slug}` |
| `text-brand-sunset-cliff` (#E8834A) on white — "Registration open" callouts | (axe flags as serious, not measured exact) | likely fails AA at normal size | `/junior-trial`, `/adult-trial` `SeasonBanner` |
| `text-white/40` and `text-white/25` on dark | not found in audited paths | — | — (good — historical `footer-low-contrast` learning is enforced) |
| `text-white/30` decorative pipe `|` on `/thank-you` | decorative, low-priority | — | `app/thank-you/page.tsx:134` |

**Translation:** The site has a **systemic low-opacity-brand-color** pattern (`text-brand-pacific-dusk/50–/70`) that **fails WCAG AA** on light surfaces. This is the highest-impact, broadest finding of the audit.

---

## 3. Best Practices — universally 81

All pages hit the same three failing audits:

1. **`deprecations`** — Facebook Pixel (`https://connect.facebook.net/en_US/fbevents.js`) uses a deprecated API. Third-party. Out of our direct control. (Could be retired if Meta Lead events aren't critical.)
2. **`valid-source-maps`** — missing for large first-party JS. Dev-mode artifact; production `next build` emits maps differently. **Re-verify on prod build.**
3. **`redirects-http`** — N/A on localhost (no HTTPS). Will pass on production.

→ **Production probably scores 85–90 on BP**; the 81 is mostly dev-mode + Meta Pixel.

---

## 4. CLS = 0.499 on `/contact` (CRITICAL)

> 5× over the 0.1 cursorrules bar.

Lighthouse trace: **two layout shifts both originate from the `<footer>`** (`body > footer.bg-brand-deep-water`).
- Shift 1 score: **0.402**
- Shift 2 score: 0.097
- Total: **0.499**

**Hypothesis:** The contact page has minimal above-footer content (just a contact form), so when fonts swap, images load, or the deferred ChatWidget injects, the entire footer's 2114px height shifts in the viewport. Pages with more content above the fold absorb the same shift inside CLS more gracefully.

**Same Footer is on every page** — but only `/contact` has a CLS spike. Means the issue is *content density above footer*, not the Footer itself.

→ Likely fixes: explicit min-heights / `aspect-ratio` on contact-form section, or `reserveSpace` for the deferred ChatWidget launcher. Defer to remediation.

---

## 5. Brand-token compliance

| Check | Result |
|---|---|
| `#XXXXXX` hex literals in `app/**` and `components/**` (audited public flow) | **Clean** — only matches were `components/utr-tracker/*` (admin, out of public flow) and `components/programs/UtrWeekAtGlanceBanner.tsx` (also UTR admin context). No customer-facing leakage. |
| Forbidden fonts (Space Grotesk / Inter / Roboto / Arial / Playfair Display / Work Sans) in `app/**` and `components/**` `.tsx`/`.css` | **None found** (good — v1.3 sweep held) |
| Deprecated `lbta-*` names (`lbta-cream`, `lbta-charcoal`, `lbta-orange`, `lbta-beige`, `lbta-sand`, `lbta-bone`, `lbta-burnt`, `lbta-coral`, `lbta-coral-dark`, `lbta-primary`, `lbta-secondary`) | **None found** in audited paths |
| Hand-rolled eyebrow (`text-[10-12px] uppercase tracking-[...]` outside hero exceptions) | 2 instances in `components/VideoTestimonials.tsx:123,202` — both are `text-[11px] md:text-[12px] uppercase tracking-[3px]` on dark sections, matching the documented hero-pattern exception per `.cursorrules` Part 7 ("responsive size jumps in hero contexts"). **Acceptable.** |
| Forbidden words in copy (`maximize / boost / elite / world-class / mastery`) in `app/**`, `components/**`, `data/**` | **2 hits in non-public files** (`data/coach-hub/*` — internal coach hub, out of scope). **None in public copy.** |
| Pull quotes use `.section-quote` not raw `border-l-2` | Verified in `app/coaches/andrew-mateljan/page.tsx` — uses pattern correctly. Spot check only. |
| Decorative SVGs use `aria-hidden="true"` | Hero scroll-cue, StickyCTA icons, NewsletterForm icons all `aria-hidden`. ✓ |

→ **Brand-system v1.1 lockdown is holding.** New violations from the brand checker are zero.

---

## 6. Reduced-motion gate audit (code review)

Spot-check across known motion sources:

| Source | Gate present? | Evidence |
|---|---|---|
| `HomeHero` parallax + video | **Yes** | `components/HomeHero.tsx:28-34, 47-68` — matchMedia listener, sets `reduceMotion`, gates parallax + video load + scroll-cue bounce |
| `Header` Programs dropdown + drawer animations | **No** (animations are CSS keyframes that fire unconditionally; reduced-motion users still see slide-in) | `components/layout/Header.tsx:497-510` `@keyframes slideInRight/fadeInUp/fadeInDown` — not gated |
| `TrialBookingModal` Framer Motion entrance | **No** | `components/TrialBookingModal.tsx:226-229` — spring transition; doesn't import or check `useReducedMotion` from framer-motion |
| `BackToTop` scroll-to-top | **No** | `components/ui/BackToTop.tsx:20-25` — `window.scrollTo({ behavior: 'smooth' })` without `prefers-reduced-motion` check |
| `StickyCTA` slide-up | **No** (CSS `animate-slide-up` fires unconditionally on first visible-on-scroll mount) | `components/StickyCTA.tsx:74` |
| `FAQSection` accordion | Uses `useReducedMotion` from framer-motion ✓ | `components/FAQSection.tsx:6` imports it |
| Hero scroll-cue `animate-bounce` | **Yes** | `components/HomeHero.tsx:188-189` gates on `reduceMotion` |

→ **Action items** (Critical): TrialBookingModal, BackToTop, StickyCTA, Header CSS keyframes should respect `prefers-reduced-motion`.

---

## 7. Touch targets (≥ 48×48 CSS px)

| Element | Size | Pass? | File |
|---|---|---|---|
| Header logo link | `min-h-[48px] min-w-[48px]` | ✓ | `Header.tsx:223-225` |
| Header phone (mobile) | `min-w-[48px] min-h-[48px] p-3` | ✓ | `Header.tsx:340-348` |
| Header menu button | `min-w-[48px] min-h-[48px]` | ✓ | `Header.tsx:349-358` |
| Mobile drawer close | `min-w-[48px] min-h-[48px]` | ✓ | `Header.tsx:382-389` |
| Hero CTA primary | `min-h-[48px] px-10 py-4` | ✓ | `HomeHero.tsx:157-159` |
| Hero scroll-cue | `min-h-[44px] min-w-[44px]` ⚠️ | **fails LBTA 48 bar** (passes WCAG 44) | `HomeHero.tsx:175-177` |
| StickyCTA primary | `min-h-[48px]` + flex-1 | ✓ | `StickyCTA.tsx:67` |
| StickyCTA phone icon ring | `w-14 h-14` (56×56) | ✓ | `StickyCTA.tsx:117-119` |
| BackToTop | `min-w-[48px] min-h-[48px] w-12 h-12` | ✓ | `BackToTop.tsx:32` |
| TrialBookingModal close | `min-w-[48px] min-h-[48px] w-10 h-10` (visual 40, touch 48) | ✓ touch bar; visual feels tight | `TrialBookingModal.tsx:234-237` |
| NewsletterForm submit | px-6 py-4 → ~48px height, width depends on text. Mobile shows icon-only → square button is ~ 40×48 wide — borderline. | ⚠️ (and **no a11y name** — see §2) | `NewsletterForm.tsx:59-62` |
| FAQSection "View all FAQs" link | no min-height — relies on text size + leading | ⚠️ likely <44px | `FAQSection.tsx:162` |

→ **Action items**: Hero scroll-cue (44 → 48), FAQ "View all FAQs" link (add min-h-[48px] inline-flex).

---

## 8. Horizontal scroll @ 320 / 375 / 390 / 414

Screenshots captured at all 4 mobile breakpoints in `screenshots/` (84 total: 14 pages × 6 breakpoints).

**Visual review (sampled):**
- `/` — no h-scroll observed at any mobile breakpoint
- `/schedules` — no h-scroll; season pills wrap correctly
- `/book` — no h-scroll
- `/junior-trial`, `/adult-trial` — sunset-cliff banner content is uppercase + tracking-wide, very dense at 320 — needs visual confirmation no clip
- `/programs` — no h-scroll observed
- `/coaches/andrew-mateljan` — no h-scroll; long-form readable
- `/about` — no h-scroll
- `/contact` — no h-scroll
- `/pathway-planner` — no h-scroll
- `/thank-you` — `text-white/30` pipe separator decorative

**No critical h-scroll findings.** ✓

Caveat: full-page PNG sweeps don't catch `100vw` units stutter on iOS Safari URL-bar collapse — defer to Andrew's device pass.

---

## 9. Header / mobile drawer (code-confirmed) ✓

- Focus trap implemented at `Header.tsx:117-148` (Tab / Shift+Tab cycle)
- Body scroll lock at `:94-115`
- Return focus to menu button on close `:110-112`
- Drawer width `w-[320px] max-w-[88vw]` at `:375`
- Programs grid is `grid-cols-2 gap-2` — at 320 viewport minus drawer padding 24×2 = 272px usable, ≈ 132px cards. Tight but functional. **Verify in screenshot.**
- Drawer end shows `<N> players trained` from `siteStats.trustStats.playersCount` (`Header.tsx:486-489`) — **survivorship-gap candidate** vs. Aman pattern (heritage stats). See gap report F4.
- Header opaque on light text ✓ (no translucent-over-hero anti-pattern)

---

## 10. StickyCTA / BackToTop / ChatWidget stacking

- StickyCTA: `md:hidden`, `pb-[calc(12px+env(safe-area-inset-bottom))]`, **black/white CTA** (luxury per cursorrules), reports height to `--lbta-sticky-cta-h` CSS var. ✓
- BackToTop respects `--lbta-sticky-cta-h` + `--lbta-program-bar-h` + `env(safe-area-inset-bottom)` in its `bottom:` calc. ✓
- ChatWidget (GHL custom element) is deferred 4s + first-scroll. Stacking with StickyCTA's right-edge phone icon (56×56 circle at `right-0`) versus GHL launcher (typical position `bottom-right`) is **not visually verifiable** without runtime GHL widget. **Andrew's device pass required.**
- StickyCTA `animate-slide-up` runs unconditionally — see reduced-motion §6.

---

## 11. Pathway planner — synthetic-tuition check

`app/pathway-planner/page.tsx:225-242` correctly says **"Rates vary by program, season, and how often you train…exact tuition is always listed on Schedule & Pricing"** and links to `/schedules` rather than showing dollar amounts client-side. The historical `pathway-calculator-fake-pricing` anti-pattern is **resolved**. ✓

---

## 12. What this audit cannot see (honesty section)

1. **Real iOS Safari behavior** — rubber-band scroll, double-tap-zoom on inputs (need <16px font to trigger), share-sheet on long-press, address-bar collapse changing `100vh`.
2. **Real Android Chrome behavior** — pull-to-refresh consuming top gesture, theme-color status-bar.
3. **Field CrUX p75 numbers** — only lab Lighthouse here.
4. **VoiceOver / TalkBack announce order** — code review only; no live AT runtime.
5. **Keyboard-over-Submit on iOS** — does the soft keyboard cover `/book` Submit button at 390? Not emulatable.
6. **GHL `<chat-widget>` internal DOM** — third-party shadow-DOM custom element, opaque.
7. **3rd-party script INP** — Meta Pixel, GHL widget, GA4 — their runtime cost on INP isn't observable in this lab pass.
8. **Production `next start` numbers** — only `next dev` (Turbopack) captured here. Production Performance is almost certainly 80+ on most pages; the LCP 5–14s is dev artifact.

Andrew's manual pass must close 1–5. Production Lighthouse re-run (against `npm run start` or live `lagunabeachtennisacademy.com`) must close 8.

---

## Scorecard verdict

- **Performance (lab, dev):** fails the 90 bar everywhere. Re-run on `next start` before queuing any work.
- **A11y:** **6 systemic issues** (button-name, select-name, contrast on `/50`–`/70` brand opacity, heading-order, region landmarks, reduced-motion gates). All Quick-win → Medium effort.
- **CLS (`/contact`):** real bug at 0.499 — Medium effort.
- **Brand tokens:** v1.1 lock is holding. No new violations in public flow.
- **Touch targets:** mostly compliant; 2 fixes needed.
- **Mobile-specific layout:** no h-scroll, drawer focus-trap works, single-expand pattern intact.

**Headline:** A11y / contrast is the audit's biggest find. Strong measurement layer + brand system is holding; conversion-flow polish (Curve 1) is mechanical. The conversion-design / luxury-pattern calls (Curve 2) come from the gap report, not this scorecard.
