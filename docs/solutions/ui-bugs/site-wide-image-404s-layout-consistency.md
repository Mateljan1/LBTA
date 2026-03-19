---
title: Site-wide image 404s and layout consistency (photos & layouts audit)
slug: site-wide-image-404s-layout-consistency
category: ui-bugs
tags:
  - images
  - alt-text
  - objectPosition
  - legacy-assets
  - a11y
  - hero
  - audit
  - nextjs
severity: high
status: resolved
date: 2026-03-19
related_files:
  - docs/PHOTOS-AND-LAYOUTS-AUDIT.md
  - app/page.tsx
  - app/about/page.tsx
  - app/contact/page.tsx
  - app/fitness/page.tsx
  - app/programs/page.tsx
  - lib/programs-data.ts
  - app/layout.tsx
---

# Site-wide image 404s and layout consistency (photos & layouts audit)

## Summary

Site-wide imagery and accessibility fixes: broken image paths were fixed by aligning to *legacy-working-assets* as the single source for content imagery. Hero `alt` text and `objectPosition` were added where missing. Homepage philosophy pillars were switched to legacy assets, and the Facebook pixel in `layout.tsx` was marked `aria-hidden` with an accessibility comment.

## Symptom

- Broken or missing image paths (404s) on Fitness (community-7), not-found (community-3), About and Contact (private-specialty), Programs (hero and four overview cards), and Homepage (Results Karue).
- Empty or missing hero `alt` text across Book, Philosophy, Success Stories, Thank You, Fitness, Match Play, Leagues, USTA Adult League, UTR Match Play.
- Inconsistent crops from missing `objectPosition` on key images (About facility, About location, Home destination, Contact form accent).
- Facebook pixel in `layout.tsx` not explicitly hidden from assistive tech.

## Root Cause

Image references lived in `/images/` and a few other paths while the canonical working assets live under `/legacy-working-assets/`. Pages and data loaders pointed at `/images/...` (e.g. `/images/community/`, `/images/programs/private-specialty.webp`, program card images, and philosophy pillars), so assets failed to load. Working assets have a single source: *legacy-working-assets*.

## Solution

### 1. Use legacy paths everywhere

Replace `/images/...` with `/legacy-working-assets/...` for community, hero, cards, headshots, and philosophy assets.

Example path swap:

```tsx
// Before
src="/images/community/community-7.webp"

// After
src="/legacy-working-assets/community/community-7.webp"
```

### 2. Data and Config

In **`lib/programs-data.ts`**, `getProgramsOverview()` must use legacy paths for Youth Development, High Performance, Fitness, and Leagues card images (no `/images/` for those slots). Juniors and Adults can stay on `/images/programs/` if those files exist; otherwise use legacy.

### 3. Hero `alt` Text

Add a short, descriptive `alt` on every hero `<Image>` that conveys content (e.g. "Book your trial or private lesson at LBTA", "LBTA coaching philosophy", "LBTA success stories"). Do not leave hero `alt=""` unless the image is purely decorative.

### 4. Consistent Framing With `objectPosition`

Set `objectPosition` on hero/card/feature images so crops are consistent:

- **Default / faces:** `objectPosition: '50% 50%'`
- **Horizon / scenic:** `objectPosition: '50% 60%'`
- **Form / accent:** `objectPosition: '50% 55%'`

Example:

```tsx
<Image
  src="..."
  fill
  className="object-cover"
  style={{ objectPosition: '50% 50%' }}
  sizes="..."
/>
```

### 5. Founder Headshot (Homepage)

Point `src` to legacy standardized headshot, e.g. `/legacy-working-assets/coaches/headshots-standardized/cropped-portrait-800x1000/andrew-mateljan-headshot.png`, and use `objectPosition: '50% 50%'`.

### 6. Philosophy Pillars (Homepage)

Use legacy paths for the three pillar images: `philosophy/movement/movement.webp`, `philosophy/discipline/discipline.webp`, `philosophy/belonging/belonging.webp`, with `objectPosition: '50% 50%'`.

### 7. Layout and Tracking Pixel

On the Facebook pixel `<img>` in **`app/layout.tsx`** (noscript fallback): add **`aria-hidden="true"`** and update the comment to note it’s decorative/tracking so screen readers skip it.

## Files changed

| File | Change |
|------|--------|
| `app/fitness/page.tsx` | Community image path → legacy; hero alt |
| `app/not-found.tsx` | community-3 → legacy |
| `app/about/page.tsx` | private-specialty → legacy; facility (3) + location objectPosition; philosophy quote alt |
| `app/contact/page.tsx` | private-specialty → legacy; form accent (2) objectPosition 50% 55% |
| `app/programs/page.tsx` | Hero → legacy hero-poster |
| `lib/programs-data.ts` | getProgramsOverview(): Youth Dev, High Perf, Fitness, Leagues → legacy paths |
| `app/page.tsx` | Results Karue → legacy; founder headshot → legacy + 50% 50%; philosophy pillars → legacy + 50% 50%; destination 50% 60% |
| `app/book/page.tsx`, `app/philosophy/page.tsx`, `app/success-stories/page.tsx`, `app/thank-you/page.tsx` | Hero alt |
| `app/match-play/page.tsx`, `app/programs/leagues/page.tsx`, `app/programs/usta-adult-league/page.tsx`, `app/programs/utr-match-play/page.tsx` | Hero alt |
| `app/layout.tsx` | Facebook pixel img: `aria-hidden="true"`, comment updated |

