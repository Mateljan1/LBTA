'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, MapPin, Clock, Trophy } from 'lucide-react'

interface Quarter {
  season: string
  dates: string
  weeks: number
  registrationOpen: string
  earlyBirdDeadline: string
  earlyBirdDiscount: number
  status: string
}

interface Camp {
  name: string
  dates: string
  days: number | string
  hours: string
  ages: string
  location: string
  description: string
}

interface JTT {
  season: string
  dates: string
  weeks: number
  matchDay: string
  practiceIncluded: boolean
  divisions: string[]
  description: string
}

interface ScheduleData {
  year: number
  quarters: Quarter[]
  camps: Camp[]
  jtt: JTT[]
}

interface ScheduleTableProps {
  data: ScheduleData
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'registration_open':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Registration Open
        </span>
      )
    case 'in_progress':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lbta-orange/20 text-lbta-orange">
          In Progress
        </span>
      )
    case 'coming_soon':
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          Coming Soon
        </span>
      )
    default:
      return null
  }
}

export default function ScheduleTable({ data }: ScheduleTableProps) {
  return (
    <div className="space-y-20 md:space-y-32">
      {/* Quarterly Schedule */}
      <motion.section 
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        aria-labelledby="quarters-heading"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="font-sans text-xs tracking-[3px] uppercase text-lbta-orange mb-4">
            {data.year} Academic Year
          </p>
          <h2 id="quarters-heading" className="font-serif text-3xl md:text-5xl font-light text-black mb-4">
            Quarterly Schedule
          </h2>
          <p className="font-sans text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Four seasons of structured training, each designed to build on the last.
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Quarterly schedule"
        >
          {data.quarters.map((quarter, index) => (
            <motion.article
              key={quarter.season}
              variants={fadeInUp}
              className="group bg-white border border-gray-100 rounded-sm p-6 md:p-8 hover:border-lbta-orange/30 hover:shadow-lg transition-all duration-500"
              role="listitem"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl md:text-3xl font-light text-black">
                  {quarter.season}
                </h3>
                {getStatusBadge(quarter.status)}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-lbta-orange" aria-hidden="true" />
                  <span className="font-sans text-sm">{quarter.dates}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4 text-lbta-orange" aria-hidden="true" />
                  <span className="font-sans text-sm">{quarter.weeks} weeks</span>
                </div>
              </div>

              {quarter.status === 'registration_open' && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-sans text-xs text-gray-500 mb-1">Early Bird Deadline</p>
                  <p className="font-sans text-sm font-medium text-black">{quarter.earlyBirdDeadline}</p>
                  <p className="font-sans text-xs text-green-600 mt-1">Save ${quarter.earlyBirdDiscount}</p>
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      {/* Camps */}
      <motion.section
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        aria-labelledby="camps-heading"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="font-sans text-xs tracking-[3px] uppercase text-lbta-orange mb-4">
            Holiday & Break Programs
          </p>
          <h2 id="camps-heading" className="font-serif text-3xl md:text-5xl font-light text-black mb-4">
            Tennis Camps
          </h2>
          <p className="font-sans text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Full-day and half-day camps during school breaks. Keep skills sharp year-round.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="overflow-x-auto">
          <table 
            className="w-full min-w-[640px] bg-white border border-gray-100"
            role="table"
            aria-label="2026 Tennis Camps Schedule"
          >
            <thead>
              <tr className="bg-black text-white">
                <th scope="col" className="px-6 py-4 text-left font-sans text-xs tracking-[2px] uppercase font-medium">
                  Camp
                </th>
                <th scope="col" className="px-6 py-4 text-left font-sans text-xs tracking-[2px] uppercase font-medium">
                  Dates
                </th>
                <th scope="col" className="px-6 py-4 text-left font-sans text-xs tracking-[2px] uppercase font-medium">
                  Hours
                </th>
                <th scope="col" className="px-6 py-4 text-left font-sans text-xs tracking-[2px] uppercase font-medium">
                  Ages
                </th>
                <th scope="col" className="px-6 py-4 text-left font-sans text-xs tracking-[2px] uppercase font-medium">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {data.camps.map((camp, index) => (
                <tr 
                  key={camp.name}
                  className={`border-t border-gray-100 hover:bg-lbta-beige/30 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-sans text-base font-medium text-black">{camp.name}</p>
                      <p className="font-sans text-sm text-gray-500 mt-1">{camp.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-700">
                    {camp.dates}
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-700">
                    {camp.hours}
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-700">
                    {camp.ages}
                  </td>
                  <td className="px-6 py-5 font-sans text-sm text-gray-700">
                    {camp.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>

      {/* Junior Team Tennis */}
      <motion.section
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        aria-labelledby="jtt-heading"
      >
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="font-sans text-xs tracking-[3px] uppercase text-lbta-orange mb-4">
            USTA Competition
          </p>
          <h2 id="jtt-heading" className="font-serif text-3xl md:text-5xl font-light text-black mb-4">
            Junior Team Tennis
          </h2>
          <p className="font-sans text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            League play for competitive juniors. Practice included with all JTT programs.
          </p>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          role="list"
          aria-label="Junior Team Tennis seasons"
        >
          {data.jtt.map((season) => (
            <motion.article
              key={season.season}
              variants={fadeInUp}
              className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-lbta-orange/30 hover:shadow-lg transition-all duration-500"
              role="listitem"
            >
              <div className="bg-lbta-beige/50 px-6 py-4">
                <h3 className="font-serif text-xl md:text-2xl font-light text-black">
                  {season.season}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-4 h-4 text-lbta-orange flex-shrink-0" aria-hidden="true" />
                  <span className="font-sans text-sm">{season.dates}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-4 h-4 text-lbta-orange flex-shrink-0" aria-hidden="true" />
                  <span className="font-sans text-sm">{season.weeks} weeks</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Trophy className="w-4 h-4 text-lbta-orange flex-shrink-0" aria-hidden="true" />
                  <span className="font-sans text-sm">Matches: {season.matchDay}</span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="font-sans text-xs text-gray-500 mb-2">Divisions</p>
                  <div className="flex flex-wrap gap-2">
                    {season.divisions.map((division) => (
                      <span 
                        key={division}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {division}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="font-sans text-sm text-gray-600 pt-2">
                  {season.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>
    </div>
  )
}

