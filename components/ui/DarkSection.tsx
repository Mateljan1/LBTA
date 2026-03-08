'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface DarkSectionProps {
  children: ReactNode
  id?: string
  className?: string
  /** Optional inner max-width container class (e.g. container-lbta) */
  containerClassName?: string
}

/**
 * Cinematic dark section with deep-water background and subtle radial overlay
 * (warm spots from flyer). Use for CTAs and key narrative sections.
 * Uses a subtle scroll-triggered entrance; respects prefers-reduced-motion.
 */
export default function DarkSection({
  children,
  id,
  className = '',
  containerClassName = 'container-lbta',
}: DarkSectionProps) {
  const reduceMotion = useReducedMotion()
  const Wrapper = reduceMotion ? 'section' : motion.section
  const wrapperProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] },
      }
  return (
    <Wrapper
      id={id}
      className={`relative bg-brand-deep-water overflow-hidden ${className}`}
      {...wrapperProps}
    >
      {/* Subtle radial gradients for depth (flyer-style glow) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 50%, rgba(232, 131, 74, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(46, 139, 139, 0.08) 0%, transparent 50%)',
        }}
      />
      <div className={`relative z-10 ${containerClassName}`}>{children}</div>
    </Wrapper>
  )
}
