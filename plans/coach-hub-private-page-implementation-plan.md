# LBTA Coach Hub — Private Page Implementation Plan

## Overview

Add a **private, coach-only** Coach Hub to the LBTA Next.js site so the existing plan-generator experience (from `LBTA_Coach_Hub.html`) is fully functional at a protected URL, accessible only to authenticated coaches, with no public indexation. **Full path:** Phase 1 (auth) + Phases 2–6 (React Hub); Phase 0 (static HTML) is skipped. See **Full Path Execution Plan with Agent Tracks** for runnable A→B→C→(D∥E)→F.

---

## Is This the Best We Can Do?

**Short answer:** It depends on the goal. The plan below supports two strategies; pick one or do both in order.

| Goal | Best approach | Effort | Risk |
|------|----------------|--------|------|
| **Ship fast, zero behavior change** | **Fast path:** Same auth (Phase 1) + serve the existing HTML as a static asset or via a route that streams the file. Coaches get the exact current Hub behind login in hours. | Low (Phase 1 + one route/file) | Minimal — no port, no regressions. |
| **Long-term: one codebase, design system, maintainability** | **Full path:** Auth (Phase 1) + migrate Hub to React (Phases 2–6). Same UX, data in `data/coach-hub/`, brand tokens, one app. | High (all phases) | Migration/parity risk; mitigate with incremental tabs and smoke tests. |

**Recommendation:**

1. **Do the fast path first.** Implement Phase 1 (auth + middleware + login + ConditionalLayout). Serve the existing `LBTA_Coach_Hub.html` at `/coach-hub` (e.g. copy to `public/coach-hub/index.html` and serve it via a route that reads the file and returns HTML, or use a rewrite so `/coach-hub` serves that file; middleware already protects the path). Coaches get a private, fully functional Hub immediately with no porting risk.
2. **Then decide:** If the static HTML is enough long-term, stop there. If you want the Hub inside the app (design system, single codebase, easier updates), do Phases 2–6 as a **second step** and optionally replace the static serve with the React Hub.

**Auth upgrade path (optional):** The plan uses one shared password (simplest). If you later want per-coach identity or “Sign in with Google” for coaches only, add an allowlist (e.g. coach emails) and use NextAuth or magic-link; the same cookie/middleware pattern can stay, with the session carrying an identity instead of “authenticated.”

## Problem Statement

- The current Coach Hub is a standalone HTML file (~1.4MB) with embedded CSS, JS, and curriculum/session data. Coaches use it for session planning, Week Binder, drill swaps, and handbook.
- Requirements: (1) **Only coaches** can access it; (2) it must be **fully functional** (same behavior as the HTML); (3) it must work **everywhere** (any device/network, not IP-locked).
- The LBTA site today has no authentication or middleware; all routes are public. We need a minimal, maintainable auth story and a clear path to migrate the Hub into the app without regressions.

## Proposed Solution

### 1. Authentication

- **Mechanism:** Single shared secret (password) stored in env as `COACH_HUB_SECRET`.
- **Flow:** Coaches open `/coach-hub` → middleware redirects unauthenticated users to `/coach-hub/login` → login form submits password to `POST /api/coach-hub/auth` → API validates against `COACH_HUB_SECRET` (timing-safe compare), sets an **httpOnly, secure, same-site cookie** (e.g. `lbta_coach_session` with a signed token or opaque session id) → redirect to `/coach-hub` → middleware allows access when cookie is valid.
- **Logout:** `POST /api/coach-hub/logout` (or GET with query) clears the cookie and redirects to `/coach-hub/login`.
- **Why this:** No OAuth or user DB required; one env var; works on any network; cookie-based so “works everywhere” without magic links or IP allowlists. Aligns with project preference for minimal dependencies (see COMPOUND_LEARN: timing-safe secret comparison, no PII in logs).

### 2. Route and Layout Structure

- **Routes:**
  - `app/coach-hub/login/page.tsx` — Login form (public).
  - `app/coach-hub/page.tsx` — Main Hub (protected); redirects to login if not authenticated (defense in depth; middleware is primary).
  - Optional: `app/coach-hub/layout.tsx` for metadata (noindex, nofollow) and minimal layout.
- **Middleware:** New `middleware.ts` at project root. Matcher: `/coach-hub` and `/coach-hub/(?!login)`. If request has no valid coach session cookie → redirect to `/coach-hub/login?next=/coach-hub`. Allow `/coach-hub/login` and static assets.
- **Layout:** Coach Hub pages should **not** render the main site header/footer (like beginner-program and junior-trial). Add `coach-hub` to `ConditionalLayout` so `/coach-hub` and `/coach-hub/login` render only the page content (and any minimal hub header/footer you add).

