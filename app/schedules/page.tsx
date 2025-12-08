'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const fall2025Schedule = {
  "Alta Laguna Park": [
    { day: "Monday", time: "3:30-5:00 PM", program: "JTT Practice - 10U Orange Ball", ages: "Team" },
    { day: "Tuesday", time: "5:00-7:00 PM", program: "14U Team Practice", ages: "Team" },
    { day: "Wednesday", time: "3:30-5:00 PM", program: "JTT Practice - 10U Orange Ball", ages: "Team" },
    { day: "Thursday", time: "5:00-7:00 PM", program: "14U Team Practice", ages: "Team" },
    { day: "Friday", time: "3:30-5:00 PM", program: "JTT Practice - 10U Orange Ball", ages: "Team" },
    { day: "Saturday", time: "2:00-4:00 PM", program: "JTT Match - 10U Orange Ball", ages: "Team" },
  ],
  "Laguna Beach High School": [
    { day: "Monday", time: "7:00-9:30 AM", program: "LiveBall - Intermediate/Advanced", ages: "Adult" },
    { day: "Monday", time: "12:00-2:00 PM", program: "Adult Advanced", ages: "4.0+" },
    { day: "Monday", time: "5:00-7:00 PM", program: "12U Gold Team Practice", ages: "Team" },
    { day: "Tuesday", time: "10:30 AM-12:00 PM", program: "Adult Intermediate", ages: "3.0-3.5" },
    { day: "Tuesday", time: "5:00-7:00 PM", program: "Ladies 3.5 Practice", ages: "Team" },
    { day: "Wednesday", time: "5:00-7:00 PM", program: "12U Gold Team Practice", ages: "Team" },
    { day: "Thursday", time: "10:30 AM-12:00 PM", program: "Adult Intermediate", ages: "3.0-3.5" },
    { day: "Friday", time: "4:00-6:00 PM", program: "Practice Match - 12U Gold", ages: "Team" },
    { day: "Saturday", time: "9:00-10:30 AM", program: "Adult Intermediate", ages: "3.0-3.5" },
    { day: "Saturday", time: "9:00-10:30 AM", program: "LiveBall - Beginner", ages: "Adult" },
    { day: "Saturday", time: "10:30 AM-12:00 PM", program: "LiveBall - Int/Adv", ages: "Adult" },
    { day: "Saturday", time: "10:30-11:30 AM", program: "Adult Beginner", ages: "Adult" },
    { day: "Saturday", time: "12:00-3:00 PM", program: "Ladies 3.5 Matches", ages: "Team" },
    { day: "Saturday", time: "2:00-4:00 PM", program: "12U Bronze Matches", ages: "Team" },
    { day: "Saturday", time: "4:00-6:00 PM", program: "12U Gold Matches", ages: "Team" },
  ],
  "Moulton Meadows": [
    { day: "Monday", time: "3:30-4:30 PM", program: "Red Ball - Advanced", ages: "5-7" },
    { day: "Monday", time: "4:30-5:30 PM", program: "Green Dot - Advanced", ages: "9-11" },
    { day: "Monday", time: "5:30-7:00 PM", program: "Youth Development", ages: "11-13" },
    { day: "Monday", time: "7:00-8:00 PM", program: "Adult Beginner", ages: "Adult" },
    { day: "Tuesday", time: "3:30-4:15 PM", program: "Little Tennis Stars", ages: "3-4" },
    { day: "Tuesday", time: "4:30-5:30 PM", program: "Orange Ball - Beginner", ages: "7-9" },
    { day: "Tuesday", time: "5:30-7:00 PM", program: "Youth Development", ages: "13-18" },
    { day: "Wednesday", time: "3:30-4:30 PM", program: "Red Ball - Beginner", ages: "5-7" },
    { day: "Wednesday", time: "4:30-5:30 PM", program: "Green Dot - Beginner", ages: "9-11" },
    { day: "Wednesday", time: "6:00-7:30 PM", program: "Cardio Tennis", ages: "All" },
    { day: "Thursday", time: "2:45-3:30 PM", program: "Little Tennis Stars", ages: "3-4" },
    { day: "Thursday", time: "3:30-4:30 PM", program: "Orange Ball - Advanced", ages: "7-9" },
    { day: "Thursday", time: "4:30-6:00 PM", program: "Youth Development", ages: "13-18" },
    { day: "Thursday", time: "6:00-7:30 PM", program: "LiveBall - Intermediate", ages: "Adult" },
    { day: "Friday", time: "3:30-4:30 PM", program: "Fun Friday Games", ages: "5-10" },
  ]
}

