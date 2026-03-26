/**
 * Generate LBTA Master Court Flyer PDF from repo data (no dev server).
 * Displays Spring session only. Schedule and pricing from data/spring-summer-2026.json (spring),
 * camps from data/year2026.json, courts/contact/discount from lib/flyer-config.
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
  FLYER_CITY_REGISTRATION_QR_PATH,
  FLYER_CONTACT,
  FLYER_COURTS,
  FLYER_LOCATION_DISPLAY,
  FLYER_OTHER_LOCATIONS_NOTE,
  FLYER_USTA_NOTE,
} from '../lib/flyer-config'
import {
  getCourtFlyerProgramPricingRows,
  getYouthDevelopmentUtrPlacementForFlyer,
  type CourtFlyerYouthUtrDetail,
} from '../lib/flyer-pricing'
import {
  getScheduleByLocationByDay,
  buildWeekGridForLocation,
  formatGridRowTime,
  getUsedRowRange,
  DAY_ORDER,
  type CalendarSlot,
  type ConcurrentSessionRow,
  type ScheduleByLocationByDay,
  concurrentRowKind,
  partitionConcurrentSessions,
  playerGuidanceFromAges,
  sortConcurrentSessionsByStart,
} from '../lib/calendar-schedule'
import { getSpringSummer2026 } from '../lib/programs-data'
import {
  COURT_FLYER_CITY_SEAL_INNER_PX,
  COURT_FLYER_LOGO_ROW_PX,
} from '../lib/court-flyer-print'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

/** If provided, write a single master PDF to this path; otherwise write 4 PDFs (master + 3 location-specific) to Desktop. */
const singleOutputPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : null
const desktopDir = path.join(process.env.HOME || process.env.USERPROFILE || '', 'Desktop')

const LOCATION_ORDER = ['Alta', 'LBHS', 'Moulton'] as const
/** Schedule section headers: same as FLYER_COURTS so flyer matches website + reserved courts list. */
const COURT_LABEL: Record<string, string> = {
  Moulton: FLYER_COURTS[0].courts,
  Alta: FLYER_COURTS[1].courts,
  LBHS: FLYER_COURTS[2].courts,
}

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildYouthDevelopmentUtrHtml(detail: CourtFlyerYouthUtrDetail | null): string {
  if (!detail) return ''
  const tiers = detail.tiers
    .map(
      (t) =>
        `<li><strong>${escapeHtml(t.label)}</strong><span class="muted"> · ${escapeHtml(t.utrRange)}</span><div class="tier-focus">${escapeHtml(t.focus)}</div></li>`
    )
    .join('')
  const note = detail.pricingNote
    ? `<p class="youth-utr-note">${escapeHtml(detail.pricingNote)}</p>`
    : ''
  return `<div class="youth-utr-box" role="region" aria-label="Youth Development UTR placement">
    <p class="youth-utr-title">Youth Development — UTR placement</p>
    <p class="youth-utr-intro">${escapeHtml(detail.intro)}</p>
    <ul class="youth-utr-tiers">${tiers}</ul>
    <p class="youth-utr-p">${escapeHtml(detail.structure)}</p>
    <p class="youth-utr-p">${escapeHtml(detail.advancement)}</p>
    ${note}
  </div>`
}

function toFileUrl(filePath: string): string {
  const resolved = path.resolve(filePath)
  return 'file://' + (process.platform === 'win32' ? '/' : '') + resolved.replace(/\\/g, '/')
}

function concurrentRowPdfClass(kind: ReturnType<typeof concurrentRowKind>): string {
  switch (kind) {
    case 'hp':
      return 'conc-item conc-hp'
    case 'utr_green':
      return 'conc-item conc-utr-green'
    case 'youth_dev':
      return 'conc-item conc-youth-dev'
    case 'liveball':
      return 'conc-item conc-liveball'
    case 'adult':
      return 'conc-item conc-adult'
    case 'j_stars':
    case 'j_red':
      return 'conc-item conc-j-red'
    case 'j_orange':
      return 'conc-item conc-j-orange'
    case 'j_green':
      return 'conc-item conc-j-green'
    case 'youth':
      return 'conc-item conc-youth'
    default:
      return 'conc-item conc-default'
  }
}

