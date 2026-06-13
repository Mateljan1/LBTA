# PlayByPoint Program Photos — Cloudinary Batch Plan

## Overview

Create optimized program photos for every LBTA program to use inside PlayByPoint. Each image must be **1200 × 851 px, JPEG, under 100 KB**, with subjects positioned in the top ~40% of the frame (the bottom ~60% is covered by the app's dark gradient + text overlay). No text baked into photos — PlayByPoint adds program name, location, days, and category badge automatically.

## Problem Statement

PlayByPoint requires cohesive, correctly-sized program imagery. Current Cloudinary originals are large, varied in format (WebP/JPG), and not cropped for the app's gradient-overlay layout. We need a single batch of transformed, ready-to-download files — one per program — that can be dropped into the app as-is.

## Proposed Solution

Use Cloudinary URL-based transformations on every existing canonical program photo. The transformation chain:

```
c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:eco
```

- `c_fill,g_auto,w_1200,h_851` — fill to exact PlayByPoint dimensions, smart-crop keeping subjects visible
- `f_jpg` — force JPEG output (PlayByPoint requirement)
- `q_auto:eco` — aggressive quality optimization to stay under 100 KB while remaining sharp in the top portion

If any photo exceeds 100 KB at `q_auto:eco`, step down to `q_60` or lower until it fits.

For photos where the subject is known to be in a specific position (e.g. faces), we'll use `g_auto:subject` or override gravity per-image using the `objectPosition` hints already in `lib/program-images.ts`.

**Desktop output folder:** `~/Desktop/LBTA-PlayByPoint-Photos/`

## Photo Inventory (16 programs + 2 supplemental)

All source images are on Cloudinary cloud `dv033eo0x`. Public IDs extracted from `lib/program-images.ts`:

### Junior Programs (7)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 1 | Little Tennis Stars | `lbta-little-tennis-stars.jpg` | `9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a` |
| 2 | Red Ball | `lbta-red-ball.jpg` | `lbta/photos/canonical/2023/lbta-2023-child-practicing-tennis-swing-court` |
| 3 | Orange Ball | `lbta-orange-ball.jpg` | `lbta/support/canonical/camps/support-camps-green-ball` |
| 4 | Green Dot | `lbta-green-dot.jpg` | `Green_dot_nyiso7` |
| 5 | Competitive Green Dot | `lbta-competitive-green-dot.jpg` | `green_dot_competitive_qmueoa` |
| 6 | Junior Development | `lbta-junior-dev.jpg` | `Youth_Development_ydlfwq` |
| 7 | High Performance | `lbta-high-performance.jpg` | `High_Performance_d60ibn` |

### Adult Programs (4)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 8 | New to Tennis | `lbta-new-to-tennis.jpg` | `Beginner_Class_moulton_xs5pec` |
| 9 | Beyond Beginner | `lbta-beyond-beginner.jpg` | `olov_hero_dxhdu5` |
| 10 | Adult Intermediate | `lbta-adult-intermediate.jpg` | `Adult_intermediat_or_bridge_1_edcu5p` |
| 11 | Adult Advanced | `lbta-adult-advanced.jpg` | `Adult_advanced_2_tttewq` |

### Open Court / Fitness (2)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 12 | LiveBall | `lbta-liveball.jpg` | `Advanced_liveball_iyooh6` |
| 13 | Cardio Tennis | `lbta-cardio-tennis.jpg` | `Liveball_Intermediate_exqowf` |

### Camps (1 hero — covers all camp variants)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 14 | Summer Camps | `lbta-camps.jpg` | `Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi` |

### Supplemental (already has `f_auto,q_auto` in source URL for camps)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 15 | Camp Full Day | `lbta-camp-full-day.jpg` | `7048DEF2-DE28-42AC-A598-788BA3C3730F_1_105_c_wohq2f` |
| 16 | Camp Half AM | `lbta-camp-half-am.jpg` | `1F6EB3BC-14F6-483C-A3EB-96DF310777D3_1_105_c_l5m9hf` |

### Leagues (2)

| # | PlayByPoint Name | Filename | Cloudinary Public ID |
|---|-----------------|----------|---------------------|
| 17 | Leagues / USTA | `lbta-leagues.jpg` | `lbta/support/canonical/programs/support-programs-cardio-tennis` |
| 18 | UTR Match Play | `lbta-utr-match-play.jpg` | Local: `/images/programs/utr-match-play/utr-match-play-hero.webp` (needs Cloudinary upload or local transform) |

**Total: 18 photos**

## Cloudinary Transformation Spec

### Base transformation chain

```
https://res.cloudinary.com/dv033eo0x/image/upload/c_fill,g_auto,w_1200,h_851/f_jpg/q_auto:eco/v{version}/{public_id}.jpg
```

### Per-image gravity overrides

Some photos need gravity tuning to keep subjects in the top half:

| Photo | Override | Reason |
|-------|----------|--------|
| Little Tennis Stars | `g_face` | Single child face should anchor top |
| Red Ball | `g_auto` | Multiple kids, let auto detect |
| Beyond Beginner | `g_north` | Subject already positioned high (objectPosition: center 20%) |
| High Performance | `g_auto:subject` | Action shot, keep player visible |

All others: `g_auto` (smart crop) — good default for group/action shots.

### Quality fallback ladder

If `q_auto:eco` exceeds 100 KB:
1. Try `q_50`
2. Try `q_40`
3. Last resort: `q_35` (still sharp enough for phone screens under gradient)

### Self-validation per image

- [ ] Dimensions exactly 1200 × 851 px
- [ ] Format: JPEG
- [ ] File size ≤ 100 KB
- [ ] Subject visible in top ~40% of frame
- [ ] No text baked into image
- [ ] Filename matches spec (`lbta-{program-slug}.jpg`)

## Implementation Steps

### Phase 1: Setup (2 min)

- [ ] Step 1.1: Create output folder `~/Desktop/LBTA-PlayByPoint-Photos/`

### Phase 2: Generate Transformation URLs (5 min)

- [ ] Step 2.1: Build all 17 Cloudinary transformation URLs (one per image with cloud-hosted source)
- [ ] Step 2.2: Handle UTR Match Play hero — either upload local WebP to Cloudinary first, or download + transform locally with a tool

### Phase 3: Download Batch (5 min)

- [ ] Step 3.1: Use `curl` to download each transformed image from the Cloudinary URL directly to `~/Desktop/LBTA-PlayByPoint-Photos/{filename}`
- [ ] Step 3.2: For UTR Match Play (local source), use `sips` or `ffmpeg` to convert + resize the local WebP

### Phase 4: Validate (3 min)

- [ ] Step 4.1: Check every file is ≤ 100 KB (`ls -la` + `du`)
- [ ] Step 4.2: Check every file is 1200 × 851 px (`sips -g pixelHeight -g pixelWidth`)
- [ ] Step 4.3: Visually confirm subjects are in top half (open folder in Finder / Quick Look)
- [ ] Step 4.4: Re-download any that exceed 100 KB with lower quality setting

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `~/Desktop/LBTA-PlayByPoint-Photos/*.jpg` | Create | 18 optimized program photos |

## Out of Scope (this plan)

- Uploading photos to PlayByPoint (manual step by Andrew)
- Creating new photography (we use existing Cloudinary library)
- Modifying `lib/program-images.ts` or any site code
- Camp variant photos (Tennis & Adventure AM/PM, Summer Training) — covered by the 3 camp photos above
- Individual USTA league team photos or UTR division photos
- Coach headshots

## Success Criteria

- [ ] 18 JPEG files in `~/Desktop/LBTA-PlayByPoint-Photos/`
- [ ] Every file is exactly 1200 × 851 px
- [ ] Every file is ≤ 100 KB
- [ ] Subjects visible in top ~40% of each frame
- [ ] No text on any photo
- [ ] Filenames follow `lbta-{slug}.jpg` convention
- [ ] Cohesive look across all images

## Acceptance Checklist

- [ ] `ls ~/Desktop/LBTA-PlayByPoint-Photos/ | wc -l` returns 18
- [ ] `sips -g pixelWidth -g pixelHeight ~/Desktop/LBTA-PlayByPoint-Photos/*.jpg` shows 1200 × 851 for all
- [ ] No file exceeds 102,400 bytes (`find ~/Desktop/LBTA-PlayByPoint-Photos/ -size +100k` returns empty)
- [ ] Quick Look / preview confirms subjects positioned high in frame

## Relevant Learnings

- Cloud name: `dv033eo0x` (from `lib/program-images.ts`)
- Existing `objectPosition` values in `PROGRAM_IMAGES` give hints for gravity overrides
- The `camps` image already has `f_auto,q_auto` in its stored URL — strip those before applying our chain
- PlayByPoint 100 KB limit is strict — `q_auto:eco` should get most images there; fallback to explicit quality levels

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Some originals are low-res → upscaling looks bad at 1200px | Check dimensions first; use `e_improve` or `e_sharpen` if needed |
| `g_auto` crops out subject for some photos | Override gravity per-image using table above; visually validate |
| 100 KB too tight for some large/detailed photos | Quality fallback ladder (eco → 50 → 40 → 35) |
| UTR hero is local WebP, not on Cloudinary | Transform locally with `sips` or re-upload to Cloudinary |
