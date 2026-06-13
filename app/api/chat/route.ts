import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { chatSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { CHAT_COPY, getChatReply } from '@/lib/chat-copy'
import { validateAgentSecret } from '@/lib/agent-auth'
import { storeLead } from '@/lib/leads-store'
import { notifyChatMessage } from '@/lib/email'

/**
 * Chat widget stub: validates input, rate limits, and returns a friendly
 * reply directing users to contact the academy. No AI/LLM integration.
 *
 * Downstream tracking (added 2026-03-29):
 * - Supabase: every message stored as a lead with source='chat'
 * - Notion: first message in a conversation written as "Chat Inquiry"
 * - Postmark: internal notification on first message so academy knows someone is chatting
 *
 * Copy is prompt-native: all strings come from lib/chat-copy.ts
 */
export async function POST(request: NextRequest) {
  // Agent auth: validate X-Agent-Secret header if present (for agent tool calls)
  const agentSecret = request.headers.get('X-Agent-Secret')
  if (agentSecret && !validateAgentSecret(request)) {
    return NextResponse.json(
      { success: false, error: 'Invalid agent secret' },
      { status: 401 }
    )
  }

  const ip = request.headers.get('x-forwarded-for') || 'anonymous'
  let rateLimitResult: { allowed: boolean; resetTime: number }
  try {
    rateLimitResult = await rateLimit(`chat:${ip}`, RATE_LIMITS.form)
  } catch (e) {
    console.error('[chat] Rate limit error:', e instanceof Error ? e.message : 'Unknown')
    return NextResponse.json(
      { success: false, error: CHAT_COPY.errors.server },
      { status: 500 }
    )
  }

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: CHAT_COPY.errors.rateLimit,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      }
    )
  }

  try {
    const parsed = await parseJsonBody(request)
    if (!parsed.ok) {
      return NextResponse.json(
        {
          success: false,
          error: CHAT_COPY.errors.validation,
        },
        { status: 400 }
      )
    }
    const validation = validateRequest(chatSchema, parsed.data)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: CHAT_COPY.errors.validation,
        },
        { status: 400 }
      )
    }

    // Phase 3: Extract pathname and history from request for context injection
    const body = parsed.data as { message: string; history?: Array<{ role: 'user' | 'assistant'; content: string }>; pathname?: string }
    const pathname = body.pathname
    const history = body.history || []
    const message = body.message

    // Get contextual reply (Phase 3: will use pathname + history)
    const reply = getChatReply({ pathname, history })

    // ---- Downstream tracking ----
    // Use a synthetic identifier for Supabase (leads table requires email NOT NULL)
    const sessionId = `chat-${ip.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}-${Date.now()}`
    const syntheticEmail = `${sessionId}@chat.lbta.local`

    // Supabase: every message (lightweight, captures what people are asking)
    waitUntil(storeLead({
      source: 'chat',
      email: syntheticEmail,
      name: null,
      phone: null,
      payload: {
        message,
        pathname: pathname || null,
        messageCount: history.length + 1,
        ip: ip.slice(0, 45), // truncate for privacy
      },
    }))

    // First message only: notify academy
    // (avoid spamming on every back-and-forth in the same conversation)
    const isFirstMessage = history.length <= 1
    if (isFirstMessage) {
      waitUntil(notifyChatMessage({
        message,
        pathname,
        messageCount: 1,
      }))
    }

    return NextResponse.json({
      success: true,
      reply,
      stub: true, // Phase 3: Indicates this is a stub, not LLM
      capabilities: ['contact', 'redirect'], // Phase 3: What the stub can do
    })
  } catch (err) {
    console.error('[chat] Error:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.json(
      {
        success: false,
        error: CHAT_COPY.errors.processing,
      },
      { status: 500 }
    )
  }
}
