'use client'

export type StatAccent = 'sunset' | 'cove' | 'steps'

export interface StatItem {
  value: string
  label: string
  description?: string
  accent?: StatAccent
}

interface StatGridProps {
  items: StatItem[]
  /** Use dark theme (white/sandstone text on deep-water); default light (pacific-dusk text) */
  dark?: boolean
  className?: string
}

const accentColors: Record<StatAccent, string> = {
  sunset: 'text-brand-sunset-cliff',
  cove: 'text-brand-victoria-cove',
  steps: 'text-brand-thousand-steps',
}

export default function StatGrid({ items, dark = false, className = '' }: StatGridProps) {
  const textHeading = dark ? 'text-brand-sandstone' : 'text-brand-pacific-dusk'
  const textLabel = dark ? 'text-brand-sandstone' : 'text-brand-pacific-dusk'
  const textDesc = dark ? 'text-white/60' : 'text-brand-pacific-dusk/70'
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 ${className}`}
      role="list"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="text-center"
          role="listitem"
        >
          <div
            className={`font-headline text-[clamp(2.25rem,4vw,3rem)] font-light leading-none mb-2 ${item.accent ? accentColors[item.accent] : textHeading}`}
          >
            {item.value}
          </div>
          <div className={`font-sans text-sm font-semibold ${textLabel} mb-1`}>
            {item.label}
          </div>
          {item.description && (
            <p className={`font-sans text-sm font-normal leading-relaxed ${textDesc}`}>
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
