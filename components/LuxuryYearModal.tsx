'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { campModalDropInLabel, campModalSessionLabel } from '@/lib/camp-pricing-display'
import { getCampDropInDateBounds } from '@/lib/camp-date-bounds'
import type { CampRegistrationData } from '@/lib/camp-modal-data'
import type { CampWeek } from '@/lib/camps-data'

// ============================================================
// LUXURY YEAR-ROUND REGISTRATION MODAL
// For Camps, UTR Match Play Series, and Seasonal Programs
// Aman / Four Seasons / Apple-level design standards
// Refined neutrals, typography-driven, minimal color
// ============================================================

type CampData = CampRegistrationData

interface UTRCircuitData {
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
  type: 'camp' | 'utr-circuit' | 'jtt' | 'seasonal' | 'inquiry'
  data: CampRegistrationData | UTRCircuitData | null
  season?: string
  /** When opening from a UTR division card, pre-select that division (full season). */
  utrInitialDivision?: string | null
}

const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35,
}

export default function LuxuryYearModal({
  isOpen,
  onClose,
  type,
  data,
  season,
  utrInitialDivision,
}: LuxuryYearModalProps) {
  const [step, setStep] = useState(1)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const successPrimaryRef = useRef<HTMLButtonElement>(null)

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

  /** Week chosen in modal (when card opened without a week) */
  const [selectedWeekInModal, setSelectedWeekInModal] = useState<CampWeek | null>(null)
  /** ISO date (yyyy-mm-dd) for half-day drop-in */
  const [dropInDate, setDropInDate] = useState('')

  // Focus primary button when success state is shown (a11y)
  useEffect(() => {
    if (isSuccess && isOpen) {
      successPrimaryRef.current?.focus()
    }
  }, [isSuccess, isOpen])

  // Reset on modal open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setSelectedOption(null)
      setSelectedPrice(null)
      setIsSuccess(false)
      setErrorMessage(null)
      setDropInDate('')
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
      if (type === 'camp' && data) {
        const c = data as CampData
        setSelectedWeekInModal(c.selectedWeek ?? null)
      } else {
        setSelectedWeekInModal(null)
      }
      if (type === 'utr-circuit' && data && utrInitialDivision) {
        const u = data as UTRCircuitData
        const match = u.divisions.find((x) => x.age === utrInitialDivision)
        if (match) {
          setSelectedOption(match.age)
          setSelectedPrice(match.price)
        }
      }
    }
  }, [isOpen, type, data, utrInitialDivision])

  useEffect(() => {
    if (!errorMessage) return
    const timer = setTimeout(() => setErrorMessage(null), 8000)
    return () => clearTimeout(timer)
  }, [errorMessage])

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
      const utrData = data as UTRCircuitData
      return {
        name: utrData.name,
        dates: utrData.dates,
        details: `${utrData.weeks} weeks · ${utrData.matchDay}`,
        description: `UTR Match Play Series — rated Saturday matchplay`
      }
    }
  }

  // Get pricing options (camp: uses selected week for session + bundle price when applicable)
  const getPricingOptions = () => {
    if (type === 'camp') {
      const campData = data as CampData
      const activeWeek = selectedWeekInModal ?? campData.selectedWeek ?? null
      if ((campData.weeks?.length ?? 0) > 0 && !activeWeek) {
        return []
      }
      const sessionPrice = activeWeek ? activeWeek.price : campData.price
      const dropIn = campData.dropInRate ?? campData.perDay
      const halfPrice = activeWeek?.halfDay ?? campData.halfDay
      const options: { label: string; value: string; price: number }[] = []
      if (sessionPrice) {
        options.push({
          label: campModalSessionLabel(campData.id),
          value: 'full',
          price: sessionPrice,
        })
      }
      if (dropIn != null) {
        options.push({
          label: campModalDropInLabel(campData.id),
          value: 'day',
          price: dropIn,
        })
      }
      if (halfPrice) {
        options.push({ label: 'Half Day (week bundle)', value: 'half', price: halfPrice })
      }
      return options
    } else {
      const utrData = data as UTRCircuitData
      return utrData.divisions.map(div => ({
        label: div.age,
        value: div.age,
        price: div.price
      }))
    }
  }

  const programInfo = getProgramInfo()
  const pricingOptions = getPricingOptions()

  const campActiveWeek =
    type === 'camp' ? (selectedWeekInModal ?? (data as CampData).selectedWeek ?? null) : null
  const dropInBounds =
    type === 'camp' && data ? getCampDropInDateBounds((data as CampData).id, campActiveWeek) : null
  const needsDropInDay =
    type === 'camp' &&
    selectedOption === 'day' &&
    dropInBounds != null

  const canContinueStep1 =
    type !== 'camp' ||
    (() => {
      const c = data as CampData
      const w = selectedWeekInModal ?? c.selectedWeek ?? null
      if ((c.weeks?.length ?? 0) > 0 && !w) return false
      if (!selectedOption || selectedPrice == null) return false
      if (selectedOption === 'day' && dropInBounds && !dropInDate) return false
      return true
    })()

  const step2SelectionSummary = (): string => {
    if (type !== 'camp') {
      return `${programInfo.dates} · ${selectedOption ?? ''}`
    }
    const c = data as CampData
    const w = selectedWeekInModal ?? c.selectedWeek ?? null
    const weekLine = w ? `${w.label} · ${w.dates}` : programInfo.dates
    let opt = ''
    if (selectedOption === 'full') opt = 'Full session'
    else if (selectedOption === 'day') {
      opt = `Half-day drop-in${dropInDate ? ` · ${dropInDate}` : ''}`
    } else if (selectedOption === 'half') opt = 'Half day (week bundle)'
    else opt = selectedOption ?? ''
    return [weekLine, opt].filter(Boolean).join(' · ')
  }

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
        const w = selectedWeekInModal ?? campData.selectedWeek ?? null
        payload.campName = campData.name
        payload.campDates = campData.dates
        payload.campId = campData.id
        payload.location = campData.location
        payload.campWeek = w ? `${w.label}: ${w.dates}` : ''
        payload.campPricingOption = selectedOption ?? ''
        payload.dropInDate = dropInDate || ''
        const extra = [
          w ? `Week: ${w.label} (${w.dates})` : '',
          selectedOption ? `Pricing: ${selectedOption}` : '',
          dropInDate ? `Drop-in day: ${dropInDate}` : '',
        ]
          .filter(Boolean)
          .join(' · ')
        payload.notes = [formData.notes, extra].filter(Boolean).join(' | ')
      }

      if (type === 'utr-circuit' || type === 'jtt') {
        const utrData = data as UTRCircuitData
        payload.registrationType = 'utr-circuit'
        payload.division = selectedOption  // The division they selected
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('📤 Submitting registration:', payload)
      }

      const response = await fetch('/api/register-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (process.env.NODE_ENV === 'development') {
        console.log('📥 Registration response:', result)
      }

      if (response.ok && result.success) {
        setIsSuccess(true)
      } else {
        console.error('Registration failed:', result)
        setErrorMessage((result as { error?: string; message?: string }).error ?? (result as { message?: string }).message ?? 'Registration failed. Please try again or call (949) 534-0457.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage('Registration failed. Please try again or call (949) 534-0457.')
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
              <div className={`flex-1 transition-colors duration-300 ${step >= 1 ? 'bg-black' : 'bg-lbta-stone'}`} />
              <div className={`flex-1 transition-colors duration-300 ${step >= 2 ? 'bg-black' : 'bg-lbta-stone'}`} />
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 min-w-[48px] min-h-[48px] w-10 h-10 rounded-full bg-brand-sandstone hover:bg-lbta-stone flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-lbta-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                    <svg className="w-8 h-8 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 id="modal-title" className="font-headline text-[28px] font-medium text-brand-pacific-dusk mb-3">
                    Registration Received
                  </h2>
                  <p className="font-sans text-[15px] text-lbta-slate leading-relaxed mb-8 max-w-[320px] mx-auto">
                    Thank you for registering for {programInfo.name}. We&apos;ll confirm your spot within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      ref={successPrimaryRef}
                      onClick={() => { window.location.href = `/thank-you?type=year&program=${encodeURIComponent(programInfo.name)}` }}
                      className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-8 py-3 rounded-[2px] transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
                    >
                      View next steps
                    </button>
                    <button
                      onClick={onClose}
                      className="min-h-[48px] inline-flex items-center justify-center px-4 py-3 font-sans text-[14px] font-medium text-brand-pacific-dusk underline underline-offset-4 hover:text-lbta-slate transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                // Step 1: Option Selection
                <div className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                    {type === 'camp' ? 'Camp Registration' : 'UTR Match Play Series Registration'}
                  </p>
                  <h2 id="modal-title" className="font-headline text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em] pr-10">
                    {programInfo.name}
                  </h2>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-2">
                    {programInfo.dates}
                  </p>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-8">
                    {programInfo.details}
                  </p>

                  {type === 'camp' && (data as CampData).weeks && (data as CampData).weeks!.length > 0 && !campActiveWeek ? (
                    <div className="mb-8">
                      <p className="font-sans text-[12px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.12em] mb-3">
                        Select camp week
                      </p>
                      <div className="space-y-2">
                        {(data as CampData).weeks!.map((w) => (
                          <button
                            key={w.week}
                            type="button"
                            onClick={() => {
                              setSelectedWeekInModal(w)
                              setSelectedOption(null)
                              setSelectedPrice(null)
                              setDropInDate('')
                            }}
                            className={`w-full p-4 rounded-[2px] text-left border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                              selectedWeekInModal?.week === w.week
                                ? 'border-black bg-black text-white'
                                : 'border-black/10 bg-brand-sandstone hover:bg-lbta-stone text-brand-pacific-dusk'
                            }`}
                          >
                            <span className="font-sans text-[14px] font-medium">
                              {w.label}: {w.dates}
                            </span>
                            <span className="block font-headline text-[18px] font-medium mt-1 tabular-nums">
                              ${w.price}
                              {w.halfDay != null ? (
                                <span className="font-sans text-[12px] font-normal opacity-80"> · half-day ${w.halfDay}</span>
                              ) : null}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {type === 'camp' && campActiveWeek ? (
                    <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-6">
                      <span className="font-semibold text-brand-pacific-dusk">Week:</span> {campActiveWeek.label} · {campActiveWeek.dates}
                    </p>
                  ) : null}

                  {/* Options */}
                  <div className="space-y-3 mb-8">
                    {pricingOptions.length === 0 && type === 'camp' ? (
                      <p className="font-sans text-[14px] text-brand-pacific-dusk/60">
                        {(data as CampData).weeks?.length ? 'Select a week above to see pricing.' : 'No pricing options available.'}
                      </p>
                    ) : (
                      pricingOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedOption(option.value)
                            setSelectedPrice(option.price)
                            if (option.value !== 'day') setDropInDate('')
                          }}
                          className={`w-full p-5 rounded-[2px] text-left transition-all duration-200 ${
                            selectedOption === option.value
                              ? 'bg-black text-white'
                              : 'bg-brand-sandstone hover:bg-lbta-stone text-brand-pacific-dusk'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-3">
                            <span className="font-sans text-[15px] font-medium">
                              {option.label}
                            </span>
                            <span className={`font-headline text-[22px] font-medium shrink-0 tabular-nums ${
                              selectedOption === option.value ? 'text-white' : 'text-brand-pacific-dusk'
                            }`}>
                              ${option.price}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Selected Price Display */}
                  {selectedPrice != null && (
                    <div className="flex justify-between items-center py-4 border-t border-lbta-stone mb-4">
                      <span className="font-sans text-[13px] text-brand-pacific-dusk/60 uppercase tracking-[0.05em]">
                        Total
                      </span>
                      <span className="font-headline text-[28px] font-medium text-brand-pacific-dusk tabular-nums">
                        ${selectedPrice}
                      </span>
                    </div>
                  )}

                  {needsDropInDay && dropInBounds ? (
                    <div className="mb-8">
                      <label htmlFor="camp-drop-in-date" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                        Drop-in day
                      </label>
                      <input
                        id="camp-drop-in-date"
                        type="date"
                        min={dropInBounds.min}
                        max={dropInBounds.max}
                        value={dropInDate}
                        onChange={(e) => setDropInDate(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                      />
                      <p className="font-sans text-[12px] text-brand-pacific-dusk/50 mt-2">
                        Choose the calendar day for your half-day drop-in ({dropInBounds.min}–{dropInBounds.max}).
                      </p>
                    </div>
                  ) : null}

                  {/* Continue Button */}
                  <button
                    type="button"
                    onClick={() => canContinueStep1 && setStep(2)}
                    disabled={!canContinueStep1}
                    className={`w-full py-4 rounded-[2px] min-h-[48px] font-sans text-[14px] font-medium tracking-[0.02em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                      canContinueStep1
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-lbta-stone text-brand-pacific-dusk/50 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-brand-pacific-dusk/50 text-center mt-6">
                    Secure registration · Questions? <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="text-lbta-slate hover:text-brand-pacific-dusk transition-colors">(949) 534-0457</a>
                  </p>
                </div>
              ) : (
                // Step 2: Contact Information
                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                    Your Details
                  </p>
                  <h2 className="font-headline text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em] pr-10">
                    {programInfo.name}
                  </h2>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-8">
                    {step2SelectionSummary()}
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
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
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
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
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
                        className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
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
                        className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    {/* Player Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="modal-playerName" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          Player Name
                        </label>
                        <input
                          id="modal-playerName"
                          type="text"
                          value={formData.playerName}
                          onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                          placeholder="Player's name"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-playerAge" className="block font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.1em] mb-2">
                          Age
                        </label>
                        <input
                          id="modal-playerAge"
                          type="number"
                          value={formData.playerAge}
                          onChange={(e) => setFormData({...formData, playerAge: e.target.value})}
                          className="w-full px-4 py-3.5 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
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
                                ? 'bg-black text-white'
                                : 'bg-brand-sandstone text-lbta-slate hover:bg-lbta-stone'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {errorMessage && (
                    <div className="bg-lbta-red/5 border border-lbta-red/20 rounded-[2px] p-4 mb-6">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-sans text-[14px] text-lbta-red">{errorMessage}</p>
                        <button
                          type="button"
                          onClick={() => setErrorMessage(null)}
                          className="text-lbta-red hover:opacity-80 transition-opacity flex-shrink-0"
                          aria-label="Dismiss error"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

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
                      className="flex-1 py-4 rounded-[2px] min-h-[48px] bg-black text-white font-sans text-[14px] font-medium tracking-[0.02em] hover:bg-gray-800 disabled:bg-lbta-stone transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                    </button>
                  </div>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-brand-pacific-dusk/50 text-center mt-6">
                    Secure registration · Questions? <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="text-lbta-slate hover:text-brand-pacific-dusk transition-colors">(949) 534-0457</a>
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
