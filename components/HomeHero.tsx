'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import homepageCopy from '@/data/homepage-copy.json'
import { events } from '@/lib/analytics'

type HeroCopy = (typeof homepageCopy)['hero'] & {
  ctaSecondary?: string
  ctaSecondaryHref?: string
  pricingHint?: string
  pricingHintHref?: string
}

const hero = homepageCopy.hero as HeroCopy

const HERO_POSTER = '/images/hero/hero-poster.webp'

export default function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [heroParallax, setHeroParallax] = useState(0)
  const scrollRafRef = useRef<number | null>(null)
  const lastParallaxRef = useRef(0)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setTimeout(() => {
      // On mobile, let the poster carry the hero; only load video on larger viewports.
      if (window.innerWidth >= 768) {
        videoRef.current?.load()
      }
    }, 0)
    return () => clearTimeout(id)
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    const handleScroll = () => {
      if (scrollRafRef.current !== null) return
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = null
        const nextParallax = window.scrollY * 0.3
        if (Math.abs(nextParallax - lastParallaxRef.current) < 0.5) return
        lastParallaxRef.current = nextParallax
        setHeroParallax(nextParallax)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current)
        scrollRafRef.current = null
      }
    }
  }, [reduceMotion])

  const parallaxStyle =
    reduceMotion ? undefined : { transform: `translateY(${heroParallax}px) scale(1.1)` }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
    >
      {/* LCP: static poster (next/image priority); video loads after paint and fades in on play */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={parallaxStyle}>
          <div className="relative h-full w-full">
            <Image
              src={HERO_POSTER}
              alt="Laguna Beach Tennis Academy courts at dusk"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: '50% 70%' }}
            />
          </div>
        </div>
      </div>

      {!reduceMotion ? (
        <div className="absolute inset-0 z-[1]" style={parallaxStyle}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out pointer-events-none ${
              videoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: '50% 70%' }}
            aria-label="Laguna Beach Tennis Academy training video"
            onPlaying={() => setVideoPlaying(true)}
          >
            <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
            <source
              src="/legacy-working-assets/videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      ) : null}

      <div
        className="absolute inset-0 z-[2]"
        style={{ background: 'var(--golden-hour-overlay)' }}
        aria-hidden="true"
      />

      {/* Content area starts below fixed header; extra top clearance so headline isn't clipped in all browsers */}
      <div className="absolute top-24 md:top-28 left-0 right-0 bottom-0 z-10 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-24 md:pb-32 pt-16 md:pt-20">
        <div className="max-w-[600px] w-full text-left text-white [text-rendering:geometricPrecision]">
          <p className="text-eyebrow text-white/70 mb-6 text-shadow-subtle">{hero.eyebrow}</p>
          <h1 className="font-headline text-[clamp(3rem,9vw,5.25rem)] font-light leading-[1.12] tracking-[-0.02em] mb-6 text-shadow-hero block overflow-visible" style={{ marginLeft: 0, paddingLeft: 0 }}>
            {hero.tagline.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="font-headline text-[clamp(1.25rem,3vw,1.75rem)] font-light text-white/90 text-shadow-subtle">
            {hero.pillars}
          </p>
          <p
            className={`font-sans text-[clamp(1rem,2.5vw,1.25rem)] font-light text-white/80 mt-4 text-shadow-subtle max-w-2xl ${hero.pricingHint && hero.pricingHintHref ? 'mb-4' : 'mb-10'}`}
          >
            {hero.subline}
          </p>
          {hero.pricingHint && hero.pricingHintHref ? (
            <p className="mb-10 max-w-2xl">
              <Link
                href={hero.pricingHintHref}
                onClick={() => events.heroCta('pricing_hint', hero.pricingHintHref ?? '/schedules')}
                className="font-sans text-[15px] md:text-[16px] font-medium text-brand-victoria-cove underline underline-offset-4 decoration-white/30 hover:decoration-brand-victoria-cove hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
              >
                {hero.pricingHint}
              </Link>
            </p>
          ) : null}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 w-full max-w-xl">
            <Link
              href={hero.ctaPrimaryHref}
              onClick={() => events.heroCta('primary', hero.ctaPrimaryHref)}
              className="inline-flex items-center justify-center bg-white text-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded-none hover:bg-white/90 transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {hero.ctaPrimary}
            </Link>
            {hero.ctaSecondary && hero.ctaSecondaryHref ? (
              <Link
                href={hero.ctaSecondaryHref}
                onClick={() => events.heroCta('secondary', hero.ctaSecondaryHref)}
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded-none hover:bg-white/10 transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                {hero.ctaSecondary}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-8 left-6 md:left-12 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors duration-500 min-h-[48px] min-w-[48px] p-2 rounded-full border border-white/40 bg-black/10 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        onClick={() => {
          const el = document.getElementById('founder')
          if (el) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
          }
        }}
        aria-label={hero.scrollAriaLabel}
      >
        <svg
          className={`h-4 w-4 ${reduceMotion ? '' : 'animate-bounce'}`}
          style={reduceMotion ? undefined : { animationDuration: '2s' }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M12 5v14m0 0-5-5m5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  )
}
