'use client'

import { useState, useEffect, useRef } from 'react'

interface Schedule {
  day: string
  time: string
  coach?: string
  location?: string
  note?: string
}

interface Pricing {
  '1x'?: number
  '2x'?: number
  '3x'?: number
  '4x'?: number
  '5x'?: number
  monthly?: number
  drop_in?: number
}

export interface Program {
  id: string
  category: string
  program: string
  ages: string
  location: string
  duration: string
  schedule: Schedule[]
  pricing: Pricing
  description: string
  coach?: string
}

interface ProgramCardProps {
  program: Program
  onRegister: (program: Program) => void
}

export default function ProgramCard({ program, onRegister }: ProgramCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Get base price for display
  const getBasePrice = () => {
    if (program.pricing['1x']) return program.pricing['1x']
    if (program.pricing.monthly) return program.pricing.monthly
    return null
  }
  
  // Get billing period label
  const getBillingLabel = () => {
    if (program.pricing['1x']) return '/quarter'
    if (program.pricing.monthly) return '/month'
    return ''
  }
  
  // Get session info
  const getSessionInfo = () => {
    const count = program.schedule.length
    return `${count}× weekly`
  }
  
  // Auto-scroll to card when expanded
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    }
  }, [isExpanded])
  
  const basePrice = getBasePrice()
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg transition-all duration-300 overflow-hidden ${
        isExpanded 
          ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5' 
          : 'shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
      }`}
    >
      {/* COLLAPSED VIEW - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onTouchStart={() => {}}
        className="w-full p-6 md:p-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-lg transition-all"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${program.program} details`}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            {/* Program Name */}
            <h3 className="font-serif text-[22px] md:text-[24px] font-medium text-[#1a1a1a] mb-1.5 leading-tight tracking-[-0.01em]">
              {program.program}
            </h3>
            
            {/* Age + Duration */}
            <p className="font-sans text-[14px] text-[#666] mb-4">
              Ages {program.ages} · {program.duration}
            </p>
            
            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[#888]">
              <span className="font-sans">{program.location}</span>
              <span className="w-1 h-1 rounded-full bg-[#ccc]" />
              <span className="font-sans">{getSessionInfo()}</span>
            </div>
          </div>
          
          {/* Price + Expand */}
          <div className="flex-shrink-0 text-right">
            {basePrice && (
              <div className="mb-3">
                <span className="font-serif text-[28px] md:text-[32px] font-medium text-[#1a1a1a] tracking-[-0.02em]">
                  ${basePrice}
                </span>
                <span className="font-sans text-[13px] text-[#888] ml-0.5">
                  {getBillingLabel()}
                </span>
              </div>
            )}
            
            {/* Expand Icon */}
            <div className={`w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center transition-all duration-300 ${
              isExpanded ? 'bg-[#1a1a1a] border-[#1a1a1a]' : 'bg-white hover:border-[#ccc]'
            }`}>
              <svg 
                className={`w-4 h-4 transition-all duration-300 ${isExpanded ? 'text-white rotate-180' : 'text-[#666]'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </button>
      
      {/* EXPANDED VIEW - Schedule + Pricing + Register */}
      {isExpanded && (
        <div className="px-6 md:px-7 pb-6 md:pb-7 animate-fade-in-up">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#e5e5e5] to-transparent mb-6" />
          
          {/* Description */}
          <p className="font-sans text-[15px] text-[#555] leading-[1.7] mb-8">
            {program.description}
          </p>
          
          {/* Schedule */}
          <div className="mb-8">
            <h4 className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-4">
              Schedule
            </h4>
            <div className="space-y-0">
              {program.schedule.map((slot, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center py-3 ${
                    index !== program.schedule.length - 1 ? 'border-b border-[#f0f0f0]' : ''
                  }`}
                >
                  <span className="font-sans text-[15px] text-[#1a1a1a] font-medium">
                    {slot.day}
                  </span>
                  <span className="font-sans text-[15px] text-[#666]">
                    {slot.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pricing */}
          <div className="mb-8">
            <h4 className="font-sans text-[11px] font-semibold text-[#999] uppercase tracking-[0.1em] mb-4">
              Investment
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {program.pricing.monthly && (
                <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">Monthly</p>
                  <p className="font-serif text-[22px] font-medium text-[#1a1a1a]">
                    ${program.pricing.monthly}
                  </p>
                </div>
              )}
              {program.pricing['1x'] && (
                <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">1× weekly</p>
                  <p className="font-serif text-[22px] font-medium text-[#1a1a1a]">
                    ${program.pricing['1x']}
                  </p>
                </div>
              )}
              {program.pricing['2x'] && (
                <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">2× weekly</p>
                  <p className="font-serif text-[22px] font-medium text-[#1a1a1a]">
                    ${program.pricing['2x']}
                  </p>
                </div>
              )}
              {program.pricing['3x'] && (
                <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">3× weekly</p>
                  <p className="font-serif text-[22px] font-medium text-[#1a1a1a]">
                    ${program.pricing['3x']}
                  </p>
                </div>
              )}
              {program.pricing['4x'] && (
                <div className="bg-[#fafafa] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">4× weekly</p>
                  <p className="font-serif text-[22px] font-medium text-[#1a1a1a]">
                    ${program.pricing['4x']}
                  </p>
                </div>
              )}
              {program.pricing.drop_in && (
                <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 text-center">
                  <p className="font-sans text-[12px] text-[#888] mb-1">Drop-in</p>
                  <p className="font-serif text-[20px] font-medium text-[#666]">
                    ${program.pricing.drop_in}
                  </p>
                </div>
              )}
            </div>
            
            {/* Billing Note */}
            <p className="font-sans text-[12px] text-[#999] mt-3">
              {program.pricing['1x'] 
                ? 'Billed quarterly · 13 weeks' 
                : 'Billed monthly'}
            </p>
          </div>
          
          {/* Register Button - Desktop */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRegister(program)
            }}
            className="hidden md:flex w-full items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#333] text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 rounded-lg transition-all duration-200 min-h-[52px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
          >
            <span>Begin Registration</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Mobile Sticky Register Button (only when expanded) */}
      {isExpanded && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-[#e8e8e8] px-4 py-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRegister(program)
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] active:bg-[#333] active:scale-[0.98] text-white font-sans text-[14px] font-medium tracking-[0.02em] py-4 rounded-lg transition-all duration-200 min-h-[52px]"
            onTouchStart={() => {}}
          >
            <span>Begin Registration</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
