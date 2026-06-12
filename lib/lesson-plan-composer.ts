/**
 * Deterministic lesson plan composer.
 *
 * Pure logic. Drives directly off the canonical LBTA framework + libraries.
 * Output is a `LessonPlan` shape that reuses the existing LessonPlanDetailView renderer.
 *
 * Design principles:
 *   - Respect Andrew's authored framework literally; no AI invention.
 *   - Minute splits scale with duration: movement 13%, craft 42%, live-ball 35%, review 10%
 *     (totals to 100%; rounding favors craft block).
 *   - When focus doesn't map to a stroke fundamental, fall back to tactical patterns.
 *   - Generated id is stable for the same inputs+timestamp (UUID-like, prefixed `draft-`).
 */

import type {
  LessonPlan,
  LessonBlock,
  BlockItem,
  ProgramFamily,
  LessonFramework,
} from './lesson-plan-types'
import { PROGRAM_FAMILIES } from './lesson-plan-types'
import { getFramework } from './lesson-plan-data'

export type FocusKey =
  | 'forehand'
  | 'backhand'
  | 'serve'
  | 'return'
  | 'volley'
  | 'overhead'
  | 'patterns'
  | 'match-play'

/** Single source of truth for focus options + display labels. Form imports this. */
export const FOCUS_OPTIONS: { id: FocusKey; label: string }[] = [
  { id: 'forehand', label: 'Forehand' },
  { id: 'backhand', label: 'Backhand' },
  { id: 'serve', label: 'Serve' },
  { id: 'return', label: 'Return' },
  { id: 'volley', label: 'Volley' },
  { id: 'overhead', label: 'Overhead' },
  { id: 'patterns', label: 'Tactical patterns' },
  { id: 'match-play', label: 'Match play' },
]

const FOCUS_LABELS: Record<FocusKey, string> = Object.fromEntries(
  FOCUS_OPTIONS.map((o) => [o.id, o.label])
) as Record<FocusKey, string>

export type DurationKey = 45 | 60 | 90
export const DURATIONS: DurationKey[] = [45, 60, 90]

export interface ComposerInput {
  program: ProgramFamily
  ageBand: string
  durationMin: DurationKey
  focus: FocusKey
  /** Pre-generated draft ID. Hoisted to caller for composer purity. */
  id: string
}

/* ------------------------------------------------------------------ */
/* Tunable constants — extracted from inline magic numbers            */
/* ------------------------------------------------------------------ */

/** Block minute split as fractions of total lesson duration. Sums to 1.0. */
export const BLOCK_RATIOS = {
  movement: 0.13,
  craft: 0.42,
  liveBall: 0.35,
  review: 0.1,
} as const

/** Minimum live-ball block duration to use 2 formats instead of 1. */
const LIVE_BALL_TWO_FORMATS_MIN = 18

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Map an LBTA program to the warm-up library age key the framework uses.
 * Framework keys are like "5–7 (Red)", "8–10 (Orange/Green)", "11–14 (Yellow / juniors)", "HP / Adult".
 */
function pickWarmupBandLabel(program: ProgramFamily): string {
  switch (program) {
    case 'red':
      return '5–7 (Red)'
    case 'orange':
    case 'green':
      return '8–10 (Orange/Green)'
    case 'yellow':
      return '11–14 (Yellow / juniors)'
    case 'adult-bridge':
    case 'hp-adult':
    case 'cardio':
    case 'private':
      return 'HP / Adult'
  }
}

/**
 * Compute minute splits proportionally so total === durationMin exactly.
 * Distribution favors the craft block; rounding remainder goes to craft.
 */
function computeBlockMinutes(total: number) {
  const movement = Math.round(total * BLOCK_RATIOS.movement)
  const liveBall = Math.round(total * BLOCK_RATIOS.liveBall)
  const review = Math.round(total * BLOCK_RATIOS.review)
  const craft = total - movement - liveBall - review
  return { movement, craft, liveBall, review }
}

/**
 * Reconcile per-item minute drift: ensure sum(items.min) === blockMinutes
 * by pushing any rounding remainder onto the last item with a `min` value.
 * Mutates the items array in place and returns it.
 */
