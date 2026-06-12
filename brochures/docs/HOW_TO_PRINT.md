# LBTA V2 Brochures — How to Print

**Date:** 2026-05-06 · **Owner:** Andrew Mateljan
**Source PDFs:** `brochures/out/*.pdf` (regenerate with `bash scripts/build_brochures.sh`)

> All 8 PDFs are RGB-print, fonts embedded as subsets, with the LBTA brand palette
> baked in. Most local print shops will convert to CMYK at proof. If you need
> hard CMYK separations, run the PDFs through `ghostscript` (see "Strict CMYK"
> at bottom).

---

## Per-variant print spec

| File | Trim | Bleed | Stock | Ink | Folding/Binding | First-run qty |
|---|---|---|---|---|---|---|
| `01_TriFold_Core.pdf` | 11×8.5" landscape | 0.125" | 100lb gloss text or matte text | 4/4 (full color front + back) | Tri-fold (roll fold or accordion) | 250–500 |
| `02_A5Booklet_Core.pdf` | A5 (5.83×8.27") | 0.125" | 80lb matte text · 100lb cover for outer | 4/4 | Saddle-stitch, 8 pages, 2 wires | 100–250 |
| `03_5x7_Postcard.pdf` | 7×5" landscape | 0.125" | 16pt cover (uncoated soft-touch ideal) | 4/4 | None | 500–1,000 |
| `04_Hotel_Concierge.pdf` | 8.5×11" letter | none | 100lb gloss text | 4/4 | None | 100 (per concierge desk × ~10 hotels) |
| `05_Local_Family.pdf` | 8.5×11" letter | none | 80lb matte text | 4/4 | None | 250 |
| `06_Email_Warm_Lead.pdf` | 8.5×11" letter | none | Digital only — never print | n/a | n/a | n/a |
| `07_Private_Coaching_OnePager.pdf` | 8.5×11" letter | none | 100lb matte cover | 4/4 | None | 50–100 |
| `08_Seasonal_Insert_Spring2026.pdf` | 6×4" landscape | 0.125" | 16pt cover | 4/4 | None — slips into 01/02 | 500 |
| `09_Pod_Application_OnePager.pdf` (by invitation) | 8.5×11" letter | none | **Uncoated soft-touch cover** (premium tactile feel) | 4/4 | None | **25–50** (very low — personal handoff piece) |
| `10_Placement_Guide.pdf` (**internal** — both audiences) | 11×8.5" landscape | none | 80lb matte text · or printer-friendly digital PDF | 4/4 | None | **25–50** staff stack only |
| `11_Placement_Juniors.pdf` (**distribution** — parents) | 8.5×11" letter | none | 80lb matte text or digital PDF | 4/4 | None | **250** for school pickups + email send |
| `12_Placement_Adults.pdf` (**distribution** — adult prospects) | 8.5×11" letter | none | 80lb matte text or digital PDF | 4/4 | None | **250** for café drops + email send |
| `13_Annual_Pricing.pdf` (**reference** — what it costs all year) | 8.5×11" letter | none | 80lb matte text or digital PDF | 4/4 | None | **100** staff stack + emailed on request |
| `14_Annual_Calendar.pdf` (**reference** — year at a glance) | 11×8.5" landscape | none | 80lb matte text or digital PDF | 4/4 | None | **100** staff stack + emailed with welcome packet |

> **Bleed note:** The print PDFs are sized at the trim dimension (e.g. 7×5"
> for the postcard). They do **not** include a separate bleed area. Most
> commercial printers will scale up to add bleed at proof; tell them you want
> 0.125" bleed all around. If the printer requires bleed baked into the PDF,
> regenerate from the template by changing `@page` to add the bleed (e.g.
> `7.25in 5.25in`) and shifting content with `@page { margin: 0; }`.

---

## Recommended print shops

- **Laguna Beach (local):** Fast Signs Laguna Beach, Sir Speedy Newport Beach
- **OC pro (multi-day, higher quality):** PrintRunner (Anaheim), GotPrint (Burbank)
- **Online (cheapest, slower):** Moo (postcards), Vistaprint (booklets), MGX Copy (tri-folds)

For Pacific-coast luxury feel, prefer **uncoated** or **soft-touch** stocks over
high-gloss. Soft-touch on the postcard especially gives the brand identity the
right tactile weight.

---

## Variant 09 — Pod (by invitation only)

**Distribution rule:** Variant 09 is **never** part of the open set. It is:
- Handed in person to a UHNW prospect during a conversation Andrew is already in
- Or attached to a personal email Andrew sends after a Pod inquiry
- Or printed in batches of 25–50 max — kept in Andrew's personal stack, not at the front desk

It is **never**:
- Placed at a hotel concierge counter
- Distributed to a school or community center
- Sent in a mass email
- Posted on the website

The PDF stages in `~/Desktop/LBTA_Brochures_v2/_BY_INVITATION_ONLY/` to make this rule visible at the file-system level.

**Print spec for variant 09:** Soft-touch uncoated cover stock (the tactile difference matters for the Pod's voice). Single-sided, full bleed-edge OK without trim marks since this isn't going through commercial trimming. PrintRunner's "Suede" finish or Moo's "Soft Touch" stock both work well at this quantity.

---

## Distribution targets (first-run priorities, public set 01–08)

### Hotel concierge (variant 04)
- The Ranch at Laguna Beach
- Montage Laguna Beach
- Surf & Sand Resort
- Inn at Laguna Beach
- Pacific Edge Hotel
- Hotel Laguna (when reopening)
- La Casa del Camino

10 copies per concierge desk; ask permission first; reorder quarterly with the
seasonal insert (variant 08).

### Local family (variant 05)
- Laguna Beach Boys & Girls Club
- Laguna Beach Library (front desk)
- Top of the World Elementary parent newsletter pickup
- Thurston Middle School counselor's office
- Laguna Beach High School athletics office

### Universal (variants 01–03 + 08)
- Front desk at all three city parks (with city permission)
- Laguna Beach Tennis Club bulletin board (after partnership confirmation)
- Local cafés the LBTA community frequents (Active Culture, Urth Caffé, etc.)

---

## Strict CMYK (when a print shop requires it)

```bash
# Requires ghostscript (brew install ghostscript)
for f in brochures/out/*.pdf; do
  gs -o "brochures/out/cmyk-$(basename $f)" \
     -sDEVICE=pdfwrite \
     -sColorConversionStrategy=CMYK \
     -dProcessColorModel=/DeviceCMYK \
     -dColorConversionStrategyForImages=/CMYK \
     "$f"
done
```

The resulting `cmyk-*.pdf` files are color-managed for offset/digital CMYK
presses. Visual color may shift slightly from the RGB originals (especially the
horizon gradient — teal and orange near the gamut edge). Always proof with the
printer before a long run.

---

## Quarterly refresh

Every 90 days (or when programs/prices change), Andrew or whoever holds the
content runs:

```bash
bash scripts/build_brochures.sh
```

If anything in `data/spring-summer-2026.json`, `data/private-rates.json`,
`data/leagues-2026.json`, or `data/coaches.json` has changed, the PDFs
regenerate from the new truth. The pre-flight QA fails if any banned word,
banned font, or unreachable URL slipped in.

For seasonal handoff (Summer 2026, Fall 2026, Winter 2027), copy
`08_seasonal_insert_spring2026.html` to `08_seasonal_insert_summer2026.html`,
adjust the `season.summer` references, and re-render. Variants 01–07 don't need
any code changes — they pick up the new season automatically.
