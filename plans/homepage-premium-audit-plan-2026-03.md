# Homepage premium audit — verification + implementation plan

**Created:** 2026-03-27  
**Source:** Stakeholder audit (design, photography, UX, conversion, dev)  
**Method:** Compound `/compound plan` — codebase verification + prioritized roadmap

---

## Overview

The audit correctly identifies **strategic gaps** (iconic visual system, faster path-to-fit, proof earlier, CTA consistency). This plan **verifies each concrete claim against the repo** and turns them into **phased, file-scoped work** aligned with `.cursorrules` (single source of truth in `/data`, brand tokens, no forbidden copy).

---

## Problem statement

The homepage is strong locally but needs **precision**: consistent labels, trust signals earlier, clearer routing for cold traffic, and technical/QA hardening — without abandoning the existing brand line or luxury restraint.

---

## Verification: audit vs codebase

| Audit claim | Verified in repo | Notes |
|-------------|------------------|--------|
| Footer email display ≠ mailto | **Yes — bug** | `Footer.tsx`: visible text `support@lbta.com`, `href=mailto:support@lagunabeachtennisacademy.com`. Schema on `app/page.tsx` uses `support@lagunabeachtennisacademy.com`. **Pick one canonical address and align visible text, mailto, aria-label, JSON-LD.** |
| `Camp` vs `Camps` | **Yes** | `Header.tsx` `navigation`: `{ name: 'Camp', href: '/camps' }`. Mega-menu and `Footer` use **Camps**. Standardize to **Camps** (or **Camp** everywhere — prefer **Camps** to match `/camps`). |
| CTA label drift (Book Trial / Book a Trial / Request a Trial) | **Yes** | `homepage-copy.json`: hero `Book a Trial`, CTA form `Request a Trial`, sticky `Book Trial`. Header CTA `Book Trial`. **Needs a deliberate taxonomy** (see Proposed solution). |
| `OpenStarts` in announcement bar | **Not found as literal string** | `SeasonBanner` + `getSeasonCTA()` build `headline` as `` `${season.name} Registration Open` `` and `subline` with `Starts ${date}...`. Spacing in TS looks correct. **If “OpenStarts” still appears in browser**, QA: mobile vs desktop (subline `hidden sm:inline`), wrapping, or **data** in `year2026.json` season `name`. Add explicit separator or `&shy;` only if reproduced. |
| Stats / proof “too low” | **Partially** | Current **home order**: `HomeHero` → `HorizonDivider` → **Founder** → **stat-strip** → `PlayerSuccessCarousel` → … Audit wants a **trust ribbon immediately under hero**. Today stats follow **founder**. Reordering is a **medium/large change** (IA + design). |
| Hero: single CTA only | **Yes** | `HomeHero.tsx`: one primary `Link`; no secondary CTA. |
| Hero subhead junior-skew | **Review copy** | `homepage-copy.json` `hero.subline` — tune to explicitly include adults (data-only change). |
| FAQ schema missing | **Incorrect for homepage** | `FAQSection.tsx` injects `FAQPage` JSON-LD from `data/faq.json`. **FAQ page** also uses `FAQSchema`. **Enhancement:** dedupe/validate schema if FAQ content diverges across surfaces. |
| Photography / reshoot | **Asset work** | Out of code scope; brief can live in `docs/` or Canva pipeline. |
| Performance (hero video, galleries, chat) | **Plausible** | Hero uses WebM + legacy MP4; galleries/carousels exist. **Measure** with Lighthouse / Web Vitals before large refactors. |

---

## Proposed solution (architecture)