function reconcileItemMinutes(items: BlockItem[], blockMinutes: number): BlockItem[] {
  const itemsWithMin = items.filter((i) => typeof i.min === 'number')
  if (itemsWithMin.length === 0) return items
  const sum = itemsWithMin.reduce((acc, i) => acc + (i.min ?? 0), 0)
  const remainder = blockMinutes - sum
  if (remainder !== 0) {
    const last = itemsWithMin[itemsWithMin.length - 1]
    last.min = (last.min ?? 0) + remainder
  }
  return items
}

/**
 * Produce a stable-prefixed id with cryptographically random suffix.
 * Format: `draft-{date}-{HHMM}-{program}-{focus}-{8-char-uuid-slice}`
 * Lives in the route layer (not composer) so composePlan stays pure.
 */
export function generateDraftId(input: Pick<ComposerInput, 'program' | 'focus'>): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
  // crypto.randomUUID() gives 36-char UUID with dashes; slice 8 chars of the random part for short URL.
  const rand = (typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
    : Math.random().toString(36).slice(2, 10))
  return `draft-${date}-${time}-${input.program}-${input.focus}-${rand}`
}

/* ------------------------------------------------------------------ */
/* Block builders                                                     */
/* ------------------------------------------------------------------ */

function buildMovementBlock(
  input: ComposerInput,
  minutes: number,
  fw: LessonFramework
): LessonBlock {
  const bandLabel = pickWarmupBandLabel(input.program)
  const band = fw.warmupLibrary.byAge.find((b) => b.label === bandLabel)
  const drills = band?.drills ?? []

  const items: BlockItem[] = []
  // Slice 1: universal opener
  const openerMin = Math.max(2, Math.floor(minutes * 0.4))
  items.push({
    name: 'Universal opener',
    cue: fw.warmupLibrary.universalOpener,
    min: openerMin,
  })
  // Slice 2-3: age-specific drills (up to 2 picks)
  const remaining = minutes - openerMin
  const drillCount = Math.min(2, Math.max(1, drills.length))
  const perDrill = Math.max(2, Math.floor(remaining / drillCount))
  drills.slice(0, 2).forEach((drillName) => {
    items.push({ name: drillName, min: perDrill })
  })

  return reconcileBlock({
    type: 'movement',
    minutes,
    focus: `Warm-up for ${bandLabel}`,
    items,
  })
}

function buildCraftBlock(
  input: ComposerInput,
  minutes: number,
  fw: LessonFramework
): LessonBlock {
  const focusLabel = FOCUS_LABELS[input.focus]

  // Patterns / match-play → tactical library
  if (input.focus === 'patterns' || input.focus === 'match-play') {
    const tactics = fw.craftLibrary.tactical.items.slice(0, 3)
    const perDrill = Math.floor(minutes / Math.max(1, tactics.length))
    return reconcileBlock({
      type: 'craft',
      minutes,
      focus: `${focusLabel} — pick the day's pattern`,
      items: tactics.map((t) => ({
        name: t,
        cue: 'Decide before you swing.',
        min: perDrill,
      })),
    })
  }

  // Stroke focus → match the stroke fundamentals row
  const stroke = fw.craftLibrary.strokeFundamentals.find((s) =>
    s.stroke.toLowerCase().includes(input.focus)
  )

  // Three drills: shadow → fed → live-feed
  const shadowMin = Math.max(4, Math.floor(minutes * 0.25))
  const fedMin = Math.max(6, Math.floor(minutes * 0.4))
  const liveMin = minutes - shadowMin - fedMin

  return reconcileBlock({
    type: 'craft',
    minutes,
    focus: stroke ? `${stroke.stroke}: ${stroke.subFoci}` : `${focusLabel} fundamentals`,
    items: [
      {
        name: `${focusLabel} shadow reps (no ball)`,
        cue: 'Slow + correct beats fast + sloppy.',
        why: 'Pattern grooves before contact pressure.',
        min: shadowMin,
      },
      {
        name: `Coach-fed ${focusLabel.toLowerCase()} to single cone target`,
        cue: 'Same contact, same finish, every rep.',
        min: fedMin,
      },
      {
        name: `Cooperative ${focusLabel.toLowerCase()} rally (5 in a row goal)`,
        cue: 'Find the rhythm.',
        min: liveMin,
      },
    ],
  })
}

