'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import { trackFormStart } from '@/lib/form-analytics'

interface SchedulesProgramCardProps {
  program: Program
  onRegister: (program: Program) => void
}

/* ── Helpers ── */

function deriveLevelBadge(program: Program): string {
  const name = program.program.toLowerCase()
  const ages = program.ages.toLowerCase()
  if (name.includes('new to tennis') || name.includes('beginner')) return 'Beginner'
  if (name.includes('beyond beginner')) return 'Beginner–Intermediate'
  if (ages.includes('utr 5+') || name.includes('advanced')) return 'Advanced'
  if (name.includes('competitive') || name.includes('match play')) return 'Competitive'
  if (name.includes('intermediate') || ages.includes('ntrp 3')) return 'Intermediate'
  if (name.includes('player development') || ages.includes('utr')) return 'Level-Based'
  if (name.includes('liveball')) return 'Drop-In'
  if (name.includes('cardio')) return 'All Levels'
  if (name.includes('little') || name.includes('stars')) return 'Intro'
  if (name.includes('red ball')) return 'Stage 1'
  if (name.includes('orange ball')) return 'Stage 2'
  if (name.includes('green dot') && !name.includes('competitive')) return 'Stage 3'
  return 'All Levels'
}

const PRICE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  '1x': '1x / week',
  '2x': '2x / week',
  '3x': '3x / week',
  '4x': '4x / week',
  '5x': '5x / week',
  saturday1x: 'Saturday',
  drop_in: 'Drop-in',
}
const PRICE_ORDER = ['monthly', '1x', '2x', '3x', '4x', '5x', 'saturday1x', 'drop_in']

function getAllPrices(program: Program): Array<{ label: string; amount: number }> {
  const pricing = program.pricing
  const hasSessionPricing = typeof pricing['1x'] === 'number'
  return PRICE_ORDER
    .filter((key) => {
      const val = pricing[key as keyof typeof pricing]
      if (typeof val !== 'number') return false
      if (key === 'monthly' && hasSessionPricing && val === pricing['1x']) return false
      return true
    })
    .map((key) => ({ label: PRICE_LABELS[key] ?? key, amount: pricing[key as keyof typeof pricing] as number }))
}

function getAccentColor(program: Program): string {
  const cat = program.category.toLowerCase()
  const name = program.program.toLowerCase()
  if (cat.includes('open court') || name.includes('liveball') || name.includes('cardio')) return '#2E8B8B'
  if (name.includes('high performance')) return '#C4963C'
  if (cat.includes('adult')) return '#E8834A'
  if (cat.includes('development') || name.includes('competitive') || name.includes('player development')) return '#3A8B6E'
  if (cat.includes('junior')) return '#E8834A'
  return '#E8834A'
}

function shortenLocation(location: string): string {
  const loc = location.toLowerCase()
  if (loc.includes('moulton')) return 'Moulton'
  if (loc.includes('alta laguna')) return 'Alta Laguna'
  if (loc.includes('high school') || loc.includes('lbhs') || loc.includes('lb high')) return 'LBHS'
  return location.length > 14 ? location.slice(0, 12) + '...' : location
}

type GroupedSlot = { days: string; time: string; location?: string; note?: string }

function groupScheduleSlots(schedule: Array<{ day: string; time: string; location?: string; note?: string }>): GroupedSlot[] {
  const groups: GroupedSlot[] = []
  for (const slot of schedule) {
    const key = `${slot.time}|${slot.location ?? ''}|${slot.note ?? ''}`
    const existing = groups.find((g) => `${g.time}|${g.location ?? ''}|${g.note ?? ''}` === key)
    if (existing) {
      existing.days += ', ' + slot.day.slice(0, 3)
    } else {
      groups.push({ days: slot.day.slice(0, 3), time: slot.time, location: slot.location, note: slot.note })
    }
  }
  return groups
}

import { getProgramImage as getSharedProgramImage, type ProgramImageConfig } from '@/lib/program-images'

