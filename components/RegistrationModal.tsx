'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import AppDownloadCard from './AppDownloadCard'

const LBTA_LOGO_HORIZONTAL = 'https://res.cloudinary.com/dv033eo0x/image/upload/v1774908286/LBTA_Logo_-_Horizontal_pkmav6.png'
const CITY_SEAL = 'https://res.cloudinary.com/dv033eo0x/image/upload/v1774908287/City_of_Laguna_Beach_Seal_zstoin.png'

interface RegistrationModalProps {
  programName: string
  programDetails: string
  programDays?: string[]
  pricingOptions?: Array<{ label: string; amount: number }>
  isOpen: boolean
  onClose: () => void
  rec1Url?: string
  registrationSource?: string
  /** When true, hides the Rec1 "pay now" path. Use for private lessons and direct bookings. */
  hideRec1?: boolean
}

// 'transitioning' = Path A clicked, Rec1 tab open, waiting 2s before confirmation
type ModalState = 'choose' | 'form' | 'transitioning' | 'confirmation'
type RegistrationPath = 'a' | 'b' | null

const BASE_REC1_URL =
  'https://secure.rec1.com/CA/city-of-laguna-beach/catalog/index/3b26b76547b72c4ddb248e0f9709a753?filter=c2VhcmNoPSZjYXRlZ29yeSU1QjIwMjgzJTVEPTE='

