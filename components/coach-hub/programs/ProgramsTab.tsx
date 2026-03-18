'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { CoachHubInitialData } from '@/lib/coach-hub-types'
import type { HubData, HubDrill, HubProgram, ProgramScheduleSlot } from '@/lib/coach-hub-types'
import { getWk, getAssessMode, getTm, getBlockLabels, getTodayDayName } from '@/lib/coach-hub-utils'

const CATS: Record<string, string> = { junior: 'Junior', youth: 'Youth & HP', adult: 'Adult', fitness: 'Fitness' }
const CC2: Record<string, string> = { junior: 'cj', youth: 'cy', adult: 'ca', fitness: 'cf' }

const DEFAULT_CONFIG: {
  players: number
  playerLevels: Record<string, string>
  equipment: Set<string>
} = {
  players: 4,
  playerLevels: {},
  equipment: new Set(['Cones', 'Ball basket', 'Targets', 'TopSpinPro']),
}

type ProgramsTabProps = {
  initialData: CoachHubInitialData
  selectedProgram: string | null
  setSelectedProgram: (id: string | null) => void
  selectedDay: string | null
  setSelectedDay: (day: string | null) => void
  week: number
  setWeek: (w: number) => void
  season: string
  coach: string
}

function getEffectiveSlot(
  selectedSlot: ProgramScheduleSlot | null,
  schedule: ProgramScheduleSlot[]
): ProgramScheduleSlot | null {
  if (!selectedSlot || schedule.length === 0) return schedule[0] ?? null
  const found = schedule.find(
    (s) => s.day === selectedSlot.day && s.time === selectedSlot.time && s.code === selectedSlot.code
  )
  return found ? selectedSlot : (schedule[0] ?? null)
}

function findPlan(hubData: HubData, stage: string, week: number, code: string): (string | number)[] | null {
  const plans = hubData.plans as (string | number)[][]
  return plans.find((p) => p[0] === stage && p[1] === week && p[2] === code) ?? null
}

function getTheme(hubData: HubData, stage: string, w: number): string {
  const plan = findPlan(hubData, stage, w, 'A')
  if (plan && plan[5]) return String(plan[5])
  return `Week ${w}`
}

