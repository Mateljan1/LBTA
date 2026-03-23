/**
 * Consolidated ActiveCampaign Integration Module
 * Single source of truth for all AC operations
 */

import { getEnvVar } from './env'

// ============================================================
// Configuration
// ============================================================

const AC_URL = () => getEnvVar('ACTIVECAMPAIGN_URL')
const AC_API_KEY = () => getEnvVar('ACTIVECAMPAIGN_API_KEY')

/** LBTA Master List ID — all contacts (website + sync) go here for segmentation. */
export const LBTA_LIST_ID = 4

/**
 * Optional: list used ONLY by website form submissions. When set, the single AC automation
 * should trigger only on "Contact added to this list" so synced/tagged contacts never get confirmation emails.
 * Create list in AC (e.g. "LBTA Website Signups"), then set ACTIVECAMPAIGN_WEBSITE_SIGNUPS_LIST_ID in Vercel.
 */
export function getWebsiteSignupsListId(): number | null {
  const id = process.env.ACTIVECAMPAIGN_WEBSITE_SIGNUPS_LIST_ID
  if (!id) return null
  const n = parseInt(id, 10)
  return Number.isNaN(n) || n <= 0 ? null : n
}

// ============================================================
// Tag Definitions - Single Source of Truth
// ============================================================

/**
 * Class/Program Tags
 * These segment contacts by their enrolled program
 */
export const CLASS_TAGS = {
  // Junior Programs (Moulton Meadows)
  little_tennis_stars: 144,
  red_ball: 145,
  orange_ball: 146,
  green_dot: 147,

  // Junior Programs (competitive track)
  green_dot_competitive: 239, // program:green-dot-competitive (created 2026-03-19)

  // Youth Programs
  youth_development: 148,     // legacy — use youth_dev_tier1/tier2 for new registrations
  youth_dev_tier1: 240,       // program:youth-dev-tier1 (UTR 1.5-3.0, created 2026-03-19)
  youth_dev_tier2: 241,       // program:youth-dev-tier2 (UTR 3.0-5.0, created 2026-03-19)
  high_performance: 149,

  // Adult Programs
  adult_beginner: 150,
  adult_beginner_bridge: 195,
  adult_intermediate: 151,
  adult_advanced: 152,

  // Fitness Programs
  cardio: 155,
  live_ball_advanced: 154,
  live_ball_intermediate: 153,
  live_ball_dropin: 238,  // program:liveball-dropin (created 2026-03-18)

  // Seasonal
  summer_camp: 156,

  // Special
  private_lessons: 157,
} as const

/**
 * Seasonal/Campaign Tags
 */
export const CAMPAIGN_TAGS = {
  winter_2026: 228,           // season:winter-2026
  spring_2026: 227,           // season:spring-2026
  website_registration: 180,  // source:website-form
  trial_request: 208,         // interest:trial-class
  not_sure: 216,              // interest:general
  utr_circuit: 242,           // program:utr-circuit (created 2026-03-19, replaces jtt_program)
  /** @deprecated Use utr_circuit (242) instead. Tag 197 still exists in AC as program:jtt */
  jtt_program: 197,           // program:jtt — DEPRECATED, kept for backward compat
  spring26_returning: 167,    // campaign:spring26-returning
  spring26_prospect: 168,     // campaign:spring26-prospect
  scholarship: 237,            // flag:scholarship (created 2026-03-18)
} as const

/**
 * Lead Source Tags — verified against AC API 2026-03-18
 */
export const SOURCE_TAGS = {
  facebook: 178,         // source:facebook
  google: 179,           // source:google
  website_form: 180,     // source:website-form
  referral: 181,         // source:referral
  walk_in: 182,          // source:walk-in
  phone_call: 183,       // source:phone-call
  boys_and_girls_club: 185, // source:boys-and-girls-club
  city_rec: 186,         // source:city-rec
  unknown: 187,          // source:unknown
  usta_tournament: 188,  // source:usta-tournament
} as const

/**
 * Type/Role Tags — verified against AC API 2026-03-18
 */
export const TYPE_TAGS = {
  adult: 189,            // type:adult
  junior: 190,           // type:junior
  parent: 191,           // role:parent
  adult_player: 192,     // role:adult-player
  student: 193,          // role:student
} as const

/**
 * Interest Tags — verified against AC API 2026-03-18
 */
