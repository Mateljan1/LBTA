'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import { getUtrCircuitModalData } from '@/lib/utr-match-play'
import type { UtrDivisionCard } from '@/lib/utr-match-play'

interface UTRMatchPlayDivisionsProps {
  divisions: UtrDivisionCard[]
  /** Dark panels (legacy); light uses editorial photo-top cards. */
  variant?: 'light' | 'dark'
}

function isColorBall(name: string) {
  return name.toLowerCase().includes('color ball')
}

export default function UTRMatchPlayDivisions({
  divisions,
  variant = 'light',
}: UTRMatchPlayDivisionsProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const modalData = useMemo(() => getUtrCircuitModalData(), [])
  const isDark = variant === 'dark'

  if (!isDark) {
    return (
      <>
        <div className="grid gap-6 md:grid-cols-2 md:gap-6">
          {divisions.map((d) => {
            const ctaSunset = d.ctaStyle === 'sunset'
            const registerClass = ctaSunset
              ? 'bg-brand-sunset-cliff text-white hover:opacity-[0.92] focus-visible:ring-brand-sunset-cliff'
              : 'bg-brand-victoria-cove text-white hover:opacity-[0.92] focus-visible:ring-brand-victoria-cove'
            const dropClass = ctaSunset
              ? 'border border-brand-sunset-cliff/35 bg-brand-sunset-cliff/10 text-brand-sunset-cliff hover:bg-brand-sunset-cliff/15'
              : 'border border-brand-victoria-cove/30 bg-brand-victoria-cove/10 text-brand-victoria-cove hover:bg-brand-victoria-cove/15'

            return (
              <article
                key={d.name}
                className="flex flex-col overflow-hidden rounded-2xl border border-brand-pacific-dusk/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_12px_rgba(27,58,92,0.06)] transition-all duration-300 hover:border-brand-pacific-dusk/15 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,58,92,0.08)]"
              >
                {d.image ? (
                  <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-brand-sandstone">
                    <Image
                      src={d.image}
                      alt={d.imageAlt ?? `${d.name} division`}
                      fill
                      className="object-cover object-center"
                      style={
                        d.imageObjectPosition ? { objectPosition: d.imageObjectPosition } : undefined
                      }
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={92}
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-black/45 to-transparent"
                      aria-hidden="true"
                    />
                    {d.matchDay ? (
                      <span
                        className={`absolute right-3.5 top-3.5 z-[1] rounded-md px-3.5 py-1.5 font-sans text-[11px] font-extrabold uppercase tracking-[0.12em] text-white ${
                          d.matchDay === 'Saturday' ? 'bg-brand-victoria-cove/92' : 'bg-brand-sunset-cliff/92'
                        }`}
                      >
                        {d.matchDay}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col px-6 pb-6 pt-5 md:px-7 md:pt-6">
                  <h3 className="font-headline text-[1.65rem] font-bold leading-snug text-brand-pacific-dusk md:text-[1.75rem]">
                    {d.name}
                  </h3>
                  <p className="mt-1 font-sans text-[14px] text-brand-pacific-dusk/65">{d.level}</p>

                  {isColorBall(d.name) ? (
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 shrink-0 rounded-full bg-red-500 shadow-[0_2px_6px_rgba(204,51,51,0.35)]"
                          aria-hidden="true"
                        />
                        <span className="font-sans text-[14px] font-bold text-brand-pacific-dusk">Red</span>
                        <span className="font-sans text-[13px] text-brand-pacific-dusk/55">4–8</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 shrink-0 rounded-full bg-brand-sunset-cliff shadow-[0_2px_6px_rgba(232,131,74,0.35)]"
                          aria-hidden="true"
                        />
                        <span className="font-sans text-[14px] font-bold text-brand-pacific-dusk">
                          Orange
                        </span>
                        <span className="font-sans text-[13px] text-brand-pacific-dusk/55">7–10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-4 w-4 shrink-0 rounded-full bg-brand-tide-pool shadow-[0_2px_6px_rgba(45,158,62,0.25)]"
                          aria-hidden="true"
                        />
                        <span className="font-sans text-[14px] font-bold text-brand-pacific-dusk">
                          Green
                        </span>
                        <span className="font-sans text-[13px] text-brand-pacific-dusk/55">10–14</span>
                      </div>
                    </div>
                  ) : null}

                  {d.note ? (
                    <p className="mt-3 font-sans text-[13px] font-light italic text-brand-pacific-dusk/55">
                      {d.note}
                    </p>
                  ) : null}

                  <div className="mt-5 grid grid-cols-2 gap-2 gap-y-3">
                    <div>
                      <span className="block font-sans text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-pacific-dusk/45">
                        Venue
                      </span>
                      <span className="font-sans text-[14px] font-semibold text-brand-pacific-dusk">
                        {d.venue}
                      </span>
                    </div>
                    <div>
                      <span className="block font-sans text-[10px] font-extrabold uppercase tracking-[0.12em] text-brand-pacific-dusk/45">
                        Time
                      </span>
                      <span className="font-sans text-[14px] font-semibold text-brand-pacific-dusk">
                        {d.time}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t border-black/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-sans text-2xl font-extrabold tabular-nums text-brand-pacific-dusk">
                        {d.price}
                      </p>
                      <p className="font-sans text-[11px] font-semibold text-brand-pacific-dusk/45">
                        Season
                      </p>
                      {d.dropIn != null ? (
                        <p className="mt-1 font-sans text-[13px] text-brand-pacific-dusk/55">
                          {`Weekend reference $${d.dropIn} — contact us to arrange`}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        aria-label={`Register for ${d.name}`}
                        className={`inline-flex min-h-[44px] items-center justify-center rounded-md px-4 font-sans text-[13px] font-bold transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${registerClass}`}
                      >
                        Register
                      </button>
                      <Link
                        href="/contact"
                        className={`inline-flex min-h-[44px] items-center justify-center rounded-md px-4 font-sans text-[13px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pacific-dusk focus-visible:ring-offset-2 ${dropClass}`}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
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

  const cardClass =
    'bg-[#0c1829]/95 rounded-2xl border border-white/[0.09] p-5 md:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04] transition-all duration-300 hover:border-white/15 hover:shadow-[0_20px_56px_rgba(0,0,0,0.4)] hover:-translate-y-0.5'

  const imgWrap = 'border border-white/10 bg-[#0a1424]'

  return (
    <>
      <div className="grid gap-4 md:gap-5">
        {divisions.map((d) => (
          <div key={d.name} className={cardClass}>
            <div
              className={
                d.image
                  ? 'grid grid-cols-1 gap-6 md:grid-cols-[minmax(160px,200px)_1fr] md:gap-8 md:items-start'
                  : 'grid grid-cols-1 gap-6'
              }
            >
              {d.image ? (
                <div
                  className={`relative aspect-[4/5] w-full max-w-[200px] mx-auto md:mx-0 shrink-0 overflow-hidden rounded-lg ${imgWrap}`}
                >
                  <Image
                    src={d.image}
                    alt={d.imageAlt ?? `${d.name} division`}
                    fill
                    className="object-contain object-top"
                    style={
                      d.imageObjectPosition ? { objectPosition: d.imageObjectPosition } : undefined
                    }
                    sizes="(max-width: 767px) 100vw, 200px"
                    quality={90}
                  />
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(200px,240px)_1fr_auto] md:gap-8 md:items-center min-w-0">
                <div className="min-w-0">
                  <h3 className="font-headline text-[1.25rem] md:text-[1.375rem] text-white leading-snug">
                    {d.name}
                  </h3>
                  <p className="text-[14px] md:text-[15px] font-sans font-light text-white/65 mt-0.5">
                    {d.level}
                  </p>
                  {d.note ? (
                    <p className="text-[13px] font-sans font-light text-white/50 mt-2 italic">{d.note}</p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 sm:gap-x-6 sm:gap-y-1 text-[14px] font-sans min-w-0">
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 mb-0.5">
                      Venue
                    </span>
                    <span className="font-light text-white/85">{d.venue}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 mb-0.5">
                      Format
                    </span>
                    <span className="font-light text-white/85">{d.format}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 mb-0.5">
                      Time
                    </span>
                    <span className="font-light text-white/85">{d.time}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-white/45 mb-0.5">
                      Season
                    </span>
                    <span className="font-medium text-white tabular-nums">{d.price}</span>
                    {d.dropIn != null ? (
                      <span className="block text-[12px] font-light text-white/55 mt-0.5">
                        {`Weekend reference $${d.dropIn} — contact to arrange`}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex-shrink-0 md:justify-self-end">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    aria-label={`Register for ${d.name}`}
                    className="inline-flex items-center justify-center gap-2 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase min-h-[48px] px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 w-full md:w-auto"
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