/** Match ConcurrentScheduleCellBody: two-column juniors | adults, or stacked youth rows with tints. */
function buildConcurrentCellInnerHtml(slot: CalendarSlot): string {
  const sessions = slot.concurrentSessions
  if (!sessions?.length) return ''
  const { juniors, adultsColumn, youthColumn } = partitionConcurrentSessions(sessions)
  const j = sortConcurrentSessionsByStart(juniors)
  const a = sortConcurrentSessionsByStart(adultsColumn)
  const y = sortConcurrentSessionsByStart(youthColumn)
  const block = escapeHtml(slot.time)

  function rowHtml(r: ConcurrentSessionRow): string {
    const cls = concurrentRowPdfClass(concurrentRowKind(r.programName, r.category))
    const g = playerGuidanceFromAges(r.ages)
    const guideHtml = g ? `<div class="conc-guide">${escapeHtml(g)}</div>` : ''
    return `<div class="${cls}"><div class="conc-time">${escapeHtml(r.time)}</div><div class="conc-pname">${escapeHtml(r.programName)}</div>${guideHtml}</div>`
  }

  function colHtml(title: string, rows: ConcurrentSessionRow[]): string {
    if (!rows.length) return ''
    return `<div class="conc-col"><p class="conc-hdr">${escapeHtml(title)}</p>${rows.map(rowHtml).join('')}</div>`
  }

  const twoCol = j.length > 0 && a.length > 0
  const onlyYouth = y.length > 0 && j.length === 0 && a.length === 0

  if (twoCol) {
    return `<div class="conc-two">${colHtml('Juniors', j)}<div class="conc-vsep" aria-hidden="true"></div>${colHtml('Adults & LiveBall', a)}</div>`
  }
  if (onlyYouth) {
    return `<p class="conc-hdr">Youth & performance</p>${y.map(rowHtml).join('')}`
  }
  const sorted = sortConcurrentSessionsByStart(sessions)
  return `${sorted.map(rowHtml).join('')}`
}

/** Align with components/print/CourtFlyer.tsx scheduleCellBgClass (print-safe CSS). */
function scheduleCellCssClass(slot: CalendarSlot): string {
  if ((slot.concurrentSessions?.length ?? 0) > 1 || slot.programName.includes('\n')) {
    return 'cell-concurrent'
  }
  const programName = slot.programName
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
  html += `<span class="legend-item"><span class="swatch swatch-concurrent" aria-hidden="true"></span> One box = one class (time, name, level or ages in cell)</span></p>`
  return html
}

