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
