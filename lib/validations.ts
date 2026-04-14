import { z } from 'zod'

// ============================================================
// Shared Validation Schemas for LBTA API Routes
// ============================================================

/**
 * Common field validators
 */
const emailSchema = z.string().email('Invalid email address').max(255)
const phoneSchema = z.string().min(10, 'Phone number too short').max(20)
const nameSchema = z.string().min(1, 'Name is required').max(100)

/** UTR Color Ball division label (matches `data/leagues-2026.json` `utr.divisions[].name`). */
export const UTR_COLOR_BALL_DIVISION_NAME = 'Color Ball' as const

export const colorBallStageSchema = z.enum(['red', 'orange', 'green'])

/**
 * Coach Hub login — password only (no PII in logs).
 * Max length limits buffer size for timing-safe compare and mitigates DoS.
 */
export const coachHubAuthSchema = z.object({
  password: z.string().min(1, 'Password is required').max(512, 'Invalid password'),
})

export const utrTrackerAdminAuthSchema = z.object({
  password: z.string().min(1, 'Password is required').max(512, 'Invalid password'),
})

const divisionSchema = z.enum(['sat_utr_singles', 'sun_singles', 'sun_doubles'])
const utrTrackerMatchWriteModeSchema = z.enum([
  'append',
  'replace_week_division_date',
])

export const utrTrackerMatchInputSchema = z
  .object({
    week: z.coerce.number().int().min(1).max(8),
    date: z.string().min(1, 'Date is required').max(20),
    division: divisionSchema,
    is_doubles: z.boolean().default(false),
    player1_name: z.string().min(1).max(120),
    player1_utr: z.coerce.number().min(0).max(20),
    player1_provisional: z.boolean().default(false),
    player2_name: z.string().min(1).max(120),
    player2_utr: z.coerce.number().min(0).max(20),
    player2_provisional: z.boolean().default(false),
    player3_name: z.string().max(120).optional(),
    player3_utr: z.coerce.number().min(0).max(20).optional(),
    player3_provisional: z.boolean().default(false),
    player4_name: z.string().max(120).optional(),
    player4_utr: z.coerce.number().min(0).max(20).optional(),
    player4_provisional: z.boolean().default(false),
    score: z.string().min(1).max(60),
    winner_slot: z.coerce.number().int().min(1).max(4),
  })
  .superRefine((data, ctx) => {
    if (data.is_doubles || data.division === 'sun_doubles') {
      if (!data.player3_name || !data.player4_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Doubles matches require player3_name and player4_name.',
          path: ['player3_name'],
        })
      }
      if (data.winner_slot !== 1 && data.winner_slot !== 2 && data.winner_slot !== 3 && data.winner_slot !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'winner_slot must be 1-4 for doubles.',
          path: ['winner_slot'],
        })
      }
    } else if (data.winner_slot !== 1 && data.winner_slot !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'winner_slot must be 1 or 2 for singles.',
        path: ['winner_slot'],
      })
    }
  })

export const utrTrackerMatchesBulkSchema = z.object({
  matches: z.array(utrTrackerMatchInputSchema).min(1).max(200),
  write_mode: utrTrackerMatchWriteModeSchema.optional().default('append'),
})

export const utrTrackerColorBallEntrySchema = z.object({
  player_id: z.string().uuid('Invalid player id'),
  attended: z.boolean(),
  completed_match: z.boolean(),
  matches_played: z.coerce.number().int().min(0).max(20),
  coach_badges: z.array(z.string().min(1).max(64)).max(20).default([]),
})

export const utrTrackerColorBallBatchSchema = z.object({
  week: z.coerce.number().int().min(1).max(8),
  entries: z.array(utrTrackerColorBallEntrySchema).min(1).max(200),
})

export const utrTrackerPlayerInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  utr: z.coerce.number().min(0).max(20).nullable().optional(),
  divisions: z.array(z.enum(['sat_color_ball', 'sat_utr_singles', 'sun_singles', 'sun_doubles'])).default([]),
  color_ball_stage: z.enum(['red', 'orange', 'green']).nullable().optional(),
  is_color_ball: z.boolean().default(false),
  social_opt_in: z.boolean().default(false),
  season_registration: z.boolean().default(true),
  is_drop_in: z.boolean().default(false),
  provisional_utr: z.boolean().default(false),
  joined_week: z.coerce.number().int().min(1).max(8).default(1),
})

export const utrTrackerPlayersBatchSchema = z.object({
  players: z.array(utrTrackerPlayerInputSchema).min(1).max(200),
})

/**
 * Base contact schema used across multiple forms
 */
