#!/usr/bin/env node
/**
 * Check court flyer print assets: coach images exist and have 3:4 aspect ratio.
 * Run from project root: node scripts/check-print-assets.mjs
 * Exit 0 only if all four coach images exist and aspect is 3:4 within tolerance.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const printDir = path.join(root, 'public', 'images', 'print')
const coachNames = ['andrew', 'robert', 'allison', 'peter']
const EXPECTED_ASPECT = 3 / 4
const ASPECT_TOLERANCE = 0.07

function readPngDimensions(filePath) {
  const buf = fs.readFileSync(filePath)
  if (buf.length < 24) return null
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e) return null
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  return { width, height }
}

function main() {
  let failed = false
  for (const name of coachNames) {
    const filePath = path.join(printDir, `coach-${name}.png`)
    if (!fs.existsSync(filePath)) {
      console.error(`Missing: public/images/print/coach-${name}.png`)
      failed = true
      continue
    }
    const dims = readPngDimensions(filePath)
    if (!dims) {
      console.error(`Invalid or non-PNG: coach-${name}.png`)
      failed = true
      continue
    }
    const aspect = dims.width / dims.height
    const diff = Math.abs(aspect - EXPECTED_ASPECT)
    if (diff >= ASPECT_TOLERANCE) {
      console.error(
        `coach-${name}.png: aspect ${dims.width}×${dims.height} = ${aspect.toFixed(2)} (expected 3:4 = 0.75 ± ${ASPECT_TOLERANCE})`
      )
      failed = true
    } else {
      console.log(`coach-${name}.png: ${dims.width}×${dims.height} (3:4 ok)`)
    }
  }
  process.exit(failed ? 1 : 0)
}

main()
