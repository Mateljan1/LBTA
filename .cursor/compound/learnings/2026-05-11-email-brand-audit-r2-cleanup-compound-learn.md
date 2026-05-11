# Email Brand Audit Round 2 — Plan → Work → Review×2 → Cleanup

**Date:** 2026-05-11
**Predecessors:** v1.4 brand-system fixes (`2026-05-06-brand-system-v14-postreview-fixes-compound-learn.md`), prod-health-check pattern (`2026-05-07-prod-health-check-compound-learn.md`)
**Trigger:** User invoked `/compound-engineering work plan 2`, then `/compound-engineering review`, then accepted "Option B" cleanup, then `/compound-engineering learn`.
**Result:** 5 atomic commits (`bb017b7` → `e88206f` → `325ba29` → `0cf42a4` → `d51e9ed`) shipped + verified live in prod. Brand checker now strict-enforces 9 categories across React + email domains. Score trajectory: Round 1 review 78/100 → Round 2 review 89/100 → final state ~91/100.

---

## What this captured

A full Compound Engineering loop on a real workstream:

1. **Plan execution (WORK)** — converted `plans/2026-05-09-email-brand-audit-round-2-plan.md` into 3 atomic commits (Phase A: hex consolidation, Phase B: CAN-SPAM postal address, Phase C: brand-checker email scanner extension). Documented decision points (D-1, D-2, D-3) defaulted per plan.

2. **Round 1 REVIEW** — dispatched 6 parallel plan-aware reviewers (correctness, maintainability, testing, project-standards, kieran-typescript, simplicity). Average 78/100, "fixes-needed but not ship-blocking." 10 findings (5 must-fix + 5 should-fix).

3. **Fix-forward (single commit `0cf42a4`)** — addressed all 10 findings in one commit. Quality jumped to 89/100.

4. **Round 2 REVIEW** — same 6 reviewers re-ran, each verifying their own Round-1 findings. All 6 said "ready." 5 minor warnings remained.

5. **Cleanup commit `d51e9ed`** — addressed 3 of the 5 minor warnings (deleted dead config tests, removed dead exports, synced `.cursorrules`). Final score ~91.

---

## What we got wrong (corrections to remember)

### 1. Source-grep contract tests are brittle

**The mistake:** First version of `lib/brand-tokens.test.ts` email tests did `readFileSync(checkerSource)` then `expect(checkerSource).toMatch(/emailScanRoot\s*=\s*['"]assets\/emails['"]/)`. Five tests followed this pattern.

**Why it failed:** Any reformatting of the script would break the regex. Adding a TS type annotation (`const emailScanRoot: string = ...`) breaks the regex. Reordering Set members breaks the regex. The `/i` flag accidentally added to one regex would have let identifier-case bugs through.

**Correct pattern:** Export the rules (constants and the scanner function) and write **behavior tests** that import them and call the scanner with synthetic fixture HTML. Survives reformatting, renaming, and refactoring as long as behavior stays correct.

```ts
// BAD — source-grep contract test
expect(checkerSource).toMatch(/emailForbiddenHexes\s*=\s*new Set\(\[\s*['"]#d5d1ca['"]/i)

// GOOD — behavior test against exported API
const { forbiddenHex } = scanEmailTemplate('<body bgcolor="#d5d1ca">', 'fixture/foo.html')
expect(forbiddenHex).toHaveLength(1)
```

### 2. `getEditedFiles()` was scoped to the wrong domains

**The mistake:** Extending the brand checker to scan emails, the email-scan branch in `main()` was `editedFiles.length > 0 ? editedFiles.filter(startsWith(emailScanRoot)) : getTrackedEmailTemplates()`. But `getEditedFiles()` ran `git diff --name-only -- app components`, so the filtered array could never contain `assets/emails/` paths. Silent CI hole — any pre-commit edit to an email template skipped the email scan entirely.

