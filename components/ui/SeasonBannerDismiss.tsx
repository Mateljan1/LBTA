'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * Dismiss button for the (server-rendered) SeasonBanner.
 *
 * Stores the dismissal as a 1-year cookie (so SSR on the next page can
 * skip rendering the banner — same lifetime as the previous localStorage
 * implementation) and immediately removes the banner from the DOM via
 * local state. The local removal is a user-initiated layout change, which
 * doesn't count toward CLS per Web Vitals semantics.
 */
export default function SeasonBannerDismiss() {
  const [hidden, setHidden] = useState(false)

  const handleDismiss = () => {
    const oneYearSeconds = 60 * 60 * 24 * 365
    document.cookie = `season-banner-dismissed=true; path=/; max-age=${oneYearSeconds}; SameSite=Lax`
    setHidden(true)
    // Bubble up to remove the entire banner element (parent <aside data-component="season-banner">)
    if (typeof document !== 'undefined') {
      const aside = document.querySelector<HTMLElement>('aside[data-component="season-banner"]')
      if (aside) aside.style.display = 'none'
    }
  }

  if (hidden) return null

  return (
    <button
      onClick={handleDismiss}
      className="flex-shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-black/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
      aria-label="Dismiss banner"
    >
      <X className="w-4 h-4 text-lbta-slate/60" />
    </button>
  )
}
