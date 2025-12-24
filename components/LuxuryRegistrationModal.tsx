'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Program } from '@/components/ProgramCard'

// ============================================================
// LUXURY REGISTRATION MODAL
// Aman / Four Seasons / Apple-level design standards
// ============================================================

interface LuxuryRegistrationModalProps {
  program: Program | null
  onClose: () => void
}

// Spring animation config for luxury feel
const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export default function LuxuryRegistrationModal({ program, onClose }: LuxuryRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedFrequency, setSelectedFrequency] = useState<string>('')
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentName: '',
    studentAge: '',
    experience: '',
    notes: '',
  })
  
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (program) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [program])
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])
  
  if (!program) return null
  
  const requiresStudentInfo = program.category === 'Junior' || program.category === 'Youth'
  const availableDays = program.schedule.map(s => s.day)
  
  const pricingOptions = Object.entries(program.pricing)
    .filter(([key, value]) => key !== 'drop_in' && value !== undefined)
    .map(([key, value]) => {
      const labels: Record<string, string> = {
        monthly: 'Monthly',
        '1x': '1× per week',
        '2x': '2× per week',
        '3x': '3× per week',
        '4x': '4× per week',
        '5x': '5× per week',
      }
      return { label: labels[key] || key, value: key, price: value as number }
    })
  
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }
  
  const handleFrequencyChange = (value: string, price: number) => {
    setSelectedFrequency(value)
    setCalculatedPrice(price)
  }
  
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please complete all required fields.')
      return
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number.')
      return
    }
    
    if (requiresStudentInfo && (!formData.studentName || !formData.studentAge)) {
      setError('Please provide student details.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/register-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          program: program.program,
          studentName: formData.studentName || `${formData.firstName} ${formData.lastName}`,
          studentAge: parseInt(formData.studentAge) || null,
          experience: formData.experience || 'Not specified',
          preferredDays: selectedDays,
          location: program.location,
          totalPrice: calculatedPrice,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setIsSuccess(true)
      } else {
        setError(data.message || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
      }
    } catch {
      setError('Connection error. Please try again.')
      setIsSubmitting(false)
    }
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop with blur */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={springTransition}
          className="relative w-full max-w-[520px] mx-4 bg-white shadow-luxury overflow-hidden"
          style={{ borderRadius: '12px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Minimal */}
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
              {...fadeInUp}
              transition={{ duration: 0.5 }}
            >
              {/* Success Icon */}
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
                You're All Set
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-sans text-[15px] text-black/60 mb-8 max-w-[320px] mx-auto leading-relaxed"
              >
                A confirmation email is on its way to <span className="text-black font-medium">{formData.email}</span>. 
                We'll be in touch within 24 hours.
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="inline-flex items-center justify-center bg-black text-white font-sans font-medium text-[14px] tracking-wide py-4 px-10 transition-all duration-300 hover:bg-lbta-orange"
                style={{ borderRadius: '2px' }}
              >
                Continue Browsing
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* ========== HEADER ========== */}
              <div className="px-8 pt-8 pb-6 border-b border-black/5">
                {/* Progress Indicator - Minimal */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${currentStep >= 1 ? 'bg-black' : 'bg-black/10'}`} />
                  <div className={`h-[2px] flex-1 transition-all duration-500 ${currentStep >= 2 ? 'bg-black' : 'bg-black/10'}`} />
                </div>
                
                <motion.div key={currentStep} {...fadeInUp} transition={{ duration: 0.3 }}>
                  <p className="font-sans text-[11px] uppercase tracking-[2px] text-lbta-orange mb-2">
                    {currentStep === 1 ? 'Select Options' : 'Your Details'}
                  </p>
                  <h2 className="font-serif text-[24px] md:text-[28px] font-semibold text-black leading-tight">
                    {program.program}
                  </h2>
                  <p className="font-sans text-[14px] text-black/50 mt-2">
                    Ages {program.ages} · {program.location} · {program.duration}
                  </p>
                </motion.div>
              </div>
              
              {/* ========== CONTENT ========== */}
              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* STEP 1: PROGRAM OPTIONS */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Day Selection */}
                      {availableDays.length > 1 && (
                        <div>
                          <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-3">
                            Preferred Days
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {availableDays.map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`px-5 py-2.5 font-sans text-[13px] font-medium transition-all duration-300 ${
                                  selectedDays.includes(day)
                                    ? 'bg-black text-white'
                                    : 'bg-lbta-cream text-black/70 hover:bg-black/5'
                                }`}
                                style={{ borderRadius: '2px' }}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Frequency Selection */}
                      <div>
                        <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-3">
                          Select Plan
                        </label>
                        <div className="space-y-2">
                          {pricingOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleFrequencyChange(option.value, option.price)}
                              className={`w-full flex items-center justify-between px-5 py-4 font-sans text-[14px] transition-all duration-300 border ${
                                selectedFrequency === option.value
                                  ? 'border-black bg-black text-white'
                                  : 'border-black/10 bg-white text-black hover:border-black/30'
                              }`}
                              style={{ borderRadius: '2px' }}
                            >
                              <span className="font-medium">{option.label}</span>
                              <span className={`font-serif text-[18px] ${selectedFrequency === option.value ? 'text-white' : 'text-lbta-orange'}`}>
                                ${option.price}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Price Summary */}
                      {calculatedPrice > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center justify-between py-5 border-t border-black/10"
                        >
                          <span className="font-sans text-[13px] text-black/50 uppercase tracking-wide">
                            Monthly Investment
                          </span>
                          <span className="font-serif text-[32px] font-semibold text-black">
                            ${calculatedPrice}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* STEP 2: CONTACT INFORMATION */}
                  {currentStep === 2 && (
                    <motion.form
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                            className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                            style={{ borderRadius: '2px' }}
                            placeholder="Andrew"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                            className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                            style={{ borderRadius: '2px' }}
                            placeholder="Smith"
                          />
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                          style={{ borderRadius: '2px' }}
                          placeholder="andrew@example.com"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                          style={{ borderRadius: '2px' }}
                          placeholder="(949) 555-1234"
                        />
                      </div>
                      
                      {/* Student Info (if Junior/Youth) */}
                      {requiresStudentInfo && (
                        <div className="pt-4 border-t border-black/5">
                          <p className="font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-4">
                            Player Information
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input
                                type="text"
                                value={formData.studentName}
                                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                required={requiresStudentInfo}
                                className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                                style={{ borderRadius: '2px' }}
                                placeholder="Player's Name"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={formData.studentAge}
                                onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                                required={requiresStudentInfo}
                                min="3"
                                max="18"
                                className="w-full px-4 py-3.5 bg-lbta-cream text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange/30 transition-all"
                                style={{ borderRadius: '2px' }}
                                placeholder="Age"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Experience Level */}
                      <div>
                        <label className="block font-sans text-[12px] uppercase tracking-[1.5px] text-black/40 mb-3">
                          Experience Level
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                            <button
                              key={level}
                              type="button"
                              onClick={() => setFormData({ ...formData, experience: level })}
                              className={`px-5 py-2.5 font-sans text-[13px] font-medium transition-all duration-300 ${
                                formData.experience === level
                                  ? 'bg-black text-white'
                                  : 'bg-lbta-cream text-black/70 hover:bg-black/5'
                              }`}
                              style={{ borderRadius: '2px' }}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                      
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
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
              
              {/* ========== FOOTER ========== */}
              <div className="px-8 py-6 bg-lbta-cream/50 border-t border-black/5">
                <div className="flex gap-3">
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1)
                        setError(null)
                      }}
                      className="flex-1 py-4 font-sans font-medium text-[14px] text-black/60 hover:text-black transition-colors duration-300"
                    >
                      ← Back
                    </button>
                  )}
                  
                  <button
                    type={currentStep === 2 ? 'submit' : 'button'}
                    onClick={currentStep === 1 ? () => {
                      if (!selectedFrequency) {
                        setError('Please select a plan.')
                        return
                      }
                      if (availableDays.length > 1 && selectedDays.length === 0) {
                        setError('Please select at least one day.')
                        return
                      }
                      setError(null)
                      setCurrentStep(2)
                    } : handleSubmit}
                    disabled={isSubmitting}
                    className={`flex-1 py-4 font-sans font-medium text-[14px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
                      currentStep === 1 && !selectedFrequency
                        ? 'bg-black/20 text-black/40 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-lbta-orange'
                    }`}
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
                    ) : currentStep === 1 ? (
                      'Continue →'
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                </div>
                
                {/* Trust Indicator */}
                <p className="font-sans text-[11px] text-black/40 text-center mt-4">
                  Secure registration · Questions? <a href="tel:+19494646645" className="text-lbta-orange hover:underline">(949) 464-6645</a>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

