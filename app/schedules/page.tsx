'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, User, DollarSign } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import RegistrationModal from '@/components/ui/RegistrationModal'

// Fall 2025 - 18 Week Session (Aug - Dec)
const fall2025Programs = [
  // Junior Programs - Alta Laguna
  { name: "JTT Practice - 10U Orange Ball", day: "Monday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "JTT Practice - 10U Orange Ball", day: "Wednesday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "JTT Practice - 10U Orange Ball", day: "Friday", time: "3:30-5:00 PM", ages: "Team", duration: "90 min", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "JTT Match - 10U Orange Ball", day: "Saturday", time: "2:00-4:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "14U Team Practice", day: "Tuesday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "youth" },
  { name: "14U Team Practice", day: "Thursday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "youth" },
  { name: "12U Bronze Team", day: "Monday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "12U Bronze Team", day: "Wednesday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  { name: "12U Bronze Team", day: "Friday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "Alta Laguna", coach: "Staff", category: "junior" },
  
  // Junior Programs - Moulton
  { name: "Little Tennis Stars", day: "Tuesday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$260/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Little Tennis Stars", day: "Thursday", time: "2:45-3:30 PM", ages: "3-4", duration: "45 min", price: "$260/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Red Ball - Advanced", day: "Monday", time: "3:30-4:30 PM", ages: "5-7", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Red Ball - Beginner", day: "Wednesday", time: "3:30-4:30 PM", ages: "5-7", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Orange Ball - Beginner", day: "Tuesday", time: "4:30-5:30 PM", ages: "7-9", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Orange Ball - Advanced", day: "Thursday", time: "3:30-4:30 PM", ages: "7-9", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Green Dot - Advanced", day: "Monday", time: "4:30-5:30 PM", ages: "9-11", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Green Dot - Beginner", day: "Wednesday", time: "4:30-5:30 PM", ages: "9-11", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Fun Friday Games", day: "Friday", time: "3:30-4:30 PM", ages: "5-10", duration: "1 hr", price: "$420/18wk", location: "Moulton", coach: "Staff", category: "junior" },
  { name: "Youth Development", day: "Monday", time: "5:30-7:00 PM", ages: "11-13", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "5:30-7:00 PM", ages: "13-18", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "4:30-6:00 PM", ages: "13-18", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "youth" },
  
  // Adult Programs - Moulton
  { name: "Adult Beginner", day: "Monday", time: "7:00-8:00 PM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$550/18wk", location: "Moulton", coach: "Staff", category: "adult" },
  { name: "Cardio Tennis", day: "Wednesday", time: "6:00-7:30 PM", ages: "All Levels", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "adult" },
  { name: "LiveBall - Intermediate", day: "Thursday", time: "6:00-7:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$610/18wk", location: "Moulton", coach: "Staff", category: "adult" },
  
  // LBHS Programs
  { name: "LiveBall - Intermediate/Advanced", day: "Monday", time: "7:00-9:30 AM", ages: "NTRP 3.0-4.5", duration: "2.5 hr", price: "$610/18wk", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Advanced", day: "Monday", time: "12:00-2:00 PM", ages: "NTRP 4.0+", duration: "2 hr", price: "$920/18wk", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "12U Gold Team Practice", day: "Monday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "Adult Intermediate", day: "Tuesday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$735/18wk", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Ladies 3.5 Practice", day: "Tuesday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$610/18wk", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "12U Gold Team Practice", day: "Wednesday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "Adult Intermediate", day: "Thursday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$735/18wk", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Practice Match - 12U Gold", day: "Friday", time: "4:00-6:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "Adult Intermediate", day: "Saturday", time: "9:00-10:30 AM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$735/18wk", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "LiveBall - Beginner", day: "Saturday", time: "9:00-10:30 AM", ages: "Adult", duration: "1.5 hr", price: "$610/18wk", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "LiveBall - Int/Adv", day: "Saturday", time: "10:30 AM-12:00 PM", ages: "Adult", duration: "1.5 hr", price: "$610/18wk", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Adult Beginner", day: "Saturday", time: "10:30-11:30 AM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$550/18wk", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Ladies 3.5 Matches", day: "Saturday", time: "12:00-3:00 PM", ages: "Team", duration: "3 hr", price: "$610/18wk", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "12U Bronze Matches", day: "Saturday", time: "2:00-4:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "LBHS", coach: "Staff", category: "youth" },
  { name: "12U Gold Matches", day: "Saturday", time: "4:00-6:00 PM", ages: "Team", duration: "2 hr", price: "$795/18wk", location: "LBHS", coach: "Kevin", category: "youth" },
]

// Winter 2026 - 13 Week Session (Jan 6 - Apr 5)
const winter2026Programs = [
  // Junior Programs - Ages 3-11
  { name: "Little Tennis Stars", day: "Monday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$120/mo", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Little Tennis Stars", day: "Tuesday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$120/mo", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Little Tennis Stars", day: "Wednesday", time: "3:30-4:15 PM", ages: "3-4", duration: "45 min", price: "$120/mo", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Little Tennis Stars", day: "Thursday", time: "2:45-3:30 PM", ages: "3-4", duration: "45 min", price: "$120/mo", location: "Moulton", coach: "Andy", category: "junior" },
  
  { name: "Red Ball Tennis", day: "Monday", time: "3:30-4:30 PM", ages: "5-7", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Michelle", category: "junior" },
  { name: "Red Ball Tennis", day: "Monday", time: "4:30-5:30 PM", ages: "5-7", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Red Ball Tennis", day: "Wednesday", time: "3:30-4:30 PM", ages: "5-7", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Michelle", category: "junior" },
  { name: "Red Ball Tennis", day: "Wednesday", time: "4:30-5:30 PM", ages: "5-7", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Red/Orange Ball Group", day: "Saturday", time: "9:00-10:00 AM", ages: "5-9", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Andy", category: "junior" },
  
  { name: "Orange Ball Tennis", day: "Monday", time: "4:30-5:30 PM", ages: "7-9", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Michelle", category: "junior" },
  { name: "Orange Ball Tennis", day: "Monday", time: "5:30-6:30 PM", ages: "7-9", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Orange Ball Tennis", day: "Tuesday", time: "4:30-5:30 PM", ages: "7-9", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  { name: "Orange Ball Tennis", day: "Wednesday", time: "4:30-5:30 PM", ages: "7-9", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Michelle", category: "junior" },
  { name: "Orange Ball Tennis", day: "Thursday", time: "3:30-4:30 PM", ages: "7-9", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "junior" },
  
  { name: "Green Dot Tennis", day: "Tuesday", time: "3:30-4:30 PM", ages: "9-11", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Andy", category: "junior" },
  { name: "Green Dot Tennis", day: "Wednesday", time: "5:30-6:30 PM", ages: "9-11", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "Green Dot Tennis", day: "Thursday", time: "3:30-4:30 PM", ages: "9-11", duration: "1 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Andy", category: "junior" },
  
  { name: "Fun Friday", day: "Friday", time: "3:30-4:30 PM", ages: "5-10", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "junior" },
  { name: "MatchPlay Friday", day: "Friday", time: "3:30-5:30 PM", ages: "All Ages", duration: "2 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Andy", category: "junior" },
  
  // Youth Development - Ages 11-18
  { name: "Youth Development", day: "Monday", time: "5:30-6:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "3:30-5:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "4:30-6:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  { name: "Youth Development", day: "Wednesday", time: "5:30-6:30 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "3:30-5:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "4:30-6:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  
  // High Performance
  { name: "High Performance Training", day: "Monday", time: "3:30-5:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "High Performance Training", day: "Tuesday", time: "5:00-7:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  { name: "High Performance Training", day: "Wednesday", time: "3:30-5:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "High Performance Training", day: "Thursday", time: "5:00-7:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  
  { name: "College Bound Intensive", day: "Monday", time: "5:30-7:30 PM", ages: "14-18 (UTR 8.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "College Bound Intensive", day: "Wednesday", time: "5:30-7:30 PM", ages: "14-18 (UTR 8.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  { name: "College Bound Intensive", day: "Thursday", time: "5:30-7:30 PM", ages: "14-18 (UTR 8.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  
  { name: "Junior Match Play", day: "Saturday", time: "10:00-11:30 AM", ages: "10-17", duration: "1.5 hr", price: "$546/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  { name: "High Performance Match Play", day: "Saturday", time: "2:00-4:00 PM", ages: "12-18 (UTR 5.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "youth" },
  
  // Adult Programs
  { name: "LiveBall Intermediate/Advanced", day: "Monday", time: "7:00-8:30 AM", ages: "NTRP 3.0-4.5", duration: "1.5 hr", price: "$150/mo", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Advanced", day: "Monday", time: "12:00-2:00 PM", ages: "NTRP 4.0+", duration: "2 hr", price: "$810/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Beginner", day: "Monday", time: "7:00-8:30 PM", ages: "NTRP 1.0-2.5", duration: "1.5 hr", price: "$546/qtr", location: "Moulton", coach: "Andy", category: "adult" },
  
  { name: "Adult Intermediate", day: "Tuesday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$681/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Beginner", day: "Tuesday", time: "6:00-7:30 PM", ages: "NTRP 1.0-2.5", duration: "1.5 hr", price: "$546/qtr", location: "Moulton", coach: "Savriyan", category: "adult" },
  
  { name: "Cardio Tennis", day: "Wednesday", time: "7:00-8:30 PM", ages: "All Levels", duration: "1.5 hr", price: "$150/mo", location: "Moulton", coach: "Andy", category: "adult" },
  
  { name: "Adult Intermediate", day: "Thursday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$681/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Thursday", time: "6:00-7:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$681/qtr", location: "Moulton", coach: "Savriyan", category: "adult" },
  
  { name: "MatchPlay Friday", day: "Friday", time: "3:30-5:30 PM", ages: "All Levels", duration: "2 hr", price: "$150/mo", location: "LBHS", coach: "Kevin", category: "adult" },
  
  { name: "Adult Beginner", day: "Saturday", time: "9:00-10:00 AM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Saturday", time: "10:00-11:30 AM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$681/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "LiveBall Advanced", day: "Saturday", time: "11:30 AM-1:00 PM", ages: "NTRP 3.5-4.5", duration: "1.5 hr", price: "$150/mo", location: "LBHS", coach: "Kevin", category: "adult" },
  
  { name: "Adult Beginner", day: "Sunday", time: "9:00-10:00 AM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Sunday", time: "10:00-11:30 AM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$681/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
]

const privateRates = [
  { coach: "Andrew Mateljan", specialty: "ATP/WTA Coach", rate_60: 250, rate_90: 350 },
  { coach: "Kevin Jackson", specialty: "College Prep", rate_60: 150, rate_90: 200 },
  { coach: "Savriyan Danilov", specialty: "ATP Pro #556", rate_60: 120, rate_90: 165 },
  { coach: "Andy Wu", specialty: "USPTA Certified", rate_60: 100, rate_90: 135 },
  { coach: "Michelle Bevins", specialty: "Youth Director", rate_60: 120, rate_90: 165 },
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function SchedulesPage() {
  const [season, setSeason] = useState<'fall' | 'winter'>('winter')
  const [filters, setFilters] = useState({
    programType: 'all' as 'all' | 'junior' | 'youth' | 'adult',
    location: 'all' as 'all' | 'LBHS' | 'Moulton' | 'Alta Laguna',
    day: 'all' as 'all' | typeof days[number]
  })
  const [registrationModal, setRegistrationModal] = useState<{
    isOpen: boolean
    program: any | null
  }>({ isOpen: false, program: null })

  const isEarlyBird = season === 'winter' && new Date() < new Date('2025-12-15')

  // Select programs based on season
  const currentPrograms = season === 'fall' ? fall2025Programs : winter2026Programs

  // Filter programs
  const filteredPrograms = currentPrograms.filter(program => {
    if (filters.programType !== 'all' && program.category !== filters.programType) return false
    if (filters.location !== 'all' && program.location !== filters.location) return false
    if (filters.day !== 'all' && program.day !== filters.day) return false
    return true
  })

  // Organize by day
  const programsByDay = days.reduce((acc, day) => {
    acc[day] = filteredPrograms.filter(p => p.day === day)
    return acc
  }, {} as Record<string, typeof winter2026Programs>)

  const openRegistration = (program: any) => {
    setRegistrationModal({ isOpen: true, program })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-16">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>Schedule & Pricing</p>
            <h1 className="display mb-6">
              Find Your Program
            </h1>
            <p className="body-lg max-w-2xl mx-auto">
              Professional training designed around your life. See when classes meet, check pricing, and register in minutes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Early Bird Banner */}
      {isEarlyBird && (
        <section className="bg-lbta-coral text-white py-4">
          <div className="container-narrow text-center">
            <p className="body-sm">
              <span className="font-medium">Winter 2026: Register by December 15</span> and save $50
            </p>
          </div>
        </section>
      )}

      {/* Season Toggle */}
      <section className="bg-lbta-bone border-y border-gray-200 py-8">
        <div className="container-narrow">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setSeason('fall')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                season === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025
            </button>
            <button
              onClick={() => setSeason('winter')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                season === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>
          <div className="text-center">
            <p className="body-sm" style={{ color: '#6B6B6B' }}>
              {season === 'fall'
                ? '18-week session: August 26 – December 20, 2025'
                : '13-week session: January 6 – April 5, 2026'}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-8 sticky top-0 z-40">
        <div className="container-lbta">
          {/* Program Type Filter */}
          <div className="mb-6">
            <p className="eyebrow text-gray-600 mb-3">PROGRAM TYPE</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters({...filters, programType: 'all'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.programType === 'all'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilters({...filters, programType: 'junior'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.programType === 'junior'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                JUNIOR
              </button>
              <button
                onClick={() => setFilters({...filters, programType: 'youth'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.programType === 'youth'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                YOUTH DEV
              </button>
              <button
                onClick={() => setFilters({...filters, programType: 'adult'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.programType === 'adult'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                ADULT
              </button>
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <p className="eyebrow text-gray-600 mb-3">LOCATION</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters({...filters, location: 'all'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.location === 'all'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setFilters({...filters, location: 'LBHS'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.location === 'LBHS'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                LBHS
              </button>
              <button
                onClick={() => setFilters({...filters, location: 'Moulton'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.location === 'Moulton'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                MOULTON
              </button>
              <button
                onClick={() => setFilters({...filters, location: 'Alta Laguna'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.location === 'Alta Laguna'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                ALTA LAGUNA
              </button>
            </div>
          </div>

          {/* Day Filter */}
          <div>
            <p className="eyebrow text-gray-600 mb-3">DAY</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilters({...filters, day: 'all'})}
                className={`eyebrow px-6 py-2 transition-all duration-300 ${
                  filters.day === 'all'
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                ALL
              </button>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setFilters({...filters, day: day as any})}
                  className={`eyebrow px-6 py-2 transition-all duration-300 ${
                    filters.day === day
                      ? 'bg-lbta-charcoal text-white'
                      : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                  }`}
                >
                  {day.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule List by Day */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-lbta">
          <div className="space-y-16">
              {days.map((day, dayIndex) => {
                const dayPrograms = programsByDay[day]
                if (!dayPrograms || dayPrograms.length === 0) return null

                return (
                  <AnimatedSection key={day} delay={dayIndex * 0.05}>
                    <div>
                      {/* Day Header */}
                      <div className="mb-8">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="headline-sm text-lbta-charcoal">
                            {day}
                          </h2>
                          <div className="flex-1 h-px bg-lbta-charcoal/10" />
                          <span className="body-sm" style={{ color: '#6B6B6B' }}>
                            {dayPrograms.length} {dayPrograms.length === 1 ? 'class' : 'classes'}
                          </span>
                        </div>
                      </div>

                      {/* Program Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dayPrograms.map((program, index) => (
                          <div
                            key={`${program.name}-${program.time}-${index}`}
                            className="bg-white border border-gray-200 p-6 hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-lg group"
                          >
                            {/* Location Badge */}
                            {filters.location === 'all' && (
                              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                <MapPin className="w-3.5 h-3.5" style={{ color: '#E8956F' }} />
                                <span className="body-sm" style={{ color: '#6B6B6B' }}>
                                  {program.location}
                                </span>
                              </div>
                            )}

                            {/* Time (Prominent) */}
                            <div className="flex items-center gap-2 mb-4">
                              <Clock className="w-4 h-4 text-lbta-charcoal/60" />
                              <span className="subhead-sm text-lbta-charcoal">
                                {program.time}
                              </span>
                            </div>

                            {/* Program Name */}
                            <h3 className="subhead mb-3 leading-tight text-lbta-charcoal">
                              {program.name}
                            </h3>

                            {/* Ages & Duration */}
                            <p className="body-sm mb-3" style={{ color: '#6B6B6B' }}>
                              {program.ages} • {program.duration}
                            </p>

                            {/* Coach */}
                            {program.coach && (
                              <div className="flex items-center gap-2 mb-4 body-sm" style={{ color: '#6B6B6B' }}>
                                <User className="w-3.5 h-3.5" />
                                <span>Coach {program.coach}</span>
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center gap-2 mb-6 pt-4 border-t border-gray-100">
                              <DollarSign className="w-4 h-4" style={{ color: '#E8956F' }} />
                              <span className="subhead text-lbta-charcoal">
                                {program.price}
                              </span>
                            </div>

                            {/* CTAs */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => openRegistration(program)}
                                className="flex-1 eyebrow bg-lbta-coral text-white py-3 transition hover:bg-lbta-coral-dark"
                              >
                                REGISTER
                              </button>
                              <Link
                                href="/book"
                                className="flex-1 eyebrow border border-lbta-charcoal text-lbta-charcoal py-3 text-center transition hover:bg-lbta-charcoal hover:text-white"
                              >
                                TRIAL
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
        </div>
      </section>

      {/* Private Coaching */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="mb-12">
            <h2 className="headline text-center mb-4">
              Private Coaching
            </h2>
            <p className="body-sm text-center" style={{ color: '#6B6B6B' }}>
              One-on-one sessions with our professional staff
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privateRates.map((coach, index) => (
              <AnimatedSection key={coach.coach} delay={index * 0.1}>
                <div className="bg-white border border-gray-200 p-6 hover:border-lbta-charcoal/40 transition-all duration-300">
                  <h3 className="subhead mb-1">
                    {coach.coach}
                  </h3>
                  <p className="body-sm mb-4" style={{ color: '#E8956F' }}>
                    {coach.specialty}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="body-sm" style={{ color: '#6B6B6B' }}>60 min</span>
                      <span className="subhead">${coach.rate_60}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-sm" style={{ color: '#6B6B6B' }}>90 min</span>
                      <span className="subhead">${coach.rate_90}</span>
                    </div>
                  </div>
                  <Link
                    href="/book"
                    className="eyebrow inline-flex items-center justify-center w-full bg-white border border-lbta-charcoal text-lbta-charcoal py-3 mt-6 transition hover:bg-lbta-charcoal hover:text-white"
                  >
                    BOOK SESSION
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <p className="body-sm text-center mt-8" style={{ color: '#6B6B6B' }}>
            Package discounts: 5 lessons (5% off), 10 lessons (10% off), 20 lessons (15% off)
          </p>
        </div>
      </section>

      {/* Scholarship Mention */}
      <section className="section-spacing bg-lbta-bone border-y border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="body-sm mb-2" style={{ color: '#6B6B6B' }}>
              $25,000+ awarded annually to families demonstrating need and commitment
            </p>
            <Link
              href="/apply-scholarship"
              className="eyebrow inline-flex items-center text-lbta-charcoal hover:text-lbta-coral transition pb-1"
              style={{
                borderBottom: '1px solid #D1D5DB'
              }}
            >
              APPLY FOR SCHOLARSHIP →
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6 text-white">
              Questions?
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              Call us anytime or book your complimentary trial session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="eyebrow inline-flex items-center justify-center bg-white text-lbta-charcoal px-10 py-4 transition-all duration-300 hover:bg-lbta-bone">
                BOOK FREE TRIAL
              </Link>
              <a
                href="tel:9494646645"
                className="eyebrow inline-flex items-center justify-center border border-white text-white px-10 py-4 transition-all duration-300 hover:bg-white/10"
              >
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={() => setRegistrationModal({ isOpen: false, program: null })}
        program={registrationModal.program}
        season={season}
        allPrograms={currentPrograms.map(p => ({
          name: p.name,
          price: p.price,
          location: p.location
        }))}
      />
    </>
  )
}
