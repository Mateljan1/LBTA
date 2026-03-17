/**
 * TypeScript types for Coach Hub data (data/coach-hub/*.json).
 * Single source for type-safe components; extend as needed for new keys.
 */

export interface HubStage {
  name: string
  ages: string
  ball: string
  court: string
  dur: number
  max: number
  mix: string
  tech: string
  tact: string
  phys: string
  mental: string
}

export interface HubDrill {
  n: string
  o?: string
  su?: string
  ex?: string
  cu?: string
  ef?: string
  scale?: string
  [key: string]: unknown
}

export type HubPlanEntry = (string | number)[]

export interface HubProgram {
  id: string
  name: string
  stage?: string
  cat?: string
  [key: string]: unknown
}

export interface SeasonDef {
  start: string
  weeks: number
}

export type SeasonsMap = Record<string, SeasonDef>

export interface CoachSessionSlot {
  time: string
  prog: string
  stage: string
  code: string
  dur: number
  loc: string
}

export type CoachDaySchedule = CoachSessionSlot[]

export type CoachSchedule = Record<string, CoachDaySchedule>

export type CoachSchedulesMap = Record<string, CoachSchedule>

/** Top-level hub data (D) from hub-data.json */
export interface HubData {
  stages: Record<string, HubStage>
  templates?: Record<string, unknown>
  curriculum: Record<string, unknown>
  drills: Record<string, HubDrill>
  scaling?: unknown[]
  plans: HubPlanEntry[]
  liveball?: unknown[]
  cardio?: unknown[]
  programs: HubProgram[]
  camps?: unknown[]
  private_stages?: Record<string, unknown>
  swap?: Record<string, unknown>
  liveball_session?: Record<string, unknown>
  drill_idx?: Record<string, unknown>
  block_pools?: Record<string, unknown>
  stage_levels?: Record<string, unknown>
  assessment_calendar?: Record<string, unknown>
  advancement?: Record<string, unknown>
  stations?: unknown[]
  parent_comms?: Record<string, unknown>
  wristbands?: unknown[]
  seasons?: Record<string, unknown>
  leagues?: Record<string, unknown>
  utr_circuit?: Record<string, unknown>
  private_pricing?: Record<string, unknown>
  camp_ops?: Record<string, unknown>
  lbhs_team?: Record<string, unknown>
  [key: string]: unknown
}
