'use client'

import { useState, useEffect } from 'react'
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
        alert('Error submitting. Please call (949) 464-6645')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error submitting. Please call (949) 464-6645')
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[90vh] p-8 md:p-10">
              {isSuccess ? (
                // Success Screen
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-serif text-[32px] font-medium text-[#1a1a1a] mb-3">Trial Lesson Requested!</h2>
                  <p className="font-sans text-[15px] text-[#666] leading-relaxed mb-8 max-w-[400px] mx-auto">
                    Thank you, <strong>{formData.firstName}</strong>! We'll contact you within 24 hours to schedule your free trial lesson.
                  </p>
                  <p className="font-sans text-[13px] text-[#888]">
                    Redirecting to confirmation page...
                  </p>
                </motion.div>
              ) : (
                // Form
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="mb-8">
                    <p className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2">
                      Free Trial Lesson
                    </p>
                    <h2 className="font-serif text-[28px] md:text-[32px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.02em]">
                      Experience LBTA
                    </h2>
                    <p className="font-sans text-[13px] text-[#888]">
                      One conversation. Honest guidance. A path built around you.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          placeholder="Last"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    {/* Program */}
                    <div>
                      <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                        Program Interest <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.program}
                        onChange={(e) => updateField('program', e.target.value)}
                        className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
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
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                          Player Age
                        </label>
                        <input
                          type="number"
                          value={formData.playerAge}
                          onChange={(e) => updateField('playerAge', e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          placeholder="Age"
                          min="3"
                          max="18"
                        />
                      </div>
                    )}

                    {/* Goals (Optional) */}
                    <div>
                      <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                        Tennis Goals <span className="text-[#999]">(Optional)</span>
                      </label>
                      <textarea
                        value={formData.goals}
                        onChange={(e) => updateField('goals', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[14px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 resize-none"
                        placeholder="Tell us what you'd like to achieve..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-sans text-[14px] font-medium tracking-[0.02em] mt-8 transition-all ${
                      isSubmitting
                        ? 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                        : 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Free Trial'}
                  </button>

                  {/* Trust Signals */}
                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-[#e8e8e8]">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-sans text-[11px] text-[#888]">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-sans text-[11px] text-[#888]">No Commitment</span>
                    </div>
                  </div>

                  {/* Contact Note */}
                  <p className="font-sans text-[11px] text-[#999] text-center mt-4">
                    Questions? <a href="tel:9494646645" className="text-[#666] hover:text-[#1a1a1a] transition-colors">(949) 464-6645</a>
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

