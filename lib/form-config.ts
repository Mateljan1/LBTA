/**
 * LBTA Registration Form Configuration.
 *
 * Maps program IDs to metadata consumed by the RegistrationModal
 * component and the `/api/register-program` route, which handles
 * Notion database entry, ActiveCampaign contact creation,
 * list subscription, and class-specific tag application.
 *
 * Pricing for the registration modal is loaded from data/pricing-supplemental.json
 * (registrationModalPricing) except `utr-circuit`, which is derived from
 * data/leagues-2026.json via lib/utr-circuit-modal-pricing.ts.
 */

import { registrationModalPricing } from '@/lib/pricing-supplemental'
import { getUtrCircuitModalPricingSummary } from '@/lib/utr-circuit-modal-pricing'
import { getUtrCircuitFormDuration } from '@/lib/utr-match-play'

function getModalPricing(programId: string): string {
  if (programId === 'utr-circuit') {
    return getUtrCircuitModalPricingSummary()
  }
  return registrationModalPricing[programId] ?? 'Contact for pricing'
}

/**
 * Shape of a single program's registration configuration.
 * Each entry drives the RegistrationModal UI and the API-side
 * ActiveCampaign tagging logic.
 */
export interface FormConfig {
  /** Unique slug used as the dictionary key (e.g. `'red-ball'`). */
  programId: string
  /** @deprecated Legacy embed code — unused with native forms. */
  formEmbedCode: string
  /** @deprecated Legacy AC form ID — unused with native forms. */
  acFormId: string
  /** Data pre-filled into the registration modal and forwarded to the API. */
  prePopulateData: {
    programName: string
    location: string
    duration: string
    pricing: string
    category: string
    ageGroup?: string
    billingCycle: 'quarterly' | 'monthly' | 'season'
  }
  /** ActiveCampaign tag ID applied by the API route for this program. */
  classTagId: number
}

