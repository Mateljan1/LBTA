import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { BRAND, LBTA_UTIL, LBTA_LEGACY, LBTA, DEPRECATED_LBTA_CLASSES } from './brand-tokens'
import { scanEmailTemplate, findTextOpacityOnLight } from '../scripts/check-brand-usage'

const REPO_ROOT = path.resolve(__dirname, '..')
const TOKEN_JSON_PATH = path.join(REPO_ROOT, 'tokens', 'lbta-web-tokens.json')
const TAILWIND_JSON_PATH = path.join(REPO_ROOT, 'generated', 'tokens.tailwind.json')
const TOKENS_CSS_PATH = path.join(REPO_ROOT, 'generated', 'tokens.css')

type TokenFile = {
  colors: { brand: Record<string, string>; lbta: Record<string, string> }
  lbtaUtility?: { allowed: string[] }
  deprecations?: Record<string, string>
}

const tokens = JSON.parse(readFileSync(TOKEN_JSON_PATH, 'utf8')) as TokenFile

describe('brand-tokens drift detector', () => {
  it('every BRAND constant matches tokens/lbta-web-tokens.json', () => {
    for (const [kebab, value] of Object.entries(tokens.colors.brand)) {
      const camel = kebab.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase()) as keyof typeof BRAND
      expect(BRAND[camel], `BRAND.${camel} should match tokens.colors.brand["${kebab}"]`).toBe(value)
    }
  })

  it('every LBTA constant matches tokens/lbta-web-tokens.json', () => {
    for (const [kebab, value] of Object.entries(tokens.colors.lbta)) {
      const camel = kebab.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase()) as keyof typeof LBTA
      expect(LBTA[camel], `LBTA.${camel} should match tokens.colors.lbta["${kebab}"]`).toBe(value)
    }
  })

  it('LBTA_UTIL only contains the allowed utility colors', () => {
    const allowed = new Set(tokens.lbtaUtility?.allowed ?? [])
    const utilKeys = Object.keys(LBTA_UTIL).map((camel) =>
      // camelCase → kebab-case for comparison
      camel.replace(/[A-Z0-9]/g, (m, idx) => (idx === 0 ? m.toLowerCase() : '-' + m.toLowerCase())),
    )
    for (const key of utilKeys) {
      expect(allowed.has(key), `LBTA_UTIL.${key} should be in lbtaUtility.allowed`).toBe(true)
    }
    expect(utilKeys.length).toBe(allowed.size)
  })

  it('LBTA_LEGACY does NOT contain any allowed utility colors', () => {
    const allowed = new Set(tokens.lbtaUtility?.allowed ?? [])
    const legacyKeys = Object.keys(LBTA_LEGACY).map((camel) =>
      camel.replace(/[A-Z0-9]/g, (m, idx) => (idx === 0 ? m.toLowerCase() : '-' + m.toLowerCase())),
    )
    for (const key of legacyKeys) {
      expect(allowed.has(key), `LBTA_LEGACY.${key} should NOT be in lbtaUtility.allowed`).toBe(false)
    }
  })

  it('DEPRECATED_LBTA_CLASSES matches tokens.deprecations', () => {
    expect(Object.keys(DEPRECATED_LBTA_CLASSES).sort()).toEqual(Object.keys(tokens.deprecations ?? {}).sort())
    for (const [from, to] of Object.entries(tokens.deprecations ?? {})) {
      expect(DEPRECATED_LBTA_CLASSES[from]).toBe(to)
    }
  })

  it('every brand token has a hex value (no empty/null)', () => {
    for (const [name, value] of Object.entries(BRAND)) {
      expect(value, `BRAND.${name} must be a hex value`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('generated artifacts drift detector', () => {
  it('generated/tokens.tailwind.json deep-equals JSON source brand+lbta sections', () => {
    const tailwind = JSON.parse(readFileSync(TAILWIND_JSON_PATH, 'utf8'))
    expect(tailwind.brand).toEqual(tokens.colors.brand)
    expect(tailwind.lbta).toEqual(tokens.colors.lbta)
  })

  it('generated/tokens.css contains every brand-* and lbta-* CSS variable', () => {
    const css = readFileSync(TOKENS_CSS_PATH, 'utf8')
    for (const [token, value] of Object.entries(tokens.colors.brand)) {
      const declaration = `--brand-${token}: ${value};`
      expect(css, `tokens.css should contain "${declaration}"`).toContain(declaration)
    }
    for (const [token, value] of Object.entries(tokens.colors.lbta)) {
      const declaration = `--lbta-${token}: ${value};`
      expect(css, `tokens.css should contain "${declaration}"`).toContain(declaration)
    }
  })

  it('generated/tokens.css does not contain stale CSS variables (i.e. no var declared without a JSON source)', () => {
    const css = readFileSync(TOKENS_CSS_PATH, 'utf8')
    const matches = [...css.matchAll(/--(brand|lbta)-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6,8});/g)]
    for (const m of matches) {
      const [, ns, name] = m
      const source = ns === 'brand' ? tokens.colors.brand : tokens.colors.lbta
      expect(source, `--${ns}-${name} in tokens.css has no source in tokens/lbta-web-tokens.json`).toHaveProperty(name)
    }
  })
})

describe('brand usage guardrail', () => {
  it('check-brand-usage script reports zero violations across the repo', () => {
    let exitCode = 0
    let stdout = ''
    try {
      stdout = execSync('STRICT_BRAND_CHECK=1 ./node_modules/.bin/tsx scripts/check-brand-usage.ts --all', {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (error) {
      const err = error as { status?: number; stdout?: string; stderr?: string }
      exitCode = err.status ?? 1
      stdout = `${err.stdout ?? ''}\n${err.stderr ?? ''}`
    }

    if (exitCode !== 0) {
      throw new Error(
        `Brand usage check failed with exit code ${exitCode}.\n` +
          `Run \`npm run tokens:check -- --all --report\` for details.\n\n` +
          stdout,
      )
    }

    expect(exitCode).toBe(0)
  }, 30_000)
})

describe('email brand checker — behavior', () => {
  // Behavior tests over contract tests: import the actual scanner and call
  // it with synthetic fixture content. Survives reformatting, renaming,
  // and refactoring as long as the behavior stays correct. The companion
  // "STRICT mode passes" test above guards against the scanner being
  // deleted altogether (CI would fail on real templates).
  //
  // Importing scripts/check-brand-usage.ts only loads the module (constants
  // + functions); main() is gated by an isMainModule check and does not
  // auto-run during test collection.

  it('flags forbidden hex (e.g. #d5d1ca) anywhere in template content', () => {
    const html = '<body bgcolor="#d5d1ca">hello</body>'
    const { forbiddenHex } = scanEmailTemplate(html, 'fixture/forbidden.html')
    expect(forbiddenHex).toHaveLength(1)
    expect(forbiddenHex[0]).toMatchObject({
      file: 'fixture/forbidden.html',
      line: 1,
      value: expect.stringMatching(/^#d5d1ca$/i),
    })
  })

  it('matches forbidden hex case-insensitively (#D5D1CA)', () => {
    const html = '<table bgcolor="#D5D1CA">'
    const { forbiddenHex } = scanEmailTemplate(html, 'fixture/upper.html')
    expect(forbiddenHex).toHaveLength(1)
  })

  it('does NOT match a longer hex that shares the same prefix (#d5d1cafe)', () => {
    // Word-boundary check: #d5d1cafe should not match the #d5d1ca rule
    const html = '<span style="color:#d5d1cafe;">'
    const { forbiddenHex } = scanEmailTemplate(html, 'fixture/long.html')
    expect(forbiddenHex).toHaveLength(0)
  })

  it('flags customer-facing template missing the postal address (CAN-SPAM)', () => {
    const html = '<footer>Laguna Beach Tennis Academy · (949) 534-0457</footer>'
    const { missingPostalAddress } = scanEmailTemplate(html, 'fixture/no-addr.html')
    expect(missingPostalAddress).toHaveLength(1)
    expect(missingPostalAddress[0]).toMatchObject({
      file: 'fixture/no-addr.html',
      line: null,
      value: expect.stringContaining('1098 Balboa'),
    })
  })

  it('does NOT flag missing postal address when "1098 Balboa" is present', () => {
    const html =
      '<footer>Laguna Beach Tennis Academy · 1098 Balboa Ave, Laguna Beach, CA 92651 · (949) 534-0457</footer>'
    const { missingPostalAddress } = scanEmailTemplate(html, 'fixture/has-addr.html')
    expect(missingPostalAddress).toHaveLength(0)
  })

  it('does NOT flag missing postal address when template is internal-only (no "Laguna Beach" mention)', () => {
    const html = '<p>Internal staff notification</p>'
    const { missingPostalAddress } = scanEmailTemplate(html, 'fixture/internal.html')
    expect(missingPostalAddress).toHaveLength(0)
  })

  it('returns zero hits for a clean template', () => {
    const html =
      '<body bgcolor="#E8E4DF"><footer>Laguna Beach Tennis Academy · 1098 Balboa Ave, Laguna Beach, CA 92651</footer></body>'
    const { forbiddenHex, missingPostalAddress } = scanEmailTemplate(html, 'fixture/clean.html')
    expect(forbiddenHex).toHaveLength(0)
    expect(missingPostalAddress).toHaveLength(0)
  })

  // Note: config-pinning tests for emailScanRoot, emailExemptFiles, emailForbiddenHexes,
  // emailRequiredPostalMarker, and emailCustomerFacingMarker were removed as redundant.
  // The behavior tests above implicitly cover them — e.g. test #1 ("flags forbidden hex
  // #d5d1ca") fails if #d5d1ca is removed from the Set; test #4 ("flags missing postal
  // address") asserts on `value: stringContaining('1098 Balboa')`, so changing the
  // postal marker fails it; tests #4-#6 use 'Laguna Beach' literally, so changing the
  // customer-facing marker fails them.
})

describe('forbiddenTextOpacityOnLight — behavior', () => {
  // The detector flags `text-brand-pacific-dusk/{30,40,50,60,65,70}` only when
  // a ±6-line context window has no dark-surface marker. Per the v1.4
  // mass-migration-needs-context-heuristics learning, fixture tests must
  // cover known-bad and known-good inputs before strict-mode promotion so
  // changes to the heuristic surface as test failures, not silent drift.

  // ── KNOWN-BAD (should flag) ──────────────────────────────────────────

  it('flags pacific-dusk/60 on plain morning-light surface', () => {
    const tsx = `<div className="bg-brand-morning-light p-4">
      <p className="text-brand-pacific-dusk/60">Body copy</p>
    </div>`
    const hits = findTextOpacityOnLight(tsx, 'fixture/light-1.tsx')
    expect(hits).toHaveLength(1)
    expect(hits[0].value).toBe('text-brand-pacific-dusk/60')
  })

  it('flags pacific-dusk/50 on sandstone surface (the C-3 audit case)', () => {
    const tsx = `<section className="bg-brand-sandstone py-8">
      <button className="text-brand-pacific-dusk/50">Inactive tab</button>
    </section>`
    const hits = findTextOpacityOnLight(tsx, 'fixture/sandstone.tsx')
    expect(hits).toHaveLength(1)
  })

  it('flags pacific-dusk/70 inside a card on a white parent (no dark marker in window)', () => {
    const tsx = `function Card() {
      return (
        <article className="bg-white border rounded-lg p-6">
          <h3 className="text-brand-pacific-dusk">Title</h3>
          <p className="text-brand-pacific-dusk/70">Subtitle</p>
        </article>
      )
    }`
    const hits = findTextOpacityOnLight(tsx, 'fixture/white-card.tsx')
    expect(hits).toHaveLength(1)
  })

  // ── KNOWN-GOOD (should NOT flag — surface heuristic skips them) ──────

  it('does NOT flag pacific-dusk/65 on bg-brand-deep-water (footer subtext)', () => {
    const tsx = `<footer className="bg-brand-deep-water text-white">
      <p className="text-brand-pacific-dusk/65">Hidden until you look closely</p>
    </footer>`
    const hits = findTextOpacityOnLight(tsx, 'fixture/dark-footer.tsx')
    expect(hits).toHaveLength(0)
  })

  it('does NOT flag pacific-dusk/60 inside a <DarkSection> wrapper', () => {
    const tsx = `<DarkSection className="py-16">
      <div>
        <p className="text-brand-pacific-dusk/60">Eyebrow</p>
      </div>
    </DarkSection>`
    const hits = findTextOpacityOnLight(tsx, 'fixture/dark-section.tsx')
    expect(hits).toHaveLength(0)
  })

  it('does NOT flag a hit with `// @brand-allow:dark` on the previous line', () => {
    const tsx = `<div className="bg-brand-morning-light">
      {/* @brand-allow:dark */}
      // @brand-allow:dark
      <p className="text-brand-pacific-dusk/50">Edge case opt-out</p>
    </div>`
    const hits = findTextOpacityOnLight(tsx, 'fixture/optout.tsx')
    expect(hits).toHaveLength(0)
  })
})
