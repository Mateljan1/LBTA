'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Loader2, Phone, Mail, Shield } from 'lucide-react'
import TrialBookingModal from '@/components/TrialBookingModal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  // Auto-open modal when page loads
  useEffect(() => {
    setIsModalOpen(true)
  }, [])

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

      {/* CONTACT OPTIONS */}
      <section className="bg-[#FAF8F3] py-12 md:py-16">
        <div className="max-w-[600px] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm text-center">
            <h2 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-4">
              Ready to Start?
            </h2>
            <p className="font-sans text-[15px] text-black/70 mb-6">
              Book your free trial lesson or speak with us directly.
            </p>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-black hover:bg-gray-800 text-white font-sans font-semibold text-[15px] py-4 rounded-xl transition-all duration-200 mb-4"
            >
              Book Free Trial
            </button>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-black/10">
              <p className="font-sans text-[13px] text-black/60">
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
          </div>
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
      <section className="bg-white py-10">
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

      {/* Trial Booking Modal */}
      <TrialBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
