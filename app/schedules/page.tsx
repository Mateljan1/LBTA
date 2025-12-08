'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, User } from 'lucide-react'
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

// Helper to organize schedule by week day for calendar view
const organizeByDay = (schedule: any) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const organized: any = {}

  days.forEach(day => {
    organized[day] = {}
    Object.keys(schedule).forEach(location => {
      organized[day][location] = schedule[location].filter((item: any) => item.day === day)
    })
  })

  return organized
}

export default function SchedulesPage() {
  const [activeSeason, setActiveSeason] = useState<'fall' | 'winter'>('winter')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  const currentSchedule = activeSeason === 'fall' ? fall2025Schedule : winter2026Schedule
  const weeklySchedule = organizeByDay(currentSchedule)

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-16">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="eyebrow mb-6" style={{ color: '#E8956F' }}>Class Schedules</p>
            <h1 className="display mb-6">
              Your Perfect Time
            </h1>
            <p className="body-lg max-w-2xl mx-auto">
              Professional training designed around your life. Morning, afternoon, and evening sessions across three premium facilities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Selection */}
      <section className="bg-lbta-bone border-b border-gray-200 py-12">
        <div className="container-narrow">
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveSeason('fall')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                activeSeason === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`eyebrow px-12 py-4 transition-all duration-300 ${
                activeSeason === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-lbta-charcoal/20 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>

          <div className="text-center">
            {activeSeason === 'fall' ? (
              <p className="body-sm" style={{ color: '#6B6B6B' }}>
                Current session in progress — Join us anytime
              </p>
            ) : (
              <p className="body-sm" style={{ color: '#6B6B6B' }}>
                13-week session: January 6 – April 5, 2026 • Registration opens December 1
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Location Filter */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container-lbta">
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => setSelectedLocation(null)}
              className={`eyebrow px-8 py-3 transition-all duration-300 ${
                selectedLocation === null
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
              }`}
            >
              ALL LOCATIONS
            </button>
            {Object.keys(currentSchedule).map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`eyebrow px-8 py-3 transition-all duration-300 ${
                  selectedLocation === location
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-lbta-charcoal border border-gray-200 hover:border-lbta-charcoal'
                }`}
              >
                {location.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Calendar View */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-lbta">
          <div className="space-y-16">
            {days.map((day, dayIndex) => {
              // Filter classes for this day based on selected location
              const dayClasses = selectedLocation
                ? weeklySchedule[day][selectedLocation] || []
                : Object.values(weeklySchedule[day]).flat()

              if (dayClasses.length === 0) return null

              return (
                <AnimatedSection key={day} delay={dayIndex * 0.05}>
                  <div>
                    {/* Day Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-2">
                        <h2 className="headline-sm">
                          {day}
                        </h2>
                        <div className="flex-1 h-px bg-lbta-charcoal/10" />
                        <span className="body-sm" style={{ color: '#6B6B6B' }}>
                          {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                        </span>
                      </div>
                    </div>

                    {/* Classes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {dayClasses.map((item: any, index: number) => {
                        // Find which location this class belongs to
                        const itemLocation = Object.keys(currentSchedule).find(loc =>
                          currentSchedule[loc as keyof typeof currentSchedule].includes(item)
                        )

                        return (
                          <div key={index} className="bg-white border border-gray-200 p-6 hover:border-lbta-charcoal/40 transition-all duration-300 hover:shadow-md group">
                            {/* Location Badge */}
                            {!selectedLocation && (
                              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                                <MapPin className="w-3.5 h-3.5" style={{ color: '#E8956F' }} />
                                <span className="body-sm" style={{ color: '#6B6B6B' }}>
                                  {itemLocation}
                                </span>
                              </div>
                            )}

                            {/* Time */}
                            <div className="flex items-center gap-2 mb-4">
                              <Clock className="w-4 h-4 text-lbta-charcoal/60" />
                              <span className="body-sm font-medium text-lbta-charcoal">
                                {item.time}
                              </span>
                            </div>

                            {/* Program */}
                            <h3 className="subhead mb-3 leading-tight">
                              {item.program}
                            </h3>

                            {/* Ages */}
                            <p className="body-sm mb-4" style={{ color: '#6B6B6B' }}>
                              {item.ages}
                            </p>

                            {/* Coach (if winter schedule) */}
                            {item.coach && (
                              <div className="flex items-center gap-2 mb-4 body-sm" style={{ color: '#6B6B6B' }}>
                                <User className="w-3.5 h-3.5" />
                                <span>Coach {item.coach}</span>
                              </div>
                            )}

                            {/* CTA */}
                            <Link
                              href="/book"
                              className="eyebrow inline-flex items-center text-lbta-charcoal group-hover:border-lbta-coral pb-1"
                              style={{
                                borderBottom: '1px solid #D1D5DB',
                                transition: 'all 0.3s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#E8956F'
                                e.currentTarget.style.borderColor = '#E8956F'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#1A1A1A'
                                e.currentTarget.style.borderColor = '#D1D5DB'
                              }}
                            >
                              BOOK TRIAL →
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      {/* Location Info Cards */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-lbta">
          <div className="text-center mb-16">
            <h2 className="headline mb-4">
              Three Premium Facilities
            </h2>
            <div className="w-16 h-px mx-auto" style={{ backgroundColor: '#E8956F' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(currentSchedule).map(([location, classes], index) => (
              <AnimatedSection key={location} delay={index * 0.1}>
                <div className="bg-lbta-bone border border-gray-200 p-8 h-full">
                  <MapPin className="w-6 h-6 mb-6" style={{ color: '#E8956F' }} />
                  <h3 className="subhead mb-3">
                    {location}
                  </h3>
                  <p className="body-sm mb-6" style={{ color: '#6B6B6B' }}>
                    {classes.length} weekly programs
                  </p>
                  <button
                    onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
                    className="eyebrow text-lbta-charcoal pb-1"
                    style={{
                      borderBottom: '1px solid #D1D5DB',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#E8956F'
                      e.currentTarget.style.borderColor = '#E8956F'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#1A1A1A'
                      e.currentTarget.style.borderColor = '#D1D5DB'
                    }}
                  >
                    {selectedLocation === location ? 'SHOW ALL' : 'VIEW SCHEDULE'} →
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="headline mb-6 text-white">
              Ready to Begin?
            </h2>
            <p className="body-lg mb-10 max-w-2xl mx-auto text-white/80">
              {activeSeason === 'winter'
                ? 'Winter registration opens December 1. Secure your spot in our 13-week development program.'
                : 'Fall session in progress. Join us this week for your complimentary trial.'}
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
    </>
  )
}
