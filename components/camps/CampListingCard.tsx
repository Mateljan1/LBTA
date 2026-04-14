import Image from 'next/image'
import type { CampWeek, CampWithWeeks } from '@/lib/camps-data'
import { campMainPriceSuffix, campPerDaySecondaryLine } from '@/lib/camp-pricing-display'

/** Optional hero image per camp id — editorial feel without one image per card in data */
const CAMP_IMAGES: Partial<Record<string, string>> = {
  summer: '/images/camps/camp-action-1.webp',
  'swim-tennis': '/images/camps/camp-action-2.webp',
  'ski-week': '/images/camps/camp-action-1.webp',
  thanksgiving: '/images/camps/camp-action-3.webp',
  'winter-break': '/images/camps/camp-action-1.webp',
  'back-to-school': '/images/camps/camp-action-2.webp',
}

const DEFAULT_CAMP_IMAGE = '/images/camps/camp-action-4.webp'

const TENNIS_GAMES_ALTS = [
  'Tennis and Games spring camp — young players on court at Alta Laguna Park',
  'Tennis and Games camp — drills and activities at LBTA',
  'Tennis and Games camp — junior players during spring session',
] as const

const imgMotion =
  'object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100'

export interface CampListingCardProps {
  camp: CampWithWeeks
  onRegister: (camp: CampWithWeeks & { selectedWeek?: CampWeek }) => void
}

const btnPrimary =
  'inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-[2px] bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all duration-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2'

const btnGhost =
  'inline-flex items-center justify-center min-h-[48px] w-full px-5 py-2.5 rounded-[2px] border border-black/15 bg-transparent text-brand-pacific-dusk font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all duration-300 hover:border-black/30 hover:bg-brand-morning-light/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2'

