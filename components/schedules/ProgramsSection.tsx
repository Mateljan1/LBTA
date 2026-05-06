'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import SchedulesProgramCard from './ProgramCard'
import SchedulesProgramFinder, { type ProgramFilters } from './SchedulesProgramFinder'
import type { SeasonKey, SeasonDataForDisplay } from '@/lib/season-utils'
import { SEASON_KEYS, SEASON_LABELS } from '@/lib/season-utils'

interface ProgramsSectionProps {
  programsBySeason: Record<SeasonKey, Program[]>
  seasons: Record<SeasonKey, SeasonDataForDisplay>
  initialSeason: SeasonKey
  onRegister: (program: Program) => void
}

const DEFAULT_FILTERS: ProgramFilters = {
  playerType: 'all',
  level: 'all',
  day: 'all',
}
const STATUS_LABELS: Record<string, string> = {
  registration_open: 'Now enrolling',
  active: 'In progress',
  coming_soon: 'Coming soon',
}

const DAY_SHORTCUTS: Record<Exclude<ProgramFilters['day'], 'all'>, string> = {
  mon: 'mon',
  tue: 'tue',
  wed: 'wed',
  thu: 'thu',
  fri: 'fri',
  sat: 'sat',
  sun: 'sun',
}

type SectionKey = 'kids' | 'development' | 'adult' | 'openCourt'

const SECTION_ORDER: SectionKey[] = ['kids', 'development', 'adult', 'openCourt']

const SECTION_META: Record<SectionKey, { eyebrow: string; headline: string; subline: string; gridClass: string }> = {
  kids: {
    eyebrow: 'AGES 3-11',
    headline: 'Kids Programs',
    subline: 'First racquet to full court. Each stage matches the right ball, court size, and pace to where they are.',
    gridClass: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  },
  development: {
    eyebrow: 'AGES 9-17 \u00B7 LEVEL-BASED',
    headline: 'Junior Development',
    subline: 'Placement by level, not just age. From Competitive Green Dot through High Performance.',
    gridClass: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  },
  adult: {
    eyebrow: 'ALL LEVELS',
    headline: 'Adult Classes',
    subline: 'New to tennis through 4.0+. Group classes with clear progression, coached by Andrew and the team.',
    gridClass: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  },
  openCourt: {
    eyebrow: 'DROP-IN',
    headline: 'Open Court',
    subline: 'No season commitment. Show up, play, sweat.',
    gridClass: 'grid gap-4 sm:grid-cols-2',
  },
}

function assignSection(program: Program): SectionKey {
  const cat = program.category.toLowerCase()
  const name = program.program.toLowerCase()
  if (cat.includes('open court') || name.includes('liveball') || name.includes('cardio')) return 'openCourt'
  if (cat.includes('adult') || name.includes('new to tennis') || name.includes('beyond beginner')) return 'adult'
  if (cat.includes('development') || name.includes('high performance') || name.includes('player development') || name.includes('competitive green dot')) return 'development'
  return 'kids'
}

type PlayerType = Exclude<ProgramFilters['playerType'], 'all'>

const SECTION_TO_PLAYER_TYPE: Record<SectionKey, PlayerType> = {
  kids: 'junior',
  development: 'development',
  adult: 'adult',
  openCourt: 'openCourt',
}

function normalizePlayerType(program: Program): PlayerType {
  return SECTION_TO_PLAYER_TYPE[assignSection(program)]
}

function normalizeLevel(program: Program): Exclude<ProgramFilters['level'], 'all'> {
  const name = program.program.toLowerCase()
  const ages = program.ages.toLowerCase()
  if (name.includes('new to tennis') || name.includes('beginner')) return 'beginner'
  if (name.includes('beyond beginner')) return 'beginner'
  if (name.includes('intermediate') || ages.includes('ntrp 3.0') || ages.includes('ntrp 3.5')) return 'intermediate'
  if (name.includes('advanced') || ages.includes('utr 5+')) return 'advanced'
  if (name.includes('competitive')) return 'competitive'
  return 'beginner'
}

