/**
 * Court flyer print / PDF template — single source for dimensions used by:
 * - `CourtFlyer` (max content width)
 * - `scripts/generate-court-flyer-pdf.mjs` (viewport width — keep numeric value in sync)
 * - `scripts/generate-court-flyer-pdf-standalone.ts` (imports this module)
 *
 * 11″ page with ~0.4″ side margins → ~10.2″ content column (matches Playwright PDF).
 */
export const COURT_FLYER_VIEWPORT_WIDTH_PX = 1056 // 11in × 96 CSS px/in

/** Tailwind-friendly max width for the flyer column (screen + print). */
export const COURT_FLYER_MAX_WIDTH_CLASS = 'max-w-[10.2in]' as const
