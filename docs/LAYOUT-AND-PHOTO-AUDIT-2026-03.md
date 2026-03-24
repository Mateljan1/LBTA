# LBTA Layout & Photo Audit — March 2026

**Purpose:** Document actual layouts across the site, identify dimension mismatches, and prescribe optimal image specs and crops per section so visuals feel intentional and sharp.

---

## Executive Summary

| Issue | Impact | Priority |
|-------|--------|----------|
| Player Success carousel uses 682×1024 portraits for a 100vw × 65–76vh band | Karue (cover) upscales 2.8× → blur | **P1** |
| Community gallery images 200KB–1MB+ (spec ≤120KB) | Slow LCP, wasted bandwidth | **P1** |
| Philosophy pillars spec 1:1 or 4:3 but layout is **4:3**; sources vary (portrait, square, landscape) | Inconsistent crops, head clipping | **P2** |
| Why Choose uses facility images; layout 4:3 + 16:10 | Works but assets oversized | **P2** |
| MasonryGrid cells are flexible (min-h 140–180px); no fixed aspect | Works for varied tiles; **square** best for small, **landscape** for large | **P2** |
| `public/images/community/` — some files 500KB–1MB | Needs re-export at spec | **P1** |

---

## 1. Homepage — Section-by-Section Layout Audit

### 1.1 Hero (HomeHero)

| Property | Value | Notes |
|----------|-------|-------|
| **Container** | `min-h-screen`, full bleed | 100vw × 100vh |
| **Media** | Video (`object-cover`), poster fallback | 16:9 or 21:9 ideal |
| **Poster** | `/images/hero/hero-poster.webp` | — |
| **objectPosition** | `50% 70%` | Lower third for text clearance |
| **Ideal source** | **1920×1080** or wider (21:9) | ≤350KB WebP |

**Status:** Video-driven; poster used for LCP fallback. No change needed if hero video loads quickly.

---

### 1.2 Founder (Our Founder)

| Property | Value | Notes |
|----------|-------|-------|
| **Container** | `max-w-[480px]`, `aspect-[3/4]` | 3:4 portrait |
| **Object fit** | `object-cover` | — |
| **objectPosition** | `48% 44%` (from JSON) | Subject center |
| **Current asset** | `andrew-mateljan-on-court.webp` | **1600×2400** (2:3) |
| **Ideal source** | **800×1067** (3:4) or 960×1280 | ≤250KB |
| **Mismatch** | Asset is taller than 3:4 → top/bottom crop | Acceptable; objectPosition tunes it |

**Recommendation:** 3:4 crop at 800×1067. No upscaling.

---

### 1.3 Player Success Carousel (Results)

| Property | Value | Notes |
|----------|-------|-------|
| **Container** | `min-h-[65vh] lg:min-h-[76vh]`, full width | ~100vw × 65–76vh ≈ 16:9 to 21:9 |
| **Object fit** | `cover` (Karue) or `contain` (Ryan, Henry, Olov) | Cover fills; contain letterboxes |
| **objectPosition** | Per slide, e.g. `50% 45%` | — |
| **Scrim** | `from-brand-deep-water/[0.88]` → `via-black/35` @ 42% → transparent @ 68% | Left 42% heavily darkened |
| **sizes** | `100vw` | Requests full-width on desktop |

**Current assets (Player slides):**

| Slide | Path | Actual size | Layout fit | Issue |
|-------|------|-------------|------------|-------|
| Karue | `karue-home-carousel-2026.webp` | **682×1024** | cover | **P1:** 682px upscaled to ~1920px → blur |
| Ryan | `ryan-seggerman.webp` | **800×800** | contain | OK; square letterboxes cleanly |
| Henry | `henry-home-carousel-maroon-2026.webp` | **682×1024** | contain | OK; no upscale |
| Olov | `olov-home-carousel-2026.webp` | **682×1024** | contain | OK; no upscale |

**Ideal sources for full-bleed (cover):**
- **1920×1080** (16:9) or **1920×820** (21:9) — landscape
- Min width **1200px** to avoid visible upscale on 1440px screens

**Immediate fix (no new asset):** Set Karue to `imageFit: "contain"` like the others. Removes blur.

**Long-term:** Replace Karue (and optionally others) with **landscape** crops at 1920px wide if you want a cover-style hero.

---

### 1.4 Philosophy (Three Pillars)

| Property | Value | Notes |
|----------|-------|-------|
| **Layout** | `md:grid-cols-3`, `gap-8 lg:gap-10` | 3 equal columns |
| **Image container** | `aspect-[4/3]` | **4:3** — not 1:1 |
| **Object fit** | `object-cover` | — |
| **objectPosition** | Per pillar (e.g. `50% 38%`) | — |
| **sizes** | `(max-width: 768px) 100vw, 33vw` | Third of viewport on desktop |

**Current assets:**

