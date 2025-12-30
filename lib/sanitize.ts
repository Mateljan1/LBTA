/**
 * HTML Sanitization Utilities
 * Prevents XSS attacks when generating HTML content (e.g., emails)
 */

import sanitizeHtml from 'sanitize-html'

/**
 * Default sanitization options for email content
 * Allows basic formatting but strips dangerous elements
 */
const EMAIL_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span',
    'div', 'ul', 'ol', 'li', 'a', 'table', 'tr', 'td', 'th', 'thead', 'tbody'
  ],
  allowedAttributes: {
    'a': ['href', 'target'],
    'span': ['style'],
    'div': ['style'],
    'td': ['style', 'colspan', 'rowspan'],
    'th': ['style', 'colspan', 'rowspan'],
    'table': ['style', 'cellpadding', 'cellspacing', 'border'],
  },
  allowedStyles: {
    '*': {
      'color': [/^#[0-9a-f]{3,6}$/i, /^rgb\(/],
      'background-color': [/^#[0-9a-f]{3,6}$/i, /^rgb\(/],
      'font-weight': [/^bold$/],
      'font-style': [/^italic$/],
      'text-align': [/^(left|right|center)$/],
      'padding': [/^\d+px$/],
      'margin': [/^\d+px$/],
    }
  },
  // Disallow javascript: and data: URLs
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

/**
 * Strict sanitization - removes all HTML, returns plain text
 */
const STRICT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
}

/**
 * Escape HTML entities for safe display
 * Use this for user input that will be displayed as text
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  return String(text).replace(/[&<>"'`=/]/g, (char) => htmlEntities[char])
}

/**
 * Sanitize HTML content for email templates
 * Allows basic formatting but strips scripts and dangerous content
 */
export function sanitizeForEmail(html: string): string {
  return sanitizeHtml(html, EMAIL_SANITIZE_OPTIONS)
}

/**
 * Strip all HTML and return plain text
 * Use for fields that should never contain HTML
 */
export function stripHtml(html: string): string {
  return sanitizeHtml(html, STRICT_SANITIZE_OPTIONS)
}

/**
 * Sanitize user input for safe inclusion in HTML email
 * This is the primary function to use when building email templates
 */
export function sanitizeEmailField(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }
  // Convert to string and escape HTML entities
  return escapeHtml(String(value))
}

/**
 * Create a safe email template builder
 * Automatically escapes all interpolated values
 */
export function createEmailTemplate(
  template: string,
  data: Record<string, unknown>
): string {
  let result = template

  // Replace {{key}} placeholders with escaped values
  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(placeholder, sanitizeEmailField(value))
  }

  return result
}

/**
 * Validate and sanitize a URL
 * Returns null if the URL is invalid or uses a dangerous scheme
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']

    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn(`[Sanitize] Blocked URL with protocol: ${parsed.protocol}`)
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}
