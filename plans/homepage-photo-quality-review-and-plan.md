# Homepage photo quality — compound review & implementation plan

## Phase REVIEW — Findings (evidence-based)

**Method:** Measured `public/` WebP with `sharp` metadata (width × height, file size) vs. how `next/image` uses them (`sizes`, layout aspect, `object-fit`). Next.js `deviceSizes` top out at **3840**; effective requested width ≈ `min(layoutCssPx × DPR, chosenDeviceSize)`.

### Critical — will read soft or blocky on common viewports

| Location | Asset | Actual px | Why it fails |
|----------|--------|-----------|----------------|
| **Player Success carousel** | `success-stories/ryan-seggerman.webp` | **800×800** | Full-bleed band `min-h-[65vh] lg:min-h-[76vh]`, `sizes="100vw"`, `contain`. Display width often **1400–1920px+** → **~2× upscale** from 800px source → **clearly fuzzy**. |
| **Programs → LiveBall card** | `liveball/hero-doubles.webp` | **400×300** | Card `aspect-[4/3]`; `sizes` up to **100vw** on mobile. **400px wide master** blown up to 400–800+ CSS px → **unacceptable** for a hero-style card image. |

### High — acceptable on 1x, marginal on 2x retina or large tiles

| Location | Asset | Actual px | Notes |
|----------|--------|-----------|--------|
| **Player Success — Henry** | `henry-lbta-pics2.webp` | **1200×800** | Same full-bleed carousel. OK on ~1200px logical width; **soft on wide/retina** if letterbox area is large. |
| **Philosophy pillars** (Movement, Craft) | `movement-clinic-*`, `craft-hp-class-*` | **800×600** | `sizes` ≈ **33vw** desktop → ~480px wide at 1440px; **2× ≈ 960px** needed → **800px short** for crisp retina in the third column. |
| **Program cards** (Junior, Adult, Private) | `*-lbta-pics2.webp` | **800×600** | **25vw** (4-up) or **33vw** (3-up). At 1920px: 25vw = 480px → 960px retina → **borderline**; largest monitors may look slightly soft. |
| **Community — MasonryGrid “large” cells** | `lbta-pics2-*.webp` | **800×800** | Large span **2×2** cells; effective width can approach **~50vw** on some breakpoints → **800px insufficient** for sharp 2× displays. |
| **Founder column** | `founder/andrew-mateljan-on-court.webp` | **1600×2400** | `sizes="(max-width: 1024px) 100vw, 50vw"` → half of 1920 = **960px** display; 2× = **1920px** → **1600px source slightly under** for perfect retina (minor). |

### Good — dimensionally appropriate for current layout

| Location | Asset | Actual px |
|----------|--------|-----------|
| **Player Success — Karue / Olov** | `karue-fh-hero.webp`, `olov-hero-lbta-pics2.webp` | **1920×1080** |
| **Why Choose** | `facility/hero-ocean-view-*.webp`, `detail-sunlit-*.webp` | **1920×1080** (large files) |
| **Destination band** | `facility/overview-coastal-tennis-facility-ocean.webp` | **1920×1080** |
| **Programs — Camps** | `camps/camp-action-1.webp` | **1600×2400** (heavy crop in 4:3; pixels OK) |
| **Programs — UTR / legacy** | `match-play-hero.webp` | **1920×1080** |
| **Programs — Leagues** | `leagues/leagues-hero.webp` | **1317×1958** |
| **Philosophy — Community pillar** | `homepage/philosophy-community-group-2026.webp` | **1024×768** |
| **Community — hero tile** | Same as Community pillar | **1024×768** in large cell — OK for ~50vw at 1080 (not perfect 2× but better than 800 tiles). |

### Non-static hero

| Location | Asset | Notes |
|----------|--------|--------|
| **HomeHero video** | `hero-poster.webp` **948×1410** | Poster/LCP fallback; video carries perceived quality. Consider **1920×1080** poster if poster is ever LCP. |

### Code/config (already aligned with “best WebP quality”)

- `next.config.js`: **WebP-only** output, `qualities` include **95–100** — avoids mushy AVIF double-encode (see `lib/image-quality.ts`).
- **PlayerSuccessCarousel** uses `quality={100}` — correct; issue is **source resolution**, not encoder.
- **MasonryGrid** default `quality={95}` — fine once sources are large enough.

### Review synthesis (machine-readable)

