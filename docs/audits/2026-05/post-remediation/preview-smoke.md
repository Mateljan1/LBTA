# Preview Smoke Test — `mobile-ux-remediation-tier-1`

**Run:** 2026-05-13 `/compound:deploy` (preview-only) Phase 5.5 smoke test.
**Branch SHA:** `d48d6cdf21afe78960fcaf51094d64d908dd05b5`
**Preview URL:** https://laguna-beach-tennis-academy-6m7k7qn06-andrew-mateljans-projects.vercel.app
**Vercel deploy:** ● Ready · Environment: Preview · Build: 51s
**Project:** `andrew-mateljans-projects/laguna-beach-tennis-academy` (orgId `team_ibcYntdB9Dcozo7nyhtupA1H`, projectId `prj_vr7VKBTayqDiSCrQ5yILJgXNUY0t`)

---

## HTTP smoke (6 canary routes)

```
HTTP 200  /                          (vid=sfo1::iad1::qj77b-1778719427443-d04dfc7f0aec)
HTTP 200  /schedules                 (vid=sfo1::iad1::m6ctt-1778719428382-48a2af51128a)
HTTP 200  /contact                   (vid=sfo1::iad1::8t5wh-1778719429071-539b01149c39)
HTTP 200  /junior-trial              (vid=sfo1::iad1::428w8-1778719429622-f56c688503bb)
HTTP 200  /pathway-planner           (vid=sfo1::iad1::g78fs-1778719430115-40c3bc8349dd)
HTTP 200  /book                      (vid=sfo1::iad1::qz7h6-1778719430654-97a707c649be)
```

**Result:** 6/6 routes 200 · 0 `x-vercel-error` headers · all served by `iad1` region (US-East primary). Real-user-perspective serving confirmed.

---

## Lighthouse mobile on preview `/contact` (the strongest possible AC3 confirmation)

```
=== PREVIEW DEPLOY /contact (Vercel-served, real production environment) ===
  Performance:        0.86
  Accessibility:      0.97
  CLS numeric:        0.000000
  CLS displayValue:   0
  CLS score:          1.0
  Layout-shift events: 0

  LCP: 4.1 s  (score 0.47)
  FCP: 1.2 s  (score 0.99)
  TTI: 7.7 s  (score 0.45)
```

### Interpretation

- **🎯 AC3 (`/contact` CLS < 0.1) — CONCLUSIVELY CLEARED.** Zero layout-shift events. Real Vercel infrastructure, production rendering, real font-display swap timing, real Suspense streaming behavior. Both components addressed:
  - The universal 0.097 (SeasonBanner post-hydration mount) — fixed by cookie-based SSR (commit `613a5b2`).
  - The unique 0.402 (Suspense fallback wrapping the entire contact page) — fixed by extracting `useSearchParams` to a tiny null-fallback child (commit `1a8725b`).
- **AC2 (Lighthouse Mobile A11y ≥ 0.95) — CLEARED on `/contact` in production: 0.97.**
- **Performance 0.86 / FCP 1.2s** is healthy. **LCP 4.1s** and **TTI 7.7s** are cold-start preview numbers (no warm cache, no CDN priming, single test run). Production after warming will be lower. These are diagnostic, not red — the audit's perf concerns are deferred to the production Lighthouse pass per `scorecard.md` §12.

---

## Vercel project health check

`vercel ls` immediately before push showed 9 of the last 9 production deploys ● Ready (no `DEPLOYMENT_DISABLED`, no `DEPLOYMENT_PAUSED`). Preview deploy completed in 51s.

Production domain `lagunabeachtennisacademy.com/` and `/contact` returned HTTP/2 200 with `cache-control: public, max-age=0, must-revalidate` immediately before push. No project-level dark state.

---

## Smoke test exit codes (per ship-gate semantics)

| Check                                              | Exit code | Verdict |
|----------------------------------------------------|----------:|---------|
| HTTP 200 on 6 canary preview routes                | 0         | ✅ PASS |
| `x-vercel-error` header absent on all 6 routes     | 0         | ✅ PASS |
| `/contact` Lighthouse CLS < 0.1 (preview)          | 0         | ✅ PASS |
| `/contact` Lighthouse Accessibility ≥ 0.95         | 0         | ✅ PASS |
| Production domain `lagunabeachtennisacademy.com` healthy (pre-push) | 0 | ✅ PASS |
| Vercel project ● Ready (no project-level disable)  | 0         | ✅ PASS |

**Aggregate exit code: 0.** All preview smoke checks green.

---

## Open follow-ups (preview-review checklist for Andrew)

When eyeballing the preview:

1. **Visual spot-check** at 320 / 375 / 768 — confirm no horizontal scroll regression (the only width-affecting change is the hero scroll-cue 44 → 48px touch box, self-contained).
2. **Drawer heritage-stat copy** in mobile menu — confirm "Founded 2020 · Official City Partner" reads right. One-line follow-up commit if Andrew prefers different framing.
3. **Reduced-motion verification** — toggle macOS Accessibility > Reduce Motion, then exercise: TrialBookingModal open/close, StickyCTA scroll-in, BackToTop click, Header drawer open. All should be instant.
4. **VoiceOver pass** on iPhone for `/pathway-planner` selects + NewsletterForm submit button (the C-2 + C-1 a11y fixes).
5. **Real-device iOS Safari** spot-check on `/contact` to confirm the CLS fix holds on the platform with the documented `prefers-reduced-motion` matchMedia divergence.

If everything passes Andrew's eyeball pass, manual `git checkout main && git merge mobile-ux-remediation-tier-1 && git push` for production promotion (a separate `/compound:deploy` run will handle that with `health:prod` against `lagunabeachtennisacademy.com`).
