'use client'

import Link from 'next/link'

interface SchedulesQuickActionsProps {
  onFindProgram?: () => void
  compact?: boolean
}

export default function SchedulesQuickActions({ onFindProgram, compact = false }: SchedulesQuickActionsProps) {
  const buttonBase =
    'inline-flex min-h-[48px] items-center justify-center rounded-[2px] px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.2px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

  return (
    <div
      className={
        compact
          ? 'grid grid-cols-2 gap-2'
          : 'grid w-full gap-3 sm:grid-cols-3'
      }
    >
      <Link
        href="/book"
        className={`${buttonBase} bg-black text-white hover:-translate-y-0.5 hover:bg-gray-800 focus-visible:ring-black/30 focus-visible:ring-offset-white`}
      >
        Book Trial
      </Link>
      <button
        type="button"
        onClick={onFindProgram}
        className={`${buttonBase} border border-brand-pacific-dusk/20 bg-brand-sandstone text-brand-pacific-dusk hover:border-brand-victoria-cove/70 hover:bg-brand-sandstone/70 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-white`}
      >
        Find My Program
      </button>
      <Link
        href="/schedules/calendar"
        className={`${buttonBase} border border-brand-pacific-dusk/20 bg-white text-brand-pacific-dusk hover:border-brand-victoria-cove/70 hover:bg-brand-morning-light focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-white ${compact ? 'col-span-2' : ''}`}
      >
        Calendar / PDF
      </Link>
    </div>
  )
}
