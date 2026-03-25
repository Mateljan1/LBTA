# LBTA_pics_2 → Homepage & Site Photo Integration Plan

## Overview

Encode the **21 JPG masters** in `plans/LBTA_website_pics/LBTA_pics_2/` to optimized WebP under `public/images/`, then wire them into `data/homepage-copy.json`, `data/player-media.json`, and selected subpages so Karue, Henry, Olov, programs, philosophy, community, and facility moments use this bundle where they improve on current assets.

**Source:** (Source: codebase — `data/homepage-copy.json`, `docs/IMAGE-SIZES-CHEAT-SHEET.md`, `docs/photo-map-routing.md`)

---

## Problem Statement

- A new batch of **on-brand** photos lives only under `plans/` (not served by Next).
- Homepage **Player Success** slides still use portrait WebPs (682×1024) for some players; **`Karue_FH_hero.jpg`** suggests a **landscape** hero crop that could fix cover/upscale issues.
- **Community**, **programs**, and **philosophy** can absorb more variety from this folder (juniors, adults, liveball, Michelle, locations) without duplicating the same file in every slot.

---

## Proposed Solution

1. **Pipeline:** For each source JPG, run **`sharp`** (or `cwebp`) with width caps per slot (`docs/IMAGE-SIZES-CHEAT-SHEET.md`): full-bleed **1920px wide**, cards **800–1200px**, community tiles **800×800** equivalent, **quality 80–88**, target **≤350KB** heroes / **≤120KB** community tiles.
2. **Semantic naming:** Save under `public/images/{results|success-stories|programs|philosophy|community|facility|homepage}/lbta-pics2-*.webp` (or shorter: `karue-fh-hero.webp`) — avoid spaces; lowercase + hyphens.
3. **Data-driven updates:** Change paths and **alt** text only in `homepage-copy.json` (and `player-media.json` where `homeResultsCarousel` / cards apply). Optionally update `app/success-stories/page.tsx` story `image` fields if we replace card art from this bundle.
4. **Karue carousel:** Prefer **`Karue_FH_hero.jpg`** → **1920×1080** WebP for the Karue slide; set **`imageFit: "contain"`** if aspect is not 16:9, or **`cover`** only if export is truly landscape and ≥1200px wide (aligns with layout audit — Source: `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md`).
5. **Deduplication:** Do not use the same encoded file for **both** philosophy community pillar **and** first community masonry tile unless intentional; pick strongest single placement or two different crops from the same master.

---

## Proposed source → slot mapping (default)

| Source file (LBTA_pics_2) | Intended slot | Target path (example) | Export notes |
|---------------------------|---------------|------------------------|--------------|
| `Karue_FH_hero.jpg` | Player Success — Karue | `public/images/results/karue-fh-hero.webp` | 1920×1080 or max width 1920; landscape |
| `olov hero.jpg` | Player Success — Olov | `public/images/results/olov-hero-lbta-pics2.webp` | 1920 wide or 1200+ wide landscape; match contain/cover choice |
| `Henry_mateljan_4.6_UTR_9yrs_old.jpg` | Player Success — Henry (optional replace) | `public/images/success-stories/henry-lbta-pics2.webp` | Portrait OK with `contain` |
| `Junior Development 11 yr old.jpg` | Programs — Junior | `public/images/programs/junior-development-lbta-pics2.webp` | 800×600 (4:3) |
| `Adult_advanced.jpg` or `adult class.jpg` | Programs — Adult | `public/images/programs/adult-lbta-pics2.webp` | 800×600; pick best single frame |
| `Coach_michelle_private.jpg` | Programs — Private | `public/images/programs/private-michelle-lbta-pics2.webp` | 800×600 |
| `HP_class.jpg` | Philosophy — Craft *or* Movement | `public/images/philosophy/craft-hp-class-lbta-pics2.webp` | 800×600 |
| `Intermediate clinis.jpg` | Philosophy — Movement (if not junior card overlap) | `public/images/philosophy/movement-clinic-lbta-pics2.webp` | 800×600 |
| `Community_1.jpg`, `community_2.jpg` | Community masonry (replace 2 tiles) | `public/images/community/lbta-pics2-community-1.webp` etc. | 800×800, ≤120KB |
| `Advanced_liveball.jpg`, `Liveball_Intermediate.jpg` | Community or Fitness refs later | `public/images/community/liveball-advanced-lbta-pics2.webp` | Square or 4:3 crop |
| `Group Fitness_moulton_meadows.jpg`, `Group_fitness_moulton_meads_2.jpg` | Community / future Fitness | `public/images/community/group-fitness-moulton-lbta-pics2.webp` | 800×800 |
| `coach_michelle_vibes.jpg` | Community tile | `public/images/community/michelle-vibes-lbta-pics2.webp` | 800×800 |
| `LBHS_location.jpg`, `LBHS_location (2).jpg`, `Location_3.jpg` | Why Choose or Destination *if* better than coastal pack | `public/images/facility/lbhs-location-lbta-pics2.webp` | 1920×1080 for full-bleed candidates |
| `Adult_advanced (2).jpg` | Alternate adult / community | spare or A/B | 800×600 |
| `15.jpg` | **TBD** after visual QA | assign after review | — |

