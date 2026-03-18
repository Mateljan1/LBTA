#!/usr/bin/env node
/**
 * Generate LBTA Master Court Flyer PDF from data files. No server needed.
 * Run from project root: node scripts/generate-court-flyer-pdf-standalone.mjs
 * Output: ~/Desktop/LBTA_Master_Flyer.pdf (or path as first arg)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(process.env.HOME || '', 'Desktop', 'LBTA_Master_Flyer.pdf')

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const LOCATION_KEYS = ['Alta', 'LBHS', 'Moulton']
const LOCATION_LABELS = { Alta: 'Alta Laguna Park', LBHS: 'Laguna Beach High School', Moulton: 'Moulton Meadows Park' }
const LOCATION_DISPLAY = { Moulton: 'Moulton Meadows Park', Alta: 'Alta Laguna Park', LBHS: 'Laguna Beach High School' }

function formatLocation(programLocation) {
  const loc = String(programLocation || '')
  if (loc.includes('Moulton')) return 'Moulton'
  if (loc.includes('Alta')) return 'Alta'
  if (loc.includes('LBHS') || loc.includes('High School')) return 'LBHS'
  return loc
}

function normalizeLoc(slot, programLocation) {
  const slotLoc = (slot.location || '').trim()
  if (slotLoc) {
    const s = slotLoc.toLowerCase()
    if (s.includes('moulton')) return 'Moulton'
    if (s.includes('alta')) return 'Alta'
    if (s.includes('lbhs') || s.includes('high school') || s.includes('lb high')) return 'LBHS'
  }
  const prog = String(programLocation || '').toLowerCase()
  const day = slot.day
  if (prog.includes('saturday at lbhs') && day === 'Saturday') return 'LBHS'
  if (prog.includes('sat') && day === 'Saturday' && (prog.includes('lbhs') || prog.includes('high school'))) return 'LBHS'
  if (prog.includes('mon/wed') && (day === 'Monday' || day === 'Wednesday')) return 'Moulton'
  if (prog.includes('fri') && day === 'Friday' && (prog.includes('lbhs') || prog.includes('high school'))) return 'LBHS'
  return formatLocation(programLocation)
}

function buildScheduleByLocation(programs) {
  const out = {}
  for (const prog of programs || []) {
    for (const slot of prog.schedule || []) {
      const loc = normalizeLoc(slot, prog.location)
      if (!LOCATION_KEYS.includes(loc)) continue
      if (!out[loc]) out[loc] = {}
      if (!out[loc][slot.day]) out[loc][slot.day] = []
      out[loc][slot.day].push({ programName: prog.program, time: slot.time })
    }
  }
  for (const loc of Object.keys(out)) {
    for (const day of Object.keys(out[loc])) {
      out[loc][day].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
    }
  }
  return out
}

function parseTimeToMinutes(timeStr) {
  const range = String(timeStr || '').trim().split(/[–\-]\s*/)
  const startStr = range[0]?.trim() || ''
  const endStr = range[1]?.trim() || ''
  let match = startStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!match && endStr) {
    const ampmMatch = endStr.match(/\s*(AM|PM)$/i)
    if (ampmMatch) match = (startStr + ' ' + ampmMatch[1]).match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  }
  if (!match) return 9999
  let h = parseInt(match[1], 10)
  const m = match[2] ? parseInt(match[2], 10) : 0
  if (match[3].toUpperCase() === 'PM' && h !== 12) h += 12
  if (match[3].toUpperCase() === 'AM' && h === 12) h = 0
  return h * 60 + m
}

/** Return CSS class for schedule cell by program name (color-code for fence readability). */
function scheduleCellClass(programName) {
  const n = (programName || '').toLowerCase()
  if (n.includes('little') || n.includes('stars')) return 'cell-junior'
  if (n.includes('red ball')) return 'cell-red'
  if (n.includes('orange ball')) return 'cell-orange'
  if (n.includes('green dot') || n.includes('utr green')) return 'cell-green'
  if (n.includes('yellow') || n.includes('yellow ball')) return 'cell-yellow'
  if (n.includes('youth') || n.includes('development')) return 'cell-youth'
  if (n.includes('high performance')) return 'cell-hp'
  if (n.includes('adult') || n.includes('liveball') || n.includes('cardio') || n.includes('intermediate') || n.includes('advanced') || n.includes('beginner')) return 'cell-adult'
  return 'cell-other'
}

