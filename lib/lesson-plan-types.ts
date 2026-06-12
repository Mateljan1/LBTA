/**
 * Lesson Plan Library types — derived from the LBTA canonical 4-block schema
 * documented in LBTA_Coaching_LessonPlanLibrary_v1.md.
 */

/** Top-level program family for filtering and tagging. */
export type ProgramFamily =
  | 'red'
  | 'orange'
  | 'green'
  | 'yellow'
  | 'adult-bridge'
  | 'hp-adult'
  | 'cardio'
  | 'private'

export interface ProgramFamilyMeta {
  id: ProgramFamily
  label: string
  /** Short qualifier shown under the label, e.g. "5-7 yo" */
  ageBand?: string
  /** Brand token name for color stripe (used sparingly, brand restraint). */
  accent: 'pacific-dusk' | 'victoria-cove' | 'thousand-steps' | 'tide-pool' | 'sunset-cliff'
}

export const PROGRAM_FAMILIES: ProgramFamilyMeta[] = [
  { id: 'red', label: 'Red Ball', ageBand: '5–7', accent: 'sunset-cliff' },
  { id: 'orange', label: 'Orange Ball', ageBand: '7–9', accent: 'thousand-steps' },
  { id: 'green', label: 'Green Ball', ageBand: '9–11', accent: 'tide-pool' },
  { id: 'yellow', label: 'Yellow Junior', ageBand: '11–14', accent: 'victoria-cove' },
  { id: 'adult-bridge', label: 'Adult Bridge', accent: 'pacific-dusk' },
  { id: 'hp-adult', label: 'HP Adult', accent: 'pacific-dusk' },
  { id: 'cardio', label: 'Cardio Tennis', accent: 'sunset-cliff' },
  { id: 'private', label: 'Private', accent: 'victoria-cove' },
]

/** Block type — one of the 4 canonical blocks in every LBTA lesson. */
export type BlockType = 'movement' | 'craft' | 'live-ball' | 'review'

export interface BlockTypeMeta {
  id: BlockType
  label: string
  defaultMinutes: number
  purpose: string
  accent: 'tide-pool' | 'thousand-steps' | 'victoria-cove' | 'pacific-dusk'
}

/** The canonical 4-block schema. Exported so framework page renders from one source. */
export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    id: 'movement',
    label: 'Movement Warm-up',
    defaultMinutes: 8,
    purpose: 'Dynamic warm-up + footwork — connects Fit4Tennis principles',
    accent: 'tide-pool',
  },
  {
    id: 'craft',
    label: 'Craft Block',
    defaultMinutes: 25,
    purpose: 'One technical or tactical focus — drilled to mastery',
    accent: 'thousand-steps',
  },
  {
    id: 'live-ball',
    label: 'Live-Ball / Game-Based',
    defaultMinutes: 20,
    purpose: 'Applied scenarios, point play, decision-making',
    accent: 'victoria-cove',
  },
  {
    id: 'review',
    label: 'Review + Homework',
    defaultMinutes: 7,
    purpose: 'Recap + 1 homework drill (logged to RacquetIQ)',
    accent: 'pacific-dusk',
  },
]

/** A single drill / activity item within a block. */
export interface BlockItem {
  /** Item name (e.g. "Spider tag", "Forehand grip → unit turn") */
  name: string
  /** Optional italic cue (coach voice) */
  cue?: string
  /** Optional "why" subtext */
  why?: string
  /** Duration in minutes for this item (sums should approximate block minutes) */
  min?: number
}

/** A block within a lesson plan — one of the 4 canonical types. */
export interface LessonBlock {
  type: BlockType
  /** Total minutes for this block (overrides default if customized) */
  minutes: number
  /** Block-level focus statement (e.g. "Forehand: grip → unit turn") */
  focus?: string
  /** Drill / activity items that fill the block */
  items: BlockItem[]
}

/** A complete lesson plan — composed of the 4-block schema + meta. */
export interface LessonPlan {
  /** URL-safe ID (slug) — used in routes */
  id: string
  /** Display title (e.g. "Red Ball — Forehand Day") */
  title: string
  /** Program family this plan belongs to */
  program: ProgramFamily
  /** Age band display, e.g. "5–7 yo" */
  ageBand?: string
  /** Total lesson duration in minutes */
  durationMin: number
  /** One-line focus statement (e.g. "Forehand grip + first 3 reps") */
  focus: string
  /** Optional theme tagline (Cormorant italic) */
  theme?: string
  /** The 4 blocks (always in order: movement, craft, live-ball, review) */
  blocks: LessonBlock[]
  /** One-line homework / parent recap */
  homework?: string
  /** Filter tags */
  tags?: string[]
  /** Source attribution (e.g. "LBTA_Coaching_LessonPlanLibrary_v1.md §Block 2") */
  source?: string
}

/* ------------------------------------------------------------------ */
/* Framework reference types — for the "/lesson-plans/framework" page */
/* ------------------------------------------------------------------ */

export interface WarmupAgeBand {
  /** e.g. "5–7 (Red)", "8–10 (Orange/Green)" */
  label: string
  /** Drill name list */
  drills: string[]
}

export interface CraftStrokeFundamental {
  stroke: string
  /** e.g. "grip → unit turn → racket lag → contact → recovery" */
  subFoci: string
}

export interface CraftCategory {
  title: string
  /** Short list of items in the category */
  items: string[]
}

export interface LiveBallFormat {
  name: string
  description: string
}

export interface ReviewTemplate {
  title: string
  body: string
}

export interface VariantNote {
  variant: string
  note: string
}

/**
 * A draft lesson plan generated by the deterministic composer.
 * Wraps the canonical LessonPlan with provenance metadata so the library
 * landing can show "Generated by {coach}" and order by createdAt.
 */
export interface LessonPlanDraft extends LessonPlan {
  _meta: {
    /** Coach slug who triggered the generation (allison/andrew/peter) */
    generatedBy: string
    /** ISO timestamp */
    createdAt: string
    /** How the draft was created */
    source: 'composer'
  }
}

export interface LessonFramework {
  /** Markdown source for attribution */
  source: string
  /** Schema header text */
  schemaIntro: string
  /** Canonical 4-block schema (defined in BLOCK_TYPES; included for completeness) */
  blocks: BlockTypeMeta[]
  /** Block 1 — Movement Warm-up library by age */
  warmupLibrary: {
    universalOpener: string
    byAge: WarmupAgeBand[]
  }
  /** Block 2 — Craft Block topics */
  craftLibrary: {
    strokeFundamentals: CraftStrokeFundamental[]
    tactical: CraftCategory
    mental: CraftCategory
  }
  /** Block 3 — Live-ball / game-based formats */
  liveBallFormats: LiveBallFormat[]
  /** Block 4 — Review + Homework templates */
  reviewTemplates: ReviewTemplate[]
  /** Variants by program (Academy / Private / Junior Pathway) */
  variants: VariantNote[]
}
