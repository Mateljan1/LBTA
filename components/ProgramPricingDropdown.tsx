'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface PricingOption {
  frequency: string
  price: number
  dropIn?: number
}

interface ProgramPricingDropdownProps {
  pricing: {
    '1x'?: number
    '2x'?: number
    '3x'?: number
    drop_in?: number
  }
  isQuarterly?: boolean
}

export default function ProgramPricingDropdown({ pricing, isQuarterly = true }: ProgramPricingDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const pricingOptions: Array<{ label: string; price: number }> = []
  
  if (pricing['1x']) pricingOptions.push({ label: '1× per week', price: pricing['1x'] })
  if (pricing['2x']) pricingOptions.push({ label: '2× per week', price: pricing['2x'] })
  if (pricing['3x']) pricingOptions.push({ label: '3× per week', price: pricing['3x'] })
  
  const basePrice = pricingOptions[0]?.price || 0
  const billingLabel = isQuarterly ? 'per quarter' : 'per month'
  
  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left py-3 px-4 bg-[#FAF8F3] rounded-lg hover:bg-lbta-orange/10 transition-all duration-200"
        aria-expanded={isExpanded}
      >
        <div>
          <span className="font-serif text-[18px] md:text-[20px] font-bold text-lbta-orange">
            ${basePrice}
          </span>
          <span className="font-sans text-[13px] text-black/60 ml-2">
            {billingLabel}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-lbta-orange" />
        ) : (
          <ChevronDown className="w-5 h-5 text-lbta-orange" />
        )}
      </button>
      
      {isExpanded && (
        <div className="mt-2 bg-white rounded-lg p-4 space-y-2 border border-gray-200 animate-fade-in-up">
          {pricingOptions.map((option, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="font-sans text-[14px] md:text-[15px] text-black/70">
                {option.label}
              </span>
              <span className="font-serif text-[18px] font-bold text-lbta-orange">
                ${option.price}
              </span>
            </div>
          ))}
          {pricing.drop_in && (
            <div className="flex justify-between items-center py-2 pt-3 border-t border-gray-200">
              <span className="font-sans text-[14px] text-black/60">Drop-in</span>
              <span className="font-serif text-[16px] font-semibold text-black/80">
                ${pricing.drop_in}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
