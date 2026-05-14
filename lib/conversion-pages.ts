/**
 * Conversion-page registry — single source of truth for "this page IS the
 * conversion form, don't render competing CTAs on top of it".
 *
 * Background: 2026-05-13 incident — the bottom-of-screen mobile StickyCTA
 * ("Book a Trial") was rendering on /contact and overlaying the page's own
 * "Send Message" submit button on at least one viewport size, blocking real
 * submissions. The fix is to suppress sticky/overlay CTAs on pages that are
 * themselves dedicated conversion surfaces.
 *
 * Pages are matched by pathname prefix. Trailing slashes / nested segments
 * count as the same page (e.g. `/junior-trial/foo` is still a junior-trial
 * surface).
 *
 * When adding a new dedicated form page, append its prefix here so future
 * floating CTAs we ship don't accidentally regress conversion.
 */

export const CONVERSION_PAGE_PREFIXES = [
  '/contact',
  '/book',
  '/junior-trial',
  '/adult-trial',
  '/apply-scholarship',
  '/beginner-program',
] as const

export function isConversionPage(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return CONVERSION_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}
