# LBTA Power Stack — Skills, Tools & Compound Engineering

**Purpose:** One reference for everything that makes this project "super powerful": MCPs, compound-engineering agents, skills to invoke, scripts, and quality gates. Use this when you want full leverage.

---

## 1. MCPs (Model Context Protocol)

### Project-configured (`.cursor/mcp.json`)

| Server      | URL / config | Use |
|------------|--------------|-----|
| **vercel** | `https://mcp.vercel.com` | List projects, env vars, deploy. OAuth in Cursor when prompted. |
| **activecampaign** | `https://tennisbeast.activehosted.com/api/agents/mcp/http` | Contacts, lists, tags, campaigns, automations. See [activecampaign-mcp-setup.md](./activecampaign-mcp-setup.md). |

Reload Cursor after editing `.cursor/mcp.json`.

### Enable in Cursor for full power (if available to you)

These may be configured at user/global level; enable them in Cursor so the agent can use them when relevant:

| Server | Use |
|--------|-----|
| **user-gohighlevel** | Pipelines, contacts, SMS (GHL). See [ac-ghl-connection-via-mcps.md](./ac-ghl-connection-via-mcps.md). |
| **user-notion** | Notion pages, DBs, docs (if you use Notion for LBTA). |
| **user-supabase** | Supabase DB (leads, tables). Optional; see `lib/leads-store.ts`. |
| **user-perplexity** / **user-exa-search** | Web-grounded search and research. |
| **user-context7** / **plugin-compound-engineering-context7** | Up-to-date docs (Next.js, Tailwind, Framer Motion). |
| **cursor-ide-browser** | Browser automation: navigate, snapshot, click, type. For UI validation and smoke tests. |

---

## 2. Compound-Engineering Loop

**Commands:** Use these in chat or as slash-style prompts.

| Command | What it does |
|---------|----------------|
| `/compound:plan` | Research (codebase + git + best practices + memory) → produce implementation plan. |
| `/compound:work` | Execute a plan (e.g. `./plans/site-polish-and-upgrades-plan.md`) step by step. |
| `/compound:review` | Run **13 parallel review agents** (see below). |
| `/compound:validate` | Run **5 parallel validation agents** (runtime: flows, API, data, UI). |
| `/compound:deploy` | Pre-check → deploy → smoke test → rollback ready → monitor. |
| `/compound:learn` | Capture learnings into `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/`. |
| `/compound:full` | Full loop: plan → work → review → validate → deploy → compound. |

### 13 Review Agents (parallel)

| Agent | Focus |
|-------|--------|
| Security Sentinel | Auth, injection, secrets, OWASP |
| Performance Oracle | N+1, caching, indexes |
| Code Simplicity Reviewer | Overbuilding, YAGNI |
| Pattern Recognition Specialist | Matches repo patterns |
| Architecture Strategist | Separation of concerns |
| Data Integrity Guardian | Migrations, foreign keys |
| Test Coverage Analyst | Coverage, edge cases |
| Accessibility Auditor | ARIA, keyboard, contrast |
| Memory Compliance | Corrections, anti-patterns |
| API Design Reviewer | REST, errors, versioning |
| Documentation Checker | Comments, README, types |
| Regression Hunter | Breaking changes, removed code |
| CodeRabbit External | Independent ML review (optional) |

### 5 Validation Agents (parallel)

| Agent | Focus |
|-------|--------|
| Functional Tester | Buttons, forms, navigation |
| API Validator | Endpoints, contracts, errors |
| Data Integrity Validator | Calculations, relationships |
| UI/Visual Validator | Design system, responsive |
| Practice Plan Validator | AI content quality (if applicable) |

### 5 Deploy Agents (parallel)

| Agent | Focus |
|-------|--------|
| Pre-Deploy Checker | Build, env vars, migrations, vulns |
| Environment Validator | Platform auth, services, SSL |
| Smoke Tester | Critical paths, APIs, assets |
| Rollback Guardian | Version, rollback commands |
| Post-Deploy Monitor | Logs, errors, performance |

**How to run:** Ask the agent to "run compound review" or "run compound validate" (or deploy); it uses the Task tool with the appropriate subagent types (e.g. `security-sentinel`, `performance-oracle`, …).

**Capability audit:** Can we run it all now? Single agent vs. multiple? See [compound-capability-audit.md](./compound-capability-audit.md).

---

## 3. Skills to Invoke (when to use)

Ask the agent to use these by name when the task fits.

| Skill / area | When to use |
|--------------|-------------|
| **compound-engineering** | Planning, executing plans, review/validate/deploy/learn. |
| **frontend-developer** | Responsive, accessible, high-performance UI. |
| **react-expert** | Next.js App Router, SSR, SSG, data loading. |
| **performance-oracle** | Slowness, cost, scaling; before traffic spikes. |
| **security-sentinel** | Auth, injection, secrets, OWASP. |
| **api-architect** | New or revised API contracts, REST/GraphQL. |
| **brainstorming** | Before building features; explore intent and design. |
| **systematic-debugging** | Any bug or test failure before proposing fixes. |
| **verification-before-completion** | Before claiming "done"; run checks and show evidence. |
| **lbta-messaging** | On-brand copy, tone, forbidden words. |
| **writing-plans** | Multi-step tasks; produce plan before code. |
| **requesting-code-review** | After features; before merge. |
| **receiving-code-review** | When interpreting or implementing review feedback. |

**Example prompts:**  
- "Use the compound-engineering skill and run a full review."  
- "Use the frontend-developer skill to make this section responsive and a11y-compliant."  
- "Use systematic-debugging to find why the form submission fails."

