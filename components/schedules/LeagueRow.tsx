'use client'

interface LeagueRowProps {
  name: string
  season?: string
  weeks?: string
  format: string
  levels?: string
  price: string
  time?: string
  venue?: string
  deadline?: string
  weeklyApprox?: string
  onAction: () => void
  actionLabel?: string
}

export default function LeagueRow({
  name,
  season,
  weeks,
  format,
  levels,
  price,
  time,
  venue,
  deadline,
  weeklyApprox,
  onAction,
  actionLabel = 'Register',
}: LeagueRowProps) {
  const subtitle = [season, weeks ? `~${weeks} weeks` : null].filter(Boolean).join(' · ')
  const secondLine = time || venue
    ? [time, venue].filter(Boolean).join(' · ')
    : null

  return (
    <div className="border-b border-black/[0.06] last:border-b-0">
      {/* Desktop — 3-column grid row */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-8 px-6 py-5">
        {/* Col 1: League info */}
        <div className="min-w-0">
          <h3 className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-snug">
            {name}
          </h3>
          {subtitle && (
            <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
              {subtitle}
            </p>
          )}
          {secondLine && (
            <p className="font-sans text-[12px] text-brand-pacific-dusk/45 mt-0.5">
              {secondLine}
            </p>
          )}
        </div>

        {/* Col 2: Details */}
        <div className="w-[180px] flex-shrink-0 space-y-0.5">
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
            Format: {format}
          </p>
          {levels && (
            <p className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
              Levels: {levels}
            </p>
          )}
          {deadline && (
            <p className="font-sans text-[12px] font-medium text-brand-sunset-cliff leading-relaxed">
              Roster due: {deadline}
            </p>
          )}
        </div>

        {/* Col 3: Price + Action */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right w-[120px]">
            <p className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-tight">
              {price}
            </p>
            {weeklyApprox && (
              <p className="font-sans text-[12px] text-brand-pacific-dusk/45 mt-0.5">
                ~{weeklyApprox}/week
              </p>
            )}
          </div>

          <button
            onClick={onAction}
            aria-label={`${actionLabel} for ${name}`}
            className="inline-flex items-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
          >
            {actionLabel}
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile — stacked card */}
      <div className="md:hidden px-4 py-5">
        <h3 className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-snug">
          {name}
        </h3>
        {subtitle && (
          <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
            {subtitle}
          </p>
        )}
        {secondLine && (
          <p className="font-sans text-[12px] text-brand-pacific-dusk/45 mt-0.5">
            {secondLine}
          </p>
        )}

        <div className="mt-4 space-y-0.5">
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80">Format: {format}</p>
          {levels && (
            <p className="font-sans text-[13px] text-brand-pacific-dusk/80">Levels: {levels}</p>
          )}
          {deadline && (
            <p className="font-sans text-[12px] font-medium text-brand-sunset-cliff mt-1">
              Roster due: {deadline}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-serif text-[18px] font-medium text-brand-pacific-dusk">
            {price}
          </span>
          {weeklyApprox && (
            <span className="font-sans text-[12px] text-brand-pacific-dusk/45">
              · ~{weeklyApprox}/week
            </span>
          )}
        </div>

        <button
          onClick={onAction}
          aria-label={`${actionLabel} for ${name}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-3 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
        >
          {actionLabel}
          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
