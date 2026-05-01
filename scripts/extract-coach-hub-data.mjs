#!/usr/bin/env node
/**
 * One-time extraction from LBTA_Coach_Hub.html into data/coach-hub/*.json
 * Usage: node scripts/extract-coach-hub-data.mjs [path-to-HTML]
 * Default HTML path: ~/Downloads/LBTA_Coach_Hub.html
 *
 * SECURITY: This script must only be run against trusted HTML (e.g. exported
 * LBTA_Coach_Hub.html). It uses new Function() to parse schedule blocks; do not
 * repurpose for untrusted input (code injection risk).
 */

import fs from 'fs'
import path from 'path'

const htmlPath = process.argv[2] || path.join(process.env.HOME || '', 'Downloads', 'LBTA_Coach_Hub.html')
const outDir = path.join(process.cwd(), 'data', 'coach-hub')

if (!fs.existsSync(htmlPath)) {
  console.error('HTML file not found:', htmlPath)
  process.exit(1)
}

const raw = fs.readFileSync(htmlPath, 'utf8')
const lines = raw.split('\n')

function extractObject(line, startMarker) {
  const idx = line.indexOf(startMarker)
  if (idx === -1) return null
  const start = line.indexOf('{', idx)
  if (start === -1) return null
  let depth = 0
  let end = start
  for (let i = start; i < line.length; i++) {
    if (line[i] === '{') depth++
    else if (line[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  return line.slice(start, end + 1)
}

// Line 410 (0-indexed 409) has const D = {...};
const lineD = lines[409] || ''
const dStr = extractObject(lineD, 'const D=')
if (!dStr) {
  console.error('Could not extract D')
  process.exit(1)
}

// Parse D: already JSON-like; eval is unsafe but we control the source file here
const D = JSON.parse(dStr)
console.log('D keys:', Object.keys(D).join(', '))

// SEASONS: line 414 has new Date(...) - convert to ISO
const seasonsLine = lines[413] || ''
const seasonsStr = extractObject(seasonsLine, 'const SEASONS=')
let seasons = {}
if (seasonsStr) {
  let withDates = seasonsStr.replace(/new Date\((\d+),(\d+),(\d+)\)/g, (_, y, m, d) => {
    const month = String(Number(m) + 1).padStart(2, '0')
    const day = String(Number(d)).padStart(2, '0')
    return `"${y}-${month}-${day}T00:00:00.000Z"`
  })
  withDates = withDates.replace(/([,{])\s*(\w+)\s*:/g, '$1"$2":')
  seasons = JSON.parse(withDates)
}
console.log('SEASONS keys:', Object.keys(seasons).join(', '))

// Coach schedules: ALLISON_SCHED, PETER_SCHED (lines 1277, 1306) then COACH_SCHEDS
function extractScheduleBlock(lines, startLine) {
  const start = startLine - 1
  let acc = ''
  for (let i = start; i < Math.min(start + 35, lines.length); i++) {
    acc += lines[i] + '\n'
  }
  const open = acc.indexOf('{')
  if (open === -1) return null
  let depth = 0
  let end = open
  for (let i = open; i < acc.length; i++) {
    const c = acc[i]
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') {
      depth--
      if (depth === 0 && c === '}') {
        end = i
        break
      }
    }
  }
  return acc.slice(open, end + 1)
}

const allisonStr = extractScheduleBlock(lines, 1277)
const peterStr = extractScheduleBlock(lines, 1306)

function parseSchedule(s) {
  if (!s) return null
  // Trusted HTML only: new Function parses schedule block; do not use with untrusted input
  try {
    const fn = new Function('return (' + s + ')')
    return fn()
  } catch {
    return null
  }
}

const ALLISON_SCHED = parseSchedule(allisonStr)
const PETER_SCHED = parseSchedule(peterStr)

const coachSchedules = {
  'Allison Cronk': ALLISON_SCHED || {},
  'Peter DeFrantz': PETER_SCHED || {},
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

fs.writeFileSync(path.join(outDir, 'hub-data.json'), JSON.stringify(D, null, 2))
fs.writeFileSync(path.join(outDir, 'seasons.json'), JSON.stringify(seasons, null, 2))
fs.writeFileSync(path.join(outDir, 'coach-schedules.json'), JSON.stringify(coachSchedules, null, 2))

console.log('Wrote data/coach-hub/hub-data.json, seasons.json, coach-schedules.json')
console.log('Done.')
