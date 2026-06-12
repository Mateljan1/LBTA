'use client'

import { useState } from 'react'
import { events } from '@/lib/analytics'

const SERVICE_OPTIONS = [
  { value: 'standard', label: 'Standard stringing ($25 + strings)' },
  { value: 'same-day', label: 'Same-day — drop off before noon ($35 + strings)' },
  { value: 'customization', label: 'Customization ($50+)' },
  { value: 'grip', label: 'Grip replacement ($10)' },
  { value: 'unsure', label: 'Not sure — help me choose' },
] as const

const STRING_OPTIONS = [
  { value: 'luxilon', label: 'Luxilon' },
  { value: 'babolat', label: 'Babolat' },
  { value: 'wilson', label: 'Wilson' },
  { value: 'solinco', label: 'Solinco' },
  { value: 'bring-own', label: 'I will bring my own string' },
  { value: 'recommend', label: 'Recommend a string for me' },
] as const

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  racquetCount: string
  service: string
  stringBrand: string
  tension: string
  notes: string
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  racquetCount: '1',
  service: 'standard',
  stringBrand: 'recommend',
  tension: '',
  notes: '',
}

function buildMessage(data: FormState): string {
  const serviceLabel =
    SERVICE_OPTIONS.find((o) => o.value === data.service)?.label ?? data.service
  const stringLabel =
    STRING_OPTIONS.find((o) => o.value === data.stringBrand)?.label ?? data.stringBrand
  const lines = [
    `Racquets: ${data.racquetCount}`,
    `Service: ${serviceLabel}`,
    `String: ${stringLabel}`,
    data.tension.trim() ? `Tension: ${data.tension.trim()}` : null,
    data.notes.trim() ? `Notes: ${data.notes.trim()}` : null,
  ].filter(Boolean)
  return lines.join('\n')
}

export default function RacquetRescueRequestForm() {
  const [formData, setFormData] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          program: 'Racquet Rescue',
          source: 'racquet-rescue',
          message: buildMessage(formData),
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.ok) {
        events.formSubmit('racquet_rescue')
        window.location.href = '/thank-you?type=racquet-rescue'
        return
      }
      setSubmitError(
        typeof result.error === 'string'
          ? result.error
          : 'Something went wrong. Please call (949) 534-0457.'
      )
    } catch {
      setSubmitError('Something went wrong. Please call (949) 534-0457.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full min-h-[48px] px-4 py-3 font-body text-base text-brand-pacific-dusk bg-white border border-black/10 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rr-first-name" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            First name <span className="text-lbta-red">*</span>
          </label>
          <input
            id="rr-first-name"
            type="text"
            required
            autoComplete="given-name"
            value={formData.firstName}
            onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="rr-last-name" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            Last name <span className="text-lbta-red">*</span>
          </label>
          <input
            id="rr-last-name"
            type="text"
            required
            autoComplete="family-name"
            value={formData.lastName}
            onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="rr-email" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
          Email <span className="text-lbta-red">*</span>
        </label>
        <input
          id="rr-email"
          type="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="rr-phone" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
          Phone <span className="text-lbta-red">*</span>
        </label>
        <input
          id="rr-phone"
          type="tel"
          required
          autoComplete="tel"
          value={formData.phone}
          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rr-count" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            Number of racquets
          </label>
          <select
            id="rr-count"
            value={formData.racquetCount}
            onChange={(e) => setFormData((p) => ({ ...p, racquetCount: e.target.value }))}
            className={inputClass}
          >
            {['1', '2', '3', '4', '5+'].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rr-service" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            Service
          </label>
          <select
            id="rr-service"
            value={formData.service}
            onChange={(e) => setFormData((p) => ({ ...p, service: e.target.value }))}
            className={inputClass}
          >
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rr-string" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            String preference
          </label>
          <select
            id="rr-string"
            value={formData.stringBrand}
            onChange={(e) => setFormData((p) => ({ ...p, stringBrand: e.target.value }))}
            className={inputClass}
          >
            {STRING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rr-tension" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
            Tension (optional)
          </label>
          <input
            id="rr-tension"
            type="text"
            placeholder="e.g. 52 lbs main / 50 cross"
            value={formData.tension}
            onChange={(e) => setFormData((p) => ({ ...p, tension: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="rr-notes" className="block font-sans text-sm font-medium text-brand-pacific-dusk mb-2">
          Notes (optional)
        </label>
        <textarea
          id="rr-notes"
          rows={3}
          maxLength={500}
          placeholder="Racquet model, pickup timing, or questions"
          value={formData.notes}
          onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
          className={`${inputClass} min-h-[96px] resize-y`}
        />
      </div>

      {submitError ? (
        <p className="font-body text-sm text-lbta-red" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
      >
        {isSubmitting ? 'Sending…' : 'Request stringing'}
      </button>

      <p className="font-body text-sm text-brand-pacific-dusk/60 text-center leading-relaxed">
        We confirm within one business day. Same-day turnaround when you drop off before noon at Moulton Meadows.
        Payment at pickup — card, check, or Venmo (details when we confirm).
      </p>
    </form>
  )
}