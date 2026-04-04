---
title: Agent-Native Architecture Audit — Full Site
slug: agent-native-architecture-audit
category: architecture
tags:
  - agent-native
  - action-parity
  - audit
  - mcp
  - capability-discovery
  - shared-workspace
severity: medium
status: audit-complete
date: 2025-03-19
related_files:
  - docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md
  - docs/AGENT-NATIVE-ARCHITECTURE-ROADMAP.md
  - docs/solutions/architecture/agent-tools-action-parity-implementation.md
  - lib/validations.ts
  - lib/form-config.ts
  - app/api/chat/route.ts
  - components/ChatWidget.tsx
---

# Agent-Native Architecture Audit — Full Site

## Context summary

The user requested a full-site check via `/agent-native-audit` (“full entire site and make sure nothing is wrong”). The problem addressed was ensuring the site is systematically audited against agent-native principles so obvious gaps—such as user actions not exposed to agents, or chat overclaiming capabilities—are identified and documented rather than missed. The work performed was an 8-principle agent-native audit using 8 parallel explore subagents, producing a summary report at `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` with principle scores, top 10 recommendations, and what’s working well.

---

## Solution

### Summary

**What it is:** A full agent-native architecture audit of the LBTA codebase that scores the site against 8 principles and produces one report with a summary table, principle write-ups, top 10 recommendations, and strengths.

**How it runs:** A parent agent launches **8 parallel explore subagents**, one per principle. Each subagent gets a principle-specific prompt to audit the repo and return findings and a score. The parent compiles those outputs into a single report.

**Report location:** `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md`

**Follow-up implementation (post-audit):** Phases 6 → 3 → 2 (agent tools, prompt-native chat copy, context injection) are documented in [`agent-tools-action-parity-implementation.md`](./agent-tools-action-parity-implementation.md).

**Report contents:**

- **Overall score summary** — Table of 8 principles with score (e.g. X/Y), percentage, and status (✅ / ⚠️ / ❌); overall agent-native score as average of percentages.
- **Principle summaries** — One short section per principle with finding, evidence, and score.
- **Top 10 recommendations by impact** — Prioritized actions with principle, effort (High/Medium/Low).
- **What’s working well** — Bullet list of strengths.
- **Optional: single-principle deep dives** — Note on re-running one principle only.

### Key steps

1. **Load / reference agent-native principles**  
   Use the 8 principles: (1) Action Parity, (2) Tools as Primitives, (3) Context Injection, (4) Shared Workspace, (5) CRUD Completeness, (6) UI Integration, (7) Capability Discovery, (8) Prompt-Native Features. Reference comes from the audit workflow / agent-native skill or spec (e.g. Action Parity = “every user action has an agent-callable equivalent”; scoring criteria per principle as used in the audit).

2. **Launch 8 parallel explore subagents**  
   For each principle 1–8, invoke one **explore**-type subagent with a prompt that:
   - Scopes the task to that principle only.
   - Asks to search the codebase for evidence (APIs, MCP tools, forms, chat, data stores, UI refresh behavior, discovery/copy, prompts).
   - Asks for a score (e.g. X/Y checklist or percentage) and a short finding summary.

3. **Compile summary table and top 10 recommendations**  
   From the 8 subagent outputs:
   - Build the overall score summary table (one row per principle).
   - Derive or merge “Principle summaries” (one paragraph per principle).
   - Collate and rank a single “Top 10 recommendations by impact” (priority, action, principle, effort).
   - Optionally pull “What’s working well” from positive findings across outputs.

4. **Write the single report file**  
   Write (or overwrite) `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` with: audit date, scope, method (8 parallel principle audits), overall score summary table, status legend, principle summaries, top 10 recommendations table, strengths, and the optional single-principle re-run note.

### How to re-run

**Full audit:** Run the same workflow: 8 parallel explore subagents, one per principle, then compile and write `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` as above.

**Single-principle audit:** Use the same explore-agent prompts from the full audit workflow, but invoke **one** explore subagent and pass only the desired principle — by **number (1–8)** or **name** (e.g. “Action Parity”, “Shared Workspace”). The prompt should ask to audit the codebase against that principle only and return findings and score. Output can be used as a deep-dive section or a mini-report; no need to regenerate the full summary table unless doing a full re-audit.

---

## Prevention and best practices

### 1. Avoiding “missing easy stuff”

- **Run the agent-native audit on a schedule**  
  Re-run the same 8-principle audit (or a subset) at least **quarterly** and **before each major release**. Treat it as an architecture/process check, not a one-off. Track the overall score and principle breakdown over time.

