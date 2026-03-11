'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Brand Kit horizon line — signature gradient divider between sections.
 * Uses the same gradient as globals.css .horizon-line (victoria-cove → sunset-cliff → thousand-steps).
 * Optional: scroll-triggered scaleX(0→1) animation when animate=true; gated on prefers-reduced-motion.
 */
export type HorizonDividerVariant = 'default' | 'thin'

interface HorizonDividerProps {
  variant?: HorizonDividerVariant
  className?: string
  /** When true, line animates in (scaleX) on scroll into view; disabled when prefers-reduced-motion */
  animate?: boolean
}

export default function HorizonDivider({
  variant = 'default',
  className = '',
  animate = false,
}: HorizonDividerProps) {
  const ref = useRef<HTMLHRElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const shouldAnimate = animate && !reduceMotion
  const base = 'w-full border-0'
  const variantClass = variant === 'thin' ? 'horizon-line-thin' : 'horizon-line'
  const animateClass = shouldAnimate ? 'horizon-animate' : ''
  const visibleClass = shouldAnimate && inView ? 'visible' : ''
  const combined = [base, variantClass, animateClass, visibleClass, className].filter(Boolean).join(' ')

  return <hr ref={ref} className={combined} aria-hidden="true" />
}
