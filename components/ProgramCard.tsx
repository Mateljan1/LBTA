'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react'

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
    if (program.pricing['1x']) return `$${program.pricing['1x']}`
    if (program.pricing.monthly) return `$${program.pricing.monthly}`
    return 'See pricing'
  }
  
  // Get billing period label
  const getBillingLabel = () => {
    if (program.pricing['1x']) return 'per quarter'
    if (program.pricing.monthly) return 'per month'
    return ''
  }
  
  // Get session info
  const getSessionInfo = () => {
    const count = program.schedule.length
    return `${count} session${count > 1 ? 's' : ''} weekly`
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
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-3xl shadow-soft hover:shadow-hover transition-all duration-200 overflow-hidden border-2 ${
        isExpanded ? 'border-lbta-orange/40' : 'border-transparent'
      }`}
    >
      {/* COLLAPSED VIEW - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 md:p-6 text-left focus:outline-none focus:ring-2 focus:ring-lbta-orange rounded-3xl transition-all"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${program.program} details`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Program Name + Age */}
            <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-black mb-1 leading-tight">
              {program.program}
            </h3>
            <p className="font-sans text-[14px] md:text-[15px] text-black/60 mb-3">
              Ages {program.ages} · {program.duration}
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap gap-3 mb-3">
              <div className="flex items-center gap-1.5 text-[13px] md:text-[14px] text-black/70">
                <MapPin className="w-3.5 h-3.5 text-lbta-orange flex-shrink-0" />
                <span className="font-sans">{program.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] md:text-[14px] text-black/70">
                <Clock className="w-3.5 h-3.5 text-lbta-orange flex-shrink-0" />
                <span className="font-sans">{getSessionInfo()}</span>
              </div>
            </div>
            
            {/* Base Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-[13px] text-black/60">Starting at</span>
              <span className="font-serif text-[22px] md:text-[24px] font-bold text-lbta-orange">
                {getBasePrice()}
              </span>
              <span className="font-sans text-[13px] text-black/60">
                {getBillingLabel()}
              </span>
            </div>
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-lbta-red" />
            ) : (
              <ChevronDown className="w-6 h-6 text-lbta-orange" />
            )}
          </div>
        </div>
      </button>
      
      {/* EXPANDED VIEW - Schedule + Pricing + Register */}
      {isExpanded && (
        <div className="px-4 md:px-6 pb-4 md:pb-6 animate-fade-in-up">
          {/* Description */}
          <p className="font-sans text-[14px] md:text-[15px] text-black/70 leading-relaxed mb-6 italic">
            {program.description}
          </p>
          
          {/* Schedule Table */}
          <div className="mb-6">
            <h4 className="font-sans font-semibold text-[15px] md:text-[16px] text-black mb-3">
              Class Schedule
            </h4>
            <div className="bg-[#FAF8F3] rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-[12px] md:text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] md:text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#FAF8F3] divide-y divide-gray-200">
                  {program.schedule.map((slot, index) => (
                    <tr key={index} className="hover:bg-white/50 transition-colors">
                      <td className="px-4 py-3 font-sans text-[14px] md:text-[15px] text-black font-medium">
                        {slot.day}
                      </td>
                      <td className="px-4 py-3 font-sans text-[14px] md:text-[15px] text-black/80">
                        {slot.time}
                        {slot.note && (
                          <span className="block md:inline md:ml-2 text-[12px] md:text-[13px] text-lbta-orange italic mt-1 md:mt-0">
                            {slot.note}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pricing Options */}
          <div className="mb-6">
            <h4 className="font-sans font-semibold text-[15px] md:text-[16px] text-black mb-3">
              Pricing Options
            </h4>
            
            {/* Desktop Grid Layout */}
            <div className="hidden md:block bg-[#FAF8F3] rounded-xl p-4 md:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {program.pricing['1x'] && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">1× per week</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['1x']}
                    </p>
                  </div>
                )}
                {program.pricing['2x'] && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">2× per week</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['2x']}
                    </p>
                  </div>
                )}
                {program.pricing['3x'] && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">3× per week</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['3x']}
                    </p>
                  </div>
                )}
                {program.pricing['4x'] && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">4× per week</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['4x']}
                    </p>
                  </div>
                )}
                {program.pricing['5x'] && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">5× per week</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['5x']}
                    </p>
                  </div>
                )}
                {program.pricing.monthly && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">Monthly</p>
                    <p className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
                      ${program.pricing.monthly}
                    </p>
                  </div>
                )}
                {program.pricing.drop_in && (
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <p className="font-sans text-[12px] md:text-[13px] text-black/60 mb-1">Drop-in</p>
                    <p className="font-serif text-[16px] md:text-[18px] font-semibold text-black/80">
                      ${program.pricing.drop_in}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Stacked Layout */}
            <div className="md:hidden bg-[#FAF8F3] rounded-xl p-4 space-y-2">
              {program.pricing['1x'] && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">1× per week</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing['1x']}</span>
                </div>
              )}
              {program.pricing['2x'] && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">2× per week</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing['2x']}</span>
                </div>
              )}
              {program.pricing['3x'] && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">3× per week</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing['3x']}</span>
                </div>
              )}
              {program.pricing['4x'] && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">4× per week</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing['4x']}</span>
                </div>
              )}
              {program.pricing['5x'] && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">5× per week</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing['5x']}</span>
                </div>
              )}
              {program.pricing.monthly && (
                <div className="flex justify-between items-center py-2.5 border-b border-gray-200">
                  <span className="font-sans text-[15px] text-black/70">Monthly</span>
                  <span className="font-serif text-[20px] font-bold text-lbta-orange">${program.pricing.monthly}</span>
                </div>
              )}
              {program.pricing.drop_in && (
                <div className="flex justify-between items-center py-2.5">
                  <span className="font-sans text-[15px] text-black/60">Drop-in</span>
                  <span className="font-serif text-[18px] font-semibold text-black/80">${program.pricing.drop_in}</span>
                </div>
              )}
            </div>
            
            {/* Billing Note */}
            <p className="font-sans text-[12px] md:text-[13px] text-black/50 italic mt-2">
              {program.pricing['1x'] 
                ? 'Prices are per 13-week quarter' 
                : 'Monthly billing'}
            </p>
          </div>
          
          {/* Register Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRegister(program)
            }}
            className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px] focus:outline-none focus:ring-2 focus:ring-lbta-red focus:ring-offset-2"
          >
            Register for {program.program} →
          </button>
        </div>
      )}
    </div>
  )
}
