import { cookies } from 'next/headers'
import { getSeasonCTA } from '@/lib/season-utils'
import SeasonBannerDismiss from './SeasonBannerDismiss'

/**
 * Server-rendered season banner.
 *
 * Why server-rendered (audit C-4 fix): the previous client-only version
 * defaulted `isDismissed=true` and only mounted real banner content after a
 * `useEffect` read `localStorage`. Lighthouse measured a universal 0.097 CLS
 * shift on every shared-layout route as the banner appeared post-hydration
 * and pushed the footer down. Reading the dismissal cookie + computing the
 * active CTA on the server lets SSR emit the final DOM in one paint, so
 * there's nothing left to shift after hydration.
 *
 * The dismiss button is the only interactive surface and lives in a tiny
 * client child (`SeasonBannerDismiss`) that writes the cookie and removes
 * the banner from the DOM. The shift caused by user-initiated dismissal
 * does not count toward CLS (Lighthouse only measures shifts before the
 * first user interaction), so a single round-trip refresh later, the
 * dismissal persists with zero CLS cost.
 */
export default async function SeasonBanner() {
  const cookieStore = await cookies()
  const isDismissed = cookieStore.get('season-banner-dismissed')?.value === 'true'
  if (isDismissed) return null

  const cta = getSeasonCTA()
  if (!cta.headline) return null

  return (
    <aside
      aria-label="Season notice"
      className="relative bg-brand-morning-light border-b border-gray-200 py-2"
      data-component="season-banner"
    >
      <div className="container-lbta">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-sans text-lbta-slate">
              <span className="font-headline font-light">{cta.headline}</span>
              {cta.subline && (
                <>
                  {/* Explicit space avoids headline ending in “Open” + subline “Starts…” reading as one word on some breakpoints */}
                  {' '}
                  <span className="hidden sm:inline text-xs text-lbta-slate/60">{cta.subline}</span>
                </>
              )}
            </p>
          </div>
          <SeasonBannerDismiss />
        </div>
      </div>
    </aside>
  )
}
