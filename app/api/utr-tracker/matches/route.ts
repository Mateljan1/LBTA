import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import {
  parseJsonBody,
  utrTrackerMatchesBulkSchema,
  validateRequest,
} from '@/lib/validations'
import { requireUtrTrackerAdmin } from '@/lib/utr-tracker-api-auth'
import { getAllPlayers, insertMatches } from '@/lib/utr-tracker-supabase'

function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export async function POST(request: NextRequest) {
  const authError = await requireUtrTrackerAdmin(request)
  if (authError) return authError

  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  let rl: { allowed: boolean; resetTime: number }
  try {
    rl = await rateLimit(`utr-matches:${ip}`, RATE_LIMITS.form)
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
  const validation = validateRequest(utrTrackerMatchesBulkSchema, parsed.data)
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 }
    )
  }

  const players = await getAllPlayers()
  const byName = new Map<string, (typeof players)[number]>()
  const collisions = new Set<string>()
  for (const player of players) {
    const normalized = normalizePlayerName(player.name)
    if (byName.has(normalized)) {
      collisions.add(normalized)
    }
    byName.set(normalized, player)
  }

  if (collisions.size > 0) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Roster contains duplicate player names after normalization. Resolve duplicate names before bulk match import.',
      },
      { status: 409 }
    )
  }

  const rows: Parameters<typeof insertMatches>[0] = []
  for (const item of validation.data.matches) {
    const p1 = byName.get(normalizePlayerName(item.player1_name))
    const p2 = byName.get(normalizePlayerName(item.player2_name))
    const p3 = item.player3_name
      ? byName.get(normalizePlayerName(item.player3_name))
      : undefined
    const p4 = item.player4_name
      ? byName.get(normalizePlayerName(item.player4_name))
      : undefined

    if (!p1 || !p2) {
      return NextResponse.json(
        {
          success: false,
          error: `Player not found in roster: ${item.player1_name} or ${item.player2_name}`,
        },
        { status: 400 }
      )
    }

    const isDoubles = item.is_doubles || item.division === 'sun_doubles'
    if (isDoubles && (!p3 || !p4)) {
      return NextResponse.json(
        {
          success: false,
          error: `Doubles players not found in roster for row: ${item.player3_name ?? 'Unknown'} / ${item.player4_name ?? 'Unknown'}`,
        },
        { status: 400 }
      )
    }

    const winnerId =
      item.winner_slot === 1
        ? p1.id
        : item.winner_slot === 2
          ? p2.id
          : item.winner_slot === 3
            ? p3?.id
            : p4?.id

    if (!winnerId) {
      return NextResponse.json(
        { success: false, error: 'Unable to resolve winner for one or more rows.' },
        { status: 400 }
      )
    }

    const winningTeam =
      isDoubles && (item.winner_slot === 1 || item.winner_slot === 3)
        ? 1
        : isDoubles
          ? 2
          : null

    rows.push({
      week: item.week,
      date: item.date,
      division: item.division,
      is_doubles: isDoubles,
      player1_id: p1.id,
      player1_name: p1.name,
      player1_utr: item.player1_utr,
      player1_provisional: item.player1_provisional,
      player2_id: p2.id,
      player2_name: p2.name,
      player2_utr: item.player2_utr,
      player2_provisional: item.player2_provisional,
      player3_id: p3?.id ?? null,
      player3_name: p3?.name ?? null,
      player3_utr: item.player3_utr ?? null,
      player3_provisional: item.player3_provisional,
      player4_id: p4?.id ?? null,
      player4_name: p4?.name ?? null,
      player4_utr: item.player4_utr ?? null,
      player4_provisional: item.player4_provisional,
      score: item.score.trim(),
      winner_id: winnerId,
      winning_team: winningTeam,
    })
  }

  const result = await insertMatches(rows, validation.data.write_mode)
  if (!result.success) {
    const isConflict =
      result.error?.includes('Replace mode requires all matches') ?? false
    return NextResponse.json(
      { success: false, error: result.error ?? 'Failed to save matches.' },
      { status: isConflict ? 409 : 500 }
    )
  }

  return NextResponse.json({
    success: true,
    inserted: rows.length,
    writeMode: validation.data.write_mode,
  })
}
