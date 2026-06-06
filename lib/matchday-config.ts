/**
 * Match Day — pure config + algorithms (no React, no I/O; fully unit-testable).
 *
 * Ported from the working reference app (Netlify) into the LBTA site. This module
 * owns the data model (levels, pods, scoring formats), the Berger round-robin
 * generator, stable match keys, standings, and score evaluation for the
 * format-aware tap counter.
 */

export type Level =
  | 'red'
  | 'orange'
  | 'green'
  | 'yellow'
  | 'adult1-3'
  | 'adult3-5'
  | 'adult5'

export type PodId =
  | 'color-ball'
  | 'juniors'
  | 'singles-1-3'
  | 'singles-3-5'
  | 'singles-5'
  | 'lbhs-pod-1'
  | 'lbhs-pod-2'

export type PillTone = 'red' | 'orange' | 'green' | 'yellow' | 'adult'

export interface Player {
  id: string
  name: string
  level: Level
  age?: number | null
  pod: PodId
  walkin: boolean
  /** Optional UTR rating snapshot, for seeded pods. */
  utr?: number | null
  /** Optional seed (1 = top), for seeded pods. */
  seed?: number | null
}

export interface LevelDef {
  pod: PodId
  /** Short pill label shown on chips (e.g. "Green", "UTR 1.0–3.0"). */
  label: string
  tone: PillTone
}

/**
 * Scoring format per pod. `single` = one set / pro-set with a game target.
 * `sets` = best-of-N sets (last set may be a match tiebreak).
 */
export type ScoringFormat =
  | {
      mode: 'single'
      /** Games needed to win the set/pro-set. */
      target: number
      /** Win-by margin (1 = sudden, 2 = standard). */
      winBy: number
    }
  | {
      mode: 'sets'
      /** Total sets in the match (2 sets + decider = 3). */
      bestOf: number
      /** Games per set. */
      setTarget: number
      setWinBy: number
      /** When true, the deciding set is a 10-point match tiebreak. */
      finalSetMtb: boolean
    }

export interface PodMeta {
  name: string
  /** Human-readable format line. */
  format: string
  /** Placeholder for the manual score override field. */
  scoreHint: string
  /** Brand token CSS var used for the pod's accent stripe. */
  colorVar: string
  /** Structured scoring rules for the tap counter. */
  scoring: ScoringFormat
  /** Number of courts available to the pod (optional). */
  courts?: number
  /** LBHS / seeded cohort flag. */
  seeded?: boolean
}

export const LEVEL_DEFS: Record<Level, LevelDef> = {
  red: { pod: 'color-ball', label: 'Red R1', tone: 'red' },
  orange: { pod: 'color-ball', label: 'Orange', tone: 'orange' },
  green: { pod: 'color-ball', label: 'Green', tone: 'green' },
  yellow: { pod: 'juniors', label: 'Yellow / Jr 1–2.5', tone: 'yellow' },
  'adult1-3': { pod: 'singles-1-3', label: 'UTR 1.0–3.0', tone: 'adult' },
  'adult3-5': { pod: 'singles-3-5', label: 'UTR 3.0–5.0', tone: 'adult' },
  adult5: { pod: 'singles-5', label: 'UTR 5.0+', tone: 'adult' },
}

export const POD_ORDER: PodId[] = [
  'color-ball',
  'juniors',
  'singles-1-3',
  'singles-3-5',
  'singles-5',
  'lbhs-pod-1',
  'lbhs-pod-2',
]

