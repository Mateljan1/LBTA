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
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">
        <h2 className="font-serif text-[32px] md:text-[48px] font-bold text-black text-center mb-16">
          Our Journey
        </h2>
        
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-lbta-orange/20" />
          <div className="grid grid-cols-4 gap-8 relative">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                ref={el => { milestonesRef.current[index] = el }}
                className={`text-center transition-all duration-500 ${
                  visibleMilestones.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="bg-lbta-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 font-serif font-bold text-[18px] shadow-lg">
                  {milestone.year}
                </div>
                <h3 className="font-serif text-[20px] font-semibold text-black mb-2">
                  {milestone.title}
                </h3>
                <p className="font-sans text-[14px] text-black/70 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden space-y-8">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              ref={el => { milestonesRef.current[index] = el }}
              className={`flex gap-4 transition-all duration-500 ${
                visibleMilestones.includes(index)
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0">
                <div className="bg-lbta-orange text-white w-14 h-14 rounded-full flex items-center justify-center font-serif font-bold text-[16px] shadow-lg">
                  {milestone.year}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-0.5 h-12 bg-lbta-orange/20 mx-auto mt-2" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <h3 className="font-serif text-[18px] font-semibold text-black mb-1">
                  {milestone.title}
                </h3>
                <p className="font-sans text-[14px] text-black/70 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