const winter2026Schedule = {
  "Alta Laguna Park": [
    { day: "Monday", time: "3:30-4:30 PM", program: "Red Ball Tennis", ages: "5-7", coach: "Michelle" },
    { day: "Monday", time: "4:30-5:30 PM", program: "Orange Ball Tennis", ages: "7-9", coach: "Michelle" },
    { day: "Monday", time: "5:30-6:30 PM", program: "Youth Development", ages: "11-15", coach: "Michelle" },
    { day: "Tuesday", time: "3:30-4:30 PM", program: "Green Dot Tennis", ages: "9-11", coach: "Andy" },
    { day: "Tuesday", time: "4:30-6:00 PM", program: "Youth Development", ages: "11-15", coach: "Andy" },
    { day: "Wednesday", time: "3:30-4:30 PM", program: "Red Ball Tennis", ages: "5-7", coach: "Michelle" },
    { day: "Wednesday", time: "4:30-5:30 PM", program: "Orange Ball Tennis", ages: "7-9", coach: "Michelle" },
    { day: "Wednesday", time: "5:30-6:30 PM", program: "Youth Development", ages: "11-15", coach: "Michelle" },
    { day: "Thursday", time: "3:30-4:30 PM", program: "Green Dot Tennis", ages: "9-11", coach: "Andy" },
    { day: "Thursday", time: "4:30-6:00 PM", program: "Youth Development", ages: "11-15", coach: "Andy" },
    { day: "Friday", time: "3:30-5:30 PM", program: "MatchPlay Friday", ages: "All Ages", coach: "Andy" },
    { day: "Saturday", time: "9:00-10:00 AM", program: "Red/Orange Ball Group", ages: "5-9", coach: "Andy" },
    { day: "Saturday", time: "10:00-11:30 AM", program: "Junior Match Play", ages: "10-17", coach: "Andy" },
  ],
  "Laguna Beach High School": [
    { day: "Monday", time: "7:00-8:30 AM", program: "LiveBall Intermediate/Advanced", ages: "Adult (NTRP 3.0-4.5)", coach: "Kevin" },
    { day: "Monday", time: "12:00-2:00 PM", program: "Adult Advanced", ages: "Adult (NTRP 4.0+)", coach: "Kevin" },
    { day: "Monday", time: "3:30-5:30 PM", program: "High Performance Training", ages: "12-17 (UTR 5-8)", coach: "Kevin" },
    { day: "Monday", time: "5:30-7:30 PM", program: "College Bound Intensive", ages: "14-18 (UTR 8.0+)", coach: "Kevin" },
    { day: "Tuesday", time: "10:30 AM-12:00 PM", program: "Adult Intermediate", ages: "Adult (NTRP 3.0-3.5)", coach: "Kevin" },
    { day: "Tuesday", time: "3:30-5:00 PM", program: "Youth Development", ages: "11-15", coach: "Savriyan" },
    { day: "Tuesday", time: "5:00-7:00 PM", program: "High Performance Training", ages: "12-17 (UTR 5-8)", coach: "Savriyan" },
    { day: "Wednesday", time: "3:30-5:30 PM", program: "High Performance Training", ages: "12-17 (UTR 5-8)", coach: "Kevin" },
    { day: "Wednesday", time: "5:30-7:30 PM", program: "College Bound Intensive", ages: "14-18 (UTR 8.0+)", coach: "Kevin" },
    { day: "Thursday", time: "10:30 AM-12:00 PM", program: "Adult Intermediate", ages: "Adult (NTRP 3.0-3.5)", coach: "Kevin" },
    { day: "Thursday", time: "3:30-5:00 PM", program: "Youth Development", ages: "11-15", coach: "Savriyan" },
    { day: "Thursday", time: "5:00-7:00 PM", program: "High Performance Training", ages: "12-17 (UTR 5-8)", coach: "Savriyan" },
    { day: "Thursday", time: "5:30-7:30 PM", program: "College Bound Intensive", ages: "14-18 (UTR 8.0+)", coach: "Kevin" },
    { day: "Friday", time: "3:30-5:30 PM", program: "MatchPlay Friday", ages: "All Ages", coach: "Kevin" },
    { day: "Saturday", time: "9:00-10:00 AM", program: "Adult Beginner", ages: "Adult (NTRP 1.0-2.5)", coach: "Kevin" },
    { day: "Saturday", time: "10:00-11:30 AM", program: "Adult Intermediate", ages: "Adult (NTRP 3.0-3.5)", coach: "Kevin" },
    { day: "Saturday", time: "11:30 AM-1:00 PM", program: "LiveBall Advanced", ages: "Adult (NTRP 3.5-4.5)", coach: "Kevin" },
    { day: "Saturday", time: "2:00-4:00 PM", program: "High Performance Match Play", ages: "12-18 (UTR 5.0+)", coach: "Kevin" },
    { day: "Sunday", time: "9:00-10:00 AM", program: "Adult Beginner", ages: "Adult (NTRP 1.0-2.5)", coach: "Kevin" },
    { day: "Sunday", time: "10:00-11:30 AM", program: "Adult Intermediate", ages: "Adult (NTRP 3.0-3.5)", coach: "Kevin" },
  ],
  "Moulton Meadows": [
    { day: "Monday", time: "3:30-4:15 PM", program: "Little Tennis Stars", ages: "3-4", coach: "Michelle" },
    { day: "Monday", time: "4:30-5:30 PM", program: "Red Ball Tennis", ages: "5-7", coach: "Michelle" },
    { day: "Monday", time: "5:30-6:30 PM", program: "Orange Ball Tennis", ages: "7-9", coach: "Michelle" },
    { day: "Monday", time: "7:00-8:30 PM", program: "Adult Beginner", ages: "Adult (NTRP 1.0-2.5)", coach: "Andy" },
    { day: "Tuesday", time: "3:30-4:15 PM", program: "Little Tennis Stars", ages: "3-4", coach: "Andy" },
    { day: "Tuesday", time: "4:30-5:30 PM", program: "Orange Ball Tennis", ages: "7-9", coach: "Andy" },
    { day: "Tuesday", time: "6:00-7:30 PM", program: "Adult Beginner", ages: "Adult (NTRP 1.0-2.5)", coach: "Savriyan" },
    { day: "Tuesday", time: "7:30-9:00 PM", program: "Private Lessons", ages: "All Levels", coach: "Savriyan" },
    { day: "Wednesday", time: "3:30-4:15 PM", program: "Little Tennis Stars", ages: "3-4", coach: "Michelle" },
    { day: "Wednesday", time: "4:30-5:30 PM", program: "Red Ball Tennis", ages: "5-7", coach: "Michelle" },
    { day: "Wednesday", time: "5:30-6:30 PM", program: "Green Dot Tennis", ages: "9-11", coach: "Michelle" },
    { day: "Wednesday", time: "7:00-8:30 PM", program: "Cardio Tennis", ages: "Adult (All Levels)", coach: "Andy" },
    { day: "Thursday", time: "2:45-3:30 PM", program: "Little Tennis Stars", ages: "3-4", coach: "Andy" },
    { day: "Thursday", time: "3:30-4:30 PM", program: "Orange Ball Tennis", ages: "7-9", coach: "Andy" },
    { day: "Thursday", time: "4:30-6:00 PM", program: "Youth Development", ages: "11-15", coach: "Andy" },
    { day: "Thursday", time: "6:00-7:30 PM", program: "Adult Intermediate", ages: "Adult (NTRP 3.0-3.5)", coach: "Savriyan" },
    { day: "Thursday", time: "7:30-9:00 PM", program: "Private Lessons", ages: "All Levels", coach: "Savriyan" },
    { day: "Friday", time: "3:30-4:30 PM", program: "Fun Friday", ages: "5-10", coach: "Michelle" },
    { day: "Friday", time: "6:00-8:00 PM", program: "Private Lessons", ages: "All Levels", coach: "Available" },
  ]
}

