# Photos & Videos — Full Optimization Plan

**Purpose:** Get all LBTA pack photos and hero video into place and optimized. Add or replace images where the pack provides better assets.

**Created:** March 2026 (compound full loop)

---

## Overview

Use the `plans/LBTA_website_pics/LBTA_website_Pics/` pack to upgrade hero/destination, philosophy pillars, programs, Why Choose, and footer CTA. Hero stays **video** (poster + preload already optimized); ensure video assets are documented. No new code beyond optional alt-text from manifests.

---

## Problem Statement

- Pack assets are not yet in `public/`; site uses existing or fallbacks.
- Hero poster and destination/OG image could be the stronger Coastal hero image.
- Philosophy, programs, Why Choose, and CTA can use pack images for a consistent, high-quality look.
- Hero video: WebM present; MP4 for Safari documented but not in repo (user adds when ready).

---

## Proposed Solution

1. **Copy pack WebPs** into the correct `public/images/` paths (and one programs path), backing up existing where we replace.
2. **Hero/destination:** Replace `hero/laguna-horizon.webp` with Coastal `hero-ocean-view-tennis-courts-sunset.webp` (poster + all pages using hero image).
3. **Philosophy (×3):** Replace `movement.webp`, `discipline.webp`, `belonging.webp` with pack choices (16 → movement, 02 → discipline, 11 → belonging).
4. **Programs (×3):** Replace `juniors.webp`, `adults.webp`, `private-lessons.webp` with pack (05 → juniors, 10 → adults, Coastal coaching → private-lessons).
5. **Why Choose (×2):** Add `why-choose-1.webp`, `why-choose-2.webp` from Coastal (coaching + overview).
6. **Footer CTA:** Replace `cta/cta-background.webp` with Coastal `detail-sunlit-blue-tennis-courts.webp`.
7. **Video:** No file changes; doc already in place for encoding. Ensure `docs/hero-video-optimization.md` is referenced.

---

## Implementation Steps

### Phase 1: Backups (optional, for safety)

- [ ] Copy current `public/images/hero/laguna-horizon.webp` → `public/images/hero/laguna-horizon.webp.backup` (or skip if not needed).
- [ ] Backup not required for philosophy/programs/cta if we're okay overwriting (git has history).

### Phase 2: Hero & destination

- [x] Copy `LBTA_website_Pics/LBTA-Coastal-Courts-1920x1080/webp/hero-ocean-view-tennis-courts-sunset.webp` → `public/images/hero/laguna-horizon.webp`.

### Phase 3: Philosophy pillars

- [x] Copy `16-lbta-philosophy-junior-lunge-drill.webp` → `public/images/philosophy/movement.webp`.
- [x] Copy `02-lbta-philosophy-coach-overhead-demonstration.webp` → `public/images/philosophy/discipline.webp`.
- [x] Copy `11-lbta-philosophy-academy-group-portrait.webp` → `public/images/philosophy/belonging.webp`.

### Phase 4: Programs

- [x] Copy `05-lbta-philosophy-junior-backhand-portrait.webp` → `public/images/programs/juniors.webp`.
- [x] Copy `10-lbta-philosophy-adult-forehand-portrait.webp` → `public/images/programs/adults.webp`.
- [x] Copy `coaching-private-tennis-lesson-drill.webp` (Coastal) → `public/images/programs/private-lessons.webp`.

### Phase 5: Why Choose & CTA

- [x] Copy `coaching-private-tennis-lesson-drill.webp` (Coastal) → `public/images/why-choose/why-choose-1.webp`.
- [x] Copy `overview-coastal-tennis-facility-ocean.webp` (Coastal) → `public/images/why-choose/why-choose-2.webp`.
- [x] Copy `detail-sunlit-blue-tennis-courts.webp` (Coastal) → `public/images/cta/cta-background.webp`.

### Phase 6: Alt text (optional)

- [ ] Update homepage or schema alt for hero to match manifest: "Ocean-view tennis courts at sunset with palm trees and warm golden light." (Only if we want manifest copy; current alt is fine.)

### Phase 7: Docs & checklist

- [ ] Update `plans/homepage-media-brief.md` asset checklist to mark replaced slots if desired.
- [ ] Ensure `docs/hero-video-optimization.md` is linked for video (already done).

---

## Files to Create/Modify

| File / action | Purpose |
|---------------|---------|
| `public/images/hero/laguna-horizon.webp` | Replace with Coastal hero (poster + destination) |
| `public/images/philosophy/movement.webp` | Replace with pack 16 |
| `public/images/philosophy/discipline.webp` | Replace with pack 02 |
| `public/images/philosophy/belonging.webp` | Replace with pack 11 |
| `public/images/programs/juniors.webp` | Replace with pack 05 |
| `public/images/programs/adults.webp` | Replace with pack 10 |
| `public/images/programs/private-lessons.webp` | Replace with Coastal coaching |
| `public/images/why-choose/why-choose-1.webp` | Add from Coastal coaching |
| `public/images/why-choose/why-choose-2.webp` | Add from Coastal overview |
| `public/images/cta/cta-background.webp` | Replace with Coastal detail |
| `plans/homepage-media-brief.md` | Optional: mark assets ready |

No component code changes required; all paths already in use.

---

## Success Criteria

- [ ] All 10 image slots updated (hero, 3 philosophy, 3 programs, 2 why-choose, 1 cta).
- [ ] Homepage and key pages show new images; no broken images.
- [ ] Build and lint pass.
- [ ] Hero video remains; poster = new hero image after replace.

---

## Video

- Hero: keep as video; poster = `laguna-horizon.webp` (which we’re replacing with Coastal hero).
- WebM in `public/videos/`; MP4 for Safari per `docs/hero-video-optimization.md` (user adds when ready).
- No video file changes in this plan.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Coastal WebPs ~1.6–2.1 MB | Next.js Image optimizes on demand; acceptable. Optionally re-export smaller later. |
| Replacing breaks something | Paths unchanged; only file contents replaced. Git revert if needed. |