/** Same 30-min grid + rowSpan as CourtFlyer (lib/calendar-schedule). If singleLocation is set, only that venue's table is included. */
function buildScheduleTablesHtml(
  scheduleByLocation: ScheduleByLocationByDay,
  singleLocation?: string
): string {
  let html = ''
  const locations = singleLocation ? [singleLocation] : [...LOCATION_ORDER]
  for (const loc of locations) {
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
            const multiline =
              (slot.concurrentSessions?.length ?? 0) > 1 || slot.programName.includes('\n')
            const structured = (slot.concurrentSessions?.length ?? 0) > 1
            const display = multiline
              ? slot.programName
              : slot.programName.length > 36
                ? slot.programName.slice(0, 34) + '…'
                : slot.programName
            const cls = scheduleCellCssClass(slot)
            const multiClass = multiline && !structured ? ' cell-multiline' : ''
            let inner: string
            if (structured) {
              inner = `<div class="sched-concurrent-structured">${buildConcurrentCellInnerHtml(slot)}</div>`
            } else {
              inner = `<span class="sched-slot-title">${escapeHtml(display)}</span>`
              if (!multiline) {
                const g = playerGuidanceFromAges(slot.ages)
                if (g) inner += `<div class="sched-slot-guide">${escapeHtml(g)}</div>`
                inner += `<div class="sched-slot-time">${escapeHtml(slot.time)}</div>`
              } else {
                inner += `<div class="sched-slot-time">${escapeHtml(slot.time)}</div>`
              }
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
  juniorRows: Array<PricingRow & { location?: string }>
  adultProgrammingRows: Array<PricingRow & { location?: string }>
  monthlyAdultRows: Array<PricingRow & { location?: string }>
  camps: CampRow[]
  discountLine: string
  logoLbtaUrl: string
  logoCityUrl: string
  /** file:// URL to `public/images/print/city-registration-qr.png` when present */
  cityQrFileUrl: string
  /** Youth Development UTR tier callout (from spring-summer program JSON) */
  youthUtrHtml: string
  /** On location-specific flyers: note to check City/academy site for other locations */
  otherLocationsNote?: string
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
    cityQrFileUrl,
    youthUtrHtml,
    otherLocationsNote,
  } = options

  const cityQrBlock =
    cityQrFileUrl !== ''
      ? `<a class="city-register-qr-link" href="${escapeHtml(FLYER_CONTACT.cityClassesRegistrationUrl)}" aria-label="Open City of Laguna Beach recreation class registration"><img class="city-register-qr" src="${cityQrFileUrl}" alt="QR code: City of Laguna Beach recreation classes and registration" width="128" height="128" /></a>`
      : ''

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
    <table class="data-tbl private-rates-tbl">
      <thead><tr>
        <th style="width:22%">Coach</th>
        <th style="width:14%; text-align:right">60 min</th>
        <th style="width:14%; text-align:right">90 min</th>
        <th style="width:18%; text-align:right">10-pack</th>
        <th style="width:18%; text-align:right">20-pack</th>
      </tr></thead>
      <tbody>
        ${ratesForTable
          .map(
            (r, i) => {
              const pack10 = r.pack_10 != null ? `$${r.pack_10}` : '—'
              const pack20 = r.pack_20 != null ? `$${r.pack_20}` : '—'
              return `<tr class="private-row private-row-${i % 4}"><td>${escapeHtml(r.coach)}</td><td style="text-align:right">$${r.rate_60}</td><td style="text-align:right">$${r.rate_90}</td><td style="text-align:right">${pack10}</td><td style="text-align:right">${pack20}</td></tr>`
            }
          )
          .join('')}
      </tbody>
    </table>`

  const pricingTblHead = `<thead><tr><th style="width:36%">Program</th><th style="width:22%; text-align:left">Location</th><th style="width:12%; text-align:right">1x/wk</th><th style="width:12%; text-align:right">2x/wk</th><th style="width:10%; text-align:right">Drop-in</th></tr></thead>`
  const juniorTable = `
    <table class="data-tbl pricing-tbl">
      ${pricingTblHead}
      <tbody>
        ${juniorRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td style="text-align:right">${r.price_1x}</td><td style="text-align:right">${r.price_2x ?? '—'}</td><td style="text-align:right">${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`

  const adultProgrammingTable = `
    <table class="data-tbl pricing-tbl">
      ${pricingTblHead}
      <tbody>
        ${adultProgrammingRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td style="text-align:right">${r.price_1x}</td><td style="text-align:right">${r.price_2x ?? '—'}</td><td style="text-align:right">${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`
  const monthlyAdultTable = `
    <table class="data-tbl pricing-tbl" aria-label="Monthly adult class pricing">
      ${pricingTblHead}
      <tbody>
        ${monthlyAdultRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td style="text-align:right">${r.price_1x}</td><td style="text-align:right">${r.price_2x ?? '—'}</td><td style="text-align:right">${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`

  const campsList = camps
    .map(
      (c) =>
        `<li><strong>${escapeHtml(c.label)}</strong> ${escapeHtml(c.dates)} · Ages ${escapeHtml(c.ages)} · ${escapeHtml(c.price)}${c.location ? ` · ${escapeHtml(c.location)}` : ''}</li>`
    )
    .join('')

  const logoStripHtml =
    `<div class="logo-strip">
  ${logoLbtaUrl ? `<img src="${logoLbtaUrl}" alt="Laguna Beach Tennis Academy" class="logo-lbta" />` : ''}
  <p class="logo-strip-tagline">Official City of Laguna Beach Partner · Certified Coaching</p>
  ${logoCityUrl ? `<span class="logo-city-wrap"><img src="${logoCityUrl}" alt="City of Laguna Beach" class="logo-city" /></span>` : ''}
</div>`

  const footerLogoHtml = logoLbtaUrl
    ? `<div class="footer-logo"><img src="${logoLbtaUrl}" alt="" class="footer-logo-img" /></div>`
    : ''

  const fontUrl = 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,600;1,400&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>LBTA Court Flyer — ${escapeHtml(seasonLabel)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="${fontUrl}" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', system-ui, sans-serif; color: #1B3A5C; margin: 0 auto; padding: 12px 20px; max-width: 16.4in; font-size: 17px; line-height: 1.35; background: #FAF8F4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .flyer { max-width: 100%; }
    .logo-strip { display: flex; flex-wrap: nowrap; align-items: center; justify-content: center; gap: 24px 32px; padding: 10px 24px; background: #0F2237; margin: -12px -20px 0 -20px; min-height: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .logo-strip-tagline { margin: 0; font-size: 15px; font-weight: 700; color: #fff; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.98; max-width: 20em; text-align: center; line-height: 1.25; flex-shrink: 0; }
    .logo-lbta { height: ${COURT_FLYER_LOGO_ROW_PX}px; width: auto; max-width: 300px; min-width: 180px; object-fit: contain; object-position: center; display: block; filter: brightness(0) invert(1); opacity: 0.95; -webkit-print-color-adjust: exact; print-color-adjust: exact; flex-shrink: 0; }
    .logo-city-wrap { height: 72px; width: 72px; flex-shrink: 0; border-radius: 50%; background: #0F2237; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 1px rgba(255,255,255,0.12); }
    .logo-city { height: 58px; width: 58px; object-fit: contain; object-position: center; display: block; }
    .flyer-hero { text-align: center; padding: 10px 12px 0; margin-bottom: 0; }
    .flyer-hero-title { font-family: 'DM Sans', system-ui, sans-serif; font-size: 30px; font-weight: 800; color: #0F2237; letter-spacing: 0.03em; margin: 0; line-height: 1.15; text-transform: uppercase; }
    .flyer-hero-sub { font-family: Cormorant, Georgia, serif; font-size: 17px; font-weight: 600; color: #1B3A5C; margin: 8px 0 0; letter-spacing: 0.02em; text-transform: uppercase; }
    .section-horizon { width: 100%; max-width: 140px; height: 3px; border: none; border-radius: 2px; background: linear-gradient(90deg, #2E8B8B, #E8834A); margin: 10px auto 0; opacity: 0.85; }
    .sub { text-align: center; color: #1B3A5C; margin: 6px 0 0; font-size: 16px; }
    .schedule-sub { text-align: left; font-size: 13px; margin: 0 0 4px; }
    .cta-line { text-align: center; font-weight: 700; color: #0F2237; margin: 6px 0 0; font-size: 16px; letter-spacing: 0.02em; }
    h2 { font-family: Cormorant, Georgia, serif; font-size: 20px; font-weight: 600; color: #0F2237; margin: 12px 0 0; }
    h2 + .section-horizon { margin: 4px 0 6px; }
    h3 { font-family: Cormorant, Georgia, serif; font-size: 14px; font-weight: 600; color: #0F2237; text-transform: uppercase; margin: 8px 0 4px; }
    .coaches-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; }
    .coach-card { break-inside: avoid; display: flex; flex-direction: column; align-items: center; }
    .coach-img-wrap { width: 100px; height: 132px; flex-shrink: 0; overflow: hidden; border-radius: 2px; background: #F5F0E5; }
    .coach-img { width: 100px; height: 132px; object-fit: cover; object-position: center top; display: block; border-radius: 2px; }
    .coach-name { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; margin: 5px 0 2px; font-size: 15px; }
    .coach-title { font-size: 11px; font-weight: 500; color: #1B3A5C; margin: 0; }
    .coach-bio { font-size: 11px; color: #1B3A5C; margin: 3px 0 0; line-height: 1.3; opacity: 0.95; }
    .data-tbl { width: 100%; border-collapse: collapse; font-size: 14px; margin: 6px 0; }
    .data-tbl th, .data-tbl td { padding: 5px 8px; text-align: left; border-bottom: 1px solid rgba(27,58,92,0.12); }
    .data-tbl thead tr { border-bottom: 2px solid rgba(27,58,92,0.25); background: rgba(245,240,229,0.4); }
    .data-tbl th { font-weight: 600; color: #0F2237; }
    .data-tbl td:nth-child(n+2) { text-align: right; }
    .data-tbl.private-rates-tbl { table-layout: fixed; width: 100%; }
    .data-tbl.pricing-tbl { table-layout: fixed; width: 100%; }
    .data-tbl.pricing-tbl td:nth-child(1), .data-tbl.pricing-tbl td:nth-child(2) { text-align: left; }
    .data-tbl.pricing-tbl td:nth-child(3), .data-tbl.pricing-tbl td:nth-child(4), .data-tbl.pricing-tbl td:nth-child(5) { text-align: right; }
    .data-tbl.private-rates-tbl .private-row-0 { background: rgba(27,58,92,0.06); }
    .data-tbl.private-rates-tbl .private-row-1 { background: rgba(245,240,229,0.6); }
    .data-tbl.private-rates-tbl .private-row-2 { background: rgba(46,139,139,0.06); }
    .data-tbl.private-rates-tbl .private-row-3 { background: rgba(245,240,229,0.5); }
    .cta-block { border-left: 4px solid #2E8B8B; background: rgba(232,131,74,0.08); padding: 8px 12px; margin: 8px 0; font-size: 14px; line-height: 1.4; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cta-block .what { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; font-size: 14px; margin-bottom: 4px; }
    .cta-block .address { font-size: 13px; color: #1B3A5C; margin-top: 6px; opacity: 0.9; }
    .courts-list { font-size: 15px; margin: 6px 0; }
    .courts-list li { margin: 4px 0; }
    .courts-section { background: rgba(245,240,229,0.5); padding: 10px 12px; margin: 8px 0; }
    .schedule-intro { break-inside: avoid; page-break-inside: avoid; margin-bottom: 6px; }
    .pricing-sub { font-size: 13px; color: #1B3A5C; margin: 0 0 6px; line-height: 1.3; opacity: 0.92; }
    .schedule-legend { font-size: 12px; color: #1B3A5C; margin: 0 0 8px; line-height: 1.4; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; }
    .schedule-legend .legend-title { font-weight: 700; color: #0F2237; }
    .schedule-legend .legend-item { display: inline-flex; align-items: center; gap: 6px; }
    .schedule-legend .swatch { display: inline-block; width: 16px; height: 16px; border-radius: 2px; border: 2px solid rgba(27,58,92,0.35); flex-shrink: 0; }
    .swatch-red { background: rgba(240,78,35,0.45); }
    .swatch-youth { background: rgba(46,139,139,0.4); }
    .swatch-liveball { background: rgba(46,139,139,0.38); }
    .swatch-adult { background: rgba(27,58,92,0.14); }
    .swatch-cardio { background: rgba(232,131,74,0.38); }
    .swatch-concurrent { background: #fff; box-shadow: inset 0 0 0 1px rgba(27,58,92,0.15); }
    .other-locations-note { font-size: 13px; color: #1B3A5C; margin: 8px 0 10px; line-height: 1.4; font-style: italic; }
    .schedule-loc { margin: 6px 0; break-inside: auto; }
    .schedule-tbl { width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid rgba(27,58,92,0.2); }
    .schedule-tbl th, .schedule-tbl td { padding: 4px 6px; border-bottom: 1px solid rgba(27,58,92,0.12); border-left: 1px solid rgba(27,58,92,0.08); vertical-align: top; }
    .schedule-tbl thead tr { background: rgba(245,240,229,0.6); border-bottom: 2px solid rgba(27,58,92,0.2); }
    .schedule-tbl th { font-weight: 700; color: #0F2237; font-size: 11px; }
    .schedule-tbl .col-time { width: 4.5em; }
    .schedule-tbl .time-cell { font-weight: 700; color: #0F2237; background: rgba(245,240,229,0.35); border-right: 1px solid rgba(27,58,92,0.1); text-align: left; white-space: nowrap; font-size: 11px; }
    .schedule-tbl .sched-empty { min-height: 24px; }
    .schedule-tbl .empty-schedule { text-align: center; padding: 10px; color: rgba(27,58,92,0.65); font-size: 12px; }
    .schedule-tbl .sched-slot-title { font-weight: 600; color: #0F2237; font-size: 11px; line-height: 1.25; display: block; }
    .schedule-tbl .sched-slot-guide { font-size: 10px; font-weight: 600; color: rgba(27,58,92,0.92); margin-top: 2px; line-height: 1.25; }
    .schedule-tbl .sched-slot-time { font-size: 10px; font-weight: 600; color: #1B3A5C; margin-top: 2px; }
    .schedule-tbl .sched-concurrent-note { font-size: 11px; color: rgba(27,58,92,0.88); margin-top: 6px; line-height: 1.3; }
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
    .schedule-tbl .cell-concurrent { background: #fff !important; box-shadow: inset 0 0 0 1px rgba(27,58,92,0.22); padding-left: 0; }
    .schedule-tbl td.cell-multiline { white-space: pre-line; }
    .schedule-tbl .sched-concurrent-structured { line-height: 1.25; }
    .schedule-tbl .conc-two { display: flex; gap: 5px; align-items: flex-start; }
    .schedule-tbl .conc-col { flex: 1; min-width: 0; }
    .schedule-tbl .conc-vsep { width: 1px; background: rgba(27,58,92,0.18); flex-shrink: 0; align-self: stretch; min-height: 28px; }
    .schedule-tbl .conc-hdr { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #0F2237; margin: 0 0 3px 0; line-height: 1.15; }
    .schedule-tbl .cell-concurrent .conc-hdr { padding-left: 8px; }
    .schedule-tbl .conc-note { font-size: 9px; color: rgba(27,58,92,0.88); margin-top: 3px; line-height: 1.3; }
    .schedule-tbl .conc-time { font-size: 9px; font-weight: 700; color: #0F2237; }
    .schedule-tbl .conc-pname { font-size: 11px; font-weight: 600; color: #0F2237; line-height: 1.2; margin-top: 2px; }
    .schedule-tbl .conc-guide { font-size: 9px; font-weight: 600; color: rgba(27,58,92,0.9); margin-top: 2px; line-height: 1.25; }
    .schedule-tbl .conc-item { margin-bottom: 2px; padding: 2px 6px 2px 4px; border-radius: 0 2px 2px 0; border-left: 3px solid rgba(27,58,92,0.4); background: rgba(245,240,229,0.75); }
    .schedule-tbl .conc-item:last-child { margin-bottom: 0; }
    .schedule-tbl .conc-hp { border-left-color: #1B3A5C; background: rgba(27,58,92,0.14); }
    .schedule-tbl .conc-utr-green { border-left-color: #2D7A5E; background: rgba(58,139,110,0.22); }
    .schedule-tbl .conc-youth-dev { border-left-color: #1B6B6B; background: rgba(46,139,139,0.24); }
    .schedule-tbl .conc-liveball { border-left-color: #2E8B8B; background: rgba(46,139,139,0.2); }
    .schedule-tbl .conc-adult { border-left-color: #1B3A5C; background: rgba(27,58,92,0.12); }
    .schedule-tbl .conc-j-red { border-left-color: #F04E23; background: rgba(240,78,35,0.14); }
    .schedule-tbl .conc-j-orange { border-left-color: #E8834A; background: rgba(232,131,74,0.18); }
    .schedule-tbl .conc-j-green { border-left-color: #3A8B6E; background: rgba(58,139,110,0.14); }
    .schedule-tbl .conc-youth { border-left-color: #2E8B8B; background: rgba(46,139,139,0.12); }
    .schedule-tbl .conc-default { border-left-color: rgba(27,58,92,0.45); background: rgba(245,240,229,0.85); }
    .camps-ul { font-size: 14px; margin: 6px 0; padding-left: 20px; }
    .camps-ul li { margin: 3px 0; }
    .discount-line { font-size: 13px; color: #1B3A5C; opacity: 0.9; margin-top: 6px; }
    .youth-utr-box { break-inside: avoid; page-break-inside: avoid; border: 1px solid rgba(27,58,92,0.15); border-radius: 2px; background: rgba(245,240,229,0.45); padding: 8px 10px; margin: 6px 0 8px; font-size: 12px; line-height: 1.35; color: #1B3A5C; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .youth-utr-title { font-weight: 700; color: #0F2237; font-size: 15px; margin: 0 0 8px; font-family: Cormorant, Georgia, serif; }
    .youth-utr-intro { margin: 0 0 6px; }
    .youth-utr-tiers { list-style: none; padding: 0; margin: 0 0 6px; }
    .youth-utr-tiers li { margin: 0 0 8px; }
    .youth-utr-tiers li:last-child { margin-bottom: 0; }
    .youth-utr-tiers .muted { opacity: 0.88; font-weight: 500; }
    .tier-focus { margin-top: 4px; padding-left: 0; font-size: 13px; opacity: 0.95; }
    .youth-utr-p { margin: 8px 0 0; }
    .youth-utr-note { margin: 10px 0 0; font-size: 13px; opacity: 0.88; }
    footer { margin-top: 10px; padding: 10px 14px; border-top: 1px solid rgba(27,58,92,0.2); background: #0F2237; color: rgba(255,255,255,0.9); text-align: center; font-size: 12px; }
    footer .footer-logo { padding-bottom: 6px; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    footer .footer-logo-img { height: 40px; width: auto; max-width: 220px; object-fit: contain; display: inline-block; vertical-align: middle; opacity: 0.95; filter: brightness(0) invert(1); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .city-register { max-width: 40em; margin: 12px auto 0; padding: 12px 16px; border: 2px solid rgba(15,34,55,0.2); border-radius: 4px; background: #fff; box-shadow: 0 2px 6px rgba(15,34,55,0.05); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .city-register-row { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: center; gap: 28px; }
    .city-register-qr-link { display: inline-block; flex-shrink: 0; padding: 10px; background: #fff; border: 2px solid rgba(27,58,92,0.2); border-radius: 4px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .city-register-qr { width: 128px; height: 128px; display: block; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .city-register-copy { flex: 1; min-width: 220px; max-width: 28em; text-align: center; }
    .city-register .scan-title { font-size: 22px; font-weight: 800; color: #0F2237; margin: 0; letter-spacing: 0.04em; text-transform: uppercase; }
    .city-register .lead { font-size: 17px; font-weight: 600; color: #1B3A5C; margin: 8px 0 0; }
    .city-register .sub { font-size: 15px; color: #1B3A5C; margin: 6px 0 0; line-height: 1.4; opacity: 0.92; }
    .city-register .qr-hint { font-size: 13px; color: rgba(27,58,92,0.82); margin: 12px 0 0; line-height: 1.35; }
    .city-register .btn { display: inline-block; margin-top: 14px; padding: 12px 20px; background: #0A0A0A; color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 2px; }
    .city-register .url-hint { font-size: 13px; color: rgba(27,58,92,0.7); margin: 10px 0 0; }
    .cta-city-link { margin-top: 12px; font-size: 18px; font-weight: 600; }
    .cta-city-link a { color: #2E8B8B; }
    footer .tagline { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #fff; margin: 12px 0; font-size: 18px; }
    footer .section-horizon { margin-top: 12px; margin-bottom: 8px; opacity: 0.9; }
    footer .partner { font-size: 14px; text-transform: uppercase; margin: 12px 0 8px; opacity: 0.85; }
    footer a { color: #fff; text-decoration: underline; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  </style>
</head>
<body class="flyer">
  ${logoStripHtml}
  <div class="flyer-hero">
    <p class="flyer-hero-title">Free Trial — Try Any Group Class</p>
    <div class="section-horizon"></div>
    <p class="flyer-hero-sub">Certified City of Laguna Beach Coaching Team</p>
  </div>
  <div class="city-register">
    <div class="city-register-row">
      ${cityQrBlock}
      <div class="city-register-copy">
        <p class="scan-title">Scan to register</p>
        <p class="lead">Group classes · City Recreation</p>
        <p class="sub">Register online before your first session.</p>
        <a class="btn" href="${escapeHtml(FLYER_CONTACT.registerUrl)}">City registration — Rec1 catalog</a>
      </div>
    </div>
  </div>

  <h2>Your Certified Coaching Team</h2>
  <div class="section-horizon"></div>
  <div class="coaches-grid">${coachHtml}</div>

  <h2>Private Lessons</h2>
  <div class="section-horizon"></div>
  ${privateTable}

  <div class="cta-block">
    <p class="what">Contact &amp; register</p>
    <strong>LBTA</strong> (949) 534-0457 &nbsp;·&nbsp; <strong>City</strong> (949) 497-3311 &nbsp;·&nbsp; <a href="${escapeHtml(FLYER_CONTACT.registerUrl)}">Register online</a> &nbsp;·&nbsp; ${escapeHtml(FLYER_ACADEMY_ADDRESS)}
  </div>

  <h2>LBTA Reserved Courts</h2>
  <div class="section-horizon"></div>
  <div class="courts-section">
  <ul class="courts-list">
    ${FLYER_COURTS.map((c) => `<li><strong>${escapeHtml(c.name)}</strong> ${escapeHtml(c.courts)} · ${escapeHtml(c.address)}</li>`).join('\n    ')}
    <li><strong>USTA League</strong> ${escapeHtml(FLYER_USTA_NOTE)}</li>
  </ul>
  </div>

  <div class="schedule-intro">
  <h2>Schedules, Pricing &amp; Registration · ${escapeHtml(seasonLabel)} · ${escapeHtml(seasonDates)}</h2>
  <div class="section-horizon"></div>
  <p class="sub" style="text-align:left; margin:0 0 16px;">lagunabeachtennisacademy.com · Movement. Craft. Community.</p>
  ${buildScheduleLegendHtml()}
  ${otherLocationsNote ? `<p class="other-locations-note">${escapeHtml(otherLocationsNote)}</p>` : ''}
  </div>
  ${scheduleTablesHtml}

  <h2>Camps</h2>
  <div class="section-horizon"></div>
  <ul class="camps-ul">${campsList}</ul>

  <h2>Program Pricing</h2>
  <div class="section-horizon"></div>
  <h3>Junior &amp; Competitive</h3>
  ${youthUtrHtml}
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
    <p><strong>LBTA</strong> — FREE TRIAL &amp; QUESTIONS (949) 534-0457</p>
    <p><strong>City of Laguna Beach</strong> — REGISTER (949) 497-3311</p>
    <p><a href="${escapeHtml(FLYER_CONTACT.registerUrl)}">City online registration</a></p>
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
      price: `$${springBreakCamp?.price ?? 325}/wk`,
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
  const cityQrPath = path.join(root, 'public', FLYER_CITY_REGISTRATION_QR_PATH.replace(/^\//, ''))
  const cityQrFileUrl = fs.existsSync(cityQrPath) ? toFileUrl(cityQrPath) : ''

  const youthUtrHtml = buildYouthDevelopmentUtrHtml(getYouthDevelopmentUtrPlacementForFlyer())

  const buildOneHtml = (scheduleTablesHtml: string, otherLocationsNote?: string) =>
    buildFlyerHtml({
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
      cityQrFileUrl,
      youthUtrHtml,
      otherLocationsNote,
    })

  const writePdfToPath = async (html: string, outPath: string): Promise<void> => {
    const tmpHtml = path.join(root, `.court-flyer-temp-${Date.now()}-${Math.random().toString(36).slice(2)}.html`)
    fs.writeFileSync(tmpHtml, html, 'utf8')
    const LANDSCAPE_VIEWPORT_WIDTH_PX = 1632
    const LANDSCAPE_PAGE_HEIGHT_PX = 1008
    const margin = { top: '0.3in', right: '0.3in', bottom: '0.3in', left: '0.3in' }
    try {
      const { chromium } = await import('playwright')
      const browser = await chromium.launch()
      const page = await browser.newPage()
      await page.setViewportSize({ width: LANDSCAPE_VIEWPORT_WIDTH_PX, height: 3000 })
      await page.goto(toFileUrl(tmpHtml), { waitUntil: 'load', timeout: 12000 })
      const heightPx = await page.evaluate(() => Math.ceil(document.body.scrollHeight))
      const MIN_SCALE_FOR_4FT_READABILITY = 0.82
      if (heightPx > LANDSCAPE_PAGE_HEIGHT_PX) {
        const scale = LANDSCAPE_PAGE_HEIGHT_PX / heightPx
        if (scale >= MIN_SCALE_FOR_4FT_READABILITY) {
          const middleWidthPx = Math.round(LANDSCAPE_VIEWPORT_WIDTH_PX * scale)
          const outerStyle = `width:${LANDSCAPE_VIEWPORT_WIDTH_PX}px;height:${LANDSCAPE_PAGE_HEIGHT_PX}px;overflow:hidden;position:relative;margin:0 auto;`
          const middleStyle = `width:${middleWidthPx}px;height:${LANDSCAPE_PAGE_HEIGHT_PX}px;overflow:hidden;position:relative;margin:0 auto;`
          const innerStyle = `position:absolute;top:0;left:0;width:${LANDSCAPE_VIEWPORT_WIDTH_PX}px;height:${heightPx}px;transform-origin:top left;transform:scale(${scale});box-sizing:border-box;padding:20px 28px;`
          const wrapperOpen = `<body class="flyer" style="padding:0;margin:0"><div class="one-page-outer" style="${outerStyle}"><div class="one-page-middle" style="${middleStyle}"><div class="one-page-inner" style="${innerStyle}">`
          const wrapperClose = '</div></div></div></body>'
          const onePageHtml = html.replace('<body class="flyer">', wrapperOpen).replace('</body>', wrapperClose)
          fs.writeFileSync(tmpHtml, onePageHtml, 'utf8')
          await page.goto(toFileUrl(tmpHtml), { waitUntil: 'load', timeout: 12000 })
        }
      }
      await page.pdf({ path: outPath, width: '17in', height: '11in', margin, printBackground: true, preferCSSPageSize: false })
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

  if (singleOutputPath) {
    const html = buildOneHtml(buildScheduleTablesHtml(scheduleByLocation))
    await writePdfToPath(html, singleOutputPath)
  } else {
    await writePdfToPath(
      buildOneHtml(buildScheduleTablesHtml(scheduleByLocation)),
      path.join(desktopDir, 'LBTA_Master_Flyer.pdf')
    )
    for (const loc of LOCATION_ORDER) {
      await writePdfToPath(
        buildOneHtml(buildScheduleTablesHtml(scheduleByLocation, loc), FLYER_OTHER_LOCATIONS_NOTE),
        path.join(desktopDir, `LBTA_Flyer_${loc}.pdf`)
      )
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
