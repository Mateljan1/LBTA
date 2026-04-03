# UTR Tracker Ops Runbook

## Purpose
Operate and maintain the LBTA UTR Tracker (`/utr-tracker`) and admin console (`/utr-tracker/admin`).

## Environment Setup

Required for admin and data writes:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UTR_TRACKER_ADMIN_SECRET`

Optional (rate limiting in production):
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Database Migration

Apply tracker schema with Supabase CLI from repo root:

```bash
supabase db push
```

Primary migration file:
- `supabase/migrations/20260401_utr_tracker_schema.sql`
- `supabase/migrations/20260402_utr_tracker_color_ball_atomic.sql`
- `supabase/migrations/20260403_utr_tracker_matches_scope_replace_atomic.sql`
- `supabase/migrations/2026040301_utr_tracker_matches_scope_replace_atomic.sql`
- `supabase/migrations/2026040302_utr_tracker_atomic_followups.sql`

## Admin Access

1. Navigate to `/utr-tracker/admin/login`.
2. Enter `UTR_TRACKER_ADMIN_SECRET`.
3. Session cookie grants access to `/utr-tracker/admin` routes.

If login fails:
- Verify `UTR_TRACKER_ADMIN_SECRET` is present in env.
- Confirm server restarted after env changes.

## Weekly Workflow (Andrew / Saska)

1. **Roster check**
   - Open `Player Roster`.
   - Add new players or update UTR/divisions.
   - Save roster.

2. **Match entry**
   - Open `UTR Match Entry`.
   - Select week + date + division.
   - Keep write mode on `Replace existing matches for selected week/division/date` for normal weekly updates.
   - Paste match lines using the specified format.
   - Confirm parser shows no errors.
   - Save all matches.

3. **Color Ball**
   - Open `Color Ball Attendance & Badges`.
   - Select week.
   - Mark attendance/completed match/matches played.
   - Add coach-awarded badges (comma-separated).
   - Save week.

4. **Public verification**
   - Open `/utr-tracker`.
   - Confirm standings and Color Ball passports update.

## Linking and User Navigation

- Marketing page should link to `/utr-tracker` from:
  - `app/programs/utr-match-play/page.tsx`
- Keep registration and schedule source-of-truth links on:
  - `/programs/utr-match-play`
  - `/schedules`

## Troubleshooting

- **Public page empty**:
  - Check `season_config` rows exist in Supabase.
  - Verify Supabase env vars are set.

- **Match save fails with player not found**:
  - Add players to roster first; match import resolves names to roster rows.

- **Duplicate imports by mistake**:
  - Use the default replace mode for weekly entry.
  - If append mode was used accidentally, re-run the same scope in replace mode.

- **Color Ball save fails**:
  - Ensure selected players are valid UUID-backed roster entries.

- **Unauthorized API response**:
  - Session cookie expired or missing.
  - Re-login at `/utr-tracker/admin/login`.

## Production Verification Checklist

After deploy, confirm all of the following:
- `/utr-tracker` loads and shows standings/passport sections.
- `/utr-tracker/admin/login` accepts the admin secret and redirects to admin.
- Roster save works (add/update one test player).
- Match save works in replace mode and public standings reflect the update.
- Color Ball week save works and passport cards update after reload.
