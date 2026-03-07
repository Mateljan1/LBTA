'use client'

import { useState, useMemo, useEffect } from 'react'
import { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ComprehensiveFormTester from '@/components/ComprehensiveFormTester'
import { trackFormStart } from '@/lib/form-analytics'
import MobileFilterOverlay from '@/components/MobileFilterOverlay'
import BackToTopButton from '@/components/BackToTopButton'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

import SchedulesHero from '@/components/schedules/SchedulesHero'
import YearAtAGlance from '@/components/schedules/YearAtAGlance'
import TabNavigation, { ScheduleTab } from '@/components/schedules/TabNavigation'
import ProgramsTab from '@/components/schedules/ProgramsTab'
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [heroParallax, setHeroParallax] = useState(0)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [formTesterOpen, setFormTesterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ScheduleTab>('programs')
  
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [registrationModalType, setRegistrationModalType] = useState<RegistrationModalType>('camp')
  const [registrationModalData, setRegistrationModalData] = useState<CampModalData | JTTModalData | null>(null)

  const handleCampRegister = (camp: CampModalData) => {
    setRegistrationModalType('camp')
    setRegistrationModalData(camp)
    setRegistrationModalOpen(true)
  }

  const handleJTTRegister = (jtt: JTTModalData) => {
    setRegistrationModalType('jtt')
    setRegistrationModalData(jtt)
    setRegistrationModalOpen(true)
  }
  
  const seasons = year2026Data.seasons
  const currentSeasonData = selectedSeason === 'fall2025' ? null : seasons[selectedSeason as keyof typeof seasons]
  
  const allPrograms: Program[] =
    selectedSeason === 'winter'
      ? (winter2026Data.programs as Program[])
      : selectedSeason === 'fall2025'
        ? (fall2025Data.programs as Program[])
        : selectedSeason === 'spring'
          ? (getSpringProgramsForDisplay() as Program[])
          : selectedSeason === 'summer'
            ? (getSummerProgramsForDisplay() as Program[])
            : (winter2026Data.programs as Program[])
  
  const categories = ['all', ...Array.from(new Set(allPrograms.map(p => p.category)))]
  const locations = ['all', ...Array.from(new Set(allPrograms.map(p => p.location)))]
  
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
      const locationMatch = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation)
      const dayMatch = selectedDays.length === 0 || p.schedule.some(s => selectedDays.includes(s.day))
      return categoryMatch && locationMatch && dayMatch
    })
  }, [allPrograms, selectedCategory, selectedLocation, selectedDays])
  
  const groupedPrograms = useMemo(() => {
    const groups: { [key: string]: Program[] } = {}
    filteredPrograms.forEach(program => {
      if (!groups[program.category]) {
        groups[program.category] = []
      }
      groups[program.category].push(program)
    })
    return groups
  }, [filteredPrograms])
  
  const toggleAccordion = (category: string) => {
    const willExpand = !expandedAccordions.includes(category)
    setExpandedAccordions(prev =>
      prev.includes(category) ? [] : [category]
    )
    if (willExpand) {
      setTimeout(() => {
        const element = document.getElementById(`accordion-header-${category}`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }, 250)
    }
  }
  
  const handleRegister = (program: Program) => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    setSelectedProgram(program)
  }
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setHeroParallax(scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
  
  useEffect(() => {
    const savedFilters = localStorage.getItem('lbta-schedule-filters')
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        setSelectedCategory(filters.category || 'all')
        setSelectedLocation(filters.location || 'all')
        setSelectedDays(filters.days || [])
      } catch (e) {}
    }
  }, [])
  
  useEffect(() => {
    localStorage.setItem('lbta-schedule-filters', JSON.stringify({
      category: selectedCategory,
      location: selectedLocation,
      days: selectedDays
    }))
  }, [selectedCategory, selectedLocation, selectedDays])
  
  const seasonLabel = currentSeasonData?.name || 'Fall 2025'
  const seasonDates = currentSeasonData?.dates || 'September – December 2025'
  const seasonWeeks = currentSeasonData?.weeks || 18

  return (
    <>
      <SchedulesHero heroParallax={heroParallax} ctaText={seasonCta.headline} />

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedules & Pricing' }]} />
      </div>

      <YearAtAGlance
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
      />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'programs' && (
        <div id="programs-panel" role="tabpanel" aria-labelledby="programs-tab">
          <ProgramsTab
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedDays={selectedDays}
            onDaysChange={setSelectedDays}
            categories={categories}
            filteredPrograms={filteredPrograms}
            groupedPrograms={groupedPrograms}
            expandedAccordions={expandedAccordions}
            onToggleAccordion={toggleAccordion}
            onRegister={handleRegister}
            onMobileFilterOpen={() => setMobileFilterOpen(true)}
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
      
      <MobileFilterOverlay
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
        selectedDays={selectedDays}
        onCategoryChange={setSelectedCategory}
        onLocationChange={setSelectedLocation}
        onDaysChange={setSelectedDays}
        categories={categories}
        locations={locations}
      />
      
      <BackToTopButton />
      
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
