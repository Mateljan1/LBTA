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
  index: number
}

const PRICE_ORDER = ['1x', '2x', '3x', 'monthly', 'saturday1x', 'drop_in'] as const
const PRICE_LABELS: Record<string, string> = {
  '1x': '1x / wk', '2x': '2x / wk', '3x': '3x / wk',
  monthly: 'Monthly', saturday1x: 'Saturday', drop_in: 'Drop-in',
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
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] as const },
      }

  return (
    <Wrapper
      className="group"
      aria-label={program.program}
      {...wrapperProps}
    >
      <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-stretch overflow-hidden rounded-lg bg-brand-deep-water ring-1 ring-white/[0.06] transition-all duration-500 hover:ring-white/[0.12] hover:shadow-[0_24px_64px_rgba(10,22,40,0.4)]`}>
        {/* Cinematic image */}
        <div className="relative w-full md:w-[50%] aspect-[4/3] md:aspect-auto md:min-h-[420px] overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
            style={{ objectPosition: img.objectPosition }}
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={90}
          />
          {/* Cinematic vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: isImageLeft
                ? 'linear-gradient(to right, transparent 40%, rgba(15,34,55,0.95) 100%), linear-gradient(to top, rgba(15,34,55,0.4) 0%, transparent 40%)'
                : 'linear-gradient(to left, transparent 40%, rgba(15,34,55,0.95) 100%), linear-gradient(to top, rgba(15,34,55,0.4) 0%, transparent 40%)',
            }}
            aria-hidden="true"
          />
          {badge && (
            <span className="absolute top-4 left-4 bg-brand-thousand-steps/90 text-white font-sans text-[9px] font-bold tracking-[2.5px] uppercase px-3 py-1.5 rounded-[2px]">
              {badge}
            </span>
          )}
          {/* Step number */}
          <span
            className="absolute bottom-4 left-4 font-headline text-[64px] md:text-[80px] font-light leading-none text-white/[0.06] select-none"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Content side */}
        <div className="relative flex-1 flex flex-col justify-center px-6 py-8 md:px-10 md:py-10 lg:px-12">
          {/* Subtle gradient accent bar */}
          <div
            className={`absolute top-0 ${isImageLeft ? 'left-0' : 'right-0'} w-[3px] h-full`}
            style={{ background: 'linear-gradient(to bottom, #2E8B8B, #E8834A, #C4963C)' }}
            aria-hidden="true"
          />

          <span className="font-sans text-[10px] font-bold tracking-[3px] uppercase text-brand-victoria-cove mb-4 block">
            Ages {program.ages} &middot; {program.duration}
          </span>

          <h3 className="font-headline text-[28px] md:text-[34px] lg:text-[38px] font-light text-white leading-[1.1] tracking-[-0.02em] mb-5">
            {program.program}
          </h3>

          <p className="font-sans text-[15px] text-white/55 leading-[1.75] mb-7 max-w-md">
            {description}
          </p>

          {/* Schedule + Pricing in a refined grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-7">
            {/* Schedule */}
            {slots.length > 0 && (
              <div>
                <span className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-white/25 mb-2.5 block">
                  Schedule
                </span>
                <div className="space-y-1.5">
                  {slots.map((slot) => (
                    <div key={`${slot.days}-${slot.time}`} className="flex items-baseline gap-2.5">
                      <span className="font-sans text-[12px] font-semibold text-white/80 min-w-[52px]">
                        {slot.days}
                      </span>
                      <span className="font-sans text-[12px] text-white/45 tabular-nums">
                        {slot.time}
                      </span>
                      {slot.location && (
                        <span className="font-sans text-[10px] text-white/25 ml-auto">
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
              <div>
                <span className="font-sans text-[9px] font-bold tracking-[3px] uppercase text-white/25 mb-2.5 block">
                  Investment
                </span>
                <div className="space-y-1.5">
                  {prices.map((p) => (
                    <div key={p.label} className="flex justify-between items-baseline">
                      <span className="font-sans text-[12px] text-white/45">{p.label}</span>
                      <span className="font-sans text-[13px] font-semibold tabular-nums text-white/90">
                        ${p.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                {program.pricingNote && (
                  <p className="font-sans text-[10px] text-white/25 mt-2 italic">{program.pricingNote}</p>
                )}
              </div>
            )}
          </div>

          <p className="font-sans text-[11px] text-brand-victoria-cove/60 mb-6">
            First class free &mdash; no commitment required.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {program.inquiryLabel ? (
              <Link
                href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
                className="inline-flex min-h-[48px] items-center justify-center px-8 py-3 rounded-[3px] border border-white/[0.12] font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-white/60 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.04] hover:text-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                {program.inquiryLabel}
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="group/btn inline-flex min-h-[48px] items-center justify-center px-8 py-3 rounded-[3px] bg-white text-brand-deep-water font-sans text-[10px] font-semibold tracking-[2.5px] uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(255,255,255,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Register
              </button>
            )}
            <Link
              href="/book"
              className="inline-flex min-h-[48px] items-center justify-center px-6 py-3 rounded-[3px] border border-white/[0.12] font-sans text-[10px] font-semibold tracking-[2.5px] uppercase text-white/50 transition-all duration-300 hover:border-white/25 hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Book Trial
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
