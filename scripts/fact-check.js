#!/usr/bin/env node
/**
 * Fact-check: verify user-facing copy and data alignment.
 * - Forbidden copy: grep app/, components/, data/ for forbidden words/phrases (per .cursorrules).
 * - Exit 0 if pass, 1 if any violation; print file:line for each.
 *
 * Usage: node scripts/fact-check.js
 * npm run fact-check
 */
const fs = require('fs')
const path = require('path')

const FORBIDDEN = [
  { pattern: /\bmaximize\b/i, name: 'maximize' },
  { pattern: /\bboost\b/i, name: 'boost' },
  { pattern: /\belite\b/i, name: 'elite' },
  { pattern: /\bworld-class\b/i, name: 'world-class' },
  { pattern: /\bmastery\b/i, name: 'mastery' },
  { pattern: /Sign up now!/i, name: '"Sign up now!"' },
  { pattern: /Don't miss out!/i, name: '"Don\'t miss out!"' },
  { pattern: /Limited time!/i, name: '"Limited time!"' },
]

const DIRS = ['app', 'components', 'data']
const EXT = ['.tsx', '.ts', '.jsx', '.js', '.json']

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && e.name !== '.git') walk(full, acc)
    } else if (EXT.some((x) => e.name.endsWith(x))) acc.push(full)
  }
  return acc
}

const violations = []
for (const dir of DIRS) {
  const root = path.join(process.cwd(), dir)
  for (const file of walk(root)) {
    const content = fs.readFileSync(file, 'utf8')
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const { pattern, name } of FORBIDDEN) {
        if (pattern.test(line)) {
          violations.push({
            file: path.relative(process.cwd(), file),
            line: i + 1,
            phrase: name,
            snippet: line.trim().slice(0, 80),
          })
        }
      }
    }
  }
}

if (violations.length === 0) {
  console.log('fact-check: OK (no forbidden copy in app/, components/, data/)')
  process.exit(0)
}

console.error('fact-check: FAIL — forbidden copy (per .cursorrules)\n')
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.phrase}`)
  console.error(`    ${v.snippet}${v.snippet.length >= 80 ? '...' : ''}`)
}
console.error(`\nTotal: ${violations.length} violation(s)`)
process.exit(1)
