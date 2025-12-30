'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface FormData {
  // Player Information
  playerFirstName: string
  playerLastName: string
  playerDOB: string
  playerAge: string
  playerGrade: string
  playerSchool: string
  
  // Parent/Guardian
  parentFirstName: string
  parentLastName: string
  parentEmail: string
  parentPhone: string
  parentAddress: string
  parentCity: string
  parentZip: string
  
  // Emergency Contact
  emergencyName: string
  emergencyPhone: string
  emergencyRelation: string
  
  // Team Selection
  division: string
  shirtSize: string
  
  // USTA
  ustaRegistered: string
  ustaMemberNumber: string
  
  // Experience
  experienceLevel: string
  currentUTR: string
  
  // Payment
  paymentPreference: string
  cardAuthConsent: boolean
  
  // Sibling
  hasSibling: string
  siblingName: string
  
  // Medical & Notes
  medicalNotes: string
  additionalNotes: string
  
  // Consent
  photoConsent: boolean
  liabilityConsent: boolean
}

export default function JTTRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    playerFirstName: '',
    playerLastName: '',
    playerDOB: '',
    playerAge: '',
    playerGrade: '',
    playerSchool: '',
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    parentAddress: '',
    parentCity: '',
    parentZip: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    division: '',
    shirtSize: '',
    ustaRegistered: '',
    ustaMemberNumber: '',
    experienceLevel: '',
    currentUTR: '',
    paymentPreference: '',
    cardAuthConsent: false,
    hasSibling: '',
    siblingName: '',
    medicalNotes: '',
    additionalNotes: '',
    photoConsent: false,
    liabilityConsent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showUstaField, setShowUstaField] = useState(false)
  const [showUstaNotice, setShowUstaNotice] = useState(false)
  const [showSiblingField, setShowSiblingField] = useState(false)

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
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your registration. Please try again or call (949) 464-6645.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lbta-bone to-white py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="font-headline text-4xl mb-4">Registration Received!</h1>
            
            <p className="text-lg text-lbta-secondary mb-6">
              Thank you for registering <strong>{formData.playerFirstName}</strong> for JTT Spring 2026.
            </p>

            <div className="bg-lbta-beige/30 border border-lbta-beige rounded-lg p-6 mb-8 text-left">
              <p className="font-semibold text-lbta-primary mb-3">What happens next?</p>
              <ul className="space-y-2 text-lbta-secondary">
                <li className="flex items-start">
                  <span className="text-lbta-orange mr-2">•</span>
                  <span>We'll forward your registration to the City of Laguna Beach within 24 hours</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lbta-orange mr-2">•</span>
                  <span>The City will contact you to complete payment based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lbta-orange mr-2">•</span>
                  <span>We'll send USTA registration instructions separately (if needed)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-lbta-orange mr-2">•</span>
                  <span>Expect a welcome email with practice details before January 12th</span>
                </li>
              </ul>
            </div>

            <div className="bg-lbta-bone rounded-lg p-6 text-left space-y-3">
              <p className="font-semibold text-lbta-primary">Questions?</p>
              <p className="text-lbta-secondary">
                <span className="font-medium">LBTA Admin:</span> (949) 464-6645
              </p>
              <p className="text-lbta-secondary">
                <span className="font-medium">City Recreation:</span> (949) 715-8620
              </p>
              <p className="text-lbta-secondary">
                <span className="font-medium">Email:</span> support@lagunabeachtennisacademy.com
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/jtt'}
              className="mt-8 inline-flex items-center justify-center bg-lbta-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase px-10 py-4 rounded-sm transition-all duration-300 hover:bg-gray-800"
            >
              Back to JTT Page
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lbta-bone to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Image
              src="/images/logo-stacked.png"
              alt="Laguna Beach Tennis Academy"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <h1 className="font-headline text-4xl md:text-5xl mb-4">
            JTT Spring 2026 Registration
          </h1>
          <p className="text-xl text-lbta-secondary mb-2">
            Junior Team Tennis — January 12 – April 26, 2026
          </p>
          <p className="text-sm text-lbta-secondary/70">
            Laguna Beach Tennis Academy
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-sm text-blue-900">
            <strong>How this works:</strong> This form collects your registration information. Once submitted, we will forward your details to the <strong>City of Laguna Beach Recreation Department</strong>, and they will contact you to process payment based on your preferences. This form does not process payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Player Information */}
          <FormSection number={1} title="Player Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                required
                value={formData.playerFirstName}
                onChange={(e) => updateField('playerFirstName', e.target.value)}
              />
              <InputField
                label="Last Name"
                required
                value={formData.playerLastName}
                onChange={(e) => updateField('playerLastName', e.target.value)}
              />
              <InputField
                label="Date of Birth"
                type="date"
                required
                value={formData.playerDOB}
                onChange={(e) => updateField('playerDOB', e.target.value)}
              />
              <InputField
                label="Age"
                type="number"
                required
                min="5"
                max="18"
                value={formData.playerAge}
                onChange={(e) => updateField('playerAge', e.target.value)}
              />
              <SelectField
                label="Current Grade"
                value={formData.playerGrade}
                onChange={(e) => updateField('playerGrade', e.target.value)}
                options={[
                  { value: '', label: 'Select Grade' },
                  { value: 'K', label: 'Kindergarten' },
                  ...Array.from({ length: 12 }, (_, i) => ({
                    value: String(i + 1),
                    label: `${i + 1}${['st', 'nd', 'rd'][i] || 'th'} Grade`
                  }))
                ]}
              />
              <InputField
                label="School"
                value={formData.playerSchool}
                onChange={(e) => updateField('playerSchool', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Section 2: Parent/Guardian Information */}
          <FormSection number={2} title="Parent/Guardian Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                required
                value={formData.parentFirstName}
                onChange={(e) => updateField('parentFirstName', e.target.value)}
              />
              <InputField
                label="Last Name"
                required
                value={formData.parentLastName}
                onChange={(e) => updateField('parentLastName', e.target.value)}
              />
              <InputField
                label="Email"
                type="email"
                required
                value={formData.parentEmail}
                onChange={(e) => updateField('parentEmail', e.target.value)}
              />
              <InputField
                label="Phone"
                type="tel"
                required
                value={formData.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value)}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Street Address"
                  required
                  value={formData.parentAddress}
                  onChange={(e) => updateField('parentAddress', e.target.value)}
                />
              </div>
              <InputField
                label="City"
                required
                value={formData.parentCity}
                onChange={(e) => updateField('parentCity', e.target.value)}
              />
              <InputField
                label="ZIP Code"
                required
                value={formData.parentZip}
                onChange={(e) => updateField('parentZip', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Section 3: Emergency Contact */}
          <FormSection number={3} title="Emergency Contact">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="Full Name"
                required
                value={formData.emergencyName}
                onChange={(e) => updateField('emergencyName', e.target.value)}
              />
              <InputField
                label="Phone"
                type="tel"
                required
                value={formData.emergencyPhone}
                onChange={(e) => updateField('emergencyPhone', e.target.value)}
              />
              <InputField
                label="Relationship"
                required
                placeholder="e.g., Grandmother, Uncle"
                value={formData.emergencyRelation}
                onChange={(e) => updateField('emergencyRelation', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Section 4: Team Selection */}
          <FormSection number={4} title="Team Selection">
            <label className="block text-sm font-medium text-lbta-primary mb-4">
              Select Division <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {[
                { value: '10u-orange', label: '10U Orange Ball — Mon/Wed/Fri 3:45–5:45 PM @ Moulton Meadows' },
                { value: '10u-green', label: '10U Green Dot — Tue/Thu/Fri 4:00–6:00 PM @ Alta Laguna Park' },
                { value: '12u', label: '12U Division — Mon/Wed/Fri 4:00–6:00 PM @ LBHS' },
                { value: '14u', label: '14U Division — Mon/Wed/Fri 4:00–6:00 PM @ LBHS' },
                { value: '16u', label: '16U Division — Mon/Wed/Fri 6:00–8:00 PM @ LBHS' },
                { value: '18u', label: '18U Division — Mon/Wed/Fri 6:00–8:00 PM @ LBHS' },
              ].map((option) => (
                <RadioCard
                  key={option.value}
                  name="division"
                  value={option.value}
                  label={option.label}
                  checked={formData.division === option.value}
                  onChange={(e) => updateField('division', e.target.value)}
                />
              ))}
            </div>
          </FormSection>

          {/* Section 5: Team Shirt Size */}
          <FormSection number={5} title="Team Shirt Size">
            <label className="block text-sm font-medium text-lbta-primary mb-4">
              Select Size <span className="text-red-500">*</span>
            </label>
            
            <p className="text-xs font-medium text-lbta-secondary uppercase tracking-wide mb-3">Youth Sizes</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { value: 'youth-xs', label: 'Youth XS (25–26")' },
                { value: 'youth-s', label: 'Youth S (26–28")' },
                { value: 'youth-m', label: 'Youth M (28–30")' },
                { value: 'youth-l', label: 'Youth L (30–32")' },
                { value: 'youth-xl', label: 'Youth XL (32–35")' },
              ].map((size) => (
                <RadioCard
                  key={size.value}
                  name="shirtSize"
                  value={size.value}
                  label={size.label}
                  checked={formData.shirtSize === size.value}
                  onChange={(e) => updateField('shirtSize', e.target.value)}
                  compact
                />
              ))}
            </div>

            <p className="text-xs font-medium text-lbta-secondary uppercase tracking-wide mb-3">Adult Sizes</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'adult-xs', label: 'Adult XS (18.5")' },
                { value: 'adult-s', label: 'Adult S (20")' },
                { value: 'adult-m', label: 'Adult M (21.5")' },
                { value: 'adult-l', label: 'Adult L (23")' },
                { value: 'adult-xl', label: 'Adult XL (24.5")' },
                { value: 'adult-2xl', label: 'Adult 2XL (26")' },
              ].map((size) => (
                <RadioCard
                  key={size.value}
                  name="shirtSize"
                  value={size.value}
                  label={size.label}
                  checked={formData.shirtSize === size.value}
                  onChange={(e) => updateField('shirtSize', e.target.value)}
                  compact
                />
              ))}
            </div>
          </FormSection>

          {/* Section 6: USTA Registration */}
          <FormSection number={6} title="USTA Registration">
            <label className="block text-sm font-medium text-lbta-primary mb-4">
              Is your child registered with USTA? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4 mb-4">
              <RadioCard
                name="ustaRegistered"
                value="yes"
                label="Yes"
                checked={formData.ustaRegistered === 'yes'}
                onChange={(e) => {
                  updateField('ustaRegistered', e.target.value)
                  setShowUstaField(true)
                  setShowUstaNotice(false)
                }}
                compact
              />
              <RadioCard
                name="ustaRegistered"
                value="no"
                label="No — I need instructions"
                checked={formData.ustaRegistered === 'no'}
                onChange={(e) => {
                  updateField('ustaRegistered', e.target.value)
                  setShowUstaField(false)
                  setShowUstaNotice(true)
                }}
                compact
              />
            </div>

            {showUstaField && (
              <InputField
                label="USTA Member Number"
                placeholder="e.g., 123456789"
                value={formData.ustaMemberNumber}
                onChange={(e) => updateField('ustaMemberNumber', e.target.value)}
              />
            )}

            {showUstaNotice && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>USTA registration is required</strong> for all JTT players. We'll send you registration instructions after you submit this form. The fee is $33.15 (paid directly to USTA).
                </p>
              </div>
            )}
          </FormSection>

          {/* Section 7: Tennis Experience */}
          <FormSection number={7} title="Tennis Experience">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Experience Level"
                required
                value={formData.experienceLevel}
                onChange={(e) => updateField('experienceLevel', e.target.value)}
                options={[
                  { value: '', label: 'Select Level' },
                  { value: 'beginner', label: 'Beginner — New to tennis' },
                  { value: 'intermediate', label: 'Intermediate — Can rally consistently' },
                  { value: 'advanced', label: 'Advanced — Match play experience' },
                  { value: 'competitive', label: 'Competitive — Tournament player' },
                ]}
              />
              <InputField
                label="Current UTR (if known)"
                placeholder="e.g., 3.5"
                value={formData.currentUTR}
                onChange={(e) => updateField('currentUTR', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Section 8: Payment Preferences */}
          <FormSection number={8} title="Payment Preferences">
            <div className="bg-lbta-bone/50 border border-lbta-sand rounded-lg p-5 mb-6">
              <p className="text-sm text-lbta-secondary">
                <strong>Please note:</strong> This form does not process payments. We will forward your registration information to the <strong>City of Laguna Beach Recreation Department</strong>, and they will contact you to complete payment based on your preferences below.
              </p>
            </div>

            <label className="block text-sm font-medium text-lbta-primary mb-4">
              What is your preferred payment option? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3 mb-6">
              {[
                { value: 'full', title: 'Pay in Full — Save $50', desc: 'Full payment at registration' },
                { value: 'two-installments', title: 'Two Installments', desc: '50% at registration, 50% at mid-season (no extra fees)' },
                { value: 'four-monthly', title: 'Four Monthly Payments', desc: '25% × 4 months (no extra fees)' },
                { value: 'invoice', title: 'Send Me an Invoice', desc: 'The City will email an invoice for the season amount' },
              ].map((option) => (
                <RadioCard
                  key={option.value}
                  name="paymentPreference"
                  value={option.value}
                  label={option.title}
                  description={option.desc}
                  checked={formData.paymentPreference === option.value}
                  onChange={(e) => updateField('paymentPreference', e.target.value)}
                />
              ))}
            </div>

            <div className="border-t border-lbta-sand pt-6 mb-6">
              <CheckboxField
                label="Authorize Card on File"
                description="I authorize the City of Laguna Beach to charge my card on file for season tuition according to my selected payment plan. I understand I can update my payment method at any time by contacting the City Recreation Department."
                checked={formData.cardAuthConsent}
                onChange={(e) => updateField('cardAuthConsent', e.target.checked)}
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-4">
              <p className="text-sm text-green-900">
                <strong>💰 Sibling Discount Available!</strong> Enrolling multiple children? The second child receives <strong>15% off</strong> their season tuition. Just let us know in the Sibling Information section below.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Questions about payment?</strong> Contact:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• City of Laguna Beach Recreation: <strong>(949) 715-8620</strong></li>
                <li>• LBTA Admin: <strong>(949) 464-6645</strong></li>
              </ul>
            </div>
          </FormSection>

          {/* Section 9: Sibling Information */}
          <FormSection number={9} title="Sibling Discount — Save 15%" highlight>
            <p className="text-sm text-green-700 mb-4">
              Enrolling more than one child? The second child receives 15% off their season tuition.
            </p>
            
            <label className="block text-sm font-medium text-lbta-primary mb-4">
              Are you enrolling another child in JTT this season?
            </label>
            <div className="flex gap-4 mb-4">
              <RadioCard
                name="hasSibling"
                value="yes"
                label="Yes — Apply 15% discount"
                checked={formData.hasSibling === 'yes'}
                onChange={(e) => {
                  updateField('hasSibling', e.target.value)
                  setShowSiblingField(true)
                }}
                compact
              />
              <RadioCard
                name="hasSibling"
                value="no"
                label="No"
                checked={formData.hasSibling === 'no'}
                onChange={(e) => {
                  updateField('hasSibling', e.target.value)
                  setShowSiblingField(false)
                }}
                compact
              />
            </div>

            {showSiblingField && (
              <div>
                <InputField
                  label="Sibling's Name"
                  placeholder="First and last name"
                  value={formData.siblingName}
                  onChange={(e) => updateField('siblingName', e.target.value)}
                />
                <p className="text-xs text-green-600 mt-2 font-medium">
                  ✓ Great! We'll apply the 15% sibling discount to the second child's tuition.
                </p>
              </div>
            )}
          </FormSection>

          {/* Section 10: Medical & Notes */}
          <FormSection number={10} title="Medical & Additional Notes">
            <div className="space-y-6">
              <TextareaField
                label="Medical Conditions or Allergies"
                placeholder="Please list any medical conditions, allergies, or physical limitations we should be aware of..."
                rows={3}
                value={formData.medicalNotes}
                onChange={(e) => updateField('medicalNotes', e.target.value)}
              />
              <TextareaField
                label="Additional Notes or Questions"
                placeholder="Anything else you'd like us to know about your child or your family's needs..."
                rows={3}
                value={formData.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
              />
            </div>
          </FormSection>

          {/* Section 11: Consent */}
          <FormSection number={11} title="Consent & Agreement">
            <div className="space-y-4">
              <CheckboxField
                label="Photo/Video Permission"
                description="I give permission for LBTA to photograph or video my child for promotional purposes (website, social media, newsletters)."
                checked={formData.photoConsent}
                onChange={(e) => updateField('photoConsent', e.target.checked)}
              />
              <CheckboxField
                label="Liability Waiver"
                description="I understand that tennis involves physical activity and inherent risks. I agree to hold harmless Laguna Beach Tennis Academy, its coaches, and the City of Laguna Beach from any injuries that may occur during practices or matches."
                required
                checked={formData.liabilityConsent}
                onChange={(e) => updateField('liabilityConsent', e.target.checked)}
              />
            </div>
          </FormSection>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center bg-lbta-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase px-12 py-5 rounded-sm transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Registration'}
            </button>
            <p className="text-sm text-lbta-secondary mt-4">
              Questions? Call LBTA Admin at <strong>(949) 464-6645</strong>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-lbta-secondary">
          <p className="font-headline text-lg">Laguna Beach Tennis Academy</p>
          <p className="mt-2 italic">Movement. Discipline. Belonging.</p>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function FormSection({ 
  number, 
  title, 
  children, 
  highlight = false 
}: { 
  number: number
  title: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-8 ${highlight ? 'ring-2 ring-green-200' : ''}`}>
      <h2 className="text-xl font-semibold text-lbta-primary mb-6 flex items-center">
        <span className={`w-10 h-10 ${highlight ? 'bg-green-100 text-green-600' : 'bg-lbta-beige/50 text-lbta-black'} rounded-full flex items-center justify-center text-sm font-bold mr-4`}>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}

function InputField({ 
  label, 
  required = false, 
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max
}: {
  label: string
  required?: boolean
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: string
  max?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-lbta-primary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-3 border border-lbta-sand rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lbta-black/20 focus:border-lbta-black"
      />
    </div>
  )
}

function SelectField({ 
  label, 
  required = false, 
  options,
  value,
  onChange
}: {
  label: string
  required?: boolean
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-lbta-primary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-lbta-sand rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lbta-black/20 focus:border-lbta-black"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TextareaField({ 
  label, 
  required = false, 
  rows = 4,
  value,
  onChange,
  placeholder
}: {
  label: string
  required?: boolean
  rows?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-lbta-primary mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-lbta-sand rounded-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lbta-black/20 focus:border-lbta-black resize-none"
      />
    </div>
  )
}

function RadioCard({ 
  name, 
  value, 
  label, 
  description, 
  checked, 
  onChange,
  compact = false 
}: {
  name: string
  value: string
  label: string
  description?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  compact?: boolean
}) {
  return (
    <label className={`flex items-start ${compact ? 'p-3' : 'p-4'} border ${checked ? 'border-lbta-black bg-lbta-beige/20' : 'border-lbta-sand'} rounded-sm hover:border-lbta-black/40 cursor-pointer transition-all duration-200`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 text-lbta-black focus:ring-lbta-black"
      />
      <div className="ml-3 flex-1">
        <span className="text-sm font-medium text-lbta-primary">{label}</span>
        {description && (
          <p className="text-xs text-lbta-secondary mt-1">{description}</p>
        )}
      </div>
    </label>
  )
}

function CheckboxField({ 
  label, 
  description, 
  required = false,
  checked,
  onChange 
}: {
  label: string
  description?: string
  required?: boolean
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-start p-4 bg-lbta-bone/30 rounded-sm cursor-pointer">
      <input
        type="checkbox"
        required={required}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 text-lbta-black focus:ring-lbta-black rounded"
      />
      <div className="ml-3">
        <span className="text-sm font-medium text-lbta-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {description && (
          <p className="text-xs text-lbta-secondary mt-1">{description}</p>
        )}
      </div>
    </label>
  )
}

