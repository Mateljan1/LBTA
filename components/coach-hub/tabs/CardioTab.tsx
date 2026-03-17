'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

type CardioItem = { id?: string; name: string; level?: string; work?: number; rest?: number; rounds?: number; task?: string; cues?: string }

export function CardioTab({ initialData }: { initialData: CoachHubInitialData }) {
  const list = (initialData.hubData.cardio ?? []) as CardioItem[]
  return (
    <div className="space-y-6">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">Cardio HIIT ({list.length})</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c, i) => (
          <div key={c.id ?? i} className="p-4 rounded-lg border border-black/10 bg-white">
            <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk">{c.name}</h4>
            {c.level && <p className="font-sans text-xs text-brand-victoria-cove mt-1">{c.level}</p>}
            <p className="font-sans text-xs text-brand-pacific-dusk/80 mt-2">
              <span className="font-semibold">Format:</span> {c.work}s/{c.rest}s × {c.rounds}
            </p>
            {c.task && <p className="font-sans text-xs text-brand-pacific-dusk/80 mt-1"><span className="font-semibold">Task:</span> {c.task}</p>}
            {c.cues && <p className="font-sans text-xs text-black/60 mt-2 whitespace-pre-line"><span className="font-semibold">Cues:</span> {c.cues}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
