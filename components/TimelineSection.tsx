'use client'

import { useEffect, useRef, useState } from 'react'

const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Laguna Beach Tennis Academy established with a vision for excellence'
  },
  {
    year: '2021',
    title: 'First D1 Placement',
    description: 'Our first student committed to Division 1 college tennis'
  },
  {
    year: '2023',
    title: 'ATP Partnership',
    description: 'Partnership with ATP-certified coaching program launched'
  },
  {
    year: '2025',
    title: '20+ College Placements',
    description: 'Over 20 students placed in Division 1 college tennis programs'
  }
]

export default function TimelineSection() {
  const [visibleMilestones, setVisibleMilestones] = useState<number[]>([])
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([])
  
  useEffect(() => {
    const observers = milestones.map((_, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleMilestones(prev => {
                if (!prev.includes(index)) {
                  return [...prev, index]
                }
                return prev
              })
            }
          })
        },
        { threshold: 0.3 }
      )
      
      if (milestonesRef.current[index]) {
        observer.observe(milestonesRef.current[index]!)
      }
      
      return observer
    })
    
    return () => observers.forEach(observer => observer.disconnect())
  }, [])
  
  return (
    <section className="bg-[#fafafa] py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16">
        <div className="mb-16">
          <p className="font-sans text-[11px] font-semibold text-[#888] uppercase tracking-[0.15em] mb-4">
            Our Journey
          </p>
          <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
            Building Excellence
          </h2>
        </div>
        
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block relative">
          {/* Timeline line */}
          <div className="absolute top-8 left-0 right-0 h-[1px] bg-[#e0e0e0]" />
          
          <div className="grid grid-cols-4 gap-8 relative">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                ref={el => { milestonesRef.current[index] = el }}
                className={`relative transition-all duration-700 ${
                  visibleMilestones.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Year marker */}
                <div className="relative mb-8">
                  <div className="w-4 h-4 rounded-full bg-[#1a1a1a] mx-auto" />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <span className="font-serif text-[32px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
                    {milestone.year}
                  </span>
                  <h3 className="font-sans text-[14px] font-semibold text-[#1a1a1a] uppercase tracking-[0.1em] mt-2 mb-3">
                    {milestone.title}
                  </h3>
                  <p className="font-sans text-[14px] text-[#666] leading-[1.6]">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-[7px] w-[1px] bg-[#e0e0e0]" />
          
          <div className="space-y-10">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                ref={el => { milestonesRef.current[index] = el }}
                className={`relative pl-10 transition-all duration-700 ${
                  visibleMilestones.includes(index)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Dot marker */}
                <div className="absolute left-0 top-1 w-[14px] h-[14px] rounded-full bg-[#1a1a1a]" />
                
                <span className="font-serif text-[28px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
                  {milestone.year}
                </span>
                <h3 className="font-sans text-[13px] font-semibold text-[#1a1a1a] uppercase tracking-[0.1em] mt-1 mb-2">
                  {milestone.title}
                </h3>
                <p className="font-sans text-[14px] text-[#666] leading-[1.6]">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
