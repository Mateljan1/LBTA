'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="border-b border-white/8">
      <div className="container-lbta py-20 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto mb-8" />
          <span className="text-eyebrow text-brand-victoria-cove/80 mb-4 block">Stay Connected</span>
          <h3 className="font-headline text-[28px] md:text-[36px] font-light mb-4 text-white tracking-tight">
            Join the LBTA Community
          </h3>
          <p className="text-[15px] font-sans font-light text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
            Tennis insights, program updates, and early access to seasonal registration.
          </p>
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto" aria-live="polite" aria-atomic="true">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="flex">
              <input
                id="footer-newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === 'loading' || status === 'success'}
                className="flex-1 px-5 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-l-md text-white placeholder-white/30 font-sans text-[15px] font-light focus:outline-none focus:border-brand-victoria-cove/50 focus:bg-white/8 transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="px-6 py-4 bg-brand-sunset-cliff text-white font-sans text-[13px] font-semibold tracking-wider uppercase rounded-r-md hover:bg-brand-sunset-cliff/90 transition-all duration-300 disabled:opacity-70 flex items-center gap-2"
              >
                {status === 'loading' ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : status === 'success' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <>
                    <span className="hidden sm:inline">Subscribe</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {status === 'success' && (
              <p className="absolute -bottom-8 left-0 right-0 text-sm text-brand-tide-pool" role="status">
                Welcome to the community.
              </p>
            )}
            {status === 'error' && (
              <p className="absolute -bottom-8 left-0 right-0 text-sm text-red-400" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
