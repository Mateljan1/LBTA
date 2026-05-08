/**
 * Production health-check — end-user-perspective verification.
 *
 * Runs after every push to confirm production is actually serving real traffic,
 * not just that the Vercel build was "Ready". Catches the failure modes that
 * `vercel ls` doesn't surface:
 *
 *   - DEPLOYMENT_DISABLED (project paused for billing/quota/admin reasons)
 *   - DEPLOYMENT_PAUSED (manually paused)
 *   - DEPLOYMENT_NOT_FOUND (alias not pointing to a live deploy)
 *   - 5xx errors on canary routes
 *   - Routes that build green but 404 in prod (routing bugs)
 *
 * Run:
 *   npm run health:prod
 *
 * Exit codes:
 *   0 — all canary routes healthy
 *   1 — one or more route-level failures
 *   2 — Vercel project-level disable detected (highest priority — site is dark)
 *
 * Why this exists: 2026-05-07 — pushed v1.5 + v1.6 SEO commits with `Ready`
 * Vercel build status, but project was actually `DEPLOYMENT_DISABLED`. Real-
 * user requests returned 402. Took hours to notice. Never again.
 *
 * See: .cursor/compound/learnings/2026-05-07-prod-health-check-compound-learn.md
 */

import { execSync } from 'node:child_process'

const PROD_URL = process.env.PROD_URL ?? 'https://lagunabeachtennisacademy.com'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Canary routes — public, high-traffic, mix of SSG + dynamic
const ROUTES = [
  '/',
  '/schedules',
  '/book',
  '/coaches',
  '/programs',
  '/about',
  '/sitemap.xml',
  '/robots.txt',
]

const VERCEL_DASHBOARD = 'https://vercel.com/andrew-mateljans-projects/laguna-beach-tennis-academy'

interface CheckResult {
  route: string
  status: number
  vercelError?: string
  vercelId?: string
  ok: boolean
  reason?: string
}

function checkRoute(route: string): CheckResult {
  const url = `${PROD_URL}${route}`
  try {
    const out = execSync(
      `curl -sI -A "${UA}" --max-time 10 "${url}"`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    )
    const statusMatch = out.match(/HTTP\/[12](?:\.\d)?\s+(\d+)/i)
    const status = statusMatch ? parseInt(statusMatch[1], 10) : 0
    const errorMatch = out.match(/x-vercel-error:\s*(\S+)/i)
    const idMatch = out.match(/x-vercel-id:\s*(\S+)/i)

    let ok = status >= 200 && status < 400 && !errorMatch
    let reason: string | undefined

    // Some redirects are healthy (e.g. /programs/junior may redirect to /schedules)
    if (status >= 300 && status < 400 && !errorMatch) {
      ok = true
      reason = 'redirect (healthy)'
    }
    if (errorMatch) {
      reason = `x-vercel-error: ${errorMatch[1]}`
    } else if (status === 0) {
      reason = 'curl failed (network/timeout)'
    } else if (status >= 500) {
      reason = `5xx server error`
    } else if (status === 404) {
      reason = 'route not found'
    }

    return {
      route,
      status,
      vercelError: errorMatch?.[1],
      vercelId: idMatch?.[1],
      ok,
      reason,
    }
  } catch {
    return { route, status: 0, ok: false, reason: 'curl exception' }
  }
}

function main() {
  console.log(`🔍 Checking production: ${PROD_URL}\n`)

  const results: CheckResult[] = []
  for (const route of ROUTES) {
    results.push(checkRoute(route))
    // Small delay so we don't trigger rate-limiting / bot protection
    execSync('sleep 0.3')
  }

  let projectLevelError: string | undefined
  let routeFailures = 0

  for (const r of results) {
    const icon = r.ok ? '✅' : '❌'
    const reason = r.reason ? ` — ${r.reason}` : ''
    console.log(`${icon} ${r.route.padEnd(20)} HTTP ${r.status}${reason}`)
    if (!r.ok) routeFailures++
    if (r.vercelError && !projectLevelError) projectLevelError = r.vercelError
  }

  console.log('')

  // Project-level disable is the highest-priority failure
  if (
    projectLevelError === 'DEPLOYMENT_DISABLED' ||
    projectLevelError === 'DEPLOYMENT_PAUSED' ||
    projectLevelError === 'DEPLOYMENT_NOT_FOUND'
  ) {
    console.error(`🔴 PROJECT-LEVEL FAILURE: ${projectLevelError}`)
    console.error('')
    if (projectLevelError === 'DEPLOYMENT_DISABLED') {
      console.error('   The Vercel project is disabled — likely a billing/quota issue.')
      console.error('   The site is currently dark for all users.')
      console.error('   Code commits in main will auto-deploy once the project is re-enabled.')
    } else if (projectLevelError === 'DEPLOYMENT_PAUSED') {
      console.error('   The deployment is manually paused. Check Vercel dashboard to resume.')
    } else {
      console.error('   The production alias is not pointing to a live deploy.')
    }
    console.error('')
    console.error(`   Action: open ${VERCEL_DASHBOARD}`)
    process.exitCode = 2
    return
  }

  // Try to verify HEAD SHA matches latest Vercel deploy (best-effort, requires vercel CLI auth)
  try {
    const localSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
    console.log(`Local HEAD: ${localSha.slice(0, 7)}`)
    console.log('(Vercel deploy SHA verification: open Vercel dashboard to compare)')
  } catch {
    /* git not available */
  }

  if (routeFailures > 0) {
    console.error('')
    console.error(`🔴 ${routeFailures} route(s) failed health check.`)
    process.exitCode = 1
    return
  }

  console.log('\n🟢 All canary routes healthy.')
}

main()
