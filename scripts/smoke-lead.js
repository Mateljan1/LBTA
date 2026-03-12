#!/usr/bin/env node
/**
 * Smoke test for the lead pipeline: site reachability (optional) + env + AC/GHL ping.
 * No test contacts created. Safe for CI and local.
 *
 * Usage:
 *   node scripts/smoke-lead.js
 *   SMOKE_BASE_URL=https://lbta-website.vercel.app node scripts/smoke-lead.js
 *
 * Steps:
 *   1. If SMOKE_BASE_URL is set, fetch it and expect 200.
 *   2. Run connection-check --ping (env + read-only AC/GHL ping).
 * Exit 0 only if all steps pass.
 */

const { spawnSync } = require('child_process')
const path = require('path')

const baseUrl = process.env.SMOKE_BASE_URL || ''

async function siteUp() {
  if (!baseUrl) return { ok: true, message: 'SMOKE_BASE_URL not set, skipping' }
  try {
    const res = await fetch(baseUrl, { method: 'GET', redirect: 'follow' })
    if (res.ok) return { ok: true, message: `Site ${res.status}` }
    return { ok: false, message: `Site returned ${res.status}` }
  } catch (e) {
    return { ok: false, message: (e && e.message) || 'Site request failed' }
  }
}

async function main() {
  console.log('Smoke test — lead pipeline\n')

  const site = await siteUp()
  console.log('  Site:', site.ok ? 'OK' : site.message)
  if (!site.ok) {
    console.error('\nSmoke failed: site unreachable')
    process.exit(1)
  }

  console.log('  Lead env + ping: running connection-check --ping ...\n')
  const out = spawnSync(
    process.execPath,
    [path.join(__dirname, 'connection-check.js'), '--ping'],
    { stdio: 'inherit', env: process.env, cwd: path.join(__dirname, '..') }
  )
  if (out.status !== 0) {
    process.exit(out.status ?? 1)
  }
  console.log('\nSmoke passed.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Smoke failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
