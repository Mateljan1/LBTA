'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

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
  { name: "Youth Development", day: "Monday", time: "5:30-7:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "3:30-5:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  { name: "Youth Development", day: "Tuesday", time: "4:30-6:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  { name: "Youth Development", day: "Wednesday", time: "5:30-7:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "3:30-5:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Savriyan", category: "youth" },
  { name: "Youth Development", day: "Thursday", time: "4:30-6:00 PM", ages: "11-15", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Andy", category: "youth" },
  
  // High Performance
  { name: "High Performance Training", day: "Monday", time: "3:30-5:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "High Performance Training", day: "Tuesday", time: "5:00-7:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Savriyan", category: "high-performance" },
  { name: "High Performance Training", day: "Wednesday", time: "3:30-5:30 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "High Performance Training", day: "Thursday", time: "5:00-7:00 PM", ages: "12-17 (UTR 5-8)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Savriyan", category: "high-performance" },
  
  { name: "College Bound Intensive", day: "Monday", time: "5:30-7:30 PM", ages: "14-18 (UTR 8.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  { name: "College Bound Intensive", day: "Wednesday", time: "5:30-7:30 PM", ages: "14-18 (UTR 8.0+)", duration: "2 hr", price: "$1,437/qtr", location: "LBHS", coach: "Kevin", category: "high-performance" },
  
  // Adult Programs
  { name: "Adult Beginner", day: "Monday", time: "7:00-8:00 PM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "Adult Beginner", day: "Saturday", time: "10:30-11:30 AM", ages: "NTRP 1.0-2.5", duration: "1 hr", price: "$546/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  
  { name: "Adult Intermediate", day: "Monday", time: "7:00-8:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "adult" },
  { name: "Adult Intermediate", day: "Tuesday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Wednesday", time: "7:00-8:30 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "Alta Laguna", coach: "Michelle", category: "adult" },
  { name: "Adult Intermediate", day: "Thursday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "Adult Intermediate", day: "Saturday", time: "9:00-10:30 AM", ages: "NTRP 3.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  
  { name: "Adult Advanced", day: "Monday", time: "12:00-2:00 PM", ages: "NTRP 4.0+", duration: "2 hr", price: "$1,121/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  
  { name: "LiveBall - Intermediate", day: "Monday", time: "7:00-9:30 AM", ages: "NTRP 3.0-4.5", duration: "2.5 hr", price: "$756/qtr", location: "LBHS", coach: "Kevin", category: "adult" },
  { name: "LiveBall - Beginner", day: "Thursday", time: "6:00-7:30 PM", ages: "NTRP 2.0-3.5", duration: "1.5 hr", price: "$756/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "LiveBall - Beginner", day: "Saturday", time: "9:00-10:30 AM", ages: "All Levels", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "LiveBall - Int/Adv", day: "Saturday", time: "10:30 AM-12:00 PM", ages: "NTRP 3.0+", duration: "1.5 hr", price: "$756/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  
  { name: "Cardio Tennis", day: "Tuesday", time: "6:00-7:00 PM", ages: "All Levels", duration: "1 hr", price: "$546/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  { name: "Cardio Tennis", day: "Wednesday", time: "6:00-7:30 PM", ages: "All Levels", duration: "1.5 hr", price: "$756/qtr", location: "Moulton", coach: "Michelle", category: "adult" },
  
  // Ladies Programs
  { name: "Ladies 3.5 Practice", day: "Tuesday", time: "5:00-7:00 PM", ages: "Team", duration: "2 hr", price: "$756/qtr", location: "LBHS", coach: "Staff", category: "adult" },
  { name: "Ladies 3.5 Matches", day: "Saturday", time: "12:00-3:00 PM", ages: "Team", duration: "3 hr", price: "$756/qtr", location: "LBHS", coach: "Staff", category: "adult" },
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

export default function SchedulesPage() {
  const [selectedSeason, setSelectedSeason] = useState<'winter' | 'fall'>('winter')
  
  const currentPrograms = selectedSeason === 'winter' ? winter2026Programs : fall2025Programs
  const seasonLabel = selectedSeason === 'winter' ? 'Winter 2026' : 'Fall 2025'

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/schedules-hero.webp"
            alt="LBTA tennis training programs"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-[40px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.5px] mb-6">
            Every Day, a Place to Belong.
          </h1>
          <p className="font-sans text-[18px] md:text-[20px] leading-[1.6] text-white/90 mb-8">
            Explore class times and programs built around movement, discipline, and belonging.
          </p>
          <Link 
            href="/programs"
            className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-lg transition-all duration-200"
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
        </div>
      </div>

      {/* SCHEDULE GRID */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <h2 className="font-serif text-[32px] md:text-[40px] font-semibold text-black mb-3 text-center">
            {seasonLabel} Schedule
          </h2>
          <p className="font-sans text-[16px] text-black/70 mb-12 text-center">
            {currentPrograms.length} programs available
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentPrograms.map((program, index) => (
              <div 
                key={`${program.name}-${program.day}-${program.time}-${index}`}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <h3 className="font-serif text-[22px] font-semibold text-black/90 mb-2 leading-tight">
                  {program.name}
                </h3>
                <div className="space-y-1 mb-4">
                  <p className="font-sans text-[16px] text-black/80">
                    📍 {program.location} · 🕒 {program.time}
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
    </>
  )
}
