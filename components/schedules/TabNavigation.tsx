export type ScheduleTab = 'programs' | 'calendar' | 'pricing'

interface TabNavigationProps {
  activeTab: ScheduleTab
  onTabChange: (tab: ScheduleTab) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6">
        <div className="flex justify-center gap-2 py-4" role="tablist">
          <button
            onClick={() => onTabChange('programs')}
            role="tab"
            aria-selected={activeTab === 'programs'}
            className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
              activeTab === 'programs'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-gray-100'
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => onTabChange('pricing')}
            role="tab"
            aria-selected={activeTab === 'pricing'}
            className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
              activeTab === 'pricing'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-gray-100'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            role="tab"
            aria-selected={activeTab === 'calendar'}
            className={`px-6 py-2.5 rounded-full font-sans font-semibold text-[14px] transition-all ${
              activeTab === 'calendar'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-gray-100'
            }`}
          >
            Camps & JTT
          </button>
        </div>
      </div>
    </div>
  )
}
