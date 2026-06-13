# Per-Coach Today Views (Allison · Andrew · Peter) Implementation Plan

**Date:** 2026-05-11
**Author:** Compound Engineering (Plan phase)
**Workflow:** `/compound:plan` + `agent-architecture` v2.0
**Status:** ✏️ AWAITING APPROVAL

## Overview

Add gated per-coach "Today" views at `/coach-hub/{coach}` for **Allison, Andrew, and Peter**, each with their own password, sibling-routed alongside the existing shared `/coach-hub`. Today's content for Allison and Peter ships as the existing on-brand interactive HTMLs (drop-in); Andrew's view ships as a data-driven React component reading from JSON so he can self-populate drills and lesson plans without HTML knowledge — establishing the pattern Allison/Peter migrate to in Phase 2.

## Problem Statement

- `/coach-hub` exists but is a **single shared resource** (LBTA-wide coach reference) gated by one shared password (`lbta-coach-2026`). It has tabs for Programs, Live Ball, Private, Cardio, etc. — useful, but it's not "MY today as Coach X".
- Allison and Peter have ready-made, on-brand HTML "Today" sheets for Mon May 11 (Moulton Meadows / Alta + LBHS) with interactive drill check-offs and a built-in timer. They need to be live behind a private link **today** so coaches can use them on-court.
- Andrew has no HTML for today, but the user wants to populate his drills/lessons/recommendations himself going forward. Forcing him into the HTML pattern locks future content into hand-edited HTML.
- Long-term goal: every coach has their own private, recurring "Today" view they can edit without writing HTML.

## Proposed Solution

A **gated React shell with pluggable content rendering** — three identical sibling routes that differ only in which content backend they use today.

**Architecture:**
- Sibling routes outside the existing `/coach-hub` tabbed shell: `/coach-hub/allison`, `/coach-hub/andrew`, `/coach-hub/peter` (different mental model: "MY view" vs "shared LBTA reference").
- Per-coach login at `/coach-hub/{coach}/login`. Per-coach signed cookie at narrow path scope `Path=/coach-hub/{coach}` so Allison's session does not grant access to Peter's view.
- Single env var `COACH_PASSWORDS_JSON='{"allison":"allison-lbta-2026","andrew":"andrew-lbta-2026","peter":"peter-lbta-2026"}'` — adding a coach later = edit one env var. (Source: user decision Q1.)
- Auth gate in `proxy.ts` extended with new matcher (`/coach-hub/[coach]/:path*`) and per-coach cookie verification — mirrors the existing pattern (Source: project pattern `nextjs16-proxy-coach-hub`).
- HMAC-SHA256 cookie signing using the coach's password as secret. Same `base64url(JSON.stringify({exp})).hex(sig)` format as existing `lbta_coach_hub` cookie. Edge-safe verify via Web Crypto. (Source: existing `lib/coach-hub-auth.ts`.)
- **Content rendering:** A `coaches.json` registry maps each coach slug to a `contentType`:
  - `html` → renders the static HTML inside a sandboxed wrapper component (Allison + Peter today).
  - `data` → renders `CoachDataView` reading `data/coach-hub/coaching-today/{coach}/{date}.json` (Andrew today; Allison + Peter in Phase 2 once their content is extracted to JSON).
- **Andrew's seed content:** Pre-populated JSON with theme/rule/sessions/drills shaped to the visual model used by Allison/Peter HTMLs, so the React component renders an equivalent Today sheet. User can edit JSON directly to update tomorrow's content.

**Why this composes well:**
- Today's deliverable (Allison + Peter live) ships in <2 hours because we're not re-porting their HTML.
- Tomorrow's flexibility (Andrew populates his own drills) is unblocked because the data-driven view exists from day one.
- Phase 2 migration (Allison/Peter to data-driven) is a content extraction job, not an architecture change — same component, same shell, just `contentType: 'data'`.

## Implementation Steps