export default function CampListingCard({ camp, onRegister }: CampListingCardProps) {
  const tennisGames = camp.tennisGamesImages
  const imageSrc = CAMP_IMAGES[camp.id] ?? DEFAULT_CAMP_IMAGE
  const hasWeeks = camp.weeks && camp.weeks.length > 0

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[2px] border bg-white transition-shadow duration-500 ease-out ${
        camp.featured
          ? 'border-brand-pacific-dusk/20 shadow-[0_8px_40px_rgba(27,58,92,0.08)] ring-1 ring-black/[0.04]'
          : 'border-black/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(27,58,92,0.06)]'
      }`}
    >
      {camp.featured && (
        <div className="bg-brand-deep-water px-4 py-2 text-center">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90">
            Featured session
          </p>
        </div>
      )}

      {tennisGames && tennisGames.length > 0 ? (
        <div
          className="relative w-full overflow-hidden bg-brand-sandstone/50"
          role="group"
          aria-label="Tennis and Games camp photos"
        >
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {tennisGames.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-[3/4] min-h-[120px] overflow-hidden sm:aspect-[4/5] sm:min-h-[160px]"
              >
                <Image
                  src={src}
                  alt={TENNIS_GAMES_ALTS[i] ?? `Tennis and Games camp photo ${i + 1}`}
                  fill
                  className={imgMotion}
                  sizes="(max-width: 1024px) 34vw, 300px"
                  quality={90}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-[2px] bg-white/95 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-pacific-dusk shadow-sm">
                {camp.season}
              </span>
              <span className="inline-block rounded-[2px] bg-white/95 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/90 shadow-sm">
                Tennis &amp; Adventure
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-sandstone/50 md:aspect-[2.4/1]">
          <Image
            src={imageSrc}
            alt=""
            fill
            className={imgMotion}
            sizes="(max-width: 1024px) 100vw, min(896px, 90vw)"
            quality={88}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
          <div className="absolute bottom-3 left-4 right-4 md:bottom-4 md:left-6">
            <span className="inline-block rounded-[2px] bg-white/95 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-pacific-dusk shadow-sm">
              {camp.season}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-5 flex flex-col gap-2 border-b border-black/[0.06] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="font-headline text-[clamp(1.35rem,2.2vw,1.6rem)] font-medium leading-snug text-brand-pacific-dusk">
              {camp.name}
            </h3>
            <p className="mt-1 font-sans text-[13px] text-brand-pacific-dusk/55">Ages {camp.ages}</p>
          </div>
        </div>

        <p className="font-sans text-[15px] leading-relaxed text-brand-pacific-dusk/80">{camp.description}</p>

        <dl className="mt-6 space-y-3 font-sans text-[14px] text-brand-pacific-dusk/85">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 font-semibold uppercase tracking-[0.1em] text-brand-pacific-dusk/45 text-[11px]">
              Time
            </dt>
            <dd>{camp.hours}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
            <dt className="shrink-0 font-semibold uppercase tracking-[0.1em] text-brand-pacific-dusk/45 text-[11px]">
              Location
            </dt>
            <dd>{camp.location}</dd>
          </div>
        </dl>

        {hasWeeks ? (
          <div className="mt-8 border-t border-black/[0.06] pt-6">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-pacific-dusk/50">
                  Weeks & registration
                </p>
                <p className="mt-1 font-sans text-[13px] text-brand-pacific-dusk/65">
                  Pick a row to register for that week, or use the button below to choose in the form.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[2px] border border-black/[0.06] bg-brand-morning-light/40">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <caption className="sr-only">
                  {camp.name}: weeks, dates, and pricing
                </caption>
                <thead>
                  <tr className="border-b border-black/[0.06] bg-brand-sandstone/60 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/55">
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                      Week
                    </th>
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-4">
                      Dates
                    </th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold sm:px-4">
                      Session
                    </th>
                    <th scope="col" className="px-3 py-3 text-right sm:px-4">
                      <span className="sr-only">Register</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.05] font-sans text-[13px] text-brand-pacific-dusk">
                  {camp.weeks!.map((week) => (
                    <tr key={week.week} className="bg-white/80 transition-colors hover:bg-white">
                      <td className="whitespace-nowrap px-3 py-3 font-medium sm:px-4">{week.label}</td>
                      <td className="min-w-[140px] px-3 py-3 text-brand-pacific-dusk/85 sm:px-4">{week.dates}</td>
                      <td className="px-3 py-3 text-right sm:px-4">
                        <div className="tabular-nums font-medium text-brand-pacific-dusk">${week.price}</div>
                        {week.halfDay != null ? (
                          <div className="mt-0.5 text-[11px] text-brand-pacific-dusk/50">Half-day ${week.halfDay}</div>
                        ) : null}
                      </td>
                      <td className="px-2 py-2 text-right sm:px-3">
                        <button
                          type="button"
                          onClick={() => onRegister({ ...camp, selectedWeek: week })}
                          className={`${btnPrimary} min-h-[48px] px-3 py-2 text-[10px] tracking-[1.8px] sm:px-4`}
                        >
                          Register
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={() => onRegister(camp)} className={`${btnGhost} mt-4`}>
              Register — choose week in form
            </button>
          </div>
        ) : (
          <div className="mt-8 border-t border-black/[0.06] pt-6">
            <dl className="mb-6">
              <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/45">
                Dates
              </dt>
              <dd className="mt-1 font-sans text-[15px] text-brand-pacific-dusk">{camp.dates}</dd>
            </dl>
            <div className="mb-6">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/45">
                From
              </p>
              <p className="font-headline text-[clamp(1.75rem,3vw,2.25rem)] font-medium tabular-nums text-brand-pacific-dusk">
                ${camp.price}
                <span className="ml-1.5 font-sans text-[14px] font-medium text-brand-pacific-dusk/55">
                  / {campMainPriceSuffix(camp.id)}
                </span>
              </p>
              {camp.perDay != null && (
                <p className="mt-1 font-sans text-[13px] text-brand-pacific-dusk/55">
                  {campPerDaySecondaryLine(camp.id, camp.perDay)}
                  {camp.halfDay != null ? ` · Half-day ${camp.halfDay}` : null}
                </p>
              )}
            </div>
            <button type="button" onClick={() => onRegister(camp)} className={`${btnPrimary} w-full sm:w-auto`}>
              Register
            </button>
          </div>
        )}

        {camp.safetyNote && (
          <p className="mt-6 border-t border-black/[0.06] pt-4 font-sans text-[12px] italic leading-relaxed text-brand-pacific-dusk/50">
            {camp.safetyNote}
          </p>
        )}
      </div>
    </article>
  )
}
