/**
 * Court flyer data: coaches in draft order with flyer bios and print image paths.
 * Single source: data/coaches.json + data/flyer-coach-bios.json.
 */

import { getCoaches } from '@/lib/coaches-data'
import flyerBiosData from '@/data/flyer-coach-bios.json'

const flyerBios = flyerBiosData as Record<string, { flyerTitle: string; flyerBio: string }>

/** Display order on the flyer: Andrew, Robert, Peter, Allison. */
const FLYER_COACH_ORDER = ['andrew-mateljan', 'robert-lebuhn', 'peter-defrantz', 'allison-cronk'] as const

const SLUG_TO_PRINT_IMG: Record<string, string> = {
  'andrew-mateljan': 'andrew',
  'robert-lebuhn': 'robert',
  'peter-defrantz': 'peter',
  'allison-cronk': 'allison',
}

export interface FlyerCoach {
  name: string
  slug: string
  flyerTitle: string
  flyerBio: string
  imagePath: string
}

export function getFlyerCoaches(): FlyerCoach[] {
  const coaches = getCoaches()
  const bySlug = new Map(coaches.map((c) => [c.slug ?? '', c]))
  return FLYER_COACH_ORDER.map((slug) => {
    const coach = bySlug.get(slug)
    const bio = flyerBios[slug]
    return {
      name: coach?.name ?? slug,
      slug,
      flyerTitle: bio?.flyerTitle ?? coach?.title ?? '',
      flyerBio: bio?.flyerBio ?? coach?.bio ?? '',
      imagePath: `/images/print/coach-${SLUG_TO_PRINT_IMG[slug] ?? slug}.png`,
    }
  })
}
