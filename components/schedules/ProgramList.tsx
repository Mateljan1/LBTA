'use client'

import { useMemo } from 'react'
import { Program } from '@/components/ProgramCard'
import ProgramRow from './ProgramRow'
import type { ExtendedSeasonKey as SeasonKey } from '@/lib/season-utils'

interface Season {
  name: string
  dates: string
  weeks: number
  status: string
  multiplier: number
  [key: string]: unknown
}

interface ProgramListProps {
  programs: Program[]
  seasons: Record<string, Season>
  selectedSeason: SeasonKey
  onSeasonChange: (season: SeasonKey) => void
  onRegister: (program: Program) => void
  seasonLabel: string
  seasonDates: string
  seasonWeeks: number
}

const CATEGORY_ORDER = ['Junior', 'Youth', 'Adult', 'Fitness']

function categoryAnchor(category: string) {
  return `cat-${category.toLowerCase().replace(/\s+/g, '-')}`
}

export default function ProgramList({
  programs,
  seasons,
  selectedSeason,
  onSeasonChange,
  onRegister,
  seasonLabel,
  seasonDates,
  seasonWeeks,
}: ProgramListProps) {
  const groupedPrograms = useMemo(() => {
    const groups: Record<string, Program[]> = {}
    programs.forEach(program => {
      if (!groups[program.category]) groups[program.category] = []
      groups[program.category].push(program)
    })

    const sorted: [string, Program[]][] = []
    for (const cat of CATEGORY_ORDER) {
      if (groups[cat]) sorted.push([cat, groups[cat]])
    }
    for (const [cat, progs] of Object.entries(groups)) {
      if (!CATEGORY_ORDER.includes(cat)) sorted.push([cat, progs])
    }
    return sorted
  }, [programs])

  return (
    <section id="programs" className="bg-brand-morning-light py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* Season Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {Object.entries(seasons).map(([key, season]) => (
            <button
              key={key}
              onClick={() => onSeasonChange(key as SeasonKey)}
              aria-label={`${season.name.split(' ')[0]}${season.status === 'registration_open' ? ', registration open' : ''}`}
              aria-pressed={selectedSeason === key}
              className={`px-5 py-2.5 min-h-[48px] rounded-full font-sans text-[13px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                selectedSeason === key
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-black/70 hover:bg-gray-50 border border-black/10'
              }`}
            >
              {season.name.split(' ')[0]}
              {season.status === 'registration_open' && (
                <span aria-hidden="true" className="ml-1.5 w-1.5 h-1.5 bg-brand-tide-pool rounded-full inline-block align-middle" />
              )}
            </button>
          ))}
          <button
            onClick={() => onSeasonChange('fall2025')}
            aria-label="Fall 2025"
            aria-pressed={selectedSeason === 'fall2025'}
            className={`px-5 py-2.5 min-h-[48px] rounded-full font-sans text-[13px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
              selectedSeason === 'fall2025'
                ? 'bg-black text-white shadow-md'
                : 'bg-white text-black/70 hover:bg-gray-50 border border-black/10'
            }`}
          >
            Fall 2025
          </button>
        </div>

        {/* Season Meta */}
        <p className="text-center font-sans text-[13px] text-brand-pacific-dusk/60 mb-6">
          {seasonLabel} · {seasonDates} · {seasonWeeks} weeks
        </p>

        {/* Category Jump Links */}
        {groupedPrograms.length > 1 && (
          <nav
            aria-label="Jump to program category"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8"
          >
            <span className="font-sans text-[11px] text-brand-pacific-dusk/40 uppercase tracking-[2px]">
              Jump to
            </span>
            {groupedPrograms.map(([category]) => (
              <a
                key={category}
                href={`#${categoryAnchor(category)}`}
                className="font-sans text-[13px] text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk transition-colors underline-offset-4 hover:underline"
              >
                {category}
              </a>
            ))}
          </nav>
        )}

        {/* Program Count */}
        <p className="text-center font-sans text-[14px] text-brand-pacific-dusk/60 mb-10">
          {programs.length} program{programs.length !== 1 ? 's' : ''} this season
        </p>

        {/* Category Groups */}
        <div className="space-y-12">
          {groupedPrograms.map(([category, categoryPrograms]) => (
            <div key={category} id={categoryAnchor(category)}>
              <div className="flex items-baseline justify-between mb-4 px-1">
                <h2 className="font-serif text-[24px] md:text-[32px] font-semibold text-brand-pacific-dusk">
                  {category}
                </h2>
                <span className="font-sans text-[13px] text-brand-pacific-dusk/40">
                  {categoryPrograms.length} program{categoryPrograms.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="bg-white rounded-lg border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02),0_4px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                {categoryPrograms.map((program, index) => (
                  <ProgramRow
                    key={program.id}
                    program={program}
                    onRegister={onRegister}
                    isLast={index === categoryPrograms.length - 1}
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
