'use client'

import { useState, useEffect, useRef } from 'react'
import { X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import type { Program } from './ProgramCard'
import { getFormConfig, hasFormConfig } from '@/lib/form-config'
import { trackFormComplete, trackFormSubmit, trackFormAbandon, trackFormLoadTime } from '@/lib/form-analytics'

interface EmbeddedRegistrationPanelProps {
  program: Program | null
  onClose: () => void
}

export default function EmbeddedRegistrationPanel({ program, onClose }: EmbeddedRegistrationPanelProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const [formHeight, setFormHeight] = useState('600px')
  const [isMobile, setIsMobile] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [formStartTime, setFormStartTime] = useState<number>(0)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  
  // Mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show/hide panel with slide animation
  useEffect(() => {
    if (program) {
      setIsVisible(true)
      setFormStartTime(Date.now())
      
      // Track form load time
      const loadStartTime = performance.now()
      setTimeout(() => {
        const loadTime = performance.now() - loadStartTime
        trackFormLoadTime(program.id, 'embedded', loadTime)
      }, 100)
      
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden'
      
      // On mobile, add viewport meta tag adjustment for better experience
      if (isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
        }
      }
    } else {
      setIsVisible(false)
      document.body.style.overflow = 'unset'
      
      // Restore viewport on mobile
      if (isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
        }
      }
      
      // Track form abandonment if form was started but not completed
      // Note: This runs when panel closes, so program may be null at this point
    }
    
    return () => {
      document.body.style.overflow = 'unset'
      if (isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]')
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0')
        }
      }
    }
  }, [program, isMobile, formStartTime, isSuccess])

  // Handle form submission success (via postMessage from AC form)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for ActiveCampaign form submission success
      if (event.data?.type === 'ac-form-success' || event.data?.action === 'form-submitted') {
        if (program) {
          // Track successful form submission
          const timeToComplete = formStartTime > 0 ? Date.now() - formStartTime : 0
          trackFormSubmit(program.id, program.program, program.category, 'embedded', true)
          trackFormComplete(program.id, program.program, program.category, 'embedded', timeToComplete)
        }
        
        setIsSuccess(true)
        setTimeout(() => {
          handleClose()
        }, 3000) // Auto-close after 3 seconds
      }
      
      // Handle form height changes for responsive embedding
      if (event.data?.type === 'ac-form-height' && event.data?.height) {
        setFormHeight(`${event.data.height}px`)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [program, formStartTime])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
      setIsSuccess(false)
      setShowFallback(false)
    }, 300) // Wait for slide-out animation
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Mobile drag handlers for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    setIsDragging(true)
    setDragStartY(e.touches[0].clientY)
    setDragCurrentY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isMobile) return
    const currentY = e.touches[0].clientY
    const deltaY = currentY - dragStartY
    
    setDragCurrentY(currentY)
    
    // Only allow dragging down to close
    if (deltaY > 0 && panelRef.current) {
      panelRef.current.style.transform = `translateY(${Math.min(deltaY, 200)}px)`
      panelRef.current.style.opacity = `${Math.max(0.3, 1 - deltaY / 400)}`
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || !isMobile) return
    setIsDragging(false)
    
    const deltaY = dragCurrentY - dragStartY
    
    if (panelRef.current) {
      // If dragged down more than 100px, close the panel
      if (deltaY > 100) {
        handleClose()
      } else {
        // Snap back to original position
        panelRef.current.style.transform = 'translateY(0)'
        panelRef.current.style.opacity = '1'
      }
    }
  }

  if (!program) return null

  const formConfig = getFormConfig(program.id)
  const hasForm = hasFormConfig(program.id)

  // Fallback to external form link if no embedded form configured
  const handleFallbackRegistration = () => {
    // Open contact form or phone call
    window.open('tel:+19494646645', '_self')
  }

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Embedded Registration Panel */}
      <div
        ref={panelRef}
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl transform transition-all duration-500 ease-out overflow-hidden ${
          isMobile 
            ? 'rounded-t-3xl max-h-[95vh]' 
            : 'rounded-t-3xl max-h-[90vh] mx-4 mb-4 max-w-4xl left-1/2 -translate-x-1/2'
        } ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Panel Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="font-serif text-[20px] md:text-[24px] font-semibold text-black">
                Register for {program.program}
              </h2>
              <p className="font-sans text-[13px] md:text-[14px] text-black/60">
                Ages {program.ages} • {program.location} • {program.duration}
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close registration panel"
            >
              <X className="w-5 h-5 text-black/60" />
            </button>
          </div>
          
          {/* Drag Handle - Enhanced for mobile */}
          <div 
            className={`flex justify-center ${isMobile ? 'mt-3 py-2' : 'mt-2'}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`bg-gray-300 rounded-full transition-all duration-200 ${
              isMobile ? 'w-16 h-1.5' : 'w-12 h-1'
            } ${isDragging ? 'bg-lbta-orange' : ''}`}>
            </div>
          </div>
          {isMobile && (
            <p className="text-center text-[11px] text-black/40 font-sans mt-1">
              Swipe down to close
            </p>
          )}
        </div>

        {/* Panel Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="p-8 md:p-12 text-center">
              <CheckCircle className="w-16 h-16 text-lbta-orange mx-auto mb-6" />
              <h3 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-4">
                Registration Received!
              </h3>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 mb-4">
                Thank you for registering for <span className="font-semibold text-lbta-orange">{program.program}</span>.
              </p>
              <p className="font-sans text-[15px] text-black/60 mb-6">
                Our team will confirm your registration within 24 hours and follow up with payment details.
              </p>
              <button
                onClick={handleClose}
                className="bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-full transition-all duration-200"
              >
                Continue Browsing
              </button>
            </div>
          ) : hasForm && formConfig?.formEmbedCode ? (
            /* EMBEDDED ACTIVECAMPAIGN FORM */
            <div className="p-4 md:p-6">
              {/* Program Summary Card */}
              <div className="bg-gradient-to-r from-lbta-beige/30 to-lbta-orange/10 rounded-xl p-4 md:p-6 mb-6 border border-lbta-orange/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-serif text-[18px] md:text-[20px] font-semibold text-black mb-2">
                      {formConfig.prePopulateData.programName}
                    </h3>
                    <div className="space-y-1 text-[13px] md:text-[14px] text-black/70">
                      <p>📍 {formConfig.prePopulateData.location}</p>
                      <p>⏱️ {formConfig.prePopulateData.duration} sessions</p>
                      <p>💰 {formConfig.prePopulateData.pricing}</p>
                      {formConfig.prePopulateData.ageGroup && (
                        <p>👥 {formConfig.prePopulateData.ageGroup}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-block bg-lbta-orange text-white text-[12px] font-semibold px-3 py-1 rounded-full">
                      {formConfig.prePopulateData.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* ActiveCampaign Form Embed */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div 
                  className="ac-form-container"
                  style={{ minHeight: formHeight }}
                  dangerouslySetInnerHTML={{ 
                    __html: formConfig.formEmbedCode 
                  }}
                />
              </div>
              
              {/* Trust Signals */}
              <div className="mt-6 text-center">
                <p className="font-sans text-[12px] text-black/50 mb-2">
                  🔒 Your information is secure and will only be used for registration purposes.
                </p>
                <p className="font-sans text-[12px] text-black/50">
                  Questions? Call us at <a href="tel:+19494646645" className="text-lbta-orange hover:underline">(949) 464-6645</a>
                </p>
              </div>
            </div>
          ) : (
            /* FALLBACK - NO EMBEDDED FORM CONFIGURED */
            <div className="p-8 md:p-12 text-center">
              <AlertCircle className="w-16 h-16 text-lbta-orange mx-auto mb-6" />
              <h3 className="font-serif text-[24px] md:text-[32px] font-semibold text-black mb-4">
                Almost Ready!
              </h3>
              <p className="font-sans text-[16px] md:text-[18px] text-black/70 mb-6">
                We're setting up the registration form for <span className="font-semibold text-lbta-orange">{program.program}</span>.
              </p>
              <p className="font-sans text-[15px] text-black/60 mb-8">
                In the meantime, please call us directly to secure your spot:
              </p>
              
              <div className="space-y-4">
                <a
                  href="tel:+19494646645"
                  className="block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 px-8 rounded-full transition-all duration-200 hover:shadow-lg"
                >
                  📞 Call (949) 464-6645
                </a>
                <button
                  onClick={handleClose}
                  className="block w-full border-2 border-gray-300 hover:border-lbta-orange text-black/70 hover:text-lbta-orange font-sans font-semibold text-[16px] py-3 px-8 rounded-full transition-all duration-200"
                >
                  Continue Browsing
                </button>
              </div>
              
              <p className="font-sans text-[12px] text-black/50 mt-6">
                Our team typically responds within 2 hours during business hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
