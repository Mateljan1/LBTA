import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { timingSafeEqual } from 'crypto'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { parseJsonBody, validateRequest } from '@/lib/validations'
import { syncMatchResult, type MatchResultPayload } from '@/lib/notion-match-results'

/**
 * Match Day sync endpoint.
 *
 * Auth: a capability token (`x-matchday-token`) issued to authenticated coaches
 * by the gated /coach-hub/matchday page. The page itself sits behind the Coach
 * Hub password gate (proxy.ts), so the token is only ever handed to a coach who
 * already authenticated. Compared in constant time. Sync is best-effort: when
 * Notion isn't configured the route reports `skipped` rather than failing the UX.
 */

const matchSyncSchema = z.object({
  matchId: z.string().min(1).max(300),
  week: z.string().min(1).max(40),
  pod: z.string().min(1).max(40),
  round: z.number().int().min(1).max(20),
  playerA: z.string().min(1).max(120),
  playerB: z.string().min(1).max(120),
  winner: z.string().max(120).nullable(),
  score: z.string().max(80),
  court: z.string().max(10),
})

function tokenMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false
  const a = Buffer.from(provided, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let allowed = true
  try {
    const result = await rateLimit(`matchday-sync:${ip}`, RATE_LIMITS.api)
    allowed = result.allowed
  } catch {
    allowed = true // fail-open if KV is unavailable
  }
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429 }
    )
  }

  const expectedToken = process.env.MATCHDAY_SYNC_TOKEN?.trim()
  if (!expectedToken) {
    // Not configured for sync — the client treats this as "local only".
    return NextResponse.json({ ok: false, skipped: true, reason: 'not-configured' }, { status: 503 })
  }

  const provided =
    request.headers.get('x-matchday-token') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null
  if (!tokenMatches(provided, expectedToken)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const parsed = await parseJsonBody(request)
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: 'Invalid request format' }, { status: 400 })
  }

  const validation = validateRequest(matchSyncSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 })
  }

  const result = await syncMatchResult(validation.data as MatchResultPayload)

  if (result.ok) {
    return NextResponse.json(result)
  }
  if ('skipped' in result && result.skipped) {
    return NextResponse.json({ ok: false, skipped: true, reason: 'not-configured' }, { status: 503 })
  }
  return NextResponse.json(result, { status: 502 })
}

export function GET() {
  return NextResponse.json({ ok: false, error: 'Method Not Allowed' }, { status: 405 })
}
