'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle } from 'lucide-react'
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
        aria-hidden="true"
      />

      {/* Modal - Luxury LBTA Design */}
      <div 
        className="relative bg-lbta-cream max-w-2xl w-full overflow-hidden animate-scale-in border border-black/10"
        style={{
          animation: 'fadeInUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
          borderRadius: '2px'
        }}
      >
        {/* Close button - Luxury style */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 p-2 text-black/30 hover:text-black transition-colors z-10 rounded-full hover:bg-black/5"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          /* Success State - Calm & Confident */
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-black" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-[32px] font-semibold text-black mb-3 leading-tight">
              See you on the court.
            </h3>
            <p className="font-sans text-[16px] text-lbta-slate leading-relaxed max-w-sm mx-auto">
              Check your email for next steps. We'll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 min-h-[500px]">
            {/* Left: Image */}
            <div className="relative h-64 md:h-auto">
              <Image
                src="/images/founder/andrew-portrait.webp"
                alt="Andrew Mateljan coaching at LBTA"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 30%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
            </div>

            {/* Right: Content */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Eyebrow */}
              <span className="text-eyebrow text-lbta-charcoal mb-4 block">
                Before You Go
              </span>

              {/* Headline - Calm, not salesy */}
              <h3 className="font-serif text-[32px] md:text-[36px] font-semibold text-black mb-4 leading-[1.1]">
                Start training with purpose.
              </h3>

              {/* Subhead - Value proposition */}
              <p className="font-sans text-[16px] text-lbta-slate leading-relaxed mb-8">
                Book a complimentary trial lesson. Experience the movement-first approach that's guided players from first serves to ATP courts.
              </p>

              {/* Form - Minimal & Elegant */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-white border border-black/10 font-sans text-[15px] focus:outline-none focus:border-black transition-all"
                  style={{ borderRadius: '2px' }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-sans font-medium text-[13px] py-4 uppercase tracking-[0.15em] disabled:opacity-50 hover:bg-lbta-charcoal transition-all duration-300"
                  style={{ borderRadius: '2px' }}
                >
                  {isSubmitting ? 'Sending...' : 'Book Trial'}
                </button>
              </form>

              {/* Trust line - Subtle */}
              <p className="font-sans text-[13px] text-lbta-slate text-center mt-6">
                5.0 ★ on Google · 500+ players trained since 2018
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
