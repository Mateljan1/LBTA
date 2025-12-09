'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function JuniorWinter2026Landing() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childAge: '',
    program: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Junior Winter 2026 Registration',
        value: formData.program.includes('Youth') ? 756.17 : 546.00,
        currency: 'USD',
      })
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: `Junior Winter 2026: ${formData.program}`,
          source: 'junior-winter-2026-landing',
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
      {/* Urgency Banner */}
      <div className="bg-lbta-coral text-white py-3 text-center text-sm font-medium tracking-wide">
        <span className="font-bold">$50 OFF</span> Winter 2026 registration — Sign up by December 15th
      </div>

      {/* Header */}
      <header className="absolute top-12 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Image
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
            alt="Laguna Beach Tennis Academy"
            width={140}
            height={56}
            className="h-14 w-auto brightness-0 invert"
          />
          <a
            href="tel:9494646645"
            className="text-white font-medium hover:text-white/80 transition text-sm tracking-wide"
          >
            (949) 464-6645
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/UPDATED LBTA PICS/junior-program-hero.jpg"
            alt="Junior tennis development at LBTA"
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
              Winter 2026<br />
              Junior Programs
            </h1>

            <div className="w-20 h-px bg-white/40 mb-8" />

            <p className="text-xl text-white/90 mb-10 leading-relaxed font-light max-w-lg">
              From Little Stars (ages 3-4) to High Performance training. ATP/WTA coaching, small groups, proven results.
            </p>

            <p className="text-lg text-white/80 mb-10">
              13-week session: January 6 – April 5, 2026
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#register"
                className="inline-flex items-center justify-center bg-white text-lbta-primary px-10 py-4 font-medium tracking-wide transition-all duration-300 hover:bg-lbta-sand"
              >
                View Programs & Register
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

      {/* What's Included */}
      <section className="py-20 bg-lbta-bone">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl text-lbta-primary mb-6">
              Small Groups, Big Results
            </h2>
            <p className="text-lg text-lbta-secondary max-w-2xl mx-auto font-light">
              ATP/WTA coaching methodology adapted for ages 3-18. The same system behind 20+ D1 college placements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 border border-gray-200">
              <h3 className="font-medium text-lbta-primary mb-3">Small Group Sizes</h3>
              <p className="text-lbta-secondary">
                Maximum 4-6 students per group. Personal attention at every session.
              </p>
            </div>

            <div className="bg-white p-8 border border-gray-200">
              <h3 className="font-medium text-lbta-primary mb-3">Age-Appropriate Development</h3>
              <p className="text-lbta-secondary">
                From Little Stars (ages 3-4) through Youth Development and High Performance.
              </p>
            </div>

            <div className="bg-white p-8 border border-gray-200">
              <h3 className="font-medium text-lbta-primary mb-3">Professional Coaching</h3>
              <p className="text-lbta-secondary">
                ATP/WTA tour experience. Certified youth development specialists.
              </p>
            </div>

            <div className="bg-white p-8 border border-gray-200">
              <h3 className="font-medium text-lbta-primary mb-3">Three Premium Locations</h3>
              <p className="text-lbta-secondary">
                LBHS, Moulton Meadows, Alta Laguna Park. Choose what works for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-32 bg-lbta-sand">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white shadow-xl">
            <div className="grid lg:grid-cols-5">
              {/* Left: Program Options */}
              <div className="lg:col-span-2 bg-lbta-charcoal p-12">
                <div className="bg-lbta-coral text-white px-4 py-2 text-xs font-bold tracking-wider uppercase text-center mb-6 -mx-12 -mt-12">
                  $50 OFF • Register by Dec 15th
                </div>

                <h3 className="font-serif text-3xl text-lbta-bone mb-6">
                  Winter 2026 Programs
                </h3>

                <p className="text-lbta-bone/80 text-sm mb-8">
                  13-week session: January 6 – April 5, 2026
                </p>

                <div className="space-y-6 text-lbta-bone/80 text-sm">
                  <div className="border-b border-lbta-bone/20 pb-4">
                    <p className="text-lbta-coral font-medium mb-2">Little Tennis Stars (Ages 3-4)</p>
                    <p className="mb-2">45 minutes • Moulton Meadows</p>
                    <p className="text-xl font-serif text-lbta-bone">$120/month</p>
                  </div>

                  <div className="border-b border-lbta-bone/20 pb-4">
                    <p className="text-lbta-coral font-medium mb-2">Red/Orange/Green Ball (Ages 5-11)</p>
                    <p className="mb-2">1 hour • Multiple locations & times</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-xl font-serif text-lbta-bone">$496</p>
                      <p className="text-sm text-lbta-bone/40 line-through">$546</p>
                    </div>
                    <p className="text-xs text-lbta-coral mt-1">Save $50 • 13-week session</p>
                  </div>

                  <div className="pb-4">
                    <p className="text-lbta-coral font-medium mb-2">Youth Development (Ages 11-18)</p>
                    <p className="mb-2">1.5 hours • Advanced training</p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-xl font-serif text-lbta-bone">$706-$1,387</p>
                      <p className="text-sm text-lbta-bone/40 line-through">$756-$1,437</p>
                    </div>
                    <p className="text-xs text-lbta-coral mt-1">Save $50 • 1x or 2x per week</p>
                  </div>
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
                    <h4 className="text-2xl font-serif text-lbta-primary mb-3">Registration Received</h4>
                    <p className="text-lbta-secondary">We'll contact you within 24 hours to confirm your spot and schedule.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h4 className="text-2xl font-serif text-lbta-primary mb-2">
                        Register for Winter 2026
                      </h4>
                      <p className="text-sm text-lbta-coral font-medium">
                        $50 discount ends December 15th
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="parentName" className="block text-sm font-medium text-lbta-primary mb-2">
                          Parent/Guardian Name *
                        </label>
                        <input
                          type="text"
                          id="parentName"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="Jane Smith"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
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
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                            placeholder="jane@example.com"
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
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                            placeholder="(949) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="childAge" className="block text-sm font-medium text-lbta-primary mb-2">
                          Child's Age *
                        </label>
                        <input
                          type="number"
                          id="childAge"
                          required
                          value={formData.childAge}
                          onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="7"
                          min="3"
                          max="18"
                        />
                      </div>

                      <div>
                        <label htmlFor="program" className="block text-sm font-medium text-lbta-primary mb-2">
                          Select Program & Schedule *
                        </label>
                        <select
                          id="program"
                          required
                          value={formData.program}
                          onChange={(e) => setFormData({...formData, program: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition bg-white"
                        >
                          <option value="">Select age group and schedule...</option>
                          
                          <optgroup label="Ages 3-4 - Little Tennis Stars ($120/month)">
                            <option value="Little Stars - Mon 3:30pm Moulton">Monday 3:30pm - Moulton</option>
                            <option value="Little Stars - Tue 3:30pm Moulton">Tuesday 3:30pm - Moulton</option>
                            <option value="Little Stars - Wed 3:30pm Moulton">Wednesday 3:30pm - Moulton</option>
                            <option value="Little Stars - Thu 2:45pm Moulton">Thursday 2:45pm - Moulton</option>
                          </optgroup>

                          <optgroup label="Ages 5-7 - Red Ball ($496/quarter - Save $50)">
                            <option value="Red Ball - Mon 3:30pm Alta Laguna">Monday 3:30pm - Alta Laguna</option>
                            <option value="Red Ball - Mon 4:30pm Moulton">Monday 4:30pm - Moulton</option>
                            <option value="Red Ball - Wed 3:30pm Alta Laguna">Wednesday 3:30pm - Alta Laguna</option>
                            <option value="Red Ball - Wed 4:30pm Moulton">Wednesday 4:30pm - Moulton</option>
                            <option value="Red Ball - Sat 9:00am Alta Laguna">Saturday 9:00am - Alta Laguna</option>
                          </optgroup>

                          <optgroup label="Ages 7-9 - Orange Ball ($496/quarter - Save $50)">
                            <option value="Orange Ball - Mon 4:30pm Alta Laguna">Monday 4:30pm - Alta Laguna</option>
                            <option value="Orange Ball - Mon 5:30pm Moulton">Monday 5:30pm - Moulton</option>
                            <option value="Orange Ball - Tue 4:30pm Moulton">Tuesday 4:30pm - Moulton</option>
                            <option value="Orange Ball - Wed 4:30pm Alta Laguna">Wednesday 4:30pm - Alta Laguna</option>
                            <option value="Orange Ball - Thu 3:30pm Moulton">Thursday 3:30pm - Moulton</option>
                          </optgroup>

                          <optgroup label="Ages 9-11 - Green Dot ($496/quarter - Save $50)">
                            <option value="Green Dot - Tue 3:30pm Alta Laguna">Tuesday 3:30pm - Alta Laguna</option>
                            <option value="Green Dot - Wed 5:30pm Moulton">Wednesday 5:30pm - Moulton</option>
                            <option value="Green Dot - Thu 3:30pm Alta Laguna">Thursday 3:30pm - Alta Laguna</option>
                          </optgroup>

                          <optgroup label="Ages 11-15 - Youth Development ($706/quarter - Save $50)">
                            <option value="Youth Dev 11-15 - Mon 5:30pm Alta Laguna">Monday 5:30pm - Alta Laguna</option>
                            <option value="Youth Dev 11-15 - Tue 3:30pm LBHS">Tuesday 3:30pm - LBHS</option>
                            <option value="Youth Dev 11-15 - Tue 4:30pm Alta Laguna">Tuesday 4:30pm - Alta Laguna</option>
                            <option value="Youth Dev 11-15 - Wed 5:30pm Alta Laguna">Wednesday 5:30pm - Alta Laguna</option>
                            <option value="Youth Dev 11-15 - Thu 3:30pm LBHS">Thursday 3:30pm - LBHS</option>
                            <option value="Youth Dev 11-15 - Thu 4:30pm Alta Laguna">Thursday 4:30pm - Alta Laguna</option>
                          </optgroup>

                          <optgroup label="Ages 11+ - Fun Friday ($496/quarter - Save $50)">
                            <option value="Fun Friday - Fri 3:30pm Moulton">Friday 3:30pm - Moulton</option>
                            <option value="MatchPlay Friday - Fri 3:30pm Alta Laguna">MatchPlay Friday 3:30pm - Alta Laguna</option>
                          </optgroup>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-lbta-coral text-white font-medium py-4 px-6 tracking-wide transition duration-300 hover:bg-lbta-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Claim My $50 Discount →'}
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

      {/* Social Proof */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
            <div>
              <div className="text-3xl font-serif text-lbta-primary mb-1">20+</div>
              <p className="text-sm text-lbta-secondary">D1 College Placements</p>
            </div>

            <div className="hidden md:block w-px h-12 bg-gray-200" />

            <div>
              <div className="text-3xl font-serif text-lbta-primary mb-1">200+</div>
              <p className="text-sm text-lbta-secondary">Active Junior Members</p>
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
