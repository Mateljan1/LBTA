'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Star, Info, Users, Clock, Calendar } from 'lucide-react'

interface Frequency {
  price: number
  perSession: number
  popular?: boolean
  savings?: number
}

interface ProgramPricing {
  label: string
  subtitle: string
  ages: string
  duration: string
  billing: string
  frequencies: Record<string, Frequency>
  dropIn: number
  includes: string[]
}

interface MonthlyProgram {
  label: string
  subtitle: string
  duration: string
  billing: string
  price: number
  dropIn: number
  levels?: string[]
  includes: string[]
}

interface Camp {
  label: string
  dates: string
  days: number | string
  hours: string
  price: number
  perDay: number
  halfDay?: number
  ages: string
  includes: string[]
}

interface JTTDivision {
  price: number
  practiceIncluded: boolean
}

interface JTTSeason {
  label: string
  dates: string
  divisions: Record<string, JTTDivision>
  includes: string[]
}

interface PricingData {
  seasonMultipliers: Record<string, number>
  seasonWeeks: Record<string, number>
  basePricing: Record<string, ProgramPricing>
  monthlyPrograms: Record<string, MonthlyProgram>
  camps: Record<string, Camp>
  jtt: Record<string, JTTSeason>
}

interface PricingTabsProps {
  data: PricingData
}

type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall'

const seasons: Season[] = ['Winter', 'Spring', 'Summer', 'Fall']

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

function calculateSeasonPrice(basePrice: number, multiplier: number): number {
  return Math.round(basePrice * multiplier)
}

