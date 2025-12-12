'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Clock, Users } from 'lucide-react'

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
  
  // Get base price for display
  const getBasePrice = () => {
    if (program.pricing['1x']) return `$${program.pricing['1x']}`
    if (program.pricing.monthly) return `$${program.pricing.monthly}/mo`
    return 'See pricing'
  }
  
  // Get frequency label
  const getFrequencyLabel = () => {
    if (program.pricing['1x']) return '/quarter'
    if (program.pricing.monthly) return '/month'
    return ''
  }
  
  return (
    <div className="bg-[#FAF8F3] rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 overflow-hidden">
      {/* COLLAPSED VIEW - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 md:p-8 text-left focus:outline-none focus:ring-2 focus:ring-lbta-orange rounded-2xl transition-all"
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Program Name + Age */}
            <h3 className="font-serif text-[22px] md:text-[26px] font-semibold text-black mb-2 leading-tight">
              {program.program}
            </h3>
            <p className="font-sans text-[15px] text-black/70 mb-4">
              Ages {program.ages} · {program.duration}
            </p>
            
            {/* Quick Info Icons */}
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-2 text-[14px] text-black/70">
                <MapPin className="w-4 h-4 text-lbta-orange" />
                <span className="font-sans">{program.location}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-black/70">
                <Clock className="w-4 h-4 text-lbta-orange" />
                <span className="font-sans">{program.schedule.length} time{program.schedule.length > 1 ? 's' : ''} available</span>
              </div>
            </div>
            
            {/* Base Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-[24px] md:text-[28px] font-bold text-lbta-orange">
                {getBasePrice()}
              </span>
              <span className="font-sans text-[14px] text-black/60">
                {getFrequencyLabel()}
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
        <div className="px-6 md:px-8 pb-6 md:pb-8 animate-in">
          {/* Description */}
          <p className="font-sans text-[15px] text-black/70 leading-relaxed mb-6 italic">
            {program.description}
          </p>
          
          {/* Schedule Table */}
          <div className="mb-6">
            <h4 className="font-sans font-semibold text-[16px] text-black mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-lbta-orange" />
              Class Schedule
            </h4>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide">
                      Day
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide">
                      Coach
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {program.schedule.map((slot, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-sans text-[15px] text-black font-medium">
                        {slot.day}
                      </td>
                      <td className="px-4 py-3 font-sans text-[15px] text-black/80">
                        {slot.time}
                        {slot.note && (
                          <span className="ml-2 text-[13px] text-lbta-orange italic">
                            ({slot.note})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-sans text-[15px] text-black/80">
                        {slot.coach || 'Staff'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pricing Table */}
          <div className="mb-6">
            <h4 className="font-sans font-semibold text-[16px] text-black mb-3">
              Pricing Options
            </h4>
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {program.pricing['1x'] && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">1× per week</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['1x']}
                    </p>
                  </div>
                )}
                {program.pricing['2x'] && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">2× per week</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['2x']}
                    </p>
                  </div>
                )}
                {program.pricing['3x'] && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">3× per week</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['3x']}
                    </p>
                  </div>
                )}
                {program.pricing['4x'] && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">4× per week</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['4x']}
                    </p>
                  </div>
                )}
                {program.pricing['5x'] && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">5× per week</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing['5x']}
                    </p>
                  </div>
                )}
                {program.pricing.monthly && (
                  <div className="text-center p-3 bg-[#FAF8F3] rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">Monthly</p>
                    <p className="font-sans text-[20px] font-bold text-lbta-orange">
                      ${program.pricing.monthly}
                    </p>
                  </div>
                )}
                {program.pricing.drop_in && (
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <p className="font-sans text-[13px] text-black/60 mb-1">Drop-in</p>
                    <p className="font-sans text-[18px] font-semibold text-black/80">
                      ${program.pricing.drop_in}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Register Button */}
          <button
            onClick={() => onRegister(program)}
            className="w-full bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md min-h-[48px] focus:outline-none focus:ring-2 focus:ring-lbta-red focus:ring-offset-2"
          >
            Register for {program.program} →
          </button>
        </div>
      )}
    </div>
  )
}
