import Link from 'next/link'
import type { CoachEntry } from '@/lib/coach-today-types'

export type CoachTab = 'today' | 'schedule' | 'lesson-plans'

interface TabDef {
  id: CoachTab
  label: string
  /** URL segment under /coach-hub/{slug}/ — defaults to id */
  slug?: string
}

const TABS: TabDef[] = [
  { id: 'today', label: 'Today' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'lesson-plans', label: 'Lesson Plans' },
]

interface Props {
  coach: CoachEntry
  /** Which tab is active. Defaults to "today" for any page that doesn't pass it explicitly. */
  activeTab?: CoachTab
  children: React.ReactNode
}

export default function CoachTodayShell({
  coach,
  activeTab = 'today',
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-brand-morning-light flex flex-col">
      <header className="border-b border-black/8 bg-brand-salt-air sticky top-0 z-10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-eyebrow-sm text-brand-victoria-cove">
              Coach Hub
            </p>
            <h1 className="font-headline text-brand-pacific-dusk text-lg leading-tight">
              {coach.firstName}&rsquo;s view
              {coach.location ? (
                <span className="font-sans text-sm font-normal text-brand-pacific-dusk/60 ml-3">
                  · {coach.location}
                </span>
              ) : null}
            </h1>
          </div>
          <nav className="flex items-center gap-3">
            <Link
              href="/coach-hub"
              className="font-sans text-xs uppercase tracking-[0.12em] text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-sm"
            >
              Shared Hub
            </Link>
            <a
              href={`/api/coach-hub/${coach.slug}/logout`}
              className="font-sans text-xs uppercase tracking-[0.12em] text-brand-pacific-dusk/70 hover:text-brand-pacific-dusk transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-sm"
            >
              Sign out
            </a>
          </nav>
        </div>
        <div
          role="tablist"
          aria-label="Coach view sections"
          className="max-w-[1100px] mx-auto px-4 sm:px-6 mt-3 flex gap-1 overflow-x-auto"
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab
            const segment = tab.slug ?? tab.id
            return (
              <Link
                key={tab.id}
                href={`/coach-hub/${coach.slug}/${segment}`}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'font-sans text-sm font-medium px-4 py-2.5 min-h-[44px] inline-flex items-center',
                  'border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-t-sm',
                  isActive
                    ? 'border-brand-victoria-cove text-brand-deep-water'
                    : 'border-transparent text-brand-pacific-dusk/65 hover:text-brand-pacific-dusk hover:border-black/15',
                ].join(' ')}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
