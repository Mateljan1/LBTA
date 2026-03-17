'use client'

import type { CoachHubInitialData } from '@/lib/coach-hub-types'

type LiveBallItem = { id?: string; name: string; level?: string; scoring?: string; rotation?: string; theme?: string; cues?: string }

export function LiveBallTab({ initialData }: { initialData: CoachHubInitialData }) {
  const list = (initialData.hubData.liveball ?? []) as LiveBallItem[]
  return (
    <div className="space-y-6">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">LiveBall ({list.length})</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((c, i) => (
          <div key={c.id ?? i} className="p-4 rounded-lg border border-black/10 bg-white">
            <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk">{c.name}</h4>
            {c.level && <p className="font-sans text-xs text-brand-victoria-cove mt-1">{c.level}</p>}
            {c.scoring && <p className="font-sans text-xs text-brand-pacific-dusk/80 mt-2"><span className="font-semibold">Scoring:</span> {c.scoring}</p>}
            {c.rotation && <p className="font-sans text-xs text-brand-pacific-dusk/80 mt-1"><span className="font-semibold">Rotation:</span> {c.rotation}</p>}
            {c.theme && <p className="font-sans text-xs text-brand-pacific-dusk/70 mt-1 italic">{c.theme}</p>}
            {c.cues && <p className="font-sans text-xs text-black/60 mt-2 whitespace-pre-line">{c.cues}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
