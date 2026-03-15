/**
 * LBTA Registration Form Configuration.
 *
 * Maps program IDs to metadata consumed by the RegistrationModal
 * component and the `/api/register-program` route, which handles
 * Notion database entry, ActiveCampaign contact creation,
 * list subscription, and class-specific tag application.
 *
 * Pricing for the registration modal is loaded from data/pricing-supplemental.json
 * (registrationModalPricing) so there is a single source of truth in /data.
 */

import { registrationModalPricing } from '@/lib/pricing-supplemental'

function getModalPricing(programId: string): string {
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
    billingCycle: 'quarterly' | 'monthly'
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
    classTagId: 49 // class:little_tennis_stars
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
    classTagId: 38 // class:red_ball
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
    classTagId: 39 // class:orange_ball
  },

  'orange-ball-match-play': {
    programId: 'orange-ball-match-play',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Orange Ball Match Play',
      location: 'Moulton Meadows',
      duration: '1 hr',
      pricing: getModalPricing('orange-ball-match-play'),
      category: 'Junior',
      ageGroup: '7-8 years',
      billingCycle: 'monthly'
    },
    classTagId: 39 // class:orange_ball (match play uses same tag)
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
    classTagId: 40 // class:green_dot
  },

  'green-dot-match-play': {
    programId: 'green-dot-match-play',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Green Dot Match Play',
      location: 'Moulton Meadows',
      duration: '1 hr',
      pricing: getModalPricing('green-dot-match-play'),
      category: 'Junior',
      ageGroup: '9-11 years',
      billingCycle: 'monthly'
    },
    classTagId: 40 // class:green_dot (match play uses same tag)
  },

  // ===== YOUTH PROGRAMS =====
  'youth-development': {
    programId: 'youth-development',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Youth Development',
      location: 'Alta Laguna Park',
      duration: '1.5 hr',
      pricing: getModalPricing('youth-development'),
      category: 'Youth',
      ageGroup: '11-15 years',
      billingCycle: 'quarterly'
    },
    classTagId: 21 // class:youth_development
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
      ageGroup: '12-17 years (UTR 5-8)',
      billingCycle: 'quarterly'
    },
    classTagId: 41 // class:high_performance
  },

  // ===== ADULT PROGRAMS (LBHS & Moulton Meadows) =====
  'adult-beginner-1': {
    programId: 'adult-beginner-1',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Adult Beginner 1',
      location: 'Laguna Beach High School',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-beginner-1'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 17 // class:adult_beginner
  },

  'adult-beginner-2': {
    programId: 'adult-beginner-2',
    formEmbedCode: '', // Using native form
    acFormId: '',
    prePopulateData: {
      programName: 'Adult Beginner 2 (Bridge)',
      location: 'Moulton Meadows',
      duration: '1.5 hr',
      pricing: getModalPricing('adult-beginner-2'),
      category: 'Adult',
      billingCycle: 'quarterly'
    },
    classTagId: 42 // class:adult_beginner_bridge
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
    classTagId: 16 // class:adult_intermediate
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
    classTagId: 15 // class:adult_advanced
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
    classTagId: 14 // class:cardio
  },

  'liveball-intermediate': {
    programId: 'liveball-intermediate',
    formEmbedCode: '', // TO BE FILLED
    acFormId: '',
    prePopulateData: {
      programName: 'LiveBall Intermediate',
      location: 'Moulton Meadows / LBHS',
      duration: '1 hr',
      pricing: getModalPricing('liveball-intermediate'),
      category: 'Fitness',
      billingCycle: 'monthly'
    },
    classTagId: 19 // class:live_ball_intermediate
  },

  'liveball-advanced': {
    programId: 'liveball-advanced',
    formEmbedCode: '', // TO BE FILLED
    acFormId: '',
    prePopulateData: {
      programName: 'LiveBall Advanced',
      location: 'Laguna Beach High School',
      duration: '1.5 hr',
      pricing: getModalPricing('liveball-advanced'),
      category: 'Fitness',
      billingCycle: 'monthly'
    },
    classTagId: 18 // class:live_ball_advanced
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
    classTagId: 60 // camp:swim_tennis
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
    classTagId: 61 // camp:ski_week
  },

  'spring-break': {
    programId: 'spring-break',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Spring Break Camp',
      location: 'Laguna Beach High School',
      duration: '6 hours (9 AM - 3 PM)',
      pricing: getModalPricing('spring-break'),
      category: 'Camp',
      ageGroup: '5-14 years',
      billingCycle: 'quarterly'
    },
    classTagId: 62 // camp:spring_break
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
    classTagId: 63 // camp:summer
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
    classTagId: 64 // camp:back_to_school
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
    classTagId: 65 // camp:thanksgiving
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
    classTagId: 66 // camp:winter_break
  },

  // ===== JTT (Junior Team Tennis) =====
  'spring-jtt': {
    programId: 'spring-jtt',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Spring JTT',
      location: 'Various (Match locations vary)',
      duration: '15 weeks (Jan 12 - Apr 26)',
      pricing: getModalPricing('spring-jtt'),
      category: 'JTT',
      ageGroup: '10U, 12U, 14U, 18U',
      billingCycle: 'quarterly'
    },
    classTagId: 70 // jtt:spring
  },

  'fall-jtt': {
    programId: 'fall-jtt',
    formEmbedCode: '',
    acFormId: '',
    prePopulateData: {
      programName: 'Fall JTT',
      location: 'Various (Match locations vary)',
      duration: '12 weeks (Sep 5 - Nov 22)',
      pricing: getModalPricing('fall-jtt'),
      category: 'JTT',
      ageGroup: '10U, 12U, 14U, 18U',
      billingCycle: 'quarterly'
    },
    classTagId: 71 // jtt:fall
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
