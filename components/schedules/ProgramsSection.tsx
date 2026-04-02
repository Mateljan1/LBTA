'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import ProgramCard, { type Program } from '@/components/ProgramCard'
import ProgramRow from './ProgramRow'
import type { SeasonKey, SeasonDataForDisplay } from '@/lib/season-utils'
import { SEASON_KEYS, SEASON_LABELS } from '@/lib/season-utils'

type ViewMode = 'list' | 'cards'

interface ProgramsSectionProps {
  programsBySeason: Record<SeasonKey, Program[]>
  seasons: Record<SeasonKey, SeasonDataForDisplay>
  initialSeason: SeasonKey
  onRegister: (program: Program) => void
}

const CATEGORY_ORDER = ['Junior', 'Youth', 'Adult', 'Fitness']
const CATEGORY_EYEBROWS: Record<string, string> = {
  Junior: 'AGES 3–11',
  Youth: 'AGES 11–18',
  Adult: 'ADULT PROGRAMS',
  Fitness: 'FITNESS & COMMUNITY',
}

const STATUS_LABELS: Record<string, string> = {
  registration_open: 'Now enrolling',
  active: 'In progress',
  coming_soon: 'Coming soon',
}

export default function ProgramsSection({
  programsBySeason,
  seasons,
  initialSeason,
  onRegister,
}: ProgramsSectionProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(() => initialSeason)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null)
  const programs: Program[] = useMemo(
    () => programsBySeason[activeSeason] ?? programsBySeason.winter ?? [],
    [programsBySeason, activeSeason]
  )

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

  const focusTab = useCallback((key: SeasonKey) => {
    setActiveSeason(key)
    setExpandedProgramId(null)
    setTimeout(() => document.getElementById(`season-tab-${key}`)?.focus(), 0)
  }, [])

  const handleExpandChange = useCallback((programId: string) => {
    setExpandedProgramId((prev) => (prev === programId ? null : programId))
  }, [])

  return (
    <section id="programs" className="scroll-mt-32 bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 min-w-0">
        {/* Section heading */}
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
          SEASONAL PROGRAMS
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
          Programs & Schedule
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

        {/* Season pills — tablist for keyboard nav */}
        <div
          role="tablist"
          aria-label="Season"
          className="flex flex-wrap gap-2 mb-4"
        >
          {SEASON_KEYS.map((key, index) => (
            <button
              key={key}
              role="tab"
              id={`season-tab-${key}`}
              aria-selected={activeSeason === key}
              aria-current={activeSeason === key ? 'true' : undefined}
              tabIndex={activeSeason === key ? 0 : -1}
              onClick={() => setActiveSeason(key)}
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
                transition-all duration-200 min-h-[48px] min-w-[96px]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2
                ${activeSeason === key
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'
                }
              `}
            >
              <span className="block leading-tight">{SEASON_LABELS[key]}</span>
              {seasons[key]?.status && STATUS_LABELS[seasons[key]?.status ?? ''] && (
                <span className="mt-1 block text-[10px] font-sans uppercase tracking-[0.16em] text-brand-pacific-dusk/70">
                  {STATUS_LABELS[seasons[key]?.status ?? '']}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Season info line */}
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

        {/* View: List | Cards (single-expand in card view) */}
        <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label="View">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'list'}
            tabIndex={viewMode === 'list' ? 0 : -1}
            onClick={() => { setViewMode('list'); setExpandedProgramId(null) }}
            className={`font-sans text-[13px] font-medium tracking-[0.05em] px-4 py-2.5 rounded-[2px] min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'}`}
          >
            List
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'cards'}
            tabIndex={viewMode === 'cards' ? 0 : -1}
            onClick={() => setViewMode('cards')}
            className={`font-sans text-[13px] font-medium tracking-[0.05em] px-4 py-2.5 rounded-[2px] min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 ${viewMode === 'cards' ? 'bg-black text-white' : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'}`}
          >
            Cards
          </button>
        </div>

        {/* How registration works — updated to clarify city payment + LBTA app */}
        <div className="mb-10 rounded-lg border border-black/[0.08] bg-brand-morning-light/60 px-4 py-4 md:px-5 md:py-4">
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-2">
            How registration works
          </p>
          <div className="font-sans text-[14px] text-brand-pacific-dusk/85 space-y-1.5">
            <p>
              LBTA programs run on City of Laguna Beach public courts, so all registration and payment goes through the
              city&apos;s recreation department. This covers your liability and insurance on court.
            </p>
            <p className="mt-2">
              When you click &quot;Register&quot; on any program, you&apos;ll have two options:
            </p>
            <ul className="space-y-1.5 list-none pl-0">
              <li>
                <strong className="text-brand-pacific-dusk font-medium">Register &amp; pay now —</strong>{' '}
                go directly to the city&apos;s website to complete payment. Takes about 2 minutes.
              </li>
              <li>
                <strong className="text-brand-pacific-dusk font-medium">Have us help —</strong>{' '}
                fill out a quick form and someone from our team will reach out within 24 hours to walk you through it
                and send you a direct payment link.
              </li>
            </ul>
            <p className="mt-2">
              Once registered, download the LBTA app (iOS / Android) to manage your schedule — class confirmations,
              cancellations, makeups, and coach messages all happen there.
            </p>
            <p className="mt-2">
              <strong className="text-brand-pacific-dusk font-medium">Day selection:</strong>{' '}
              When you register, you choose how many days per week (1x, 2x, or 3x). We then confirm your preferred
              day(s) and coach assignment.
            </p>
            <p>
              <strong className="text-brand-pacific-dusk font-medium">Drop-in:</strong>{' '}
              Pay per session with no commitment. Ideal for trying a program or filling in when you can&apos;t commit
              to the full season.
            </p>
            <p>
              <strong className="text-brand-pacific-dusk font-medium">Missed sessions &amp; make-ups:</strong>{' '}
              We accommodate switches or make-ups when possible. Contact us or use the LBTA app to arrange.
            </p>
            <p>
              <strong className="text-brand-pacific-dusk font-medium">Cancellation:</strong>{' '}
              Program refunds available up to 48 hours before the session start date. Full policy on our{' '}
              <a
                href="/terms"
                className="text-brand-victoria-cove underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-1 rounded"
              >
                Terms
              </a>{' '}
              page.
            </p>
          </div>
        </div>

        {/* Grouped programs */}
        <div className="space-y-12">
          {grouped.map(({ category, programs: catPrograms }) => (
            <div
              key={category}
              id={category === 'Fitness' ? 'fitness' : undefined}
              className={category === 'Fitness' ? 'scroll-mt-28 md:scroll-mt-32' : undefined}
            >
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-2">
                {CATEGORY_EYEBROWS[category] || category.toUpperCase()}
              </p>
              <h3 className="font-headline text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk mb-2">
                {category === 'Youth' ? 'Youth & High Performance' : `${category} Programs`}
              </h3>
              <div className="section-horizon mb-4 opacity-90" aria-hidden="true" />

              {viewMode === 'list' ? (
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
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catPrograms.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onRegister={onRegister}
                      isExpanded={expandedProgramId === program.id}
                      onToggle={() => handleExpandChange(program.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
