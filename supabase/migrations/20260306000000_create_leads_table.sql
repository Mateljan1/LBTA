-- Lead store table for LBTA form submissions.
-- Applied via: supabase db push (after supabase link)
--
-- Rollback (run in Supabase SQL editor if needed):
--   drop index if exists idx_leads_created_at;
--   drop index if exists idx_leads_source;
--   drop table if exists public.leads;

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
