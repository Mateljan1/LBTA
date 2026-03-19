---
title: Court flyer print clipping and header logo balance
category: ui-bugs
tags:
  - print
  - court-flyer
  - css
  - nextjs
  - lbta
date: 2026-03-19
symptoms:
  - Printed flyer cuts off content (e.g. partial headings at page edge).
  - LBTA wordmark looks tiny vs. City seal, or logos feel mismatched.
root_causes:
  - position:absolute on .court-flyer-print confuses multi-page print layout in Chromium/WebKit.
  - max-width ~320px on the LBTA Image was too narrow for the ~10.2in print column.
  - City seal filled a circle while LBTA was height-capped without enough width.
---

# Court flyer: print clipping + header logo balance

## Symptoms

- **Clipping:** Footer or mid-page content appears at the wrong edge, or text is truncated when printing / Save as PDF from `/print/court-flyer`.
- **Logos:** City seal reads larger than LBTA, or LBTA wordmark looks like a small blob.

## Root cause

1. **`position: absolute; left: 0; top: 0`** on `.court-flyer-print` (used with the “hide everything except flyer” print pattern) can cause the printable subtree to **not extend the document height correctly**, so the engine clips to the first viewport/page.
2. **LBTA `Image`** used **`max-w-[min(88vw,320px)]`**, which is appropriate on a phone but **shrinks the wordmark on a wide print column** (~979px at 10.2″).
3. **Visual balance:** A full-bleed **circle** next to a **short wide wordmark** needs shared **row height** and either inset seal art or matched outer geometry (`lib/court-flyer-print.ts`).

## Fix (summary)

| Change | Where |
|--------|--------|
| `position: relative !important` + `overflow: visible` on `.court-flyer-print` | `app/globals.css` `@media print` |
| `html:has(.court-flyer-print), body:has(...)` → `height: auto; overflow: visible` | same |
| Logo constants **64px** row, **56px** seal inside circle | `lib/court-flyer-print.ts` |
| LBTA slot: flex growth, **max width ~460px**, class `flyer-lbta-wordmark` | `components/print/CourtFlyer.tsx` |
| Print overrides for logo img dimensions | `app/globals.css` |
| Slightly smaller `@page` margin (**0.3in**) for printable area | `globals.css`, PDF scripts |

## Prevention

- Do **not** put `.court-flyer-print` back to `position: absolute` for print without retesting multi-page output.
- Keep flyer logo dimensions in **`lib/court-flyer-print.ts`** and import them in **`scripts/generate-court-flyer-pdf-standalone.ts`** so web + PDF stay aligned.
- When adding `max-width` on print-critical images, test against **`max-w-[10.2in]`** content column, not only mobile `vw`.

## Related

- `docs/print-assets.md` — print workflow and paper size.
- `plans/court-flyer-elevation-plan.md` — typography and footer horizon baseline.

## Update (2026-03-19)

- **Pricing copy:** Flyer uses **Adult programming** (session-based) and **Monthly classes for adults** (Fitness / LiveBall + Cardio) — not a combined “Adult & Fitness” header. Data: `getCourtFlyerProgramPricingRows()` in `lib/flyer-pricing.ts`.
- **Schedule legend:** Split **Youth development** and **LiveBall**; label grays as **Adult programming** to match pricing.
- **Early bird:** Spring starts **April 6, 2026**; deadline **March 28, 2026** in `COURT_FLYER_DISCOUNT_LINE` (`lib/flyer-config.ts`) and `data/site-stats.json`.
- **Print:** `.flyer-schedule-intro` uses `break-inside: avoid` so the schedule title + legend are not clipped at a page break.
- **Schedule SOT:** Weekly grids read the same program JSON as `/schedules` (`data/spring-summer-2026.json` for Spring/Summer). Junior **Saturday** sessions are **Laguna Beach High School (LBHS)** with weekday **Moulton** — do not drop Sat rows for “flyer simplification.”
- **Overlapping slots:** `buildWeekGridForLocation` merges same-day overlapping intervals into one cell (`mergeOverlappingCalendarSlots` in `lib/calendar-schedule.ts`) with newline-separated program names and `whitespace-pre-line` in `CourtFlyer`, `ScheduleCalendarView`, and the standalone PDF script.
