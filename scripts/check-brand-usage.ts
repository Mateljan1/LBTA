import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = process.cwd()
const scanRoots = ['app', 'components']
const allowedExtensions = new Set(['.ts', '.tsx', '.css'])

// Forbidden Tailwind classes (low-contrast white text on dark surfaces, fails WCAG 7:1)
const forbiddenClasses = ['text-white/40', 'text-white/25']

// Scans
const rawHexRegex = /#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/g
const lbtaClassRegex = /\blbta-[a-z0-9-]+\b/g
const arbitraryTailwindColorRegex = /\b(?:bg|text|border|from|to|via|ring|fill|stroke|outline|decoration|placeholder|caret|accent|shadow)-\[#[0-9a-fA-F]{3,8}\]/g
const inlineGradientHexRegex = /style=\{[^}]*linear-gradient[^}]*#[0-9a-fA-F]{3,8}/gi

// Forbidden font families in app code (lib/email.ts is exempted — emails use fallback fonts legitimately)
const forbiddenFontRegex = /\b(Inter|Roboto|Arial|Space Grotesk|Playfair|Work Sans|Helvetica)\b/g

// Hand-rolled eyebrow pattern (matches "text-[10-12px] ... uppercase ... tracking-[any]" in any order
// within a single class string). These should use .text-eyebrow / .text-eyebrow-sm utilities.
// Responsive size variants (e.g. md:text-[12px]) are intentional hero-context bumps and excluded.
const handRolledEyebrowRegex = /class(?:Name)?=["'`][^"'`]*\btext-\[1[0-2]px\][^"'`]*\buppercase\b[^"'`]*\btracking-\[[^\]]+\][^"'`]*["'`]|class(?:Name)?=["'`][^"'`]*\btracking-\[[^\]]+\][^"'`]*\buppercase\b[^"'`]*\btext-\[1[0-2]px\][^"'`]*["'`]|class(?:Name)?=["'`][^"'`]*\buppercase\b[^"'`]*\btext-\[1[0-2]px\][^"'`]*\btracking-\[[^\]]+\][^"'`]*["'`]/g

// Patterns matching this regex are intentional responsive variants (md:text-[Npx] etc.) — exclude from drift count
const responsiveSizeVariantRegex = /(?:sm|md|lg|xl|2xl):text-\[\d+px\]/

// Hand-rolled section padding (py-[80-200px] or px-[80-200px] when .section/.section-lg/.section-sm exists).
// WARN only — captures common section-spacing pattern.
const handRolledSectionPaddingRegex = /\bpy-\[(?:8\d|9\d|1[0-9]\d|200)px\]/g

// Deprecated lbta-* classes that have direct brand-* equivalents and must migrate.
// Allowed lbta-* utility classes (slate, stone, red, black) are NOT deprecated — they fill
// system/utility roles the 11-color brand kit doesn't address. See docs/brand-token-system.md.
const deprecatedLbtaClasses = new Set([
  'lbta-primary',     // → brand-pacific-dusk
  'lbta-coral',       // → brand-sunset-cliff
  'lbta-coral-dark',  // → brand-sunset-cliff/85 hover
  'lbta-bone',        // → brand-morning-light
  'lbta-cream',       // → brand-morning-light
  'lbta-charcoal',    // → brand-pacific-dusk
  'lbta-orange',      // → brand-sunset-cliff
  'lbta-burnt',       // → brand-sunset-cliff
  'lbta-beige',       // → brand-sandstone
  'lbta-sand',        // → brand-sandstone
  'lbta-secondary',   // → lbta-slate (alias dedup)
])

// Files exempt from raw-hex scan (own the tokens themselves)
const rawHexSkipFiles = new Set([
  'app/globals.css',
  'app/embedded-forms.css',
])

// Files exempt from font scan (legitimate fallbacks for email clients / system stacks)
const fontSkipFiles = new Set([
  'lib/email.ts',
])

type Hit = {
  file: string
  line: number
  value: string
}

type ReportData = {
  forbidden: Hit[]
  rawHex: Hit[]
  arbitraryTailwind: Hit[]
  inlineGradient: Hit[]
  forbiddenFont: Hit[]
  legacyLbta: Hit[]
  handRolledEyebrow: Hit[]
  handRolledSectionPadding: Hit[]
}

async function walkFiles(dirPath: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dirPath)

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry)
    const entryStat = await stat(absolutePath)

    if (entryStat.isDirectory()) {
      await walkFiles(absolutePath, files)
      continue
    }

    const extension = path.extname(entry)
    if (allowedExtensions.has(extension)) {
      files.push(absolutePath)
    }
  }

  return files
}

function getEditedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only -- app components', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    })

    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((relativePath) => allowedExtensions.has(path.extname(relativePath)))
      .map((relativePath) => path.join(repoRoot, relativePath))
  } catch {
    return []
  }
}

function gatherLineHits(contents: string, file: string, matcher: RegExp, skip: Set<string> = new Set()): Hit[] {
  const hits: Hit[] = []
  const lines = contents.split('\n')

  lines.forEach((line, index) => {
    // Reset regex lastIndex (matcher is shared in some call sites)
    const localMatcher = new RegExp(matcher.source, matcher.flags)
    const matches = line.match(localMatcher)
    if (!matches) return

    for (const value of matches) {
      if (skip.has(value.toLowerCase())) continue
      hits.push({
        file,
        line: index + 1,
        value,
      })
    }
  })

  return hits
}

function printHits(title: string, level: 'WARN' | 'ERROR', hits: Hit[], limit = 120) {
  if (hits.length === 0) return

  console.log(title)
  const visible = hits.slice(0, limit)

  for (const hit of visible) {
    console.log(`  ${level} ${hit.file}:${hit.line} -> ${hit.value}`)
  }

  if (hits.length > visible.length) {
    console.log(`  ... ${hits.length - visible.length} more`)
  }

  console.log('')
}

function groupByFile(hits: Hit[]): Map<string, Hit[]> {
  const map = new Map<string, Hit[]>()
  for (const hit of hits) {
    if (!map.has(hit.file)) map.set(hit.file, [])
    map.get(hit.file)!.push(hit)
  }
  return map
}

function reportSection(title: string, hits: Hit[]): string {
  if (hits.length === 0) return `### ${title}\n\n_None._\n`
  const grouped = groupByFile(hits)
  const lines = [`### ${title}`, '', `**Total:** ${hits.length} across ${grouped.size} file(s).`, '']
  lines.push('| File | Count | Lines |')
  lines.push('|---|---|---|')
  const entries = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)
  for (const [file, fileHits] of entries) {
    const lineList = fileHits.map((h) => h.line).join(', ')
    lines.push(`| \`${file}\` | ${fileHits.length} | ${lineList} |`)
  }
  return `${lines.join('\n')}\n`
}

