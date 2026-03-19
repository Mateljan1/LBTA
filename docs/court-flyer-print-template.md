# Court flyer print template

Optimized for **fence-distance reading**, **Save as PDF**, and **Playwright PDF** (no fixed 17″ blank page).

## Source of truth

| Constant / rule | Location |
|-----------------|----------|
| Viewport width (11″ @ 96px) | `lib/court-flyer-print.ts` → `COURT_FLYER_VIEWPORT_WIDTH_PX` |
| Content column max width | `COURT_FLYER_MAX_WIDTH_CLASS` (`10.2in` ≈ 11″ − 0.4″ margins) |
| Print typography & color | `app/globals.css` → `@media print` → `.court-flyer-print` |
| React layout | `app/print/court-flyer/layout.tsx` + `components/print/CourtFlyer.tsx` |

## Commands

- **From running site:** `node scripts/generate-court-flyer-pdf.mjs` (needs `npm run dev` or deployed URL).
- **Offline:** `npm run build:court-flyer-pdf-standalone`

Both scripts set the viewport to `COURT_FLYER_VIEWPORT_WIDTH_PX` and PDF **height** to content `scrollHeight` so the file is not padded with empty space.

## Print checklist

- [ ] Browser print preview: schedule **cell colors** visible (background graphics on).
- [ ] Text readable at arm’s length; tables ≥ ~13px in print rules.
- [ ] Long schedule may **split across pages** (by design); footer tries to stay intact.