### Phase 1: Auth foundation
- [ ] **1.1** Add `lib/coach-passwords.ts` — parse `COACH_PASSWORDS_JSON` env var to `{slug → password}` map; export `getCoachPassword(slug)`, `getKnownCoachSlugs()`. Treat missing/invalid env as empty map (returns 503 from auth route).
- [ ] **1.2** Add `lib/per-coach-auth.ts` — Edge-safe `verifyPerCoachCookie(secret, value)` (mirrors existing `verifyCoachHubCookie`); export `perCoachCookieName(slug)`, `getPerCoachCookieMaxAge()`.
- [ ] **1.3** Add `lib/per-coach-auth-server.ts` — Node `signPerCoachCookie(secret)`, `buildPerCoachSetCookie(value, slug, secure)`, `buildPerCoachClearCookie(slug)`. Cookie path = `/coach-hub/{slug}` (narrow scope).
- [ ] **1.4** Add `perCoachAuthSchema` to `lib/validations.ts` (Zod, password field, max 512).
- [ ] **1.5** Add `COACH_PASSWORDS_JSON` to `lib/env.ts` as optional, document in `.env.example`.

### Phase 2: API + login routes
- [ ] **2.1** Create `app/api/coach-hub/[coach]/auth/route.ts` — POST handler. Validate slug is in known list (return 404 if not). Rate-limit by IP+slug. Trim env value + submitted password. Length-equal check then `crypto.timingSafeEqual` (mirrors existing `app/api/coach-hub/auth/route.ts`). Set per-coach cookie on success.
- [ ] **2.2** Create `app/api/coach-hub/[coach]/logout/route.ts` — clear per-coach cookie, redirect to `/coach-hub/{coach}/login`.
- [ ] **2.3** Create `app/coach-hub/[coach]/login/page.tsx` — reuse the visual pattern of existing `/coach-hub/login`, but customize header to "Coach {Name} · Sign in" using `coaches.json`. Keep `safeRedirectTarget` redirect protection but constrain to `/coach-hub/{coach}` only.
- [ ] **2.4** Add `app/coach-hub/[coach]/layout.tsx` (noindex, title "Coach {Name} · LBTA").

### Phase 3: Content registry + data shape
- [ ] **3.1** Create `data/coach-hub/coaches.json` — `{ allison: { name: "Allison Cronk", slug: "allison", location: "Moulton Meadows", contentType: "html", htmlPath: "/coach-hub-content/allison-2026-05-11.html" }, andrew: { name: "Andrew Mateljan", slug: "andrew", contentType: "data", dataPath: "data/coach-hub/coaching-today/andrew/2026-05-11.json" }, peter: { name: "Peter de Frantz", slug: "peter", location: "Alta + LBHS", contentType: "html", htmlPath: "/coach-hub-content/peter-2026-05-11.html" } }`.
- [ ] **3.2** Create `lib/coach-today-types.ts` — TS types: `CoachRegistry`, `CoachEntry`, `CoachTodayData` (date, location, theme, rule, sessions[], drills[]).
- [ ] **3.3** Create `data/coach-hub/coaching-today/andrew/2026-05-11.json` — seed with reasonable starter content shaped to Allison/Peter's visual model. Include sessions for likely time blocks today (or empty starter if Andrew prefers).

