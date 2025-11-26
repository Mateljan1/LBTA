'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function WinterCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 })
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('winter-banner-dismissed')
      if (dismissed) {
        setIsDismissed(true)
        return
      }
    }

    const targetDate = new Date('2025-12-01T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('winter-banner-dismissed', 'true')
    }
  }

  if (isDismissed || timeLeft.days < 0) return null

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-3">
      <div className="container-lbta">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <p className="text-sm font-sans text-gray-700">
              <span className="font-medium">Winter 2026 Registration Opens:</span>{' '}
              <span className="font-serif font-light text-lg text-lbta-charcoal">
                {timeLeft.days} days {timeLeft.hours}h {timeLeft.minutes}m
              </span>
              {' '}• December 1, 2025
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

