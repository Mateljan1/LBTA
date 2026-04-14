/**
 * Shared helpers for year registration API and UTR fulfillment (ActiveCampaign tags, category).
 */

import {
  CAMPAIGN_TAGS,
  CLASS_TAGS,
  getClassTagFromProgram,
  getUtrDivisionTag,
  INTEREST_TAGS,
  SEASON_TAGS as AC_SEASON_TAGS,
} from '@/lib/activecampaign'

export type RegistrationType =
  | 'seasonal'
  | 'camp'
  | 'utr-circuit'
  | 'private'
  | 'inquiry'

export function determineCategory(programName: string, registrationType: RegistrationType): string {
  if (registrationType === 'camp') return 'Camp'
  if (registrationType === 'utr-circuit') return 'Match Play Series'
  if (registrationType === 'private') return 'Private'

  const program = programName.toLowerCase()

  if (
    program.includes('little stars') ||
    program.includes('red ball') ||
    program.includes('orange ball') ||
    program.includes('green dot')
  ) {
    return 'Junior'
  }

  if (program.includes('youth development') || program.includes('high performance')) {
    return 'Youth'
  }

  if (
    program.includes('cardio') ||
    program.includes('liveball') ||
    program.includes('family tennis') ||
    program.includes('match play')
  ) {
    return 'Fitness'
  }

  return 'Adult'
}

const REGISTRATION_SEASON_TAGS: Record<string, number> = {
  winter: CAMPAIGN_TAGS.winter_2026,
  spring: CAMPAIGN_TAGS.spring_2026,
  summer: AC_SEASON_TAGS.summer_2025,
  fall: AC_SEASON_TAGS.fall_2025,
}

export function getApplicableTags(
  data: { season?: string; program?: string; registrationType?: string; division?: string },
  registrationType: RegistrationType
): number[] {
  const tags: number[] = [CAMPAIGN_TAGS.website_registration]

  if (data.season && REGISTRATION_SEASON_TAGS[data.season.toLowerCase()]) {
    tags.push(REGISTRATION_SEASON_TAGS[data.season.toLowerCase()])
  }

  if (registrationType === 'utr-circuit') {
    tags.push(CAMPAIGN_TAGS.utr_circuit)
    tags.push(INTEREST_TAGS.utr_circuit)
    const divisionForTag = data.division || data.program || ''
    if (divisionForTag) {
      const divisionTag = getUtrDivisionTag(divisionForTag)
      if (divisionTag) tags.push(divisionTag)
    }
  }

  if (data.program) {
    const classTag = getClassTagFromProgram(data.program)
    if (classTag) tags.push(classTag)
  }

  if (registrationType === 'camp') {
    tags.push(CLASS_TAGS.summer_camp)
  }

  return Array.from(new Set(tags))
}

export function isEarlyBird(season?: string): boolean {
  const now = new Date()
  const earlyBirdDeadlines: Record<string, Date> = {
    winter: new Date('2025-12-20T23:59:59'),
    spring: new Date('2026-03-20T23:59:59'),
    summer: new Date('2026-05-20T23:59:59'),
    fall: new Date('2026-08-01T23:59:59'),
  }

  if (season && earlyBirdDeadlines[season.toLowerCase()]) {
    return now < earlyBirdDeadlines[season.toLowerCase()]
  }

  return now < new Date('2025-12-20T23:59:59')
}
