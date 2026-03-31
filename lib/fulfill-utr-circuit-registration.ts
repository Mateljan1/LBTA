/**
 * UTR Match Play Series (utr-circuit / legacy jtt) — Notion, ActiveCampaign, GHL, leads, ops email, confirmation.
 * Shared by POST /api/register-year and Stripe webhook after successful payment.
 */

import { waitUntil } from '@vercel/functions'
import { Client } from '@notionhq/client'
import { getEnvVar, hasEnvVar } from '@/lib/env'
import {
  upsertContact,
  addToList,
  addTags,
  LBTA_LIST_ID,
  getWebsiteSignupsListId,
} from '@/lib/activecampaign'
import { storeLead } from '@/lib/leads-store'
import { sendToGHL } from '@/lib/gohighlevel'
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'
import { FORM_CONFIGS } from '@/lib/form-config'
import type { RegisterYearRequest } from '@/lib/validations'
import { determineCategory, type RegistrationType, getApplicableTags } from '@/lib/register-year-shared'

let notionClient: Client | null = null
function getNotionClient(): Client {
  if (!notionClient) {
    notionClient = new Client({ auth: getEnvVar('NOTION_API_KEY') })
  }
  return notionClient
}

function buildUtrNotes(data: RegisterYearRequest, paymentStripeSessionId?: string): string {
  const parts = [data.notes?.trim()].filter(Boolean) as string[]
  if (data.colorBallStage) {
    parts.push(`Color Ball stage: ${data.colorBallStage} ball`)
  }
  if (data.currentUtr?.trim()) {
    parts.push(`Self-reported UTR: ${data.currentUtr.trim()}`)
  }
  if (paymentStripeSessionId) {
    parts.push(`Paid via Stripe — session ${paymentStripeSessionId}`)
  }
  return parts.join(' | ')
}

export async function fulfillUtrCircuitRegistration(
  data: RegisterYearRequest,
  options: { paymentStripeSessionId?: string } = {}
): Promise<{ acSynced: boolean }> {
  const registrationType = (data.registrationType || 'utr-circuit') as RegistrationType
  const category = determineCategory(data.program, registrationType)
  const notesMerged = buildUtrNotes(data, options.paymentStripeSessionId)

  if (hasEnvVar('NOTION_API_KEY') && hasEnvVar('NOTION_DATABASE_ID')) {
    try {
      const notionProperties: Record<string, unknown> = {
        'Player Name': {
          title: [{ text: { content: data.studentName || data.playerName || `${data.firstName} ${data.lastName}` } }],
        },
        'Parent Name': {
          rich_text: [{ text: { content: `${data.firstName} ${data.lastName}` } }],
        },
        'Program': {
          rich_text: [{ text: { content: data.program } }],
        },
        'Category': {
          select: { name: category },
        },
        'Parent Email': {
          email: data.email,
        },
        'Parent Phone': {
          phone_number: data.phone,
        },
        'Status': {
          select: { name: 'New' },
        },
        'Timestamp': {
          date: { start: new Date().toISOString() },
        },
        'Notes': {
          rich_text: [{ text: { content: notesMerged } }],
        },
        Division: { rich_text: [{ text: { content: data.division || data.program || '' } }] },
        Tuition: { number: parseInt(String(data.price ?? ''), 10) || 0 },
        Age: { number: parseInt(String(data.playerAge ?? data.studentAge ?? ''), 10) || null },
      }

      const notion = getNotionClient()
      await notion.pages.create({
        parent: { database_id: getEnvVar('NOTION_DATABASE_ID') },
        properties: notionProperties as never,
      })
      console.log('[fulfill-utr-circuit] Notion entry created')
    } catch (notionError) {
      console.error('[fulfill-utr-circuit] Notion error:', notionError)
    }
  }

  let acSynced = false
  if (hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')) {
    try {
      const tuitionAmount = data.totalPrice || data.price || 'Contact for pricing'
      const programDisplay = data.season
        ? `${data.program || 'Not specified'} - ${data.season}`
        : data.program || 'Not specified'

      const fieldValues = [
        { field: '7', value: programDisplay },
        { field: '8', value: data.location || 'Not specified' },
        { field: '9', value: 'N/A' },
        { field: '10', value: String(tuitionAmount) },
        { field: '11', value: 'website' },
        { field: '12', value: registrationType },
        { field: '15', value: data.division || data.program || '' },
      ]

      const contactResult = await upsertContact({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        fieldValues,
      })

      if (contactResult.success && contactResult.data) {
        const contactId = contactResult.data.id
        acSynced = true
        const websiteSignupsListId = getWebsiteSignupsListId()
        await Promise.all([
          addToList(contactId, LBTA_LIST_ID),
          websiteSignupsListId !== null ? addToList(contactId, websiteSignupsListId) : Promise.resolve(),
        ])
        const tags = getApplicableTags(data, registrationType)
        await addTags(contactId, tags)
      }
    } catch (acError) {
      console.error('[fulfill-utr-circuit] ActiveCampaign error:', acError)
      acSynced = false
    }
  }

  waitUntil(
    sendToGHL({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      tags: ['Website Registration', data.program, data.registrationType ?? 'utr-circuit'],
    })
  )

  waitUntil(
    storeLead({
      source: options.paymentStripeSessionId ? 'stripe-utr-season' : 'register-year',
      email: data.email,
      name: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim() || undefined,
      phone: data.phone ?? undefined,
      payload: {
        registrationType: data.registrationType,
        program: data.program,
        division: data.division,
        colorBallStage: data.colorBallStage,
        stripeSessionId: options.paymentStripeSessionId,
        currentUtr: data.currentUtr,
      },
    })
  )

  waitUntil(
    notifyRegistration({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      program: data.program,
      registrationType: data.registrationType,
      division: data.division,
      season: data.season,
      location: data.location,
      studentName: data.studentName ?? data.playerName,
      studentAge: data.studentAge ?? data.playerAge,
      experience: data.experience,
      notes: notesMerged,
    })
  )

  const configById = data.programId ? FORM_CONFIGS[data.programId] : undefined
  const matchedConfig =
    configById ?? Object.values(FORM_CONFIGS).find((c) => c.prePopulateData.programName === data.program)
  if (matchedConfig) {
    const pre = matchedConfig.prePopulateData
    waitUntil(
      sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: pre.programName,
        location: pre.location,
        duration: pre.duration,
        ageGroup: pre.ageGroup,
        category: pre.category,
      })
    )
  } else {
    waitUntil(
      sendConfirmationEmail({
        email: data.email,
        firstName: data.firstName,
        programName: data.program,
        location: data.location ?? 'TBD',
        duration: 'TBD',
        category,
      })
    )
  }

  return { acSynced }
}