### 3. Migrating the Coach Hub Experience

- **Strategy:** Treat the HTML as the source of truth for behavior; reimplement in React/Next.js so it remains fully functional.
- **Data:** The HTML uses a global `D` (programs, plans, drills, block_pools, stage_levels, curriculum, assessment_calendar, cardio, etc.) and `SEASONS`, `COACH_SCHEDS`. Extract these into **JSON files under `data/coach-hub/`** (e.g. `programs.json`, `plans.json`, `drills.json`, `curriculum.json`, `seasons.json`, `coach-schedules.json`) and load them in the Hub (client-side fetch or server load + pass as props). Single source of truth; no hardcoding in components (per COMPOUND_LEARN).
- **UI:** Implement as a **client-only** app under `app/coach-hub/page.tsx` (e.g. `'use client'` with a single `CoachHubClient` or split into sections). Recreate:
  - **Header:** Coach selector, season selector, “Week Binder”, “Guide”, “Print”.
  - **Tabs:** Programs | Private Lessons | LiveBall | Cardio | Camps & Leagues | LBHS Team | Coach Handbook.
  - **Programs tab:** Today/Progress strip, program grid, session builder (players, week, equipment, day buttons, station rotation, assessment mode), session plan (blocks with expand/collapse, swap drill), drill detail (setup, steps, cues, errors, scale, level groups), home practice copy, post-session form.
  - **Other tabs:** Same content as in HTML (LiveBall, Cardio, Camps & Leagues, LBHS Team, Handbook).
  - **Overlays:** Week Binder overlay, Guide overlay (from `showGuide()` content).
- **Styling:** Port the Hub’s CSS into Tailwind (and/or a dedicated CSS module for the Hub) using **brand tokens** where applicable (e.g. `brand-pacific-dusk`, `brand-sandstone`, `brand-sunset-cliff`). Avoid raw hex; keep the existing Hub visual hierarchy and readability (COMPOUND_LEARN: brand tokens only).
- **Behavior parity:** Preserve init(), autoDetectSeason(), renderToday(), renderPrograms(), renderBuilder(), renderSession(), renderDrillDetail(), swap drill, copy home practice, post-session copy, generateBinder(), showGuide(), print behavior, and smooth scroll (with `prefers-reduced-motion` gating per .cursorrules).

### 4. Security and Standards

- **API route:** `app/api/coach-hub/auth/route.ts`: Accept POST body (e.g. `{ password: string }`). Validate with Zod. Compare password to `COACH_HUB_SECRET` using `crypto.timingSafeEqual` (same-length buffers). On success: set httpOnly cookie, return `{ success: true }` and redirect or 200. On failure: 401, no cookie. Rate limit: e.g. `rateLimit('coach-hub-auth:'+ip, { max: 10, windowMs: 60_000 })`. No PII in logs (COMPOUND_LEARN).
- **Logout route:** `app/api/coach-hub/logout/route.ts`: Clear cookie, redirect to `/coach-hub/login`.
- **Middleware:** Read cookie; verify signature (e.g. HMAC-SHA256 of a payload using `COACH_HUB_SECRET`; or a short-lived JWT signed with the same secret). Redirect unauthenticated to `/coach-hub/login?next=...`. Use same secret for signing as in auth route so middleware can verify without a DB.
- **Env:** Add `COACH_HUB_SECRET` to `lib/env.ts` as optional for dev (allow bypass or empty in dev if desired); required in production for `/coach-hub` to work. Document in `.env.example`.

### 5. SEO and Discovery

- **Metadata:** In `app/coach-hub/layout.tsx` (or page metadata): `robots: { index: false, follow: false }`, and a minimal title e.g. “Coach Hub | LBTA”. No sitemap entry for `/coach-hub` or `/coach-hub/login`.

---

## Implementation Steps

### Phase 0: Fast path (optional — ship Hub in hours)

- [ ] **0.1** Complete Phase 1 (auth, middleware, login, ConditionalLayout) so `/coach-hub` and `/coach-hub/login` exist and are protected.
- [ ] **0.2** Copy `LBTA_Coach_Hub.html` into the repo (e.g. `public/coach-hub/index.html`).
- [ ] **0.3** Serve the HTML via a Route Handler: create `app/coach-hub/app/route.ts` (GET) that reads the file from `public/coach-hub/index.html` (or `process.cwd() + '/public/coach-hub/index.html'`) and returns `new Response(html, { headers: { 'Content-Type': 'text/html' } })`. Create `app/coach-hub/page.tsx` that simply redirects to `/coach-hub/app` (so the first load lands on the Route Handler and gets the full HTML document; scripts in the HTML run as in the original). Middleware protects both `/coach-hub` and `/coach-hub/app`.
- [ ] **0.4** Ensure the static Hub works when served from the same origin (relative paths, no mixed content). Add noindex in layout for `/coach-hub`.
- [ ] **0.5** Smoke test: login → see full Hub → Programs, Binder, Print work. No React migration yet; this is “best we can do” for *fastest* delivery.