export default function PricingTabs({ data }: PricingTabsProps) {
  const [activeSeason, setActiveSeason] = useState<Season>('Winter')
  const [activeCategory, setActiveCategory] = useState<'quarterly' | 'monthly' | 'camps' | 'jtt'>('quarterly')

  const multiplier = data.seasonMultipliers[activeSeason] || 1
  const weeks = data.seasonWeeks[activeSeason] || 13

  // Calculate adjusted prices for the selected season
  const adjustedPricing = useMemo(() => {
    const adjusted: Record<string, ProgramPricing> = {}
    
    Object.entries(data.basePricing).forEach(([key, program]) => {
      adjusted[key] = {
        ...program,
        frequencies: Object.entries(program.frequencies).reduce((acc, [freq, details]) => {
          acc[freq] = {
            ...details,
            price: calculateSeasonPrice(details.price, multiplier),
            perSession: Math.round(calculateSeasonPrice(details.price, multiplier) / (parseInt(freq.replace('x', '')) * weeks))
          }
          return acc
        }, {} as Record<string, Frequency>),
        dropIn: calculateSeasonPrice(program.dropIn, multiplier)
      }
    })
    
    return adjusted
  }, [data.basePricing, multiplier, weeks])

  const handleSeasonChange = useCallback((season: Season) => {
    setActiveSeason(season)
  }, [])

  return (
    <div className="space-y-12">
      {/* Season Tabs */}
      <div 
        role="tablist" 
        aria-label="Select season for pricing"
        className="flex flex-wrap justify-center gap-2 md:gap-4"
      >
        {seasons.map((season) => (
          <button
            key={season}
            role="tab"
            aria-selected={activeSeason === season}
            aria-controls={`${season.toLowerCase()}-pricing-panel`}
            id={`${season.toLowerCase()}-tab`}
            onClick={() => handleSeasonChange(season)}
            className={`
              relative px-6 md:px-10 py-3 md:py-4 font-sans text-sm md:text-base font-medium
              tracking-[1px] uppercase transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-lbta-orange focus:ring-offset-2
              ${activeSeason === season 
                ? 'bg-black text-white' 
                : 'bg-white text-black border border-gray-200 hover:border-black'
              }
            `}
          >
            {season} 2026
            {activeSeason === season && (
              <motion.div
                layoutId="activeSeasonIndicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-lbta-orange"
              />
            )}
          </button>
        ))}
      </div>

      {/* Season Info Banner */}
      <motion.div
        key={activeSeason}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lbta-beige/50 border border-lbta-orange/20 rounded-sm p-4 md:p-6 text-center"
      >
        <p className="font-sans text-sm md:text-base text-gray-700">
          <span className="font-medium text-black">{activeSeason} 2026</span>
          {' · '}
          {weeks} weeks
          {multiplier !== 1 && (
            <span className="text-gray-500 ml-2">
              (Prices adjusted {multiplier < 1 ? 'down' : 'up'} for {weeks}-week session)
            </span>
          )}
        </p>
      </motion.div>

      {/* Category Tabs */}
      <div 
        role="tablist"
        aria-label="Select pricing category"
        className="flex flex-wrap justify-center gap-2 border-b border-gray-200 pb-4"
      >
        {[
          { id: 'quarterly', label: 'Quarterly Programs' },
          { id: 'monthly', label: 'Monthly Programs' },
          { id: 'camps', label: 'Camps' },
          { id: 'jtt', label: 'JTT' }
        ].map((category) => (
          <button
            key={category.id}
            role="tab"
            aria-selected={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id as typeof activeCategory)}
            className={`
              px-4 md:px-6 py-2 font-sans text-sm font-medium transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-lbta-orange
              ${activeCategory === category.id
                ? 'text-lbta-orange border-b-2 border-lbta-orange -mb-[17px]'
                : 'text-gray-500 hover:text-black'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Pricing Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeSeason}-${activeCategory}`}
          role="tabpanel"
          id={`${activeSeason.toLowerCase()}-pricing-panel`}
          aria-labelledby={`${activeSeason.toLowerCase()}-tab`}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeInUp}
        >
          {activeCategory === 'quarterly' && (
            <QuarterlyPricing pricing={adjustedPricing} season={activeSeason} weeks={weeks} />
          )}
          {activeCategory === 'monthly' && (
            <MonthlyPricing programs={data.monthlyPrograms} />
          )}
          {activeCategory === 'camps' && (
            <CampsPricing camps={data.camps} />
          )}
          {activeCategory === 'jtt' && (
            <JTTPricing jtt={data.jtt} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pricing Notes */}
      <div className="bg-gray-50 border border-gray-100 rounded-sm p-6 md:p-8">
        <h3 className="font-serif text-lg md:text-xl font-light text-black mb-4">
          Pricing Notes
        </h3>
        <ul className="space-y-2 font-sans text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-lbta-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
            Prices are per season unless noted. Payment plans available for quarterly programs.
          </li>
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-lbta-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
            Early bird discount: Save $50 when registering before the deadline.
          </li>
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-lbta-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
            Sibling discount: 10% off second child enrollment.
          </li>
          <li className="flex items-start gap-2">
            <Info className="w-4 h-4 text-lbta-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
            Scholarships available for qualifying families. Contact us for details.
          </li>
        </ul>
      </div>
    </div>
  )
}

// Quarterly Programs Component
function QuarterlyPricing({ 
  pricing, 
  season, 
  weeks 
}: { 
  pricing: Record<string, ProgramPricing>
  season: Season
  weeks: number
}) {
  return (
    <div className="space-y-8">
      {/* Junior Programs */}
      <ProgramSection
        title="Junior Programs"
        subtitle="Ages 3-11 · Red Ball through Green Dot"
        programs={[pricing.junior]}
      />

      {/* Youth & Performance */}
      <ProgramSection
        title="Youth Development & High Performance"
        subtitle="Ages 11-18 · Competitive Training Track"
        programs={[pricing.youthDevelopment, pricing.highPerformance]}
      />

      {/* Adult Programs */}
      <ProgramSection
        title="Adult Programs"
        subtitle="All skill levels · Beginner to Advanced"
        programs={[pricing.adultBeginner, pricing.adultIntermediate, pricing.adultAdvanced]}
      />
    </div>
  )
}

function ProgramSection({ 
  title, 
  subtitle, 
  programs 
}: { 
  title: string
  subtitle: string
  programs: ProgramPricing[]
}) {
  return (
    <section aria-labelledby={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="mb-6">
        <h3 
          id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
          className="font-serif text-2xl md:text-3xl font-light text-black"
        >
          {title}
        </h3>
        <p className="font-sans text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.label} program={program} />
        ))}
      </div>
    </section>
  )
}

