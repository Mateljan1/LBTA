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
    <section className="relative bg-brand-deep-water overflow-hidden">
      {/* Background photo with heavy overlay */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/philosophy/craft-hp-class-lbta-pics2.webp"
          alt=""
          fill
          className="object-cover opacity-[0.30]"
          style={{ objectPosition: '50% 40%' }}
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep-water/70 via-brand-deep-water/80 to-brand-deep-water/90" />
      </div>
      {/* Radial depth glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 50%, rgba(46,139,139,0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(232,131,74,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 container-lbta py-20 md:py-28 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-sans text-[10px] font-bold tracking-[4px] uppercase text-brand-victoria-cove mb-5 block">
            The Mateljan Method
          </span>
          <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] font-light text-white leading-[1.1] tracking-[-0.02em] mb-6">
            A coaching system, not a curriculum.
          </h2>
          <p className="font-sans text-[16px] md:text-[17px] text-white/70 max-w-2xl mx-auto mb-5 leading-[1.75]">
            Every session runs on a documented system built from twenty years of playing, coaching,
            and studying the game across three continents. Traditional coaching focuses on the swing.
            We train the complete chain.
          </p>
          <p className="font-sans text-[15px] text-white/50 max-w-xl mx-auto mb-16 leading-relaxed">
            Whether a player is five or fifty, everyone learns the same shared language:
            Five Ball Controls and Phase Play.
          </p>

          {/* Four steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16">
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
                      delay: i * 0.1,
                      ease: [0.22, 0.61, 0.36, 1] as const,
                    },
                  }
              return (
                <Wrapper key={step.label} {...props}>
                  <div className="relative rounded-lg bg-white/[0.04] border border-white/[0.08] px-4 py-8 md:py-10 h-full flex flex-col items-center text-center backdrop-blur-[2px] transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14]">
                    <span className="font-sans text-[10px] font-bold tracking-[3px] uppercase text-brand-victoria-cove/50 mb-3">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-headline text-[22px] md:text-[26px] font-light text-white mb-2 tracking-[-0.01em]">
                      {step.label}
                    </h3>
                    <p className="font-sans text-[13px] text-white/55 leading-relaxed">
                      {step.detail}
                    </p>
                    {i < steps.length - 1 && (
                      <span
                        className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/[0.08] text-xl select-none z-10"
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
            variant="dark"
          />
        </div>
      </div>
    </section>
  )
}
