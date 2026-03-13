'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import homepageCopy from '@/data/homepage-copy.json'

const hero = homepageCopy.hero as (typeof homepageCopy)['hero']

export default function HomeHero() {
  const [heroParallax, setHeroParallax] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const handleScroll = () => setHeroParallax(window.scrollY * 0.3)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduceMotion])

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: '50% 70%',
          transform: reduceMotion ? undefined : `translateY(${heroParallax}px) scale(1.1)`,
        }}
        aria-label="Laguna Beach Tennis Academy training video"
        poster="/images/hero/hero-poster.webp"
      >
        {/* WebM first (better compression); MP4 for Safari. See docs/hero-video-optimization.md */}
        <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
        <source src="/videos/LBTA-Home-Hero.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0"
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
          <p className="font-sans text-[clamp(1rem,2.5vw,1.25rem)] font-light text-white/80 mt-4 mb-10 text-shadow-subtle max-w-2xl">
            {hero.subline}
          </p>
          <div className="flex flex-col items-start gap-8">
            <Link
              href={hero.ctaPrimaryHref}
              className="inline-flex items-center justify-center bg-white text-lbta-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded-none hover:bg-white/90 transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {hero.ctaPrimary}
            </Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-8 left-6 md:left-12 flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors duration-500 min-h-[48px] min-w-[48px] p-2 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        onClick={() => {
          const el = document.getElementById('founder')
          if (el) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
          }
        }}
        aria-label={hero.scrollAriaLabel}
      >
        <span
          className={`block w-px h-10 bg-white/50 ${reduceMotion ? '' : 'animate-pulse'}`}
          style={reduceMotion ? undefined : { animationDuration: '2.5s' }}
          aria-hidden
        />
        <span className="font-sans text-[11px] tracking-[0.25em] uppercase">Scroll</span>
      </button>
    </section>
  )
}
