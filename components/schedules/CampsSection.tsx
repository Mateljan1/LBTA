'use client'

import CampRow from './CampRow'

interface Camp {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  featured?: boolean
}

interface CampsSectionProps {
  camps: Camp[]
  onRegister: (camp: Camp) => void
}

export default function CampsSection({ camps, onRegister }: CampsSectionProps) {
  return (
    <section id="camps" className="bg-brand-morning-light py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
          SEASONAL & HOLIDAY
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-3">
          Holiday Camps
        </h2>
        <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/60 max-w-[600px] mb-10">
          Full-day and half-day options during school breaks. Ages 5–17.
        </p>

        <div className="bg-white border border-black/[0.06] rounded-lg overflow-hidden">
          {camps.map((camp, i) => (
            <CampRow
              key={camp.id}
              camp={camp}
              onRegister={onRegister}
              isLast={i === camps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
