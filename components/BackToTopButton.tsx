'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling past ~600px
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      // Calculate scroll progress
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((window.scrollY / windowHeight) * 100, 100)
      setScrollProgress(progress)
    }
    
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    
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
      className="
        fixed bottom-6 right-6 z-40
        w-12 h-12
        bg-black hover:bg-gray-800 
        text-white 
        rounded-full 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        transform hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        group
        hidden md:flex items-center justify-center
      "
      aria-label="Scroll to top"
      style={{
        animation: 'fadeInUp 0.3s ease-out'
      }}
    >
      {/* Progress Ring */}
      <svg 
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 22}`}
          strokeDashoffset={`${2 * Math.PI * 22 * (1 - scrollProgress / 100)}`}
          className="transition-all duration-150"
        />
      </svg>
      
      {/* Arrow Icon */}
      <ArrowUp className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  )
}
