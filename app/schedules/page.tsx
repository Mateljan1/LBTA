'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ComprehensiveFormTester from '@/components/ComprehensiveFormTester'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

import SchedulesHero from '@/components/schedules/SchedulesHero'
import TabNavigation, { ScheduleTab } from '@/components/schedules/TabNavigation'
import ProgramList from '@/components/schedules/ProgramList'
import PricingTab from '@/components/schedules/PricingTab'
import CampsJTTTab from '@/components/schedules/CampsJTTTab'
import SchedulesCTA from '@/components/schedules/SchedulesCTA'

import winter2026Data from '@/data/winter2026.json'
import fall2025Data from '@/data/fall2025.json'
import year2026Data from '@/data/year2026.json'
import { getSpringProgramsForDisplay, getSummerProgramsForDisplay, getSpringSummer2026 } from '@/lib/programs-data'
import { getCurrentSeason, getSeasonCTA, type ExtendedSeasonKey as SeasonKey } from '@/lib/season-utils'

type RegistrationModalType = 'camp' | 'jtt' | 'seasonal' | 'inquiry'

interface CampModalData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
}

interface JTTModalData {
  id: string
  name: string
  dates: string
  weeks: number
  matchDay: string
  divisions: { age: string; price: number }[]
  includes: string[]
  description: string
}

export default function SchedulesPage() {
  const seasonCta = useMemo(() => getSeasonCTA(), [])
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>(() => getCurrentSeason())
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [activeTab, setActiveTab] = useState<ScheduleTab>('programs')

  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [registrationModalType, setRegistrationModalType] = useState<RegistrationModalType>('camp')
  const [registrationModalData, setRegistrationModalData] = useState<CampModalData | JTTModalData | null>(null)

  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [formTesterOpen, setFormTesterOpen] = useState(false)

  const handleCampRegister = useCallback((camp: CampModalData) => {
    setRegistrationModalType('camp')
    setRegistrationModalData(camp)
    setRegistrationModalOpen(true)
  }, [])

  const handleJTTRegister = useCallback((jtt: JTTModalData) => {
    setRegistrationModalType('jtt')
    setRegistrationModalData(jtt)
    setRegistrationModalOpen(true)
  }, [])

  const seasons = year2026Data.seasons
  const currentSeasonData = selectedSeason === 'fall2025' ? null : seasons[selectedSeason as keyof typeof seasons]

  const allPrograms: Program[] = useMemo(() => {
    switch (selectedSeason) {
      case 'winter': return winter2026Data.programs as Program[]
      case 'fall2025': return fall2025Data.programs as Program[]
      case 'spring': return getSpringProgramsForDisplay() as Program[]
      case 'summer': return getSummerProgramsForDisplay() as Program[]
      default: return winter2026Data.programs as Program[]
    }
  }, [selectedSeason])

  useEffect(() => {
    setSelectedProgram(null)
  }, [selectedSeason])

  const handleRegister = useCallback((program: Program) => {
    setSelectedProgram(program)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        e.preventDefault()
        setAnalyticsOpen(true)
      }
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
        e.preventDefault()
        setFormTesterOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const seasonLabel = currentSeasonData?.name || 'Fall 2025'
  const seasonDates = currentSeasonData?.dates || 'September – December 2025'
  const seasonWeeks = currentSeasonData?.weeks || 18

  return (
    <>
      <SchedulesHero ctaText={seasonCta.headline} />

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedules & Pricing' }]} />
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'programs' && (
        <div id="programs-panel" role="tabpanel" aria-labelledby="programs-tab">
          <ProgramList
            programs={allPrograms}
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            onRegister={handleRegister}
            seasonLabel={seasonLabel}
            seasonDates={seasonDates}
            seasonWeeks={seasonWeeks}
          />
          <PricingTab
            seasons={seasons}
            selectedSeason={selectedSeason}
            springSummerData={getSpringSummer2026()}
            basePricing={year2026Data.basePricing}
            monthlyPrograms={year2026Data.monthlyPrograms}
            privateCoaching={year2026Data.privateCoaching}
            discounts={year2026Data.discounts}
            scholarships={year2026Data.scholarships}
          />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div id="calendar-panel" role="tabpanel" aria-labelledby="calendar-tab">
          <CampsJTTTab
            camps={year2026Data.camps}
            jtt={year2026Data.jtt}
            onCampRegister={handleCampRegister}
            onJTTRegister={handleJTTRegister}
          />
        </div>
      )}

      <SchedulesCTA ctaHeadline={seasonCta.headline} ctaSubline={seasonCta.subline} />

      {selectedProgram && (
        <LuxuryRegistrationModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}

      <LuxuryYearModal
        isOpen={registrationModalOpen}
        onClose={() => {
          setRegistrationModalOpen(false)
          setRegistrationModalData(null)
        }}
        type={registrationModalType}
        data={registrationModalData}
        season={selectedSeason}
      />

      {process.env.NODE_ENV === 'development' && (
        <>
          <AnalyticsDashboard
            isVisible={analyticsOpen}
            onClose={() => setAnalyticsOpen(false)}
          />
          <ComprehensiveFormTester
            isVisible={formTesterOpen}
            onClose={() => setFormTesterOpen(false)}
          />
        </>
      )}
    </>
  )
}
