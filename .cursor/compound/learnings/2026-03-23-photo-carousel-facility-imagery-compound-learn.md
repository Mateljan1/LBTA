# Compound Learn: Photo Carousel, Facility Imagery, Player Success

**Date**: 2026-03-23
**Commits**: 71f301c..c4af6cf (10 commits)
**Source**: Review of recent homepage photo/carousel work + validation against photo-asset-library-and-routing-plan.md

## What was built

1. **PlayerSuccessCarousel** (`components/home/PlayerSuccessCarousel.tsx`) -- auto-rotating carousel with 4 slides (Karue, Ryan, Henry, Olov), pause-on-hover, dot navigation, `useReducedMotion`, `aria-roledescription="carousel"`.
2. **Data-driven slides** in `data/homepage-copy.json` -- each slide has per-image `objectPosition` for crop control.
3. **Facility imagery wired** to homepage: Why Choose section (hero-ocean-view + detail-sunlit) and Destination section (overview-coastal).
4. **Coaches grid layout** with coastal facility imagery sitewide.
5. **Object-position tuning** across multiple pages for better face/subject crops.

## Connection to plan

The untracked `plans/photo-asset-library-and-routing-plan.md` was written AFTER this work as a formalization of next steps. The recent commits partially address plan goals:
- Facility images are wired to homepage (plan Phase 2.3 partial)
- Success story images use canonical `/images/success-stories/` paths (plan Phase 1.3 direction)
- Photo map routing doc received minor updates

But plan's main deliverables remain unstarted:
- `public/images/players/{slug}/` directory structure does NOT exist yet
- `data/player-media.json` does NOT exist yet
- 30+ `legacy-working-assets` references remain (plan Phase 3)
- Full documentation update not done (plan Phase 5)

## Patterns captured (4 new)

1. **data-driven-carousel-slides** -- typed slides array in JSON, component receives props
2. **object-position-top-weighted-hero** -- 50% 10%-15% for player face preservation
3. **facility-image-intent-mapping** -- map by visual intent (hero/OG, destination, detail, coaching)
4. **player-photo-canonical-path** -- single canonical path referenced from all surfaces

## Anti-patterns captured (3 new)

1. **scattered-player-photos** -- same photo in multiple dirs with different names
2. **object-cover-no-position-on-people** -- object-cover without objectPosition on people photos
3. **legacy-assets-in-new-features** -- new code referencing /legacy-working-assets/

## Corrections captured (3 new)

1. Per-slide objectPosition needed (not fixed center) for player photos
2. Carousel min-height must be tall enough to reduce face cropping
3. Facility images need documented intent mapping in photo-map-routing.md

## Legacy migration baseline

Current `legacy-working-assets` references in code: ~33 occurrences across 20 files. Key areas:
- Coach headshots (3 coaches: Robert, Peter, Allison)
- Page heroes (philosophy, junior-trial, adult-trial, match-play, leagues)
- HomeHero video
- Various OG image URLs
- PhotoVideoGallery comment reference

## Verification (2026-03-23)

**Filesystem (repo `public/`):**

| Asset | Path | Status |
|-------|------|--------|
| Hero poster (WebP) | `/images/hero/hero-poster.webp` | Present |
| Hero WebM | `/videos/LBTA-Home-Hero.webm` | Present |
| Hero MP4 (canonical) | `/videos/LBTA-Home-Hero.mp4` | **Not in repo** — was referenced in `<video>` and 404’d; **fixed**: HomeHero now uses only WebM + `legacy-working-assets/.../LBTA-Home-Hero.mp4` |
| Legacy MP4 | `/legacy-working-assets/videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4` | Present (~37MB) |

**Player Success carousel (`data/homepage-copy.json` → `results.slides`):** all four `image` paths verified on disk:

- `/images/success-stories/karue-sell.webp`
- `/images/success-stories/ryan-seggerman.webp`
- `/images/success-stories/henry-mateljan-little-mo.webp`
- `/images/results/olov-usta-national.webp`

**Production check:** After deploy, confirm in browser Network tab: hero WebM or MP4 returns 200; poster WebP 200; carousel slide images 200.

## Next steps

- Optional: add `public/videos/LBTA-Home-Hero.mp4` (copy or CI step) so MP4 is first-party without legacy path
- Execute photo-asset-library-and-routing-plan.md Phase 1-2 when ready
- Migrate coach headshots from legacy to /images/coaches/
- Create player folder structure for multi-photo support
