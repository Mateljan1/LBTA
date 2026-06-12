'use client'

import { useState } from 'react'
import type {
  CoachTodayData,
  SessionBlock,
  DrillBlock,
} from '@/lib/coach-today-types'

interface Props {
  data: CoachTodayData
}

/**
 * Data-driven Today view — visually mirrors the Allison/Peter HTML files but
 * renders from JSON. Same theme card, rule card, sessions with progress + drills.
 *
 * State: drill check-offs are local React state (per session). Refreshing the
 * page resets them — acceptable for today; localStorage persistence is a Phase 2 follow-up.
 */
export default function CoachDataView({ data }: Props) {
  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-5 py-6 pb-24">
      <Hero data={data} />
      {data.theme && data.theme.title ? <ThemeCard theme={data.theme} /> : null}
      {data.rule && data.rule.title ? <RuleCard rule={data.rule} /> : null}
      {data.sessions.map((s, i) => (
        <SessionCard key={`${s.title}-${i}`} session={s} />
      ))}
      {data.notes ? <NotesCard notes={data.notes} /> : null}
    </div>
  )
}

function Hero({ data }: { data: CoachTodayData }) {
  return (
    <section className="pt-6 pb-7 mb-6 border-b border-black/8">
      {data.eyebrow ? (
        <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
          {data.eyebrow}
        </p>
      ) : null}
      <h1 className="font-headline font-light text-brand-deep-water leading-[1.05] tracking-[-0.02em] text-[clamp(34px,8vw,48px)] mb-4">
        {data.title}
      </h1>
      <div className="flex flex-wrap gap-4 text-sm text-brand-pacific-dusk">
        {data.location ? (
          <span>
            <strong className="font-semibold">Location:</strong> {data.location}
          </span>
        ) : null}
        {data.metaNote ? (
          <span className="text-brand-pacific-dusk/70">{data.metaNote}</span>
        ) : null}
      </div>
    </section>
  )
}

function ThemeCard({
  theme,
}: {
  theme: NonNullable<CoachTodayData['theme']>
}) {
  return (
    <section className="bg-brand-sandstone rounded-[14px] p-5 mb-4 flex items-start gap-4">
      {theme.num ? (
        <div className="font-headline font-light text-[38px] leading-none text-brand-thousand-steps tracking-[-0.02em] flex-shrink-0">
          {theme.num}
        </div>
      ) : null}
      <div className="min-w-0">
        {theme.label ? (
          <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mb-1">
            {theme.label}
          </p>
        ) : null}
        <h2 className="font-headline font-normal text-[22px] leading-tight text-brand-deep-water tracking-[-0.01em] mb-1.5">
          {theme.title}
        </h2>
        {theme.body ? (
          <p className="text-sm text-brand-pacific-dusk">{theme.body}</p>
        ) : null}
      </div>
    </section>
  )
}

