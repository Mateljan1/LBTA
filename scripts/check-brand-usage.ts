import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = process.cwd()
const scanRoots = ['app', 'components']
const allowedExtensions = new Set(['.ts', '.tsx', '.css'])

// Forbidden Tailwind classes (low-contrast white text on dark surfaces, fails WCAG 7:1)
const forbiddenClasses = ['text-white/40', 'text-white/25']

// ────────────────────────────────────────────────────────────────────
// Email template scanning (separate domain, looser rules than React)
// ────────────────────────────────────────────────────────────────────
// Emails inherently allow more permissive styling than React components
// (email-client compat: Outlook, Apple Mail, Gmail render brand colors
// inconsistently — see lib/email.ts BRAND COLOR POLICY). So the email
// scanner only enforces:
//   1. Forbidden hex values (specifically the consolidated wrappers)
//   2. CAN-SPAM postal address presence on customer-facing templates
const emailScanRoot = 'assets/emails'
// Hex values that have been consolidated to a brand token. Adding more here
// will fail any tracked email template that still uses them.
const emailForbiddenHexes = new Set(['#d5d1ca'])
// AC placeholder stubs (not real customer-facing email content).
// CAN-SPAM and brand rules don't apply.
const emailExemptFiles = new Set(['assets/emails/lbta-spring-2026.html'])
// Required physical address marker for CAN-SPAM compliance. If a template
// mentions "Laguna Beach" (i.e. is customer-facing), it must also include
// the full street address.
const emailRequiredPostalMarker = '1098 Balboa'
const emailCustomerFacingMarker = 'Laguna Beach'

// Scans
const rawHexRegex = /#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/g
const lbtaClassRegex = /\blbta-[a-z0-9-]+\b/g
const arbitraryTailwindColorRegex = /\b(?:bg|text|border|from|to|via|ring|fill|stroke|outline|decoration|placeholder|caret|accent|shadow)-\[#[0-9a-fA-F]{3,8}\]/g
const inlineGradientHexRegex = /style=\{[^}]*linear-gradient[^}]*#[0-9a-fA-F]{3,8}/gi

// Forbidden font families in app code (lib/email.ts is exempted — emails use fallback fonts legitimately)
const forbiddenFontRegex = /\b(Inter|Roboto|Arial|Space Grotesk|Playfair|Work Sans|Helvetica)\b/g

