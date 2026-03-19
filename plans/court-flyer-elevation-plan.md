# Court Flyer Elevation — Implementation Plan

## Overview

Elevate the LBTA Master Court Flyer to maximum polish by applying print-optimized typography for 11×17 readability, adding a footer horizon accent for visual closure, and documenting coach-photo asset standards so future updates stay consistent.

## Problem Statement

- **Current state:** The flyer has Brand Guide accents (section horizons, CTA section-quote), clear hierarchy, and correct data. It is already production-ready.
- **Gap:** (1) At arm’s length on court, schedule and body type could be slightly larger for 11×17; (2) the footer has no horizon accent, unlike the rest of the flyer; (3) there is no written standard for coach photo dimensions/aspect, so future asset swaps may break layout.
- **Goal:** Make the flyer the best it can be for fence posting and maintainability without changing content or data sources.

## Proposed Solution

1. **Print typography (11×17):** Increase base and schedule font sizes in both the React flyer (via print media or a print-specific scale) and the standalone PDF script so the flyer is optimized for Ledger at typical viewing distance. Keep hierarchy (headline > section > body > caption). (Source: .cursorrules Part 8 typography scale; doc targets 11×17 per docs/print-assets.md.)
2. **Footer horizon accent:** Add a short horizon bar (same gradient as section-horizon) under the “Movement. Craft. Community.” line in the footer in both CourtFlyer and the PDF HTML, for visual closure and Brand Guide consistency.
3. **Coach photo asset spec:** Document in `docs/print-assets.md` the required dimensions (e.g. 3:4 aspect, min width/height), format (PNG/WebP), and max file size for `public/images/print/coach-*.png`. Optionally add a small validation note or script that checks dimensions (out of scope: auto-resizing images).

## Implementation Steps

### Phase 1: Print typography for 11×17

- [ ] **1.1** In `app/globals.css`, under the existing `@media print` block for `.court-flyer-print`, add or adjust font-size overrides so that within the flyer: body text is at least 12px equivalent, schedule table cells at least 11px, and captions/discount line at least 10px. Use the 12px base unit where possible (e.g. 12px, 14px, 10px). Ensure no horizontal overflow.
- [ ] **1.2** In `components/print/CourtFlyer.tsx`, add print-specific classes or rely on the globals print overrides so that when printed (or in PDF), schedule table and data tables use the larger sizes. Prefer CSS in globals so one place controls print sizing.
- [ ] **1.3** In `scripts/generate-court-flyer-pdf-standalone.mjs`, increase body font-size from 11px to 12px, schedule-tbl and data-tbl from 10px to 11px, and discount-line/caption from 9px to 10px. Confirm PDF still fits Ledger with existing margins (0.4in).

### Phase 2: Footer horizon accent

- [ ] **2.1** In `components/print/CourtFlyer.tsx`, add a horizon bar under the “Movement. Craft. Community.” tagline in the footer: use the same `section-horizon` class (or a footer variant) with `aria-hidden="true"`, centered, with appropriate top margin so it sits between tagline and “Official City Partner”.
- [ ] **2.2** In `scripts/generate-court-flyer-pdf-standalone.mjs`, add a `<div class="section-horizon">` in the footer HTML between the tagline and the partner line. Reuse existing `.section-horizon` CSS (already in the inline styles); add a small top margin for spacing.

### Phase 3: Coach photo asset specification

