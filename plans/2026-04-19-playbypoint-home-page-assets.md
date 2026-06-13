# PlayByPoint Home-page asset pack (WebP, <400 KB)

**Goal:** Give PBP a cohesive, site-aligned Home/Programs/Profile experience using exact specs and real LBTA imagery.

**Cloud name:** `dv033eo0x`
**Desktop output:** `~/Desktop/LBTA_PlayByPoint_HomePack`

---

## Slot spec (enforced)

| Slot | Size | Format | Target size |
|------|------|--------|-------------|
| Hero (signed-in home) | 2400 × 1200 | WebP | ≤ 400 KB |
| Program thumbnail card (×11) | 800 × 600 | WebP | ≤ 400 KB |
| Coach headshot (×4) | 600 × 600 | WebP | ≤ 400 KB |
| Amenity / location (×3) | 1000 × 750 | WebP | ≤ 400 KB |
| OG image (share preview) | 1200 × 630 | WebP | ≤ 400 KB |

Naming convention: `lbta-{slot}-{descriptor}-{w}x{h}.webp`.

---

## Hero — 2400 × 1200 (one, LBHS golden hour)

| Slot | Source (Cloudinary public id) | Notes |
|------|------------------------------|-------|
| `lbta-hero-lbhs-golden-hour-2400x1200.webp` | `v1776164749/Karue_FH_hero_2_cnd53p.jpg` (primary) or `v1776164927/Olov_fh_hero_qgzara.jpg` | Use primary for launch; reshoot at LBHS at 6:30–7:15 pm when summer light returns and swap. |

**Alt text:** `Sunset at Laguna Beach High School courts — golden-hour training at LBTA.`

---

## Program cards — 11 × 800 × 600

All sourced from `lib/program-images.ts` (canonical program imagery). Crop `c_fill,g_auto` keeps subjects in frame.

| # | PBP Program | File | Source public id |
|---|-------------|------|------------------|
| 1 | Little Tennis Stars | `lbta-program-little-tennis-stars-800x600.webp` | `v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a` |
| 2 | Red Ball | `lbta-program-red-ball-800x600.webp` | `v1774752975/lbta/photos/canonical/2023/lbta-2023-child-practicing-tennis-swing-court` |
| 3 | Orange Ball | `lbta-program-orange-ball-800x600.webp` | `v1774752372/lbta/support/canonical/camps/support-camps-green-ball` |
| 4 | Green Dot | `lbta-program-green-dot-800x600.webp` | `v1776038504/Green_dot_nyiso7` |
| 5 | Competitive Green Dot | `lbta-program-competitive-green-dot-800x600.webp` | `v1776038831/green_dot_competitive_qmueoa` |
| 6 | Junior Development | `lbta-program-junior-development-800x600.webp` | `v1776039103/Youth_Development_ydlfwq` |
| 7 | High Performance | `lbta-program-high-performance-800x600.webp` | `v1776047024/High_Performance_d60ibn` |
| 8 | New to Tennis | `lbta-program-new-to-tennis-800x600.webp` | `v1776039173/Beginner_Class_moulton_xs5pec` |
| 9 | Beyond Beginner | `lbta-program-beyond-beginner-800x600.webp` | `v1774485579/olov_hero_dxhdu5` |
| 10 | Adult Intermediate | `lbta-program-adult-intermediate-800x600.webp` | `v1776046298/Adult_intermediat_or_bridge_1_edcu5p` |
| 11 | Adult Advanced | `lbta-program-adult-advanced-800x600.webp` | `v1774485572/Adult_advanced_2_tttewq` |

> If PBP splits LiveBall / UTR Match Play / Camps as home thumbnails too, swap any of 1–11 for:
> - LiveBall → `v1774485572/Advanced_liveball_iyooh6`
> - UTR Match Play → local `public/images/programs/utr-match-play/utr-match-play-hero.webp`
> - Camps → `v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi`

---

## Coach headshots — 4 × 600 × 600 (square)

| Coach | File | Source | Alt |
|-------|------|--------|------|
| Andrew Mateljan | `lbta-coach-andrew-mateljan-600x600.webp` | `public/images/coaches/andrew-mateljan.webp` | Andrew Mateljan — Founder & Director of Tennis, Laguna Beach Tennis Academy. |
| Former coach (removed) | `lbta-coach-former-coach-removed-600x600.webp` | `public/images/coaches/former-coach-removed.webp` | Former coach (removed) — profile archived for historical reference. |
| Peter DeFrantz | `lbta-coach-peter-defrantz-600x600.webp` | `public/images/coaches/peter-defrantz.webp` | Peter DeFrantz — Head Coach, Junior Development. |
| Allison Cronk | `lbta-coach-allison-cronk-600x600.webp` | `public/images/coaches/allison-cronk.webp` | Allison Cronk — Head Coach, Youth Programs. |

Gravity: `g_face` when possible; smart crop keeps eyes in the top 40% of the square.

---

## Amenities / locations — 3 × 1000 × 750

| Slot | File | Source | Alt |
|------|------|--------|------|
| Laguna Beach High School courts | `lbta-amenity-laguna-beach-high-school-1000x750.webp` | `public/images/facility/hero-ocean-view-tennis-courts-sunset.webp` | Laguna Beach High School tennis courts with ocean view at sunset. |
| Moulton Meadows courts | `lbta-amenity-moulton-meadows-1000x750.webp` | **Fresh shoot needed** (use existing `detail-sunlit-blue-tennis-courts.webp` as placeholder) | Moulton Meadows Park courts — daytime training light. |
| Coaching / court detail | `lbta-amenity-coaching-detail-1000x750.webp` | `public/images/facility/coaching-private-tennis-lesson-drill.webp` | Private coaching session on a blue hard court at LBTA. |

---

## OG image — 1 × 1200 × 630

`lbta-og-home-1200x630.webp`

**Source:** `v1776164749/Karue_FH_hero_2_cnd53p.jpg` (same hero hero, cropped for social aspect)
**Alt:** `Laguna Beach Tennis Academy — coaching for juniors and adults, first swings to the tour.`

---

## Shot list (for a single golden-hour pass, priority order)

1. **LBHS hero at golden hour** — 6:30–7:15 pm, wide 16:9, ocean horizon visible, no players in foreground (1x reusable hero).
2. **11 program thumbnails** — use cleanest existing canonicals; only reshoot if the subject feels dated. Keep subjects in top half of frame (PBP overlays title/badge on bottom gradient).
3. **4 coach headshots** — neutral background, eyes at ⅓ rule, soft warm light. Andrew, Robert, Peter, Allison.
4. **Amenities across 3 locations** — Laguna Beach High School, Moulton Meadows, Alta Laguna (or whichever third site you program). Wide, no people, cohesive time of day.

---

## Brand rules

- WebP for every file; < 400 KB each.
- No baked-in text on photos — PBP overlays the title/badge/days.
- Cohesive color grade (warm golden hour palette matching the site).
- Subjects top-40%, breathing room bottom.
- Keep Andrew as #1 coach; others in site order (Robert → Peter → Allison).

---

## Generation

Build with one command (after this plan is in place):

```bash
cd "/Users/andrew-mac-studio/Library/CloudStorage/Dropbox-LBTAxFIT4TENNIS/LBTA_UTR_circuit/banners"
npm run render:playbypoint:home
```

Output: `~/Desktop/LBTA_PlayByPoint_HomePack`.
