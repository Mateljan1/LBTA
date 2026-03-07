export type ScheduleTab = 'programs' | 'calendar'

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
            aria-controls="programs-panel"
            className={`px-6 py-2.5 min-h-[48px] rounded-[2px] font-sans font-semibold text-[14px] transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
              activeTab === 'programs'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-gray-100'
            }`}
          >
            Programs & Pricing
          </button>
          <button
            onClick={() => onTabChange('calendar')}
            role="tab"
            aria-selected={activeTab === 'calendar'}
            aria-controls="calendar-panel"
            className={`px-6 py-2.5 min-h-[48px] rounded-[2px] font-sans font-semibold text-[14px] transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 ${
              activeTab === 'calendar'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-gray-100'
            }`}
          >
            Camps & Leagues
          </button>
        </div>
      </div>
    </div>
  )
}
