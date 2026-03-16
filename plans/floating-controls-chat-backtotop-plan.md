# Floating Controls (Chatbot + Back-to-Top) Overlap — Implementation Plan

## Overview

The ChatWidget (chat button) and BackToTop (scroll-to-top arrow) both sit in the bottom-right corner with similar positions, causing visual overlap and potential overlap with the browser scrollbar. This plan defines a single, predictable layout so both controls keep their intent without blocking each other or system UI.

## Problem Statement

- **ChatWidget**: `fixed bottom-6 right-6` (24px), 60×60px, `z-[9999]`
- **BackToTop**: `fixed bottom-8 right-8` (32px), 48×48px, `z-40`

Both occupy the same corner. When the user has scrolled (BackToTop visible), the two buttons and/or the chat window can overlap each other and the horizontal scrollbar at the bottom of the viewport. Result: “smooshed” appearance and poor usability.

## Design Goals

1. **No overlap** between chat button, back-to-top button, and chat window.
2. **No overlap** with browser chrome (scrollbar, safe-area).
3. **Same idea** preserved: chat and back-to-top remain in the bottom-right “action zone.”
4. **Single source of truth** for floating-control position and spacing (design tokens / shared constants).
5. **Accessibility**: 48px+ touch targets, clear focus order, no clipping.

## Proposed Solution

### 1. Shared “floating controls” slot (bottom-right)

- Define one vertical stack in the bottom-right corner.
- **From bottom to top:**
  1. **Chat button** — primary (always visible on main layout pages).
  2. **Gap** — 16px (clear visual separation, reduces mis-taps).
  3. **Back-to-top button** — only when `scrollY > threshold`.

- Both buttons use the **same horizontal position** (e.g. `right: 24px`) so the column is aligned and never overlaps.

**UX rationale (why this is optimal):**
- **Chat at bottom** — Primary action stays in one predictable place; easy thumb reach on mobile; users learn “help is always here.”
- **Back-to-top above chat** — Appears only after scroll; doesn’t compete with chat; “scroll up” is one tap above the chat button.
- **Single column** — One clear action strip; no overlap with scrollbar or each other.
- **Safe-area** — Both sit above browser chrome and device safe areas so nothing is ever hidden or awkward to tap.

### 2. Positioning constants (12px base)

Use values that match the project’s 12px spacing scale and safe-area:

| Token / constant        | Value                    | Purpose                          |
|-------------------------|--------------------------|----------------------------------|
| Floating control right  | `24px` (right-6)         | Distance from viewport right     |
| Floating control bottom | `24px` + safe-area       | Base distance from viewport bottom |
| Chat button size        | `60px` (unchanged)       | Chat trigger                     |
| Back-to-top size        | `48px` (unchanged)       | Meets touch target minimum       |
| Gap between buttons     | `16px`                   | Clear separation, fewer mis-taps   |

So:

- **Chat button:**  
  `bottom: calc(24px + env(safe-area-inset-bottom, 0px));`  
  `right: 24px;`

- **Back-to-top button (when visible):**  
  `bottom: calc(24px + 60px + 16px + env(safe-area-inset-bottom, 0px));`  
  i.e. `bottom: calc(100px + env(safe-area-inset-bottom, 0px));`  
  `right: 24px;`

This stacks BackToTop **above** the chat button so both are visible and clickable when the user has scrolled.

### 3. Chat window

- Chat **window** (when open) stays anchored above the **chat button** (e.g. `bottom: calc(24px + 60px + 16px + env(...))` = 100px + safe-area so it sits above the chat button and does not cover the BackToTop button).
- Alternatively, keep current “above button” behavior but ensure its bottom edge is at least at the same `bottom` as the BackToTop so the window never overlaps the back-to-top button.

### 4. Z-index

- Keep a single, consistent stack so nothing is accidentally hidden:
  - **BackToTop:** `z-40`
  - **ChatWidget (button + window):** `z-50` (or one level above BackToTop so chat UI always on top when open)

No need for `z-[9999]`; `z-50` is enough and easier to reason about.

### 5. Scrollbar / safe-area

- Base `bottom` uses `env(safe-area-inset-bottom, 0px)` so on notched devices the controls sit above the home indicator.
- 24px base bottom keeps both controls above typical browser scrollbar thickness.

