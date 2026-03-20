# Agent-Native Architecture Review: Laguna Beach Tennis Academy

**Audit date:** March 2025  
**Scope:** Full site and codebase  
**Method:** 8 parallel principle audits (Action Parity, Tools as Primitives, Context Injection, Shared Workspace, CRUD Completeness, UI Integration, Capability Discovery, Prompt-Native Features)

---

## Overall Score Summary

| Core Principle            | Score    | Percentage | Status |
|---------------------------|----------|------------|--------|
| Action Parity             | 0/8      | 0%         | ❌     |
| Tools as Primitives       | 24/24    | 100%       | ✅     |
| Context Injection         | 0/6      | 0%         | ❌     |
| Shared Workspace          | 5/5      | 100%       | ✅     |
| CRUD Completeness         | 0/10     | 0%         | ❌     |
| UI Integration            | 35/100   | 35%        | ❌     |
| Capability Discovery      | 4/7      | 57%        | ⚠️     |
| Prompt-Native Features    | 0/2      | 0%         | ❌     |

**Overall Agent-Native Score: 37%** (average of principle percentages)

### Status Legend

- ✅ **Excellent** (80%+)
- ⚠️ **Partial** (50–79%)
- ❌ **Needs Work** (<50%)

---

## Principle Summaries

### 1. Action Parity (0%)

**Finding:** No agent tool layer exists. All 8 API-backed user actions (book trial, register program/year, newsletter, scholarship, coach hub auth/login/logout, chat) have no corresponding MCP or agent tools. The repo does not expose “whatever the user can do” to an agent.

**User actions enumerated:** Book trial, Register program, Register year, Newsletter signup, Scholarship application, Coach hub login/logout, Send chat message.

### 2. Tools as Primitives (100%)

**Finding:** The only agent tools in the repo are the ActiveCampaign MCP (`.cursor/scripts/ac-mcp-server.mjs`): 24 tools, all primitives (list/get/create/update/add). No workflow tools; capability-only. Chat `/api/chat` is a stub with no LLM or tool use.

### 3. Context Injection (0%)

**Finding:** No system prompt or LLM in the codebase. Chat accepts `history` but does not use it; no dynamic context (resources, preferences, capabilities, workspace state) is injected anywhere.

### 4. Shared Workspace (100%)

**Finding:** All persistent stores are shared: Supabase `leads`, `/data/*.json`, ActiveCampaign, Notion, GoHighLevel. No agent-only or sandbox data space; user and any future agent use the same tables/files/APIs.

### 5. CRUD Completeness (0%)

**Finding:** No entity has full CRUD from an agent perspective. User-facing: leads/bookings/registrations are create-only (no read/update/delete in app); programs/coaches/FAQ/leagues/camps are read-only from JSON. No MCP/agent tools for any entity.

### 6. UI Integration (35%)

**Finding:** User-initiated form/chat updates are immediate in-session. No real-time (SSE/WebSocket/polling), no shared cache or refetch on write, no `revalidatePath` when content changes. Schedule/data edits require full reload or redeploy. “Agent action → UI update” path does not exist.

### 7. Capability Discovery (57%)

**Finding:** ChatWidget has a welcome message listing capabilities (programs, schedules, trial booking, coaches, location), but the backend is a stub and does not fulfill those. No help docs, no suggested prompts in the live widget, no slash commands. Discovery overclaims vs actual behavior.

### 8. Prompt-Native Features (0%)

**Finding:** Chat and pathway planner are fully code-defined (hardcoded reply, rule-based logic). No LLM or prompt layer; behavior changes require code edits, not prompt edits.

---

## Top 10 Recommendations by Impact

| Priority | Action | Principle | Effort |
|----------|--------|-----------|--------|
| 1 | Add an agent-tools layer (MCP or equivalent) that mirrors the 8 user actions: book, register-program, register-year, newsletter, scholarship, coach-hub auth, chat. Each tool should call existing APIs with same request shapes as frontend. | Action Parity | High |
| 2 | Align chat discovery with behavior: either add real AI/tools behind `/api/chat` for the claimed capabilities, or tone down welcome/UI copy so it doesn’t promise program/schedule/booking/coach answers. | Capability Discovery | Medium |
| 3 | Add suggested prompts/actions in ChatWidget (e.g. “Book a trial”, “View programs”, “See pricing”, “Contact us”) — reuse pattern from unused `Chatbot.tsx` so users can discover what the chat can do. | Capability Discovery | Low |
| 4 | Introduce a system prompt and context injection if you add real AI chat: current page/route, session history, listed capabilities, and optional program/schedule data so answers stay accurate. | Context Injection | Medium |
| 5 | Make content/schedules refetch or revalidate: either client fetch + cache (SWR/React Query) or `revalidatePath('/schedules')` (and related paths) when data or backing source changes, so agent or script writes are reflected in UI. | UI Integration | Medium |
| 6 | Add Read/Update/Delete for leads (and optionally other submission entities) via protected API or lib, then expose same operations to agents via tools so “full CRUD” is possible for key entities. | CRUD Completeness | High |
| 7 | If you add real AI chat, define behavior in prompts (system/user prompt in config or CMS); keep only wiring (LLM call, rate limit, validation) in code so behavior changes are prompt edits, not code edits. | Prompt-Native Features | Medium |
| 8 | Document request contracts (OpenAPI or small spec) for book, register-program, register-year, newsletter, scholarship, coach-hub, chat so agent tools can stay in sync with frontend. | Action Parity | Low |
| 9 | Add a `/help` or “What can you do?” path (or link in chat header) that shows capability list and links to Contact, Schedules, Book trial. | Capability Discovery | Low |
| 10 | Fix or remove Racquet Rescue form (no `action`/`onSubmit`); if keeping it, wire to an API and add an agent tool for parity. | Action Parity | Low |

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
