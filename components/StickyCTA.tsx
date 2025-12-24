'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StickyCTAProps {
  text: string
  href?: string
  onClick?: () => void
  showAfterScroll?: number
}

export default function StickyCTA({ text, href, onClick, showAfterScroll = 400 }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])
  
  if (!isVisible) return null
  
  const buttonClasses = "block w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-3.5 rounded-full transition-all duration-200 shadow-md text-center min-h-[48px] active:scale-[0.98]"
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-lg animate-slide-up">
      {onClick ? (
        <button
          onClick={onClick}
          className={buttonClasses}
        >
          {text} →
        </button>
      ) : href ? (
        <Link
          href={href}
          className={buttonClasses}
          onTouchStart={() => {}}
        >
          {text} →
        </Link>
      ) : null}
    </div>
  )
}
