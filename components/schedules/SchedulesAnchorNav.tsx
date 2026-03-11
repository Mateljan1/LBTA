'use client'

import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'programs', label: 'Programs' },
  { id: 'private', label: 'Private Lessons' },
  { id: 'camps', label: 'Camps' },
  { id: 'leagues', label: 'Leagues' },
] as const

const SECTION_IDS = SECTIONS.map((s) => s.id)

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}

export default function SchedulesAnchorNav() {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const ratiosRef = useRef<Record<string, number>>({})
  const isMountedRef = useRef(true)

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (id && (SECTION_IDS as readonly string[]).includes(id)) {
            ratiosRef.current[id] = entry.intersectionRatio
          }
        }
        // Section with largest visible ratio (works with tall sections and rootMargin band)
        const best = Object.entries(ratiosRef.current).reduce<[string, number] | null>((acc, [id, ratio]) => {
          if (ratio > 0 && (!acc || ratio > acc[1])) return [id, ratio]
          return acc
        }, null)
        if (isMountedRef.current) setActiveSectionId(best ? best[0] : null)
      },
      { root: null, rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.2, 0.5, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const handler = () => {
      if (isMountedRef.current) setReduceMotion(mq.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Run last so its cleanup runs first: any queued observer/media callback then sees isMountedRef.current === false
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return (
    <nav
      aria-label="Jump to section"
      className="sticky top-16 z-40 bg-white border-b border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <ul className="flex gap-1 overflow-x-auto py-0 no-scrollbar scroll-smooth md:gap-2 md:overflow-visible">
          {SECTIONS.map(({ id, label }) => {
            const isActive = activeSectionId === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(id)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`
                    inline-flex items-center min-h-[48px] px-4 md:px-5 py-3
                    font-sans text-[13px] md:text-[14px] font-medium
                    whitespace-nowrap
                    ${isActive ? 'text-brand-pacific-dusk font-semibold border-b-2 border-brand-victoria-cove -mb-[2px]' : 'text-brand-pacific-dusk/80'}
                    ${!reduceMotion ? 'transition-colors duration-200' : ''}
                    hover:text-brand-pacific-dusk
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-white
                    rounded-[2px]
                  `}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
