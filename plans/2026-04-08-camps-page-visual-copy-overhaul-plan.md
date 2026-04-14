# Camps Page Visual + Copy Overhaul Implementation Plan

## Overview
Upgrade `/camps` to a premium, high-legibility visual experience with stronger photo treatment, cleaner copy hierarchy, and coach-inclusive messaging (Coach Allison + Coach Peter), while preserving current conversion flow through `RegistrationModal`.

## Problem Statement
The current camps page still feels hard to read and visually flat in the hero and first sections. Photo composition and crop behavior are inconsistent across breakpoints, and coach copy is incomplete (mentions Peter but not Allison). This reduces trust, clarity, and premium brand perception.

## Proposed Solution
Rework the camps page into a photo-led editorial layout that uses explicit Cloudinary asset mapping, consistent object-position/crop strategy, and copy refinement focused on readability and premium tone. Keep existing CTA behavior (`RegistrationModal`) and pricing structure, but improve visual hierarchy and scanability.

Key architecture decisions:
- Introduce a **typed image map** in `app/camps/page.tsx` with per-section source + `objectPosition` for breakpoints.
- Replace broad hero darkening with **targeted readability layers** (left gradient + text panel + stronger type scale/leading).
- Normalize section copy to concise, coach-inclusive language.
- Ensure all hero/section media uses `next/image` with explicit `sizes` and quality tuned for editorial photos.
- Keep data and conversion paths stable; this is a UI/copy/media quality pass, not a pricing-model rewrite.

(Source: user-provided screenshot feedback + `app/camps/page.tsx` current implementation + LBTA design/copy constraints)

## Implementation Steps

### Phase 1: Asset Strategy + Hero Foundation
- [ ] Step 1.1: Create media mapping constants for all provided Cloudinary assets with intended section usage.
- [ ] Step 1.2: Swap hero image to:
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1775663649/CB91DB52-94F3-4E96-A590-8E2CECEBCF05_1_105_c_m7p2uf.jpg`
- [ ] Step 1.3: Add hero readability system:
  - left-to-right dark gradient
  - lower vignette
  - subtle text panel
  - stronger heading size/line-height
- [ ] Step 1.4: Tune hero copy block layout so key text remains readable at 320px and 375px.

### Phase 2: Section Visual Upgrade + Copy Rewrite
- [ ] Step 2.1: Update “What they’ll do” section to use curated photos with better crops:
  - splash section image -> `https://res.cloudinary.com/dv033eo0x/image/upload/v1775664513/slipnSlide_uxqhnv.jpg`
  - other section images from:
    - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774752370/lbta/support/canonical/camps/support-camps-camp-action-4.webp`
    - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563365/F3A05492-C48D-469E-917C-7F007BCFDED5_pf3zxj.heic`
    - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563357/70065BE9-F345-4466-85CD-173147425878_1_102_o_amelfg.jpg`
    - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563272/1F6EB3BC-14F6-483C-A3EB-96DF310777D3_1_105_c_l5m9hf.jpg`
    - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563278/07B99747-2AD2-4A37-8A69-7A5FA905E873_1_105_c_kgynhp.jpg`
- [ ] Step 2.2: Rewrite copy for clarity and coach inclusion:
  - mention both Coach Allison Cronk and Coach Peter DeFrantz in coaching section
  - reduce overlong lines and improve sentence rhythm
  - keep tone calm, credible, premium
- [ ] Step 2.3: Tighten card/table typography and spacing in:
  - weekly themes
  - schedule tabs/table
  - pricing cards
  - parent FAQ

### Phase 3: Crop Consistency + Responsive Polish
- [ ] Step 3.1: Apply consistent image framing strategy (`objectPosition`, aspect ratios, and section-specific crop intent).
- [ ] Step 3.2: Add Cloudinary transform variants where needed for hero and section shots (optional if default renders well):
  - recommend `f_auto,q_auto,c_fill,g_auto,w_1800,h_1100` for hero source variants
  - recommend `c_fill,g_auto,w_1200,h_900` for 4:3 section blocks
- [ ] Step 3.3: Validate at 320, 375, 768, 1024, 1440 with focus on:
  - no text-over-image readability failures
  - no awkward crop cutoffs on faces
  - no horizontal overflow

### Phase 4: Metadata + QA Hardening
- [ ] Step 4.1: Confirm camps metadata still matches latest summer messaging and hero image.
- [ ] Step 4.2: Run lint on touched files.
- [ ] Step 4.3: Smoke-check CTA/modal behavior from hero, pricing cards, and final CTA.

## Files to Create/Modify
| File | Action | Purpose |
|------|--------|---------|
| `app/camps/page.tsx` | Modify | Hero readability, media mapping, copy polish, section upgrades |
| `app/camps/layout.tsx` | Modify | Confirm/update SEO + OG image alignment |
| `app/page.tsx` | Modify | Optional camp spotlight alignment to new hero visual/copy (only if needed for consistency) |

```yaml
# files (for tooling; do not edit by hand)
create: []
modify:
  - app/camps/page.tsx
  - app/camps/layout.tsx
  - app/page.tsx
