# Compound Learn Run — 2026-03-16 (Coach Hub)

**Trigger:** `/compound:learn` after Coach Hub compound review (8 agents, 78/100).

**Source:** `docs/coach-hub-compound-review-summary.md` — Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Data Integrity Guardian, CodeRabbit/Code Review, TypeScript/API Review.

---

## Extractions

### Corrections (added to corrections.jsonl)

| Original | Correction |
|----------|------------|
| Middleware protects route (e.g. /coach-hub) with env secret but returns next() when secret unset | When path is protected and secret missing, redirect to login or return 503; never allow access when unconfigured |
| Modal/overlay (BinderOverlay, GuideOverlay) without focus trap and Escape-to-close | Add onKeyDown(Escape → onClose) and focus trap (e.g. focus first focusable on open) |
| Clear-cookie header does not set Secure when session cookie was set with Secure in production | Include Secure in clear-cookie string when NODE_ENV === 'production', matching buildCoachHubSetCookie |

### Patterns (added to patterns.json)

- **login-redirect-param-validate** — When login page uses ?next= for redirect after auth, validate to same-origin path only (e.g. safeRedirectTarget: relative, under app prefix, no //). Coach Hub already fixed.
- **password-max-length-schema** — Auth schema for password should have .max(512) (or similar) with generic error message ('Invalid password') to avoid DoS and length leakage.
- **modal-overlay-focus-trap-escape** — Dialogs/overlays must trap focus and close on Escape; add onKeyDown(Escape) and focus first focusable on open.
- **tab-list-aria** — Tab strip should use role="tablist", role="tab", aria-selected, role="tabpanel", aria-labelledby for screen readers.
- **range-input-label** — Range inputs need id and label htmlFor (and optional aria-valuenow/valuemin/valuemax).

### Anti-patterns (added to anti-patterns.json)

- **protected-route-open-when-secret-unset** — Middleware that protects a route (e.g. /coach-hub) with an env secret returns next() when secret is unset, opening the route. Redirect to login or 503.
- **modal-overlay-no-focus-trap-escape** — Modal/overlay without focus trap and Escape-to-close; keyboard users cannot close or focus escapes.
- **clear-cookie-missing-secure** — When set-cookie uses Secure in production, clear-cookie must also include Secure so browsers clear it over HTTPS.
- **extraction-script-new-function** — Using new Function('return (' + s + ')')() to parse input; if s ever comes from untrusted source, code injection. Use safe parser or document trusted-only; avoid repurposing script for untrusted input.

### Quality bars (added to quality-bars.json)

- **protectedRouteSecretRequired** — When middleware protects a route with an env secret, redirect to login or 503 when secret unset; never allow access.
- **modalOverlayFocusTrapEscape** — Modals/overlays must have focus trap and Escape-to-close for a11y.
- **clearCookieSecureInProd** — Clear-cookie header must include Secure when set-cookie used Secure (e.g. production).

---

## Files updated

- `.cursor/compound/learnings/2026-03-16-coach-hub-compound-learn.md` — this file.
- `.cursor/compound/learnings/corrections.jsonl` — 3 new entries.
- `.cursor/compound/learnings/patterns.json` — 5 new patterns; lastLearnRun + updated.
- `.cursor/compound/learnings/anti-patterns.json` — 4 new anti-patterns; updated.
- `.cursor/compound/learnings/quality-bars.json` — 3 new bars; updated.
- `plans/COMPOUND_LEARN.md` — log entry for Coach Hub learn run.

---

## Outcome

Learnings from the Coach Hub review are in project memory. Future agents and compound:review will have:

- Protected routes (env secret) must never be open when secret unset.
- Modals/overlays require focus trap and Escape-to-close.
- Clear-cookie must match set-cookie (Secure in prod).
- Login redirect param must be validated (safeRedirectTarget pattern).
- Tab strips and range inputs need proper a11y (roles, labels).
- Extraction scripts using new Function() must be trusted-only or use safe parser.
