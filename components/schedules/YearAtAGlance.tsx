import type { ExtendedSeasonKey as SeasonKey } from '@/lib/season-utils'

interface Season {
  name: string
  dates: string
  weeks: number
  status: string
  multiplier: number
  [key: string]: unknown
}

interface YearAtAGlanceProps {
  seasons: Record<string, Season>
  selectedSeason: SeasonKey
  onSeasonChange: (season: SeasonKey) => void
}

export default function YearAtAGlance({ seasons, selectedSeason, onSeasonChange }: YearAtAGlanceProps) {
  return (
    <section className="bg-white py-8 md:py-12 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(seasons).map(([key, season]) => {
            const isActive = selectedSeason === key
            const isOpen = season.status === 'registration_open'
            
            return (
              <button
                key={key}
                onClick={() => onSeasonChange(key as SeasonKey)}
                className={`relative px-4 py-3 min-h-[48px] rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
                  isActive 
                    ? 'bg-black text-white shadow-lg scale-[1.02]' 
                    : 'bg-brand-morning-light hover:bg-gray-100 text-black'
                }`}
              >
                {isOpen && (
                  <span className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-tide-pool/10 text-brand-tide-pool'
                  }`}>
                    Open
                  </span>
                )}
                <h3 className={`font-serif text-[18px] md:text-[20px] font-semibold mb-1 ${isActive ? 'text-white' : 'text-black'}`}>
                  {season.name.split(' ')[0]}
                </h3>
                <p className={`font-sans text-[12px] mb-1 ${isActive ? 'text-white/80' : 'text-brand-pacific-dusk/80'}`}>
                  {season.dates}
                </p>
                <div className={`font-sans text-[13px] font-medium ${isActive ? 'text-white' : 'text-black'}`}>
                  {season.weeks} weeks
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
