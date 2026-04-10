import { formatUtrSessionDateLong, formatUtrSessionDateMonthDay, UTR_SPORTS_CLUB_REGISTER_URL } from '@/lib/utr-match-play'

interface UtrDropInScheduleProps {
  saturdays: string[]
  sundays: string[]
  grandFinalsIso: string
  /** Shown in Grand Finals row (from leagues JSON). */
  grandFinalsVenue?: string
  saturdayVenueLabel?: string
  sundayVenueLabel?: string
  variant?: 'light' | 'dark'
}

/**
 * Regular-season weekends (Sat + Sun) plus Grand Finals row. Dates from data/leagues-2026.json.
 */
export default function UtrDropInSchedule({
  saturdays,
  sundays,
  grandFinalsIso,
  grandFinalsVenue = 'Laguna Beach High School',
  saturdayVenueLabel = 'Alta Laguna Park',
  sundayVenueLabel = 'Laguna Beach HS',
  variant = 'light',
}: UtrDropInScheduleProps) {
  const isDark = variant === 'dark'

  const shell = isDark
    ? 'rounded-2xl border border-white/[0.09] bg-brand-deep-water/95 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.04] overflow-hidden'
    : 'rounded-2xl border border-brand-pacific-dusk/10 bg-white shadow-[0_8px_40px_rgba(27,58,92,0.06)] overflow-hidden'

  const thead = isDark
    ? 'border-b border-white/[0.08] bg-brand-deep-water'
    : 'border-b border-brand-pacific-dusk/10 bg-brand-deep-water'

  const th = isDark
    ? 'text-[11px] font-medium uppercase tracking-[0.14em] text-white/45'
    : 'text-[11px] font-bold uppercase tracking-[0.1em] text-white/90'

  const row = isDark
    ? 'border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.03] transition-colors'
    : 'border-b border-brand-pacific-dusk/[0.08] last:border-b-0 hover:bg-brand-morning-light/50 transition-colors'

  const tdWeek = isDark
    ? 'text-[15px] font-medium text-white tabular-nums'
    : 'text-[15px] font-medium text-brand-pacific-dusk tabular-nums'

  const tdDate = isDark ? 'text-[15px] text-white/85' : 'text-[15px] font-medium text-brand-pacific-dusk/90'

  const link = isDark
    ? 'text-brand-victoria-cove font-semibold underline underline-offset-4 decoration-brand-victoria-cove/40 hover:text-white'
    : 'text-brand-victoria-cove font-bold text-[13px] underline underline-offset-4 decoration-brand-victoria-cove/35 hover:text-brand-pacific-dusk'

  const finalsRow = isDark ? 'bg-brand-victoria-cove/[0.06]' : 'bg-brand-thousand-steps/[0.12]'

  const finalsText = isDark ? 'text-[15px] font-medium text-white' : 'text-[15px] font-bold text-brand-pacific-dusk'

  const foot = isDark
    ? 'px-5 py-5 md:px-8 md:py-6 border-t border-white/[0.08] bg-black/40'
    : 'px-5 py-5 md:px-8 md:py-6 border-t border-brand-pacific-dusk/8 bg-brand-morning-light/50'

  const footText = isDark
    ? 'text-[14px] md:text-[15px] font-sans font-light text-white/60 leading-relaxed max-w-3xl'
    : 'text-[14px] md:text-[15px] font-sans font-light text-brand-pacific-dusk/65 leading-relaxed max-w-3xl'

  const strong = isDark ? 'font-medium text-white' : 'font-medium text-brand-pacific-dusk'

  const gfLong = formatUtrSessionDateLong(grandFinalsIso)

  return (
    <div className={shell}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left font-sans">
          <caption className="sr-only">
            Season 1 weekend dates for UTR Match Play: Saturday and Sunday sessions plus Grand Finals
          </caption>
          <thead>
            <tr className={thead}>
              <th scope="col" className={`py-4 pl-5 pr-3 md:pl-8 ${th}`}>
                Week
              </th>
              <th scope="col" className={`py-4 px-3 ${th}`}>
                Saturday — {saturdayVenueLabel}
              </th>
              <th scope="col" className={`py-4 px-3 ${th}`}>
                Sunday — {sundayVenueLabel}
              </th>
              <th scope="col" className={`py-4 pr-5 md:pr-8 ${th}`}>
                <span className="sr-only">Division signup</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {saturdays.map((iso, i) => {
              const sunIso = sundays[i]
              return (
                <tr key={iso} className={row}>
                  <td className={`py-3.5 pl-5 md:pl-8 pr-3 ${tdWeek}`}>{i + 1}</td>
                  <td className={`py-3.5 px-3 ${tdDate}`}>{formatUtrSessionDateMonthDay(iso)}</td>
                  <td className={`py-3.5 px-3 ${tdDate}`}>
                    {sunIso ? formatUtrSessionDateMonthDay(sunIso) : '—'}
                  </td>
                  <td className={`py-3.5 pr-5 md:pr-8`}>
                    <a href="#divisions" className={link}>
                      Season signup →
                    </a>
                  </td>
                </tr>
              )
            })}
            <tr className={finalsRow}>
              <td className={`py-4 pl-5 md:pl-8 pr-3 ${tdWeek}`}>Finals</td>
              <td className={`py-4 px-3 md:col-span-2 ${finalsText}`} colSpan={2}>
                {gfLong} — {grandFinalsVenue}
              </td>
              <td className={`py-4 pr-5 md:pr-8`}>
                <a href="#grand-finals" className={link}>
                  Details ↓
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={foot}>
        <p className={footText}>
          Drop-ins register directly on the{' '}
          <a href={UTR_SPORTS_CLUB_REGISTER_URL} target="_blank" rel="noopener noreferrer" className={link}>
            UTR Sports
          </a>{' '}
          platform for any single weekend. Season registration covers all regular-season weekends plus Grand
          Finals. Rain? We&apos;ll schedule a makeup date and communicate by email and text the morning of.
        </p>
        <p className={`${footText} mt-3`}>
          Questions?{' '}
          <a href="mailto:andrew@lagunabeachtennisacademy.com" className={link}>
            andrew@lagunabeachtennisacademy.com
          </a>
        </p>
      </div>
    </div>
  )
}
