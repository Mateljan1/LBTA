/**
 * Generate LBTA Master Court Flyer PDF from repo data (no dev server).
 * Uses the same schedule grid and pricing helpers as /print/court-flyer.
 *
 * Run from project root: npm run build:court-flyer-pdf-standalone
 * Or: npx tsx scripts/generate-court-flyer-pdf-standalone.ts [outputPath]
 * Default output: ~/Desktop/LBTA_Master_Flyer.pdf
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  COURT_FLYER_DISCOUNT_LINE,
  FLYER_ACADEMY_ADDRESS,
  FLYER_CONTACT,
  FLYER_LOCATION_DISPLAY,
} from '../lib/flyer-config'
import { getCourtFlyerProgramPricingRows } from '../lib/flyer-pricing'
import {
  getScheduleByLocationByDay,
  buildWeekGridForLocation,
  formatGridRowTime,
  getUsedRowRange,
  DAY_ORDER,
  type ScheduleByLocationByDay,
} from '../lib/calendar-schedule'
import { getSpringSummer2026 } from '../lib/programs-data'
import {
  COURT_FLYER_CITY_SEAL_INNER_PX,
  COURT_FLYER_LOGO_ROW_PX,
  COURT_FLYER_VIEWPORT_WIDTH_PX,
} from '../lib/court-flyer-print'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const outPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop', 'LBTA_Master_Flyer.pdf')

const LOCATION_ORDER = ['Alta', 'LBHS', 'Moulton'] as const
const COURT_LABEL: Record<string, string> = {
  Moulton: 'Court 2',
  LBHS: 'Courts 5 & 6',
  Alta: 'Courts 1 & 2',
}

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toFileUrl(filePath: string): string {
  const resolved = path.resolve(filePath)
  return 'file://' + (process.platform === 'win32' ? '/' : '') + resolved.replace(/\\/g, '/')
}

/** Align with components/print/CourtFlyer.tsx scheduleCellBgClass (print-safe CSS). */
function scheduleCellCssClass(programName: string): string {
  if (programName.includes('\n')) return 'cell-concurrent'
  const n = (programName || '').toLowerCase()
  if (n.includes('little') || n.includes('stars')) return 'cell-junior'
  if (n.includes('red ball')) return 'cell-red'
  if (n.includes('orange ball')) return 'cell-orange'
  if (n.includes('green dot') || n.includes('utr green')) return 'cell-green'
  if (n.includes('yellow') || n.includes('yellow ball')) return 'cell-yellow'
  if (n.includes('youth') || n.includes('development')) return 'cell-youth'
  if (n.includes('high performance')) return 'cell-hp'
  if (n.includes('liveball')) return 'cell-liveball'
  if (n.includes('cardio')) return 'cell-cardio'
  if (n.includes('adult') || n.includes('intermediate') || n.includes('advanced') || n.includes('beginner'))
    return 'cell-adult'
  return 'cell-other'
}

function buildScheduleLegendHtml(): string {
  let html = ''
  html += `<p class="schedule-legend" aria-label="Schedule color legend"><span class="legend-title">Legend:</span> `
  html += `<span class="legend-item"><span class="swatch swatch-red" aria-hidden="true"></span> Junior (Red/Orange/Green)</span> `
  html += `<span class="legend-item"><span class="swatch swatch-youth" aria-hidden="true"></span> Youth development</span> `
  html += `<span class="legend-item"><span class="swatch swatch-liveball" aria-hidden="true"></span> LiveBall</span> `
  html += `<span class="legend-item"><span class="swatch swatch-adult" aria-hidden="true"></span> Adult programming</span> `
  html += `<span class="legend-item"><span class="swatch swatch-cardio" aria-hidden="true"></span> Cardio</span> `
  html += `<span class="legend-item"><span class="swatch swatch-concurrent" aria-hidden="true"></span> Boxed = concurrent (times in cell)</span></p>`
  return html
}

