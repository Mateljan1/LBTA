'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface JTTRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  // Essential Info Only
  division: string
  playerFirstName: string
  playerLastName: string
  playerDOB: string
  playerAge: string
  
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  
  shirtSize: string
  ustaRegistered: string
  ustaMemberNumber: string
  
  paymentPreference: string
  hasSibling: string
  siblingName: string
  
  emergencyName: string
  emergencyPhone: string
  
  liabilityConsent: boolean
}

const divisions = [
  { value: '10u-orange', label: '10U Orange', sublabel: 'Ages 7-10 · Alta Laguna Park', price: 2800 },
  { value: '10u-green', label: '10U Green', sublabel: 'Ages 9-10 · Alta Laguna Park', price: 2800 },
  { value: '12u', label: '12U', sublabel: 'Ages 11-12 · Laguna Beach HS', price: 2800 },
  { value: '14u', label: '14U', sublabel: 'Ages 13-14 · Laguna Beach HS', price: 2800 },
  { value: '16u', label: '16U', sublabel: 'Ages 15-16 · Laguna Beach HS', price: 2800 },
  { value: '18u', label: '18U', sublabel: 'Ages 17-18 · Laguna Beach HS', price: 2800 },
]

const shirtSizes = [
  { value: 'youth-s', label: 'Youth S' },
  { value: 'youth-m', label: 'Youth M' },
  { value: 'youth-l', label: 'Youth L' },
  { value: 'youth-xl', label: 'Youth XL' },
  { value: 'adult-s', label: 'Adult S' },
  { value: 'adult-m', label: 'Adult M' },
  { value: 'adult-l', label: 'Adult L' },
  { value: 'adult-xl', label: 'Adult XL' },
]

