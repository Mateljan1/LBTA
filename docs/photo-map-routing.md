# Photo map routing (2026-03-22)

## Directory model (best practice)

| Layer | Location | Served by Next? |
|-------|----------|------------------|
| **Production** | [`public/images/`](../public/images/README.md) | **Yes** — only these paths in `src="/images/..."`. |
| **Working exports / masters** | [`plans/LBTA_website_pics/`](../plans/LBTA_website_pics/README.md) | No — encode and QA here, then copy winners into `public/images/`. |
| **Dated shoot bundles** | Local `website photos/` (ignored); see [`website-photo-bundles.md`](./website-photo-bundles.md) | No — batch imports; map into `public/images/` per tables below. |
| **Legacy (sunset)** | `public/legacy-working-assets/` | Yes, but **do not add new** user-facing images here; migrate to `/images/` when possible. |

**Player image index (paths by slug/role):** [`data/player-media.json`](../data/player-media.json).

Full roadmap (players folders, migration phases): [`plans/photo-asset-library-and-routing-plan.md`](../plans/photo-asset-library-and-routing-plan.md).

**LBTA_pics_2 (2026-03):** Masters live in `plans/LBTA_website_pics/LBTA_pics_2/`. Encode with `node scripts/encode-lbta-pics2.mjs` → WebP under `public/images/results/`, `success-stories/`, `programs/`, `philosophy/`, `community/` with filenames like `karue-fh-hero.webp`, `henry-lbta-pics2.webp`, `lbta-pics2-masonry-01.webp`. Wired in `data/homepage-copy.json`, `data/player-media.json`, and success stories pages.

---

Source bundle: `website photos/LBTA_Website_Ready_2026-03-22/`. Files are copied into `public/images/` under semantic paths used by the app. Regenerate from the same bundle if you replace assets.

## Homepage (`01-homepage/`)

| Ready | Public |
|-------|--------|
| `hero/lbta-2023-tennis-courts-sunset-palm-trees.webp` | `hero/laguna-horizon.webp`, `hero/hero-poster.webp` |
| `destination/lbta-2023-night-tennis-practice-palm-trees.webp` | `destination/destination-night-palms.webp` |
| `founder/lbta-2023-smiling-tennis-coach-holding-tennis-balls.webp` | `founder/andrew-mateljan-on-court.webp` (homepage founder: also sourced from `17-extras-rotation/lbta-2023-tennis-player-retrieving-low-ball.webp`) |
| `player-success/lbta-2026-high-performance-karue-sell-backhand-andrew-observing.webp` | `results/karue-sell-andrew-mateljan-coaching.webp` (homepage **Player Success** band) |
| `philosophy-pillars/01–03-*.webp` | Movement/Craft: `philosophy/movement-clinic-lbta-pics2.webp`, `philosophy/craft-hp-class-lbta-pics2.webp`; Community hero: `homepage/philosophy-community-group-2026.webp` — see `data/homepage-copy.json` |
| `program-cards/01–03-*.webp` | Legacy filenames; homepage **Pathways** row uses `programs/junior-development-lbta-pics2.webp`, `adult-lbta-pics2.webp`, `programs/private-michelle-lbta-pics2.webp` — see `data/homepage-copy.json` |
| `why-choose-lbta/01–02-*.webp` | Optional legacy; homepage **Why Choose** now uses **`facility/hero-ocean-view-tennis-courts-sunset.webp`** + **`facility/detail-sunlit-blue-tennis-courts.webp`** (coastal pack; story + surface clarity) |
| Coastal facility pack (`plans/LBTA_website_pics/.../LBTA-Coastal-Courts-1920x1080/webp/`) | `facility/overview-coastal-tennis-facility-ocean.webp` (homepage **destination** band), `facility/hero-ocean-view-…`, `facility/detail-sunlit-blue-tennis-courts.webp`, `facility/coaching-private-tennis-lesson-drill.webp` (contact, coaches, schedules as wired) |
| `cta/lbta-2023-tennis-practice-courts-sunset.webp` | `cta/cta-background.webp` |
| `community-gallery/01–10-*.webp` | Legacy `community/community-1.webp` … `community-10.webp`; homepage masonry also uses `community/lbta-pics2-*.webp` from `LBTA_pics_2` |

## Other sections

| Section | Ready folder | Primary `public/` targets |
|---------|----------------|----------------------------|
| Coaches | `02-coaches/hero`, `portraits`, `12-private-coaching/coach-cards` | `coaches/coaches-hero.webp`, `coaches/andrew-mateljan.webp`, `peter-defrantz.webp`, `allison-cronk.webp`, `michelle-mateljan.webp` |
| Schedules | `11-schedule/hero` | `schedules/schedules-hero.webp` |
| Camps | `05-camps` | `camps/camps-hero.webp`, `camps/camp-action-1.webp` … `camp-action-4.webp` |
| Leagues | `07-leagues-match-play/hero` | `leagues/leagues-hero.webp` |
| Fitness | `06-fitness` | `fitness/fitness-hero.webp`, `fitness/cardio-tennis.webp`, `fitness/liveball.webp` |
| Book trial | `10-book-trial/cards` | `book/book-hero.webp`, `book-expect-1.webp` … `3.webp` |
| About | `08-about` | `about/about-hero.webp`, `our-story.webp`, `court-*.webp`, `founder-quote.webp`, `andrew-family.webp` |
| Contact | `09-contact` | `contact/contact-hero.webp`, `contact/coaching-1.webp`, `coaching-2.webp` |
| Success stories | `13-success-stories` | `success-stories/*.webp` (e.g. `karue-sell.webp`, `ryan-seggerman.webp` from pack) |

## Coach data

`data/coaches.json` uses WebP under `/images/coaches/` for Andrew, Michelle, Peter, and Allison. Robert remains on legacy PNG until an on-court asset is provided. `COACH_IMAGE_VERSION` in `lib/coaches-data.ts` is bumped when headshots change.
