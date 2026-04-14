'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Program } from '@/components/ProgramCard'
import { getProgramImage } from '@/lib/program-images'
import { trackFormStart } from '@/lib/form-analytics'

interface ProgramPathwayCardProps {
  program: Program
  description: string
  onRegister: (program: Program) => void
  badge?: string
  /** Even indexes = image left; odd = image right */
  index: number
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
      existing.days += ' / ' + slot.day.slice(0, 3)
    } else {
      groups.push({ days: slot.day.slice(0, 3), time: slot.time, location: slot.location })
    }
  }
  return groups
}

function shortenLocation(loc: string): string {
  if (loc.toLowerCase().includes('moulton')) return 'Moulton Meadows'
  if (loc.toLowerCase().includes('alta')) return 'Alta Laguna'
  if (loc.toLowerCase().includes('high school') || loc.toLowerCase().includes('lbhs')) return 'LBHS'
  return loc
}

export default function ProgramPathwayCard({ program, description, onRegister, badge, index }: ProgramPathwayCardProps) {
  const reduceMotion = useReducedMotion()
  const img = getProgramImage(program.program, program.category)
  const prices = getPrices(program.pricing)
  const dropInPrice = program.pricing.drop_in
  const slots = groupSlots(program.schedule)
  const isImageLeft = index % 2 === 0

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  const Wrapper = reduceMotion ? 'article' : motion.article
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] as const },
      }

  return (
    <Wrapper
      className="group"
      aria-label={program.program}
      {...wrapperProps}
    >
      <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-0 md:gap-10 lg:gap-14 items-stretch`}>
        {/* Image side */}
        <div className="relative w-full md:w-[45%] lg:w-[48%] shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[380px] overflow-hidden rounded-[2px]">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            style={{ objectPosition: img.objectPosition }}
            sizes="(max-width: 768px) 100vw, 48vw"
            quality={90}
          />
          {badge && (
            <span className="absolute top-4 left-4 bg-brand-deep-water/80 backdrop-blur-sm text-white/90 font-sans text-[10px] font-medium tracking-[2px] uppercase px-3 py-1.5 rounded-[2px]">
              {badge}
            </span>
          )}
          {dropInPrice != null && (
            <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-brand-pacific-dusk font-sans text-[11px] font-semibold tracking-[1.5px] uppercase px-3 py-1.5 rounded-[2px]">
              Drop-in ${dropInPrice}
            </span>
          )}
        </div>

        {/* Content side */}
        <div className="flex-1 flex flex-col justify-center py-6 md:py-8">
          <span className="font-sans text-[11px] font-medium tracking-[2.5px] uppercase text-brand-victoria-cove/70 mb-3 block">
            Ages {program.ages} &middot; {program.duration}
          </span>

          <h3 className="font-headline text-[26px] md:text-[32px] font-medium text-brand-pacific-dusk mb-4 leading-[1.15]">
            {program.program}
          </h3>

          <p className="font-sans text-[15px] md:text-[16px] text-brand-pacific-dusk/60 leading-[1.7] mb-6 max-w-lg">
            {description}
          </p>

          {/* Schedule */}
          {slots.length > 0 && (
            <div className="mb-5">
              <span className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-brand-pacific-dusk/35 mb-2 block">
                Schedule
              </span>
              <div className="space-y-1">
                {slots.map((slot) => (
                  <div key={`${slot.days}-${slot.time}`} className="flex items-baseline gap-3">
                    <span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk min-w-[60px]">
                      {slot.days}
                    </span>
                    <span className="font-sans text-[13px] text-brand-pacific-dusk/60 tabular-nums">
                      {slot.time}
                    </span>
                    {slot.location && (
                      <span className="font-sans text-[12px] text-brand-pacific-dusk/35">
                        {shortenLocation(slot.location)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {prices.length > 0 && (
            <div className="mb-6">
              <span className="font-sans text-[10px] font-semibold tracking-[2px] uppercase text-brand-pacific-dusk/35 mb-2 block">
                Investment
              </span>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {prices.map((p) => (
                  <span key={p.label} className="font-sans text-[13px] text-brand-pacific-dusk/65">
                    <span className="font-medium text-brand-pacific-dusk">{p.label}</span>{' '}
                    ${p.amount.toLocaleString()}
                  </span>
                ))}
              </div>
              {program.pricingNote && (
                <p className="font-sans text-[11px] text-brand-pacific-dusk/40 mt-1 italic">
                  {program.pricingNote}
                </p>
              )}
            </div>
          )}

          <p className="font-sans text-[12px] text-brand-victoria-cove/60 mb-5">
            First class free &mdash; no commitment required.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {program.inquiryLabel ? (
              <Link
                href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
                className="inline-flex min-h-[48px] items-center justify-center px-8 py-3 border border-brand-pacific-dusk/15 rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase text-brand-pacific-dusk/70 hover:border-brand-pacific-dusk/30 hover:text-brand-pacific-dusk transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
              >
                {program.inquiryLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="inline-flex min-h-[48px] items-center justify-center px-8 py-3 bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Register
              </button>
            )}
            <Link
              href="/book"
              className="inline-flex min-h-[48px] items-center justify-center px-6 py-3 border border-brand-pacific-dusk/15 rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase text-brand-pacific-dusk/55 hover:border-brand-pacific-dusk/30 hover:text-brand-pacific-dusk transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              Book Trial
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
