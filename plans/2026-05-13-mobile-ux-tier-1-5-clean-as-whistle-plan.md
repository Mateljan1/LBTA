# Mobile UX — Tier 1.5: "Clean as a Whistle"

**Date:** 2026-05-13
**Author:** Compound `/compound:plan` (running under Andrew)
**Predecessors:** `plans/2026-05-13-mobile-ux-audit-plan.md`, `plans/2026-05-13-mobile-ux-remediation-plan.md` (Tier 1, shipped main `b50413a`); learn doc `.cursor/compound/learnings/2026-05-13-mobile-ux-tier-1-compound-learn.md`.
**Trigger:** Andrew opened production on his phone, found it "jumpy, doesn't load clean from page to page, slow." Live reproduction (Playwright @ 390×844 on `https://lagunabeachtennisacademy.com`) confirmed 8 concrete findings.
**Branch (proposed):** `mobile-ux-tier-1-5-clean-as-whistle`

---

## 1. Overview

Tier 1 cleaned the **measurable a11y + CLS** layer of the audit. Tier 1.5 finishes what Tier 1 deferred (footer contrast codemod batch 1, StickyCTA hybrid, success-stories iframe + heading + trust-stat polish) **and** addresses the perceived-performance pass Andrew flagged from his phone — Cloudinary `w_1920` on a 390px viewport, hero video shipping bytes on mobile, and Next prefetch firing duplicate RSC payloads on first paint.

Curve mix: ~85% Curve 1 (measurable Lighthouse mobile + axe), ~15% Curve 2 (StickyCTA hybrid, F1 trust-stat copy — both apply audit defaults with explicit disclosure for Andrew override).

---

## 2. Problem Statement

Andrew's real-world friction report, with cited evidence from the 2026-05-13 mobile reproduction:

**A. Perceived performance — mobile feels heavy.**

