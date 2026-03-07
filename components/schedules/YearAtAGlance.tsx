type SeasonKey = 'winter' | 'spring' | 'summer' | 'fall' | 'fall2025'

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
    <section className="bg-white py-12 md:py-20 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <h2 className="font-serif text-[28px] md:text-[40px] font-semibold text-center mb-4">
          2026 Year at a Glance
        </h2>
        <p className="font-sans text-[14px] md:text-[16px] text-black/60 text-center mb-10 max-w-2xl mx-auto">
          50 weeks of tennis across four seasons, plus holiday camps and competitive leagues
        </p>
        
        {/* Season Cards */}
        <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {Object.entries(seasons).map(([key, season]) => {
            const isActive = selectedSeason === key
            const isOpen = season.status === 'registration_open'
            
            return (
              <button
                key={key}
                onClick={() => onSeasonChange(key as SeasonKey)}
                className={`relative p-6 rounded-2xl text-left transition-all duration-300 ${
                  isActive 
                    ? 'bg-black text-white shadow-lg scale-[1.02]' 
                    : 'bg-brand-morning-light hover:bg-gray-100 text-black'
                }`}
              >
                {isOpen && (
                  <span className={`absolute top-4 right-4 text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-tide-pool/10 text-brand-tide-pool'
                  }`}>
                    Open
                  </span>
                )}
                <h3 className={`font-serif text-[20px] md:text-[24px] font-semibold mb-2 ${isActive ? 'text-white' : 'text-black'}`}>
                  {season.name.split(' ')[0]}
                </h3>
                <p className={`font-sans text-[13px] mb-3 ${isActive ? 'text-white/80' : 'text-black/60'}`}>
                  {season.dates}
                </p>
                <div className={`font-sans text-[14px] font-medium ${isActive ? 'text-white' : 'text-black'}`}>
                  {season.weeks} weeks
                </div>
              </button>
            )
          })}
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center">
            <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">50</div>
            <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Weeks of Tennis</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">7</div>
            <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Camp Programs</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">2</div>
            <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">JTT Seasons</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-[48px] md:text-[56px] font-light text-black leading-none">$50</div>
            <div className="font-sans text-[11px] md:text-[12px] text-black/50 uppercase tracking-[2px] mt-2">Early Bird Savings</div>
          </div>
        </div>
      </div>
    </section>
  )
}