// Program Configuration for Native Form Submissions
// Native forms submit to /api/register-program which handles:
// - Notion database entry
// - ActiveCampaign contact creation
// - List subscription (List ID 4)
// - Class-specific tag application
export const FORM_CONFIGS: Record<string, FormConfig> = {
  // ===== JUNIOR PROGRAMS (Moulton Meadows) =====
  'little-stars': {
    programId: 'little-stars',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Little Tennis Stars',
      location: 'Moulton Meadows',
      duration: '45 min',
      pricing: getModalPricing('little-stars'),
      category: 'Junior',
      ageGroup: '3-5 years',
      billingCycle: 'quarterly'
    },
    classTagId: 144 // CLASS_TAGS.little_tennis_stars
  },

  'red-ball': {
    programId: 'red-ball',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Red Ball Tennis',
      location: 'Moulton Meadows',
      duration: '1 hr',
      pricing: getModalPricing('red-ball'),
      category: 'Junior',
      ageGroup: '5-6 years',
      billingCycle: 'quarterly'
    },
    classTagId: 145 // CLASS_TAGS.red_ball
  },

  'orange-ball': {
    programId: 'orange-ball',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Orange Ball Tennis',
      location: 'Moulton Meadows',
      duration: '1 hr',
      pricing: getModalPricing('orange-ball'),
      category: 'Junior',
      ageGroup: '7-8 years',
      billingCycle: 'quarterly'
    },
    classTagId: 146 // CLASS_TAGS.orange_ball
  },

  'green-dot': {
    programId: 'green-dot',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Green Dot Tennis',
      location: 'Moulton Meadows',
      duration: '1 hr',
      pricing: getModalPricing('green-dot'),
      category: 'Junior',
      ageGroup: '9-11 years',
      billingCycle: 'quarterly'
    },
    classTagId: 147 // CLASS_TAGS.green_dot
  },

  // ===== YOUTH PROGRAMS =====
  'youth-development': {
    programId: 'youth-development',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Junior Development',
      location: 'Laguna Beach High School',
      duration: '2 hr',
      pricing: getModalPricing('youth-development'),
      category: 'Youth',
      ageGroup: '11-18 years',
      billingCycle: 'quarterly'
    },
    classTagId: 148 // CLASS_TAGS.youth_development
  },

  'high-performance': {
    programId: 'high-performance',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'High Performance',
      location: 'Laguna Beach High School',
      duration: '2 hr',
      pricing: getModalPricing('high-performance'),
      category: 'Youth',
      ageGroup: '12-17 years (UTR 8+)',
      billingCycle: 'quarterly'
    },
    classTagId: 149 // CLASS_TAGS.high_performance
  },

  // ===== ADULT PROGRAMS (LBHS & Moulton Meadows) =====
  'adult-beginner-1': {
    programId: 'adult-beginner-1',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'New to Tennis',
      location: 'Laguna Beach High School',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-beginner-1'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 150 // CLASS_TAGS.adult_beginner
  },

  'adult-beginner-2': {
    programId: 'adult-beginner-2',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Beyond Beginner',
      location: 'Moulton Meadows',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-beginner-2'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 195 // CLASS_TAGS.adult_beginner_bridge
  },

  'adult-intermediate': {
    programId: 'adult-intermediate',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Adult Intermediate',
      location: 'Laguna Beach High School',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-intermediate'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 151 // CLASS_TAGS.adult_intermediate
  },

  'adult-advanced': {
    programId: 'adult-advanced',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Adult Advanced',
      location: 'Laguna Beach High School',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-advanced'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 152 // CLASS_TAGS.adult_advanced
  },

  // ===== FITNESS PROGRAMS =====
  'cardio-tennis': {
    programId: 'cardio-tennis',
    formEmbedCode: '', // TO BE FILLED
    acFormId: '',
    prePopulateData: {
      programName: 'Cardio Tennis',
      location: 'Laguna Beach High School',
      duration: '1 hr',
      pricing: getModalPricing('cardio-tennis'),
      category: 'Fitness',
      billingCycle: 'monthly'
    },
    classTagId: 155 // CLASS_TAGS.cardio
  },

  'liveball': {
    programId: 'liveball',
    formEmbedCode: '', // TO BE FILLED
    acFormId: '',
    prePopulateData: {
      programName: 'LiveBall',
      location: 'Moulton Meadows Park / LBHS',
      duration: '1-1.5 hr',
      pricing: getModalPricing('liveball'),
      category: 'Fitness',
      billingCycle: 'monthly'
    },
    classTagId: 153 // CLASS_TAGS.live_ball
  },

  // ===== CAMPS =====
  'swim-tennis': {
    programId: 'swim-tennis',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Swim & Tennis Camp',
      location: 'Alta Laguna Park',
      duration: '6 hours (9 AM - 3 PM)',
      pricing: getModalPricing('swim-tennis'),
      category: 'Camp',
      ageGroup: '5-11 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  'ski-week': {
    programId: 'ski-week',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Ski Week Camp',
      location: 'Laguna Beach High School',
      duration: '6 hours (9 AM - 3 PM)',
      pricing: getModalPricing('ski-week'),
      category: 'Camp',
      ageGroup: '5-14 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  'spring-break': {
    programId: 'spring-break',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Spring Break Camp',
      location: 'Alta Laguna Park & Laguna Beach High School',
      duration: 'Morning & afternoon half-day sessions (times vary by track)',
      pricing: getModalPricing('spring-break'),
      category: 'Camp',
      ageGroup: '5-17 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  'summer-camp': {
    programId: 'summer-camp',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Summer Camps',
      location: 'Laguna Beach High School',
      duration: '6 hours (9 AM - 3 PM)',
      pricing: getModalPricing('summer-camp'),
      category: 'Camp',
      ageGroup: '5-17 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp
  },

  'back-to-school': {
    programId: 'back-to-school',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Back-to-School Mini Camp',
      location: 'Laguna Beach High School',
      duration: '4 hours (9 AM - 1 PM)',
      pricing: getModalPricing('back-to-school'),
      category: 'Camp',
      ageGroup: '5-14 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  'thanksgiving': {
    programId: 'thanksgiving',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Thanksgiving Camp',
      location: 'Laguna Beach High School',
      duration: '4 hours (9 AM - 1 PM)',
      pricing: getModalPricing('thanksgiving'),
      category: 'Camp',
      ageGroup: '5-14 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  'winter-break': {
    programId: 'winter-break',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Winter Break Camp',
      location: 'Laguna Beach High School',
      duration: '4 hours (9 AM - 1 PM)',
      pricing: getModalPricing('winter-break'),
      category: 'Camp',
      ageGroup: '5-14 years',
      billingCycle: 'quarterly'
    },
    classTagId: 156 // CLASS_TAGS.summer_camp (general camp tag)
  },

  // ===== UTR Match Play Series (registrationType utr-circuit; replaces JTT) =====
  'utr-circuit': {
    programId: 'utr-circuit',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'UTR Match Play Series — Season 1',
      location: 'Alta Laguna Park & LBHS',
      duration: getUtrCircuitFormDuration(),
      pricing: getModalPricing('utr-circuit'),
      category: 'Match Play Series',
      ageGroup: 'All Ages (level-based divisions)',
      billingCycle: 'season'
    },
    classTagId: 242 // program:utr-circuit
  },
}

/** Look up a program's registration config by slug. Returns `null` if not found. */
export function getFormConfig(programId: string): FormConfig | null {
  return FORM_CONFIGS[programId] || null
}

/** Return every configured program slug (useful for validation or iteration). */
export function getAllConfiguredPrograms(): string[] {
  return Object.keys(FORM_CONFIGS)
}

/** Check whether a given program slug has a registration configuration. */
export function hasFormConfig(programId: string): boolean {
  return programId in FORM_CONFIGS
}

/** Return just the pre-populate payload for a program, or `null` if missing. */
export function getPrepopulateData(programId: string): FormConfig['prePopulateData'] | null {
  const config = getFormConfig(programId)
  return config?.prePopulateData || null
}

/** Return the ActiveCampaign tag ID for a program, or `null` if missing. */
export function getClassTagId(programId: string): number | null {
  const config = getFormConfig(programId)
  return config?.classTagId || null
}