### Phase 4: Rendering components
- [ ] **4.1** Create `components/coach-hub-coach/CoachTodayShell.tsx` — outer wrapper: brand header with coach name + signout button + link back to `/coach-hub` shared resource.
- [ ] **4.2** Create `components/coach-hub-coach/CoachHtmlContent.tsx` — renders the coach's static HTML. **Implementation choice:** sandboxed `<iframe src={htmlPath} />` with full-bleed sizing + `sandbox="allow-scripts allow-same-origin"` so the embedded JS (drill check-offs, timer) works without giving the iframe full document privilege. Alternative considered: `dangerouslySetInnerHTML` — rejected because the HTMLs ship full `<html><head>` document including `<link>` to Google Fonts which would conflict with the parent doc's font/CSP.
- [ ] **4.3** Create `components/coach-hub-coach/CoachDataView.tsx` — reads `CoachTodayData`, renders the same visual shell as the static HTMLs (theme card, rule card, sessions with drills, progress, controls). Uses LBTA brand tokens (Pacific Dusk, Cormorant + DM Sans). State for drill check-offs in client component.
- [ ] **4.4** Create `app/coach-hub/[coach]/page.tsx` — server component. Look up coach in registry; redirect to 404 if unknown slug. Branch on `contentType`: render `<CoachTodayShell><CoachHtmlContent /></CoachTodayShell>` or `<CoachTodayShell><CoachDataView data={...} /></CoachTodayShell>`. **Auth check:** middleware (`proxy.ts`) handles redirect; page itself just renders.

### Phase 5: Static HTML assets + proxy gate
- [ ] **5.1** Copy `Coaching_Today_Allison_Mon_May11.html` → `public/coach-hub-content/allison-2026-05-11.html`. Strip the inline `<title>` brand-setting if it conflicts; keep the rest as-is.
- [ ] **5.2** Copy `Coaching_Today_Peter_Mon_May11.html` → `public/coach-hub-content/peter-2026-05-11.html` (same).
- [ ] **5.3** Extend `proxy.ts` matcher: add `'/coach-hub/:coach', '/coach-hub/:coach/:path*'`. Add per-coach gate logic: parse coach slug from pathname, verify per-coach cookie against per-coach password from `getCoachPassword(slug)`. **Allow** `/coach-hub-content/*` to be served publicly for the iframe to load (alternative: gate via signed URL — more complex, deferred).
- [ ] **5.4** Verify the existing `/coach-hub` shared route still works unchanged (no regression on the master `lbta_coach_hub` cookie path).

