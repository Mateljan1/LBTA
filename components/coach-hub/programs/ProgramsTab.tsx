'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

type ProgramsTabProps = {
  initialData: CoachHubInitialData
  selectedProgram: string | null
  setSelectedProgram: (id: string | null) => void
  selectedDay: string | null
  setSelectedDay: (day: string | null) => void
  week: number
  setWeek: (w: number) => void
  config: { players: number; playerLevels: Record<string, string>; equipment: Set<string> }
  setConfig: React.Dispatch<React.SetStateAction<{ players: number; playerLevels: Record<string, string>; equipment: Set<string> }>>
  season: string
  coach: string
}

export function ProgramsTab(_props: ProgramsTabProps) {
  return (
    <div className="font-sans text-sm text-brand-pacific-dusk/70 py-8">
      Programs — Track D
    </div>
  )
}
