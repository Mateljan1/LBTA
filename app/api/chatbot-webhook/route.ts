import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { askPoppy, needsEscalation } from '@/lib/poppy'

/**
 * GHL Chatbot Webhook — Poppy AI + GHL SMS
 *
 * Receives inbound message webhooks from GHL, generates an Andrew-voiced
 * response via Poppy AI (Claude 4.6 + LBTA knowledge base), and sends
 * the reply back through GHL SMS.
 *
 * Flow:
 *   GHL inbound message → this route → Poppy AI → GHL send SMS
 *   Escalation keywords → holding response + email to Andrew
 *
 * GHL Webhook Setup:
 *   URL: https://lagunabeachtennisacademy.com/api/chatbot-webhook
 *   Method: POST
 *   Events: Inbound Message
 *
 * Env: POPPY_API_KEY, GHL_PIT_TOKEN, POSTMARK_SERVER_TOKEN, NOTIFICATION_EMAILS
 */

// ============================================================
// GHL Private Integration Token for sending SMS
// ============================================================
const GHL_CONVERSATIONS_API = 'https://services.leadconnectorhq.com/conversations/messages'
const GHL_VERSION = '2021-07-28'

function getGhlToken(): string | null {
  return process.env.GHL_PIT_TOKEN ?? null
}

async function sendGhlSms(contactId: string, message: string): Promise<boolean> {
  const token = getGhlToken()
  if (!token) {
    console.error('[chatbot-webhook] GHL_PIT_TOKEN not set')
    return false
  }

  try {
    const res = await fetch(GHL_CONVERSATIONS_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Version: GHL_VERSION,
      },
      body: JSON.stringify({ type: 'SMS', contactId, message }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[chatbot-webhook] GHL send failed:', res.status, text.slice(0, 200))
      return false
    }
    return true
  } catch (err) {
    console.error('[chatbot-webhook] GHL error:', err instanceof Error ? err.message : err)
    return false
  }
}

// ============================================================
// Internal escalation alert
// ============================================================
async function notifyEscalation(contactName: string, message: string, reason: string, contactId: string): Promise<void> {
  const token = process.env.POSTMARK_SERVER_TOKEN
  if (!token) return

  const to = process.env.NOTIFICATION_EMAILS?.trim() || 'andrew@tennisbeast.com'

  try {
    await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify({
        From: 'LBTA Bot <support@lagunabeachtennisacademy.com>',
        To: to,
        Subject: `⚠️ ESCALATION: ${contactName || 'Unknown'} — ${reason}`,
        TextBody: `Contact: ${contactName || 'Unknown'}\nMessage: ${message}\nReason: ${reason}\nContact ID: ${contactId}\n\nThis was auto-escalated. The contact received a holding response.`,
        Tag: 'bot-escalation',
        MessageStream: 'outbound',
      }),
    })
  } catch (err) {
    console.error('[chatbot-webhook] Escalation email error:', err)
  }
}

// ============================================================
// Webhook handler
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as Record<string, unknown>

    // Extract fields from GHL webhook (handles multiple payload formats)
    const inner = (payload.payload ?? payload) as Record<string, unknown>
    const contactId = String(inner.contactId ?? inner.contact_id ?? payload.contactId ?? '')
    const messageBody = String(inner.body ?? inner.message ?? payload.body ?? payload.message ?? '')
    const direction = String(inner.direction ?? payload.direction ?? 'inbound')
    const contactName = String(inner.contactName ?? inner.contact_name ?? payload.contactName ?? '')

    // Only process inbound messages with content
    if (direction !== 'inbound' || !contactId || !messageBody.trim()) {
      return NextResponse.json({ status: 'skipped', reason: 'not inbound or missing data' })
    }

    console.log(`[chatbot-webhook] Inbound from ${contactName || contactId}: ${messageBody.slice(0, 80)}`)

    // Check for escalation keywords
    const { escalate, reason } = needsEscalation(messageBody)

    if (escalate) {
      // Send holding response + alert Andrew
      console.log(`[chatbot-webhook] ESCALATION: ${reason}`)
      waitUntil(sendGhlSms(contactId, 'Let me look into this and get back to you today 🙏'))
      waitUntil(notifyEscalation(contactName, messageBody, reason ?? 'unknown', contactId))

      return NextResponse.json({ status: 'escalated', reason })
    }

    // Normal flow: ask Poppy AI, send response via GHL
    const poppy = await askPoppy(messageBody)

    if (!poppy.text) {
      console.error('[chatbot-webhook] Poppy returned no text:', poppy.error)
      return NextResponse.json({ status: 'error', reason: poppy.error }, { status: 502 })
    }

    console.log(`[chatbot-webhook] Poppy response (${poppy.creditsUsed.toFixed(0)} credits): ${poppy.text.slice(0, 80)}`)

    // Send the AI response back via GHL SMS
    waitUntil(sendGhlSms(contactId, poppy.text))

    return NextResponse.json({
      status: 'responded',
      creditsUsed: poppy.creditsUsed,
      creditsRemaining: poppy.creditsRemaining,
    })
  } catch (error) {
    console.error('[chatbot-webhook] Error:', error)
    return NextResponse.json(
      { status: 'error', reason: 'Internal error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  const hasPoppy = !!process.env.POPPY_API_KEY
  const hasGhl = !!process.env.GHL_PIT_TOKEN
  return NextResponse.json({
    status: hasPoppy && hasGhl ? 'ready' : 'missing_config',
    poppy: hasPoppy,
    ghl: hasGhl,
  })
}
