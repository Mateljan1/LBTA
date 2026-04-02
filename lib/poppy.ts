/**
 * Poppy AI client — calls the LBTA knowledge base with Andrew's voice.
 *
 * Env:
 *   POPPY_API_KEY        — Poppy API key (required for chatbot webhook)
 *   POPPY_BOARD_ID       — Poppy board slug (default: merry-fire-cvo3i)
 *   POPPY_CHAT_ID        — Poppy chat node slug (default: chatNode-silly-valley-mDFea)
 *   POPPY_MODEL          — AI model (default: claude-sonnet-4-6)
 *
 * Failures return { text: null, error: string } — never throws.
 */

const POPPY_API = 'https://api.getpoppy.ai/api/conversation'

const SYSTEM_PREFIX = `IMPORTANT: You are Andrew Mateljan, Founder of Laguna Beach Tennis Academy. Respond as a SHORT text message.

RULES (non-negotiable):
- NO PERIODS at end of sentences
- Keep SHORT — under 200 characters per thought
- Child's name in FIRST sentence if mentioned
- Say "investment" not "cost" or "price"
- One CTA only. Default: "let me know" or "just reply here"
- Use 🙏 for gratitude, 🎾 for scheduling, 👍 for confirmations — no other emoji
- "No problem" not "you're welcome"
- "Ah man" for empathy
- "Sounds good!" for agreement
- NEVER say: "I'd be happy to help", "Certainly!", "Great question!", "I understand your concern"
- BANNED WORDS: precision, boost, enhance, elevate, elite, maximize, optimize, cutting-edge, world-class, unlock, game-changing, premium

ESCALATION — if the message involves refunds, complaints, private lessons with Andrew, pricing exceptions, contracts, or switching coaches, respond ONLY with: "Let me look into this and get back to you today 🙏"

`

type PoppyResponse = {
  text: string | null
  creditsUsed: number
  creditsRemaining: number
  error?: string
}

export async function askPoppy(userMessage: string): Promise<PoppyResponse> {
  const apiKey = process.env.POPPY_API_KEY
  if (!apiKey) {
    return { text: null, creditsUsed: 0, creditsRemaining: 0, error: 'POPPY_API_KEY not set' }
  }

  const boardId = process.env.POPPY_BOARD_ID || 'merry-fire-cvo3i'
  const chatId = process.env.POPPY_CHAT_ID || 'chatNode-silly-valley-mDFea'
  const model = process.env.POPPY_MODEL || 'claude-sonnet-4-6'

  const url = `${POPPY_API}?board_id=${encodeURIComponent(boardId)}&chat_id=${encodeURIComponent(chatId)}&api_key=${encodeURIComponent(apiKey)}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `${SYSTEM_PREFIX}Parent says: ${userMessage}`,
        model,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[Poppy] API error:', res.status, errText.slice(0, 200))
      return { text: null, creditsUsed: 0, creditsRemaining: 0, error: `API ${res.status}` }
    }

    const data = await res.json() as { text?: string; credits_used?: number; credits_remaining?: number }

    return {
      text: data.text ?? null,
      creditsUsed: data.credits_used ?? 0,
      creditsRemaining: data.credits_remaining ?? 0,
    }
  } catch (err) {
    console.error('[Poppy] Error:', err instanceof Error ? err.message : err)
    return { text: null, creditsUsed: 0, creditsRemaining: 0, error: String(err) }
  }
}

/** Check if a message contains escalation keywords that should route to a human. */
export function needsEscalation(message: string): { escalate: boolean; reason: string | null } {
  const msg = message.toLowerCase()
  const keywords = [
    'refund', 'complaint', 'unhappy', 'disappointed', 'angry', 'upset',
    'cancel my', 'cancellation', 'lawsuit', 'lawyer', 'attorney',
    'private lesson with andrew', 'switch coaches', 'change coach',
    'financial', 'invoice', 'billing error', 'overcharged', 'want my money',
  ]
  const match = keywords.find(kw => msg.includes(kw))
  return { escalate: !!match, reason: match ?? null }
}
