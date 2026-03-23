# LBTA Photo Map — Implementation Plan

## Overview

Wire the **242-photo website map** ([`LBTA_Photo_Website_Map_2026-03-22.md`](file:///Users/andrew-mac-studio/Desktop/LBTA_Photo_Website_Map_2026-03-22.md)) into the Next.js site by copying optimized WebPs from **`website photos/LBTA_Website_Ready_2026-03-22/`** into **`public/images/`** (and related `public/` paths), then updating JSON copy, coach data, and page components so each slot uses the correct asset and accessible text. Secondary batches (**rotation galleries**, **still life**, **Fit4Tennis extras**) land in a catalog folder with optional follow-up UI.

## Problem Statement

- **Source of truth exists** (Desktop map + local `website photos/.../LBTA_Website_Ready_2026-03-22/` tree) but **production URLs** in code point at **`public/images/...`** semantic names (`laguna-horizon.webp`, `community-1.webp`, etc.), not the map’s `lbta-2023-*.webp` filenames.
- The map fixes **11 photo-related issues** (duplicate Andrew headshot, Karue/Alex confusion, reused sunsets, missing schedule hero, Fitness hero, Michelle missing from roster, etc.); **4 items are copy/code-only** (footer facility name, default season, camp UTR button) and should be **tracked separately** unless bundled in the same PR by explicit decision.
- **Program route redirects** (`/programs/junior`, `/programs/adult` → `/schedules#programs`) mean **section 3–4 of the map** apply to **OG images**, **schedules UI**, and **any remaining program landing content**—not separate junior/adult pages unless those redirects are removed later.

## Proposed Solution

1. **Asset pipeline (no new naming scheme in code for v1)**  
   For each map slot, **copy the matching file** from `website photos/.../LBTA_Website_Ready_2026-03-22/<section>/` to the **existing `public/images/...` path** the component already uses. The ready bundle already mirrors the map (e.g. `01-homepage/hero/lbta-2023-tennis-courts-sunset-palm-trees.webp`; community uses ordered `01-…-large.webp` … `10-…-small.webp`). Maintain a **one-page mapping table** (CSV or section in this plan) listing: `ready path` → `public path`.  
   (Source: codebase patterns in `app/page.tsx`, `data/homepage-copy.json`, `plans/homepage-media-brief.md`.)

2. **Homepage**  
   - **Hero video poster** (`/images/hero/hero-poster.webp`) and **shared OG hero** (`/images/hero/laguna-horizon.webp`, `layout.tsx` / `app/page.tsx` metadata): use map **§1.1** sunset palms asset; keep **video** as-is unless product wants a new encode—then regenerate WebM/MP4 from the same look.  
   - **Founder**, **results** (Karue vs Alex—**§1.3** + **§13**), **philosophy**, **program cards**, **why choose**, **destination**, **community masonry (10)**, **footer CTA**: replace files and adjust **`data/homepage-copy.json`** for `whyChoose`, `community.gallery` alts, and **`homepageCopy.results`** subline/caption so **Karue** and **Alex** are never conflated.  
   - Tune **`objectPosition`** per image after visual QA (existing pattern in `homepage-copy.json`).

3. **Coaches**  
   - Add **Coach Michelle Mateljan** to **`data/coaches.json`** with slug, bio, image path (map **§2.3**), `order`, `role`.  
   - Add **`app/coaches/michelle-mateljan/page.tsx`** (mirror structure of other coach pages).  
   - Update **`components/coaches/*`** as needed so the team grid lists five coaches.  
   - Replace **Andrew** roster/hero images per map; **bump `COACH_IMAGE_VERSION`** in `lib/coaches-data.ts` after headshot changes.  
   - **Coaches hero** (`CoachesHero.tsx`) currently uses `/images/programs/schedules-hero.webp`—replace with map **§2.1** asset (copy to that path or change `src` to a dedicated `/images/coaches/hero.webp` and update).

4. **Schedules**  
   - Map **§11.1**: schedules page is **text-only dark header** today (`SchedulesPageClient`). Either **add a full-bleed hero image section** above the existing header (design + performance check) or **set OG / social image** only—pick one in Work and document.

5. **Camps, Fitness, Leagues, About, Contact, Book**  
   For each page, grep `/images/` usage and replace assets per map §§5–10, **12**. Fitness: **§6.1–6.3** high-priority replacements (hero, Cardio, LiveBall).

6. **Success stories / player showcase**  
   Align images and captions with **§13**; update **`app/success-stories/page.tsx`** (and any shared data file if present).

7. **Rotation / extras (deferred batch)**  
   Copy **§3.3, 4.3–4.4, 5.3, 14–17** into e.g. **`public/images/gallery-extras/`** preserving map filenames for future carousels or CMS—**no requirement** to wire every file in v1.

8. **Non-photo issues from map**  
   Table at bottom of map: **footer text**, **default schedule season**, **camp UTR button**—handle in the same PR only if scope is agreed; otherwise **separate tasks**.

## Implementation Steps

### Phase 1: Inventory & mapping doc

- [ ] **1.1** Walk `website photos/LBTA_Website_Ready_2026-03-22/` and confirm **each §1–13 primary slot** has a corresponding file (resolve any missing vs. 272-file count).  
- [ ] **1.2** Produce **`docs/photo-map-routing.md`** (or `plans/photo-map-routing-table.csv`) with columns: `Map section`, `Source path`, `Destination public path`, `Component / JSON key`.  
- [ ] **1.3** List **large binary** additions; confirm **git** strategy (normal commit vs Git LFS if repo policy requires).

### Phase 2: Homepage + global metadata

- [ ] **2.1** Copy assets for **§1.1–1.9** into `public/images/hero`, `founder`, `results`, `philosophy`, `programs`, `why-choose`, `community`, `cta` (and `homepage` if used).  
- [ ] **2.2** Update **`data/homepage-copy.json`**: `whyChoose`, `community` (10 items, spans, alts, `objectPosition`), **results** copy for Karue/Alex clarity.  
- [ ] **2.3** Update **`app/page.tsx`** only if any paths are hardcoded beyond JSON (e.g. philosophy fallbacks, results image).  
- [ ] **2.4** Align **`app/layout.tsx`** / **`app/page.tsx`** Open Graph images with new hero file if URLs change.

### Phase 3: Coaches (Michelle + image swaps)

- [ ] **3.1** Extend **`data/coaches.json`** + **`COACH_IMAGE_VERSION`**.  
- [ ] **3.2** Add Michelle coach page and links from **`components/coaches/CoachingTeamSection`** (or equivalent).  
- [ ] **3.3** Swap **`CoachesHero`** + founder/team imagery per map.

### Phase 4: Schedules, camps, fitness, leagues, about, contact, book

- [ ] **4.1** Schedules: hero/OG + any new section per **§11.1**.  
- [ ] **4.2** **Camps**, **Fitness**, **Leagues** pages: replace images; verify **`next/image`** `sizes` and `alt`.  
- [ ] **4.3** **About** (**§8**): unique hero vs contact; **founder quote** square image **§8.4**; family image **§8.5** (`andrew_family_pic.webp` → consistent public path).  
- [ ] **4.4** **Contact** **§9**; **Book** **§10**; **Private coaching** cards **§12** (may live under book or schedules components—grep `private`).

### Phase 5: Success stories + private coaching showcase

- [ ] **5.1** **`/success-stories`**: images + captions **§13**.  
- [ ] **5.2** Validate **Ryan Seggerman** / **`atp_player_ryan_seggerman.webp`** and **`Andrew_alex_mchelson.webp`** paths exist under `public/`.

### Phase 6: Gallery extras + polish

- [ ] **6.1** Bulk copy rotation/still-life/Fit4Tennis buckets to **`public/images/gallery-extras/`** (optional).  
- [ ] **6.2** Run **`npm run ship:gate`** (or `quality-gate` if tests skipped by policy).  
- [ ] **6.3** Manual pass: **320 / 375 / 768 / 1024 / 1440**, **LCP** hero path, **CLS** on masonry.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/images/**` (many) | Create/replace | Served WebPs per map |
| `data/homepage-copy.json` | Modify | Why choose, community, results copy |
| `data/coaches.json` | Modify | Add Michelle; paths if needed |
| `lib/coaches-data.ts` | Modify | Bump `COACH_IMAGE_VERSION` |
| `app/page.tsx` | Modify | Hardcoded image paths if any |
| `app/layout.tsx` | Modify | OG images if paths change |
| `components/coaches/CoachesHero.tsx` | Modify | Coaches hero src |
| `components/coaches/CoachingTeamSection.tsx` (or index) | Modify | Michelle card + links |
| `app/coaches/michelle-mateljan/page.tsx` | Create | Michelle profile |
| `app/success-stories/page.tsx` | Modify | §13 showcase |
| `app/about/page.tsx`, `app/contact/page.tsx`, `app/fitness/page.tsx`, `app/camps/page.tsx`, `app/programs/leagues/page.tsx`, `app/book/page.tsx` | Modify | Per-map images |
| `components/schedules/SchedulesPageClient.tsx` (or wrapper) | Modify | Optional schedule hero |
| `docs/photo-map-routing.md` | Create | Source → public mapping |

```yaml
# files (for tooling; sync with table)
create:
  - app/coaches/michelle-mateljan/page.tsx
  - docs/photo-map-routing.md
modify:
  - data/homepage-copy.json
  - data/coaches.json
  - lib/coaches-data.ts
  - app/page.tsx
  - app/layout.tsx
  - components/coaches/CoachesHero.tsx
  - components/coaches/CoachingTeamSection.tsx
  - app/success-stories/page.tsx
  - app/about/page.tsx
  - app/contact/page.tsx
  - app/fitness/page.tsx
  - app/camps/page.tsx
  - app/programs/leagues/page.tsx
  - app/book/page.tsx
  - components/schedules/SchedulesPageClient.tsx
```

## Out of scope (this plan)

- Re-shoots for **Allison/Robert/Peter** on-court (map already notes).  
- Replacing **hero video** source files unless explicitly requested (poster/OG still updated).  
- Wiring **all 100+ rotation** images into interactive UI (v1 = copy to `gallery-extras/` only).  
- **Code-only** map items (footer facility name, default season, camp button) unless explicitly included.  
- **CDN external** hosting—deployment stays **Vercel + `public/`** per project rules.

## Success Criteria

- [ ] Every **§1–12 primary slot** in the map has a **matching file** under `public/` and **correct reference** in code or JSON.  
- [ ] **Karue vs Alex** labeling is correct on homepage results and success stories.  
- [ ] **Michelle** appears in **`data/coaches.json`**, coaches grid, and has a **detail page**.  
- [ ] **No broken image paths** in dev or production build.  
- [ ] **Alt text** updated where composition/subject changed.  
- [ ] `npm run ship:gate` passes (lint, build, tests, clean tracked tree per project rules).

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| Homepage hero poster + OG match map §1.1 | Visually compare + View Source / OG debugger |
| Founder §1.2 | Founder section shows new image |
| Results §1.3 + §13 | Copy names Karue vs Alex correctly; images match |
| Philosophy §1.4 | Three pillars correct |
| Programs §1.5 | Three cards |
| Why choose §1.6 | JSON paths + both images load |
| Destination §1.7 | Full-bleed section |
| Community §1.8 | 10 images, masonry spans |
| CTA §1.9 | Footer CTA background |
| Coaches §2 | Hero + Andrew portrait; Michelle live |
| Schedules §11.1 | Hero or documented OG-only decision |
| Fitness §6 | Hero + Cardio + LiveBall |
| Success stories §13 | All listed players |
| `COACH_IMAGE_VERSION` bumped when coach images change | grep lib/coaches-data.ts |

## Research Sources

- Desktop map: `~/Desktop/LBTA_Photo_Website_Map_2026-03-22.md`  
- Local ready bundle: `website photos/LBTA_Website_Ready_2026-03-22/`  
- Existing brief: `plans/homepage-media-brief.md`  
- Homepage wiring: `app/page.tsx`, `data/homepage-copy.json`  
- Coaches: `lib/coaches-data.ts`, `data/coaches.json`, `components/coaches/CoachesHero.tsx`

## Relevant Learnings

- **Single source of truth for copy**: `data/*.json` for homepage sections (aligns with `.cursorrules` Part 12).  
- **Coach images**: always use `coachImageSrc()` + version bump when busting cache.  
- **Luxury / performance**: WebP, `next/image`, `sizes`, avoid stock; prefer ≤350KB where possible per brief.

## Research conflicts & resolution

| Conflict | Resolution |
|----------|------------|
| Map uses descriptive `lbta-2023-*.webp` names; code uses semantic names | **v1:** copy files into **existing semantic `public/` paths** to minimize code churn; document mapping in `docs/photo-map-routing.md`. **v2 (optional):** migrate to `public/images/media/<hash>` + manifest. |
| Program pages redirect to schedules | Apply junior/adult/camp imagery to **schedules**, **OG**, and **programs overview**—not dead routes. |

## Confidence & uncertainty

- **Plan confidence:** High for homepage + coaches + fitness/about/contact; **medium** for every `grep` hit on `/images/` until inventory complete.  
- **Uncertainty:** Exact files for **book private coaching** cards and **leagues** subtiles—confirm paths with repo grep during Work.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large `git` objects | Batch commits per section; consider LFS if push fails |
| Layout shift after swaps | Re-tune `objectPosition`; run Lighthouse CLS |
| SEO/OG cache | Update URLs + verify in Vercel / social debuggers post-deploy |
| Schedule hero scope creep | Decide hero vs OG-only in Phase 4.1 before building |
