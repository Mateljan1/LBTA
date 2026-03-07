'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, CheckCircle } from 'lucide-react'

interface TrialBookingModalProps {
  isOpen: boolean
  onClose: () => void
  defaultProgram?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  program: string
  playerAge: string
  goals: string
}

const programs = [
  { value: "little-tennis-stars", label: "Little Tennis Stars", ages: "Ages 3-4" },
  { value: "red-ball", label: "Red Ball Tennis", ages: "Ages 5-7" },
  { value: "orange-ball", label: "Orange Ball Tennis", ages: "Ages 7-9" },
  { value: "green-dot", label: "Green Dot Tennis", ages: "Ages 9-11" },
  { value: "youth-development", label: "Youth Development", ages: "Ages 11-15" },
  { value: "high-performance", label: "High Performance", ages: "Ages 12-17" },
  { value: "adult-beginner", label: "Adult Beginner", ages: "NTRP 1.0-2.5" },
  { value: "adult-intermediate", label: "Adult Intermediate", ages: "NTRP 3.0-3.5" },
  { value: "adult-advanced", label: "Adult Advanced", ages: "NTRP 4.0+" },
  { value: "cardio-tennis", label: "Cardio Tennis", ages: "All Levels" },
  { value: "private-lessons", label: "Private Lessons", ages: "All Ages" },
  { value: "not-sure", label: "Not Sure - Help Me Choose", ages: "" },
]

export default function TrialBookingModal({ isOpen, onClose, defaultProgram }: TrialBookingModalProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: defaultProgram || '',
    playerAge: '',
    goals: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return
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
  }, [isOpen])

  // Set default program if provided
  useEffect(() => {
    if (defaultProgram && isOpen) {
      setFormData(prev => ({ ...prev, program: defaultProgram }))
    }
  }, [defaultProgram, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Fire Meta Pixel Lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Trial Lesson Request',
        value: 0.00,
        currency: 'USD',
      })
    }

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'trial-modal',
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          handleClose()
          window.location.href = '/thank-you'
        }, 2500)
      } else {
        alert('Error submitting. Please call (949) 534-0457')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting. Please call (949) 534-0457')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setIsSuccess(false)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      program: defaultProgram || '',
      playerAge: '',
      goals: '',
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-brand-sandstone hover:bg-lbta-stone flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-lbta-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[90vh] p-8 md:p-10">
              {isSuccess ? (
                // Success Screen
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-tide-pool/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-brand-tide-pool" />
                  </div>
                  <h2 className="font-serif text-[32px] font-medium text-brand-pacific-dusk mb-3">Trial Lesson Requested!</h2>
                  <p className="font-sans text-[15px] text-lbta-slate leading-relaxed mb-8 max-w-[400px] mx-auto">
                    Thank you, <strong>{formData.firstName}</strong>! We'll contact you within 24 hours to schedule your free trial lesson.
                  </p>
                  <p className="font-sans text-[13px] text-brand-pacific-dusk/60">
                    Redirecting to confirmation page...
                  </p>
                </motion.div>
              ) : (
                // Form
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="mb-8">
                    <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                      Free Trial Lesson
                    </p>
                    <h2 id="modal-title" className="font-serif text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em]">
                      Experience LBTA
                    </h2>
                    <p className="font-sans text-[13px] text-brand-pacific-dusk/60">
                      One conversation. Honest guidance. A path built around you.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="modal-firstName" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="modal-firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-lastName" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="modal-lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                          placeholder="Last"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="modal-email" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="modal-phone" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="modal-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    {/* Program */}
                    <div>
                      <label htmlFor="modal-program" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                        Program Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="modal-program"
                        required
                        value={formData.program}
                        onChange={(e) => updateField('program', e.target.value)}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                      >
                        <option value="">Select a program...</option>
                        {programs.map(p => (
                          <option key={p.value} value={p.value}>
                            {p.label} {p.ages && `— ${p.ages}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Player Age (if Junior/Youth program) */}
                    {formData.program && !formData.program.includes('adult') && formData.program !== 'not-sure' && (
                      <div>
                        <label htmlFor="modal-playerAge" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                          Player Age
                        </label>
                        <input
                          id="modal-playerAge"
                          type="number"
                          value={formData.playerAge}
                          onChange={(e) => updateField('playerAge', e.target.value)}
                          className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[15px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20"
                          placeholder="Age"
                          min="3"
                          max="18"
                        />
                      </div>
                    )}

                    {/* Goals (Optional) */}
                    <div>
                      <label htmlFor="modal-goals" className="block font-sans text-[12px] font-semibold text-lbta-slate mb-2">
                        Tennis Goals <span className="text-brand-pacific-dusk/50">(Optional)</span>
                      </label>
                      <textarea
                        id="modal-goals"
                        value={formData.goals}
                        onChange={(e) => updateField('goals', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-[14px] text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-lbta-black/20 resize-none"
                        placeholder="Tell us what you'd like to achieve..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-[2px] min-h-[48px] font-sans text-[14px] font-medium tracking-[0.02em] mt-8 transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                      isSubmitting
                        ? 'bg-lbta-stone text-brand-pacific-dusk/50 cursor-not-allowed'
                        : 'bg-lbta-black text-white hover:bg-brand-pacific-dusk/80'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Free Trial'}
                  </button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-lbta-stone">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-tide-pool" />
                      <span className="font-sans text-[11px] text-brand-pacific-dusk/60">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-brand-tide-pool" />
                      <span className="font-sans text-[11px] text-brand-pacific-dusk/60">No Commitment</span>
                    </div>
                  </div>

                  {/* Contact Note */}
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/50 text-center mt-4">
                    Questions? <a href="tel:9495340457" className="text-lbta-slate hover:text-brand-pacific-dusk transition-colors">(949) 534-0457</a>
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