export default function JTTRegistrationModalStreamlined({ isOpen, onClose }: JTTRegistrationModalProps) {
  const [formData, setFormData] = useState<FormData>({
    division: '',
    playerFirstName: '',
    playerLastName: '',
    playerDOB: '',
    playerAge: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    shirtSize: '',
    ustaRegistered: '',
    ustaMemberNumber: '',
    paymentPreference: 'full',
    hasSibling: 'no',
    siblingName: '',
    emergencyName: '',
    emergencyPhone: '',
    liabilityConsent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)

  // Auto-calculate age from DOB
  useEffect(() => {
    if (formData.playerDOB) {
      const birthDate = new Date(formData.playerDOB)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      setFormData(prev => ({ ...prev, playerAge: age.toString() }))
    }
  }, [formData.playerDOB])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/jtt-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('There was an error. Please call (949) 464-6645.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setIsSuccess(false)
    setCurrentSection(0)
    onClose()
  }

  // Form sections for progressive disclosure
  const sections = [
    { title: 'Division & Player', fields: ['division', 'playerFirstName', 'playerLastName', 'playerDOB', 'shirtSize'] },
    { title: 'Parent Contact', fields: ['parentFirstName', 'parentLastName', 'parentEmail', 'parentPhone'] },
    { title: 'Final Details', fields: ['ustaRegistered', 'paymentPreference', 'emergencyName', 'emergencyPhone', 'liabilityConsent'] },
  ]

  const canProceed = (section: number) => {
    const requiredFields = sections[section].fields
    return requiredFields.every(field => {
      const value = formData[field as keyof FormData]
      if (field === 'liabilityConsent') return value === true
      return value && value !== ''
    })
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
            className="relative w-full max-w-[580px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
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

            {/* Progress Dots */}
            {!isSuccess && (
              <div className="flex justify-center gap-2 pt-6 pb-4">
                {sections.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentSection ? 'w-6 bg-[#1a1a1a]' : idx < currentSection ? 'bg-[#1a1a1a]' : 'bg-[#e8e8e8]'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-60px)] px-8 md:px-10 pb-8">
              {isSuccess ? (
                // Success Screen
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="font-serif text-[32px] font-medium text-[#1a1a1a] mb-3">Registration Received!</h2>
                  <p className="font-sans text-[15px] text-[#666] leading-relaxed mb-8 max-w-[400px] mx-auto">
                    Thank you for registering <strong>{formData.playerFirstName}</strong> for JTT Spring 2026. We'll contact you within 24 hours with payment details.
                  </p>
                  <button
                    onClick={handleClose}
                    className="font-sans text-[14px] font-medium text-[#1a1a1a] underline underline-offset-4 hover:text-[#666] transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                // Form
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="mb-8">
                    <p className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2">
                      JTT Registration
                    </p>
                    <h2 className="font-serif text-[28px] md:text-[32px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.02em]">
                      Spring 2026 Junior Team Tennis
                    </h2>
                    <p className="font-sans text-[13px] text-[#888]">
                      January 12 – April 26 · 15 weeks · $2,800
                    </p>
                  </div>

                  {/* Section 1: Division & Player */}
                  {currentSection === 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      {/* Division Selection */}
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-3">
                          Select Division <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {divisions.map((div) => (
                            <button
                              key={div.value}
                              type="button"
                              onClick={() => updateField('division', div.value)}
                              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                                formData.division === div.value
                                  ? 'bg-[#1a1a1a] text-white ring-2 ring-[#1a1a1a]'
                                  : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] text-[#1a1a1a]'
                              }`}
                            >
                              <div className="font-serif text-[18px] font-medium mb-1">{div.label}</div>
                              <div className={`font-sans text-[11px] ${formData.division === div.value ? 'text-white/70' : 'text-[#888]'}`}>
                                {div.sublabel.split('·')[0]}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Player Name */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Player First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.playerFirstName}
                            onChange={(e) => updateField('playerFirstName', e.target.value)}
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
                            value={formData.playerLastName}
                            onChange={(e) => updateField('playerLastName', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                            placeholder="Last"
                          />
                        </div>
                      </div>

                      {/* DOB & Shirt Size */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Date of Birth <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={formData.playerDOB}
                            onChange={(e) => updateField('playerDOB', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          />
                          {formData.playerAge && (
                            <p className="font-sans text-[11px] text-[#888] mt-1">Age: {formData.playerAge}</p>
                          )}
                        </div>
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Shirt Size <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            value={formData.shirtSize}
                            onChange={(e) => updateField('shirtSize', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          >
                            <option value="">Select</option>
                            {shirtSizes.map((size) => (
                              <option key={size.value} value={size.value}>{size.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Section 2: Parent Contact */}
                  {currentSection === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Parent First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.parentFirstName}
                            onChange={(e) => updateField('parentFirstName', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.parentLastName}
                            onChange={(e) => updateField('parentLastName', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.parentEmail}
                          onChange={(e) => updateField('parentEmail', e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.parentPhone}
                          onChange={(e) => updateField('parentPhone', e.target.value)}
                          className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          placeholder="(949) 555-0123"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Section 3: Final Details */}
                  {currentSection === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      {/* USTA */}
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-3">
                          USTA Registered? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => updateField('ustaRegistered', 'yes')}
                            className={`flex-1 py-3 rounded-lg font-sans text-[14px] font-medium transition-all ${
                              formData.ustaRegistered === 'yes'
                                ? 'bg-[#1a1a1a] text-white'
                                : 'bg-[#f8f8f8] text-[#666] hover:bg-[#f0f0f0]'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('ustaRegistered', 'no')}
                            className={`flex-1 py-3 rounded-lg font-sans text-[14px] font-medium transition-all ${
                              formData.ustaRegistered === 'no'
                                ? 'bg-[#1a1a1a] text-white'
                                : 'bg-[#f8f8f8] text-[#666] hover:bg-[#f0f0f0]'
                            }`}
                          >
                            No
                          </button>
                        </div>
                        {formData.ustaRegistered === 'yes' && (
                          <input
                            type="text"
                            value={formData.ustaMemberNumber}
                            onChange={(e) => updateField('ustaMemberNumber', e.target.value)}
                            placeholder="USTA Member Number (optional)"
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[14px] text-[#1a1a1a] mt-3 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                          />
                        )}
                      </div>

                      {/* Payment */}
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-[#666] mb-3">
                          Payment Preference <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            { value: 'full', label: 'Pay in Full — Save $50', sublabel: '$2,750 total' },
                            { value: 'two', label: 'Two Installments', sublabel: '$1,400 × 2' },
                            { value: 'four', label: 'Four Monthly', sublabel: '$700 × 4' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => updateField('paymentPreference', option.value)}
                              className={`w-full p-4 rounded-lg text-left transition-all ${
                                formData.paymentPreference === option.value
                                  ? 'bg-[#1a1a1a] text-white'
                                  : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] text-[#1a1a1a]'
                              }`}
                            >
                              <div className="font-sans text-[14px] font-medium mb-1">{option.label}</div>
                              <div className={`font-sans text-[12px] ${formData.paymentPreference === option.value ? 'text-white/70' : 'text-[#888]'}`}>
                                {option.sublabel}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Emergency Contact <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.emergencyName}
                            onChange={(e) => updateField('emergencyName', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[12px] font-semibold text-[#666] mb-2">
                            Phone <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.emergencyPhone}
                            onChange={(e) => updateField('emergencyPhone', e.target.value)}
                            className="w-full px-4 py-3 bg-[#f8f8f8] border-0 rounded-lg font-sans text-[15px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
                            placeholder="Phone"
                          />
                        </div>
                      </div>

                      {/* Sibling Discount */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.hasSibling === 'yes'}
                            onChange={(e) => {
                              updateField('hasSibling', e.target.checked ? 'yes' : 'no')
                              if (!e.target.checked) updateField('siblingName', '')
                            }}
                            className="mt-0.5 w-5 h-5 text-green-600 rounded focus:ring-green-500"
                          />
                          <div>
                            <span className="font-sans text-[13px] font-semibold text-green-900">
                              Enrolling another child? Save 15%
                            </span>
                            {formData.hasSibling === 'yes' && (
                              <input
                                type="text"
                                value={formData.siblingName}
                                onChange={(e) => updateField('siblingName', e.target.value)}
                                placeholder="Sibling's name"
                                className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg font-sans text-[14px] text-[#1a1a1a] mt-2 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                              />
                            )}
                          </div>
                        </label>
                      </div>

                      {/* Liability Consent */}
                      <div className="bg-[#FAF8F3] border border-[#e8e8e8] rounded-lg p-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            required
                            checked={formData.liabilityConsent}
                            onChange={(e) => updateField('liabilityConsent', e.target.checked)}
                            className="mt-0.5 w-5 h-5 text-[#1a1a1a] rounded focus:ring-[#1a1a1a]/20"
                          />
                          <span className="font-sans text-[12px] text-[#666] leading-relaxed">
                            <span className="text-red-500 font-semibold">*</span> I agree to hold harmless LBTA and the City of Laguna Beach from injuries during practices or matches.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-[#e8e8e8]">
                    {currentSection > 0 && (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(prev => prev - 1)}
                        className="px-6 py-4 rounded-xl font-sans text-[14px] font-medium text-[#666] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-all"
                      >
                        ← Back
                      </button>
                    )}
                    
                    {currentSection < 2 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentSection(prev => prev + 1)}
                        disabled={!canProceed(currentSection)}
                        className={`flex-1 py-4 rounded-xl font-sans text-[14px] font-medium tracking-[0.02em] transition-all ${
                          canProceed(currentSection)
                            ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                            : 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                        }`}
                      >
                        Continue →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting || !canProceed(currentSection)}
                        className={`flex-1 py-4 rounded-xl font-sans text-[14px] font-medium tracking-[0.02em] transition-all ${
                          canProceed(currentSection) && !isSubmitting
                            ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                            : 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                        }`}
                      >
                        {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                      </button>
                    )}
                  </div>

                  {/* Trust Note */}
                  <p className="font-sans text-[11px] text-[#999] text-center mt-4">
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

