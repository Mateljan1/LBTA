import Link from 'next/link'
import { formatUtrSessionDateLong } from '@/lib/utr-match-play'

interface UtrDropInScheduleProps {
  saturdays: string[]
  grandFinalsIso: string
}

/**
 * Regular-season Saturdays with drop-in eligibility + Grand Finals row.
 * Dates come from data/leagues-2026.json (single source of truth).
 */
export default function UtrDropInSchedule({ saturdays, grandFinalsIso }: UtrDropInScheduleProps) {
  return (
    <div className="rounded-2xl border border-brand-pacific-dusk/10 bg-white shadow-[0_8px_40px_rgba(27,58,92,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left font-sans">
          <caption className="sr-only">
            Season 1 Saturday dates for UTR Match Play: regular season and Grand Finals
          </caption>
          <thead>
            <tr className="border-b border-brand-pacific-dusk/10 bg-brand-sandstone/80">
              <th scope="col" className="py-4 pl-5 pr-3 md:pl-8 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/55">
                Week
              </th>
              <th scope="col" className="py-4 px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/55">
                Date
              </th>
              <th scope="col" className="py-4 pr-5 md:pr-8 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/55">
                Drop-in
              </th>
            </tr>
          </thead>
          <tbody>
            {saturdays.map((iso, i) => (
              <tr
                key={iso}
                className="border-b border-brand-pacific-dusk/[0.06] last:border-b-0 hover:bg-brand-morning-light/40 transition-colors"
              >
                <td className="py-3.5 pl-5 md:pl-8 pr-3 text-[15px] font-medium text-brand-pacific-dusk tabular-nums">
                  {i + 1}
                </td>
                <td className="py-3.5 px-3 text-[15px] text-brand-pacific-dusk/90 max-w-[min(100%,280px)] sm:max-w-none">
                  {formatUtrSessionDateLong(iso)}
                </td>
                <td className="py-3.5 pr-5 md:pr-8 text-[14px] text-brand-pacific-dusk/65 leading-snug">
                  Available at your division&apos;s drop-in rate when space allows—register and note this
                  Saturday.
                </td>
              </tr>
            ))}
            <tr className="bg-brand-pacific-dusk/[0.04]">
              <td className="py-4 pl-5 md:pl-8 pr-3 text-[15px] font-medium text-brand-sunset-cliff">
                Finals
              </td>
              <td className="py-4 px-3 text-[15px] font-medium text-brand-pacific-dusk">
                {formatUtrSessionDateLong(grandFinalsIso)}
              </td>
              <td className="py-4 pr-5 md:pr-8 text-[14px] text-brand-pacific-dusk/65 leading-snug">
                Grand Finals night—division finals, awards, and exhibition. Details announced closer to the
                date.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-5 py-5 md:px-8 md:py-6 border-t border-brand-pacific-dusk/8 bg-brand-morning-light/50">
        <p className="text-[14px] md:text-[15px] font-sans font-light text-brand-pacific-dusk/65 leading-relaxed max-w-3xl">
          Drop-in is{' '}
          <strong className="font-medium text-brand-pacific-dusk">per Saturday</strong> at the price shown for
          your division below—subject to space. Season registration covers all regular-season Saturdays plus
          finals programming. Questions?{' '}
          <Link
            href="/contact"
            className="text-brand-victoria-cove font-medium underline underline-offset-4 decoration-brand-victoria-cove/40 hover:text-brand-pacific-dusk"
          >
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
