'use client'

import { useState } from 'react'
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import type { Program } from './ProgramCard'

interface RegistrationModalProps {
  program: Program | null
  onClose: () => void
}

export default function RegistrationModal({ program, onClose }: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedFrequency, setSelectedFrequency] = useState<string>('')
  const [calculatedPrice, setCalculatedPrice] = useState(0)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentName: '',
    studentAge: '',
    experience: '',
    notes: '',
  })
  
  if (!program) return null
  
  // Check if program requires student info (Junior/Youth categories)
  const requiresStudentInfo = program.category === 'Junior' || program.category === 'Youth'
  
  // Get available days from schedule
  const availableDays = program.schedule.map(s => s.day)
  
  // Get pricing options
  const pricingOptions = Object.entries(program.pricing)
    .filter(([key]) => key !== 'drop_in')
    .map(([key, value]) => {
      if (key === 'monthly') return { label: 'Monthly', value: key, price: value }
      if (key === '1x') return { label: '1× per week', value: key, price: value }
      if (key === '2x') return { label: '2× per week', value: key, price: value }
      if (key === '3x') return { label: '3× per week', value: key, price: value }
      if (key === '4x') return { label: '4× per week', value: key, price: value }
      if (key === '5x') return { label: '5× per week', value: key, price: value }
      return null
    })
    .filter(Boolean) as { label: string; value: string; price: number }[]
  
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }
  
  const handleFrequencyChange = (value: string, price: number) => {
    setSelectedFrequency(value)
    setCalculatedPrice(price)
  }
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  
  const validatePhone = (phone: string) => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.')
      return
    }
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address.')
      return
    }
    
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number.')
      return
    }
    
    if (requiresStudentInfo && (!formData.studentName || !formData.studentAge)) {
      setError('Please provide student name and age.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/register-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          program: program.program,
          studentName: formData.studentName || `${formData.firstName} ${formData.lastName}`,
          studentAge: parseInt(formData.studentAge) || null,
          experience: formData.experience || 'Not specified',
          preferredDays: selectedDays,
          location: program.location,
          totalPrice: calculatedPrice,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setError(data.message || 'Error processing registration. Please call (949) 464-6645.')
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('Error processing registration. Please call (949) 464-6645.')
      setIsSubmitting(false)
    }
  }
  
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-black/60" />
        </button>
        
        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="p-8 md:p-12 text-center">
            <CheckCircle className="w-16 h-16 text-lbta-orange mx-auto mb-6" />
            <h2 className="font-serif text-[28px] md:text-[36px] font-semibold text-black mb-4">
              Registration Received!
            </h2>
            <p className="font-sans text-[16px] md:text-[18px] text-black/70 mb-4">
              Thank you for registering for <span className="font-semibold text-lbta-orange">{program.program}</span>.
            </p>
            <p className="font-sans text-[15px] text-black/60">
              Our team will confirm your registration within 24 hours and follow up with payment details.
            </p>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex justify-center items-center gap-2 pt-8 pb-4">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-lbta-orange w-8'
                      : step < currentStep
                      ? 'bg-lbta-orange'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-center font-sans text-[14px] text-black/60 mb-6">
              Step {currentStep} of 2
            </p>
            
            <div className="px-6 md:px-12 pb-8">
              {/* STEP 1: CONFIRM PROGRAM */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-2">
                      Confirm Your Selection
                    </h2>
                    <p className="font-sans text-[15px] text-black/70">
                      Choose your preferred days and frequency.
                    </p>
                  </div>
                  
                  {/* Program Details */}
                  <div className="bg-[#FAF8F3] rounded-xl p-4 md:p-6">
                    <h3 className="font-serif text-[20px] font-semibold text-black mb-2">
                      {program.program}
                    </h3>
                    <p className="font-sans text-[14px] text-black/70 mb-3">
                      Ages {program.ages} · {program.location} · {program.duration}
                    </p>
                  </div>
                  
                  {/* Select Days */}
                  {availableDays.length > 1 && (
                    <div>
                      <label className="font-sans text-[15px] font-semibold text-black mb-3 block">
                        Select Preferred Days:
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableDays.map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`px-4 py-3 rounded-full font-sans text-[14px] font-medium transition-all duration-200 border-2 ${
                              selectedDays.includes(day)
                                ? 'bg-lbta-orange text-white border-lbta-orange'
                                : 'bg-white text-black/70 border-gray-300 hover:border-lbta-orange'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Select Frequency */}
                  <div>
                    <label className="font-sans text-[15px] font-semibold text-black mb-3 block">
                      Select Frequency:
                    </label>
                    <div className="space-y-3">
                      {pricingOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFrequencyChange(option.value, option.price)}
                          className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-sans text-[15px] font-medium transition-all duration-200 border-2 ${
                            selectedFrequency === option.value
                              ? 'bg-lbta-red text-white border-lbta-red'
                              : 'bg-white text-black border-gray-300 hover:border-lbta-orange'
                          }`}
                        >
                          <span>{option.label}</span>
                          <span className="font-bold">${option.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Total Price Display */}
                  {calculatedPrice > 0 && (
                    <div className="bg-lbta-orange/10 border-2 border-lbta-orange rounded-xl p-4 flex items-center justify-between">
                      <span className="font-sans text-[16px] font-semibold text-black">
                        Total Investment:
                      </span>
                      <span className="font-sans text-[28px] font-bold text-lbta-orange">
                        ${calculatedPrice}
                      </span>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedFrequency) {
                        setError('Please select a frequency option.')
                        return
                      }
                      if (availableDays.length > 1 && selectedDays.length === 0) {
                        setError('Please select at least one day.')
                        return
                      }
                      setError(null)
                      setCurrentStep(2)
                    }}
                    disabled={!selectedFrequency}
                    className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    Continue to Contact Info →
                  </button>
                  
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-[14px] font-sans">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* STEP 2: CONTACT INFORMATION */}
              {currentStep === 2 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-2">
                      Contact Information
                    </h2>
                    <p className="font-sans text-[15px] text-black/70">
                      We'll use this to confirm your registration.
                    </p>
                  </div>
                  
                  {/* Parent/Guardian Info */}
                  <div className="space-y-4">
                    <h3 className="font-sans text-[16px] font-semibold text-black">
                      {requiresStudentInfo ? 'Parent/Guardian Information' : 'Your Information'}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                      />
                    </div>
                    
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                    />
                  </div>
                  
                  {/* Student Info (if Junior/Youth) */}
                  {requiresStudentInfo && (
                    <div className="space-y-4">
                      <h3 className="font-sans text-[16px] font-semibold text-black">
                        Student Information
                      </h3>
                      
                      <input
                        type="text"
                        placeholder="Student Name *"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        required={requiresStudentInfo}
                        className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                      />
                      
                      <input
                        type="number"
                        placeholder="Student Age *"
                        value={formData.studentAge}
                        onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                        required={requiresStudentInfo}
                        min="3"
                        max="18"
                        className="w-full px-6 py-4 rounded-full bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all"
                      />
                    </div>
                  )}
                  
                  {/* Experience Level */}
                  <div>
                    <label className="font-sans text-[15px] font-semibold text-black mb-3 block">
                      Experience Level:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced', 'Not Sure'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData({ ...formData, experience: level })}
                          className={`px-4 py-3 rounded-full font-sans text-[14px] font-medium transition-all duration-200 ${
                            formData.experience === level
                              ? 'bg-lbta-red text-white'
                              : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Additional Notes */}
                  <div>
                    <label className="font-sans text-[15px] font-semibold text-black mb-2 block">
                      Additional Notes (Optional):
                    </label>
                    <textarea
                      placeholder="Any questions or special requests?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-[#FAF8F3] text-black/85 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all resize-none"
                    />
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-[14px] font-sans bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentStep(1)
                        setError(null)
                      }}
                      className="flex-1 border-2 border-lbta-red text-lbta-red hover:bg-lbta-red/5 font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 min-h-[48px]"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Complete Registration →'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
