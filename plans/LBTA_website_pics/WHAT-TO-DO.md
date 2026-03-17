# LBTA Website Pics — What to Do

You have a ready-to-use image pack under `plans/LBTA_website_pics/LBTA_website_Pics/`. Here’s what’s in it and how to use it on the site.

---

## What’s in the pack

| Collection | Size | Count | Formats | Notes |
|------------|------|--------|----------|--------|
| **LBTA-Coastal-Courts-1920x1080** | 1920×1080 | 4 images | PNG (source), WebP, AVIF | Hero/destination/overview style. WebP ~1.6–2.1 MB each. |
| **LBTA-Philosophy-Pillars-800x800** | 800×800 | 23 images | PNG (source), WebP, AVIF | Philosophy/on-court shots. WebP ~400KB–980KB each. |

Each collection has an **asset-manifest.csv** with `asset_name`, **alt_text**, and paths. Use the manifest for alt text when you wire images.

---

## What the site expects

From `plans/homepage-media-brief.md` and `app/page.tsx`:

| Slot | Path the site uses | What you have in the pack |
|------|--------------------|----------------------------|
| **Hero / destination** | `/images/hero/laguna-horizon.webp` | Coastal: `hero-ocean-view-tennis-courts-sunset.webp` (ideal hero/destination) |
| **Philosophy (×3)** | `movement.webp`, `discipline.webp`, `belonging.webp` in `/images/philosophy/` | 23 philosophy images — pick 3 and copy as these names |
| **Programs (×3)** | `juniors.webp`, `adults.webp`, `private-lessons.webp` in `/images/programs/` | Coastal: `coaching-private-tennis-lesson-drill.webp` fits “private”; no direct match for juniors/adults |
| **Why Choose (×2)** | `why-choose-1.webp`, `why-choose-2.webp` in `/images/why-choose/` | Coastal: e.g. `coaching-private-tennis-lesson-drill` + `overview-coastal-tennis-facility-ocean` |
| **Footer CTA** | `/images/cta/cta-background.webp` | Coastal: `hero-ocean-view-tennis-courts-sunset` or `detail-sunlit-blue-tennis-courts` |

The site already has fallbacks for Why Choose and existing files in `public/images/philosophy/` and `public/images/hero/`. Replacing or adding files is optional but improves consistency with this pack.

---

## Recommended next steps

### 1. Hero / destination (high impact)

- **From:** `LBTA_website_Pics/LBTA-Coastal-Courts-1920x1080/webp/hero-ocean-view-tennis-courts-sunset.webp`
- **To:** `public/images/hero/laguna-horizon.webp`  
  (Back up the current `laguna-horizon.webp` first if you want to keep it.)
- **Alt:** Use manifest: *"Ocean-view tennis courts at sunset with palm trees and warm golden light."*
- **Note:** File is ~1.6 MB. .cursorrules suggest ~350KB; you can ship as-is and optimize later, or re-export a smaller WebP.

### 2. Philosophy pillars (×3)

The homepage uses three fixed filenames: **movement**, **discipline**, **belonging** (pillars: Movement, Craft, Community). Pick one image per pillar and copy into `public/images/philosophy/` with these names:

| Site file | Suggested source from pack | Why |
|-----------|----------------------------|-----|
| **movement.webp** | `16-lbta-philosophy-junior-lunge-drill.webp` | Footwork / movement drill |
| **discipline.webp** | `02-lbta-philosophy-coach-overhead-demonstration.webp` or `10-lbta-philosophy-adult-forehand-portrait.webp` | Technique / structure |
| **belonging.webp** | `11-lbta-philosophy-academy-group-portrait.webp` or `04-lbta-philosophy-womens-club-group-photo.webp` | Group / community |

**Steps:**  
Copy the three chosen WebPs from `LBTA-Philosophy-Pillars-800x800/webp/` into `public/images/philosophy/` and rename to `movement.webp`, `discipline.webp`, `belonging.webp`. Alt text is in the philosophy manifest; the page uses pillar title + description, so you can keep or refine alt in code later.

### 3. Why Choose (×2) — optional

- **why-choose-1.webp:** e.g. `coaching-private-tennis-lesson-drill.webp` (coach + player).
- **why-choose-2.webp:** e.g. `overview-coastal-tennis-facility-ocean.webp` (facility/community).

Copy from Coastal `webp/` into `public/images/why-choose/` and rename. If you don’t, the site keeps using the current fallbacks (laguna-horizon, community-1).

### 4. Footer CTA — optional

- Copy **hero-ocean-view-tennis-courts-sunset.webp** or **detail-sunlit-blue-tennis-courts.webp** to `public/images/cta/cta-background.webp` (back up existing first if needed).

### 5. Programs (×3) — partial

- **private-lessons:** use `coaching-private-tennis-lesson-drill.webp` in `public/images/programs/private-lessons.webp`.
- **juniors** / **adults:** no direct match in this pack; keep current assets or add later.

---

## File size note

- **Coastal WebPs:** ~1.6–2.1 MB. For production you can:
  - Use as-is and rely on Next.js image optimization, or
  - Re-export at lower quality/size (e.g. target ~350KB) and replace.
- **Philosophy WebPs:** ~400KB–980KB; closer to the guideline; optional to compress further.

---

## Quick copy checklist

- [ ] Back up current `public/images/hero/laguna-horizon.webp` if you care to keep it.
- [ ] Copy `hero-ocean-view-tennis-courts-sunset.webp` → `public/images/hero/laguna-horizon.webp`.
- [ ] Pick 3 philosophy images; copy to `public/images/philosophy/` as `movement.webp`, `discipline.webp`, `belonging.webp`.
- [ ] (Optional) Copy 2 Coastal images to `public/images/why-choose/` as `why-choose-1.webp`, `why-choose-2.webp`.
- [ ] (Optional) Copy 1 Coastal image to `public/images/cta/cta-background.webp`.
- [ ] (Optional) Copy `coaching-private-tennis-lesson-drill.webp` → `public/images/programs/private-lessons.webp`.
- [ ] Update alt text in code from asset-manifest.csv where you want manifest copy (e.g. hero, philosophy, why-choose).

If you want, the next step can be a small script or exact commands to do the copies and renames for you (e.g. bash or Node).
