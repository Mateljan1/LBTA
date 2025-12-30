'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronUp, SlidersHorizontal, Check } from 'lucide-react'
import ProgramCard, { Program } from '@/components/ProgramCard'
import LuxuryRegistrationModal from '@/components/LuxuryRegistrationModal'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ComprehensiveFormTester from '@/components/ComprehensiveFormTester'
import { trackProgramView, trackFormStart } from '@/lib/form-analytics'
import MobileFilterOverlay from '@/components/MobileFilterOverlay'
import BackToTopButton from '@/components/BackToTopButton'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

// Import data
import winter2026Data from '@/data/winter2026.json'
import fall2025Data from '@/data/fall2025.json'
import year2026Data from '@/data/year2026.json'

type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall' | 'fall2025'

// Types for registration modal
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
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('winter')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [heroParallax, setHeroParallax] = useState(0)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [formTesterOpen, setFormTesterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'programs' | 'calendar' | 'pricing'>('programs')
  
  // Registration modal state
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [registrationModalType, setRegistrationModalType] = useState<RegistrationModalType>('camp')
  const [registrationModalData, setRegistrationModalData] = useState<CampModalData | JTTModalData | null>(null)

  // Handle camp registration
  const handleCampRegister = (camp: CampModalData) => {
    setRegistrationModalType('camp')
    setRegistrationModalData(camp)
    setRegistrationModalOpen(true)
  }

  // Handle JTT registration
  const handleJTTRegister = (jtt: JTTModalData) => {
    setRegistrationModalType('jtt')
    setRegistrationModalData(jtt)
    setRegistrationModalOpen(true)
  }
  
  // Get season data
  const seasons = year2026Data.seasons
  const currentSeasonData = selectedSeason === 'fall2025' ? null : seasons[selectedSeason as keyof typeof seasons]
  
  // Get programs for selected season (Winter 2026 or Fall 2025 have actual program data)
  const allPrograms = selectedSeason === 'winter' 
    ? (winter2026Data.programs as Program[])
    : selectedSeason === 'fall2025'
    ? (fall2025Data.programs as Program[])
    : (winter2026Data.programs as Program[]) // Use winter as base for other seasons
  
  // Calculate season-adjusted pricing
  const getSeasonPrice = (basePrice: number): number => {
    if (selectedSeason === 'fall2025') return basePrice
    const multiplier = currentSeasonData?.multiplier || 1
    return Math.round(basePrice * multiplier)
  }
  
  // Get unique categories and locations
  const categories = ['all', ...Array.from(new Set(allPrograms.map(p => p.category)))]
  const locations = ['all', ...Array.from(new Set(allPrograms.map(p => p.location)))]
  
  // Filter programs
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
      const locationMatch = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation)
      const dayMatch = selectedDays.length === 0 || p.schedule.some(s => selectedDays.includes(s.day))
      return categoryMatch && locationMatch && dayMatch
    })
  }, [allPrograms, selectedCategory, selectedLocation, selectedDays])
  
  // Group by category for accordion display
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
  
  // Handle accordion toggle
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
  
  // Handle registration
  const handleRegister = (program: Program) => {
    trackFormStart(program.id, program.program, program.category, 'embedded')
    setSelectedProgram(program)
  }
  
  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setHeroParallax(scrollY * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Keyboard shortcuts
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
  
  // Restore filter state
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
  
  // Save filter state
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
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy training at sunset"
            fill
            priority
            className="object-cover"
            quality={90}
            style={{ 
              objectPosition: '50% 70%',
              transform: `translateY(${heroParallax}px)`
            }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-4xl mx-auto py-24">
          <p className="font-sans text-[12px] md:text-[14px] uppercase tracking-[3px] text-white/70 mb-4">
            Plan Your 2026
          </p>
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] tracking-[-0.5px] mb-6 text-shadow">
            Schedule & Pricing
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-4 max-w-[90%] mx-auto">
            Four seasons of structured training, holiday camps, and competitive league play
          </p>
          <p className="font-sans text-[14px] md:text-[16px] text-white/90 font-semibold mb-8">
            Winter 2026 Registration Now Open — Save $50 with Early Bird
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#programs"
              className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
            >
              View Programs
            </Link>
            <Link 
              href="#pricing"
              className="inline-block border-2 border-white hover:bg-white/10 text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Schedules & Pricing' }]} />
      </div>

      {/* YEAR AT A GLANCE */}
      <section className="bg-white py-12 md:py-20 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-center mb-4">
            2026 Year at a Glance
          </h2>
          <p className="font-sans text-[14px] md:text-[16px] text-black/60 text-center mb-10 max-w-2xl mx-auto">
            50 weeks of tennis across four seasons, plus holiday camps and competitive leagues
          </p>
          
          {/* Season Cards */}
          <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {Object.entries(seasons).map(([key, season]) => {
              const isActive = selectedSeason === key
              const isOpen = season.status === 'registration_open'
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSeason(key as SeasonKey)}
                  className={`relative p-6 rounded-2xl text-left transition-all duration-300 ${
                    isActive 
                      ? 'bg-black text-white shadow-lg scale-[1.02]' 
                      : 'bg-[#FAF8F3] hover:bg-gray-100 text-black'
                  }`}
                >
                  {isOpen && (
                    <span className={`absolute top-4 right-4 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                    }`}>
                      Open
                    </span>
                  )}
                  <h3 className={`font-serif text-[20px] md:text-[24px] font-semibold mb-2 ${isActive ? 'text-white' : 'text-black'}`}>
                    {season.name.split(' ')[0]}
                  </h3>
                  <p className={`font-sans text-[13px] mb-3 ${isActive ? 'text-white/80' : 'text-black/60'}`}>
                    {season.dates}
                  </p>
                  <div className={`font-sans text-[14px] font-medium ${isActive ? 'text-white' : 'text-black'}`}>
                    {season.weeks} weeks
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Quick Stats - Minimal Typography Only */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">50</div>
              <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Weeks of Tennis</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">7</div>
              <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Camp Programs</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">2</div>
              <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">JTT Seasons</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">$50</div>
              <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Early Bird Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          {/* Main Tabs */}
          <div className="flex justify-center gap-2 py-4" role="tablist">
            <button
              onClick={() => setActiveTab('programs')}
              role="tab"
              aria-selected={activeTab === 'programs'}
              className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
                activeTab === 'programs'
                  ? 'bg-black text-white'
                  : 'text-black/70 hover:bg-gray-100'
              }`}
            >
              Programs
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              role="tab"
              aria-selected={activeTab === 'pricing'}
              className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
                activeTab === 'pricing'
                  ? 'bg-black text-white'
                  : 'text-black/70 hover:bg-gray-100'
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              role="tab"
              aria-selected={activeTab === 'calendar'}
              className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
                activeTab === 'calendar'
                  ? 'bg-black text-white'
                  : 'text-black/70 hover:bg-gray-100'
              }`}
            >
              Camps & JTT
            </button>
          </div>
        </div>
      </div>

      {/* PROGRAMS TAB */}
      {activeTab === 'programs' && (
        <>
          {/* Season Filter Bar */}
          <div className="bg-[#FAF8F3] py-4 border-b border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="font-sans text-[14px] text-black/60 mr-2">Season:</span>
                {Object.entries(seasons).map(([key, season]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSeason(key as SeasonKey)}
                    className={`px-4 py-2 rounded-full font-sans text-[13px] font-medium transition-all ${
                      selectedSeason === key
                        ? 'bg-black text-white'
                        : 'bg-white text-black/70 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {season.name.split(' ')[0]}
                    {season.status === 'registration_open' && (
                      <span className="ml-1.5 w-2 h-2 bg-green-400 rounded-full inline-block" />
                    )}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedSeason('fall2025')}
                  className={`px-4 py-2 rounded-full font-sans text-[13px] font-medium transition-all ${
                    selectedSeason === 'fall2025'
                      ? 'bg-black text-white'
                      : 'bg-white text-black/70 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  Fall 2025
                </button>
              </div>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center justify-center gap-4 mt-4">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-[14px] text-black/80 focus:border-black focus:outline-none font-sans cursor-pointer min-w-[160px]"
                  aria-label="Filter by program type"
                >
                  <option value="all">All Programs</option>
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-[14px] text-black/80 focus:border-black focus:outline-none font-sans cursor-pointer min-w-[160px]"
                  aria-label="Filter by location"
                >
                  <option value="all">All Locations</option>
                  <option value="moulton">Moulton Meadows</option>
                  <option value="alta">Alta Laguna Park</option>
                  <option value="lbhs">Laguna Beach High School</option>
                </select>
              </div>
              
              <p className="hidden md:block text-center text-[13px] text-black/60 font-sans mt-4 italic">
                {seasonLabel}: {seasonDates} · {seasonWeeks} weeks · Prices adjust by season length
              </p>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-30 bg-black hover:bg-[#1a1a1a] text-white px-5 py-3.5 rounded-full shadow-lg font-sans font-semibold text-[14px] flex items-center gap-2 min-h-[48px]"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Program Accordions */}
          <section id="programs" className="bg-[#FAF8F3] py-12 md:py-20">
            <div className="max-w-[1440px] mx-auto px-4 md:px-6">
              <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-2 text-center">
                {seasonLabel} Programs
              </h2>
              <p className="font-sans text-[14px] md:text-[16px] text-black/60 mb-10 text-center">
                {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} available
              </p>
              
              {filteredPrograms.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <p className="font-sans text-[16px] text-black/60">
                    No programs match your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedLocation('all')
                      setSelectedDays([])
                    }}
                    className="mt-4 text-black hover:underline font-sans font-semibold"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-10">
                  {Object.entries(groupedPrograms).map(([category, programs], index) => {
                    const isExpanded = expandedAccordions.includes(category)
                    
                    return (
                      <div 
                        key={category} 
                        id={`accordion-header-${category}`}
                        className="bg-white rounded-3xl shadow-soft overflow-hidden"
                      >
                        <button
                          onClick={() => toggleAccordion(category)}
                          className="accordion-header w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between bg-[#FAF8F3] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                          aria-expanded={isExpanded}
                          aria-controls={`accordion-${category}`}
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <h3 className="font-serif text-[24px] md:text-[32px] font-bold text-black">
                              {category} Programs
                            </h3>
                            <span className="font-sans text-[16px] md:text-[18px] text-black font-semibold bg-black/5 px-3 py-1 rounded-full">
                              {programs.length}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 md:w-7 md:h-7 text-black" />
                          ) : (
                            <ChevronDown className="w-6 h-6 md:w-7 md:h-7 text-black" />
                          )}
                        </button>
                        
                        {isExpanded && (
                          <div 
                            id={`accordion-${category}`}
                            className="accordion-content px-4 md:px-6 py-6 md:py-8 bg-white"
                          >
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                              {programs.map((program) => (
                                <ProgramCard
                                  key={program.id}
                                  program={program}
                                  onRegister={handleRegister}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* PRICING TAB */}
      {activeTab === 'pricing' && (
        <section id="pricing" className="bg-[#FAF8F3] py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            {/* Urgency Banner */}
            <div className="bg-black text-white rounded-xl p-4 md:p-6 mb-10 text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="font-sans text-[14px] font-semibold">Winter 2026 Registration Open</span>
                </div>
                <span className="hidden md:block text-white/40">|</span>
                <span className="font-sans text-[14px] text-white/80">
                  Early bird ends Dec 20 — <span className="text-green-400 font-semibold">Save $50</span>
                </span>
                <span className="hidden md:block text-white/40">|</span>
                <span className="font-sans text-[13px] text-white/70 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Only 12 spots left in Junior Development
                </span>
              </div>
            </div>

            <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-center mb-4">
              2026 Program Pricing
            </h2>
            <p className="font-sans text-[14px] md:text-[16px] text-black/60 text-center mb-10 max-w-2xl mx-auto">
              93% of players see measurable improvement within 8 weeks. 
              <span className="text-black font-medium"> 2x/week is most popular</span> — optimal frequency for consistent progress.
            </p>

            {/* Season Price Comparison */}
            <div className="bg-white rounded-2xl p-6 md:p-8 mb-10 shadow-soft">
              <h3 className="font-serif text-[20px] md:text-[24px] font-semibold mb-6 text-center">
                Seasonal Price Adjustments
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(seasons).map(([key, season]) => (
                  <div 
                    key={key}
                    className={`p-4 rounded-xl text-center ${
                      key === 'winter' ? 'bg-black/5 border-2 border-black' : 'bg-gray-50'
                    }`}
                  >
                    <div className="font-sans text-[13px] text-black/60 uppercase tracking-wider mb-1">
                      {season.name.split(' ')[0]}
                    </div>
                    <div className="font-serif text-[24px] font-bold text-black">
                      {season.weeks} weeks
                    </div>
                    <div className={`font-sans text-[14px] mt-1 ${key === 'winter' ? 'text-black font-semibold' : 'text-black/60'}`}>
                      {key === 'winter' ? 'Base Rate' : `${Math.round(season.multiplier * 100)}% of Winter`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarterly Programs Pricing */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft mb-8 relative">
              {/* Most Popular Ribbon */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-black text-white font-sans text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-b-lg">
                  Most Popular: 2x/week
                </div>
              </div>
              
              <div className="bg-black text-white px-6 py-4 pt-8">
                <h3 className="font-serif text-[20px] md:text-[24px] font-semibold">
                  Quarterly Programs
                </h3>
                <p className="font-sans text-[13px] text-white/70 mt-1">
                  Billed per season · Winter 2026 prices shown · <span className="text-green-400">Early bird: Save $50</span>
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-6 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase tracking-wider">Program</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase tracking-wider">1x/week</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-white uppercase tracking-wider bg-black relative">
                        <span className="flex items-center justify-center gap-1.5">
                          2x/week
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="block text-[10px] text-white/80 normal-case font-normal">Best Value</span>
                      </th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase tracking-wider">3x/week</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase tracking-wider">Drop-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(year2026Data.basePricing).map(([key, program], index) => {
                      // Capacity indicators for urgency
                      const capacityMap: { [key: string]: { spots: number; color: string } } = {
                        'junior': { spots: 8, color: 'text-orange-600 bg-orange-50' },
                        'youthDevelopment': { spots: 12, color: 'text-orange-600 bg-orange-50' },
                        'highPerformance': { spots: 4, color: 'text-red-600 bg-red-50' },
                        'adultBeginner': { spots: 16, color: 'text-green-600 bg-green-50' },
                        'adultIntermediate': { spots: 10, color: 'text-orange-600 bg-orange-50' },
                        'adultAdvanced': { spots: 6, color: 'text-orange-600 bg-orange-50' },
                      }
                      const capacity = capacityMap[key]
                      
                      return (
                        <tr key={key} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="font-sans text-[15px] font-semibold text-black">{program.label}</div>
                              {capacity && capacity.spots <= 8 && (
                                <span className={`font-sans text-[10px] font-semibold px-2 py-0.5 rounded-full ${capacity.color}`}>
                                  {capacity.spots} spots
                                </span>
                              )}
                            </div>
                            <div className="font-sans text-[12px] text-black/60">{program.subtitle}</div>
                            <div className="font-sans text-[11px] text-black/40 mt-1">{program.ages} · {program.duration}</div>
                          </td>
                          <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                            ${program.winterPrices['1x']}
                          </td>
                          <td className="text-center px-4 py-4 font-sans text-[18px] font-bold text-black bg-black/5 border-x-2 border-black">
                            ${program.winterPrices['2x']}
                            <div className="text-[11px] font-normal text-green-600">Save ${Math.round(program.winterPrices['1x'] * 2 - program.winterPrices['2x'])}</div>
                          </td>
                          <td className="text-center px-4 py-4 font-sans text-[16px] text-black/70">
                            {'3x' in program.winterPrices ? `$${(program.winterPrices as any)['3x']}` : '—'}
                          </td>
                          <td className="text-center px-4 py-4 font-sans text-[14px] text-black/50 line-through">
                            ${program.dropIn}/class
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Value Proposition Footer */}
              <div className="bg-[#FAF8F3] px-6 py-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-6 text-[13px]">
                  <span className="flex items-center gap-2 text-black/70">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    30-day money-back guarantee
                  </span>
                  <span className="flex items-center gap-2 text-black/70">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Makeup classes included
                  </span>
                  <span className="flex items-center gap-2 text-black/70">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly Programs */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft mb-8">
              <div className="bg-black text-white px-6 py-4">
                <h3 className="font-serif text-[20px] md:text-[24px] font-semibold">
                  Monthly Programs
                </h3>
                <p className="font-sans text-[13px] text-white/80 mt-1">
                  Flexible month-to-month billing
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {Object.entries(year2026Data.monthlyPrograms).map(([key, program]) => (
                  <div key={key} className="p-6 text-center">
                    <div className="font-sans text-[16px] font-semibold text-black mb-1">{program.label}</div>
                    <div className="font-sans text-[12px] text-black/60 mb-3">{program.subtitle}</div>
                    <div className="font-serif text-[32px] font-bold text-black">${program.price}</div>
                    <div className="font-sans text-[12px] text-black/60">/month</div>
                    <div className="font-sans text-[13px] text-black/50 mt-2">Drop-in: ${program.dropIn}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private Coaching */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-soft mb-8">
              <div className="bg-black text-white px-6 py-4">
                <h3 className="font-serif text-[20px] md:text-[24px] font-semibold">
                  Private Coaching
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left px-6 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase">Coach</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase">60 min</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase">90 min</th>
                      <th className="text-center px-4 py-4 font-sans text-[13px] font-semibold text-black/60 uppercase">Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {year2026Data.privateCoaching.map((coach) => (
                      <tr key={coach.coach} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-sans text-[15px] font-semibold text-black">{coach.coach}</div>
                          <div className="font-sans text-[12px] text-black/60">{coach.title}</div>
                        </td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black">${coach.rate60}</td>
                        <td className="text-center px-4 py-4 font-sans text-[16px] text-black">${coach.rate90}</td>
                        <td className="text-center px-4 py-4">
                          <span className={`font-sans text-[12px] px-3 py-1 rounded-full ${
                            coach.availability === 'Limited' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {coach.availability}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discounts & Scholarships */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h3 className="font-serif text-[20px] font-semibold mb-4">Available Discounts</h3>
                <ul className="space-y-3">
                  {Object.entries(year2026Data.discounts).map(([key, discount]) => (
                    <li key={key} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-sans text-[15px] font-medium text-black">
                          {discount.type === 'fixed' ? `$${discount.amount}` : `${discount.amount}%`} off
                        </span>
                        <span className="font-sans text-[14px] text-black/60 ml-1">— {discount.description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-lbta-beige rounded-2xl p-6">
                <h3 className="font-serif text-[20px] font-semibold mb-4">Scholarship Program</h3>
                <p className="font-sans text-[14px] text-black/70 mb-4">
                  We believe tennis should be accessible to all. Our scholarship program provides {year2026Data.scholarships.coverage} tuition assistance for qualifying families.
                </p>
                <Link 
                  href={`mailto:${year2026Data.scholarships.email}`}
                  className="inline-flex items-center font-sans text-[14px] font-semibold text-black hover:text-black/70"
                >
                  Apply for Scholarship →
                </Link>
              </div>
            </div>

            {/* Payment Note */}
            <p className="text-center font-sans text-[13px] text-black/50 mt-8 italic">
              Payment plans available for quarterly programs. Contact us for details.
            </p>
          </div>
        </section>
      )}

      {/* CAMPS & JTT TAB */}
      {activeTab === 'calendar' && (
        <section className="bg-white py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            
            {/* Featured: Swim & Tennis Camp */}
            {year2026Data.camps.filter((c: any) => c.featured).map((camp: any) => (
              <div key={camp.id} className="mb-20 md:mb-28">
                <div className="text-center mb-12">
                  <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/60 mb-3">
                    Featured Program
                  </p>
                  <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1] mb-4">
                    {camp.name}
                  </h2>
                  <p className="font-sans text-[15px] md:text-[17px] text-black/60 max-w-xl mx-auto leading-relaxed">
                    {camp.description}
                  </p>
                </div>
                
                <div className="bg-[#FAF8F3] rounded-[2px] overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    {/* Left: Details */}
                    <div className="p-8 md:p-12">
                      <div className="space-y-6">
                        <div>
                          <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Led By</div>
                          <div className="font-sans text-[15px] text-black">{camp.coaches?.join(' & ')}</div>
                        </div>
                        <div>
                          <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Dates</div>
                          <div className="font-sans text-[15px] text-black">{camp.dates}</div>
                        </div>
                        <div>
                          <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Schedule</div>
                          <div className="font-sans text-[15px] text-black">{camp.days} · {camp.hours}</div>
                        </div>
                        <div>
                          <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Ages</div>
                          <div className="font-sans text-[15px] text-black">{camp.ages}</div>
                        </div>
                        <div>
                          <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Location</div>
                          <div className="font-sans text-[15px] text-black">{camp.location}</div>
                        </div>
                      </div>
                      
                      {/* Safety Note */}
                      {camp.safetyNote && (
                        <div className="mt-8 p-4 bg-gray-100 border-l-2 border-black">
                          <div className="font-sans text-[12px] font-semibold text-black uppercase tracking-wider mb-1">
                            Important
                          </div>
                          <p className="font-sans text-[13px] text-black/70">
                            {camp.safetyNote}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Right: Pricing & Includes */}
                    <div className="p-8 md:p-12 bg-white border-t md:border-t-0 md:border-l border-black/5">
                      <div className="mb-8">
                        <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-2">Weekly Rate</div>
                        <div className="font-serif text-[48px] font-light text-black leading-none">${camp.price}</div>
                        <div className="font-sans text-[13px] text-black/50 mt-1">${camp.perDay}/day</div>
                      </div>
                      
                      <div>
                        <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-4">Includes</div>
                        <ul className="space-y-3">
                          {camp.includes.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0" />
                              <span className="font-sans text-[14px] text-black/70">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => handleCampRegister(camp as CampModalData)}
                        className="mt-8 inline-block bg-black text-white font-sans text-[13px] font-medium tracking-[2px] uppercase py-4 px-8 hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Holiday Camps Section */}
            <div className="mb-20 md:mb-28">
              <div className="text-center mb-12">
                <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/40 mb-3">
                  School Breaks
                </p>
                <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1]">
                  Holiday Camps
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
                {year2026Data.camps.filter((c: any) => !c.featured).map((camp: any) => (
                  <div key={camp.id} className="bg-white p-8 hover:bg-[#FAF8F3] transition-colors duration-300 flex flex-col">
                    <div className="mb-6">
                      <h3 className="font-serif text-[20px] md:text-[24px] font-normal text-black mb-1">
                        {camp.name}
                      </h3>
                      <p className="font-sans text-[13px] text-black/50">{camp.dates}</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Ages</span>
                        <span className="font-sans text-[13px] text-black">{camp.ages}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Hours</span>
                        <span className="font-sans text-[13px] text-black">{camp.hours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Location</span>
                        <span className="font-sans text-[13px] text-black">{camp.location?.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-black/5 flex-grow">
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="font-serif text-[32px] font-light text-black">${camp.price}</span>
                        {camp.halfDay && (
                          <span className="font-sans text-[12px] text-black/50">Half-day: ${camp.halfDay}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCampRegister(camp as CampModalData)}
                        className="block w-full text-center bg-black text-white font-sans text-[12px] font-medium tracking-[1.5px] uppercase py-3 hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JTT Section */}
            <div>
              <div className="text-center mb-12">
                <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/40 mb-3">
                  USTA League Competition
                </p>
                <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1] mb-4">
                  Junior Team Tennis
                </h2>
                <p className="font-sans text-[15px] md:text-[17px] text-black/60 max-w-xl mx-auto leading-relaxed">
                  Team practices, Sunday matches, uniforms, and USTA registration included
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-px bg-black/5">
                {year2026Data.jtt.map((season: any) => (
                  <div key={season.id} className="bg-white flex flex-col">
                    <div className="p-8 border-b border-black/5">
                      <h3 className="font-serif text-[24px] md:text-[28px] font-normal text-black mb-1">
                        {season.name}
                      </h3>
                      <p className="font-sans text-[13px] text-black/50">{season.dates}</p>
                      <p className="font-sans text-[12px] text-black/40 mt-2">
                        {season.weeks} weeks · {season.matchDay}
                      </p>
                    </div>
                    
                    <div className="p-8 flex-grow">
                      <div className="space-y-0">
                        {season.divisions.map((div: any) => (
                          <div key={div.age} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
                            <span className="font-sans text-[14px] text-black">{div.age}</span>
                            <span className="font-serif text-[20px] font-light text-black">${div.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleJTTRegister(season as JTTModalData)}
                        className="mt-6 block w-full text-center bg-black text-white font-sans text-[12px] font-medium tracking-[1.5px] uppercase py-3 hover:bg-[#1a1a1a] transition-colors duration-300 cursor-pointer"
                      >
                        Register for {season.name}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* JTT Includes */}
              <div className="mt-8 p-8 bg-[#FAF8F3]">
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                  {year2026Data.jtt[0].includes.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-black rounded-full" />
                      <span className="font-sans text-[13px] text-black/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA SECTION */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 py-20">
          <p className="font-sans text-[12px] md:text-[14px] uppercase tracking-[3px] text-white/70 mb-4">
            Winter 2026 Registration Open
          </p>
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold mb-4 leading-[1.2] text-shadow">
            Ready to Start Training?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/90 mb-8 max-w-xl mx-auto">
            Early bird pricing available through December 20. Save $50 on full-quarter enrollment.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all shadow-md hover:shadow-lg min-h-[48px]"
            >
              Book Trial
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white/10 font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all min-h-[48px]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Luxury Registration Modal (Programs) */}
      {selectedProgram && (
        <LuxuryRegistrationModal 
          program={selectedProgram} 
          onClose={() => setSelectedProgram(null)} 
        />
      )}
      
      {/* Luxury Year-Round Modal (Camps & JTT) */}
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
      
      {/* Mobile Filter Overlay */}
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
      
      {/* Back to Top */}
      <BackToTopButton />
      
      {/* Dev Tools */}
      <AnalyticsDashboard 
        isVisible={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
      <ComprehensiveFormTester
        isVisible={formTesterOpen}
        onClose={() => setFormTesterOpen(false)}
      />
    </>
  )
}
