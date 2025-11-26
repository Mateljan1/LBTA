'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Class Schedules - Fall 2025 & Winter 2026 | LBTA',
  description: 'Complete schedule of tennis programs. Find your perfect training time at Alta Laguna Park, LBHS, or Moulton Meadows. Fall 2025 in progress, Winter 2026 opens Dec 1.',
  keywords: 'tennis class schedule Laguna Beach, tennis times, Alta Laguna tennis, LBHS tennis, Moulton Meadows tennis',
}

const fall2025Schedule = {
  "Alta Laguna Park": [
    { day: "Monday", programs: [
      { time: "3:30-5:00 PM", name: "JTT Practice - 10U Orange Ball", ages: "Team", duration: "90 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "5:00-7:00 PM", name: "14U Team Practice", ages: "Team", duration: "120 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "3:30-5:00 PM", name: "JTT Practice - 10U Orange Ball", ages: "Team", duration: "90 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "5:00-7:00 PM", name: "14U Team Practice", ages: "Team", duration: "120 min" }
    ]},
    { day: "Friday", programs: [
      { time: "3:30-5:00 PM", name: "JTT Practice - 10U Orange Ball", ages: "Team", duration: "90 min" }
    ]},
    { day: "Saturday", programs: [
      { time: "2:00-4:00 PM", name: "JTT Match - 10U Orange Ball", ages: "Team", duration: "120 min" }
    ]},
  ],
  "Laguna Beach High School": [
    { day: "Monday", programs: [
      { time: "7:00-9:30 AM", name: "LiveBall - Intermediate/Advanced", ages: "Adult", duration: "90 min" },
      { time: "12:00-2:00 PM", name: "Adult Advanced", ages: "NTRP 4.0+", duration: "120 min" },
      { time: "5:00-7:00 PM", name: "12U Gold Team Practice", ages: "Team", duration: "120 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "10:30 AM-12:00 PM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" },
      { time: "5:00-7:00 PM", name: "Ladies 3.5 Practice", ages: "Adult Team", duration: "120 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "5:00-7:00 PM", name: "12U Gold Team Practice", ages: "Team", duration: "120 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "10:30 AM-12:00 PM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" }
    ]},
    { day: "Friday", programs: [
      { time: "4:00-6:00 PM", name: "Practice Match - 12U Gold + Teams", ages: "Team", duration: "120 min" }
    ]},
    { day: "Saturday", programs: [
      { time: "9:00-10:30 AM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" },
      { time: "9:00-10:30 AM", name: "LiveBall - Beginner", ages: "Adult", duration: "90 min" },
      { time: "10:30 AM-12:00 PM", name: "LiveBall - Intermediate/Advanced", ages: "Adult", duration: "90 min" },
      { time: "10:30-11:30 AM", name: "Adult Beginner", ages: "Adult", duration: "60 min" },
      { time: "12:00-3:00 PM", name: "Ladies 3.5 Home Matches", ages: "Adult Team", duration: "180 min" },
      { time: "2:00-4:00 PM", name: "12U Bronze Team Matches", ages: "Team", duration: "120 min" },
      { time: "4:00-6:00 PM", name: "12U Gold Team Matches", ages: "Team", duration: "120 min" }
    ]},
  ],
  "Moulton Meadows": [
    { day: "Monday", programs: [
      { time: "3:30-4:30 PM", name: "Red Ball - Advanced", ages: "Ages 5-7", duration: "60 min" },
      { time: "4:30-5:30 PM", name: "Green Dot - Advanced", ages: "Ages 9-11", duration: "60 min" },
      { time: "5:30-7:00 PM", name: "Youth Development", ages: "Ages 11-13", duration: "90 min" },
      { time: "7:00-8:00 PM", name: "Adult Beginner", ages: "Adult", duration: "60 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "3:30-4:15 PM", name: "Little Tennis Stars", ages: "Ages 3-4", duration: "45 min" },
      { time: "4:30-5:30 PM", name: "Orange Ball - Beginner", ages: "Ages 7-9", duration: "60 min" },
      { time: "5:30-7:00 PM", name: "Youth Development", ages: "Ages 13-18", duration: "90 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "3:30-4:30 PM", name: "Red Ball - Beginner", ages: "Ages 5-7", duration: "60 min" },
      { time: "4:30-5:30 PM", name: "Green Dot - Beginner", ages: "Ages 9-11", duration: "60 min" },
      { time: "6:00-7:30 PM", name: "Cardio Tennis - All Levels", ages: "Adult", duration: "90 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "2:45-3:30 PM", name: "Little Tennis Stars", ages: "Ages 3-4", duration: "45 min" },
      { time: "3:30-4:30 PM", name: "Orange Ball - Advanced", ages: "Ages 7-9", duration: "60 min" },
      { time: "4:30-6:00 PM", name: "Youth Development", ages: "Ages 13-18", duration: "90 min" },
      { time: "6:00-7:30 PM", name: "LiveBall - Intermediate", ages: "Adult", duration: "90 min" }
    ]},
    { day: "Friday", programs: [
      { time: "3:30-4:30 PM", name: "Fun Friday Games & Skills", ages: "Ages 5-10", duration: "60 min" }
    ]},
  ]
}

const winter2026Schedule = {
  "Alta Laguna Park": [
    { day: "Monday", programs: [
      { time: "3:30-4:30 PM", name: "Red Ball Tennis", ages: "Ages 5-7", duration: "60 min" },
      { time: "4:30-5:30 PM", name: "Orange Ball Tennis", ages: "Ages 7-9", duration: "60 min" },
      { time: "5:30-7:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "3:30-4:30 PM", name: "Red Ball Tennis", ages: "Ages 5-7", duration: "60 min" },
      { time: "3:30-4:30 PM", name: "Green Dot Tennis", ages: "Ages 9-11", duration: "60 min" },
      { time: "4:30-5:30 PM", name: "Orange Ball Tennis", ages: "Ages 7-9", duration: "60 min" },
      { time: "4:30-6:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "3:30-4:30 PM", name: "Red Ball Tennis", ages: "Ages 5-7", duration: "60 min" },
      { time: "5:30-7:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "3:30-4:30 PM", name: "Green Dot Tennis", ages: "Ages 9-11", duration: "60 min" },
      { time: "3:30-5:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" },
      { time: "4:30-6:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" }
    ]},
  ],
  "Laguna Beach High School": [
    { day: "Monday", programs: [
      { time: "3:30-5:30 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:30-7:30 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:30-7:30 PM", name: "College Bound Intensive", ages: "Ages 14-18", duration: "120 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "10:30 AM-12:00 PM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" },
      { time: "3:30-5:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" },
      { time: "3:30-5:30 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:00-7:00 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "3:30-5:30 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:30-7:30 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:30-7:30 PM", name: "College Bound Intensive", ages: "Ages 14-18", duration: "120 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "3:30-5:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" },
      { time: "5:00-7:00 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" },
      { time: "5:30-7:30 PM", name: "College Bound Intensive", ages: "Ages 14-18", duration: "120 min" }
    ]},
    { day: "Saturday", programs: [
      { time: "9:00-10:30 AM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" },
      { time: "9:00-10:00 AM", name: "Adult Beginner", ages: "NTRP 1.0-2.5", duration: "60 min" },
      { time: "2:00-4:00 PM", name: "High Performance Training", ages: "Ages 12-17", duration: "120 min" }
    ]},
    { day: "Sunday", programs: [
      { time: "9:00-10:00 AM", name: "Adult Beginner", ages: "NTRP 1.0-2.5", duration: "60 min" },
      { time: "10:00-11:30 AM", name: "Adult Intermediate", ages: "NTRP 3.0-3.5", duration: "90 min" }
    ]},
  ],
  "Moulton Meadows": [
    { day: "Monday", programs: [
      { time: "7:00-8:30 PM", name: "Adult Beginner", ages: "NTRP 1.0-2.5", duration: "90 min" }
    ]},
    { day: "Tuesday", programs: [
      { time: "3:30-4:15 PM", name: "Little Tennis Stars", ages: "Ages 3-4", duration: "45 min" },
      { time: "4:30-5:30 PM", name: "Orange Ball Tennis", ages: "Ages 7-9", duration: "60 min" },
      { time: "6:00-7:30 PM", name: "Adult Beginner", ages: "NTRP 1.0-2.5", duration: "90 min" }
    ]},
    { day: "Wednesday", programs: [
      { time: "3:30-4:15 PM", name: "Little Tennis Stars", ages: "Ages 3-4", duration: "45 min" },
      { time: "4:30-5:30 PM", name: "Red Ball Tennis", ages: "Ages 5-7", duration: "60 min" },
      { time: "5:30-7:00 PM", name: "Green Dot Tennis", ages: "Ages 9-11", duration: "90 min" }
    ]},
    { day: "Thursday", programs: [
      { time: "3:30-4:30 PM", name: "Orange Ball Tennis", ages: "Ages 7-9", duration: "60 min" },
      { time: "4:30-6:00 PM", name: "Youth Development", ages: "Ages 11-15", duration: "90 min" },
      { time: "6:00-7:30 PM", name: "LiveBall - Intermediate", ages: "Adult", duration: "90 min" }
    ]},
  ]
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const locations = ["Alta Laguna Park", "Laguna Beach High School", "Moulton Meadows"]

export default function SchedulesPage() {
  const [activeSeason, setActiveSeason] = useState<'fall' | 'winter'>('fall')
  const [activeLocation, setActiveLocation] = useState<string>('all')
  
  const currentSchedule = activeSeason === 'fall' ? fall2025Schedule : winter2026Schedule

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Schedules</p>
            <h1 className="text-display-lg heading-display mb-6">
              Class Times & Locations
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Find the perfect time for your training. Programs run Monday–Sunday across three locations.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Season Toggle */}
      <section className="bg-lbta-cream border-b border-gray-200 sticky top-24 z-40 py-6">
        <div className="container-lbta">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveSeason('fall')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'fall'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              FALL 2025 (CURRENT)
            </button>
            <button
              onClick={() => setActiveSeason('winter')}
              className={`px-8 py-3 rounded-sm font-sans text-sm font-medium tracking-wide transition-all duration-300 ${
                activeSeason === 'winter'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              WINTER 2026
            </button>
          </div>
        </div>
      </section>

      {/* Season Info Banner */}
      <AnimatePresence mode="wait">
        <motion.section
          key={activeSeason}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className={`py-6 ${activeSeason === 'fall' ? 'bg-lbta-tan' : 'bg-blue-50'} border-b border-gray-200`}
        >
          <div className="container-lbta text-center">
            {activeSeason === 'fall' ? (
              <p className="text-sm text-gray-600">
                <strong>Fall 2025:</strong> In progress — Join anytime with prorated pricing
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <strong>Winter 2026:</strong> January 6 – April 5 (13 weeks) • Registration opens December 1, 2025
              </p>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* Location Filter */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="container-lbta">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveLocation('all')}
              className={`px-6 py-2 rounded-sm font-sans text-xs tracking-wide transition-all duration-300 ${
                activeLocation === 'all'
                  ? 'bg-lbta-charcoal text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
              }`}
            >
              ALL LOCATIONS
            </button>
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setActiveLocation(location)}
                className={`px-6 py-2 rounded-sm font-sans text-xs tracking-wide transition-all duration-300 ${
                  activeLocation === location
                    ? 'bg-lbta-charcoal text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-lbta-charcoal'
                }`}
              >
                {location.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Grid */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSeason}-${activeLocation}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {Object.entries(currentSchedule)
                .filter(([location]) => activeLocation === 'all' || activeLocation === location)
                .map(([location, schedule]) => (
                  <div key={location} className="mb-16 last:mb-0">
                    <h2 className="text-2xl font-serif font-light text-lbta-charcoal mb-8 flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-lbta-burnt" />
                      {location}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {schedule.map((daySchedule) => (
                        <div key={daySchedule.day} className="card-lbta p-6">
                          <h3 className="text-lg font-sans font-medium text-lbta-charcoal mb-4 pb-3 border-b border-gray-200">
                            {daySchedule.day}
                          </h3>
                          <div className="space-y-4">
                            {daySchedule.programs.map((program, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="flex items-start gap-2 mb-1">
                                  <Clock className="w-4 h-4 text-lbta-burnt flex-shrink-0 mt-0.5" />
                                  <span className="font-sans font-medium text-lbta-charcoal">
                                    {program.time}
                                  </span>
                                </div>
                                <div className="text-gray-700 font-medium mb-1">
                                  {program.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {program.ages}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Match Play Friday */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Match Play Friday
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Competitive match play every Friday evening. Round robin doubles for all levels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="card-lbta p-8 text-left">
                <h3 className="text-xl font-sans font-medium mb-4">Junior Session</h3>
                <p className="text-gray-600 mb-4">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Fridays 4:00-5:30 PM
                </p>
                <p className="text-gray-600 mb-4">Ages 8-18, All Skill Levels</p>
                <div className="text-2xl font-serif font-light text-lbta-charcoal">
                  $25 drop-in
                </div>
                <p className="text-sm text-gray-500">Monthly: 4 sessions for $85</p>
              </div>

              <div className="card-lbta p-8 text-left">
                <h3 className="text-xl font-sans font-medium mb-4">Adult Session</h3>
                <p className="text-gray-600 mb-4">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Fridays 6:00-8:00 PM
                </p>
                <p className="text-gray-600 mb-4">NTRP 2.5-4.5+</p>
                <div className="text-2xl font-serif font-light text-lbta-charcoal">
                  $35 drop-in
                </div>
                <p className="text-sm text-gray-500">Monthly: 4 sessions for $120</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Family Package: $60 drop-in, $200 monthly
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              {activeSeason === 'winter' 
                ? 'Registration opens December 1, 2025'
                : 'Join anytime with prorated pricing'}
            </p>
            <Link
              href="/book"
              className="btn-primary"
            >
              BOOK FREE TRIAL
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