function RuleCard({ rule }: { rule: NonNullable<CoachTodayData['rule']> }) {
  return (
    <section className="bg-brand-deep-water text-white rounded-[14px] p-5 mb-7">
      {rule.label ? (
        <p className="font-sans text-eyebrow-sm text-white/55 mb-1">
          {rule.label}
        </p>
      ) : null}
      <h3 className="font-headline font-normal text-[22px] leading-tight tracking-[-0.01em] mb-2.5">
        {rule.title}
      </h3>
      {rule.body ? (
        <p className="text-[13px] text-white/85 leading-[1.5] mb-3">{rule.body}</p>
      ) : null}
      {rule.tiles && rule.tiles.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-1.5 mt-2">
          {rule.tiles.map((tile, i) => (
            <div
              key={`${tile.label}-${i}`}
              className="bg-white/8 rounded-md px-1.5 py-2 text-center"
            >
              <strong className="block text-sm text-white font-semibold mb-0.5 tabular-nums">
                {tile.value}
              </strong>
              <span className="text-[11px] text-white/70">{tile.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}

function SessionCard({ session }: { session: SessionBlock }) {
  const [doneIndices, setDoneIndices] = useState<Set<number>>(new Set())
  const total = session.drills.length
  const done = doneIndices.size
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  function toggle(i: number) {
    setDoneIndices((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <section className="bg-white rounded-[14px] mb-7 shadow-[0_1px_0_rgba(27,58,92,0.04),0_8px_24px_-8px_rgba(27,58,92,0.10)] overflow-hidden">
      <div className="px-5 sm:px-6 pt-6 pb-4 border-b border-black/8">
        <div className="flex justify-between items-start gap-3 mb-2.5">
          {session.time ? (
            <span className="font-semibold text-[13px] tracking-wide text-brand-victoria-cove px-2.5 py-1 bg-brand-victoria-cove/10 rounded-md tabular-nums whitespace-nowrap">
              {session.time}
            </span>
          ) : (
            <span />
          )}
          {session.durationMin ? (
            <span className="text-xs text-brand-pacific-dusk/60 font-medium tabular-nums">
              {session.durationMin} min
            </span>
          ) : null}
        </div>
        <h2 className="font-headline font-light text-[32px] leading-[1.1] tracking-[-0.02em] text-brand-deep-water mb-1.5">
          {session.title}
        </h2>
        {session.subtitle ? (
          <p className="text-sm text-brand-pacific-dusk">{session.subtitle}</p>
        ) : null}
        {session.ageCue ? (
          <span className="mt-2.5 inline-block px-2.5 py-1 bg-brand-sandstone rounded-md font-sans text-eyebrow-sm text-brand-pacific-dusk">
            {session.ageCue}
          </span>
        ) : null}
      </div>
      <div className="px-5 sm:px-6 py-3.5 bg-brand-morning-light border-b border-black/8 flex items-center gap-3.5">
        <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-tide-pool transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-brand-pacific-dusk/60 tabular-nums whitespace-nowrap">
          {done} / {total}
        </span>
      </div>
      <div>
        {session.drills.map((d, i) => (
          <DrillRow
            key={`${d.name}-${i}`}
            drill={d}
            done={doneIndices.has(i)}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  )
}

function DrillRow({
  drill,
  done,
  onToggle,
}: {
  drill: DrillBlock
  done: boolean
  onToggle: () => void
}) {
  const [open, setOpen] = useState(false)
  const hasDetails = Boolean(drill.details)

  return (
    <div
      className={`px-5 sm:px-6 py-4 border-b border-black/8 last:border-b-0 transition-colors ${
        done ? 'bg-brand-tide-pool/[0.04]' : ''
      }`}
    >
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={done}
          aria-label={done ? `Mark ${drill.name} not done` : `Mark ${drill.name} done`}
          className={`flex-shrink-0 w-7 h-7 rounded-full border-[1.5px] transition-colors mt-0.5 flex items-center justify-center ${
            done
              ? 'bg-brand-tide-pool border-brand-tide-pool'
              : 'bg-white border-brand-pacific-dusk/30'
          }`}
        >
          {done ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : null}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2.5 items-baseline mb-1 flex-wrap">
            {drill.time ? (
              <span className="text-[11px] font-semibold text-brand-victoria-cove tabular-nums tracking-wide">
                {drill.time}
              </span>
            ) : null}
            {drill.min ? (
              <span className="text-[11px] text-brand-pacific-dusk/60 font-medium">
                {drill.min} min
              </span>
            ) : null}
          </div>
          <p
            className={`font-semibold text-base leading-tight mb-1.5 ${
              done
                ? 'text-brand-pacific-dusk/60 line-through decoration-1'
                : 'text-brand-deep-water'
            }`}
          >
            {drill.name}
          </p>
          {drill.cue ? (
            <p className="font-headline italic text-[17px] leading-[1.35] text-brand-pacific-dusk tracking-[-0.005em] pl-3 border-l-2 border-brand-thousand-steps mb-1.5">
              {drill.cue}
            </p>
          ) : null}
          {drill.why ? (
            <p className="text-[13px] text-brand-pacific-dusk/60 font-medium">
              {drill.why}
            </p>
          ) : null}
          {hasDetails ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-2 text-xs text-brand-victoria-cove font-semibold tracking-wide uppercase hover:text-brand-pacific-dusk transition-colors"
            >
              {open ? 'Hide details' : 'Show details'}
            </button>
          ) : null}
          {hasDetails && open ? (
            <div className="mt-3 px-4 py-3.5 bg-brand-sandstone rounded-md text-sm leading-[1.55] whitespace-pre-line">
              {drill.details}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function NotesCard({ notes }: { notes: string }) {
  return (
    <section className="bg-white rounded-[14px] p-5 mb-4 shadow-[0_1px_0_rgba(27,58,92,0.04)]">
      <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/60 mb-2">
        Notes
      </p>
      <p className="text-sm text-brand-pacific-dusk leading-[1.55] whitespace-pre-line">
        {notes}
      </p>
    </section>
  )
}