function escapeHtml(s) {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function toFileUrl(filePath) {
  const resolved = path.resolve(filePath)
  return 'file://' + (process.platform === 'win32' ? '/' : '') + resolved.replace(/\\/g, '/')
}

const FLYER_ACADEMY_ADDRESS = '1098 Balboa Ave, Laguna Beach, CA 92651'

function buildFlyerHtml(options) {
  const {
    coaches,
    privateRates,
    scheduleByLocation,
    seasonLabel,
    seasonDates,
    weeks,
    juniorRows,
    adultRows,
    camps,
    discountLine,
    imageBaseUrl,
    logoLbtaUrl,
    logoCityUrl,
  } = options

  const privateRatesOrder = ['Andrew Mateljan', 'Robert LeBuhn', 'Peter DeFrantz', 'Allison Cronk']
  const orderedRates = privateRatesOrder.map((name) => privateRates.find((r) => r.coach === name)).filter(Boolean)
  if (orderedRates.length === 0) orderedRates.push(...privateRates)

  let scheduleHtml = ''
  for (const loc of LOCATION_KEYS) {
    const byDay = scheduleByLocation[loc]
    if (!byDay) continue
    const locationName = LOCATION_LABELS[loc] || loc
    const times = new Set()
    for (const day of DAY_ORDER) {
      (byDay[day] || []).forEach((s) => times.add(s.time))
    }
    const sortedTimes = Array.from(times).sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b))
    scheduleHtml += `
      <div class="schedule-loc">
        <h3>${escapeHtml(locationName)} — ${loc === 'Moulton' ? 'Court 2' : 'Courts 1 & 2'}</h3>
        <table class="schedule-tbl">
          <thead><tr><th>Time</th>${DAY_ORDER.map((d) => `<th>${d.slice(0, 3)}</th>`).join('')}</tr></thead>
          <tbody>
            ${sortedTimes
              .map(
                (time) =>
                  `<tr><td class="time-cell">${escapeHtml(time)}</td>${DAY_ORDER.map((day) => {
                    const slots = byDay[day] || []
                    const slot = slots.find((s) => s.time === time)
                    const name = slot ? (slot.programName.length > 38 ? slot.programName.slice(0, 36) + '…' : slot.programName) : ''
                    const cellClass = slot ? scheduleCellClass(slot.programName) : ''
                    return `<td class="${cellClass}">${escapeHtml(name)}</td>`
                  }).join('')}</tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
  }

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
        ${orderedRates
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

  const adultTable = `
    <table class="data-tbl">
      <thead><tr><th>Program</th><th>Location</th><th>1x/wk</th><th>2x/wk</th><th>Drop-in</th></tr></thead>
      <tbody>
        ${adultRows.map((r) => `<tr><td>${escapeHtml(r.name)} · ${escapeHtml(r.duration)}</td><td>${escapeHtml(r.location || '')}</td><td>${r.price_1x}</td><td>${r.price_2x ?? '—'}</td><td>${r.dropIn}</td></tr>`).join('')}
      </tbody>
    </table>`

  const campsList = camps.map((c) => `<li><strong>${escapeHtml(c.label)}</strong> ${escapeHtml(c.dates)} · Ages ${escapeHtml(c.ages)} · ${escapeHtml(c.price)}${c.location ? ` · ${escapeHtml(c.location)}` : ''}</li>`).join('')

  const logoStripHtml = (logoLbtaUrl || logoCityUrl)
    ? `<div class="logo-strip">${logoLbtaUrl ? `<img src="${logoLbtaUrl}" alt="Laguna Beach Tennis Academy" class="logo-lbta" />` : ''}${logoCityUrl ? `<img src="${logoCityUrl}" alt="City of Laguna Beach" class="logo-city" />` : ''}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>LBTA Court Flyer — ${escapeHtml(seasonLabel)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', system-ui, sans-serif; color: #1B3A5C; margin: 0; padding: 24px; font-size: 11px; line-height: 1.35; background: #FAF8F4; }
    .flyer { max-width: 100%; }
    .logo-strip { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 32px; padding: 20px 24px; background: #0F2237; margin: -24px -24px 0 -24px; min-height: 72px; }
    .logo-lbta { height: 40px; width: auto; object-fit: contain; flex-shrink: 0; }
    .logo-city { height: 48px; width: auto; object-fit: contain; flex-shrink: 0; filter: brightness(0) invert(1); }
    h1 { font-family: Cormorant, Georgia, serif; font-size: 22px; font-weight: 600; text-align: center; color: #0F2237; text-transform: uppercase; letter-spacing: 0.02em; margin: 0 0 8px; }
    .sub { text-align: center; color: #1B3A5C; margin: 0 0 12px; }
    .cta-line { text-align: center; font-weight: 700; color: #0F2237; margin: 0 0 20px; font-size: 14px; }
    h2 { font-family: Cormorant, Georgia, serif; font-size: 16px; font-weight: 600; color: #0F2237; margin: 16px 0 8px; }
    h3 { font-family: Cormorant, Georgia, serif; font-size: 12px; font-weight: 600; color: #0F2237; text-transform: uppercase; margin: 12px 0 6px; }
    .coaches-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 12px 0; }
    .coach-card { break-inside: avoid; display: flex; flex-direction: column; align-items: center; }
    .coach-img-wrap { width: 140px; height: 187px; flex-shrink: 0; overflow: hidden; border-radius: 2px; background: #F5F0E5; }
    .coach-img { width: 140px; height: 187px; object-fit: cover; object-position: center top; display: block; border-radius: 2px; }
    .coach-name { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; margin: 6px 0 2px; }
    .coach-title { font-size: 10px; font-weight: 500; color: #1B3A5C; margin: 0; }
    .coach-bio { font-size: 9px; color: #1B3A5C; margin: 4px 0 0; line-height: 1.3; opacity: 0.95; }
    .data-tbl { width: 100%; border-collapse: collapse; font-size: 10px; margin: 8px 0; }
    .data-tbl th, .data-tbl td { padding: 6px 8px; text-align: left; border-bottom: 1px solid rgba(27,58,92,0.12); }
    .data-tbl th { font-weight: 600; color: #0F2237; }
    .data-tbl td:nth-child(n+2) { text-align: right; }
    .cta-block { background: rgba(232,131,74,0.12); border-top: 2px solid rgba(27,58,92,0.12); border-bottom: 2px solid rgba(27,58,92,0.12); padding: 16px 12px; margin: 12px 0; text-align: center; font-size: 11px; }
    .cta-block .what { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #0F2237; font-size: 14px; margin-bottom: 8px; }
    .cta-block .address { font-size: 10px; color: #1B3A5C; margin-top: 8px; opacity: 0.9; }
    .courts-list { font-size: 10px; margin: 8px 0; }
    .courts-list li { margin: 4px 0; }
    .courts-section { background: rgba(245,240,229,0.5); padding: 12px; margin: 12px 0; }
    .schedule-loc { margin: 16px 0; break-inside: avoid; }
    .schedule-tbl { width: 100%; border-collapse: collapse; font-size: 10px; border: 1px solid rgba(27,58,92,0.2); }
    .schedule-tbl th, .schedule-tbl td { padding: 6px 8px; border-bottom: 1px solid rgba(27,58,92,0.15); border-left: 1px solid rgba(27,58,92,0.1); }
    .schedule-tbl thead tr { background: rgba(245,240,229,0.6); border-bottom: 2px solid rgba(27,58,92,0.25); }
    .schedule-tbl th { font-weight: 700; color: #0F2237; }
    .schedule-tbl .time-cell { font-weight: 700; color: #0F2237; background: rgba(245,240,229,0.35); border-right: 1px solid rgba(27,58,92,0.12); }
    .schedule-tbl .cell-red { background: rgba(240,78,35,0.15); }
    .schedule-tbl .cell-orange { background: rgba(232,131,74,0.2); }
    .schedule-tbl .cell-green { background: rgba(58,139,110,0.15); }
    .schedule-tbl .cell-yellow { background: rgba(196,150,60,0.15); }
    .schedule-tbl .cell-junior { background: rgba(245,240,229,0.6); }
    .schedule-tbl .cell-youth { background: rgba(46,139,139,0.12); }
    .schedule-tbl .cell-hp { background: rgba(27,58,92,0.08); color: #0F2237; }
    .schedule-tbl .cell-adult { background: rgba(27,58,92,0.06); }
    .schedule-tbl .cell-other { background: rgba(245,240,229,0.4); }
    .camps-ul { font-size: 10px; margin: 8px 0; padding-left: 20px; }
    .camps-ul li { margin: 4px 0; }
    .discount-line { font-size: 9px; color: #1B3A5C; opacity: 0.9; margin-top: 8px; }
    footer { margin-top: 24px; padding: 20px 16px; border-top: 2px solid rgba(27,58,92,0.15); background: #0F2237; color: rgba(255,255,255,0.9); text-align: center; font-size: 10px; }
    footer .tagline { font-family: Cormorant, Georgia, serif; font-weight: 600; color: #fff; margin: 8px 0; }
    footer .partner { font-size: 9px; text-transform: uppercase; margin: 8px 0 4px; opacity: 0.85; }
    footer a { color: #2E8B8B; }
  </style>
</head>
<body class="flyer">
  ${logoStripHtml}
  <h1>Certified City of Laguna Beach Coaching Team</h1>
  <p class="sub">Only LBTA coaches are authorized to teach at City of Laguna Beach tennis courts.</p>
  <p class="cta-line">FREE TRIAL — Try Any Group Class</p>

  <h2>Your Certified Coaching Team</h2>
  <div class="coaches-grid">${coachHtml}</div>

  <h2>Private Lessons</h2>
  ${privateTable}

  <div class="cta-block">
    <p class="what">What to do</p>
    <strong>FREE TRIAL</strong> (949) 534-0457 &nbsp;|&nbsp; <strong>REGISTER</strong> (949) 497-3311 &nbsp;|&nbsp; <strong>EMAIL</strong> support@lagunabeachtennisacademy.com
    <p class="address">${escapeHtml(FLYER_ACADEMY_ADDRESS)}</p>
  </div>

  <h2>LBTA Reserved Courts</h2>
  <div class="courts-section">
  <ul class="courts-list">
    <li><strong>Moulton Meadows Park</strong> Court 2 · Balboa Ave &amp; Capistrano Ave</li>
    <li><strong>Alta Laguna Park</strong> Courts 1 &amp; 2 · 3300 Alta Laguna Dr</li>
    <li><strong>Laguna Beach High School</strong> Courts 1 &amp; 2 · 670 Park Ave</li>
  </ul>
  <p class="sub" style="font-size:9px; margin-top:4px;">Sat 1-3PM: Courts 1-3 USTA League</p>
  </div>

  <h2>Schedules, Pricing &amp; Registration · ${escapeHtml(seasonLabel)} · ${escapeHtml(seasonDates)}</h2>
  <p class="sub">lagunabeachtennisacademy.com · Movement. Craft. Community.</p>
  ${scheduleHtml}

  <h2>Camps</h2>
  <ul class="camps-ul">${campsList}</ul>

  <h2>Program Pricing</h2>
  <h3>Junior &amp; Competitive</h3>
  ${juniorTable}
  <h3>Adult &amp; Fitness</h3>
  ${adultTable}
  <p class="discount-line">${escapeHtml(discountLine)}</p>

  <footer>
    <p><strong>REGISTER</strong> (949) 497-3311</p>
    <p><strong>FREE TRIAL &amp; QUESTIONS</strong> (949) 534-0457</p>
    <p>support@lagunabeachtennisacademy.com</p>
    <p>${escapeHtml(FLYER_ACADEMY_ADDRESS)}</p>
    <p><a href="https://lagunabeachtennisacademy.com">lagunabeachtennisacademy.com</a></p>
    <p class="tagline">Movement. Craft. Community.</p>
    <p class="partner">Official City Partner</p>
    <p><strong>Laguna Beach Tennis Academy</strong></p>
    <p>${escapeHtml(seasonLabel)} · ${escapeHtml(seasonDates)} · ${weeks} Weeks</p>
  </footer>
</body>
</html>`
}

