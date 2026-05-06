import {
  getAllLeads,
  isValidChannel,
  leadMatchesChannel,
  leadsToCsv,
} from '@/lib/leads-query'

/**
 * CSV export of leads. Auth-gated by proxy.ts (matches /coach-hub/:path*),
 * but this route lives under /api/coach-hub/leads/export. proxy.ts already
 * redirects /api/coach-hub/* under matcher rules — except the explicit
 * passthroughs for the auth/logout endpoints. We therefore add an explicit
 * server-side cookie check too, defense-in-depth.
 */

import { COACH_HUB_COOKIE_NAME, verifyCoachHubCookie } from '@/lib/coach-hub-auth'

async function isAuthenticated(request: Request): Promise<boolean> {
  const secret = process.env.COACH_HUB_SECRET
  if (!secret) return false
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COACH_HUB_COOKIE_NAME}=([^;]+)`))
  if (!match) return false
  return verifyCoachHubCookie(secret, decodeURIComponent(match[1]))
}

export async function GET(request: Request) {
  if (!(await isAuthenticated(request))) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    })
  }

  const url = new URL(request.url)
  const channelRaw = url.searchParams.get('channel')
  const channel = isValidChannel(channelRaw) ? channelRaw : 'all'

  const all = await getAllLeads({ limit: 5000 })
  const rows = channel === 'all' ? all : all.filter((r) => leadMatchesChannel(r, channel))
  const csv = leadsToCsv(rows)

  const today = new Date().toISOString().slice(0, 10)
  const filename = `lbta-leads-${channel === 'all' ? 'ALL' : channel}-${today}.csv`

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
