'use client'

import type { CoachHubInitialData } from '@/lib/coach-hub-types'

type RosterPlayer = { rank: number; name: string; grade?: string; utr?: string; pos?: string }
type LBHSTeam = { name?: string; season?: string; head_coach?: string; asst_coach?: string; courts?: number; location?: string; roster?: RosterPlayer[] }

export function LBHSTab({ initialData }: { initialData: CoachHubInitialData }) {
  const team = (initialData.hubData.lbhs_team ?? {}) as LBHSTeam
  const roster = team.roster ?? []
  return (
    <div className="space-y-6">
      <h3 className="font-headline text-brand-pacific-dusk text-lg font-light">{team.name ?? 'LBHS Boys Tennis'}</h3>
      <p className="font-sans text-sm text-brand-pacific-dusk/70">
        {team.season} · {team.head_coach} (Head) · {team.asst_coach} (Asst) · {team.location}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/10">
              <th className="font-sans text-xs font-semibold uppercase text-black/50 py-2 pr-4">Rank</th>
              <th className="font-sans text-xs font-semibold uppercase text-black/50 py-2 pr-4">Name</th>
              <th className="font-sans text-xs font-semibold uppercase text-black/50 py-2 pr-4">Grade</th>
              <th className="font-sans text-xs font-semibold uppercase text-black/50 py-2 pr-4">UTR</th>
              <th className="font-sans text-xs font-semibold uppercase text-black/50 py-2 pr-4">Pos</th>
            </tr>
          </thead>
          <tbody>
            {roster.map((p) => (
              <tr key={`${p.rank}-${p.name ?? ''}`} className="border-b border-black/5">
                <td className="font-sans text-sm py-2 pr-4">{p.rank}</td>
                <td className="font-sans text-sm py-2 pr-4">{p.name}</td>
                <td className="font-sans text-sm py-2 pr-4">{p.grade ?? '—'}</td>
                <td className="font-sans text-sm py-2 pr-4">{p.utr ?? '—'}</td>
                <td className="font-sans text-sm py-2 pr-4">{p.pos ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
