import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  parseJsonBody,
  utrTrackerPlayersBatchSchema,
  validateRequest,
} from '@/lib/validations'
import { requireUtrTrackerAdmin } from '@/lib/utr-tracker-api-auth'
import { getAllPlayers, upsertPlayers } from '@/lib/utr-tracker-supabase'

function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export async function POST(request: NextRequest) {
  const authError = await requireUtrTrackerAdmin(request)
  if (authError) return authError

  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let rl: { allowed: boolean; resetTime: number }
  try {
    rl = await rateLimit(`utr-players:${ip}`, RATE_LIMITS.form)
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
  const validation = validateRequest(utrTrackerPlayersBatchSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    )
  }

  const rows = validation.data.players.map((player) => ({
    id: player.id,
    name: player.name.trim(),
    utr: player.utr ?? null,
    divisions: player.divisions,
    color_ball_stage: player.color_ball_stage ?? null,
    is_color_ball: player.is_color_ball,
    social_opt_in: player.social_opt_in,
    season_registration: player.season_registration,
    is_drop_in: player.is_drop_in,
    provisional_utr: player.provisional_utr,
    joined_week: player.joined_week,
  }))

  const submittedIds = new Set(rows.map((row) => row.id).filter(Boolean))
  const payloadNames = new Set<string>()
  for (const row of rows) {
    const normalized = normalizePlayerName(row.name)
    if (payloadNames.has(normalized)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Payload contains duplicate player names after normalization. Please make names unique before saving roster.',
        },
        { status: 409 }
      )
    }
    payloadNames.add(normalized)
  }

  const existingPlayers = await getAllPlayers()
  const existingByNormalized = new Map<string, string[]>()
  for (const player of existingPlayers) {
    const normalized = normalizePlayerName(player.name)
    const ids = existingByNormalized.get(normalized) ?? []
    ids.push(player.id)
    existingByNormalized.set(normalized, ids)
  }

  for (const row of rows) {
    const normalized = normalizePlayerName(row.name)
    const existingIds = existingByNormalized.get(normalized) ?? []
    const hasConflictingExisting = existingIds.some(
      (id) => id !== row.id && !submittedIds.has(id)
    )
    if (hasConflictingExisting) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Roster would create duplicate player names after normalization. Update names before saving.',
        },
        { status: 409 }
      )
    }
  }

  const result = await upsertPlayers(rows)
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error ?? 'Failed to save players.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    saved: rows.length,
  })
}