// Hand-rolled eyebrow pattern detector.
// Matches any string literal (single, double, or backtick-quoted) that contains all three:
//   - text-[10-12px]  (font-size 10/11/12 in arbitrary px)
//   - uppercase
//   - tracking utility — either arbitrary tracking-[…] OR named tracking-(widest|wider|wide|tight|tighter)
//
// Catches all 4 historical drift idioms:
//   1. className="text-[11px] uppercase tracking-[0.18em]"            ← attribute string
//   2. className={`text-[11px] uppercase tracking-[0.18em] ...`}      ← JSX expression with template literal
//   3. const cls = 'text-[11px] uppercase tracking-widest'             ← const string later passed to className
//   4. ternary ? 'text-[11px] uppercase tracking-[…]' : 'other'        ← string literal in expression
//
// The pattern is strict: all 3 markers must appear within the same string literal (no cross-string splits).
const eyebrowSize = /\btext-\[1[0-2]px\]/
const eyebrowUppercase = /\buppercase\b/
const eyebrowTracking = /\btracking-(?:\[[^\]]+\]|widest|wider|wide|tight|tighter)\b/
const stringLiteralRegex = /(["'`])((?:\\.|(?!\1).)*?)\1/g

// Patterns matching this regex are intentional responsive variants (md:text-[Npx] etc.) — exclude from drift count
const responsiveSizeVariantRegex = /\b(?:sm|md|lg|xl|2xl|max-(?:sm|md|lg|xl|2xl)|min-(?:sm|md|lg|xl|2xl)):text-\[[\d.]+px\]/

// Deprecated lbta-* classes — sourced from `tokens/lbta-web-tokens.json` `deprecations` field
// via the generated `DEPRECATED_LBTA_CLASSES` constant. Single source of truth.
// Allowed lbta-* utility classes (slate, stone, red, black) are NOT deprecated — they fill
// system/utility roles the 11-color brand kit doesn't address. See docs/brand-token-system.md.
import { DEPRECATED_LBTA_CLASSES } from '../lib/brand-tokens'
const deprecatedLbtaClasses = new Set(Object.keys(DEPRECATED_LBTA_CLASSES))

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
  /** Forbidden hex values found in tracked email templates */
  emailForbiddenHex: Hit[]
  /**
   * Customer-facing email templates missing the CAN-SPAM-required full postal
   * address. One Hit per file (not per line) since this is a template-level
   * compliance issue.
   */
  emailMissingPostalAddress: Hit[]
}

/**
 * Scan source for hand-rolled eyebrow patterns. Walks every string literal
 * (attribute strings, template literals, const strings, ternary branches) and
 * checks whether it contains all three eyebrow markers. Excludes intentional
 * responsive size variants (e.g. md:text-[12px]) which are documented hero bumps.
 */
// Button context heuristic: any class string with `min-h-[48px]` is a button/link
// per .cursorrules touch-target rule. Eyebrows are labels, not buttons — exclude.
const buttonContextRegex = /\bmin-h-\[48px\]/

function findEyebrowPatterns(contents: string, file: string): Hit[] {
  const hits: Hit[] = []
  const lines = contents.split('\n')

  lines.forEach((line, idx) => {
    const matcher = new RegExp(stringLiteralRegex.source, stringLiteralRegex.flags)
    let m: RegExpExecArray | null
    while ((m = matcher.exec(line)) !== null) {
      const literal = m[2]
      if (!eyebrowSize.test(literal)) continue
      if (!eyebrowUppercase.test(literal)) continue
      if (!eyebrowTracking.test(literal)) continue
      // Skip intentional responsive size variants
      if (responsiveSizeVariantRegex.test(literal)) continue
      // Skip button-context classes (touch target = button, not eyebrow label)
      if (buttonContextRegex.test(literal)) continue
      hits.push({
        file,
        line: idx + 1,
        value: literal.length > 140 ? literal.slice(0, 140) + '…' : literal,
      })
    }
  })

  return hits
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

/**
 * Get tracked email template paths (relative to repoRoot). Uses git ls-files
 * so we don't flag work-in-progress untracked email drafts at assets/emails/
 * root. Returns empty array if git or the directory aren't available.
 */
function getTrackedEmailTemplates(): string[] {
  try {
    const output = execSync(`git ls-files ${emailScanRoot}`, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    })
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter((p) => p.endsWith('.html'))
      .filter((p) => !emailExemptFiles.has(p))
      .map((relativePath) => path.join(repoRoot, relativePath))
  } catch {
    return []
  }
}

/**
 * Scan a single email template for the two enforced rules:
 *   1. Forbidden hex values that have been consolidated to a brand token
 *   2. CAN-SPAM postal address presence on customer-facing templates
 */
function scanEmailTemplate(
  contents: string,
  relativeFile: string,
  reportData: ReportData,
) {
  // Rule 1: forbidden hex (case-insensitive)
  const lines = contents.split('\n')
  lines.forEach((line, idx) => {
    for (const forbiddenHex of emailForbiddenHexes) {
      // Match the hex literal as a whole (preceded/followed by non-hex char or boundary)
      const pattern = new RegExp(`${forbiddenHex.replace('#', '#')}\\b`, 'gi')
      const matches = line.match(pattern)
      if (matches) {
        for (const value of matches) {
          reportData.emailForbiddenHex.push({
            file: relativeFile,
            line: idx + 1,
            value,
          })
        }
      }
    }
  })

  // Rule 2: customer-facing emails (mentioning "Laguna Beach") must contain
  // the required postal marker. One hit per file.
  if (
    contents.includes(emailCustomerFacingMarker) &&
    !contents.includes(emailRequiredPostalMarker)
  ) {
    reportData.emailMissingPostalAddress.push({
      file: relativeFile,
      line: 0,
      value: `Missing "${emailRequiredPostalMarker}" — CAN-SPAM §316.5 requires a valid postal address`,
    })
  }
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
    emailForbiddenHex: reportData.emailForbiddenHex.length,
    emailMissingPostalAddress: reportData.emailMissingPostalAddress.length,
  }
  const generatedAt = new Date().toISOString()
  const allClear =
    totals.forbidden === 0 &&
    totals.rawHex === 0 &&
    totals.arbitraryTailwind === 0 &&
    totals.inlineGradient === 0 &&
    totals.forbiddenFont === 0 &&
    totals.legacyLbta === 0 &&
    totals.handRolledEyebrow === 0 &&
    totals.emailForbiddenHex === 0 &&
    totals.emailMissingPostalAddress === 0

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
  sections.push(`| Deprecated lbta-* classes | ${totals.legacyLbta} | ${totals.legacyLbta === 0 ? '✅' : '❌'} |`)
  sections.push(`| Hand-rolled eyebrow patterns | ${totals.handRolledEyebrow} | ${totals.handRolledEyebrow === 0 ? '✅' : '❌'} |`)
  sections.push(`| Email: forbidden hex (consolidated) | ${totals.emailForbiddenHex} | ${totals.emailForbiddenHex === 0 ? '✅' : '❌'} |`)
  sections.push(`| Email: missing postal address (CAN-SPAM) | ${totals.emailMissingPostalAddress} | ${totals.emailMissingPostalAddress === 0 ? '✅' : '❌'} |`)
  sections.push('')
  sections.push(allClear ? '**Result: 🟢 LOCKED IN — zero brand drift across all 9 strict categories.**' : '**Result: 🔴 Drift present — see breakdown below. Strict CI will fail.**')
  sections.push('')

  // Only emit per-category sections when there are hits — keeps the doc clean
  if (reportData.forbidden.length > 0) sections.push(reportSection('Forbidden contrast errors', reportData.forbidden))
  if (reportData.forbiddenFont.length > 0) sections.push(reportSection('Forbidden fonts (app code)', reportData.forbiddenFont))
  if (reportData.rawHex.length > 0) sections.push(reportSection('Raw hex literals', reportData.rawHex))
  if (reportData.arbitraryTailwind.length > 0) sections.push(reportSection('Arbitrary Tailwind colors', reportData.arbitraryTailwind))
  if (reportData.inlineGradient.length > 0) sections.push(reportSection('Inline gradient hex literals', reportData.inlineGradient))
  if (reportData.legacyLbta.length > 0) sections.push(reportSection('Deprecated lbta-* classes', reportData.legacyLbta))
  if (reportData.handRolledEyebrow.length > 0) sections.push(reportSection('Hand-rolled eyebrow patterns', reportData.handRolledEyebrow))
  if (reportData.emailForbiddenHex.length > 0) sections.push(reportSection('Email: forbidden hex (consolidated to brand token)', reportData.emailForbiddenHex))
  if (reportData.emailMissingPostalAddress.length > 0) sections.push(reportSection('Email: missing CAN-SPAM postal address', reportData.emailMissingPostalAddress))

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
    emailForbiddenHex: [],
    emailMissingPostalAddress: [],
  }

  // Scan tracked email templates (separate domain — see emailScanRoot above).
  // Only runs in --all or full-scan mode; doesn't run for edited-files mode
  // unless an email file is being edited. Skipped if no .html files match.
  const emailFiles =
    editedFiles.length > 0
      ? editedFiles.filter((f) =>
          path.relative(repoRoot, f).startsWith(`${emailScanRoot}/`),
        )
      : getTrackedEmailTemplates()
  for (const file of emailFiles) {
    const relativeFile = path.relative(repoRoot, file)
    if (emailExemptFiles.has(relativeFile)) continue
    const contents = await readFile(file, 'utf8')
    scanEmailTemplate(contents, relativeFile, reportData)
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

    // Hand-rolled eyebrow patterns (strict-mode enforced as of v1.3, full string-literal scan as of v1.4)
    if (extension === '.tsx') {
      reportData.handRolledEyebrow.push(...findEyebrowPatterns(contents, relativeFile))
    }
  }

  printHits('Deprecated lbta-* classes (warning, strict-blocking):', 'WARN', reportData.legacyLbta)
  printHits('Raw hex usage (warning, strict-blocking):', 'WARN', reportData.rawHex)
  printHits('Arbitrary Tailwind color values (warning, strict-blocking):', 'WARN', reportData.arbitraryTailwind)
  printHits('Inline gradient hex literals (warning, strict-blocking):', 'WARN', reportData.inlineGradient)
  printHits('Hand-rolled eyebrow patterns — prefer .text-eyebrow (warning, strict-blocking):', 'WARN', reportData.handRolledEyebrow, 30)
  printHits('Email templates: forbidden hex (consolidated to brand token, strict-blocking):', 'WARN', reportData.emailForbiddenHex)
  printHits('Email templates: missing CAN-SPAM postal address (strict-blocking):', 'ERROR', reportData.emailMissingPostalAddress)
  printHits('Forbidden font families in app code (error):', 'ERROR', reportData.forbiddenFont)
  printHits('Forbidden low-contrast white text (error):', 'ERROR', reportData.forbidden)

  if (writeReportFlag) {
    await writeReport(reportData)
  }

  // CAN-SPAM postal address is treated as an ERROR (legal compliance, not just style)
  const totalErrors =
    reportData.forbidden.length +
    reportData.forbiddenFont.length +
    reportData.emailMissingPostalAddress.length

  const isStrict = process.env.STRICT_BRAND_CHECK === '1'
  if (isStrict) {
    if (totalErrors > 0) {
      console.log(`STRICT mode: ${totalErrors} error(s) — failing build.`)
      process.exitCode = 1
      return
    }
    // In strict mode, also fail on warnings (every category the docs claim is enforced).
    const totalWarnings =
      reportData.rawHex.length +
      reportData.arbitraryTailwind.length +
      reportData.inlineGradient.length +
      reportData.handRolledEyebrow.length +
      reportData.legacyLbta.length +
      reportData.emailForbiddenHex.length
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
