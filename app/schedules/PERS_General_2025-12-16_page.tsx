'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import ProgramCard, { Program } from '@/components/ProgramCard'
import EmbeddedRegistrationPanel from '@/components/EmbeddedRegistrationPanel'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import ComprehensiveFormTester from '@/components/ComprehensiveFormTester'
import { trackProgramView, trackFormStart } from '@/lib/form-analytics'
import MobileFilterOverlay from '@/components/MobileFilterOverlay'
import BackToTopButton from '@/components/BackToTopButton'

// Import data
import winter2026Data from '@/data/winter2026.json'
import fall2025Data from '@/data/fall2025.json'

export default function SchedulesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'fall'>('winter')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
  const [heroParallax, setHeroParallax] = useState(0)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [formTesterOpen, setFormTesterOpen] = useState(false)
  
  // Get current season data
  const seasonData = selectedSeason === 'winter' ? winter2026Data : fall2025Data
  const allPrograms = seasonData.programs as Program[]
  
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
  
  // Handle accordion toggle with auto-collapse and smooth scroll
  const toggleAccordion = (category: string) => {
    const willExpand = !expandedAccordions.includes(category)
    
    // Auto-collapse others, open only this one (or close if already open)
    setExpandedAccordions(prev =>
      prev.includes(category) ? [] : [category]
    )
    
    // Smooth scroll to accordion header when expanding
    if (willExpand) {
      setTimeout(() => {
        const element = document.getElementById(`accordion-header-${category}`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
      }, 250)
    }
  }
  
  // Handle registration
  const handleRegister = (program: Program) => {
    // Track form start analytics
    trackFormStart(program.id, program.program, program.category, 'embedded')
    
    setSelectedProgram(program)
  }
  
  // Parallax effect on hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setHeroParallax(scrollY * 0.3)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Analytics dashboard keyboard shortcut (Ctrl+Shift+A)
  // Form tester keyboard shortcut (Ctrl+Shift+T)
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
  
  // Restore filter state from localStorage
  useEffect(() => {
    const savedFilters = localStorage.getItem('lbta-schedule-filters')
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        setSelectedCategory(filters.category || 'all')
        setSelectedLocation(filters.location || 'all')
        setSelectedDays(filters.days || [])
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])
  
  // Save filter state to localStorage
  useEffect(() => {
    localStorage.setItem('lbta-schedule-filters', JSON.stringify({
      category: selectedCategory,
      location: selectedLocation,
      days: selectedDays
    }))
  }, [selectedCategory, selectedLocation, selectedDays])
  
  const seasonLabel = selectedSeason === 'winter' ? 'Winter 2026' : 'Fall 2025'
  const seasonDates = selectedSeason === 'winter' 
    ? 'January 6 – April 5 · 13 Weeks' 
    : 'September – December · 18 Weeks'

  return (
    <>
      {/* HERO SECTION - Enhanced with Gradient Overlay */}
      <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy training at sunset"
            fill
            className="object-cover"
            style={{ 
              objectPosition: '50% 70%',
              transform: `translateY(${heroParallax}px)`
            }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-lbta-orange/20 to-lbta-beige/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-4xl mx-auto py-24">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] tracking-[-0.5px] mb-6 text-shadow">
            Winter 2026 Schedule & Pricing
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-4 max-w-[90%] mx-auto">
            {seasonDates}
          </p>
          <p className="font-sans text-[15px] md:text-[18px] text-white/90 mb-8 md:mb-10">
            Early Bird Special: Save $50 on full-quarter enrollment through December 20
          </p>
          <Link 
            href="/programs"
            className="inline-block border-2 border-white hover:bg-lbta-red hover:border-lbta-red text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            View Programs →
          </Link>
        </div>
      </section>

      {/* STICKY FILTER BAR - Glass Morphism */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4 md:py-6 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          {/* Season Toggle */}
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-full shadow-sm w-fit mx-auto mb-4">
            <button
              onClick={() => setSelectedSeason('winter')}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-sans font-semibold text-[14px] md:text-[16px] transition-all duration-200 ${
                selectedSeason === 'winter'
                  ? 'bg-lbta-red text-white shadow-sm'
                  : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Winter 2026
            </button>
            <button
              onClick={() => setSelectedSeason('fall')}
              className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-sans font-semibold text-[14px] md:text-[16px] transition-all duration-200 ${
                selectedSeason === 'fall'
                  ? 'bg-lbta-red text-white shadow-sm'
                  : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Fall 2025
            </button>
          </div>
          
          {/* Desktop Filters Row */}
          <div className="hidden md:flex items-center justify-center gap-4">
            {/* Program Type */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-[14px] text-black/80 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 font-sans cursor-pointer min-w-[160px] transition-all"
              aria-label="Filter by program type"
            >
              <option value="all">All Programs</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            {/* Location */}
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-2.5 bg-white text-[14px] text-black/80 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 font-sans cursor-pointer min-w-[160px] transition-all"
              aria-label="Filter by location"
            >
              <option value="all">All Locations</option>
              <option value="moulton">Moulton Meadows</option>
              <option value="alta">Alta Laguna Park</option>
              <option value="lbhs">Laguna Beach High School</option>
            </select>
          </div>
          
          {/* Billing Info Legend */}
          <p className="hidden md:block text-center text-[13px] text-black/60 font-sans mt-4 italic">
            All Junior, Youth, and Adult programs billed quarterly (13 weeks). Fitness programs billed monthly.
          </p>
        </div>
      </div>
      
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-lbta-red hover:bg-lbta-orange text-white px-5 py-3.5 rounded-full shadow-lg font-sans font-semibold text-[14px] flex items-center gap-2 min-h-[48px] transition-all duration-200"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* PROGRAM ACCORDION SECTIONS */}
      <section className="bg-[#FAF8F3] py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-2 text-center">
            {seasonLabel} Programs
          </h2>
          <p className="font-sans text-[14px] md:text-[16px] text-black/60 mb-10 md:mb-16 text-center">
            {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} available
          </p>
          
          {/* Check if we have programs */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <p className="font-sans text-[16px] text-black/60">
                No programs match your filters. Try adjusting your selection.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedLocation('all')
                  setSelectedDays([])
                }}
                className="mt-4 text-lbta-orange hover:underline font-sans font-semibold text-[15px]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* ACCORDION GROUPS BY CATEGORY */
            <div className="space-y-6 md:space-y-10">
              {Object.entries(groupedPrograms).map(([category, programs], index) => {
                const isExpanded = expandedAccordions.includes(category)
                
                return (
                  <div 
                    key={category} 
                    id={`accordion-header-${category}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="bg-white rounded-3xl shadow-soft overflow-hidden animate-fade-in-up"
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(category)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleAccordion(category)
                        }
                      }}
                      className="accordion-header w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between bg-[#FAF8F3] hover:bg-lbta-orange/10 focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all duration-200"
                      aria-expanded={isExpanded}
                      aria-controls={`accordion-${category}`}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${category} Programs section`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <h3 className="font-serif text-[24px] md:text-[32px] font-bold text-black">
                          {category} Programs
                        </h3>
                        <span className="font-sans text-[16px] md:text-[18px] text-lbta-orange font-semibold bg-lbta-orange/10 px-3 py-1 rounded-full">
                          {programs.length}
                        </span>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 md:w-7 md:h-7 text-lbta-orange" />
                        ) : (
                          <ChevronDown className="w-6 h-6 md:w-7 md:h-7 text-lbta-orange" />
                        )}
                      </div>
                    </button>
                    
                    {/* Accordion Content */}
                    {isExpanded && (
                      <div 
                        id={`accordion-${category}`}
                        className="accordion-content px-4 md:px-6 py-6 md:py-8 bg-white min-h-[200px]"
                        role="region"
                        aria-labelledby={`accordion-header-${category}`}
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

      {/* NEW PRE-FOOTER CTA SECTION */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover"
            sizes="100vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 py-20 animate-fade-in-up">
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold mb-4 leading-[1.2] text-shadow">
            Ready to Train This Winter?
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 mb-8">
            Secure your spot today — spaces are limited.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/book"
              className="bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all duration-200 shadow-md hover:shadow-lg min-h-[48px] inline-block"
            >
              Book Trial
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white/10 font-sans font-semibold text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
            >
              Browse Programs
            </button>
          </div>
        </div>
      </section>
      
      {/* Embedded Registration Panel */}
      <EmbeddedRegistrationPanel 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
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
      
      {/* Back to Top Button */}
      <BackToTopButton />
      
      {/* Analytics Dashboard (Hidden - Ctrl+Shift+A to open) */}
      <AnalyticsDashboard 
        isVisible={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
      
      {/* Comprehensive Form Tester (Hidden - Ctrl+Shift+T to open) */}
      <ComprehensiveFormTester
        isVisible={formTesterOpen}
        onClose={() => setFormTesterOpen(false)}
      />
    </>
  )
}
