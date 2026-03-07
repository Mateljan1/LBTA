'use client'

import { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

interface ProgramRowProps {
  program: Program
  onRegister: (program: Program) => void
  isLast?: boolean
}

export default function ProgramRow({ program, onRegister, isLast }: ProgramRowProps) {
  const getPrice = () => {
    if (program.pricing['1x']) return { amount: program.pricing['1x'], label: '/quarter' }
    if (program.pricing.monthly) return { amount: program.pricing.monthly, label: '/month' }
    return null
  }

  const price = getPrice()

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <div className={!isLast ? 'border-b border-black/[0.06]' : ''}>
      {/* Desktop */}
      <div className="hidden md:flex items-start justify-between gap-10 px-8 py-7">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-[22px] font-medium text-brand-pacific-dusk leading-tight mb-1">
            {program.program}
          </h3>
          <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-4">
            Ages {program.ages} · {program.duration} · {program.location}
          </p>
          <div className="space-y-1">
            {program.schedule.map((slot, i) => (
              <div key={i} className="flex items-center gap-5 font-sans text-[14px]">
                <span className="text-brand-pacific-dusk font-medium w-[44px]">
                  {slot.day.slice(0, 3)}
                </span>
                <span className="text-brand-pacific-dusk/80 w-[140px]">{slot.time}</span>
                {slot.coach && (
                  <span className="text-brand-pacific-dusk/50">{slot.coach}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-3 pt-1">
          {price && (
            <div>
              <span className="font-serif text-[28px] font-medium text-brand-pacific-dusk tracking-[-0.02em]">
                ${price.amount}
              </span>
              <span className="font-sans text-[13px] text-brand-pacific-dusk/50 ml-1">
                {price.label}
              </span>
            </div>
          )}
          {program.pricing.drop_in != null && (
            <span className="font-sans text-[13px] text-brand-pacific-dusk/50">
              Drop-in ${program.pricing.drop_in}
            </span>
          )}
          <button
            onClick={handleRegister}
            aria-label={`Register for ${program.program}`}
            className="inline-flex items-center gap-2 bg-black text-white font-sans text-[12px] font-medium tracking-[2.5px] uppercase px-7 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px] mt-1"
          >
            Register
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden px-5 py-6">
        <h3 className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-tight mb-1">
          {program.program}
        </h3>
        <p className="font-sans text-[14px] text-brand-pacific-dusk/60 mb-4">
          Ages {program.ages} · {program.duration}
        </p>

        <div className="space-y-1.5 mb-5">
          {program.schedule.map((slot, i) => (
            <div key={i} className="flex items-center gap-3 font-sans text-[14px]">
              <span className="text-brand-pacific-dusk font-medium w-[40px]">
                {slot.day.slice(0, 3)}
              </span>
              <span className="text-brand-pacific-dusk/80">{slot.time}</span>
              {slot.coach && (
                <span className="text-brand-pacific-dusk/40 text-[13px]">· {slot.coach}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-baseline gap-3 mb-5">
          {price && (
            <span className="font-serif text-[24px] font-medium text-brand-pacific-dusk">
              ${price.amount}
              <span className="font-sans text-[13px] text-brand-pacific-dusk/50 ml-0.5">
                {price.label}
              </span>
            </span>
          )}
          {program.pricing.drop_in != null && (
            <span className="font-sans text-[13px] text-brand-pacific-dusk/50">
              · Drop-in ${program.pricing.drop_in}
            </span>
          )}
        </div>

        <button
          onClick={handleRegister}
          aria-label={`Register for ${program.program}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-black text-white font-sans text-[12px] font-medium tracking-[2.5px] uppercase px-7 py-3.5 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
        >
          Register
          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