1. **Quick wins (trust + polish):** Fix footer email, nav label, and document **one CTA vocabulary** in `data/` or `lib/site-copy.ts`, then replace string literals progressively.
2. **IA (optional phases):** Move stat-strip (or a slimmer **trust ribbon**) directly under hero — requires `app/page.tsx` section reorder and possible visual adjustment so founder still flows.
3. **Hero upgrade:** Add secondary CTA (e.g. Schedule & Pricing → `/schedules`) from `homepage-copy.json` + `HomeHero` layout; keep primary solid button per WCAG on dark.
4. **Conversion clarity:** Differentiate **Book a trial** (routes to `/book`) vs **Request a trial** (form submit) in copy — audit’s three-funnel model maps to existing routes; avoid renaming everything to one phrase if semantics differ.
5. **Chat widget:** Defer load and/or restyle using brand tokens — isolated changes in `ChatWidget.tsx` + optional `next/dynamic`.
6. **Analytics:** Add events (GTM or `lib/form-analytics` extension) — only after naming convention locked.

(Source: codebase grep + `Header.tsx`, `Footer.tsx`, `HomeHero.tsx`, `homepage-copy.json`, `season-utils.ts`, `FAQSection.tsx`.)

---

## Implementation steps

### Phase 1 — Critical trust & QA (this week)

- [ ] **1.1** `Footer.tsx`: Set visible email + `mailto` + `aria-label` to the **same** canonical address (recommend `support@lagunabeachtennisacademy.com` to match schema + mailto today).
- [ ] **1.2** `Header.tsx`: Rename nav item `Camp` → `Camps` (line ~49); update file comment if it says `Camp`.
- [ ] **1.3** Reproduce **SeasonBanner** on local + prod; if “OpenStarts” appears, fix at source (`SeasonBanner` spacing or `getSeasonCTA` / `year2026.json` copy).
- [ ] **1.4** Add **`siteStats` trust chips** under hero CTAs OR **move `stat-strip`** — pick one for Phase 1 to avoid double stats. (Audit priority: trust **under hero**.)
- [ ] **1.5** Document CTA glossary in `lib/site-copy.ts` or `data/site-copy.json` (primary: header/sticky; hero; form submit) and open follow-up tickets to align strings.

### Phase 2 — Hero + navigation clarity

- [ ] **2.1** `homepage-copy.json` + `HomeHero.tsx`: Add `ctaSecondary` + `ctaSecondaryHref` (e.g. “View schedule & pricing” → `/schedules`).
- [ ] **2.2** `homepage-copy.json`: Revise `hero.subline` to explicitly welcome juniors **and** adults (keep tone; avoid forbidden words per `.cursorrules`).
- [ ] **2.3** Optional: remove **Home** from primary nav or demote to logo-only; add **Results** or anchor to `#results` — update `Header.tsx` + mobile drawer.

### Phase 3 — Programs / proof / community (larger)

- [ ] **3.1** `homepage-copy.json` `programs.groups`: Add hierarchy or copy hints (primary: Juniors / Adults / Private vs secondary experiences) — may need component tweaks in `app/page.tsx` program grid.
- [ ] **3.2** `WhyChoose` + `HomeCommunityGallery`: Reduce image fatigue — fewer tiles or stronger `objectPosition`; data-driven list in JSON.
- [ ] **3.3** `VideoTestimonials`: Consider static featured three + “More stories” vs auto-carousel — product decision.

### Phase 4 — Technical

- [ ] **4.1** Run Lighthouse on home (mobile + desktop); address LCP (hero poster/video), CLS, lazy images below fold.
- [ ] **4.2** `ChatWidget`: `ssr: false`, `loading` lazy, delay mount after scroll or 3–5s; restyle FAB to brand palette (Sunset Cliff accent only where appropriate per rules).
- [ ] **4.3** A11y pass: focus rings on header CTAs, FAQ accordion, carousel dots (already partially there).

### Phase 5 — Analytics & CRO (after copy stable)

- [ ] **5.1** Event map: hero primary/secondary, program cards, phone, form start/submit, video play.
- [ ] **5.2** AC/form routing tags — coordinate with `lib/activecampaign.ts` / ops.

---

## Files to create/modify

