'use client'

import { useState } from 'react'

export default function HomeCTAForm() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '' })
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
          program: 'Free Trial - Homepage',
          source: 'homepage-cta',
        }),
      })
      if (response.ok) {
        window.location.href = '/thank-you'
      } else {
        setSubmitError('Something went wrong. Please try again or call us.')
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Something went wrong. Please try again or call us.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label htmlFor="home-cta-first-name" className="sr-only">
          First name
        </label>
        <input
          id="home-cta-first-name"
          type="text"
          placeholder="First name"
          value={formData.firstName}
          onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
          required
          className="input-dark"
          autoComplete="given-name"
        />
      </div>
      <div>
        <label htmlFor="home-cta-last-name" className="sr-only">
          Last name
        </label>
        <input
          id="home-cta-last-name"
          type="text"
          placeholder="Last name"
          value={formData.lastName}
          onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
          required
          className="input-dark"
          autoComplete="family-name"
        />
      </div>
      <div>
        <label htmlFor="home-cta-email" className="sr-only">
          Email
        </label>
        <input
          id="home-cta-email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          required
          className="input-dark"
          autoComplete="email"
        />
      </div>
      <div>
        <label htmlFor="home-cta-phone" className="sr-only">
          Phone
        </label>
        <input
          id="home-cta-phone"
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
          required
          className="input-dark"
          autoComplete="tel"
        />
      </div>
      {submitError && (
        <div role="alert" aria-live="assertive" className="text-sm text-red-600 font-sans">
          {submitError}
        </div>
      )}
      <button type="submit" disabled={isSubmitting} className="btn-accent w-full min-h-[48px]">
        {isSubmitting ? 'Sending...' : 'Claim Your Spot'}
      </button>
    </form>
  )
}
