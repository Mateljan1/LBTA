'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  generateRoundRobin,
  matchKey,
  orderPodPlayers,
  POD_META,
  type Level,
  type Player,
  type PodId,
} from '@/lib/matchday-config'
import { LEVEL_DEFS } from '@/lib/matchday-config'

const STORAGE_KEY = 'lbta-match-day-v2'
const QUEUE_KEY = 'lbta-match-day-queue-v2'
const SYNC_URL = '/api/coach-hub/matchday/sync'
const SYNC_DEBOUNCE_MS = 600

export type SyncStatus = 'idle' | 'syncing' | 'ok' | 'error' | 'offline' | 'disabled'

export interface MatchDayState {
  players: Player[]
  results: Record<string, string>
  scores: Record<string, string>
  notes: string
  notesUpdated: number | null
}

interface SyncPayload {
  matchId: string
  week: string
  pod: string
  round: number
  playerA: string
  playerB: string
  winner: string | null
  score: string
  court: string
}

function emptyState(): MatchDayState {
  return { players: [], results: {}, scores: {}, notes: '', notesUpdated: null }
}

function loadState(): MatchDayState {
  if (typeof window === 'undefined') return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...emptyState(), ...JSON.parse(raw) }
  } catch {
    /* ignore corrupt state */
  }
  return emptyState()
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

export interface UseMatchDayOptions {
  weekName: string
  syncToken: string | null
}

export interface AddPlayerInput {
  name: string
  level: Level
  age?: number | null
  walkin?: boolean
  utr?: number | null
  seed?: number | null
  pod?: PodId
}

/**
 * Match Day state controller: localStorage-backed players/results/scores plus a
 * debounced, offline-tolerant sync to Notion via the gated API route.
 */
