'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

// Types for different registration scenarios
interface CampData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
}

interface JTTData {
  id: string
  name: string
  dates: string
  weeks: number
  matchDay: string
  divisions: { age: string; price: number }[]
  includes: string[]
  description: string
}

interface SeasonData {
  name: string
  dates: string
  weeks: number
  status: string
}

type RegistrationType = 'camp' | 'jtt' | 'seasonal' | 'inquiry'

interface YearRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  type: RegistrationType
  data: CampData | JTTData | SeasonData | null
  season?: string
}

export default function YearRegistrationModal({
  isOpen,
  onClose,
  type,
  data,
  season
}: YearRegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    playerName: '',
    playerAge: '',
    division: '', // For JTT
    campWeek: '', // For summer camps with multiple weeks
    halfDay: false, // For summer camps
    notes: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setIsSuccess(false)
      setError(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        playerName: '',
        playerAge: '',
        division: '',
        campWeek: '',
        halfDay: false,
        notes: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalInfo: '',
      })
      setErrors({})
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Validation
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.playerName.trim()) newErrors.playerName = 'Player name is required'
    if (!formData.playerAge.trim()) newErrors.playerAge = 'Player age is required'
    
    // JTT requires division selection
    if (type === 'jtt' && !formData.division) {
      newErrors.division = 'Please select a division'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      // Build submission data based on type
      const submissionData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        playerName: formData.playerName,
        playerAge: formData.playerAge,
        notes: formData.notes,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        medicalInfo: formData.medicalInfo,
        registrationType: type,
        season: season || 'winter',
      }

      if (type === 'camp' && data) {
        const campData = data as CampData
        submissionData.program = campData.name
        submissionData.programId = campData.id
        submissionData.campId = campData.id
        submissionData.campName = campData.name
        submissionData.campDates = campData.dates
        submissionData.campWeek = formData.campWeek
        submissionData.location = campData.location
        submissionData.price = formData.halfDay && campData.halfDay ? campData.halfDay : campData.price
      }

      if (type === 'jtt' && data) {
        const jttData = data as JTTData
        submissionData.program = jttData.name
        submissionData.programId = jttData.id
        submissionData.jttId = jttData.id
        submissionData.jttSeason = jttData.name
        submissionData.division = formData.division
        
        // Get price based on division
        const selectedDivision = jttData.divisions.find(d => d.age === formData.division)
        submissionData.price = selectedDivision?.price || 0
      }

      if (type === 'seasonal' && data) {
        const seasonData = data as SeasonData
        submissionData.program = `${seasonData.name} Program Inquiry`
      }

      if (type === 'inquiry') {
        submissionData.program = 'General Inquiry'
      }

      const response = await fetch('/api/register-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
      } else {
        setError(result.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  // Get display info based on type
  const getTitle = () => {
    if (type === 'camp' && data) return `Register for ${(data as CampData).name}`
    if (type === 'jtt' && data) return `Register for ${(data as JTTData).name}`
    if (type === 'seasonal') return `Reserve Your Spot - ${season || 'Winter'} 2026`
    return 'Inquire About Programs'
  }

  const getSubtitle = () => {
    if (type === 'camp' && data) {
      const campData = data as CampData
      return `${campData.dates} • Ages ${campData.ages} • ${campData.location}`
    }
    if (type === 'jtt' && data) {
      const jttData = data as JTTData
      return `${jttData.dates} • ${jttData.weeks} weeks • Matches on ${jttData.matchDay}`
    }
    if (type === 'seasonal' && data) {
      const seasonData = data as SeasonData
      return `${seasonData.dates} • ${seasonData.weeks} weeks`
    }
    return 'Tell us about your tennis goals'
  }

  const getPrice = () => {
    if (type === 'camp' && data) {
      const campData = data as CampData
      if (formData.halfDay && campData.halfDay) {
        return `$${campData.halfDay}/week (Half Day)`
      }
      return `$${campData.price}/week`
    }
    if (type === 'jtt' && data && formData.division) {
      const jttData = data as JTTData
      const division = jttData.divisions.find(d => d.age === formData.division)
      return division ? `$${division.price.toLocaleString()}` : 'Select division'
    }
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-lbta-red to-lbta-orange p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="font-serif text-[22px] md:text-[26px] font-semibold pr-8">
            {getTitle()}
          </h2>
          <p className="font-sans text-[13px] md:text-[14px] text-white/90 mt-1">
            {getSubtitle()}
          </p>
          
          {/* Progress indicator */}
          {!isSuccess && (
            <div className="flex gap-2 mt-4">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-serif text-[24px] font-semibold text-black mb-2">
                Registration Received!
              </h3>
              <p className="font-sans text-[15px] text-black/70 mb-6">
                {type === 'camp' && "You'll receive a confirmation email with camp details and payment information shortly."}
                {type === 'jtt' && "Our team will contact you with team placement information and next steps."}
                {type === 'seasonal' && "We'll reach out within 24 hours to confirm your spot."}
                {type === 'inquiry' && "Our team will get back to you within 24 hours."}
              </p>
              <button
                onClick={onClose}
                className="bg-lbta-orange hover:bg-lbta-red text-white font-sans font-semibold text-[15px] py-3 px-8 rounded-full transition-all duration-200"
              >
                Continue Browsing
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Parent/Guardian Info */
            <div className="space-y-4">
              <h3 className="font-serif text-[18px] font-semibold text-black mb-4">
                Parent/Guardian Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                      errors.firstName ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && <p className="text-red-500 text-[12px] mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                      errors.lastName ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-[12px] mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                    errors.email ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                    errors.phone ? 'ring-2 ring-red-500' : ''
                  }`}
                  placeholder="(949) 555-1234"
                />
                {errors.phone && <p className="text-red-500 text-[12px] mt-1">{errors.phone}</p>}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-lbta-orange hover:bg-lbta-red text-white font-sans font-semibold text-[15px] py-4 rounded-full transition-all duration-200 mt-6"
              >
                Continue →
              </button>
            </div>
          ) : (
            /* Step 2: Player Info & Program-Specific Details */
            <div className="space-y-4">
              <h3 className="font-serif text-[18px] font-semibold text-black mb-4">
                Player Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                    Player's Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.playerName}
                    onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                      errors.playerName ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Player's name"
                  />
                  {errors.playerName && <p className="text-red-500 text-[12px] mt-1">{errors.playerName}</p>}
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                    Player's Age *
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="18"
                    value={formData.playerAge}
                    onChange={(e) => setFormData({ ...formData, playerAge: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange ${
                      errors.playerAge ? 'ring-2 ring-red-500' : ''
                    }`}
                    placeholder="Age"
                  />
                  {errors.playerAge && <p className="text-red-500 text-[12px] mt-1">{errors.playerAge}</p>}
                </div>
              </div>

              {/* JTT Division Selection */}
              {type === 'jtt' && data && (
                <div>
                  <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange cursor-pointer ${
                      errors.division ? 'ring-2 ring-red-500' : ''
                    }`}
                  >
                    <option value="">Select division...</option>
                    {(data as JTTData).divisions.map((div) => (
                      <option key={div.age} value={div.age}>
                        {div.age} - ${div.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {errors.division && <p className="text-red-500 text-[12px] mt-1">{errors.division}</p>}
                </div>
              )}

              {/* Camp Half Day Option */}
              {type === 'camp' && data && (data as CampData).halfDay && (
                <div className="flex items-center gap-3 p-4 bg-[#FAF8F3] rounded-lg">
                  <input
                    type="checkbox"
                    id="halfDay"
                    checked={formData.halfDay}
                    onChange={(e) => setFormData({ ...formData, halfDay: e.target.checked })}
                    className="w-5 h-5 accent-lbta-orange"
                  />
                  <label htmlFor="halfDay" className="font-sans text-[14px] text-black cursor-pointer">
                    Half Day Option (9 AM - 12 PM) - ${(data as CampData).halfDay}/week
                  </label>
                </div>
              )}

              {/* Camp Safety Note */}
              {type === 'camp' && data && (data as CampData).safetyNote && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="font-sans text-[13px] text-amber-800">
                    <strong>Important:</strong> {(data as CampData).safetyNote}
                  </p>
                </div>
              )}

              {/* Emergency Contact */}
              <div className="pt-4 border-t border-black/10">
                <h4 className="font-sans text-[14px] font-semibold text-black mb-3">
                  Emergency Contact (Optional)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange"
                      placeholder="Emergency phone"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-sans text-[13px] font-semibold text-black mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-[#FAF8F3] text-black font-sans text-[14px] focus:outline-none focus:ring-2 focus:ring-lbta-orange resize-none"
                  placeholder="Any allergies, medical conditions, or special requests..."
                />
              </div>

              {/* Price Display */}
              {getPrice() && (
                <div className="flex justify-between items-center p-4 bg-lbta-beige/30 rounded-lg">
                  <span className="font-sans text-[14px] text-black/70">Total</span>
                  <span className="font-serif text-[24px] font-semibold text-lbta-red">
                    {getPrice()}
                  </span>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-sans text-[13px] text-red-700">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 border-2 border-black/20 hover:border-black/40 text-black font-sans font-semibold text-[15px] py-4 rounded-full transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] py-4 rounded-full transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="px-6 py-4 bg-[#FAF8F3] border-t border-black/5">
            <p className="font-sans text-[12px] text-black/50 text-center">
              🔒 Your information is secure. Questions? Call{' '}
              <a href="tel:+19494646645" className="text-lbta-orange hover:underline">
                (949) 464-6645
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

