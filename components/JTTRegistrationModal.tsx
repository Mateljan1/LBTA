'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import JTTRegistrationForm from './JTTRegistrationForm'

interface JTTRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const divisions = [
  { value: '10u', label: '10U', price: 2800 },
  { value: '12u', label: '12U', price: 2800 },
  { value: '14u', label: '14U', price: 2800 },
  { value: '16u', label: '16U', price: 2800 },
  { value: '18u', label: '18U', price: 2800 },
]

export default function JTTRegistrationModal({ isOpen, onClose }: JTTRegistrationModalProps) {
  const [showFullForm, setShowFullForm] = useState(false)
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null)

  const handleClose = () => {
    setShowFullForm(false)
    setSelectedDivision(null)
    onClose()
  }

  const handleContinue = () => {
    if (selectedDivision) {
      setShowFullForm(true)
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
          onClick={handleClose}
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
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[520px] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f5f5f5] hover:bg-[#eee] flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {!showFullForm ? (
                // Division Selection Screen
                <div className="p-8 md:p-10">
                  <p className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.15em] mb-2">
                    JTT REGISTRATION
                  </p>
                  <h2 className="font-serif text-[32px] md:text-[36px] font-medium text-[#1a1a1a] mb-1 tracking-[-0.02em] leading-tight">
                    Spring 2026 Junior Team Tennis
                  </h2>
                  <p className="font-sans text-[14px] text-[#888] mb-3">
                    January 12 – April 26, 2026
                  </p>
                  <p className="font-sans text-[13px] text-[#666] mb-8">
                    15 weeks · Saturdays & Sundays
                  </p>

                  {/* Division Cards */}
                  <div className="space-y-3 mb-8">
                    {divisions.map((division) => (
                      <button
                        key={division.value}
                        onClick={() => setSelectedDivision(division.value)}
                        className={`w-full p-5 rounded-xl text-left transition-all duration-200 ${
                          selectedDivision === division.value
                            ? 'bg-[#1a1a1a] text-white ring-2 ring-[#1a1a1a]'
                            : 'bg-[#f8f8f8] hover:bg-[#f0f0f0] text-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-serif text-[20px] font-medium">
                            {division.label}
                          </span>
                          <span className={`font-serif text-[24px] font-medium ${
                            selectedDivision === division.value ? 'text-white' : 'text-[#1a1a1a]'
                          }`}>
                            ${division.price.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    disabled={!selectedDivision}
                    className={`w-full py-4 rounded-xl font-sans text-[14px] font-medium tracking-[0.02em] transition-all duration-200 ${
                      selectedDivision
                        ? 'bg-[#1a1a1a] text-white hover:bg-[#333]'
                        : 'bg-[#e8e8e8] text-[#999] cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>

                  {/* Trust Note */}
                  <p className="font-sans text-[12px] text-[#999] text-center mt-6">
                    Secure registration · Questions? <a href="tel:9494646645" className="text-[#666] hover:text-[#1a1a1a] transition-colors">(949) 464-6645</a>
                  </p>
                </div>
              ) : (
                // Full Registration Form
                <div className="p-6">
                  <button
                    onClick={() => setShowFullForm(false)}
                    className="mb-4 flex items-center gap-2 text-[#666] hover:text-[#1a1a1a] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-sans text-[13px] font-medium">Back to Division Selection</span>
                  </button>
                  
                  {/* Embed the full registration form */}
                  <div className="bg-[#FAF8F3] rounded-lg p-6">
                    <p className="font-sans text-[12px] text-[#666] mb-4">
                      Selected Division: <strong className="text-[#1a1a1a]">{divisions.find(d => d.value === selectedDivision)?.label}</strong>
                    </p>
                    <a
                      href="/jtt/register"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 bg-[#1a1a1a] text-white text-center font-sans text-[14px] font-medium tracking-[0.02em] rounded-xl hover:bg-[#333] transition-all"
                    >
                      Open Full Registration Form →
                    </a>
                    <p className="font-sans text-[11px] text-[#999] text-center mt-3">
                      Opens in new tab for easier completion
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

