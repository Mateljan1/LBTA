'use client'

import { useState, useMemo } from 'react'
import type { Program } from '@/components/ProgramCard'
import ProgramRow from './ProgramRow'
import { getCurrentSeason, getAllSeasons, type SeasonKey } from '@/lib/season-utils'
import winter2026Data from '@/data/winter2026.json'
import fall2025Data from '@/data/fall2025.json'
import { getSpringProgramsForDisplay, getSummerProgramsForDisplay } from '@/lib/programs-data'

interface ProgramsSectionProps {
  onRegister: (program: Program) => void
}

const SEASON_KEYS: SeasonKey[] = ['winter', 'spring', 'summer', 'fall']
const SEASON_LABELS: Record<SeasonKey, string> = {
  winter: 'Winter',
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
}

const CATEGORY_ORDER = ['Junior', 'Youth', 'Adult', 'Fitness']
const CATEGORY_EYEBROWS: Record<string, string> = {
  Junior: 'AGES 3–11',
  Youth: 'AGES 11–18',
  Adult: 'ADULT PROGRAMS',
  Fitness: 'FITNESS & COMMUNITY',
}

export default function ProgramsSection({ onRegister }: ProgramsSectionProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(() => getCurrentSeason())
  const seasons = useMemo(() => getAllSeasons(), [])

  const programs: Program[] = useMemo(() => {
    switch (activeSeason) {
      case 'winter':
        return winter2026Data.programs as Program[]
      case 'spring':
        return getSpringProgramsForDisplay() as Program[]
      case 'summer':
        return getSummerProgramsForDisplay() as Program[]
      case 'fall':
        return fall2025Data.programs as Program[]
      default:
        return winter2026Data.programs as Program[]
    }
  }, [activeSeason])

  const grouped = useMemo(() => {
    const map: Record<string, Program[]> = {}
    for (const p of programs) {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    }
    return CATEGORY_ORDER
      .filter((cat) => map[cat]?.length)
      .map((cat) => ({ category: cat, programs: map[cat] }))
  }, [programs])

  const seasonData = seasons[activeSeason]
  const seasonInfoLine = seasonData
    ? `${seasonData.name} · ${seasonData.dates.replace(/, \d{4}/g, '')} · ${seasonData.weeks} weeks`
    : ''

  return (
    <section id="programs" className="bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Section heading */}
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/40 uppercase tracking-[0.2em] mb-3">
          SEASONAL PROGRAMS
        </p>
        <h2 className="font-serif text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-8">
          Programs & Schedule
        </h2>

        {/* Season pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {SEASON_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveSeason(key)}
              className={`
                font-sans text-[13px] font-medium tracking-[0.05em] px-5 py-2 rounded-[2px]
                transition-all duration-200 min-h-[40px]
                focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2
                ${activeSeason === key
                  ? 'bg-black text-white'
                  : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'
                }
              `}
              aria-pressed={activeSeason === key}
            >
              {SEASON_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Season info line */}
        {seasonInfoLine && (
          <p className="font-sans text-[13px] text-brand-pacific-dusk/50 mb-10">
            {seasonInfoLine}
          </p>
        )}

        {/* Grouped programs */}
        <div className="space-y-12">
          {grouped.map(({ category, programs: catPrograms }) => (
            <div key={category}>
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/40 uppercase tracking-[0.2em] mb-2">
                {CATEGORY_EYEBROWS[category] || category.toUpperCase()}
              </p>
              <h3 className="font-serif text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk mb-4">
                {category === 'Youth' ? 'Youth & High Performance' : `${category} Programs`}
              </h3>

              <div className="bg-white border border-black/[0.06] rounded-lg overflow-hidden">
                {catPrograms.map((program, i) => (
                  <ProgramRow
                    key={program.id}
                    program={program}
                    onRegister={onRegister}
                    isLast={i === catPrograms.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
