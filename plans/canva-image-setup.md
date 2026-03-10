# LBTA — Canva image setup guide

Use this so everything you design in Canva exports at the right size and ends up ready for the website. The site prefers **WebP** and **file size limits** for speed; Canva doesn’t export WebP, so we use a two-step flow: **Canva → export → convert to WebP** (optional but recommended for big images).

---

## 1. Set your Canva canvas size (before you design)

In Canva: **Create a design → Custom size** (width × height in pixels). Use **one** of these per image type:

| Image type | Canva custom size (px) | Use for | Max file size (target) |
|------------|------------------------|---------|------------------------|
| **Hero / full-bleed** | **1920 × 1080** | Home hero, page heroes, CTA background, schedules hero, programs hero | ≤350 KB |
| **Portrait (coach/founder)** | **800 × 1000** (4∶5) or **600 × 800** (3∶4) | Andrew, Robert, Michelle, Peter, Allison | ≤250 KB |
| **Program / philosophy card** | **800 × 600** (4∶3) or **600 × 600** (square) | Juniors, adults, private, HP, fitness, movement, discipline, belonging | ≤200 KB (≤150 for philosophy) |
| **Community / results** | **800 × 800** (square) or **1200 × 675** (16∶9) | Community grid, Karue/player success | ≤120–300 KB |
| **Partner logo** | **320 × 160** (or height 80–96px, width to fit) | Fit4Tennis, Racket Rescue, RacquetIQ, etc. | ≤40 KB |
| **LBTA logo (header)** | **480 × 96** (2× for retina) | Header, footer, trial pages | ≤50 KB |

**Rule:** Design at the size you’ll use. Don’t design at 5000px and resize down later—start at the size in the table.

---

## 2. Export from Canva

- **Photos, heroes, cards, community images:**  
  **Share → Download → File type: JPG** (or PNG if you need transparency).  
  **Quality:** High or “Best” (Canva’s highest).  
  If the file is over the “Max file size” in the table, use step 3 to compress and convert to WebP.

- **Logos (LBTA + partners), anything with transparency:**  
  **Share → Download → File type: PNG.**  
  Keep under the size limits (e.g. ≤50 KB for LBTA logo, ≤40 KB per partner). If over, reduce canvas size or simplify the logo in Canva, then export again.

- **Naming:**  
  Use lowercase, no spaces. Examples: `laguna-horizon`, `andrew-portrait`, `juniors`, `community-1`, `fit4tennis`.  
  You’ll add the folder path and `.webp` (or keep `.png`/`.jpg`) when you drop files into the project (see §5).

---

## 3. Convert to WebP (recommended for heroes and large images)

Canva does **not** export WebP. For heroes and any image over ~200 KB:

1. **Squoosh (free, no signup):**  
   Go to [squoosh.app](https://squoosh.app) → drag your JPG/PNG in → right side set format to **WebP**, Quality **80–85**.  
   Compare size; if still over the target (e.g. 350 KB for heroes), lower quality slightly or resize to the exact width (e.g. 1920) and export again from Canva.

2. **Save the WebP** with the same base name, e.g. `laguna-horizon.webp`.

**Optional:** For logos and small graphics, PNG from Canva is fine; the site can use PNG. WebP is most important for large photos (heroes, facility, cards) to keep the site fast.

---

## 4. File size checklist after export

| Type | Target | If over limit |
|------|--------|----------------|
| Heroes, CTA, page heroes | ≤350 KB | In Squoosh: WebP quality 75–80, or reduce Canva canvas to 1280×720 and re-export. |
| Portraits | ≤250 KB | WebP 80–85 in Squoosh. |
| Program / philosophy cards | ≤200 KB (≤150 for philosophy) | WebP 80; or reduce to 600×600 / 600×450 in Canva and re-export. |
| Community squares | ≤120 KB each | WebP 75–80 or smaller canvas (600×600). |
| Logos (LBTA, partners) | ≤50 KB / ≤40 KB | Export PNG at the recommended pixel size; if over, use smaller canvas or simplify in Canva. |

---

## 5. Where to put files in the project

Drop the final file (WebP or PNG/JPG) into the repo so the path matches what the site expects:

| Folder in project | For |
|-------------------|-----|
| `public/images/hero/` | laguna-horizon, cta-background, any page hero (e.g. about-hero, camps-hero). |
| `public/images/programs/` | hero.webp, schedules-hero, juniors, adults, private-lessons, high-performance, fitness, youth-dev-1, private-specialty. |
| `public/images/philosophy/` | movement, discipline, belonging. |
| `public/images/founder/` | andrew-portrait. |
| `public/images/coaches/` | andrew-headshot, robert-lebuhn, michelle, peter-defrantz, allison-cronk. |
| `public/images/community/` | community-1 … community-7 (and more if you add). |
| `public/images/results/` | karue-training, any other player success. |
| `public/photos/` | adult-trial-hero, facility gallery (LBCOURTSETTING, VideoAnalysisRoom, GymSetting, OncourtTraining, Court setting). |
| `public/logos/` | LBTAblktext.png, fit4tennis.png, racketrescue.png, racquetiq.png, gptca.png, toroline.png, tennisbeast.png, lbhs.png. |

**Filenames:**  
Use the exact names the site expects (e.g. `laguna-horizon.webp`, `andrew-portrait.webp`, `community-1.webp`).  
Full list of paths and names: see **plans/image-spec-best-in-class.md**.

---

## 6. Quick reference: one table to use in Canva

When you create a new design, pick the row that matches what you’re making:

| You’re making… | Canva size (W×H) | Export as | Then | Max size |
|-----------------|------------------|-----------|------|----------|
| Hero / big banner | 1920 × 1080 | JPG (high) | WebP in Squoosh (80–85) | 350 KB |
| Coach or founder portrait | 800 × 1000 or 600 × 800 | JPG or PNG | WebP in Squoosh | 250 KB |
| Program or philosophy card | 800 × 600 or 600 × 600 | JPG | WebP in Squoosh | 150–200 KB |
| Community / grid square | 800 × 800 | JPG | WebP in Squoosh | 120 KB |
| Partner logo | 320 × 160 (or 160 × 80) | PNG | Use as-is | 40 KB |
| LBTA main logo | 480 × 96 | PNG | Use as-is | 50 KB |

---

## 7. Summary

1. **Create** in Canva at the **exact pixel size** from the table (e.g. 1920×1080 for heroes).
2. **Export** JPG (photos/graphics) or PNG (logos/transparency), high quality.
3. **Convert** large images to WebP in [Squoosh](https://squoosh.app) (quality 80–85) and keep under the max file sizes.
4. **Save** into the right `public/` folder with the filename the site uses (see image-spec doc).

If you stick to these sizes and limits, everything you add from Canva will fit the site’s “best in class” image spec and keep the site fast.
