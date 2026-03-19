/**
 * Court flyer print / PDF template — single source for dimensions used by:
 * - `CourtFlyer` (max content width)
 * - `scripts/generate-court-flyer-pdf.mjs` (viewport width — keep numeric value in sync)
 * - `scripts/generate-court-flyer-pdf-standalone.ts` (imports this module)
 *
 * Tabloid 11″ wide; `@page lbta-court-flyer` uses 0.3″ margins. Inner column cap: `COURT_FLYER_MAX_WIDTH_CLASS` (10.2″); PDF script margins match `@page`.
 */
export const COURT_FLYER_VIEWPORT_WIDTH_PX = 1056 // 11in × 96 CSS px/in

/** Tailwind-friendly max width for the flyer column (screen + print). */
export const COURT_FLYER_MAX_WIDTH_CLASS = 'max-w-[10.2in]' as const

/** Logo strip: City circle outer diameter; LBTA wordmark uses same cap height (px at 1:1). Larger for clear print/scan. */
export const COURT_FLYER_LOGO_ROW_PX = 88
/** City seal artwork inside the circle (slight inset so both marks read balanced). */
export const COURT_FLYER_CITY_SEAL_INNER_PX = 72
