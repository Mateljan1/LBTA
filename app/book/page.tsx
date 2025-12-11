'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Loader2, Phone, Mail } from 'lucide-react'

const programs = [
  { value: "little-tennis-stars", label: "Little Tennis Stars (Ages 3-4)" },
  { value: "red-ball", label: "Red Ball Tennis (Ages 5-7)" },
  { value: "orange-ball", label: "Orange Ball Tennis (Ages 7-9)" },
  { value: "green-dot", label: "Green Dot Tennis (Ages 9-11)" },
  { value: "youth-development", label: "Youth Development (Ages 11-15)" },
  { value: "high-performance", label: "High Performance (Ages 12-17)" },
  { value: "adult-beginner", label: "Adult Beginner (NTRP 1.0-2.5)" },
  { value: "adult-intermediate", label: "Adult Intermediate (NTRP 3.0-3.5)" },
  { value: "adult-advanced", label: "Adult Advanced (NTRP 4.0+)" },
  { value: "cardio-tennis", label: "Cardio Tennis" },
  { value: "private-lessons", label: "Private Lessons" },
  { value: "not-sure", label: "Not Sure - Help Me Choose" },
]

const locations = ["Moulton Courts", "Alta Laguna Park", "LBHS"]
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const levels = ["Beginner", "Intermediate", "Advanced", "Not Sure"]

export default function BookPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    location: '',
    preferredDays: [] as string[],
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
        setIsSuccess(true)
        setTimeout(() => router.push('/thank-you'), 2000)
      } else {
        alert('Error submitting. Please call (949) 464-6645')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting. Please call (949) 464-6645')
      setIsSubmitting(false)
    }
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day]
    }))
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/private-specialty.webp"
            alt="Private tennis coaching consultation at LBTA"
            fill
            className="object-cover private-img"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[32px] md:text-[60px] font-bold leading-[1.1] mb-6 text-shadow">
            Start Your Journey to Tennis Excellence.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[90%] mx-auto">
            Private assessment, honest guidance, and a path built around you.
          </p>
          <a 
            href="#book-form"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Book a Trial →
          </a>
        </div>
      </section>

      {/* CONTACT CARD */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="bg-[#FAF8F3] rounded-2xl p-6 md:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans font-semibold text-[16px] md:text-[18px] text-black/85">
              Prefer to speak directly?
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <a 
                href="tel:9494646645" 
                className="flex items-center gap-2 text-lbta-red font-sans font-semibold text-[15px] md:text-[16px] hover:text-lbta-orange transition-colors"
              >
                <Phone className="w-4 h-4" />
                (949) 464-6645
              </a>
              <a 
                href="mailto:support@lagunabeachtennisacademy.com" 
                className="flex items-center gap-2 text-lbta-red font-sans font-semibold text-[15px] md:text-[16px] hover:text-lbta-orange transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MULTI-STEP FORM */}
      <section id="book-form" className="bg-[#FAF8F3] py-16 md:py-20">
        <div className="max-w-[640px] mx-auto px-4 md:px-6">
          {!isSuccess ? (
            <>
              {/* Progress Indicator */}
              <div className="flex justify-center items-center gap-2 mb-8">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step === currentStep ? 'bg-lbta-orange w-8' : step < currentStep ? 'bg-lbta-orange' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-center font-sans text-[14px] text-black/60 mb-8">
                Step {currentStep} of 3
              </p>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
                
                {/* STEP 1: ABOUT YOU */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-6">
                      Tell us about yourself.
                    </h2>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 mt-4 min-h-[48px]"
                    >
                      Next →
                    </button>
                  </div>
                )}

                {/* STEP 2: PROGRAM & SCHEDULE */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-6">
                      Which program are you interested in?
                    </h2>
                    <select
                      value={formData.program}
                      onChange={(e) => setFormData({...formData, program: e.target.value})}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all cursor-pointer"
                    >
                      <option value="">Select a program...</option>
                      {programs.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all cursor-pointer"
                    >
                      <option value="">Preferred location...</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    
                    <div>
                      <p className="font-sans text-[15px] text-black/70 mb-3">Preferred Days (select all that work):</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {days.map(day => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`px-4 py-3 rounded-full font-sans text-[14px] font-medium transition-all duration-200 ${
                              formData.preferredDays.includes(day)
                                ? 'bg-lbta-orange text-white'
                                : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-sans text-[15px] text-black/70 mb-3">Experience Level:</p>
                      <div className="grid grid-cols-2 gap-3">
                        {levels.map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({...formData, experience: level})}
                            className={`px-6 py-3 rounded-full font-sans text-[14px] md:text-[15px] font-medium transition-all duration-200 ${
                              formData.experience === level
                                ? 'bg-lbta-red text-white'
                                : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 border-2 border-lbta-red text-lbta-red hover:bg-lbta-red/5 font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 min-h-[48px]"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 min-h-[48px]"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: ASPIRATIONS */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-4">
                      What would you like to achieve?
                    </h2>
                    <p className="font-sans text-[15px] text-black/70 leading-relaxed mb-6">
                      Whether it's confidence, competition results, or technical mastery — tell us your goal.
                    </p>
                    <textarea
                      placeholder="Share your tennis goals with us..."
                      value={formData.goals}
                      onChange={(e) => setFormData({...formData, goals: e.target.value})}
                      rows={4}
                      className="w-full px-6 py-4 rounded-2xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all resize-none"
                    />
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="flex-1 border-2 border-lbta-red text-lbta-red hover:bg-lbta-red/5 font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 min-h-[48px]"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Request →'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          ) : (
            /* SUCCESS STATE */
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center">
              <CheckCircle className="w-16 h-16 text-lbta-orange mx-auto mb-6" />
              <h2 className="font-serif text-[28px] md:text-[36px] font-semibold text-black mb-4">
                Thank you!
              </h2>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 mb-8">
                Our team will contact you within 24 hours to schedule your consultation.
              </p>
              <Link
                href="/"
                className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200"
              >
                Return to Home →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* JOURNEY TO EXCELLENCE */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-12 text-center">
            Your Path to Progress
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { num: '1', title: 'Assess', desc: 'We learn your goals and observe your play.' },
              { num: '2', title: 'Connect', desc: 'You meet your coach and define your pathway.' },
              { num: '3', title: 'Experience', desc: 'Attend your first LBTA session and feel the difference.' },
              { num: '4', title: 'Align', desc: 'Review progress and next steps with our team.' },
            ].map((step, index) => (
              <div 
                key={step.num}
                className="bg-[#FAF8F3] rounded-2xl p-6 md:p-8 text-center shadow-soft hover:shadow-hover transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-[36px] md:text-[42px] text-lbta-orange font-serif font-bold mb-3">
                  {step.num}
                </div>
                <h3 className="font-serif text-[20px] md:text-[22px] font-semibold text-black mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-black/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover cta-img"
            sizes="100vw"
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[32px] md:text-[48px] font-semibold mb-6 leading-[1.2] text-shadow">
            Start training with purpose.
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 mb-10">
            The first step is one conversation.
          </p>
          <a
            href="#book-form"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Request Consultation →
          </a>
        </div>
      </section>
    </>
  )
}
