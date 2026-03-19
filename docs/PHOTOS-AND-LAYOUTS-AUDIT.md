# Full audit: photos and layouts (site-wide)

**Date:** March 2026  
**Scope:** Every public-facing page — image paths, aspect ratios, objectPosition, layout grid, alt text, and content appropriateness (e.g. adult vs junior imagery).

**Fixes applied (compound work):** All high-, medium-, and low-priority fixes from this audit have been implemented: broken paths → legacy, programs overview hero + cards, homepage founder/Results/Destination, hero alts site-wide, About facility + location objectPosition + philosophy quote alt, Contact form accent path + objectPosition. Build verified.

**Documented solution:** [Site-wide image 404s and layout consistency](solutions/ui-bugs/site-wide-image-404s-layout-consistency.md) — prevention, path rules, and optional `scripts/verify-image-paths.mjs` for CI.

---

## Summary

| Category | Count | Action |
|----------|--------|--------|
| **Broken or missing image paths** | 6 | Fix paths or add assets |
| **Empty `alt=""` on hero/decorative images** | 11 | Add short descriptive alt or document decorative |
| **Missing `objectPosition`** | 4 | Add for consistent crop (faces/focus) |
| **Layout / grid issues** | 2 | Already fixed (coaches); verify others |
| **Wrong source (e.g. /images/ vs legacy)** | 3 | Prefer legacy or ensure file exists |
| **Programs overview 404 risk** | 4 cards | Point to legacy or add files |

---

## Page-by-page

### Homepage (`/`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Founder (Andrew)** | Uses hardcoded `/images/coaches/andrew-headshot.png` instead of legacy standardized portrait. | Use same as coaches data: `/legacy-working-assets/coaches/headshots-standardized/cropped-portrait-800x1000/andrew-mateljan-headshot.png` and `objectPosition: '50% 50%'`. |
| **Results (Karue)** | Image `/images/results/karue-training.webp`. | **No `public/images/results/`.** Use `/legacy-working-assets/results/karue-training/karue-training.webp`. |
| **Philosophy pillars** | Uses `/images/philosophy/movement.webp`, `discipline.webp`, `belonging.webp`. | Files exist in `public/images/philosophy/`. Optional: use legacy philosophy folder for single source. |
| **Programs (3 cards)** | Legacy paths OK. `objectPosition` 38%, 38%, 55% — OK. | No change. |
| **Why Choose** | Legacy paths + fallbacks. `objectPosition` 55%, 35%. | No change. |
| **Destination** | `/images/hero/laguna-horizon.webp` — no `objectPosition`. | Add `objectPosition: '50% 50%'` (or 60%) so horizon is consistent when cropped. |
| **Community** | MasonryGrid uses legacy `community-1` … `community-10`. | No change. |
| **CTA** | `/images/cta/cta-background.webp`. | Verify exists; optional legacy `cta/cta-background/cta-background.webp`. |

---

### About (`/about`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | `laguna-horizon.webp`, `objectPosition: 50% 60%`. | OK. |
| **Our Story** | `/images/programs/private-specialty.webp`. | **File not in `public/images/programs/`.** Use `/legacy-working-assets/programs/private-specialty/private-specialty.webp`. |
| **Philosophy quote** | `andrew-portrait` with `alt=""`. | Decorative overlay; empty alt is valid. Optional: `alt="Andrew Mateljan"`. |
| **Facility** | Legacy facility images; no `objectPosition` on sunset-courts. | Add `objectPosition: '50% 50%'` to all three for consistent framing. |
| **Location** | `laguna-horizon.webp` — no `objectPosition`. | Add `objectPosition: '50% 60%'` for consistency with About hero. |

---

### Coaches (`/coaches`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Founder (Andrew)** | Now uses legacy portrait from coaches data. | OK. |
| **Team grid (Robert, Peter, Allison)** | Now 3-column row; legacy standardized headshots; 50% 50%. | OK. |

---

### Book (`/book`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | `book-hero.webp`, `alt=""`. | Add short alt, e.g. `alt="Book your trial or private lesson at LBTA"`. |
| **Conversion strip** | Legacy book-expect-1, 2, 3; good alt. | OK. |

---

### Camps (`/camps`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy camps-hero; `alt` present. | OK. |
| **Zigzag** | Uses ZigzagSection + legacy camp-action images. | Verify no horizontal scroll at 320px; layout OK. |

---

### Philosophy (`/philosophy`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy philosophy-hero, `alt=""`. | Add alt, e.g. `alt="LBTA coaching philosophy"`. |
| **Bento (belonging)** | Legacy belonging.webp; has alt. | OK. |

---

### Success Stories (`/success-stories`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy success-stories-hero, `alt=""`. | Add alt, e.g. `alt="LBTA success stories"`. |
| **Story cards** | Legacy results + testimonials; alt = story name. | OK. Confirm adult story uses adult image (testimonial-adult-1), junior uses testimonial-junior-1. |

---

### Contact (`/contact`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | `laguna-horizon.webp`, `objectPosition: 50% 60%`. | OK. |
| **Form accent** | `/images/programs/private-specialty.webp` (2×). | Same as About — verify file exists; if not, use legacy. No `objectPosition`. Add `objectPosition: '50% 55%'`. |

---

### Thank You (`/thank-you`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy thank-you-image, `alt=""`. | Add alt, e.g. `alt="Thank you from LBTA"`. |

---

### Fitness (`/fitness`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy fitness-hero, `alt=""`. | Add alt, e.g. `alt="Fitness and community at LBTA"`. |
| **Cardio Tennis** | **`/images/community/community-7.webp`** — **no `public/images/community/` folder** → 404. | Use `/legacy-working-assets/community/community-7.webp`. |
| **LiveBall** | `/images/philosophy/belonging.webp`. | File exists. OK. |

