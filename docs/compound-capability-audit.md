# Compound Engineering — Capability Audit

**Purpose:** Confirm we can run the full compound workflow (plan → work → review → validate → deploy → learn) **now**, and clarify single agent vs. multiple agents.

**Last checked:** March 2026

---

## Can we build/run it all together? **Yes.**

You have everything needed to run the full loop in this repo and in Cursor:

| Capability | Status | Where |
|------------|--------|--------|
| **Plan** | ✅ | You (or the agent) research codebase + memory + web, then write a plan (e.g. `plans/*.md`). No special tool required. |
| **Work** | ✅ | Agent executes plan steps (read files, edit, run scripts). No special tool required. |
| **Review** | ✅ | Agent uses the **Task tool** to spawn parallel **review subagents** (security-sentinel, performance-oracle, etc.). Subagents run in parallel; agent synthesizes results. |
| **Validate** | ✅ | Agent uses the **Task tool** to spawn parallel **validation subagents** (functional-tester, api-validator, etc.). Same pattern. |
| **Deploy** | ✅ | Agent runs git + Vercel (CLI or Vercel MCP); optionally spawns **deploy subagents** via Task (pre-deploy-checker, smoke-tester, etc.). |
| **Learn** | ✅ | Agent updates `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/` (patterns, anti-patterns, quality-bars, corrections). Files already exist. |
| **Quality gate** | ✅ | `npm run quality-gate` (build + lint). CI runs it on every PR (`.github/workflows/quality-gate.yml`). |
| **Fact-check** | ✅ | `npm run fact-check` (forbidden copy in app/components/data). |
| **Recurring cadence** | ✅ | Documented in [recurring-workflows.md](./recurring-workflows.md). |

So: **you can run the full compound workflow today.** One Cursor chat, one “agent” (the AI in that chat), which can call the Task tool to run multiple **subagents** in parallel when you do review/validate/deploy.

---

## Single agent vs. multiple agents

**You do not need multiple Cursor windows or multiple “agents” in the sense of separate AI instances.**

- **One Cursor agent** = the AI in this chat. It has access to:
  - Files (read, edit, search)
  - Terminal (build, lint, fact-check, deploy)
  - **Task tool (mcp_task)** → spawns **subagents** by type (e.g. `security-sentinel`, `performance-oracle`, `functional-tester`).
- **Subagents** = short-lived, focused tasks launched via the Task tool. They run in parallel (e.g. 4–6 review subagents at once), then the **main agent** (this chat) gets their outputs and synthesizes a review summary.

So the model is:

- **Single agent** (this chat) **orchestrates** the loop.
- **Multiple subagents** run in parallel when you run **review**, **validate**, or **deploy** (each subagent is one Task invocation with a different `subagent_type`).

You don’t need to “have multiple agents” yourself—you just ask this agent to “run compound review” or “run compound validate”; it will launch the right subagents and combine the results.

---

## How to run it “all together”

**Option A — Full loop (plan → work → review → validate → deploy → learn)**  
Say something like:

- *“Run the full compound loop for [feature or plan]. Plan first, then work the plan, then run compound review, then validate, then deploy, then compound learn.”*

The agent will do each phase in order; for review and validate it will spawn parallel subagents and then synthesize.

**Option B — Just review**  
- *“Run compound review on the recent changes”* (or “on this PR”).  
The agent will launch several review subagents in parallel (e.g. security, performance, simplicity, pattern, architecture, a11y) and then produce a single review summary.

**Option C — Review + validate**  
- *“Run compound review then compound validate.”*  
Review subagents run first and are synthesized; then validation subagents run and are synthesized.

**Option D — Deploy**  
- *“Run compound deploy”* or *“Deploy to production”*.  
The agent will run pre-checks (e.g. quality-gate), then push and `vercel --prod`, and optionally run deploy subagents (smoke-tester, etc.).

So: **yes, we have the capabilities to build and run it all together.** Use one Cursor agent; it will use multiple subagents internally when you run review/validate/deploy.

---

## What’s in the repo (checklist)

| Item | Location |
|------|----------|
| Learnings (corrections, patterns, anti-patterns, quality-bars) | `.cursor/compound/learnings/` |
| Master learnings doc | `plans/COMPOUND_LEARN.md` |
| Quality gate (build + lint) | `npm run quality-gate` |
| Fact-check (forbidden copy) | `npm run fact-check` |
| CI (quality-gate on PR/push) | `.github/workflows/quality-gate.yml` |
| Recurring workflows (when to run what) | `docs/recurring-workflows.md` |
| Power stack (MCPs, agents, scripts, skills) | `docs/power-stack.md` |
| Compound power-up plan (automations, fact-check, CI) | `plans/compound-engineering-power-up-plan.md` |
| Compound folder README | `.cursor/compound/README.md` |

---

## Should we use multiple agents?

**In Cursor, “multiple agents” = this one agent + the subagents it starts via the Task tool.**

- **You:** One Cursor project, one chat (or one chat per big task).
- **Compound review/validate/deploy:** This agent starts **several subagents in parallel** (e.g. 4–6 for review, 3–5 for validate). You don’t start them manually; you just ask for “compound review” or “compound validate.”

So:

- **No need** to open multiple Cursor windows or multiple “agents” yourself.
- **Yes:** The system is designed to use multiple **subagents** for review/validate/deploy, all launched by this single agent when you ask for it.

**Summary:** We have the capabilities to run the full compound workflow now, all together, in this one project. Use one agent (this chat); it will use multiple subagents when you run review, validate, or deploy. No extra setup required beyond what’s already in the repo and in Cursor.
