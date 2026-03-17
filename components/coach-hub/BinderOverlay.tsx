'use client'

import { useEffect, useRef } from 'react'
import type { CoachHubInitialData } from '@/lib/coach-hub-types'
import type { CoachSchedule, CoachDaySchedule } from '@/lib/coach-hub-types'
import { getAssessMode } from '@/lib/coach-hub-utils'

type BinderOverlayProps = {
  initialData: CoachHubInitialData
  coach: string
  season: string
  week: number
  onClose: () => void
}

function getWeekDateRange(seasonStart: string, week: number): { start: Date; end: Date } {
  const start = new Date(seasonStart)
  start.setDate(start.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

export function BinderOverlay({ initialData, coach, season, week, onClose }: BinderOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const { hubData, seasons, coachSchedules } = initialData
  const sched = coach ? (coachSchedules[coach] as CoachSchedule | undefined) : null
  const ssn = seasons[season]
  const assess = getAssessMode(week, hubData.assessment_calendar)
  const { start: weekStart, end: weekEnd } = ssn?.start ? getWeekDateRange(ssn.start, week) : { start: new Date(), end: new Date() }
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const dayNames = sched ? Object.keys(sched) : []

  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    const el = dialogRef.current
    if (e.key !== 'Tab' || !el) return
    const focusables = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) => !node.hasAttribute('disabled'))
    if (focusables.length === 0) return
    const current = document.activeElement
    const idx = current instanceof HTMLElement ? focusables.indexOf(current) : -1
    if (idx === -1) return
    if (e.shiftKey) {
      if (idx === 0) {
        e.preventDefault()
        focusables[focusables.length - 1]?.focus()
      }
    } else {
      if (idx === focusables.length - 1) {
        e.preventDefault()
        focusables[0]?.focus()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Week Binder"
      onKeyDown={handleKeyDown}
    >
      <div ref={dialogRef} className="bg-brand-morning-light rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="font-headline text-brand-pacific-dusk text-xl">
              {coach || 'Select coach'} — Week {week} Binder
            </h2>
            <p className="font-sans text-sm text-brand-pacific-dusk/60 mt-0.5">
              {fmt(weekStart)}–{fmt(weekEnd)} · {assess.mode}
            </p>
            {assess.action && <p className="font-sans text-xs text-brand-pacific-dusk/70 mt-2 p-2 rounded bg-brand-sandstone/50">{assess.action}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 rounded border border-black/20 font-sans text-sm font-medium shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2"
            aria-label="Close Week Binder"
          >
            Close
          </button>
        </div>
        {!coach ? (
          <p className="font-sans text-sm text-brand-pacific-dusk/70">Select a coach in the header to generate your week binder.</p>
        ) : !sched ? (
          <p className="font-sans text-sm text-brand-pacific-dusk/70">No schedule found for this coach.</p>
        ) : (
          <div className="space-y-6">
            {dayNames.map((dayName) => {
              const sessions = (sched[dayName] as CoachDaySchedule) ?? []
              return (
                <div key={dayName} className="border-b border-black/10 pb-4 last:border-b-0">
                  <h3 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">{dayName}</h3>
                  <ul className="space-y-2">
                    {sessions.map((s, i) => (
                      <li key={i} className="font-sans text-sm text-brand-pacific-dusk/80">
                        <span className="font-medium">{s.time}</span> · {s.prog} · {s.dur}min · {s.loc} (Code {s.code})
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
