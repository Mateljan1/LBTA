# LBTA Website Assets — Drop Folder

## How to use (easy way)

1. Open a main folder (e.g. **camps**, **hero**, **conversion**, **programs**).
2. Open **START-HERE.txt** — it tells you the idea.
3. Open **one subfolder** (e.g. camps → **red-ball**).
4. Open **WHAT-WE-NEED.txt** inside — it says exactly what photo we need, what to name it, and the size.
5. Add your photo in that subfolder and name it as shown (e.g. **red-ball.webp** or red-ball.jpg).

Repeat for any subfolder. You can add photos in any order. When we copy to the project, we take the image from each subfolder and place it in the right spot (e.g. hero/philosophy-hero/philosophy-hero.webp → project public/images/hero/philosophy-hero.webp).

**Full list:** **SPECS-EVERY-SLOT.txt** in this folder has every slot and size in one place.

---

## Conversion flow (trial, book, thank-you)

When someone signs up for a trial or books, they see:

- **Book page (/book)** — Currently **no photo**. Add **book-hero.webp** (1920×1080) so the hero has inviting courts. → Drop in **conversion/** or **hero/**.
- **Junior trial (/junior-trial)** — Has one hero (juniors.webp). Optional: 2–3 images above the form. → **conversion/** or **programs/**.
- **Adult trial (/adult-trial)** — Has one hero. Add **one image** in “Why This Works” (adult group or coach with adults). → **conversion/** (adult-trial-why-image.webp).
- **Thank-you page** — Currently **no photo**. Optional: one “see you on court” image. → **conversion/** (thank-you-image.webp).

Use the **conversion/** subfolders (book-hero, adult-trial-why-image, thank-you-image, etc.) — each has **WHAT-WE-NEED.txt**.

---

## Folder → Project mapping

When you copy into the project, place files like this:

| This folder       | Goes to in project        | What to put here |
|-------------------|---------------------------|-------------------|
| **hero/**         | `public/images/hero/`     | Page heroes (16:9, 1920×1080). Includes **book-hero** for Book page. |
| **conversion/**   | mixed (see conversion/DROP_HERE) | Book hero, adult-trial “Why” image, thank-you image, optional trial strips. |
| **programs/**     | `public/images/programs/` | Program cards (4:3, 800×600). |
| **philosophy/**   | `public/images/philosophy/` | Pillars (1:1, 800×800): movement, discipline, belonging. |
| **community/**    | `public/images/community/` | Community grid (1:1): community-1 … 12. |
| **results/**      | `public/images/results/`  | Pro/results: karue-training, results-player-2, -3. |
| **why-choose/**   | `public/images/why-choose/` | why-choose-1, why-choose-2. |
| **coaches/**      | `public/images/coaches/`  | Portraits + action (andrew, robert, peter, allison). |
| **founder/**       | `public/images/founder/`  | andrew-portrait (800×1000). |
| **camps/**        | `public/images/camps/`    | Red/orange/green ball, camp-action-1…4. |
| **facility/**     | `public/images/facility/` | Courts, gym, video room (optional). |
| **photos/**       | `public/photos/`          | Gallery + adult-trial-hero. |
| **videos/**       | `public/videos/`          | LBTA-Home-Hero (MP4). |
| **cta/**          | `public/images/cta/`     | cta-background. |
| **testimonials/** | `public/images/`         | Optional quote+photo assets. |

---

## Sizes (export from Canva)

- **Hero:** 1920×1080 (16:9)
- **Card / section:** 800×600 (4:3) or 800×800 (1:1)
- **Portrait:** 600×800 (3:4) or 800×1000 (4:5)
- **Video hero:** 1920×1080, 15–30 sec, MP4

PNG or JPG is fine — we’ll convert to WebP in the project.

**In this folder:** **SPECS-EVERY-SLOT.txt** = every slot, size, and “used on.” Each subfolder has **DROP_HERE.txt** with the same for that category. **plans/canva-asset-brief.md** and **plans/media-value-map.md** in the repo have the full layout strategy and conversion flow.

---

## After you fill the folders

1. From each **subfolder** (e.g. hero/philosophy-hero/), take the image file you added and copy it into the project with the **filename** from WHAT-WE-NEED (e.g. philosophy-hero.webp → project `public/images/hero/philosophy-hero.webp`).
2. Or: copy the whole asset folder into the project and we’ll flatten subfolders so each image lands in the right place (hero/philosophy-hero/philosophy-hero.webp → public/images/hero/philosophy-hero.webp).
3. We’ll compress to WebP (heroes ≤350KB, cards ≤200KB) and wire paths in the code.

**Folders that have subfolders + WHAT-WE-NEED:** hero, programs, camps, conversion, philosophy, why-choose, founder, results. The rest (community, coaches, facility, photos, videos, cta, testimonials) still use **DROP_HERE.txt** for the list — we can add subfolders there too if you want.