export const POD_META: Record<PodId, PodMeta> = {
  'color-ball': {
    name: 'Color Ball Pod',
    format: 'Short set to 4 (next game wins at 3–3)',
    scoreHint: 'e.g. 4-2',
    colorVar: 'var(--brand-tide-pool)',
    scoring: { mode: 'single', target: 4, winBy: 1 },
  },
  juniors: {
    name: 'Juniors 1.0–2.5',
    format: '6-game set (tiebreak at 6–6)',
    scoreHint: 'e.g. 6-3',
    colorVar: 'var(--brand-thousand-steps)',
    scoring: { mode: 'single', target: 6, winBy: 2 },
  },
  'singles-1-3': {
    name: 'Singles 1.0–3.0',
    format: '8-game pro set',
    scoreHint: 'e.g. 8-5',
    colorVar: 'var(--brand-victoria-cove)',
    scoring: { mode: 'single', target: 8, winBy: 2 },
  },
  'singles-3-5': {
    name: 'Singles 3.0–5.0',
    format: 'Best of 3 · 2 sets + match tiebreak',
    scoreHint: 'e.g. 6-4, 6-3',
    colorVar: 'var(--brand-pacific-dusk)',
    scoring: { mode: 'sets', bestOf: 3, setTarget: 6, setWinBy: 2, finalSetMtb: true },
  },
  'singles-5': {
    name: 'Singles 5.0+',
    format: 'Best of 3 · 2 sets + match tiebreak',
    scoreHint: 'e.g. 7-6, 6-4',
    colorVar: 'var(--brand-deep-water)',
    scoring: { mode: 'sets', bestOf: 3, setTarget: 6, setWinBy: 2, finalSetMtb: true },
  },
  'lbhs-pod-1': {
    name: 'Alta 4 PM · Pod A',
    format: 'Best of 3 · Fast 4 (next game wins at 3–3)',
    scoreHint: 'S1, S2, S3 — e.g. 4-2, 4-3',
    colorVar: 'var(--brand-pacific-dusk)',
    scoring: { mode: 'sets', bestOf: 3, setTarget: 4, setWinBy: 1, finalSetMtb: false },
    seeded: true,
    courts: 2,
  },
  'lbhs-pod-2': {
    name: 'Alta 4 PM · Pod B',
    format: 'Best of 3 · Fast 4 (next game wins at 3–3)',
    scoreHint: 'S1, S2, S3 — e.g. 4-2, 4-3',
    colorVar: 'var(--brand-victoria-cove)',
    scoring: { mode: 'sets', bestOf: 3, setTarget: 4, setWinBy: 1, finalSetMtb: false },
    seeded: true,
    courts: 3,
  },
}

/** Map a UTR rating (or color-ball stage) to an app level. */
export function levelFromUtr(
  utr: number | null | undefined,
  opts: { colorBall?: boolean; stage?: 'red' | 'orange' | 'green' | null } = {}
): Level {
  if (opts.colorBall || opts.stage) {
    if (opts.stage === 'orange') return 'orange'
    if (opts.stage === 'green') return 'green'
    return 'red'
  }
  if (utr == null) return 'yellow'
  if (utr < 3) return 'adult1-3'
  if (utr < 5) return 'adult3-5'
  return 'adult5'
}

type Pair = [Player, Player]

/**
 * Standard Berger circle round-robin. Odd counts get a rotating BYE so each
 * player sits exactly once per cycle. Returns rounds of matchup pairs.
 */
export function generateRoundRobin(players: Player[]): Pair[][] {
  const list: (Player & { bye?: boolean })[] = players.slice()
  if (list.length % 2 === 1) {
    list.push({ id: '__bye', name: 'BYE', level: 'red', pod: 'color-ball', walkin: false, bye: true })
  }
  const m = list.length
  if (m < 2) return []
  const rounds: Pair[][] = []
  const fixed = list[0]
  let rest = list.slice(1)
  for (let r = 0; r < m - 1; r++) {
    const arr = [fixed, ...rest]
    const pairs: Pair[] = []
    for (let i = 0; i < m / 2; i++) {
      const a = arr[i]
      const b = arr[m - 1 - i]
      if (!a.bye && !b.bye) pairs.push([a, b])
    }
    rounds.push(pairs)
    rest = [rest[rest.length - 1], ...rest.slice(0, rest.length - 1)]
  }
  // Drop fully-empty rounds (e.g. a lone player paired only with the BYE).
  return rounds.filter((r) => r.length > 0)
}

