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
    <section id="programs" className="bg-brand-morning-light py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* Season Pills + Meta — compact header */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {Object.entries(seasons).map(([key, season]) => (
            <button
              key={key}
              onClick={() => onSeasonChange(key as SeasonKey)}
              aria-label={`${season.name.split(' ')[0]}${season.status === 'registration_open' ? ', registration open' : ''}`}
              aria-pressed={selectedSeason === key}
              className={`px-4 py-2 min-h-[44px] rounded-full font-sans text-[12px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
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
            className={`px-4 py-2 min-h-[44px] rounded-full font-sans text-[12px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
              selectedSeason === 'fall2025'
                ? 'bg-black text-white shadow-md'
                : 'bg-white text-black/70 hover:bg-gray-50 border border-black/10'
            }`}
          >
            Fall 2025
          </button>
        </div>

        {/* Season meta + jump links on one line */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-6 text-center">
          <span className="font-sans text-[12px] text-brand-pacific-dusk/50">
            {seasonLabel} · {seasonDates} · {seasonWeeks} weeks · {programs.length} programs
          </span>
          {groupedPrograms.length > 1 && (
            <nav aria-label="Jump to program category" className="flex items-center gap-3">
              <span className="font-sans text-[10px] text-brand-pacific-dusk/30 uppercase tracking-[1.5px]">Jump to</span>
              {groupedPrograms.map(([category]) => (
                <a
                  key={category}
                  href={`#${categoryAnchor(category)}`}
                  className="font-sans text-[12px] text-brand-pacific-dusk/60 hover:text-brand-pacific-dusk transition-colors underline-offset-4 hover:underline"
                >
                  {category}
                </a>
              ))}
            </nav>
          )}
        </div>

        {/* Category Groups */}
        <div className="space-y-8">
          {groupedPrograms.map(([category, categoryPrograms]) => (
            <div key={category} id={categoryAnchor(category)}>
              <div className="flex items-baseline justify-between mb-2 px-1">
                <h2 className="font-serif text-[20px] md:text-[24px] font-semibold text-brand-pacific-dusk">
                  {category}
                </h2>
                <span className="font-sans text-[12px] text-brand-pacific-dusk/40">
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