---

## 4. Scripts & quality gate

### NPM scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (port 3000). |
| `npm run build` | Production build. |
| `npm run lint` | ESLint (TS/JS/TSX/JSX). |
| `npm run test` | Vitest. |
| `npm run lighthouse` | Lighthouse on homepage → `docs/lighthouse-report.html` (dev server must be running). |
| `npm run check:vercel` | Vercel whoami + list (requires token in env). |
| `npm run check:env` | Check AC/GHL env (script). |
| `npm run connection-check` | Connection check script. |
| `npm run quality-gate` | Build + lint (minimal gate). Full gate: see below. |

### Full quality gate (before release)

1. **Build + lint:** `npm run build && npm run lint` (or `npm run quality-gate`).
2. **Lighthouse:** `npm run lighthouse`; run on `/`, `/schedules`, one program page. Target: ≥90 Performance, Accessibility, Best Practices, SEO.
3. **Responsive:** Test 320, 375, 768, 1024, 1440 on key pages; no horizontal scroll.
4. **Forbidden copy:** No "elite", "world-class", "maximize", etc. in user-facing strings.
5. **A11y:** 7:1 contrast, hero CTA solid bg, 48px targets, focus states.

Record results in [docs/quality-gate.md](./quality-gate.md). See [site-polish-and-upgrades-plan.md](../plans/site-polish-and-upgrades-plan.md) Track 1.

---

## 5. Learnings & memory

| Resource | Purpose |
|----------|---------|
| **plans/COMPOUND_LEARN.md** | Master list: CORRECTIONS, PATTERNS, STANDARDS, ANTI-PATTERNS. Load before implementing. |
| **.cursor/compound/learnings/** | quality-bars.json, patterns.json, anti-patterns.json, corrections.jsonl. |
| **.cursor/compound/README.md** | When to run `/compound:learn` and how learnings are used. |
| **.cursorrules Part 19** | Pointer to compound learnings and `plans/COMPOUND_LEARN.md`. |

Run `/compound:learn` after completing a plan, after review/validate, or at end of a significant session.

---

## 6. When to use what (quick table)

| Goal | Use |
|------|-----|
| New feature or big change | `/compound:plan` → then `/compound:work` on the plan. |
| Code quality before merge | `/compound:review` (13 agents). |
| Prove it works at runtime | `/compound:validate` (5 agents). |
| Ship to production | `/compound:deploy` (after validate). |
| Capture mistakes and patterns | `/compound:learn`; update COMPOUND_LEARN.md. |
| Check AC contacts/automations | ActiveCampaign MCP; see [activecampaign-mcp-setup.md](./activecampaign-mcp-setup.md). |
| Check Vercel env / deploy | Vercel MCP or `npm run check:vercel`. |
| Up-to-date Next/Tailwind/Motion docs | Context7 MCP. |
| Browser-level UI check | cursor-ide-browser MCP (snapshot, click, type). |
| Baseline quality (Lighthouse, responsive, copy) | [quality-gate.md](./quality-gate.md) + `npm run quality-gate` + Lighthouse. |
| LBTA brand voice and forbidden copy | lbta-messaging skill; .cursorrules Part 14. |

---

## 7. Recurring workflows

**When to run what:** [docs/recurring-workflows.md](./recurring-workflows.md) defines the cadence:

- **Every PR:** CI runs quality-gate (when GitHub Actions are set up).
- **After merge / deploy:** Optional smoke test; run `/compound:learn` if significant.
- **Weekly:** Full quality gate + `npm run fact-check`; update quality-gate.md.
- **Monthly:** Compound retrospective; learnings hygiene.

**Compound triggers:** After completing a plan → run learn. After deploy → run learn. When adding API/integration → review then learn.

---

## 8. Quick links

| Doc | Content |
|-----|---------|
| [quality-gate.md](./quality-gate.md) | Lighthouse, responsive, forbidden copy, a11y, build/lint. |
| [activecampaign-mcp-setup.md](./activecampaign-mcp-setup.md) | AC MCP URL, compound workflows with AC. |
| [ac-ghl-connection-via-mcps.md](./ac-ghl-connection-via-mcps.md) | Vercel, AC, GHL connection status and MCPs. |
| [registration-flows-and-ops.md](./registration-flows-and-ops.md) | Form → API → AC/GHL flows. |
| [compound-capability-audit.md](./compound-capability-audit.md) | Can we run it all? Single vs. multiple agents. |
| [recurring-workflows.md](./recurring-workflows.md) | When to run what: PR, deploy, weekly, monthly. |
| [deploy-checklist.md](./deploy-checklist.md) | Pre-deploy, deploy, post-deploy (quality-gate, vercel --prod, smoke, compound:learn). |
| [plans/COMPOUND_LEARN.md](../plans/COMPOUND_LEARN.md) | Corrections, patterns, standards, anti-patterns. |
| [plans/compound-engineering-power-up-plan.md](../plans/compound-engineering-power-up-plan.md) | Automations, fact-check, CI, recurring. |
| [.cursor/compound/README.md](../.cursor/compound/README.md) | Compound folder and when to run learn. |

---

**Summary:** Use MCPs for live data and automation (Vercel, AC, GHL, browser, Context7). Use compound-engineering for plan → work → review → validate → deploy → learn. Use the quality gate and scripts for a measurable bar. Invoke specific skills when the task matches (frontend, React, security, debugging, LBTA messaging). This stack is your full power set.
