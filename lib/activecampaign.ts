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

/** LBTA Master List ID */
export const LBTA_LIST_ID = 4

// ============================================================
// Tag Definitions - Single Source of Truth
// ============================================================

/**
 * Class/Program Tags
 * These segment contacts by their enrolled program
 */
export const CLASS_TAGS = {
  // Junior Programs (Moulton Meadows)
  little_tennis_stars: 49,
  red_ball: 38,
  orange_ball: 39,
  green_dot: 40,

  // Youth Programs
  youth_development: 21,
  high_performance: 41,

  // Adult Programs
  adult_beginner: 17,
  adult_beginner_bridge: 42,
  adult_intermediate: 16,
  adult_advanced: 15,

  // Fitness Programs
  cardio: 14,
  live_ball_advanced: 18,
  live_ball_intermediate: 19,
  live_ball_dropin: 20,

  // Seasonal
  summer_camp: 13,

  // Special
  private_lessons: 48,
} as const

/**
 * Seasonal/Campaign Tags
 */
export const CAMPAIGN_TAGS = {
  winter_2026: 27,
  website_registration: 33,
  trial_request: 82,
  not_sure: 81,
  jtt_spring_2026: 107,  // JTT Spring 2026 registrations (triggers email automation)
} as const

/**
 * Lead Source Tags
 */
export const SOURCE_TAGS = {
  youth_development_lead: 24,
  high_performance_lead: 25,
  adult_programming_lead: 26,
} as const

/**
 * Map source tags to default class tags
 */
export const SOURCE_TO_CLASS_TAG: Record<number, number> = {
  [SOURCE_TAGS.youth_development_lead]: CLASS_TAGS.youth_development,
  [SOURCE_TAGS.high_performance_lead]: CLASS_TAGS.high_performance,
  [SOURCE_TAGS.adult_programming_lead]: CLASS_TAGS.adult_beginner,
}

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
  if (program.includes('green dot')) return CLASS_TAGS.green_dot

  // Youth Programs
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
      console.error('[AC] Contact creation failed:', error)
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
      console.error('[AC] List subscription failed:', error)
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
      console.error(`[AC] Tag ${tagId} application failed:`, error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error(`[AC] Tag ${tagId} application error:`, error)
    return { success: false, error: String(error) }
  }
}

/**
 * Add multiple tags to a contact
 */
export async function addTags(
  contactId: string | number,
  tagIds: number[]
): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0

  for (const tagId of tagIds) {
    const result = await addTag(contactId, tagId)
    if (result.success) {
      success++
    } else {
      failed++
    }
  }

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
