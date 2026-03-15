'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
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

export default function SchedulesPageClient({
  programsBySeason,
  seasons,
  initialSeason,
  seasonCta,
  year2026,
  leagues,
}: SchedulesPageClientProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  return (
    <>
      <section className="bg-brand-deep-water py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/50 uppercase tracking-[0.2em] mb-4">
            {seasonCta.headline}
          </p>
          <h1 className="font-headline text-[40px] md:text-[64px] font-medium text-white leading-[1.05] mb-3">
            Schedule & Pricing
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] text-white/60 tracking-[0.12em] mb-6">
            Movement · Craft · Community
          </p>
          <p className="font-sans text-[16px] md:text-[18px] text-white/70 max-w-[600px] mx-auto">
            Programs, camps, leagues, and private coaching. Everything we offer, in one place.
          </p>
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

      <PrivateCoachingSection
        coaches={year2026.privateCoaching}
        monthlyPrograms={year2026.monthlyPrograms}
        discounts={year2026.discounts}
        scholarships={{ available: year2026.scholarships.available, coverage: year2026.scholarships.coverage ?? '', email: year2026.scholarships.email ?? '' }}
      />

      <HorizonDivider />

      <CampsSection
        camps={year2026.camps}
        onRegister={() => { window.location.href = '/contact' }}
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
        <LuxuryRegistrationModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </>
  )
}