### Phase 6: Deploy + verify
- [ ] **6.1** Set `COACH_PASSWORDS_JSON` env var on Vercel Production via `printf` + `vercel env add` (Source: `vercel-env-add-stdin-printf` pattern from today's compound learn).
- [ ] **6.2** Set on Vercel Development via same.
- [ ] **6.3** Set on Vercel Preview via REST API direct (Source: `vercel-rest-api-fallback-for-cli-prompt-walls` — CLI 50.28.0 still has the non-interactive bug for preview).
- [ ] **6.4** Surface `.env.local` line to user manually (file is agent-write-protected).
- [ ] **6.5** `vercel --prod` deploy.
- [ ] **6.6** Run the 3-step verification chain (Source: `postDeployAuthEndpointCurlVerification` quality bar): for each of {allison, andrew, peter}: (a) curl auth with wrong pw → 401; (b) curl with correct pw → 200 + Set-Cookie HttpOnly+Secure with `Path=/coach-hub/{slug}`; (c) `npm run health:prod`.

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `lib/coach-passwords.ts` | Create | Parse COACH_PASSWORDS_JSON → slug→password map |
| `lib/per-coach-auth.ts` | Create | Edge-safe cookie verify, cookie name helper |
| `lib/per-coach-auth-server.ts` | Create | Node cookie sign + Set-Cookie/Clear-Cookie builders |
| `lib/coach-today-types.ts` | Create | TypeScript types for content registry + today data |
| `lib/validations.ts` | Modify | Add `perCoachAuthSchema` |
| `lib/env.ts` | Modify | Add `COACH_PASSWORDS_JSON` optional getter |
| `.env.example` | Modify | Document `COACH_PASSWORDS_JSON` |
| `proxy.ts` | Modify | Extend matcher + per-coach auth gate |
| `app/api/coach-hub/[coach]/auth/route.ts` | Create | Per-coach login API |
| `app/api/coach-hub/[coach]/logout/route.ts` | Create | Per-coach logout API |
| `app/coach-hub/[coach]/page.tsx` | Create | Per-coach Today view page |
| `app/coach-hub/[coach]/layout.tsx` | Create | noindex + title |
| `app/coach-hub/[coach]/login/page.tsx` | Create | Per-coach login form |
| `components/coach-hub-coach/CoachTodayShell.tsx` | Create | Outer shell (header + signout) |
| `components/coach-hub-coach/CoachHtmlContent.tsx` | Create | Sandboxed iframe wrapper |
| `components/coach-hub-coach/CoachDataView.tsx` | Create | Data-driven Today view component |
| `data/coach-hub/coaches.json` | Create | Coach registry |
| `data/coach-hub/coaching-today/andrew/2026-05-11.json` | Create | Andrew's seed content |
| `public/coach-hub-content/allison-2026-05-11.html` | Create | Copy of Allison's HTML |
| `public/coach-hub-content/peter-2026-05-11.html` | Create | Copy of Peter's HTML |

```yaml
# files (machine-readable; keep in sync with table)
create:
  - lib/coach-passwords.ts
  - lib/per-coach-auth.ts
  - lib/per-coach-auth-server.ts
  - lib/coach-today-types.ts
  - app/api/coach-hub/[coach]/auth/route.ts
  - app/api/coach-hub/[coach]/logout/route.ts
  - app/coach-hub/[coach]/page.tsx
  - app/coach-hub/[coach]/layout.tsx
  - app/coach-hub/[coach]/login/page.tsx
  - components/coach-hub-coach/CoachTodayShell.tsx
  - components/coach-hub-coach/CoachHtmlContent.tsx
  - components/coach-hub-coach/CoachDataView.tsx
  - data/coach-hub/coaches.json
  - data/coach-hub/coaching-today/andrew/2026-05-11.json
  - public/coach-hub-content/allison-2026-05-11.html
  - public/coach-hub-content/peter-2026-05-11.html
modify:
  - lib/validations.ts
  - lib/env.ts
  - .env.example
  - proxy.ts
```

## Out of scope (this plan)

- **Not** building an admin UI for editing coach JSON content (Andrew edits JSON directly for now; admin UI is a future plan).
- **Not** migrating Allison/Peter HTML content into the data-driven JSON shape today (Phase 2 follow-up plan after they confirm they like the system).
- **Not** adding Robert or Michelle (only Allison/Andrew/Peter per user decision Q6).
- **Not** building a coach-aware "Switch coach" UI inside the existing `/coach-hub` tabbed shell.
- **Not** adding bcrypt hashing of passwords (plain text in env var per user decision Q1 — internal coach tool, not user-facing).
- **Not** rotating the existing master `COACH_HUB_SECRET` (`lbta-coach-2026`) — it stays for the shared resource.
- **Not** signed URLs / per-coach access tokens for the static HTML files (`public/coach-hub-content/*` is publicly readable; the URL itself is the secret. Acceptable for today; tighten in Phase 2 if needed).

## Success Criteria

- [ ] Each coach can navigate to `/coach-hub/{their-name}/login`, enter their password, and see their Today view.
- [ ] Allison sees the Mon May 11 Moulton Meadows HTML rendered, with drill check-offs and timer interactive.
- [ ] Peter sees the Mon May 11 Alta + LBHS HTML rendered, same interactivity.
- [ ] Andrew sees a data-driven Today view rendered from `data/coach-hub/coaching-today/andrew/2026-05-11.json` with the same visual feel as Allison/Peter.
- [ ] Allison's cookie does NOT grant access to Peter's or Andrew's view (and vice versa).
- [ ] The existing shared `/coach-hub` (gated by `COACH_HUB_SECRET=lbta-coach-2026`) still works unchanged.
- [ ] Production deploy verified live with 3-coach × 3-test verification grid (9 curl assertions + `npm run health:prod` exit 0).

## Acceptance checklist

| Criterion | Verification |
|---|---|
| Allison login works | `curl -X POST https://lagunabeachtennisacademy.com/api/coach-hub/allison/auth -d '{"password":"allison-lbta-2026"}'` → 200 + Set-Cookie `lbta_coach_allison=...; Path=/coach-hub/allison; HttpOnly; Secure` |
| Allison wrong password rejected | Same curl with `"wrong"` → 401 |
| Allison sees her HTML | After cookie, `curl https://.../coach-hub/allison` → 200, response HTML contains "Moulton Meadows" |
| Peter login works | curl `/api/coach-hub/peter/auth` with `peter-lbta-2026` → 200 |
| Peter sees his HTML | After cookie, `/coach-hub/peter` → contains "Alta + LBHS" |
| Andrew login works | curl `/api/coach-hub/andrew/auth` with `andrew-lbta-2026` → 200 |
| Andrew sees data-driven view | After cookie, `/coach-hub/andrew` → contains React-rendered theme/rule/sessions from JSON |
| Allison cookie ≠ Peter access | Send Allison's cookie to `/coach-hub/peter` → redirected to `/coach-hub/peter/login` |
| Existing /coach-hub still gated | curl `https://.../coach-hub` without cookie → 307 to `/coach-hub/login` |
| Existing /coach-hub still works | Login with `lbta-coach-2026` on master, see CoachHubClient → still 200 |
| `npm run health:prod` | Exit 0, all 8 canary routes 🟢 |

## Research Sources

- **Codebase researcher:** `proxy.ts`, `lib/coach-hub-auth.ts`, `lib/coach-hub-auth-server.ts`, `app/api/coach-hub/auth/route.ts`, `app/coach-hub/login/page.tsx`, `lib/validations.ts` — established the cookie format, signing pattern, validation schema, and auth flow we mirror.
- **Source HTML files:** `Coaching_Today_Allison_Mon_May11.html` (464 lines), `Coaching_Today_Peter_Mon_May11.html` (364 lines) — confirmed they are self-contained interactive documents with embedded CSS/JS using LBTA brand tokens. Iframe is the right rendering choice (full doc, not a fragment).
- **Memory researcher (just-captured):** Today's `/compound:learn` deposited `vercel-cli-preview-add-without-rest-fallback`, `trusting-vercel-env-ls-over-live-endpoint`, `echo-piped-to-vercel-env-add` (anti-patterns) and `vercel-rest-api-fallback-for-cli-prompt-walls`, `post-deploy-auth-endpoint-verification`, `vercel-env-add-stdin-printf` (patterns) — directly applicable to Phase 6 deploy steps.
- **Historical reference:** `plans/coach-hub-private-page-implementation-plan.md` — the original `/coach-hub` auth implementation; this plan extends, doesn't replace.

## Relevant Learnings (from compound memory)

| Learning | How it applies |
|---|---|
| `nextjs16-proxy-coach-hub` (pattern) | Use the same `proxy.ts` extension shape: matcher + cookie verify; same Edge-safe Web Crypto path |
| `auth-contract-verification-script` (pattern) | The 3-step verification chain (Phase 6.6) follows this — wrong pw, correct pw, health |
| `post-deploy-auth-endpoint-verification` (pattern, captured today) | Mandatory before claiming live — extended to all 3 coaches |
| `vercel-rest-api-fallback-for-cli-prompt-walls` (pattern, captured today) | Phase 6.3 uses REST API directly for Preview env add — saves the 10 min CLI loop |
| `vercel-env-add-stdin-printf` (pattern, captured today) | Phase 6.1, 6.2 use `printf` not `echo` to avoid newline corruption |
| `env-local-agent-blocked` (correction, captured today) | Phase 6.4 surfaces `.env.local` line to user — do not attempt agent write |
| `protected-auth-api-without-runtime-verification` (anti-pattern) | Phase 6.6 explicit verification per coach prevents this |
| `modal-focus-trap-tab-wrap` (pattern) | If `CoachDataView` adds modals/drawers, apply Tab-wrap. Likely deferred. |
| `auth route trims env reads` (existing defense) | Per-coach auth route mirrors this — `secret.trim()` before compare |

## Confidence & uncertainty

**Plan confidence:** 🟢 High. Pattern is a direct extension of the existing well-tested `/coach-hub` auth flow; risks are bounded.

**Uncertainty (to double-check in Work/Review):**
- 🟡 Whether the iframe sandboxed approach for Allison/Peter HTML preserves the inline JS interactivity (drill check-offs, timer) — verify in dev with browser MCP before claiming Phase 4 done. Fallback: render via route handler that returns the HTML directly (no iframe), accept Google Fonts double-load.
- 🟡 Whether Andrew's seed JSON content should be empty starter or pre-populated based on his philosophy/style. Defaulting to a thoughtful empty-with-structure (theme/rule labels but blank content) so he reacts to a clean slate rather than my guesses.
- 🟢 The `coaches.json` registry: confident this is the right abstraction.

## Risks & Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| `proxy.ts` matcher conflict between `/coach-hub` and `/coach-hub/[coach]` | High | Order matters in matcher array; add `/coach-hub/:coach/:path*` BEFORE `/coach-hub/:path*` to ensure per-coach routes are caught first. Add an explicit unit test or smoke test that hits each before deploying. |
| Vercel Preview env add still blocked by CLI bug | High | Already mitigated via `vercel-rest-api-fallback-for-cli-prompt-walls` pattern. Phase 6.3 uses REST API direct. |
| User sets `.env.local` value with surrounding quotes (common mistake) | Medium | Auth route already trims; document explicitly in the `.env.example` comment "no surrounding quotes, no trailing newline". |
| Iframe loses font/style continuity from parent shell | Low | Acceptable today (the HTMLs are fully self-styled). Phase 2 migration to data-driven view eliminates the iframe entirely. |
| Static HTML at `/coach-hub-content/allison-2026-05-11.html` is publicly accessible (URL = secret) | Medium | Documented in Out of scope. Acceptable today for an internal coach tool. Phase 2 mitigation: serve via authenticated route handler (`app/coach-hub/[coach]/content/route.ts`) that streams the file only if cookie verifies. |
| Adding new coach later requires editing JSON env var | Low | Documented procedure in `.env.example`. Single env var = single rotation point. |
| `dangerouslySetInnerHTML` instead of iframe — XSS surface | N/A | Not using this approach (rejected in Phase 4.2). Iframe with `sandbox` attribute keeps the embedded HTML's JS isolated from the parent app. |

**Gate:** If any Phase 6 verification step fails (curl 401/200 mismatch OR `health:prod` exit ≠ 0), STOP, surface the failure, do not claim live. Use the `trusting-vercel-env-ls-over-live-endpoint` anti-pattern as the explicit reason.

## Estimated effort

| Phase | Effort | Notes |
|---|---|---|
| 1. Auth foundation | 25 min | Mirror existing pattern |
| 2. API + login routes | 25 min | Mirror existing pattern + dynamic [coach] segment |
| 3. Content registry + types | 15 min | New JSON + types |
| 4. Rendering components | 40 min | New shell + iframe wrapper + data view (data view is most novel) |
| 5. Static HTML + proxy gate | 15 min | Copy + matcher extension |
| 6. Deploy + verify | 15 min | Already-known patterns from today's compound learn |
| **Total** | **~2h 15min** | |

## Open questions for user (resolved)

| Q | Decision |
|---|---|
| Scope horizon | Today-only content + recurring shell |
| Auth model | Single env var COACH_PASSWORDS_JSON |
| Default passwords | allison-lbta-2026, andrew-lbta-2026, peter-lbta-2026 |
| URL structure | `/coach-hub/{coach}` sibling routes |
| Rendering | Hybrid: HTML for Allison/Peter, data-driven for Andrew |
| IA placement | Sibling to existing `/coach-hub`, not nested |
| Coaches in scope | Allison, Andrew, Peter |
| Andrew's content | Recommendation: minimal data-driven view with thoughtful empty starter |
