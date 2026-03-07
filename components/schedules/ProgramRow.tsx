'use client'

import { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

interface ProgramRowProps {
  program: Program
  onRegister: (program: Program) => void
  isLast?: boolean
}

function condenseSchedule(schedule: { day: string; time: string; coach?: string }[]): string {
  const byTime: Record<string, string[]> = {}
  schedule.forEach(s => {
    if (!byTime[s.time]) byTime[s.time] = []
    byTime[s.time].push(s.day.slice(0, 3))
  })
  return Object.entries(byTime)
    .map(([time, days]) => `${days.join('/')} ${time}`)
    .join(' · ')
}

function getCoaches(schedule: { coach?: string }[]): string {
  const unique = [...new Set(schedule.map(s => s.coach).filter(Boolean))]
  return unique.join(', ')
}

export default function ProgramRow({ program, onRegister, isLast }: ProgramRowProps) {
  const getPrice = (): { amount: number; label: string } | null => {
    if (program.pricing['1x']) return { amount: program.pricing['1x'], label: '/qtr' }
    if (program.pricing.monthly) return { amount: program.pricing.monthly, label: '/mo' }
    return null
  }

  const price = getPrice()
  const schedule = condenseSchedule(program.schedule)
  const coaches = getCoaches(program.schedule)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <div className={!isLast ? 'border-b border-black/[0.06]' : ''}>
      {/* Desktop — compact horizontal row */}
      <div className="hidden md:flex items-center gap-6 px-6 py-3.5">
        <div className="w-[200px] flex-shrink-0">
          <h3 className="font-serif text-[17px] font-medium text-brand-pacific-dusk leading-snug">
            {program.program}
          </h3>
          <p className="font-sans text-[12px] text-brand-pacific-dusk/50 mt-0.5">
            Ages {program.ages} · {program.duration}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-snug truncate">
            {schedule}
          </p>
          {coaches && (
            <p className="font-sans text-[11px] text-brand-pacific-dusk/40 mt-0.5 truncate">
              {coaches}
            </p>
          )}
        </div>

        <div className="w-[110px] flex-shrink-0 text-right">
          {price && (
            <span className="font-serif text-[18px] font-medium text-brand-pacific-dusk">
              ${price.amount}
              <span className="font-sans text-[11px] text-brand-pacific-dusk/50 ml-0.5">{price.label}</span>
            </span>
          )}
          {program.pricing.drop_in != null && (
            <p className="font-sans text-[11px] text-brand-pacific-dusk/40">
              Drop-in ${program.pricing.drop_in}
            </p>
          )}
        </div>

        <button
          onClick={handleRegister}
          aria-label={`Register for ${program.program}`}
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-2.5 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
        >
          Register
          <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Mobile — compact card */}
      <div className="md:hidden px-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-serif text-[17px] font-medium text-brand-pacific-dusk leading-snug">
              {program.program}
            </h3>
            <p className="font-sans text-[12px] text-brand-pacific-dusk/50 mt-0.5">
              Ages {program.ages} · {program.duration}
            </p>
          </div>
          {price && (
            <div className="flex-shrink-0 text-right">
              <span className="font-serif text-[18px] font-medium text-brand-pacific-dusk">
                ${price.amount}
              </span>
              <span className="font-sans text-[11px] text-brand-pacific-dusk/50 ml-0.5">{price.label}</span>
              {program.pricing.drop_in != null && (
                <p className="font-sans text-[11px] text-brand-pacific-dusk/40">
                  Drop-in ${program.pricing.drop_in}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-3">
          {schedule}
          {coaches && (
            <span className="text-brand-pacific-dusk/40"> · {coaches}</span>
          )}
        </p>

        <button
          onClick={handleRegister}
          aria-label={`Register for ${program.program}`}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-2.5 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
        >
          Register
          <svg className="w-3 h-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
