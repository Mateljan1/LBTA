/**
 * Next.js `<Image quality={…}>` must match `qualities` in `next.config.js`.
 *
 * **Quality (sharpness)** — WebP-only output in `next.config.js` keeps masters from looking mushy.
 * - **STANDARD (95):** Cards, grids, coaches, schedules — excellent on retina; smaller than 100 with negligible visible difference.
 * - **HERO (100):** Full-bleed sections, large portraits, carousel backgrounds — max encoder quality.
 *
 * **Speed (without lowering visible quality)** — correct `sizes`, `priority` only on true LCP, and carousels that
 * crossfade with **AnimatePresence mode="sync"** (at most two slides during the fade, not N on first paint).
 */
export const IMAGE_QUALITY_STANDARD = 95
export const IMAGE_QUALITY_HERO = 100
