'use client'

import { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

interface ProgramRowProps {
  program: Program
  onRegister: (program: Program) => void
  isLast?: boolean
}

export default function ProgramRow({ program, onRegister, isLast }: ProgramRowProps) {
  const getPrice = (): { amount: number; label: string } | null => {
    if (program.pricing['1x']) return { amount: program.pricing['1x'], label: '/quarter' }
    if (program.pricing.monthly) return { amount: program.pricing.monthly, label: '/month' }
    return null
  }

  const price = getPrice()
  const coach = program.schedule[0]?.coach ?? program.coach

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <div className={!isLast ? 'border-b border-black/[0.06]' : ''}>
      {/* Desktop — 3-column grid row */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-8 px-6 py-5">
        {/* Col 1: Program info */}
        <div className="min-w-0">
          <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk leading-snug">
            {program.program}
          </h3>
          <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
            Ages {program.ages} · {program.duration} · {program.location}
          </p>
          {coach && (
            <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
              Coach: {coach}
            </p>
          )}
        </div>

        {/* Col 2: Schedule */}
        <div className="w-[180px] flex-shrink-0">
          {program.schedule.map((slot, i) => (
            <p key={i} className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
              <span className="inline-block w-[38px] font-medium text-brand-pacific-dusk">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
            </p>
          ))}
        </div>

        {/* Col 3: Price + Register */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right w-[120px]">
            {price && (
              <p className="font-headline text-[20px] font-medium text-brand-pacific-dusk leading-tight">
                ${price.amount}
                <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">
                  {price.label}
                </span>
              </p>
            )}
            {program.pricing.drop_in != null && (
              <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
                Drop-in: ${program.pricing.drop_in}
              </p>
            )}
          </div>

          <button
            onClick={handleRegister}
            aria-label={`Register for ${program.program}`}
            className="inline-flex items-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
          >
            Register
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile — stacked card */}
      <div className="md:hidden px-4 py-5">
        <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk leading-snug">
          {program.program}
        </h3>
        <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
          Ages {program.ages} · {program.duration}
        </p>
        {coach && (
          <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
            Coach: {coach}
          </p>
        )}

        <div className="mt-4 space-y-0.5">
          {program.schedule.map((slot, i) => (
            <p key={i} className="font-sans text-[13px] text-brand-pacific-dusk/80">
              <span className="inline-block w-[38px] font-medium text-brand-pacific-dusk">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
            </p>
          ))}
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          {price && (
            <span className="font-headline text-[18px] font-medium text-brand-pacific-dusk">
              ${price.amount}
              <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">
                {price.label}
              </span>
            </span>
          )}
          {program.pricing.drop_in != null && (
            <span className="font-sans text-[12px] text-brand-pacific-dusk/70">
              · Drop-in ${program.pricing.drop_in}
            </span>
          )}
        </div>

        <button
          onClick={handleRegister}
          aria-label={`Register for ${program.program}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-3 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
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
