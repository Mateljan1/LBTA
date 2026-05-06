-- Add notion_page_id to leads for idempotent Meta lead-ad mirror.
-- Applied via: npx supabase db push (after supabase link).
--
-- Rollback (Supabase SQL editor):
--   drop index if exists idx_leads_notion_page_id;
--   alter table public.leads drop column if exists notion_page_id;

alter table public.leads
  add column if not exists notion_page_id text;

-- Unique partial index: enforces "one row per Notion page" without blocking
-- the existing (no-notion-page-id) inserts that come from website forms.
create unique index if not exists idx_leads_notion_page_id
  on public.leads (notion_page_id)
  where notion_page_id is not null;
