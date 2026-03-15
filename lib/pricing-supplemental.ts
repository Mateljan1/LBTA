/**
 * Load and validate data/pricing-supplemental.json.
 * Single parse at module load; form-config and site-copy consume this.
 * See docs/data-sources.md for pricing-supplemental as source for modal + site copy.
 */

import { z } from 'zod'
import raw from '@/data/pricing-supplemental.json'

const siteCopySchema = z.object({
  stickyCtaSchedules: z.string().optional(),
  beginnerProgramCohort: z.string().optional(),
  campsHeading: z.string().optional(),
}).strict()

const pricingSupplementalSchema = z.object({
  registrationModalPricing: z.record(z.string(), z.string()),
  siteCopy: siteCopySchema.optional().default({}),
}).passthrough()

export type PricingSupplementalValidated = z.infer<typeof pricingSupplementalSchema>

let parsed: PricingSupplementalValidated
try {
  parsed = pricingSupplementalSchema.parse(raw)
} catch (e) {
  console.error('Invalid data/pricing-supplemental.json:', e)
  throw e
}

export const registrationModalPricing: Record<string, string> = parsed.registrationModalPricing
export const siteCopy = parsed.siteCopy
