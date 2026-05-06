import { describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { BRAND } from './brand-tokens'

const REPO_ROOT = path.resolve(__dirname, '..')
const TOKEN_JSON_PATH = path.join(REPO_ROOT, 'tokens', 'lbta-web-tokens.json')

type TokenFile = {
  colors: { brand: Record<string, string>; lbta: Record<string, string> }
}

const tokens = JSON.parse(readFileSync(TOKEN_JSON_PATH, 'utf8')) as TokenFile

describe('brand-tokens drift detector', () => {
  it('every BRAND constant matches tokens/lbta-web-tokens.json', () => {
    for (const [kebab, value] of Object.entries(tokens.colors.brand)) {
      const camel = kebab.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase()) as keyof typeof BRAND
      expect(BRAND[camel], `BRAND.${camel} should match tokens.colors.brand["${kebab}"]`).toBe(value)
    }
  })

  it('every brand token has a hex value (no empty/null)', () => {
    for (const [name, value] of Object.entries(BRAND)) {
      expect(value, `BRAND.${name} must be a hex value`).toMatch(/^#[0-9A-Fa-f]{6}$/)
    }
  })
})

describe('brand usage guardrail', () => {
  it('check-brand-usage script reports zero violations across the repo', () => {
    // Run the checker in strict mode against the full repo.
    // STRICT_BRAND_CHECK=1 makes the script exit non-zero on any error/warning.
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
