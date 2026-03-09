'use client'

const SECTIONS = [
  { id: 'programs', label: 'Programs' },
  { id: 'private', label: 'Private Lessons' },
  { id: 'camps', label: 'Camps' },
  { id: 'leagues', label: 'Leagues' },
] as const

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}

export default function SchedulesAnchorNav() {
  return (
    <nav
      aria-label="Jump to section"
      className="sticky top-16 z-40 bg-white border-b border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <ul className="flex gap-1 overflow-x-auto py-0 no-scrollbar scroll-smooth md:gap-2 md:overflow-visible">
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(id)
                }}
                className="
                  inline-flex items-center min-h-[48px] px-4 md:px-5 py-3
                  font-sans text-[13px] md:text-[14px] font-medium text-brand-pacific-dusk/80
                  whitespace-nowrap
                  transition-colors duration-200
                  hover:text-brand-pacific-dusk
                  focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 focus:ring-offset-white
                  rounded-[2px]
                "
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
