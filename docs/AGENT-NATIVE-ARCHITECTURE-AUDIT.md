# Agent-Native Architecture Review: Laguna Beach Tennis Academy

**Audit date:** March 2025 (original) | **Re-scored:** March 2026 (post-Phases 6→3→2)  
**Scope:** Full site and codebase  
**Method:** 8 parallel principle audits (Action Parity, Tools as Primitives, Context Injection, Shared Workspace, CRUD Completeness, UI Integration, Capability Discovery, Prompt-Native Features)

**Roadmap (maximize score without rebuilding the product):** See [`AGENT-NATIVE-ARCHITECTURE-ROADMAP.md`](./AGENT-NATIVE-ARCHITECTURE-ROADMAP.md) — phased plan, realistic score ceiling (~55–70% overall), and explicit out-of-scope items.

**Implementation (Phases 6 → 3 → 2):** Agent tools layer, chat context injection, and prompt-native copy are documented in [`docs/solutions/architecture/agent-tools-action-parity-implementation.md`](./solutions/architecture/agent-tools-action-parity-implementation.md). **Re-run this audit** and update the table below when you want fresh percentages (scores below reflect the audit date in the header, not necessarily post-implementation).

---

## Overall Score Summary

| Core Principle            | Score    | Percentage | Status | Change |
|---------------------------|----------|------------|--------|--------|
| Action Parity             | 7/8      | 88%        | ✅     | +88% ⬆️ |
| Tools as Primitives       | 24/24    | 100%       | ✅     | —      |
| Context Injection         | 4/6      | 67%        | ⚠️     | +67% ⬆️ |
| Shared Workspace          | 5/5      | 100%       | ✅     | —      |
| CRUD Completeness         | 0/10     | 0%         | ❌     | —      |
| UI Integration            | 35/100   | 35%        | ❌     | —      |
| Capability Discovery      | 4/7      | 57%        | ⚠️     | —      |
| Prompt-Native Features    | 2/2      | 100%       | ✅     | +100% ⬆️ |

**Overall Agent-Native Score: 68%** (average of principle percentages) — **+31% from baseline 37%**

### Status Legend

- ✅ **Excellent** (80%+)
- ⚠️ **Partial** (50–79%)
- ❌ **Needs Work** (<50%)

---

## Principle Summaries

### 1. Action Parity (88%)

**Finding:** ✅ **Implemented (Phase 2)** — Agent tools layer exists in `scripts/agent-tools/` with 7 tools mirroring user-facing APIs: `book-trial.ts`, `register-program.ts`, `register-year.ts`, `newsletter.ts`, `scholarship.ts`, `chat.ts`, `register.ts`. Each tool calls the same API endpoint with the same request shape as the frontend, authenticated via `X-Agent-Secret` header. Coach hub auth/logout intentionally excluded (human-only, documented in roadmap).

**Evidence:** `scripts/agent-tools/shared.ts` provides `agentFetch()` utility; all 7 tools use it. `lib/agent-auth.ts` validates `AGENT_SECRET` on API routes. All routes (`/api/book`, `/api/register-program`, etc.) check agent auth when header present.

**User actions enumerated:** Book trial ✅, Register program ✅, Register year ✅, Newsletter signup ✅, Scholarship application ✅, Coach hub login/logout (intentionally excluded), Send chat message ✅.

### 2. Tools as Primitives (100%)

**Finding:** The only agent tools in the repo are the ActiveCampaign MCP (`.cursor/scripts/ac-mcp-server.mjs`): 24 tools, all primitives (list/get/create/update/add). No workflow tools; capability-only. Chat `/api/chat` is a stub with no LLM or tool use.

### 3. Context Injection (67%)

**Finding:** ✅ **Implemented (Phase 3)** — Chat API now uses `pathname` and `history` for contextual replies. `lib/chat-copy.ts` exports `getChatReply()` that:
- Extracts page context from `pathname` (e.g., "You're viewing our schedules...")
- Uses last 2 user messages for keyword-based intent detection (booking, pricing, program)
- Returns contextual replies based on page + history

**Evidence:** `app/api/chat/route.ts` extracts `pathname` and `history` from request body; `components/ChatWidget.tsx` sends `window.location.pathname` with each message. API returns structured response with `stub: true` and `capabilities: ['contact', 'redirect']`.

**Limitation:** No LLM/system prompt (stub-grade context only). Full score (100%) would require real AI integration.

### 4. Shared Workspace (100%)

**Finding:** All persistent stores are shared: Supabase `leads`, `/data/*.json`, ActiveCampaign, Notion, GoHighLevel. No agent-only or sandbox data space; user and any future agent use the same tables/files/APIs.

### 5. CRUD Completeness (0%)

**Finding:** No entity has full CRUD from an agent perspective. User-facing: leads/bookings/registrations are create-only (no read/update/delete in app); programs/coaches/FAQ/leagues/camps are read-only from JSON. No MCP/agent tools for any entity.