### Phase 1: Auth and Protection

- [ ] **1.1** Add `COACH_HUB_SECRET` to `lib/env.ts` (optional in dev; document in `.env.example`).
- [ ] **1.2** Implement `app/api/coach-hub/auth/route.ts`: Zod schema for `{ password }`, rate limit `coach-hub-auth:ip`, timing-safe compare with `COACH_HUB_SECRET`, set signed httpOnly cookie on success, return 401 on failure. Use `NextRequest`/`NextResponse` (COMPOUND_LEARN).
- [ ] **1.3** Implement `app/api/coach-hub/logout/route.ts`: Clear cookie, redirect to `/coach-hub/login`.
- [ ] **1.4** Implement `middleware.ts`: Matcher for `/coach-hub`, `/coach-hub/(?!login)`. Verify cookie; if invalid, redirect to `/coach-hub/login?next=...`. Allow `/coach-hub/login` and asset routes.
- [ ] **1.5** Implement `app/coach-hub/login/page.tsx`: Simple form (password field, submit to `/api/coach-hub/auth`), client-side; on success redirect to `next` or `/coach-hub`. Use brand tokens; min-h-[48px] for submit button; no main site header/footer (ConditionalLayout).
- [ ] **1.6** Add `coach-hub` path check in `ConditionalLayout` so `/coach-hub` and `/coach-hub/login` render without main Header/Footer/SeasonBanner/ChatWidget.

### Phase 2: Data Extraction and Structure

- [ ] **2.1** From `LBTA_Coach_Hub.html`, extract global `D` (and any other data) into JSON files under `data/coach-hub/`: e.g. `programs.json`, `plans.json`, `drills.json`, `curriculum.json`, `stage-levels.json`, `assessment-calendar.json`, `cardio.json`, `camps-leagues.json`, `handbook.json` (or one `hub-data.json` if preferred). Extract `SEASONS` and coach schedules into `seasons.json`, `coach-schedules.json`.
- [ ] **2.2** Add TypeScript types for the hub data (e.g. in `lib/coach-hub-types.ts` or next to data) so components stay type-safe.

### Phase 3: Hub Page and Shell

- [ ] **3.1** Create `app/coach-hub/layout.tsx`: metadata (noindex, nofollow, title “Coach Hub | LBTA”), minimal wrapper; no main site nav.
- [ ] **3.2** Create `app/coach-hub/page.tsx`: Server component that loads hub data (or passes paths); renders a single client component e.g. `<CoachHubClient initialData={...} />` or client fetches data from a dedicated API route or static JSON. Ensure unauthenticated users are redirected (middleware handles this; page can double-check if desired).
- [ ] **3.3** Build `CoachHubClient` (or `components/coach-hub/CoachHubClient.tsx`): state for selected program, day, week, config (players, equipment, player levels), tab; load or receive data; render header (coach/season selectors, Week Binder, Guide, Print), tabs, and tab panels. Wire “Print” to `window.print()`; gate smooth scroll with `prefers-reduced-motion` (COMPOUND_LEARN).

### Phase 4: Programs Tab and Session Builder

- [ ] **4.1** Today + Progress: render today’s sessions and progress bar (replicate `renderToday()`, `getAssessMode()`, `getWk()`).
- [ ] **4.2** Program grid: list programs from data; on select set SP, re-render builder (replicate `renderPrograms()`).
- [ ] **4.3** Session builder: config panel (players slider, player-level slots, week selector, equipment chips, day buttons, station rotation, assessment bar). Replicate `renderBuilder()` and state updates (setPlayerLv, toggleEq, etc.).
- [ ] **4.4** Session plan: blocks with time, name, type, expand/collapse; drill detail (setup, steps, cues, errors, scale, level groups); swap drill dropdown; home practice copy button; post-session form and copy. Replicate `renderSession()`, `renderDrillDetail()`, `swapDr()`, `copyHP()`, post-session copy (COMPOUND_LEARN: smooth scroll and reduced-motion).
- [ ] **4.5** Court SVG and drill detail layout: port `courtSVG()` and the enhanced drill panels (dd-v7, steps, cues, errors, scale) into React components.

### Phase 5: Other Tabs and Overlays

