'use client'

import { motion, useReducedMotion } from 'framer-motion'
import PullQuote from '@/components/ui/PullQuote'

const steps = [
  {
    label: 'Perceive',
    detail: 'Read the ball, the court, and the opponent.',
  },
  {
    label: 'Decide',
    detail: 'Choose the right shot before the ball arrives.',
  },
  {
    label: 'Move',
    detail: 'Get into position with balance and intent.',
  },
  {
    label: 'Execute',
    detail: 'Deliver the stroke with confidence.',
  },
]

export default function MethodSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="container-lbta section bg-brand-morning-light">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
          The Mateljan Method
        </span>
        <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-6">
          A coaching system, not a curriculum.
        </h2>
        <p className="font-sans text-body text-brand-pacific-dusk/70 max-w-2xl mx-auto mb-4 leading-relaxed">
          Every session runs on a documented coaching system built from twenty years of
          playing, coaching, and studying the game across three continents. Traditional
          coaching focuses only on the swing. We train the complete chain.
        </p>
        <p className="font-sans text-body-sm text-brand-pacific-dusk/55 max-w-2xl mx-auto mb-14 leading-relaxed">
          Whether a player is five or fifty, everyone learns the same shared language:
          the Five Ball Controls (depth, height, direction, speed, spin) and Phase Play
          (neutral, offensive, defensive).
        </p>

        {/* Four-step chain */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {steps.map((step, i) => {
            const Wrapper = reduceMotion ? 'div' : motion.div
            const props = reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-40px' },
                  transition: {
                    duration: 0.5,
                    delay: i * 0.12,
                    ease: [0.22, 0.61, 0.36, 1] as const,
                  },
                }
            return (
              <Wrapper key={step.label} {...props}>
                <div className="relative bg-white border border-brand-pacific-dusk/6 rounded-[2px] px-5 py-8 md:py-10 h-full flex flex-col items-center text-center">
                  <span className="font-sans text-[11px] font-medium tracking-[3px] uppercase text-brand-victoria-cove/60 mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-headline text-[22px] md:text-[26px] font-medium text-brand-pacific-dusk mb-2">
                    {step.label}
                  </h3>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed">
                    {step.detail}
                  </p>
                  {i < steps.length - 1 && (
                    <span
                      className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-brand-pacific-dusk/15 text-2xl select-none z-10"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  )}
                </div>
              </Wrapper>
            )
          })}
        </div>

        <PullQuote
          quote="Structure creates confidence. Confidence creates results."
          attribution="Andrew Mateljan"
        />
      </div>
    </section>
  )
}
