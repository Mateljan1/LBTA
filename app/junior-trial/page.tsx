'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getJuniorProgramDataFromWinter2026 } from '@/lib/junior-program-data'
import { getSeasonCTA, getActiveSeason } from '@/lib/season-utils'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'

const programData = getJuniorProgramDataFromWinter2026()

export default function JuniorTrialLanding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    childAge: '',
    program: '',
    schedule: '',
    frequency: '1x',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Get available programs based on age
  const availablePrograms = formData.childAge && programData[formData.childAge as keyof typeof programData]
    ? Object.keys(programData[formData.childAge as keyof typeof programData].programs)
    : []

  // Get available schedules based on program
  const availableSchedules = formData.childAge && formData.program
    ? (programData[formData.childAge as keyof typeof programData]?.programs as any)?.[formData.program]?.schedules || []
    : []

  // Get pricing based on selections
  const selectedProgramData = formData.childAge && formData.program
    ? (programData[formData.childAge as keyof typeof programData]?.programs as any)?.[formData.program]
    : null

  const price = selectedProgramData?.pricing?.[formData.frequency as '1x' | '2x'] as number || 0
  const seasonCta = getSeasonCTA()
  const activeSeason = getActiveSeason()
  const isEarlyBird = seasonCta.showEarlyBird
  const earlyBirdDiscount = seasonCta.earlyBirdDiscount
  const discount = isEarlyBird && price > 120 ? earlyBirdDiscount : 0
  const finalPrice = price - discount

  // Reset dependent fields when parent field changes
  useEffect(() => {
    if (formData.childAge) {
      setFormData(prev => ({ ...prev, program: '', schedule: '', frequency: '1x' }))
    }
  }, [formData.childAge])

  useEffect(() => {
    if (formData.program) {
      setFormData(prev => ({ ...prev, schedule: '' }))
    }
  }, [formData.program])

  useEffect(() => {
    if (!errorMessage) return
    const timer = setTimeout(() => setErrorMessage(null), 8000)
    return () => clearTimeout(timer)
  }, [errorMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: `Junior Trial: ${formData.program}`,
        value: finalPrice,
        currency: 'USD',
      })
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          finalPrice,
          discount,
          program: `Junior Trial: ${formData.program}`,
          source: 'junior-trial-landing',
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
      setErrorMessage('Something went wrong. Please call us at (949) 534-0457.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Season Banner */}
      <div className="bg-lbta-coral text-white py-3 text-center text-sm font-medium tracking-wide">
        {isEarlyBird ? (
          <><span className="font-bold">${earlyBirdDiscount} OFF</span> {activeSeason.name} registration — Sign up by {new Date(seasonCta.earlyBirdDeadline!).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</>
        ) : (
          <>Registration open for {activeSeason.name} — Secure your spot today</>
        )}
      </div>

      {/* Header */}
      <header className="absolute top-12 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Image
            src="/logos/LBTAblktext.png"
            alt="Laguna Beach Tennis Academy"
            width={140}
            height={56}
            className="h-14 w-auto brightness-0 invert"
          />
          <a
            href="tel:9495340457"
            aria-label="Call (949) 534-0457"
            className="text-white font-medium hover:text-white/80 transition text-sm tracking-wide"
          >
            (949) 534-0457
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/juniors.webp"
            alt="Junior tennis players training at Laguna Beach Tennis Academy"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-white/90 text-sm font-medium tracking-[0.2em] uppercase mb-6">
              Laguna Beach Tennis Academy
            </p>

            <h1 className="font-headline text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
              {activeSeason.name}<br />
              Junior Programs
            </h1>

            <div className="w-20 h-px bg-white/40 mb-8" />

            <p className="text-xl text-white/90 mb-6 leading-relaxed font-light">
              From Little Stars (ages 3-4) to High Performance training. 
            </p>
            <p className="text-lg text-white/80 mb-10">
              {activeSeason.weeks}-week session: {activeSeason.dates}
            </p>

            <a
              href="#register"
              className="inline-flex items-center justify-center bg-white text-lbta-primary px-10 py-4 font-medium tracking-wide transition-all duration-300 hover:bg-brand-sandstone"
            >
              {isEarlyBird ? `Register Now & Save $${earlyBirdDiscount}` : 'Register Now'}
            </a>
          </div>
        </div>
      </section>

      {/* Smart Registration Form */}
      <section id="register" className="py-32 bg-brand-sandstone">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white shadow-2xl">
            {submitted ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-lbta-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-lbta-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-3xl font-headline text-lbta-primary mb-4">Registration Received</h4>
                <p className="text-lbta-secondary text-lg">
                  We'll contact you within 24 hours to confirm your spot and finalize details.
                </p>
              </div>
            ) : (
              <div className="p-12">
                <div className="mb-10">
                  <h2 className="text-4xl font-headline text-lbta-primary mb-3">
                    Register for {activeSeason.name}
                  </h2>
                  <p className="text-lbta-coral font-medium">
                    {isEarlyBird
                      ? `$${earlyBirdDiscount} discount ends ${new Date(seasonCta.earlyBirdDeadline!).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} • ${activeSeason.weeks}-week session`
                      : `${activeSeason.weeks}-week session • Registration open`}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Step 1: Parent Info */}
                  <div className="pb-8 border-b border-gray-200">
                    <h3 className="text-xl font-medium text-lbta-primary mb-6">Tell Us About Your Player</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-lbta-primary mb-2">
                          Parent/Guardian Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                          placeholder="Jane Smith"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-lbta-primary mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                            placeholder="jane@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-lbta-primary mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition"
                            placeholder="(949) 123-4567"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-lbta-primary mb-2">
                          Child's Age *
                        </label>
                        <select
                          required
                          value={formData.childAge}
                          onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition bg-white"
                        >
                          <option value="">Select age group...</option>
                          <option value="3-4">Ages 3-4 (Little Tennis Stars)</option>
                          <option value="5-7">Ages 5-7 (Red Ball)</option>
                          <option value="7-9">Ages 7-9 (Orange Ball)</option>
                          <option value="9-11">Ages 9-11 (Green Dot)</option>
                          <option value="11-15">Ages 11-15 (Youth Development)</option>
                          <option value="13-18">Ages 13-18 (Youth Dev / High Performance)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Program Selection (appears when age selected) */}
                  {formData.childAge && (
                    <div className="pb-8 border-b border-gray-200">
                      <h3 className="text-xl font-medium text-lbta-primary mb-6">Choose Program</h3>
                      <select
                        required
                        value={formData.program}
                        onChange={(e) => setFormData({...formData, program: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-lbta-coral/30 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition bg-white"
                      >
                        <option value="">Select program...</option>
                        {availablePrograms.map(prog => (
                          <option key={prog} value={prog}>{prog}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Step 3: Schedule Selection (appears when program selected) */}
                  {formData.program && (
                    <div className="pb-8 border-b border-gray-200">
                      <h3 className="text-xl font-medium text-lbta-primary mb-6">Select Schedule</h3>
                      <select
                        required
                        value={formData.schedule}
                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-lbta-coral/30 focus:ring-2 focus:ring-lbta-coral focus:border-lbta-coral outline-none transition bg-white"
                      >
                        <option value="">Select day & time...</option>
                        {availableSchedules.map((sched: any) => (
                          <option key={sched.day} value={`${sched.time} - ${sched.location}`}>
                            {sched.time} — {sched.location}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Step 4: Frequency Selection (appears when schedule selected) */}
                  {formData.schedule && selectedProgramData && (
                    <div className="pb-8 border-b border-gray-200">
                      <h3 className="text-xl font-medium text-lbta-primary mb-6">Select Training Frequency</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedProgramData.pricing)
                          .filter(([key]) => key !== 'billing')
                          .map(([freq, amount]: [string, any]) => {
                            const freqDiscount = isEarlyBird && amount > 120 ? earlyBirdDiscount : 0
                            const freqPrice = amount - freqDiscount
                            return (
                              <label
                                key={freq}
                                className={`block p-4 border-2 cursor-pointer transition ${
                                  formData.frequency === freq
                                    ? 'border-lbta-coral bg-lbta-coral/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="frequency"
                                  value={freq}
                                  checked={formData.frequency === freq}
                                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                                  className="mr-3"
                                />
                                <span className="font-medium text-lbta-primary">
                                  {freq === '1x' ? '1x per week' : '2x per week'}
                                </span>
                                <span className="float-right">
                                  <span className="text-2xl font-headline text-brand-pacific-dusk">${freqPrice}</span>
                                  {freqDiscount > 0 && (
                                    <span className="text-sm text-gray-400 line-through ml-2">${amount}</span>
                                  )}
                                  <span className="text-sm text-gray-500 ml-2">{selectedProgramData?.pricing?.billing}</span>
                                </span>
                              </label>
                            )
                          })}
                      </div>
                    </div>
                  )}

                  {/* Summary Box (appears when all selections made) */}
                  {formData.schedule && (
                    <div className="bg-lbta-bone p-6 border-l-4 border-lbta-coral">
                      <h4 className="font-medium text-lbta-primary mb-4">Your Selection:</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p><span className="font-medium">Program:</span> {formData.program}</p>
                        <p><span className="font-medium">Schedule:</span> {formData.schedule}</p>
                        <p><span className="font-medium">Frequency:</span> {formData.frequency === '1x' ? '1x per week' : '2x per week'}</p>
                        <p className="text-lg font-medium text-lbta-coral pt-2">
                          Price: ${finalPrice} {selectedProgramData?.pricing.billing}
                          {discount > 0 && <span className="text-sm"> (Save ${earlyBirdDiscount})</span>}
                        </p>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-[2px] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-sans text-[14px] text-red-800">{errorMessage}</p>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                          aria-label="Dismiss error"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.schedule}
                    className="w-full bg-lbta-coral text-white font-bold py-5 px-6 text-lg tracking-wide transition duration-300 hover:bg-lbta-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : isEarlyBird ? `Claim My $${earlyBirdDiscount} Discount →` : 'Start My Trial →'}
                  </button>

                  <p className="text-xs text-center text-gray-500">
                    By submitting, you agree to receive communications from LBTA. No spam, unsubscribe anytime.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center">
            <div>
              <div className="text-4xl font-headline text-lbta-primary mb-1">20+</div>
              <p className="text-sm text-lbta-secondary">D1 Placements</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-headline text-lbta-primary mb-1">200+</div>
              <p className="text-sm text-lbta-secondary">Active Juniors</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-headline text-lbta-primary mb-1">Since 2020</div>
              <p className="text-sm text-lbta-secondary">City Partner</p>
            </div>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-headline text-[32px] md:text-[48px] font-medium text-white leading-[1.15] mb-4">
            Ready to Start Training?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-8">
            Book a trial or get in touch. We will respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              Book Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/50 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </DarkSection>

      {/* Footer */}
      <footer className="bg-brand-pacific-dusk py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-lbta-bone/60 mb-3">
            Laguna Beach Tennis Academy • Official City Partner Since 2020
          </p>
          <p className="text-sm text-lbta-bone/60">
            <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="text-lbta-coral">(949) 534-0457</a>
            <span className="mx-3">•</span>
            <a href="mailto:info@lagunabeachtennisacademy.com" className="text-lbta-coral">
              info@lagunabeachtennisacademy.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