function buildLiveBallBlock(
  input: ComposerInput,
  minutes: number,
  fw: LessonFramework
): LessonBlock {
  const formats = fw.liveBallFormats

  // Longer blocks get 2 formats; shorter ones get 1.
  const useTwo = minutes >= LIVE_BALL_TWO_FORMATS_MIN && formats.length >= 2
  const picks = useTwo ? formats.slice(0, 2) : formats.slice(0, 1)
  const perItem = Math.floor(minutes / Math.max(1, picks.length))

  return reconcileBlock({
    type: 'live-ball',
    minutes,
    focus: `Apply the ${FOCUS_LABELS[input.focus]} focus under live-feed pressure`,
    items: picks.map((f) => ({
      name: f.name,
      cue: f.description,
      min: perItem,
    })),
  })
}

function buildReviewBlock(minutes: number, fw: LessonFramework): LessonBlock {
  const debrief = fw.reviewTemplates.find((t) => t.title === '60-second debrief')
  const homework = fw.reviewTemplates.find((t) => t.title === 'Homework assignment')

  const debriefMin = Math.max(1, Math.floor(minutes * 0.4))
  const homeworkMin = minutes - debriefMin

  const items: BlockItem[] = []
  if (debrief) {
    items.push({
      name: debrief.title,
      cue: debrief.body,
      min: debriefMin,
    })
  }
  if (homework) {
    items.push({
      name: homework.title,
      cue: homework.body,
      min: homeworkMin,
    })
  }

  return reconcileBlock({
    type: 'review',
    minutes,
    focus: 'Recap + homework',
    items,
  })
}

/** Helper: ensure a block's item.min sums equal block.minutes (push remainder to last item). */
function reconcileBlock(block: LessonBlock): LessonBlock {
  return { ...block, items: reconcileItemMinutes(block.items, block.minutes) }
}

function buildHomework(input: ComposerInput): string {
  const focusLabel = FOCUS_LABELS[input.focus].toLowerCase()
  if (input.focus === 'patterns' || input.focus === 'match-play') {
    return `Identify your next match opponent — plan which pattern fits their game.`
  }
  if (input.focus === 'serve' || input.focus === 'return') {
    return `30 ${focusLabel} target reps before next session — log to RacquetIQ.`
  }
  return `20 shadow ${focusLabel}s daily this week — focus on the cue.`
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Compose a 4-block lesson plan from canonical libraries.
 *
 * Pure function: takes input + framework, returns a LessonPlan. No clock,
 * no RNG (id is hoisted to caller). Output validated against the
 * `lessonPlanSchema` Zod shape at the route layer; safe to persist as-is.
 *
 * @param input - composer parameters (program, age, duration, focus, pre-generated id)
 * @param framework - framework data; defaults to module-level static-imported framework
 *                    so callers can inject a test framework for unit tests.
 */
export function composePlan(
  input: ComposerInput,
  framework: LessonFramework = getFramework()
): LessonPlan {
  const split = computeBlockMinutes(input.durationMin)
  const programLabel =
    PROGRAM_FAMILIES.find((p) => p.id === input.program)?.label ?? input.program
  const focusLabel = FOCUS_LABELS[input.focus]

  const blocks: LessonBlock[] = [
    buildMovementBlock(input, split.movement, framework),
    buildCraftBlock(input, split.craft, framework),
    buildLiveBallBlock(input, split.liveBall, framework),
    buildReviewBlock(split.review, framework),
  ]

  return {
    id: input.id,
    title: `${programLabel} — ${focusLabel} Day`,
    program: input.program,
    ageBand: input.ageBand,
    durationMin: input.durationMin,
    focus: `${focusLabel} for ${input.ageBand} (${input.durationMin} min)`,
    theme: undefined,
    blocks,
    homework: buildHomework(input),
    tags: ['composer', input.focus, input.program],
    // Disambiguated from LessonPlanDraft._meta.source ('composer'). This is
    // the human-readable provenance shown in the detail page footer.
    source: 'Composed from LBTA framework + libraries (lib/lesson-plan-composer.ts)',
  }
}
