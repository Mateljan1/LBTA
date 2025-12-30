'use client'

import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem('exitPopupShown')
    if (shown) {
      setHasShown(true)
      return
    }

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    // Mobile: detect scroll up (potential exit)
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < lastScrollY - 100 && currentScrollY < 200 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
      lastScrollY = currentScrollY
    }

    // Delay adding listeners to avoid showing immediately
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 10000) // Wait 10 seconds before enabling

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasShown])

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
          offer: 'free-trial'
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsVisible(false)}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-lbta-cream w-full max-w-[440px] animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-popup-title"
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-5 right-5 p-2 text-lbta-charcoal/40 hover:text-lbta-charcoal transition-colors z-10"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="px-10 py-16 text-center">
            <div className="w-14 h-14 bg-lbta-charcoal rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <h3
              id="exit-popup-title"
              className="font-serif text-[28px] font-semibold text-lbta-charcoal mb-3"
            >
              You&apos;re In
            </h3>
            <p className="font-sans text-[15px] text-lbta-slate leading-relaxed max-w-[280px] mx-auto">
              Check your email for your complimentary trial details. We look forward to seeing you on the court.
            </p>
          </div>
        ) : (
          <>
            {/* Top Accent Line */}
            <div className="h-[3px] bg-lbta-charcoal" />

            {/* Content */}
            <div className="px-10 py-12 md:py-14">
              {/* Eyebrow */}
              <p className="text-eyebrow text-lbta-charcoal/60 text-center mb-4">
                Complimentary Trial
              </p>

              {/* Headline */}
              <h3
                id="exit-popup-title"
                className="font-serif text-[32px] md:text-[36px] font-semibold text-lbta-charcoal text-center leading-[1.1] mb-4"
              >
                Experience LBTA
              </h3>

              {/* Subhead */}
              <p className="font-sans text-[16px] text-lbta-slate text-center leading-relaxed mb-8 max-w-[320px] mx-auto">
                Discover world-class tennis instruction with a complimentary private lesson.
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
                  {isSubmitting ? 'Sending...' : 'Claim Your Free Lesson'}
                </button>
              </form>

              {/* Privacy note */}
              <p className="font-sans text-[12px] text-lbta-slate/60 text-center mt-5">
                No spam, ever. Unsubscribe anytime.
              </p>

              {/* Divider */}
              <div className="divider my-8" />

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="font-serif text-[24px] font-semibold text-lbta-charcoal">500+</p>
                  <p className="font-sans text-[11px] text-lbta-slate uppercase tracking-wider">Players</p>
                </div>
                <div className="w-px h-10 bg-lbta-stone" />
                <div className="text-center">
                  <p className="font-serif text-[24px] font-semibold text-lbta-charcoal">15+</p>
                  <p className="font-sans text-[11px] text-lbta-slate uppercase tracking-wider">Years</p>
                </div>
                <div className="w-px h-10 bg-lbta-stone" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-3.5 h-3.5 text-lbta-charcoal fill-current"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-lbta-slate uppercase tracking-wider">5.0 Rating</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