```json
{
  "overallScore": 62,
  "criticalCount": 2,
  "warningCount": 5,
  "decision": "needs_work",
  "criticalFindings": [
    { "area": "Player Success", "file": "public/images/success-stories/ryan-seggerman.webp", "issue": "800px source in 100vw full-bleed carousel with contain" },
    { "area": "Programs LiveBall card", "file": "public/images/liveball/hero-doubles.webp", "issue": "400×300 in responsive card up to 100vw" }
  ],
  "topMustFix": [
    "Replace or supplement Ryan carousel asset to ≥1920px wide (16:9 or letterbox-safe crop).",
    "Replace LiveBall program card image with ≥1200px wide WebP (4:3 or source cropped to 4:3)."
  ]
}
```

---

## Phase PLAN — Implementation

## Overview

Raise **perceived sharpness** on the homepage by fixing the worst **source-vs-layout** mismatches (Ryan carousel, LiveBall card), then systematically re-export **pillars, program cards, and community tiles** from **1600px+ masters** at target widths (or add `srcset` via larger files) so **2× retina** and **large masonry cells** are covered.

## Problem Statement

Several homepage sections request **large display widths** (`100vw`, `50vw`, `33vw`, masonry large cells) while some assets remain **800px or smaller**. Next/Image cannot invent detail; upscaling looks fuzzy regardless of `quality={100}`.

## Proposed Solution

1. **Tier 1 (immediate impact):** New masters or crops for **Ryan** (carousel) and **LiveBall hero-doubles** (program card), exported as WebP **≥1920px** wide where the layout is full-bleed or full card width.
2. **Tier 2:** Re-encode **Henry** carousel slide to **min 1920×1080** (letterbox) or **1920×1280** if source allows — from original RAW/JPG if available.
3. **Tier 3:** Batch re-encode from `plans/LBTA_website_pics/LBTA_pics_2/` (or originals): **philosophy** and **program** images at **1600×1200** (4:3) or **1200×900** minimum; **community tiles** at **1200×1200** for large-grid cells (or provide **two widths** and use `sizes` refinement — prefer single larger file per tile capped ~200–350KB with quality tuning).
4. **Tier 4 (optional):** Founder image **2048px** short side or 3:4 crop at **1600×2133** if half-column blur is visible on 5K displays.
5. **Documentation:** Update `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md` (or `docs/IMAGE-SIZES-CHEAT-SHEET.md`) with **minimum px per section** table to prevent regressions.

**Source:** COMPOUND_LEARN / project rules (WebP, `sizes`, no upscale); measured metadata (this review).

## Implementation Steps

### Phase 1: P1 assets (blocking “best quality” perception)

- [ ] **1.1** Obtain or export **Ryan Seggerman** landscape (or wide crop) at **1920×1080** (or 1920×1200) WebP; update `homepage-copy.json` slide + `player-media.json` + `success-stories/page.tsx` if used. **Blocker (2026-03-25):** Only `public/images/success-stories/ryan-seggerman.webp` (800×800) exists in repo — no higher-res master; needs new asset or external export.
- [x] **1.2** Replace `public/images/liveball/hero-doubles.webp` with **≥1200px wide** 4:3 WebP from shoot (or upscale-from-Raw only if no alternative — prefer new export). **Done:** `1920×1440` WebP from `LBTA_pics_2/Advanced_liveball.jpg`; OG metadata updated in `app/liveball/layout.tsx`.
- [x] **1.3** Run `npm run verify:images` and visual check homepage at **375 / 768 / 1440 / 1920** widths. **Done:** `verify:images` + `npm run build` pass.

### Phase 2: Carousel Henry + encode script

- [x] **2.1** Re-export **Henry** at **1920×1080** fit (contain crop) or max width **1920** from master `Henry_mateljan_*.jpg`. **Done:** `henry-lbta-pics2.webp` regenerated at **1920×1080** (cover).
- [ ] **2.2** Extend `scripts/encode-lbta-pics2.mjs` (or new script) with **high-res profile** for carousel outputs (quality 90–92, width 1920). *Deferred — one-off encode was run from repo root; fold into script when convenient.*

### Phase 3: Philosophy + program cards

- [x] **3.1** Re-export Movement/Craft/Community pillar images at **1200×900** or **1600×1200** 4:3 WebP (from same masters as lbta-pics2). **Done (Movement + Craft):** **1600×1200** from `Intermediate clinis.jpg`, `HP_class.jpg`. Community pillar unchanged (`philosophy-community-group-2026` — separate asset).
- [x] **3.2** Re-export Junior/Adult/Private program cards to **1200×900** minimum; keep file sizes ≤350KB via quality. **Done:** **1600×1200** WebPs (~140–162KB each).