export default function RegistrationModal({
  programName,
  programDetails,
  programDays = [],
  pricingOptions = [],
  isOpen,
  onClose,
  rec1Url,
  registrationSource = 'registration_modal',
  hideRec1 = false,
}: RegistrationModalProps) {
  const [state, setState] = useState<ModalState>('choose')
  const [path, setPath] = useState<RegistrationPath>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daySelectionError, setDaySelectionError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  // Capture the element that triggered the modal so we can restore focus on close
  const triggerElementRef = useRef<Element | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerName: '',
    playerAge: '',
    daysPerWeek: '',
    preferredDays: [] as string[],
    interestedInUtrMatchPlay: false,
    notes: '',
  })

  // Reset internal state and capture trigger element when opening
  useEffect(() => {
    if (isOpen) {
      // Capture the currently focused element before we move focus into the modal
      triggerElementRef.current = document.activeElement

      // Direct bookings (private lessons etc.) skip the choose state
      setState(hideRec1 ? 'form' : 'choose')
      setPath(hideRec1 ? 'b' : null)
      setIsSubmitting(false)
      setError(null)
      setDaySelectionError(null)
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        playerName: '',
        playerAge: '',
        daysPerWeek: '',
        preferredDays: [],
        interestedInUtrMatchPlay: false,
        notes: '',
      })

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'registration_modal_opened', {
          event_category: 'Registration',
          program_name: programName,
          registration_source: registrationSource,
        })
      }
    }
  }, [isOpen, programName, registrationSource, hideRec1])

  const handleClose = useCallback(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'registration_modal_closed', {
        event_category: 'Registration',
        program_name: programName,
        registration_source: registrationSource,
        final_state: state,
      })
    }

    // Return focus to the element that opened the modal before unmounting
    const trigger = triggerElementRef.current
    onClose()
    if (trigger instanceof HTMLElement) {
      // Defer one microtask so the parent state update (which unmounts the modal)
      // doesn't interfere with focus placement
      queueMicrotask(() => trigger.focus())
    }
  }, [onClose, programName, registrationSource, state])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose, isOpen])

  // Move focus to first focusable element when modal opens or state changes
  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    const firstFocusable = dialog.querySelector<HTMLElement>(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }, [isOpen, state])

  // Lock body scroll while modal is open
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

  const handlePathAClick = () => {
    const url = rec1Url || BASE_REC1_URL
    setPath('a')
    setState('transitioning')

    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', 'registration_path_a_clicked', {
          event_category: 'Registration',
          program_name: programName,
          registration_source: registrationSource,
        })
      }

      window.open(url, '_blank', 'noopener,noreferrer')

      window.setTimeout(() => {
        setState('confirmation')
      }, 2200)
    }
  }

  const handlePathBClick = () => {
    setPath('b')
    setState('form')
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'registration_path_b_clicked', {
        event_category: 'Registration',
        program_name: programName,
        registration_source: registrationSource,
      })
    }
  }

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const dayOptions = programDays.length
    ? [...new Set(programDays)]
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const togglePreferredDay = (day: string) => {
    setForm((prev) => {
      const selectedDaysPerWeek = Number.parseInt(prev.daysPerWeek, 10)
      const maxSelectableDays =
        Number.isFinite(selectedDaysPerWeek) && selectedDaysPerWeek > 0 ? selectedDaysPerWeek : null

      if (prev.preferredDays.includes(day)) {
        setDaySelectionError(null)
        return {
          ...prev,
          preferredDays: prev.preferredDays.filter((d) => d !== day),
        }
      }

      if (maxSelectableDays && prev.preferredDays.length >= maxSelectableDays) {
        setDaySelectionError(`You selected ${maxSelectableDays} day${maxSelectableDays > 1 ? 's' : ''}/week.`)
        return prev
      }

      setDaySelectionError(null)
      return {
        ...prev,
        preferredDays: [...prev.preferredDays, day],
      }
    })
  }

  const handleDaysPerWeekChange = (value: string) => {
    const selectedDaysPerWeek = Number.parseInt(value, 10)
    setForm((prev) => {
      const maxSelectableDays =
        Number.isFinite(selectedDaysPerWeek) && selectedDaysPerWeek > 0 ? selectedDaysPerWeek : null
      const nextPreferredDays =
        maxSelectableDays !== null ? prev.preferredDays.slice(0, maxSelectableDays) : prev.preferredDays
      return {
        ...prev,
        daysPerWeek: value,
        preferredDays: nextPreferredDays,
      }
    })
    setDaySelectionError(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const messageParts: string[] = []
      if (form.playerName) messageParts.push(`Player name: ${form.playerName}`)
      if (form.playerAge) messageParts.push(`Player age: ${form.playerAge}`)
      if (form.daysPerWeek) messageParts.push(`Requested days per week: ${form.daysPerWeek}`)
      if (form.preferredDays.length) messageParts.push(`Preferred days: ${form.preferredDays.join(', ')}`)
      if (form.interestedInUtrMatchPlay) messageParts.push('Interested in UTR Match Play add-on: Yes')
      if (form.notes) messageParts.push(`Notes: ${form.notes}`)

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          program: programName,
          source: registrationSource,
          preferredDays: form.preferredDays,
          message: messageParts.length ? messageParts.join('\n') : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || 'Something went wrong. Please try again or call (949) 534-0457.')
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'registration_form_submitted', {
            event_category: 'Registration',
            program_name: programName,
            registration_source: registrationSource,
            success: false,
          })
        }
        return
      }

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'registration_form_submitted', {
          event_category: 'Registration',
          program_name: programName,
          registration_source: registrationSource,
          success: true,
        })
      }

      setState('confirmation')
    } catch (err) {
      console.error('[RegistrationModal] Submit error', err)
      setError('Connection error. Please try again or call (949) 534-0457.')
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'registration_form_submitted', {
          event_category: 'Registration',
          program_name: programName,
          registration_source: registrationSource,
          success: false,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm px-0 md:px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Register for ${programName}`}
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        className="relative w-full md:max-w-[560px] bg-brand-deep-water rounded-t-2xl md:rounded-lg shadow-2xl max-h-[90vh] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button — always visible */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 inline-flex items-center justify-center rounded-full bg-white/10 text-white/80 w-12 h-12 min-w-[48px] min-h-[48px] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          aria-label="Close registration"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh] pt-6 pb-6 md:pt-7 md:pb-7 px-5 md:px-6">

          {/* ── CHOOSE ── */}
          {state === 'choose' && (
            <div>
              <div className="flex items-center gap-4 mb-5">
                <Image src={LBTA_LOGO_HORIZONTAL} alt="Laguna Beach Tennis Academy" width={160} height={40} className="shrink-0 brightness-0 invert" />
              </div>

              <h2 className="font-headline text-[24px] md:text-[28px] font-medium text-white leading-tight mb-1">
                {programName}
              </h2>
              <p className="font-sans text-[13px] text-white/60 mb-5">
                {programDetails}
              </p>

              {pricingOptions.length > 0 && (
                <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3.5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {pricingOptions.map((option) => (
                      <div key={option.label} className="flex items-baseline justify-between">
                        <span className="font-sans text-[12px] font-medium text-white/50">{option.label}</span>
                        <span className="font-sans text-[15px] font-bold tabular-nums text-white">${option.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="font-sans text-[11px] font-medium text-white/50 uppercase tracking-[0.16em] mb-3">
                How would you like to register?
              </p>

              <div className="space-y-3 mb-4">
                <button
                  type="button"
                  onClick={handlePathAClick}
                  className="w-full text-left rounded-lg border border-white/10 bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  <div className="border-t-[3px] border-brand-sunset-cliff rounded-t-lg" />
                  <div className="px-5 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Image src={CITY_SEAL} alt="" width={28} height={28} className="shrink-0 rounded-full" aria-hidden="true" />
                      <div>
                        <p className="font-headline text-[17px] font-medium text-white mb-0.5">
                          Register and Pay
                        </p>
                        <p className="font-sans text-[13px] text-white/55">
                          Complete registration on the City of Laguna Beach site.
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-sans text-[13px] font-medium text-white/70" aria-hidden="true">↗</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handlePathBClick}
                  className="w-full text-left rounded-lg border border-white/10 bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                >
                  <div className="border-t-[3px] border-brand-victoria-cove rounded-t-lg" />
                  <div className="px-5 py-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-headline text-[17px] font-medium text-white mb-0.5">
                        We&apos;ll Handle It
                      </p>
                      <p className="font-sans text-[13px] text-white/55">
                        Share your details and we&apos;ll get you registered within 24 hours.
                      </p>
                    </div>
                    <span className="shrink-0 font-sans text-[13px] font-medium text-white/70" aria-hidden="true">→</span>
                  </div>
                </button>
              </div>

              <p className="font-sans text-[11px] text-white/40 leading-relaxed">
                All registration goes through the City of Laguna Beach recreation department.
              </p>
            </div>
          )}

          {/* ── TRANSITIONING (Path A: opening city site) ── */}
          {state === 'transitioning' && (
            <div className="flex flex-col items-center justify-center text-center py-10 min-h-[260px]" aria-live="polite">
              <span
                className="block w-9 h-9 rounded-full border-2 border-white/15 border-t-brand-victoria-cove motion-safe:animate-spin mb-6"
                aria-hidden="true"
              />
              <h2 className="font-headline text-[22px] font-medium text-white mb-2">
                Opening city site…
              </h2>
              <p className="font-sans text-[13px] text-white/65 max-w-[320px]">
                The City of Laguna Beach registration page should be opening in a new tab. Complete your payment there
                and then return here.
              </p>
              <p className="font-sans text-[12px] text-white/50 mt-4">
                Nothing opened?{' '}
                <a
                  href={rec1Url || BASE_REC1_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-victoria-cove underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove rounded-sm"
                >
                  Open it manually
                </a>
              </p>
            </div>
          )}

          {/* ── FORM (Path B) ── */}
          {state === 'form' && (
            <form onSubmit={handleSubmit}>
              {!hideRec1 && (
                <button
                  type="button"
                  onClick={() => {
                    setState('choose')
                    setPath(null)
                    setError(null)
                  }}
                  className="mb-3 font-sans text-[12px] text-white/60 hover:text-white inline-flex items-center gap-1 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-sm"
                >
                  <span aria-hidden="true">←</span> Back
                </button>
              )}

              <div className="flex items-center gap-4 mb-4">
                <Image src={LBTA_LOGO_HORIZONTAL} alt="Laguna Beach Tennis Academy" width={140} height={35} className="shrink-0 brightness-0 invert" />
              </div>

              <h2 className="font-headline text-[22px] md:text-[24px] font-medium text-white leading-tight mb-1">
                {programName}
              </h2>
              <p className="font-sans text-[13px] text-white/55 mb-5">
                {hideRec1
                  ? "Share your details and we\u2019ll confirm availability within 24 hours."
                  : "Share your details and we\u2019ll get you registered."}
              </p>

              {pricingOptions.length > 0 && (
                <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3.5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {pricingOptions.map((option) => (
                      <div key={option.label} className="flex items-baseline justify-between">
                        <span className="font-sans text-[12px] font-medium text-white/50">{option.label}</span>
                        <span className="font-sans text-[15px] font-bold tabular-nums text-white">${option.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      First name*
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      Last name*
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      Player name
                    </label>
                    <input
                      type="text"
                      value={form.playerName}
                      onChange={(e) => handleChange('playerName', e.target.value)}
                      className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      Player age
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={99}
                      value={form.playerAge}
                      onChange={(e) => handleChange('playerAge', e.target.value)}
                      className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      Days per week
                    </label>
                    <select
                      value={form.daysPerWeek}
                      onChange={(e) => handleDaysPerWeekChange(e.target.value)}
                      className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12]"
                    >
                      <option value="" className="bg-brand-deep-water text-white">Select frequency</option>
                      <option value="1" className="bg-brand-deep-water text-white">1 day per week</option>
                      <option value="2" className="bg-brand-deep-water text-white">2 days per week</option>
                      <option value="3" className="bg-brand-deep-water text-white">3 days per week</option>
                      <option value="4+" className="bg-brand-deep-water text-white">4+ days per week</option>
                      <option value="Not sure" className="bg-brand-deep-water text-white">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                      Preferred days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {dayOptions.map((day) => {
                        const selected = form.preferredDays.includes(day)
                        const selectedDaysPerWeek = Number.parseInt(form.daysPerWeek, 10)
                        const maxSelectableDays =
                          Number.isFinite(selectedDaysPerWeek) && selectedDaysPerWeek > 0 ? selectedDaysPerWeek : null
                        const isAtLimit =
                          !selected && maxSelectableDays !== null && form.preferredDays.length >= maxSelectableDays
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => togglePreferredDay(day)}
                            disabled={isAtLimit}
                            className={`min-h-[48px] px-4 py-2 rounded-full border font-sans text-[12px] transition-colors ${
                              selected
                                ? 'bg-white text-brand-deep-water border-white'
                                : isAtLimit
                                  ? 'bg-transparent text-white/25 border-white/10 cursor-not-allowed'
                                  : 'bg-transparent text-white/80 border-white/20 hover:border-white/40'
                            }`}
                            aria-pressed={selected}
                          >
                            {day.slice(0, 3)}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-2 font-sans text-[12px] text-white/50">
                      {form.preferredDays.length
                        ? `Selected: ${form.preferredDays.join(', ')}`
                        : 'Selected: none yet'}
                    </p>
                    {daySelectionError && (
                      <p className="mt-1 font-sans text-[12px] text-white/50">
                        {daySelectionError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[10px] border border-brand-victoria-cove/30 bg-brand-victoria-cove/10 px-4 py-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.interestedInUtrMatchPlay}
                      onChange={(e) => setForm((prev) => ({ ...prev, interestedInUtrMatchPlay: e.target.checked }))}
                      className="mt-0.5 h-4 w-4 rounded border-white/20 text-brand-victoria-cove focus:ring-brand-victoria-cove"
                    />
                    <span>
                      <span className="block font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-victoria-cove">
                        Optional add-on
                      </span>
                      <span className="block font-sans text-[13px] text-white/80 mt-0.5">
                        I&apos;m interested in UTR Match Play opportunities for this player.
                      </span>
                      <a
                        href="/programs/utr-match-play"
                        className="inline-flex mt-1 font-sans text-[12px] text-brand-victoria-cove underline underline-offset-2 decoration-brand-victoria-cove/40 hover:decoration-brand-victoria-cove"
                      >
                        View UTR Match Play details
                      </a>
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-white/60 uppercase tracking-[0.15em] mb-1.5">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full rounded-[6px] bg-white/[0.08] border border-white/10 px-3.5 py-3 font-sans text-[14px] text-white placeholder:text-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus:bg-white/[0.12] resize-none"
                    placeholder="Anything helpful for our team to know."
                  />
                </div>

                {error && (
                  <p className="font-sans text-[13px] text-red-400 mt-1" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 w-full inline-flex items-center justify-center rounded-[2px] bg-white text-brand-deep-water font-sans text-[13px] font-medium tracking-[0.18em] uppercase px-6 py-3.5 min-h-[48px] transition-all duration-300 hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
                >
                  {isSubmitting ? 'Submitting…' : 'Register'}
                </button>

                <p className="font-sans text-[12px] text-white/45 mt-3">
                  Questions? Call{' '}
                  <a
                    href="tel:19495340457"
                    className="text-brand-victoria-cove underline underline-offset-2 decoration-brand-victoria-cove/40 hover:decoration-brand-victoria-cove"
                  >
                    (949) 534-0457
                  </a>
                  .
                </p>
              </div>
            </form>
          )}

          {/* ── CONFIRMATION (both paths) ── */}
          {state === 'confirmation' && (
            <div>
              <div className="flex flex-col items-center text-center mb-6">
                <Image src={LBTA_LOGO_HORIZONTAL} alt="Laguna Beach Tennis Academy" width={160} height={40} className="mb-5 brightness-0 invert" />
                <div className="w-14 h-14 rounded-full bg-brand-tide-pool/20 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-brand-tide-pool" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-headline text-[24px] md:text-[26px] font-medium text-white mb-2">
                  You&apos;re registered.
                </h2>
                <p className="font-sans text-[14px] text-white/65 max-w-[360px] leading-relaxed">
                  {path === 'a' ? (
                    <>Complete payment on the city site — the tab should be open.</>
                  ) : (
                    <>We&apos;ll reach out within 24 hours to confirm your spot.</>
                  )}
                </p>
              </div>

              {path === 'b' && <AppDownloadCard className="mb-6" variant="dark" />}

              <button
                type="button"
                onClick={handleClose}
                className="w-full inline-flex items-center justify-center rounded-[2px] bg-white text-brand-deep-water font-sans text-[13px] font-medium tracking-[0.18em] uppercase px-6 py-3.5 min-h-[48px] transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Done
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
