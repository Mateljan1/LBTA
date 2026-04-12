'use client'

import Image from 'next/image'
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

function getProgramImage(program: Program): { src: string; alt: string; objectPosition?: string } {
  const category = program.category.toLowerCase()
  const name = program.program.toLowerCase()

  if (name.includes('little tennis stars')) {
    return {
      src: 'https://res.cloudinary.com/dv033eo0x/image/upload/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg',
      alt: 'Little Tennis Stars player learning with racquet on court',
      objectPosition: 'center 26%',
    }
  }

  if (category.includes('fitness') || name.includes('liveball') || name.includes('cardio')) {
    return {
      src: '/images/facility/overview-coastal-tennis-facility-ocean.webp',
      alt: `${program.program} training session at Laguna Beach Tennis Academy`,
    }
  }

  if (category.includes('adult') || name.includes('adult')) {
    return {
      src: '/images/facility/coaching-private-tennis-lesson-drill.webp',
      alt: `${program.program} adult coaching at Laguna Beach Tennis Academy`,
    }
  }

  if (category.includes('youth') || name.includes('high performance') || name.includes('utr')) {
    return {
      src: '/images/facility/hero-ocean-view-tennis-courts-sunset.webp',
      alt: `${program.program} youth training courts at Laguna Beach Tennis Academy`,
    }
  }

  return {
    src: '/images/facility/detail-sunlit-blue-tennis-courts.webp',
    alt: `${program.program} junior program courts at Laguna Beach Tennis Academy`,
  }
}

export default function SchedulesProgramCard({ program, onRegister }: SchedulesProgramCardProps) {
  const levelBadge = deriveLevelBadge(program)
  const primaryPrice = getPrimaryPrice(program)
  const programImage = getProgramImage(program)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-brand-pacific-dusk/10 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-victoria-cove/50 hover:shadow-[0_12px_28px_rgba(15,34,55,0.14)]">
      <div className="relative h-[180px] overflow-hidden md:h-[200px]">
        <Image
          src={programImage.src}
          alt={programImage.alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          style={programImage.objectPosition ? { objectPosition: programImage.objectPosition } : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep-water/60 via-brand-deep-water/30 to-brand-deep-water/70" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-white/85">
            {program.category}
          </p>
          <span className="rounded-full bg-white/90 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk">
            {levelBadge}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h4 className="font-headline text-[30px] leading-[1.02] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
            {program.program}
          </h4>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 space-y-2">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/65">
            Program profile
          </p>
          <p className="font-sans text-[14px] leading-relaxed text-brand-pacific-dusk/75">
            Ages {program.ages} · {program.duration}
          </p>
        </div>

        <p className="mb-4 font-sans text-[13px] leading-relaxed text-brand-pacific-dusk/70">{program.location}</p>

        <div className="mb-5 space-y-1.5 rounded-[2px] border border-brand-pacific-dusk/8 bg-brand-morning-light p-3">
          {program.schedule.slice(0, 3).map((slot) => (
            <p key={`${program.id}-${slot.day}-${slot.time}`} className="font-sans text-[13px] text-brand-pacific-dusk/80">
              <span className="mr-2 inline-block min-w-[36px] font-medium text-brand-pacific-dusk">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
            </p>
          ))}
        </div>

        <div className="mb-5 flex items-baseline gap-2 border-t border-brand-pacific-dusk/8 pt-4">
          {primaryPrice ? (
            <>
              <p className="font-headline text-[40px] leading-none text-brand-deep-water">${primaryPrice.amount}</p>
              <p className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-brand-victoria-cove">
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
            className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-brand-deep-water px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.2px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pacific-dusk focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            Register
          </button>
        </div>
      </div>
    </article>
  )
}
