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

function normalizePlayerType(program: Program): Exclude<ProgramFilters['playerType'], 'all'> {
  const category = program.category.toLowerCase()
  const name = program.program.toLowerCase()
  if (category.includes('fitness') || name.includes('liveball') || name.includes('cardio')) return 'fitness'
  if (category.includes('adult') || name.includes('adult')) return 'adult'
  if (category.includes('youth') || name.includes('high performance') || name.includes('utr')) return 'youth'
  return 'junior'
}

function normalizeLevel(program: Program): Exclude<ProgramFilters['level'], 'all'> {
  const haystack = `${program.program} ${program.description} ${program.ages}`.toLowerCase()
  if (haystack.includes('true beginner') || haystack.includes('beginner')) return 'beginner'
  if (haystack.includes('intermediate') || haystack.includes('ntrp 3.0') || haystack.includes('ntrp 3.5')) return 'intermediate'
  if (haystack.includes('advanced') || haystack.includes('utr 5+')) return 'advanced'
  if (haystack.includes('competitive') || haystack.includes('match play') || haystack.includes('utr')) return 'competitive'
  return 'intermediate'
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

  const seasonData = seasons[activeSeason]
  const seasonInfoLine = seasonData
    ? `${seasonData.name} · ${seasonData.dates.replace(/, \d{4}/g, '')} · ${seasonData.weeks} weeks`
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
        const base = `${data.name} · ${data.dates.replace(/, \d{4}/g, '')}`
        return data.registrationOpen
          ? `${base} · Registration opens ${data.registrationOpen}`
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

  return (
    <section id="programs" className="scroll-mt-32 bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 min-w-0">
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
          SEASONAL PROGRAMS
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
          Find Your Program Faster
        </h2>
        <div className="section-horizon mb-8 opacity-90" aria-hidden="true" />

        {nowEnrolling && (
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-morning-light px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-brand-pacific-dusk">
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
                  <span className="mt-1 block text-[10px] font-sans uppercase tracking-[0.16em] text-brand-pacific-dusk/70">
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
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-morning-light px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-brand-pacific-dusk mr-2">
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

        {filteredPrograms.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <SchedulesProgramCard
                key={program.id}
                program={program}
                onRegister={onRegister}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-black/[0.08] bg-brand-morning-light px-5 py-8 text-center">
            <p className="font-headline text-[30px] text-brand-pacific-dusk md:text-[34px]">No exact match yet</p>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/70">
              Reset filters or contact us and we will recommend the best fit for your player.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] border border-black/10 bg-white px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.1px] text-brand-pacific-dusk transition-all duration-300 hover:border-brand-victoria-cove hover:bg-brand-sandstone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
              >
                Reset Filters
              </button>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.1px] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
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
