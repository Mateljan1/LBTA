import { z } from 'zod'

/**
 * Runtime validation for schedule page data.
 * Used in app/schedules/page.tsx so malformed JSON fails at build/render time.
 */

const scheduleSlotSchema = z.object({
  day: z.string(),
  time: z.string(),
  coach: z.string().optional(),
  location: z.string().optional(),
  note: z.string().optional(),
})

const pricingSchema = z.object({
  '1x': z.number().optional(),
  '2x': z.number().optional(),
  '3x': z.number().optional(),
  '4x': z.number().optional(),
  '5x': z.number().optional(),
  monthly: z.number().optional(),
  drop_in: z.number().optional(),
})

export const programSchema = z.object({
  id: z.string(),
  category: z.string(),
  program: z.string(),
  ages: z.string(),
  location: z.string(),
  duration: z.string(),
  schedule: z.array(scheduleSlotSchema),
  pricing: pricingSchema,
  description: z.string(),
  coach: z.string().optional(),
  pricingNote: z.string().optional(),
}).passthrough()

export const programsArraySchema = z.array(programSchema)

const coachSchema = z.object({
  coach: z.string(),
  title: z.string(),
  rate60: z.number(),
  rate90: z.number(),
  pack10: z.number(),
  pack20: z.number(),
  availability: z.string(),
})

const monthlyProgramEntrySchema = z.object({
  label: z.string(),
  subtitle: z.string(),
  duration: z.string(),
  price: z.number(),
  dropIn: z.number(),
})

const discountEntrySchema = z.object({
  amount: z.number(),
  type: z.string(),
  description: z.string(),
})

const campSchema = z.object({
  id: z.string(),
  name: z.string(),
  dates: z.string(),
  days: z.union([z.string(), z.number()]),
  hours: z.string(),
  ages: z.string(),
  location: z.string(),
  price: z.number(),
  perDay: z.number().optional(),
  halfDay: z.number().optional(),
  description: z.string(),
  includes: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
})

export const year2026SectionsSchema = z.object({
  privateCoaching: z.array(coachSchema),
  monthlyPrograms: z.record(z.string(), monthlyProgramEntrySchema),
  discounts: z.object({
    earlyBird: discountEntrySchema,
    sibling: discountEntrySchema,
    multiProgram: discountEntrySchema,
    annual: discountEntrySchema,
  }),
  scholarships: z.object({
    available: z.boolean(),
    awardedAnnually: z.number().optional(),
    coverage: z.string().optional(),
    email: z.string().optional(),
  }),
  camps: z.array(campSchema),
})

export type Year2026SectionsValidated = z.infer<typeof year2026SectionsSchema>
/** Single source for year2026 shape; use this type instead of duplicating. */
export type Year2026Sections = Year2026SectionsValidated

/**
 * Parse year2026 slice; throws if invalid (for use in server component).
 */
export function parseYear2026Sections(data: unknown): Year2026Sections {
  return year2026SectionsSchema.parse(data)
}

/**
 * Parse programs array; throws if invalid.
 */
export function parsePrograms(data: unknown): z.infer<typeof programsArraySchema> {
  return programsArraySchema.parse(data)
}

const ustaLeagueSchema = z.object({
  id: z.number(),
  name: z.string(),
  season: z.string(),
  weeks: z.string(),
  format: z.string(),
  levels: z.string(),
  pricing12: z.string(),
  pricing14: z.string(),
  weeklyApprox: z.string(),
  deadline: z.string(),
})

const utrDivisionSchema = z.object({
  name: z.string(),
  level: z.string(),
  format: z.string(),
  price: z.string(),
  time: z.string(),
  venue: z.string(),
})

const leaguesDataSchema = z.object({
  usta: z.object({
    totalSeasonCost: z.number(),
    ustaMembershipAnnual: z.number(),
    leagues: z.array(ustaLeagueSchema),
  }),
  utr: z.object({
    seasonLabel: z.string().optional(),
    divisions: z.array(utrDivisionSchema),
  }),
})

export type LeaguesDataValidated = z.infer<typeof leaguesDataSchema>
/** Single source for leagues shape; use this type instead of duplicating. */
export type LeaguesData = LeaguesDataValidated

/**
 * Parse leagues data (data/leagues-2026.json); throws if invalid.
 */
export function parseLeagues(data: unknown): LeaguesData {
  return leaguesDataSchema.parse(data)
}
