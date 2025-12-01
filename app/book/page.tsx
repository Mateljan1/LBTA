'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Send, Loader2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const programs = [
  // Junior Programs
  { value: "little-tennis-stars", label: "Little Tennis Stars (Ages 3-4)", category: "Junior" },
  { value: "red-ball", label: "Red Ball Tennis (Ages 5-7)", category: "Junior" },
  { value: "orange-ball", label: "Orange Ball Tennis (Ages 7-9)", category: "Junior" },
  { value: "green-dot", label: "Green Dot Tennis (Ages 9-11)", category: "Junior" },
  { value: "youth-development", label: "Youth Development (Ages 11-15)", category: "Junior" },
  { value: "high-performance", label: "High Performance (Ages 12-17)", category: "Junior" },
  { value: "college-bound", label: "College Bound (Ages 14-18)", category: "Junior" },
  // Adult Programs
  { value: "adult-beginner", label: "Adult Beginner (NTRP 1.0-2.5)", category: "Adult" },
  { value: "adult-intermediate", label: "Adult Intermediate (NTRP 3.0-3.5)", category: "Adult" },
  { value: "adult-advanced", label: "Adult Advanced (NTRP 4.0+)", category: "Adult" },
  { value: "cardio-tennis", label: "Cardio Tennis (All Levels)", category: "Adult" },
  { value: "liveball", label: "LiveBall Doubles", category: "Adult" },
  // Other
  { value: "private-lessons", label: "Private Lessons", category: "Private" },
  { value: "match-play", label: "Match Play Friday", category: "Special" },
  { value: "not-sure", label: "Not Sure - Help Me Choose", category: "Other" },
]

const preferredTimes = [
  "Weekday Mornings (6-10 AM)",
  "Weekday Afternoons (3-6 PM)",
  "Weekday Evenings (6-9 PM)",
  "Saturday Mornings (7 AM-12 PM)",
  "Saturday Afternoons (12-6 PM)",
  "Sunday Mornings (7 AM-12 PM)",
  "Sunday Afternoons (12-6 PM)",
  "Flexible - Any Time"
]

export default function BookPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    preferredCoach: '',
    preferredTime: '',
    experience: '',
    goals: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        router.push('/thank-you')
      } else {
        alert('Error submitting form. Please call (949) 464-6645')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Error submitting form. Please call (949) 464-6645')
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Private Consultation Request</p>
            <h1 className="text-display-lg heading-display mb-6">
              Book a Trial
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Not everyone is ready for what we offer. Let's discover together if LBTA is the right environment for your tennis excellence journey.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-lbta-cream py-12 border-b border-gray-200">
        <div className="container-lbta">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>Complimentary Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>Private Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>Honest Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>Same-Day Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                  Contact Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                      placeholder="john@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                      placeholder="(949) 555-1234"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                  Program & Schedule
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Which program interests you? *
                    </label>
                    <select
                      required
                      value={formData.program}
                      onChange={(e) => handleChange('program', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    >
                      <option value="">Select a program</option>
                      <optgroup label="Junior Programs">
                        {programs.filter(p => p.category === 'Junior').map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Adult Programs">
                        {programs.filter(p => p.category === 'Adult').map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Other Options">
                        {programs.filter(p => p.category === 'Private' || p.category === 'Special' || p.category === 'Other').map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </optgroup>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">
                      Not sure? Select "Not Sure - Help Me Choose"
                    </p>
                  </div>

                  {/* Coach Selection - Shows for Private Lessons */}
                  {formData.program === 'private-lessons' && (
                    <div>
                      <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                        Preferred Coach *
                      </label>
                      <select
                        required
                        value={formData.preferredCoach}
                        onChange={(e) => handleChange('preferredCoach', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                      >
                        <option value="">Select your coach</option>
                        <option value="andrew-mateljan">Andrew Mateljan - ATP/WTA Tour Coach ($250/hr)</option>
                        <option value="kevin-jackson">Kevin Jackson - College Recruitment ($150/hr)</option>
                        <option value="savriyan-danilov">Savriyan Danilov - ATP Pro #556 ($120/hr)</option>
                        <option value="andy-wu">Andy Wu - USPTA Certified ($100/hr)</option>
                        <option value="michelle-bevins">Michelle Bevins - Youth Director ($120/hr)</option>
                        <option value="no-preference">No Preference</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        View full coach profiles on our <Link href="/coaches" className="text-lbta-burnt hover:underline">coaches page</Link>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Preferred time for trial class *
                    </label>
                    <select
                      required
                      value={formData.preferredTime}
                      onChange={(e) => handleChange('preferredTime', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    >
                      <option value="">Select your preferred time</option>
                      {preferredTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Current experience level
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => handleChange('experience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    >
                      <option value="">Select your level</option>
                      <option value="never-played">Never Played</option>
                      <option value="beginner">Beginner (0-6 months)</option>
                      <option value="intermediate">Intermediate (6 months - 2 years)</option>
                      <option value="advanced">Advanced (2+ years)</option>
                      <option value="competitive">Competitive (Tournament player)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div className="pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                  Your Aspirations
                </h2>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    What draws you to tennis excellence? What transformation do you seek?
                  </label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => handleChange('goals', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all resize-none"
                    placeholder="e.g., develop unshakeable mental toughness, earn a college scholarship, achieve the excellence of professional technique, discover the confidence that comes from true skill..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This helps us determine if our approach aligns with your vision
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      SUBMITTING REQUEST...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      REQUEST CONSULTATION
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                  By submitting this request, you agree to receive personalized communication from LBTA about your consultation.  
                  We'll reach out within 24 hours to arrange your private assessment.
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Your Journey to Excellence
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From initial conversation to transformation—here's how we guide you through the LBTA experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center mx-auto mb-4 font-sans font-bold text-lg">
                  1
                </div>
                <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                  We Assess
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our coaching team reviews your aspirations and current level
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center mx-auto mb-4 font-sans font-bold text-lg">
                  2
                </div>
                <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                  We Connect
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Personal conversation about your goals and our approach
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center mx-auto mb-4 font-sans font-bold text-lg">
                  3
                </div>
                <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                  You Experience
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Private session to feel our coaching approach and philosophy
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-lbta-burnt text-white flex items-center justify-center mx-auto mb-4 font-sans font-bold text-lg">
                  4
                </div>
                <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                  We Align
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Together we determine if LBTA is your path to excellence
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6">
              Prefer Direct Contact?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Speak directly with our team about your tennis aspirations and our approach to excellence
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:9494646645"
                className="btn-secondary"
              >
                CALL (949) 464-6645
              </a>
              <a
                href="mailto:support@lagunabeachtennisacademy.com"
                className="btn-secondary"
              >
                EMAIL US DIRECTLY
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

