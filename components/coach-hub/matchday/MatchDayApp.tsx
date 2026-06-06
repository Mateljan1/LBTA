'use client'

import { useState } from 'react'
import {
  LEVEL_DEFS,
  POD_ORDER,
  POD_META,
  generateRoundRobin,
  matchKey,
  orderPodPlayers,
  type Level,
  type Player,
  type PodId,
} from '@/lib/matchday-config'
import { buildExportMarkdown } from '@/lib/matchday-export'
import type { QuickBatch } from '@/lib/matchday-roster'
import { useMatchDay, type SyncStatus } from './useMatchDay'
import ScoreCounter from './ScoreCounter'
import MatchDayDraws from './MatchDayDraws'
import { PILL_BASE, PILL_TONE } from './matchday-ui'

type Tab = 'today' | 'draws' | 'add' | 'notes' | 'how'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'draws', label: 'Draws' },
  { id: 'add', label: 'Add player' },
  { id: 'notes', label: 'Notes' },
  { id: 'how', label: 'How' },
]

const LEVEL_OPTIONS: { value: Level; label: string }[] = [
  { value: 'red', label: 'Red ball (ages 4–8)' },
  { value: 'orange', label: 'Orange ball (ages 7–10)' },
  { value: 'green', label: 'Green ball (ages 9–12)' },
  { value: 'yellow', label: 'Yellow ball / Junior 1.0–2.5' },
  { value: 'adult1-3', label: 'Singles 1.0–3.0' },
  { value: 'adult3-5', label: 'Singles 3.0–5.0' },
  { value: 'adult5', label: 'Singles 5.0+' },
]

// Banner sits on the dark header, so tones are tuned for contrast on deep-water.
const SYNC_LABEL: Record<SyncStatus, { text: string; tone: string }> = {
  idle: { text: 'Ready', tone: 'text-white/55' },
  syncing: { text: 'Syncing…', tone: 'text-brand-victoria-cove' },
  ok: { text: 'Synced to Notion', tone: 'text-brand-tide-pool' },
  error: { text: 'Sync error — will retry', tone: 'text-brand-sunset-cliff' },
  offline: { text: 'Offline — queued', tone: 'text-brand-thousand-steps' },
  disabled: { text: 'Local only', tone: 'text-white/55' },
}

interface Props {
  weekName: string
  dayLabel: string
  syncToken: string | null
  quickBatches: QuickBatch[]
  rosterSource: 'utr-tracker' | 'fallback'
}

const CARD = 'rounded-soft border border-black/8 bg-brand-salt-air p-4 shadow-subtle'
const BTN_PRIMARY =
  'inline-flex items-center justify-center min-h-[48px] px-6 bg-brand-pacific-dusk text-white font-sans text-ui font-medium rounded-subtle transition-colors hover:bg-brand-deep-water focus:outline-none focus:ring-2 focus:ring-brand-pacific-dusk/30 focus:ring-offset-2 disabled:opacity-50'
const BTN_GHOST =
  'inline-flex items-center justify-center min-h-[48px] px-5 bg-brand-salt-air text-brand-pacific-dusk border border-black/15 font-sans text-ui font-medium rounded-subtle transition-colors hover:border-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2'

