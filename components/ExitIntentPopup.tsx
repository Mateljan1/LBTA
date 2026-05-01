'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, Check } from 'lucide-react'

/** Exit-intent only on program/booking funnel pages — not philosophy, legal, thank-you, or internal tools. */
function isExitIntentPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === '/') return true
  return (
    pathname.startsWith('/programs') ||
    pathname.startsWith('/schedules') ||
    pathname.startsWith('/camps') ||
    pathname.startsWith('/book') ||
    pathname.startsWith('/fitness') ||
    pathname.startsWith('/coaches') ||
    pathname.startsWith('/junior-trial') ||
    pathname.startsWith('/adult-trial') ||
    pathname.startsWith('/beginner-program') ||
    pathname.startsWith('/match-play') ||
    pathname.startsWith('/high-performance-pathway') ||
    pathname.startsWith('/racquet-rescue')
  )
}

export default function ExitIntentPopup() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousActiveRef = useRef<HTMLElement | null>(null)
  const hasScrolledPastThresholdRef = useRef(false)
  const SCROLL_THRESHOLD_PX = 360 // Stronger engagement gate before popup can appear

  useEffect(() => {
    if (!isExitIntentPath(pathname)) return

    // Check if already shown in this session
    const shown = sessionStorage.getItem('exitPopupShown')
    if (shown) {
      setHasShown(true)
      return
    }

    // Track scroll so we never show on initial load — only after user has engaged (scrolled)
    const handleScrollTrack = () => {
      if (window.scrollY > SCROLL_THRESHOLD_PX) hasScrolledPastThresholdRef.current = true
    }
    window.addEventListener('scroll', handleScrollTrack, { passive: true })

    // Exit intent: only show if user has scrolled past threshold first (never on first paint)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown && hasScrolledPastThresholdRef.current) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    // Mobile: detect scroll up (potential exit) — only after they've scrolled down first
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > SCROLL_THRESHOLD_PX) hasScrolledPastThresholdRef.current = true
      if (currentScrollY < lastScrollY - 140 && currentScrollY < 140 && !hasShown && hasScrolledPastThresholdRef.current) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
      lastScrollY = currentScrollY
    }

    // Delay adding exit-intent/scroll listeners to avoid showing on load
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 18000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScrollTrack)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown, pathname])

  // Clear success timeout on unmount to avoid setState after unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
        successTimeoutRef.current = null
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'exit-intent-popup',
          offer: 'training-tips'
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        successTimeoutRef.current = setTimeout(() => {
          previousActiveRef.current?.focus()
          successTimeoutRef.current = null
          setIsVisible(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const close = useCallback(() => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
      successTimeoutRef.current = null
    }
    setIsVisible(false)
    previousActiveRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!isVisible || !dialogRef.current) return
    previousActiveRef.current = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    if (first) first.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab' || focusable.length === 0) return
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousActiveRef.current?.focus()
    }
  }, [isVisible, close])

  if (!isExitIntentPath(pathname) || !isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[1px] animate-fade-in"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-brand-morning-light w-full max-w-[400px] animate-scale-in outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
      >
        {/* Close button — 48×48px touch target */}
        <button
          type="button"
          onClick={close}
          className="absolute top-5 right-5 min-w-[48px] min-h-[48px] flex items-center justify-center text-brand-pacific-dusk/40 hover:text-brand-pacific-dusk transition-colors z-10 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-inset"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="px-8 py-14 text-center">
            <div className="w-14 h-14 bg-brand-pacific-dusk rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-7 w-7 text-white" strokeWidth={2} aria-hidden />
            </div>
            <h3
              id="exit-popup-title"
              className="font-headline text-[28px] font-semibold text-brand-pacific-dusk mb-3"
            >
              You&apos;re In
            </h3>
            <p className="font-sans text-[15px] text-brand-pacific-dusk/80 leading-relaxed max-w-[280px] mx-auto">
              Check your email for practical tennis tips and key schedule updates.
            </p>
          </div>
        ) : (
          <>
            {/* Top Accent Line */}
            <div className="h-[3px] bg-brand-pacific-dusk" />

            {/* Content */}
            <div className="px-8 py-10 md:px-9 md:py-11">
              {/* Eyebrow */}
              <p className="text-eyebrow text-brand-pacific-dusk/60 text-center mb-4">
                LBTA Insider Notes
              </p>

              {/* Headline */}
              <h3
                id="exit-popup-title"
                className="font-headline text-[30px] md:text-[34px] font-semibold text-brand-pacific-dusk text-center leading-[1.1] mb-4"
              >
                Stay Close to the Court
              </h3>

              {/* Subhead */}
              <p className="font-sans text-[15px] text-brand-pacific-dusk/80 text-center leading-relaxed mb-7 max-w-[300px] mx-auto">
                Get practical training tips, schedule updates, and useful notes from our coaching team.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="exit-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="exit-email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input w-full text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Me the Tips'}
                </button>
              </form>

              {/* Privacy note — brand token only (no raw black/slate) */}
              <p className="font-sans text-[12px] text-brand-pacific-dusk/70 text-center mt-5">
                No spam, ever. Unsubscribe anytime.
              </p>

            </div>
          </>
        )}
      </div>
    </div>
  )
}
