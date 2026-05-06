'use client'

import CampRow from './CampRow'
import type { CampWithWeeks } from '@/lib/camps-data'

interface CampsSectionProps {
  camps: CampWithWeeks[]
  onRegister: (camp: CampWithWeeks) => void
}

export default function CampsSection({ camps, onRegister }: CampsSectionProps) {
  return (
    <section id="camps" className="scroll-mt-28 bg-brand-morning-light py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <p className="font-sans text-eyebrow font-medium text-brand-pacific-dusk/60 uppercase mb-3">
          SEASONAL & HOLIDAY
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-2">
          Holiday Camps
        </h2>
        <div className="section-horizon mb-8 opacity-90" aria-hidden="true" />
        <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/60 max-w-[600px] mb-10">
          Morning and afternoon sessions during school breaks. Ages 5–17.
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
