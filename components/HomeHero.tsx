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
      className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center overflow-hidden"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: '50% 70%',
          transform: reduceMotion ? undefined : `translateY(${heroParallax}px) scale(1.1)`,
        }}
        aria-label="Laguna Beach Tennis Academy training video"
        poster="/images/hero/laguna-horizon.webp"
      >
        <source src="/videos/LBTA-Home-Hero.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" aria-hidden="true" />

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <p className="text-eyebrow text-white/70 mb-6 text-shadow-subtle">{hero.eyebrow}</p>
        <h1 className="font-headline text-[clamp(2.5rem,8vw,5rem)] font-light leading-[1.05] tracking-[-0.02em] mb-6 text-shadow-hero">
          Tennis, as it should
          <br className="hidden sm:block" /> be taught.
        </h1>
        <p className="font-headline text-[clamp(1.25rem,3vw,1.75rem)] font-light text-white/90 text-shadow-subtle">
          {hero.pillars}
        </p>
        <p className="font-sans text-[clamp(1rem,2.5vw,1.25rem)] font-light text-white/80 mt-4 mb-10 text-shadow-subtle max-w-2xl mx-auto">
          {hero.subline}
        </p>
        <div className="flex flex-col items-center gap-8">
          <Link
            href={hero.ctaPrimaryHref}
            className="inline-flex items-center justify-center bg-white text-lbta-black font-sans text-[14px] font-medium tracking-[0.1em] uppercase px-10 py-4 rounded-none hover:bg-white/90 transition-all duration-300 min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            {hero.ctaPrimary}
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center justify-center gap-2 hover:text-white/80 transition-colors duration-500 min-h-[48px] min-w-[48px] p-2 rounded-[2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        onClick={() => {
          const el = document.getElementById('founder')
          if (el) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
          }
        }}
        aria-label={hero.scrollAriaLabel}
      >
        <svg className={`w-5 h-5 shrink-0 ${reduceMotion ? '' : 'animate-bounce'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={reduceMotion ? undefined : { animationDuration: '2.5s' }} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  )
}
