'use client'

import { useMemo, memo } from 'react'
import type { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

function getPriceFromPricing(p: Program['pricing']): { amount: number; label: string; fromMultiple?: boolean } | null {
  const monthly = p.monthly
  const oneX = p['1x']
  const twoX = p['2x']
  const threeX = p['3x']
  const seasonPrices = [oneX, twoX, threeX].filter((n): n is number => typeof n === 'number')
  if (monthly != null && (seasonPrices.length === 0 || monthly <= Math.min(...seasonPrices))) {
    return { amount: monthly, label: '/mo' }
  }
  if (seasonPrices.length >= 1) {
    const min = Math.min(...seasonPrices)
    return {
      amount: min,
      label: '/season',
      fromMultiple: seasonPrices.length > 1 || (monthly != null && monthly !== min),
    }
  }
  if (oneX != null) return { amount: oneX, label: '/season' }
  return null
}

interface ProgramRowProps {
  program: Program
  onRegister: (program: Program) => void
  isLast?: boolean
}

function ProgramRowInner({ program, onRegister, isLast }: ProgramRowProps) {
  const { monthly, '1x': oneX, '2x': twoX, '3x': threeX } = program.pricing
  const price = useMemo(
    () => getPriceFromPricing(program.pricing),
    // Intentionally only primitives that affect "from" price; program.pricing ref would force recompute every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthly, oneX, twoX, threeX]
  )

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
        </div>

        {/* Col 2: Schedule */}
        <div className="w-[200px] flex-shrink-0">
          {program.schedule.map((slot, i) => (
            <p key={i} className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
              <span className="inline-block w-[38px] font-medium text-brand-pacific-dusk">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
              {slot.note && (
                <span className="text-brand-pacific-dusk/60"> — {slot.note}</span>
              )}
            </p>
          ))}
        </div>

        {/* Col 3: Price + Register */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right w-[120px]">
            {price && (
              <p className="font-headline text-[20px] font-medium text-brand-pacific-dusk leading-tight">
                {price.fromMultiple ? 'From ' : ''}${price.amount}
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
            {program.pricingNote && (
              <p className="font-sans text-[11px] text-brand-pacific-dusk/60 mt-1">
                {program.pricingNote}
              </p>
            )}
          </div>

          <button
            onClick={handleRegister}
            aria-label={`Register for ${program.program}`}
            className="inline-flex items-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 min-h-[48px]"
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
          Ages {program.ages} · {program.duration} · {program.location}
        </p>

        <div className="mt-4 space-y-0.5">
          {program.schedule.map((slot, i) => (
            <p key={i} className="font-sans text-[13px] text-brand-pacific-dusk/80">
              <span className="inline-block w-[38px] font-medium text-brand-pacific-dusk">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
              {slot.note && (
                <span className="text-brand-pacific-dusk/60"> — {slot.note}</span>
              )}
            </p>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2">
          {price && (
            <span className="font-headline text-[20px] font-medium text-brand-pacific-dusk">
              {price.fromMultiple ? 'From ' : ''}${price.amount}
              <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">
                {price.label}
              </span>
            </span>
          )}
          {program.pricing.drop_in != null && (
            <span className="font-sans text-[12px] text-brand-pacific-dusk/70">
              Drop-in ${program.pricing.drop_in}
            </span>
          )}
          {program.pricingNote && (
            <p className="font-sans text-[11px] text-brand-pacific-dusk/60 w-full mt-1">
              {program.pricingNote}
            </p>
          )}
        </div>

        <button
          onClick={handleRegister}
          aria-label={`Register for ${program.program}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-3 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 min-h-[48px]"
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

export default memo(ProgramRowInner)