| Pillar | Path | Actual size | Aspect | Layout aspect | Mismatch |
|--------|------|-------------|--------|---------------|----------|
| Movement | `movement.webp` | 1600×2400 | 2:3 portrait | 4:3 | Crops sides heavily |
| Craft | `discipline.webp` | 1600×1600 | 1:1 | 4:3 | Crops top/bottom |
| Community | `philosophy-community-group-2026.webp` | 1024×768 | **4:3** | 4:3 | **Match** |

**Ideal source:** **800×600** (4:3) or 1200×900. Landscape preferred.

**Recommendation:** Re-crop Movement and Craft from masters to 4:3. Community is already correct.

---

### 1.5 Programs (Pathways)

| Property | Value | Notes |
|----------|-------|-------|
| **Layout** | `md:grid-cols-3`, cards | 3 equal columns |
| **Image container** | `aspect-[4/3]` | 4:3 |
| **Object fit** | `object-cover` | — |
| **objectPosition** | Per program (e.g. `50% 35%`) | — |
| **sizes** | `(max-width: 768px) 100vw, 33vw` | — |

**Current assets (from homepage-copy):**
- Junior: `youth-dev-2.webp` — **1200×900** (4:3) ✅
- Adult: `adult-intermediate.webp` — (check)
- Private: `community-4.webp` — (community image; may be square)

**Ideal:** **800×600** (4:3) per card, ≤200KB.

---

### 1.6 Why Choose

| Property | Value | Notes |
|----------|-------|-------|
| **Layout** | `md:grid-cols-5` — col 1–3 left, col 4–5 right | Asymmetric |
| **Left image** | `aspect-[4/3] md:aspect-[16/10]` | 4:3 mobile, 16:10 desktop |
| **Right image** | `aspect-[4/3]`, `min-h-[200px]` | 4:3 |
| **Current** | `hero-ocean-view-tennis-courts-sunset.webp`, `detail-sunlit-blue-tennis-courts.webp` | 1920×1080; 1.6MB left image! |
| **Ideal** | **1200×750** (16:10) left, **800×600** (4:3) right | ≤200KB each |

**Issue:** `hero-ocean-view-tennis-courts-sunset.webp` is **1.6MB**. Re-export to ≤350KB.

---

### 1.7 Destination

| Property | Value | Notes |
|----------|-------|-------|
| **Container** | `min-h-[50vh] lg:min-h-[60vh]`, full bleed | Wide band |
| **Object fit** | `object-cover` | — |
| **objectPosition** | `50% 45%` | — |
| **Current** | `overview-coastal-tennis-facility-ocean.webp` | Check dimensions |
| **Ideal** | **1920×1080** (16:9) | ≤350KB |

---

### 1.8 Community (MasonryGrid)

| Property | Value | Notes |
|----------|-------|-------|
| **Layout** | `grid-cols-2 md:grid-cols-4`, `auto-rows-[minmax(120px,1fr)]`, `gridAutoFlow: dense` | Staggered |
| **Tile spans** | `small`: 1×1, `medium`: 2×1, `large`: 2×2 | Varied |
| **Min cell height** | `140px` mobile, `180px` desktop | Flexible |
| **Object fit** | `object-cover` | — |
| **objectPosition** | Per tile (default `50% 36%`) | — |

**Effective aspect by span:**
- **Small:** ~1:1 (single cell in 4-col grid)
- **Medium:** ~2:1 (two cells wide, one row)
- **Large:** ~1:1 (two cells × two rows)

**Current assets (from homepage-copy):**

| Slot | Path | File size (actual) | Spec | Issue |
|------|------|--------------------|------|-------|
| 0 (large) | `philosophy-community-group-2026.webp` | 139KB | — | OK |
| 1 (medium) | `community-1.webp` | **239KB** | ≤120KB | Over |
| 2 | `community-2.webp` | 71KB | ≤120KB | OK |
| 3 | `community-3.webp` | 213KB | ≤120KB | Over |
| 4 | `community-4.webp` | 189KB | ≤120KB | Over |
| 5 | `community-5.webp` | **687KB** | ≤120KB | **P1** |
| 6 | `community-6.webp` | **570KB** | ≤120KB | **P1** |
| 7 | `community-7.webp` | **775KB** | ≤120KB | **P1** |
| 8 | `community-8.webp` | **829KB** | ≤120KB | **P1** |
| 9 | `community-9.webp` | **1.0MB** | ≤120KB | **P1** |
| 10 | `community-10.webp` | **914KB** | ≤120KB | **P1** |

**Ideal:** **800×800** for square-friendly tiles; **1200×600** for wide/medium. **≤120KB** each after WebP optimize.

---

### 1.9 Footer CTA