**Correct pattern:** When extending a checker to a new domain, audit ALL the input pipelines (full-scan AND edited-files mode) to ensure the new domain's files actually reach the new scanner. Add the domain root to `getEditedFiles()`'s git-diff scope AND extend the extension allowlist (`ext === '.html'`).

### 3. New domain files were routed through old domain scanners

**The mistake:** Adding HTML email files to `getEditedFiles()` made them flow into the React-side `files[]` loop, where the font scanner correctly flagged Helvetica/Arial — except every email template legitimately uses Helvetica/Arial in font-fallback stacks. 48 false-positive ERRORS in a single edited-files run.

**Correct pattern:** Domain-aware routing at the dispatch layer. `files[]` (React-side scanners) excludes `.html`; HTML files go ONLY to the email scanner. Different domains, different rules, separate dispatch.

```ts
// In main(), split editedFiles by domain at the top:
files.push(...editedFiles.filter((f) => path.extname(f) !== '.html'))
// ...
const emailFiles = editedFiles.length > 0
  ? editedFiles.filter((f) => path.relative(repoRoot, f).startsWith(`${emailScanRoot}/`))
  : await getTrackedEmailTemplates()
```

### 4. Silent error swallowing in legal-compliance code

**The mistake:** `getTrackedEmailTemplates()` had `catch { return [] }` for `git ls-files` failure. CAN-SPAM is legal compliance (FTC §316.5, $51,744 per email penalty if challenged). A silent skip on a CI runner without git means the check could pass without ever running.

**Correct pattern:** For legal-compliance / safety-critical checks, **bias toward false-positive over silent skip**. Warn loudly + fall back to filesystem walk. Worst case: scans a few WIP drafts and produces noise. Best case: catches every violation. Either is better than "ships green when nothing was actually checked."

```ts
} catch {
  console.warn(`[check-brand-usage] git ls-files failed; falling back to filesystem walk.`)
  const all = await walkEmailFiles(absoluteRoot)
  return all.filter(...)
}
```

### 5. `Hit.line: number` overloaded with magic value `0`