/** Same 30-min grid + rowSpan as CourtFlyer (lib/calendar-schedule). */
function buildScheduleTablesHtml(scheduleByLocation: ScheduleByLocationByDay): string {
  let html = ''
  for (const loc of LOCATION_ORDER) {
    const byDay = scheduleByLocation[loc]
    if (!byDay) continue

    const grid = buildWeekGridForLocation(byDay)
    const range = getUsedRowRange(grid)
    const rowsToShow = range ? grid.slice(range.min, range.max + 1) : []

    let tbody = ''
    if (!range) {
      tbody = `<tr><td colspan="8" class="empty-schedule">No sessions this week</td></tr>`
    } else {
      tbody = rowsToShow
        .map((row, i) => {
          const rowIndex = range.min + i
          const timeLabel = escapeHtml(formatGridRowTime(rowIndex))
          let cells = ''
          for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cell = row[dayIndex]
            if (cell === 'covered') continue
            if (cell === null) {
              cells += `<td class="sched-empty"></td>`
              continue
            }
            const { slot, rowSpan } = cell
            const multiline = slot.programName.includes('\n')
            const display = multiline
              ? slot.programName
              : slot.programName.length > 36
                ? slot.programName.slice(0, 34) + '…'
                : slot.programName
            const cls = scheduleCellCssClass(slot.programName)
            const multiClass = multiline ? ' cell-multiline' : ''
            let inner = `<span class="sched-slot-title">${escapeHtml(display)}</span>`
            if (!multiline) {
              inner += `<div class="sched-slot-time">${escapeHtml(slot.time)}</div>`
            } else {
              inner += `<div class="sched-concurrent-note">Adjacent courts · block ${escapeHtml(slot.time)}</div>`
            }
            cells += `<td class="${cls}${multiClass}" rowspan="${rowSpan}">${inner}</td>`
          }
          return `<tr><th scope="row" class="time-cell">${timeLabel}</th>${cells}</tr>`
        })
        .join('')
    }

    const venue = FLYER_LOCATION_DISPLAY[loc] ?? loc
    html += `
      <div class="schedule-loc">
        <h3>${escapeHtml(venue)} — ${escapeHtml(COURT_LABEL[loc] ?? '')}</h3>
        <p class="sub schedule-sub">Group classes at this location</p>
        <table class="schedule-tbl">
          <thead><tr><th scope="col" class="col-time">Time</th>${DAY_ORDER.map((d) => `<th scope="col">${escapeHtml(d.slice(0, 3))}</th>`).join('')}</tr></thead>
          <tbody>${tbody}</tbody>
        </table>
      </div>`
  }
  return html
}

interface CoachCard {
  name: string
  flyerTitle: string
  flyerBio: string
  imageUrl: string
}

interface PrivateRateRow {
  coach: string
  rate_60: number
  rate_90: number
  pack_10?: number
  pack_20?: number
}

interface PricingRow {
  name: string
  duration: string
  price_1x: string
  price_2x: string | null
  dropIn: string
  location: string
}

interface CampRow {
  label: string
  dates: string
  ages: string
  price: string
  location: string
}

