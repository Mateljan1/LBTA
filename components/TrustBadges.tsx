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
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
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
              <AnimatedCounter end={500} suffix="+" />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              Players Trained
            </p>
          </div>
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={47} />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              5-Star Reviews
            </p>
          </div>
          <div className="text-center">
            <div className="font-serif text-[40px] md:text-[48px] font-light text-black leading-none mb-2">
              <AnimatedCounter end={12} />
            </div>
            <p className="font-sans text-[12px] text-black/50 uppercase tracking-[2px]">
              Programs Offered
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Shield className="h-5 w-5 text-lbta-orange" />
            <span className="font-sans text-[13px] font-medium">USTA Certified</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Award className="h-5 w-5 text-lbta-orange" />
            <span className="font-sans text-[13px] font-medium">PTR Certified</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <CheckCircle className="h-5 w-5 text-lbta-orange" />
            <span className="font-sans text-[13px] font-medium">Background Checked</span>
          </div>
          <div className="flex items-center gap-2 text-[#1a1a1a]/70">
            <Star className="h-5 w-5 text-lbta-orange fill-lbta-orange" />
            <span className="font-sans text-[13px] font-medium">5.0 Google Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}