function getProgramImage(program: Program): ProgramImageConfig {
  return getSharedProgramImage(program.program, program.category)
}

/* ── Noise texture (inline SVG, cached once) ── */
const GRAIN_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/* ── Component ── */

export default function SchedulesProgramCard({ program, onRegister }: SchedulesProgramCardProps) {
  const levelBadge = deriveLevelBadge(program)
  const prices = getAllPrices(program)
  const img = getProgramImage(program)
  const accent = getAccentColor(program)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  const headingId = `program-${program.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-[#0a1628] ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-1 hover:ring-white/[0.12] hover:shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
    >
      {/* ═══ CINEMATIC HERO ═══ */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform group-hover:scale-[1.05]"
          style={{ objectPosition: img.objectPosition }}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
        />

        {/* Cinematic vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 130% 110% at 50% 35%, transparent 25%, rgba(10,22,40,0.5) 100%)',
              'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.65) 35%, rgba(10,22,40,0.1) 55%, transparent 70%)',
            ].join(', '),
          }}
        />

        {/* Subtle film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URI, backgroundSize: '200px 200px' }}
        />

        {/* Accent stripe */}
        <div
          className="absolute left-4 top-3 h-8 w-[2.5px] rounded-full shadow-[0_0_12px_rgba(255,255,255,0.12)]"
          style={{ backgroundColor: accent, boxShadow: `0 0 16px ${accent}44` }}
        />

        {/* Level badge — frosted glass */}
        <span className="absolute right-3 top-3 rounded-[3px] border border-white/[0.15] bg-white/[0.1] px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
          {levelBadge}
        </span>

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-3">
          <span className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {program.category}
          </span>
          <h4
            id={headingId}
            className="font-headline text-[18px] font-semibold leading-[1.1] text-white sm:text-[20px]"
            style={{
              letterSpacing: '-0.01em',
              textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            {program.program}
          </h4>
          <p className="mt-0.5 font-sans text-[11px] font-medium text-white/75" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
            Ages {program.ages} &middot; {program.duration}
          </p>
        </div>
      </div>

      {/* ═══ CARD BODY ═══ */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">

        {/* Schedule grid — grouped by time+location */}
        <div className="mb-3 rounded-md border border-white/[0.10] bg-white/[0.04] px-3 py-2.5">
          {groupScheduleSlots(program.schedule).map((slot) => (
            <div key={`${program.id}-${slot.days}-${slot.time}`}>
              <div className="flex items-baseline gap-1.5 py-[3px]">
                <span className="shrink-0 font-sans text-[11px] font-bold uppercase tracking-[0.02em] text-white/85">
                  {slot.days}
                </span>
                <span className="font-sans text-[11px] tabular-nums text-white/65">{slot.time}</span>
                {slot.location && (
                  <span className="ml-auto shrink-0 font-sans text-[10px] font-medium text-white/45">
                    {shortenLocation(slot.location)}
                  </span>
                )}
              </div>
              {slot.note && (
                <p className="pl-0 pb-1 font-sans text-[10px] italic text-white/40">{slot.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Pricing tiers — label-first table layout */}
        <div className="mb-3 border-t border-white/[0.10] pt-3">
          {prices.length > 0 ? (
            <div className={`grid gap-x-4 gap-y-1.5 ${prices.length > 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {prices.map((p) => (
                <div key={p.label} className="flex items-baseline justify-between">
                  <span className="font-sans text-[11px] font-medium text-white/60">{p.label}</span>
                  <span className="font-sans text-[13px] font-bold tabular-nums text-white">${p.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/50">
              Contact for rates
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          {program.inquiryLabel ? (
            <Link
              href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-white/[0.12] px-3 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[1.8px] text-white/60 transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:border-white/25 hover:bg-white/[0.05] hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
            >
              {program.inquiryLabel}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleRegister}
            className="group/btn relative inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-md bg-white px-3 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[2px] text-[#0a1628] transition-all duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]"
          >
            Register
          </button>
        </div>
      </div>
    </article>
  )
}