export default function SchedulesPage() {
  const [activeSeason, setActiveSeason] = useState<'fall' | 'winter'>('fall')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  
  const currentSchedule = activeSeason === 'fall' ? fall2025Schedule : winter2026Schedule

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Schedules</p>
            <h1 className="text-display-lg heading-display mb-6">
              Find Your Perfect Time
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Designed around your life. Morning, afternoon, and evening sessions across three premium facilities. Your development happens on your schedule.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Selection */}
      <section className="bg-lbta-cream border-b border-gray-200 py-8">
        <div className="container-narrow">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveSeason('fall')}
              className={`px-10 py-4 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-500 ${
                activeSeason === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`px-10 py-4 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-500 ${
                activeSeason === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>

          <div className="text-center mt-6">
            {activeSeason === 'fall' ? (
              <p className="text-sm text-gray-600">
                Current session in progress — Join us anytime
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                13-week session: January 6 – April 5 • Opens December 1
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Location Cards */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="text-center mb-12">
            <button
              onClick={() => setSelectedLocation(selectedLocation === 'all' ? null : 'all')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-500 ${
                selectedLocation === 'all'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              {selectedLocation === 'all' ? 'HIDE ALL SCHEDULES' : 'VIEW ALL SCHEDULES'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.keys(currentSchedule).map((location, index) => (
              <AnimatedSection key={location} delay={index * 0.1}>
                <button
                  onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                  className={`w-full text-left card-lbta p-8 transition-all duration-500 ${
                    selectedLocation === location ? 'border-lbta-charcoal shadow-lg' : ''
                  }`}
                >
                  <MapPin className="w-6 h-6 text-lbta-burnt mb-4" />
                  <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-2">
                    {location}
                  </h2>
                  <p className="text-sm text-gray-500 font-sans">
                    {currentSchedule[location as keyof typeof currentSchedule].length} weekly classes
                  </p>
                  <div className="mt-4 text-sm font-sans text-lbta-burnt tracking-wide">
                    {selectedLocation === location ? 'Close ↑' : 'See Times →'}
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Details - Single Location */}
      {selectedLocation && selectedLocation !== 'all' && (
        <section className="section-spacing bg-lbta-cream">
          <div className="container-lbta">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-2">
                {selectedLocation}
              </h2>
              <div className="h-0.5 w-12 bg-lbta-burnt mx-auto mt-4" />
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {currentSchedule[selectedLocation as keyof typeof currentSchedule].map((item, index) => (
                <AnimatedSection key={index} delay={index * 0.05}>
                  <div className="card-lbta p-6 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-4 h-4 text-lbta-burnt" />
                          <span className="font-sans text-sm text-gray-500">
                            {item.day}
                          </span>
                          <span className="font-sans text-sm font-medium text-lbta-charcoal">
                            {item.time}
                          </span>
                        </div>
                        <h3 className="text-lg font-serif font-light text-lbta-charcoal mb-1">
                          {item.program}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.ages}
                        </p>
                      </div>
                      <Link
                        href="/book"
                        className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 w-fit"
                      >
                        Join This Class →
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-sm font-sans text-gray-600 tracking-wide hover:text-lbta-charcoal transition-colors"
              >
                ← Back to All Locations
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Schedule Details - All Locations */}
      {selectedLocation === 'all' && (
        <section className="section-spacing bg-lbta-cream">
          <div className="container-lbta">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-2">
                Weekly Schedule
              </h2>
              <div className="h-0.5 w-12 bg-lbta-burnt mx-auto mt-4" />
              <p className="text-sm text-gray-500 mt-4">
                All classes — All locations — All levels
              </p>
            </div>

            <div className="space-y-16">
              {Object.entries(currentSchedule).map(([location, classes]) => (
                <div key={location}>
                  <div className="mb-8 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-lbta-burnt" />
                    <h3 className="text-2xl font-serif font-light text-lbta-charcoal">
                      {location}
                    </h3>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>

                  <div className="max-w-4xl space-y-6">
                    {classes.map((item, index) => (
                      <div key={index} className="card-lbta p-6 bg-white">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Clock className="w-4 h-4 text-lbta-burnt" />
                              <span className="font-sans text-sm text-gray-500">
                                {item.day}
                              </span>
                              <span className="font-sans text-sm font-medium text-lbta-charcoal">
                                {item.time}
                              </span>
                            </div>
                            <h4 className="text-lg font-serif font-light text-lbta-charcoal mb-1">
                              {item.program}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {item.ages}
                            </p>
                          </div>
                          <Link
                            href="/book"
                            className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 w-fit"
                          >
                            Book Trial →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-sm font-sans text-gray-600 tracking-wide hover:text-lbta-charcoal transition-colors"
              >
                ← Back to Location Cards
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Start Your Training
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              {activeSeason === 'winter' 
                ? 'Winter session opens December 1. Reserve your spot today.'
                : 'Current session in progress. Join us this week.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                BOOK FREE TRIAL
              </Link>
              <a href="tel:9494646645" className="btn-secondary">
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
