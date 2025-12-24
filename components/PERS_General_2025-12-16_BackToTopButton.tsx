'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling past ~800px (roughly 3 cards)
      if (window.scrollY > 800) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    
    window.addEventListener('scroll', toggleVisibility)
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  if (!isVisible) return null
  
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 bg-lbta-orange hover:bg-lbta-red text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-lbta-orange focus:ring-offset-2"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  )
}
