import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  parseJsonBody,
  utrTrackerColorBallBatchSchema,
  validateRequest,
} from '@/lib/validations'
import { requireUtrTrackerAdmin } from '@/lib/utr-tracker-api-auth'
import {
  upsertColorBallWeekAtomic,
} from '@/lib/utr-tracker-supabase'

export async function POST(request: NextRequest) {
  const authError = await requireUtrTrackerAdmin(request)
  if (authError) return authError

  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let rl: { allowed: boolean; resetTime: number }
  try {
    rl = await rateLimit(`utr-color-ball:${ip}`, RATE_LIMITS.form)
  } catch {
    rl = { allowed: true, resetTime: Date.now() + RATE_LIMITS.form.interval }
  }
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rl.resetTime).toISOString(),
        },
      }
    )
  }

  const parsed = await parseJsonBody(request)
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: 'Invalid request format' },
      { status: 400 }
    )
  }
  const validation = validateRequest(utrTrackerColorBallBatchSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    )
  }

  const { week, entries } = validation.data

  const atomicEntries = entries.map((entry) => ({
    player_id: entry.player_id,
    attended: entry.attended,
    completed_match: entry.completed_match,
    matches_played: entry.matches_played,
    coach_badges: Array.from(
      new Set(entry.coach_badges.map((badge) => badge.trim()).filter(Boolean))
    ),
  }))

  const atomicResult = await upsertColorBallWeekAtomic(
    week,
    atomicEntries
  )
  if (!atomicResult.success) {
    return NextResponse.json(
      { success: false, error: atomicResult.error ?? 'Failed to save Color Ball week.' },
      { status: 500 }
    )
  }

  const savedBadges = atomicEntries.reduce(
    (count, entry) => count + entry.coach_badges.length,
    0
  )

  return NextResponse.json({
    success: true,
    savedAttendance: atomicEntries.length,
    savedBadges,
  })
}
