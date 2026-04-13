'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Program } from '@/components/ProgramCard'
import type { CampWithWeeks } from '@/lib/camps-data'
import RegistrationModal from '@/components/RegistrationModal'
import { getCampsFromYear2026 } from '@/lib/camps-data'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import ProgramsSection from '@/components/schedules/ProgramsSection'
import CampsSection from '@/components/schedules/CampsSection'
import LeaguesSection from '@/components/schedules/LeaguesSection'
import PrivateCoachingSection from '@/components/schedules/PrivateCoachingSection'
import SchedulesAnchorNav from '@/components/schedules/SchedulesAnchorNav'
import SchedulesQuickActions from '@/components/schedules/SchedulesQuickActions'
import type { SeasonKey, SeasonDataForDisplay } from '@/lib/season-utils'
import type { LeaguesData, Year2026Sections } from '@/lib/schedule-schemas'

export type { LeaguesData, Year2026Sections }

export interface SeasonCTA {
  headline: string
  subline: string
  showEarlyBird: boolean
  earlyBirdDeadline: string | null
  earlyBirdDiscount: number
}

interface SchedulesPageClientProps {
  programsBySeason: Record<SeasonKey, Program[]>
  seasons: Record<SeasonKey, SeasonDataForDisplay>
  initialSeason: SeasonKey
  seasonCta: SeasonCTA
  year2026: Year2026Sections
  leagues: LeaguesData
}

const scheduleCamps = getCampsFromYear2026()

function formatPricingOptions(pricing: Program['pricing']): Array<{ label: string; amount: number }> {
  const labels: Record<string, string> = {
    '1x': '1x/wk',
    '2x': '2x/wk',
    '3x': '3x/wk',
    '4x': '4x/wk',
    '5x': '5x/wk',
    monthly: 'Monthly',
    drop_in: 'Drop-in',
    saturday1x: '1x/wk (Saturday)',
  }

  return Object.entries(pricing)
    .filter(([, amount]) => amount !== undefined && amount !== null)
    .map(([key, amount]) => ({ label: labels[key] ?? key, amount: Number(amount) }))
}