---

### Programs overview (`/programs`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | `/images/programs/hero.webp`. | **File not in `public/images/programs/`.** Use `/legacy-working-assets/hero/hero-poster/hero-poster.webp` or `/legacy-working-assets/hero/laguna-horizon/laguna-horizon.webp`. |
| **Program cards** | `lib/programs-data.ts` returns: `juniors.webp`, `youth-dev-1.webp`, `high-performance.webp`, `adults.webp`, `juniors.webp` (camps), `fitness.webp`, `schedules-hero.webp`. | **Only juniors.webp, adults.webp, private-lessons.webp exist in `public/images/programs/`.** Youth Dev, High Perf, Fitness, Leagues cards will 404. Use legacy: `/legacy-working-assets/programs/youth-dev-1/youth-dev-1.webp`, `.../high-performance/high-performance.webp`, `.../fitness/fitness.webp`; for Leagues card use `/legacy-working-assets/programs/leagues/leagues.webp` (no schedules-hero in repo). |

---

### Programs sub-pages (adult, junior, high-performance, leagues, USTA, UTR)

| Page | Issue | Fix |
|------|--------|-----|
| **Adult** | No hero image in body; OG from legacy adults. | OK. |
| **Junior** | OG legacy. | OK. |
| **High-performance** | Legacy hero image in body. | OK. |
| **Leagues** | Hero legacy leagues-hero, `alt=""`. | Add alt. |
| **USTA Adult League** | Hero legacy leagues-hero, `alt=""`. | Add alt. |
| **UTR Match Play** | Hero legacy match-play-hero, `alt=""`. | Add alt. |

---

### Trial / beginner pages

| Page | Issue | Fix |
|------|--------|-----|
| **Junior trial** | Legacy junior-trial-hero. | OK. |
| **Adult trial** | Legacy adult-trial-hero. | OK. |
| **Beginner program** | Legacy adult-trial-hero. | OK (adult-focused). |

---

### Match Play (`/match-play`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy match-play-hero, `alt=""`. | Add alt. |

---

### Racquet Rescue (`/racquet-rescue`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Hero** | Legacy laguna-horizon. | OK. |

---

### Not found (`/not-found`)

| Section | Issue | Fix |
|--------|--------|-----|
| **Image** | **`/images/community/community-3.webp`** — no `public/images/community/` → 404. | Use `/legacy-working-assets/community/community-3.webp`. |

---

### Layouts (OG / metadata images)

| Layout | Note |
|--------|------|
| Coaches, Success Stories, etc. | Various layouts set `openGraph.images` to legacy heroes. Verify paths exist. |

---

## Priority fix list

### High (broken or 404)

1. **Fitness — Cardio Tennis image:** Change `/images/community/community-7.webp` → `/legacy-working-assets/community/community-7.webp`.
2. **Not-found:** Change `/images/community/community-3.webp` → `/legacy-working-assets/community/community-3.webp`.
3. **Programs overview cards:** In `lib/programs-data.ts`, set Youth Dev, High Performance, Fitness, and Leagues card images to legacy paths (see Programs overview table). Set Leagues card to `/legacy-working-assets/programs/leagues/leagues.webp` (no schedules-hero in repo).
4. **About + Contact — private-specialty:** Use `/legacy-working-assets/programs/private-specialty/private-specialty.webp` (file not in `public/images/programs/`).

### Medium (consistency / a11y)

5. **Homepage founder:** Use legacy standardized Andrew portrait (same as coaches data) and center crop.
6. **Empty hero alts:** Add short descriptive `alt` on hero images that currently use `alt=""` (book, philosophy, success-stories, thank-you, fitness, match-play, leagues, USTA, UTR).
7. **About location + Home destination:** Add `objectPosition` to laguna-horizon where missing.
8. **About facility:** Add `objectPosition: '50% 50%'` to facility images.
9. **Contact form accent:** Add `objectPosition: '50% 55%'` to private-specialty images.

### Low (optional)

10. **Programs hero:** Use legacy (e.g. `hero-poster` or `laguna-horizon`) — see Programs overview.
11. **Homepage results:** Use `/legacy-working-assets/results/karue-training/karue-training.webp`.
12. **Philosophy bento:** Philosophy page uses `belonging` from legacy; homepage philosophy section uses `/images/philosophy/` — optional alignment to legacy.

---

## Layout checklist (already addressed)

- **Coaches:** Andrew only at top (FounderSection); three coaches (Robert, Peter, Allison) in one row of three columns. ✅
- **MasonryGrid (community):** 2 cols mobile, 4 cols desktop; no horizontal scroll. ✅
- **ZigzagSection (camps):** Stack on mobile. ✅
- **Book conversion strip:** 1 col mobile, 3 col desktop. ✅
- **About facility:** 1 col mobile, 3 col (2+1) desktop. ✅

---

## Adult vs junior imagery

- **Programs:** Juniors card → juniors.webp (legacy); Adults card → adults.webp (legacy). Source map: adults = woman-playing-tennis, juniors = kids. Content assignment is correct.
- **Success Stories:** Adult story uses `testimonial-adult-1.webp`, junior uses `testimonial-junior-1.webp`. ✅
- **Fitness:** Cardio Tennis and LiveBall are adult-oriented; community-7 and belonging should show adults if possible. Swap assets if current photos show only juniors.

---

## File reference

- **Legacy base:** `public/legacy-working-assets/`
- **Public images:** `public/images/` (hero, philosophy, programs, cta; **no** `community/` or `results/` in glob).
- **Programs data:** `lib/programs-data.ts` → `getProgramsOverview()` image paths.
- **Coaches data:** `data/coaches.json` + `lib/coaches-data.ts` (now legacy standardized headshots).
