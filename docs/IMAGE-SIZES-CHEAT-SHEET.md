# LBTA Image Sizes — What to Give

**Use this when you have a new photo and need to know what size to provide.** All images: WebP format, keep under the Max KB column.

---

## Where full-bleed is used (and where we could add more)

**Already full-bleed:** Home hero, Player Success carousel, Destination, Footer CTA, plus every page hero (Book, Camps, Success Stories, About, Contact, Coaches, etc.).

**Could become full-bleed with layout tweaks:**
- **Philosophy** — Currently 3 cards; could add a full-bleed “atmosphere” band above or between pillars.
- **Between sections** — Thin full-bleed “breathing” bands (e.g. 30–40vh) with a single strong image between Program cards and Why Choose.
- **Community intro** — A full-bleed “community moment” above the masonry grid before “Players who train our way.”

If you give us **1920×1080** (16:9) for any of these, we can wire it in.

---

## Full-bleed (edge-to-edge heroes)

These sections use images that span the full width of the screen. Give **landscape** (wider than tall).

| Where | Size to give | Aspect | Max KB | Notes |
|-------|--------------|--------|--------|-------|
| **Home hero** (video poster) | **1920×1080** | 16:9 | 350 | Or 21:9 (2560×1080) for cinematic |
| **Player Success carousel** (Karue, Ryan, Henry, Olov) | **1920×1080** | 16:9 | 300 | Landscape only; portrait = blur if cover |
| **Destination** (home “Train where focus meets horizon”) | **1920×1080** | 16:9 | 350 | Courts + horizon |
| **Footer CTA** (home “Start training with purpose”) | **1920×1080** or **1920×640** | 16:9 or 3:1 | 300 | Sunset courts |
| **Success Stories hero** | **1920×1080** | 16:9 | 350 | — |
| **Book / Trial hero** | **1920×1080** | 16:9 | 350 | — |
| **Camps hero** | **1920×1080** | 16:9 | 350 | — |
| **Fitness hero** | **1920×1080** | 16:9 | 350 | — |
| **Coaches hero** | **1920×1080** | 16:9 | 350 | — |
| **About hero** | **1920×1080** | 16:9 | 350 | — |
| **Contact hero** | **1920×1080** | 16:9 | 350 | — |
| **Philosophy hero** | **1920×1080** | 16:9 | 350 | — |
| **Programs hero** | **1920×1080** | 16:9 | 350 | — |
| **Schedules hero** | **1920×1080** | 16:9 | 350 | — |
| **404 / Not Found** | **1920×1080** | 16:9 | 350 | — |
| **UTR Match Play hero** | **1920×1080** | 16:9 | 350 | — |
| **High Performance hero** | **1920×1080** | 16:9 | 350 | — |
| **Junior trial hero** | **1920×1080** | 16:9 | 350 | — |
| **Adult trial hero** | **1920×1080** | 16:9 | 350 | — |
| **Beginner program hero** | **1920×1080** | 16:9 | 350 | — |
| **Racquet Rescue hero** | **1920×1080** | 16:9 | 350 | — |

---

## Homepage — “Lots of photos” (Community masonry)

The **Our Community** section uses a staggered grid of 11 tiles. Cells vary: **small** (1×1), **medium** (2×1), **large** (2×2).

| Tile type | Size to give | Aspect | Max KB | Use for |
|-----------|--------------|--------|--------|---------|
| **All masonry tiles** (deployed `lbta-pics2-*`) | **1200×1200** | 1:1 square | **~200** | Covers small + large cells; sharp on retina |
| **Medium** (two cells wide) | **1200×600** or **1200×1200** | 2:1 or 1:1 | **200** | Wide shots or square |
| **Large** (big feature tile) | **1200×1200** | 1:1 | **200** | Strong hero shots in grid |

**Rule of thumb:** Export **square 1200×1200** masters (we crop `cover` in `encode-lbta-pics2.mjs`). Target **≤200KB** WebP per tile after encode; dense scenes may land ~190KB.

---

## Homepage — Other sections

| Section | Size to give | Aspect | Max KB |
|---------|--------------|--------|--------|
| **Founder** (Andrew portrait) | **800×1067** | 3:4 portrait | 250 |
| **Philosophy** (Movement, Craft from `LBTA_pics_2`) | **1600×1200** | 4:3 | 350 |
| **Programs** (Junior, Adult, Private — `*-lbta-pics2`) | **1600×1200** | 4:3 | 350 |
| **Why Choose** (left, larger) | **1200×750** | 16:10 | 200 |
| **Why Choose** (right, smaller) | **800×600** | 4:3 | 200 |

---

## Success Stories page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero (top) | **1920×1080** | 16:9 | 350 |
| Story cards (Karue, Ryan, Henry, Olov) | **800×600** | 4:3 | 200 |
| “More journeys” — first card (wide) | **800×450** | 16:9 | 200 |
| “More journeys” — other cards | **800×600** | 4:3 | 200 |

---

## About page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Founder quote block | **800×600** | 4:3 | 200 |
| Our story / courts grid — large | **1200×600** | 2:1 | 250 |
| Our story / courts grid — small | **800×600** | 4:3 | 200 |

---

## Coaches

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Coach cards (listing) | **600×800** or **800×1067** | 3:4 or 4:5 | 200 |
| Coach bio page (portrait) | **800×1067** | 4:5 | 250 |

---

## Book page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| “Why book” / benefit cards | **800×500** | 16:10 | 200 |

---

## Fitness page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Section images (Cardio, LiveBall, etc.) | **800×533** | 3:2 | 200 |

---

## Contact page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Form-side image (desktop) | **800×533** | 3:2 | 200 |
| Form-side image (mobile) | **800×600** | 4:3 | 200 |

---

## Programs overview

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Program cards (featured = wider) | **800×600** | 4:3 | 200 |

---

## Philosophy page

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Methodology / principles image | **1200×600** | 2:1 | 250 |

---

## UTR Match Play

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Side image (divisions) | **800×1067** | 3:4 | 250 |

---

## High Performance pathway

| Slot | Size to give | Aspect | Max KB |
|------|--------------|--------|--------|
| Hero | **1920×1080** | 16:9 | 350 |
| Andrew portrait block | **800×1000** | 4:5 | 250 |

---

## One-line summary

| Need | Give |
|------|------|
| **Full-bleed / hero** | **1920×1080** (16:9), ≤350KB |
| **Community grid** | **1200×1200** (square), ≤200KB |
| **Cards (4:3)** | **1600×1200**, ≤350KB |
| **Portrait** | **800×1067** (3:4), ≤250KB |
| **Wide card** | **1200×600** (2:1), ≤200KB |

---

*See `docs/LAYOUT-AND-PHOTO-AUDIT-2026-03.md` for full layout details and current vs ideal.*
