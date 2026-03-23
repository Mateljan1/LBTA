# Agent-Native Audit — Roadmap (Maximize Score, No Product Rebuild)

**Purpose:** Raise scores on the [8 principles in `AGENT-NATIVE-ARCHITECTURE-AUDIT.md`](./AGENT-NATIVE-ARCHITECTURE-AUDIT.md) **without** turning the marketing site into a full agent platform, CRM admin, or LLM product.

**Implementation log (March 2026):** Phases **6 → 3 → 2** are implemented: [`agent-tools-action-parity-implementation.md`](./solutions/architecture/agent-tools-action-parity-implementation.md). **Next:** re-score the audit table, then Phase 1 (capability discovery polish), Phase 4 (UI revalidation), Phase 5 (CRUD scope).

**What “maximize” means here:** Move as many principles as possible into **80%+ (Excellent)** or honest **documented scope**, while accepting that **literal 100% on every row** requires a different product (LLM chat, in-app CRUD, real-time agent→UI sync).

---

## Realistic ceiling (this codebase)

| Principle | Already strong | Ceiling without rebuild | Why |
|-----------|----------------|-------------------------|-----|
| Tools as Primitives | ✅ 100% | **100%** | Keep AC MCP primitive-only; no workflow tools. |
| Shared Workspace | ✅ 100% | **100%** | No change needed. |
| Action Parity | 0% | **~70–100%** | Add thin agent tools (MCP or scripts) that POST to existing APIs; coach hub may stay human-only with explicit doc. |
| Capability Discovery | ~57% | **~85–100%** | Close remaining gaps: `/help`, suggested links, copy honesty; optional slash commands or “no slash” decision. |
| UI Integration | 35% | **~60–80%** | `revalidatePath` / tags in data pipeline; optional SWR for client reads; no full WebSocket product. |
| Context Injection | 0% | **~30–50%** | Without LLM: **minimal** injection (route, capabilities, static reply variants) in `/api/chat`; full score needs AI. |
| CRUD Completeness | 0% | **~20–40%** | Public site is **create-only by design**; gains come from **read** for ops (protected) or **documented exception**. |
| Prompt-Native Features | 0% | **~50–100%** | Move **stub copy** + pathway copy to **config files** (JSON/TS); behavior changes = edits to config, not logic. |

**Rough target band after roadmap:** **~55–70%** overall average (up from ~37%), with **principles 2–4** staying at **100%** where already true.

---

## Phase 0 — Already shipped (baseline)

Use this as the checklist; don’t duplicate work.

- [x] **`docs/api-contracts.md`** — Request shapes for public APIs (supports Action Parity + tools).
- [x] **`/help`** + link from chat (“What can you do?”).
- [x] **ChatWidget** — Welcome copy aligned with stub; suggested actions (Book, Schedules, Contact); `/help` link.
- [x] **Racquet Rescue** — Non-broken CTAs (contact paths) where applicable.

Re-score **Capability Discovery** in the next audit pass to reflect the above.

---

## Phase 1 — Quick wins (Capability Discovery + honesty)

**Goal:** Push **Capability Discovery** toward **80%+** and keep marketing copy defensible.

| Deliverable | Principle | Effort |
|-------------|-----------|--------|
| Re-audit §7 with current UI: `/help`, footer link, suggested actions, stub-accurate welcome | Capability Discovery | Low |
| Optional: **first‑visit hint** in chat (one line: “This is a quick assistant; for schedules, use the links below.”) | Capability Discovery | Low |
| Document **explicit non-goals** in audit or `/help`: “No AI reasoning; no live coach chat in widget” | Capability Discovery | Low |
| Optional: **slash commands** (`/book`, `/schedules`, `/contact`) that only navigate or paste suggested text — or document that slash commands are **out of scope** | Capability Discovery | Low–Med |

---

## Phase 2 — Action Parity (highest ROI for score)

**Goal:** **Every public POST the user can do** has a **machine-callable twin** with the **same validation** as the browser.

**Status:** ✅ Shipped — `scripts/agent-tools/` + `AGENT_SECRET` + `validateAgentSecret` on routes. See implementation doc.

| Deliverable | Principle | Effort |
|-------------|-----------|--------|
| **MCP server or `scripts/agent-tools/`** — One function per API: `book`, `registerProgram`, `registerYear`, `newsletter`, `scholarship`, `chat` — each `fetch` to production/staging URL with body from `docs/api-contracts.md` | Action Parity | High |
| **Auth:** tools only run locally with `AGENT_SECRET` or dev-only; never expose public unauthenticated wrappers | Action Parity / Security | Med |
| **Coach hub:** either **document as human-only** (no tool) or add a **read-only** “session status” tool if an API exists — don’t fake parity | Action Parity | Low |
| Keep **contracts** in sync: add CI check or note in PR template “update `api-contracts.md` when API changes” | Action Parity | Low |