export const INTEREST_TAGS = {
  jtt: 206,              // interest:jtt
  private_lessons: 207,  // interest:private-lessons
  trial_class: 208,      // interest:trial-class
  summer_camp: 209,      // interest:summer-camp
  holiday_camp: 210,     // interest:holiday-camp
  liveball: 211,         // interest:liveball
  adult_program: 212,    // interest:adult-program
  junior_program: 213,   // interest:junior-program
  usta_league: 214,      // interest:usta-league
  utr_circuit: 215,      // interest:utr-circuit
  general: 216,          // interest:general
} as const

/**
 * Status Tags — verified against AC API 2026-03-18
 */
export const STATUS_TAGS = {
  new_lead: 169,         // status:new-lead
  contacted: 170,        // status:contacted
  trial_booked: 171,     // status:trial-booked
  trial_completed: 172,  // status:trial-completed
  enrolled: 173,         // status:enrolled
  active_returning: 174, // status:active-returning
  inactive: 175,         // status:inactive
  not_responsive: 176,   // status:not-responsive
  lost: 177,             // status:lost
} as const

/**
 * Season Tags — verified against AC API 2026-03-18.
 * register-year maps `summer`/`fall` to summer_2025 / fall_2025 until dedicated 2026 season list tags exist in AC.
 */
export const SEASON_TAGS = {
  spring_2026: 227,      // season:spring-2026
  winter_2026: 228,      // season:winter-2026
  fall_2025: 229,        // season:fall-2025
  summer_2025: 230,      // season:summer-2025
  spring_2025: 231,      // season:spring-2025
  pre_2025: 232,         // season:pre-2025
} as const

/**
 * UTR Match Play Series division tags (internal key utr_circuit) — created 2026-03-19
 * Five skill-based divisions (replaces JTT)
 */
export const UTR_DIVISION_TAGS = {
  color_ball: 243,       // utr-division:color-ball (Red/Orange/Green juniors)
  utr_2_4: 244,          // utr-division:2.0-4.0 (Intermediate)
  utr_3_5: 245,          // utr-division:3.0-5.0 (Intermediate+)
  utr_5_7: 246,          // utr-division:5.0-7.0 (Advanced)
  doubles_rr: 247,       // utr-division:doubles-rr (Doubles Round Robin)
} as const

/**
 * @deprecated JTT is discontinued. Use UTR_DIVISION_TAGS instead.
 * Kept for backward compatibility with existing tagged contacts.
 */
export const JTT_TAGS = {
  '10u_orange': 160,     // jtt:10u-orange
  '10u_green': 161,      // jtt:10u-green
  '12u': 162,            // jtt:12u
  '14u': 163,            // jtt:14u
  '18u': 164,            // jtt:18u
} as const

// ============================================================
// Tag Mapping Functions
// ============================================================

/**
 * Map program name to class tag ID
 */
export function getClassTagFromProgram(programName: string): number | null {
  const program = programName.toLowerCase()

  // Junior Programs
  if (program.includes('little stars') || program.includes('little tennis stars')) {
    return CLASS_TAGS.little_tennis_stars
  }
  if (program.includes('red ball')) return CLASS_TAGS.red_ball
  if (program.includes('orange ball')) return CLASS_TAGS.orange_ball
  // Green Dot — check competitive first (more specific)
  if (program.includes('green dot') && program.includes('competitive')) {
    return CLASS_TAGS.green_dot_competitive
  }
  if (program.includes('green dot')) return CLASS_TAGS.green_dot

  // Youth Programs — check tier-specific first
  if (program.includes('youth') && program.includes('tier 2')) return CLASS_TAGS.youth_dev_tier2
  if (program.includes('youth') && program.includes('tier 1')) return CLASS_TAGS.youth_dev_tier1
  if (program.includes('youth development') || program.includes('youth program')) {
    return CLASS_TAGS.youth_development
  }
  if (program.includes('high performance')) return CLASS_TAGS.high_performance

  // Adult Programs (check bridge/beginner 2 first)
  if (program.includes('bridge') || program.includes('beginner 2')) {
    return CLASS_TAGS.adult_beginner_bridge
  }
  if (program.includes('beginner') && (program.includes('adult') || !program.includes('youth'))) {
    return CLASS_TAGS.adult_beginner
  }
  if (program.includes('intermediate') && (program.includes('adult') || !program.includes('youth'))) {
    return CLASS_TAGS.adult_intermediate
  }
  if (program.includes('advanced') && (program.includes('adult') || !program.includes('live'))) {
    return CLASS_TAGS.adult_advanced
  }

  // Fitness Programs
  if (program.includes('cardio')) return CLASS_TAGS.cardio
  if (program.includes('liveball') || program.includes('live ball')) {
    if (program.includes('advanced')) return CLASS_TAGS.live_ball_advanced
    if (program.includes('intermediate')) return CLASS_TAGS.live_ball_intermediate
    if (program.includes('drop') || program.includes('dropin')) return CLASS_TAGS.live_ball_dropin
    return CLASS_TAGS.live_ball_intermediate // Default
  }

  // Seasonal
  if (program.includes('summer') || program.includes('camp')) return CLASS_TAGS.summer_camp

  // Private
  if (program.includes('private')) return CLASS_TAGS.private_lessons

  return null
}