**Ryan Seggerman:** No file in this folder — keep existing `ryan-seggerman.webp`.

---

## Implementation Steps

### Phase 1: Inventory & encode

- [ ] **1.1** List EXIF or dimensions for each JPG (`identify` or `sharp` metadata) to confirm landscape vs portrait before batch resize.
- [ ] **1.2** Create `scripts/encode-lbta-pics2.mjs` (or one-off Node script) that: reads from `plans/LBTA_website_pics/LBTA_pics_2/`, writes WebP to `public/images/...`, logs width × height × bytes.
- [ ] **1.3** Encode **priority**: Karue FH hero, Olov hero, Henry, then program cards, then philosophy, then community tiles.
- [ ] **1.4** If any output exceeds size budget, lower quality or reduce dimensions (per cheat sheet).

### Phase 2: Wire homepage + index

- [ ] **2.1** Update `data/homepage-copy.json`: `results.slides` (paths, `imageAlt`, `objectPosition`, `imageFit` for Karue/Olov/Henry as needed).
- [ ] **2.2** Update `programs.items[]` images for Junior, Adult, Private when new assets beat current.
- [ ] **2.3** Update `philosophy.pillars[]` for Movement/Craft (and Community only if replacing group shot).
- [ ] **2.4** Update `community.gallery[]`: replace 2–6 tiles with new WebPs; adjust `span` / `objectPosition` for rhythm.
- [ ] **2.5** Optionally update `whyChoose` or `destination` if `LBHS_location` / `Location_3` win on art direction.
- [ ] **2.6** Sync `data/player-media.json` `homeResultsCarousel` paths for Karue, Henry, Olov.

### Phase 3: Subpages (optional same PR)

- [ ] **3.1** `app/success-stories/page.tsx`: update `successStories[].image` if new Henry/Karue/Olov card images should match homepage.
- [ ] **3.2** `app/success-stories/layout.tsx` / hero: only if we export a dedicated 1920×1080 hero from this bundle.

### Phase 4: Verify

- [ ] **4.1** `npm run verify:images`
- [ ] **4.2** `npm run build` && `npm run lint`
- [ ] **4.3** Visual QA at **320 / 768 / 1024 / 1440** for Player Success + community grid.
- [ ] **4.4** Update `docs/photo-map-routing.md` one-line note for `LBTA_pics_2` canonical filenames.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/LBTA_website_pics/LBTA_pics_2/README.md` | Create (optional) | Table: source JPG → public path |
| `scripts/encode-lbta-pics2.mjs` | Create (optional) | Reproducible encode pipeline |
| `public/images/**/*.webp` | Create/replace | Optimized outputs |
| `data/homepage-copy.json` | Modify | All homepage image paths + alts |
| `data/player-media.json` | Modify | Player carousel paths |
| `app/success-stories/page.tsx` | Modify (optional) | Card images |
| `app/success-stories/layout.tsx` | Modify (optional) | OG image if hero changes |
| `docs/photo-map-routing.md` | Modify | Map new filenames |

```yaml
# files (for tooling; keep in sync with table above)
create:
  - scripts/encode-lbta-pics2.mjs
  - plans/LBTA_website_pics/LBTA_pics_2/README.md
