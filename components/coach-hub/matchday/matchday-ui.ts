import type { PillTone } from '@/lib/matchday-config'

/** Brand-token pill classes per level tone (no hardcoded hex per LBTA token policy). */
export const PILL_TONE: Record<PillTone, string> = {
  red: 'bg-lbta-red/10 text-lbta-red',
  orange: 'bg-brand-sunset-cliff/15 text-brand-sunset-cliff',
  green: 'bg-brand-tide-pool/12 text-brand-tide-pool',
  yellow: 'bg-brand-thousand-steps/15 text-brand-thousand-steps',
  adult: 'bg-brand-pacific-dusk/10 text-brand-pacific-dusk',
}

export const PILL_BASE =
  'inline-block px-2.5 py-0.5 rounded-full font-sans text-[0.65rem] font-semibold uppercase tracking-[0.04em]'

export function dayLabel(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}
