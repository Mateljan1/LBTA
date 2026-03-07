'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Program } from '@/components/ProgramCard'

// ============================================================
// LUXURY REGISTRATION MODAL
// Aman / Four Seasons / Apple-level design standards
// Refined neutrals, typography-driven, minimal color
// ============================================================

interface LuxuryRegistrationModalProps {
  program: Program | null
  onClose: () => void
}

// Spring animation config for luxury feel
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
}

export default function LuxuryRegistrationModal({ program, onClose }: LuxuryRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentName: '',
    studentAge: '',
    experience: 'beginner',
    notes: ''
  })

  // Reset on program change
  useEffect(() => {
    if (program) {
      setStep(1)
      setSelectedPlan(null)
      setIsSuccess(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        studentName: '',
        studentAge: '',
        experience: 'beginner',
        notes: ''
      })
    }
  }, [program])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (program) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [program])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    if (!program) return
    const modal = modalRef.current
    if (!modal) return
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [program])

  if (!program) return null

  // Build pricing options from program data - include drop-in
  const pricingOptions = Object.entries(program.pricing)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => {
      const labels: Record<string, string> = {
        monthly: 'Monthly',
        '1x': '1× weekly',
        '2x': '2× weekly',
        '3x': '3× weekly',
        '4x': '4× weekly',
        '5x': '5× weekly',
        'drop_in': 'Drop-in (single class)',
      }
      return { label: labels[key] || key, value: key, price: value as number }
    })
    .filter(Boolean)

  const selectedPrice = selectedPlan 
    ? pricingOptions.find(opt => opt.value === selectedPlan)?.price 
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: program.program,
          location: program.location,
          frequency: selectedPlan,
          totalPrice: selectedPrice,
          preferredDays: program.schedule.map(s => s.day)
        })
      })

      if (response.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {program && (
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
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={springTransition}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="flex h-1">
              <div className={`flex-1 transition-colors duration-300 ${step >= 1 ? 'bg-lbta-black' : 'bg-lbta-stone'}`} />
              <div className={`flex-1 transition-colors duration-300 ${step >= 2 ? 'bg-lbta-black' : 'bg-lbta-stone'}`} />
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-brand-sandstone hover:bg-lbta-stone flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-lbta-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-tide-pool/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 id="modal-title" className="font-serif text-[28px] font-medium text-brand-pacific-dusk mb-3">
                    Registration Received
                  </h2>
                  <p className="font-sans text-[15px] text-lbta-slate leading-relaxed mb-8 max-w-[320px] mx-auto">
                    Thank you for registering for {program.program}. We&apos;ll confirm your spot within 24 hours.
                  </p>
                  <button
                    onClick={onClose}
                    className="font-sans text-[14px] font-medium text-brand-pacific-dusk underline underline-offset-4 hover:text-lbta-slate transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : step === 1 ? (
                // Step 1: Plan Selection
                <div className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                    Select Plan
                  </p>
                  <h2 id="modal-title" className="font-serif text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em]">
                    {program.program}
                  </h2>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-8">
                    Ages {program.ages} · {program.location} · {program.duration}
                  </p>

                  {/* Plan Options */}
                  <div className="space-y-3 mb-8">
                    {pricingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedPlan(option.value)}
                        className={`w-full p-5 rounded-[2px] text-left transition-all duration-200 ${
                          selectedPlan === option.value
                            ? 'bg-lbta-black text-white'
                            : 'bg-brand-sandstone hover:bg-lbta-stone text-brand-pacific-dusk'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-[15px] font-medium">
                            {option.label}
                          </span>
                          <span className={`font-serif text-[22px] font-medium ${
                            selectedPlan === option.value ? 'text-white' : 'text-brand-pacific-dusk'
                          }`}>
                            ${option.price}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Selected Price Display */}
                  {selectedPrice && (
                    <div className="flex justify-between items-center py-4 border-t border-lbta-stone mb-8">
                      <span className="font-sans text-[13px] text-brand-pacific-dusk/60 uppercase tracking-[0.05em]">
                        {selectedPlan === 'drop_in' 
                          ? 'Single Class' 
                          : selectedPlan === 'monthly' 
                            ? 'Monthly Investment' 
                            : 'Quarterly Investment'}
                      </span>
                      <span className="font-serif text-[28px] font-medium text-brand-pacific-dusk">
                        ${selectedPrice}
                      </span>
                    </div>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={() => selectedPlan && setStep(2)}
                    disabled={!selectedPlan}
                    className={`w-full py-4 rounded-[2px] min-h-[48px] font-sans text-[14px] font-medium tracking-[0.02em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                      selectedPlan
                        ? 'bg-lbta-black text-white hover:bg-brand-pacific-dusk/80'
                        : 'bg-lbta-stone text-brand-pacific-dusk/50 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-brand-pacific-dusk/50 text-center mt-6">
                    Secure registration · Questions? <a href="tel:9495340457" className="text-lbta-slate hover:text-brand-pacific-dusk transition-colors">(949) 534-0457</a>
                  </p>
                </div>
              ) : (
                // Step 2: Contact Information
                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                    Your Details
                  </p>
                  <h2 className="font-serif text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em]">
                    {program.program}
                  </h2>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-8">
                    Ages {program.ages} · {program.location} · {program.duration}
                  </p>

                  {/* Form Fields */}
                  <div className="space-y-5 mb-8">
                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="modal-firstName" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          First Name
                        </label>
                        <input
                          id="modal-firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-lastName" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          Last Name
                        </label>
                        <input
                          id="modal-lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                          placeholder="Last"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="modal-email" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                        Email Address
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="modal-phone" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                        Phone Number
                      </label>
                      <input
                        id="modal-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="modal-studentName" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          Player Name
                        </label>
                        <input
                          id="modal-studentName"
                          type="text"
                          value={formData.studentName}
                          onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                          placeholder="Player's name"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-studentAge" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          Age
                        </label>
                        <input
                          id="modal-studentAge"
                          type="number"
                          value={formData.studentAge}
                          onChange={(e) => setFormData({...formData, studentAge: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-lbta-black/10 transition-all"
                          placeholder="Age"
                          min="3"
                          max="99"
                        />
                      </div>
                    </div>

                    {/* Experience Level */}
                    <fieldset>
                      <legend className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                        Experience Level
                      </legend>
                      <div className="flex gap-2">
                        {['beginner', 'intermediate', 'advanced'].map((level) => (
                          <button
                            key={level}
                            type="button"
                            aria-pressed={formData.experience === level}
                            onClick={() => setFormData({...formData, experience: level})}
                            className={`flex-1 py-3 min-h-[48px] rounded-lg font-sans text-[13px] font-medium capitalize transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30 ${
                              formData.experience === level
                                ? 'bg-lbta-black text-white'
                                : 'bg-brand-sandstone text-lbta-slate hover:bg-lbta-stone'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-[2px] min-h-[48px] font-sans text-[14px] font-medium text-lbta-slate hover:text-brand-pacific-dusk hover:bg-brand-sandstone transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-[2px] min-h-[48px] bg-lbta-black text-white font-sans text-[14px] font-medium tracking-[0.02em] hover:bg-brand-pacific-dusk/80 disabled:bg-lbta-stone transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                    </button>
                  </div>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-brand-pacific-dusk/50 text-center mt-6">
                    Secure registration · Questions? <a href="tel:9495340457" className="text-lbta-slate hover:text-brand-pacific-dusk transition-colors">(949) 534-0457</a>
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
