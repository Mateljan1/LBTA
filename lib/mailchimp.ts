/**
 * Mailchimp Marketing API integration — LBTA primary lead destination.
 *
 * Replaces ActiveCampaign as the CRM sink for all website form submissions.
 * Env: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_AUDIENCE_ID
 *
 * Audience: Laguna Beach Tennis Academy (30bbabe32c, 2,641 members as of 2026-06-12)
 * Server: us1
 *
 * Tag vocabulary (string-based, not numeric IDs — simpler than AC):
 * ─────────────────────────────────────────────────────────────────
 * Source tags:      source:website-form · source:newsletter
 * Interest tags:    interest:trial-class · interest:general
 * Program tags:     program:little-tennis-stars · program:red-ball · program:orange-ball
 *                   program:green-dot · program:green-dot-competitive
 *                   program:youth-dev-tier1 · program:youth-dev-tier2
 *                   program:high-performance · program:adult-beginner
 *                   program:adult-beginner-bridge · program:adult-intermediate
 *                   program:adult-advanced · program:cardio · program:live-ball-advanced
 *                   program:live-ball-intermediate · program:live-ball-dropin
 *                   program:summer-camp · program:private-lessons · program:utr-circuit
 * Season tags:      season:spring-2026 · season:winter-2026 · season:fall-2025 · season:summer-2025
 * Type tags:        type:adult · type:junior · role:parent · role:adult-player
 * Status tags:      status:new-lead · status:trial-booked · status:enrolled
 * Form type tags:   form:trial · form:register · form:newsletter · form:scholarship
 *                   form:private-lesson · form:contact · form:racquet-rescue
 * Flag tags:        flag:scholarship
 * ─────────────────────────────────────────────────────────────────
 *
 * Migration from ActiveCampaign tag IDs → Mailchimp tag strings:
 *   AC CAMPAIGN_TAGS.website_registration (180) → source:website-form
 *   AC CAMPAIGN_TAGS.trial_request (208)         → interest:trial-class
 *   AC CAMPAIGN_TAGS.not_sure (216)              → interest:general
 *   AC CAMPAIGN_TAGS.scholarship (237)           → flag:scholarship
 *   AC season tags                               → season:* string equivalents
 *   AC CLASS_TAGS (144-157, 195, 238-241)       → program:* string equivalents
 */

import crypto from 'crypto'

// ============================================================
// Configuration
// ============================================================

function getApiKey(): string | null {
  return process.env.MAILCHIMP_API_KEY ?? null
}

function getServerPrefix(): string | null {
  const key = getApiKey()
  if (!key) return null
  // Key format: 'xxxxxx-usN' — server prefix is the suffix after the last hyphen
  const prefix = key.split('-').pop() ?? null
  // Also accept explicit override
  return process.env.MAILCHIMP_SERVER_PREFIX ?? prefix
}

function getAudienceId(): string | null {
  return process.env.MAILCHIMP_AUDIENCE_ID ?? '30bbabe32c'
}

export function isMailchimpConfigured(): boolean {
  return !!getApiKey() && !!getServerPrefix() && !!getAudienceId()
}

function apiBase(): string {
  return `https://${getServerPrefix()}.api.mailchimp.com/3.0`
}

function authHeader(): Record<string, string> {
  return {
    Authorization: `Basic ${Buffer.from(`anystring:${getApiKey()}`).toString('base64')}`,
    'Content-Type': 'application/json',
  }
}

/** MD5 hash of lowercased email — Mailchimp subscriber hash */
function subscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex')
}

// ============================================================
// Types
// ============================================================

export interface MCMemberParams {
  email: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  /** Extra merge fields beyond FNAME/LNAME/PHONE */
  mergeFields?: Record<string, string>
}

export interface MCResponse<T = void> {
  success: boolean
  data?: T
  error?: string
}

// ============================================================
// Core API: upsert member
// ============================================================

/**
 * Create or update a Mailchimp subscriber (PUT = upsert).
 * Never errors — failures are logged + returned as success:false.
 */
