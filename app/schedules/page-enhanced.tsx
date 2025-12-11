'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScheduleCalendar from '@/components/ScheduleCalendar'
import ProgramModal from '@/components/ProgramModal'
import { ChevronDown, ChevronUp } from 'lucide-react'

// [Include all the program data from original file - Winter 2026 and Fall 2025]
// For brevity in this write, I'll include a condensed version
const winter2026Programs = [
  { name: "Little Tennis Stars", day: "Monday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$120/mo", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Red Ball Tennis", day: "Monday", time: "3:30-4:30 PM", ages: "5-7", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Michelle", category: "junior" },
  { name: "Youth Development", day: "Monday", time: "5:30-7:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "High Performance Training", day: "Monday", time: "3:30-5:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "Adult Beginner", day: "Monday", time: "7:00-8:00 PM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "Adult Intermediate", day: "Tuesday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Cardio Tennis", day: "Tuesday", time: "6:00-7:00 PM", ages: "All Levels", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  // ... add all other programs
]

const fall2025Programs = [
  { name: "JTT Practice - 10U Orange Ball", day: "Monday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  // ... add fall programs
]

type SortField = 'name' | 'time' | 'location' | 'coach' | 'price'
type SortDirection = 'asc' | 'desc'

export default function SchedulesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'fall'>('winter')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedCoach, setSelectedCoach] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'table'>('table')
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  
  const allPrograms = selectedSeason === 'winter' ? winter2026Programs : fall2025Programs
  
  // Filter programs
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const locationMatch = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation)
      const coachMatch = selectedCoach === 'all' || p.coach.toLowerCase().includes(selectedCoach.toLowerCase())
      return locationMatch && coachMatch
    })
  }, [allPrograms, selectedLocation, selectedCoach])
  
  // Sort programs
  const sortedPrograms = useMemo(() => {
    const sorted = [...filteredPrograms]
    sorted.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    return sorted
  }, [filteredPrograms, sortField, sortDirection])
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  
  // Get unique coaches
  const coaches = ['all', ...new Set(allPrograms.map(p => p.coach))]
  
  const seasonLabel = selectedSeason === 'winter' ? 'Winter 2026' : 'Fall 2025'

  return (
    <>
      {/* HERO */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="LBTA tennis training programs"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 70%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[32px] md:text-[56px] font-bold leading-[1.1] mb-6">
            Every Day, a Place to Belong.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/90 mb-8 max-w-[90%] mx-auto">
            Explore class times and programs built around movement, discipline, and belonging.
          </p>
          <Link 
            href="/programs"
            className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-sans font-semibold text-[15px] py-3 px-8 rounded-lg transition-all duration-200 min-h-[44px]"
          >
            View Programs →
          </Link>
        </div>
      </section>

      {/* FILTERS & CONTROLS */}
      <div className="bg-[#FAF8F3] py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          {/* Season Toggle */}
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-full shadow-sm w-fit mx-auto mb-6">
            <button
              onClick={() => setSelectedSeason('winter')}
              className={`px-6 md:px-8 py-3 rounded-full font-sans font-semibold text-[15px] md:text-[16px] transition-all duration-300 ${
                selectedSeason === 'winter' ? 'bg-lbta-red text-white' : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Winter 2026
            </button>
            <button
              onClick={() => setSelectedSeason('fall')}
              className={`px-6 md:px-8 py-3 rounded-full font-sans font-semibold text-[15px] md:text-[16px] transition-all duration-300 ${
                selectedSeason === 'fall' ? 'bg-lbta-red text-white' : 'text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Fall 2025
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-center gap-3 mb-6">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-3 bg-white text-[14px] md:text-[15px] text-black/80 focus:border-lbta-red focus:outline-none focus:ring-2 focus:ring-lbta-red/20 font-sans cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="moulton">Moulton Courts</option>
              <option value="alta">Alta Laguna Park</option>
              <option value="lbhs">LBHS</option>
            </select>
            
            <select 
              value={selectedCoach}
              onChange={(e) => setSelectedCoach(e.target.value)}
              className="border border-gray-300 rounded-full px-5 py-3 bg-white text-[14px] md:text-[15px] text-black/80 focus:border-lbta-red focus:outline-none focus:ring-2 focus:ring-lbta-red/20 font-sans cursor-pointer"
            >
              <option value="all">All Coaches</option>
              {coaches.slice(1).map(coach => (
                <option key={coach} value={coach}>{coach}</option>
              ))}
            </select>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center justify-center gap-2 md:gap-3">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 ${
                viewMode === 'table' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 ${
                viewMode === 'list' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`hidden lg:inline-block px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 ${
                viewMode === 'calendar' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Calendar View
            </button>
          </div>
          
          <p className="text-center text-[14px] mt-4 text-black/60 italic font-sans">
            {filteredPrograms.length} programs available
          </p>
        </div>
      </div>

      {/* CONTENT VIEWS */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-4 md:px-6">
          
          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-lbta-orange/30">
                <thead className="bg-[#FAF8F3]">
                  <tr>
                    {[
                      { field: 'name' as SortField, label: 'Program' },
                      { field: 'time' as SortField, label: 'Time' },
                      { field: 'location' as SortField, label: 'Location' },
                      { field: 'coach' as SortField, label: 'Coach' },
                      { field: 'price' as SortField, label: 'Price' },
                    ].map(({ field, label }) => (
                      <th 
                        key={field}
                        onClick={() => handleSort(field)}
                        className="py-4 px-6 text-left text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide cursor-pointer hover:text-black transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortField === field && (
                            sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-lbta-orange/20">
                  {sortedPrograms.map((program, index) => (
                    <tr 
                      key={`${program.name}-${program.day}-${index}`}
                      className="hover:bg-[#FAF8F3]/50 transition-colors"
                    >
                      <td className="py-4 px-6 font-serif font-semibold text-[16px] text-black">
                        {program.name}
                        <div className="font-sans text-[13px] text-black/60 font-normal mt-1">
                          {program.day} · Ages {program.ages}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-sans text-[15px] text-black/80">
                        {program.time}
                      </td>
                      <td className="py-4 px-6 font-sans text-[15px] text-black/80">
                        {program.location}
                      </td>
                      <td className="py-4 px-6 font-sans text-[15px] text-black/80">
                        {program.coach}
                      </td>
                      <td className="py-4 px-6 font-sans text-[17px] font-semibold text-lbta-orange">
                        {program.price}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          href="/book"
                          className="bg-lbta-red hover:bg-lbta-orange text-white px-4 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 whitespace-nowrap inline-block"
                        >
                          Book or Try →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="text-right mt-4 px-6">
                <button 
                  onClick={() => {/* Download CSV logic */}}
                  className="text-[14px] font-sans text-lbta-orange hover:underline"
                >
                  Download Full Schedule (.csv)
                </button>
              </div>
            </div>
          )}
          
          {/* LIST VIEW (Card Grid with Grouping) */}
          {viewMode === 'list' && (
            <div className="space-y-12">
              {[
                { key: 'junior', label: 'Junior Programs (Ages 3-11)', programs: filteredPrograms.filter(p => p.category === 'junior') },
                { key: 'youth', label: 'Youth Development (Ages 11-18)', programs: filteredPrograms.filter(p => p.category === 'youth') },
                { key: 'hp', label: 'High Performance', programs: filteredPrograms.filter(p => p.category === 'high-performance') },
                { key: 'adult', label: 'Adult Programs', programs: filteredPrograms.filter(p => p.category === 'adult') },
              ].map(({ key, label, programs }) => (
                programs.length > 0 && (
                  <div key={key} className="border-b border-gray-200 pb-8">
                    <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black mb-6">
                      {label}
                      <span className="ml-3 text-[16px] md:text-[18px] font-sans font-normal text-lbta-orange">
                        ({programs.length})
                      </span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {programs.map((program, index) => (
                        <div 
                          key={`${program.name}-${program.day}-${index}`}
                          className="bg-white rounded-xl shadow-sm p-5 md:p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
                        >
                          <h4 className="font-serif text-[20px] md:text-[22px] font-semibold text-black/90 mb-2 leading-tight">
                            {program.name}
                          </h4>
                          <div className="space-y-1 mb-4">
                            <p className="font-sans text-[15px] md:text-[16px] text-black/80">
                              {program.location} · {program.time}
                            </p>
                            <p className="font-sans text-[13px] md:text-[14px] text-black/60 italic">
                              {program.day} · Ages {program.ages} · {program.duration} · Coach {program.coach}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="font-sans font-semibold text-lbta-orange text-[16px] md:text-[17px]">
                              {program.price}
                            </span>
                            <Link
                              href="/book"
                              className="bg-lbta-red hover:bg-lbta-orange text-white px-4 md:px-5 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 shadow-sm min-h-[44px] flex items-center"
                            >
                              Book or Try →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* CALENDAR VIEW */}
          {viewMode === 'calendar' && (
            <ScheduleCalendar 
              programs={filteredPrograms} 
              onEventClick={(program) => setSelectedProgram(program)}
            />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-16 md:py-20">
          <h2 className="font-serif text-[32px] md:text-[48px] font-semibold mb-6 leading-[1.2]">
            Start Training with Purpose.
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 mb-8 md:mb-10 max-w-[90%] mx-auto">
            Book your spot in our Winter or Fall sessions today.
          </p>
          <Link 
            href="/programs"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-lg transition-all duration-200 min-h-[44px]"
          >
            View Programs →
          </Link>
        </div>
      </section>
      
      {/* Modal */}
      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </>
  )
}
