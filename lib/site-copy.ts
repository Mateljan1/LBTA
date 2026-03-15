/**
 * Centralized site copy from data/pricing-supplemental.json.
 * Single import, typed getters; consumers use this instead of raw JSON for siteCopy keys.
 * See docs/data-sources.md for pricing-supplemental as source for modal + site copy.
 */

import { siteCopy } from '@/lib/pricing-supplemental'

export interface SiteCopySlice {
  stickyCtaSchedules?: string
  beginnerProgramCohort?: string
  campsHeading?: string
}

export function getStickyCtaSchedules(): string {
  return siteCopy.stickyCtaSchedules ?? 'Spring & Summer 2026 Registration Open'
}

export function getBeginnerProgramCohort(): string {
  return siteCopy.beginnerProgramCohort ?? 'Spring 2026 Cohort'
}

export function getCampsHeading(): string {
  return siteCopy.campsHeading ?? '2026 Camp Schedule'
}