modify:
  - data/homepage-copy.json
  - data/player-media.json
  - docs/photo-map-routing.md
optional_modify:
  - app/success-stories/page.tsx
  - app/success-stories/layout.tsx
```

---

## Out of scope (this plan)

- Replacing **HomeHero** video or **hero-poster.webp** (not in this folder as a single obvious poster).
- **Coach bio** headshots (`data/coaches.json`) unless explicit portrait files are added later.
- **Logo** or **partner** assets.
- **Supabase** / API changes.
- Deleting original JPGs in `plans/` (keep as masters).

---

## Success Criteria

- [ ] All new paths referenced in JSON exist under `public/` and pass `verify:images`.
- [ ] Production build and lint pass.
- [ ] Player Success slides use **sharp** landscape for Karue if `Karue_FH_hero.jpg` supports it; no regression vs brand voice / verified facts in sublines.
- [ ] Community tiles stay ≤**120KB** each after optimization (or documented exception).
- [ ] Alt text is specific and &lt;125 chars; no forbidden marketing phrases (`.cursorrules`).

---

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| JSON drives homepage images | Grep `homepage-copy.json` for old `karue-home-carousel-2026` only if intentionally kept |
| Karue slide not blurry | Visual: desktop full width; if still soft, confirm `imageFit` + min width 1200 |
| player-media in sync | `homeResultsCarousel` matches `results.slides` paths for Karue/Henry/Olov |
| No 404 images | `npm run verify:images` exit 0 |
| Ship gate | `npm run ship:gate` or equivalent passes |

---

## Research Sources

- `data/homepage-copy.json` — current slots
- `docs/IMAGE-SIZES-CHEAT-SHEET.md` — export dimensions
- `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md` — carousel + community issues
- `docs/photo-map-routing.md` — public vs plans directory model
- `plans/LBTA_website_pics/LBTA_pics_2/*` — 21 JPG inventory

---

## Relevant Learnings

- Portrait sources in **Player Success** with **`cover`** upscale and blur; prefer **landscape ≥1920px** or **`contain`** (Source: `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md`).
- Community WebPs were previously oversized (500KB–1MB); batch encode to **≤120KB** per tile.
- **Single source of truth** for homepage media: `homepage-copy.json` (`.cursorrules` Part 12).

---

## Research conflicts & resolution

- **Duplicate intent:** `Community_1.jpg` vs existing `community-1.webp` naming — use **`lbta-pics2-*`** or **`community-lbta-pics2-1.webp`** to avoid overwriting without review.
- **`Adult_advanced.jpg` vs `Adult_advanced (2).jpg`:** pick one after side-by-side QA; keep other as optional second community tile.

---

## Confidence & uncertainty

- **Plan confidence:** Medium–high for wiring; **medium** for final **per-slot** mapping until `Karue_FH_hero.jpg` and `olov hero.jpg` dimensions are confirmed (landscape vs portrait).
- **Uncertainty:** Whether `15.jpg` is a duplicate of another frame — assign in Phase 1 inventory.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| JPG color profile / quality | Use same `sharp` pipeline as prior carousel encodes (q88). |
| Overwriting production favorites | Keep old WebPs until QA passes; git revert single file. |
| Ranking/name claims in alt | Alts describe action + setting; names stay in sublines (verified). |
| Bundle size / LCP | Cap dimensions; lazy-load below fold unchanged; carousel first slide `priority` already in component. |

---

## Step dependencies

- **2.x** depends on **1.3** (encoded files exist).
- **3.x** optional after **2.x** merged or same branch.
- **4.1–4.3** after **2.x** (and **3.x** if included).

---

*Plan created for `/compound:work` — execute Phases 1–4 in order.*
