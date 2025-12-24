'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ============================================================
// LUXURY YEAR-ROUND REGISTRATION MODAL
// For Camps, JTT, and Seasonal Programs
// Aman / Four Seasons / Apple-level design standards
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
  description: string
}

interface SeasonData {
  name: string
  dates: string
  weeks: number
  status: string
}

type RegistrationType = 'camp' | 'jtt' | 'seasonal' | 'inquiry'

interface LuxuryYearModalProps {
  isOpen: boolean
  onClose: () => void
  type: RegistrationType
  data: CampData | JTTData | SeasonData | null
  season?: string
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

export default function LuxuryYearModal({
  isOpen,
  onClose,
  type,
  data,
  season
}: LuxuryYearModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerName: '',
    playerAge: '',
    division: '',
    campWeek: '',
    halfDay: false,
    notes: '',
    emergencyContact: '',
    emergencyPhone: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setIsSuccess(false)
      setError(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        playerName: '',
        playerAge: '',
        division: '',
        campWeek: '',
        halfDay: false,
        notes: '',
        emergencyContact: '',
        emergencyPhone: '',
      })
      setErrors({})
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'Required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Required'
    if (!formData.email.trim()) newErrors.email = 'Required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone.trim()) newErrors.phone = 'Required'
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.playerName.trim()) newErrors.playerName = 'Required'
    if (!formData.playerAge.trim()) newErrors.playerAge = 'Required'
    
    if (type === 'jtt' && !formData.division) {
      newErrors.division = 'Please select a division'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      const submissionData: Record<string, unknown> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        playerName: formData.playerName,
        playerAge: formData.playerAge,
        notes: formData.notes,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        registrationType: type,
        season: season || 'winter',
      }

      if (type === 'camp' && data) {
        const campData = data as CampData
        submissionData.program = campData.name
        submissionData.programId = campData.id
        submissionData.campId = campData.id
        submissionData.campName = campData.name
        submissionData.campDates = campData.dates
        submissionData.campWeek = formData.campWeek
        submissionData.location = campData.location
        submissionData.price = formData.halfDay && campData.halfDay ? campData.halfDay : campData.price
      }

      if (type === 'jtt' && data) {
        const jttData = data as JTTData
        submissionData.program = jttData.name
        submissionData.programId = jttData.id
        submissionData.jttId = jttData.id
        submissionData.jttSeason = jttData.name
        submissionData.division = formData.division
        
        const selectedDivision = jttData.divisions.find(d => d.age === formData.division)
        submissionData.price = selectedDivision?.price || 0
      }

      if (type === 'seasonal' && data) {
        const seasonData = data as SeasonData
        submissionData.program = `${seasonData.name} Program Inquiry`
      }

      if (type === 'inquiry') {
        submissionData.program = 'General Inquiry'
      }

      const response = await fetch('/api/register-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Get display info based on type
  const getTitle = () => {
    if (type === 'camp' && data) return (data as CampData).name
    if (type === 'jtt' && data) return (data as JTTData).name
    if (type === 'seasonal') return `${season || 'Winter'} 2026`
    return 'Program Inquiry'
  }

  const getSubtitle = () => {
    if (type === 'camp' && data) {
      const campData = data as CampData
      return `${campData.dates} · Ages ${campData.ages}`
    }
    if (type === 'jtt' && data) {
      const jttData = data as JTTData
      return `${jttData.dates} · ${jttData.weeks} weeks`
    }
    if (type === 'seasonal' && data) {
      const seasonData = data as SeasonData
      return `${seasonData.dates} · ${seasonData.weeks} weeks`
    }
    return 'Tell us about your tennis goals'
  }

  const getPrice = () => {
    if (type === 'camp' && data) {
      const campData = data as CampData
      if (formData.halfDay && campData.halfDay) {
        return campData.halfDay
      }
      return campData.price
    }
    if (type === 'jtt' && data && formData.division) {
      const jttData = data as JTTData
      const division = jttData.divisions.find(d => d.age === formData.division)
      return division?.price || null
    }
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={springTransition}
          className="relative w-full max-w-[520px] bg-white shadow-luxury overflow-hidden"
          style={{ borderRadius: '12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors duration-300"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-black/60">
              <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          
          {isSuccess ? (
            /* ========== SUCCESS STATE ========== */
            <motion.div 
              className="px-8 py-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-lbta-orange to-lbta-red flex items-center justify-center"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-serif text-[28px] md:text-[32px] font-semibold text-black mb-3"
              >
                Registration Complete
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[15px] text-black/60 mb-8 max-w-[320px] mx-auto leading-relaxed"
              >
                {type === 'camp' && "We've sent a confirmation to your email with camp details and next steps."}
                {type === 'jtt' && "Our team will contact you shortly with team placement information."}
                {type === 'seasonal' && "We'll confirm your spot within 24 hours."}
                {type === 'inquiry' && "Our team will reach out within 24 hours."}
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="inline-flex items-center justify-center bg-black text-white font-sans font-medium text-[14px] tracking-wide py-4 px-10 transition-all duration-300 hover:bg-lbta-orange"
                style={{ borderRadius: '2px' }}
              >
                Done
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* ========== HEADER ========== */}
              <div className="px-8 pt-8 pb-6 border-b border-black/5">
                {/* Progress */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${step >= 1 ? 'bg-black' : 'bg-black/10'}`} />
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${step >= 2 ? 'bg-black' : 'bg-black/10'}`} />
                </div>
                
                <motion.div 
                  key={step} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-sans text-[11px] uppercase tracking-[2px] text-lbta-orange mb-2">
                    {type === 'camp' ? 'Camp Registration' : type === 'jtt' ? 'JTT Registration' : 'Registration'}
                  </p>
                  <h2 className="font-serif text-[24px] md:text-[28px] font-semibold text-black leading-tight pr-8">
                    {getTitle()}
                  </h2>
                  <p className="font-sans text-[14px] text-black/50 mt-2">
                    {getSubtitle()}
                  </p>
                </motion.div>
              </div>
              
              {/* ========== CONTENT ========== */}
              <div className="px-8 py-6 max-h-[55vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* STEP 1: Parent/Guardian Info */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <p className="font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-4">
                        Parent / Guardian
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.firstName ? 'ring-2 ring-red-400' : ''}`}
                            style={{ borderRadius: '2px' }}
                            placeholder="First Name"
                          />
                          {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.lastName ? 'ring-2 ring-red-400' : ''}`}
                            style={{ borderRadius: '2px' }}
                            placeholder="Last Name"
                          />
                          {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                          style={{ borderRadius: '2px' }}
                          placeholder="Email Address"
                        />
                        {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                      </div>
                      
                      <div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                          style={{ borderRadius: '2px' }}
                          placeholder="Phone Number"
                        />
                        {errors.phone && <p className="text-red-500 text-[11px] mt-1">{errors.phone}</p>}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* STEP 2: Player Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <p className="font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-4">
                        Player Information
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                          <input
                            type="text"
                            value={formData.playerName}
                            onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                            className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.playerName ? 'ring-2 ring-red-400' : ''}`}
                            style={{ borderRadius: '2px' }}
                            placeholder="Player's Full Name"
                          />
                          {errors.playerName && <p className="text-red-500 text-[11px] mt-1">{errors.playerName}</p>}
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <input
                            type="number"
                            min="3"
                            max="18"
                            value={formData.playerAge}
                            onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                            className={`w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all ${errors.playerAge ? 'ring-2 ring-red-400' : ''}`}
                            style={{ borderRadius: '2px' }}
                            placeholder="Age"
                          />
                          {errors.playerAge && <p className="text-red-500 text-[11px] mt-1">{errors.playerAge}</p>}
                        </div>
                      </div>

                      {/* JTT Division Selection */}
                      {type === 'jtt' && data && (
                        <div>
                          <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-3">
                            Select Division
                          </label>
                          <div className="space-y-2">
                            {(data as JTTData).divisions.map((div) => (
                              <button
                                key={div.age}
                                type="button"
                                onClick={() => setFormData({ ...formData, division: div.age })}
                                className={`w-full flex items-center justify-between px-5 py-4 font-sans text-[14px] transition-all duration-300 border ${
                                  formData.division === div.age
                                    ? 'border-black bg-black text-white'
                                    : 'border-black/10 bg-white text-black hover:border-black/30'
                                }`}
                                style={{ borderRadius: '2px' }}
                              >
                                <span className="font-medium">{div.age}</span>
                                <span className={`font-serif text-[18px] ${formData.division === div.age ? 'text-white' : 'text-lbta-orange'}`}>
                                  ${div.price.toLocaleString()}
                                </span>
                              </button>
                            ))}
                          </div>
                          {errors.division && <p className="text-red-500 text-[11px] mt-1">{errors.division}</p>}
                        </div>
                      )}

                      {/* Camp Half Day Option */}
                      {type === 'camp' && data && (data as CampData).halfDay && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, halfDay: !formData.halfDay })}
                          className={`w-full flex items-center justify-between px-5 py-4 font-sans text-[14px] transition-all duration-300 border ${
                            formData.halfDay
                              ? 'border-black bg-black text-white'
                              : 'border-black/10 bg-white text-black hover:border-black/30'
                          }`}
                          style={{ borderRadius: '2px' }}
                        >
                          <span className="font-medium">Half Day Option (9 AM - 12 PM)</span>
                          <span className={`font-serif text-[18px] ${formData.halfDay ? 'text-white' : 'text-lbta-orange'}`}>
                            ${(data as CampData).halfDay}
                          </span>
                        </button>
                      )}

                      {/* Safety Note */}
                      {type === 'camp' && data && (data as CampData).safetyNote && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50/50 border border-amber-200/50" style={{ borderRadius: '2px' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-600 flex-shrink-0 mt-0.5">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <p className="font-sans text-[13px] text-amber-800">
                            {(data as CampData).safetyNote}
                          </p>
                        </div>
                      )}

                      {/* Emergency Contact */}
                      <div className="pt-4 border-t border-black/5">
                        <p className="font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-3">
                          Emergency Contact (Optional)
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={formData.emergencyContact}
                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                            style={{ borderRadius: '2px' }}
                            placeholder="Name"
                          />
                          <input
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                            className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                            style={{ borderRadius: '2px' }}
                            placeholder="Phone"
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all resize-none"
                          style={{ borderRadius: '2px' }}
                          placeholder="Any allergies, medical conditions, or notes..."
                        />
                      </div>

                      {/* Price Display */}
                      {getPrice() && (
                        <div className="flex items-center justify-between py-5 border-t border-black/10">
                          <span className="font-sans text-[13px] text-black/50 uppercase tracking-wide">
                            {type === 'camp' ? 'Per Week' : 'Season Total'}
                          </span>
                          <span className="font-serif text-[32px] font-semibold text-black">
                            ${getPrice()?.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Error Display */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-4 bg-red-50 border border-red-100"
                          style={{ borderRadius: '2px' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span className="font-sans text-[13px] text-red-700">{error}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* ========== FOOTER ========== */}
              <div className="px-8 py-6 bg-lbta-cream/50 border-t border-black/5">
                <div className="flex gap-3">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-4 font-sans font-medium text-[14px] text-black/60 hover:text-black transition-colors duration-300"
                    >
                      ← Back
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={step === 1 ? handleNext : handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 font-sans font-medium text-[14px] tracking-wide bg-black text-white transition-all duration-300 hover:bg-lbta-orange disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ borderRadius: '2px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing...
                      </>
                    ) : step === 1 ? (
                      'Continue →'
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
                
                <p className="font-sans text-[11px] text-black/40 text-center mt-4">
                  Secure registration · <a href="tel:+19494646645" className="text-lbta-orange hover:underline">(949) 464-6645</a>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