### Phase 4: Community masonry

- [x] **4.1** Re-encode masonry tiles at **1200×1200** (or 1000×1000 minimum) for cells that use `large` span; verify `HomeCommunityGallery` + `MasonryGrid` `sizes` still appropriate. **Done:** `tileSquare` → **1200×1200** in `scripts/encode-lbta-pics2.mjs`; all `lbta-pics2-*.webp` regenerated; `sizes` unchanged (still valid).
- [x] **4.2** If bundle size spikes, split **hero large** vs **small** tile exports — **Not needed:** largest tile ~**193KB** (`masonry-01` at q70); typical **50–150KB**.

### Phase 5: Validation

- [x] **5.1** `npm run verify:images`, `npm run build`, spot ESLint on touched TSX.
- [ ] **5.2** Lighthouse or manual: LCP element still hero/video; no CLS regression. *(Quick check recommended on deploy.)*

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/images/success-stories/ryan-seggerman.webp` (or new name) | Replace | ≥1920px wide carousel |
| `public/images/liveball/hero-doubles.webp` | Replace | Program card resolution |
| `public/images/success-stories/henry-lbta-pics2.webp` | Replace | Carousel retina |
| `public/images/philosophy/*.webp`, `programs/*-lbta-pics2.webp` | Replace | Pillars + cards |
| `public/images/community/lbta-pics2-*.webp` | Replace | Masonry sharpness |
| `data/homepage-copy.json` | Modify if paths/names change | |
| `data/player-media.json` | Modify | Ryan/Henry paths |
| `scripts/encode-lbta-pics2.mjs` | Modify | High-res export presets |
| `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md` or cheat sheet | Modify | Regressions guardrail |

```yaml
# files (for tooling)
modify:
  - data/homepage-copy.json
  - data/player-media.json
  - scripts/encode-lbta-pics2.mjs
  - docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md
create: []
replace_public_images:
  - public/images/success-stories/ryan-seggerman.webp
  - public/images/liveball/hero-doubles.webp
  - public/images/success-stories/henry-lbta-pics2.webp
  - public/images/philosophy/movement-clinic-lbta-pics2.webp
  - public/images/philosophy/craft-hp-class-lbta-pics2.webp
  - public/images/programs/junior-development-lbta-pics2.webp
  - public/images/programs/adult-lbta-pics2.webp
  - public/images/programs/private-michelle-lbta-pics2.webp
  - public/images/community/lbta-pics2-*.webp
```

## Out of scope (this plan)

- Replacing **hero video** files or re-shooting facility **Why Choose** assets (already 1920×1080).
- **Cloudinary** community append — quality depends on Cloudinary transforms; handle separately.
- Non-homepage pages (schedules, coaches) unless explicitly extended.

## Success Criteria

- [ ] No homepage image is displayed **more than ~1.25×** its shorter source dimension vs max requested `sizes` width (rule-of-thumb for “sharp”).
- [ ] Ryan and LiveBall card pass visual review at 1440px 2× DPR.
- [ ] `verify:images` and production build pass.

## Acceptance checklist

- [ ] Ryan slide → Check: new file width ≥ **1920**; carousel sharp at 1440px window.
- [ ] LiveBall card → Check: new file width ≥ **1200**; no blockiness on mobile full width.
- [ ] Philosophy row → Check: pillar images ≥ **1200px** wide dimension.
- [ ] Community large tiles → Check: no obvious softness on 27" display.

## Relevant Learnings

- `next.config.js` WebP-only + `quality` 95–100 preserves encoder headroom; **source px** is the bottleneck.
- Prior audit (`docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md`) listed old Karue dimensions — **Karue/Olov updated to 1920×1080**; audit table should be refreshed when this plan ships.

## Confidence & uncertainty

- **Confidence:** High for **Ryan** and **LiveBall** as root causes of fuzziness.
- **Uncertainty:** Whether **Ryan** master exists at ≥1920px — may need new photo session or AI upscaling (last resort).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Larger WebPs hurt LCP | Cap quality 88–92; lazy-load below fold; keep hero/video unchanged |
| `git` repo size | Store masters under `plans/`; aggressive WebP; optional Git LFS for JPG |

---

## Decision

| Gate | Status |
|------|--------|
| Ready to implement Tier 1 | After Ryan + LiveBall sources confirmed |
| Ready for Tier 3–4 | After Tier 1 acceptance |
