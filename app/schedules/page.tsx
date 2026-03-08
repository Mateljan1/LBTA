'use client'

import { useState, useMemo } from 'react'
import type { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import { getSeasonCTA } from '@/lib/season-utils'

import ProgramsSection from '@/components/schedules/ProgramsSection'
import CampsSection from '@/components/schedules/CampsSection'
import LeaguesSection from '@/components/schedules/LeaguesSection'
import PrivateCoachingSection from '@/components/schedules/PrivateCoachingSection'
import SchedulesCTA from '@/components/schedules/SchedulesCTA'

import year2026Data from '@/data/year2026.json'

export default function SchedulesPage() {
  const seasonCta = useMemo(() => getSeasonCTA(), [])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)

  return (
    <>
      {/* Compact Header */}
      <section className="bg-brand-deep-water py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
          <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/50 uppercase tracking-[0.2em] mb-4">
            {seasonCta.headline}
          </p>
          <h1 className="font-serif text-[40px] md:text-[64px] font-medium text-white leading-[1.05] mb-6">
            Schedule & Pricing
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/70 max-w-[600px] mx-auto">
            Programs, camps, leagues, and private coaching. Everything we offer, in one place.
          </p>
        </div>
      </section>

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedule & Pricing' }]} />
      </div>

      <ProgramsSection onRegister={setSelectedProgram} />

      <CampsSection
        camps={year2026Data.camps}
        onRegister={() => { window.location.href = '/contact' }}
      />

      <LeaguesSection />

      <PrivateCoachingSection
        coaches={year2026Data.privateCoaching}
        monthlyPrograms={year2026Data.monthlyPrograms}
        discounts={year2026Data.discounts}
        scholarships={year2026Data.scholarships}
      />

      <SchedulesCTA ctaHeadline={seasonCta.headline} ctaSubline={seasonCta.subline} />

      {selectedProgram && (
        <LuxuryRegistrationModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </>
  )
}
