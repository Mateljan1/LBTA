'use client'

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

interface CampRowProps {
  camp: Camp
  onRegister: (camp: Camp) => void
  isLast?: boolean
}

export default function CampRow({ camp, onRegister, isLast }: CampRowProps) {
  return (
    <div
      className={`${!isLast ? 'border-b border-black/[0.06]' : ''} ${
        camp.featured ? 'border-l-[3px] border-l-brand-sunset-cliff' : ''
      }`}
    >
      {/* Desktop — 3-column grid row */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_auto] md:items-center gap-8 px-6 py-5">
        {/* Col 1: Camp info */}
        <div className="min-w-0">
          <h3 className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-snug">
            {camp.name}
          </h3>
          <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
            {camp.dates}
          </p>
          <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
            {camp.location}
          </p>
        </div>

        {/* Col 2: Details */}
        <div className="w-[180px] flex-shrink-0">
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
            Ages {camp.ages}
          </p>
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80 leading-relaxed">
            {camp.hours}
          </p>
        </div>

        {/* Col 3: Price + Register */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-right w-[120px]">
            <p className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-tight">
              ${camp.price}
              <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">/week</span>
            </p>
            {camp.perDay != null && (
              <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
                ${camp.perDay}/day
              </p>
            )}
          </div>

          <button
            onClick={() => onRegister(camp)}
            aria-label={`Register for ${camp.name}`}
            className="inline-flex items-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-6 py-3 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
          >
            Register
            <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile — stacked card */}
      <div className="md:hidden px-4 py-5">
        <h3 className="font-serif text-[20px] font-medium text-brand-pacific-dusk leading-snug">
          {camp.name}
        </h3>
        <p className="font-sans text-[13px] text-brand-pacific-dusk/60 mt-1">
          {camp.dates}
        </p>
        <p className="font-sans text-[12px] text-brand-pacific-dusk/70 mt-0.5">
          {camp.location}
        </p>

        <div className="mt-4 space-y-0.5">
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80">Ages {camp.ages}</p>
          <p className="font-sans text-[13px] text-brand-pacific-dusk/80">{camp.hours}</p>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-serif text-[18px] font-medium text-brand-pacific-dusk">
            ${camp.price}
            <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">/week</span>
          </span>
          {camp.perDay != null && (
            <span className="font-sans text-[12px] text-brand-pacific-dusk/70">
              · ${camp.perDay}/day
            </span>
          )}
        </div>

        <button
          onClick={() => onRegister(camp)}
          aria-label={`Register for ${camp.name}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase px-5 py-3 rounded-[2px] transition-all duration-300 ease-out active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 min-h-[48px]"
        >
          Register
          <svg className="w-3.5 h-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
