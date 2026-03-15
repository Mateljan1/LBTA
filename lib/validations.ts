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
  preferredDays: z.array(z.string()).optional().default([]),
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
  location: z.string().max(200).optional(),
  preferredDays: z.array(z.string()).optional().default([]),
  experience: z.string().max(200).optional(),
  goals: z.string().max(1000).optional(),
})

export type BookingRequest = z.infer<typeof bookingSchema>

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
 * Year-round registration schema (seasonal, camp, JTT, etc.)
 * Used by: /api/register-year
 */
export const registerYearSchema = z.object({
  registrationType: z.enum(['seasonal', 'camp', 'jtt', 'swim-tennis', 'private', 'inquiry']).optional().default('seasonal'),
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  program: z.string().min(1, 'Program is required').max(200),
  studentName: z.string().max(200).optional(),
  playerName: z.string().max(200).optional(),
  preferredDays: z.array(z.string()).optional().default([]),
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
  jttId: z.string().max(100).optional(),
  jttSeason: z.string().max(100).optional(),
  division: z.string().max(100).optional(),
}).passthrough()

export type RegisterYearRequest = z.infer<typeof registerYearSchema>

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
