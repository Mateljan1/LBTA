# Compound Learn — After Deploy (2026-03-14)

**Trigger:** `/compound:learn` after `/compound:deploy`.

---

## Source

- **Deploy session:** Push was rejected when commit included new `.github/workflows/quality-gate.yml` and `lighthouse-scheduled.yml` — GitHub requires `workflow` scope for OAuth apps to create/update workflow files. Workaround: unstage workflow files, commit and push the rest (50 files), then `vercel --prod` succeeded. Production: https://lbta-website.vercel.app. Workflow files remain in repo locally until user adds them via token with workflow scope or GitHub UI.

---

## Extractions

### Correction (added to COMPOUND_LEARN + corrections.jsonl)

| Original | Correction |
|----------|------------|
| Pushing commits that add or change `.github/workflows/*.yml` with OAuth token that lacks `workflow` scope | Use a PAT or app token with `workflow` scope for the push that adds workflows, or commit and push the rest of the deploy without workflow files, then add workflows via GitHub UI or a separate push with correct scope. |

### Pattern (added to COMPOUND_LEARN + patterns.json)

| Pattern | When to use | Example |
|---------|-------------|---------|
| **deploy-when-adding-github-workflow-files** | Deploy includes new/changed workflow files and push uses OAuth without workflow scope | Commit and push the rest of the deploy without workflow files so code/docs ship; add workflows in follow-up (PAT with workflow scope or GitHub UI). Document in deploy checklist that CI workflows require workflow scope for the push that introduces them. |

### Anti-pattern (added to anti-patterns.json)

| Id | Description |
|----|-------------|
| **push-new-workflows-without-workflow-scope** | Assuming git push will accept new or changed `.github/workflows/*.yml` without workflow scope. Avoid: single commit that adds workflow files and pushes with OAuth that lacks scope. Instead: push deploy without workflows first; add workflows via PAT with workflow scope or GitHub UI. |

---

## Files updated

- `plans/COMPOUND_LEARN.md` — 1 correction, 1 pattern, 1 log entry.
- `.cursor/compound/learnings/corrections.jsonl` — 1 new entry.
- `.cursor/compound/learnings/patterns.json` — 1 new pattern; lastLearnRun updated.
- `.cursor/compound/learnings/anti-patterns.json` — 1 new anti-pattern.
- `.cursor/compound/learnings/2026-03-14-compound-learn-after-deploy.md` — this file.

---

## Outcome

Future deploy runs that add GitHub Actions workflows will have a documented correction and pattern: either use a token with `workflow` scope or push the rest first and add workflows in a follow-up step.
