'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

type CampOption = { name: string; ages?: string; time?: string; price?: string }
type Camp = { id?: string; name: string; dates?: string; location?: string; coach?: string; options?: CampOption[] }

export function CampsLeaguesTab({ initialData }: { initialData: CoachHubInitialData }) {
  const camps = (initialData.hubData.camps ?? []) as Camp[]
  const leagues = (initialData.hubData.leagues ?? {}) as Record<string, unknown>
  return (
    <div className="space-y-8">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">Camps & Leagues</h3>
      <section>
        <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-3">Camps</h4>
        <div className="grid gap-4 md:grid-cols-2">
          {camps.map((camp) => (
            <div key={camp.id ?? camp.name} className="p-4 rounded-lg border border-black/10 bg-white">
              <h5 className="font-sans text-sm font-semibold text-brand-pacific-dusk">{camp.name}</h5>
              {camp.dates && <p className="font-sans text-xs text-black/60 mt-0.5">{camp.dates}</p>}
              {camp.location && <p className="font-sans text-xs text-black/60">{camp.location}</p>}
              {camp.coach && <p className="font-sans text-xs text-black/60">Coach: {camp.coach}</p>}
              {camp.options?.length ? (
                <ul className="mt-2 space-y-1">
                  {camp.options.map((opt, j) => (
                    <li key={j} className="font-sans text-xs text-brand-pacific-dusk/80">
                      {opt.name} · {opt.ages ?? ''} · {opt.time ?? ''} · {opt.price ?? ''}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
      {Object.keys(leagues).length > 0 && (
        <section>
          <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-3">Leagues</h4>
          <div className="p-4 rounded-lg border border-black/10 bg-brand-sandstone/30">
            <pre className="font-sans text-xs whitespace-pre-wrap text-brand-pacific-dusk/80">{JSON.stringify(leagues, null, 2)}</pre>
          </div>
        </section>
      )}
    </div>
  )
}
