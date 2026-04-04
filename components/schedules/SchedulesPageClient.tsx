'use client'

import { useState } from 'react'
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

function formatPricingSummary(pricing: Program['pricing']): string {
  const labels: Record<string, string> = {
    '1x': '1x/wk',
    '2x': '2x/wk',
    '3x': '3x/wk',
    '4x': '4x/wk',
    '5x': '5x/wk',
    monthly: 'Monthly',
    drop_in: 'Drop-in',
    saturday1x: 'Sat only',
  }

  return Object.entries(pricing)
    .filter(([, amount]) => amount !== undefined && amount !== null)
    .map(([key, amount]) => `${labels[key] ?? key}: $${amount}`)
    .join(' · ')
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
        </div>
      </section>

      <HorizonDivider />

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedule & Pricing' }]} />
      </div>

      <SchedulesAnchorNav />

      <div className="bg-white px-4 md:px-6 pb-2">
        <div className="max-w-[1200px] mx-auto">
          <Link
            href="/schedules/calendar"
            className="inline-flex items-center gap-2 min-h-[48px] px-4 py-2 rounded-[2px] border border-black/10 bg-brand-sandstone/50 font-sans text-[14px] font-medium text-brand-pacific-dusk hover:border-brand-victoria-cove hover:bg-brand-sandstone focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
          >
            Calendar view · Print or save as PDF
          </Link>
          <p className="mt-4 font-sans text-[13px] md:text-[14px] text-brand-pacific-dusk/80 leading-relaxed max-w-2xl">
            New to LBTA?{' '}
            <Link
              href="/programs"
              className="font-medium text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/30 hover:decoration-brand-victoria-cove focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
            >
              Browse programs
            </Link>
            {' · '}
            <Link
              href="/book"
              className="font-medium text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/30 hover:decoration-brand-victoria-cove focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-sm"
            >
              Book a trial
            </Link>
          </p>
        </div>
      </div>

      <ProgramsSection
        programsBySeason={programsBySeason}
        seasons={seasons}
        initialSeason={initialSeason}
        onRegister={setSelectedProgram}
      />

      <HorizonDivider />

      <PrivateCoachingSection
        coaches={year2026.privateCoaching}
        monthlyPrograms={year2026.monthlyPrograms}
        discounts={year2026.discounts}
        scholarships={{ available: year2026.scholarships.available, coverage: year2026.scholarships.coverage ?? '', email: year2026.scholarships.email ?? '' }}
        onBookCoach={setPrivateCoachName}
      />

      <HorizonDivider />

      <CampsSection
        camps={scheduleCamps}
        onRegister={setSelectedCamp}
      />

      <HorizonDivider />

      <LeaguesSection leagues={leagues} />

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
          pricingSummary={formatPricingSummary(selectedProgram.pricing)}
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
    </>
  )
}
