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

function getAccentColor(program: Program): string {
  const cat = program.category.toLowerCase()
  const name = program.program.toLowerCase()
  if (cat.includes('fitness') || name.includes('liveball') || name.includes('cardio')) return '#2E8B8B'
  if (cat.includes('adult')) return '#E8834A'
  if (name.includes('high performance')) return '#C4963C'
  if (cat.includes('youth') || name.includes('utr')) return '#3A8B6E'
  return '#E8834A'
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

function getProgramDetail(program: Program): string {
  const parts: string[] = []
  if (program.ages) parts.push(`Ages ${program.ages}`)
  if (program.duration) parts.push(program.duration)
  return parts.join('  ·  ')
}

export default function SchedulesProgramCard({ program, onRegister }: SchedulesProgramCardProps) {
  const levelBadge = deriveLevelBadge(program)
  const primaryPrice = getPrimaryPrice(program)
  const programImage = getProgramImage(program)
  const accent = getAccentColor(program)
  const detail = getProgramDetail(program)

  const handleRegister = () => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    onRegister(program)
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] bg-brand-deep-water shadow-[0_4px_24px_rgba(0,0,0,0.18)] transition-all duration-500 ease-[cubic-bezier(0.2,0.75,0.2,1)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.32)]">
      {/* ── Cinematic hero image ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={programImage.src}
          alt={programImage.alt}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.75,0.2,1)] group-hover:scale-[1.04]"
          style={programImage.objectPosition ? { objectPosition: programImage.objectPosition } : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={90}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 40%, transparent 30%, rgba(15,34,55,0.55) 100%)',
          }}
        />

        {/* Bottom gradient for text legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-[65%]"
          style={{
            background: 'linear-gradient(to top, rgba(15,34,55,0.92) 0%, rgba(15,34,55,0.7) 40%, transparent 100%)',
          }}
        />

        {/* Film grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        {/* Accent stripe */}
        <div
          className="absolute left-5 top-4 h-12 w-[3px] rounded-full"
          style={{ backgroundColor: accent }}
        />

        {/* Category tag */}
        <span className="absolute right-4 top-4 rounded-[3px] border border-white/15 bg-white/[0.06] px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-[8px]">
          {levelBadge}
        </span>

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-start px-6 pb-5">
          <p className="mb-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60">
            {program.category}
          </p>
          <h4
            className="font-headline text-[28px] font-semibold leading-[1.0] text-white md:text-[32px]"
            style={{
              textShadow: '0 1px 1px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.35)',
              letterSpacing: '-0.02em',
            }}
          >
            {program.program}
          </h4>
          <p
            className="mt-1.5 font-sans text-[11px] font-normal leading-relaxed text-white/60"
            style={{
              textShadow: '0 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            {detail}
          </p>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-1 flex-col px-6 pb-5 pt-4">
        <p className="mb-3 font-sans text-[12px] leading-relaxed text-white/50">{program.location}</p>

        <div className="mb-4 space-y-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-3.5 py-3">
          {program.schedule.slice(0, 3).map((slot) => (
            <p key={`${program.id}-${slot.day}-${slot.time}`} className="font-sans text-[12px] text-white/60">
              <span className="mr-2 inline-block min-w-[36px] font-medium text-white/85">
                {slot.day.slice(0, 3)}
              </span>
              {slot.time}
            </p>
          ))}
        </div>

        <div className="mb-5 flex items-baseline gap-2.5 border-t border-white/[0.08] pt-4">
          {primaryPrice ? (
            <>
              <p className="font-headline text-[36px] leading-none text-white">${primaryPrice.amount}</p>
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
                {primaryPrice.label}
              </p>
            </>
          ) : (
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
              Contact for rates
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2.5">
          {program.inquiryLabel ? (
            <Link
              href={`/contact?program=${encodeURIComponent(program.program)}&inquiry=placement`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-[4px] border border-white/15 px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[2.1px] text-white/70 transition-all duration-300 ease-[cubic-bezier(0.2,0.75,0.2,1)] hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              {program.inquiryLabel}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleRegister}
            className="inline-flex min-h-[48px] items-center justify-center rounded-[4px] bg-white px-4 py-3 font-sans text-[10px] font-semibold uppercase tracking-[2.2px] text-brand-deep-water transition-all duration-300 ease-[cubic-bezier(0.2,0.75,0.2,1)] hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
          >
            Register
          </button>
        </div>
      </div>
    </article>
  )
}