async function main() {
  const coachesPath = path.join(root, 'data', 'coaches.json')
  const flyerBiosPath = path.join(root, 'data', 'flyer-coach-bios.json')
  const privateRatesPath = path.join(root, 'data', 'private-rates.json')
  const springSummerPath = path.join(root, 'data', 'spring-summer-2026.json')
  const year2026Path = path.join(root, 'data', 'year2026.json')
  const imageDir = path.join(root, 'public', 'images', 'print')

  const coachesData = JSON.parse(fs.readFileSync(coachesPath, 'utf8'))
  const flyerBios = JSON.parse(fs.readFileSync(flyerBiosPath, 'utf8'))
  const privateRates = JSON.parse(fs.readFileSync(privateRatesPath, 'utf8'))
  const springSummer = JSON.parse(fs.readFileSync(springSummerPath, 'utf8'))
  const year2026 = JSON.parse(fs.readFileSync(year2026Path, 'utf8'))

  const FLYER_ORDER = ['andrew-mateljan', 'robert-lebuhn', 'peter-defrantz', 'allison-cronk']
  const SLUG_TO_IMG = { 'andrew-mateljan': 'andrew', 'robert-lebuhn': 'robert', 'allison-cronk': 'allison', 'peter-defrantz': 'peter' }
  const coachesList = coachesData.coaches || []
  const bySlug = new Map(coachesList.map((c) => [c.slug || '', c]))
  const coaches = FLYER_ORDER.map((slug) => {
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

  const scheduleByLocation = buildScheduleByLocation(springSummer.programs)
  const spring = springSummer.spring || {}
  const seasonLabel = spring.label || 'Spring'
  const seasonDates = spring.dates || 'April 6 – June 13, 2026'
  const weeks = spring.weeks ?? 10

  const formatPrice = (p) => {
    const monthly = typeof p.monthly === 'number' ? p.monthly : null
    const dropIn = typeof p.drop_in === 'number' ? p.drop_in : null
    const p1x = typeof p['1x'] === 'number' ? p['1x'] : monthly
    const p2x = typeof p['2x'] === 'number' ? p['2x'] : null
    return {
      price_1x: p1x != null ? (monthly != null ? `$${p1x}/mo` : `$${p1x}`) : '—',
      price_2x: p2x != null ? `$${p2x}` : null,
      dropIn: dropIn != null ? `$${dropIn}` : 'N/A',
    }
  }

  const programs = springSummer.programs || []
  const juniorCategories = ['Junior', 'Youth']
  const juniorRows = programs
    .filter((p) => juniorCategories.includes(p.category))
    .map((p) => {
      const raw = p.pricing?.spring || p.pricing || {}
      const { price_1x, price_2x, dropIn } = formatPrice(raw)
      const locKey = formatLocation(p.location)
      return { name: p.program, duration: p.duration, price_1x, price_2x, dropIn, location: LOCATION_DISPLAY[locKey] || p.location || '' }
    })
  const adultCategories = ['Adult', 'Fitness']
  const adultRows = programs
    .filter((p) => adultCategories.includes(p.category))
    .map((p) => {
      const raw = p.pricing?.spring || p.pricing || {}
      const { price_1x, price_2x, dropIn } = formatPrice(raw)
      const locKey = formatLocation(p.location)
      return { name: p.program, duration: p.duration, price_1x, price_2x, dropIn, location: LOCATION_DISPLAY[locKey] || p.location || '' }
    })

  const thanksgiving = (year2026.camps || []).find((c) => c.id === 'thanksgiving')
  const swimTennis = (year2026.camps || []).find((c) => c.id === 'swim-tennis')
  const summerCamp = (year2026.camps || []).find((c) => c.id === 'summer')
  const camps = [
    { label: 'Swim & Tennis', dates: swimTennis?.dates ?? 'Jun 16–Aug 14', ages: swimTennis?.ages ?? '5-11', price: `$${swimTennis?.price ?? 495}/wk`, location: swimTennis?.location ?? 'Alta Laguna Park' },
    { label: 'Spring Break', dates: springSummer.camps?.springBreak?.dates ?? '', ages: '5-14', price: '$295/wk', location: 'Alta Laguna Park' },
    { label: 'Summer', dates: springSummer.camps?.summer?.dates ?? '', ages: '5-17', price: '$495/wk', location: summerCamp?.location ?? 'Alta Laguna Park / Laguna Beach High School' },
  ]
  if (thanksgiving) {
    camps.push({ label: 'Thanksgiving', dates: thanksgiving.dates, ages: thanksgiving.ages, price: `$${thanksgiving.price ?? 221}/wk`, location: thanksgiving.location ?? 'Alta Laguna Park / Laguna Beach High School' })
  }

  const discountLine = '$50 off early bird · 10% second child · 5% multi-program · 10% full year'

  const logosDir = path.join(root, 'public', 'logos')
  const lbtaLogoPath = path.join(logosDir, 'LBTAwhttext.png')
  const cityLogoPath = path.join(logosDir, 'city-laguna-beach.png')
  const logoLbtaUrl = fs.existsSync(lbtaLogoPath) ? toFileUrl(lbtaLogoPath) : (fs.existsSync(path.join(logosDir, 'LBTAblktext.png')) ? toFileUrl(path.join(logosDir, 'LBTAblktext.png')) : '')
  const logoCityUrl = fs.existsSync(cityLogoPath) ? toFileUrl(cityLogoPath) : ''

  const html = buildFlyerHtml({
    coaches,
    privateRates,
    scheduleByLocation,
    seasonLabel,
    seasonDates,
    weeks,
    juniorRows,
    adultRows,
    camps,
    discountLine,
    imageBaseUrl: imageDir,
    logoLbtaUrl,
    logoCityUrl,
  })

  const tmpHtml = path.join(root, '.court-flyer-temp.html')
  fs.writeFileSync(tmpHtml, html, 'utf8')

  try {
    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const page = await browser.newPage()
    await page.goto(toFileUrl(tmpHtml), { waitUntil: 'load', timeout: 10000 })
    await page.pdf({
      path: outPath,
      format: 'Ledger',
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
      printBackground: true,
    })
    await browser.close()
    console.log('Wrote', outPath)
  } finally {
    try {
      fs.unlinkSync(tmpHtml)
    } catch (_) {}
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
