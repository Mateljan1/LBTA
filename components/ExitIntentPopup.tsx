'use client'

import { useState, useEffect } from 'react'
import { X, Gift, CheckCircle } from 'lucide-react'
import Image from 'next/image'

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
        // User scrolled up significantly near top of page
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => setIsVisible(false)}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
        style={{
          animation: 'scaleIn 0.3s ease-out forwards'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black/70 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-serif text-[24px] font-semibold text-black mb-2">
              You're In!
            </h3>
            <p className="font-sans text-[15px] text-black/70">
              Check your email for your free trial details. We can't wait to see you on the court!
            </p>
          </div>
        ) : (
          <>
            {/* Image Header */}
            <div className="relative h-40 bg-gradient-to-br from-lbta-beige to-lbta-orange/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Gift className="h-12 w-12 text-lbta-orange mx-auto mb-2" />
                  <span className="font-sans text-[11px] uppercase tracking-[2px] text-lbta-orange font-medium">
                    Special Offer
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h3 className="font-serif text-[26px] md:text-[28px] font-semibold text-black text-center mb-2">
                Wait! Don't Miss Out
              </h3>
              <p className="font-sans text-[15px] text-black/70 text-center mb-6">
                Get a <span className="font-semibold text-lbta-orange">FREE trial lesson</span> and discover why 500+ players trust LBTA.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] py-4 rounded-lg transition-all duration-300 uppercase tracking-[1.5px] disabled:opacity-50 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Sending...' : 'Claim My Free Trial'}
                </button>
              </form>

              <p className="font-sans text-[12px] text-black/50 text-center mt-4">
                No spam, ever. Unsubscribe anytime.
              </p>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-lbta-orange fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-sans text-[12px] text-black/60">
                  5.0 rating from 47 reviews
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

