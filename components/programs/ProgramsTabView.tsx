'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Program } from '@/components/ProgramCard'
import ProgramPathwayCard from '@/components/programs/ProgramPathwayCard'
import RegistrationModal from '@/components/RegistrationModal'
import { PROGRAM_IMAGES } from '@/lib/program-images'
import type { Year2026Sections } from '@/lib/schedule-schemas'

/* ─── Rich descriptions from LBTA Program Guide ─── */

const PROGRAM_DESCRIPTIONS: Record<string, string> = {
  // Youth
  'little-stars': 'The court fits their body. The balls don\'t bounce over their heads. The rackets sit right in their hands. Little Tennis Stars is where a child learns that a tennis court is a place where good things happen — movement games, coordination challenges, the feeling of hitting a ball and watching it go where they aimed.',
  'red-ball': 'Real strokes start here. A child who came through Little Tennis Stars already knows how to move and track. Now they learn forehand, backhand, and the beginning of a rally — on a court sized for their body, with a ball that bounces at their strike zone. Tennis becomes a conversation — you hit, they hit, you decide what to do next.',
  'orange-ball': 'The court gets bigger. The ball moves faster. And for the first time, a player has to think about where they\'re hitting — not just whether they can. Directional play begins. Crosscourt versus down-the-line becomes a real decision. This is where you start seeing who loves to compete and who loves to play.',
  'green-dot': 'Full court. Green dot balls — slightly slower than yellow, which lets a nine-year-old rally at real speed without the ball flying past the baseline every time. Players start thinking one shot ahead. Patterns replace reactions. The last stage before a player decides whether tennis is a hobby or a pursuit.',
  // Competitive / Junior Dev
  'competitive-green-dot': 'For the player who\'s outgrown the standard Green Dot group — the one already winning every drill and needing more. Two-hour sessions at Alta Laguna. Match play that counts. Competitive development built around movement patterns, tactical discipline, and the mental habits that separate players who win tight sets from those who don\'t.',
  'youth-development': 'Three coaches. Two hours. Players grouped by UTR. Structured training — movement, stroke production, pattern play, live points, competitive scenarios — every session designed to solve specific problems in each player\'s game. This is where tennis becomes a discipline. Players are UTR-tracked. They know their number. They know what it takes to move it.',
  'high-performance': 'Monday and Wednesday, 6:30–8:30 PM. Lights on. Courts quiet except for the sound of balls being struck with intent. Tournament-caliber training. Pre-match protocols. Between-point routines. Tactical game plans built around each player\'s strengths. HP players compete in USTA and UTR tournaments. Several LBTA alumni have gone on to play Division I.',
  // Adult
  'adult-beginner-1': 'You\'ve never picked up a racket. Or you did twenty years ago and forgot everything. This is where you start. Grip, stance, swing path, contact point — built from zero with clear instruction and immediate feedback. By week four, you\'re rallying. By week eight, you\'re playing points.',
  'adult-beginner-2': 'You can rally. You understand the strokes. But you\'re not ready for players who\'ve been at this for years. Bridge closes that gap — taking someone who can keep the ball in play and turning them into someone who can place it. Consistency drills. Rally building. Introduction to net play and court positioning.',
  'adult-intermediate': 'You have strokes. What you need is a game plan — patterns, shot selection, when to come in, when to stay back, how to win points instead of just surviving them. Ninety-minute sessions because tactical development takes reps and time. Point construction. Serve-plus-one patterns. Live sets with coaching.',
  'adult-advanced': 'Two hours. Two coaches. Players who can hit and want to compete. Tactical pattern play, pressure situations, competitive sets with coaching at changeovers. Monday and Friday, noon to 2 PM.',
  // Fitness
  'liveball': 'Structured match play with live coaching. Movement drills to open, then points — doubles, singles, situational play — with a coach reading the action and making adjustments in real time. Not a lesson. Competitive play with a coaching layer on top. LBTA\'s signature First Ball Rules, Champions/Challengers scoring, and six 15-minute blocks that keep the energy honest.',
  'liveball-intermediate': 'Structured match play with live coaching. Movement drills to open, then points — doubles, singles, situational play — with a coach reading the action and making adjustments in real time. Not a lesson. Competitive play with a coaching layer on top.',
  'liveball-advanced': 'High-intensity structured match play for advanced players (NTRP 3.5+). Competitive sets, advanced tactical scenarios, and live coaching for players who want sharper competitive edges alongside their regular training.',
  'cardio-tennis': 'Friday mornings, 9:00–10:30 AM. High-energy, fitness-forward tennis — movement drills, fast-paced rallies, competitive games designed to keep your heart rate up while improving your footwork and consistency. All levels welcome.',
}

