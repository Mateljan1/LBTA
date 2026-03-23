#!/usr/bin/env node
/**
 * One-off helper: muted schedule cards + html lang (run from repo root).
 */
const fs = require('fs')
const path = require('path')
const file = path.join(
  __dirname,
  '../assets/emails/spring-2026/prospects/LBTA_Spring2026_Schedule_REFINED.html'
)
let html = fs.readFileSync(file, 'utf8')

html = html.replace(
  '<html xmlns="http://www.w3.org/1999/xhtml" lang="en">',
  '<html lang="en">'
)

const map = {
  '#E91E63': '#8B7B8E',
  '#D32F2F': '#A67C52',
  '#F57C00': '#C4A574',
  '#2E7D32': '#3A8B6E',
  '#388E3C': '#3A8B6E',
  '#7B1FA2': '#1B3A5C',
  '#6A1B9A': '#1B3A5C',
  '#1565C0': '#2E5A6E',
  '#43A047': '#3A8B6E',
  '#00796B': '#2E8B8B',
  '#2E8B8B': '#2E8B8B',
  '#AD1457': '#6B5349',
  '#C4963C': '#9A8A6A',
}
const card =
  'background-color:#F5F0E5;border:1px solid rgba(27,58,92,0.1);border-left:3px solid '
for (const [hex, accent] of Object.entries(map)) {
  const needle = `class="cb" style="background-color:${hex};"`
  const repl = `class="cb" style="${card}${accent};"`
  html = html.split(needle).join(repl)
}

// Muted legend dots in pricing / Saturday rows (Material → brand-adjacent)
const dotMap = [
  ['background:#E91E63', 'background:#8B7B8E'],
  ['background:#D32F2F', 'background:#A67C52'],
  ['background:#F57C00', 'background:#C4A574'],
  ['background:#388E3C', 'background:#3A8B6E'],
  ['background:#1565C0', 'background:#2E5A6E'],
  ['background:#2E7D32', 'background:#3A8B6E'],
  ['background:#7B1FA2', 'background:#1B3A5C'],
]
for (const [a, b] of dotMap) {
  html = html.split(a).join(b)
}

fs.writeFileSync(file, html)
console.log('Updated', file)