- [ ] **3.1** In `docs/print-assets.md`, add a **Coach photos** subsection that specifies: aspect ratio (3:4), recommended min dimensions (e.g. 420×560px or 300×400px), format (PNG or WebP), and a note that all four images should match dimensions for a uniform grid. State that the flyer uses `object-fit: cover` and `object-position: top` so faces are not cropped when aspect is correct.
- [ ] **3.2** (Optional) Add a one-line note or script reference: “To check coach image dimensions, run `node scripts/check-print-assets.mjs`” and implement a minimal script that reads the four coach images, reports dimensions and aspect ratio, and exits 0 only if all are 3:4 within tolerance. If omitted, the doc update alone is sufficient for this plan.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/globals.css` | Modify | Print font-size overrides for .court-flyer-print (body, schedule, captions). |
| `components/print/CourtFlyer.tsx` | Modify | Footer: add section-horizon bar under tagline. |
| `scripts/generate-court-flyer-pdf-standalone.mjs` | Modify | Larger font sizes in inline CSS; footer horizon div. |
| `docs/print-assets.md` | Modify | Coach photo spec (aspect, dimensions, format). |
| `scripts/check-print-assets.mjs` | Create (optional) | Validate coach image dimensions; document in print-assets. |

```yaml
# files (for tooling; do not edit by hand)
create:
  - scripts/check-print-assets.mjs
modify:
  - app/globals.css
  - components/print/CourtFlyer.tsx
  - scripts/generate-court-flyer-pdf-standalone.mjs
  - docs/print-assets.md
```

## Out of scope (this plan)

- Changing flyer content or data sources (e.g. programs, pricing, copy).
- Automatically resizing or processing coach images (only document spec; optional check script).
- Adding new sections or CTAs to the flyer.
- Changing the PDF script’s data loading (still spring-summer-2026, year2026, etc.).

## Success Criteria

- [ ] At 11×17 (Ledger), body and schedule text are easier to read at arm’s length (larger than current 10–11px where appropriate).
- [ ] Footer includes a horizon bar under “Movement. Craft. Community.” in both web view and generated PDF.
- [ ] `docs/print-assets.md` documents coach photo aspect ratio and recommended dimensions.
- [ ] Generated PDF still fits one page (or intended page break) with 0.4in margins; no horizontal overflow.
- [ ] Lint passes; no regressions to existing flyer behavior.

## Acceptance checklist

- [ ] **[Typography]** Open `/print/court-flyer`, print to PDF (11×17), confirm schedule and body text appear larger than before; compare with previous PDF if available.
- [ ] **[Footer accent]** In browser and in generated PDF, footer shows a short gradient bar between “Movement. Craft. Community.” and “Official City Partner”.
- [ ] **[Doc]** `docs/print-assets.md` contains a “Coach photos” subsection with aspect ratio 3:4 and recommended min dimensions.
- [ ] **[PDF script]** `node scripts/generate-court-flyer-pdf-standalone.mjs` produces `~/Desktop/LBTA_Master_Flyer.pdf` without error; PDF fits Ledger.
- [ ] **[Lint]** `npm run lint` passes.

## Research Sources

- .cursorrules Part 8 (Typography scale), Part 7 (Color tokens), Part 10 (Buttons/Cards).
- COMPOUND_LEARN.md (Brand Kit tokens only; no hardcoded hex).
- docs/print-assets.md (current print workflow and data sources).
- plans/court-flyer-master-implementation-plan.md (original flyer scope and layout).

## Relevant Learnings

- Use Brand Kit tokens only; no hardcoded hex (COMPOUND_LEARN, .cursorrules).
- Section accents: HorizonDivider or `.section-horizon` under key headings; footer can use same pattern for closure (.cursorrules Part 10, Brand Guide).
- Flyer data: single source from `/data` and `lib/flyer-config.ts` (docs/print-assets.md, court-flyer-master-implementation-plan).

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Larger font causes PDF to overflow Ledger | Keep increases modest (1–2px); re-run PDF and check; reduce section padding if needed. |
| Footer horizon looks cramped | Use small top margin (e.g. 6–8px); match section-horizon max-width 120px. |
| Check script adds dependency | Make script optional; document-only spec is sufficient for acceptance. |

## Confidence & uncertainty

- **Plan confidence:** High. Changes are scoped and file list is small.
- **Uncertainty:** Exact pixel sizes for “arm’s length” are subjective; we use a single step up from current (11→12, 10→11, 9→10) and can tune in Work if PDF feels tight.
