'use client'

import { useMemo, memo } from 'react'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

type PricingKey = 'monthly' | '1x' | '2x' | '3x' | '4x' | '5x' | 'saturday1x' | 'drop_in'

function getPricingRows(pricing: Program['pricing']): Array<{ key: PricingKey; label: string; amount: number }> {
  const order: PricingKey[] = ['1x', '2x', '3x', '4x', '5x', 'monthly', 'saturday1x', 'drop_in']
  const labels: Record<PricingKey, string> = {
    '1x': '1x/wk',
    '2x': '2x/wk',
    '3x': '3x/wk',
    '4x': '4x/wk',
    '5x': '5x/wk',
    monthly: 'Monthly',
    saturday1x: 'Saturday option',
    drop_in: 'Drop-in',
  }

  return order
    .map((key) => {
      const amount = pricing[key]
      if (typeof amount !== 'number') return null
      return { key, label: labels[key], amount }
    })
    .filter((row): row is { key: PricingKey; label: string; amount: number } => row !== null)
}

interface ProgramRowProps {
  program: Program
  onRegister: (program: Program) => void
  isLast?: boolean
}

function ProgramRowInner({ program, onRegister, isLast }: ProgramRowProps) {
  const { monthly, '1x': oneX, '2x': twoX, '3x': threeX, '4x': fourX, '5x': fiveX, saturday1x, drop_in: dropIn } = program.pricing
  const pricingRows = useMemo(
    () => getPricingRows(program.pricing),
    // Intentionally only primitives that affect pricing rows; avoid object-ref churn
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [monthly, oneX, twoX, threeX, fourX, fiveX, saturday1x, dropIn]
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

        {/* Col 3: Pricing tiers + Register */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right w-[190px]">
            {pricingRows.length > 0 && (
              <div className="space-y-0.5">
                {pricingRows.map((row) => (
                  <p key={row.key} className="font-sans text-[12px] text-brand-pacific-dusk/80 leading-relaxed">
                    <span className="font-medium text-brand-pacific-dusk">{row.label}</span>: ${row.amount}
                  </p>
                ))}
              </div>
            )}
            {program.pricingNote && (
              <p className="font-sans text-[11px] text-brand-pacific-dusk/60 mt-1">
                {program.pricingNote}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {program.inquiryLabel && (
              <Link
                href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
                className="font-sans text-[11px] font-medium tracking-[2.5px] uppercase text-brand-pacific-dusk/80 hover:text-brand-pacific-dusk underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 min-h-[48px] inline-flex items-center"
                aria-label={`${program.inquiryLabel} for ${program.program}`}
              >
                {program.inquiryLabel}
              </Link>
            )}
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
      </div>

      {/* Mobile — stacked card */}
      <div className="md:hidden px-4 py-5 min-w-0">
        <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk leading-snug break-words">
          {program.program}
        </h3>
        <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1 break-words">
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

        <div className="mt-4 pt-4 border-t border-black/[0.06]">
          {pricingRows.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {pricingRows.map((row) => (
                <p key={row.key} className="font-sans text-[12px] text-brand-pacific-dusk/80">
                  <span className="font-medium text-brand-pacific-dusk">{row.label}</span>: ${row.amount}
                </p>
              ))}
            </div>
          )}
          {program.pricingNote && (
            <p className="font-sans text-[11px] text-brand-pacific-dusk/60 w-full mt-2">
              {program.pricingNote}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {program.inquiryLabel && (
            <Link
              href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
              className="font-sans text-[11px] font-medium tracking-[2.5px] uppercase text-brand-pacific-dusk/80 hover:text-brand-pacific-dusk underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 min-h-[48px] inline-flex items-center"
              aria-label={`${program.inquiryLabel} for ${program.program}`}
            >
              {program.inquiryLabel}
            </Link>
          )}
          <button
            onClick={handleRegister}
            aria-label={`Register for ${program.program}`}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-3 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 min-h-[48px]"
          >
            Register
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ProgramRowInner)
