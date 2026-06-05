/**
 * Airtable lead capture for LBTA website form submissions.
 *
 * Writes to the "Lead Master" table in "LBTA Contacts - SOT" base.
 * Base ID: appoUVf4OIpfoNSfF  /  Table ID: tblF7rAMB4Kmzx6Uy
 *
 * Env: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_LEADS_TABLE_ID
 * Failures are logged only — they never affect the API response.
 */

const AIRTABLE_API = 'https://api.airtable.com/v0'

/** Category of form submission — controls Sales Stage and LBTA Lead Category. */
export type AirtableLeadCategory =
  | 'trial'
  | 'registration'
  | 'newsletter'
  | 'contact'
  | 'private'
  | 'scholarship'
  | 'racquet-rescue'
  | 'registration-assist'

export type AirtableLeadParams = {
  name: string
  email: string
  phone?: string | null
  /** Program interest or detail — e.g. "Red Ball Tennis" */
  program?: string | null
  /** Raw form source identifier for audit trail */
  formSource?: string | null
  category: AirtableLeadCategory
}

function getConfig(): { apiKey: string; baseId: string; tableId: string } | null {
  const apiKey = process.env.AIRTABLE_API_KEY?.trim()
  const baseId = process.env.AIRTABLE_BASE_ID?.trim()
  const tableId = process.env.AIRTABLE_LEADS_TABLE_ID?.trim()
  if (!apiKey || !baseId || !tableId) return null
  return { apiKey, baseId, tableId }
}

function salesStageFromCategory(category: AirtableLeadCategory): string {
  switch (category) {
    case 'trial':
    case 'private':
      return 'Trial / Inquiry'
    case 'registration':
    case 'registration-assist':
      return 'Warm Lead'
    case 'newsletter':
      return 'Nurture'
    case 'contact':
    case 'scholarship':
    case 'racquet-rescue':
      return 'Trial / Inquiry'
    default:
      return 'Warm Lead'
  }
}

function leadCategoryFromCategory(category: AirtableLeadCategory): string {
  switch (category) {
    case 'trial':
    case 'private':
    case 'registration-assist':
      return 'Program Lead - Ready'
    case 'registration':
      return 'Program Lead - Ready'
    case 'newsletter':
      return 'Newsletter Only'
    case 'scholarship':
      return 'Program Lead - Ready'
    case 'contact':
    case 'racquet-rescue':
      return 'Program Lead - Ready'
    default:
      return 'Program Lead - Ready'
  }
}

/**
 * Create a lead record in Airtable Lead Master table.
 * Returns a Promise — callers should wrap in waitUntil() for reliable delivery.
 * Silently no-ops if AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_LEADS_TABLE_ID are not set.
 */
export async function sendToAirtable(params: AirtableLeadParams): Promise<void> {
  const config = getConfig()
  if (!config) return

  const { name, email, phone, program, formSource, category } = params

  const sourceDetail = [
    program && `Program: ${program}`,
    formSource && `Form: ${formSource}`,
  ]
    .filter(Boolean)
    .join('\n') || undefined

  const fields: Record<string, unknown> = {
    Name: name.trim(),
    Email: email.trim().toLowerCase(),
    Source: 'Website',
    'Lead Source Type': 'Website Lead',
    'Sales Stage': salesStageFromCategory(category),
    'LBTA Lead Category': leadCategoryFromCategory(category),
  }

  if (phone?.trim()) fields['Phone'] = phone.trim()
  if (program?.trim()) fields['Class Interests'] = program.trim()
  if (sourceDetail) fields['Lead Source Detail'] = sourceDetail

  try {
    const res = await fetch(
      `${AIRTABLE_API}/${config.baseId}/${config.tableId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[airtable] Create record failed:', res.status, text.slice(0, 200))
    }
  } catch (err) {
    console.error('[airtable] Error:', err instanceof Error ? err.message : err)
  }
}