export default function MatchDayApp({
  weekName,
  dayLabel,
  syncToken,
  quickBatches,
  rosterSource,
}: Props) {
  const md = useMatchDay({ weekName, syncToken })
  const { state } = md
  const [tab, setTab] = useState<Tab>('today')

  // Add-player form.
  const [name, setName] = useState('')
  const [level, setLevel] = useState<Level>('red')
  const [age, setAge] = useState('')
  const [walkin, setWalkin] = useState(false)

  const sync = SYNC_LABEL[md.syncStatus]
  const activePods = POD_ORDER.filter((p) => state.players.some((x) => x.pod === p))

  let totalDone = 0
  let totalMatches = 0
  activePods.forEach((podId) => {
    const podPlayers = orderPodPlayers(state.players.filter((p) => p.pod === podId))
    generateRoundRobin(podPlayers).forEach((round) =>
      round.forEach(([a, b]) => {
        totalMatches++
        if (state.results[matchKey(podId, a.id, b.id)]) totalDone++
      })
    )
  })

  function submitAdd() {
    if (!name.trim()) return
    const added = md.addPlayer({
      name,
      level,
      age: age ? parseInt(age, 10) : null,
      walkin,
    })
    if (added) {
      setName('')
      setAge('')
      setWalkin(false)
      setTab('today')
    }
  }

  function loadBatch(batch: QuickBatch) {
    batch.players.forEach((pl) =>
      md.addPlayer({
        name: pl.name,
        level: pl.level,
        age: pl.age ?? null,
        utr: pl.utr ?? null,
        seed: pl.seed ?? null,
        pod: batch.pod,
      })
    )
    setTab('today')
  }

  async function copyExport() {
    const md5 = buildExportMarkdown({
      weekName,
      dayLabel,
      players: state.players,
      results: state.results,
      scores: state.scores,
      notes: state.notes,
    })
    try {
      await navigator.clipboard.writeText(md5)
      window.alert('Results copied. Text or email to Andrew — he uploads to UTR Sports + Notion.')
    } catch {
      window.alert('Could not copy automatically. Select the Notes tab to copy manually.')
    }
  }

  function assignWinnerFromScore(podId: PodId, a: Player, b: Player, winner: 'a' | 'b' | null) {
    if (!winner) return
    const id = winner === 'a' ? a.id : b.id
    const key = matchKey(podId, a.id, b.id)
    if (state.results[key] !== id) md.setWinner(podId, a.id, b.id, id)
  }

  return (
    <div className="max-w-[680px] mx-auto">
      {/* Header */}
      <header className="bg-brand-deep-water text-white px-5 pt-5 pb-3 sticky top-0 z-10">
        <p className="font-sans text-eyebrow-sm font-semibold text-white/55 uppercase">
          Coach Hub · Match Day
        </p>
        <h1 className="font-headline text-2xl text-white leading-tight">Match Play Runner</h1>
        <p className="font-sans text-ui-sm text-white/65 mt-0.5">
          {weekName} · {dayLabel} · Alta Laguna
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`font-sans text-eyebrow-sm font-semibold uppercase ${sync.tone}`}>
            {sync.text}
          </span>
        </div>
      </header>
      <hr className="horizon-line opacity-100 border-0" />

      {/* Tabs */}
      <nav
        role="tablist"
        aria-label="Match Day sections"
        className="flex bg-brand-sandstone border-b border-black/8 sticky top-[104px] z-[9] overflow-x-auto"
      >
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setTab(t.id)
                window.scrollTo({ top: 0 })
              }}
              className={`flex-1 min-w-[64px] py-3.5 px-1 font-sans text-ui-sm font-semibold uppercase tracking-[0.04em] whitespace-nowrap border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove ${
                active
                  ? 'border-brand-victoria-cove text-brand-deep-water'
                  : 'border-transparent text-brand-pacific-dusk/50'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </nav>

      <main className="px-4 py-4 pb-24">
        {tab === 'today' && (
          <TodayView
            md={md}
            activePods={activePods}
            totalDone={totalDone}
            totalMatches={totalMatches}
            onAssignWinner={assignWinnerFromScore}
            onGoAdd={() => setTab('add')}
            onGoHow={() => setTab('how')}
            onExport={copyExport}
          />
        )}

        {tab === 'draws' && (
          <MatchDayDraws players={state.players} results={state.results} scores={state.scores} />
        )}

        {tab === 'add' && (
          <div className="space-y-4">
            <div className={CARD}>
              <h2 className="font-headline text-headline-sm text-brand-pacific-dusk mb-1">
                Add a player
              </h2>
              <p className="font-sans text-body-sm text-brand-pacific-dusk/65 mb-4">
                Type their name as they walk up. Pick the level — the app puts them in the right pod
                and rebuilds matches.
              </p>
              <Field label="Player name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lucia Dziuk"
                  autoComplete="off"
                  className="w-full px-3.5 py-3 border border-black/15 rounded-subtle font-sans text-base text-brand-pacific-dusk bg-brand-salt-air focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove"
                />
              </Field>
              <Field label="Level">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="w-full px-3.5 py-3 border border-black/15 rounded-subtle font-sans text-base text-brand-pacific-dusk bg-brand-salt-air focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove"
                >
                  {LEVEL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Age (optional)">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 11"
                  min={3}
                  max={99}
                  className="w-full px-3.5 py-3 border border-black/15 rounded-subtle font-sans text-base text-brand-pacific-dusk bg-brand-salt-air focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove"
                />
              </Field>
              <label className="flex items-center gap-2.5 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={walkin}
                  onChange={(e) => setWalkin(e.target.checked)}
                  className="w-5 h-5 accent-brand-victoria-cove"
                />
                <span className="font-sans text-body-sm text-brand-pacific-dusk">
                  Walk-in — not registered on UTR
                </span>
              </label>
              <button onClick={submitAdd} className={`${BTN_PRIMARY} w-full`}>
                Add player
              </button>
            </div>

            <div className={CARD}>
              <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-1">
                Quick-load a batch
              </h3>
              <p className="font-sans text-body-sm text-brand-pacific-dusk/65 mb-3">
                {rosterSource === 'utr-tracker'
                  ? 'Pulled live from the UTR tracker. Tap one to drop them in.'
                  : 'Seeded sets for known sessions. Tap one to drop them in.'}
              </p>
              <div className="space-y-2.5">
                {quickBatches.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-subtle border border-black/8 bg-brand-sandstone/50 p-3"
                  >
                    <div className="font-sans text-ui font-semibold text-brand-pacific-dusk">
                      {b.label}
                    </div>
                    <div className="font-sans text-ui-sm text-brand-pacific-dusk/60 mb-1">
                      {b.note}
                    </div>
                    <div className="font-sans text-ui-sm italic text-brand-pacific-dusk/50 mb-2.5">
                      {b.players.map((p) => p.name).join(', ')}
                    </div>
                    <button onClick={() => loadBatch(b)} className={`${BTN_PRIMARY} w-full`}>
                      Load {b.players.length} player{b.players.length === 1 ? '' : 's'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'notes' && (
          <div className={CARD}>
            <h2 className="font-headline text-headline-sm text-brand-pacific-dusk mb-1">
              Coach notes
            </h2>
            <p className="font-sans text-body-sm text-brand-pacific-dusk/65 mb-3">
              No-shows, injuries, level mismatches, parent questions — anything Andrew should see.
              Saves automatically.
            </p>
            <textarea
              value={state.notes}
              onChange={(e) => md.setNotes(e.target.value)}
              placeholder={'Tap to type…\n\n• Sloane needs orange ball next week\n• Court 3 wind gate broken'}
              className="w-full min-h-[260px] p-3 border border-black/10 rounded-subtle font-sans text-body-sm text-brand-pacific-dusk bg-brand-salt-air resize-y focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove leading-relaxed"
            />
            <p className="font-sans text-eyebrow-sm text-brand-pacific-dusk/45 text-right mt-2 uppercase">
              {state.notesUpdated
                ? `Saved · ${new Date(state.notesUpdated).toLocaleString()}`
                : 'Auto-saves as you type'}
            </p>
          </div>
        )}

        {tab === 'how' && <HowView />}
      </main>
    </div>
  )
}

/* --------------------------- Today view --------------------------- */

function TodayView({
  md,
  activePods,
  totalDone,
  totalMatches,
  onAssignWinner,
  onGoAdd,
  onGoHow,
  onExport,
}: {
  md: ReturnType<typeof useMatchDay>
  activePods: PodId[]
  totalDone: number
  totalMatches: number
  onAssignWinner: (podId: PodId, a: Player, b: Player, winner: 'a' | 'b' | null) => void
  onGoAdd: () => void
  onGoHow: () => void
  onExport: () => void
}) {
  const { state } = md

  if (state.players.length === 0) {
    return (
      <div className="bg-brand-deep-water text-white rounded-soft p-6">
        <h2 className="font-headline text-2xl text-white mb-1.5">Welcome, Coach</h2>
        <p className="font-sans text-body-sm text-white/80 mb-4">
          No one in the system yet. As players walk up, tap Add player. Walk-ins (not on UTR) —
          check the box and we&rsquo;ll flag them for Andrew.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onGoAdd}
            className="inline-flex items-center justify-center min-h-[48px] px-6 bg-white text-brand-pacific-dusk font-sans text-ui font-medium rounded-subtle hover:bg-white/90 transition-colors"
          >
            Add first player
          </button>
          <button
            onClick={onGoHow}
            className="inline-flex items-center justify-center min-h-[48px] px-5 bg-white/12 text-white border border-white/30 font-sans text-ui font-medium rounded-subtle hover:bg-white/20 transition-colors"
          >
            Read How (1 min)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stat bar */}
      <div className="flex gap-2.5 p-3 bg-brand-sandstone rounded-soft">
        {[
          { n: state.players.length, l: 'Players' },
          { n: totalDone, l: 'Done' },
          { n: totalMatches, l: 'Matches' },
        ].map((s) => (
          <div key={s.l} className="flex-1 text-center">
            <span className="block font-headline text-3xl text-brand-pacific-dusk leading-none">
              {s.n}
            </span>
            <span className="block font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/55 uppercase mt-1">
              {s.l}
            </span>
          </div>
        ))}
      </div>

      {activePods.map((podId) => (
        <DivisionCard key={podId} podId={podId} md={md} onAssignWinner={onAssignWinner} />
      ))}

      <div className="flex gap-2 pt-2">
        <button onClick={onExport} className={`${BTN_GHOST} flex-1`}>
          Copy summary
        </button>
        <button
          onClick={() => {
            if (window.confirm('Reset everything (players, results, notes)?')) md.reset()
          }}
          className="inline-flex items-center justify-center min-h-[48px] px-5 flex-1 bg-brand-salt-air text-lbta-red border border-lbta-red/40 font-sans text-ui font-medium rounded-subtle hover:bg-lbta-red/5 transition-colors focus:outline-none focus:ring-2 focus:ring-lbta-red/30 focus:ring-offset-2"
        >
          Reset day
        </button>
      </div>
    </div>
  )
}

/* ------------------------- Division + matches ------------------------- */

function DivisionCard({
  podId,
  md,
  onAssignWinner,
}: {
  podId: PodId
  md: ReturnType<typeof useMatchDay>
  onAssignWinner: (podId: PodId, a: Player, b: Player, winner: 'a' | 'b' | null) => void
}) {
  const { state } = md
  const meta = POD_META[podId]
  const podPlayers = orderPodPlayers(state.players.filter((p) => p.pod === podId))
  const rounds = generateRoundRobin(podPlayers)

  // Bye preview for odd pods.
  let byeLine = ''
  if (podPlayers.length % 2 === 1) {
    byeLine = rounds
      .map((round, rI) => {
        const playing = new Set(round.flat().map((p) => p.id))
        const sitter = podPlayers.find((p) => !playing.has(p.id))
        return sitter ? `R${rI + 1} ${sitter.name.split(' ')[0]}` : ''
      })
      .filter(Boolean)
      .join(' · ')
  }

  return (
    <div
      className="rounded-soft border border-black/8 bg-brand-salt-air overflow-hidden shadow-subtle"
      style={{ borderTop: `4px solid ${meta.colorVar}` }}
    >
      <div className="px-4 py-3 border-b border-black/8">
        <div className="font-headline text-headline-sm text-brand-pacific-dusk leading-tight">
          {meta.name}
        </div>
        <div className="font-sans text-ui-sm text-brand-pacific-dusk/55 mt-0.5">
          {meta.format} · {podPlayers.length} player{podPlayers.length === 1 ? '' : 's'}
          {meta.courts ? ` · ${meta.courts} courts` : ''}
        </div>
      </div>

      {/* Roster chips */}
      <div className="px-4 py-2.5 bg-brand-sandstone/50 border-b border-black/8 flex flex-wrap gap-1.5">
        {podPlayers.map((p) => (
          <span
            key={p.id}
            className="inline-flex items-center gap-1.5 bg-brand-salt-air border border-black/8 px-2.5 py-1 rounded-full font-sans text-ui-sm font-medium text-brand-pacific-dusk"
          >
            {p.seed ? (
              <span className="bg-brand-deep-water text-white text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold">
                SEED {p.seed}
              </span>
            ) : null}
            <span className={`${PILL_BASE} ${PILL_TONE[LEVEL_DEFS[p.level].tone]}`}>
              {LEVEL_DEFS[p.level].label}
            </span>
            {p.name}
            {p.walkin ? (
              <span className="text-eyebrow-sm uppercase text-brand-pacific-dusk/50">Walk-in</span>
            ) : null}
            <button
              onClick={() => {
                if (window.confirm(`Remove ${p.name}?`)) md.removePlayer(p.id)
              }}
              aria-label={`Remove ${p.name}`}
              className="text-lbta-red font-bold px-0.5 hover:opacity-70"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Guidance + matches */}
      {podPlayers.length === 1 ? (
        <div className="px-4 py-4 font-sans text-ui-sm text-brand-pacific-dusk/70">
          <strong className="text-brand-pacific-dusk">{podPlayers[0].name}</strong> is on their own
          right now. Wait for another {LEVEL_DEFS[podPlayers[0].level].label} player, add a hitting
          partner as a walk-in, or move them to a higher pod if they can play up.
        </div>
      ) : (
        <>
          {podPlayers.length >= 7 && (
            <Callout>
              <strong>{podPlayers.length} players.</strong> Full round robin ={' '}
              {podPlayers.length - 1} matches each. Consider splitting into 2 sub-pods to keep wait
              time short.
            </Callout>
          )}
          {podPlayers.length === 2 && (
            <Callout>
              <strong>2 players.</strong> One match in a round robin. Coach&rsquo;s call: single
              match, best of 3, or king-of-the-court. Track it with the score counter.
            </Callout>
          )}
          {byeLine && (
            <div className="px-4 py-2 bg-brand-thousand-steps/10 border-b border-black/8 font-sans text-eyebrow-sm font-semibold uppercase text-brand-thousand-steps">
              Sits out: {byeLine}
            </div>
          )}
          {rounds.map((round, rIdx) =>
            round.map(([a, b], mIdx) => (
              <MatchRow
                key={matchKey(podId, a.id, b.id)}
                podId={podId}
                a={a}
                b={b}
                roundLabel={`Round ${rIdx + 1} · Match ${mIdx + 1}`}
                md={md}
                onAssignWinner={onAssignWinner}
              />
            ))
          )}
        </>
      )}
    </div>
  )
}

function MatchRow({
  podId,
  a,
  b,
  roundLabel,
  md,
  onAssignWinner,
}: {
  podId: PodId
  a: Player
  b: Player
  roundLabel: string
  md: ReturnType<typeof useMatchDay>
  onAssignWinner: (podId: PodId, a: Player, b: Player, winner: 'a' | 'b' | null) => void
}) {
  const { state } = md
  const key = matchKey(podId, a.id, b.id)
  const winnerId = state.results[key]
  const done = !!winnerId
  const meta = POD_META[podId]

  const playerBtn = (p: Player) => {
    const isWinner = winnerId === p.id
    return (
      <button
        onClick={() => md.setWinner(podId, a.id, b.id, p.id)}
        className={`flex-1 min-h-[60px] px-3 py-3 rounded-subtle border text-left font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove ${
          isWinner
            ? 'border-brand-tide-pool bg-brand-tide-pool/10 text-brand-tide-pool'
            : 'border-black/12 bg-brand-salt-air text-brand-pacific-dusk'
        }`}
      >
        <span className="block text-ui font-medium">{p.name}</span>
        <span className="block text-eyebrow-sm uppercase text-brand-pacific-dusk/50 mt-0.5">
          {LEVEL_DEFS[p.level].label}
        </span>
      </button>
    )
  }

  return (
    <div className={`px-4 py-3 border-b border-black/8 last:border-0 ${done ? 'bg-brand-tide-pool/5' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-sans text-eyebrow-sm font-semibold uppercase text-brand-pacific-dusk/50">
          {roundLabel}
        </span>
        <span
          className={`${PILL_BASE} ${
            done ? 'bg-brand-tide-pool/12 text-brand-tide-pool' : 'bg-brand-sandstone text-brand-pacific-dusk/60'
          }`}
        >
          {done ? 'Done' : 'Pending'}
        </span>
      </div>
      <div className="flex items-stretch gap-2 mb-2">
        {playerBtn(a)}
        <span className="self-center font-sans text-eyebrow-sm font-semibold tracking-[0.1em] text-brand-pacific-dusk/35">
          VS
        </span>
        {playerBtn(b)}
      </div>
      <ScoreCounter
        format={meta.scoring}
        aName={a.name}
        bName={b.name}
        value={state.scores[key] || ''}
        onScore={(s) => md.setScore(podId, a.id, b.id, s)}
        onWinner={(w) => onAssignWinner(podId, a, b, w)}
      />
    </div>
  )
}