async function writeReport(reportData: ReportData) {
  const reportPath = path.join(repoRoot, 'docs', 'brand-audit-2026-05-05.md')
  const totals = {
    forbidden: reportData.forbidden.length,
    rawHex: reportData.rawHex.length,
    arbitraryTailwind: reportData.arbitraryTailwind.length,
    inlineGradient: reportData.inlineGradient.length,
    forbiddenFont: reportData.forbiddenFont.length,
    legacyLbta: reportData.legacyLbta.length,
    handRolledEyebrow: reportData.handRolledEyebrow.length,
    handRolledSectionPadding: reportData.handRolledSectionPadding.length,
  }
  const generatedAt = new Date().toISOString()
  const allClear =
    totals.forbidden === 0 &&
    totals.rawHex === 0 &&
    totals.arbitraryTailwind === 0 &&
    totals.inlineGradient === 0 &&
    totals.forbiddenFont === 0

  const sections: string[] = []
  sections.push('<!-- Auto-generated by scripts/check-brand-usage.ts --report. Do not hand-edit the section below. -->')
  sections.push('')
  sections.push('## Live audit — current state')
  sections.push('')
  sections.push(`**Generated:** ${generatedAt}`)
  sections.push('')
  sections.push('| Category | Count | Status |')
  sections.push('|---|---|---|')
  sections.push(`| Forbidden contrast errors | ${totals.forbidden} | ${totals.forbidden === 0 ? '✅' : '❌'} |`)
  sections.push(`| Raw hex literals (TS/TSX) | ${totals.rawHex} | ${totals.rawHex === 0 ? '✅' : '⚠'} |`)
  sections.push(`| Arbitrary Tailwind colors | ${totals.arbitraryTailwind} | ${totals.arbitraryTailwind === 0 ? '✅' : '⚠'} |`)
  sections.push(`| Inline gradient hex literals | ${totals.inlineGradient} | ${totals.inlineGradient === 0 ? '✅' : '⚠'} |`)
  sections.push(`| Forbidden fonts (app code) | ${totals.forbiddenFont} | ${totals.forbiddenFont === 0 ? '✅' : '❌'} |`)
  sections.push(`| Deprecated lbta-* classes | ${totals.legacyLbta} | ${totals.legacyLbta === 0 ? '✅' : '⚠'} |`)
  sections.push(`| Hand-rolled eyebrow patterns (info) | ${totals.handRolledEyebrow} | ${totals.handRolledEyebrow === 0 ? '✅' : 'ℹ'} |`)
  sections.push(`| Hand-rolled section padding (info) | ${totals.handRolledSectionPadding} | ${totals.handRolledSectionPadding === 0 ? '✅' : 'ℹ'} |`)
  sections.push('')
  sections.push(allClear ? '**Result: 🟢 LOCKED IN — zero brand drift.**' : '**Result: 🟡 Drift present — see breakdown below.**')
  sections.push('')
  sections.push('_Hand-rolled patterns are informational — they do not block CI. They surface where the design system primitives could replace ad-hoc styles. Migrate opportunistically when touching a file._')
  sections.push('')
  sections.push(reportSection('Forbidden contrast errors', reportData.forbidden))
  sections.push(reportSection('Raw hex literals', reportData.rawHex))
  sections.push(reportSection('Arbitrary Tailwind colors', reportData.arbitraryTailwind))
  sections.push(reportSection('Inline gradient hex literals', reportData.inlineGradient))
  sections.push(reportSection('Forbidden fonts (app code)', reportData.forbiddenFont))
  sections.push(reportSection('Deprecated lbta-* classes', reportData.legacyLbta))
  sections.push(reportSection('Hand-rolled eyebrow patterns (informational)', reportData.handRolledEyebrow))
  sections.push(reportSection('Hand-rolled section padding (informational)', reportData.handRolledSectionPadding))

  const liveBlock = sections.join('\n')

  // Read existing file, replace anything from the auto-generated marker onward
  let existing = ''
  try {
    existing = await readFile(reportPath, 'utf8')
  } catch {
    // file may not exist yet
  }
  const marker = '<!-- Auto-generated by scripts/check-brand-usage.ts --report'
  const markerIdx = existing.indexOf(marker)
  const preserved = markerIdx >= 0 ? existing.slice(0, markerIdx) : existing
  const final = `${preserved.trimEnd()}\n\n${liveBlock}\n`

  await mkdir(path.dirname(reportPath), { recursive: true })
  await writeFile(reportPath, final, 'utf8')
  console.log(`Report written to ${path.relative(repoRoot, reportPath)}`)
}

