'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// LUXURY YEAR-ROUND REGISTRATION MODAL
// For Camps, JTT, and Seasonal Programs
// Aman / Four Seasons / Apple-level design standards
// Refined neutrals, typography-driven, minimal color
// ============================================================

interface CampData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
}

interface JTTData {
  id: string
  name: string
  dates: string
  weeks: number
  matchDay: string
  divisions: { age: string; price: number }[]
  includes: string[]
}

interface LuxuryYearModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'camp' | 'jtt' | 'seasonal' | 'inquiry'
  data: CampData | JTTData | null
  season?: string
}

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
}

export default function LuxuryYearModal({ isOpen, onClose, type, data, season }: LuxuryYearModalProps) {
  const [step, setStep] = useState(1)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerName: '',
    playerAge: '',
    experience: 'beginner',
    notes: ''
  })

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedOption(null)
      setSelectedPrice(null)
      setIsSuccess(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        playerName: '',
        playerAge: '',
        experience: 'beginner',
        notes: ''
      })
    }
  }, [isOpen])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!data) return null

  // Get program name and details based on type
  const getProgramInfo = () => {
    if (type === 'camp') {
      const campData = data as CampData
      return {
        name: campData.name,
        dates: campData.dates,
        details: `${campData.ages} · ${campData.location} · ${campData.hours}`,
        description: campData.description
      }
    } else {
      const jttData = data as JTTData
      return {
        name: jttData.name,
        dates: jttData.dates,
        details: `${jttData.weeks} weeks · ${jttData.matchDay}`,
        description: `Junior Team Tennis competitive league`
      }
    }
  }

  // Get pricing options
  const getPricingOptions = () => {
    if (type === 'camp') {
      const campData = data as CampData
      const options = []
      if (campData.price) {
        options.push({ label: 'Full Week', value: 'full', price: campData.price })
      }
      if (campData.perDay) {
        options.push({ label: 'Per Day', value: 'day', price: campData.perDay })
      }
      if (campData.halfDay) {
        options.push({ label: 'Half Day', value: 'half', price: campData.halfDay })
      }
      return options
    } else {
      const jttData = data as JTTData
      return jttData.divisions.map(div => ({
        label: div.age,
        value: div.age,
        price: div.price
      }))
    }
  }

  const programInfo = getProgramInfo()
  const pricingOptions = getPricingOptions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Build the payload to match API expectations
      const payload: Record<string, unknown> = {
        registrationType: type,  // API expects 'registrationType' not 'type'
        season: season || '',
        programId: data.id || programInfo.name,
        program: programInfo.name,  // API expects 'program' not 'programName'
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        playerName: formData.playerName || `${formData.firstName} ${formData.lastName}`,
        playerAge: formData.playerAge,
        studentName: formData.playerName || `${formData.firstName} ${formData.lastName}`,
        studentAge: formData.playerAge,
        experience: formData.experience,
        notes: formData.notes || '',
        price: selectedPrice,
        totalPrice: selectedPrice,
      }

      // Add type-specific fields
      if (type === 'camp') {
        const campData = data as CampData
        payload.campName = campData.name
        payload.campDates = campData.dates
        payload.campId = campData.id
        payload.location = campData.location
      }

      if (type === 'jtt') {
        const jttData = data as JTTData
        payload.jttSeason = jttData.name
        payload.division = selectedOption  // The division they selected
        payload.jttId = jttData.id
      }

      console.log('📤 Submitting registration:', payload)

      const response = await fetch('/api/register-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log('📥 Registration response:', result)

      if (response.ok && result.success) {
        setIsSuccess(true)
      } else {
        console.error('Registration failed:', result)
        alert(result.message || 'Registration failed. Please try again or call (949) 464-6645')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again or call (949) 464-6645')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="flex h-1">
              <div className={`flex-1 transition-colors duration-300 ${step >= 1 ? 'bg-[#1a1a1a]' : 'bg-[#e8e8e8]'}`} />
              <div className={`flex-1 transition-colors duration-300 ${step >= 2 ? 'bg-[#1a1a1a]' : 'bg-[#e8e8e8]'}`} />
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-4px)]">
              {isSuccess ? (
                // Success State
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 md:p-10 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f0f9f0] flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#2d8a2d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-[28px] font-medium text-[#1a1a1a] mb-3">
                    Registration Received
                  </h2>
                  <p className="font-sans text-[15px] text-[#666] leading-relaxed mb-8 max-w-[320px] mx-auto">
                    Thank you for registering for {programInfo.name}. We&apos;ll confirm your spot within 24 hours.
                  </p>
                  <button
                    onClick={onClose}
                    className="font-sans text-[14px] font-medium text-[#1a1a1a] underline underline-offset-4 hover:text-[#666] transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : step === 1 ? (
                // Step 1: Option Selection
                <div className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2">
                    {type === 'camp' ? 'Camp Registration' : 'JTT Registration'}
                  </p>
                  <h2 className="font-serif text-[28px] md:text-[32px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.02em] pr-10">
                    {programInfo.name}
                  </h2>
                  <p className="font-sans text-[14px] text-[#888] mb-2">
                    {programInfo.dates}
                  </p>
                  <p className="font-sans text-[14px] text-[#888] mb-8">
                    {programInfo.details}
                  </p>

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {pricingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedOption(option.value)
                          setSelectedPrice(option.price)
                        }}
                        className={`w-full p-5 rounded-xl text-left transition-all duration-200 ${
                          selectedOption === option.value
                            ? 'bg-[#1a1a1a] text-white'
                            : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] text-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-[15px] font-medium">
                            {option.label}
                          </span>
                          <span className={`font-serif text-[22px] font-medium ${
                            selectedOption === option.value ? 'text-white' : 'text-[#1a1a1a]'
                          }`}>
                            ${option.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Price Display */}
                  {selectedPrice && (
                    <div className="flex justify-between items-center py-4 border-t border-[#e8e8e8] mb-8">
                      <span className="font-sans text-[13px] text-[#888] uppercase tracking-[0.05em]">
                        Total
                      </span>
                      <span className="font-serif text-[28px] font-medium text-[#1a1a1a]">
                        ${selectedPrice}
                      </span>
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={() => selectedOption && setStep(2)}
                    disabled={!selectedOption}
                    className={`w-full py-4 rounded-xl font-sans text-[14px] font-medium tracking-[0.02em] transition-all duration-200 ${
                      selectedOption
                        ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                        : 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-[#999] text-center mt-6">
                    Secure registration · Questions? <a href="tel:9494646645" className="text-[#666] hover:text-[#1a1a1a] transition-colors">(949) 464-6645</a>
                  </p>
                </div>
              ) : (
                // Step 2: Contact Information
                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2">
                    Your Details
                  </p>
                  <h2 className="font-serif text-[28px] md:text-[32px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.02em] pr-10">
                    {programInfo.name}
                  </h2>
                  <p className="font-sans text-[14px] text-[#888] mb-8">
                    {programInfo.dates} · {selectedOption}
                  </p>

                  {/* Form Fields */}
                  <div className="space-y-5 mb-8">
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                          placeholder="Last"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                          Player Name
                        </label>
                        <input
                          type="text"
                          value={formData.playerName}
                          onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                          placeholder="Player's name"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={formData.playerAge}
                          onChange={(e) => setFormData({...formData, playerAge: e.target.value})}
                          className="w-full px-4 py-3.5 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] placeholder:text-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/10 transition-all"
                          placeholder="Age"
                          min="3"
                          max="99"
                        />
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-2">
                        Experience Level
                      </label>
                      <div className="flex gap-2">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setFormData({...formData, experience: level})}
                            className={`flex-1 py-3 rounded-lg font-sans text-[13px] font-medium capitalize transition-all duration-200 ${
                              formData.experience === level
                                ? 'bg-[#1a1a1a] text-white'
                                : 'bg-[#f8f8f8] text-[#666] hover:bg-[#f0f0f0]'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-xl font-sans text-[14px] font-medium text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-xl bg-[#1a1a1a] text-white font-sans text-[14px] font-medium tracking-[0.02em] hover:bg-[#333] disabled:bg-[#ccc] transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                    </button>
                  </div>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-[#999] text-center mt-6">
                    Secure registration · Questions? <a href="tel:9494646645" className="text-[#666] hover:text-[#1a1a1a] transition-colors">(949) 464-6645</a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
