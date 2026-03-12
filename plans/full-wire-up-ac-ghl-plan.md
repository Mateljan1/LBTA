# Full Wire-Up: ActiveCampaign + GoHighLevel

**Objective:** Repo and docs ready for AC + GHL to be fully wired; one clear path to go live and a way to verify env without exposing secrets.

**Success criteria:**
- Env checker script: reports which of AC/GHL vars are set (no values printed).
- README points to one-pager for full setup.
- Build + lint pass; no new security issues.
- Deploy to production; compound learnings captured.

---

## Implementation

### Phase 1: Env checker + README
- Add `scripts/check-ac-ghl-env.js`: reads only `process.env` for `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`, `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID`; prints "set" or "missing" per key; exit 0 if AC vars set, else 1 (so CI or human can verify).
- Add `npm run check:env` in package.json.
- In README "Environment variables", add one line: link to `docs/ac-ghl-connected-onepager.md` and mention `npm run check:env`.

### Phase 2: Review → Validate → Deploy → Compound
- Review: security (no secrets in output), simplicity (minimal script).
- Validate: build, lint.
- Deploy: commit, push, vercel --prod.
- Compound: update COMPOUND_LEARN.md / learnings with "full loop wire-up" pattern.

---

## Files

| File | Action |
|------|--------|
| `scripts/check-ac-ghl-env.js` | Create |
| `package.json` | Add script `check:env` |
| `README.md` | Add setup link + check:env mention |
