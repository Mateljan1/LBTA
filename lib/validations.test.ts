import { describe, it, expect } from 'vitest'
import {
  contactSchema,
  newsletterSchema,
  registerYearSchema,
  scholarshipSchema,
  bookingSchema,
  programRegistrationSchema,
  jttRegistrationSchema,
  registerSchema,
  validateRequest,
} from './validations'

describe('contactSchema', () => {
  it('accepts valid contact', () => {
    const data = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '9495551234',
    }
    expect(contactSchema.safeParse(data).success).toBe(true)
  })

  it('rejects invalid email', () => {
    const data = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'not-an-email',
      phone: '9495551234',
    }
    expect(contactSchema.safeParse(data).success).toBe(false)
  })

  it('rejects short phone', () => {
    const data = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '123',
    }
    expect(contactSchema.safeParse(data).success).toBe(false)
  })
})

describe('newsletterSchema', () => {
  it('accepts valid email', () => {
    expect(newsletterSchema.safeParse({ email: 'sub@example.com' }).success).toBe(true)
  })

  it('rejects invalid email', () => {
    expect(newsletterSchema.safeParse({ email: 'bad' }).success).toBe(false)
  })
})

describe('registerYearSchema', () => {
  it('accepts minimal valid payload', () => {
    const data = {
      firstName: 'Parent',
      lastName: 'User',
      email: 'parent@example.com',
      phone: '9495551234',
      program: 'Junior Development',
    }
    expect(registerYearSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing program', () => {
    const data = {
      firstName: 'Parent',
      lastName: 'User',
      email: 'parent@example.com',
      phone: '9495551234',
      program: '',
    }
    expect(registerYearSchema.safeParse(data).success).toBe(false)
  })

  it('accepts optional registrationType', () => {
    const data = {
      registrationType: 'camp',
      firstName: 'Parent',
      lastName: 'User',
      email: 'parent@example.com',
      phone: '9495551234',
      program: 'Summer Camp',
    }
    expect(registerYearSchema.safeParse(data).success).toBe(true)
  })
})

describe('scholarshipSchema', () => {
  it('accepts valid application', () => {
    const data = {
      studentName: 'Student Name',
      parentName: 'Parent Name',
      email: 'parent@example.com',
    }
    expect(scholarshipSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing studentName', () => {
    const data = {
      studentName: '',
      parentName: 'Parent',
      email: 'p@example.com',
    }
    expect(scholarshipSchema.safeParse(data).success).toBe(false)
  })
})

describe('bookingSchema', () => {
  it('accepts valid booking', () => {
    const data = {
      firstName: 'Guest',
      lastName: 'User',
      email: 'guest@example.com',
      phone: '9495551234',
    }
    expect(bookingSchema.safeParse(data).success).toBe(true)
  })
})

describe('programRegistrationSchema', () => {
  const validBase = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    phone: '9495551234',
    program: 'Junior Development',
  }

  it('accepts valid registration with required fields only', () => {
    expect(programRegistrationSchema.safeParse(validBase).success).toBe(true)
  })

  it('accepts registration with all optional fields', () => {
    const data = {
      ...validBase,
      location: 'Alta Laguna Park',
      studentName: 'Junior Doe',
      studentAge: 12,
      preferredDays: ['Monday', 'Wednesday'],
      timeSlot: '4:00 PM',
      totalPrice: 497,
      experience: 'Beginner',
      notes: 'Looking forward to starting',
    }
    expect(programRegistrationSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing program', () => {
    const data = { ...validBase, program: '' }
    expect(programRegistrationSchema.safeParse(data).success).toBe(false)
  })

  it('rejects missing contact fields', () => {
    const { firstName, ...noFirst } = validBase
    expect(programRegistrationSchema.safeParse(noFirst).success).toBe(false)
  })

  it('accepts studentAge as string or number', () => {
    expect(programRegistrationSchema.safeParse({ ...validBase, studentAge: '14' }).success).toBe(true)
    expect(programRegistrationSchema.safeParse({ ...validBase, studentAge: 14 }).success).toBe(true)
  })

  it('defaults preferredDays to empty array', () => {
    const result = programRegistrationSchema.safeParse(validBase)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.preferredDays).toEqual([])
    }
  })
})

