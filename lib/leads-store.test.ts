import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getClient, storeLead } from './leads-store'

describe('leads-store', () => {
  const origUrl = process.env.SUPABASE_URL
  const origKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  afterEach(() => {
    process.env.SUPABASE_URL = origUrl
    process.env.SUPABASE_SERVICE_ROLE_KEY = origKey
  })

  describe('getClient', () => {
    it('returns null when SUPABASE_URL is missing', () => {
      delete process.env.SUPABASE_URL
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
      expect(getClient()).toBeNull()
    })

    it('returns null when SUPABASE_SERVICE_ROLE_KEY is missing', () => {
      process.env.SUPABASE_URL = 'https://x.supabase.co'
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      expect(getClient()).toBeNull()
    })

    it('returns null when both are missing', () => {
      delete process.env.SUPABASE_URL
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
      expect(getClient()).toBeNull()
    })
  })

  describe('storeLead', () => {
    beforeEach(() => {
      delete process.env.SUPABASE_URL
      delete process.env.SUPABASE_SERVICE_ROLE_KEY
    })

    it('resolves without throwing when Supabase env is not set', async () => {
      await expect(
        storeLead({ source: 'test', email: 'a@b.com' })
      ).resolves.toBeUndefined()
    })

    it('resolves without throwing when email is empty', async () => {
      await expect(
        storeLead({ source: 'test', email: '' })
      ).resolves.toBeUndefined()
    })

    it('resolves without throwing when email is whitespace only', async () => {
      await expect(
        storeLead({ source: 'test', email: '   ' })
      ).resolves.toBeUndefined()
    })
  })
})
