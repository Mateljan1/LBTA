'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Shield } from 'lucide-react'
import year2026Data from '@/data/year2026.json'

interface PrivateCoach {
  coach: string
  title: string
  rate60: number
  rate90: number
  pack10: number
  pack20: number
  availability: string
}

const year2026 = year2026Data as { privateCoaching?: PrivateCoach[] }
const COACHES: PrivateCoach[] = year2026.privateCoaching ?? []

type OptionKey = '60' | '90' | '10-pack' | '20-pack'

interface FormData {
  coach: string
  option: OptionKey | ''
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

interface PrivateLessonModalProps {
  isOpen: boolean
  onClose: () => void
  /** Pre-select this coach when modal opens (e.g. from /book?type=private&coach=andrew-mateljan). */
  defaultCoach?: string
}

export default function PrivateLessonModal({ isOpen, onClose, defaultCoach }: PrivateLessonModalProps) {
  const [formData, setFormData] = useState<FormData>({
    coach: '',
    option: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  } as FormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const successRedirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!errorMessage) return
    const t = setTimeout(() => setErrorMessage(null), 8000)
    return () => clearTimeout(t)
  }, [errorMessage])

  useEffect(() => {
    return () => {
      if (successRedirectTimeoutRef.current) {
        clearTimeout(successRedirectTimeoutRef.current)
        successRedirectTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Pre-select coach when opened with defaultCoach (e.g. from coach bio or schedules).
  useEffect(() => {
    if (isOpen && defaultCoach) {
      setFormData((prev) => ({ ...prev, coach: defaultCoach }))
    }
  }, [isOpen, defaultCoach])

  const handleClose = useCallback(() => {
    if (successRedirectTimeoutRef.current) {
      clearTimeout(successRedirectTimeoutRef.current)
      successRedirectTimeoutRef.current = null
    }
    previousFocusRef.current?.focus()
    previousFocusRef.current = null
    setIsSuccess(false)
    setErrorMessage(null)
    setFormData({
      coach: '',
      option: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    })
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (isOpen) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  useEffect(() => {
    if (isOpen) previousFocusRef.current = document.activeElement as HTMLElement | null
    else { previousFocusRef.current?.focus(); previousFocusRef.current = null }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !modalRef.current) return
    const modal = modalRef.current
    const focusable = modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus() } }
    }
    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [isOpen])

  // When switching to success view, move focus to first focusable (close button) so it does not land on body
  useEffect(() => {
    if (isSuccess && isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      focusable[0]?.focus()
    }
  }, [isSuccess, isOpen])

  const selectedCoach = COACHES.find((c) => c.coach === formData.coach)
  const optionLabel = (key: OptionKey) => {
    if (!selectedCoach) return ''
    switch (key) {
      case '60': return `60 min — $${selectedCoach.rate60}`
      case '90': return `90 min — $${selectedCoach.rate90}`
      case '10-pack': return `10-Pack — $${selectedCoach.pack10.toLocaleString()}`
      case '20-pack': return `20-Pack — $${selectedCoach.pack20.toLocaleString()}`
      default: return ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.coach || !formData.option) {
      setErrorMessage('Please select a coach and session type.')
      return
    }
    setIsSubmitting(true)
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (a: string, b: string, c: object) => void }).fbq) {
      (window as unknown as { fbq: (a: string, b: string, c: object) => void }).fbq('track', 'Lead', { content_name: 'Private Lesson Request', value: 0, currency: 'USD' })
    }
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType: 'private',
          coach: formData.coach,
          option: formData.option as OptionKey,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message || undefined,
        }),
      })
      const data = await res.json().catch(() => ({})) as { success?: boolean; error?: string }
      if (res.ok && data.success) {
        setErrorMessage(null)
        setIsSuccess(true)
        if (successRedirectTimeoutRef.current) clearTimeout(successRedirectTimeoutRef.current)
        successRedirectTimeoutRef.current = setTimeout(() => {
          successRedirectTimeoutRef.current = null
          handleClose()
          window.location.href = '/thank-you?type=private'
        }, 2500)
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please call (949) 534-0457.')
      }
    } catch {
      setErrorMessage('Something went wrong. Please call (949) 534-0457.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const update = (field: keyof FormData, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="private-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 min-w-[48px] min-h-[48px] w-10 h-10 rounded-full bg-brand-sandstone hover:bg-black/5 flex items-center justify-center z-10 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-brand-pacific-dusk/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="overflow-y-auto max-h-[90vh] p-8 md:p-10">
              {isSuccess ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-tide-pool/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-brand-tide-pool" aria-hidden="true" />
                  </div>
                  <h2 id="private-modal-title" className="font-headline text-[32px] font-medium text-brand-pacific-dusk mb-3">
                    Request Received
                  </h2>
                  <p className="font-sans text-[15px] text-brand-pacific-dusk/80 leading-relaxed mb-8 max-w-[400px] mx-auto">
                    Thanks, <strong>{formData.firstName}</strong>. We received your request and will reach out within 24 hours to get you booked in.
                  </p>
                  <p className="font-sans text-[13px] text-brand-pacific-dusk/60">Redirecting to confirmation...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/50 uppercase tracking-[0.15em] mb-2">
                      Private Lesson
                    </p>
                    <h2 id="private-modal-title" className="font-headline text-[28px] md:text-[32px] font-medium text-brand-pacific-dusk mb-1 tracking-[-0.02em]">
                      Book a Private Lesson
                    </h2>
                    <p className="font-sans text-[13px] text-brand-pacific-dusk/60">
                      Choose your coach and session type. We&apos;ll contact you within 24 hours to schedule.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label htmlFor="private-coach" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                        Coach <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="private-coach"
                        required
                        value={formData.coach}
                        onChange={(e) => { update('coach', e.target.value); update('option', '') }}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20"
                      >
                        <option value="">Select a coach...</option>
                        {COACHES.map((c) => (
                          <option key={c.coach} value={c.coach}>
                            {c.coach} — {c.title} ({c.availability})
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCoach && (
                      <div>
                        <label className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                          Session type <span className="text-red-600">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['60', '90', '10-pack', '20-pack'] as const).map((opt) => (
                            <label
                              key={opt}
                              className={`flex items-center justify-center px-4 py-3 rounded-lg border font-sans text-[14px] cursor-pointer transition-colors ${
                                formData.option === opt
                                  ? 'border-black bg-brand-pacific-dusk text-white'
                                  : 'border-black/15 bg-brand-sandstone text-brand-pacific-dusk hover:border-black/25'
                              }`}
                            >
                              <input
                                type="radio"
                                name="option"
                                value={opt}
                                checked={formData.option === opt}
                                onChange={() => update('option', opt)}
                                className="sr-only"
                              />
                              {optionLabel(opt)}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="private-firstName" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                          First name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="private-firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => update('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20"
                          placeholder="First"
                        />
                      </div>
                      <div>
                        <label htmlFor="private-lastName" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                          Last name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="private-lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => update('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20"
                          placeholder="Last"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="private-email" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="private-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="private-phone" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                        Phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="private-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20"
                        placeholder="(949) 555-0123"
                      />
                    </div>

                    <div>
                      <label htmlFor="private-message" className="block font-sans text-[12px] font-semibold text-brand-pacific-dusk mb-2">
                        Message <span className="text-brand-pacific-dusk/50">(Optional)</span>
                      </label>
                      <textarea
                        id="private-message"
                        value={formData.message}
                        onChange={(e) => update('message', e.target.value)}
                        rows={2}
                        maxLength={500}
                        className="w-full px-4 py-3 bg-brand-sandstone border-0 rounded-lg font-sans text-base text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-black/20 resize-none"
                        placeholder="Preferred days, goals, or questions..."
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                      <p className="font-sans text-[14px] text-red-700">{errorMessage}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.coach || !formData.option}
                    className={`w-full py-4 rounded-[2px] min-h-[48px] font-sans text-[14px] font-medium tracking-[0.02em] mt-8 transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                      isSubmitting || !formData.coach || !formData.option
                        ? 'bg-brand-sandstone text-brand-pacific-dusk/50 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Private Lesson'}
                  </button>

                  <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-black/6">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-tide-pool" aria-hidden="true" />
                      <span className="font-sans text-[11px] text-brand-pacific-dusk/60">We&apos;ll reach out within 24 hours</span>
                    </div>
                  </div>
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/50 text-center mt-4">
                    Questions? <a href="tel:9495340457" className="text-brand-pacific-dusk hover:underline focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-sm">(949) 534-0457</a>
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