function buildFlyerHtml(options: {
  coaches: CoachCard[]
  privateRates: PrivateRateRow[]
  scheduleTablesHtml: string
  seasonLabel: string
  seasonDates: string
  weeks: number
  juniorRows: PricingRow[]
  adultProgrammingRows: PricingRow[]
  monthlyAdultRows: PricingRow[]
  camps: CampRow[]
  discountLine: string
  logoLbtaUrl: string
  logoCityUrl: string
}): string {
  const {
    coaches,
    privateRates,
    scheduleTablesHtml,
    seasonLabel,
    seasonDates,
    weeks,
    juniorRows,
    adultProgrammingRows,
    monthlyAdultRows,
    camps,
    discountLine,
    logoLbtaUrl,
    logoCityUrl,
  } = options

  const privateRatesOrder = ['Andrew Mateljan', 'Robert LeBuhn', 'Peter DeFrantz', 'Allison Cronk']
  const orderedRates = privateRatesOrder.map((name) => privateRates.find((r) => r.coach === name)).filter(Boolean) as PrivateRateRow[]
  const ratesForTable = orderedRates.length > 0 ? orderedRates : privateRates

  const coachHtml = coaches
    .map(
      (c) => `
      <div class="coach-card">
        <div class="coach-img-wrap"><img src="${c.imageUrl}" alt="${escapeHtml(c.name)}" class="coach-img" /></div>
        <p class="coach-name">${escapeHtml(c.name)}</p>
        <p class="coach-title">${escapeHtml(c.flyerTitle)}</p>
        <p class="coach-bio">${escapeHtml(c.flyerBio)}</p>
      </div>`
    )
    .join('')

  const privateTable = `
    <table class="data-tbl">
      <thead><tr><th>Coach</th><th>60 min</th><th>90 min</th><th>10-pack</th><th>20-pack</th></tr></thead>
      <tbody>
        ${ratesForTable
          .map(
            (r) =>
              `<tr><td>${escapeHtml(r.coach)}</td><td>$${r.rate_60}</td><td>$${r.rate_90}</td><td>$${r.pack_10 ?? '—'}</td><td>$${r.pack_20 ?? '—'}</td></tr>`
          )
          .join('')}
      </tbody>
    </table>`

  const juniorTable = `
    <table class="data-tbl">
      <thead><tr><th>Program</th><th>Location</th><th>1x/wk</th><th>2x/wk</th><th>Drop-in</th></tr></thead>
      <tbody>
        ${juniorRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td>${r.price_1x}</td><td>${r.price_2x ?? '—'}</td><td>${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`

  const adultProgrammingTable = `
    <table class="data-tbl">
      <thead><tr><th>Program</th><th>Location</th><th>1x/wk</th><th>2x/wk</th><th>Drop-in</th></tr></thead>
      <tbody>
        ${adultProgrammingRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td>${r.price_1x}</td><td>${r.price_2x ?? '—'}</td><td>${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`
  const monthlyAdultTable = `
    <table class="data-tbl" aria-label="Monthly adult class pricing">
      <thead><tr><th>Program</th><th>Location</th><th>1x/wk</th><th>2x/wk</th><th>Drop-in</th></tr></thead>
      <tbody>
        ${monthlyAdultRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td>${r.price_1x}</td><td>${r.price_2x ?? '—'}</td><td>${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`

  const campsList = camps
    .map(
      (c) =>
        `<li><strong>${escapeHtml(c.label)}</strong> ${escapeHtml(c.dates)} · Ages ${escapeHtml(c.ages)} · ${escapeHtml(c.price)}${c.location ? ` · ${escapeHtml(c.location)}` : ''}</li>`
    )
    .join('')

  const logoStripHtml =
    logoLbtaUrl || logoCityUrl
      ? `<div class="logo-strip">${logoLbtaUrl ? `<img src="${logoLbtaUrl}" alt="Laguna Beach Tennis Academy" class="logo-lbta" />` : ''}${logoCityUrl ? `<span class="logo-city-wrap"><img src="${logoCityUrl}" alt="City of Laguna Beach" class="logo-city" /></span>` : ''}</div>`
      : ''

  const footerLogoHtml = logoLbtaUrl
    ? `<div class="footer-logo"><img src="${logoLbtaUrl}" alt="" class="footer-logo-img" /></div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>LBTA Court Flyer — ${escapeHtml(seasonLabel)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', system-ui, sans-serif; color: #1B3A5C; margin: 0 auto; padding: 14px 16px; max-width: 10.2in; font-size: 14px; line-height: 1.32; background: #FAF8F4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .flyer { max-width: 100%; }
    .logo-strip { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 24px; padding: 12px 16px; background: #0F2237; margin: -14px -16px 0 -16px; }
    .logo-lbta { height: ${COURT_FLYER_LOGO_ROW_PX}px; width: auto; max-width: min(460px, 96%); object-fit: contain; object-position: center; flex-shrink: 0; display: block; filter: brightness(0) invert(1); opacity: 0.95; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .logo-city-wrap { height: ${COURT_FLYER_LOGO_ROW_PX}px; width: ${COURT_FLYER_LOGO_ROW_PX}px; border-radius: 50%; background: #0F2237; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 1px rgba(255,255,255,0.12); }
    .logo-city { height: ${COURT_FLYER_CITY_SEAL_INNER_PX}px; width: ${COURT_FLYER_CITY_SEAL_INNER_PX}px; object-fit: contain; object-position: center; display: block; }
    h1 { font-family: Cormorant, Georgia, serif; font-size: 20px; font-weight: 600; text-align: center; color: #0F2237; text-transform: uppercase; letter-spacing: 0.02em; margin: 0; max-width: 32em; margin-left: auto; margin-right: auto; padding: 0 8px; line-height: 1.15; }
    .section-horizon { width: 100%; max-width: 120px; height: 3px; border: none; border-radius: 2px; background: linear-gradient(90deg, #2E8B8B, #E8834A); margin: 8px auto 0; opacity: 0.8; }
    .sub { text-align: center; color: #1B3A5C; margin: 10px 0 0; }
    .schedule-sub { text-align: left; font-size: 11px; margin: 0 0 8px; }
    .cta-line { text-align: center; font-weight: 700; color: #0F2237; margin: 10px 0 0; font-size: 13px; letter-spacing: 0.02em; }
    h2 { font-family: Cormorant, Georgia, serif; font-size: 15px; font-weight: 600; color: #0F2237; margin: 14px 0 0; }
    h2 + .section-horizon { margin: 6px 0 8px; }
    h3 { font-family: Cormorant, Georgia, serif; font-size: 11px; font-weight: 600; color: #0F2237; text-transform: uppercase; margin: 10px 0 4px; }
    .coaches-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 10px 0; }
    .coach-card { break-inside: avoid; display: flex; flex-direction: column; align-items: center; }
    .coach-img-wrap { width: 124px; height: 165px; flex-shrink: 0; overflow: hidden; border-radius: 2px; background: #F5F0E5; }
    .coach-img { width: 124px; height: 165px; object-fit: cover; object-position: center top; display: block; border-radius: 2px; }
    .coach-name { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; margin: 6px 0 2px; }
    .coach-title { font-size: 10px; font-weight: 500; color: #1B3A5C; margin: 0; }
    .coach-bio { font-size: 9px; color: #1B3A5C; margin: 4px 0 0; line-height: 1.3; opacity: 0.95; }
    .data-tbl { width: 100%; border-collapse: collapse; font-size: 11px; margin: 6px 0; }
    .data-tbl th, .data-tbl td { padding: 5px 7px; text-align: left; border-bottom: 1px solid rgba(27,58,92,0.12); }
    .data-tbl thead tr { border-bottom: 2px solid rgba(27,58,92,0.25); background: rgba(245,240,229,0.4); }
    .data-tbl th { font-weight: 600; color: #0F2237; }
    .data-tbl td:nth-child(n+2) { text-align: right; }
    .cta-block { background: rgba(232,131,74,0.08); padding: 12px 12px 12px 28px; margin: 10px 0; font-size: 13px; background-image: linear-gradient(180deg, #2E8B8B, #E8834A); background-size: 4px 100%; background-repeat: no-repeat; background-position: left; }
    .cta-block .what { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; font-size: 14px; margin-bottom: 6px; }
    .cta-block .address { font-size: 12px; color: #1B3A5C; margin-top: 10px; opacity: 0.9; }
    .courts-list { font-size: 12px; margin: 8px 0; }
    .courts-list li { margin: 4px 0; }
    .courts-section { background: rgba(245,240,229,0.5); padding: 12px; margin: 12px 0; }
    .schedule-intro { break-inside: avoid; page-break-inside: avoid; }
    .pricing-sub { font-size: 10px; color: #1B3A5C; margin: 0 0 6px; line-height: 1.35; opacity: 0.92; }
    .schedule-legend { font-size: 10px; color: #1B3A5C; margin: 0 0 12px; line-height: 1.5; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
    .schedule-legend .legend-title { font-weight: 700; color: #0F2237; }
    .schedule-legend .legend-item { display: inline-flex; align-items: center; gap: 4px; }
    .schedule-legend .swatch { display: inline-block; width: 12px; height: 12px; border-radius: 2px; border: 2px solid rgba(27,58,92,0.35); flex-shrink: 0; }
    .swatch-red { background: rgba(240,78,35,0.45); }
    .swatch-youth { background: rgba(46,139,139,0.4); }
    .swatch-liveball { background: rgba(46,139,139,0.38); }
    .swatch-adult { background: rgba(27,58,92,0.14); }
    .swatch-cardio { background: rgba(232,131,74,0.38); }
    .swatch-concurrent { background: #fff; box-shadow: inset 0 0 0 1px rgba(27,58,92,0.15); }
    .schedule-loc { margin: 8px 0; break-inside: auto; }
    .schedule-tbl { width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid rgba(27,58,92,0.2); }
    .schedule-tbl th, .schedule-tbl td { padding: 4px 5px; border-bottom: 1px solid rgba(27,58,92,0.15); border-left: 1px solid rgba(27,58,92,0.1); vertical-align: top; }
    .schedule-tbl thead tr { background: rgba(245,240,229,0.6); border-bottom: 2px solid rgba(27,58,92,0.25); }
    .schedule-tbl th { font-weight: 700; color: #0F2237; }
    .schedule-tbl .col-time { width: 5.5em; }
    .schedule-tbl .time-cell { font-weight: 700; color: #0F2237; background: rgba(245,240,229,0.35); border-right: 1px solid rgba(27,58,92,0.12); text-align: left; white-space: nowrap; font-size: 11px; }
    .schedule-tbl .sched-empty { min-height: 28px; }
    .schedule-tbl .empty-schedule { text-align: center; padding: 12px; color: rgba(27,58,92,0.65); }
    .schedule-tbl .sched-slot-title { font-weight: 600; color: #0F2237; font-size: 10px; line-height: 1.35; display: block; }
    .schedule-tbl .sched-slot-time { font-size: 9px; font-weight: 600; color: #1B3A5C; margin-top: 3px; }
    .schedule-tbl .sched-concurrent-note { font-size: 8px; color: rgba(27,58,92,0.88); margin-top: 4px; line-height: 1.3; }
    .schedule-tbl .cell-red { background: rgba(240,78,35,0.45); }
    .schedule-tbl .cell-orange { background: rgba(232,131,74,0.45); }
    .schedule-tbl .cell-green { background: rgba(58,139,110,0.4); }
    .schedule-tbl .cell-yellow { background: rgba(196,150,60,0.4); }
    .schedule-tbl .cell-junior { background: rgba(245,240,229,0.75); }
    .schedule-tbl .cell-youth { background: rgba(46,139,139,0.4); }
    .schedule-tbl .cell-liveball { background: rgba(46,139,139,0.38); }
    .schedule-tbl .cell-cardio { background: rgba(232,131,74,0.38); }
    .schedule-tbl .cell-hp { background: rgba(27,58,92,0.18); color: #0F2237; }
    .schedule-tbl .cell-adult { background: rgba(27,58,92,0.12); }
    .schedule-tbl .cell-other { background: rgba(245,240,229,0.55); }
    .schedule-tbl .cell-concurrent { background: #fff !important; box-shadow: inset 0 0 0 1px rgba(27,58,92,0.22); }
    .schedule-tbl td.cell-multiline { white-space: pre-line; }
    .camps-ul { font-size: 12px; margin: 8px 0; padding-left: 20px; }
    .camps-ul li { margin: 4px 0; }
    .discount-line { font-size: 10px; color: #1B3A5C; opacity: 0.9; margin-top: 8px; }
    footer { margin-top: 12px; padding: 14px 16px; border-top: 1px solid rgba(27,58,92,0.2); background: #0F2237; color: rgba(255,255,255,0.9); text-align: center; font-size: 11px; }
    footer .footer-logo { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    footer .footer-logo-img { height: 40px; width: auto; max-width: 220px; object-fit: contain; display: inline-block; vertical-align: middle; opacity: 0.95; filter: brightness(0) invert(1); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .city-register { max-width: 36em; margin: 10px auto 0; padding: 8px 12px; text-align: center; border: 1px solid rgba(27,58,92,0.15); border-radius: 2px; background: rgba(245,240,229,0.5); }
    .city-register .lead { font-size: 12px; font-weight: 600; color: #0F2237; margin: 0; }
    .city-register .sub { font-size: 10px; color: #1B3A5C; margin: 6px 0 0; line-height: 1.3; opacity: 0.92; }
    .city-register .btn { display: inline-block; margin-top: 8px; padding: 8px 14px; background: #0A0A0A; color: #fff; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 2px; }
    .city-register .url-hint { font-size: 8px; color: rgba(27,58,92,0.7); margin: 6px 0 0; }
    .cta-city-link { margin-top: 8px; font-size: 12px; font-weight: 600; }
    .cta-city-link a { color: #2E8B8B; }
    footer .tagline { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #fff; margin: 8px 0; }
    footer .section-horizon { margin-top: 8px; margin-bottom: 4px; opacity: 0.9; }
    footer .partner { font-size: 10px; text-transform: uppercase; margin: 8px 0 4px; opacity: 0.85; }
    footer a { color: #2E8B8B; }
  </style>
</head>
<body class="flyer">
  ${logoStripHtml}
  <h1>Certified City of Laguna Beach Coaching Team</h1>
  <div class="section-horizon"></div>
  <p class="sub">Only LBTA coaches are authorized to teach at City of Laguna Beach tennis courts.</p>
  <p class="cta-line">FREE TRIAL — Try Any Group Class</p>
  <div class="city-register">
    <p class="lead">Register for group classes</p>
    <p class="sub">City of Laguna Beach Recreation Division — complete registration online before your first session.</p>
    <a class="btn" href="${escapeHtml(FLYER_CONTACT.registerUrl)}">City registration — Rec1 catalog</a>
    <p class="url-hint">secure.rec1.com · City of Laguna Beach</p>
  </div>

  <h2>Your Certified Coaching Team</h2>
  <div class="section-horizon"></div>
  <div class="coaches-grid">${coachHtml}</div>

  <h2>Private Lessons</h2>
  <div class="section-horizon"></div>
  ${privateTable}

  <div class="cta-block">
    <p class="what">What to do</p>
    <strong>FREE TRIAL</strong> (949) 534-0457 &nbsp;|&nbsp; <strong>REGISTER</strong> (949) 497-3311 &nbsp;|&nbsp; <strong>EMAIL</strong> support@lagunabeachtennisacademy.com
    <p class="cta-city-link"><a href="${escapeHtml(FLYER_CONTACT.registerUrl)}">Register online — City Recreation (Rec1)</a></p>
    <p class="address">${escapeHtml(FLYER_ACADEMY_ADDRESS)}</p>
  </div>

  <h2>LBTA Reserved Courts</h2>
  <div class="section-horizon"></div>
  <div class="courts-section">
  <ul class="courts-list">
    <li><strong>Moulton Meadows Park</strong> Court 2 · Balboa Ave &amp; Capistrano Ave</li>
    <li><strong>Alta Laguna Park</strong> Courts 1 &amp; 2 · 3300 Alta Laguna Dr</li>
    <li><strong>Laguna Beach High School</strong> Courts 5 &amp; 6 · 670 Park Ave</li>
  </ul>
  <p class="sub" style="font-size:10px; margin-top:4px;">Sat 1-3PM: Courts 1-3 USTA League</p>
  </div>

  <div class="schedule-intro">
  <h2>Schedules, Pricing &amp; Registration · ${escapeHtml(seasonLabel)} · ${escapeHtml(seasonDates)}</h2>
  <div class="section-horizon"></div>
  <p class="sub" style="text-align:left; margin:0 0 16px;">lagunabeachtennisacademy.com · Movement. Craft. Community.</p>
  ${buildScheduleLegendHtml()}
  </div>
  ${scheduleTablesHtml}

  <h2>Camps</h2>
  <div class="section-horizon"></div>
  <ul class="camps-ul">${campsList}</ul>

  <h2>Program Pricing</h2>
  <div class="section-horizon"></div>
  <h3>Junior &amp; Competitive</h3>
  ${juniorTable}
  <h3>Adult programming</h3>
  <p class="pricing-sub">Session-based group classes (per season).</p>
  ${adultProgrammingTable}
  <h3>Monthly classes for adults</h3>
  <p class="pricing-sub">Per-month membership; columns show once- or twice-weekly options.</p>
  ${monthlyAdultTable}
  <p class="discount-line">${escapeHtml(discountLine)}</p>

  <footer>
    ${footerLogoHtml}
    <p><strong>REGISTER</strong> (949) 497-3311</p>
    <p><a href="${escapeHtml(FLYER_CONTACT.registerUrl)}">City online registration</a></p>
    <p><strong>FREE TRIAL &amp; QUESTIONS</strong> (949) 534-0457</p>
    <p>support@lagunabeachtennisacademy.com</p>
    <p>${escapeHtml(FLYER_ACADEMY_ADDRESS)}</p>
    <p><a href="https://lagunabeachtennisacademy.com">lagunabeachtennisacademy.com</a></p>
    <p class="tagline">Movement. Craft. Community.</p>
    <div class="section-horizon"></div>
    <p class="partner">Official City Partner</p>
    <p><strong>Laguna Beach Tennis Academy</strong></p>
    <p>${escapeHtml(seasonLabel)} · ${escapeHtml(seasonDates)} · ${weeks} Weeks</p>
  </footer>
</body>
</html>`
}

