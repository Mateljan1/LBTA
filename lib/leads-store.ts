/**
 * Lead store — primary storage for form submissions (not reliant on ActiveCampaign).
 * When Supabase is configured, leads are written to the `leads` table.
 * When not configured, writes are no-ops so the app still works.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (optional).
 *
 * Table SQL (run in Supabase SQL editor):
 *   create table if not exists public.leads (
 *     id uuid primary key default gen_random_uuid(),
 *     source text not null,
 *     email text not null,
 *     name text,
 *     phone text,
 *     payload jsonb default '{}',
 *     created_at timestamptz default now()
 *   );
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** Returns Supabase client when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set; null otherwise. Env read here for testability. */
export function getClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return client
}

export type StoreLeadParams = {
  source: string
  email: string
  name?: string | null
  phone?: string | null
  payload?: Record<string, unknown>
}

/**
 * Window (ms) used to suppress accidental duplicate submissions of the same
 * email + source. Real users sometimes click "Submit" again 30-90 seconds after
 * a successful submission (modal closed, navigated back, retried). 120s catches
 * those without blocking legitimate re-submissions days later.
 */
export const DEDUP_WINDOW_MS = 120_000

/**
 * Store a lead. Runs only when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
 * Does not throw; logs errors so form handlers can still return success.
 *
 * Skips inserts when an identical (email, source) pair was stored within the
 * last DEDUP_WINDOW_MS (120 seconds) — protects against accidental double
 * submissions without affecting legitimate later re-submissions.
 */
export async function storeLead(params: StoreLeadParams): Promise<void> {
  const supabase = getClient()
  if (!supabase) return

  const { source, email, name, phone, payload } = params
  if (!email?.trim()) return

  const cleanEmail = email.trim()

  try {
    const sinceIso = new Date(Date.now() - DEDUP_WINDOW_MS).toISOString()
    const { data: recent, error: lookupError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', cleanEmail)
      .eq('source', source)
      .gte('created_at', sinceIso)
      .limit(1)
      .maybeSingle()

    if (lookupError) {
      // Log and continue — failing open is safer than dropping leads silently.
      console.error('[leads-store] Dedup lookup failed:', lookupError.message)
    } else if (recent) {
      console.info(`[leads-store] Skipping duplicate within ${DEDUP_WINDOW_MS}ms: ${cleanEmail} (${source})`)
      return
    }

    const { error } = await supabase.from('leads').insert({
      source,
      email: cleanEmail,
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      payload: payload ?? {},
    })

    if (error) {
      console.error('[leads-store] Insert failed:', error.message)
    }
  } catch (err) {
    console.error('[leads-store] Error:', err instanceof Error ? err.message : err)
  }
}
