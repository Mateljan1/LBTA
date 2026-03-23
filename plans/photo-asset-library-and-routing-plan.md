# Photo Asset Library & Routing — Implementation Plan

## Overview

Establish a **clear, scalable hierarchy** for LBTA photography: where master files live, which copies ship in `public/` for Next.js, how **multiple images per player** are stored for reuse across homepage, success stories, social/OG, and future sections—without fragmenting sources of truth or bloating the repo blindly.

## Problem Statement

- Assets currently span **`public/images/`**, **`public/legacy-working-assets/`**, **`plans/LBTA_website_pics/`**, and **`website photos/LBTA_Website_Ready_*`** bundles. Not every path is documented; some pages still point at legacy URLs while curated WebPs exist in parallel.
- **Player stories** (Karue, Ryan, Henry, Olov, etc.) need **more than one photo over time** (hero card, detail, event shot). Without a folder convention, files end up scattered or duplicated.
- **Facility/coastal** shots now live under `public/images/facility/` but are not yet fully mapped to page-level “best placement” decisions.
- **Quality bar**: WebP-first, size-conscious, consistent naming—while keeping **archival originals** (PNG) available for print or re-crops outside `public/`.

## Proposed Solution

### Layered model (single mental model for the team)

| Layer | Location | Purpose |
|-------|----------|---------|
| **Archive / masters** | `plans/LBTA_website_pics/.../source-png/` (and similar) **or** dated bundles under `website photos/` | Originals, full resolution, **not** referenced by the app. |
| **Working exports** | Same tree’s `webp/` folders (e.g. `LBTA-Coastal-Courts-1920x1080/webp/`) | Intermediate: encode, QA, then **copy winners** into `public/`. |
| **Production (site)** | `public/images/**` only | **Only** paths used by `<Image src="/images/...">`. Optimized WebP (and PNG only where required, e.g. print). |
| **Legacy (sunset)** | `public/legacy-working-assets/**` | Freeze usage; **migrate** to `/images/` when a replacement exists. No new features should add legacy paths. |

### Player-specific multi-photo convention

Create a **per-player directory** under production:

```
public/images/players/
  karue-sell/
    card.webp              # default card / small surfaces
    coaching-with-andrew.webp
    manifest.json          # optional: { "default": "card.webp", "roles": { "successStory": "...", "homeResults": "..." } }
  ryan-seggerman/
    card.webp
    ...
  henry-mateljan/
    little-mo.webp
    ...
  olov/
    card.webp
    ...
```

- **Symlinks are optional** (e.g. `success-stories/karue-sell.webp` → `players/karue-sell/card.webp`); Git on Windows/macOS can be finicky—**prefer one canonical file** and **duplicate only when** a second crop is truly different (or use build-time copy script). Simplest v1: **store canonical under `players/{slug}/`** and update **imports in code** to `/images/players/{slug}/...` (no symlink).

- **Optional** `data/player-media.json`: machine-readable list of `{ slug, displayName, images: [{ path, role, alt }] }` for agents and future CMS.

### Facility / coastal

- **Canonical production folder**: `public/images/facility/` (already started).
- **Map by intent** (recommended defaults):
  - **Full-bleed hero / OG** (warm sunset, ocean read): `hero-ocean-view-tennis-courts-sunset.webp`
  - **Facility scale / “where we train”**: `overview-coastal-tennis-facility-ocean.webp`
  - **Court surface detail / schedules or about strip**: `detail-sunlit-blue-tennis-courts.webp`
  - **Private lesson narrative**: `coaching-private-tennis-lesson-drill.webp`

### Documentation as contract

- Extend **`docs/photo-map-routing.md`** with:
  - **§ Players** — table: slug → folder → roles.
  - **§ Facility** — file → recommended pages (home destination, about, contact, etc.).
- Keep **one** “source bundle → public path” table (already partially there).

### Housekeeping

- **Remove or relocate** stray assets (e.g. `public/images/GettyImages-*.webp`) if not licensed for production—they violate brand/trust goals.
- **Deduplicate**: when `legacy-working-assets` and `/images/` represent the same shot, **keep `/images/`** and update references.

(Source: existing `docs/photo-map-routing.md`; project `.cursorrules` image + performance standards.)

## Implementation Steps

### Phase 1: Structure & inventory

- [ ] **1.1** Audit `public/images/` and list **orphans**, **duplicates**, and **legacy** pairs (script or spreadsheet).
- [ ] **1.2** Create `public/images/players/` with subfolders for **active story subjects** (karue-sell, ryan-seggerman, henry-mateljan, olov, …).
- [ ] **1.3** Move or copy current success-story WebPs into `players/{slug}/` and **retain** backward-compatible paths **either** by updating all `src` in one PR **or** temporary duplicate files (single PR preferred to avoid drift).

### Phase 2: Data & code wiring

- [ ] **2.1** Add optional `data/player-media.json` (or extend `homepage-copy.json` only if player data stays homepage-centric).
- [ ] **2.2** Refactor **success stories** (`app/success-stories/page.tsx`) to read image paths from shared data (optional) or from `players/` paths consistently.
- [ ] **2.3** Wire **facility** images to agreed pages: e.g. `data/homepage-copy.json` (destination / why choose), `app/about/page.tsx` (facility grid), `components/schedules/SchedulesCTA.tsx` or contact hero—**per acceptance table below**.

### Phase 3: Legacy migration

