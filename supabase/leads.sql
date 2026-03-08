-- Lead store table for LBTA form submissions.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) once per project.
-- Required for the optional lead store; if not run, the app still works (lead store no-ops).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  email text not null,
  name text,
  phone text,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

-- Optional: index for listing/filtering by source or date
create index if not exists idx_leads_source on public.leads (source);
create index if not exists idx_leads_created_at on public.leads (created_at desc);
