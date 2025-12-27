'use client'

import { useEffect, useState, useRef } from 'react'
import { Shield, Award, Users, Star, CheckCircle } from 'lucide-react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let startTime: number
          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function TrustBadges() {
  return (
    <section className="bg-white py-12 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Google Reviews Highlight */}
        <div className="flex justify-center mb-10">
          <a 
            href="https://www.google.com/maps/place/Laguna+Beach+Tennis+Academy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-[#FAF8F3] hover:bg-[#F4EDE4] px-6 py-4 rounded-full transition-all duration-300"
          >
            {/* Google Logo */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-[#FBBC05] fill-[#FBBC05]" />
                ))}
              </div>
              <span className="font-sans text-[18px] font-bold text-black">5.0</span>
            </div>
            
            {/* Review Count */}
            <span className="font-sans text-[14px] text-black/60 group-hover:text-black/80 transition-colors">
              47 reviews
            </span>
            
            {/* Arrow */}
            <svg className="w-4 h-4 text-black/40 group-hover:text-black/60 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={93} suffix="%" />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              Improve in 8 Weeks
            </p>
          </div>
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={500} suffix="+" />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              Players Trained
            </p>
          </div>
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={25} suffix="+" />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              Years Experience
            </p>
          </div>
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={20} suffix="+" />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              D1 Placements
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Shield className="h-5 w-5 text-black" />
            <span className="font-sans text-[13px] font-medium">USTA Certified</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Award className="h-5 w-5 text-black" />
            <span className="font-sans text-[13px] font-medium">PTR Certified</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-sans text-[13px] font-medium">Background Checked</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Users className="h-5 w-5 text-black" />
            <span className="font-sans text-[13px] font-medium">ATP/WTA Coaching Experience</span>
          </div>
        </div>
      </div>
    </section>
  )
}