```

## Out of scope (this plan)
- Changing registration backend/API routes.
- Reworking pricing business logic or discount calculations.
- New CMS or data-model migration for camps content.
- New testimonial collection system.

## Success Criteria
- [ ] Hero copy is clearly readable on all breakpoints over the selected photo.
- [ ] Camps page visual quality is materially improved (composition, spacing, hierarchy).
- [ ] Copy includes both Coach Allison and Coach Peter in coaching context.
- [ ] Section images are cropped/framed intentionally with no major face cutoffs.
- [ ] Lint passes for all modified files.

## Acceptance checklist
- [ ] Hero readability → At 320/375/768/1024/1440, headline + subline maintain strong contrast and legibility.
- [ ] Coach inclusion → “Real Tennis, Real Coaching” (or equivalent section) includes Coach Allison Cronk and Coach Peter DeFrantz.
- [ ] Photo quality/crop → Provided Cloudinary assets are integrated with section-appropriate framing.
- [ ] Splash photo mapping → Splash Wars block uses `slipnSlide_uxqhnv.jpg`.
- [ ] Conversion continuity → “Reserve Your Week” CTAs still open `RegistrationModal` with correct contextual details.
- [ ] Code quality → `eslint` reports no errors for touched files.

## Research Sources
- User-provided hero replacement URL:  
  `https://res.cloudinary.com/dv033eo0x/image/upload/v1775663649/CB91DB52-94F3-4E96-A590-8E2CECEBCF05_1_105_c_m7p2uf.jpg`
- User-provided supporting URLs:
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774752370/lbta/support/canonical/camps/support-camps-camp-action-4.webp`
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563365/F3A05492-C48D-469E-917C-7F007BCFDED5_pf3zxj.heic`
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563357/70065BE9-F345-4466-85CD-173147425878_1_102_o_amelfg.jpg`
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563272/1F6EB3BC-14F6-483C-A3EB-96DF310777D3_1_105_c_l5m9hf.jpg`
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1774563278/07B99747-2AD2-4A37-8A69-7A5FA905E873_1_105_c_kgynhp.jpg`
  - `https://res.cloudinary.com/dv033eo0x/image/upload/v1775664513/slipnSlide_uxqhnv.jpg`
- Current implementation baseline:
  - `app/camps/page.tsx`
  - `app/camps/layout.tsx`

## Relevant Learnings
- Hero text on photography requires targeted contrast layers, not only global darkening.
- Premium pages convert better when copy is concise and section hierarchy is obvious.
- A single coach mention can feel incomplete; include both lead camp coaches for trust and clarity.

## Confidence & uncertainty
- Plan confidence: **high**.
- Uncertainty:
  - Whether `.heic` remote asset will consistently optimize via `next/image` in all environments; fallback candidate should be preselected if optimization fails.
  - Exact `objectPosition` values may need one visual iteration after first implementation.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Remote image format incompatibility (.heic) | Use fallback JPG/WebP from provided URLs and keep mapping swappable via constants |
| Hero still unreadable on certain screens | Apply stronger overlay + text container + responsive type tuning, then re-check at five breakpoints |
| Overly dense copy hurts scanability | Trim paragraph length and add short rhythm lines/chips where useful |
| Visual inconsistency between `/camps` and homepage camp module | Update homepage camp module only if needed to maintain parity |