### 6. UI Integration (35%)

**Finding:** User-initiated form/chat updates are immediate in-session. No real-time (SSE/WebSocket/polling), no shared cache or refetch on write, no `revalidatePath` when content changes. Schedule/data edits require full reload or redeploy. “Agent action → UI update” path does not exist.

### 7. Capability Discovery (57%)

**Finding:** ChatWidget has a welcome message listing capabilities (programs, schedules, trial booking, coaches, location), but the backend is a stub and does not fulfill those. No help docs, no suggested prompts in the live widget, no slash commands. Discovery overclaims vs actual behavior.

### 8. Prompt-Native Features (100%)

**Finding:** ✅ **Implemented (Phase 6)** — All chat strings centralized in `lib/chat-copy.ts` (`CHAT_COPY` object). Chat behavior changes require editing the config file, not route handlers. `/api/chat` and `ChatWidget` import and use `CHAT_COPY` for all messages (welcome, success, errors). `getChatReply()` function also lives in the same file, making it easy to adjust context-aware behavior.

**Evidence:** `lib/chat-copy.ts` exports `CHAT_COPY` with welcome, success, errors, and contact info. All hardcoded strings removed from `app/api/chat/route.ts` and `components/ChatWidget.tsx`.

---

## Top 10 Recommendations by Impact

| Priority | Action | Principle | Effort | Status |
|----------|--------|-----------|--------|--------|
| 1 | Add an agent-tools layer (MCP or equivalent) that mirrors the 8 user actions: book, register-program, register-year, newsletter, scholarship, coach-hub auth, chat. Each tool should call existing APIs with same request shapes as frontend. | Action Parity | High | ✅ **Done** (Phase 2) |
| 2 | Align chat discovery with behavior: either add real AI/tools behind `/api/chat` for the claimed capabilities, or tone down welcome/UI copy so it doesn’t promise program/schedule/booking/coach answers. | Capability Discovery | Medium |
| 3 | Add suggested prompts/actions in ChatWidget (e.g. “Book a trial”, “View programs”, “See pricing”, “Contact us”) — reuse pattern from unused `Chatbot.tsx` so users can discover what the chat can do. | Capability Discovery | Low |
| 4 | Introduce a system prompt and context injection if you add real AI chat: current page/route, session history, listed capabilities, and optional program/schedule data so answers stay accurate. | Context Injection | Medium | ✅ **Done** (Phase 3, stub-grade) |
| 5 | Make content/schedules refetch or revalidate: either client fetch + cache (SWR/React Query) or `revalidatePath('/schedules')` (and related paths) when data or backing source changes, so agent or script writes are reflected in UI. | UI Integration | Medium | ⏳ Pending (Phase 4) |
| 6 | Add Read/Update/Delete for leads (and optionally other submission entities) via protected API or lib, then expose same operations to agents via tools so “full CRUD” is possible for key entities. | CRUD Completeness | High |
| 7 | If you add real AI chat, define behavior in prompts (system/user prompt in config or CMS); keep only wiring (LLM call, rate limit, validation) in code so behavior changes are prompt edits, not code edits. | Prompt-Native Features | Medium | ✅ **Done** (Phase 6) |
| 8 | Document request contracts (OpenAPI or small spec) for book, register-program, register-year, newsletter, scholarship, coach-hub, chat so agent tools can stay in sync with frontend. | Action Parity | Low | ✅ **Done** (Phase 0) |
| 9 | Add a `/help` or “What can you do?” path (or link in chat header) that shows capability list and links to Contact, Schedules, Book trial. | Capability Discovery | Low |
| 10 | Fix or remove Racquet Rescue form (no `action`/`onSubmit`); if keeping it, wire to an API and add an agent tool for parity. | Action Parity | Low | ⏳ Pending |

---

## What’s Working Well

1. **Shared workspace** — Single source of truth for data (Supabase, `/data`, AC, Notion, GHL). No agent-only sandbox; any future agent can use the same stores.
2. **Tools as primitives** — Where tools exist (AC MCP), they are capability-only (list/get/create/update/add) with no business logic baked in.
3. **User-initiated flows** — Form submissions and chat send to APIs and update UI immediately in the same session (success/error, redirects).
4. **Discovery baseline** — Chat has a welcome message and empty-state guidance; button has accessible labels; some capability hints exist (even if backend doesn’t yet support them).
5. **Validation and rate limiting** — API routes use shared validation (e.g. `lib/validations.ts`) and rate limits; a future agent layer can call the same APIs and inherit the same safeguards.

---

## Optional: Single-Principle Deep Dives

To re-run only one principle (e.g. action parity or shared workspace), use the same explore-agent prompts from the audit workflow and specify the principle number (1–8) or name.

---

*Generated from agent-native audit. See individual sub-agent outputs for full tables and evidence.*
