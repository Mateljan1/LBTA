# Git Discipline — Trunk-Based (solo owner) — lbta-website-draft-3-5-26

> Dropped by project-kit-apply.sh on 2026-06-22. Per-repo, reversible, git-tracked.
> Canon: trunk-based on main, LOCKED 2026-06-20. Pairs with [[feedback-trunk-based-main-and-earned-autodeploy-2026-06-20]] · corrections entry-370.

---

## HUMAN: how we keep history clean so updates never go missing

This project lives on **one main line of work** ("main"). You make small changes and
save them often. That's it. The one thing that breaks this — and the reason updates
have gone "missing" before — is letting a **side branch drift far behind main**: the
work piles up on a branch nobody merges, main moves ahead, and suddenly "I can't see
my updates." We had exactly that (main 163 commits behind a side branch). The cure is
simple: stay on main, merge any short branch back the same day, never let one drift.

You (Andrew) never have to run git. Drew handles commits and branches. The only things
that stay your hand: anything irreversible — pushing to production, money, real sends,
credentials. Those gate to you. Everything else (local commits, branch work) Drew does
freely because it's reversible.

---

## AGENT: trunk-based rules (read before any git work)

```
TRUNK            : main   (LOCKED 2026-06-20 — never work off a stale default branch name)
DEFAULT WORKFLOW : commit small + often, directly on main. The diff IS the completion signal.
BRANCHES         : short-lived ONLY when a slice genuinely needs isolation.
                   merge back to main DAILY. NEVER let a branch drift behind main.
                   (the 163-behind scar = root cause of "can't see my updates")
REVIEW STEP      : Drew's AI Verifier (producer != approver) — NOT a mandatory human PR.
                   This is a solo owner; do not impose heavy human-team PR ceremony.
PROTECTED-MAIN   : "main always green." CI is advisory now; the required-check flip is
                   GitHub branch-protection = Andrew's hand only (blueprint Slice 4).
IRREVERSIBLE     : prod deploy / push-to-prod-alias / money / sends = ANDREW'S HAND, gated.
                   local commits + branch work = reversible → Drew does them freely.
```

### Repo-scoped git config the kit sets (local only, never global)
```
init.defaultBranch       = main          # start on main, never a stale default
pull.ff                  = only          # no surprise merge commits on pull (linear history = the drift cure)
branch.autoSetupMerge    = always
merge.ff                 = true          # fast-forward by default
core.hooksPath           = .githooks     # activates the kit's pre-commit SoT auto-track
```

### Drift check (report-only)
`~/.claude/hooks/git-drift-check.sh` warns (never blocks) when the current branch falls
behind main, so a drift is caught early — before it becomes "missing updates."

---
*Pairs with: [[the-living-standard]] · [[project-source-of-truth-standard]] · [[task-triage-and-throughput]] STEP 5.5*