export function useMatchDay({ weekName, syncToken }: UseMatchDayOptions) {
  const [state, setState] = useState<MatchDayState>(emptyState)
  const [hydrated, setHydrated] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncToken ? 'idle' : 'disabled')
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const queueRef = useRef<SyncPayload[]>([])

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setState(loadState())
    try {
      const raw = window.localStorage.getItem(QUEUE_KEY)
      if (raw) queueRef.current = JSON.parse(raw)
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* quota / private mode — keep working in memory */
    }
  }, [state, hydrated])

  const persistQueue = useCallback(() => {
    try {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queueRef.current))
    } catch {
      /* ignore */
    }
  }, [])

  const postPayload = useCallback(
    async (payload: SyncPayload): Promise<boolean> => {
      if (!syncToken) return false
      try {
        const res = await fetch(SYNC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-matchday-token': syncToken },
          body: JSON.stringify(payload),
        })
        if (res.status === 503) {
          // Not configured server-side — stop trying, treat as disabled.
          setSyncStatus('disabled')
          return true
        }
        return res.ok
      } catch {
        return false
      }
    },
    [syncToken]
  )

  const flushQueue = useCallback(async () => {
    if (!syncToken || queueRef.current.length === 0) return
    const pending = queueRef.current
    queueRef.current = []
    const failed: SyncPayload[] = []
    for (const payload of pending) {
      const ok = await postPayload(payload)
      if (!ok) failed.push(payload)
    }
    queueRef.current = failed
    persistQueue()
    if (failed.length === 0) setSyncStatus('ok')
  }, [postPayload, persistQueue, syncToken])

  // Retry the offline queue when the browser comes back online.
  useEffect(() => {
    if (!syncToken) return
    const onOnline = () => void flushQueue()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [flushQueue, syncToken])

  const buildPayload = useCallback(
    (podId: PodId, aId: string, bId: string, current: MatchDayState): SyncPayload | null => {
      const meta = POD_META[podId]
      if (!meta) return null
      const podPlayers = orderPodPlayers(current.players.filter((p) => p.pod === podId))
      const rounds = generateRoundRobin(podPlayers)
      const key = matchKey(podId, aId, bId)
      for (let rI = 0; rI < rounds.length; rI++) {
        for (let mI = 0; mI < rounds[rI].length; mI++) {
          const [a, b] = rounds[rI][mI]
          if (matchKey(podId, a.id, b.id) === key) {
            const courtCount = meta.courts || 1
            const winnerId = current.results[key]
            const winnerName = winnerId === a.id ? a.name : winnerId === b.id ? b.name : null
            return {
              matchId: `${weekName} · ${meta.name} · R${rI + 1}M${mI + 1}: ${a.name} vs ${b.name}`,
              week: weekName,
              pod: podId,
              round: rI + 1,
              playerA: a.name,
              playerB: b.name,
              winner: winnerName,
              score: current.scores[key] || '',
              court: String((mI % courtCount) + 1),
            }
          }
        }
      }
      return null
    },
    [weekName]
  )

  const scheduleSync = useCallback(
    (podId: PodId, aId: string, bId: string) => {
      if (!syncToken) return
      const key = matchKey(podId, aId, bId)
      clearTimeout(timers.current[key])
      timers.current[key] = setTimeout(() => {
        setState((current) => {
          const payload = buildPayload(podId, aId, bId, current)
          if (!payload) return current
          setSyncStatus('syncing')
          void postPayload(payload).then((ok) => {
            if (ok) {
              setSyncStatus((s) => (s === 'disabled' ? s : 'ok'))
            } else {
              queueRef.current.push(payload)
              persistQueue()
              setSyncStatus(navigator.onLine ? 'error' : 'offline')
            }
          })
          return current
        })
      }, SYNC_DEBOUNCE_MS)
    },
    [buildPayload, postPayload, persistQueue, syncToken]
  )

  /* -------------------------- mutations -------------------------- */

  const addPlayer = useCallback((input: AddPlayerInput): boolean => {
    const name = input.name.trim()
    if (!name) return false
    const def = LEVEL_DEFS[input.level]
    if (!def) return false
    const player: Player = {
      id: uid(),
      name,
      level: input.level,
      age: input.age ?? null,
      pod: input.pod ?? def.pod,
      walkin: !!input.walkin,
      utr: input.utr ?? null,
      seed: input.seed ?? null,
    }
    setState((s) => ({ ...s, players: [...s.players, player] }))
    return true
  }, [])

  const removePlayer = useCallback((id: string) => {
    setState((s) => {
      const results = { ...s.results }
      const scores = { ...s.scores }
      Object.keys(results).forEach((k) => {
        if (k.includes(id)) delete results[k]
      })
      Object.keys(scores).forEach((k) => {
        if (k.includes(id)) delete scores[k]
      })
      return { ...s, players: s.players.filter((p) => p.id !== id), results, scores }
    })
  }, [])

  const setWinner = useCallback(
    (podId: PodId, aId: string, bId: string, winnerId: string | null) => {
      const key = matchKey(podId, aId, bId)
      setState((s) => {
        const results = { ...s.results }
        if (winnerId == null || results[key] === winnerId) delete results[key]
        else results[key] = winnerId
        return { ...s, results }
      })
      scheduleSync(podId, aId, bId)
    },
    [scheduleSync]
  )

  const setScore = useCallback(
    (podId: PodId, aId: string, bId: string, score: string) => {
      const key = matchKey(podId, aId, bId)
      setState((s) => ({ ...s, scores: { ...s.scores, [key]: score } }))
      scheduleSync(podId, aId, bId)
    },
    [scheduleSync]
  )

  const setNotes = useCallback((notes: string) => {
    setState((s) => ({ ...s, notes, notesUpdated: Date.now() }))
  }, [])

  const reset = useCallback(() => {
    setState(emptyState())
    queueRef.current = []
    persistQueue()
  }, [persistQueue])

  return {
    state,
    hydrated,
    syncStatus,
    addPlayer,
    removePlayer,
    setWinner,
    setScore,
    setNotes,
    reset,
    flushQueue,
  }
}
