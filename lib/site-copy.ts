/**
 * Centralized site copy from data/pricing-supplemental.json.
 * Single import, typed getters; consumers use this instead of raw JSON for siteCopy keys.
 * See docs/data-sources.md for pricing-supplemental as source for modal + site copy.
 */

import { siteCopy } from '@/lib/pricing-supplemental'

/** Canonical support inbox — matches JSON-LD `email` on homepage and all mailto: links. */
export const SUPPORT_EMAIL = 'support@lagunabeachtennisacademy.com' as const

/**
 * CTA label glossary (homepage audit Phase 1).
 * Surfaces differ on purpose: nav/sticky use short labels; hero uses sentence case;
 * the home CTA form is a request flow, not instant scheduling.
 * Align consumers over time; do not blanket-replace without checking UX.
 */
export const CTA_GLOSSARY = {
  navSticky: 'Book Trial',
  heroPrimary: 'Book a Trial',
  /** Secondary hero action — routing to schedules (not a duplicate book CTA). */
  heroSecondary: 'View schedule & pricing',
  formRequestTrial: 'Request a Trial',
} as const

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
