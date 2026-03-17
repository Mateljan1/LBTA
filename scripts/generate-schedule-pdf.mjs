#!/usr/bin/env node
/**
 * Generate public/schedule-2026.pdf from winter2026 data.
 * Uses Playwright to render HTML to PDF. Run: node scripts/generate-schedule-pdf.mjs
 * Requires: npm install (playwright is devDependency).
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const LOCATION_KEYS = ['Moulton', 'Alta', 'LBHS']
const LOCATION_LABELS = { Moulton: 'Moulton Meadows Park', Alta: 'Alta Laguna Park', LBHS: 'Laguna Beach High School' }

function normalizeLoc(slot, programLocation) {
  const loc = (slot.location || '').toLowerCase()
  const prog = (programLocation || '').toLowerCase()
  if (loc) {
    if (loc.includes('moulton')) return 'Moulton'
    if (loc.includes('alta')) return 'Alta'
    if (loc.includes('lbhs') || loc.includes('high school') || loc.includes('lb high')) return 'LBHS'
  }
  if (prog.includes('mon/wed') && (slot.day === 'Monday' || slot.day === 'Wednesday')) return 'Moulton'
  if (prog.includes('fri') && slot.day === 'Friday' && (prog.includes('lbhs') || prog.includes('high school'))) return 'LBHS'
  if (prog.includes('moulton') && prog.includes('saturday') && slot.day === 'Saturday' && (prog.includes('lbhs') || prog.includes('high school'))) return 'LBHS'
  if (prog.includes('moulton')) return 'Moulton'
  if (prog.includes('alta')) return 'Alta'
  if (prog.includes('lbhs') || prog.includes('laguna beach high')) return 'LBHS'
  return 'Moulton'
}

function buildScheduleByLocation(data) {
  const out = {}
  for (const prog of data.programs || []) {
    for (const slot of prog.schedule || []) {
      const loc = normalizeLoc(slot, prog.location)
      if (!LOCATION_KEYS.includes(loc)) continue
      if (!out[loc]) out[loc] = {}
      if (!out[loc][slot.day]) out[loc][slot.day] = []
      out[loc][slot.day].push({
        programName: prog.program,
        ages: prog.ages || '',
        time: slot.time,
        duration: prog.duration || '',
        coach: slot.coach || '',
      })
    }
  }
  for (const loc of Object.keys(out)) {
    for (const day of Object.keys(out[loc])) {
      out[loc][day].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    }
  }
  return out
}

function escapeHtml(s) {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml(data) {
  const byLoc = buildScheduleByLocation(data)
  const season = data.season || 'Schedule'
  const dates = data.dates || ''

  let body = `
    <div class="page">
      <p class="eyebrow">Schedule by location</p>
      <h1>${escapeHtml(season)} Schedule</h1>
      <p class="dates">${escapeHtml(dates)}</p>
      ${LOCATION_KEYS.filter((loc) => byLoc[loc]).map((loc) => {
        const byDay = byLoc[loc]
        const locationName = LOCATION_LABELS[loc] || loc
        return `
        <section class="location">
          <h2>${escapeHtml(locationName)}</h2>
          ${DAY_ORDER.map((day) => {
            const slots = byDay[day]
            if (!slots || slots.length === 0) return ''
            return `
            <div class="day">
              <h3>${escapeHtml(day)}</h3>
              <ul>
                ${slots.map((s) => `
                  <li>
                    <span class="time">${escapeHtml(s.time)}</span>
                    <span class="name">${escapeHtml(s.programName)}${s.ages ? ` (${escapeHtml(s.ages)})` : ''}</span>
                    <span class="meta">${escapeHtml(s.duration)}${s.coach ? ` · ${escapeHtml(s.coach)}` : ''}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            `
          }).join('')}
        </section>
        `
      }).join('')}
    </div>
  `

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(season)} Schedule — LBTA</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; color: #1B3A5C; margin: 0; padding: 24px; font-size: 12pt; }
    .page { max-width: 800px; margin: 0 auto; }
    .eyebrow { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #1B3A5C99; margin-bottom: 4px; }
    h1 { font-size: 24pt; font-weight: 600; margin: 0 0 4px; }
    .dates { font-size: 13px; color: #1B3A5CB3; margin-bottom: 24px; }
    .location { margin-bottom: 28px; break-inside: avoid; }
    .location h2 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; background: #1B3A5C; color: #fff; padding: 8px 12px; display: inline-block; margin: 0 0 12px; }
    .day { margin-bottom: 16px; }
    .day h3 { font-size: 14pt; font-weight: 500; margin: 0 0 6px; }
    .day ul { list-style: none; padding: 0; margin: 0; }
    .day li { padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; flex-wrap: wrap; gap: 8px; align-items: baseline; }
    .day li .time { font-weight: 600; min-width: 100px; }
    .day li .name { }
    .day li .meta { color: #1B3A5C99; font-size: 11px; }
  </style>
</head>
<body>${body}</body>
</html>`
}

async function main() {
  const winterPath = path.join(root, 'data', 'winter2026.json')
  const data = JSON.parse(fs.readFileSync(winterPath, 'utf8'))
  const html = buildHtml(data)

  const outDir = path.join(root, 'public')
  const outPdf = path.join(outDir, 'schedule-2026.pdf')
  const tmpHtml = path.join(root, '.schedule-pdf-temp.html')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(tmpHtml, html, 'utf8')

  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(`file://${tmpHtml}`, { waitUntil: 'networkidle' })
    await page.pdf({
      path: outPdf,
      format: 'A4',
      margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      printBackground: true,
    })
    await browser.close()
    console.log('Wrote', outPdf)
  } finally {
    try { fs.unlinkSync(tmpHtml) } catch (_) {}
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
