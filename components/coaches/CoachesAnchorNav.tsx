'use client'

import { useEffect, useCallback } from 'react'

const LINKS = [
  { href: '#leadership', label: 'Leadership' },
  { href: '#team', label: 'Team' },
  { href: '#book', label: 'Book' },
] as const

export default function CoachesAnchorNav() {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (!href || href === '#') return
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      e.preventDefault()
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }, [])

  return (
    <nav
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-black/6"
      aria-label="Jump to section"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="flex gap-1">
          {LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={handleClick}
              className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk py-4 px-4 min-h-[48px] inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 rounded-[2px]"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
