'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface UrgencyBannerProps {
  message?: string
  highlight?: string
  spotsLeft?: number
  endDate?: string
  dismissible?: boolean
}

export default function UrgencyBanner({
  message = 'Winter 2026 Registration Now Open',
  highlight = 'Limited spots available',
  spotsLeft,
  endDate,
  dismissible = true,
}: UrgencyBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState<string>('')

  // Countdown timer if endDate provided
  useEffect(() => {
    if (!endDate) return

    const calculateTimeLeft = () => {
      const end = new Date(endDate).getTime()
      const now = new Date().getTime()
      const difference = end - now

      if (difference <= 0) {
        setTimeLeft('Ending soon')
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`)
      } else {
        setTimeLeft(`${hours}h left`)
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [endDate])

  // Check if dismissed in session
  useEffect(() => {
    if (sessionStorage.getItem('urgencyBannerDismissed')) {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('urgencyBannerDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-lbta-charcoal text-white py-2.5 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-center">
        {/* Pulsing indicator */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>

        {/* Message */}
        <p className="font-sans text-[13px] md:text-[14px]">
          <span className="font-medium">{message}</span>
          {highlight && (
            <>
              <span className="mx-2 text-white/40">·</span>
              <span className="text-white/80">{highlight}</span>
            </>
          )}
          {spotsLeft && (
            <>
              <span className="mx-2 text-white/40">·</span>
              <span className="text-orange-300 font-medium">Only {spotsLeft} spots left</span>
            </>
          )}
          {timeLeft && (
            <>
              <span className="mx-2 text-white/40">·</span>
              <span className="text-orange-300 font-medium">{timeLeft}</span>
            </>
          )}
        </p>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