async function main(): Promise<void> {
  const coachesPath = path.join(root, 'data', 'coaches.json')
  const flyerBiosPath = path.join(root, 'data', 'flyer-coach-bios.json')
  const privateRatesPath = path.join(root, 'data', 'private-rates.json')
  const year2026Path = path.join(root, 'data', 'year2026.json')
  const imageDir = path.join(root, 'public', 'images', 'print')

  const coachesData = JSON.parse(fs.readFileSync(coachesPath, 'utf8')) as { coaches?: Array<{ slug?: string; name?: string; title?: string; bio?: string }> }
  const flyerBios = JSON.parse(fs.readFileSync(flyerBiosPath, 'utf8')) as Record<string, { flyerTitle?: string; flyerBio?: string }>
  const privateRates = JSON.parse(fs.readFileSync(privateRatesPath, 'utf8')) as PrivateRateRow[]
  const year2026 = JSON.parse(fs.readFileSync(year2026Path, 'utf8')) as {
    camps?: Array<{
      id: string
      dates: string
      ages: string
      price?: number
      location?: string
    }>
  }

  const FLYER_ORDER = ['andrew-mateljan', 'robert-lebuhn', 'peter-defrantz', 'allison-cronk'] as const
  const SLUG_TO_IMG: Record<string, string> = {
    'andrew-mateljan': 'andrew',
    'robert-lebuhn': 'robert',
    'allison-cronk': 'allison',
    'peter-defrantz': 'peter',
  }
  const coachesList = coachesData.coaches || []
  const bySlug = new Map(coachesList.map((c) => [c.slug || '', c]))
  const coaches: CoachCard[] = FLYER_ORDER.map((slug) => {
    const coach = bySlug.get(slug)
    const bio = flyerBios[slug]
    const imgName = SLUG_TO_IMG[slug] || slug
    const imgPath = path.join(imageDir, `coach-${imgName}.png`)
    return {
      name: coach?.name ?? slug,
      flyerTitle: bio?.flyerTitle ?? coach?.title ?? '',
      flyerBio: bio?.flyerBio ?? coach?.bio ?? '',
      imageUrl: fs.existsSync(imgPath) ? toFileUrl(imgPath) : '',
    }
  })

  const scheduleByLocation = getScheduleByLocationByDay('spring')
  const scheduleTablesHtml = buildScheduleTablesHtml(scheduleByLocation)

  const springSummer = getSpringSummer2026()
  const spring = springSummer.spring
  const seasonLabel = spring.label || 'Spring'
  const seasonDates = spring.dates || 'April 6 – June 13, 2026'
  const weeks = spring.weeks ?? 10

  const {
    juniorPricing: juniorRows,
    adultProgrammingPricing: adultProgrammingRows,
    monthlyAdultPricing: monthlyAdultRows,
  } = getCourtFlyerProgramPricingRows('spring')

  const thanksgiving = year2026.camps?.find((c) => c.id === 'thanksgiving')
  const swimTennis = year2026.camps?.find((c) => c.id === 'swim-tennis')
  const summerCamp = year2026.camps?.find((c) => c.id === 'summer')
  const springBreakCamp = year2026.camps?.find((c) => c.id === 'spring-break')
  const camps: CampRow[] = [
    {
      label: 'Swim & Tennis',
      dates: swimTennis?.dates ?? 'Jun 16–Aug 14',
      ages: swimTennis?.ages ?? '5-11',
      price: `$${swimTennis?.price ?? 495}/wk`,
      location: swimTennis?.location ?? 'Alta Laguna Park',
    },
    {
      label: 'Spring Break',
      dates: springSummer.camps?.springBreak?.dates ?? springBreakCamp?.dates ?? '',
      ages: springBreakCamp?.ages ?? '5-14',
      price: `$${springBreakCamp?.price ?? 295}/wk`,
      location: springBreakCamp?.location ?? 'Alta Laguna Park',
    },
    {
      label: 'Summer',
      dates: springSummer.camps?.summer?.dates ?? '',
      ages: summerCamp?.ages ?? '5-17',
      price: `$${summerCamp?.price ?? 495}/wk`,
      location: summerCamp?.location ?? 'Alta Laguna Park / Laguna Beach High School',
    },
  ]
  if (thanksgiving) {
    camps.push({
      label: 'Thanksgiving',
      dates: thanksgiving.dates,
      ages: thanksgiving.ages,
      price: `$${thanksgiving.price ?? 221}/wk`,
      location: thanksgiving.location ?? 'Alta Laguna Park / Laguna Beach High School',
    })
  }

  const discountLine = COURT_FLYER_DISCOUNT_LINE

  const logosDir = path.join(root, 'public', 'logos')
  const lbtaBlkPath = path.join(logosDir, 'LBTAblktext.png')
  const cityLogoPath = path.join(logosDir, 'city-laguna-beach.png')
  /** Canonical repo asset; LBTAwhttext.png is not shipped — use blk + CSS invert on navy strip. */
  const logoLbtaUrl = fs.existsSync(lbtaBlkPath) ? toFileUrl(lbtaBlkPath) : ''
  const logoCityUrl = fs.existsSync(cityLogoPath) ? toFileUrl(cityLogoPath) : ''

  const html = buildFlyerHtml({
    coaches,
    privateRates,
    scheduleTablesHtml,
    seasonLabel,
    seasonDates,
    weeks,
    juniorRows,
    adultProgrammingRows,
    monthlyAdultRows,
    camps,
    discountLine,
    logoLbtaUrl,
    logoCityUrl,
  })

  const tmpHtml = path.join(root, '.court-flyer-temp.html')
  fs.writeFileSync(tmpHtml, html, 'utf8')

  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.setViewportSize({ width: COURT_FLYER_VIEWPORT_WIDTH_PX, height: 4000 })
    await page.goto(toFileUrl(tmpHtml), { waitUntil: 'load', timeout: 10000 })
    const heightPx = await page.evaluate(() => Math.ceil(document.body.scrollHeight))
    const margin = { top: '0.3in', right: '0.3in', bottom: '0.3in', left: '0.3in' }
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
  } finally {
    try {
      fs.unlinkSync(tmpHtml)
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
