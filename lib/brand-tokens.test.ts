import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { BRAND, LBTA_UTIL, LBTA_LEGACY, LBTA, DEPRECATED_LBTA_CLASSES } from './brand-tokens'

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
