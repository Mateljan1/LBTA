'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Winter 2026 Program Data Structure
const programData = {
  '3-4': {
    programs: {
      'Little Tennis Stars': {
        schedules: [
          { day: 'Monday 3:30pm', location: 'Moulton', time: 'Mon 3:30-4:15 PM' },
          { day: 'Tuesday 3:30pm', location: 'Moulton', time: 'Tue 3:30-4:15 PM' },
          { day: 'Wednesday 3:30pm', location: 'Moulton', time: 'Wed 3:30-4:15 PM' },
          { day: 'Thursday 2:45pm', location: 'Moulton', time: 'Thu 2:45-3:30 PM' },
        ],
        pricing: { '1x': 120, billing: 'per month' }
      }
    }
  },
  '5-7': {
    programs: {
      'Red Ball Beginner': {
        schedules: [
          { day: 'Monday 3:30pm', location: 'Alta Laguna', time: 'Mon 3:30-4:30 PM' },
          { day: 'Monday 4:30pm', location: 'Moulton', time: 'Mon 4:30-5:30 PM' },
          { day: 'Wednesday 3:30pm', location: 'Alta Laguna', time: 'Wed 3:30-4:30 PM' },
          { day: 'Wednesday 4:30pm', location: 'Moulton', time: 'Wed 4:30-5:30 PM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      },
      'Red Ball Advanced': {
        schedules: [
          { day: 'Monday 3:30pm', location: 'Alta Laguna', time: 'Mon 3:30-4:30 PM' },
          { day: 'Wednesday 3:30pm', location: 'Alta Laguna', time: 'Wed 3:30-4:30 PM' },
          { day: 'Saturday 9:00am', location: 'Alta Laguna', time: 'Sat 9:00-10:00 AM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      }
    }
  },
  '7-9': {
    programs: {
      'Orange Ball Beginner': {
        schedules: [
          { day: 'Tuesday 4:30pm', location: 'Moulton', time: 'Tue 4:30-5:30 PM' },
          { day: 'Wednesday 4:30pm', location: 'Alta Laguna', time: 'Wed 4:30-5:30 PM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      },
      'Orange Ball Advanced': {
        schedules: [
          { day: 'Monday 4:30pm', location: 'Alta Laguna', time: 'Mon 4:30-5:30 PM' },
          { day: 'Monday 5:30pm', location: 'Moulton', time: 'Mon 5:30-6:30 PM' },
          { day: 'Thursday 3:30pm', location: 'Moulton', time: 'Thu 3:30-4:30 PM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      }
    }
  },
  '9-11': {
    programs: {
      'Green Dot Beginner': {
        schedules: [
          { day: 'Wednesday 5:30pm', location: 'Moulton', time: 'Wed 5:30-6:30 PM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      },
      'Green Dot Advanced': {
        schedules: [
          { day: 'Tuesday 3:30pm', location: 'Alta Laguna', time: 'Tue 3:30-4:30 PM' },
          { day: 'Thursday 3:30pm', location: 'Alta Laguna', time: 'Thu 3:30-4:30 PM' },
        ],
        pricing: { '1x': 496, '2x': 896, billing: 'per quarter' }
      }
    }
  },
  '11-15': {
    programs: {
      'Youth Development (11-15)': {
        schedules: [
          { day: 'Monday 5:30pm', location: 'Alta Laguna', time: 'Mon 5:30-6:30 PM' },
          { day: 'Tuesday 3:30pm', location: 'LBHS', time: 'Tue 3:30-5:00 PM' },
          { day: 'Tuesday 4:30pm', location: 'Alta Laguna', time: 'Tue 4:30-6:00 PM' },
          { day: 'Wednesday 5:30pm', location: 'Alta Laguna', time: 'Wed 5:30-6:30 PM' },
          { day: 'Thursday 3:30pm', location: 'LBHS', time: 'Thu 3:30-5:00 PM' },
          { day: 'Thursday 4:30pm', location: 'Alta Laguna', time: 'Thu 4:30-6:00 PM' },
        ],
        pricing: { '1x': 706, '2x': 1387, billing: 'per quarter' }
      }
    }
  },
  '13-18': {
    programs: {
      'Youth Development (13-18)': {
        schedules: [
          { day: 'Tuesday 3:30pm', location: 'LBHS', time: 'Tue 3:30-5:00 PM' },
          { day: 'Thursday 3:30pm', location: 'LBHS', time: 'Thu 3:30-5:00 PM' },
        ],
        pricing: { '1x': 706, '2x': 1387, billing: 'per quarter' }
      },
      'High Performance Training': {
        schedules: [
          { day: 'Monday 3:30pm', location: 'LBHS', time: 'Mon 3:30-5:30 PM' },
          { day: 'Tuesday 5:00pm', location: 'LBHS', time: 'Tue 5:00-7:00 PM' },
          { day: 'Wednesday 3:30pm', location: 'LBHS', time: 'Wed 3:30-5:30 PM' },
          { day: 'Thursday 5:00pm', location: 'LBHS', time: 'Thu 5:00-7:00 PM' },
        ],
        pricing: { '1x': 1387, '2x': 2637, billing: 'per quarter' }
      }
    }
  }
}

export default function JuniorWinter2026Landing() {
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
  const isEarlyBird = new Date() < new Date('2025-12-15')
  const discount = isEarlyBird && price > 120 ? 50 : 0
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: `Junior Winter 2026: ${formData.program}`,
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

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/UPDATED LBTA PICS/junior-program-hero.jpg"
            alt="Junior tennis at LBTA"
            fill
            priority
            quality={95}
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

            <h1 className="font-serif text-6xl lg:text-7xl text-white mb-8 leading-[1.1]">
              Winter 2026<br />
              Junior Programs
            </h1>

            <div className="w-20 h-px bg-white/40 mb-8" />

            <p className="text-xl text-white/90 mb-6 leading-relaxed font-light">
              From Little Stars (ages 3-4) to High Performance training. 
            </p>
            <p className="text-lg text-white/80 mb-10">
              13-week session: January 6 – April 5, 2026
            </p>

            <a
              href="#register"
              className="inline-flex items-center justify-center bg-white text-lbta-primary px-10 py-4 font-medium tracking-wide transition-all duration-300 hover:bg-lbta-sand"
            >
              Register Now & Save $50
            </a>
          </div>
        </div>
      </section>

      {/* Smart Registration Form */}
      <section id="register" className="py-32 bg-lbta-sand">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white shadow-2xl">
            {submitted ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-lbta-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-lbta-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-3xl font-serif text-lbta-primary mb-4">Registration Received</h4>
                <p className="text-lbta-secondary text-lg">
                  We'll contact you within 24 hours to confirm your spot and finalize details.
                </p>
              </div>
            ) : (
              <div className="p-12">
                <div className="mb-10">
                  <h2 className="text-4xl font-serif text-lbta-primary mb-3">
                    Register for Winter 2026
                  </h2>
                  <p className="text-lbta-coral font-medium">
                    $50 discount ends December 15th • 13-week session
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
                            const freqDiscount = isEarlyBird && amount > 120 ? 50 : 0
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
                                  <span className="text-2xl font-serif text-lbta-charcoal">${freqPrice}</span>
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
                          {discount > 0 && <span className="text-sm"> (Save $50)</span>}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.schedule}
                    className="w-full bg-lbta-coral text-white font-bold py-5 px-6 text-lg tracking-wide transition duration-300 hover:bg-lbta-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Claim My $50 Discount →'}
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

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center">
            <div>
              <div className="text-4xl font-serif text-lbta-primary mb-1">20+</div>
              <p className="text-sm text-lbta-secondary">D1 Placements</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-serif text-lbta-primary mb-1">200+</div>
              <p className="text-sm text-lbta-secondary">Active Juniors</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-serif text-lbta-primary mb-1">Since 2020</div>
              <p className="text-sm text-lbta-secondary">City Partner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-lbta-charcoal py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-lbta-bone/60 mb-3">
            Laguna Beach Tennis Academy • Official City Partner Since 2020
          </p>
          <p className="text-sm text-lbta-bone/60">
            <a href="tel:9494646645" className="text-lbta-coral">(949) 464-6645</a>
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