/**
 * Stable match key — only the matchup matters, not the round it landed in, so
 * late-arriving players don't blow away already-played results when the draw
 * regenerates.
 */
export function matchKey(podId: PodId | string, aId: string, bId: string): string {
  const [x, y] = [aId, bId].sort()
  return `${podId}::${x}-${y}`
}

/** Seeded pods are ordered by seed; everyone else keeps insertion order. */
export function orderPodPlayers(players: Player[]): Player[] {
  if (players.some((p) => p.seed != null)) {
    return players.slice().sort((a, b) => (a.seed ?? 99) - (b.seed ?? 99))
  }
  return players
}

export interface Standing {
  id: string
  name: string
  w: number
  l: number
}

/** Win/loss standings for a pod, sorted by wins then fewest losses. */
export function computeStandings(
  podId: PodId,
  players: Player[],
  results: Record<string, string>
): Standing[] {
  const stats: Record<string, Standing> = {}
  players.forEach((p) => {
    stats[p.id] = { id: p.id, name: p.name, w: 0, l: 0 }
  })
  generateRoundRobin(orderPodPlayers(players)).forEach((round) => {
    round.forEach(([a, b]) => {
      const w = results[matchKey(podId, a.id, b.id)]
      if (w === a.id) {
        stats[a.id].w++
        stats[b.id].l++
      } else if (w === b.id) {
        stats[b.id].w++
        stats[a.id].l++
      }
    })
  })
  return Object.values(stats).sort((x, y) => y.w - x.w || x.l - y.l)
}

/* ------------------------------------------------------------------ */
/* Score parsing + format-aware winner evaluation (tap counter)        */
/* ------------------------------------------------------------------ */

export interface SetScore {
  a: number
  b: number
}

/** Parse a stored score string like "4-2, 3-4" into structured set scores. */
export function parseScore(raw: string | undefined): SetScore[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const m = part.match(/^(\d+)\s*[-–]\s*(\d+)$/)
      if (!m) return null
      return { a: parseInt(m[1], 10), b: parseInt(m[2], 10) }
    })
    .filter((s): s is SetScore => s != null)
}

/** Render structured set scores back to the canonical "A-B, A-B" string. */
export function formatScore(sets: SetScore[]): string {
  return sets
    .filter((s) => s.a > 0 || s.b > 0)
    .map((s) => `${s.a}-${s.b}`)
    .join(', ')
}

/**
 * Decide the winner of one set/pro-set given its target and win-by margin.
 * Returns 'a', 'b', or null (not yet decided).
 */
export function setWinner(set: SetScore, target: number, winBy: number): 'a' | 'b' | null {
  if (set.a >= target && set.a - set.b >= winBy) return 'a'
  if (set.b >= target && set.b - set.a >= winBy) return 'b'
  return null
}

/**
 * Evaluate the match winner from structured set scores using the pod format.
 * Single-set formats decide on the one set; set formats need a majority.
 */
export function evaluateWinner(format: ScoringFormat, sets: SetScore[]): 'a' | 'b' | null {
  if (sets.length === 0) return null
  if (format.mode === 'single') {
    return setWinner(sets[0], format.target, format.winBy)
  }
  let aWins = 0
  let bWins = 0
  const needed = Math.ceil(format.bestOf / 2)
  sets.forEach((set, idx) => {
    const isDecider = idx === format.bestOf - 1
    // The deciding set is a match tiebreak (first to 10, win by 2) when configured.
    const target = isDecider && format.finalSetMtb ? 10 : format.setTarget
    const winBy = isDecider && format.finalSetMtb ? 2 : format.setWinBy
    const w = setWinner(set, target, winBy)
    if (w === 'a') aWins++
    else if (w === 'b') bWins++
  })
  if (aWins >= needed) return 'a'
  if (bWins >= needed) return 'b'
  return null
}
