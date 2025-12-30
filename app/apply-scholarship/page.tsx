'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Send, Loader2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function ApplyScholarshipPage() {
  const [formData, setFormData] = useState({
    // Student Information
    studentName: '',
    studentAge: '',
    studentGrade: '',
    studentGPA: '',
    
    // Parent/Guardian Information
    parentName: '',
    email: '',
    phone: '',
    address: '',
    
    // Household Information
    householdIncome: '',
    householdSize: '',
    
    // Tennis Background
    currentLevel: '',
    yearsPlaying: '',
    currentProgram: '',
    desiredProgram: '',
    sessionsPerWeek: '',
    
    // Commitment & Goals
    goals: '',
    whyScholarship: '',
    
    // Additional Information
    additionalInfo: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/scholarship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          window.location.href = '/thank-you?type=scholarship'
        }, 1500)
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-lbta-cream pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Scholarship Application</p>
            <h1 className="text-display-lg heading-display mb-6">
              Tennis Scholarship Program
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              $25,000+ awarded annually to families demonstrating need and commitment. 
              Scholarships cover 25-50% of program tuition.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>Household income &lt; $75K</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>2+ sessions/week commitment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-lbta-burnt" />
              <span>3.5+ GPA required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Student Information */}
            <div>
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => handleChange('studentName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="First and Last Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.studentAge}
                    onChange={(e) => handleChange('studentAge', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="Student age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Current Grade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentGrade}
                    onChange={(e) => handleChange('studentGrade', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="e.g., 9th Grade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Current GPA * (3.5+ required)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="3.5"
                    max="4.0"
                    required
                    value={formData.studentGPA}
                    onChange={(e) => handleChange('studentGPA', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Parent/Guardian Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => handleChange('parentName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="Full Name"
                  />
                </div>

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
                    placeholder="your@email.com"
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
                    placeholder="(949) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="City, State, ZIP"
                  />
                </div>
              </div>
            </div>

            {/* Household Information */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Household Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Household Income * (must be under $75,000)
                  </label>
                  <select
                    required
                    value={formData.householdIncome}
                    onChange={(e) => handleChange('householdIncome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                  >
                    <option value="">Select range</option>
                    <option value="under-25k">Under $25,000</option>
                    <option value="25k-40k">$25,000 - $40,000</option>
                    <option value="40k-55k">$40,000 - $55,000</option>
                    <option value="55k-75k">$55,000 - $75,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Household Size *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.householdSize}
                    onChange={(e) => handleChange('householdSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="Number of people in household"
                  />
                </div>
              </div>
            </div>

            {/* Tennis Background */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Tennis Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Current Skill Level *
                  </label>
                  <select
                    required
                    value={formData.currentLevel}
                    onChange={(e) => handleChange('currentLevel', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner (0-6 months)</option>
                    <option value="intermediate">Intermediate (6-18 months)</option>
                    <option value="advanced">Advanced (18+ months)</option>
                    <option value="competitive">Competitive (Tournament player)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Years Playing Tennis *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.yearsPlaying}
                    onChange={(e) => handleChange('yearsPlaying', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="Years of experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Current LBTA Program (if enrolled)
                  </label>
                  <input
                    type="text"
                    value={formData.currentProgram}
                    onChange={(e) => handleChange('currentProgram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="e.g., Youth Development 1x/week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Desired Program *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.desiredProgram}
                    onChange={(e) => handleChange('desiredProgram', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="e.g., High Performance 2x/week"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Committed Sessions Per Week * (minimum 2)
                  </label>
                  <select
                    required
                    value={formData.sessionsPerWeek}
                    onChange={(e) => handleChange('sessionsPerWeek', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                  >
                    <option value="">Select frequency</option>
                    <option value="2">2 sessions per week</option>
                    <option value="3">3 sessions per week</option>
                    <option value="4">4 sessions per week</option>
                    <option value="5+">5+ sessions per week</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Commitment & Goals */}
            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-6">
                Commitment & Goals
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Tennis Goals * (What do you hope to achieve?)
                  </label>
                  <textarea
                    required
                    value={formData.goals}
                    onChange={(e) => handleChange('goals', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all resize-none"
                    placeholder="e.g., earn college scholarship, compete in USTA tournaments, develop discipline and character through tennis..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Why This Scholarship Matters to Your Family *
                  </label>
                  <textarea
                    required
                    value={formData.whyScholarship}
                    onChange={(e) => handleChange('whyScholarship', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all resize-none"
                    placeholder="Share your story. Help us understand your family's commitment to tennis and how this scholarship would impact your development."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleChange('additionalInfo', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all resize-none"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className="btn-primary min-w-[300px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      SUBMITTING APPLICATION...
                    </>
                  ) : submitSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      APPLICATION SUBMITTED!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      SUBMIT APPLICATION
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed">
                  By submitting this application, you agree to provide accurate information for scholarship review.  
                  We'll contact you within 5-7 business days regarding your application status.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <AnimatedSection className="text-center">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              What Happens Next
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-4">01</div>
              <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                We Review
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Scholarship committee reviews your application
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-4">02</div>
              <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                Interview
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Brief conversation with family and student
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-4">03</div>
              <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                Decision
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Notification within 7-10 business days
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-4">04</div>
              <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-2">
                You Begin
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Start your tennis journey with LBTA
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6">
              Questions About Scholarships?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our scholarship coordinator is here to help answer questions about eligibility and the application process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:scholarships@lagunabeachtennisacademy.com"
                className="btn-secondary"
              >
                EMAIL SCHOLARSHIP TEAM
              </a>
              <a
                href="tel:9494646645"
                className="btn-secondary"
              >
                CALL (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
