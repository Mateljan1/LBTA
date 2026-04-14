'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import { getProgramImage } from '@/lib/program-images'
import { trackFormStart } from '@/lib/form-analytics'

interface ProgramPathwayCardProps {
  program: Program
  description: string
  onRegister: (program: Program) => void
  badge?: string
}

const PRICE_ORDER = ['1x', '2x', '3x', 'monthly', 'saturday1x', 'drop_in'] as const
const PRICE_LABELS: Record<string, string> = {
  '1x': '1x / week',
  '2x': '2x / week',
  '3x': '3x / week',
  monthly: 'Monthly',
  saturday1x: 'Saturday',
  drop_in: 'Drop-in',
}

function getPrices(pricing: Program['pricing']): Array<{ label: string; amount: number }> {
  return PRICE_ORDER
    .map((key) => {
      const amount = pricing[key as keyof typeof pricing]
      if (typeof amount !== 'number') return null
      return { label: PRICE_LABELS[key] ?? key, amount }
    })
    .filter((r): r is { label: string; amount: number } => r !== null)
}

function groupSlots(schedule: Program['schedule']) {
  const groups: Array<{ days: string; time: string; location?: string }> = []
  for (const slot of schedule) {
    const key = `${slot.time}|${slot.location ?? ''}`
    const existing = groups.find((g) => `${g.time}|${g.location ?? ''}` === key)
    if (existing) {
      existing.days += ' · ' + slot.day.slice(0, 3)
    } else {
      groups.push({ days: slot.day.slice(0, 3), time: slot.time, location: slot.location })
    }
  }
  return groups
}

function shortenLocation(loc: string): string {
  if (loc.toLowerCase().includes('moulton')) return 'Moulton'
  if (loc.toLowerCase().includes('alta')) return 'Alta Laguna'
  if (loc.toLowerCase().includes('high school') || loc.toLowerCase().includes('lbhs')) return 'LBHS'
  return loc
}

export default function ProgramPathwayCard({ program, description, onRegister, badge }: ProgramPathwayCardProps) {
  const img = getProgramImage(program.program, program.category)
  const prices = getPrices(program.pricing)
  const dropInPrice = program.pricing.drop_in
  const slots = groupSlots(program.schedule)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <article
      className="group flex flex-col bg-white border border-brand-pacific-dusk/6 rounded-[2px] overflow-hidden transition-all duration-300 hover:border-brand-pacific-dusk/12 hover:shadow-[0_8px_32px_rgba(27,58,92,0.07)] hover:-translate-y-0.5"
      aria-label={program.program}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ objectPosition: img.objectPosition }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={85}
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-brand-deep-water/75 backdrop-blur-sm text-white/90 font-sans text-[10px] font-medium tracking-[2px] uppercase px-2.5 py-1.5 rounded-[2px]">
            {badge}
          </span>
        )}
        {dropInPrice != null && (
          <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-brand-pacific-dusk font-sans text-[10px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1.5 rounded-[2px]">
            Drop-in ${dropInPrice}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Eyebrow */}
        <span className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-victoria-cove/70 mb-2 block">
          Ages {program.ages} &middot; {program.duration}
        </span>

        {/* Title */}
        <h3 className="font-headline text-[20px] md:text-[22px] font-medium text-brand-pacific-dusk mb-2 leading-[1.2]">
          {program.program}
        </h3>

        {/* Description — from Program Guide */}
        <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed mb-4">
          {description}
        </p>

        {/* Schedule */}
        {slots.length > 0 && (
          <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-3 space-y-1">
            {slots.map((slot) => (
              <div key={`${slot.days}-${slot.time}`} className="flex items-baseline gap-2">
                <span className="font-sans text-[12px] font-semibold text-brand-pacific-dusk w-[52px] shrink-0">
                  {slot.days}
                </span>
                <span className="font-sans text-[12px] text-brand-pacific-dusk/65 tabular-nums">
                  {slot.time}
                </span>
                {slot.location && (
                  <span className="ml-auto font-sans text-[11px] text-brand-pacific-dusk/40 shrink-0">
                    {shortenLocation(slot.location)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pricing tiers */}
        {prices.length > 0 && (
          <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-4">
            <div className={`grid gap-x-4 gap-y-1 ${prices.length > 3 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {prices.map((p) => (
                <div key={p.label} className="flex justify-between items-baseline">
                  <span className="font-sans text-[11px] text-brand-pacific-dusk/50">{p.label}</span>
                  <span className="font-sans text-[13px] font-semibold tabular-nums text-brand-pacific-dusk">
                    ${p.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {program.pricingNote && (
              <p className="font-sans text-[11px] text-brand-pacific-dusk/40 mt-1.5 italic">
                {program.pricingNote}
              </p>
            )}
          </div>
        )}

        {/* Free trial note */}
        <p className="font-sans text-[11px] text-brand-victoria-cove/70 mb-4">
          First class free &mdash; no commitment.
        </p>

        {/* CTAs */}
        <div className="mt-auto flex flex-wrap gap-2">
          {program.inquiryLabel ? (
            <Link
              href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
              className="flex-1 inline-flex min-h-[48px] items-center justify-center border border-brand-pacific-dusk/15 rounded-[2px] font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-pacific-dusk/70 hover:border-brand-pacific-dusk/30 hover:text-brand-pacific-dusk transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              {program.inquiryLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleRegister}
              className="flex-1 inline-flex min-h-[48px] items-center justify-center bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
            >
              Register
            </button>
          )}
          <Link
            href="/book"
            className="inline-flex min-h-[48px] items-center justify-center border border-brand-pacific-dusk/15 rounded-[2px] px-4 font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-pacific-dusk/60 hover:border-brand-pacific-dusk/30 hover:text-brand-pacific-dusk transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            Book Trial
          </Link>
        </div>
      </div>
    </article>
  )
}
