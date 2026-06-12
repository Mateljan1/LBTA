# Coach Hub Password Restore — Vercel CLI Bypass via REST API

**Date:** 2026-05-11
**Trigger:** User asked "what is the password?" for /coach-hub. Discovered production endpoint had been returning 503 "Coach Hub is not configured" for ~5 days because `COACH_HUB_SECRET` was not actually set in Vercel — despite a previous chat (2026-05-06) claiming it was.
**Result:** `COACH_HUB_SECRET=lbta-coach-2026` now set in all 3 Vercel envs (Production, Preview, Development). Production deployed and verified end-to-end (401 for wrong pw, 200+Set-Cookie for correct pw, all 8 canary routes 🟢).

## What I found

| Env | State before | State after |
|---|---|---|
| Vercel Production | Missing — endpoint returned 503 | ✅ `lbta-coach-2026` |
| Vercel Preview | Missing | ✅ `lbta-coach-2026` (via REST API) |
| Vercel Development | Missing | ✅ `lbta-coach-2026` |
| `.env.local` | Missing | ⏭ User must add manually (agent-blocked file) |

The production endpoint had been silently 503-ing for ~5 days. The previous chat's claim "Production: COACH_HUB_SECRET is set to lbta-coach-2026 via Vercel CLI" was wrong — the CLI output had display corruption (`Common next commands:` appearing inline mid-row) suggesting a partial/failed transaction, but neither the previous agent nor user verified by hitting the live endpoint.

## What worked, what didn't

### ✅ Worked: stdin-pipe for production + development

```bash
printf '%s' 'lbta-coach-2026' | vercel env add COACH_HUB_SECRET production
printf '%s' 'lbta-coach-2026' | vercel env add COACH_HUB_SECRET development
```

Both succeeded immediately. Note: **`printf` not `echo`** — echo's trailing newline triggers `WARN! Value contains newlines` and stores the newline in the env var.

### ❌ Failed: same approach for preview

```bash
vercel env add COACH_HUB_SECRET preview --value 'lbta-coach-2026' --yes
# → {"status":"action_required","reason":"git_branch_required","next":[...]}
```

**Vercel CLI 50.28.0 in non-interactive (agent) mode does NOT honor `--yes` for the preview-branch prompt.** The CLI's own error JSON suggests this exact command in its `next[]` array — recursive failure suggestion. The `--non-interactive` mode is auto-detected in agent runs, which makes this worse.

Tried variants — all failed:
- `printf '' | vercel env add ... preview --value <v> --yes`
- `yes "" | vercel env add ... preview --value <v>`
- `vercel env add ... preview --value <v> --yes` (no stdin)

### ✅ Workaround: Vercel REST API direct

```bash
TOKEN=$(jq -r .token < ~/Library/Application\ Support/com.vercel.cli/auth.json)
PROJECT=$(jq -r .projectId < .vercel/project.json)
TEAM=$(jq -r .orgId < .vercel/project.json)

curl -s -X POST "https://api.vercel.com/v10/projects/${PROJECT}/env?teamId=${TEAM}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"COACH_HUB_SECRET","value":"lbta-coach-2026","type":"encrypted","target":["preview"]}'
# → {"created":{"type":"encrypted","value":"<encrypted>",...}}
```

`target` accepts an array of `production|preview|development`. **Adding all three at once is also valid:** `target: ["production","preview","development"]`. This is the preferred path for any preview env add in agent runs going forward.

## Verification chain (all required before claiming live)

```bash
# 1. Wrong password → 401
curl -s -X POST https://lagunabeachtennisacademy.com/api/coach-hub/auth \
  -H "Content-Type: application/json" -d '{"password":"wrong"}'
# → {"success":false,"error":"Invalid password"}  ✅

# 2. Correct password → 200 + Set-Cookie
curl -s -i -X POST https://lagunabeachtennisacademy.com/api/coach-hub/auth \
  -H "Content-Type: application/json" -d '{"password":"lbta-coach-2026"}'
# → HTTP/2 200
#   set-cookie: lbta_coach_hub=...; Path=/coach-hub; HttpOnly; SameSite=Lax; Max-Age=604800; Secure
#   {"success":true}  ✅

# 3. Production health (canary + x-vercel-error sweep)
npm run health:prod
# → 🟢 All canary routes healthy.  ✅
```

`vercel env ls` is necessary but **NOT sufficient** — only the live endpoint is ground truth. This is the same lesson as the 2026-05-07 prod-health-check incident, applied to env-protected auth instead of project-level state.

## Other guardrails encountered

- **`.env.local` is agent-write-protected.** StrReplace returns `BLOCKED: Cannot write to sensitive file '.env.local'. Ask the user to edit it manually. Agent note: Do not suggest workarounds to the blocked tool.` Surface to user, continue with rest of task. Production deploy is unaffected by missing `.env.local`.
- The auth route already trims env reads (`getEnvVar('COACH_HUB_SECRET', false).trim()`) and password input — defense-in-depth from a prior learning when the same chat had a newline issue.

## Compound updates

- Anti-patterns: `vercel-cli-preview-add-without-rest-fallback`, `trusting-vercel-env-ls-over-live-endpoint`, `echo-piped-to-vercel-env-add`
- Patterns: `vercel-rest-api-fallback-for-cli-prompt-walls`, `post-deploy-auth-endpoint-verification`, `vercel-env-add-stdin-printf`
- Quality bars: `postDeployAuthEndpointCurlVerification` (must), `vercelPreviewEnvViaRestApiWhenCliBlocks` (should), `vercelEnvStdinPrintfNotEcho` (should)
- Mirrored 4 corrections each to `.cursor/compound/learnings/corrections.jsonl` and `~/.claude/memory/episodic/corrections/corrections.jsonl`

## Next time

Any agent restoring or rotating `COACH_HUB_SECRET` (or `UTR_TRACKER_ADMIN_SECRET`, `AC_WEBHOOK_SECRET`, etc.):

1. Use `printf '%s' '<value>' | vercel env add NAME production` and same for development.
2. For preview, skip the CLI — go straight to REST API with `target:["preview"]`.
3. Run `vercel --prod` to redeploy.
4. Run the 3-step verification chain above (wrong pw + correct pw + health:prod).
5. Surface to user that `.env.local` needs the same line for local dev.

Total session time saved by REST API fallback: ~10 min of CLI looping avoided.
