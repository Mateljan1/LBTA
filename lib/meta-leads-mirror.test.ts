import { describe, it, expect } from 'vitest'
import {
  isMetaLeadPage,
  mapMetaLeadToStoreParams,
  DEFAULT_SCAN_WINDOW_MS,
} from './meta-leads-mirror'

// Minimal stub of Notion's PageObjectResponse shape for unit testing.
// We only set the properties our code reads.
function makePage(props: Record<string, unknown>, id = 'page-test-1') {
  return {
    object: 'page',
    id,
    url: `https://www.notion.so/${id}`,
    properties: props as never,
  } as never
}

function richText(value: string) {
  return { type: 'rich_text', rich_text: value ? [{ plain_text: value }] : [] }
}
function title(value: string) {
  return { type: 'title', title: value ? [{ plain_text: value }] : [] }
}
function select(value: string) {
  return { type: 'select', select: value ? { name: value } : null }
}
function emailProp(value: string) {
  return { type: 'email', email: value || null }
}
function phone(value: string) {
  return { type: 'phone_number', phone_number: value || null }
}

describe('meta-leads-mirror', () => {
  describe('DEFAULT_SCAN_WINDOW_MS', () => {
    it('is at least 24h so a one-off skipped run does not lose leads', () => {
      expect(DEFAULT_SCAN_WINDOW_MS).toBeGreaterThanOrEqual(24 * 60 * 60 * 1000)
      expect(DEFAULT_SCAN_WINDOW_MS).toBeLessThanOrEqual(7 * 24 * 60 * 60 * 1000)
    })
  })

  describe('isMetaLeadPage', () => {
    it('returns true when Meta-channel signal present (campaign_name)', () => {
      const page = makePage({
        campaign_name: select('Junior Programs Q2'),
        'Player Name': title('Test User'),
      })
      expect(isMetaLeadPage(page)).toBe(true)
    })

    it('returns true when ad_name is set', () => {
      const page = makePage({ ad_name: select('Ad-A') })
      expect(isMetaLeadPage(page)).toBe(true)
    })

    it('returns true when form_name is set', () => {
      const page = makePage({ form_name: select('Adult Beginner Lead Form') })
      expect(isMetaLeadPage(page)).toBe(true)
    })

    it('returns false when only website-schema props are set', () => {
      const page = makePage({
        'Player Name': title('Lily Givens'),
        'Parent Email': emailProp('lily@example.com'),
        Program: richText('LiveBall'),
      })
      expect(isMetaLeadPage(page)).toBe(false)
    })

    it('returns false when all signal props are empty', () => {
      const page = makePage({
        campaign_name: select(''),
        ad_name: select(''),
        form_name: select(''),
        platform: richText(''),
      })
      expect(isMetaLeadPage(page)).toBe(false)
    })
  })

  describe('mapMetaLeadToStoreParams', () => {
    it('maps full Meta lead-ad row → StoreLeadParams', () => {
      const page = makePage(
        {
          email: emailProp('jane@example.com'),
          full_name: richText('Jane Doe'),
          phone: richText('9495551234'),
          'which_program_are_you_most_interested_in?': richText('Junior Tennis'),
          campaign_name: select('Junior Q2 2026'),
          ad_name: select('Ad-A'),
          form_name: select('Junior Lead Form'),
          platform: richText('facebook'),
        },
        'notion-page-meta-1'
      )

      const params = mapMetaLeadToStoreParams(page)
      expect(params.source).toBe('meta-lead-ad')
      expect(params.email).toBe('jane@example.com')
      expect(params.name).toBe('Jane Doe')
      expect(params.phone).toBe('9495551234')
      expect(params.notionPageId).toBe('notion-page-meta-1')
      expect(params.payload).toMatchObject({
        program: 'Junior Tennis',
        campaign: 'Junior Q2 2026',
        ad: 'Ad-A',
        form: 'Junior Lead Form',
        platform: 'facebook',
      })
      expect((params.payload as Record<string, unknown>).notionPageUrl).toContain('notion-page-meta-1')
    })

    it('falls back to website-schema fields when Meta-schema fields are missing', () => {
      const page = makePage({
        'Parent Email': emailProp('parent@example.com'),
        'Parent Name': richText('Parent X'),
        'Parent Phone': phone('9495559999'),
        Program: richText('LiveBall'),
        campaign_name: select('Some Campaign'), // qualifies as Meta page
      })
      const params = mapMetaLeadToStoreParams(page)
      expect(params.email).toBe('parent@example.com')
      expect(params.name).toBe('Parent X')
      expect(params.phone).toBe('9495559999')
      expect((params.payload as Record<string, unknown>).program).toBe('LiveBall')
    })

    it('omits empty payload fields', () => {
      const page = makePage({
        email: emailProp('a@b.com'),
        campaign_name: select('Camp 1'),
      })
      const params = mapMetaLeadToStoreParams(page)
      const payload = params.payload as Record<string, unknown>
      expect(payload).not.toHaveProperty('ad')
      expect(payload).not.toHaveProperty('form')
      expect(payload).not.toHaveProperty('platform')
      expect(payload.campaign).toBe('Camp 1')
    })

    it('uses notion page id verbatim', () => {
      const page = makePage(
        { email: emailProp('a@b.com'), campaign_name: select('X') },
        'specific-id-xyz'
      )
      const params = mapMetaLeadToStoreParams(page)
      expect(params.notionPageId).toBe('specific-id-xyz')
    })
  })
})
