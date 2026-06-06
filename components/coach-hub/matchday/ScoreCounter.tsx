'use client'

import { useMemo } from 'react'
import {
  evaluateWinner,
  formatScore,
  parseScore,
  type ScoringFormat,
  type SetScore,
} from '@/lib/matchday-config'

interface Props {
  format: ScoringFormat
  aName: string
  bName: string
  /** Stored score string, e.g. "4-2, 3-4". */
  value: string
  onScore: (score: string) => void
  /** Called with 'a' | 'b' | null whenever the counter resolves a winner. */
  onWinner: (winner: 'a' | 'b' | null) => void
}

const TILE =
  'h-11 w-11 inline-flex items-center justify-center rounded-subtle border border-black/15 ' +
  'font-sans text-lg text-brand-pacific-dusk bg-brand-salt-air active:scale-95 transition-transform ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove disabled:opacity-30 disabled:active:scale-100'

const DEFAULT_SETS: SetScore[] = [{ a: 0, b: 0 }]

/**
 * Tap-counter score entry. Replaces the reference app's single free-text field
 * with per-pod, format-aware +/- counters that auto-detect the winner — fixing
 * the "typed 11 meaning 5-1" ambiguity from live Week-7 use.
 */
export default function ScoreCounter({ format, aName, bName, value, onScore, onWinner }: Props) {
  const sets = useMemo(() => {
    const parsed = parseScore(value)
    return parsed.length ? parsed : DEFAULT_SETS
  }, [value])

  const maxSets = format.mode === 'sets' ? format.bestOf : 1
  const winner = evaluateWinner(format, sets)

  const commit = (next: SetScore[]) => {
    onScore(formatScore(next))
    onWinner(evaluateWinner(format, next))
  }

  const bump = (setIdx: number, side: 'a' | 'b', delta: number) => {
    const next = sets.map((s, i) =>
      i === setIdx ? { ...s, [side]: Math.max(0, s[side] + delta) } : s
    )
    commit(next)
  }

  const addSet = () => {
    if (sets.length >= maxSets) return
    commit([...sets, { a: 0, b: 0 }])
  }

  const setLabel = (idx: number) => {
    if (format.mode === 'single') return 'Games'
    if (format.finalSetMtb && idx === format.bestOf - 1) return `Set ${idx + 1} · Match TB`
    return `Set ${idx + 1}`
  }

  return (
    <div className="rounded-subtle border border-black/8 bg-brand-sandstone/60 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/60 uppercase">
          Score
        </span>
        {winner ? (
          <span className="font-sans text-ui-sm font-semibold text-brand-tide-pool">
            {winner === 'a' ? aName : bName} wins
          </span>
        ) : (
          <span className="font-sans text-ui-sm text-brand-pacific-dusk/45">
            {format.mode === 'single' ? `First to ${format.target}` : 'In progress'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {sets.map((set, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="font-sans text-ui-sm text-brand-pacific-dusk/55 w-24 shrink-0">
              {setLabel(idx)}
            </span>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <button type="button" className={TILE} onClick={() => bump(idx, 'a', -1)} aria-label={`Decrease ${aName} games`}>
                −
              </button>
              <span className="font-headline text-2xl text-brand-pacific-dusk w-7 text-center tabular-nums">
                {set.a}
              </span>
              <button type="button" className={TILE} onClick={() => bump(idx, 'a', 1)} aria-label={`Increase ${aName} games`}>
                +
              </button>
              <span className="font-sans text-ui-sm text-brand-pacific-dusk/40 px-1">–</span>
              <button type="button" className={TILE} onClick={() => bump(idx, 'b', -1)} aria-label={`Decrease ${bName} games`}>
                −
              </button>
              <span className="font-headline text-2xl text-brand-pacific-dusk w-7 text-center tabular-nums">
                {set.b}
              </span>
              <button type="button" className={TILE} onClick={() => bump(idx, 'b', 1)} aria-label={`Increase ${bName} games`}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {format.mode === 'sets' && sets.length < maxSets ? (
        <button
          type="button"
          onClick={addSet}
          className="mt-2 font-sans text-ui-sm font-medium text-brand-victoria-cove hover:text-brand-deep-water transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove rounded-sm"
        >
          + Add set
        </button>
      ) : null}
    </div>
  )
}
