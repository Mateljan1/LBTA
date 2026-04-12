'use client'

import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

interface SchedulesProgramCardProps {
  program: Program
  onRegister: (program: Program) => void
}

function deriveLevelBadge(program: Program): string {
  const haystack = `${program.program} ${program.ages} ${program.description}`.toLowerCase()
  if (haystack.includes('true beginner') || haystack.includes('beginner')) return 'Beginner'
  if (haystack.includes('utr 5+') || haystack.includes('advanced')) return 'Advanced'
  if (haystack.includes('competitive') || haystack.includes('match play')) return 'Competitive'
  if (haystack.includes('intermediate') || haystack.includes('ntrp 3')) return 'Intermediate'
  return 'All Levels'
}

function getPrimaryPrice(program: Program): { label: string; amount: number } | null {
  const pricing = program.pricing
  if (typeof pricing.monthly === 'number') return { label: 'Monthly', amount: pricing.monthly }
  if (typeof pricing['1x'] === 'number') return { label: '1x/wk', amount: pricing['1x'] }
  if (typeof pricing.drop_in === 'number') return { label: 'Drop-in', amount: pricing.drop_in }
  return null
}

export default function SchedulesProgramCard({ program, onRegister }: SchedulesProgramCardProps) {
  const levelBadge = deriveLevelBadge(program)
  const primaryPrice = getPrimaryPrice(program)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-black/[0.08] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/60">
            {program.category}
          </p>
          <h4 className="font-headline text-[28px] leading-[1.02] text-brand-pacific-dusk">{program.program}</h4>
        </div>
        <span className="rounded-full bg-brand-sandstone px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk">
          {levelBadge}
        </span>
      </div>

      <p className="mb-4 font-sans text-[14px] leading-relaxed text-brand-pacific-dusk/75">
        Ages {program.ages} · {program.duration}
      </p>
      <p className="mb-4 font-sans text-[13px] leading-relaxed text-brand-pacific-dusk/70">{program.location}</p>

      <div className="mb-5 space-y-1.5 rounded-[2px] bg-brand-morning-light p-3">
        {program.schedule.slice(0, 3).map((slot) => (
          <p key={`${program.id}-${slot.day}-${slot.time}`} className="font-sans text-[13px] text-brand-pacific-dusk/80">
            <span className="mr-2 inline-block min-w-[36px] font-medium text-brand-pacific-dusk">
              {slot.day.slice(0, 3)}
            </span>
            {slot.time}
          </p>
        ))}
      </div>

      <div className="mb-5 flex items-baseline gap-2">
        {primaryPrice ? (
          <>
            <p className="font-headline text-[38px] leading-none text-brand-pacific-dusk">${primaryPrice.amount}</p>
            <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/60">
              {primaryPrice.label}
            </p>
          </>
        ) : (
          <p className="font-sans text-[12px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/60">
            Contact for rates
          </p>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {program.inquiryLabel ? (
          <Link
            href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
            className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-brand-pacific-dusk/20 px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.1px] text-brand-pacific-dusk transition-all duration-300 hover:border-brand-victoria-cove hover:bg-brand-sandstone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            {program.inquiryLabel}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={handleRegister}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.2px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
        >
          Register
        </button>
      </div>
    </article>
  )
}
