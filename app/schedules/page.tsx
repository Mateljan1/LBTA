'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProgramCard, { Program } from '@/components/ProgramCard'
import RegistrationModal from '@/components/RegistrationModal'

// Import data
import winter2026Data from '@/data/winter2026.json'
import fall2025Data from '@/data/fall2025.json'

export default function SchedulesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'fall'>('winter')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  
  // Get current season data
  const seasonData = selectedSeason === 'winter' ? winter2026Data : fall2025Data
  const allPrograms = seasonData.programs as Program[]
  
  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(allPrograms.map(p => p.category)))]
  
  // Get unique locations for filter
  const locations = ['all', ...Array.from(new Set(allPrograms.map(p => p.location)))]
  
  // Filter programs
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory
      const locationMatch = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation)
      return categoryMatch && locationMatch
    })
  }, [allPrograms, selectedCategory, selectedLocation])
  
  // Group by category for display
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
  
  const handleRegister = (program: Program) => {
    setSelectedProgram(program)
  }
  
  const seasonLabel = selectedSeason === 'winter' ? 'Winter 2026' : 'Fall 2025'
  const seasonDates = selectedSeason === 'winter' 
    ? 'January 6 – April 5 · 13 Weeks' 
    : 'September – December · 18 Weeks'

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="Laguna Beach Tennis Academy training at sunset"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 70%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-4xl mx-auto py-24">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] tracking-[-0.5px] mb-6 text-shadow">
            Every Day, a Place to Belong.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-8 md:mb-10 max-w-[90%] mx-auto">
            Explore class times and programs built around movement, discipline, and belonging.
          </p>
          <Link 
            href="/programs"
            className="inline-block border-2 border-white hover:bg-lbta-red hover:border-lbta-red text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            View Programs →
          </Link>
        </div>
      </section>

      {/* SEASON TOGGLE & FILTERS */}
      <div className="bg-[#FAF8F3] py-12">
        <div className="max-w-[1440px] mx-auto px-6">
          {/* Season Toggle */}
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-full shadow-sm w-fit mx-auto mb-6">
            <button
              onClick={() => setSelectedSeason('winter')}
              className={`px-8 py-3 rounded-full font-sans font-semibold text-[16px] transition-all duration-300 ${
                selectedSeason === 'winter'
                  ? 'bg-lbta-red text-white'
                  : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Winter 2026
            </button>
            <button
              onClick={() => setSelectedSeason('fall')}
              className={`px-8 py-3 rounded-full font-sans font-semibold text-[16px] transition-all duration-300 ${
                selectedSeason === 'fall'
                  ? 'bg-lbta-red text-white'
                  : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Fall 2025
            </button>
          </div>
          
          <p className="text-center text-[15px] mb-6 text-black/60 italic font-sans">
            {seasonDates}
          </p>
          
          {/* Early Bird Banner (Winter Only) */}
          {selectedSeason === 'winter' && (
            <div className="bg-lbta-orange text-white text-center py-3 px-6 rounded-full max-w-2xl mx-auto mb-6 shadow-sm">
              <p className="font-sans text-[15px] font-semibold">
                🎾 Early Bird Special: Save $50 on full-quarter enrollment through December 20!
              </p>
            </div>
          )}
          
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
            {/* Program Type Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-full px-6 py-3 bg-white text-[15px] text-black/80 focus:border-lbta-red focus:outline-none focus:ring-2 focus:ring-lbta-red/20 font-sans cursor-pointer min-w-[200px]"
            >
              <option value="all">All Programs</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>{cat} Programs</option>
              ))}
            </select>
            
            {/* Location Filter */}
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-full px-6 py-3 bg-white text-[15px] text-black/80 focus:border-lbta-red focus:outline-none focus:ring-2 focus:ring-lbta-red/20 font-sans cursor-pointer min-w-[200px]"
            >
              <option value="all">All Locations</option>
              <option value="moulton">Moulton Meadows</option>
              <option value="alta">Alta Laguna Park</option>
              <option value="lbhs">Laguna Beach High School</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROGRAM CARDS SECTION */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-3 text-center">
            {seasonLabel} Schedule
          </h2>
          <p className="font-sans text-[15px] md:text-[16px] text-black/70 mb-12 text-center">
            {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} available
          </p>
          
          {/* Check if we have programs */}
          {filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-sans text-[16px] text-black/60">
                No programs match your filters. Try adjusting your selection.
              </p>
            </div>
          ) : (
            /* Display programs grouped by category */
            <div className="space-y-16">
              {Object.entries(groupedPrograms).map(([category, programs]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div className="mb-8">
                    <h3 className="font-serif text-[32px] font-semibold text-black inline-block border-b-4 border-lbta-orange pb-2">
                      {category} Programs
                    </h3>
                    <span className="ml-4 font-sans text-[18px] text-black/60">
                      ({programs.length})
                    </span>
                  </div>
                  
                  {/* Program Cards Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {programs.map((program) => (
                      <ProgramCard
                        key={program.id}
                        program={program}
                        onRegister={handleRegister}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/25" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[40px] md:text-[48px] font-semibold mb-6 leading-[1.2]">
            Start Training with Purpose.
          </h2>
          <p className="font-sans text-[18px] leading-[1.6] text-white/90 mb-10">
            Book your spot in our {seasonLabel} sessions today and experience the structure that builds confidence.
          </p>
          <Link 
            href="/programs"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200"
          >
            View All Programs →
          </Link>
        </div>
      </section>
      
      {/* Registration Modal */}
      <RegistrationModal 
        program={selectedProgram} 
        onClose={() => setSelectedProgram(null)} 
      />
    </>
  )
}