| File | Action |
|------|--------|
| `components/layout/Footer.tsx` | Modify — email consistency |
| `components/layout/Header.tsx` | Modify — Camps; optional nav IA |
| `components/HomeHero.tsx` | Modify — secondary CTA from data |
| `data/homepage-copy.json` | Modify — hero subline, optional `ctaSecondary` keys |
| `app/page.tsx` | Modify — section order if moving stats; wire new hero fields |
| `lib/season-utils.ts` / `components/ui/SeasonBanner.tsx` | Modify — only if OpenStarts reproduced |
| `components/ChatWidget.tsx` | Modify — defer + styling |
| `lib/site-copy.ts` or new `data/cta-copy.json` | Create/extend — CTA glossary |

```yaml
# files (for tooling)
modify:
  - components/layout/Footer.tsx
  - components/layout/Header.tsx
  - components/HomeHero.tsx
  - data/homepage-copy.json
  - app/page.tsx
optional_modify:
  - components/ui/SeasonBanner.tsx
  - lib/season-utils.ts
  - components/ChatWidget.tsx
  - components/VideoTestimonials.tsx
  - components/home/HomeCommunityGallery.tsx
create:
  - data/cta-copy.json
```

---

## Out of scope (this plan)

- Full **photography reshoot** / replacing hero video (coordinate with creative; use `docs/IMAGE-SIZES-CHEAT-SHEET.md`).
- **A/B testing infrastructure** (unless already in Vercel/Analytics).
- Rewriting **all** program landings — tracked as separate program-page initiative.
- Changing **brand line** “Tennis, as it should be taught.” — audit says keep it.

---

## Success criteria

- [ ] Single canonical support email across footer, schema, and contact flows.
- [ ] No `Camp`/`Camps` or CTA contradictions in **header, footer, homepage hero, sticky CTA** (documented exceptions for form “Request” vs nav “Book”).
- [ ] Hero exposes **primary + secondary** action without hurting contrast.
- [ ] Trust metrics visible **earlier** than current flow OR documented reason to keep post-founder.
- [ ] Lighthouse: no regressions; target ≥90 categories where project requires.
- [ ] `npm run ship:gate` passes before merge.

---

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| Footer email | Visible text matches `mailto` and matches `localBusinessSchema.email` on home |
| Nav | Label matches Footer for camps link |
| Hero | Two CTAs render; secondary is keyboard-focusable and labeled |
| Order | If stats moved, mobile order reviewed; founder section still works |
| A11y | No `aria-label` lying about email domain |

---

## Research sources

- Repo: `components/layout/Footer.tsx`, `Header.tsx`, `HomeHero.tsx`, `FAQSection.tsx`, `lib/season-utils.ts`, `data/homepage-copy.json`, `app/page.tsx`
- Project rules: `.cursorrules` (CTAs, data single source, forbidden copy)

---

## Relevant learnings (compound)

- `deploy-means-git-push-and-vercel-prod`, `footer-area-deep-water-contrast`, `hero-cta-on-dark-solid-bg`, `data-driven-carousel-slides`
- Anti-pattern: **slide-image-alt-mismatch** (resolved for Ryan photo; keep alts accurate when swapping assets)

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Reordering sections hurts narrative | Prototype order in a branch; optional user testing |
| CTA unification breaks AC automations | Coordinate tag names with `lib/form-config.ts` / AC |
| Chat defer hurts support | Delay 3–5s, not removal; monitor lead volume |

---

## Confidence & uncertainty

- **High:** Footer email, Camp label, CTA drift, hero single CTA — all verified in code.
- **Medium:** OpenStarts — needs runtime reproduction.
- **Strategic:** “Best in the world” section reorder — validate with stakeholder before large refactor.

---

## Next action

Execute **Phase 1.1–1.2** immediately (small diff, high trust ROI), then **Phase 2.1–2.2** for hero improvement. Schedule Phase 3+ after design sign-off on section order and photography brief.
