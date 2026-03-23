# Photo map routing (2026-03-22)

Source bundle: `website photos/LBTA_Website_Ready_2026-03-22/`. Files are copied into `public/images/` under semantic paths used by the app. Regenerate from the same bundle if you replace assets.

## Homepage (`01-homepage/`)

| Ready | Public |
|-------|--------|
| `hero/lbta-2023-tennis-courts-sunset-palm-trees.webp` | `hero/laguna-horizon.webp`, `hero/hero-poster.webp` |
| `destination/lbta-2023-night-tennis-practice-palm-trees.webp` | `destination/destination-night-palms.webp` |
| `founder/lbta-2023-smiling-tennis-coach-holding-tennis-balls.webp` | `founder/andrew-mateljan-on-court.webp` (homepage founder: also sourced from `17-extras-rotation/lbta-2023-tennis-player-retrieving-low-ball.webp`) |
| `player-success/lbta-2026-high-performance-karue-sell-backhand-andrew-observing.webp` | `results/karue-sell-andrew-mateljan-coaching.webp` (homepage **Player Success** band) |
| `philosophy-pillars/01–03-*.webp` | `philosophy/movement.webp`, `philosophy/discipline.webp`, `homepage/philosophy-community.webp` (homepage: camps + timeline + doubles liveball from `05-camps`, `08-about`, `07-leagues-match-play`) |
| `program-cards/01–03-*.webp` | `programs/juniors.webp`, `adults.webp`, `private-lessons.webp` (homepage: camps gallery + leagues hero + contact coaching) |
| `why-choose-lbta/01–02-*.webp` | Optional legacy; homepage **Why Choose** now uses **`facility/hero-ocean-view-tennis-courts-sunset.webp`** + **`facility/detail-sunlit-blue-tennis-courts.webp`** (coastal pack; story + surface clarity) |
| Coastal facility pack (`plans/LBTA_website_pics/.../LBTA-Coastal-Courts-1920x1080/webp/`) | `facility/overview-coastal-tennis-facility-ocean.webp` (homepage **destination** band), `facility/hero-ocean-view-…`, `facility/detail-sunlit-blue-tennis-courts.webp`, `facility/coaching-private-tennis-lesson-drill.webp` (contact, coaches, schedules as wired) |
| `cta/lbta-2023-tennis-practice-courts-sunset.webp` | `cta/cta-background.webp` |
| `community-gallery/01–10-*.webp` | `community/community-1.webp` … `community-10.webp` |

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
