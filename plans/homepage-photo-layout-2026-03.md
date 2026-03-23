# Homepage Photo Layout & Asset Mapping — Implementation Plan

## Overview

Re-home the LBTA homepage photography so each section uses **intentional, on-message images** from `website photos/LBTA_Website_Ready_2026-03-22/`, with **consistent framing** (landscape-first, predictable crops) and **data-driven paths** in `data/homepage-copy.json` where practical. The **Three Pillars** block already uses a balanced `md:grid-cols-3` + uniform `aspect-[4/3]` (commit `2f318ea`); this plan finishes the job by refreshing **programs**, **results**, **why choose**, **destination**, and the **community masonry**, and by wiring your eleven nominated files into `public/images/` with optimized WebP.

## Problem Statement

- Homepage imagery is split across **hardcoded arrays in `app/page.tsx`** and **JSON** (`whyChoose`, `community.gallery`), which makes holistic photo swaps error-prone.
- The **community gallery** (10 tiles) and **program cards** (3) drive most of the visual story; without a **slot map**, new assets (juniors, leagues, UTR guest, USTA adult) land in the wrong semantic place.
- **Named athletes / rankings** (e.g. tour-level visitors) require **factual, permission-safe** alt text and sublines — avoid hype and unverified claims (see `.cursorrules` / brand voice).

## Proposed Solution

1. **Asset pipeline** — For each source file below: copy into `public/images/{programs|results|why-choose|destination|community|philosophy}/…`, run **`cwebp -resize 1600 0 -q 80`** (or project standard), verify **≤ ~350KB** where possible, keep **landscape** sources for 4∶3 slots.
2. **Single source of truth** — Move image `src`, `alt`, and `objectPosition` for **results**, **programs** (per item), and **philosophy pillars** into **`data/homepage-copy.json`** (optional schema extension), so `app/page.tsx` only maps JSON → `<Image />`.
3. **Layout** — Keep **pillars**: 3-column grid, uniform aspect (no row-span). **Programs**: 3-up grid unchanged. **Why choose**: keep `md:grid-cols-5` (3+2); optionally add **per-image `objectPosition`** in JSON for the two `WhyChooseImage`s. **Community**: keep `MasonryGrid`; **reorder** and **reassign** `span` + `objectPosition` for rhythm (wide hero tiles on strongest shots).
4. **Mapping** — Use the table in the next section as the default; adjust after visual QA on **320 / 768 / 1024 / 1440** widths.

### Proposed asset → homepage slot mapping

| Your file (repo-relative) | Intended section | Role / note |
|---------------------------|------------------|-------------|
| `…/05-camps/gallery/lbta-2023-child-practicing-tennis-swing-court.webp` | **Programs → Junior Programs** card | Red ball / pathway start; replace `public/images/programs/juniors.webp` |
| `…/05-camps/gallery/lbta-2023-young-boy-jumping-tennis-court.webp` | **Philosophy → Movement** *or* **Community** (large span) | High energy; if pillars already read well, use as masonry **large** to avoid duplicate “only juniors” |
| `…/07-leagues-match-play/doubles-round-robin/lbta-2026-doubles-round-robin-coach-led-group-play.webp` | **Community** masonry | Liveball / social play |
| `…/07-leagues-match-play/hero/lbta-2023-two-men-playing-tennis-court-02.webp` | **Programs → Adult Programs** | Adult / high-intensity rally |
| `…/07-leagues-match-play/usta-league/lbta-2026-friday-womens-league-team-photo.webp` | **Community** masonry | USTA women’s league — team identity |
| `…/07-leagues-match-play/utr-2-0-4-0/lbta-2026-utr-3-0-5-0-player-serve-blue-court.webp` | **Results** (full-bleed) *or* **Community** | Guest / match-play level — **alt text**: describe action (e.g. “player serving on blue court at LBTA”); **only** name + ranking in copy if **verified** for marketing use |
| `…/08-about/our-courts/02-moulton-meadows.webp` | **Destination** *or* **Why choose** image 2 | Facility “vibes”; good for **daytime** contrast vs night palms |
| `…/08-about/timeline/2025-today.webp` | **Programs → Junior** (alt) *or* **Philosophy → Craft** | “HP juniors / 5 UTR+” — if junior card uses red ball shot, this can anchor **Craft** (structure/path) or a **community** medium tile |
| `…/09-contact/coaching-photos/lbta-2026-andrew-private-lesson-female-athlete-ball-cart.webp` | **Programs → Private Coaching** | Clear private-lesson story |
| `…/09-contact/hero/lbta-2023-tennis-practice-at-sunset-outdoor-courts.webp` | **Why choose** image 2 (or 1) | Sunset / court views — pairs with Moulton or replaces current why-choose-2 |
| `…/13-success-stories/olov-5-5-usta-national.webp` | **Results** section (alternate story) *or* **Community** | USTA national adult competitor — align **subline** in JSON with `/success-stories` if Olov has a page |

**Conflict resolution:** You have **11** files and **~20** discrete homepage raster slots (3 pillars + 3 programs + 2 why + 1 destination + 1 results + 10 community + founder + CTA bg + hero poster). **Not every file must appear on the homepage** — prioritize: pillars clarity, programs clarity, results credibility, community variety. Remaining assets can feed **subpages** (`/programs/leagues`, `/success-stories`) in a follow-up.