export async function upsertMember(
  params: MCMemberParams
): Promise<MCResponse<{ id: string; email: string }>> {
  if (!isMailchimpConfigured()) {
    console.warn('[MC] Mailchimp not configured — skipping upsert')
    return { success: false, error: 'Mailchimp not configured' }
  }

  const { email, firstName, lastName, phone, mergeFields } = params
  const hash = subscriberHash(email)
  const audienceId = getAudienceId()!

  const body: Record<string, unknown> = {
    email_address: email.toLowerCase().trim(),
    status_if_new: 'subscribed',
    merge_fields: {
      ...(firstName ? { FNAME: firstName } : {}),
      ...(lastName ? { LNAME: lastName } : {}),
      ...(phone ? { PHONE: phone } : {}),
      ...(mergeFields ?? {}),
    },
  }

  try {
    const res = await fetch(
      `${apiBase()}/lists/${audienceId}/members/${hash}`,
      {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[MC] upsertMember failed:', res.status, text.slice(0, 200))
      return { success: false, error: `HTTP ${res.status}: ${text.slice(0, 120)}` }
    }

    const json = (await res.json()) as { id: string; email_address: string }
    return { success: true, data: { id: json.id, email: json.email_address } }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[MC] upsertMember error:', msg)
    return { success: false, error: msg }
  }
}

// ============================================================
// Core API: tag management
// ============================================================

/**
 * Add tags to a member (by email). Mailchimp uses string tag names — no numeric IDs.
 * Tags are created automatically if they don't exist.
 * Never errors — failures are logged + returned as success:false.
 */
export async function addMemberTags(
  email: string,
  tags: string[]
): Promise<MCResponse> {
  if (!isMailchimpConfigured()) {
    console.warn('[MC] Mailchimp not configured — skipping tag add')
    return { success: false, error: 'Mailchimp not configured' }
  }

  if (tags.length === 0) return { success: true }

  const hash = subscriberHash(email)
  const audienceId = getAudienceId()!

  const body = {
    tags: tags.map((name) => ({ name, status: 'active' })),
  }

  try {
    const res = await fetch(
      `${apiBase()}/lists/${audienceId}/members/${hash}/tags`,
      {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(body),
      }
    )

    // 204 No Content = success
    if (res.status === 204 || res.ok) return { success: true }

    const text = await res.text().catch(() => '')
    console.error('[MC] addMemberTags failed:', res.status, text.slice(0, 200))
    return { success: false, error: `HTTP ${res.status}: ${text.slice(0, 120)}` }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[MC] addMemberTags error:', msg)
    return { success: false, error: msg }
  }
}

// ============================================================
// Combined helper: upsert + tag in one call
// ============================================================

/**
 * Upsert a member and immediately apply tags.
 * This is the primary function for form routes to use.
 * Returns success:true if upsert succeeded (tag failures are logged but not fatal).
 */
export async function upsertAndTag(
  params: MCMemberParams,
  tags: string[]
): Promise<MCResponse<{ id: string; email: string }>> {
  const upsertResult = await upsertMember(params)
  if (!upsertResult.success) return upsertResult

  if (tags.length > 0) {
    // Tag failures are non-blocking — member is already in audience
    const tagResult = await addMemberTags(params.email, tags)
    if (!tagResult.success) {
      console.warn('[MC] Tags partially failed for', params.email, tagResult.error)
    }
  }

  return upsertResult
}

// ============================================================
// Tag mapping: AC semantics → Mailchimp string tags
// ============================================================

/**
 * Map a program name (display name or slug) to Mailchimp tag strings.
 * Mirrors lib/activecampaign.ts getClassTagFromProgram() logic.
 */
export function getProgramTags(programName: string): string[] {
  if (!programName) return []
  const p = programName.toLowerCase()
  const tags: string[] = []

  // Junior Programs
  if (p.includes('little stars') || p.includes('little tennis stars')) {
    tags.push('program:little-tennis-stars', 'type:junior')
  } else if (p.includes('red ball')) {
    tags.push('program:red-ball', 'type:junior')
  } else if (p.includes('orange ball')) {
    tags.push('program:orange-ball', 'type:junior')
  } else if (p.includes('green dot') && p.includes('competitive')) {
    tags.push('program:green-dot-competitive', 'type:junior')
  } else if (p.includes('green dot')) {
    tags.push('program:green-dot', 'type:junior')
  }
  // Youth Programs
  else if (p.includes('youth') && p.includes('tier 2')) {
    tags.push('program:youth-dev-tier2', 'type:junior')
  } else if (p.includes('youth') && p.includes('tier 1')) {
    tags.push('program:youth-dev-tier1', 'type:junior')
  } else if (p.includes('youth development') || p.includes('youth program')) {
    tags.push('program:youth-development', 'type:junior')
  } else if (p.includes('high performance')) {
    tags.push('program:high-performance', 'type:junior')
  }
  // Adult Programs
  else if (p.includes('bridge') || p.includes('beginner 2')) {
    tags.push('program:adult-beginner-bridge', 'type:adult')
  } else if (p.includes('beginner') && !p.includes('youth')) {
    tags.push('program:adult-beginner', 'type:adult')
  } else if (p.includes('intermediate') && !p.includes('youth')) {
    tags.push('program:adult-intermediate', 'type:adult')
  } else if (p.includes('advanced') && !p.includes('live')) {
    tags.push('program:adult-advanced', 'type:adult')
  }
  // Fitness Programs
  else if (p.includes('cardio')) {
    tags.push('program:cardio', 'type:adult')
  } else if (p.includes('liveball') || p.includes('live ball')) {
    if (p.includes('advanced')) tags.push('program:live-ball-advanced')
    else if (p.includes('drop') || p.includes('dropin')) tags.push('program:live-ball-dropin')
    else tags.push('program:live-ball-intermediate')
    tags.push('type:adult')
  }
  // Seasonal
  else if (p.includes('summer') || p.includes('camp')) {
    tags.push('program:summer-camp')
  }
  // Private
  else if (p.includes('private')) {
    tags.push('program:private-lessons')
  }
  // UTR/Match Play
  else if (p.includes('utr') || p.includes('match play')) {
    tags.push('program:utr-circuit')
  }

  return tags
}

/**
 * Return the current-season Mailchimp tag string.
 */
export function getCurrentSeasonTag(): string {
  const month = new Date().getMonth()
  if (month <= 2) return 'season:winter-2026'
  if (month <= 5) return 'season:spring-2026'
  if (month <= 8) return 'season:summer-2026'
  return 'season:fall-2026'
}

/**
 * Build standard tag set for a trial request form submission.
 */
export function buildTrialTags(program?: string): string[] {
  const tags = [
    'source:website-form',
    'interest:trial-class',
    'form:trial',
    'status:new-lead',
    getCurrentSeasonTag(),
  ]
  if (program) tags.push(...getProgramTags(program))
  return tags
}

/**
 * Build standard tag set for a contact/general inquiry form submission.
 */
export function buildContactTags(intent?: string): string[] {
  const base = ['source:website-form', 'interest:general', 'status:new-lead', getCurrentSeasonTag()]
  if (intent === 'racquet-rescue') return [...base, 'form:racquet-rescue']
  if (intent === 'registration-assist') return [...base, 'form:registration-assist']
  return [...base, 'form:contact']
}

/**
 * Build standard tag set for a program registration form submission.
 */
export function buildRegistrationTags(program?: string): string[] {
  const tags = [
    'source:website-form',
    'form:register',
    'status:new-lead',
    getCurrentSeasonTag(),
  ]
  if (program) tags.push(...getProgramTags(program))
  return tags
}

/**
 * Build standard tag set for a newsletter signup.
 */
export function buildNewsletterTags(): string[] {
  return ['source:newsletter', 'form:newsletter', getCurrentSeasonTag()]
}

/**
 * Build standard tag set for a scholarship application.
 */
export function buildScholarshipTags(): string[] {
  return [
    'source:website-form',
    'form:scholarship',
    'flag:scholarship',
    'status:new-lead',
    getCurrentSeasonTag(),
  ]
}

/**
 * Build standard tag set for a private lesson request.
 */
export function buildPrivateLessonTags(): string[] {
  return [
    'source:website-form',
    'form:private-lesson',
    'program:private-lessons',
    'status:new-lead',
    getCurrentSeasonTag(),
  ]
}

// ============================================================
// Health check (for canary)
// ============================================================

/**
 * Ping the Mailchimp API to verify the key is valid.
 * Uses GET /ping — the lightest possible endpoint.
 */
export async function pingMailchimp(): Promise<{ ok: boolean; detail: string }> {
  if (!isMailchimpConfigured()) {
    return { ok: false, detail: 'MAILCHIMP_API_KEY / MAILCHIMP_SERVER_PREFIX not set' }
  }

  try {
    const res = await fetch(`${apiBase()}/ping`, {
      method: 'GET',
      headers: authHeader(),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { ok: false, detail: `HTTP ${res.status}: ${body.slice(0, 120)}` }
    }

    const json = (await res.json()) as { health_status?: string }
    return { ok: true, detail: json.health_status ?? 'Everything\'s Chimpy!' }
  } catch (err) {
    return { ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}