| Property | Value | Notes |
|----------|-------|-------|
| **Container** | `min-h-[600px]`, full bleed | Wide |
| **Object fit** | `object-cover` | — |
| **objectPosition** | `50% 55%` | — |
| **Current** | `cta-background.webp` | — |
| **Ideal** | **1920×1080** or 1920×640 (3:1) | ≤300KB |

---

## 2. Other Pages — Key Image Slots

### 2.1 Success Stories

| Slot | Layout | Aspect | Current assets | Ideal |
|------|--------|--------|----------------|-------|
| Hero | Full bleed, `object-cover` | 16:9 | `karue-home-carousel-2026.webp` (682×1024) | **1920×1080** |
| Story cards (featured) | `aspect-[4/3]` | 4:3 | Per story | **800×600** |
| "More" grid — first | `aspect-[16/9]` | 16:9 | — | **800×450** |
| "More" grid — rest | `aspect-[4/3]` | 4:3 | — | **800×600** |

**Object positions** in `successStoryImagePosition`: karue `52% 42%`, henry `50% 42%`, olov `50% 45%`.

---

### 2.2 Coaches

| Slot | Layout | Aspect | Ideal |
|------|--------|--------|-------|
| Hero | Full bleed | 16:9 | 1920×1080 |
| Bio portrait | `aspect-[3/4]` or `aspect-[200/260]` | 3:4 or ~10:13 | 800×1000 |

---

### 2.3 Fitness

| Slot | Layout | Aspect | Ideal |
|------|--------|--------|-------|
| Hero | Full bleed | 16:9 | 1920×1080 |
| Section images | `aspect-[3/2]` | 3:2 | 800×533 |

---

### 2.4 About, Contact, Camps, Book, etc.

- **Heroes:** 16:9, 1920×1080, ≤350KB
- **Inline/cards:** 4:3 or 3:2 per context

---

## 3. Recommended Image Dimensions by Slot (Quick Reference)

| Section | Slot | Layout aspect | Min dimensions | Max file size | Format |
|---------|------|---------------|----------------|---------------|--------|
| **Player Success (cover)** | Full band | 16:9 | **1920×1080** | 300KB | WebP |
| **Player Success (contain)** | Letterbox | Any | 800+ width OK | 200KB | WebP |
| **Philosophy pillars** | 4:3 | 4:3 | **800×600** | 150KB | WebP |
| **Program cards** | 4:3 | 4:3 | **800×600** | 200KB | WebP |
| **Why Choose** | 4:3, 16:10 | 4:3, 16:10 | **800×600**, **1200×750** | 200KB | WebP |
| **Community masonry** | 1:1, 2:1 | 1:1 | **800×800** | **120KB** | WebP |
| **Founder** | 3:4 | 3:4 | **800×1067** | 250KB | WebP |
| **Destination / CTA** | 16:9 | 16:9 | **1920×1080** | 350KB | WebP |
| **Page heroes** | 16:9 | 16:9 | **1920×1080** | 350KB | WebP |

---

## 4. Priority Action List

### P1 — Fix immediately

1. **Karue carousel:** Set `imageFit: "contain"` in `homepage-copy.json` to eliminate blur (no new asset).
2. **Community images:** Re-export `community-5` through `community-10` at 800×800, WebP q80, target ≤120KB. Use `sharp` or `cwebp`.
3. **Why Choose left:** Re-export `hero-ocean-view-tennis-courts-sunset.webp` to ≤350KB (currently 1.6MB).

### P2 — Schedule for next asset refresh

4. **Philosophy Movement & Craft:** Crop to 4:3 (800×600) from masters.
5. **Player Success (optional):** Source 1920×1080 landscape crops for Karue (and others if desired) to enable `cover` with no upscale.
6. **Success Stories hero:** Replace with 1920×1080 if available.

### P3 — Ongoing

7. **Asset pipeline:** Add a script to batch-optimize images (resize + WebP) to spec before commit.
8. **Photo map:** Keep `docs/photo-map-routing.md` and `data/player-media.json` in sync when swapping assets.

---

## 5. Layout Consistency Notes

- **Philosophy spec said 1:1** in older docs; **actual layout is 4:3**. Use 4:3 for new assets.
- **Community spec said 4:3** in homepage-media-brief; **MasonryGrid cells are flexible** — square (1:1) works best for small/medium; landscape for large.
- **Player Success:** `contain` avoids upscale; `cover` needs **landscape** and **≥1200px width** to look sharp.
- **Scrim gradient** on carousel darkens left 42% — subject should sit **right of center** for visibility, or use a photo with important content on the right.

---

## 6. Source Assets

- **Website photos:** `website photos/LBTA_Website_Ready_2026-03-22/`
- **Legacy:** `public/legacy-working-assets/`
- **Cursor uploads:** `.cursor/projects/.../assets/` (convert to WebP and copy to `public/images/`)

---

*Audit date: March 2026. Aligns with `.cursorrules`, `plans/homepage-media-brief.md`, and `plans/image-spec-best-in-class.md`.*