/* ------------------------------ Bits ------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="block font-sans text-eyebrow-sm font-semibold uppercase text-brand-pacific-dusk/55 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 bg-brand-thousand-steps/10 border-b border-black/8 font-sans text-ui-sm text-brand-pacific-dusk/80 leading-relaxed">
      {children}
    </div>
  )
}

function HowView() {
  const steps = [
    ['Add players as they walk up', 'Tap Add player. Type name, pick level. The app routes them to the right pod and rebuilds the round robin. Tap a chip\u2019s × to remove.'],
    ['Tap the winner', 'On each match, tap whoever won — their name turns green. Use the +/- score counter to log games; it knows each pod\u2019s format and detects the winner for you.'],
    ['Take notes', 'Notes tab — anything Andrew should know. Auto-saves.'],
    ['End of day', 'Scores sync to Notion live when online. If sync is off, tap Copy summary and text it to Andrew.'],
  ]
  return (
    <div className="space-y-4">
      <div className="bg-brand-deep-water text-white rounded-soft p-5">
        <h2 className="font-headline text-2xl text-white mb-1">How to run today</h2>
        <p className="font-sans text-body-sm text-white/80">
          You&rsquo;re the coach. The app helps — it doesn&rsquo;t run the day. Read this once.
        </p>
      </div>
      <div className={CARD}>
        <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">The basics</h3>
        {steps.map(([title, body], i) => (
          <div key={i} className="flex gap-3.5 mb-4 last:mb-0 items-start">
            <span className="shrink-0 w-8 h-8 rounded-full bg-brand-victoria-cove text-white inline-flex items-center justify-center font-headline text-base">
              {i + 1}
            </span>
            <div>
              <strong className="block font-sans text-ui font-semibold text-brand-pacific-dusk mb-0.5">
                {title}
              </strong>
              <p className="font-sans text-body-sm text-brand-pacific-dusk/65 m-0">{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={CARD}>
        <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">
          Courts (Alta Laguna — 4 courts)
        </h3>
        <ul className="list-disc pl-5 font-sans text-body-sm text-brand-pacific-dusk/75 space-y-1.5 leading-relaxed">
          <li>Red ball keeps the lower net + 36&rsquo; lines. Hold that court for the session.</li>
          <li>At 4 PM, move nets back to full height on courts with no red ball play.</li>
          <li>Court 4 is multi-use — color ball or singles, your call on the net.</li>
          <li>
            Use your judgment on assignments, who plays who, and who sits a round. Don&rsquo;t wait
            on Andrew for small calls — just note anything unusual.
          </li>
        </ul>
      </div>
      <div className={CARD}>
        <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">What if…</h3>
        <ul className="list-disc pl-5 font-sans text-body-sm text-brand-pacific-dusk/75 space-y-1.5 leading-relaxed">
          <li>
            <strong>Odd number?</strong> One player sits per round — the app shows who and when.
          </li>
          <li>
            <strong>Walk-in not on UTR?</strong> Add them, check the box. Andrew handles upload +
            billing.
          </li>
          <li>
            <strong>Player arrives late / leaves early?</strong> Add or remove them — played results
            stay, remaining matches re-draw.
          </li>
          <li>
            <strong>Phone dies?</strong> Results live in the browser. Same phone + browser = still
            there.
          </li>
        </ul>
      </div>
    </div>
  )
}
