'use client'

import { type RefObject, useLayoutEffect } from 'react'

/** Fixed bottom UI (sticky CTA, program actions) — consumed by chat, back-to-top, main padding */
export type MobileBottomVar = '--lbta-sticky-cta-h' | '--lbta-program-bar-h'

/**
 * Measures a fixed bottom element on small viewports and sets a CSS variable on `:root`.
 * Clears to `0px` when disabled, on unmount, or when viewport is `md` and up.
 */
export function useReportMobileBottomHeight(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  cssVar: MobileBottomVar
) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const set = (px: number) => root.style.setProperty(cssVar, `${px}px`)
    const clear = () => set(0)

    if (!enabled) {
      clear()
      return
    }

    const el = ref.current
    if (!el) {
      clear()
      return
    }

    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => {
      const node = ref.current
      if (!node) {
        clear()
        return
      }
      if (!mq.matches) {
        clear()
        return
      }
      set(node.offsetHeight)
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    mq.addEventListener('change', apply)
    return () => {
      ro.disconnect()
      mq.removeEventListener('change', apply)
      clear()
    }
  }, [enabled, cssVar, ref])
}
