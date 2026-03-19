# Print Assets — Court Flyer

## LBTA Master Court Flyer

The **court flyer** is a print-ready, data-driven flyer for posting at City of Laguna Beach tennis courts (Moulton Meadows, Alta Laguna, LBHS).

### How to view

1. Run the dev server: `npm run dev`
2. Open [http://localhost:3000/print/court-flyer](http://localhost:3000/print/court-flyer)

### How to generate PDF

1. Open `/print/court-flyer` in your browser.
2. **Print → Save as PDF** (or Print to printer).
3. Choose paper size: **11×17 (tabloid)** for court posting, or **Letter** if you prefer.
4. Save the file (e.g. `LBTA_Master_Flyer.pdf`).

### Data sources

- **Coaches & bios:** `data/coaches.json`, `data/flyer-coach-bios.json`
- **Coach photos:** `public/images/print/coach-andrew.png`, `coach-robert.png`, `coach-allison.png`, `coach-peter.png`
- **Private rates:** `data/private-rates.json`
- **Programs, schedules, pricing, camps:** `data/spring-summer-2026.json`, `data/year2026.json`
- **Contact & courts:** `lib/flyer-config.ts`

When you update any of these, refresh the flyer page and re-export to PDF to keep the posted flyer in sync.

### Coach photos

Coach headshots appear in the “Your Certified Coaching Team” section. For a uniform grid and no cropped faces:

- **Aspect ratio:** 3:4 (portrait). The flyer uses a 3:4 crop with `object-fit: cover` and `object-position: top`, so correct aspect keeps faces visible.
- **Recommended dimensions:** At least 300×400px (or 420×560px for higher quality). All four images should match dimensions so the grid is even.
- **Format:** PNG or WebP. Files: `coach-andrew.png`, `coach-robert.png`, `coach-allison.png`, `coach-peter.png` in `public/images/print/`.

To check that coach images meet the 3:4 aspect and exist, run:

```bash
node scripts/check-print-assets.mjs
```

### Logo strip (flyer header)

The flyer header shows two logos side by side on a dark navy strip (`#0F2237`): **LBTA** and the **City of Laguna Beach** seal.

- **LBTA:** `public/logos/LBTAwhttext.png` (white wordmark for dark background). Used at 52px height; width auto.
- **City of Laguna Beach seal:** `public/logos/city-laguna-beach.png`. Used at 52×52px inside a circular wrapper so both logos have equal visual weight.

**City seal asset:** Use a PNG with **true transparency** (no checkerboard or baked-in transparency grid). If the image has a checkerboard or grey background baked in, it will be visible on the flyer; the circular wrapper only masks the edges. For best results, export or obtain the official seal with an alpha channel and no background.
