#!/usr/bin/env node
/**
 * One-off script to create the public.leads table on the Supabase project.
 * Use when supabase link/db push is not possible (e.g. project in another org).
 *
 * Usage (from repo root):
 *   DATABASE_URL='postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres' node scripts/run-leads-migration.js
 *
 * Get DATABASE_URL from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
 * Use the "Transaction" pooler mode string; replace [YOUR-PASSWORD] with the database password.
 */

const { execSync } = require('child_process');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || !DATABASE_URL.startsWith('postgresql://')) {
  console.error('Missing or invalid DATABASE_URL.');
  console.error('Set it to your Supabase project connection string (Project Settings → Database → URI).');
  process.exit(1);
}

const migrationPath = path.join(__dirname, '../supabase/migrations/20260306000000_create_leads_table.sql');
console.log('Running leads table migration...');
try {
  execSync(`psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${migrationPath}"`, {
    stdio: 'inherit',
  });
} catch (e) {
  console.error('Migration failed. If psql is not installed, run the SQL manually in Supabase Dashboard → SQL Editor.');
  console.error('File: supabase/migrations/20260306000000_create_leads_table.sql');
  process.exit(1);
}
console.log('Done. public.leads table is ready.');
