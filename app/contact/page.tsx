'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, CheckCircle, Loader2 } from 'lucide-react'
import StickyCTA from '@/components/StickyCTA'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedIn: '',
    message: ''
  })
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Validation
    const newErrors: {[key: string]: string} = {}
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.phone) newErrors.phone = 'Phone is required'
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setStatus('sending')
    
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || formData.name,
          program: formData.interestedIn || 'General Inquiry',
          source: 'contact-page',
        }),
      })
      
      if (response.ok) {
        setStatus('success')
        setTimeout(() => {
          setFormData({ name: '', email: '', phone: '', interestedIn: '', message: '' })
          setStatus('idle')
        }, 5000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
    }
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach tennis courts at golden hour"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 60%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/25 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] mb-6 text-shadow">
            Let's Start Your Tennis Journey.
          </h1>
          <p className="font-serif text-[18px] md:text-[24px] leading-[1.3] mb-8 text-white/95">
            Movement. Discipline. Belonging — it starts here.
          </p>
          <p 
            className="text-black font-sans text-[14px] md:text-[16px] uppercase tracking-wide cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get in Touch ↓
          </p>
        </div>
      </section>

      {/* CONTACT INFO BAR */}
      <section className="bg-[#FAF8F3] border-b border-black/10 py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
            {/* Location */}
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-6 h-6 text-black" aria-hidden="true" />
              <div>
                <p className="font-sans font-semibold text-[15px] text-black mb-1">Location</p>
                <p className="font-sans text-[14px] text-black/70">1098 Balboa Ave</p>
                <p className="font-sans text-[14px] text-black/70">Laguna Beach, CA 92651</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex flex-col items-center gap-3">
              <Phone className="w-6 h-6 text-black" aria-hidden="true" />
              <div>
                <p className="font-sans font-semibold text-[15px] text-black mb-1">Phone</p>
                <a 
                  href="tel:9494646645" 
                  className="font-sans text-[14px] text-black/70 hover:text-black/70 transition-colors"
                  aria-label="Call us at (949) 464-6645"
                >
                  (949) 464-6645
                </a>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-6 h-6 text-black" aria-hidden="true" />
              <div>
                <p className="font-sans font-semibold text-[15px] text-black mb-1">Email</p>
                <a 
                  href="mailto:support@lagunabeachtennisacademy.com" 
                  className="font-sans text-[14px] text-black/70 hover:text-black/70 transition-colors break-all"
                  aria-label="Email us at support@lagunabeachtennisacademy.com"
                >
                  support@lagunabeachtennisacademy.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FORM SECTION */}
      <section id="contact-form" className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          {status === 'success' ? (
            /* SUCCESS STATE */
            <div className="max-w-2xl mx-auto text-center py-12 bg-black/5 rounded-2xl animate-fade-in-up">
              <CheckCircle className="w-16 h-16 text-black mx-auto mb-6" />
              <h3 className="font-serif text-[28px] md:text-[32px] font-semibold text-black mb-4">
                Message Sent!
              </h3>
              <p className="font-sans text-[16px] text-black/70 mb-8">
                Our team will respond within 24 hours. We look forward to connecting with you!
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-black hover:underline font-sans font-semibold text-[15px]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <div className="grid md:grid-cols-5 gap-8 md:gap-12">
              {/* Form - 3 columns */}
              <div className="md:col-span-3">
                <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-3">
                  Tell us a little about you.
                </h2>
                <p className="font-sans text-[15px] md:text-[16px] text-black/70 mb-8">
                  We'll match you to the right program and reach out within 24 hours.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label 
                      htmlFor="name"
                      className="block font-sans text-[15px] font-semibold text-black mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                        errors.name ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="Full name"
                      aria-label="Your full name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-[13px] mt-2">{errors.name}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label 
                      htmlFor="email"
                      className="block font-sans text-[15px] font-semibold text-black mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                        errors.email ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="your@email.com"
                      aria-label="Your email address"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-[13px] mt-2">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label 
                      htmlFor="phone"
                      className="block font-sans text-[15px] font-semibold text-black mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={`w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all ${
                        errors.phone ? 'ring-2 ring-red-500' : ''
                      }`}
                      placeholder="(949) 555-1234"
                      aria-label="Your phone number"
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-[13px] mt-2">{errors.phone}</p>
                    )}
                  </div>
                  
                  {/* Interested In */}
                  <div>
                    <label 
                      htmlFor="interested"
                      className="block font-sans text-[15px] font-semibold text-black mb-2"
                    >
                      Interested In (optional)
                    </label>
                    <select
                      id="interested"
                      value={formData.interestedIn}
                      onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
                      aria-label="Select program interest"
                    >
                      <option value="">Select a program...</option>
                      <option value="Junior Programs">Junior Programs (Ages 3-11)</option>
                      <option value="Youth Development">Youth Development (Ages 11-15)</option>
                      <option value="Adult Programs">Adult Programs</option>
                      <option value="Fitness Programs">Fitness Programs</option>
                      <option value="Summer Camps">Summer Camps</option>
                      <option value="Private Lessons">Private Lessons</option>
                      <option value="Not Sure">Not Sure - Help Me Choose</option>
                    </select>
                  </div>
                  
                  {/* Message */}
                  <div>
                    <label 
                      htmlFor="message"
                      className="block font-sans text-[15px] font-semibold text-black mb-2"
                    >
                      How can we help?
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full px-6 py-4 rounded-2xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-black transition-all resize-none"
                      placeholder="Tell us about your tennis goals and any questions you have..."
                      aria-label="Your message to us"
                    />
                  </div>
                  
                  {/* Confirmation Text */}
                  <p className="font-sans text-[13px] text-black/60 italic">
                    We'll respond within 24 hours.
                  </p>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full md:w-auto md:px-12 bg-black hover:bg-[#1a1a1a] hover:-translate-y-0.5 text-white font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message →'
                    )}
                  </button>
                  
                  {status === 'error' && (
                    <p className="text-red-600 text-[14px] text-center">
                      Error sending message. Please call (949) 464-6645
                    </p>
                  )}
                </form>
              </div>
              
              {/* Visual Accent - Desktop (2 columns) */}
              <div className="hidden md:block md:col-span-2 relative aspect-[3/2] overflow-hidden rounded-2xl shadow-soft">
                <Image
                  src="/images/programs/private-specialty.webp"
                  alt="LBTA private coaching session"
                  fill
                  className="object-cover"
                  sizes="40vw"
                />
              </div>
              
              {/* Visual Accent - Mobile (below form) */}
              <div className="md:hidden mt-8 relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
                <Image
                  src="/images/programs/private-specialty.webp"
                  alt="LBTA coaching session"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="font-sans text-[14px] text-white italic">
                    Our team will reach out to schedule your first conversation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PRE-FOOTER CTA */}
      <section className="bg-[#FAF8F3] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-6">
            Ready to Train With Purpose?
          </h2>
          <p className="font-sans text-[16px] text-black/70 mb-8 max-w-2xl mx-auto">
            Skip the form and book a trial session today. Experience LBTA firsthand.
          </p>
          <Link
            href="/book"
            className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px]"
          >
            Book a Trial →
          </Link>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Book a Trial" href="/book" showAfterScroll={800} />
    </>
  )
}