- [ ] **5.1** Private Lessons tab: port `renderPriv()`.
- [ ] **5.2** LiveBall tab: port `renderLB()`.
- [ ] **5.3** Cardio tab: port `renderCD()`.
- [ ] **5.4** Camps & Leagues tab: port `renderCM()`.
- [ ] **5.5** LBHS Team tab: port HS roster, lineup, practice plan (from HTML).
- [ ] **5.6** Coach Handbook tab: port `renderHB()`.
- [ ] **5.7** Week Binder overlay: port `generateBinder()`; open/close overlay.
- [ ] **5.8** Guide overlay: port `showGuide()` content; open/close.

### Phase 6: Polish and Validation

- [ ] **6.1** Ensure all interactive elements have min-h-[48px] or equivalent where appropriate; focus states and aria-labels (accessibility).
- [ ] **6.2** Add `robots` noindex in coach-hub layout and exclude `/coach-hub` from `app/sitemap.ts` if sitemap includes all routes.
- [ ] **6.3** Smoke test: login → Programs tab → select program → change players/week/days → expand blocks, swap drill, copy home practice, open Week Binder, open Guide, print. Repeat for other tabs.
- [ ] **6.4** Run lint and typecheck; fix any issues. Run compound:review and compound:validate when ready (per COMPOUND_LEARN).

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/env.ts` | Modify | Add `COACH_HUB_SECRET` (optional in dev). |
| `.env.example` | Modify | Document `COACH_HUB_SECRET`. |
| `middleware.ts` | Create | Protect `/coach-hub`, allow `/coach-hub/login`; verify cookie. |
| `app/api/coach-hub/auth/route.ts` | Create | POST login; rate limit; timing-safe compare; set cookie. |
| `app/api/coach-hub/logout/route.ts` | Create | Clear cookie; redirect to login. |
| `app/coach-hub/login/page.tsx` | Create | Login form (client). |
| `app/coach-hub/layout.tsx` | Create | noindex, nofollow, title. |
| `app/coach-hub/page.tsx` | Create | Hub shell: redirect to `/coach-hub/app` (fast path) or load data and render CoachHubClient (full path). |
| `app/coach-hub/app/route.ts` | Create (fast path) | GET handler that reads `public/coach-hub/index.html` and returns it as `text/html`. |
| `public/coach-hub/index.html` | Create (fast path) | Copy of `LBTA_Coach_Hub.html` so the Hub is served as static HTML. |
| `components/layout/ConditionalLayout.tsx` | Modify | Exclude `coach-hub` path from main header/footer. |
| `data/coach-hub/*.json` | Create | Extracted hub data (programs, plans, drills, curriculum, etc.). |
| `lib/coach-hub-types.ts` | Create | Types for hub data. |
| `components/coach-hub/CoachHubClient.tsx` | Create | Main client Hub (tabs, header, state). |
| `components/coach-hub/` (sections) | Create | ProgramGrid, SessionBuilder, SessionPlan, DrillDetail, BinderOverlay, GuideOverlay, etc. |
| `app/sitemap.ts` | Modify | Exclude `/coach-hub` and `/coach-hub/login` if needed. |

---

## Success Criteria

- [ ] Only users who know `COACH_HUB_SECRET` can access `/coach-hub`; unauthenticated requests redirect to `/coach-hub/login`.
- [ ] **Fast path:** Authenticated users see the existing Hub (full HTML) at `/coach-hub` with no React migration; all tabs, Binder, Print work.
- [ ] Login and logout work; cookie is httpOnly, secure, same-site; no PII in logs; rate limiting and timing-safe comparison in place.
- [ ] Coach Hub behavior matches the original HTML: program selection, session builder (players, week, equipment, days), session plan with expand/collapse and drill swap, drill detail, home practice copy, post-session copy, Week Binder, Guide, Print; all tabs (Programs, Private, LiveBall, Cardio, Camps & Leagues, LBHS, Handbook) render and behave correctly.
- [ ] Hub uses brand tokens (no raw hex); smooth scroll gated by prefers-reduced-motion; accessibility (focus, touch targets, aria) per .cursorrules.
- [ ] `/coach-hub` and `/coach-hub/login` are not in sitemap and are noindex.
- [ ] Build passes; lint and TypeScript pass; no duplicate pricing/hardcoded data (hub data lives in `data/coach-hub/`).

---

## Research Sources

- Existing LBTA app: `ConditionalLayout`, `app/layout.tsx`, `lib/env.ts`, `lib/rate-limit.ts`, `lib/validations.ts`, API route patterns (e.g. `app/api/book/route.ts`, `app/api/activecampaign-webhook/route.ts`).
- Source: `Downloads/LBTA_Coach_Hub.html` (structure, global `D`, `SEASONS`, `COACH_SCHEDS`, functions `init`, `renderPrograms`, `renderBuilder`, `renderSession`, `generateBinder`, `showGuide`, etc.).
- `plans/COMPOUND_LEARN.md`: corrections (timing-safe secret, rate limit keys, no PII in logs, NextRequest, Zod, brand tokens, reduced-motion, 48px touch targets), patterns (API contract, single source of truth for data), standards (no hardcoded prices, env documentation).

---

## Relevant Learnings

- **Timing-safe secret comparison:** Use `crypto.timingSafeEqual` with same-length buffers for password/secret (COMPOUND_LEARN, webhook pattern).
- **Rate limit key:** Use unique prefix e.g. `coach-hub-auth:${ip}` (COMPOUND_LEARN).
- **API routes:** NextRequest, Zod, consistent `{ success, message?, error? }`; no PII in logs.
- **Data:** Single source in `data/`; no hardcoded curriculum/pricing in components.
- **Brand tokens only:** No raw hex; use Tailwind brand tokens.
- **Reduced motion:** Gate smooth scroll and any scrollIntoView with `prefers-reduced-motion`.
- **ConditionalLayout:** Add coach-hub to paths that render without main site chrome.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large HTML/data extraction error | Extract in steps; validate JSON against original behavior with a small script or manual spot checks. |
| Cookie/session forgery | Use cryptographically signed cookie (e.g. HMAC with COACH_HUB_SECRET); verify in middleware. |
| Hub bundle size large | Code-split by tab or lazy-load overlays; ensure data is not in main bundle if large. |
| Regression in session logic | Keep parity with HTML function-by-function during port; smoke test each tab and builder flow. |

---

## One Vercel Project vs Separate

**Use a single Vercel project** (the existing LBTA site). Do not create a separate Vercel project for the Coach Hub.

| Same project (recommended) | Separate project |
|----------------------------|-------------------|
| One deploy, one domain, one `COACH_HUB_SECRET` | Two deploys, two env configs, cross-domain cookie complexity |
| Cookie is same-site; auth “just works” | Would need shared cookie domain or separate login on second domain |
| One codebase to maintain | Two codebases or monorepo + two apps |

Use a separate Vercel project only if the Hub will be a different stack, a different team/repo, or a different domain you need to scale or bill separately. For “a page on the LBTA website,” one project is simpler.

---

## Next Steps (Concrete)

### Option A — Fast path first (recommended)

1. **Implement Phase 1** (auth and protection): `COACH_HUB_SECRET` in `lib/env.ts` and `.env.example`; `app/api/coach-hub/auth/route.ts` (Zod, rate limit, timing-safe compare, set cookie); `app/api/coach-hub/logout/route.ts`; `middleware.ts` for `/coach-hub` and `/coach-hub/app`; `app/coach-hub/login/page.tsx`; ConditionalLayout excludes `coach-hub`.
2. **Implement Phase 0** (serve existing Hub): copy `LBTA_Coach_Hub.html` → `public/coach-hub/index.html`; `app/coach-hub/app/route.ts` (GET → read file, return `text/html`); `app/coach-hub/page.tsx` → `redirect('/coach-hub/app')`; `app/coach-hub/layout.tsx` (noindex, title).
3. **Config and deploy:** Add `COACH_HUB_SECRET` in the **same** Vercel project’s env vars. Deploy the LBTA project (no new project). Smoke test: `/coach-hub/login` → enter password → `/coach-hub` shows the Hub.
4. **Optional later:** If you want the Hub rebuilt in React, run Phases 2–6 in the same repo and replace the Phase 0 Route Handler/page with the React Hub.

### Option B — Full React migration from the start

1. Phase 1 (auth) as above.
2. Phases 2–6: extract data, build React Hub, all tabs, overlays (no Phase 0).
3. More time and testing; one codebase and design system from day one.

---

## Execution Strategy: One Agent vs Multiple Agents

### Fast path (Phase 1 + Phase 0)

**Use a single agent.**

- Steps are **sequential** and touch the same surface: middleware, env, auth API, logout API, login page, ConditionalLayout, then route handler, static HTML, redirect. Parallel work would create merge conflicts (e.g. two agents editing `lib/env.ts` or creating files under `app/coach-hub/`).
- Total work is small (on the order of an hour). One agent can do Phase 1 then Phase 0 in one run; no need to split.

### Full path (Phases 2–6)

**Use a single agent by default.**

- Data extraction (Phase 2), shell and client (Phase 3), and tabs (Phases 4–5) share the same types, same `CoachHubClient`, and same data shape. Parallel agents would need very tight coordination and would risk conflicts in `components/coach-hub/` and in the single page/shell that composes everything.
- **If you want to try parallel:** Run **Phase 2 + Phase 3 with one agent first** (data + types + layout + page shell + `CoachHubClient` skeleton with tab routing). Then you can split:
  - **Agent A:** Phase 4 (Programs tab: Today, grid, session builder, session plan, drill detail, home practice, post-session). Owns e.g. `components/coach-hub/programs/` and integration into `CoachHubClient` for the Programs tab only.
  - **Agent B:** Phase 5 (other tabs + overlays: Private, LiveBall, Cardio, Camps & Leagues, LBHS, Handbook, Binder, Guide). Owns e.g. `components/coach-hub/tabs/` and overlay components; integrates into `CoachHubClient` for those tabs.
  - **Single agent:** Phase 6 (polish, noindex, sitemap, smoke test, review/validate). Run after A and B have merged to avoid conflicts in `CoachHubClient` and layout.
- **Recommendation:** Start with **one agent** for the full path. Only introduce a second agent for Phase 4 vs Phase 5 if the project is time-critical and you have clear file boundaries and a merged Phase 2+3 baseline.

### Summary

| Scope | Agents | Reason |
|-------|--------|--------|
| Fast path (Phase 1 + Phase 0) | **1** | Sequential, small, same files. |
| Full path (Phases 2–6) | **1** (default) | Shared types and shell; one agent avoids merge and consistency issues. |
| Full path with parallel tabs | 1 for 2+3, then **2** for 4 vs 5, then 1 for 6 | Only if you need speed and can enforce strict file ownership (Programs vs other tabs). |

---

## Full Path Execution Plan (Phase 1 + 2–6, No Phase 0)

**Scope:** Full React Coach Hub. Phase 1 (auth) required; Phase 0 (static HTML) skipped. Phases 2–6 build the React Hub behind the same auth.

**Run order:** **Track A** → **Track B** → **Track C** → **Track D and Track E in parallel** → **Track F**.

---

### Track A — Auth and protection (Phase 1)

**Depends on:** None.  
**Run:** First.  
**Agent:** 1.

| Step | Task |
|------|------|
| A.1 | Add `COACH_HUB_SECRET` to `lib/env.ts` (optional in dev). Document in `.env.example`. |
| A.2 | Create `app/api/coach-hub/auth/route.ts`: POST body Zod `{ password }`, rate limit `coach-hub-auth:${ip}`, timing-safe compare with `COACH_HUB_SECRET`, set signed httpOnly cookie on success, 401 on failure. Use `NextRequest`/`NextResponse`. |
| A.3 | Create `app/api/coach-hub/logout/route.ts`: clear cookie, redirect to `/coach-hub/login`. |
| A.4 | Create `middleware.ts` at project root: matcher `/coach-hub` and `/coach-hub/(?!login)`. Verify cookie (e.g. HMAC with secret); if invalid, redirect to `/coach-hub/login?next=...`. Allow `/coach-hub/login`. |
| A.5 | Create `app/coach-hub/login/page.tsx`: password form, submit to `/api/coach-hub/auth`, on success redirect to `next` or `/coach-hub`. Brand tokens, min-h-[48px] submit, no main site chrome. |
| A.6 | Update `components/layout/ConditionalLayout.tsx`: if pathname starts with `coach-hub`, render `{children}` only (no Header/Footer/SeasonBanner/ChatWidget). |

**Files owned:** `lib/env.ts`, `.env.example`, `middleware.ts`, `app/api/coach-hub/auth/route.ts`, `app/api/coach-hub/logout/route.ts`, `app/coach-hub/login/page.tsx`, `components/layout/ConditionalLayout.tsx`.

**Handoff:** Tracks B and C assume `/coach-hub` and `/coach-hub/login` exist and are protected. No deliverable for other tracks.

---

### Track B — Data extraction and types (Phase 2)

**Depends on:** None (can run in parallel with Track A).  
**Run:** Second (or with A).  
**Agent:** 1.

| Step | Task |
|------|------|
| B.1 | From `LBTA_Coach_Hub.html` (source: user’s copy, e.g. `Downloads/LBTA_Coach_Hub.html` or repo copy), extract global `D` and related data into JSON under `data/coach-hub/`: `programs.json`, `plans.json`, `drills.json`, `curriculum.json`, `stage-levels.json`, `assessment-calendar.json`, `cardio.json`, `camps-leagues.json`, `handbook.json`, `seasons.json`, `coach-schedules.json` (or fewer files if preferred; single source of truth). |
| B.2 | Create `lib/coach-hub-types.ts`: TypeScript interfaces/types for all hub data so components stay type-safe. Export from a single entry (e.g. `HubProgram`, `HubDrill`, `HubPlan`, `Seasons`, `CoachSchedules`, etc.). |

**Files owned:** `data/coach-hub/*.json`, `lib/coach-hub-types.ts`.

**Handoff:** Track C (and D, E) import data and types from `data/coach-hub/` and `lib/coach-hub-types.ts`. No stub data; real extracted content.

---

### Track C — Hub layout, page shell, CoachHubClient skeleton (Phase 3)

**Depends on:** Track B (data and types must exist).  
**Run:** After B.  
**Agent:** 1.

| Step | Task |
|------|------|
| C.1 | Create `app/coach-hub/layout.tsx`: metadata `robots: { index: false, follow: false }`, title "Coach Hub \| LBTA". Minimal wrapper; no main site nav. |
| C.2 | Create `app/coach-hub/page.tsx`: Server Component that reads hub data from `data/coach-hub/` (or a small loader in `lib/`) and passes it as props to `<CoachHubClient initialData={...} />`. No redirect to `/coach-hub/app` (full path only). |
| C.3 | Create `components/coach-hub/CoachHubClient.tsx`: Accept `initialData`; state for `activeTab`, `selectedProgram`, `selectedDay`, `week`, `config` (players, equipment, playerLevels). Render: header (coach selector, season selector, "Week Binder", "Guide", "Print" buttons); tab bar (Programs, Private, LiveBall, Cardio, Camps & Leagues, LBHS Team, Handbook); tab panels that render **stub components** (see C.4). Wire Print to `window.print()`; gate any smooth scroll with `prefers-reduced-motion`. |
| C.4 | Create **stub** components that CoachHubClient imports and renders per tab (and for overlays): `components/coach-hub/programs/ProgramsTab.tsx` (return e.g. `<div>Programs — Track D</div>` or empty), `components/coach-hub/tabs/PrivateTab.tsx`, `LiveBallTab.tsx`, `CardioTab.tsx`, `CampsLeaguesTab.tsx`, `LBHSTab.tsx`, `HandbookTab.tsx`, `BinderOverlay.tsx`, `GuideOverlay.tsx`. Stubs can return null or a short "Coming soon" so D and E have clear insertion points. Create `components/coach-hub/index.ts` barrel exports. |

**Files owned:** `app/coach-hub/layout.tsx`, `app/coach-hub/page.tsx`, `components/coach-hub/CoachHubClient.tsx`, `components/coach-hub/programs/ProgramsTab.tsx`, `components/coach-hub/tabs/PrivateTab.tsx`, `LiveBallTab.tsx`, `CardioTab.tsx`, `CampsLeaguesTab.tsx`, `LBHSTab.tsx`, `HandbookTab.tsx`, `BinderOverlay.tsx`, `GuideOverlay.tsx`, `components/coach-hub/index.ts` (and any shared types/constants used by stubs).

**Handoff:** Track D replaces `ProgramsTab` and its contents. Track E replaces the other tab components and overlay components. CoachHubClient must already import and render these by name so D and E only replace file contents, not CoachHubClient’s structure.

---

### Track D — Programs tab and session builder (Phase 4)

**Depends on:** Track C (CoachHubClient and stub ProgramsTab exist).  
**Run:** After C. Can run in parallel with Track E.  
**Agent:** 1.

| Step | Task |
|------|------|
| D.1 | Implement Today + Progress: replicate `renderToday()`, `getAssessMode()`, `getWk()` from HTML; render today’s sessions and progress bar in Programs tab. |
| D.2 | Implement program grid: list programs from `initialData`; on select update parent state (or context) for selected program; re-render builder. Replicate `renderPrograms()`. |
| D.3 | Implement session builder: config panel (players slider, player-level slots, week selector, equipment chips, day buttons, station rotation, assessment bar). Replicate `renderBuilder()` and state updates (setPlayerLv, toggleEq, etc.). |
| D.4 | Implement session plan: blocks with time, name, type, expand/collapse; drill detail (setup, steps, cues, errors, scale, level groups); swap drill dropdown; home practice copy button; post-session form and copy. Replicate `renderSession()`, `renderDrillDetail()`, `swapDr()`, `copyHP()`, post-session copy. Gate smooth scroll with `prefers-reduced-motion`. |
| D.5 | Port `courtSVG()` and enhanced drill panels (dd-v7, steps, cues, errors, scale) into React components under `components/coach-hub/programs/`. |
| D.6 | Replace stub `ProgramsTab.tsx` with full implementation that composes the above. Do not change CoachHubClient’s tab routing; only replace the content of ProgramsTab and add any subcomponents in `components/coach-hub/programs/`. |

**Files owned:** `components/coach-hub/programs/ProgramsTab.tsx` and all new files under `components/coach-hub/programs/` (e.g. TodayProgress, ProgramGrid, SessionBuilder, SessionPlan, DrillDetail, CourtSvg, etc.).

**Handoff:** Track F will smoke-test Programs tab along with other tabs.

---

### Track E — Other tabs and overlays (Phase 5)

**Depends on:** Track C (CoachHubClient and stub tab/overlay components exist).  
**Run:** After C. Can run in parallel with Track D.  
**Agent:** 1.

| Step | Task |
|------|------|
| E.1 | Implement Private Lessons tab: port `renderPriv()` from HTML into `PrivateTab.tsx`. |
| E.2 | Implement LiveBall tab: port `renderLB()` into `LiveBallTab.tsx`. |
| E.3 | Implement Cardio tab: port `renderCD()` into `CardioTab.tsx`. |
| E.4 | Implement Camps & Leagues tab: port `renderCM()` into `CampsLeaguesTab.tsx`. |
| E.5 | Implement LBHS Team tab: port HS roster, lineup, practice plan into `LBHSTab.tsx`. |
| E.6 | Implement Coach Handbook tab: port `renderHB()` into `HandbookTab.tsx`. |
| E.7 | Implement Week Binder overlay: port `generateBinder()`; open/close overlay in `BinderOverlay.tsx`. |
| E.8 | Implement Guide overlay: port `showGuide()` content; open/close in `GuideOverlay.tsx`. |
| E.9 | Replace all stub tab and overlay components with real implementations. Do not change CoachHubClient’s structure; only replace file contents. |

**Files owned:** `components/coach-hub/tabs/PrivateTab.tsx`, `LiveBallTab.tsx`, `CardioTab.tsx`, `CampsLeaguesTab.tsx`, `LBHSTab.tsx`, `HandbookTab.tsx`, `BinderOverlay.tsx`, `GuideOverlay.tsx`, and any new subcomponents under `components/coach-hub/tabs/` or shared by overlays.

**Handoff:** Track F will smoke-test all tabs and overlays.

---

### Track F — Polish and validation (Phase 6)

**Depends on:** Track D and Track E complete (all tabs and overlays implemented).  
**Run:** Last.  
**Agent:** 1.

| Step | Task |
|------|------|
| F.1 | Accessibility pass: ensure interactive elements have min-h-[48px] where appropriate; focus states and aria-labels. |
| F.2 | Confirm `app/coach-hub/layout.tsx` has `robots: { index: false, follow: false }`. Exclude `/coach-hub` and `/coach-hub/login` from `app/sitemap.ts` if sitemap is dynamic. |
| F.3 | Smoke test: login → Programs tab (select program, change players/week/days, expand blocks, swap drill, copy home practice, post-session copy) → Private, LiveBall, Cardio, Camps & Leagues, LBHS, Handbook → open Week Binder, open Guide → Print. |
| F.4 | Run `npx next build` and fix any type/lint errors. Run `/compound:review` and `/compound:validate` when ready (per COMPOUND_LEARN). |

**Files owned:** Any edits to layout, sitemap, or shared components for a11y/sitemap only. No new feature work.

---

### How to run (full path, multi-agent)

1. **Run Track A** (Phase 1). One agent. Checklist: A.1–A.6. Commit when done.
2. **Run Track B** (Phase 2). One agent. Source HTML: ensure `LBTA_Coach_Hub.html` is available (e.g. copy to repo root or document path). Checklist: B.1–B.2. Commit when done.
3. **Run Track C** (Phase 3). One agent. Requires B. Checklist: C.1–C.4. Commit when done.
4. **Run Track D and Track E in parallel** (Phases 4 and 5). Two agents; each uses the same repo state after C. D owns `components/coach-hub/programs/`; E owns `components/coach-hub/tabs/` and overlay components. Merge D and E (resolve any conflicts in barrel or CoachHubClient if needed). Commit.
5. **Run Track F** (Phase 6). One agent. Requires D and E merged. Checklist: F.1–F.4. Commit; then run compound:review, compound:validate, and optionally compound:deploy.

**Single-agent variant:** Same tracks in the same order; one agent runs A → B → C → D → E → F sequentially (no parallel D/E).

---

## Next Steps After Plan Approval

**Full path (Phase 1 + 2–6, no Phase 0):** Use the **Full Path Execution Plan with Agent Tracks** above.

1. **Run Track A** (auth). Commit.
2. **Run Track B** (data + types). Commit. Ensure `LBTA_Coach_Hub.html` is available for extraction (e.g. copy into repo or set path in B.1).
3. **Run Track C** (layout, page, CoachHubClient + stubs). Commit.
4. **Run Track D and Track E in parallel** (Programs tab vs other tabs + overlays). Merge and commit.
5. **Run Track F** (polish, sitemap, smoke test, review/validate). Commit.
6. Add `COACH_HUB_SECRET` to Vercel env; deploy. Run `/compound:learn` after completion.

**Fast path (Phase 1 + Phase 0 only):** Execute Phase 1 (Track A), then Phase 0 steps from Implementation Steps; add `COACH_HUB_SECRET` to Vercel; deploy and smoke test (single agent).
