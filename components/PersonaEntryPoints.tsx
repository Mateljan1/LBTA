'use client'

import Link from 'next/link'

// Custom SVG illustrations - unique to LBTA
const JuniorIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Tennis racquet with small player silhouette */}
    <ellipse cx="24" cy="16" rx="10" ry="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M24 28V38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 38H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Strings */}
    <path d="M18 12H30M18 16H30M18 20H30" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
    <path d="M20 8V24M24 6V26M28 8V24" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
    {/* Small ball */}
    <circle cx="36" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M33 10C34.5 8.5 37.5 8.5 39 10" stroke="currentColor" strokeWidth="0.75" />
  </svg>
)

const AdultIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Stylized player in motion */}
    <circle cx="24" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M24 15V26" stroke="currentColor" strokeWidth="1.5" />
    <path d="M18 20L24 26L30 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 26L16 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 26L32 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Racquet swing arc */}
    <path d="M30 20C36 16 40 20 42 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" opacity="0.6" />
    {/* Ball trajectory */}
    <circle cx="40" cy="12" r="2.5" stroke="currentColor" strokeWidth="1" />
  </svg>
)

const CompetitiveIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
    {/* Trophy with tennis ball */}
    <path d="M16 8H32V14C32 20.627 28.418 26 24 26C19.582 26 16 20.627 16 14V8Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 12H12C12 16 14 18 16 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 12H36C36 16 34 18 32 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 26V32" stroke="currentColor" strokeWidth="1.5" />
    <path d="M18 32H30V36H18V32Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 36H32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Star */}
    <path d="M24 12L25.5 15L29 15.5L26.5 18L27 21.5L24 20L21 21.5L21.5 18L19 15.5L22.5 15L24 12Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15" />
  </svg>
)

const personas = [
  {
    Icon: JuniorIcon,
    title: "Junior Programs",
    subtitle: "Ages 3-17 · Red ball to tournament prep",
    href: "/programs/junior",
  },
  {
    Icon: AdultIcon,
    title: "Adult Training",
    subtitle: "All levels · Beginner to advanced",
    href: "/programs/adult",
  },
  {
    Icon: CompetitiveIcon,
    title: "High Performance",
    subtitle: "Competitive players · Tournament focus",
    href: "/programs/high-performance",
  }
]

export default function PersonaEntryPoints() {
  return (
    <section className="bg-white py-10 md:py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {personas.map((persona) => (
            <Link
              key={persona.title}
              href={persona.href}
              className="
                group flex items-center gap-4 p-4 md:p-5
                bg-white border border-black/8
                rounded-lg
                transition-all duration-300
                hover:border-black/20 hover:shadow-sm
              "
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-black/[0.03] flex items-center justify-center text-black/70 group-hover:text-black group-hover:bg-black/[0.05] transition-colors">
                <persona.Icon />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif text-[17px] font-medium text-black mb-0.5">
                  {persona.title}
                </p>
                <p className="font-sans text-[13px] text-black/50 leading-snug">
                  {persona.subtitle}
                </p>
              </div>
              <svg 
                className="w-5 h-5 text-black/20 flex-shrink-0 group-hover:text-black/40 group-hover:translate-x-0.5 transition-all" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