export default function SchedulesPageClient({
  programsBySeason,
  seasons,
  initialSeason,
  seasonCta,
  year2026,
  leagues,
}: SchedulesPageClientProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [selectedCamp, setSelectedCamp] = useState<CampWithWeeks | null>(null)
  const [privateCoachName, setPrivateCoachName] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    private: false,
    camps: false,
    leagues: false,
  })

  const expandSection = (section: 'private' | 'camps' | 'leagues') => {
    setExpandedSections((prev) => ({ ...prev, [section]: true }))
  }

  useEffect(() => {
    const handleJump = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string }>
      const targetId = customEvent.detail?.id
      if (targetId === 'private' || targetId === 'camps' || targetId === 'leagues') {
        expandSection(targetId)
      }
    }
    window.addEventListener('lbta:schedules:jump', handleJump)
    return () => window.removeEventListener('lbta:schedules:jump', handleJump)
  }, [])

  const scrollToPrograms = () => {
    const target = document.getElementById('programs')
    if (!target) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  const hasOpenModal = Boolean(selectedProgram || selectedCamp || privateCoachName)

  return (
    <>
      <section className="relative min-h-[42vh] md:min-h-[44vh] flex items-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/facility/detail-sunlit-blue-tennis-courts.webp"
            alt="Sunlit blue hard courts at Laguna Beach Tennis Academy"
            fill
            className="object-cover object-center max-md:brightness-[0.9]"
            style={{ objectPosition: '50% 48%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 hero-scrim-branded" aria-hidden="true" />
        </div>
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white uppercase tracking-[0.2em] mb-4 text-shadow-hero-readable">
            {seasonCta.headline}
          </p>
          <h1 className="font-headline text-[40px] md:text-[64px] font-medium text-white leading-[1.05] mb-3 text-shadow-hero-readable">
            Schedule & Pricing
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-white tracking-[0.12em] mb-6 text-shadow-hero-readable max-md:text-white/95 md:text-white/85">
            Movement · Craft · Community
          </p>
          <p className="font-sans text-[16px] md:text-[18px] text-white max-w-[600px] mx-auto leading-relaxed text-shadow-hero-readable max-md:text-white/95 md:text-white/90">
            Programs, camps, leagues, and private coaching. Everything we offer, in one place.
          </p>
          <div className="mt-8 mx-auto max-w-[920px] rounded-lg border border-white/20 bg-white/95 p-3 md:p-4">
            <SchedulesQuickActions onFindProgram={scrollToPrograms} />
          </div>
        </div>
      </section>

      <HorizonDivider />

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedule & Pricing' }]} />
      </div>

      <SchedulesAnchorNav />

      <ProgramsSection
        programsBySeason={programsBySeason}
        seasons={seasons}
        initialSeason={initialSeason}
        onRegister={setSelectedProgram}
      />

      <HorizonDivider />

      {expandedSections.private ? (
        <PrivateCoachingSection
          coaches={year2026.privateCoaching}
          monthlyPrograms={year2026.monthlyPrograms}
          discounts={year2026.discounts}
          scholarships={{ available: year2026.scholarships.available, coverage: year2026.scholarships.coverage ?? '', email: year2026.scholarships.email ?? '' }}
          onBookCoach={setPrivateCoachName}
        />
      ) : (
        <section id="private" className="scroll-mt-28 bg-brand-morning-light py-14 md:py-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="rounded-lg border border-black/[0.08] bg-white px-6 py-7 md:px-8 md:py-8">
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
                ONE-ON-ONE
              </p>
              <h2 className="font-headline text-[30px] md:text-[38px] font-medium text-brand-pacific-dusk leading-[1.1] mb-3">
                Private Coaching
              </h2>
              <p className="font-sans text-[15px] md:text-[17px] text-brand-pacific-dusk/70 max-w-2xl mb-6">
                Personalized sessions with LBTA coaches, plus private-rate packs and monthly drop-in options.
              </p>
              <div className="mb-6 grid gap-2 md:grid-cols-2">
                <p className="rounded-[2px] bg-brand-morning-light px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  Best for players who want custom progression and flexible scheduling.
                </p>
                <p className="rounded-[2px] bg-brand-morning-light px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  Includes private packs, monthly drop-in options, and coach-specific booking.
                </p>
              </div>
              <button
                type="button"
                onClick={() => expandSection('private')}
                className="inline-flex items-center justify-center min-h-[48px] rounded-[2px] bg-black px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.3px] text-white transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Show Private Coaching Details
              </button>
            </div>
          </div>
        </section>
      )}

      <HorizonDivider />

      {expandedSections.camps ? (
        <CampsSection
          camps={scheduleCamps}
          onRegister={setSelectedCamp}
        />
      ) : (
        <section id="camps" className="scroll-mt-28 bg-brand-morning-light py-14 md:py-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="rounded-lg border border-black/[0.08] bg-white px-6 py-7 md:px-8 md:py-8">
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
                SEASONAL & HOLIDAY
              </p>
              <h2 className="font-headline text-[30px] md:text-[38px] font-medium text-brand-pacific-dusk leading-[1.1] mb-3">
                Holiday Camps
              </h2>
              <p className="font-sans text-[15px] md:text-[17px] text-brand-pacific-dusk/70 max-w-2xl mb-6">
                Full camp lineup for spring, summer, and school-break windows with ages, schedules, and pricing.
              </p>
              <div className="mb-6 grid gap-2 md:grid-cols-2">
                <p className="rounded-[2px] bg-brand-morning-light px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  Best for families planning holiday/summer blocks in advance.
                </p>
                <p className="rounded-[2px] bg-brand-morning-light px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  See week-by-week windows, age group splits, and registration paths.
                </p>
              </div>
              <button
                type="button"
                onClick={() => expandSection('camps')}
                className="inline-flex items-center justify-center min-h-[48px] rounded-[2px] bg-black px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.3px] text-white transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Show Camp Schedule Details
              </button>
            </div>
          </div>
        </section>
      )}

      <HorizonDivider />

      {expandedSections.leagues ? (
        <LeaguesSection leagues={leagues} />
      ) : (
        <section id="leagues" className="scroll-mt-28 bg-white py-14 md:py-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="rounded-lg border border-black/[0.08] bg-brand-morning-light px-6 py-7 md:px-8 md:py-8">
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
                LEAGUES & MATCH PLAY
              </p>
              <h2 className="font-headline text-[30px] md:text-[38px] font-medium text-brand-pacific-dusk leading-[1.1] mb-3">
                USTA + UTR Competition
              </h2>
              <p className="font-sans text-[15px] md:text-[17px] text-brand-pacific-dusk/70 max-w-2xl mb-6">
                Team league options and UTR Match Play division details, with dates, levels, and registration paths.
              </p>
              <div className="mb-6 grid gap-2 md:grid-cols-2">
                <p className="rounded-[2px] bg-white px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  Best for players wanting structured competition and ranking progress.
                </p>
                <p className="rounded-[2px] bg-white px-3 py-2 font-sans text-[12px] text-brand-pacific-dusk/75">
                  Includes USTA team pathways and UTR match-play options by level.
                </p>
              </div>
              <button
                type="button"
                onClick={() => expandSection('leagues')}
                className="inline-flex items-center justify-center min-h-[48px] rounded-[2px] bg-black px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.3px] text-white transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Show League & Match Play Details
              </button>
            </div>
          </div>
        </section>
      )}

      <HorizonDivider />

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/60 uppercase tracking-[0.2em] mb-4">
            {seasonCta.headline}
          </p>
          <h2 className="font-headline text-[32px] md:text-[48px] font-medium text-white leading-[1.15] mb-4">
            Ready to Start Training?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-8">
            {seasonCta.subline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Book Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/50 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </DarkSection>

      {selectedProgram && (
        <RegistrationModal
          programName={selectedProgram.program}
          programDetails={`Ages ${selectedProgram.ages} · ${selectedProgram.duration} · ${selectedProgram.location}`}
          programDays={selectedProgram.schedule.map((slot) => slot.day)}
          pricingOptions={formatPricingOptions(selectedProgram.pricing)}
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          registrationSource="schedules_modal"
        />
      )}

      {selectedCamp && (
        <RegistrationModal
          programName={selectedCamp.name}
          programDetails={`Ages ${selectedCamp.ages} · ${selectedCamp.dates} · ${selectedCamp.location}`}
          isOpen={!!selectedCamp}
          onClose={() => setSelectedCamp(null)}
          registrationSource="camps_schedules_modal"
        />
      )}

      {privateCoachName && (
        <RegistrationModal
          programName={
            privateCoachName === 'Private Lessons'
              ? 'Private Lessons'
              : `Private Lessons — ${privateCoachName}`
          }
          programDetails="One-on-one coaching · Laguna Beach High School & Moulton Meadows"
          isOpen={!!privateCoachName}
          onClose={() => setPrivateCoachName(null)}
          registrationSource="private_lesson_modal"
          hideRec1
        />
      )}

      {!hasOpenModal ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-3 py-3 backdrop-blur-sm md:hidden pb-[calc(12px+env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-[1200px]">
            <SchedulesQuickActions compact onFindProgram={scrollToPrograms} />
          </div>
        </div>
      ) : null}
    </>
  )
}
