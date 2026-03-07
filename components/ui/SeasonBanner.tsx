'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getSeasonCTA } from '@/lib/season-utils'

export default function SeasonBanner() {
  const [isDismissed, setIsDismissed] = useState(true)
  const [cta, setCta] = useState<ReturnType<typeof getSeasonCTA> | null>(null)

  useEffect(() => {
    const dismissed = localStorage.getItem('season-banner-dismissed')
    if (dismissed) return

    const seasonCta = getSeasonCTA()
    if (seasonCta.headline) {
      setCta(seasonCta)
      setIsDismissed(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('season-banner-dismissed', 'true')
  }

  if (isDismissed || !cta) return null

  return (
    <div className="relative bg-brand-morning-light border-b border-gray-200 py-2">
      <div className="container-lbta">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-sans text-gray-600">
              <span className="font-serif font-light">{cta.headline}</span>
              {cta.subline && (
                <span className="ml-2 hidden sm:inline text-xs text-gray-400">
                  {cta.subline}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 min-h-[48px] min-w-[48px] flex items-center justify-center hover:bg-black/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
