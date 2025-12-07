'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function BeginnerProgramLanding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Foundation 12-Week Beginner Program',
        value: 0.00,
        currency: 'USD',
      })
    }

    try {
      // Submit to your endpoint (customize as needed)
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: 'Foundation 12-Week Beginner Program',
          source: 'beginner-program-landing',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        // Redirect to thank you page after 2 seconds
        setTimeout(() => {
          window.location.href = '/thank-you'
        }, 2000)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Something went wrong. Please call us at (949) 464-6645')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lbta-bone to-lbta-sand">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Image
            src="/logos/lbta-logo.svg"
            alt="LBTA"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <a
            href="tel:9494646645"
            className="text-lbta-coral font-semibold hover:text-lbta-coral-dark transition"
          >
            (949) 464-6645
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block bg-lbta-coral/10 text-lbta-coral px-4 py-2 rounded-full text-sm font-medium mb-6">
              🎾 Limited Spots Available
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl text-lbta-primary mb-6 leading-tight">
              Foundation 12-Week
              <br />
              <span className="text-lbta-coral">Beginner Program</span>
            </h1>

            <p className="text-xl text-lbta-secondary mb-8 leading-relaxed">
              Transform from complete beginner to confident player in just 12 weeks with ATP/WTA-level coaching at Laguna Beach Tennis Academy.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                'Professional ATP/WTA coaching methodology',
                'Small group sizes (max 4:1 ratio)',
                'Personalized skill development plan',
                'Video analysis & progress tracking',
                'Official City of Laguna Beach partner since 2020',
                'Free trial lesson included'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-lbta-coral flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lbta-secondary">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 text-sm text-lbta-secondary">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lbta-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>20+ D1 College Placements</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lbta-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Official City Partner</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif text-lbta-primary mb-2">We'll Be In Touch!</h3>
                <p className="text-lbta-secondary">Redirecting to confirmation...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-serif text-lbta-primary mb-2">
                    Start Your Journey
                  </h2>
                  <p className="text-lbta-secondary">
                    Get your free trial lesson + program details
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-lbta-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lbta-coral focus:border-transparent outline-none transition"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-lbta-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lbta-coral focus:border-transparent outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-lbta-primary mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lbta-coral focus:border-transparent outline-none transition"
                      placeholder="(949) 123-4567"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-lbta-coral hover:bg-lbta-coral-dark text-white font-semibold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Get My Free Trial Lesson →'}
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting, you agree to receive communications from LBTA.
                    <br />
                    No spam, unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-sm text-lbta-secondary mb-8">Trusted by 200+ families in Orange County</p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-60">
            <div className="text-lbta-secondary text-sm">
              ⭐⭐⭐⭐⭐ 5.0 on Google
            </div>
            <div className="text-lbta-secondary text-sm">
              🏆 20+ D1 Placements
            </div>
            <div className="text-lbta-secondary text-sm">
              🎾 Official City Partner
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-lbta-secondary mb-2">
            Laguna Beach Tennis Academy • Official City of Laguna Beach Tennis Partner Since 2020
          </p>
          <p className="text-sm text-lbta-secondary">
            <a href="tel:9494646645" className="text-lbta-coral hover:underline">(949) 464-6645</a>
            {' • '}
            <a href="mailto:info@lagunabeachtennisacademy.com" className="text-lbta-coral hover:underline">
              info@lagunabeachtennisacademy.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
