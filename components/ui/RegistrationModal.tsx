'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  program: {
    name: string
    time: string
    day: string
    location: string
    price: string
    ages: string
    coach?: string
  } | null
  season: 'fall' | 'winter'
  allPrograms: Array<{
    name: string
    price: string
    location: string
  }>
}

export default function RegistrationModal({
  isOpen,
  onClose,
  program,
  season,
  allPrograms
}: RegistrationModalProps) {
  const [selectedProgram, setSelectedProgram] = useState(program?.name || '')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    skillLevel: '',
    experience: '',
    goals: [] as string[],
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  if (!isOpen || !program) return null

  const isEarlyBird = season === 'winter' && new Date() < new Date('2025-12-15')
  const selectedProgramData = allPrograms.find(p => p.name === selectedProgram)
  const basePrice = parseFloat(selectedProgramData?.price.replace(/[$,]/g, '') || '0')
  const finalPrice = isEarlyBird ? basePrice - 50 : basePrice

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program: selectedProgram,
          programDetails: selectedProgramData,
          season,
          earlyBird: isEarlyBird,
          finalPrice
        })
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          onClose()
          setSubmitSuccess(false)
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            skillLevel: '',
            experience: '',
            goals: [],
            notes: ''
          })
        }, 3000)
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white max-w-md w-full p-12 text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-lbta-coral/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-lbta-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="headline-sm mb-4">Registration Received</h2>
          <p className="body-sm text-gray-600">
            We'll contact you within 24 hours to confirm your spot and answer any questions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
          <div>
            <h2 className="headline-sm mb-2">Register for {season === 'fall' ? 'Fall 2025' : 'Winter 2026'}</h2>
            <p className="body-sm text-gray-600">{program.day} • {program.time} • {program.location}</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Early Bird Banner */}
        {isEarlyBird && (
          <div className="bg-lbta-coral/10 border-b border-lbta-coral/20 p-4">
            <p className="body-sm text-center">
              <span className="font-medium text-lbta-charcoal">Register by December 15:</span>{' '}
              <span className="text-lbta-coral">Save $50</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* Program Selection */}
          <div className="mb-8">
            <label className="block body-sm font-medium mb-3 text-lbta-charcoal">Program</label>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="w-full border border-gray-300 p-3 body-sm text-lbta-charcoal focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
              required
            >
              {allPrograms.map(p => (
                <option key={p.name} value={p.name}>
                  {p.name} - {p.price} - {p.location}
                </option>
              ))}
            </select>
            {isEarlyBird && selectedProgramData && (
              <p className="body-sm text-gray-600 mt-2">
                Early bird price: ${finalPrice} (save $50)
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="subhead-sm mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block body-sm text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block body-sm text-gray-600 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block body-sm text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block body-sm text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Player Information */}
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h3 className="subhead-sm mb-4">Player Information</h3>
            
            <div className="mb-4">
              <label className="block body-sm text-gray-600 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block body-sm text-gray-600 mb-2">Current Skill Level</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                required
              >
                <option value="">Select level...</option>
                <option value="beginner">Beginner - Never played before</option>
                <option value="beginner-returning">Beginner - Returning to tennis</option>
                <option value="intermediate">Intermediate - Can rally consistently</option>
                <option value="advanced">Advanced - Competitive player</option>
                <option value="high-performance">High Performance - Tournament player</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block body-sm text-gray-600 mb-2">Tennis Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition"
                required
              >
                <option value="">Select...</option>
                <option value="none">No prior experience</option>
                <option value="less-1yr">Less than 1 year</option>
                <option value="1-2yr">1-2 years</option>
                <option value="2-5yr">2-5 years</option>
                <option value="5plus">5+ years</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block body-sm text-gray-600 mb-3">Goals (select all that apply)</label>
              <div className="space-y-2">
                {[
                  { id: 'fitness', label: 'Fitness and health' },
                  { id: 'social', label: 'Meet people and have fun' },
                  { id: 'skill', label: 'Improve technical skills' },
                  { id: 'competitive', label: 'Play competitively' },
                  { id: 'college', label: 'College recruitment' },
                  { id: 'pro', label: 'Professional development' }
                ].map(goal => (
                  <label key={goal.id} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal.id)}
                      onChange={() => handleGoalToggle(goal.id)}
                      className="mr-3 w-4 h-4 text-lbta-coral focus:ring-lbta-coral border-gray-300 rounded cursor-pointer"
                    />
                    <span className="body-sm text-gray-700 group-hover:text-lbta-charcoal transition">{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block body-sm text-gray-600 mb-2">
                Additional Information (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                placeholder="Injuries, specific needs, previous coaches, etc."
                className="w-full border border-gray-300 p-3 body-sm focus:border-lbta-coral focus:ring-1 focus:ring-lbta-coral outline-none transition resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 eyebrow border border-gray-300 text-gray-700 py-4 transition hover:border-gray-400 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 eyebrow bg-lbta-coral text-white py-4 transition hover:bg-lbta-coral-dark disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REGISTRATION'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
