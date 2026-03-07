import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  sanitizeForEmail,
  stripHtml,
  sanitizeEmailField,
  createEmailTemplate,
  sanitizeUrl,
} from './sanitize'

describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
  })

  it('escapes &', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })

  it('escapes quotes', () => {
    expect(escapeHtml('"hi"')).toBe('&quot;hi&quot;')
  })

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('')
  })
})

describe('sanitizeForEmail', () => {
  it('allows safe tags like <b> and <p>', () => {
    const html = '<p>Hello <b>world</b></p>'
    expect(sanitizeForEmail(html)).toContain('Hello')
    expect(sanitizeForEmail(html)).toContain('world')
  })

  it('strips script tags', () => {
    const html = '<p>Ok</p><script>alert(1)</script>'
    const out = sanitizeForEmail(html)
    expect(out).not.toContain('<script>')
    expect(out).not.toContain('alert')
  })

  it('strips javascript: URLs in links', () => {
    const html = '<a href="javascript:alert(1)">click</a>'
    const out = sanitizeForEmail(html)
    expect(out).not.toContain('javascript:')
  })
})

describe('stripHtml', () => {
  it('removes all HTML and returns text', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello')
  })

  it('handles nested tags', () => {
    expect(stripHtml('<div><span>Hi</span></div>')).toBe('Hi')
  })
})

describe('sanitizeEmailField', () => {
  it('escapes string value', () => {
    expect(sanitizeEmailField('<script>')).toBe('&lt;script&gt;')
  })

  it('returns empty string for null/undefined', () => {
    expect(sanitizeEmailField(null)).toBe('')
    expect(sanitizeEmailField(undefined)).toBe('')
  })

  it('converts number to string and escapes', () => {
    expect(sanitizeEmailField(42)).toBe('42')
  })
})

describe('createEmailTemplate', () => {
  it('replaces placeholders with escaped values', () => {
    const out = createEmailTemplate('Hi {{name}}', { name: 'Jane' })
    expect(out).toBe('Hi Jane')
  })

  it('escapes HTML in values', () => {
    const out = createEmailTemplate('Hi {{name}}', { name: '<b>Jane</b>' })
    expect(out).toBe('Hi &lt;b&gt;Jane&lt;&#x2F;b&gt;')
  })

  it('handles multiple placeholders', () => {
    const out = createEmailTemplate('{{a}} and {{b}}', { a: '1', b: '2' })
    expect(out).toBe('1 and 2')
  })
})

describe('sanitizeUrl', () => {
  it('allows https URL', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
  })

  it('allows mailto', () => {
    expect(sanitizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com')
  })

  it('returns null for javascript: URL', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe(null)
  })

  it('returns null for invalid URL', () => {
    expect(sanitizeUrl('not a url')).toBe(null)
  })
})
