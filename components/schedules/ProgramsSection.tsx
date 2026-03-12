'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import type { Program } from '@/components/ProgramCard'
import ProgramRow from './ProgramRow'
import type { SeasonKey, SeasonDataForDisplay } from '@/lib/season-utils'

interface ProgramsSectionProps {
  programsBySeason: Record<SeasonKey, Program[]>
  seasons: Record<SeasonKey, SeasonDataForDisplay>
  initialSeason: SeasonKey
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

export default function ProgramsSection({
  programsBySeason,
  seasons,
  initialSeason,
  onRegister,
}: ProgramsSectionProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(() => initialSeason)
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

  const focusTab = useCallback((key: SeasonKey) => {
    setActiveSeason(key)
    setTimeout(() => document.getElementById(`season-tab-${key}`)?.focus(), 0)
  }, [])

  return (
    <section id="programs" className="scroll-mt-28 bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Section heading */}
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
          SEASONAL PROGRAMS
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
          Programs & Schedule
        </h2>
        <div className="section-horizon mb-8 opacity-90" aria-hidden="true" />

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
                transition-all duration-200 min-h-[48px] min-w-[88px]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2
                ${activeSeason === key
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-brand-sandstone text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk hover:bg-brand-sandstone/80'
                }
              `}
            >
              {SEASON_LABELS[key]}
            </button>
          ))}
        </div>

        {/* Season info line */}
        {seasonInfoLine && (
          <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mb-6">
            {seasonInfoLine}
          </p>
        )}

        {/* How registration works — clarity on days, drop-in, make-ups, cancellation */}
        <div className="mb-10 rounded-lg border border-black/[0.08] bg-brand-morning-light/60 px-4 py-4 md:px-5 md:py-4">
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/70 uppercase tracking-[0.15em] mb-2">
            How registration works
          </p>
          <ul className="font-sans text-[14px] text-brand-pacific-dusk/85 space-y-1.5 list-none">
            <li><strong className="text-brand-pacific-dusk font-medium">Day selection:</strong> When you register, you choose how many days per week (1x, 2x, or 3x). We then confirm your preferred day(s) and coach assignment.</li>
            <li><strong className="text-brand-pacific-dusk font-medium">Drop-in:</strong> Pay per session with no commitment. Ideal for trying a program or filling in when you can’t commit to the full season.</li>
            <li><strong className="text-brand-pacific-dusk font-medium">Missed sessions &amp; make-ups:</strong> We accommodate switches or make-ups when possible. Contact us to arrange.</li>
            <li><strong className="text-brand-pacific-dusk font-medium">Cancellation:</strong> Program refunds available up to 48 hours before the session start date. Full policy on our <a href="/terms" className="text-brand-victoria-cove underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-1 rounded">Terms</a> page.</li>
          </ul>
          <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-3 pt-3 border-t border-black/[0.06]">
            Coaches are assigned by program. <Link href="/coaches" className="text-brand-victoria-cove font-medium underline underline-offset-2 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-1 rounded">Meet our team</Link>
          </p>
        </div>

        {/* Grouped programs */}
        <div className="space-y-12">
          {grouped.map(({ category, programs: catPrograms }) => (
            <div key={category}>
              <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-2">
                {CATEGORY_EYEBROWS[category] || category.toUpperCase()}
              </p>
              <h3 className="font-headline text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk mb-2">
                {category === 'Youth' ? 'Youth & High Performance' : `${category} Programs`}
              </h3>
              <div className="section-horizon mb-4 opacity-90" aria-hidden="true" />

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