- **Pre-release checklist (8 principles)**  
  Before tagging a major release, confirm:
  - **Action parity:** Every net-new user action (form, API, or chat flow) has a corresponding agent tool or a documented “no tool” decision.
  - **Tools as primitives:** New tools are capability-only (list/get/create/update/add); no business logic baked into tools.
  - **Context injection:** If AI/chat exists, system prompt and dynamic context (page, history, capabilities) are defined and wired.
  - **Shared workspace:** New persistence uses the same stores (Supabase, `/data`, AC, etc.); no agent-only sandbox unless intentional.
  - **CRUD completeness:** For entities that agents should manage, at least read (and update/delete where appropriate) is available via API and exposed to agents.
  - **UI integration:** Content/schedule changes trigger refetch or revalidate so agent or script writes are visible in the UI.
  - **Capability discovery:** Chat/help copy and suggested prompts match what the backend actually does.
  - **Prompt-native features:** Where behavior is AI-driven, it’s controlled by configurable prompts, not only code.

- **Document “why not” for gaps**  
  When a user action intentionally has no agent tool (e.g. coach hub auth), record the reason in a short doc or ADR so future work doesn’t re-open the same gap by accident.

### 2. Best practices when changing the product

- **New user action (form or API)**  
  - Add an agent tool that calls the same API with the same request shape as the frontend, **or**  
  - Document in a central place (e.g. `docs/agent-native.md` or ADRs) why there is no tool (security, scope, or “defer to Phase 2”).  
  - Keep request contracts (OpenAPI or small spec) for book, register-program, register-year, newsletter, scholarship, coach-hub, chat so agent tools and frontend stay in sync.

- **Chat or capability copy**  
  - When changing welcome text, suggested prompts, or “What can you do?” content, verify that the backend (e.g. `/api/chat` and any tools) can fulfill those capabilities.  
  - If the backend is a stub or limited, tone down copy to what’s actually available (or add the backend/tools and then update copy).  
  - Avoid discovery overclaim (e.g. promising “Book a trial” or “See pricing” in chat if the chat cannot perform or trigger those actions).

- **New or changed API**  
  - If the API is user-facing (form, booking, registration, etc.), consider it in the action-parity checklist: add or update an agent tool, or document why not.

### 3. Lightweight gate or reminder

- **PR / feature template**  
  Add a short reminder in the PR template or feature checklist, for example:  
  *“If this PR adds or changes a user-facing form or API: have you added (or explicitly decided not to add) an agent tool for action parity? If you changed chat or help copy, does the backend support what’s promised?”*

- **Docs pointer**  
  In `docs/` (e.g. in a contributing or architecture doc), add one line that links to the agent-native audit and this prevention section:  
  *“When adding forms or APIs, see [Agent-Native Prevention and Best Practices](docs/solutions/architecture/agent-native-architecture-audit.md) for action parity and capability discovery.”*

- **No hard gate required**  
  The gate is a **reminder** (checklist item or doc link), not a blocking CI check. The goal is to make “consider action parity and capability discovery” a default step when adding forms or APIs, without blocking PRs that intentionally defer agent work.

---

## Related documentation

- **site-wide-image-404s-layout-consistency** — **Related (audit family).** Same idea of a site-wide audit, but scope is photos/layouts (paths, hero alt, objectPosition, legacy assets), not agent tools. For the photos/layouts audit see **docs/PHOTOS-AND-LAYOUTS-AUDIT.md** and **docs/solutions/ui-bugs/site-wide-image-404s-layout-consistency.md**.
- **header-nav-low-contrast-over-hero** — **Tangential (a11y/UX).** For resolved a11y items (e.g. header contrast) see **docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md**.
- **visual-elevation-conversion-strip-facility-quote-pattern** — **Sibling pattern.** For UI/visual consistency patterns see **docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md**.

### Cross-references

- **Forms and API contracts:** Audit recommendations (action parity, tool layer) affect the same flows as forms. See **lib/form-config.ts**, **lib/validations.ts** (Zod schemas) so agent tools stay aligned with existing APIs and request shapes.
- **Racquet Rescue (recommendation #10):** If the form is kept, wire it to an API and add an agent tool; reuse patterns from **lib/form-config.ts** and the register/newsletter/book API routes.
- **Chat / discovery:** **components/ChatWidget.tsx** (deferred via `components/layout/ChatWidgetDeferred.tsx`) is the active website chat entry point; **app/api/chat** is the stub to replace or extend.
- **Shared workspace / data:** Single source of truth: **lib/leads-store.ts**, **lib/activecampaign.ts**; .cursorrules Part 12 (Data Management).
- **MCP/AC usage:** **docs/ac-ghl-connection-via-mcps.md** (Vercel, AC, GHL).

### Docs that should link to this solution

- **plans/COMPOUND_LEARN.md** — Add to REVIEW ARTIFACTS or a “Solution docs / audits” table: agent-native architecture audit → link to this doc.
- **.cursorrules** Part 19 — Add a bullet that the agent-native architecture audit and its solution doc live under `docs/` (e.g. “Agent-native: see docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md and docs/solutions/architecture/agent-native-architecture-audit.md for principle scores and recommendations”).
- **docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md** — In the “Existing docs/solutions files” table, add a row for this agent-native solution doc.

---

*Documented via compound workflow. Audit report: **docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md**.*