export const contactSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
})

/**
 * Program registration schema
 * Used by: /api/register-program
 */
export const programRegistrationSchema = contactSchema.extend({
  program: z.string().min(1, 'Program is required').max(200),
  location: z.string().max(200).optional(),
  studentName: z.string().max(200).optional(),
  studentAge: z.union([z.string(), z.number()]).optional(),
  preferredDays: z.array(z.string().max(50)).max(31).optional().default([]),
  timeSlot: z.string().max(100).optional(),
  totalPrice: z.union([z.string(), z.number()]).optional(),
  experience: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
})

export type ProgramRegistration = z.infer<typeof programRegistrationSchema>

/**
 * JTT (Junior Team Tennis) registration schema
 * Used by: /api/jtt-registration
 */
export const jttRegistrationSchema = z.object({
  // Player info
  playerFirstName: nameSchema,
  playerLastName: nameSchema,
  playerDOB: z.string().min(1, 'Date of birth is required'),
  playerAge: z.union([z.string(), z.number()]),
  playerGrade: z.string().max(20).optional(),
  playerSchool: z.string().max(200).optional(),

  // Parent info
  parentFirstName: nameSchema,
  parentLastName: nameSchema,
  parentEmail: emailSchema,
  parentPhone: phoneSchema,
  parentAddress: z.string().min(1, 'Address is required').max(500),
  parentCity: z.string().min(1, 'City is required').max(100),
  parentZip: z.string().min(5, 'ZIP code is required').max(10),

  // Emergency contact
  emergencyName: nameSchema,
  emergencyPhone: phoneSchema,
  emergencyRelation: z.string().min(1, 'Relationship is required').max(100),

  // Team selection
  division: z.string().min(1, 'Division is required'),
  shirtSize: z.string().min(1, 'Shirt size is required'),

  // USTA
  ustaRegistered: z.enum(['yes', 'no']),
  ustaMemberNumber: z.string().max(50).optional(),

  // Experience
  experienceLevel: z.string().min(1, 'Experience level is required'),
  currentUTR: z.string().max(10).optional(),

  // Payment
  paymentPreference: z.string().min(1, 'Payment preference is required'),
  cardAuthConsent: z.boolean().optional(),

  // Sibling
  hasSibling: z.enum(['yes', 'no']).optional(),
  siblingName: z.string().max(200).optional(),

  // Medical & notes
  medicalNotes: z.string().max(2000).optional(),
  additionalNotes: z.string().max(2000).optional(),

  // Consent
  photoConsent: z.boolean().optional(),
  liabilityConsent: z.boolean(),
})

export type JTTRegistration = z.infer<typeof jttRegistrationSchema>

/**
 * Trial booking schema
 * Used by: /api/book
 */
export const bookingSchema = contactSchema.extend({
  program: z.string().max(200).optional(),
  /** Routing / ops (e.g. homepage-cta → AC field 11). */
  source: z.string().max(120).optional(),
  location: z.string().max(200).optional(),
  preferredDays: z.array(z.string().max(50)).max(31).optional().default([]),
  experience: z.string().max(200).optional(),
  goals: z.string().max(1000).optional(),
  /** Contact page body; persisted to Notion / ops email when source is contact-page. */
  message: z.string().max(2000).optional(),
})

export type BookingRequest = z.infer<typeof bookingSchema>

/**
 * Private lesson booking schema
 * Used by: /api/book when bookingType === 'private'
 */
export const privateLessonBookingSchema = contactSchema.extend({
  bookingType: z.literal('private'),
  coach: z.string().min(1, 'Please select a coach').max(200),
  option: z.enum(['60', '90', '10-pack', '20-pack']),
  message: z.string().max(500).optional(),
})

export type PrivateLessonBookingRequest = z.infer<typeof privateLessonBookingSchema>

/**
 * Newsletter signup schema
 * Used by: /api/newsletter
 */
export const newsletterSchema = z.object({
  email: emailSchema,
})

export type NewsletterSignup = z.infer<typeof newsletterSchema>

/**
 * Chat widget schema
 * Used by: /api/chat
 */
export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000),
  })).max(50).optional().default([]),
})

export type ChatPayload = z.infer<typeof chatSchema>

/**
 * Year-round registration schema (seasonal, camp, UTR Match Play Series / utr-circuit, etc.)
 * Used by: /api/register-year
 */
