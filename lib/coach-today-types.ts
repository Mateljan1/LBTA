/**
 * Per-Coach "Today" view types.
 *
 * Two content sources are supported per coach:
 *   - `html` — render an existing static HTML asset under public/coach-hub-content/ (Allison + Peter today)
 *   - `data` — render the React `CoachDataView` component from a JSON file (Andrew now; Allison/Peter Phase 2)
 */

export type ContentType = 'html' | 'data'

export interface CoachEntry {
  /** URL slug, must match dynamic route segment and password map key */
  slug: string
  /** Display name (shown in header, login) */
  name: string
  /** Short first-name for greetings */
  firstName: string
  /** Optional location label (Moulton Meadows, Alta + LBHS) */
  location?: string
  /** Which renderer to use for this coach today */
  contentType: ContentType
  /** When contentType === 'html': public path to the file (served from public/) */
  htmlPath?: string
  /** When contentType === 'data': repo path to JSON file (read at build/request via fs) */
  dataPath?: string
}

export type CoachRegistry = Record<string, CoachEntry>

/* ------------------------------------------------------------------ */
/* Data shape for contentType === 'data'                              */
/* Mirrors the visual model of the existing Allison/Peter HTML files. */
/* ------------------------------------------------------------------ */

export interface ThemeBlock {
  /** Optional small number prefix (e.g. "01") */
  num?: string
  /** Eyebrow label (e.g. "Theme of the day") */
  label?: string
  /** Headline */
  title: string
  /** Body paragraph */
  body?: string
}

export interface RuleBlock {
  /** Eyebrow label (e.g. "Rule of the day") */
  label?: string
  /** Headline */
  title: string
  /** Body paragraph */
  body?: string
  /** Optional grid of small label+value tiles below the body */
  tiles?: { label: string; value: string }[]
}

export interface DrillBlock {
  /** Time stamp like "9:00–9:10" */
  time?: string
  /** Duration in minutes (number, used in display) */
  min?: number
  /** Drill name (bold) */
  name: string
  /** Italic cue/quote line */
  cue?: string
  /** "Why" subtext */
  why?: string
  /** Expanded details (markdown-lite paragraphs) */
  details?: string
}

export interface SessionBlock {
  /** Time stamp like "8:30 AM" */
  time?: string
  /** Total duration in minutes */
  durationMin?: number
  /** Session title */
  title: string
  /** Subtitle (e.g. age group, level, court) */
  subtitle?: string
  /** Small uppercase cue tag (e.g. "Beginners 6–8") */
  ageCue?: string
  /** Drill list */
  drills: DrillBlock[]
}

export interface CoachTodayData {
  /** Coach slug — must match registry */
  coach: string
  /** ISO date (YYYY-MM-DD) */
  date: string
  /** Hero eyebrow line (e.g. "Coach Today · Mon May 11") */
  eyebrow?: string
  /** Hero title */
  title: string
  /** Optional location string */
  location?: string
  /** Optional meta line (e.g. weather, team note) */
  metaNote?: string
  /** Theme of the day */
  theme?: ThemeBlock
  /** Rule of the day */
  rule?: RuleBlock
  /** Sessions in chronological order */
  sessions: SessionBlock[]
  /** Optional free-form notes at the bottom */
  notes?: string
}
