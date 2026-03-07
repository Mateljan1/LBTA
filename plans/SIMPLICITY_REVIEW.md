# Simplicity Review — LBTA (Overbuilding, Abstractions, Dead Code)

**Reviewer:** Simplicity Reviewer  
**Scope:** plans/REVIEW_SCOPE.md — VYLO removal orphans, conditional layout, forms  
**Focus:** Overbuilding, unnecessary abstractions, dead code

---

## Status: ⚠️ WARNINGS

---

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| 🟡 Warning | `app/PERS_General_2025-12-16_globals.css` (lines 1064–1084) | Orphan from VYLO removal: comment "VYLO Apply Button - Premium Border Draw Animation" and two unused `@keyframes` (`drawBorder`, `pulseGlow`). No references to these keyframes anywhere in the repo. | Remove the VYLO comment and the `drawBorder` and `pulseGlow` keyframes blocks to eliminate dead code. |
| 🟢 Note | `public/robots.txt` | Still contains `Disallow: /vylo` and `Disallow: /vylo-apply`. Routes now redirect to `/programs/high-performance`. | Optional: remove the two Disallow lines for consistency; redirects remain valid either way. |

---

## Summary

VYLO removal is otherwise clean: no orphan references in `app/` or `components/` (except the dead CSS above), conditional layout is a simple two-branch pathname check with no `isVYLO`, and HomeCTAForm/NewsletterForm are minimal and not over-engineered. One warning for dead CSS and one optional note for robots.txt; no critical issues.
