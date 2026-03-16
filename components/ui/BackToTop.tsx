'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 400)
    }

    handleScroll() // Check initial position
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }

  if (!show) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed right-6 z-40 w-12 h-12 min-w-[48px] min-h-[48px] bg-brand-pacific-dusk text-white rounded-full shadow-lg hover:bg-brand-sunset-cliff transition-all duration-300 flex items-center justify-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
      aria-label="Back to top"
      style={{
        bottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <ArrowUp className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden />
    </button>
  )
}

