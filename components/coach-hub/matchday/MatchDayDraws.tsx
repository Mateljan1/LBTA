'use client'

import {
  POD_ORDER,
  POD_META,
  LEVEL_DEFS,
  generateRoundRobin,
  matchKey,
  orderPodPlayers,
  computeStandings,
  type Player,
  type PodId,
} from '@/lib/matchday-config'

interface Props {
  players: Player[]
  results: Record<string, string>
  scores: Record<string, string>
}

interface CourtCell {
  podName: string
  podColor: string
  aName: string
  bName: string
  winner: 'a' | 'b' | null
  round: number
  score: string
}

function courtsForPod(podId: PodId): string[] {
  const meta = POD_META[podId]
  if (podId === 'color-ball' || podId === 'juniors') return ['4']
  if (meta.courts === 3) return ['1', '2', '3']
  if (meta.courts === 2) return ['1', '2']
  return ['1', '2', '3']
}

/** Which courts show which matches right now (first round with a pending match). */
function liveCourtSnapshot(
  players: Player[],
  results: Record<string, string>,
  scores: Record<string, string>
): Record<string, CourtCell | null> {
  const courts: Record<string, CourtCell | null> = { '1': null, '2': null, '3': null, '4': null }
  POD_ORDER.filter((p) => players.some((x) => x.pod === p)).forEach((podId) => {
    const podPlayers = orderPodPlayers(players.filter((p) => p.pod === podId))
    if (podPlayers.length < 2) return
    const rounds = generateRoundRobin(podPlayers)
    let activeRound = rounds.findIndex((round) =>
      round.some(([a, b]) => !results[matchKey(podId, a.id, b.id)])
    )
    if (activeRound === -1) activeRound = rounds.length - 1
    const courtIds = courtsForPod(podId)
    rounds[activeRound]?.forEach(([a, b], mI) => {
      const courtId = courtIds[mI % courtIds.length]
      if (courts[courtId]) return
      const key = matchKey(podId, a.id, b.id)
      const w = results[key]
      courts[courtId] = {
        podName: POD_META[podId].name,
        podColor: POD_META[podId].colorVar,
        aName: a.name,
        bName: b.name,
        winner: w === a.id ? 'a' : w === b.id ? 'b' : null,
        round: activeRound + 1,
        score: scores[key] || '',
      }
    })
  })
  return courts
}

