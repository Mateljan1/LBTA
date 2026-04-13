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
  if (name.includes('liveball')) return 'NTRP 3.0+'
  if (name.includes('cardio')) return 'All Levels'
  if (program.category.toLowerCase() === 'junior') return 'Ages ' + program.ages
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

type ProgramImageConfig = { src: string; alt: string; objectPosition: string }

const CLOUD = 'https://res.cloudinary.com/dv033eo0x/image/upload'

function getProgramImage(program: Program): ProgramImageConfig {
  const name = program.program.toLowerCase()
  const cat = program.category.toLowerCase()

  if (name.includes('little tennis stars')) {
    return {
      src: `${CLOUD}/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg`,
      alt: 'Young player smiling on court during Little Tennis Stars session',
      objectPosition: 'center 26%',
    }
  }

  if (name.includes('red ball')) {
    return {
      src: `${CLOUD}/v1774752975/lbta/photos/canonical/2023/lbta-2023-child-practicing-tennis-swing-court.webp`,
      alt: 'Junior player practicing forehand swing on Moulton Meadows court',
      objectPosition: 'center 30%',
    }
  }

  if (name.includes('orange ball')) {
    return {
      src: `${CLOUD}/v1774752372/lbta/support/canonical/camps/support-camps-green-ball.webp`,
      alt: 'Kids rallying at the net during Orange Ball session in golden-hour light',
      objectPosition: 'center 42%',
    }
  }

  if (name === 'green dot' || (name.includes('green dot') && !name.includes('competitive') && !name.includes('utr'))) {
    return {
      src: `${CLOUD}/v1776038504/Green_dot_nyiso7.jpg`,
      alt: 'Green Dot player hitting overhead volley at the net',
      objectPosition: 'center 28%',
    }
  }

  if (name.includes('competitive green dot') || name.includes('competitive') && name.includes('green dot')) {
    return {
      src: `${CLOUD}/v1776038831/green_dot_competitive_qmueoa.jpg`,
      alt: 'Competitive Green Dot player running drills on blue hard court',
      objectPosition: 'center 38%',
    }
  }

  if (name.includes('player development')) {
    return {
      src: `${CLOUD}/v1776039103/Youth_Development_ydlfwq.jpg`,
      alt: 'Player Development training footwork with agility cones',
      objectPosition: 'center 40%',
    }
  }

  if (name.includes('new to tennis') || name.includes('beyond beginner')) {
    return {
      src: `${CLOUD}/v1776039173/Beginner_Class_moulton_xs5pec.jpg`,
      alt: 'Adult beginners practicing technique at Moulton Meadows Park',
      objectPosition: 'center 32%',
    }
  }

  if (name.includes('intermediate') && cat.includes('adult')) {
    return {
      src: `${CLOUD}/v1776046298/Adult_intermediat_or_bridge_1_edcu5p.jpg`,
      alt: 'Adult intermediate players training at Laguna Beach High School',
      objectPosition: 'center 38%',
    }
  }

  if (name.includes('advanced') && cat.includes('adult')) {
    return {
      src: `${CLOUD}/v1774485572/Adult_advanced_2_tttewq.jpg`,
      alt: 'Adult advanced players competing in match play',
      objectPosition: 'center 40%',
    }
  }

  if (name.includes('liveball')) {
    return {
      src: `${CLOUD}/v1774485572/Advanced_liveball_iyooh6.jpg`,
      alt: 'LiveBall session — high-energy coach-fed point play',
      objectPosition: 'center 42%',
    }
  }

  if (name.includes('cardio')) {
    return {
      src: `${CLOUD}/v1774485572/Liveball_Intermediate_exqowf.jpg`,
      alt: 'Cardio Tennis fitness-focused hitting session',
      objectPosition: 'center 45%',
    }
  }

  if (name.includes('high performance')) {
    return {
      src: `${CLOUD}/v1776047024/High_Performance_d60ibn.jpg`,
      alt: 'High Performance youth training session at Laguna Beach Tennis Academy',
      objectPosition: 'center 35%',
    }
  }

  if (cat.includes('open court') || cat.includes('fitness')) {
    return {
      src: '/images/facility/overview-coastal-tennis-facility-ocean.webp',
      alt: `${program.program} training session at Laguna Beach Tennis Academy`,
      objectPosition: 'center 50%',
    }
  }

  if (cat.includes('adult') || name.includes('adult')) {
    return {
      src: '/images/facility/coaching-private-tennis-lesson-drill.webp',
      alt: `${program.program} adult coaching at Laguna Beach Tennis Academy`,
      objectPosition: 'center 45%',
    }
  }

  if (cat.includes('development') || cat.includes('youth') || name.includes('utr')) {
    return {
      src: '/images/facility/hero-ocean-view-tennis-courts-sunset.webp',
      alt: `${program.program} youth training courts at Laguna Beach Tennis Academy`,
      objectPosition: 'center 45%',
    }
  }

  return {
    src: '/images/facility/detail-sunlit-blue-tennis-courts.webp',
    alt: `${program.program} junior program courts at Laguna Beach Tennis Academy`,
    objectPosition: 'center 50%',
  }
}

/* ── Noise texture (inline SVG, cached once) ── */
const GRAIN_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/* ── Component ── */

export default function SchedulesProgramCard({ program, onRegister }: SchedulesProgramCardProps) {
  const levelBadge = deriveLevelBadge(program)
  const primaryPrice = getPrimaryPrice(program)
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
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] will-change-transform group-hover:scale-[1.05]"
          style={{ objectPosition: img.objectPosition }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <span className="absolute right-3 top-3 rounded-[3px] border border-white/[0.12] bg-white/[0.08] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75 backdrop-blur-md">
          {levelBadge}
        </span>

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-3">
          <span className="mb-1 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-white/50">
            {program.category}
          </span>
          <h4
            id={headingId}
            className="font-headline text-[20px] font-semibold leading-[1.05] text-white sm:text-[22px]"
            style={{
              letterSpacing: '-0.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            {program.program}
          </h4>
          <p className="mt-0.5 font-sans text-[11px] font-normal text-white/55" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
            Ages {program.ages} &middot; {program.duration}
          </p>
        </div>
      </div>

      {/* ═══ CARD BODY ═══ */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">

        {/* Schedule grid — day, time, location per row */}
        <div className="mb-3 rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
          {program.schedule.map((slot) => (
            <div key={`${program.id}-${slot.day}-${slot.time}`} className="flex items-baseline gap-1 py-[3px]">
              <span className="w-[34px] shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.04em] text-white/70">
                {slot.day.slice(0, 3)}
              </span>
              <span className="font-sans text-[11px] tabular-nums text-white/50">{slot.time}</span>
              {slot.location && (
                <span className="ml-auto shrink-0 font-sans text-[10px] text-white/30">
                  {shortenLocation(slot.location)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="mb-3 flex items-baseline gap-1.5 border-t border-white/[0.07] pt-3">
          {primaryPrice ? (
            <>
              <span className="font-headline text-[26px] leading-none tracking-tight text-white">${primaryPrice.amount}</span>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                {primaryPrice.label}
              </span>
            </>
          ) : (
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
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