---

## Phase 3 — Context injection (stub-grade, no LLM)

**Goal:** Move **Context Injection** off **0%** without shipping OpenAI.

**Status:** ✅ Shipped — `pathname` + `history` + `getChatReply()` in `lib/chat-copy.ts`; structured JSON from `/api/chat`.

| Deliverable | Principle | Effort |
|-------------|-----------|--------|
| Extend **`POST /api/chat`** body with optional `pathname` (and optional `referrer`); return JSON with `reply`, `capabilities`, `stub: true` | Context Injection | Low |
| **ChatWidget:** send `pathname` when opening/sending; optionally show **one line** of context (“You’re on /schedules…”) in assistant reply template | Context Injection | Low |
| **Use `history`:** for stub, echo only last *n* user turns in a **static** template (“We’re here to help; for … see …”) — not semantic reasoning | Context Injection | Low |
| If you later add LLM: **swap** implementation but keep the same contract + injection fields | Context Injection | Future |

---

## Phase 4 — UI integration (deploy + data workflow)

**Goal:** Raise **UI Integration** without a live “agent updates UI” product.

| Deliverable | Principle | Effort |
|-------------|-----------|--------|
| **Build-time / deploy:** when `data/*.json` changes, run `next build` or call **`revalidatePath`** from an internal script or Vercel hook (document the exact command) | UI Integration | Med |
| **Optional:** `export const revalidate = …` or `fetch(..., { next: { tags: ['schedules'] } })` + `revalidateTag('schedules')` from admin-only route later | UI Integration | Med |
| **Optional:** SWR/React Query on **schedules** page for client refetch after navigation — not required if SSG is enough | UI Integration | Med |

---

## Phase 5 — CRUD (scope honestly)

**Goal:** Improve **CRUD Completeness** score **without** a public admin app.

**Pick one strategy:**

| Strategy | Principle | Effort |
|----------|-----------|--------|
| **A — Documented exception** — State in audit: “Public site is create-only; RUD is CRM (AC/Supabase dashboard), not in-app.” | CRUD | Low (doc only) |
| **B — Ops read** — Protected `GET` (e.g. server-only or API key) for lead **read** by staff, plus agent tool for same | CRUD | High |
| **C — Full RUD** — Only if you add admin; **out of scope** for “no rebuild” | CRUD | Very high |

---

## Phase 6 — Prompt-native (config, not code)

**Goal:** Move **Prompt-Native Features** above **0%** without an LLM.

**Status:** ✅ Shipped — `lib/chat-copy.ts` (`CHAT_COPY` + welcome/errors); `/api/chat` and `ChatWidget` consume it.

| Deliverable | Principle | Effort |
|-------------|-----------|--------|
| **`lib/chat-copy.ts` or `data/chat-stub.json`** — welcome + success + error strings; `/api/chat` reads from here | Prompt-Native | Low |
| **Pathway planner** (if any): move copy / rules to **data** where possible | Prompt-Native | Med |
| If you add LLM later: **system prompt** in same file or `data/prompts/*.md` | Prompt-Native | Future |

---

## Suggested order of execution

1. **Phase 1** — Re-score + small copy/docs (fast).
2. **Phase 6** — Config-driven stub copy (cheap, improves Prompt-Native + maintainability).
3. **Phase 3** — `pathname` + structured chat response (Context Injection).
4. **Phase 2** — Agent tools layer (Action Parity).
5. **Phase 4** — Revalidation / ISR story (UI Integration).
6. **Phase 5** — Choose A vs B for CRUD narrative.

---

## Out of scope (explicit)

- Replacing the chat stub with a **full LLM** product (unless you choose to).
- **Public** read/update/delete for leads.
- **WebSocket** real-time agent→browser UI.
- **Workflow MCP tools** that combine multiple primitives (keeps “Tools as Primitives” clean).

---

## How to update the audit after each phase

1. Re-run principle checks against `AGENT-NATIVE-ARCHITECTURE-AUDIT.md`.
2. Update the **Percentage** column and **Finding** bullets with evidence (file paths, PR links).
3. If a principle is **intentionally** capped (e.g. CRUD), add one line: **“Scope: marketing site; RUD in CRM.”**

---

*Companion to `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md`, March 2026.*
