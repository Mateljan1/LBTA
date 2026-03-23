#!/usr/bin/env node
/**
 * Prep HTML for ActiveCampaign to avoid CDATA/parsing artifacts (e.g. visible "]]>").
 * Strips BOM, removes any CDATA end sequences, and optionally moves <style> into <body>.
 *
 * Usage:
 *   node scripts/prep-email-for-ac.js <path-to-html> [--body-style] [--out <path>]
 *
 * --body-style: move <style> from <head> to start of <body> (can avoid some AC parsing issues)
 * --out: write to file instead of stdout
 */

const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const htmlPath = args.find((a) => !a.startsWith('--'))
const bodyStyle = args.includes('--body-style')
const outIdx = args.indexOf('--out')
const outPath = outIdx >= 0 ? args[outIdx + 1] : null

if (!htmlPath) {
  console.error('Usage: node scripts/prep-email-for-ac.js <path> [--body-style] [--out <path>]')
  process.exit(1)
}

const fullPath = path.resolve(process.cwd(), htmlPath)
if (!fs.existsSync(fullPath)) {
  console.error('File not found:', fullPath)
  process.exit(1)
}

let html = fs.readFileSync(fullPath, 'utf-8')

// Strip BOM
if (html.charCodeAt(0) === 0xfeff) html = html.slice(1)

// Remove CDATA end sequences (AC template can inject these; they should not appear as text)
html = html.replace(/\]\]\s*>/g, '')

// Trim trailing whitespace/newlines
html = html.trimEnd()

if (bodyStyle) {
  const styleMatch = html.match(/<style[\s\S]*?<\/style>/i)
  if (styleMatch) {
    const styleBlock = styleMatch[0]
    html = html.replace(styleMatch[0], '')
    html = html.replace(/<body([^>]*)>/i, (_, attrs) => `<body${attrs}>\n${styleBlock}`)
  }
}

if (outPath) {
  const outFull = path.resolve(process.cwd(), outPath)
  fs.writeFileSync(outFull, html, 'utf-8')
  console.log('Wrote:', outFull)
  console.log('Bytes:', Buffer.byteLength(html, 'utf8'))
} else {
  process.stdout.write(html)
}
