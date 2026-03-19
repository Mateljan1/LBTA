#!/usr/bin/env node
/**
 * Generate court flyer PDF. Saves to Desktop by default.
 * Requires: dev server running (npm run dev) or production (npm run build && npm run start).
 * Usage: node scripts/generate-court-flyer-pdf.mjs [outputPath]
 * Default output: ~/Desktop/LBTA_Master_Flyer.pdf
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const defaultOut = path.join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop', 'LBTA_Master_Flyer.pdf')
const outPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultOut

const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const flyerUrl = `${baseUrl}/print/court-flyer`

/** Keep in sync with `lib/court-flyer-print.ts` → `COURT_FLYER_VIEWPORT_WIDTH_PX`. */
const FLYER_VIEWPORT_W = 1056

async function main() {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: FLYER_VIEWPORT_W, height: 4000 })
  await page.goto(flyerUrl, { waitUntil: 'load', timeout: 15000 })
  await page.waitForSelector('.court-flyer-print', { timeout: 5000 })
  const heightPx = await page.$eval('.court-flyer-print', (el) => Math.ceil(el.scrollHeight))
  const margin = { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
  await page.pdf({
    path: outPath,
    width: '11in',
    height: `${heightPx + 4}px`,
    margin,
    printBackground: true,
    preferCSSPageSize: false,
  })
  await browser.close()
  console.log('Wrote', outPath)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
