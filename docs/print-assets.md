# Print Assets — Court Flyer

## LBTA Master Court Flyer

The **court flyer** is a print-ready, data-driven flyer for posting at City of Laguna Beach tennis courts (Moulton Meadows, Alta Laguna, LBHS).

### How to view

1. Run the dev server: `npm run dev`
2. Open [http://localhost:3000/print/court-flyer](http://localhost:3000/print/court-flyer)

### How to generate PDF

1. Open `/print/court-flyer` in your browser.
2. **Print → Save as PDF** (or Print to printer).
3. Choose paper size: **11×17 (Tabloid)** for court posting. Print CSS uses a named page at **11in × 17in** with **0.3in** margins. If the preview still clips, enable **Fit to page** / scale to fit.
4. Save the file (e.g. `LBTA_Master_Flyer.pdf`).

### Data sources

- **Coaches & bios:** `data/coaches.json`, `data/flyer-coach-bios.json`
- **Coach photos:** `public/images/print/coach-andrew.png`, `coach-robert.png`, `coach-allison.png`, `coach-peter.png`
- **Private rates:** `data/private-rates.json`
- **Programs, schedules, pricing, camps:** `data/spring-summer-2026.json`, `data/year2026.json`
- **Contact & courts:** `lib/flyer-config.ts` (includes City Recreation online registration URL for Rec1)

When you update any of these, refresh the flyer page and re-export to PDF to keep the posted flyer in sync.

**City online registration:** The flyer links to `FLYER_CONTACT.registerUrl` in `lib/flyer-config.ts` (City of Laguna Beach Recreation catalog on [secure.rec1.com](https://secure.rec1.com)). Update that constant if the City changes the catalog link.

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

- **LBTA:** `public/logos/LBTAblktext.png` with `brightness-0 invert` on the navy strip. Wordmark cap height = `COURT_FLYER_LOGO_ROW_PX` (**64px**); allow up to **460px** width so the full mark prints on a ~10.2″ column (do not cap ~320px).
- **City of Laguna Beach seal:** `public/logos/city-laguna-beach.png`. Outer circle **64px**; seal artwork **56px** (`COURT_FLYER_CITY_SEAL_INNER_PX`) inside the ring for balance with the wordmark.

**City seal asset:** Use a PNG with **true transparency** (no checkerboard or baked-in transparency grid). If the image has a checkerboard or grey background baked in, it will be visible on the flyer; the circular wrapper only masks the edges. For best results, export or obtain the official seal with an alpha channel and no background.
