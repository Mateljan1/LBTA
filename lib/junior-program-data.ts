/**
 * Build junior-trial programData from winter2026 (single source of truth).
 * Maps winter2026 programs into age-bucket shape expected by junior-trial page.
 */
import winter2026 from '@/data/winter2026.json'

type ScheduleSlot = { day: string; time: string; coach?: string; location?: string }
type Pricing = Record<string, number> & { billing?: string }

const AGE_BUCKET_MAP: Record<string, string> = {
  '3-4': '3-4',
  '5-6': '5-7',
  '7-8': '7-9',
  '9-11': '9-11',
  '11-15': '11-15',
  '12-17': '13-18',
  '12-17 (UTR 5-8)': '13-18',
}

/** Normalize schedule time to short form for day key (e.g. "3:30pm") */
function toDayKey(time: string): string {
  const part = (time || '').split('-')[0]?.trim() || ''
  return part.replace(/\s/g, '').toLowerCase()
}

interface WinterProgram {
  id: string
  category: string
  program: string
  ages: string
  location: string
  duration?: string
  schedule: ScheduleSlot[]
  pricing: Record<string, number>
  description?: string
}

export type ProgramDataStructure = Record<
  string,
  {
    programs: Record<
      string,
      {
        schedules: { day: string; location: string; time: string }[]
        pricing: Pricing
      }
    >
  }
>

export function getJuniorProgramDataFromWinter2026(): ProgramDataStructure {
  const programs = winter2026.programs as unknown as WinterProgram[]
  const result: ProgramDataStructure = {}

  const juniorCategories = ['Junior', 'Youth']
  for (const p of programs) {
    if (!juniorCategories.includes(p.category)) continue
    const bucket = AGE_BUCKET_MAP[p.ages] ?? p.ages
    if (!result[bucket]) result[bucket] = { programs: {} }
    const schedules = (p.schedule || []).map((s) => ({
      day: `${s.day} ${toDayKey(s.time || '')}`,
      location: (s as ScheduleSlot & { location?: string }).location || p.location || 'Moulton Meadows',
      time: `${s.day.slice(0, 3)} ${s.time}`,
    }))
    const pricing = { ...p.pricing } as Pricing
    if (pricing.monthly && !pricing['1x']) pricing['1x'] = pricing.monthly
    if (pricing.monthly && !pricing['2x']) pricing['2x'] = pricing.monthly * 2
    result[bucket].programs[p.program] = { schedules, pricing }
  }

  return result
}
