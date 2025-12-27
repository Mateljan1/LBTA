'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Loader2, Phone, Mail, Shield } from 'lucide-react'

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

export default function BookPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
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

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/private-specialty.webp"
            alt="Private tennis coaching consultation at LBTA"
            fill
            className="object-cover private-img"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[32px] md:text-[56px] font-bold leading-[1.1] mb-4 text-shadow">
            Book Your Free Trial
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 max-w-[90%] mx-auto">
            One conversation. Honest guidance. A path built around you.
          </p>
        </div>
      </section>

      {/* SINGLE-PAGE FORM */}
      <section className="bg-[#FAF8F3] py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 md:px-6">
          
          {/* Contact Options */}
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
            <p className="font-sans text-[14px] text-black/70">
              Prefer to speak directly?
            </p>
            <div className="flex gap-4">
              <a 
                href="tel:9494646645" 
                className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
              >
                <Phone className="w-4 h-4" />
                (949) 464-6645
              </a>
              <a 
                href="mailto:support@lagunabeachtennisacademy.com" 
                className="flex items-center gap-2 text-black font-sans font-semibold text-[14px] hover:text-black/70 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 md:p-8">
              <h2 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-6 text-center">
                Request Your Trial Lesson
              </h2>
              
              <div className="space-y-4">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                
                {/* Email */}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                
                {/* Phone */}
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                
                {/* Program */}
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({...formData, program: e.target.value})}
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
                >
                  <option value="">Select a program...</option>
                  {programs.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                
                {/* Goals (Optional) */}
                <textarea
                  placeholder="Tell us about your tennis goals (optional)"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                />
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black hover:bg-gray-800 text-white font-sans font-semibold text-[15px] py-4 rounded-xl transition-all duration-200 disabled:opacity-50 min-h-[52px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Request Trial Lesson'
                  )}
                </button>
                
                {/* Guarantee Badge */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-sans text-[13px] text-black/60">
                    30-Day Money-Back Guarantee
                  </span>
                </div>
              </div>
            </form>
          ) : (
            /* SUCCESS STATE */
            <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h2 className="font-serif text-[28px] md:text-[32px] font-semibold text-black mb-4">
                Thank you!
              </h2>
              <p className="font-sans text-[16px] text-black/70 mb-8">
                Our team will contact you within 24 hours to schedule your trial.
              </p>
              <Link
                href="/"
                className="inline-block bg-black hover:bg-gray-800 text-white font-sans font-semibold text-[15px] py-4 px-10 rounded-xl transition-all duration-200"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* WHAT TO EXPECT */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-8 text-center">
            What to Expect
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '1', title: 'We Call You', desc: 'Within 24 hours to discuss your goals and schedule.' },
              { num: '2', title: 'Free Assessment', desc: 'Meet your coach and experience our teaching style.' },
              { num: '3', title: 'Your Path Forward', desc: 'Receive a personalized program recommendation.' },
            ].map((step) => (
              <div 
                key={step.num}
                className="bg-[#FAF8F3] rounded-xl p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white font-serif text-[18px] font-bold flex items-center justify-center mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-serif text-[18px] font-semibold text-black mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-[14px] text-black/70 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="bg-[#FAF8F3] py-10">
        <div className="max-w-[900px] mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-black/70">
              <Shield className="h-5 w-5 text-black" />
              <span className="font-sans text-[13px] font-medium">USTA Certified</span>
            </div>
            <div className="flex items-center gap-2 text-black/70">
              <Shield className="h-5 w-5 text-black" />
              <span className="font-sans text-[13px] font-medium">PTR Certified</span>
            </div>
            <div className="flex items-center gap-2 text-black/70">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-sans text-[13px] font-medium">Background Checked</span>
            </div>
            <div className="flex items-center gap-2 text-black/70">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-sans text-[13px] font-medium">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
