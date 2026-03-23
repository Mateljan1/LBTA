import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { chatSchema, parseJsonBody, validateRequest } from '@/lib/validations'
import { CHAT_COPY, getChatReply } from '@/lib/chat-copy'
import { validateAgentSecret } from '@/lib/agent-auth'

/**
 * Chat widget stub: validates input, rate limits, and returns a friendly
 * reply directing users to contact the academy. No AI/LLM integration.
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

    // Get contextual reply (Phase 3: will use pathname + history)
    const reply = getChatReply({ pathname, history })

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
