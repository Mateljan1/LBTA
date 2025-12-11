'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AdultTrialLanding() {
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
        content_name: 'Adult Trial Lesson',
        value: 0.00,
        currency: 'USD',
      })
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: 'Adult Trial Lesson',
          source: 'adult-trial-landing',
        }),
      })

      if (response.ok) {
        setSubmitted(true)
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/40 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Image
            src="/logos/lbta-logo.svg"
            alt="LBTA"
            width={140}
            height={48}
            className="h-12 w-auto brightness-0 invert"
          />
          <a
            href="tel:9494646645"
            className="text-white font-medium hover:text-white/80 transition text-sm tracking-wide"
          >
            (949) 464-6645
          </a>
        </div>
      </header>

      {/* Hero Section with Photo */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/photos/adult-trial-hero.webp"
            alt="Adult tennis development at LBTA"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase mb-6">
              Laguna Beach Tennis Academy
            </p>

            <h1 className="font-serif text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
              It's never<br />
              too late<br />
              to start.
            </h1>

            <div className="w-20 h-px bg-white/40 mb-8" />

            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light max-w-lg">
              From zero to match-ready in 12 weeks. ATP/WTA coaching systems designed for adult beginners and returning players.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#trial"
                className="inline-flex items-center justify-center bg-white text-lbta-primary px-10 py-4 font-medium tracking-wide transition-all duration-300 hover:bg-lbta-sand"
              >
                Start Your Trial
              </a>
              <a
                href="tel:9494646645"
                className="inline-flex items-center justify-center border border-white text-white px-10 py-4 font-medium tracking-wide transition-all duration-300 hover:bg-white/10"
              >
                Call to Discuss
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Path Forward */}
      <section className="py-32 bg-lbta-bone">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-lbta-coral mb-4">
              The 12-Week Foundation
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-lbta-primary mb-6">
              From Zero to Match-Ready
            </h2>
            <p className="text-lg text-lbta-secondary max-w-2xl mx-auto font-light">
              Most adults believe tennis takes years to learn. Our systematic approach proves otherwise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-7xl font-serif font-light text-lbta-coral mb-6">01</div>
              <h3 className="text-xl font-medium text-lbta-primary mb-3">Weeks 1-4</h3>
              <p className="text-lbta-secondary leading-relaxed">
                Fundamentals. Movement patterns, grip, contact point. The building blocks that prevent bad habits from forming.
              </p>
            </div>

            <div>
              <div className="text-7xl font-serif font-light text-lbta-coral mb-6">02</div>
              <h3 className="text-xl font-medium text-lbta-primary mb-3">Weeks 5-8</h3>
              <p className="text-lbta-secondary leading-relaxed">
                Rally development. Consistency over power. Learning to sustain points and recognize patterns in play.
              </p>
            </div>

            <div>
              <div className="text-7xl font-serif font-light text-lbta-coral mb-6">03</div>
              <h3 className="text-xl font-medium text-lbta-primary mb-3">Weeks 9-12</h3>
              <p className="text-lbta-secondary leading-relaxed">
                Match preparation. Scoring, strategy, singles and doubles play. You're ready to compete.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-medium tracking-[0.2em] uppercase text-lbta-coral mb-4">
                The System
              </p>
              <h2 className="font-serif text-4xl text-lbta-primary mb-6">
                Why adult beginners succeed here.
              </h2>
              <div className="space-y-6 text-lbta-secondary leading-relaxed">
                <p>
                  Most tennis instruction treats adults like children. Simplified drills. Patience without precision. The assumption that "fun" matters more than progress.
                </p>
                <p>
                  Adults learn differently. You understand systems. You respect process. You'll practice if you see results.
                </p>
                <p>
                  Our approach: ATP/WTA fundamentals, scaled appropriately. Small groups of 4-6 adults. Video analysis from session one. The same methodology that develops professional players, adapted for adult learning.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-l-2 border-lbta-coral pl-6">
                <h4 className="font-medium text-lbta-primary mb-2">Professional Systems</h4>
                <p className="text-lbta-secondary text-sm">
                  The same ATP/WTA coaching methodology behind three tour players and 20+ D1 scholarships.
                </p>
              </div>

              <div className="border-l-2 border-lbta-coral pl-6">
                <h4 className="font-medium text-lbta-primary mb-2">Adult-Focused Groups</h4>
                <p className="text-lbta-secondary text-sm">
                  Maximum 4-6 adults per session. Similar skill levels. Professional environment.
                </p>
              </div>

              <div className="border-l-2 border-lbta-coral pl-6">
                <h4 className="font-medium text-lbta-primary mb-2">Flexible Scheduling</h4>
                <p className="text-lbta-secondary text-sm">
                  Morning and evening sessions. Designed for working professionals and active retirees.
                </p>
              </div>

              <div className="border-l-2 border-lbta-coral pl-6">
                <h4 className="font-medium text-lbta-primary mb-2">Video Analysis Included</h4>
                <p className="text-lbta-secondary text-sm">
                  Track your progress. See what you're doing right. Understand what needs work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trial Booking Section */}
      <section id="trial" className="py-32 bg-lbta-sand">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white shadow-xl">
            <div className="grid lg:grid-cols-5">
              {/* Left: Context */}
              <div className="lg:col-span-2 bg-lbta-charcoal p-12 flex flex-col justify-center">
                <h3 className="font-serif text-3xl text-lbta-bone mb-6">
                  Your Trial Session
                </h3>
                <div className="space-y-6 text-lbta-bone/80 text-sm leading-relaxed">
                  <p>
                    One complimentary 90-minute group session. Experience our methodology. Meet the coaches. See if this is right for you.
                  </p>
                  <p>
                    No equipment needed. Court shoes recommended. All skill levels welcome.
                  </p>
                  <p className="text-lbta-coral font-medium">
                    Available mornings and evenings at Alta Laguna Park.
                  </p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="lg:col-span-3 p-12">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-lbta-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-lbta-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-serif text-lbta-primary mb-3">Request Received</h4>
                    <p className="text-lbta-secondary">We'll contact you within 24 hours to schedule your trial session.</p>
                  </div>
                ) : (
                  <>
                    <h4 className="text-2xl font-serif text-lbta-primary mb-8">
                      Request Your Trial
                    </h4>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-lbta-primary mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="John Smith"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-lbta-primary mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-lbta-primary mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="(949) 123-4567"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-lbta-coral text-white font-medium py-4 px-6 tracking-wide transition duration-300 hover:bg-lbta-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Trial Session'}
                      </button>

                      <p className="text-xs text-center text-gray-500">
                        By submitting, you agree to receive communications from LBTA. No spam, unsubscribe anytime.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Credibility */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
            <div>
              <div className="text-3xl font-serif text-lbta-primary mb-1">5.0</div>
              <p className="text-sm text-lbta-secondary">Google Rating</p>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div>
              <div className="text-3xl font-serif text-lbta-primary mb-1">200+</div>
              <p className="text-sm text-lbta-secondary">Adult Members</p>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div>
              <div className="text-3xl font-serif text-lbta-primary mb-1">Since 2020</div>
              <p className="text-sm text-lbta-secondary">Official City Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lbta-charcoal py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-lbta-bone/60 mb-3">
            Laguna Beach Tennis Academy • Official City of Laguna Beach Tennis Partner Since 2020
          </p>
          <p className="text-sm text-lbta-bone/60 mb-3">
            <a href="tel:9494646645" className="text-lbta-coral hover:text-lbta-coral-dark transition">(949) 464-6645</a>
            <span className="mx-3">•</span>
            <a href="mailto:info@lagunabeachtennisacademy.com" className="text-lbta-coral hover:text-lbta-coral-dark transition">
              info@lagunabeachtennisacademy.com
            </a>
          </p>
          <p className="text-xs text-lbta-bone/40">
            <a href="/privacy" className="hover:text-lbta-coral transition">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="/terms" className="hover:text-lbta-coral transition">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
