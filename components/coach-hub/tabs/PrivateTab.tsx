'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

export function PrivateTab({ initialData }: { initialData: CoachHubInitialData }) {
  const { hubData } = initialData
  const privateStages = (hubData.private_stages ?? {}) as Record<string, string>
  const pricing = (hubData.private_pricing ?? {}) as Record<string, unknown>
  const entries = Object.entries(privateStages)
  return (
    <div className="space-y-6">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">Private Lessons</h3>
      <p className="font-sans text-sm text-brand-pacific-dusk/70">Year-round private lesson stages and pricing reference.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map(([label, stage]) => (
          <div key={label} className="p-4 rounded-lg border border-black/10 bg-white">
            <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk">{label}</h4>
            <p className="font-sans text-xs text-black/60 mt-0.5">Stage: {stage}</p>
          </div>
        ))}
      </div>
      {Object.keys(pricing).length > 0 && (
        <div className="p-4 rounded-lg border border-black/10 bg-brand-sandstone/30">
          <h4 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Pricing reference</h4>
          <pre className="font-sans text-xs whitespace-pre-wrap text-brand-pacific-dusk/80">{JSON.stringify(pricing, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
