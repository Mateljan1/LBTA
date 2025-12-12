'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ScheduleCalendar from '@/components/ScheduleCalendar'
import ProgramModal from '@/components/ProgramModal'
import { ChevronDown, ChevronUp } from 'lucide-react'

// Winter 2026 - 13 Week Session (Jan 6 - Apr 5, 2026) - OFFICIAL FINAL
const winter2026Programs = [
  // MOULTON MEADOWS - Junior Foundations
  { name: "Little Tennis Stars", day: "Monday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$260/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Little Tennis Stars", day: "Wednesday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$260/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  
  { name: "Red Ball Tennis", day: "Monday", time: "4:15-5:15 PM", ages: "5-6", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Red Ball Tennis", day: "Wednesday", time: "4:15-5:15 PM", ages: "5-6", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  
  { name: "Orange Ball Tennis", day: "Monday", time: "5:15-6:15 PM", ages: "7-8", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Orange Ball Tennis", day: "Tuesday", time: "3:30-4:30 PM", ages: "7-8", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Orange Ball Tennis", day: "Wednesday", time: "5:15-6:15 PM", ages: "7-8", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Orange Ball Tennis", day: "Thursday", time: "3:30-4:30 PM", ages: "7-8", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Orange Ball Match Play", day: "Friday", time: "3:30-4:30 PM", ages: "7-8", duration: "1 hr", price: "$85/mo", location: "Moulton", coach: "Michelle", category: "junior" },
  
  { name: "Green Dot Tennis", day: "Tuesday", time: "4:30-5:30 PM", ages: "9-11", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Green Dot Tennis", day: "Thursday", time: "4:30-5:30 PM", ages: "9-11", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Green Dot Match Play", day: "Friday", time: "4:30-5:30 PM", ages: "9-11", duration: "1 hr", price: "$85/mo", location: "Moulton", coach: "Michelle", category: "junior" },
  
  // MOULTON - Adult Programs
  { name: "Adult Beginner 2 (Bridge)", day: "Monday", time: "6:30-7:30 PM", ages: "NTRP 2.0-2.5", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "Adult Beginner 2 (Bridge)", day: "Wednesday", time: "6:30-7:30 PM", ages: "NTRP 2.0-2.5", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "LiveBall Intermediate", day: "Thursday", time: "6:00-7:30 PM", ages: "NTRP 2.0-3.5", duration: "1.5 hr", price: "$150/mo", location: "Moulton", coach: "Michelle", category: "adult" },
  
  // ALTA LAGUNA PARK - Youth Development
  { name: "Youth Development", day: "Monday", time: "4:00-5:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "4:00-5:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  { name: "Youth Development", day: "Wednesday", time: "4:00-5:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "4:00-5:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  { name: "Youth Development Match Play", day: "Friday", time: "3:00-4:00 PM", ages: "11-15", duration: "1 hr", price: "Included", location: "Alta Laguna", coach: "Staff", category: "youth" },
  
  // LBHS - High Performance
  { name: "High Performance Training", day: "Monday", time: "6:00-8:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "High Performance Training", day: "Tuesday", time: "6:00-8:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Savriyan", category: "high-performance" },
  { name: "High Performance Training", day: "Wednesday", time: "6:00-8:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "High Performance Training", day: "Thursday", time: "6:00-8:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Savriyan", category: "high-performance" },
  { name: "HP Match Play", day: "Friday", time: "5:30-7:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "Included", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "HP Match Play (Optional)", day: "Saturday", time: "2:00-4:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "Included", location: "LBHS", coach: "Kevin", category: "high-performance" },
  
  // LBHS - Adult Programs
  { name: "Adult Beginner 1", day: "Monday", time: "6:00-7:00 PM", ages: "NTRP 1.0-2.0", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Adult Beginner 1", day: "Tuesday", time: "10:00-11:00 AM", ages: "NTRP 1.0-2.0", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Adult Beginner 1", day: "Wednesday", time: "6:00-7:00 PM", ages: "NTRP 1.0-2.0", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Adult Beginner 1", day: "Thursday", time: "10:00-11:00 AM", ages: "NTRP 1.0-2.0", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Adult Beginner 1", day: "Saturday", time: "9:00-10:00 AM", ages: "NTRP 1.0-2.0", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  
  { name: "Adult Intermediate", day: "Tuesday", time: "11:00 AM-12:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Thursday", time: "11:00 AM-12:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Saturday", time: "10:00-11:30 AM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  
  { name: "Adult Advanced", day: "Monday", time: "12:00-2:00 PM", ages: "NTRP 4.0+", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Advanced", day: "Wednesday", time: "12:00-2:00 PM", ages: "NTRP 4.0+", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  
  // LBHS - Fitness & Community (Monthly)
  { name: "Cardio Tennis", day: "Friday", time: "9:00-10:30 AM", ages: "All Levels", duration: "1.5 hr", price: "$150/mo", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "LiveBall Intermediate", day: "Sunday", time: "9:00-10:00 AM", ages: "All Levels", duration: "1 hr", price: "$150/mo", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "LiveBall Advanced", day: "Sunday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0+", duration: "1.5 hr", price: "$150/mo", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "LiveBall Advanced", day: "Saturday", time: "11:30 AM-1:00 PM", ages: "NTRP 3.0+", duration: "1.5 hr", price: "$150/mo", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Family Tennis", day: "Sunday", time: "11:00 AM-12:00 PM", ages: "All Ages", duration: "1 hr", price: "$150/mo", location: "LBHS", coach: "Staff", category: "adult" },
  
  // Match Play
  { name: "Adult Match Play", day: "Friday", time: "6:00-8:00 PM", ages: "Adults", duration: "2 hr", price: "$120/mo", location: "LBHS", coach: "Staff", category: "adult" },
]

const fall2025Programs = [
  // Fall schedule data preserved from original
  { name: "JTT Practice - 10U Orange Ball", day: "Monday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "JTT Practice - 10U Orange Ball", day: "Wednesday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "JTT Practice - 10U Orange Ball", day: "Friday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "Adult Beginner", day: "Monday", time: "7:00-8:00 PM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$550/18wk", location: "Moulton", coach: "Staff", category: "adult" },
  { name: "Cardio Tennis", day: "Wednesday", time: "6:00-7:30 PM", ages: "All Levels", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "adult" },
  { name: "LiveBall - Intermediate", day: "Thursday", time: "6:00-7:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "adult" },
]

type SortField = 'name' | 'time' | 'location' | 'coach' | 'price'

export default function SchedulesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'fall'>('winter')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [selectedCoach, setSelectedCoach] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'table'>('table')
  const [selectedProgram, setSelectedProgram] = useState<any>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  
  const allPrograms = selectedSeason === 'winter' ? winter2026Programs : fall2025Programs
  
  // Filter + Sort
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(p => {
      const locationMatch = selectedLocation === 'all' || p.location.toLowerCase().includes(selectedLocation)
      const coachMatch = selectedCoach === 'all' || p.coach.toLowerCase().includes(selectedCoach.toLowerCase())
      return locationMatch && coachMatch
    })
  }, [allPrograms, selectedLocation, selectedCoach])
  
  const sortedPrograms = useMemo(() => {
    const sorted = [...filteredPrograms]
    sorted.sort((a: any, b: any) => {
      const aVal = a[sortField] || ''
      const bVal = b[sortField] || ''
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
    return sorted
  }, [filteredPrograms, sortField, sortDirection])
  
  const handleSort = (field: SortField) => {
    setSortField(prev => prev === field && sortDirection === 'asc' ? field : field)
    setSortDirection(prev => sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'asc')
  }
  
  const coaches = ['all', ...Array.from(new Set(allPrograms.map(p => p.coach)))]
  const seasonLabel = selectedSeason === 'winter' ? 'Winter 2026' : 'Fall 2025'
  
  // Group by category
  const groupedPrograms = {
    junior: filteredPrograms.filter(p => p.category === 'junior'),
    youth: filteredPrograms.filter(p => p.category === 'youth'),
    hp: filteredPrograms.filter(p => p.category === 'high-performance'),
    adult: filteredPrograms.filter(p => p.category === 'adult'),
  }

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

      {/* SEASON TOGGLE */}
      <div className="bg-[#FAF8F3] py-12">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 bg-white p-2 rounded-full shadow-sm w-fit mx-auto">
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
          <p className="text-center text-[15px] mt-4 text-black/60 italic font-sans">
            Select your season to view the current schedule.
          </p>
          
          {/* Location Filter */}
          <div className="flex justify-center mt-6">
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 rounded-full px-6 py-3 bg-white text-[15px] text-black/80 focus:border-lbta-red focus:outline-none focus:ring-2 focus:ring-lbta-red/20 font-sans cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="moulton">Moulton Courts</option>
              <option value="alta">Alta Laguna Park</option>
              <option value="lbhs">Laguna Beach High School</option>
            </select>
          </div>
          
          {/* Coach Filter */}
          <div className="flex justify-center mt-3">
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
          <div className="flex items-center justify-center gap-2 md:gap-3 mt-8">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 min-h-[44px] ${
                viewMode === 'table' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 min-h-[44px] ${
                viewMode === 'list' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`hidden lg:inline-block px-4 md:px-6 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 min-h-[44px] ${
                viewMode === 'calendar' ? 'bg-lbta-red text-white' : 'border-2 border-lbta-red text-lbta-red hover:bg-lbta-orange/10'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* SCHEDULE GRID */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-black mb-3 text-center">
            {seasonLabel} Schedule
          </h2>
          <p className="font-sans text-[15px] md:text-[16px] text-black/70 mb-8 md:mb-12 text-center">
            {filteredPrograms.length} programs available
          </p>
          
          {viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="overflow-x-auto rounded-xl shadow-sm mb-4">
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
                        className="py-3 md:py-4 px-3 md:px-6 text-left text-[12px] md:text-[13px] font-sans font-semibold text-black/70 uppercase tracking-wide cursor-pointer hover:text-black transition-colors"
                      >
                        <div className="flex items-center gap-1 md:gap-2">
                          {label}
                          {sortField === field && (
                            sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 md:w-4 md:h-4" /> : <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="py-3 md:py-4 px-3 md:px-6"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-lbta-orange/20">
                  {sortedPrograms.map((program: any, index: number) => (
                    <tr 
                      key={`${program.name}-${program.day}-${index}`}
                      className="hover:bg-[#FAF8F3]/50 transition-colors"
                    >
                      <td className="py-3 md:py-4 px-3 md:px-6 font-serif font-semibold text-[15px] md:text-[16px] text-black">
                        {program.name}
                        <div className="font-sans text-[12px] md:text-[13px] text-black/60 font-normal mt-1">
                          {program.day} · Ages {program.ages}
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 font-sans text-[13px] md:text-[15px] text-black/80">
                        {program.time}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 font-sans text-[13px] md:text-[15px] text-black/80">
                        {program.location}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 font-sans text-[13px] md:text-[15px] text-black/80">
                        {program.coach}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6 font-sans text-[15px] md:text-[17px] font-semibold text-lbta-orange">
                        {program.price}
                      </td>
                      <td className="py-3 md:py-4 px-3 md:px-6">
                        <Link
                          href="/book"
                          className="bg-lbta-red hover:bg-lbta-orange text-white px-3 md:px-4 py-2 rounded-full font-sans font-semibold text-[12px] md:text-[14px] transition-all duration-200 whitespace-nowrap inline-block min-h-[44px] flex items-center"
                        >
                          Book or Try →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right mt-4 px-4 md:px-6 pb-2">
                <button 
                  className="text-[13px] md:text-[14px] font-sans text-lbta-orange hover:underline transition-all"
                >
                  Download Schedule (.csv)
                </button>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST VIEW WITH ACCORDION */
            <div className="space-y-12">
              {[
                { key: 'junior', label: 'Junior Programs (Ages 3-11)', programs: groupedPrograms.junior },
                { key: 'youth', label: 'Youth Development (Ages 11-18)', programs: groupedPrograms.youth },
                { key: 'hp', label: 'High Performance', programs: groupedPrograms.hp },
                { key: 'adult', label: 'Adult Programs', programs: groupedPrograms.adult },
              ].map(({ key, label, programs }) => (
                programs.length > 0 && (
                  <div key={key} className="border-b border-gray-200 pb-8">
                    <h3 className="font-serif text-[28px] font-semibold text-black mb-6">
                      {label}
                      <span className="ml-3 text-[18px] font-sans font-normal text-lbta-orange">
                        ({programs.length})
                      </span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {programs.map((program, index) => (
                        <div 
                          key={`${program.name}-${program.day}-${program.time}-${index}`}
                          className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                          <h4 className="font-serif text-[22px] font-semibold text-black/90 mb-2 leading-tight">
                            {program.name}
                          </h4>
                          <div className="space-y-1 mb-4">
                            <p className="font-sans text-[16px] text-black/80">
                              {program.location} · {program.time}
                            </p>
                            <p className="font-sans text-[14px] text-black/60 italic">
                              {program.day} · Ages {program.ages} · {program.duration} · Coach {program.coach}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <span className="font-sans font-semibold text-lbta-orange text-[17px]">
                              {program.price}
                            </span>
                            <Link
                              href="/book"
                              className="bg-lbta-red hover:bg-lbta-orange text-white px-5 py-2 rounded-full font-sans font-semibold text-[14px] transition-all duration-200 shadow-sm"
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
          ) : (
            /* CALENDAR VIEW (Desktop Only) */
            <div className="hidden lg:block">
              <ScheduleCalendar 
                programs={filteredPrograms} 
                onEventClick={(program) => setSelectedProgram(program)}
              />
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
            Book your spot in our Winter or Fall sessions today and experience the structure that builds confidence.
          </p>
          <Link 
            href="/programs"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200"
          >
            View Programs →
          </Link>
        </div>
      </section>
      
      {/* Modal for Calendar View */}
      <ProgramModal program={selectedProgram} onClose={() => setSelectedProgram(null)} />
    </>
  )
}