describe('jttRegistrationSchema', () => {
  const validJTT = {
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
    expect(jttRegistrationSchema.safeParse(validJTT).success).toBe(true)
  })

  it('accepts with all optional fields', () => {
    const data = {
      ...validJTT,
      playerGrade: '6th',
      playerSchool: 'Laguna Beach Middle',
      ustaMemberNumber: '123456789',
      currentUTR: '3.5',
      cardAuthConsent: true,
      hasSibling: 'yes' as const,
      siblingName: 'Emma Smith',
      medicalNotes: 'None',
      additionalNotes: 'Excited to play',
      photoConsent: true,
    }
    expect(jttRegistrationSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing player name', () => {
    const { playerFirstName, ...missing } = validJTT
    expect(jttRegistrationSchema.safeParse(missing).success).toBe(false)
  })

  it('rejects missing emergency contact', () => {
    const { emergencyName, ...missing } = validJTT
    expect(jttRegistrationSchema.safeParse(missing).success).toBe(false)
  })

  it('rejects missing division', () => {
    const data = { ...validJTT, division: '' }
    expect(jttRegistrationSchema.safeParse(data).success).toBe(false)
  })

  it('rejects missing liabilityConsent', () => {
    const { liabilityConsent, ...missing } = validJTT
    expect(jttRegistrationSchema.safeParse(missing).success).toBe(false)
  })

  it('rejects invalid ustaRegistered value', () => {
    const data = { ...validJTT, ustaRegistered: 'maybe' }
    expect(jttRegistrationSchema.safeParse(data).success).toBe(false)
  })

  it('rejects short ZIP code', () => {
    const data = { ...validJTT, parentZip: '926' }
    expect(jttRegistrationSchema.safeParse(data).success).toBe(false)
  })
})

describe('registerSchema', () => {
  const validRegister = {
    firstName: 'Guest',
    lastName: 'Player',
    email: 'guest@example.com',
    phone: '9495551234',
    age: 30,
    skillLevel: 'Intermediate',
    experience: '5 years recreational',
  }

  it('accepts valid registration', () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true)
  })

  it('accepts with all optional fields', () => {
    const data = {
      ...validRegister,
      program: 'Adult Intermediate',
      season: 'Spring 2026',
      earlyBird: true,
      finalPrice: 497,
      goals: 'Improve my serve',
      notes: 'Available weekday evenings',
    }
    expect(registerSchema.safeParse(data).success).toBe(true)
  })

  it('rejects missing skillLevel', () => {
    const data = { ...validRegister, skillLevel: '' }
    expect(registerSchema.safeParse(data).success).toBe(false)
  })

  it('rejects missing experience', () => {
    const data = { ...validRegister, experience: '' }
    expect(registerSchema.safeParse(data).success).toBe(false)
  })

  it('accepts age as string or number', () => {
    expect(registerSchema.safeParse({ ...validRegister, age: '30' }).success).toBe(true)
    expect(registerSchema.safeParse({ ...validRegister, age: 30 }).success).toBe(true)
  })

  it('rejects missing age', () => {
    const { age, ...missing } = validRegister
    expect(registerSchema.safeParse(missing).success).toBe(false)
  })

  it('accepts finalPrice as string or number', () => {
    expect(registerSchema.safeParse({ ...validRegister, finalPrice: '$497' }).success).toBe(true)
    expect(registerSchema.safeParse({ ...validRegister, finalPrice: 497 }).success).toBe(true)
  })
})

describe('validateRequest', () => {
  it('returns success and data when valid', () => {
    const result = validateRequest(newsletterSchema, { email: 'ok@example.com' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('ok@example.com')
    }
  })

  it('returns success false and error message when invalid', () => {
    const result = validateRequest(newsletterSchema, { email: 'invalid' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toContain('Validation failed')
    }
  })
})
