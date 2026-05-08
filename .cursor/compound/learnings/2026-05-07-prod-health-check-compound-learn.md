# Production Health-Check — End-User Perspective Verification

**Date:** 2026-05-07
**Trigger:** User asked "are they all done?" after v1.6 SEO push. Investigation revealed production had been returning HTTP 402 (`x-vercel-error: DEPLOYMENT_DISABLED`) for hours — but `vercel ls` showed all deploys as `● Ready`.
**Result:** New `npm run health:prod` script + updated `.cursorrules` ship requirements.

## What broke

After every push today, I claimed "verified live in prod" based on:
- `vercel ls` showing the latest deploy as `● Ready`
- A few `curl -s -o /dev/null -w "%{http_code}"` checks that returned 200

What I missed:
- The Vercel project itself was disabled (likely billing/quota). Builds were succeeding (Vercel still queues + builds even when serving is disabled), but the production alias `lagunabeachtennisacademy.com` was returning HTTP 402 with `x-vercel-error: DEPLOYMENT_DISABLED`.
- My early curl checks happened to return 200 because they hit a still-cached response from an older serving deploy. As caches expired, requests started returning 402.
- The 402 responses came WITH the `x-vercel-error` header — but I wasn't capturing or parsing headers, just the status code.

By the time the user asked the right question, three commits (v1.5, v1.6, plus this one) were sitting on `main` with builds claimed "Ready" but **none were actually serving to users**.

## What I should have caught

The Vercel error `DEPLOYMENT_DISABLED` is a project-state signal, not a code issue. It's invisible to:
- `vercel ls` (lists deployments, not project state)
- `npm run build` / `npm run quality-gate` (local-only)
- `git push` (just pushes commits)
- HTTP 200 spot-checks against cached responses

It's **only** visible in:
- The `x-vercel-error` response header on actual end-user requests
- The Vercel dashboard

Anyone trusting the "deploy proof" rhythm (commit → push → vercel ls Ready → claim done) without actually requesting the site as a real user will miss this class of failure entirely.

## What's now in place

### `scripts/check-prod-health.ts` + `npm run health:prod`

End-user-perspective verification:
- Curls 8 canary routes with a real browser User-Agent
- Parses `x-vercel-error` header explicitly (catches `DEPLOYMENT_DISABLED`, `DEPLOYMENT_PAUSED`, `DEPLOYMENT_NOT_FOUND`)
- 0.3s delay between requests to avoid bot-protection rate-limiting
- Exit codes communicate severity: `0` = healthy, `1` = route failure, `2` = project-level dark
- Output includes the Vercel dashboard URL when project-level failure is detected
- Recognizes 3xx redirects as healthy

Tested against today's broken prod state — correctly exited 2 with clear remediation message.

### `.cursorrules` ship section updated

Step 4 now explicitly says:
> **Deploy proof — END-USER PERSPECTIVE, not Vercel status alone.** `vercel ls` showing `Ready` only proves the build succeeded; it does NOT prove the site is serving real traffic. Always run `npm run health:prod` after push.

The old guidance — "confirm in Vercel dashboard that the SHA matches" — was satisfied by today's broken state (the SHA matched, but serving was disabled). The new guidance closes that loophole.

## Patterns to repeat

### 1. "Deploy verified" must mean a real user request, not a build status

Build success is necessary but not sufficient for serving. The proof of deployment is an HTTP request from outside the Vercel build pipeline returning the expected response. Anything less is hopeful inference.

**Pattern:** Define "deploy proof" as: `(a) commit on main, (b) Vercel build Ready, (c) end-user GET returns 2xx with no x-vercel-error header for canary routes`. All three required.

### 2. Parse the response, not just the status code

A 402 with `x-vercel-error: DEPLOYMENT_DISABLED` looks the same as any other 402 if you only capture the status code. Vercel's error headers contain the actionable signal.

**Pattern:** Health checks should `curl -sI` (headers only) and explicitly parse for `x-vercel-error`, `x-vercel-id`, and other platform-specific signals. Don't treat platform health as a derived metric of HTTP status — read the platform's own error channel.

### 3. Cache invalidation is the failure mode that's hardest to catch

The reason early curl checks returned 200 despite the project being disabled: stale CDN cache. That's a property of edge-served sites — until the cached response expires, "the site is still up" from any single observer's perspective. Real-user reality only emerges as caches roll over.