function getDescription(program: Program): string {
  return (
    PROGRAM_DESCRIPTIONS[program.id] ??
    PROGRAM_DESCRIPTIONS[program.id.replace(/-\d+$/, '')] ??
    program.description
  )
}

/* ─── Badge logic ─── */

function getBadge(program: Program): string | undefined {
  const n = program.program.toLowerCase()
  if (n.includes('competitive green dot') || n.includes('utr green dot')) return 'By invitation'
  if (n.includes('high performance')) return 'UTR 8+ required'
  if (n.includes('youth development') || n.includes('player development')) return 'Coach approval'
  return undefined
}

/* ─── Format pricing for RegistrationModal ─── */

function formatPricingOptions(pricing: Program['pricing']): Array<{ label: string; amount: number }> {
  const labels: Record<string, string> = {
    '1x': '1x/wk', '2x': '2x/wk', '3x': '3x/wk', '4x': '4x/wk', '5x': '5x/wk',
    monthly: 'Monthly', drop_in: 'Drop-in', saturday1x: '1x/wk (Saturday)',
  }
  return Object.entries(pricing)
    .filter(([, amount]) => amount !== undefined && amount !== null)
    .map(([key, amount]) => ({ label: labels[key] ?? key, amount: Number(amount) }))
}

/* ─── Tabs ─── */

type TabId = 'junior' | 'adult' | 'liveball' | 'camps' | 'leagues'

const TABS: Array<{ id: TabId; label: string; sublabel: string }> = [
  { id: 'junior',   label: 'Junior Programs',      sublabel: 'Ages 3–17'         },
  { id: 'adult',    label: 'Adult Programs',        sublabel: 'Beginner – Advanced' },
  { id: 'liveball', label: 'LiveBall & Cardio',     sublabel: 'Monthly drop-in'   },
  { id: 'camps',    label: 'Camps',                 sublabel: 'Seasonal & holiday' },
  { id: 'leagues',  label: 'Leagues & Competition', sublabel: 'USTA & UTR'        },
]

function filterPrograms(programs: Program[], tab: TabId): Program[] {
  switch (tab) {
    case 'junior':
      return programs.filter((p) => {
        const cat = p.category.toLowerCase()
        const name = p.program.toLowerCase()
        return (
          cat.includes('youth') ||
          cat.includes('junior') ||
          cat.includes('development') ||
          name.includes('little tennis stars') ||
          name.includes('red ball') ||
          name.includes('orange ball') ||
          name.includes('green dot') ||
          name.includes('player development') ||
          name.includes('youth development') ||
          name.includes('high performance')
        )
      })
    case 'adult':
      return programs.filter((p) => {
        const cat = p.category.toLowerCase()
        const name = p.program.toLowerCase()
        return (
          (cat.includes('adult') ||
           name.includes('new to tennis') ||
           name.includes('beyond beginner') ||
           name.includes('adult beginner') ||
           name.includes('intermediate') ||
           name.includes('advanced')) &&
          !name.includes('liveball') &&
          !name.includes('cardio')
        )
      })
    case 'liveball':
      return programs.filter((p) => {
        const cat = p.category.toLowerCase()
        const name = p.program.toLowerCase()
        return cat.includes('fitness') || cat.includes('open court') || name.includes('liveball') || name.includes('cardio')
      })
    default:
      return []
  }
}

/* ─── Props ─── */

interface ProgramsTabViewProps {
  programs: Program[]
  year2026: Year2026Sections
}

/* ─── Component ─── */