/**
 * Map tennis level to class tag ID (for adult programs)
 */
export function getClassTagFromLevel(level: string): number | null {
  const normalizedLevel = level.toLowerCase().replace(/[^a-z_]/g, '_')

  const levelMap: Record<string, number> = {
    complete_beginner: CLASS_TAGS.adult_beginner,
    some_experience: CLASS_TAGS.adult_intermediate,
    intermediate_advanced: CLASS_TAGS.adult_advanced,
    beginner: CLASS_TAGS.adult_beginner,
    intermediate: CLASS_TAGS.adult_intermediate,
    advanced: CLASS_TAGS.adult_advanced,
  }

  return levelMap[normalizedLevel] || null
}

/**
 * Map UTR Match Play Series division slug to tag ID
 */
export function getUtrDivisionTag(division: string): number | null {
  const d = division
    .toLowerCase()
    .replace(/[\u2013\u2014\u2212]/g, '-') // en dash, em dash, minus → ASCII hyphen
    .replace(/\s+/g, '-')
  const divisionMap: Record<string, number> = {
    'color-ball': UTR_DIVISION_TAGS.color_ball,
    'color_ball': UTR_DIVISION_TAGS.color_ball,
    'utr-2-4': UTR_DIVISION_TAGS.utr_2_4,
    'utr-2.0-4.0': UTR_DIVISION_TAGS.utr_2_4,
    'utr_2_4': UTR_DIVISION_TAGS.utr_2_4,
    'utr-3-5': UTR_DIVISION_TAGS.utr_3_5,
    'utr-3.0-5.0': UTR_DIVISION_TAGS.utr_3_5,
    'utr_3_5': UTR_DIVISION_TAGS.utr_3_5,
    'utr-5-7': UTR_DIVISION_TAGS.utr_5_7,
    'utr-5.0-7.0': UTR_DIVISION_TAGS.utr_5_7,
    'utr_5_7': UTR_DIVISION_TAGS.utr_5_7,
    'doubles-rr': UTR_DIVISION_TAGS.doubles_rr,
    'doubles-round-robin': UTR_DIVISION_TAGS.doubles_rr,
    'doubles_rr': UTR_DIVISION_TAGS.doubles_rr,
  }
  return divisionMap[d] ?? null
}

// ============================================================
// API Functions
// ============================================================

interface ContactData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  fieldValues?: Array<{ field: string; value: string }>
}

interface ACResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Create or update a contact in ActiveCampaign
 */
