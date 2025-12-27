'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface StickyCTAProps {
  text: string
  href?: string
  onClick?: () => void
  showAfterScroll?: number
  urgencyText?: string
}

// Context-aware urgency messages based on page
const getContextualMessage = (pathname: string): { text: string; highlight?: string } => {
  if (pathname.includes('/schedules')) {
    return { text: 'Winter 2026 Registration Open', highlight: 'View Programs' }
  }
  if (pathname.includes('/camps')) {
    return { text: 'Summer Camps · Limited Spots', highlight: 'Reserve Now' }
  }
  if (pathname.includes('/jtt')) {
    return { text: 'JTT Season Starting Soon', highlight: 'Join Team' }
  }
  if (pathname.includes('/fitness')) {
    return { text: 'Fit4Tennis · First Session Free', highlight: 'Get Started' }
  }
  return { text: 'Winter 2026 · Registration Open' }
}

export default function StickyCTA({ 
  text, 
  href, 
  onClick, 
  showAfterScroll = 400,
  urgencyText
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const contextMessage = getContextualMessage(pathname)
  const displayUrgency = urgencyText || contextMessage.text
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])
  
  if (!isVisible) return null
  
  const buttonClasses = "flex-1 bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[15px] py-3.5 rounded-full transition-all duration-200 shadow-md text-center min-h-[48px] active:scale-[0.98] flex items-center justify-center gap-2"
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-lg animate-slide-up">
      {/* Urgency Text with Context */}
      {displayUrgency && (
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="font-sans text-[12px] text-black/60">{displayUrgency}</span>
        </div>
      )}
      
      <div className="flex gap-3">
        {onClick ? (
          <button
            onClick={onClick}
            className={buttonClasses}
          >
            {text}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        ) : href ? (
          <Link
            href={href}
            className={buttonClasses}
            onTouchStart={() => {}}
          >
            {text}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : null}
        
        {/* Secondary CTA - Call */}
        <a
          href="tel:+19494646645"
          className="flex items-center justify-center w-14 h-14 bg-[#FAF8F3] rounded-full border border-black/10 active:scale-95 transition-transform"
          aria-label="Call us"
        >
          <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
