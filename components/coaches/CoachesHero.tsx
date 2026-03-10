'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function CoachesHero() {
  const [heroParallax, setHeroParallax] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (!mq) return
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
      id="leadership"
      className="relative min-h-[65vh] md:min-h-[78vh] flex items-end overflow-hidden scroll-mt-28"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/programs/schedules-hero.webp"
          alt="Laguna Beach Tennis Academy coaches and players training together"
          fill
          priority
          className="object-cover [filter:brightness(1.08)]"
          quality={90}
          style={{
            objectPosition: '50% 40%',
            transform: reduceMotion ? undefined : `translateY(${heroParallax}px)`,
          }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/75 via-black/25 to-transparent" aria-hidden="true" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pb-20 md:pb-32 pt-8">
        <p className="font-sans text-[11px] md:text-[12px] font-medium text-white/80 uppercase tracking-[0.2em] mb-4">
          Our Team
        </p>
        <h1 className="font-headline text-[42px] md:text-[72px] font-medium text-white leading-[1.05] mb-6 tracking-[-0.02em]">
          The Coaches
        </h1>
        <p className="font-sans text-[16px] md:text-[18px] text-white/90 max-w-[600px] leading-[1.75]">
          ATP/WTA-trained coaches who understand that tennis teaches more than technique. Movement. Craft. Community.
        </p>
      </div>
    </section>
  )
}
