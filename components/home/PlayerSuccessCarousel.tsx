'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'

export type PlayerSuccessSlide = {
  subline: string
  ctaLabel: string
  ctaHref: string
  image: string
  imageAlt: string
  objectPosition?: string
}

export type PlayerSuccessCarouselProps = {
  eyebrow: string
  headline: string
  intervalMs: number
  slides: PlayerSuccessSlide[]
}

export default function PlayerSuccessCarousel({
  eyebrow,
  headline,
  intervalMs,
  slides,
}: PlayerSuccessCarouselProps) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = slides.length
  const safeIndex = count > 0 ? Math.min(activeIndex, count - 1) : 0
  const active = slides[safeIndex]

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      const next = ((index % count) + count) % count
      setActiveIndex(next)
    },
    [count]
  )

  const next = useCallback(() => {
    goTo(safeIndex + 1)
  }, [goTo, safeIndex])

  useEffect(() => {
    if (reduceMotion || count <= 1 || paused) return
    const id = window.setInterval(() => {
      next()
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [reduceMotion, count, intervalMs, next, paused])

  // Prefetch the next slide’s asset (original URL) so rotation feels instant without loading every slide at once.
  useEffect(() => {
    if (count <= 1) return
    const nextIdx = (safeIndex + 1) % count
    const href = slides[nextIdx]?.image
    if (!href) return
    const img = new window.Image()
    img.src = href
  }, [count, safeIndex, slides])

  if (count === 0 || !active) {
    return null
  }

  return (
    <section
      id="results"
      role="region"
      className="relative min-h-[65vh] lg:min-h-[76vh] flex items-center overflow-hidden"
      aria-roledescription="carousel"
      aria-label={`${eyebrow}: rotating player stories`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0">
        {/* One full-viewport image at a time — avoids loading N × 100vw optimized images on every homepage view */}
        <div className="absolute inset-0 z-10">
          <Image
            src={active.image}
            alt={active.imageAlt}
            fill
            className="object-cover brightness-[1.02] saturate-[1.02]"
            style={{
              objectPosition: active.objectPosition ?? '50% 20%',
            }}
            sizes="100vw"
            quality={100}
            loading="lazy"
            decoding="async"
          />
        </div>
        {/* Left-weighted scrim: strong behind copy; fades out toward the right so players stay visible */}
        <div
          className="absolute inset-0 z-[15] bg-gradient-to-r from-brand-deep-water/[0.88] from-0% via-black/35 via-[42%] to-transparent to-[68%] pointer-events-none"
          aria-hidden
        />
      </div>

      {count > 1 && (
        <div
          className="absolute right-4 top-1/2 z-30 -translate-y-1/2 flex flex-col gap-2 md:right-8"
          role="navigation"
          aria-label="Player story slides"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === safeIndex ? 'true' : undefined}
              aria-label={`Story ${i + 1} of ${count}`}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water ${
                i === safeIndex ? 'scale-125 bg-white' : 'bg-white/40 hover:bg-white/70'
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      <div className="relative z-20 container-lbta">
        <div className="max-w-xl pr-10 md:pr-14">
          <AnimatedSection>
            <span className="text-eyebrow text-white/90 mb-4 block">{eyebrow}</span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h2 className="font-headline text-[clamp(2.5rem,6vw,4rem)] font-light text-white leading-[1.15] tracking-[-0.02em] mb-6">
              {headline}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="text-body-lg text-white/80 mb-8" key={safeIndex}>
              {active.subline}
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <Link
              key={safeIndex}
              href={active.ctaHref}
              className="btn-ghost text-white/80 hover:text-white inline-flex items-center min-h-[48px]"
            >
              <span>{active.ctaLabel}</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
