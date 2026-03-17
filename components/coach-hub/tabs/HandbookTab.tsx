'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

export function HandbookTab({ initialData }: { initialData: CoachHubInitialData }) {
  const { hubData } = initialData
  const advancement = (hubData.advancement ?? {}) as Record<string, string>
  const assessment = (hubData.assessment_calendar ?? {}) as Record<string, { mode?: string; coach_action?: string }>
  const wristbands = (hubData.wristbands ?? []) as unknown[]
  const parentComms = (hubData.parent_comms ?? {}) as Record<string, unknown>
  return (
    <div className="space-y-8">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">Coach Handbook</h3>
      <section>
        <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Advancement protocol</h4>
        <div className="space-y-2">
          {Object.entries(advancement).map(([key, val]) => (
            <div key={key} className="p-3 rounded-lg border border-black/10 bg-white">
              <span className="font-sans text-xs font-semibold text-brand-victoria-cove">{key}</span>
              <p className="font-sans text-sm text-brand-pacific-dusk/90 mt-1">{val}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Assessment calendar</h4>
        <div className="grid gap-2 md:grid-cols-2">
          {Object.entries(assessment).map(([week, a]) => (
            <div key={week} className="p-3 rounded-lg border border-black/10 bg-white">
              <span className="font-sans text-xs font-semibold text-brand-thousand-steps">Week {week}</span>
              <p className="font-sans text-sm font-medium text-brand-pacific-dusk mt-0.5">{a.mode ?? ''}</p>
              <p className="font-sans text-xs text-brand-pacific-dusk/70 mt-1">{a.coach_action ?? ''}</p>
            </div>
          ))}
        </div>
      </section>
      {wristbands.length > 0 && (
        <section>
          <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Wristband achievement system</h4>
          <div className="p-4 rounded-lg border border-black/10 bg-brand-sandstone/30">
            <pre className="font-sans text-xs whitespace-pre-wrap text-brand-pacific-dusk/80">{JSON.stringify(wristbands, null, 2)}</pre>
          </div>
        </section>
      )}
      {Object.keys(parentComms).length > 0 && (
        <section>
          <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Parent communication templates</h4>
          <div className="p-4 rounded-lg border border-black/10 bg-brand-sandstone/30">
            <pre className="font-sans text-xs whitespace-pre-wrap text-brand-pacific-dusk/80">{JSON.stringify(parentComms, null, 2)}</pre>
          </div>
        </section>
      )}
    </div>
  )
}