export async function upsertContact(contact: ContactData): Promise<ACResponse<{ id: string }>> {
  try {
    const response = await fetch(`${AC_URL()}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': AC_API_KEY(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contact }),
    })

    if (!response.ok) {
      const error = await response.text()
      if (process.env.NODE_ENV === 'production') {
        console.error('[AC] Contact creation failed:', response.status)
      } else {
        const safeMsg = error.length > 100 ? `${error.slice(0, 100)}…` : error
        console.error('[AC] Contact creation failed:', response.status, safeMsg)
      }
      return { success: false, error }
    }

    const data = await response.json()
    return { success: true, data: { id: data.contact.id } }
  } catch (error) {
    console.error('[AC] Contact creation error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Add a contact to a list
 */
export async function addToList(
  contactId: string | number,
  listId: number = LBTA_LIST_ID
): Promise<ACResponse<void>> {
  try {
    const response = await fetch(`${AC_URL()}/api/3/contactLists`, {
      method: 'POST',
      headers: {
        'Api-Token': AC_API_KEY(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactList: {
          list: listId,
          contact: contactId,
          status: 1, // Active subscriber
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      if (process.env.NODE_ENV === 'production') {
        console.error('[AC] List subscription failed:', response.status)
      } else {
        const safeMsg = error.length > 100 ? `${error.slice(0, 100)}…` : error
        console.error('[AC] List subscription failed:', response.status, safeMsg)
      }
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('[AC] List subscription error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Add a tag to a contact
 */
export async function addTag(
  contactId: string | number,
  tagId: number
): Promise<ACResponse<void>> {
  try {
    const response = await fetch(`${AC_URL()}/api/3/contactTags`, {
      method: 'POST',
      headers: {
        'Api-Token': AC_API_KEY(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactTag: {
          contact: contactId,
          tag: tagId.toString(),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      if (process.env.NODE_ENV === 'production') {
        console.error(`[AC] Tag ${tagId} application failed:`, response.status)
      } else {
        const safeMsg = error.length > 100 ? `${error.slice(0, 100)}…` : error
        console.error(`[AC] Tag ${tagId} application failed:`, response.status, safeMsg)
      }
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error(`[AC] Tag ${tagId} application error:`, error)
    return { success: false, error: String(error) }
  }
}

/**
 * Add multiple tags to a contact (in parallel)
 */
export async function addTags(
  contactId: string | number,
  tagIds: number[]
): Promise<{ success: number; failed: number }> {
  if (tagIds.length === 0) return { success: 0, failed: 0 }
  const results = await Promise.all(tagIds.map((tagId) => addTag(contactId, tagId)))
  const success = results.filter((r) => r.success).length
  const failed = results.length - success
  return { success, failed }
}

/**
 * Get contact details including custom fields and tags
 */
export async function getContact(
  contactId: string | number
): Promise<ACResponse<{
  contact: Record<string, unknown>
  fieldValues: Array<{ field: string; value: string }>
  tags: number[]
}>> {
  try {
    // Fetch contact, field values, and tags in parallel
    const [contactRes, fieldsRes, tagsRes] = await Promise.all([
      fetch(`${AC_URL()}/api/3/contacts/${contactId}`, {
        headers: { 'Api-Token': AC_API_KEY() },
      }),
      fetch(`${AC_URL()}/api/3/contacts/${contactId}/fieldValues`, {
        headers: { 'Api-Token': AC_API_KEY() },
      }),
      fetch(`${AC_URL()}/api/3/contacts/${contactId}/contactTags`, {
        headers: { 'Api-Token': AC_API_KEY() },
      }),
    ])

    if (!contactRes.ok || !fieldsRes.ok || !tagsRes.ok) {
      return { success: false, error: 'Failed to fetch contact data' }
    }

    const [contactData, fieldsData, tagsData] = await Promise.all([
      contactRes.json(),
      fieldsRes.json(),
      tagsRes.json(),
    ])

    return {
      success: true,
      data: {
        contact: contactData.contact,
        fieldValues: fieldsData.fieldValues || [],
        tags: (tagsData.contactTags || []).map((ct: { tag: string }) => parseInt(ct.tag)),
      },
    }
  } catch (error) {
    console.error('[AC] Get contact error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Check if contact is on a specific list
 */
export async function isOnList(
  contactId: string | number,
  listId: number = LBTA_LIST_ID
): Promise<boolean> {
  try {
    const response = await fetch(`${AC_URL()}/api/3/contacts/${contactId}/contactLists`, {
      headers: { 'Api-Token': AC_API_KEY() },
    })

    if (!response.ok) return false

    const data = await response.json()
    const memberships = data.contactLists || []

    return memberships.some(
      (lm: { list: string; status: string }) =>
        lm.list === listId.toString() && lm.status === '1'
    )
  } catch {
    return false
  }
}

/**
 * Helper: Determine program category from name
 */
export function getProgramCategory(programName: string): 'Junior' | 'Youth' | 'Adult' | 'Fitness' {
  const program = programName.toLowerCase()

  if (
    program.includes('little stars') ||
    program.includes('red ball') ||
    program.includes('orange ball') ||
    program.includes('green dot')
  ) {
    return 'Junior'
  }

  if (program.includes('youth development') || program.includes('high performance')) {
    return 'Youth'
  }

  if (
    program.includes('cardio') ||
    program.includes('liveball') ||
    program.includes('family tennis') ||
    program.includes('match play')
  ) {
    return 'Fitness'
  }

  return 'Adult'
}
