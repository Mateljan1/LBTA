'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

export interface PathwayStep {
  title: string
  eyebrow: string
  description: string
  image: string
  imageAlt: string
  objectPosition?: string
  details: string[]
  fromPrice?: string
  href: string
  cta?: string
  /** Visual accent: "invite" | "approval" to show a badge */
  badge?: string
}

interface PathwayTimelineProps {
  steps: PathwayStep[]
}

export default function PathwayTimeline({ steps }: PathwayTimelineProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative">
      {/* Vertical line (desktop only) */}
      <div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-pacific-dusk/8 via-brand-pacific-dusk/12 to-brand-pacific-dusk/4"
        aria-hidden="true"
      />

      <div className="space-y-10 md:space-y-0">
        {steps.map((step, i) => {
          const isEven = i % 2 === 0
          const Wrapper = reduceMotion ? 'div' : motion.div
          const wrapperProps = reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 32 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, margin: '-60px' },
                transition: {
                  duration: 0.55,
                  delay: 0.06,
                  ease: [0.22, 0.61, 0.36, 1] as const,
                },
              }

          return (
            <Wrapper
              key={step.title}
              className={`relative md:grid md:grid-cols-2 md:gap-12 md:py-10 ${
                isEven ? '' : 'md:direction-rtl'
              }`}
              {...wrapperProps}
            >
              {/* Dot on the center line */}
              <div
                className="hidden md:flex absolute left-1/2 top-14 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-brand-victoria-cove bg-brand-morning-light z-10 items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-victoria-cove" />
              </div>

              {/* Image side */}
              <div
                className={`relative aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-[2px] mb-5 md:mb-0 ${
                  isEven ? 'md:order-1' : 'md:order-2'
                }`}
                style={{ direction: 'ltr' }}
              >
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: step.objectPosition ?? '50% 40%' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  quality={90}
                />
                {step.badge && (
                  <span className="absolute top-3 left-3 bg-brand-deep-water/80 backdrop-blur-sm text-white/90 font-sans text-[10px] font-medium tracking-[2px] uppercase px-3 py-1.5 rounded-[2px]">
                    {step.badge}
                  </span>
                )}
              </div>

              {/* Content side */}
              <div
                className={`flex flex-col justify-center ${
                  isEven ? 'md:order-2 md:pl-4' : 'md:order-1 md:pr-4'
                }`}
                style={{ direction: 'ltr' }}
              >
                <span className="text-eyebrow text-brand-victoria-cove mb-2 block">
                  {step.eyebrow}
                </span>
                <h3 className="font-headline text-[24px] md:text-[30px] font-medium text-brand-pacific-dusk mb-3 leading-[1.2]">
                  {step.title}
                </h3>
                <p className="font-sans text-[15px] text-brand-pacific-dusk/65 leading-relaxed mb-4">
                  {step.description}
                </p>
                <ul className="space-y-1.5 mb-5">
                  {step.details.map((d) => (
                    <li
                      key={d}
                      className="font-sans text-[13px] text-brand-pacific-dusk/50 flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-brand-victoria-cove/40 mt-[7px] shrink-0" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-4">
                  {step.fromPrice && (
                    <span className="font-sans text-[13px] text-brand-pacific-dusk/50">
                      From {step.fromPrice}
                    </span>
                  )}
                  <Link
                    href={step.href}
                    className="font-sans text-[13px] font-medium text-brand-sunset-cliff hover:text-brand-sunset-cliff/80 transition-colors inline-flex items-center gap-1 min-h-[48px]"
                  >
                    {step.cta ?? 'View schedule'} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}
