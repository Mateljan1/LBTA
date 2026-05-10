'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import PullQuote from '@/components/ui/PullQuote'

const steps = [
  { label: 'Perceive', detail: 'Read the ball, the court, the opponent.' },
  { label: 'Decide', detail: 'Choose the right shot before it arrives.' },
  { label: 'Move', detail: 'Get there with balance and intent.' },
  { label: 'Execute', detail: 'Deliver the stroke with confidence.' },
]

export default function MethodSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Photo side — full-bleed, cinematic */}
        <div className="relative w-full lg:w-[45%] min-h-[50vh] lg:min-h-[700px]">
          <Image
            src="/images/philosophy/movement-clinic-lbta-pics2.webp"
            alt="Structured coaching session at Laguna Beach Tennis Academy"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 35%' }}
            sizes="(max-width: 1024px) 100vw, 45vw"
            quality={80}
          />
          {/* Bottom gradient for mobile text readability */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(15,34,55,0.85) 100%)' }}
            aria-hidden="true"
          />
          {/* Right edge blend into dark content on desktop */}
          <div
            className="absolute inset-0 hidden lg:block bg-[linear-gradient(to_right,transparent_50%,var(--brand-deep-water)_100%)]"
            aria-hidden="true"
          />
        </div>

        {/* Content side */}
        <div className="relative flex-1 bg-brand-deep-water">
          {/* Radial depth glows */}
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(ellipse 90% 60% at 30% 40%, rgba(46,139,139,0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 70%, rgba(232,131,74,0.06) 0%, transparent 50%)',
            }}
          />

          <div className="relative z-10 px-6 py-14 md:px-10 md:py-20 lg:px-14 lg:py-24 max-w-2xl">
            <span className="font-sans text-eyebrow-sm font-bold uppercase text-brand-victoria-cove mb-5 block">
              The Mateljan Method
            </span>
            <h2 className="font-headline text-[clamp(2rem,4.5vw,3rem)] font-light text-white leading-[1.1] tracking-[-0.02em] mb-6">
              A coaching system,{' '}
              <span className="text-white/50">not a curriculum.</span>
            </h2>
            <p className="font-sans text-[16px] text-white/75 leading-[1.8] mb-4">
              Every session runs on a documented system built from twenty years
              of playing, coaching, and studying the game across three continents.
              Traditional coaching focuses on the swing. We train the complete chain.
            </p>
            <p className="font-sans text-[14px] text-white/50 leading-relaxed mb-10">
              Whether a player is five or fifty, everyone learns the same shared
              language: Five Ball Controls and Phase Play.
            </p>

            {/* Four steps — horizontal strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {steps.map((step, i) => {
                const Wrapper = reduceMotion ? 'div' : motion.div
                const props = reduceMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 20 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: '-40px' },
                      transition: {
                        duration: 0.45,
                        delay: i * 0.08,
                        ease: [0.22, 0.61, 0.36, 1] as const,
                      },
                    }
                return (
                  <Wrapper key={step.label} {...props}>
                    <div className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-6 text-center transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.16]">
                      <span className="font-sans text-eyebrow-sm font-bold uppercase text-brand-victoria-cove/60 mb-2 block">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-headline text-[20px] md:text-[22px] font-light text-white mb-1.5 tracking-[-0.01em]">
                        {step.label}
                      </h3>
                      <p className="font-sans text-[12px] text-white/55 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </Wrapper>
                )
              })}
            </div>

            <PullQuote
              quote="Structure creates confidence. Confidence creates results."
              attribution="Andrew Mateljan"
              variant="dark"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