**The mistake:** First version used `line: 0` for file-level findings (CAN-SPAM postal address — there's no specific line). Printers rendered `assets/emails/foo.html:0` which reads as "line zero" (impossible).

**Correct pattern:** Type-narrow to communicate intent. `line: number | null`; printers render `null` as `(file)`. Type system enforces the distinction; no magic values.

### 6. Cargo-cult defensive code (`.replace('#', '#')`)

**The mistake:** Wrote `forbiddenHex.replace('#', '#')` in the regex builder. `#` is not a JS regex metacharacter — the replace is a literal no-op. Looked like an aborted regex-escape attempt or "future-proofing" — both are anti-patterns when the code is wrong as written.

**Correct pattern:** If escaping is needed, write the actual escape (`forbiddenHex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`). If escaping is not needed, write the comment explaining why ("emailForbiddenHexes only ever holds # + 6 hex digits — no metachars to escape").

### 7. `scanEmailTemplate` mutated state instead of returning hits

**The mistake:** `scanEmailTemplate(contents, file, reportData)` mutated `reportData.emailForbiddenHex.push(...)` directly. Inconsistent with sibling scanners (`gatherLineHits`, `findEyebrowPatterns`) that return `Hit[]`. Also made the function harder to test (caller must construct full ReportData fixture).

**Correct pattern:** Return value, not mutation. `scanEmailTemplate(contents, file): { forbiddenHex: Hit[]; missingPostalAddress: Hit[] }`. Caller does the push. Matches established codebase pattern. Tests can call with `('<html...>', 'fixture/x.html')` and assert on the return.

### 8. Imprecise rationale for documented exceptions

**The mistake:** Initial BRAND COLOR POLICY comment in `lib/email.ts` justified generic grays (`#333/#666/#999`) as "Outlook 2007–2019, Apple Mail, Gmail render brand colors inconsistently for body text." This is technically false — hex is hex; those clients render `#1B3A5C` identically to `#333`.

**The real reason:** (a) **visual hierarchy** — brand-colored headings paired with neutral-gray body keeps emphasis on the headline; (b) **email-design convention** — these greys are the long-standing transactional default with strong cross-client predictability.

**Correct pattern:** When documenting an exception, the rationale must be **true and specific**. False-but-plausible rationale invites future maintainers to "fix" what isn't broken (Litmus-test the false claim, find no problem, "fix" the exception, regress the hierarchy). Always back-link to the framework document that justifies the exception (here: `docs/brand-token-system.md` → "Adding an exception (escape-hatch playbook)").

### 9. Premature exports

**The mistake:** Exported `Hit` and `ReportData` types from `scripts/check-brand-usage.ts` "in case tests need them." Tests use the function return shape directly (`const { forbiddenHex } = scanEmailTemplate(...)`), never importing the types.

**Correct pattern:** Don't export until a consumer asks. Premature exports create API obligations without users. Internal types should be `type` not `export type`. Easy to add `export` when the first consumer appears; harder to remove `export` later (could break unknown consumers).

### 10. Hardcoded counts in human-readable output

**The mistake:** Report writer string said `"all 9 strict categories"` as a hardcoded literal. Then the docs (`docs/brand-audit-2026-05-05.md` regenerated from the report) propagated "9 categories" as a fact. If categories change, the doc silently lies until the next regeneration.

**Correct pattern:** Compute counts from the data structure: `categoryCount = Object.keys(totals).length`. Human-readable output interpolates the count. No drift possible.

### 11. Config-pinning tests in disguise (post-fix regression)

**The mistake:** After replacing the source-grep contract tests with "behavior" tests, two of the new tests still pinned exported constants:
```ts
expect(emailScanRoot).toBe('assets/emails')
expect(emailForbiddenHexes.has('#d5d1ca')).toBe(true)
```
Same anti-pattern as source-grep, just relocated. Round 2 simplicity reviewer caught it.

**Correct pattern:** Behavior tests should call the function and assert on output. If the constant matters, a behavior test that uses it implicitly verifies it (e.g. test #1 "flags forbidden hex #d5d1ca" fails if the hex is removed from the Set — no separate config test needed).

### 12. Skipped `health:prod` proof recording in commit body

**The mistake:** Ran `npm run health:prod` after each push and verified prod was healthy, but didn't record the proof in the commit body. `.cursorrules` Part 15 §4 explicitly requires it. Round 2 project-standards reviewer caught it.

**Correct pattern:** Every commit that touches code consumed by production must include in the commit body: (a) `quality-gate` exit, (b) test count, (c) `health:prod` exit + canary count + local HEAD. Future-me / reviewers can audit ship-gate compliance from the commit message alone.

---

## What we got right (patterns to repeat)

### 1. Separate-domain scanners over scanRoots extension

When adding a new domain (emails, brochures, etc.) with **fundamentally different rules**, build a separate scanner with its own constants/exemptions/heuristics rather than appending to existing scanRoots. Different domains can share a `Hit` type but enforce different rules.

The brand checker now has:
- `scanRoots = ['app', 'components']` for React (raw hex, arbitrary Tailwind, eyebrow patterns, etc.)
- `emailScanRoot = 'assets/emails'` for emails (forbidden hex, CAN-SPAM postal address)

Each domain has its own walker, exemption set, and rule set. Adding a third domain (e.g. `brochures/`) follows the same pattern — define `brochureScanRoot`, `brochureForbiddenX`, etc.

### 2. Compose paths from a single root constant

```ts
// BAD — drift risk on directory rename
const emailExemptFiles = new Set(['assets/emails/lbta-spring-2026.html'])

// GOOD — single source of truth
const emailExemptFiles = new Set([`${emailScanRoot}/lbta-spring-2026.html`])
```

If `emailScanRoot` is renamed (e.g. `assets/email-templates`), the exempt path follows automatically. No silent drift.

### 3. CLI-guard `main()` so the same file can be both CLI and library

```ts
// At end of file:
const isMainModule =
  typeof process.argv[1] === 'string' &&
  process.argv[1].endsWith('check-brand-usage.ts')

if (isMainModule) {
  main().catch(...)
}
```

This pattern lets a script work as both a CLI (`tsx scripts/check-brand-usage.ts --all`) AND as an importable library (tests import `scanEmailTemplate` without `main()` auto-running). The `endsWith` check is fragile if the file is renamed — flag with a comment ("if you rename this file, update this guard").

### 4. Pre-compile regex once outside per-line loops

```ts
// Build patterns ONCE per scan
const hexPatterns = [...emailForbiddenHexes].map(
  (hex) => new RegExp(`${hex}\\b`, 'gi'),
)
const lines = contents.split('\n')
lines.forEach((line, idx) => {
  for (const pattern of hexPatterns) {  // ← reuse compiled pattern
    const matches = line.match(pattern)
    // ...
  }
})
```

vs the original which compiled `new RegExp(...)` once per line × per hex. Negligible at N=1, but compounds as the rule set grows.

### 5. Three-layer documentation for exceptions

When code intentionally violates a rule, document at three layers:

1. **JSON config** (`tokens/lbta-web-tokens.json` — `lbtaUtility.allowed` list with `rationale` per entry)
2. **JSDoc at use site** (`lib/email.ts` BRAND COLOR POLICY comment header)
3. **Back-link to framework** (the comment cites `docs/brand-token-system.md` → "Adding an exception (escape-hatch playbook)")

Future maintainers can find the exception, the reason, and the framework that justifies it without spelunking.

### 6. Atomic commits per logical phase

This workstream:
- `bb017b7` Phase A — color cleanup
- `e88206f` Phase B — CAN-SPAM postal address
- `325ba29` Phase C — brand-checker extension
- `0cf42a4` Round-1 fix-forward
- `d51e9ed` Round-2 cleanup

Each commit is independently:
- **Reviewable** — one concern per commit
- **Revertable** — `git revert <sha>` undoes one phase without touching others
- **Explainable** — the commit body tells the whole story for that phase

### 7. Documented decision points with defaults in plans

The plan listed three decision points blocking start (`D-1`, `D-2`, `D-3`) WITH proposed defaults. User said "work plan 2" → I executed defaults. If user disagreed, they'd have overridden one. Avoids planning thrash and "ask three questions every time" anti-pattern.

### 8. Negative testing alongside positive

Don't just test that the rule fires; test that it correctly **doesn't** fire on adjacent inputs:
- `flags forbidden hex #d5d1ca` ← positive
- `does NOT match #d5d1cafe` (word boundary) ← negative
- `flags missing postal address` ← positive
- `does NOT flag when address is present` ← negative
- `does NOT flag when template is internal-only (no "Laguna Beach")` ← negative

Negative tests catch over-matching regression that positive-only suites miss.

### 9. Plan-aware reviewers

Pass the plan path + acceptance checklist + out-of-scope list to each reviewer agent. Without it, agents flag deferred items as missing ("why isn't there a Litmus test?") and fail to verify the plan's actual acceptance criteria.

In the prompts I dispatched, every agent got:
- Plan path
- Decisions taken (with defaults documented)
- Out-of-scope list (so they don't flag deferred items)
- Acceptance checklist (so they verify the right things)

### 10. Round-N review pattern

When fix-forwarding after Round 1 review, dispatch the **same** reviewers in Round 2 with their **own Round 1 findings** in their prompt. Each agent verifies fixes for THEIR findings. Provides accountability and tracks resolution rate (e.g. "5/5 resolved" in the structured output).

This caught the post-fix regression where the simplicity reviewer noticed two of the new "behavior" tests were still config-pinning in disguise.

### 11. CAN-SPAM treated as ERROR severity, not WARNING

Style/brand violations are warnings (strict-blocking). Legal compliance is ERROR. The code wires `emailMissingPostalAddress` into `totalErrors` not `totalWarnings`, so it fails STRICT mode at the same severity as WCAG contrast violations.

```ts
const totalErrors =
  reportData.forbidden.length +
  reportData.forbiddenFont.length +
  reportData.emailMissingPostalAddress.length  // ← legal compliance = ERROR
```

### 12. Fix-forward over revert when issues are findings, not bugs

Round 1 found 10 issues but the work was functionally correct (acceptance 7/7, STRICT green, 15/15 tests passed, deployed cleanly). Reverting would have lost the value; fixing forward in a single follow-up commit preserved it AND addressed quality concerns.

The decision rule: if STRICT mode passes AND acceptance is met, fix-forward. If STRICT mode fails OR acceptance is broken, revert OR amend.

---

## Final state

### Files changed (all 5 commits combined)
- `lib/email.ts` — color tokens + postal address + BRAND COLOR POLICY comment header (sharpened rationale + escape-hatch back-link)
- `scripts/check-brand-usage.ts` — email scanner extension (separate domain, exported API, async fallback, isMainModule guard)
- `lib/brand-tokens.test.ts` — 7 behavior tests for email scanner (replaced 5 source-grep contract tests + 2 redundant config tests deleted in cleanup)
- `docs/brand-token-system.md` — Guardrails section now documents 9 categories (App/components + Email templates subsections)
- `docs/brand-audit-2026-05-05.md` — auto-regenerated to reflect 9 categories, all green
- `.cursorrules` — Part 7 + Part 14 now reference email-scan ruleset
- 19 spring-2026 email templates + 1 root template — `#d5d1ca → #E8E4DF` + postal address sweep

### Test count: 10 → 17 (+7 net behavior tests, -5 source-grep + -2 redundant config)

### Brand checker: 7 strict categories → 9 strict categories, all green in STRICT mode

### Score trajectory
- Round 1 review (6 agents): avg 78/100, 4-of-6 "fixes-needed"
- Round 2 review (6 agents): avg 89/100, 6-of-6 "ready" (+11 points)
- Post-cleanup (estimated): ~91/100

### Round-1 finding resolution rate (across all 6 reviewers)
- 26/29 fully resolved
- 2/29 partial (acceptable trade-offs documented)
- 1/29 acknowledged, not fixed (Windows path portability — darwin-only repo)

### Production verification
- `bb017b7` ↔ `0cf42a4` ↔ `d51e9ed` all live and serving (8/8 canary routes 200)
- `npm run health:prod` recorded in commit `d51e9ed` body per `.cursorrules` Part 15 §4

---

## Compound deliverables (this learn run)

- `corrections.jsonl` — 12 new entries (the 12 numbered "what we got wrong" items above)
- `anti-patterns.json` — 6 new entries
- `patterns.json` — 8 new entries
- `quality-bars.json` — 4 new entries
- `LEARNINGS.md` — appended summary entry
- Global `~/.claude/memory/episodic/corrections/corrections.jsonl` — mirrored the 6 most generally useful corrections
- Global `~/.claude/memory/MEMORY.md` — added pointer to this file

## Next-time instinct

Before extending an existing checker/linter to a new domain:
1. Audit ALL input pipelines (full-scan + edited-files + watch mode if any) — does the new domain's files actually reach the new scanner in every mode?
2. Audit ALL sibling scanners — will the new domain's files false-positive in any of them? If yes, route them ONLY to the new domain's scanner.
3. Make the new rules behavior-testable from the start — export the rule function with a return value, not an in-place mutation.
4. Treat legal-compliance checks as ERROR severity from day 1, not "promote later."
5. Pre-compile regex outside loops even at N=1 — costs nothing, scales correctly.
6. Document exceptions in three layers (JSON config + JSDoc + framework back-link) and make sure rationale is **true** not just plausible.