**Pattern:** Health checks should run multiple times across a short window (e.g. 3 checks 30s apart), or include cache-busting headers, or specifically check routes that aren't aggressively cached (sitemap.xml, robots.txt). The new script includes both `/sitemap.xml` and `/robots.txt` in the canary list for this reason.

### 4. Surface the action, not just the failure

When `health:prod` detects `DEPLOYMENT_DISABLED`, it doesn't just say "failed" — it says:
- What it means ("project paused for billing/quota")
- What's safe ("commits in main will auto-deploy once re-enabled")
- Where to go (`https://vercel.com/...` dashboard URL)

A failure message that ends in confusion is worse than no failure message. The user needs to know the next move.

## Anti-patterns to avoid

### A. Trusting `vercel ls` as deploy proof

It lists what Vercel BUILT. It doesn't tell you what Vercel SERVES. Different things.

### B. Spot-checking with `-o /dev/null -w "%{http_code}"`

This captures status only. Misses the actionable error headers. The 402 from today would have looked identical to a generic 402 in those checks.

### C. Assuming "I verified one route, the rest are fine"

Vercel can serve some routes from cache and fail others. A canary across multiple routes (mix of static + dynamic + sitemap) catches uneven failures the single-route check misses.

### D. Claiming "live in prod" without running the canary

Done today, multiple times. The user's "are they all done?" question was the only thing that surfaced the gap. The script makes the question answerable mechanically.

## Corrections (for `corrections.jsonl`)

```jsonl
{"timestamp": "2026-05-07T19:30:00Z", "original": "Treat 'vercel ls Ready' + a couple of curl 200s as 'deploy verified'", "correction": "Deploy proof requires (a) commit on main, (b) Vercel build Ready, AND (c) npm run health:prod returns exit 0 across canary routes with no x-vercel-error headers.", "keywords": ["deploy", "verification", "vercel", "ship"], "project": "lbta-website"}
{"timestamp": "2026-05-07T19:30:00Z", "original": "Health-check by curling and capturing only HTTP status code", "correction": "Always curl -sI to capture headers; explicitly parse x-vercel-error / x-vercel-id. Status code alone hides platform-state failures.", "keywords": ["health-check", "vercel", "headers"], "project": "lbta-website"}
{"timestamp": "2026-05-07T19:30:00Z", "original": "Trust a 200 response means the site is healthy", "correction": "Stale CDN cache can return 200 from a disabled project for hours. Health checks must include cache-bypassing routes (sitemap.xml, robots.txt) and ideally repeat over a short window.", "keywords": ["caching", "health-check", "edge"], "project": "lbta-website"}
```

## Patterns (for `patterns.json`)

- **end-user-perspective-verification** — Production proof must come from an HTTP request originated outside the build pipeline. Status code + error headers + canary routes (static + dynamic + ops endpoints). Codified as `npm run health:prod`.
- **platform-error-header-parsing** — When a platform exposes structured error signals via headers (Vercel's `x-vercel-error`, Cloudflare's `cf-ray`, Fastly's `via`), health checks should parse those explicitly. Don't derive platform health from generic HTTP status.
- **action-oriented-failure-output** — Failure messages should include: what it means, what's safe, what to do next, and where to go. "Failed" is not a failure message.

## Standards (for `quality-bars.json`)

- **Deploy verification:** Three signals required — clean tree on main, Vercel build Ready, `npm run health:prod` exit 0. Any one missing = not deployed.
- **Health checks:** Must parse response headers (not just status), include 6+ canary routes (mix of static + dynamic + ops), and exit with semantically distinct codes (0 healthy, 1 route failure, 2 project-level failure).
- **Failure output:** Every detected failure must include the remediation URL or next-step command. No bare "failed" messages.

## Status of work that's stuck behind this

| Commit | Status |
|---|---|
| `9b70fc4` v1.6 SEO depth | On main, builds green, NOT serving (DEPLOYMENT_DISABLED) |
| `d622f18` v1.5 SEO polish | On main, builds green, NOT serving (DEPLOYMENT_DISABLED) |
| `d1834e0` v1.4 brand post-review | Last actually-serving deploy, alias still pointed here |

Once the user resolves the Vercel-side disable, all three commits will auto-deploy from main and the SEO improvements will go live. No code action required from me until then.
