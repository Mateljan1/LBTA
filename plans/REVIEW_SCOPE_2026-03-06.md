# Code to Review — LBTA Supabase lead store + project ref migration (2026-03-06)

## Summary of changes
- **New:** Optional Supabase lead store: `lib/leads-store.ts` + `storeLead()` called from 7 API routes (book, newsletter, register, register-program, register-year, scholarship, jtt-registration). When env vars are set, form submissions are written to `leads` table; otherwise no-op.
- **Migration:** Supabase project ref updated from `qtrypzzcjebvfcihiynt` to `mapbbmrjgpusegjvbkod` across next.config (image host), app pages, components, and email HTML templates.
- **New:** `supabase/migrations/20260306000000_create_leads_table.sql` and README instructions for `supabase db push` and env vars.

## File: lib/leads-store.ts (new)

```ts
/**
 * Lead store — primary storage for form submissions (not reliant on ActiveCampaign).
 * When Supabase is configured, leads are written to the `leads` table.
 * When not configured, writes are no-ops so the app still works.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (optional).
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

let client: SupabaseClient | null = null

function getClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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

/** Store a lead. No-op if Supabase not configured. Does not throw; logs errors. */
export async function storeLead(params: StoreLeadParams): Promise<void> {
  const supabase = getClient()
  if (!supabase) return
  const { source, email, name, phone, payload } = params
  try {
    const { error } = await supabase.from('leads').insert({
      source,
      email: email.trim(),
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      payload: payload ?? {},
    })
    if (error) console.error('[leads-store] Insert failed:', error.message)
  } catch (err) {
    console.error('[leads-store] Error:', err instanceof Error ? err.message : err)
  }
}
```

## Migration: supabase/migrations/20260306000000_create_leads_table.sql

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  email text not null,
  name text,
  phone text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);
create index if not exists idx_leads_source on public.leads (source);
create index if not exists idx_leads_created_at on public.leads (created_at desc);
```

## API route pattern (repeated in 7 routes)

After validation and existing AC/Notion logic, each route calls:

```ts
await storeLead({
  source: 'book' | 'newsletter' | 'register' | 'register-program' | 'register-year' | 'scholarship' | 'jtt-registration',
  email: string,
  name?: string,
  phone?: string,
  payload?: Record<string, unknown>,
})
```

No try/catch around storeLead in routes; storeLead itself catches and logs.

## Other changes
- **lib/env.ts:** Added SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY to ENV_VARS.
- **next.config.js:** remotePatterns hostname `qtrypzzcjebvfcihiynt.supabase.co` → `mapbbmrjgpusegjvbkod.supabase.co`.
- **README.md:** New "Lead store (Supabase, optional)" section with CLI and env instructions.
- **.cursorrules:** Note that VYLO pages removed, legacy URLs redirect.
- **Package:** Added `@supabase/supabase-js`: ^2.98.0.
- **Emails/HTML:** All Supabase storage image URLs updated to new project host.