async function main() {
  const scanAll = process.argv.includes('--all')
  const writeReportFlag = process.argv.includes('--report')
  const editedFiles = scanAll ? [] : getEditedFiles()
  const files: string[] = []

  if (editedFiles.length > 0) {
    files.push(...editedFiles)
  } else {
    for (const root of scanRoots) {
      const absoluteRoot = path.join(repoRoot, root)
      const rootFiles = await walkFiles(absoluteRoot)
      files.push(...rootFiles)
    }
  }

  const reportData: ReportData = {
    forbidden: [],
    rawHex: [],
    arbitraryTailwind: [],
    inlineGradient: [],
    forbiddenFont: [],
    legacyLbta: [],
    handRolledEyebrow: [],
    handRolledSectionPadding: [],
  }

  for (const file of files) {
    const relativeFile = path.relative(repoRoot, file)
    const contents = await readFile(file, 'utf8')
    const extension = path.extname(relativeFile)

    // Forbidden contrast classes
    for (const forbiddenClass of forbiddenClasses) {
      const escaped = forbiddenClass.replace('/', '\\/')
      const matcher = new RegExp(`\\b${escaped}\\b`, 'g')
      reportData.forbidden.push(...gatherLineHits(contents, relativeFile, matcher))
    }

    // Raw hex literals
    if (!rawHexSkipFiles.has(relativeFile)) {
      reportData.rawHex.push(
        ...gatherLineHits(
          contents,
          relativeFile,
          rawHexRegex,
          new Set(['#fff', '#ffffff', '#000', '#000000']),
        ),
      )
    }

    // Arbitrary Tailwind color values (e.g. bg-[#0a1628])
    if (extension !== '.css') {
      reportData.arbitraryTailwind.push(
        ...gatherLineHits(contents, relativeFile, arbitraryTailwindColorRegex),
      )
    }

    // Inline gradient hex literals (style={{ background: 'linear-gradient(... #...)' }})
    if (extension !== '.css') {
      reportData.inlineGradient.push(
        ...gatherLineHits(contents, relativeFile, inlineGradientHexRegex),
      )
    }

    // Forbidden font families in app code
    if (!fontSkipFiles.has(relativeFile)) {
      reportData.forbiddenFont.push(...gatherLineHits(contents, relativeFile, forbiddenFontRegex))
    }

    // Legacy lbta-* (only flag the specifically-deprecated names)
    if (extension !== '.css') {
      const legacyHits = gatherLineHits(contents, relativeFile, lbtaClassRegex).filter((hit) =>
        deprecatedLbtaClasses.has(hit.value),
      )
      reportData.legacyLbta.push(...legacyHits)
    }

    // Hand-rolled patterns (WARN only — never strict; designers may have intentional cases)
    // Filter out responsive size variants (e.g. md:text-[12px]) — those are intentional hero bumps
    if (extension === '.tsx') {
      const eyebrowHits = gatherLineHits(contents, relativeFile, handRolledEyebrowRegex)
        .filter((hit) => !responsiveSizeVariantRegex.test(hit.value))
      reportData.handRolledEyebrow.push(...eyebrowHits)
      reportData.handRolledSectionPadding.push(...gatherLineHits(contents, relativeFile, handRolledSectionPaddingRegex))
    }
  }

  printHits('Deprecated lbta-* classes (warning):', 'WARN', reportData.legacyLbta)
  printHits('Raw hex usage (warning):', 'WARN', reportData.rawHex)
  printHits('Arbitrary Tailwind color values (warning):', 'WARN', reportData.arbitraryTailwind)
  printHits('Inline gradient hex literals (warning):', 'WARN', reportData.inlineGradient)
  printHits('Hand-rolled eyebrow patterns — prefer .text-eyebrow (info, never blocks):', 'WARN', reportData.handRolledEyebrow, 30)
  printHits('Hand-rolled section padding — prefer .section / .section-lg / .section-sm (info, never blocks):', 'WARN', reportData.handRolledSectionPadding, 30)
  printHits('Forbidden font families in app code (error):', 'ERROR', reportData.forbiddenFont)
  printHits('Forbidden low-contrast white text (error):', 'ERROR', reportData.forbidden)

  if (writeReportFlag) {
    await writeReport(reportData)
  }

  const totalErrors = reportData.forbidden.length + reportData.forbiddenFont.length

  const isStrict = process.env.STRICT_BRAND_CHECK === '1'
  if (isStrict) {
    if (totalErrors > 0) {
      console.log(`STRICT mode: ${totalErrors} error(s) — failing build.`)
      process.exitCode = 1
      return
    }
    // In strict mode, also fail on warnings (raw hex / arbitrary Tailwind / inline gradient / hand-rolled eyebrows)
    const totalWarnings =
      reportData.rawHex.length +
      reportData.arbitraryTailwind.length +
      reportData.inlineGradient.length +
      reportData.handRolledEyebrow.length
    if (totalWarnings > 0) {
      console.log(`STRICT mode: ${totalWarnings} warning(s) treated as errors — failing build.`)
      process.exitCode = 1
      return
    }
    console.log('Brand usage checks passed (STRICT mode).')
    return
  }

  if (totalErrors > 0) {
    console.log(
      'Brand usage checks completed with warnings. Set STRICT_BRAND_CHECK=1 to enforce blocking mode.',
    )
    return
  }

  if (editedFiles.length > 0 && !scanAll) {
    console.log(`Brand usage checks passed for ${editedFiles.length} edited files.`)
    return
  }

  console.log('Brand usage checks passed.')
}

main().catch((error) => {
  console.error('Brand usage check failed unexpectedly.')
  console.error(error)
  process.exitCode = 1
})
