'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import { getSeasonCTA } from '@/lib/season-utils'

import ProgramsSection from '@/components/schedules/ProgramsSection'
import CampsSection from '@/components/schedules/CampsSection'
import LeaguesSection from '@/components/schedules/LeaguesSection'
import PrivateCoachingSection from '@/components/schedules/PrivateCoachingSection'

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
          <h1 className="font-headline text-[40px] md:text-[64px] font-medium text-white leading-[1.05] mb-6">
            Schedule & Pricing
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] text-white/70 max-w-[600px] mx-auto">
            Programs, camps, leagues, and private coaching. Everything we offer, in one place.
          </p>
        </div>
      </section>

      <HorizonDivider />

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedule & Pricing' }]} />
      </div>

      <ProgramsSection onRegister={setSelectedProgram} />

      <HorizonDivider />

      <CampsSection
        camps={year2026Data.camps}
        onRegister={() => { window.location.href = '/contact' }}
      />

      <HorizonDivider />

      <LeaguesSection />

      <HorizonDivider />

      <PrivateCoachingSection
        coaches={year2026Data.privateCoaching}
        monthlyPrograms={year2026Data.monthlyPrograms}
        discounts={year2026Data.discounts}
        scholarships={year2026Data.scholarships}
      />

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
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              Book Trial
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-transparent text-white border border-white/50 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-2"
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
