'use client'

import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import ProgramCard, { Program } from '@/components/ProgramCard'

type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall' | 'fall2025'

interface Season {
  name: string
  dates: string
  weeks: number
  status: string
  multiplier: number
  [key: string]: unknown
}

interface ProgramsTabProps {
  seasons: Record<string, Season>
  selectedSeason: SeasonKey
  onSeasonChange: (season: SeasonKey) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedLocation: string
  onLocationChange: (location: string) => void
  selectedDays: string[]
  onDaysChange: (days: string[]) => void
  categories: string[]
  filteredPrograms: Program[]
  groupedPrograms: Record<string, Program[]>
  expandedAccordions: string[]
  onToggleAccordion: (category: string) => void
  onRegister: (program: Program) => void
  onMobileFilterOpen: () => void
  seasonLabel: string
  seasonDates: string
  seasonWeeks: number
}

export default function ProgramsTab({
  seasons,
  selectedSeason,
  onSeasonChange,
  selectedCategory,
  onCategoryChange,
  selectedLocation,
  onLocationChange,
  selectedDays,
  onDaysChange,
  categories,
  filteredPrograms,
  groupedPrograms,
  expandedAccordions,
  onToggleAccordion,
  onRegister,
  onMobileFilterOpen,
  seasonLabel,
  seasonDates,
  seasonWeeks,
}: ProgramsTabProps) {
  return (
    <>
      {/* Season Filter Bar */}
      <div className="bg-brand-morning-light py-4 border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-sans text-[14px] text-black/60 mr-2">Season:</span>
            {Object.entries(seasons).map(([key, season]) => (
              <button
                key={key}
                onClick={() => onSeasonChange(key as SeasonKey)}
                className={`px-4 py-2 rounded-full font-sans text-[13px] font-medium transition-all ${
                  selectedSeason === key
                    ? 'bg-black text-white'
                    : 'bg-white text-black/70 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {season.name.split(' ')[0]}
                {season.status === 'registration_open' && (
                  <span className="ml-1.5 w-2 h-2 bg-brand-tide-pool rounded-full inline-block" />
                )}
              </button>
            ))}
            <button
              onClick={() => onSeasonChange('fall2025')}
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
              onChange={(e) => onCategoryChange(e.target.value)}
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
              onChange={(e) => onLocationChange(e.target.value)}
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
        onClick={onMobileFilterOpen}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-black hover:bg-lbta-black text-white px-5 py-3.5 rounded-full shadow-lg font-sans font-semibold text-[14px] flex items-center gap-2 min-h-[48px]"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Program Accordions */}
      <section id="programs" className="bg-brand-morning-light py-12 md:py-20">
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
                  onCategoryChange('all')
                  onLocationChange('all')
                  onDaysChange([])
                }}
                className="mt-4 text-black hover:underline font-sans font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-10">
              {Object.entries(groupedPrograms).map(([category, programs]) => {
                const isExpanded = expandedAccordions.includes(category)
                
                return (
                  <div 
                    key={category} 
                    id={`accordion-header-${category}`}
                    className="bg-white rounded-3xl shadow-soft overflow-hidden"
                  >
                    <button
                      onClick={() => onToggleAccordion(category)}
                      className="accordion-header w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between bg-brand-morning-light hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
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
                              onRegister={onRegister}
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
  )
}
