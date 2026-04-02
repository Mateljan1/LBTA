'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AppDownloadCard from './AppDownloadCard'

interface RegistrationModalProps {
  programName: string
  programDetails: string
  isOpen: boolean
  onClose: () => void
  rec1Url?: string
  registrationSource?: string
  /** When true, hides the Rec1 "pay now" path. Use for private lessons and direct bookings. */
  hideRec1?: boolean
}

type ModalState = 'choose' | 'form' | 'confirmation'
type RegistrationPath = 'a' | 'b' | null

const BASE_REC1_URL =
  'https://secure.rec1.com/CA/city-of-laguna-beach/catalog/index/3b26b76547b72c4ddb248e0f9709a753?filter=c2VhcmNoPSZjYXRlZ29yeSU1QjIwMjgzJTVEPTE='

export default function RegistrationModal({
  programName,
  programDetails,
  isOpen,
  onClose,
  rec1Url,
  registrationSource = 'registration_modal',
  hideRec1 = false,
}: RegistrationModalProps) {
  const [state, setState] = useState<ModalState>('choose')
  const [path, setPath] = useState<RegistrationPath>(null)
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerName: '',
    playerAge: '',
    notes: '',
  })

  // Reset internal state when opening/closing
  useEffect(() => {
    if (isOpen) {
      // Direct bookings (private lessons etc.) skip the choose state
      setState(hideRec1 ? 'form' : 'choose')
      setPath(hideRec1 ? 'b' : null)
      setIsAccordionOpen(false)
      setIsSubmitting(false)
      setError(null)
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        playerName: '',
        playerAge: '',
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
    onClose()
  }, [onClose, programName, registrationSource, state])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose, isOpen])

  // Basic focus handling when modal opens
  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    const firstButton = dialog.querySelector<HTMLElement>('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])')
    firstButton?.focus()
  }, [isOpen, state])

  const handlePathAClick = () => {
    const url = rec1Url || BASE_REC1_URL
    setPath('a')
    setState('choose')

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
      }, 2000)
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const messageParts: string[] = []
      if (form.playerName) messageParts.push(`Player name: ${form.playerName}`)
      if (form.playerAge) messageParts.push(`Player age: ${form.playerAge}`)
      if (form.notes) messageParts.push(`Notes: ${form.notes}`)

      const res = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          program: programName,
          source: registrationSource,
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

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

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
        className={`relative w-full md:max-w-[560px] bg-white rounded-t-2xl md:rounded-lg shadow-xl max-h-[90vh] overflow-hidden ${
          isMobile ? '' : ''
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-10 inline-flex items-center justify-center rounded-full bg-black/5 text-brand-pacific-dusk w-9 h-9 min-w-[36px] min-h-[36px] hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
          aria-label="Close registration"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="overflow-y-auto max-h-[90vh] pt-6 pb-6 md:pt-7 md:pb-7 px-5 md:px-6">
          {state === 'choose' && (
            <div>
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.18em] mb-2">
                Register for
              </p>
              <h2 className="font-headline text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk leading-tight mb-1">
                {programName}
              </h2>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-5">
                {programDetails}
              </p>

              <div className="space-y-3 mb-5">
                {/* Path A card */}
                <button
                  type="button"
                  onClick={handlePathAClick}
                  className="w-full text-left rounded-[10px] border border-black/[0.08] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  <div className="border-t-4 border-brand-sunset-cliff rounded-t-[10px]" />
                  <div className="px-5 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-pacific-dusk/70 mb-1.5">
                      Pay now
                    </p>
                    <p className="font-headline text-[18px] font-medium text-brand-pacific-dusk mb-2">
                      Register &amp; pay on the city website
                    </p>
                    <p className="font-sans text-[13px] text-brand-pacific-dusk/75 leading-relaxed mb-3">
                      Your payment goes through the City of Laguna Beach recreation department — this covers your court
                      access and insurance.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-brand-pacific-dusk">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-victoria-cove" aria-hidden />
                        Takes about 2 minutes
                      </span>
                      <span className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-brand-pacific-dusk">
                        Register &amp; pay
                        <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                  </div>
                </button>

                {/* Path B card */}
                <button
                  type="button"
                  onClick={handlePathBClick}
                  className="w-full text-left rounded-[10px] border border-black/[0.08] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_18px_55px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  <div className="border-t-4 border-brand-victoria-cove rounded-t-[10px]" />
                  <div className="px-5 pt-4 pb-4 md:px-5 md:pt-5 md:pb-5">
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-pacific-dusk/70 mb-1.5">
                      Have us help
                    </p>
                    <p className="font-headline text-[18px] font-medium text-brand-pacific-dusk mb-2">
                      Register here — we&apos;ll walk you through it
                    </p>
                    <p className="font-sans text-[13px] text-brand-pacific-dusk/75 leading-relaxed mb-3">
                      Someone from our team will reach out within 24 hours to get you registered and on court.
                    </p>
                    <span className="inline-flex items-center gap-1 font-sans text-[12px] font-medium text-brand-pacific-dusk">
                      We&apos;ll send a direct payment link after we confirm details.
                    </span>
                  </div>
                </button>
              </div>

              {/* Why city payment accordion */}
              <div className="mt-4 border-t border-black/[0.08] pt-4">
                <button
                  type="button"
                  onClick={() => setIsAccordionOpen((prev) => !prev)}
                  aria-expanded={isAccordionOpen}
                  className="w-full flex items-center justify-between font-sans text-[13px] text-brand-pacific-dusk/85 hover:text-brand-pacific-dusk focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-sm"
                >
                  <span>Why does payment go through the city?</span>
                  <span
                    aria-hidden="true"
                    className={`inline-block transform transition-transform duration-200 ${
                      isAccordionOpen ? 'rotate-90' : ''
                    }`}
                  >
                    ›
                  </span>
                </button>
                {isAccordionOpen && (
                  <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/70 leading-relaxed">
                    LBTA runs on City of Laguna Beach public courts. The city requires all participants to register
                    through their recreation department for liability and insurance coverage.
                  </p>
                )}
              </div>
            </div>
          )}

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
                  className="mb-3 font-sans text-[12px] text-brand-pacific-dusk/80 hover:text-brand-pacific-dusk inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-sm"
                >
                  <span aria-hidden="true">←</span> Back
                </button>
              )}
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.18em] mb-2">
                {hideRec1 ? 'Book a session' : 'Register for'}
              </p>
              <h2 className="font-headline text-[22px] md:text-[24px] font-medium text-brand-pacific-dusk leading-tight mb-1">
                {programName}
              </h2>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-5">
                {hideRec1
                  ? "Fill in your details and we\u2019ll follow up within 24 hours to confirm availability and scheduling."
                  : "We\u2019ll reach out within 24 hours."}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                      First name*
                    </label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                      Last name*
                    </label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                    Email*
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                      Player name
                    </label>
                    <input
                      type="text"
                      value={form.playerName}
                      onChange={(e) => handleChange('playerName', e.target.value)}
                      className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                      Player age
                    </label>
                    <input
                      type="number"
                      min={3}
                      max={99}
                      value={form.playerAge}
                      onChange={(e) => handleChange('playerAge', e.target.value)}
                      className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-1.5">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="w-full rounded-[6px] bg-brand-morning-light border border-black/[0.06] px-3.5 py-3 font-sans text-[14px] text-brand-pacific-dusk placeholder:text-brand-pacific-dusk/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15 resize-none"
                    placeholder="Anything helpful for our team to know."
                  />
                </div>

                {error && (
                  <p className="font-sans text-[13px] text-lbta-red mt-1" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 w-full inline-flex items-center justify-center rounded-[2px] bg-black text-white font-sans text-[13px] font-medium tracking-[0.18em] uppercase px-6 py-3.5 min-h-[48px] transition-all duration-300 hover:bg-gray-800 disabled:bg-black/30 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit registration'}
                </button>

                <p className="font-sans text-[12px] text-brand-pacific-dusk/55 mt-3">
                  Questions? Call{' '}
                  <a
                    href="tel:19495340457"
                    className="underline underline-offset-2 decoration-brand-victoria-cove/40 hover:decoration-brand-victoria-cove"
                  >
                    (949) 534-0457
                  </a>
                  .
                </p>
              </div>
            </form>
          )}

          {state === 'confirmation' && (
            <div>
              <div className="flex flex-col items-center text-center mb-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-victoria-cove/10">
                  <svg
                    className="h-6 w-6 text-brand-victoria-cove"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h2 className="font-headline text-[24px] md:text-[26px] font-medium text-brand-pacific-dusk mb-2">
                  You&apos;re on your way.
                </h2>
                <p className="font-sans text-[14px] text-brand-pacific-dusk/75 max-w-[360px]">
                  {path === 'a' ? (
                    <>
                      Complete your registration on the City of Laguna Beach site — the tab should be open now. Once we
                      receive your receipt, we&apos;ll set up your account and send a confirmation email.
                    </>
                  ) : (
                    <>
                      Someone from our team will reach out within 24 hours to help you get registered and on court.
                    </>
                  )}
                </p>
              </div>

              <AppDownloadCard className="mb-6" />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-[2px] bg-black text-white font-sans text-[13px] font-medium tracking-[0.18em] uppercase px-6 py-3 min-h-[44px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