- **A1.** Carousel + hero requesting `w_1920` Cloudinary images on a 390px viewport. Network captures: `Karue_FH_hero_2`, `Henry_mateljan_4.6_UTR_9yrs_old_backhand`, `Olov_fh_hero`, `andrew_ladies_usta_team`, `Ryan_Seggerman__Serve_Hero` — all at `w_1920,c_limit`. Wasted bandwidth ≈ 5–10× over what the device can render.
- **A2.** `/videos/LBTA-Home-Hero.webm` returning `206 Partial Content` on mobile despite `preload="none"`. `autoPlay` overrides the preload hint per the WHATWG spec; the only reliable mobile gate is to not render the `<video>` element at all below 768px ([MDN: HTMLMediaElement.preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload), [HTML Standard §media](https://html.spec.whatwg.org/multipage/media.html)). Current code (`components/HomeHero.tsx:36-45`) only gates `videoRef.current?.load()` on `≥768px`, not the JSX render.
- **A3.** Multiple RSC prefetches on first paint: `/?_rsc=1r34m`, `/?_rsc=p37cr`, `/book?_rsc=1r34m`, `/schedules?_rsc=1r34m`, `/book?_rsc=p37cr`, `/schedules?_rsc=3jt0h` — all within ~500ms. Next.js default behavior prefetches every viewport-visible `<Link>` ([Next.js docs: Prefetching](https://nextjs.org/docs/app/guides/prefetching)); below-the-fold StickyCTA + Footer Book/Schedules links double up the work.

**B. Brand consistency — header logo broken on mobile.**

- **B1.** Header at 390px renders a small orange icon + "LAGUNA BEACH" text underneath; footer on the same page renders the full "moon + birds + LAGUNA BEACH TENNIS ACADEMY" wordmark. The Header sources `/logos/LBTAblktext.png` at `width={120} height={56}` with `sizes="(max-width: 768px) 100px, 120px"` and `className="h-10 md:h-12 w-auto"` — needs an audit of the asset + sizing.

**C. Contrast — Tier 1 unfinished.**

- **C1.** Footer column headers `Programs / Academy / Contact` rendered as `<h3 class="text-eyebrow text-white/70">` on `bg-brand-deep-water (#0F2237)` measure **~5.4:1** — fails AAA 7:1 ([Footer.tsx:79, 102, 126](components/layout/Footer.tsx)). Tier 1 added `pacific-dusk-soft` for **light** surfaces only; dark-surface white-opacity fix is its own pass.
- **C2.** Footer tagline `Tennis, as it should be taught.` (`text-white/70`) + `Movement · Craft · Community` (`text-white/70`) + body links (`text-white/70`) + map/email/phone icons (`text-white/55`) all on `bg-brand-deep-water`. Same root cause.

**D. StickyCTA — Q3 default empirically validated.**

- **D1.** StickyCTA intercepted a footer link tap during the live reproduction — the exact prediction in `docs/audits/2026-05/findings.md` and `andrew-decisions.md` Q3. The audit's recommended default is **hybrid** (suppress on editorial pages); friction is now confirmed in production, not theoretical.

**E. /success-stories specific bugs.**

- **E1.** Console errors on `/success-stories`: `Unrecognized feature: 'web-share'` and `Allow attribute will take precedence over 'allowfullscreen'`. Source: `components/VideoTestimonials.tsx:66-67` — iframe `allow="...; web-share"` + redundant `allowFullScreen`.
- **E2.** Heading semantics: the page **does** have h1/h2 structure (`<h1>Success Stories</h1>`, `<h2>{story.name}</h2>`, `<h2>More Player Journeys</h2>`). The mobile snapshot interpretation suggests the "Player Stories" eyebrow (`components/VideoTestimonials.tsx:124` — currently `<p>`) may be reading like a section title to screen readers. Audit + decide whether to promote eyebrow to `<h2>` or accept the eyebrow semantics.
- **E3.** "Blank tan area between header and breadcrumb" on first paint. `app/success-stories/page.tsx:138` renders `<div className="pt-20 bg-white">` immediately under the `SeasonBanner` (`bg-brand-morning-light`, warm/tan). Probably perceived empty space, not a real bug — but worth a visual diff against `/about` to confirm consistency.

**F. /success-stories trust-stat — consumer-grade copy still ships.**

- **F1.** Stat block (`app/success-stories/page.tsx:188-194`) renders `{siteStats.trustStats.playersCount} / Players Trained`. Closing CTA section (`app/success-stories/page.tsx:361`) reads `"Join {playersCount} players who have transformed their game at LBTA."`. Tier 1 swapped the **drawer** stat to heritage; the **page** stat is still the consumer-grade metric.

---

## 3. Proposed Solution

Two blocks, ordered so Block A's perf wins land before Block B's polish.

### Block A — Perceived performance (4 commits)

**A1. Cloudinary responsive via custom loader.** New `lib/cloudinary-loader.ts` rewrites the `w_*` segment of any `res.cloudinary.com/dv033eo0x/image/upload/...` URL to match the width Next/Image requests via `srcset`. Carousel + success-stories hero stop using `unoptimized` and instead use `loader={cloudinaryLoader}` so Next/Image emits a real `srcset` with explicit breakpoints (`375, 414, 750, 828, 1080, 1200, 1920`). All sizing comes from Cloudinary's edge CDN — no Vercel `/api/_next/image` hop, no double-compression (Tier 1's `unoptimized` rationale preserved). `w_auto` is NOT used — Cloudinary's `w_auto` requires client-hints headers that Safari/Firefox don't send ([Cloudinary docs: Responsive Images with Client Hints](https://cloudinary.com/documentation/responsive_server_side_client_hints)). 🟢

**A2. Mobile video gate at JSX level.** `components/HomeHero.tsx` adds `useState`-backed `matchMedia('(min-width: 768px)')` check, renders `<video>` only when the query is true. Below 768px, the `Image` poster carries the hero alone. Eliminates the `206 LBTA-Home-Hero.webm` request on mobile. 🟡 — if Lighthouse identifies the poster image as LCP (it should — `priority` is set on the `Image`), this is pure win. Re-measure LCP on mobile preview before promoting to main.

**A3. Prefetch tuning — kill duplicate below-the-fold prefetches.** Set `prefetch={false}` on:
- `components/StickyCTA.tsx` Book + Schedules `<Link>`s (mobile-only; redundant with HomeHero CTA which already prefetches).
- `components/layout/Footer.tsx` Book / Schedule & Pricing `<Link>`s in the Programs and Academy columns.
- `data/homepage-copy.json` carousel slide `ctaHref` is rendered by `PlayerSuccessCarousel` — that's only one visible Link at a time, but it re-mounts on slide change. Adding `prefetch={false}` to that one Link cuts the per-slide RSC churn.

Keep `prefetch=true` (default) on the HomeHero primary CTA — that's the highest-intent above-the-fold link. 🟡 — over-tuning risks slowing desktop route transitions; mitigate via preview A/B (Lighthouse on `/` then click-through to `/book`, compare INP).

**B1. Header logo audit + remediation.** Verify what `/logos/LBTAblktext.png` actually renders at 390px — read the asset, inspect Next/Image srcset selection (`w=128` or `w=256`?), and fix. Likely action: bump `width={120}` → `width={180}` and `height={56}` → `height={54}`, set `sizes="(max-width: 768px) 160px, 180px"`, raise `h-10` → `h-11` on mobile. If the asset itself is the problem (icon-heavy crop), commit a fresh export under `/logos/LBTA-horizontal-black.png` and swap the import. 🟢 — straightforward once the asset is verified.

### Block B — Finish the job (9 commits)

**C1 + C2. Footer contrast — first dark-surface codemod batch.** This is a **new** codemod track, separate from Tier 1's `pacific-dusk-soft` light-surface track. Migrate `text-white/{55,70}` on `bg-brand-deep-water` to `text-white/85` (eyebrows, h3 column heads) and `text-white/90` (body links, taglines) per `.cursorrules` Part 7 dark-surface contrast rule. WebAIM verification before commit:
- `white` (#FFFFFF) on `#0F2237` = 17.5:1 ✓
- `white/95` (#F3F4F5 effective) on `#0F2237` = 16.7:1 ✓
- `white/90` (#E8E9EC) on `#0F2237` = 15.6:1 ✓
- `white/85` (#DDDFE4) on `#0F2237` = 14.4:1 ✓ (chosen for eyebrows — preserves de-emphasis)
- Current `white/70` (#C2C5CB) on `#0F2237` = ~5.4:1 ✗
Scope: `components/layout/Footer.tsx` only in this batch (per the audit's "first 2 codemod follow-up PRs from the manifest" but applied to the dark-surface white-opacity track). Footer is the most-trafficked dark surface; one focused commit, low blast radius. 🟢

**D1. StickyCTA hybrid — apply Q3 default.** Move the suppression decision from per-page imports to a single pathname check in `components/layout/ConditionalLayout.tsx`. Conversion pages keep the StickyCTA; editorial pages strip it. Per `docs/audits/2026-05/andrew-decisions.md` Q3:
- **Suppress** (editorial): `/about`, `/philosophy`, `/coaches`, `/coaches/[slug]` (including `/coaches/andrew-mateljan`), `/success-stories`, `/blog`, `/blog/[slug]`, `/faq`, `/journal`.
- **Keep** (conversion / utility): `/`, `/schedules`, `/schedules/calendar`, `/book`, `/junior-trial`, `/adult-trial`, `/programs`, `/programs/**`, `/contact`, `/pathway-planner`, `/camps`, `/fitness`, `/liveball`, `/match-play`, `/racquet-rescue`, `/beginner-program`, `/high-performance-pathway`.

Implementation: the existing per-page `<StickyCTA />` instances in `app/{about,coaches,contact,liveball,camps,fitness}/page.tsx` and `app/page.tsx` stay in place; `ConditionalLayout` adds a `<main>`-level CSS class or a context that suppresses the bar when on an editorial path. Simpler: add a `useStickyCtaSuppressed()` hook checking pathname and have `StickyCTA` return `null` when suppressed. This avoids touching every page file. **Disclosure (per user request):** applying audit default — Andrew can flip to always-on in one line by deleting the suppression list. 🟡

**E1. iframe attribute cleanup.** `components/VideoTestimonials.tsx:62-71`:
- Drop `web-share` from `allow=` (Safari throws `Unrecognized feature: 'web-share'`).
- Drop redundant `allowFullScreen` (the `allow="...; fullscreen"` already covers it; browsers warn about the precedence).
- Final attrs: `allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"`, no `allowFullScreen`. 🟢

**E2. Heading semantics audit.** Two distinct sub-tasks:
- Confirm `VideoTestimonials.tsx:124` "Player Stories" stays an eyebrow `<p>` (it's a paragraph eyebrow under an `<h2>`, not a missing heading). Document the intentional semantics in a code comment.
- Audit success-stories more broadly via Playwright axe `heading-order` rule re-run; document zero violations. 🟢

**E3. Banner blank-space sanity check.** Visually diff `/success-stories` vs `/about` at 390px first paint. If the breadcrumb spacer (`pt-20 bg-white` in `app/success-stories/page.tsx:138`) feels heavier than peers, trim to `pt-8 md:pt-12 bg-white`. Otherwise document as expected. 🟢

**F1. Trust-stat heritage swap on /success-stories.** Default per Q3-style template (matches Tier 1 drawer swap commit `52969ca` `"Founded 2020 · Official City Partner"`). Two surfaces on `app/success-stories/page.tsx`:
- Stat-block cell (lines 188-194): replace the `{playersCount}` stat with **"ATP Tour Players Trained"** (results-led, matches the page's actual content — Karue, Ryan) rendered as a count or as a stat label. **Default:** swap to a tournament/results-led stat e.g. `"5"` / `"ATP Tour Players Trained"` OR `"2"` / `"ATP Coaches Per Squad"` — Andrew picks; planner picks results-led default since this is the success-stories surface specifically.
- Closing CTA (line 361): replace `"Join {playersCount} players who have transformed their game at LBTA."` → `"Train the way the next chapter of your game is going to be played."` or `"Movement. Craft. Community. Book a trial."` — same craft-led tone. **Default applied:** `"Movement. Craft. Community. Book a trial."`. 🟡 — taste call.

---

## 4. Implementation Steps

### Phase 1 — Block A: Perceived performance (4 commits)

1. `perf(cloudinary): add custom loader for srcset breakpoints` — new `lib/cloudinary-loader.ts` (pure function, takes existing Cloudinary URL + width, rewrites `w_{N}` segment). Unit test ensures it preserves all other transforms (`f_auto`, `q_auto`, `e_improve:N`, `e_gamma:N`, `c_limit`, `c_fill`, `g_auto:faces`). **Files:** `lib/cloudinary-loader.ts` (new), `lib/__tests__/cloudinary-loader.test.ts` (new).
2. `perf(home/success-stories): use cloudinary loader, drop unoptimized` — switch `PlayerSuccessCarousel` Image + `app/success-stories/page.tsx` hero Image + each story card Image to use the loader with `unoptimized={false}`. Confirm carousel still bypasses Vercel `/api/_next/image` (the loader returns Cloudinary URLs directly — Next emits the srcset with our URLs, no proxy). **Files:** `components/home/PlayerSuccessCarousel.tsx`, `app/success-stories/page.tsx`.
3. `perf(home): mobile video gate at JSX level` — replace `<md:` `videoRef.load()` gate with `useState`-backed `matchMedia('(min-width:768px)')` check; only render `<video>` JSX when true. Hold the `setVideoPlaying` opacity transition. **Files:** `components/HomeHero.tsx`.
4. `perf(prefetch): kill duplicate below-the-fold prefetches on mobile-impacting routes` — `prefetch={false}` on StickyCTA Book/Schedules, Footer Book/Schedule&Pricing, PlayerSuccessCarousel slide CTA. Add inline code comments citing the audit reproduction. **Files:** `components/StickyCTA.tsx`, `components/layout/Footer.tsx`, `components/home/PlayerSuccessCarousel.tsx`.

Optional Phase 1 commit (decided in Phase 1, not pre-committed here):
4a. `fix(header): logo asset sizing for mobile wordmark legibility` — only commits if the screenshot diff confirms the asset is being clipped/served too small. **Files:** `components/layout/Header.tsx`, possibly a new asset under `/public/logos/`.

### Phase 2 — Block B: Finish the job (8 commits)

5. `fix(footer-a11y): bump white-opacity text → AAA on deep-water` — single-file codemod on `Footer.tsx`: `/70 → /90` for body/tagline, `/70 → /85` for eyebrows, `/55 → /85` for icons. Visual diff at 320/375/768. **Files:** `components/layout/Footer.tsx`.
6. `feat(sticky-cta): hybrid suppression on editorial routes` — pathname-based gate inside `StickyCTA` returns `null` for the editorial allowlist. Audit Q3 default; comment cites `andrew-decisions.md`. **Files:** `components/StickyCTA.tsx` (export hook + early return) OR new `lib/sticky-cta-routes.ts` (allowlist), `components/StickyCTA.tsx`. **NOTE:** the StickyCTA was already removed from `/about`, `/coaches`, `/contact`, etc. — actually wait, the audit/grep showed StickyCTA IS rendered on `/about` (line 365), `/coaches` (CoachesPageClient line 17), `/contact` (line 504). So the gate adds the suppression centrally. Per-page `<StickyCTA />` imports stay, the component itself decides whether to render.
7. `fix(success-stories): remove web-share + redundant allowFullScreen` — VideoTestimonials iframe attrs cleanup. **Files:** `components/VideoTestimonials.tsx`.
8. `chore(success-stories): document eyebrow semantics, verify heading-order` — code-comment + re-run axe `heading-order` rule on `/success-stories` to confirm zero violations. **Files:** `components/VideoTestimonials.tsx` (comment-only), `docs/audits/2026-05/post-remediation/axe-validate/success-stories-tier1-5.json` (new).
9. `chore(success-stories): trim breadcrumb-spacer if heavy` — only commits if the visual diff confirms. Otherwise no-op commit; document the no-op in `validate-summary-tier-1-5.md`. **Files:** `app/success-stories/page.tsx` (optional).
10. `feat(copy): swap success-stories trust-stat → heritage/results-led` — replace stat-block cell + closing CTA copy per defaults above. Disclosure that this is a taste-default; Andrew can revert in one line by changing two string literals. **Files:** `app/success-stories/page.tsx`.
11. `docs(audit): tier-1.5 codemod batch 1 manifest delta` — append to `docs/audits/2026-05/post-remediation/codemod-manifest.md` noting the Footer batch landed and the original `pacific-dusk-soft` light-surface codemod batches remain queued. **Files:** `docs/audits/2026-05/post-remediation/codemod-manifest.md`.
12. `docs(audit): tier-1.5 deploy summary` — `docs/audits/2026-05/post-remediation/tier-1-5-deploy-summary.md` with before/after numbers, screenshot links, health:prod exit code, smoke results. **Files:** `docs/audits/2026-05/post-remediation/tier-1-5-deploy-summary.md` (new).

### Phase 3 — Verification (single commit if findings; otherwise validate-summary only)

13. Re-run scorecard against **production preview** (not dev): mobile Lighthouse on `/` and `/success-stories`, axe-validate sweep on all 11 routes, manual Playwright @ 390×844 for visual confirmation. Output goes under `docs/audits/2026-05/post-remediation/tier-1-5/` mirroring the Tier 1 post-remediation directory.

### Step dependencies

- **Tier 1 prerequisites (already shipped):** `pacific-dusk-soft` token + `forbiddenTextOpacityOnLight` scanner + `SeasonBanner` SSR + `useSearchParams` Suspense isolation. All present on main `b50413a`. This plan does not re-touch any of them.
- **Within Phase 1:** Commits 1 → 2 are sequential (loader must exist before consumers can import). Commits 3, 4 are independent of 1/2 and each other; can be parallelized in separate commits within the same branch.
- **Within Phase 2:** Commits 5–10 are all independent (different files, no shared state). 11, 12 depend on 5–10 landing first (they document the result).
- **Phase 3:** Depends on the full Phase 1 + Phase 2 deploy preview. Single-source verification.

---

## 5. Files to Create / Modify

### Human table

| Status | Path | Purpose | Commit |
|---|---|---|---|
| new | `lib/cloudinary-loader.ts` | Custom Next/Image loader for Cloudinary; rewrites `w_*` segment per width request | 1 |
| new | `lib/__tests__/cloudinary-loader.test.ts` | Unit tests — preserves transforms, handles missing `w_*`, fallbacks | 1 |
| modify | `components/home/PlayerSuccessCarousel.tsx` | Use loader, drop `unoptimized`, add `prefetch={false}` to slide CTA | 2, 4 |
| modify | `app/success-stories/page.tsx` | Hero + story cards use loader; trust-stat + closing CTA copy; optional spacer trim | 2, 9, 10 |
| modify | `components/HomeHero.tsx` | Mobile video gate at JSX level (matchMedia) | 3 |
| modify | `components/StickyCTA.tsx` | `prefetch={false}` on Book + Schedules links; pathname-based suppression early-return | 4, 6 |
| modify | `components/layout/Footer.tsx` | `prefetch={false}` on /book + /schedules; white-opacity → AAA on deep-water | 4, 5 |
| modify | `components/layout/Header.tsx` | (Phase 1 optional) Logo intrinsic dimensions + sizes; possibly swap asset | 4a |
| modify | `components/VideoTestimonials.tsx` | iframe `allow=` cleanup; eyebrow semantics comment | 7, 8 |
| new (optional) | `lib/sticky-cta-routes.ts` | Suppression allowlist (extracts magic strings out of component) | 6 |
| new | `docs/audits/2026-05/post-remediation/tier-1-5/lighthouse/` | Preview Lighthouse JSONs for `/` and `/success-stories` | 13 |
| new | `docs/audits/2026-05/post-remediation/tier-1-5/axe-validate/` | Axe re-validation JSONs (11 routes) | 13 |
| new | `docs/audits/2026-05/post-remediation/tier-1-5/validate-summary.md` | Phase 3 results, deltas vs Tier 1 baseline | 13 |
| new | `docs/audits/2026-05/post-remediation/tier-1-5-deploy-summary.md` | Tier 1.5 deploy summary, health:prod, smoke | 12 |
| modify | `docs/audits/2026-05/post-remediation/codemod-manifest.md` | Append note: footer dark-surface batch landed | 11 |
| no change | `tokens/lbta-web-tokens.json` | Token already exists (`pacific-dusk-soft` from Tier 1); white-opacity codemod uses Tailwind opacity utilities, not a new token | — |

### Machine YAML

```yaml
plan_id: 2026-05-13-mobile-ux-tier-1-5
phase_1:
  - path: lib/cloudinary-loader.ts
    action: create
    purpose: Cloudinary Next/Image loader; rewrites w_* per requested width
  - path: lib/__tests__/cloudinary-loader.test.ts
    action: create
    purpose: Unit tests for the loader
  - path: components/home/PlayerSuccessCarousel.tsx
    action: modify
    changes:
      - use lib/cloudinary-loader.ts; remove unoptimized prop
      - add prefetch={false} on slide CTA <Link>
  - path: app/success-stories/page.tsx
    action: modify
    changes:
      - use lib/cloudinary-loader.ts on hero + story cards; remove unoptimized
  - path: components/HomeHero.tsx
    action: modify
    changes:
      - replace videoRef.load() viewport gate with matchMedia-based JSX gate
      - <video> element rendered only when min-width:768px is true
  - path: components/StickyCTA.tsx
    action: modify
    changes:
      - prefetch={false} on Book + Schedules links
  - path: components/layout/Footer.tsx
    action: modify
    changes:
      - prefetch={false} on /book and /schedules anchors
  - path: components/layout/Header.tsx
    action: modify
    purpose: B1 logo audit + remediation (CONDITIONAL on visual reproduction)
phase_2:
  - path: components/layout/Footer.tsx
    action: modify
    changes:
      - text-white/55 -> text-white/85 (icons)
      - text-white/70 -> text-white/85 (eyebrows: Programs/Academy/Contact h3 + Training sites label)
      - text-white/70 -> text-white/90 (body links, taglines, contact line)
  - path: components/StickyCTA.tsx
    action: modify
    changes:
      - pathname-based suppression early-return (editorial allowlist)
  - path: lib/sticky-cta-routes.ts
    action: create_optional
    purpose: extract suppression allowlist out of StickyCTA component
  - path: components/VideoTestimonials.tsx
    action: modify
    changes:
      - drop web-share from allow=
      - drop redundant allowFullScreen attr
      - add eyebrow-semantics code comment
  - path: app/success-stories/page.tsx
    action: modify
    changes:
      - replace stat-block "(N) Players Trained" cell with results-led heritage stat default
      - replace closing CTA "Join (N) players who have transformed their game" with craft-led default
      - (optional) trim pt-20 breadcrumb spacer to pt-8 md:pt-12 if visual diff confirms
phase_3:
  - path: docs/audits/2026-05/post-remediation/tier-1-5/
    action: create
    purpose: Validate sweep outputs (Lighthouse, axe, summary)
  - path: docs/audits/2026-05/post-remediation/tier-1-5-deploy-summary.md
    action: create
    purpose: Tier 1.5 deploy summary
  - path: docs/audits/2026-05/post-remediation/codemod-manifest.md
    action: modify
    changes:
      - append: "Footer dark-surface white-opacity batch landed 2026-05-13 (Tier 1.5)"
out_of_scope:
  - app/coach-hub/**
  - components/coach-hub/**
  - components/coach-hub-coach/**
  - tier_2_curve_2_questions: [Q1, Q2, Q4]
  - light_surface_codemod_batches: PR2..PR6 of original codemod-manifest.md
  - brand_visual_redesign
```

---

## 6. Out of scope (this plan)

- **Coach-hub workstream** (`app/coach-hub/**`, `components/coach-hub/**`, `components/coach-hub-coach/**`). Per `.cursorrules` and Tier 1 learn doc — coach-hub gets its own audit + remediation when Andrew is ready.
- **Tier 2 Curve-2 questions Q1, Q2, Q4** (mobile nav redesign, modal bottom-sheet variant, hero stack trim) — parked per Andrew's call cadence on `andrew-decisions.md`.
- **Remaining 4 light-surface codemod batches** (PR2–PR6 in `codemod-manifest.md`) — `/schedules` family, `/programs` family, `/about`+`/coaches`+`/contact` family, `/camps`+`/racquet-rescue`+misc, Modals + cards, internal `/brand`. Each is its own ≤40-file PR.
- **Brand visual redesign** — not in this loop.
- **Real-device iOS Safari / Android Chrome manual pass** — still deferred to Andrew (Tier 1 deferred this; Tier 1.5 will surface a fresh real-device finding list but does not block on it).
- **Production CrUX field data** — deferred to Andrew's PSI / Search Console pass (Tier 1 also deferred).

---

## 7. Success Criteria

| ID | Criterion | Measurement |
|---|---|---|
| SC-1 | Mobile homepage hero+carousel image payload reduces ≥ 30% vs pre-Tier-1.5 baseline | Lighthouse network-payload audit on `/` mobile preview, before vs after |
| SC-2 | Lighthouse Mobile Performance ≥ 75 on `/` and `/success-stories` (production build, not dev) | `npm run build && npm run start` + Lighthouse mobile run on each URL |
| SC-3 | Footer contrast: 0 axe `color-contrast` violations inside the `<footer>` element on the 11 audited routes | `npm run audit:axe` post-deploy preview |
| SC-4 | StickyCTA absent on editorial routes | Playwright snapshot on `/about`, `/coaches`, `/coaches/andrew-mateljan`, `/success-stories`, `/philosophy`, `/blog`; assert `[data-sticky-cta]` not in DOM |
| SC-5 | `/success-stories` console: 0 iframe-attribute errors | Playwright `page.on('console')` recording on `/success-stories` first paint + scroll-to-VideoTestimonials |
| SC-6 | `/success-stories` axe `heading-order` rule: 0 violations | Axe-validate JSON for `/success-stories` |
| SC-7 | Trust-stat: 0 "(N) players trained" or "Players Trained" strings on customer-facing pages | `rg "(N) players trained|Players Trained|players who have transformed"` against `app/**` and `components/**` excluding `coach-hub/` |
| SC-8 | Mobile `LBTA-Home-Hero.webm` not requested at 390×844 | Playwright network capture on `/` mobile preview — no entry matching `LBTA-Home-Hero.webm` |
| SC-9 | RSC prefetch count on `/` first paint ≤ 2 distinct requests within first 500ms | Playwright network capture; count `_rsc=` requests within 500ms of `domcontentloaded` |
| SC-10 | Header logo renders the full wordmark legibly at 390px (subjective — visual screenshot vs Footer logo as reference) | Playwright screenshot at 390×844; reviewer (Andrew) compares Header vs Footer logo legibility |

---

## 8. Acceptance checklist

Every Success Criterion has a concrete check.

- [ ] **AC-1 (SC-1):** Run `lighthouse https://<preview-url>/ --preset=mobile --form-factor=mobile --output=json -A docs/audits/2026-05/post-remediation/tier-1-5/lighthouse/home.json`. Compare `audits['total-byte-weight']` and `audits['unused-bytes']` `numericValue` against `docs/audits/2026-05/post-remediation/lighthouse-validate/home.report.json`. Image-category bytes must drop ≥ 30%.
- [ ] **AC-2 (SC-2):** Same Lighthouse JSONs, read `categories.performance.score` × 100; assert ≥ 75 for `/` and `/success-stories`. (Note: dev-mode numbers do not count — must be preview build.)
- [ ] **AC-3 (SC-3):** `node scripts/audit/axe-sweep.mjs` (already exists) against preview URL; assert `result.violations.filter(v => v.id === 'color-contrast' && v.nodes.some(n => n.target.some(t => t.includes('footer')))).length === 0` for all 11 routes.
- [ ] **AC-4 (SC-4):** Playwright script visits each of `[/about, /coaches, /coaches/andrew-mateljan, /success-stories, /philosophy, /blog, /faq]`, scrolls to `window.scrollY > 500`, asserts `await page.locator('div.md\\:hidden[class*="fixed bottom-0"]').count() === 0`.
- [ ] **AC-5 (SC-5):** Playwright `page.on('console', m => errors.push(m))` while loading `/success-stories`, scrolling to VideoTestimonials section, waiting 3s. Filter `errors.filter(e => /web-share|allowfullscreen/i.test(e.text())).length === 0`.
- [ ] **AC-6 (SC-6):** From AC-3 sweep output, `axe['/success-stories'].violations.filter(v => v.id === 'heading-order').length === 0`.
- [ ] **AC-7 (SC-7):** `rg -i "players trained|players who have transformed" app/ components/ --glob '!coach-hub/**' --glob '!**/__tests__/**'` returns zero matches.
- [ ] **AC-8 (SC-8):** Playwright route filter on `/` at 390×844: `requests.filter(r => /LBTA-Home-Hero\.webm/.test(r.url())).length === 0`.
- [ ] **AC-9 (SC-9):** Playwright at 390×844 on `/`: after `domcontentloaded` event, wait 500ms, then count `requests.filter(r => /_rsc=/.test(r.url())).length` — assert ≤ 2.
- [ ] **AC-10 (SC-10):** Playwright takes `/` and `/about` screenshots at 390×844; cropped header strip uploaded to `docs/audits/2026-05/post-remediation/tier-1-5/screenshots/`. Manual reviewer sign-off (Andrew during deploy).
- [ ] **AC-Tests:** All existing tests still pass (`npm test`, `npm run tokens:check`, `npm run lint`).
- [ ] **AC-Ship:** `npm run ship:gate` passes after every commit; final `health:prod` exit 0 after main merge.

---

## 9. Confidence & uncertainty

| Item | Confidence | Rationale |
|---|---|---|
| A1 Cloudinary responsive (custom loader, explicit breakpoints) | 🟢 high | Cloudinary delivers all widths from edge; loader is pure URL rewrite; Tier 1's `unoptimized` rationale (no double-compression) preserved because loader returns Cloudinary URLs, not `/api/_next/image` URLs. |
| A2 Mobile video gate at JSX level | 🟡 medium | Depends on poster carrying LCP cleanly. `Image` already has `priority`. If Lighthouse identifies `<video>` as LCP on mobile preview, recheck — but with `preload="none"` + autoplay, the autoplay still triggers a fetch (proven by 206 in audit). Removing the JSX is the only reliable mobile fix. |
| A3 Prefetch tuning | 🟡 medium | Over-tuning can regress route-transition snappiness, especially on desktop. Mitigation: A/B preview before main merge; only tune below-the-fold links; keep HomeHero CTA prefetched. |
| B1 Header logo | 🟢 high once asset audited | Worst case: bump width/height intrinsic and adjust `sizes`. Best case: swap to a horizontal-wordmark asset. |
| C1/C2 Footer contrast | 🟢 high | White-opacity ratios on `#0F2237` computed via WebAIM. Single-file change, no token introduction needed. |
| D1 StickyCTA hybrid | 🟡 medium | Andrew hasn't formally signed off on Q3 (deadline was 2026-05-20). Applying audit default per user's plan brief. **Disclosure:** Andrew can revert to always-on by deleting the suppression list in one edit. |
| E1 iframe attrs | 🟢 high | Spec-aligned cleanup; both warnings are documented by Safari/Chromium. |
| E2 heading-order | 🟢 high | Already passing structurally — confirming via axe is mechanical. |
| E3 banner blank space | 🟢 high | Visual diff is straightforward; either trim spacer or document. |
| F1 trust-stat swap | 🟡 medium | Taste call. Applying results-led default since this is the success-stories page (results-led copy is on-brand for that page). **Disclosure:** two string literals; one-edit revert. |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Cloudinary `w_auto` would simplify the loader, but is Chrome-only via client hints — if anyone tries to "improve" the loader by adding `w_auto`, Safari/Firefox will fall back to a single bloated width | low (mitigation is correct from the start) | Loader explicitly uses explicit-breakpoint rewrites, not `w_auto`. Code comment cites Cloudinary docs + this plan. |
| Cloudinary plan tier limits — if the LBTA Cloudinary account is on a tier that caps total delivery bandwidth, multiplying srcset variants (~7 per image × 5 carousel slides + 5 hero/cards = ~70 unique URLs) could shift bandwidth profile | low — Cloudinary edge caches these aggressively, and bandwidth per request goes DOWN | Verify account tier before merging Phase 1 commit 2. Cloudinary delivers ~7 cached variants × 10 source images = 70 keys, well below any tier's cap. |
| StickyCTA suppression reduces conversion measurement on editorial pages | low | Booking CTA still appears in the page footer + hero of those pages (verified — every editorial page has at least one in-content CTA). Add a `data-cta-source="page-body"` analytics tag on the in-content CTAs for downstream measurement. |
| Prefetch tuning regression on desktop route transitions | medium | A/B test on preview: Lighthouse on `/` then click `Book` link, measure INP. If INP regresses >50ms on desktop, revert Footer prefetch=false (keep StickyCTA + carousel changes). |
| Mobile video gate breaks reduced-motion path | low | Existing `reduceMotion` check already returns `null` for the video block. New matchMedia check is additive; both gates respected. |
| Footer contrast bump changes the visual weight of the section | low | Visual diff at 320/375/768 included in commit message. White/85 vs current /70 is a noticeable but on-brand luxury restraint shift (more readable on dark navy, still feels editorial). |
| F1 trust-stat default ("ATP Tour Players Trained") might overstate the count | medium | Verify count of ATP-affiliated trainees on the page (Karue ATP #262, Ryan ATP #72 — at least 2). Default to a results-oriented stat that's literally true. If Andrew wants the heritage stat ("Founded 2020 · Official City Partner") for consistency with the drawer, that's a one-line edit on the closing CTA + a swap on the stat-block cell label. |
| Phase 1.4a (header logo) might require a fresh asset upload | low | If commit 4a needs a new asset, generate from Figma / source, save to `public/logos/LBTA-horizontal-black.png`, document the swap in commit body. Asset audit happens during Work, not Plan. |

---

## 11. Risks with gates

- **Gate-1: Cloudinary loader regression on a non-`w_*` URL.** If `lib/cloudinary-loader.ts` encounters a Cloudinary URL without a `w_*` segment (e.g. a future URL using `c_scale,w_auto`), the loader must fall through to the original URL untouched and emit a single-width srcset, not throw. **Gate:** unit test `cloudinary-loader.test.ts` covers this branch.
- **Gate-2: Cloudinary `w_auto` not supported / unexpected behavior.** Not applicable to this plan — we explicitly chose explicit-breakpoint rewrites, not `w_auto`. **Pre-emptive gate:** code comment in `lib/cloudinary-loader.ts` cites this decision; the loader does NOT inject `w_auto` even as a fallback. If a future plan revisits this, it needs its own gate.
- **Gate-3: Mobile video poster is identified as LCP element by Lighthouse preview run on mobile.** **Required:** confirmed before main merge. If poster IS LCP (expected), proceed. If poster is NOT LCP, investigate — the gate before Phase 2 starts.
- **Gate-4: Prefetch tuning desktop INP regression > 50ms.** **Required:** A/B Lighthouse on preview before main merge. If regressed, revert Footer + carousel `prefetch={false}`, keep only StickyCTA change.
- **Gate-5: Footer color-contrast residual.** **Required:** axe-validate run on preview confirms 0 footer color-contrast violations. If any survive, escalate the specific selector to white/100 (solid).
- **Gate-6: StickyCTA editorial-route suppression accidentally suppresses on a kept route.** **Required:** AC-4 Playwright check on all 7 editorial routes AND a parallel Playwright check on `/` and `/schedules` confirming StickyCTA IS present after scroll. Both gates must pass.

---

## 12. Decision lenses

**Curve check (per `.cursorrules` Part 21 + `decision-lenses.mdc`):**
- **A1, A2, A3, B1, C1+C2, E1, E2, E3, SC-7 search/replace** — Curve 1. Measurable, capped payoff. DRAG it: draft → research (done above) → analysis (done) → ship. Stop polishing at ~85%.
- **D1 (StickyCTA hybrid), F1 (trust-stat copy)** — Curve 2 (taste). Audit defaults applied with disclosure; Andrew can override in one edit.

**Loss-function iteration (single primary metric this cycle):** Pass A score on the mobile audit scorecard. Tier 1 moved 65 → 86. Tier 1.5 target: **86 → 92+**, with explicit Mobile Lighthouse Performance for `/` and `/success-stories` measured on production build (Tier 1's `workLighthouseProductionBuild` quality bar — we MUST re-run on `next build && next start`, not dev).

**Pre-mortem — top 3 ways this ships and Andrew's phone STILL feels jumpy:**

1. **Cloudinary loader gets the rewrite right, but `priority` is not on the carousel slide-0 anymore.** Mitigation: confirm `priority={safeIndex === 0}` survives the loader switch in `PlayerSuccessCarousel.tsx` commit 2.
2. **Mobile video gate works for the homepage, but the carousel images now load via Cloudinary at higher quality (`q_auto:best` for USTA + Ryan) — net effect feels heavy because the network is still saturated on slide change.** Mitigation: keep slide prefetch (`img.src = slides[next].image`) at the RESPONSIVE width (375 or 414), not 1920. Update `PlayerSuccessCarousel.tsx:67-74` to construct the preload URL via the same loader at mobile width.
3. **StickyCTA suppression on editorial pages, but the SeasonBanner + Header + content load order still has a noticeable second-paint pop on first navigation.** Mitigation: Tier 1's SeasonBanner SSR fix should already prevent this. Verify post-deploy on `/about` and `/coaches/andrew-mateljan` with the audit harness.

**Ghost-notes (what's NOT in the plan but probably should be eventually):**
- Real-device VoiceOver iPhone pass. Still deferred.
- Field CrUX vs lab Lighthouse parity. Still deferred.
- iOS Safari rubber-band + safe-area-inset interplay on the now-suppressed editorial pages — does anything LOOK off without the StickyCTA's bottom padding? `<main>` already has `max-md:pb-[calc(var(--lbta-sticky-cta-h,0px)+...)]` — when StickyCTA is suppressed, the CSS var stays at `0px`, so layout is correct. Documented; no action.

---

## 13. Tier 1.5 commit-by-commit outline

Branch: `mobile-ux-tier-1-5-clean-as-whistle`

Phase 1 (4 + 1 conditional):
1. `perf(cloudinary): add custom Next/Image loader with explicit breakpoint rewriting`
2. `perf(home,success-stories): use cloudinary loader for srcset, drop unoptimized`
3. `perf(home): mobile video gate at JSX level (matchMedia)`
4. `perf(prefetch): kill duplicate below-fold prefetches on sticky-cta + footer + carousel CTA`
4a. *(conditional)* `fix(header): logo asset sizing for mobile wordmark legibility`

Phase 2 (8):
5. `fix(footer-a11y): bump white-opacity text → AAA on deep-water`
6. `feat(sticky-cta): hybrid suppression on editorial routes (Q3 audit default)`
7. `fix(success-stories): remove web-share + redundant allowFullScreen from iframe`
8. `chore(success-stories): document eyebrow semantics; verify heading-order`
9. `chore(success-stories): trim breadcrumb-spacer if heavy (conditional)`
10. `feat(copy): swap success-stories trust-stat → results-led default`
11. `docs(audit): tier-1.5 codemod-manifest delta`
12. `docs(audit): tier-1.5 deploy summary`

Phase 3 (validation; new docs only — no source change):
13. `docs(audit): tier-1.5 preview validate sweep`

Total: 12 + 1 conditional + 1 docs = 13–14 commits.

---

## 14. Risks parked for Andrew (cannot decide without input)

1. **F1 default — heritage stat OR results-led stat?** Default applied: results-led ("ATP Tour Players Trained" / closing CTA "Movement. Craft. Community. Book a trial."). Andrew can flip to heritage in two edits.
2. **D1 StickyCTA editorial allowlist boundary.** Default applied: per audit `andrew-decisions.md` Q3 (about/philosophy/coaches/coaches-slug/success-stories/blog/blog-slug/faq/journal). If Andrew wants `/contact` or `/programs/*` added to editorial, that's a one-line edit on the suppression set.
3. **Header logo asset.** Audit during Work — may need a fresh asset upload to `public/logos/` if the existing `LBTAblktext.png` doesn't render legibly at 180×54. Andrew may want to provide a specific asset rather than re-using the existing one.

---

## 15. References

- Tier 1 learn: `.cursor/compound/learnings/2026-05-13-mobile-ux-tier-1-compound-learn.md`
- Audit scorecard: `docs/audits/2026-05/scorecard.md`
- Audit gap report: `docs/audits/2026-05/gap-report.md`
- Andrew-decisions: `docs/audits/2026-05/andrew-decisions.md`
- Codemod manifest: `docs/audits/2026-05/post-remediation/codemod-manifest.md`
- Tier 1 deploy summary: `docs/audits/2026-05/post-remediation/deploy-summary.md`
- Cloudinary docs (responsive client hints, why we DON'T use `w_auto`): [https://cloudinary.com/documentation/responsive_server_side_client_hints](https://cloudinary.com/documentation/responsive_server_side_client_hints)
- Cloudinary docs (image optimization, why we use `f_auto,q_auto` + explicit `w_*`): [https://cloudinary.com/documentation/image_optimization](https://cloudinary.com/documentation/image_optimization)
- Next.js prefetch semantics: [https://nextjs.org/docs/app/guides/prefetching](https://nextjs.org/docs/app/guides/prefetching)
- HTMLMediaElement.preload (autoplay overrides preload="none"): [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload)
- HTML Standard, media element: [https://html.spec.whatwg.org/multipage/media.html](https://html.spec.whatwg.org/multipage/media.html)
- `.cursorrules` Part 6 (perf bar), Part 7 (color tokens), Part 10 (logo usage), Part 11 (animation), Part 15 (ship gate), Part 21 (Intelligent AI Usage — Curve check)
- `.cursor/rules/decision-lenses.mdc` (decision OS, premortem, ghost notes)

---