export default function ProgramsTabView({ programs, year2026 }: ProgramsTabViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('junior')
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const tablistRef = useRef<HTMLDivElement>(null)

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    const tabs = tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    if (!tabs) return
    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    tabs[next].focus()
    tabs[next].click()
  }, [])

  const visiblePrograms = filterPrograms(programs, activeTab)

  return (
    <div>
      {/* ── Tab bar ── */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Program categories"
        className="flex overflow-x-auto scrollbar-hide gap-1 pb-1 mb-8 md:mb-10 border-b border-brand-pacific-dusk/8"
      >
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`flex flex-col items-start gap-0.5 whitespace-nowrap px-4 py-3 rounded-t-[2px] border-b-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-brand-pacific-dusk text-brand-pacific-dusk bg-brand-pacific-dusk/[0.03]'
                  : 'border-transparent text-brand-pacific-dusk/50 hover:text-brand-pacific-dusk/75 hover:border-brand-pacific-dusk/20'
              }`}
            >
              <span className={`font-sans text-[13px] font-medium ${isActive ? '' : ''}`}>
                {tab.label}
              </span>
              <span className="font-sans text-[11px] text-brand-pacific-dusk/40">
                {tab.sublabel}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Tab panels ── */}

      {/* Junior */}
      <div
        id="panel-junior"
        role="tabpanel"
        aria-labelledby="tab-junior"
        hidden={activeTab !== 'junior'}
      >
        {activeTab === 'junior' && (
          <>
            <p className="font-sans text-[14px] text-brand-pacific-dusk/55 max-w-2xl mb-8 leading-relaxed">
              A three-year-old picks up a foam racket at Moulton Meadows. Ten years later, she&rsquo;s training at LBHS, competing in USTA tournaments, building a UTR that college coaches follow. One continuous pathway — same academy, same coaching philosophy.
            </p>
            <div className="space-y-12 md:space-y-16">
              {visiblePrograms.map((p, i) => (
                <ProgramPathwayCard
                  key={p.id}
                  program={p}
                  description={getDescription(p)}
                  onRegister={setSelectedProgram}
                  badge={getBadge(p)}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Adult */}
      <div
        id="panel-adult"
        role="tabpanel"
        aria-labelledby="tab-adult"
        hidden={activeTab !== 'adult'}
      >
        {activeTab === 'adult' && (
          <>
            <p className="font-sans text-[14px] text-brand-pacific-dusk/55 max-w-2xl mb-8 leading-relaxed">
              Whether you played in college or picked up a racket last month, there is a place for you here. Small groups. Real instruction. A clear path into leagues and rated competition when you&rsquo;re ready.
            </p>
            <div className="space-y-12 md:space-y-16">
              {visiblePrograms.map((p, i) => (
                <ProgramPathwayCard
                  key={p.id}
                  program={p}
                  description={getDescription(p)}
                  onRegister={setSelectedProgram}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* LiveBall & Cardio */}
      <div
        id="panel-liveball"
        role="tabpanel"
        aria-labelledby="tab-liveball"
        hidden={activeTab !== 'liveball'}
      >
        {activeTab === 'liveball' && (
          <>
            <p className="font-sans text-[14px] text-brand-pacific-dusk/55 max-w-2xl mb-8 leading-relaxed">
              High-energy, coach-fed sessions. $150/month or drop in at $50. No season commitment required — just show up.
            </p>
            {visiblePrograms.length > 0 ? (
              <div className="space-y-12 md:space-y-16">
                {visiblePrograms.map((p, i) => (
                  <ProgramPathwayCard
                    key={p.id}
                    program={p}
                    description={getDescription(p)}
                    onRegister={setSelectedProgram}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <LiveBallStaticCards onRegister={() => {}} />
            )}
          </>
        )}
      </div>

      {/* Camps */}
      <div
        id="panel-camps"
        role="tabpanel"
        aria-labelledby="tab-camps"
        hidden={activeTab !== 'camps'}
      >
        {activeTab === 'camps' && (
          <CampsPanel year2026={year2026} />
        )}
      </div>

      {/* Leagues */}
      <div
        id="panel-leagues"
        role="tabpanel"
        aria-labelledby="tab-leagues"
        hidden={activeTab !== 'leagues'}
      >
        {activeTab === 'leagues' && <LeaguesPanel />}
      </div>

      {/* Trust strip */}
      <div className="mt-12 md:mt-14 pt-8 border-t border-brand-pacific-dusk/6 grid sm:grid-cols-3 gap-4 text-center">
        {[
          { label: 'First class free', detail: 'One free group class per family. All programs.' },
          { label: 'You never lose a session to weather', detail: 'LBTA cancels proactively and schedules makeups automatically.' },
          { label: 'No long-term commitment', detail: 'Seasonal or monthly. Drop in anytime.' },
        ].map((item) => (
          <div key={item.label} className="px-4">
            <p className="font-sans text-[13px] font-medium text-brand-pacific-dusk mb-1">{item.label}</p>
            <p className="font-sans text-[12px] text-brand-pacific-dusk/45 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {selectedProgram && (
        <RegistrationModal
          programName={selectedProgram.program}
          programDetails={`Ages ${selectedProgram.ages} · ${selectedProgram.duration} · ${selectedProgram.location}`}
          programAges={selectedProgram.ages}
          programDays={selectedProgram.schedule.map((s) => s.day)}
          pricingOptions={formatPricingOptions(selectedProgram.pricing)}
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          registrationSource="programs_page"
        />
      )}
    </div>
  )
}

/* ─── LiveBall static fallback (when fitness programs not in season data) ─── */

function LiveBallStaticCards({ onRegister: _ }: { onRegister: (p: Program) => void }) {
  const sessions = [
    { name: 'LiveBall — Intermediate', days: 'Thu · Sat · Sun', time: '6 PM / 11:30 AM / 9 AM', location: 'Moulton & LBHS', level: 'NTRP 2.5+' },
    { name: 'LiveBall — Advanced', days: 'Sunday', time: '10:30 AM–12:00 PM', location: 'LBHS', level: 'NTRP 3.5+' },
    { name: 'Cardio Tennis', days: 'Friday', time: '9:00–10:30 AM', location: 'LBHS', level: 'All Levels' },
  ]
  const descriptions: Record<string, string> = {
    'LiveBall — Intermediate': PROGRAM_DESCRIPTIONS['liveball-intermediate'],
    'LiveBall — Advanced': PROGRAM_DESCRIPTIONS['liveball-advanced'],
    'Cardio Tennis': PROGRAM_DESCRIPTIONS['cardio-tennis'],
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {sessions.map((s) => (
        <div key={s.name} className="bg-white border border-brand-pacific-dusk/6 rounded-[2px] overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image
              src={s.name.includes('Cardio') ? PROGRAM_IMAGES['cardio-tennis'].src : PROGRAM_IMAGES['liveball'].src}
              alt={s.name}
              fill
              className="object-cover"
              style={{ objectPosition: PROGRAM_IMAGES['liveball'].objectPosition }}
              sizes="(max-width: 640px) 100vw, 33vw"
              quality={85}
            />
            <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-brand-pacific-dusk font-sans text-[10px] font-semibold tracking-[1.5px] uppercase px-2.5 py-1.5 rounded-[2px]">
              Drop-in $50
            </span>
          </div>
          <div className="p-5">
            <span className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-victoria-cove/70 mb-2 block">{s.level}</span>
            <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-2">{s.name}</h3>
            <p className="font-sans text-[13px] text-brand-pacific-dusk/60 leading-relaxed mb-4">{descriptions[s.name]}</p>
            <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-4 space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-[12px] font-semibold text-brand-pacific-dusk w-[52px]">{s.days}</span>
                <span className="font-sans text-[12px] text-brand-pacific-dusk/65">{s.time}</span>
                <span className="ml-auto font-sans text-[11px] text-brand-pacific-dusk/40">{s.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="flex-1 font-sans text-[12px] text-brand-pacific-dusk/55">$150/month · $50 drop-in</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/fitness"
                className="flex-1 inline-flex min-h-[48px] items-center justify-center bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                View schedule
              </Link>
              <Link
                href="/book"
                className="inline-flex min-h-[48px] items-center justify-center border border-brand-pacific-dusk/15 rounded-[2px] px-4 font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-pacific-dusk/60 hover:border-brand-pacific-dusk/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
              >
                Book Trial
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Camps Panel ─── */

function CampsPanel({ year2026 }: { year2026: Year2026Sections }) {
  const camps = year2026.camps ?? []
  return (
    <>
      <p className="font-sans text-[14px] text-brand-pacific-dusk/55 max-w-2xl mb-8 leading-relaxed">
        Summer, spring break, Thanksgiving, and winter break. Two tracks by age — Tennis &amp; Adventure for kids 5–11, intensive training for competitive juniors 12–17.
      </p>
      {camps.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {camps.map((camp) => (
            <div key={camp.id} className="bg-white border border-brand-pacific-dusk/6 rounded-[2px] overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image
                  src={PROGRAM_IMAGES['camps'].src}
                  alt={camp.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: PROGRAM_IMAGES['camps'].objectPosition }}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  quality={85}
                />
                {camp.featured && (
                  <span className="absolute top-3 left-3 bg-brand-deep-water/75 backdrop-blur-sm text-white/90 font-sans text-[10px] font-medium tracking-[2px] uppercase px-2.5 py-1.5 rounded-[2px]">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <span className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-victoria-cove/70 mb-2 block">
                  Ages {camp.ages} · {camp.dates}
                </span>
                <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-2">{camp.name}</h3>
                <p className="font-sans text-[13px] text-brand-pacific-dusk/60 leading-relaxed mb-3">{camp.description}</p>
                {camp.includes && camp.includes.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {camp.includes.slice(0, 3).map((item) => (
                      <li key={item} className="font-sans text-[12px] text-brand-pacific-dusk/50 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-brand-victoria-cove/40 mt-[6px] shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-4">
                  <div className="flex justify-between">
                    <span className="font-sans text-[12px] text-brand-pacific-dusk/50">Full day</span>
                    <span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${camp.price.toLocaleString()}/week</span>
                  </div>
                  {camp.halfDay != null && (
                    <div className="flex justify-between mt-1">
                      <span className="font-sans text-[12px] text-brand-pacific-dusk/50">Half day</span>
                      <span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${camp.halfDay.toLocaleString()}/week</span>
                    </div>
                  )}
                  {camp.perDay != null && (
                    <div className="flex justify-between mt-1">
                      <span className="font-sans text-[12px] text-brand-pacific-dusk/50">Drop-in</span>
                      <span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${camp.perDay}/day</span>
                    </div>
                  )}
                </div>
                <Link
                  href="/camps"
                  className="w-full inline-flex min-h-[48px] items-center justify-center bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
                >
                  View &amp; Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <StaticCampsCards />
      )}
    </>
  )
}

/* ─── Static camps fallback ─── */

function StaticCampsCards() {
  const campCards = [
    {
      id: 'tennis-adventure',
      title: 'Tennis & Adventure Camp',
      ages: '5–11',
      dates: 'June 15 – August 28',
      description: 'Tennis instruction, field games, arts and crafts, pickleball, and Water Day Thursdays. Grouped by age — Explorers (5–7) and Trailblazers (8–11). Two coaches run every session.',
      fullDay: 495,
      halfDay: 325,
      dropIn: 85,
    },
    {
      id: 'training-camp',
      title: 'Summer Training Camp',
      ages: '12–17',
      dates: 'June 15 – August 28',
      description: 'Week-long training for competitive juniors. Technical drilling, tactical development, match play, and physical conditioning — grouped by UTR level. Coach approval required.',
      fullDay: 595,
      halfDay: 325,
      dropIn: 120,
      badge: 'Coach approval',
    },
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-2xl">
      {campCards.map((c) => (
        <div key={c.id} className="bg-white border border-brand-pacific-dusk/6 rounded-[2px] overflow-hidden">
          <div className="relative aspect-[16/9]">
            <Image
              src={PROGRAM_IMAGES['camps'].src}
              alt={c.title}
              fill
              className="object-cover"
              style={{ objectPosition: PROGRAM_IMAGES['camps'].objectPosition }}
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={85}
            />
            {c.badge && (
              <span className="absolute top-3 left-3 bg-brand-deep-water/75 backdrop-blur-sm text-white/90 font-sans text-[10px] font-medium tracking-[2px] uppercase px-2.5 py-1.5 rounded-[2px]">
                {c.badge}
              </span>
            )}
          </div>
          <div className="p-5">
            <span className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-victoria-cove/70 mb-2 block">
              Ages {c.ages} · {c.dates}
            </span>
            <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-2">{c.title}</h3>
            <p className="font-sans text-[13px] text-brand-pacific-dusk/60 leading-relaxed mb-3">{c.description}</p>
            <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-4 space-y-1">
              <div className="flex justify-between"><span className="font-sans text-[12px] text-brand-pacific-dusk/50">Full day</span><span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${c.fullDay}/week</span></div>
              <div className="flex justify-between"><span className="font-sans text-[12px] text-brand-pacific-dusk/50">Half day</span><span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${c.halfDay}/week</span></div>
              <div className="flex justify-between"><span className="font-sans text-[12px] text-brand-pacific-dusk/50">Drop-in</span><span className="font-sans text-[13px] font-semibold text-brand-pacific-dusk">${c.dropIn}/day</span></div>
            </div>
            <Link href="/camps" className="w-full inline-flex min-h-[48px] items-center justify-center bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2">
              View &amp; Register
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Leagues Panel ─── */

function LeaguesPanel() {
  const leagues = [
    {
      id: 'utr',
      title: 'UTR Match Play Series',
      eyebrow: 'UTR 1–12 · Saturdays & Sundays',
      description: 'Eight weekends of structured competition plus Grand Finals. Four divisions: Color Ball juniors, singles and doubles for all levels. Every result reported to UTR. The most systematic way to build your rating in Laguna Beach.',
      highlights: ['8 weekends + Grand Finals', 'Four divisions by level', 'UTR-rated results', 'Alta Laguna & LBHS'],
      from: '$349/season · $55 drop-in',
      href: '/programs/utr-match-play',
      image: PROGRAM_IMAGES['leagues'].src,
      imageAlt: PROGRAM_IMAGES['leagues'].alt,
      imagePosition: PROGRAM_IMAGES['leagues'].objectPosition,
    },
    {
      id: 'usta',
      title: 'USTA Adult League',
      eyebrow: 'NTRP 2.5–5.0 · All Spring & Summer',
      description: 'LBTA fields teams in the USTA SoCal Orange County league area. Weekly matches against OC clubs, plus coached practice every Tuesday with Andrew. The structure of a season. The satisfaction of representing your club.',
      highlights: ['Coached practice Tuesdays at LBHS', 'Matches Saturdays at LBHS', '4 leagues by format and age', 'Andrew Mateljan coaching'],
      from: '~$23/week per player',
      href: '/programs/usta-adult-league',
      image: PROGRAM_IMAGES['leagues'].src,
      imageAlt: PROGRAM_IMAGES['leagues'].alt,
      imagePosition: PROGRAM_IMAGES['leagues'].objectPosition,
    },
  ]

  return (
    <>
      <p className="font-sans text-[14px] text-brand-pacific-dusk/55 max-w-2xl mb-8 leading-relaxed">
        Two formats, different commitments. UTR Match Play is weekend rated matchplay by division. USTA Adult League is team-based competition against clubs across Orange County.
      </p>
      <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl">
        {leagues.map((league) => (
          <div key={league.id} className="bg-white border border-brand-pacific-dusk/6 rounded-[2px] overflow-hidden">
            <div className="relative aspect-[16/9]">
              <Image
                src={league.image}
                alt={league.imageAlt}
                fill
                className="object-cover"
                style={{ objectPosition: league.imagePosition }}
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={85}
              />
            </div>
            <div className="p-5">
              <span className="font-sans text-[11px] font-medium tracking-[2px] uppercase text-brand-victoria-cove/70 mb-2 block">
                {league.eyebrow}
              </span>
              <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-2">{league.title}</h3>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/60 leading-relaxed mb-3">{league.description}</p>
              <ul className="space-y-1 mb-4">
                {league.highlights.map((h) => (
                  <li key={h} className="font-sans text-[12px] text-brand-pacific-dusk/50 flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-victoria-cove/40 mt-[6px] shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="border-t border-brand-pacific-dusk/6 pt-3 mb-4">
                <span className="font-sans text-[12px] text-brand-pacific-dusk/50">From {league.from}</span>
              </div>
              <Link
                href={league.href}
                className="w-full inline-flex min-h-[48px] items-center justify-center bg-black text-white rounded-[2px] font-sans text-[11px] font-medium tracking-[2.5px] uppercase transition-all hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
