#!/usr/bin/env node
/**
 * Verify that all image (and video) paths referenced in app/, components/, lib/, and data/
 * resolve to existing files under public/. Exits 0 if all exist, 1 otherwise.
 *
 * Usage: node scripts/verify-image-paths.mjs [--dry-run]
 * Optional: add "verify:images": "node scripts/verify-image-paths.mjs" to package.json for CI.
 *
 * @see docs/solutions/ui-bugs/site-wide-image-404s-layout-consistency.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')

// Match src="/...", url: '/...', url: "...", image: '...', image: "...", fallbackSrc="...", etc.
const PATH_PATTERNS = [
  /src=["'](\/[^"']+)["']/g,
  /url:\s*["'](\/[^"']+)["']/g,
  /image:\s*["'](\/[^"']+)["']/g,
  /fallbackSrc=["'](\/[^"']+)["']/g,
]

// Paths that are not under public/ (e.g. external or special)
const SKIP_PREFIXES = [
  'https://',
  'http://',
  '//',
  '/_next/',
  '/api/',
]

// Optional paths: missing file is allowed (e.g. video with legacy fallback in same component)
const OPTIONAL_PREFIXES = ['/videos/']

function extractPathsFromFile(content, filePath) {
  const paths = new Set()
  for (const re of PATH_PATTERNS) {
    let m
    re.lastIndex = 0
    while ((m = re.exec(content)) !== null) {
      const raw = m[1]
      if (SKIP_PREFIXES.some((p) => raw.startsWith(p))) continue
      const withoutQuery = raw.split('?')[0]
      if (!withoutQuery.startsWith('/')) continue
      paths.add(withoutQuery)
    }
  }
  return [...paths]
}

function* walk(dir, ext = null) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue
      yield* walk(full, ext)
    } else if (e.isFile() && (!ext || e.name.endsWith(ext))) {
      yield full
    }
  }
}

function main() {
  const dryRun = process.argv.includes('--dry-run')
  const dirs = ['app', 'components', 'lib', 'data']
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.json']
  const collected = new Map() // path -> [file that references it]

  for (const dir of dirs) {
    const base = path.join(ROOT, dir)
    if (!fs.existsSync(base)) continue
    for (const file of walk(base)) {
      const ext = path.extname(file)
      if (!extensions.includes(ext)) continue
      const content = fs.readFileSync(file, 'utf8')
      const paths = extractPathsFromFile(content, file)
      for (const p of paths) {
        if (!collected.has(p)) collected.set(p, [])
        collected.get(p).push(path.relative(ROOT, file))
      }
    }
  }

  const missing = []
  for (const [urlPath, refs] of collected) {
    const localPath = path.join(PUBLIC, urlPath.slice(1))
    const isOptional = OPTIONAL_PREFIXES.some((p) => urlPath.startsWith(p))
    if (!fs.existsSync(localPath) && !isOptional) {
      missing.push({ path: urlPath, refs })
    }
  }

  if (missing.length === 0) {
    console.log('verify-image-paths: all referenced paths exist under public/')
    process.exit(0)
  }

  console.error('verify-image-paths: missing files under public/:')
  for (const { path: urlPath, refs } of missing) {
    console.error(`  ${urlPath}`)
    refs.slice(0, 3).forEach((r) => console.error(`    <- ${r}`))
    if (refs.length > 3) console.error(`    ... and ${refs.length - 3} more`)
  }
  process.exit(1)
}

main()
