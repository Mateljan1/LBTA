import { describe, it, expect } from 'vitest'
import {
  bookingSchema,
  programRegistrationSchema,
  jttRegistrationSchema,
  newsletterSchema,
  registerYearSchema,
  scholarshipSchema,
  registerSchema,
  validateRequest,
} from './validations'
import { RATE_LIMITS } from './rate-limit'

// ---------------------------------------------------------------------------
// Route export verification
// Each API route must export a named POST function.
// We import the route modules and assert their shape.
// ---------------------------------------------------------------------------

describe('API route exports', () => {
  it('/api/book exports POST', async () => {
    const mod = await import('@/app/api/book/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/register-program exports POST', async () => {
    const mod = await import('@/app/api/register-program/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/jtt-registration exports POST', async () => {
    const mod = await import('@/app/api/jtt-registration/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/newsletter exports POST', async () => {
    const mod = await import('@/app/api/newsletter/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/register-year exports POST', async () => {
    const mod = await import('@/app/api/register-year/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/scholarship exports POST', async () => {
    const mod = await import('@/app/api/scholarship/route')
    expect(typeof mod.POST).toBe('function')
  })

  it('/api/register exports POST', async () => {
    const mod = await import('@/app/api/register/route')
    expect(typeof mod.POST).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// Rate limit configuration sanity checks
// ---------------------------------------------------------------------------

describe('Rate limit configurations', () => {
  it('defines all expected tiers', () => {
    expect(RATE_LIMITS.api).toBeDefined()
    expect(RATE_LIMITS.form).toBeDefined()
    expect(RATE_LIMITS.sensitive).toBeDefined()
    expect(RATE_LIMITS.webhook).toBeDefined()
  })

  it('form limit allows at least 5 requests per window', () => {
    expect(RATE_LIMITS.form.maxRequests).toBeGreaterThanOrEqual(5)
  })

  it('form window is at least 30 seconds', () => {
    expect(RATE_LIMITS.form.interval).toBeGreaterThanOrEqual(30_000)
  })

  it('api limit allows at least 50 requests', () => {
    expect(RATE_LIMITS.api.maxRequests).toBeGreaterThanOrEqual(50)
  })

  it('sensitive limit is stricter than api limit', () => {
    expect(RATE_LIMITS.sensitive.maxRequests).toBeLessThan(RATE_LIMITS.api.maxRequests)
  })

  it('webhook limit allows high throughput', () => {
    expect(RATE_LIMITS.webhook.maxRequests).toBeGreaterThanOrEqual(100)
  })
})

// ---------------------------------------------------------------------------
// Schema contract tests per API route
// Each block tests: valid payload, missing required fields, invalid email
// ---------------------------------------------------------------------------

describe('bookingSchema (/api/book)', () => {
  const valid = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '9495551234',
  }

  it('accepts valid booking payload', () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts booking with optional fields', () => {
    const data = { ...valid, program: 'Adult Beginner', goals: 'Improve serve' }
    expect(bookingSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing firstName', () => {
    const { firstName, ...rest } = valid
    expect(bookingSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing lastName', () => {
    const { lastName, ...rest } = valid
    expect(bookingSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(bookingSchema.safeParse({ ...valid, email: 'not-email' }).success).toBe(false)
  })

  it('rejects empty email', () => {
    expect(bookingSchema.safeParse({ ...valid, email: '' }).success).toBe(false)
  })

  it('validateRequest returns structured success', () => {
    const result = validateRequest(bookingSchema, valid)
    expect(result.success).toBe(true)
  })

  it('validateRequest returns structured error for bad input', () => {
    const result = validateRequest(bookingSchema, { email: 'bad' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error).toContain('Validation failed')
  })
})

describe('programRegistrationSchema (/api/register-program)', () => {
  const valid = {
    firstName: 'Parent',
    lastName: 'Smith',
    email: 'parent@example.com',
    phone: '9495551234',
    program: 'Junior Development',
  }

  it('accepts valid registration', () => {
    expect(programRegistrationSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing program', () => {
    expect(programRegistrationSchema.safeParse({ ...valid, program: '' }).success).toBe(false)
  })

  it('rejects missing email', () => {
    const { email, ...rest } = valid
    expect(programRegistrationSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(
      programRegistrationSchema.safeParse({ ...valid, email: 'nope' }).success
    ).toBe(false)
  })

  it('rejects missing phone', () => {
    const { phone, ...rest } = valid
    expect(programRegistrationSchema.safeParse(rest).success).toBe(false)
  })
})

describe('jttRegistrationSchema (/api/jtt-registration)', () => {
  const valid = {
    playerFirstName: 'Alex',
    playerLastName: 'Smith',
    playerDOB: '2014-03-15',
    playerAge: 12,
    parentFirstName: 'Mike',
    parentLastName: 'Smith',
    parentEmail: 'mike@example.com',
    parentPhone: '9495551234',
    parentAddress: '123 Main St',
    parentCity: 'Laguna Beach',
    parentZip: '92651',
    emergencyName: 'Sarah Smith',
    emergencyPhone: '9495559876',
    emergencyRelation: 'Mother',
    division: '12U Intermediate',
    shirtSize: 'YM',
    ustaRegistered: 'yes' as const,
    experienceLevel: 'intermediate',
    paymentPreference: 'full',
    liabilityConsent: true,
  }

  it('accepts valid JTT registration', () => {
    expect(jttRegistrationSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing playerFirstName', () => {
    const { playerFirstName, ...rest } = valid
    expect(jttRegistrationSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing division', () => {
    expect(jttRegistrationSchema.safeParse({ ...valid, division: '' }).success).toBe(false)
  })

  it('rejects invalid parentEmail', () => {
    expect(
      jttRegistrationSchema.safeParse({ ...valid, parentEmail: 'bad' }).success
    ).toBe(false)
  })

  it('rejects missing liabilityConsent', () => {
    const { liabilityConsent, ...rest } = valid
    expect(jttRegistrationSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid ustaRegistered enum', () => {
    expect(
      jttRegistrationSchema.safeParse({ ...valid, ustaRegistered: 'maybe' }).success
    ).toBe(false)
  })
})

describe('newsletterSchema (/api/newsletter)', () => {
  it('accepts valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'user@example.com' }).success).toBe(true)
  })

  it('rejects missing email', () => {
    expect(newsletterSchema.safeParse({}).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'not-valid' }).success).toBe(false)
  })

  it('rejects empty string email', () => {
    expect(newsletterSchema.safeParse({ email: '' }).success).toBe(false)
  })
})

describe('registerYearSchema (/api/register-year)', () => {
  const valid = {
    firstName: 'Parent',
    lastName: 'User',
    email: 'parent@example.com',
    phone: '9495551234',
    program: 'Junior Development',
  }

  it('accepts valid year registration', () => {
    expect(registerYearSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts with registrationType', () => {
    expect(
      registerYearSchema.safeParse({ ...valid, registrationType: 'camp' }).success
    ).toBe(true)
  })

  it('rejects missing program', () => {
    expect(registerYearSchema.safeParse({ ...valid, program: '' }).success).toBe(false)
  })

  it('rejects missing firstName', () => {
    const { firstName, ...rest } = valid
    expect(registerYearSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(registerYearSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
  })

  it('rejects invalid registrationType', () => {
    expect(
      registerYearSchema.safeParse({ ...valid, registrationType: 'invalid' }).success
    ).toBe(false)
  })
})

describe('scholarshipSchema (/api/scholarship)', () => {
  const valid = {
    studentName: 'Student Name',
    parentName: 'Parent Name',
    email: 'parent@example.com',
  }

  it('accepts valid scholarship application', () => {
    expect(scholarshipSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts with optional phone', () => {
    expect(
      scholarshipSchema.safeParse({ ...valid, phone: '9495551234' }).success
    ).toBe(true)
  })

  it('rejects missing studentName', () => {
    expect(
      scholarshipSchema.safeParse({ ...valid, studentName: '' }).success
    ).toBe(false)
  })

  it('rejects missing parentName', () => {
    expect(
      scholarshipSchema.safeParse({ ...valid, parentName: '' }).success
    ).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(
      scholarshipSchema.safeParse({ ...valid, email: 'bad-email' }).success
    ).toBe(false)
  })
})

describe('registerSchema (/api/register)', () => {
  const valid = {
    firstName: 'Guest',
    lastName: 'Player',
    email: 'guest@example.com',
    phone: '9495551234',
    age: 30,
    skillLevel: 'Intermediate',
    experience: '5 years recreational',
  }

  it('accepts valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing age', () => {
    const { age, ...rest } = valid
    expect(registerSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing skillLevel', () => {
    expect(registerSchema.safeParse({ ...valid, skillLevel: '' }).success).toBe(false)
  })

  it('rejects missing experience', () => {
    expect(registerSchema.safeParse({ ...valid, experience: '' }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(registerSchema.safeParse({ ...valid, email: 'x' }).success).toBe(false)
  })

  it('rejects missing email', () => {
    const { email, ...rest } = valid
    expect(registerSchema.safeParse(rest).success).toBe(false)
  })
})
