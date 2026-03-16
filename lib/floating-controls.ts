/**
 * Layout constants for bottom-right floating controls (chat + back-to-top).
 * Single source of truth so chat button, back-to-top, and chat window never overlap.
 * @see docs/floating-controls-layout.md
 */

export const FLOATING_RIGHT_PX = 24
export const FLOATING_BOTTOM_BASE_PX = 24
export const CHAT_BUTTON_SIZE_PX = 60
export const BACK_TO_TOP_SIZE_PX = 48
export const FLOATING_GAP_PX = 16

/** Chat button bottom (px) before safe-area: 24 */
export const CHAT_BOTTOM_PX = FLOATING_BOTTOM_BASE_PX

/** Back-to-top bottom (px) before safe-area: 24 + 60 + 16 = 100 */
export const BACK_TO_TOP_BOTTOM_PX =
  FLOATING_BOTTOM_BASE_PX + CHAT_BUTTON_SIZE_PX + FLOATING_GAP_PX

/** Chat window bottom when open (same as back-to-top so window sits above chat button) */
export const CHAT_WINDOW_BOTTOM_PX = BACK_TO_TOP_BOTTOM_PX
