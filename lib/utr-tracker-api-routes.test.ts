import { NextRequest, NextResponse } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

function jsonRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

describe('UTR admin login route', () => {
  it('returns 503 when admin secret is not configured', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { sensitive: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/env', () => ({
      getEnvVar: vi.fn().mockReturnValue(''),
    }))
    vi.doMock('@/lib/utr-tracker-auth-server', () => ({
      signUtrTrackerCookie: vi.fn(),
      buildUtrTrackerSetCookie: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/admin/login/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/admin/login', {
        password: 'anything',
      })
    )

    expect(res.status).toBe(503)
    await expect(res.json()).resolves.toMatchObject({
      success: false,
      error: 'UTR Tracker admin is not configured.',
    })
  })

  it('returns 401 for invalid password', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { sensitive: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/env', () => ({
      getEnvVar: vi.fn().mockReturnValue('secret123'),
    }))
    vi.doMock('@/lib/utr-tracker-auth-server', () => ({
      signUtrTrackerCookie: vi.fn(),
      buildUtrTrackerSetCookie: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/admin/login/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/admin/login', {
        password: 'wrongpw12',
      })
    )

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toMatchObject({
      success: false,
      error: 'Invalid password',
    })
  })
})

describe('UTR matches route', () => {
  it('returns 401 when admin auth fails', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { form: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/utr-tracker-api-auth', () => ({
      requireUtrTrackerAdmin: vi
        .fn()
        .mockResolvedValue(
          NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
        ),
    }))
    vi.doMock('@/lib/utr-tracker-supabase', () => ({
      getAllPlayers: vi.fn(),
      insertMatches: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/matches/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/matches', { matches: [] })
    )

    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid payload schema', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { form: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/utr-tracker-api-auth', () => ({
      requireUtrTrackerAdmin: vi.fn().mockResolvedValue(null),
    }))
    vi.doMock('@/lib/utr-tracker-supabase', () => ({
      getAllPlayers: vi.fn().mockResolvedValue([]),
      insertMatches: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/matches/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/matches', { matches: [{}] })
    )

    expect(res.status).toBe(400)
  })

  it('passes replace write mode to insertMatches', async () => {
    const insertMatches = vi.fn().mockResolvedValue({ success: true })
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { form: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/utr-tracker-api-auth', () => ({
      requireUtrTrackerAdmin: vi.fn().mockResolvedValue(null),
    }))
    vi.doMock('@/lib/utr-tracker-supabase', () => ({
      getAllPlayers: vi.fn().mockResolvedValue([
        { id: 'p1', name: 'Player One' },
        { id: 'p2', name: 'Player Two' },
      ]),
      insertMatches,
    }))

    const route = await import('@/app/api/utr-tracker/matches/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/matches', {
        write_mode: 'replace_week_division_date',
        matches: [
          {
            week: 1,
            date: '2026-04-11',
            division: 'sat_utr_singles',
            is_doubles: false,
            player1_name: 'Player One',
            player1_utr: 3.5,
            player1_provisional: false,
            player2_name: 'Player Two',
            player2_utr: 3.6,
            player2_provisional: false,
            score: '6-4',
            winner_slot: 1,
          },
        ],
      })
    )

    expect(res.status).toBe(200)
    expect(insertMatches).toHaveBeenCalledOnce()
    expect(insertMatches.mock.calls[0]?.[1]).toBe('replace_week_division_date')
  })
})

describe('UTR players and color ball route schema failures', () => {
  it('players route returns 400 for invalid payload', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { form: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/utr-tracker-api-auth', () => ({
      requireUtrTrackerAdmin: vi.fn().mockResolvedValue(null),
    }))
    vi.doMock('@/lib/utr-tracker-supabase', () => ({
      upsertPlayers: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/players/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/players', { players: [{}] })
    )

    expect(res.status).toBe(400)
  })

  it('color-ball route returns 400 for invalid payload', async () => {
    vi.doMock('@/lib/rate-limit', () => ({
      RATE_LIMITS: { form: { interval: 60_000 } },
      rateLimit: vi.fn().mockResolvedValue({ allowed: true, resetTime: Date.now() + 1000 }),
    }))
    vi.doMock('@/lib/utr-tracker-api-auth', () => ({
      requireUtrTrackerAdmin: vi.fn().mockResolvedValue(null),
    }))
    vi.doMock('@/lib/utr-tracker-supabase', () => ({
      upsertColorBallWeekAtomic: vi.fn(),
    }))

    const route = await import('@/app/api/utr-tracker/color-ball/route')
    const res = await route.POST(
      jsonRequest('http://localhost/api/utr-tracker/color-ball', {
        week: 1,
        entries: [{}],
      })
    )

    expect(res.status).toBe(400)
  })
})
