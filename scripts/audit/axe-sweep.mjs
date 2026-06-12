#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * LBTA mobile UX audit — axe-core sweep via Playwright.
 *
 * Read-only. Per page, opens it at 375×667 (iPhone-ish), injects axe-core
 * from npm, runs the full ruleset, and writes per-page JSON to
 * docs/audits/2026-05/axe/{slug}.json plus a summary table.
 */

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..')

const BASE_URL = process.env.AUDIT_BASE_URL || 'http://localhost:3000'
const AXE_DIR = process.env.AUDIT_OUT_DIR
  ? path.resolve(REPO_ROOT, process.env.AUDIT_OUT_DIR)
  : path.join(REPO_ROOT, 'docs', 'audits', '2026-05', 'axe')

const PAGES = (process.env.AUDIT_PAGES || '').split(',').map(s=>s.trim()).filter(Boolean)
const DEFAULT_PAGES = [
  '/', '/schedules', '/book', '/junior-trial', '/adult-trial',
  '/programs', '/coaches/andrew-mateljan', '/about', '/contact',
  '/pathway-planner', '/thank-you',
]
const pages = PAGES.length > 0 ? PAGES : DEFAULT_PAGES

function slug(p) {
  if (p === '/' || p === '') return 'home'
  return p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '--')
}

async function loadAxeSource() {
  // Find axe-core in node_modules (Playwright bundles it transitively via @axe-core/playwright,
  // but we don't have that here. Read from local package if available; else fetch from CDN.)
  const candidates = [
    path.join(REPO_ROOT, 'node_modules', 'axe-core', 'axe.min.js'),
    path.join(REPO_ROOT, 'node_modules', 'axe-core', 'axe.js'),
  ]
  for (const p of candidates) {
    try {
      return await readFile(p, 'utf8')
    } catch {}
  }
  // Fallback — pull from CDN once. Cache in memory only.
  const res = await fetch('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js')
  if (!res.ok) throw new Error('Failed to fetch axe-core from CDN: ' + res.status)
  return await res.text()
}

async function main() {
  await mkdir(AXE_DIR, { recursive: true })
  const axeSource = await loadAxeSource()

  console.log(`LBTA mobile UX audit — axe-core sweep`)
  console.log(`  base: ${BASE_URL}`)
  console.log(`  pages: ${pages.length}\n`)

  const browser = await chromium.launch({ headless: true })
  const summary = []
  try {
    for (const route of pages) {
      const ctx = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      })
      // Block GHL chat widget — it injects a shadow-DOM custom element that axe-core can't introspect
      // cleanly and adds noise to results.
      await ctx.route(/widget\.leadconnectorhq\.com|app\.gohighlevel\.com|services\.leadconnectorhq\.com/, r => r.abort())
      const page = await ctx.newPage()
      try {
        const url = `${BASE_URL}${route}`
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        await page.waitForTimeout(500)
        await page.evaluate(axeSource)
        const result = await page.evaluate(async () => {
          // @ts-ignore
          return await window.axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'] },
            resultTypes: ['violations','incomplete'],
          })
        })
        const s = slug(route)
        const file = path.join(AXE_DIR, `${s}.json`)
        await writeFile(file, JSON.stringify(result, null, 2))
        const v = result.violations || []
        const counts = v.reduce((acc, vi) => {
          acc[vi.impact || 'unknown'] = (acc[vi.impact || 'unknown']||0) + (vi.nodes?.length || 1)
          return acc
        }, {})
        const total = v.reduce((a,vi)=>a+(vi.nodes?.length||0),0)
        console.log(`  ${route.padEnd(28)} violations: ${v.length} rules / ${total} nodes  ${JSON.stringify(counts)}`)
        summary.push({ route, slug: s, ruleCount: v.length, nodeCount: total, byImpact: counts, topViolations: v.slice(0, 8).map(vi => ({ id: vi.id, impact: vi.impact, help: vi.help, nodes: vi.nodes?.length, sample: vi.nodes?.[0]?.target?.[0] })) })
      } catch (err) {
        console.warn(`  ${route} — error: ${err.message}`)
        summary.push({ route, error: err.message })
      } finally {
        await ctx.close()
      }
    }
  } finally {
    await browser.close()
  }
  await writeFile(path.join(AXE_DIR, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log(`\nSummary → ${path.join(AXE_DIR, 'summary.json')}`)
}

main().catch(err => { console.error(err); process.exit(1) })