export const registerYearSchema = z.object({
  registrationType: z.enum(['seasonal', 'camp', 'utr-circuit', 'private', 'inquiry']).optional().default('seasonal'),
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  program: z.string().min(1, 'Program is required').max(200),
  studentName: z.string().max(200).optional(),
  playerName: z.string().max(200).optional(),
  preferredDays: z.array(z.string().max(50)).max(31).optional().default([]),
  location: z.string().max(200).optional(),
  timeSlot: z.string().max(100).optional(),
  totalPrice: z.union([z.string(), z.number()]).optional(),
  price: z.union([z.string(), z.number()]).optional(),
  studentAge: z.union([z.string(), z.number()]).optional(),
  playerAge: z.union([z.string(), z.number()]).optional(),
  season: z.string().max(50).optional(),
  experience: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  programId: z.string().max(100).optional(),
  campId: z.string().max(100).optional(),
  campName: z.string().max(200).optional(),
  campDates: z.string().max(200).optional(),
  campWeek: z.string().max(100).optional(),
  division: z.string().max(100).optional(),
  /** Red / orange / green — required when division is Color Ball (UTR Match Play). */
  colorBallStage: colorBallStageSchema.optional(),
  /** Self-reported UTR for UTR Match Play Series (optional). */
  currentUtr: z.string().max(20).optional(),
})
  .passthrough()
  .superRefine((data, ctx) => {
    if (
      data.registrationType === 'utr-circuit' &&
      data.division === UTR_COLOR_BALL_DIVISION_NAME &&
      !data.colorBallStage
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select red, orange, or green ball stage for Color Ball.',
        path: ['colorBallStage'],
      })
    }
  })

export type RegisterYearRequest = z.infer<typeof registerYearSchema>

/**
 * Stripe Checkout session for UTR full-season registration (server resolves price from catalog).
 * Used by: POST /api/checkout/utr-season
 */
export const utrCheckoutSessionSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    program: z.string().min(1, 'Program is required').max(200),
    programId: z.string().max(100).optional(),
    division: z.string().min(1, 'Division is required').max(100),
    playerName: z.string().max(200).optional(),
    playerAge: z.union([z.string(), z.number()]).optional(),
    experience: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
    currentUtr: z.string().max(20).optional(),
    colorBallStage: colorBallStageSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.division === UTR_COLOR_BALL_DIVISION_NAME && !data.colorBallStage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select red, orange, or green ball stage.',
        path: ['colorBallStage'],
      })
    }
  })

export type UtrCheckoutSessionPayload = z.infer<typeof utrCheckoutSessionSchema>

/**
 * Scholarship application schema
 * Used by: /api/scholarship
 */
export const scholarshipSchema = z.object({
  studentName: nameSchema,
  parentName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  studentGPA: z.string().max(20).optional(),
  householdIncome: z.string().max(100).optional(),
  sessionsPerWeek: z.union([z.string(), z.number()]).optional(),
  commitment: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
}).passthrough()

export type ScholarshipApplication = z.infer<typeof scholarshipSchema>

/**
 * General registration schema (contact + player info)
 * Used by: /api/register
 */
export const registerSchema = contactSchema.extend({
  age: z.union([z.string(), z.number()]),
  skillLevel: z.string().min(1, 'Skill level is required').max(100),
  experience: z.string().min(1, 'Experience is required').max(500),
  program: z.string().max(200).optional(),
  season: z.string().max(50).optional(),
  earlyBird: z.boolean().optional(),
  finalPrice: z.union([z.string(), z.number()]).optional(),
  goals: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
})

export type RegisterRequest = z.infer<typeof registerSchema>

/**
 * ActiveCampaign webhook payload schema
 * Used by: /api/activecampaign-webhook
 */
export const webhookPayloadSchema = z.object({
  contact: z.object({
    id: z.union([z.string(), z.number()]).optional(),
    email: z.string().optional(),
  }).optional(),
  contact_id: z.union([z.string(), z.number()]).optional(),
  id: z.union([z.string(), z.number()]).optional(),
  email: z.string().optional(),
}).passthrough() // Allow additional fields from AC

export type WebhookPayload = z.infer<typeof webhookPayloadSchema>

/**
 * Parse JSON body from request. Returns 400 result on invalid JSON (SyntaxError).
 * Use in API routes for consistent client-error handling.
 */
export async function parseJsonBody(
  request: Request
): Promise<{ ok: true; data: unknown } | { ok: false; status: 400 }> {
  try {
    const data = await request.json()
    return { ok: true, data }
  } catch {
    return { ok: false, status: 400 }
  }
}

/**
 * Validate request body with a Zod schema
 * Returns parsed data or throws with user-friendly error message
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ')
    return { success: false, error: `Validation failed: ${errors}` }
  }

  return { success: true, data: result.data }
}