function matchesDay(program: Program, day: ProgramFilters['day']): boolean {
  if (day === 'all') return true
  const token = DAY_SHORTCUTS[day]
  return program.schedule.some((slot) => slot.day.toLowerCase().slice(0, 3) === token)
}

export default function ProgramsSection({
  programsBySeason,
  seasons,
  initialSeason,
  onRegister,
}: ProgramsSectionProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(() => initialSeason)
  const [filters, setFilters] = useState<ProgramFilters>(DEFAULT_FILTERS)
  const programs: Program[] = useMemo(
    () => programsBySeason[activeSeason] ?? programsBySeason.winter ?? [],
    [programsBySeason, activeSeason]
  )

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const playerType = normalizePlayerType(program)
      const level = normalizeLevel(program)
      const byType = filters.playerType === 'all' || playerType === filters.playerType
      const byLevel = filters.level === 'all' || level === filters.level
      const byDay = matchesDay(program, filters.day)
      return byType && byLevel && byDay
    })
  }, [programs, filters])

  const groupedPrograms = useMemo(() => {
    const groups: Record<SectionKey, Program[]> = { kids: [], development: [], adult: [], openCourt: [] }
    for (const program of filteredPrograms) {
      groups[assignSection(program)].push(program)
    }
    return groups
  }, [filteredPrograms])

  const seasonData = seasons[activeSeason]
  const seasonInfoLine = seasonData
    ? `${seasonData.name} \u00B7 ${seasonData.dates.replace(/, \d{4}/g, '')} \u00B7 ${seasonData.weeks} weeks`
    : ''

  const nowEnrolling = useMemo(() => {
    for (const key of SEASON_KEYS) {
      const data = seasons[key]
      if (data?.status === 'registration_open') {
        return { key, data }
      }
    }
    const fallback = seasons[activeSeason]
    return fallback ? { key: activeSeason, data: fallback } : null
  }, [seasons, activeSeason])
  const currentSeasonKey = nowEnrolling?.key ?? activeSeason

  const upNext = useMemo(() => {
    const startIndex = SEASON_KEYS.indexOf(activeSeason)
    const ordered = [
      ...SEASON_KEYS.slice(startIndex + 1),
      ...SEASON_KEYS.slice(0, startIndex),
    ]
    for (const key of ordered) {
      const data = seasons[key]
      if (!data) continue
      if (data.status === 'registration_open' || data.status === 'coming_soon') {
        const base = `${data.name} \u00B7 ${data.dates.replace(/, \d{4}/g, '')}`
        return data.registrationOpen
          ? `${base} \u00B7 Registration opens ${data.registrationOpen}`
          : base
      }
    }
    return null
  }, [seasons, activeSeason])

  const focusTab = (key: SeasonKey) => {
    setActiveSeason(key)
    setFilters(DEFAULT_FILTERS)
    setTimeout(() => document.getElementById(`season-tab-${key}`)?.focus(), 0)
  }

  const hasAnyResults = filteredPrograms.length > 0

  return (
    <section id="programs" className="scroll-mt-28 bg-white py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 min-w-0">

        {nowEnrolling && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-morning-light px-4 py-2 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-victoria-cove" aria-hidden />
            <span>
              {STATUS_LABELS[nowEnrolling.data.status ?? ''] ?? 'Season'}: {nowEnrolling.data.name}
            </span>
          </p>
        )}

        <div
          role="tablist"
          aria-label="Season"
          className="flex flex-wrap gap-2 mb-4"
        >
          {SEASON_KEYS.map((key, index) => {
            const isActive = activeSeason === key
            const isCurrent = currentSeasonKey === key
            return (
              <button
                key={key}
                role="tab"
                id={`season-tab-${key}`}
                aria-selected={isActive}
                aria-current={isCurrent ? 'true' : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={() => {
                  setActiveSeason(key)
                  setFilters(DEFAULT_FILTERS)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const prev = index - 1
                    focusTab(SEASON_KEYS[prev >= 0 ? prev : SEASON_KEYS.length - 1])
                  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault()
                    const next = index + 1
                    focusTab(SEASON_KEYS[next < SEASON_KEYS.length ? next : 0])
                  } else if (e.key === 'Home') {
                    e.preventDefault()
                    focusTab('winter')
                  } else if (e.key === 'End') {
                    e.preventDefault()
                    focusTab('fall')
                  }
                }}
                className={`
                  font-sans text-[13px] font-medium tracking-[0.05em] px-5 py-3 rounded-[2px]
                  transition-all duration-200 min-h-[48px] min-w-[96px] border
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2
                  ${isActive
                    ? 'bg-black text-white border-black shadow-sm'
                    : isCurrent
                      ? 'bg-brand-morning-light border-brand-victoria-cove text-brand-pacific-dusk'
                      : 'bg-brand-sandstone border-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'
                  }
                `}
              >
                <span className="block leading-tight">{SEASON_LABELS[key]}</span>
                {isCurrent ? (
                  <span className={`mt-1 block text-[10px] font-sans uppercase tracking-[0.16em] ${isActive ? 'text-white/80' : 'text-brand-victoria-cove'}`}>
                    Current
                  </span>
                ) : seasons[key]?.status && STATUS_LABELS[seasons[key]?.status ?? ''] ? (
                  <span className="mt-1 block font-sans text-eyebrow-sm uppercase text-brand-pacific-dusk/70">
                    {STATUS_LABELS[seasons[key]?.status ?? '']}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>

        {seasonInfoLine && (
          <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-2">
            {seasonInfoLine}
          </p>
        )}

        {upNext && (
          <p className="font-sans text-[12px] text-brand-pacific-dusk/65 mb-6">
            <span className="text-eyebrow-sm inline-flex items-center gap-1 rounded-full bg-brand-morning-light px-3 py-1 font-medium uppercase text-brand-pacific-dusk mr-2">
              Up Next
            </span>
            {upNext}
          </p>
        )}

        <SchedulesProgramFinder
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
          resultCount={filteredPrograms.length}
        />

        {hasAnyResults ? (
          <div className="mt-8 space-y-12">
            {SECTION_ORDER.map((sectionKey) => {
              const sectionPrograms = groupedPrograms[sectionKey]
              if (sectionPrograms.length === 0) return null
              const meta = SECTION_META[sectionKey]
              return (
                <div key={sectionKey}>
                  <div className="mb-6">
                    <p className="font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk/50 mb-2">
                      {meta.eyebrow}
                    </p>
                    <h3 className="font-headline text-[26px] md:text-[32px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
                      {meta.headline}
                    </h3>
                    <p className="font-sans text-[14px] md:text-[15px] text-brand-pacific-dusk/60 leading-relaxed max-w-2xl">
                      {meta.subline}
                    </p>
                  </div>
                  <div className={meta.gridClass}>
                    {sectionPrograms.map((program) => (
                      <SchedulesProgramCard
                        key={program.id}
                        program={program}
                        onRegister={onRegister}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-black/[0.08] bg-brand-morning-light px-5 py-8 text-center">
            <p className="font-headline text-[28px] text-brand-pacific-dusk md:text-[32px]">No programs match</p>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/70">
              Try a different season, reset your filters, or contact us and we will help you find the right fit.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-black/10 bg-white px-5 py-3 font-sans text-eyebrow font-medium uppercase text-brand-pacific-dusk transition-all duration-300 hover:border-brand-victoria-cove hover:bg-brand-sandstone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
              >
                Reset Filters
              </button>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-5 py-3 font-sans text-eyebrow font-medium uppercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
