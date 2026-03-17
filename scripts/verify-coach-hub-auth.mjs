#!/usr/bin/env node
/**
 * Verifies Coach Hub auth API contract: 400 (invalid/missing body), 401 (wrong password).
 * Run with dev server up and COACH_HUB_SECRET set (e.g. COACH_HUB_SECRET=secret npm run dev).
 * Usage: node scripts/verify-coach-hub-auth.mjs [BASE_URL]
 * Default BASE_URL: http://localhost:3000
 */

const BASE = process.argv[2] ?? 'http://localhost:3000'

async function run() {
  let passed = 0
  let failed = 0

  // 400: empty body (validation: password required)
  const r400 = await fetch(`${BASE}/api/coach-hub/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (r400.status === 400) {
    console.log('✓ POST {} → 400')
    passed++
  } else {
    console.log(`✗ POST {} → ${r400.status} (expected 400)`)
    failed++
  }

  // 401: wrong password (when secret is set)
  const r401 = await fetch(`${BASE}/api/coach-hub/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'wrongpassword' }),
  })
  if (r401.status === 401) {
    console.log('✓ POST { password: "wrong" } → 401')
    passed++
  } else if (r401.status === 503) {
    console.log('⚠ POST { password: "wrong" } → 503 (COACH_HUB_SECRET unset; set it and restart dev server)')
    failed++
  } else {
    console.log(`✗ POST { password: "wrong" } → ${r401.status} (expected 401)`)
    failed++
  }

  if (failed > 0) {
    process.exit(1)
  }
  console.log(`\nAll ${passed} auth contract checks passed.`)
}

run().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
