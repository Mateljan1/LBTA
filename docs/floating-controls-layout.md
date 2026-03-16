# Floating Controls Layout (Bottom-Right)

Bottom-right floating controls use a **single vertical stack** so the chat button and back-to-top button never overlap each other or the browser scrollbar.

## Stack (bottom to top)

1. **Chat button** — primary; always visible on main layout pages.  
   - Position: `bottom: calc(24px + env(safe-area-inset-bottom, 0px))`, `right: 24px`  
   - Size: 60×60px, z-index 50

2. **Gap** — 16px

3. **Back-to-top** — visible only when `scrollY > 400`.  
   - Position: `bottom: calc(100px + env(safe-area-inset-bottom, 0px))`, `right: 24px`  
   - Size: 48×48px (min touch target), z-index 40

4. **Chat window** (when open) — anchored above the chat button.  
   - `bottom: calc(100px + env(safe-area-inset-bottom, 0px))` so it does not cover the back-to-top button.

## Rationale

- **Chat at bottom** — Primary action in one predictable place; good thumb reach on mobile.
- **Back-to-top above chat** — Appears only after scroll; single column stays clear.
- **Safe-area** — Both controls sit above browser chrome and device safe areas.

## Files

- `components/ui/BackToTop.tsx` — back-to-top button
- `components/ChatWidget.tsx` — chat button, badge, and window
- Plan: `plans/floating-controls-chat-backtotop-plan.md`

Do not add new fixed bottom-right controls without reserving space in this stack (e.g. next slot above back-to-top with the same 16px gap and right alignment).

---

## What best companies do (chat visibility)

- **Placement:** Bottom-right is where users look for help (Intercom, Drift, Zendesk, luxury concierge widgets). We keep chat there.
- **Recognition:** Users recognize (1) the speech-bubble icon, (2) a short tooltip/label. We use:
  - **Icon:** Universal chat/speech bubble (no generic emoji).
  - **Tooltip:** `title="Chat with us"` (native tooltip on hover/focus).
  - **Hover label (desktop):** "Chat with us" pill to the left of the button on hover (md+ only), so the affordance is obvious without being loud.
- **Tone:** Calm, confident ("Chat with us") — no "Need help? Chat now!" or exclamation. Matches LBTA voice.
- **Mobile:** Icon + badge; no hover label (touch). Tooltip still available on long-press where supported.
- **Performance:** Chat widget is client-only, minimal script; no heavy third-party embed that hurts LCP.
