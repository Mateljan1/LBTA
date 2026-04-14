/**
 * Single source of truth for program/class photos.
 * All Cloudinary URLs live here; every page imports from this module.
 */

const CLOUD = 'https://res.cloudinary.com/dv033eo0x/image/upload'

export interface ProgramImageConfig {
  src: string
  alt: string
  objectPosition: string
}

/**
 * Canonical Cloudinary image for each program, keyed by slug.
 * Used by schedules ProgramCard, /programs overview, homepage cards,
 * and landing pages for cohesive imagery across the site.
 */
export const PROGRAM_IMAGES: Record<string, ProgramImageConfig> = {
  'little-tennis-stars': {
    src: `${CLOUD}/v1776035010/9D30C663-85F2-48B0-B34C-87D340674789_1_105_c_tahv0a.jpg`,
    alt: 'Young player smiling on court during Little Tennis Stars session',
    objectPosition: 'center 26%',
  },
  'red-ball': {
    src: `${CLOUD}/v1774752975/lbta/photos/canonical/2023/lbta-2023-child-practicing-tennis-swing-court.webp`,
    alt: 'Junior player practicing forehand swing on Moulton Meadows court',
    objectPosition: 'center 30%',
  },
  'orange-ball': {
    src: `${CLOUD}/v1774752372/lbta/support/canonical/camps/support-camps-green-ball.webp`,
    alt: 'Kids rallying at the net during Orange Ball session in golden-hour light',
    objectPosition: 'center 42%',
  },
  'green-dot': {
    src: `${CLOUD}/v1776038504/Green_dot_nyiso7.jpg`,
    alt: 'Green Dot player hitting overhead volley at the net',
    objectPosition: 'center 28%',
  },
  'competitive-green-dot': {
    src: `${CLOUD}/v1776038831/green_dot_competitive_qmueoa.jpg`,
    alt: 'Competitive Green Dot player running drills on blue hard court',
    objectPosition: 'center 38%',
  },
  'player-development': {
    src: `${CLOUD}/v1776039103/Youth_Development_ydlfwq.jpg`,
    alt: 'Junior Development training footwork with agility cones',
    objectPosition: 'center 40%',
  },
  'high-performance': {
    src: `${CLOUD}/v1776047024/High_Performance_d60ibn.jpg`,
    alt: 'High Performance youth training session at Laguna Beach Tennis Academy',
    objectPosition: 'center 35%',
  },
  'new-to-tennis': {
    src: `${CLOUD}/v1776039173/Beginner_Class_moulton_xs5pec.jpg`,
    alt: 'Adult beginners practicing technique at Moulton Meadows Park',
    objectPosition: 'center 32%',
  },
  'beyond-beginner': {
    src: `${CLOUD}/v1774485579/olov_hero_dxhdu5.jpg`,
    alt: 'Beyond Beginner player hitting a serve at Laguna Beach Tennis Academy',
    objectPosition: 'center 20%',
  },
  'adult-intermediate': {
    src: `${CLOUD}/v1776046298/Adult_intermediat_or_bridge_1_edcu5p.jpg`,
    alt: 'Adult intermediate players training at Laguna Beach High School',
    objectPosition: 'center 38%',
  },
  'adult-advanced': {
    src: `${CLOUD}/v1774485572/Adult_advanced_2_tttewq.jpg`,
    alt: 'Adult advanced players competing in match play',
    objectPosition: 'center 40%',
  },
  'liveball': {
    src: `${CLOUD}/v1774485572/Advanced_liveball_iyooh6.jpg`,
    alt: 'LiveBall session — high-energy coach-fed point play',
    objectPosition: 'center 42%',
  },
  'cardio-tennis': {
    src: `${CLOUD}/v1774485572/Liveball_Intermediate_exqowf.jpg`,
    alt: 'Cardio Tennis fitness-focused hitting session',
    objectPosition: 'center 45%',
  },
  'camps': {
    src: `${CLOUD}/f_auto,q_auto/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg`,
    alt: 'Junior players training during a seasonal tennis camp at Laguna Beach Tennis Academy',
    objectPosition: 'center 42%',
  },
  'leagues': {
    src: `${CLOUD}/v1774752454/lbta/support/canonical/programs/support-programs-cardio-tennis.webp`,
    alt: 'USTA league team on blue courts at Laguna Beach Tennis Academy',
    objectPosition: 'center 40%',
  },
} as const

const FALLBACK: ProgramImageConfig = {
  src: `${CLOUD}/v1776039103/Youth_Development_ydlfwq.jpg`,
  alt: 'Tennis training at Laguna Beach Tennis Academy',
  objectPosition: 'center 40%',
}

/**
 * Resolve the canonical Cloudinary image for any program by name + category.
 * Matches the same logic the schedules ProgramCard uses.
 */
export function getProgramImage(programName: string, category = ''): ProgramImageConfig {
  const name = programName.toLowerCase()
  const cat = category.toLowerCase()

  if (name.includes('little tennis stars')) return PROGRAM_IMAGES['little-tennis-stars']
  if (name.includes('red ball')) return PROGRAM_IMAGES['red-ball']
  if (name.includes('orange ball')) return PROGRAM_IMAGES['orange-ball']

  if (name === 'green dot' || (name.includes('green dot') && !name.includes('competitive') && !name.includes('utr'))) {
    return PROGRAM_IMAGES['green-dot']
  }
  if (name.includes('competitive') && name.includes('green dot')) return PROGRAM_IMAGES['competitive-green-dot']

  if (name.includes('player development')) return PROGRAM_IMAGES['player-development']
  if (name.includes('high performance')) return PROGRAM_IMAGES['high-performance']
  if (name.includes('new to tennis')) return PROGRAM_IMAGES['new-to-tennis']
  if (name.includes('beyond beginner')) return PROGRAM_IMAGES['beyond-beginner']

  if (name.includes('intermediate') && cat.includes('adult')) return PROGRAM_IMAGES['adult-intermediate']
  if (name.includes('advanced') && cat.includes('adult')) return PROGRAM_IMAGES['adult-advanced']

  if (name.includes('liveball')) return PROGRAM_IMAGES['liveball']
  if (name.includes('cardio')) return PROGRAM_IMAGES['cardio-tennis']

  if (cat.includes('adult') || name.includes('adult')) return PROGRAM_IMAGES['new-to-tennis']
  if (cat.includes('development') || cat.includes('youth')) return PROGRAM_IMAGES['player-development']
  if (cat.includes('open court') || cat.includes('fitness')) return PROGRAM_IMAGES['liveball']

  return FALLBACK
}