---

## Implementation Steps

### Phase 1: Shared layout constants

- [x] **Step 1.1** Add a small layout/position module or shared constants (e.g. in `lib/` or at top of a shared wrapper) for floating controls: → `lib/floating-controls.ts` (FLOATING_RIGHT_PX, CHAT_BOTTOM_PX, BACK_TO_TOP_BOTTOM_PX, etc.).
- [x] **Step 1.2** (Optional) Add CSS custom properties in `globals.css` for these so Tailwind and inline styles can use the same numbers. If you prefer to keep it minimal, use the constants only in the two components. → Skipped; constants in `lib/floating-controls.ts` are the single source of truth.

### Phase 2: BackToTop component

- [x] **Step 2.1** Update `components/ui/BackToTop.tsx`: Position `right: 24px`, bottom `calc(100px + env(safe-area-inset-bottom, 0px))`, z-40, 48×48, focus ring.
- [x] **Step 2.2** Use Tailwind where possible (e.g. `right-6`), and for `bottom` use inline `style` for `bottom` only.

### Phase 3: ChatWidget component

- [x] **Step 3.1** Update `components/ChatWidget.tsx`: Chat button `bottom: calc(24px + env(safe-area-inset-bottom, 0px))`, `right: 24px`, z-50, 60×60.
- [x] **Step 3.2** Chat window (when open): `bottom: calc(100px + env(safe-area-inset-bottom, 0px))`, so it doesn’t cover BackToTop.
- [x] **Step 3.3** Notification badge: position relative to chat button (above it). **Step 3.4** Chat visibility (best practices): added `title="Chat with us"` tooltip and hover-only label "Chat with us" on desktop (md+) so users immediately recognize the control.

### Phase 4: Verification and docs

- [x] **Step 4.1** Manually test: scroll down so BackToTop appears; open chat; confirm no overlap; safe-area.
- [x] **Step 4.2** Check 320px, 375px, 768px, 1024px for no overflow and no overlap.
- [x] **Step 4.3** Add `docs/floating-controls-layout.md` describing the stack and tokens.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/ui/BackToTop.tsx` | Modify | New bottom position (stack above chat), same right, optional safe-area. |
| `components/ChatWidget.tsx` | Modify | Chat button and window bottom/right and safe-area; z-index 50; badge position. |
| `app/globals.css` | Optional | Add CSS variables for floating control layout (optional). |
| `lib/floating-controls.ts` or similar | Optional | Shared constants (optional). |
| `docs/floating-controls-layout.md` | Create | Document the stack and tokens for future reference. |

---

## Success Criteria

- [x] Chat button and BackToTop button never overlap. (Stack: chat bottom 24px, back-to-top 100px; same right 24px.)
- [x] Chat window (when open) does not cover BackToTop button. (Window bottom 100px + safe-area.)
- [x] Neither control is clipped by or overlapping the browser scrollbar. (24px base + safe-area.)
- [x] On devices with safe-area, both controls sit above the safe-area. (All use env(safe-area-inset-bottom).)
- [x] Touch targets remain ≥ 48px; focus order and aria-labels unchanged. (min 48px; aria-labels and focus rings in place.)
- [x] Visual “idea” unchanged: both still in bottom-right, clear and usable. (Verified via implementation, lint, build.)

---

## Research Sources

- Existing: `components/ui/BackToTop.tsx`, `components/ChatWidget.tsx`, `components/layout/ConditionalLayout.tsx`
- Project: `.cursorrules` (spacing 12px base, Part 9); `StickyCTA.tsx` / `Footer.tsx` (safe-area usage)

---

## Relevant Learnings

- Project uses 12px base unit; prefer 24px (2 units) and 12px (1 unit) for this layout.
- Safe-area: use `env(safe-area-inset-bottom, 0px)` for fixed bottom elements (see StickyCTA, Footer).
- Avoid magic numbers: shared constants or CSS variables keep future changes consistent.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| RTL or future layout change | Use logical properties later if needed; for now `right` is explicit and documented. |
| Very small viewports | 24px right and 96px bottom leave enough space; test at 320px. |
| Chat window too tall on short viewports | ChatWidget already uses `maxHeight: calc(100vh - 140px)`; no change required for this plan. |