## Implementation Steps

### Phase 1: Schema + data

- [ ] Extend `data/homepage-copy.json` with optional fields: `results.backgroundImage`, `results.backgroundAlt`, `results.objectPosition`; `programs.items[].image`, `programs.items[].imageAlt`, `programs.items[].objectPosition`; `philosophy.pillars[].image`, `philosophy.pillars[].objectPosition` (or keep pillar images in one array parallel to titles — match existing TS usage in `app/page.tsx`).
- [ ] Add `whyChoose.image1ObjectPosition` / `image2ObjectPosition` if tuning per photo.
- [ ] Update `community.gallery[]` entries: `src`, `alt`, `span`, `objectPosition` per new crops.

### Phase 2: Copy + optimize assets

- [ ] For each mapped file: `cp` from `website photos/...` → `public/images/...`; run `cwebp` resize/quality; spot-check **file** dimensions (landscape preferred for 4∶3 boxes).
- [ ] Update `docs/photo-map-routing.md` one-line table for any renamed **canonical** paths.

### Phase 3: Wire `app/page.tsx`

- [ ] Replace hardcoded `images` arrays for **philosophy**, **programs**, and **results** with data from `homepageCopy`.
- [ ] Verify `sizes` and `priority` only on **LCP candidates** (typically first visible hero poster / first founder image — not every section).
- [ ] Run **`npm run lint`** and **`npm run build`**.

### Phase 4: Visual QA

- [ ] At **320 / 375 / 768 / 1024 / 1440**: no unintended face clipping; **Community** masonry has no huge color clumping (vary juniors / adults / night / league).
- [ ] **Reduced motion**: no reliance on hover-only information for story.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/homepage-copy.json` | Modify | Image paths, alts, object positions, optional results copy |
| `app/page.tsx` | Modify | Read media from JSON; remove duplicate hardcoded arrays |
| `public/images/programs/*.webp` | Replace | Junior / adult / private |
| `public/images/philosophy/*.webp` or `homepage/*.webp` | Replace | Pillar art if mapping uses your camps/timeline shots |
| `public/images/results/*.webp` | Replace | Results hero background |
| `public/images/why-choose/*.webp` | Replace | Why choose pair |
| `public/images/destination/*.webp` | Replace | Optional day court vs night |
| `public/images/community/community-*.webp` | Replace | Up to 10 tiles |
| `docs/photo-map-routing.md` | Modify | Canonical paths |

```yaml
# files (for tooling; keep in sync with table)
modify:
  - data/homepage-copy.json
  - app/page.tsx
  - docs/photo-map-routing.md
create: []
```

## Out of scope (this plan)

- Changing **hero video** or **poster** (`HomeHero`, `/videos/LBTA-Home-Hero.*`).
- Replacing **founder** portrait unless explicitly requested.
- **Supabase / API** changes.
- **New sections** (e.g. separate “Leagues strip”) — can be Phase 2 homepage project.

## Success Criteria

- [ ] All new homepage images load from **`/images/...`** with **accurate alt** text (no generic stock phrases).
- [ ] **Programs** and **pillars** read clearly at a glance (junior / adult / private + movement / craft / community).
- [ ] **No portrait** sources forced into wide crops without **`objectPosition`** tuning.
- [ ] **Lint + build** pass; **Lighthouse** regression acceptable (images sized with `sizes`).

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| JSON drives programs/pillars/results images | Grep `homepageCopy` usage; no stray hardcoded `/images/programs/` in page except fallbacks |
| Crops | Spot-check Three Pillars + Programs + Results on mobile |
| Community | 10 images distinct; spans create rhythm |
| Brand / legal | Named players: alt/subline match **verified** facts only |
| Performance | WebPs optimized; no multi-MB files in `public/images` for these slots |

## Research Sources

- Current implementation: `app/page.tsx`, `components/HomeHero.tsx`, `data/homepage-copy.json`.
- Internal: `docs/photo-map-routing.md`, `.cursorrules` (performance, imagery, copy).

## Relevant Learnings

- **Three Pillars**: `md:grid-cols-3` + uniform `aspect-[4/3]` fixed staggered layout and empty corner (see commit `2f318ea`).
- **Portrait sources** in horizontal frames cause **head clipping** — prefer **landscape** masters for 4∶3 UI.

## Research conflicts & resolution

- **User screenshot** may still show the **old** 2-column stagger if the browser or CDN cached an older deploy — verify **production SHA** matches `main` after ship.
- **Ryan Seggerman / ATP #72**: treat as **sensitive** until marketing approval — default alt = action description; optional name in `results.subline` only if confirmed.

## Confidence & uncertainty

- **Plan confidence:** Medium–high for structure; **medium** for final per-slot mapping until art-directed pass.
- **Uncertainty:** Optimal **order** of masonry tiles and whether **Olov** vs **Karue** leads **Results** — product decision.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Duplicate visual (same person/story twice) | Track assignments in a small table; stagger similar tiles |
| Over-large files | `cwebp` + width cap ~1600px |
| Ranking / name claims | Legal/brand review for guest player line |
| JSON schema drift | Type `homepageCopy` in `app/page.tsx` or shared `types/homepage-copy.ts` in follow-up |
