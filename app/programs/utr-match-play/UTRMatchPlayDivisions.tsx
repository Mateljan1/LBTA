'use client'

import { useState, useMemo } from 'react'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import { getUtrCircuitModalData } from '@/lib/utr-match-play'
import type { UtrDivisionCard } from '@/lib/utr-match-play'

interface UTRMatchPlayDivisionsProps {
  divisions: UtrDivisionCard[]
}

export default function UTRMatchPlayDivisions({ divisions }: UTRMatchPlayDivisionsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const modalData = useMemo(() => getUtrCircuitModalData(), [])

  return (
    <>
      <div className="grid gap-4 md:gap-5">
        {divisions.map((d, index) => (
          <div
            key={d.name}
            className={[
              'bg-white rounded-xl border border-brand-pacific-dusk/8 p-5 md:p-6',
              'transition-all duration-300 hover:border-brand-pacific-dusk/15 hover:shadow-[0_8px_32px_rgba(27,58,92,0.08)] hover:-translate-y-0.5',
              index % 2 === 1 ? 'md:ml-6 lg:ml-10' : '',
            ].join(' ')}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-4 sm:gap-6 md:gap-8">
              {/* Left: Title + level + note */}
              <div className="min-w-0 flex-shrink-0 sm:basis-[200px] sm:flex-[0_0_200px] md:basis-[220px] md:flex-[0_0_220px]">
                <h3 className="font-headline text-[1.25rem] md:text-[1.375rem] text-brand-pacific-dusk leading-snug">
                  {d.name}
                </h3>
                <p className="text-[14px] md:text-[15px] font-sans font-light text-brand-pacific-dusk/70 mt-0.5">
                  {d.level}
                </p>
                {d.note ? (
                  <p className="text-[13px] font-sans font-light text-brand-pacific-dusk/55 mt-2 italic">
                    {d.note}
                  </p>
                ) : null}
              </div>

              {/* Center: Metadata grid — readable labels, fills space */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 sm:gap-x-8 sm:gap-y-1 text-[14px] font-sans flex-1 min-w-0 sm:min-w-[280px]">
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/55 mb-0.5">
                    Venue
                  </span>
                  <span className="font-light text-brand-pacific-dusk/85">{d.venue}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/55 mb-0.5">
                    Format
                  </span>
                  <span className="font-light text-brand-pacific-dusk/85">{d.format}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/55 mb-0.5">
                    Time
                  </span>
                  <span className="font-light text-brand-pacific-dusk/85">{d.time}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-brand-pacific-dusk/55 mb-0.5">
                    Season
                  </span>
                  <span className="font-medium text-brand-pacific-dusk tabular-nums">{d.price}</span>
                  {d.dropIn != null ? (
                    <span className="block text-[12px] font-light text-brand-pacific-dusk/60 mt-0.5">
                      Drop-in ${d.dropIn}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Right: CTA */}
              <div className="flex-shrink-0 sm:self-center">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  aria-label={`Register for ${d.name}`}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase min-h-[44px] px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 w-full sm:w-auto"
                >
                  Register
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <LuxuryYearModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type="utr-circuit"
        data={modalData}
        season="spring"
      />
    </>
  )
}
