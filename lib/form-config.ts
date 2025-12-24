// LBTA Registration Form Configuration
// Maps program IDs to their metadata for native form submissions
// Forms use RegistrationModal component which submits to /api/register-program
// API applies class-specific ActiveCampaign tags automatically

export interface FormConfig {
  programId: string
  formEmbedCode: string  // Legacy field - not used with native forms
  acFormId: string       // Legacy field - not used with native forms
  prePopulateData: {
    programName: string
    location: string
    duration: string
    pricing: string
    category: string
    ageGroup?: string
    billingCycle: 'quarterly' | 'monthly'
  }
  classTagId: number // ActiveCampaign tag ID for this specific program (applied by API route)
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
      pricing: '$260 (1x/week) - $520 (2x/week)',
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
      pricing: '$546 (1x/week) - $1,092 (2x/week)',
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
      pricing: '$546/quarter',
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
      pricing: '$85/month',
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
      pricing: '$546/quarter',
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
      pricing: '$85/month',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: 'Contact for pricing',
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
      pricing: '$495/week',
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
      pricing: '$525/week',
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
      pricing: '$525/week',
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
      pricing: '$725/week (Full Day) | $425/week (Half Day)',
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
      pricing: '$325/3 days',
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
      pricing: '$325/3 days',
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
      pricing: '$425/session (4 days)',
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
      pricing: '$2,350 (10U) | $2,800 (12U-18U)',
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
      pricing: '$2,350 (10U) | $2,800 (12U-18U)',
      category: 'JTT',
      ageGroup: '10U, 12U, 14U, 18U',
      billingCycle: 'quarterly'
    },
    classTagId: 71 // jtt:fall
  },
}

// Helper function to get form config by program ID
export function getFormConfig(programId: string): FormConfig | null {
  return FORM_CONFIGS[programId] || null
}

// Helper function to get all configured program IDs
export function getAllConfiguredPrograms(): string[] {
  return Object.keys(FORM_CONFIGS)
}

// Helper function to check if a program has a configuration
export function hasFormConfig(programId: string): boolean {
  return programId in FORM_CONFIGS
}

// Helper function to get pre-populate data for native form submission
export function getPrepopulateData(programId: string): FormConfig['prePopulateData'] | null {
  const config = getFormConfig(programId)
  return config?.prePopulateData || null
}

// Helper function to get class tag ID for a program
export function getClassTagId(programId: string): number | null {
  const config = getFormConfig(programId)
  return config?.classTagId || null
}
