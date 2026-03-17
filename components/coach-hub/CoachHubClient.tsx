'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { HubData } from '@/lib/coach-hub-types'
import type { SeasonsMap, CoachSchedulesMap } from '@/lib/coach-hub-types'
import { ProgramsTab } from '@/components/coach-hub/programs/ProgramsTab'
import { PrivateTab } from '@/components/coach-hub/tabs/PrivateTab'
import { LiveBallTab } from '@/components/coach-hub/tabs/LiveBallTab'
import { CardioTab } from '@/components/coach-hub/tabs/CardioTab'
import { CampsLeaguesTab } from '@/components/coach-hub/tabs/CampsLeaguesTab'
import { LBHSTab } from '@/components/coach-hub/tabs/LBHSTab'
import { HandbookTab } from '@/components/coach-hub/tabs/HandbookTab'
import { BinderOverlay } from '@/components/coach-hub/BinderOverlay'
import { GuideOverlay } from '@/components/coach-hub/GuideOverlay'

export type CoachHubInitialData = {
  hubData: HubData
  seasons: SeasonsMap
  coachSchedules: CoachSchedulesMap
}

export type ActiveTabId =
  | 'programs'
  | 'private'
  | 'liveball'
  | 'cardio'
  | 'camps'
  | 'lbhs'
  | 'handbook'

const TABS: { id: ActiveTabId; label: string }[] = [
  { id: 'programs', label: 'Programs' },
  { id: 'private', label: 'Private Lessons' },
  { id: 'liveball', label: 'LiveBall' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'camps', label: 'Camps & Leagues' },
  { id: 'lbhs', label: 'LBHS Team' },
  { id: 'handbook', label: 'Handbook' },
]

export default function CoachHubClient({
  initialData,
}: {
  initialData: CoachHubInitialData
}) {
  const [activeTab, setActiveTab] = useState<ActiveTabId>('programs')
  const [binderOpen, setBinderOpen] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [coach, setCoach] = useState<string>('')
  const [season, setSeason] = useState<string>('winter')
  const [week, setWeek] = useState(1)
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [config, setConfig] = useState<{
    players: number
    playerLevels: Record<string, string>
    equipment: Set<string>
  }>({ players: 4, playerLevels: {}, equipment: new Set(['Cones', 'Ball basket', 'Targets', 'TopSpinPro']) })

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') window.print()
  }, [])

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="min-h-screen bg-brand-morning-light text-brand-pacific-dusk">
      <header className="sticky top-0 z-50 bg-gradient-to-br from-brand-pacific-dusk to-brand-deep-water text-brand-sandstone shadow-lg px-4 py-3 md:px-6">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-headline text-brand-sandstone text-lg">Coach Hub</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Coach"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="px-2 py-1.5 rounded border border-brand-sandstone/20 bg-white/5 text-brand-sandstone text-xs font-medium"
            >
              <option value="">Select coach</option>
              {Object.keys(initialData.coachSchedules).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              aria-label="Season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="px-2 py-1.5 rounded border border-brand-sandstone/20 bg-white/5 text-brand-sandstone text-xs font-medium"
            >
              {Object.keys(initialData.seasons).map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setBinderOpen(true)}
              className="px-3 py-1.5 rounded border border-brand-sandstone/20 text-brand-sandstone text-xs font-semibold hover:bg-brand-sandstone/10 min-h-[36px]"
            >
              Week Binder
            </button>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="px-3 py-1.5 rounded border border-brand-sandstone/20 text-brand-sandstone text-xs font-semibold hover:bg-brand-sandstone/10 min-h-[36px]"
            >
              Guide
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded bg-brand-thousand-steps text-brand-pacific-dusk text-xs font-semibold hover:opacity-90 min-h-[36px]"
            >
              Print
            </button>
            <Link
              href="/api/coach-hub/logout"
              className="px-3 py-1.5 rounded border border-brand-sandstone/20 text-brand-sandstone text-xs font-semibold hover:bg-brand-sandstone/10 min-h-[36px] inline-flex items-center"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1320px] mx-auto px-4 py-4 md:px-6 md:py-6">
        <div className="flex gap-1 border-b-2 border-black/10 mb-4 overflow-x-auto">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`px-3 py-2 text-xs font-semibold whitespace-nowrap border-b-2 -mb-[2px] transition-colors min-h-[48px] ${
                activeTab === id
                  ? 'text-brand-pacific-dusk border-brand-thousand-steps'
                  : 'text-black/50 border-transparent hover:text-brand-pacific-dusk'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pane">
          {activeTab === 'programs' && (
            <ProgramsTab
              initialData={initialData}
              selectedProgram={selectedProgram}
              setSelectedProgram={setSelectedProgram}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              week={week}
              setWeek={setWeek}
              config={config}
              setConfig={setConfig}
              season={season}
              coach={coach}
            />
          )}
          {activeTab === 'private' && <PrivateTab initialData={initialData} />}
          {activeTab === 'liveball' && <LiveBallTab initialData={initialData} />}
          {activeTab === 'cardio' && <CardioTab initialData={initialData} />}
          {activeTab === 'camps' && <CampsLeaguesTab initialData={initialData} />}
          {activeTab === 'lbhs' && <LBHSTab initialData={initialData} />}
          {activeTab === 'handbook' && <HandbookTab initialData={initialData} />}
        </div>
      </div>

      {binderOpen && (
        <BinderOverlay
          initialData={initialData}
          coach={coach}
          season={season}
          week={week}
          onClose={() => setBinderOpen(false)}
        />
      )}
      {guideOpen && <GuideOverlay onClose={() => setGuideOpen(false)} />}
    </div>
  )
}
