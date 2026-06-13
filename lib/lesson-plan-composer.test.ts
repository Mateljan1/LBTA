import { describe, expect, it } from 'vitest'
import {
  composePlan,
  generateDraftId,
  BLOCK_RATIOS,
  type ComposerInput,
  type FocusKey,
  type DurationKey,
} from './lesson-plan-composer'
import type { ProgramFamily } from './lesson-plan-types'

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function inputFor(overrides: Partial<ComposerInput> = {}): ComposerInput {
  return {
    program: 'green',
    ageBand: '9–11 yo',
    durationMin: 60,
    focus: 'forehand',
    id: 'draft-test-id-fixed',
    ...overrides,
  }
}

const ALL_PROGRAMS: ProgramFamily[] = [
  'red',
  'orange',
  'green',
  'yellow',
  'adult-bridge',
  'hp-adult',
  'cardio',
  'private',
]

const ALL_FOCUSES: FocusKey[] = [
  'forehand',
  'backhand',
  'serve',
  'return',
  'volley',
  'overhead',
  'patterns',
  'match-play',
]

const ALL_DURATIONS: DurationKey[] = [45, 60, 90]

function sumBlockMinutes(plan: ReturnType<typeof composePlan>): number {
  return plan.blocks.reduce((s, b) => s + b.minutes, 0)
}

function sumItemMinutes(block: ReturnType<typeof composePlan>['blocks'][number]): number {
  return block.items.reduce((s, i) => s + (i.min ?? 0), 0)
}

/* ------------------------------------------------------------------ */
/* Tests                                                              */
/* ------------------------------------------------------------------ */

describe('composePlan — invariants', () => {
  it('always produces exactly 4 blocks (movement, craft, live-ball, review)', () => {
    const plan = composePlan(inputFor())
    expect(plan.blocks).toHaveLength(4)
    expect(plan.blocks.map((b) => b.type)).toEqual([
      'movement',
      'craft',
      'live-ball',
      'review',
    ])
  })

  it('block.minutes sums equal exactly durationMin for all 3 durations', () => {
    for (const d of ALL_DURATIONS) {
      const plan = composePlan(inputFor({ durationMin: d }))
      expect(sumBlockMinutes(plan)).toBe(d)
    }
  })

  it('item.min sums equal block.minutes within each block (no rounding drift)', () => {
    for (const d of ALL_DURATIONS) {
      const plan = composePlan(inputFor({ durationMin: d }))
      for (const block of plan.blocks) {
        expect(sumItemMinutes(block)).toBe(block.minutes)
      }
    }
  })

  it('block split honors BLOCK_RATIOS within ±1 minute (rounding tolerance)', () => {
    const d = 60
    const plan = composePlan(inputFor({ durationMin: d }))
    const movement = plan.blocks.find((b) => b.type === 'movement')!
    const liveBall = plan.blocks.find((b) => b.type === 'live-ball')!
    const review = plan.blocks.find((b) => b.type === 'review')!
    expect(movement.minutes).toBe(Math.round(d * BLOCK_RATIOS.movement))
    expect(liveBall.minutes).toBe(Math.round(d * BLOCK_RATIOS.liveBall))
    expect(review.minutes).toBe(Math.round(d * BLOCK_RATIOS.review))
  })

  it('preserves the input id (composer is pure — no internal id generation)', () => {
    const plan = composePlan(inputFor({ id: 'draft-pinned-id-123' }))
    expect(plan.id).toBe('draft-pinned-id-123')
  })
})

describe('composePlan — focus branching', () => {
  it('stroke focus → craft block focus mentions the stroke', () => {
    const plan = composePlan(inputFor({ focus: 'forehand' }))
    const craft = plan.blocks.find((b) => b.type === 'craft')!
    expect(craft.focus?.toLowerCase()).toContain('forehand')
  })

  it('patterns focus → tactical library used (cue mentions decision)', () => {
    const plan = composePlan(inputFor({ focus: 'patterns' }))
    const craft = plan.blocks.find((b) => b.type === 'craft')!
    expect(craft.focus?.toLowerCase()).toContain('tactical')
    // Tactical items use the verbatim cue from the composer.
    expect(
      craft.items.some((i) => i.cue?.toLowerCase().includes('decide before you swing'))
    ).toBe(true)
  })

  it('match-play focus → tactical library (same branch as patterns)', () => {
    const plan = composePlan(inputFor({ focus: 'match-play' }))
    const craft = plan.blocks.find((b) => b.type === 'craft')!
    expect(craft.focus?.toLowerCase()).toContain('match play')
  })

  it('handles all 8 focus values without throwing', () => {
    for (const f of ALL_FOCUSES) {
      expect(() => composePlan(inputFor({ focus: f }))).not.toThrow()
    }
  })
})