export function ProgramsTab({
  initialData,
  selectedProgram,
  setSelectedProgram,
  selectedDay,
  setSelectedDay,
  week,
  setWeek,
  season,
  coach,
}: ProgramsTabProps) {
  const { hubData, seasons, coachSchedules } = initialData
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<ProgramScheduleSlot | null>(null)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const currentWk = getWk(seasons, season)
  const assess = getAssessMode(week, hubData.assessment_calendar)
  const todayName = getTodayDayName()
  const allPrograms = (hubData.programs || []) as HubProgram[]
  // Only show programs that have at least one schedule slot (group programs with session plans; private lessons are in Private tab)
  const programs = allPrograms.filter((p) => ((p.schedule as unknown[])?.length ?? 0) > 0)
  const SP = allPrograms.find((p) => p.id === selectedProgram) ?? null
  const schedule = (SP?.schedule || []) as ProgramScheduleSlot[]

  // If selected program has no schedule (e.g. private lesson), switch to first group program so session plan can show
  useEffect(() => {
    if (programs.length > 0 && selectedProgram && !programs.some((p) => p.id === selectedProgram)) {
      setSelectedProgram(programs[0].id)
    }
  }, [programs, selectedProgram, setSelectedProgram])

  useEffect(() => {
    if (!SP || schedule.length === 0) {
      setSelectedSlot(null)
      return
    }
    const stillValid = selectedSlot && schedule.some((s) => s.day === selectedSlot.day && s.time === selectedSlot.time && s.code === selectedSlot.code)
    if (!stillValid) setSelectedSlot({ day: schedule[0].day, time: schedule[0].time, code: schedule[0].code })
    // Intentionally only run when program/schedule identity changes; selectedSlot is read but not in deps to avoid reset loops
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SP?.id, schedule.length])
  const SD = getEffectiveSlot(selectedSlot, schedule)

  const stage = SP?.stage ?? ''
  const plan = SD ? findPlan(hubData, stage, week, SD.code) : null
  const templateId = plan?.[3] as string | undefined
  const duration = (SP?.duration as number) ?? 60
  const blockMins = getTm(templateId, duration)
  const BL = getBlockLabels()
  const drillIds = plan ? [plan[8], plan[9], plan[10], plan[11], plan[12], plan[13]] as (string | number)[] : []
  const drills = drillIds.map((id) => (id ? (hubData.drills as Record<string, HubDrill>)[String(id)] : null))

  const toggleEq = useCallback(
    (e: string) => {
      setConfig((prev) => {
        const next = new Set(prev.equipment)
        if (next.has(e)) next.delete(e)
        else next.add(e)
        return { ...prev, equipment: next }
      })
    },
    [setConfig]
  )

  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scrollOpts = reduceMotion ? { behavior: 'auto' as const } : { behavior: 'smooth' as const }

  const copyHomePractice = useCallback(() => {
    const lines: string[] = []
    drills.forEach((dr, i) => {
      if (dr?.n) lines.push(`${BL[i]}: ${dr.n}`)
    })
    const text = lines.join('\n')
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
    }
  }, [drills, BL])

  const todaySessions = coach ? (coachSchedules[coach]?.[todayName] as { time: string; prog: string; stage: string; loc: string }[] | undefined) ?? [] : []

  const weekOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1} — ${getTheme(hubData, stage, i + 1)}` })),
    [hubData, stage]
  )
  const playersMax = (hubData.stages as Record<string, { max?: number }>)?.[stage]?.max ?? 12

  return (
    <div className="space-y-4">
      {/* Today + Progress */}
      <section className="rounded-xl bg-gradient-to-br from-brand-deep-water to-brand-pacific-dusk text-brand-sandstone p-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-headline text-lg font-light">
          Today <em className="text-brand-thousand-steps">·</em> {todayName}
        </h2>
        <div className="flex flex-wrap gap-1">
          {todaySessions.slice(0, 6).map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const prog = programs.find((p) => p.name === s.prog)
                if (prog) {
                  setSelectedProgram(prog.id)
                  const sch = (prog.schedule as { day: string; time: string; code: string }[])?.find((x) => x.day === todayName && x.time === s.time)
                  if (sch) setSelectedSlot({ day: sch.day, time: sch.time, code: sch.code })
                }
                document.getElementById('session-builder')?.scrollIntoView(scrollOpts)
              }}
              className="text-[10px] px-2 py-1 rounded-full bg-brand-sandstone/10 text-brand-sandstone min-h-[48px]"
            >
              <strong className="text-brand-thousand-steps">{s.time}</strong> {s.prog}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${assess.cls === 'assess-baseline' ? 'bg-brand-sandstone/50 text-brand-pacific-dusk' : assess.cls === 'assess-pressure' ? 'bg-brand-sandstone/30 text-brand-thousand-steps' : assess.cls === 'assess-testing' ? 'bg-lbta-red/10 text-lbta-red' : 'bg-brand-tide-pool/20 text-brand-tide-pool'}`}>
            {assess.mode}
          </span>
        </div>
      </section>

      <section className="bg-white border border-black/10 rounded-lg p-3">
        <div className="text-[8px] font-bold uppercase tracking-wider text-black/50 mb-1">Progress · Week {currentWk} of 12</div>
        <div className="h-1.5 bg-brand-morning-light rounded overflow-hidden">
          <div className="h-full rounded bg-gradient-to-r from-brand-victoria-cove to-brand-thousand-steps transition-all duration-300" style={{ width: `${(currentWk / 12) * 100}%` }} />
        </div>
      </section>

      {/* Program grid */}
      <section>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2">
          {programs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedProgram(p.id)
                setSelectedSlot(null)
              }}
              className={`text-left p-3 rounded-lg border-2 transition-colors min-h-[48px] ${
                selectedProgram === p.id ? 'border-brand-pacific-dusk shadow ring-2 ring-brand-pacific-dusk/20' : 'border-black/10 hover:border-brand-thousand-steps'
              }`}
            >
              <span className={`text-[7px] font-bold uppercase px-1.5 py-0.5 rounded ${CC2[p.category as string] === 'cj' ? 'bg-brand-sandstone/50 text-brand-thousand-steps' : 'bg-black/5 text-black/60'}`}>
                {CATS[p.category as string] ?? p.category}
              </span>
              <h3 className="text-sm font-semibold text-brand-pacific-dusk mt-1">{p.name}</h3>
              <div className="text-[9px] text-black/50">{String(p.ages ?? '')} · {Number(p.duration) || 0}min · {String(p.coach ?? '')}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Session builder — only for programs with schedule (group programs) */}
      {SP && schedule.length === 0 && (
        <section className="rounded-xl bg-brand-sandstone/30 border border-black/10 text-brand-pacific-dusk p-4">
          <p className="text-sm font-medium">Session plans are for group programs.</p>
          <p className="text-xs text-black/60 mt-1">Select a program from the grid above to see the practice plan.</p>
        </section>
      )}
      {SP && schedule.length > 0 && (
        <section id="session-builder" className="border-2 border-brand-thousand-steps rounded-xl overflow-hidden">
          <div className="bg-gradient-to-br from-brand-pacific-dusk to-brand-deep-water text-brand-sandstone px-4 py-3 flex items-center justify-between">
            <h2 className="font-headline text-lg font-light">Session builder</h2>
          </div>
          <div className="p-4 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 border-b border-black/10">
            <div>
              <label htmlFor="players-on-court" className="block text-[7px] font-bold uppercase tracking-wider text-black/50 mb-1">Players on court</label>
              <input
                id="players-on-court"
                type="range"
                min={1}
                max={playersMax}
                value={config.players}
                onChange={(e) => {
                  const v = +e.target.value
                  setConfig((c) => ({ ...c, players: v }))
                }}
                className="w-full accent-brand-thousand-steps"
                aria-valuenow={config.players}
                aria-valuemin={1}
                aria-valuemax={playersMax}
              />
              <div className="text-center font-bold text-brand-pacific-dusk">{config.players}</div>
            </div>
            <div>
              <label className="block text-[7px] font-bold uppercase tracking-wider text-black/50 mb-1">Week (1–12)</label>
              <select
                value={week}
                onChange={(e) => setWeek(+e.target.value)}
                className="w-full px-2 py-1.5 border-2 border-black/10 rounded text-sm"
              >
                {weekOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-3 border-b border-black/10 flex flex-wrap gap-1">
            {schedule.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedSlot({ day: s.day, time: s.time, code: s.code })}
                className={`min-h-[48px] px-2.5 py-1.5 rounded border-2 text-xs font-semibold ${
                  SD?.day === s.day && SD?.time === s.time ? 'bg-brand-pacific-dusk text-brand-thousand-steps border-brand-pacific-dusk' : 'border-black/10 hover:border-brand-thousand-steps'
                }`}
              >
                {s.day.slice(0, 3)}{(s as { coach?: string }).coach ? ` (${(s as { coach?: string }).coach?.split(' ')[0] ?? ''})` : ''}
                <span className="block text-[7px] text-black/50">Code {s.code}</span>
              </button>
            ))}
          </div>
          <div className="p-3 flex flex-wrap gap-1">
            <span className="text-[7px] font-bold uppercase text-brand-thousand-steps w-full">Equipment</span>
            {['Cones', 'Ball basket', 'Targets', 'TopSpinPro', 'Nets', 'Med balls'].map((eq) => (
              <button
                key={eq}
                type="button"
                onClick={() => toggleEq(eq)}
                className={`text-[9px] px-2 py-1 rounded-full border min-h-[48px] ${config.equipment.has(eq) ? 'bg-brand-pacific-dusk border-brand-pacific-dusk text-brand-thousand-steps' : 'border-black/15'}`}
              >
                {eq}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Session plan — show when we have program + slot but no plan row (edge case) */}
      {SP && SD && !plan && (
        <section className="rounded-xl overflow-hidden bg-brand-sandstone/30 border border-black/10 text-brand-pacific-dusk p-4">
          <p className="text-sm font-medium">No session plan for this slot.</p>
          <p className="text-xs text-black/60 mt-1">Try another week (1–12) or a different day/slot above.</p>
        </section>
      )}
      {SP && SD && plan && (
        <section className="rounded-xl overflow-hidden bg-gradient-to-br from-brand-pacific-dusk to-brand-deep-water text-brand-sandstone p-4">
          <p className="text-[8px] font-bold uppercase tracking-wider text-brand-thousand-steps mb-1">Session plan</p>
          <h3 className="font-headline text-xl font-light mb-1">{SP.name} · Week {week} · Code {SD.code}</h3>
          <p className="text-[10px] text-brand-sandstone/70 mb-4">
            Theme: <strong>{String(plan[5])}</strong> · Focus: <strong>{String(plan[6])}</strong> · KPI: <strong className="text-lbta-red">{String(plan[7])}</strong>
          </p>
          <div className="space-y-0 border-t border-brand-sandstone/20">
            {drillIds.map((did, bi) => {
              const dr = drills[bi]
              const mins = blockMins[bi] ?? 0
              const open = expandedBlock === bi
              if (!did || mins === 0) return null
              return (
                <div key={bi} className="border-b border-brand-sandstone/20 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setExpandedBlock(open ? null : bi)}
                    className="w-full px-4 py-3 grid grid-cols-[55px_1fr_24px] gap-2 text-left hover:bg-white/5 transition-colors min-h-[48px]"
                  >
                    <div className="text-center">
                      <span className="text-base font-bold block">{mins}</span>
                      <span className="text-[7px] font-semibold uppercase text-brand-sandstone/70">{BL[bi]}</span>
                    </div>
                    <div>
                      <span className="text-[7px] font-bold uppercase px-1 py-0.5 rounded bg-brand-sandstone/10 text-brand-thousand-steps mr-1">Block</span>
                      <span className="text-sm font-semibold">{dr?.n ?? String(did)}</span>
                      {dr?.o && <p className="text-[9px] text-brand-sandstone/70 mt-0.5 line-clamp-1">{dr.o}</p>}
                    </div>
                    <span className="self-center text-brand-sandstone/70 transition-transform" style={{ transform: open ? 'rotate(180deg)' : undefined }}>▼</span>
                  </button>
                  {open && dr && (
                    <div className="px-4 pb-4 pl-[65px] space-y-3">
                      {dr.su && (
                        <div>
                          <div className="text-[7px] font-bold uppercase text-brand-thousand-steps mb-1">Setup</div>
                          <p className="text-[10px] whitespace-pre-line">{dr.su}</p>
                        </div>
                      )}
                      {dr.ex && (
                        <div>
                          <div className="text-[7px] font-bold uppercase text-brand-thousand-steps mb-1">Steps</div>
                          <p className="text-[10px] whitespace-pre-line">{dr.ex.replace(/^\d+[).]\s*/gm, '').trim()}</p>
                        </div>
                      )}
                      {dr.cu && (
                        <div>
                          <div className="text-[7px] font-bold uppercase text-brand-thousand-steps mb-1">Cues</div>
                          <p className="text-[10px] whitespace-pre-line">{dr.cu.split(/[•\n]/).map((c) => c.trim()).filter(Boolean).join('\n')}</p>
                        </div>
                      )}
                      {dr.ef && (
                        <div>
                          <div className="text-[7px] font-bold uppercase text-brand-thousand-steps mb-1">Errors / Fixes</div>
                          <p className="text-[10px] whitespace-pre-line">{dr.ef}</p>
                        </div>
                      )}
                      {dr.scale && (
                        <div>
                          <div className="text-[7px] font-bold uppercase text-brand-thousand-steps mb-1">Scale</div>
                          <p className="text-[10px]">{dr.scale}</p>
                        </div>
                      )}
                      <button type="button" className="text-[8px] font-semibold px-2 py-1 rounded border border-brand-sandstone/30 hover:bg-white/10 min-h-[48px]">Swap drill</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-sandstone/20">
            <div className="text-[8px] font-bold uppercase text-brand-thousand-steps mb-2">Home practice</div>
            <button
              type="button"
              onClick={copyHomePractice}
              className="min-h-[48px] px-3 py-2 rounded bg-brand-thousand-steps text-brand-pacific-dusk text-xs font-semibold"
            >
              Copy home practice
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
