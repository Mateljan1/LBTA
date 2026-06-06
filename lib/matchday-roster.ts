/**
 * Match Day roster source.
 *
 * Replaces the reference app's hard-coded QUICK_BATCHES with a live pull from
 * the site's already-integrated UTR tracker (Supabase `players` table). When
 * Supabase isn't configured (local dev, preview) it degrades gracefully to a
 * seeded Week-7 fallback so the coach always has something to load.
 */

import 'server-only'
import { getAllPlayers } from '@/lib/utr-tracker-supabase'
import { levelFromUtr, type Level, type PodId } from '@/lib/matchday-config'

export interface QuickBatchPlayer {
  name: string
  level: Level
  age?: number | null
  utr?: number | null
  seed?: number | null
}

export interface QuickBatch {
  id: string
  label: string
  note: string
  /** When set, players load into this dedicated pod (seeded pods). */
  pod?: PodId
  players: QuickBatchPlayer[]
}

/**
 * Seeded fallback batches (Week 7, 2026-05-30). Mirrors the validated reference
 * session so the tool is useful even with no live data source connected.
 */
export const FALLBACK_BATCHES: QuickBatch[] = [
  {
    id: 'alta-130',
    label: 'Alta 1:30 PM — UTR registrations',
    note: 'Color Ball + Singles 1.0–3.0',
    players: [
      { name: 'Ruhi Sidhanti', level: 'red', age: 8 },
      { name: 'Sloane Thomas', level: 'red', age: 7 },
      { name: 'Lucia Dziuk', level: 'green', age: 11 },
      { name: 'Aryaan Schuts', level: 'green', age: 10 },
    ],
  },
  {
    id: 'lbhs-pod-1',
    label: 'Alta 4 PM · Pod A (UTR 1.6–2.5)',
    note: 'Seeded · Best of 3 Fast 4 · Courts 1+2',
    pod: 'lbhs-pod-1',
    players: [
      { name: 'Landon Harkness', level: 'adult1-3', utr: 2.48, seed: 1 },
      { name: 'Zen Mullins-Sebor', level: 'adult1-3', utr: 1.99, seed: 2 },
      { name: 'Grayson Dedovesh', level: 'adult1-3', utr: 1.66, seed: 3 },
      { name: 'Jakob Lumb', level: 'adult1-3', utr: 1.6, seed: 4 },
    ],
  },
  {
    id: 'lbhs-pod-2',
    label: 'Alta 4 PM · Pod B (UTR 1.0–1.7)',
    note: 'Seeded · Best of 3 Fast 4 · Courts 3+4',
    pod: 'lbhs-pod-2',
    players: [
      { name: 'Ayana Mullins-Sebor', level: 'adult1-3', utr: 1.72, seed: 1 },
      { name: 'Vivienne Smith', level: 'adult1-3', utr: 1.36, seed: 2 },
      { name: 'Clark Alden', level: 'adult1-3', utr: 1.24, seed: 3 },
      { name: 'Josefina Villicana-Salzer', level: 'adult1-3', utr: 1.12, seed: 4 },
    ],
  },
]

const MAX_BATCH = 16

/**
 * Build quick-load batches from the UTR tracker. Returns the seeded fallback
 * when Supabase is unconfigured or returns no players.
 */
export async function getQuickBatches(): Promise<{
  batches: QuickBatch[]
  source: 'utr-tracker' | 'fallback'
}> {
  let players: Awaited<ReturnType<typeof getAllPlayers>> = []
  try {
    players = await getAllPlayers()
  } catch {
    players = []
  }

  if (!players.length) {
    return { batches: FALLBACK_BATCHES, source: 'fallback' }
  }

  const colorBall = players.filter((p) => p.is_color_ball)
  const singles = players.filter(
    (p) => !p.is_color_ball && p.divisions.some((d) => d.includes('singles'))
  )

  const batches: QuickBatch[] = []

  if (colorBall.length) {
    batches.push({
      id: 'utr-color-ball',
      label: 'Color Ball — registered',
      note: `${colorBall.length} player${colorBall.length === 1 ? '' : 's'} from the UTR tracker`,
      players: colorBall.slice(0, MAX_BATCH).map((p) => ({
        name: p.name,
        level: levelFromUtr(p.utr, { colorBall: true, stage: p.color_ball_stage }),
        utr: p.utr,
      })),
    })
  }

  if (singles.length) {
    batches.push({
      id: 'utr-singles',
      label: 'UTR Singles — registered',
      note: `${singles.length} player${singles.length === 1 ? '' : 's'} from the UTR tracker`,
      players: singles
        .slice()
        .sort((a, b) => (b.utr ?? 0) - (a.utr ?? 0))
        .slice(0, MAX_BATCH)
        .map((p) => ({ name: p.name, level: levelFromUtr(p.utr), utr: p.utr })),
    })
  }

  if (!batches.length) {
    return { batches: FALLBACK_BATCHES, source: 'fallback' }
  }

  return { batches, source: 'utr-tracker' }
}