describe('composePlan — program branching', () => {
  it('handles all 8 program families without throwing + produces a plan', () => {
    for (const p of ALL_PROGRAMS) {
      const plan = composePlan(inputFor({ program: p }))
      expect(plan.program).toBe(p)
      expect(plan.blocks).toHaveLength(4)
    }
  })

  it('red program → warmup block uses 5–7 (Red) library', () => {
    const plan = composePlan(inputFor({ program: 'red' }))
    const movement = plan.blocks.find((b) => b.type === 'movement')!
    expect(movement.focus).toContain('5–7 (Red)')
  })

  it('yellow program → warmup block uses 11–14 library', () => {
    const plan = composePlan(inputFor({ program: 'yellow' }))
    const movement = plan.blocks.find((b) => b.type === 'movement')!
    expect(movement.focus).toContain('11–14')
  })

  it('hp-adult program → warmup block uses HP / Adult library', () => {
    const plan = composePlan(inputFor({ program: 'hp-adult' }))
    const movement = plan.blocks.find((b) => b.type === 'movement')!
    expect(movement.focus).toContain('HP / Adult')
  })
})

describe('composePlan — title + metadata', () => {
  it('title combines program label and focus label', () => {
    const plan = composePlan(inputFor({ program: 'green', focus: 'volley' }))
    expect(plan.title).toContain('Green Ball')
    expect(plan.title).toContain('Volley')
  })

  it('homework string is non-empty', () => {
    const plan = composePlan(inputFor())
    expect(plan.homework?.length).toBeGreaterThan(0)
  })

  it('tags include "composer" + the focus + the program for filterability', () => {
    const plan = composePlan(inputFor({ focus: 'serve', program: 'yellow' }))
    expect(plan.tags).toContain('composer')
    expect(plan.tags).toContain('serve')
    expect(plan.tags).toContain('yellow')
  })

  it('source attribution mentions the composer module', () => {
    const plan = composePlan(inputFor())
    expect(plan.source?.toLowerCase()).toContain('composer')
  })
})

describe('composePlan — exhaustive minute-sum property', () => {
  it('for ALL (program × focus × duration) combos, item-min sums = block.minutes for every block', () => {
    for (const p of ALL_PROGRAMS) {
      for (const f of ALL_FOCUSES) {
        for (const d of ALL_DURATIONS) {
          const plan = composePlan(inputFor({ program: p, focus: f, durationMin: d }))
          // Block-level invariant
          expect(
            sumBlockMinutes(plan),
            `block sum mismatch for program=${p}, focus=${f}, duration=${d}`
          ).toBe(d)
          // Item-level invariant within each block
          for (const block of plan.blocks) {
            expect(
              sumItemMinutes(block),
              `item-min drift in ${block.type} for program=${p}, focus=${f}, duration=${d}`
            ).toBe(block.minutes)
          }
        }
      }
    }
  })
})

describe('generateDraftId', () => {
  it('returns a string starting with "draft-"', () => {
    const id = generateDraftId({ program: 'green', focus: 'forehand' })
    expect(id.startsWith('draft-')).toBe(true)
  })

  it('embeds the program and focus in the id', () => {
    const id = generateDraftId({ program: 'yellow', focus: 'serve' })
    expect(id).toContain('yellow')
    expect(id).toContain('serve')
  })

  it('returns unique ids on rapid successive calls (UUID-backed entropy)', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 50; i++) {
      ids.add(generateDraftId({ program: 'green', focus: 'forehand' }))
    }
    // All 50 should be unique. Math.random()-based 4-char suffix would risk
    // collisions at this scale; UUID-backed 8-char hex makes it astronomically unlikely.
    expect(ids.size).toBe(50)
  })

  it('matches the draft ID regex used by the drafts store', () => {
    const id = generateDraftId({ program: 'red', focus: 'patterns' })
    expect(id).toMatch(/^draft-[a-z0-9-]{1,64}$/)
  })
})
