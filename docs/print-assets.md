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
