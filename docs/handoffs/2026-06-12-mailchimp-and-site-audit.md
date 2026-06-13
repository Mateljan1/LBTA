# Handoff: Mailchimp Lead Migration + Site Audit
**Date:** June 12, 2026  
**Branch:** `rescue/lbta_website_draft_3526-2026-06-12`  
**Commit:** `abca479`  
**Pushed:** ✅  
**health:prod:** exit 0 — all canary routes 200 OK

---

## What Cursor shipped

### New files
- `lib/mailchimp.ts` — complete Mailchimp Marketing API integration
  - `upsertMember()` — creates or updates audience member
  - `addMemberTags()` — string tag application (no numeric IDs)
  - `upsertAndTag()` — combined helper for form routes
  - Tag builders: `buildTrialTags()`, `buildRegistrationTags()`, `buildContactTags()`, `buildNewsletterTags()`, `buildScholarshipTags()`, `buildPrivateLessonTags()`
  - `pingMailchimp()` — health-check for canary
  - `isMailchimpConfigured()` — gate for all MC calls

### Modified files
| File | Change |
|------|--------|
| `app/api/book/route.ts` | AC + Airtable + Notion → MC + Supabase only |
| `app/api/newsletter/route.ts` | AC + Airtable + Notion → MC + Supabase only |
| `app/api/register/route.ts` | AC + Airtable + Notion → MC + Supabase only |
| `app/api/register-program/route.ts` | AC + Airtable + Notion → MC + Supabase only |
| `app/api/register-year/route.ts` | AC + Airtable + Notion → MC + Supabase only; UTR circuit MC upsert added at route level |
| `app/api/scholarship/route.ts` | AC + Airtable + Notion → MC + Supabase only |
| `app/api/chat/route.ts` | Notion removed; Supabase kept |
| `lib/leads-canary.ts` | Postmark + GHL steps → Mailchimp ping |
| `.env.example` | Mailchimp vars added; AC marked deprecated |
| `lib/email.ts` | Staff template copy: removed "ActiveCampaign and GoHighLevel" |
| `app/coaches/andrew-mateljan/page.tsx` | Phone: 241-0847 → 534-0457 |
| `app/programs/usta-adult-league/page.tsx` | Phone: 241-0847 → 534-0457 |
| `next.config.js` | Redirect: /coaches/robert-lebuhn → /coaches (departed) |

### Vercel env vars set (production)
- `MAILCHIMP_API_KEY` ✅ (from 1Password `Mailchimp · LBTA · MAILCHIMP_API_KEY`)
- `MAILCHIMP_SERVER_PREFIX=us1` ✅
- `MAILCHIMP_AUDIENCE_ID=30bbabe32c` ✅ (Laguna Beach Tennis Academy audience, 2,641 members)

> Preview env vars: Vercel CLI 50.28.0 has a syntax issue with preview `--value` flag. **Andrew action:** Set preview vars manually in Vercel dashboard → Settings → Environment Variables → copy the 3 vars to Preview.

---

## What Andrew must do in Mailchimp UI (before email is live)

> **Critical:** Leads are now landing in Mailchimp audience with tags, but NO emails go to the customer or staff until you set up these automations. Code does not send emails — that's Mailchimp's job now.

### Required Mailchimp Customer Journeys (set up in MC dashboard)

**1. Customer Confirmation — all website signups**
- Trigger: Tag added → `source:website-form`
- Send to: subscriber's email address  
- What to send: "We got your request" confirmation (use `lib/email.ts` `buildConfirmationHtml` as template — copy the HTML into a MC template)
- Filter by form type with tag: `form:trial`, `form:register`, `form:contact`, etc. for variant copy

**2. Staff Alert — new lead**
- Trigger: Tag added → `source:website-form`
- Send to: `support@lagunabeachtennisacademy.com` (or Andrew's email)
- What to send: subscriber's name, email, phone, and program tags (use MC's built-in merge tags)

**3. Scholarship path**
- Trigger: Tag added → `flag:scholarship`
- Send to: subscriber + staff alert
- Separate journey with scholarship-specific copy

**4. Newsletter signup**
- Trigger: Tag added → `source:newsletter`
- Send to: subscriber with welcome copy

### Verify the integration is working
1. Go to [lagunabeachtennisacademy.com/book](https://lagunabeachtennisacademy.com/book)
2. Submit a trial request with a real email (use `andrew@tennisbeast.com` or a test address)
3. Check Mailchimp → Audience → `Laguna Beach Tennis Academy` → search for the email
4. Verify tags: `source:website-form`, `interest:trial-class`, `form:trial`, `status:new-lead`, `season:spring-2026`
5. If tags appear ✅ — integration is live. Set up the Customer Journeys above.
6. If no entry found 🔴 — Mailchimp API key may need rotation. Check `MAILCHIMP_API_KEY` in Vercel.

---

## What's left (what Cursor did NOT do)

| Item | Why deferred | Recommended next |
|------|-------------|-----------------|
| `lib/fulfill-utr-circuit-registration.ts` still has AC imports | AC calls are no-ops when key is empty — UTR leads DO go to MC via route-level upsert | Claude Code: remove AC imports, wire MC directly in that function |
| GHL chat widget still active | Decision required (remove vs replace vs keep) | Andrew decides → Cursor executes in 5 min |
| Bulk contrast codemod (402 instances) | Needs Andrew's A/B/C decision | Andrew picks option → Cursor runs codemod |
| Production Lighthouse on `/`, `/book`, `/schedules` | Requires browser environment | Claude Code: run post-deploy |
| Mailchimp Customer Journey setup | Requires Andrew in MC dashboard | Andrew action (above) |
| `MAILCHIMP_API_KEY` in Vercel preview | CLI bug with old CLI version | Andrew: set in Vercel dashboard manually |

---

## Lead gap investigation

Supabase shows **zero real leads June 6–12** (7 days). Last confirmed real lead: `armenc@hotmail.com`, June 5 at 03:27 UTC.

**Andrew: please check** — did anyone call, text, or DM in the last 7 days that is NOT in Supabase?

- If YES → there's a form bug. Check Vercel function logs → `/api/book` for errors.
- If NO → likely just a slow week (summer + Laguna Beach seasonality). The new canary will catch any future drought within 6 hours.

For any manually-collected leads from the last 7 days that bypassed the form: manually add to Mailchimp audience with tags `source:manual-entry`, `status:new-lead`.

---

## Supabase: secondary sink confirmation

All routes now write to Supabase `leads` table as secondary sink. Airtable is fully removed from the hot path.

Query leads in Supabase: `select * from leads where source != 'health-canary' order by created_at desc limit 50`

---

## Files to review (context for Claude Code)
- `lib/mailchimp.ts` — full integration module
- `docs/audits/2026-06-12-full-site-audit.md` — P0-P3 backlog
- `lib/leads-canary.ts` — updated canary steps
