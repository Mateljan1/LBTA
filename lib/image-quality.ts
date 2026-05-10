/**
 * Next.js `<Image quality={…}>` constants.
 *
 * These constants must be values from the `qualities` array in `next.config.js`.
 *
 * ## Why these defaults
 *
 * Empirical measurement on /about hero (2026-05-09):
 * - q=95 served 894 KB
 * - q=80 served ~280 KB (3.2× smaller)
 * - q=75 served 226 KB (4× smaller)
 *
 * For WebP photos at typical viewing distance (laptop/phone), q=80 is visually
 * indistinguishable from q=95. Using q=95 across the codebase was a 60-70%
 * payload bloat with zero perceivable benefit.
 *
 * **Default to STANDARD (80) for everything**, including hero photos. Only bump
 * to HERO (85) for editorial moments where the photo IS the content (full-bleed
 * portraits, large editorial spreads). Never go above 85 — payload growth is
 * exponential, visual gain is asymptotic.
 *
 * ## When to use which
 *
 * | Constant | Use for |
 * |---|---|
 * | DETAIL (75) | Card thumbnails, grid tiles, anything <= 200px on screen |
 * | STANDARD (80) | Default for everything else — heroes, portraits, content images |
 * | HERO (85) | Reserved for editorial full-bleed where photo IS the content |
 *
 * ## How to migrate up if needed
 *
 * If a specific image looks visibly wrong at 80, bump that ONE callsite to 85
 * and document why (a comment is enough). Do NOT raise the default — the q=95
 * regression was caused by trusting an aspirational "STANDARD = 95" without
 * empirical measurement of payload cost.
 */

export const IMAGE_QUALITY_DETAIL = 75
export const IMAGE_QUALITY_STANDARD = 80
export const IMAGE_QUALITY_HERO = 85