function ProgramCard({ program }: { program: ProgramPricing }) {
  const frequencies = Object.entries(program.frequencies)
  const popularFreq = frequencies.find(([, details]) => details.popular)

  return (
    <article className="bg-white border border-gray-100 rounded-sm overflow-hidden hover:border-lbta-orange/30 hover:shadow-lg transition-all duration-500">
      <div className="p-6">
        <div className="mb-4">
          <h4 className="font-serif text-xl font-light text-black">{program.label}</h4>
          <p className="font-sans text-sm text-gray-500">{program.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-lbta-orange" aria-hidden="true" />
            {program.ages}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-lbta-orange" aria-hidden="true" />
            {program.duration}
          </span>
        </div>

        {/* Frequency Options */}
        <div className="space-y-3 mb-6">
          {frequencies.map(([freq, details]) => (
            <div 
              key={freq}
              className={`
                relative p-4 rounded-sm border transition-all
                ${details.popular 
                  ? 'border-lbta-orange bg-lbta-orange/5' 
                  : 'border-gray-100 hover:border-gray-200'
                }
              `}
            >
              {details.popular && (
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 bg-lbta-orange text-white text-xs font-medium rounded">
                  Most Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-sm font-medium text-black">
                    {freq}/week
                  </span>
                  <span className="font-sans text-xs text-gray-500 ml-2">
                    ({formatPrice(details.perSession)}/session)
                  </span>
                </div>
                <span className="font-serif text-xl font-light text-black">
                  {formatPrice(details.price)}
                </span>
              </div>
              {details.savings && (
                <p className="font-sans text-xs text-green-600 mt-1">
                  Save {formatPrice(details.savings)} vs 1x/week
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Drop-in */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <span className="font-sans text-sm text-gray-600">Drop-in rate</span>
          <span className="font-sans text-sm font-medium text-black">{formatPrice(program.dropIn)}</span>
        </div>

        {/* Includes */}
        <div className="pt-4 border-t border-gray-100">
          <p className="font-sans text-xs text-gray-500 mb-2">Includes:</p>
          <ul className="space-y-1">
            {program.includes.map((item, index) => (
              <li key={index} className="flex items-center gap-2 font-sans text-xs text-gray-600">
                <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

// Monthly Programs Component
function MonthlyPricing({ programs }: { programs: Record<string, MonthlyProgram> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(programs).map(([key, program]) => (
        <article 
          key={key}
          className="bg-white border border-gray-100 rounded-sm p-6 hover:border-lbta-orange/30 hover:shadow-lg transition-all duration-500"
        >
          <h4 className="font-serif text-xl font-light text-black mb-1">{program.label}</h4>
          <p className="font-sans text-sm text-gray-500 mb-4">{program.subtitle}</p>

          <div className="flex items-baseline gap-1 mb-4">
            <span className="font-serif text-3xl font-light text-black">
              {formatPrice(program.price)}
            </span>
            <span className="font-sans text-sm text-gray-500">/month</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-lbta-orange" aria-hidden="true" />
              {program.duration}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="font-sans text-sm text-gray-600">Drop-in rate</span>
            <span className="font-sans text-sm font-medium text-black">{formatPrice(program.dropIn)}</span>
          </div>

          {program.levels && (
            <div className="pt-3 border-t border-gray-100">
              <p className="font-sans text-xs text-gray-500 mb-2">Levels:</p>
              <div className="flex flex-wrap gap-2">
                {program.levels.map((level) => (
                  <span 
                    key={level}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 mt-3">
            <ul className="space-y-1">
              {program.includes.map((item, index) => (
                <li key={index} className="flex items-center gap-2 font-sans text-xs text-gray-600">
                  <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

// Camps Pricing Component
function CampsPricing({ camps }: { camps: Record<string, Camp> }) {
  return (
    <div className="overflow-x-auto">
      <table 
        className="w-full min-w-[800px] bg-white border border-gray-100"
        role="table"
        aria-label="2026 Camp Pricing"
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
            <th scope="col" className="px-6 py-4 text-right font-sans text-xs tracking-[2px] uppercase font-medium">
              Full Price
            </th>
            <th scope="col" className="px-6 py-4 text-right font-sans text-xs tracking-[2px] uppercase font-medium">
              Per Day
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(camps).map(([key, camp], index) => (
            <tr 
              key={key}
              className={`border-t border-gray-100 hover:bg-lbta-beige/30 transition-colors ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="px-6 py-5">
                <div>
                  <p className="font-sans text-base font-medium text-black">{camp.label}</p>
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    {camp.includes.join(' · ')}
                  </p>
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
              <td className="px-6 py-5 text-right">
                <span className="font-serif text-lg font-light text-black">
                  {formatPrice(camp.price)}
                </span>
                {camp.halfDay && (
                  <p className="font-sans text-xs text-gray-500 mt-1">
                    Half-day: {formatPrice(camp.halfDay)}
                  </p>
                )}
              </td>
              <td className="px-6 py-5 text-right font-sans text-sm text-gray-600">
                {formatPrice(camp.perDay)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// JTT Pricing Component
function JTTPricing({ jtt }: { jtt: Record<string, JTTSeason> }) {
  return (
    <div className="space-y-8">
      {Object.entries(jtt).map(([key, season]) => (
        <article 
          key={key}
          className="bg-white border border-gray-100 rounded-sm overflow-hidden"
        >
          <div className="bg-lbta-beige/50 px-6 py-4 border-b border-gray-100">
            <h4 className="font-serif text-xl font-light text-black">{season.label}</h4>
            <p className="font-sans text-sm text-gray-600">{season.dates}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(season.divisions).map(([division, details]) => (
                <div 
                  key={division}
                  className="text-center p-4 bg-gray-50 rounded-sm"
                >
                  <p className="font-sans text-sm font-medium text-gray-500 mb-1">{division}</p>
                  <p className="font-serif text-2xl font-light text-black">
                    {formatPrice(details.price)}
                  </p>
                  {details.practiceIncluded && (
                    <p className="font-sans text-xs text-green-600 mt-1">Practice included</p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="font-sans text-xs text-gray-500 mb-2">Includes:</p>
              <ul className="grid grid-cols-2 gap-2">
                {season.includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 font-sans text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