function CourtMap({ players, results, scores }: Props) {
  const snap = liveCourtSnapshot(players, results, scores)
  return (
    <div className="mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['1', '2', '3', '4'] as const).map((cId) => {
          const live = snap[cId]
          const isMulti = cId === '4'
          if (!live) {
            return (
              <div
                key={cId}
                className="relative rounded-soft border-2 border-black/8 bg-brand-salt-air p-3 min-h-[130px] flex flex-col"
              >
                <span className="font-headline text-2xl text-brand-pacific-dusk leading-none">
                  Court {cId}
                </span>
                <span className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/50 uppercase mt-0.5">
                  {isMulti ? 'Multi-use' : 'Singles'}
                </span>
                <div className="mt-auto text-center font-sans text-ui-sm italic text-brand-pacific-dusk/40">
                  {isMulti ? 'Color ball or singles' : 'Awaiting match'}
                </div>
              </div>
            )
          }
          return (
            <div
              key={cId}
              className="relative rounded-soft border-2 bg-brand-tide-pool/5 p-3 min-h-[130px] flex flex-col"
              style={{ borderColor: live.podColor }}
            >
              <span className="font-headline text-2xl text-brand-pacific-dusk leading-none">
                Court {cId}
              </span>
              <span className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/50 uppercase mt-0.5">
                Round {live.round}
              </span>
              <div className="mt-auto text-center">
                <strong
                  className={`block font-sans text-ui-sm ${
                    live.winner === 'a' ? 'text-brand-tide-pool' : 'text-brand-pacific-dusk'
                  }`}
                >
                  {live.aName}
                </strong>
                <span className="font-sans text-ui-sm text-brand-pacific-dusk/40">vs</span>
                <strong
                  className={`block font-sans text-ui-sm ${
                    live.winner === 'b' ? 'text-brand-tide-pool' : 'text-brand-pacific-dusk'
                  }`}
                >
                  {live.bName}
                </strong>
                <div
                  className="font-sans text-eyebrow-sm font-bold uppercase mt-1.5"
                  style={{ color: live.podColor }}
                >
                  {live.podName}
                </div>
                {live.score ? (
                  <div className="font-sans text-ui-sm text-brand-pacific-dusk/55 mt-1 tabular-nums">
                    {live.score}
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <p className="font-sans text-ui-sm text-brand-pacific-dusk/50 text-center mt-2">
        Alta Laguna · Courts 1–3 singles · Court 4 multi-use (red ball or singles — coach&rsquo;s call)
      </p>
    </div>
  )
}

export default function MatchDayDraws({ players, results, scores }: Props) {
  const activePods = POD_ORDER.filter((p) => players.some((x) => x.pod === p))

  return (
    <div className="space-y-5">
      <CourtMap players={players} results={results} scores={scores} />

      {activePods.length === 0 ? (
        <div className="rounded-soft border-2 border-dashed border-black/10 bg-brand-salt-air p-8 text-center">
          <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-1">
            Court layout shown above · No matches yet
          </h3>
          <p className="font-sans text-body-sm text-brand-pacific-dusk/65">
            Add players and the draws populate per pod.
          </p>
        </div>
      ) : null}

      {activePods.map((podId) => {
        const podPlayers = orderPodPlayers(players.filter((p) => p.pod === podId))
        const meta = POD_META[podId]
        const rounds = generateRoundRobin(podPlayers)
        const standings = computeStandings(podId, podPlayers, results)

        return (
          <div
            key={podId}
            className="rounded-soft border border-black/8 bg-brand-salt-air overflow-hidden shadow-subtle"
            style={{ borderTop: `4px solid ${meta.colorVar}` }}
          >
            <div className="px-4 py-3 border-b border-black/8">
              <div className="font-headline text-headline-sm text-brand-pacific-dusk leading-tight">
                {meta.name}
              </div>
              <div className="font-sans text-ui-sm text-brand-pacific-dusk/55 mt-0.5">
                {meta.format} · {podPlayers.length} player{podPlayers.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Seed / lineup */}
            <div className="px-4 py-3 bg-brand-sandstone/50 border-b border-black/8">
              <table className="w-full text-ui-sm">
                <tbody>
                  {podPlayers.map((p, i) => (
                    <tr key={p.id} className="border-b border-dashed border-black/8 last:border-0">
                      <td className="py-1.5 pr-2 w-16 font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/50 uppercase">
                        Seed {p.seed ?? i + 1}
                      </td>
                      <td className="py-1.5 font-sans text-brand-pacific-dusk">
                        <strong className="font-semibold">{p.name}</strong>{' '}
                        <span className="text-brand-pacific-dusk/45">· {LEVEL_DEFS[p.level].label}</span>
                      </td>
                      <td className="py-1.5 text-right font-sans tabular-nums text-brand-pacific-dusk/55">
                        {p.utr ? `UTR ${p.utr}` : p.age ? `Age ${p.age}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {podPlayers.length < 2 ? (
              <p className="px-4 py-5 text-center font-sans text-ui-sm text-brand-pacific-dusk/55">
                Need at least 2 players for a draw.
              </p>
            ) : (
              <>
                {/* Round-by-round */}
                <div>
                  {rounds.map((round, rIdx) => {
                    const playing = new Set(round.flat().map((p) => p.id))
                    const sitter = podPlayers.find((p) => !playing.has(p.id))
                    return (
                      <div key={rIdx} className="px-4 py-3 border-b border-black/8 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/55 uppercase">
                            Round {rIdx + 1}
                          </span>
                          {sitter ? (
                            <span className="font-sans text-ui-sm italic text-brand-thousand-steps">
                              Sits out: {sitter.name.split(' ')[0]}
                            </span>
                          ) : null}
                        </div>
                        <div className="space-y-1.5">
                          {round.map(([a, b], mI) => {
                            const k = matchKey(podId, a.id, b.id)
                            const w = results[k]
                            const s = scores[k]
                            return (
                              <div
                                key={mI}
                                className="font-sans text-ui-sm text-brand-pacific-dusk flex flex-wrap items-center gap-x-2"
                              >
                                <span className={w === a.id ? 'text-brand-tide-pool font-semibold' : ''}>
                                  {a.name}
                                </span>
                                <span className="text-brand-pacific-dusk/40">vs</span>
                                <span className={w === b.id ? 'text-brand-tide-pool font-semibold' : ''}>
                                  {b.name}
                                </span>
                                {s ? (
                                  <span className="text-brand-pacific-dusk/55 tabular-nums">· {s}</span>
                                ) : null}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Standings */}
                <div className="px-4 py-3 bg-brand-sandstone/40">
                  <span className="font-sans text-eyebrow-sm font-semibold text-brand-pacific-dusk/55 uppercase block mb-1.5">
                    Standings
                  </span>
                  <ol className="space-y-0.5">
                    {standings.map((s, i) => (
                      <li
                        key={s.id}
                        className="font-sans text-ui-sm text-brand-pacific-dusk flex justify-between"
                      >
                        <span>
                          {i + 1}. {s.name}
                        </span>
                        <span className="tabular-nums text-brand-pacific-dusk/60">
                          {s.w}W {s.l}L
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