## Related documentation

- **Audit scope:** [docs/PHOTOS-AND-LAYOUTS-AUDIT.md](../../PHOTOS-AND-LAYOUTS-AUDIT.md) — single reference for image paths, hero alts, objectPosition, and legacy vs `/images/` usage.
- **Implementation patterns:** [docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md](../implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md) — patterns for legacy sections and `next/image`/sizes/quality.
- **Legacy asset layout:** `plans/visual-elevation-legacy-assets-plan.md` and `public/legacy-working-assets/README.md` for where assets live.
- **Rules:** `.cursorrules` Part 10 (Images, Logo usage) and forbidden/checklist items for alt and next/image.

## Prevention

### Path Rules

- **Default to legacy for content imagery:** Section heroes, program cards, community, philosophy, conversion strips, facility, founder/coaches (where standardized), camps, fitness, thank-you, etc. should use `/legacy-working-assets/...` unless the file is explicitly added under `public/images/` and kept in sync.
- **Allowed under `/images/`:** Only paths where the file exists in `public/images/` (e.g. `hero/laguna-horizon.webp`, `cta/cta-background.webp`, `coaches/*.png`, `print/*`). Do not reference `/images/programs/` or `/images/community/` unless those files are present in repo.
- **One source per slot:** For each UI slot (e.g. “Coaches page hero”, “Junior program card”), pick either a legacy path or an `images/` path and use it everywhere (layout metadata, Open Graph, and `<Image>`).

### Checklist Before Adding a New `Image` `src`

- [ ] **Path exists:** File is under `public/` (either `public/legacy-working-assets/...` or `public/images/...`). If using `/images/...`, confirm the file is in repo (or add it).
- [ ] **Same path everywhere:** If the image is used in metadata (e.g. `metadata.openGraph.images`), layout, and component, all use the same path.
- [ ] **Hero/above-fold:** If LCP or critical hero: `alt` is short and descriptive (not empty); `sizes` is set; `priority` only when it’s the main hero.
- [ ] **Fill + cover:** If using `fill` and `object-cover`, set `style={{ objectPosition: '…' }}` so faces/horizon/focus stay visible in crop.
- [ ] **Data files:** If the path comes from data (e.g. `lib/programs-data.ts`, `data/coaches.json`), ensure that source uses legacy or a path that exists under `public/`.

### Avoiding 404s and Drift

- **New page / new hero:** Prefer a path under `legacy-working-assets` that already exists, or add the file to `public/` and then reference it. Do not introduce new `/images/...` paths without adding the file.
- **Refactors:** When moving or renaming images, search for the path (and any `fallbackSrc` / metadata) and update all references.
- **Program/community cards:** Keep `lib/programs-data.ts` and any card image config in sync with what’s in `public/` (prefer legacy paths for cards that don’t have a dedicated file under `public/images/programs/`).
- **Coaches:** Coach images and positions live in `data/coaches.json`; paths there must point to existing files (legacy standardized headshots or `public/images/coaches/`). Use `coachImageSrc()` for the final `src` to keep cache-busting consistent.

### Optional: Build-Time or Test Checks

- **Script:** `node scripts/verify-image-paths.mjs` (or `npm run verify:images`) finds `src`, `url`, and `image` paths in `app/`, `components/`, `lib/`, and `data/`; resolves each to `public/<path>` and checks `fs.existsSync`; exits non-zero if any path is missing. Paths under `/videos/` are treated as optional (e.g. hero video with legacy fallback). Run in CI or before deploy.
- **Lint rule (optional):** ESLint or custom rule that flags `src={...}` or `url: '...'` when the string literal is under `/images/` and the corresponding file is not in an allowlist or in `public/images/`, reminding to use legacy or add the file.

## Best practices

### Single Source of Truth for Assets

- **Legacy (`/legacy-working-assets/`):** Canonical for most content imagery — heroes by section, program cards, community grid, philosophy pillars, conversion strips, facility, camps, fitness, testimonials, etc.
- **`/images/`:** For a small, curated set that the team explicitly maintains in repo (e.g. `hero/laguna-horizon.webp`, `cta/cta-background.webp`, `coaches/*.png`, `print/*`). Do not reference `/images/programs/` or `/images/community/` unless those files exist in `public/images/`.
- **Rule:** For each visual slot, choose one source (legacy or images). Don’t mix two different path roots for the same slot without a reason (e.g. fallback).

### When to Use `objectPosition`

- **Use it** whenever the image is in a `fill` + `object-cover` context and the crop can hide important content:
  - People/faces: e.g. `50% 40%` or `50% 35%` to keep faces in frame.
  - Horizon/landscapes: e.g. `50% 60%` so the horizon line stays consistent.
  - General focus: e.g. `50% 50%` or `50% 55%` for centered emphasis.
- **Omit only** when the image is not cropped (e.g. `object-contain`) or when the default center crop is intentionally fine (document in a comment if so).

### Hero Alt Guidelines

- **Never empty for hero/LCP images:** Hero and above-the-fold images that convey content must have a short, descriptive `alt`.
- **Decorative overlays:** If the image is purely decorative (e.g. a portrait used as visual texture with no informational role), `alt=""` is acceptable and preferred for screen readers.
- **Tracking pixels:** Use `alt=""` and `aria-hidden="true"` so assistive tech skips them.