- [ ] **3.1** Grep for `/legacy-working-assets/` in `app/`, `components/`, `data/`; for each, either migrate asset to `/images/` or document exception.
- [ ] **3.2** Update `openGraph.images` URLs to match **live** hero images (avoid OG pointing at a file the page does not use).

### Phase 4: Quality & repo hygiene

- [ ] **4.1** Enforce **WebP** for raster photos in `public/images/` (PNG only for logos/print/exceptional need).
- [ ] **4.2** Target **≤ ~350KB** per large hero where possible (re-encode from masters in `plans/` if needed).
- [ ] **4.3** If total binary size hurts clone/CI, evaluate **Git LFS** for `plans/**` and large archives (optional; decision gate).

### Phase 5: Validate & document

- [ ] **5.1** Run `npm run ship:gate`.
- [ ] **5.2** Update `docs/photo-map-routing.md` with player + facility sections.
- [ ] **5.3** Smoke: homepage, success stories, about, contact at 375px and 1280px; confirm no 404 images.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/images/players/**` | Create | Canonical multi-photo storage per player |
| `data/player-media.json` | Create (optional) | Index of player assets for reuse |
| `docs/photo-map-routing.md` | Modify | Players + facility routing contract |
| `app/success-stories/page.tsx` | Modify | Paths → `players/` or shared data |
| `data/homepage-copy.json` / `app/page.tsx` | Modify | Facility + destination wiring as approved |
| `app/about/page.tsx`, `app/contact/page.tsx`, etc. | Modify | Facility images where accepted |
| References to `/legacy-working-assets/` | Modify | Reduce to zero for user-facing images |

```yaml
# files (for tooling; keep in sync with table)
create:
  - public/images/players/karue-sell/.gitkeep
  - data/player-media.json
modify:
  - docs/photo-map-routing.md
  - app/success-stories/page.tsx
optional_modify:
  - data/homepage-copy.json
  - app/page.tsx
  - app/about/page.tsx
```

## Out of scope (this plan)

- Replacing **hero video** assets or changing **Fit4Tennis** / partner logo policy.
- **Airtable/CMS** as DAM (could be a later phase).
- **Automated** image optimization in CI (could be follow-up).
- **Legal review** of every historical file—only **flag** obvious stock filenames for human review.

## Success Criteria

- [ ] Every **production** image path lives under **`public/images/`** with a documented role (except logos/print/special cases).
- [ ] **Each featured player** has a dedicated **folder** with room for multiple WebPs; success story page uses canonical paths.
- [ ] **Facility** coastal set has a **written** map to pages (in `photo-map-routing.md`).
- [ ] **No new** dependencies on `legacy-working-assets` for primary marketing pages.
- [ ] `npm run ship:gate` passes; no broken `<Image>` URLs.

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| Player multi-photo home | `public/images/players/{slug}/` exists with at least one file per featured story subject |
| Discoverability | `docs/photo-map-routing.md` lists players + facility files |
| Success stories | `/success-stories` loads all story images from canonical paths with correct alt text |
| Facility placement | At least **two** key pages use `public/images/facility/*.webp` intentionally (e.g. home + about OR home + contact)—per product choice |
| Legacy | Grep shows **fewer** `legacy-working-assets` references than baseline; exceptions documented |
| Performance | No single new hero file egregiously above team size norms without note in doc |

## Research Sources

- Internal: `docs/photo-map-routing.md`, `data/homepage-copy.json`, `app/success-stories/page.tsx`
- Next.js: [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) (static files from `public/`)

## Relevant Learnings

- **Brand**: WebP, descriptive alts, `objectPosition` for crops (existing patterns).
- **Compound**: single source of truth for data (`/data/*.json`) reduces drift when adding surfaces.

## Research conflicts & resolution

- **Symlinks vs duplicates**: Prefer **explicit paths** in code over symlinks for cross-platform and Vercel simplicity.
- **Archive in repo vs cloud**: Keep **`plans/` + dated bundles** in repo for agent/human access until size forces LFS—document in **Risks**.

## Confidence & uncertainty

- **Confidence**: High for folder conventions and documentation.
- **Uncertainty**: Exact **which** facility image goes on **which** page is a **product/design** call—acceptance allows “two pages minimum” with flexible pairing.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Repo size growth from masters | Keep large PNGs primarily under `plans/` or `website photos/`; production only optimized WebP |
| Path drift (two copies of same player photo) | One folder `players/{slug}/`; grep in CI or manual checklist before ship |
| Stale `photo-map-routing.md` | Make routing doc a **required** update in any PR that adds `public/images/**` |
| Licensed stock images mis-filed | Remove `Getty*` or unlicensed filenames from `public/images/` after legal check |

---

## Quick reference: “Where should this file go?”

| You have… | Put it here… | Then… |
|-----------|----------------|-------|
| Original PNG from photographer | `plans/.../source-png/` or dated `website photos/` bundle | Export WebP → copy to `public/images/...` |
| Player’s 2nd/3rd photo | `public/images/players/{slug}/descriptive-name.webp` | Reference from JSON or page; document in `photo-map-routing.md` |
| New coastal/facility hero | `public/images/facility/descriptive-name.webp` | Map to page in routing doc |
| Coach headshot | `public/images/coaches/` | `data/coaches.json` + bump `COACH_IMAGE_VERSION` if Andrew |
| Something old from 2024 | Prefer migrate to `/images/`; stop linking `legacy-working-assets` | |

---

*Plan version: 2026-03-23. Next step: `/compound:work` scoped to Phase 1–2 after you confirm facility → page mapping preferences.*
