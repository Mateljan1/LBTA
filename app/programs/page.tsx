import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import AnimatedSection from '@/components/ui/AnimatedSection'
import MethodSection from '@/components/programs/MethodSection'
import PathwayChooser from '@/components/programs/PathwayChooser'
import PathwayTimeline from '@/components/programs/PathwayTimeline'
import type { PathwayStep } from '@/components/programs/PathwayTimeline'
import { PROGRAM_IMAGES } from '@/lib/program-images'
import { getPrivateRates } from '@/lib/programs-data'
import pricingSupplemental from '@/data/pricing-supplemental.json'

export const metadata: Metadata = {
  title: 'Programs | Find Your Path',
  description:
    'Junior development from age 3 through college pathway. Adult programs from beginner to advanced. Camps, leagues, private coaching, and fitness — all built on the Mateljan Method.',
  openGraph: {
    images: [
      {
        url: '/images/programs/hero.webp',
        width: 1200,
        height: 900,
        alt: 'Tennis programs at Laguna Beach Tennis Academy',
      },
    ],
  },
}

/* ─── Data: Junior Pathway ─── */

const juniorPathway: PathwayStep[] = [
  {
    title: 'Little Tennis Stars',
    eyebrow: 'Ages 3–4 · 45 min · 6 players',
    description:
      'Your child\'s first time on a tennis court should feel like play — because it is. Foam balls, low nets, mini courts. Movement games, animal walks, relay races. No drills. No pressure.',
    image: PROGRAM_IMAGES['little-tennis-stars'].src,
    imageAlt: PROGRAM_IMAGES['little-tennis-stars'].alt,
    objectPosition: PROGRAM_IMAGES['little-tennis-stars'].objectPosition,
    details: [
      'Coach: Allison Cronk',
      'Mon/Wed 3:30 PM · Sat 9:00 AM',
      'Moulton Meadows · Alta Laguna',
    ],
    fromPrice: '$40/session',
    href: '/schedules',
  },
  {
    title: 'Red Ball',
    eyebrow: 'Ages 5–6 · 60 min · 8 players',
    description:
      'The real starting line. Players learn to swing, move, and rally on a 36-foot court with low-compression red balls. By season end, your child is hitting 4–6 ball rallies and keeping score.',
    image: PROGRAM_IMAGES['red-ball'].src,
    imageAlt: PROGRAM_IMAGES['red-ball'].alt,
    objectPosition: PROGRAM_IMAGES['red-ball'].objectPosition,
    details: [
      'Coach: Allison Cronk',
      'Mon/Wed 4:15 PM · Sat 9:45 AM',
      'Moulton Meadows · Alta Laguna',
    ],
    fromPrice: '$42/week',
    href: '/schedules',
  },
  {
    title: 'Orange Ball',
    eyebrow: 'Ages 7–8 · 60 min · 8 players',
    description:
      'Bigger court, faster ball. Players move to a 60-foot court with orange balls. Direction becomes a coached focus. Volleys and overhand serves are introduced through games.',
    image: PROGRAM_IMAGES['orange-ball'].src,
    imageAlt: PROGRAM_IMAGES['orange-ball'].alt,
    objectPosition: PROGRAM_IMAGES['orange-ball'].objectPosition,
    details: [
      'Coach: Allison Cronk',
      'Mon/Wed · Tue/Thu · Sat',
      'Moulton Meadows · Alta Laguna',
    ],
    fromPrice: '$42/week',
    href: '/schedules',
  },
  {
    title: 'Green Dot',
    eyebrow: 'Ages 9–11 · 60 min · 8 players',
    description:
      'Full-size court. Green dot balls — 25% slower than regulation. This is where players learn to think. We introduce Phase Play: is this a rally ball, an attack ball, or a defensive ball?',
    image: PROGRAM_IMAGES['green-dot'].src,
    imageAlt: PROGRAM_IMAGES['green-dot'].alt,
    objectPosition: PROGRAM_IMAGES['green-dot'].objectPosition,
    details: [
      'Coach: Allison Cronk',
      'Tue/Thu 4:30 PM · Sat 11:45 AM',
      'Moulton Meadows · Alta Laguna',
    ],
    fromPrice: '$42/week',
    href: '/schedules',
  },
  {
    title: 'Competitive Green Dot',
    eyebrow: 'Ages 9–11+ · 2 hours · 6 players',
    description:
      'For green dot players ready for more than group classes. Match play, point construction, and tournament preparation — structured competition in a small-group setting.',
    image: PROGRAM_IMAGES['competitive-green-dot'].src,
    imageAlt: PROGRAM_IMAGES['competitive-green-dot'].alt,
    objectPosition: PROGRAM_IMAGES['competitive-green-dot'].objectPosition,
    details: [
      'Coach: Peter DeFrantz',
      'Tue/Thu · Fri at LBHS',
      'Alta Laguna · LBHS',
    ],
    fromPrice: '$62.50/week',
    href: '/book',
    cta: 'Apply now',
    badge: 'By invitation',
  },
  {
    title: 'Junior Development — Tier 1',
    eyebrow: 'UTR 1–4 · Ages 11–18 · 2 hours',
    description:
      'The first competitive training tier. Players develop their own playing style, learn to manage points independently, and build the physical and mental habits tournament play demands.',
    image: PROGRAM_IMAGES['player-development'].src,
    imageAlt: PROGRAM_IMAGES['player-development'].alt,
    objectPosition: PROGRAM_IMAGES['player-development'].objectPosition,
    details: [
      'Coaches: Peter · Robert · Andrew',
      '6 players per coach',
      'Mon/Wed · Fri (competition only)',
    ],
    fromPrice: '$62.50/week',
    href: '/book',
    cta: 'Apply now',
    badge: 'Coach approval',
  },
  {
    title: 'Junior Development — Tier 2',
    eyebrow: 'UTR 4–7 · Ages 11–18 · 2 hours',
    description:
      'Higher intensity. Deeper tactical work. Players at this level are refining their competitive identity — building the game they will carry into tournaments and beyond.',
    image: PROGRAM_IMAGES['high-performance'].src,
    imageAlt: PROGRAM_IMAGES['high-performance'].alt,
    objectPosition: PROGRAM_IMAGES['high-performance'].objectPosition,
    details: [
      'Coaches: Peter · Robert · Andrew',
      '6 players per coach',
      'Alta Laguna · LBHS (Fri)',
    ],
    fromPrice: '$62.50/week',
    href: '/book',
    cta: 'Apply now',
    badge: 'Coach approval',
  },
  {
    title: 'High Performance',
    eyebrow: 'UTR 8+ · Ages 12–17 · 2 hours · 6 players',
    description:
      'The highest level of training at LBTA. Every session simulates tournament conditions. UTR 8+ required. This is where competitive juniors prepare for nationals and collegiate play.',
    image: PROGRAM_IMAGES['high-performance'].src,
    imageAlt: PROGRAM_IMAGES['high-performance'].alt,
    objectPosition: PROGRAM_IMAGES['high-performance'].objectPosition,
    details: [
      'Coaches: Andrew · Peter',
      'Mon/Wed 6:30–8:30 PM · Fri 4:30 PM',
      'LBHS (lighted courts)',
    ],
    fromPrice: '$100/session',
    href: '/high-performance-pathway',
    cta: 'Learn more',
    badge: 'UTR 8+ required',
  },
]

/* ─── Data: Adult Pathway ─── */

const adultPathway: PathwayStep[] = [
  {
    title: 'New to Tennis',
    eyebrow: 'All Levels · 60 min · 6 players',
    description:
      'No rating required. No experience needed. We get you hitting the ball on day one. Small groups, real instruction, and a welcoming environment for adults picking up a racquet for the first time — or the first time in years.',
    image: PROGRAM_IMAGES['new-to-tennis'].src,
    imageAlt: PROGRAM_IMAGES['new-to-tennis'].alt,
    objectPosition: PROGRAM_IMAGES['new-to-tennis'].objectPosition,
    details: [
      'Mon/Wed 6:30 PM · Tue/Thu 10 AM · Sat 9 AM',
      'Coaches: Peter · Andrew · Robert',
      'Moulton Meadows · LBHS',
    ],
    fromPrice: '$42/week',
    href: '/schedules',
  },
  {
    title: 'Beyond Beginner',
    eyebrow: 'Rallying Consistently · 60 min · 6 players',
    description:
      'You can rally. You can serve. Now learn to place the ball and start thinking about doubles strategy. The bridge from hitting to playing.',
    image: PROGRAM_IMAGES['beyond-beginner'].src,
    imageAlt: PROGRAM_IMAGES['beyond-beginner'].alt,
    objectPosition: PROGRAM_IMAGES['beyond-beginner'].objectPosition,
    details: [
      'Mon/Wed 6:30 PM',
      'Coaches: Allison · Peter',
      'Moulton Meadows',
    ],
    fromPrice: '$42/week',
    href: '/schedules',
  },
  {
    title: 'Intermediate',
    eyebrow: 'NTRP 3.0–4.0 · 90 min · 6 players',
    description:
      'Tennis becomes a tactical sport at this level. The 90-minute format gives 30+ minutes of real match play every session. USTA league preparation begins here.',
    image: PROGRAM_IMAGES['adult-intermediate'].src,
    imageAlt: PROGRAM_IMAGES['adult-intermediate'].alt,
    objectPosition: PROGRAM_IMAGES['adult-intermediate'].objectPosition,
    details: [
      'Tue/Thu 11 AM · Sat 10 AM',
      'Coaches: Andrew · Robert',
      'LBHS',
    ],
    fromPrice: '$58/week',
    href: '/schedules',
  },
  {
    title: 'Advanced',
    eyebrow: 'NTRP 4.0+ · 2 hours · 6 players',
    description:
      'Full tactical play. Phase Play is assumed. All five ball controls are active. Feeds directly into USTA league teams and UTR competition — the final group training tier.',
    image: PROGRAM_IMAGES['adult-advanced'].src,
    imageAlt: PROGRAM_IMAGES['adult-advanced'].alt,
    objectPosition: PROGRAM_IMAGES['adult-advanced'].objectPosition,
    details: [
      'Mon/Fri 12–2 PM',
      'Coaches: Peter · Andrew',
      'LBHS',
    ],
    fromPrice: '$62.50/week',
    href: '/schedules',
  },
]

/* ─── Data: Ways to Save ─── */

const savings = [
  { label: 'Early Bird', discount: '5% off', detail: 'Register 2+ weeks before the season' },
  { label: 'Sibling', discount: '10% off', detail: 'Additional children in the same program' },
  { label: 'Multi-Season', discount: '5% off', detail: 'Register for 2 consecutive seasons' },
  { label: 'Multi-Camp Week', discount: '10% off', detail: '4+ weeks of summer camp' },
  { label: 'Annual Payment', discount: '10% off', detail: 'Full year paid upfront' },
]

/* ─── Page ─── */

export default function Programs() {
  const privateRates = getPrivateRates()
  const leaguesPricing = pricingSupplemental.leagues

  return (
    <>
      <CourseSchema />

      {/* ── 1. Hero ── */}
      <section className="relative min-h-[55vh] md:min-h-[62vh] flex items-center justify-center overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/hero.webp"
            alt="Tennis programs and training at Laguna Beach Tennis Academy"
            fill
            className="object-cover max-md:brightness-[0.9]"
            style={{ objectPosition: '50% 48%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 hero-scrim-branded" aria-hidden="true" />
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block text-shadow-hero-readable">
              Laguna Beach, California
            </span>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <h1 className="font-headline text-display-xl text-white mb-5 text-shadow-hero-readable">
              Every Player Has a Path.
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <p className="font-sans text-body-lg font-light text-white/85 max-w-2xl mx-auto mb-8 text-shadow-hero-readable">
              From age three to college pathway. From first rally to USTA league.
              One coaching system, every court.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#junior-pathway"
                className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Find Your Program
              </a>
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/25 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/60 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Book a Trial
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      {/* ── Pathway Chooser ── */}
      <PathwayChooser />

      {/* ── 2. The Mateljan Method ── */}
      <MethodSection />

      <HorizonDivider />

      {/* ── 3. Junior Pathway ── */}
      <section id="junior-pathway" className="container-lbta section bg-brand-morning-light scroll-mt-20">
        <AnimatedSection>
          <div className="text-center mb-14 md:mb-20">
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
              Ages 3–17
            </span>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              The Junior Pathway
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-2xl mx-auto leading-relaxed">
              A clear progression from play to competition. Every stage builds on the last —
              the same coaching language, the same method, growing with your child.
            </p>
          </div>
        </AnimatedSection>
        <PathwayTimeline steps={juniorPathway} />
      </section>

      <HorizonDivider />

      {/* ── 4. Adult Pathway ── */}
      <section id="adult-pathway" className="container-lbta section bg-brand-sandstone/40 scroll-mt-20">
        <AnimatedSection>
          <div className="text-center mb-14 md:mb-20">
            <span className="text-eyebrow text-brand-sunset-cliff mb-4 block">
              Beginner – Advanced
            </span>
            <h2 className="font-headline text-[clamp(2rem,5vw,3.5rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              The Adult Pathway
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-2xl mx-auto leading-relaxed">
              Whether you played in college or you have never held a racquet, there is a
              place for you here. Small groups. Real instruction. A path into leagues and
              rated match play.
            </p>
          </div>
        </AnimatedSection>
        <PathwayTimeline steps={adultPathway} />
      </section>

      <HorizonDivider />

      {/* ── 5. Competition & Leagues ── */}
      <section className="container-lbta section bg-brand-morning-light">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
              Competitive Play
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              Leagues &amp; Match Play
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-xl mx-auto leading-relaxed">
              Ready for competition? Two formats — team-based USTA league play
              and rated weekend matchplay through UTR.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <AnimatedSection>
            <Link
              href="/programs/utr-match-play"
              className="group block h-full bg-white border border-brand-pacific-dusk/5 rounded-[2px] p-7 md:p-9 hover:border-brand-pacific-dusk/12 hover:shadow-[0_8px_32px_rgba(27,58,92,0.06)] transition-all duration-300"
            >
              <span className="text-eyebrow text-brand-sunset-cliff mb-3 block">
                UTR Match Play Series
              </span>
              <h3 className="font-headline text-[22px] md:text-[26px] font-medium text-brand-pacific-dusk mb-3 group-hover:text-brand-deep-water transition-colors">
                Weekend Rated Matchplay
              </h3>
              <p className="font-sans text-[15px] text-brand-pacific-dusk/60 leading-relaxed mb-4">
                Eight weekends of structured competition plus Grand Finals. Four
                divisions from Color Ball juniors to advanced singles and doubles.
                Every result reported to UTR.
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                  From {leaguesPricing.perSeason}/season
                </span>
                <span className="font-sans text-[13px] font-medium text-brand-sunset-cliff group-hover:underline">
                  Learn more &rarr;
                </span>
              </div>
            </Link>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <Link
              href="/programs/usta-adult-league"
              className="group block h-full bg-white border border-brand-pacific-dusk/5 rounded-[2px] p-7 md:p-9 hover:border-brand-pacific-dusk/12 hover:shadow-[0_8px_32px_rgba(27,58,92,0.06)] transition-all duration-300"
            >
              <span className="text-eyebrow text-brand-victoria-cove mb-3 block">
                USTA Adult League
              </span>
              <h3 className="font-headline text-[22px] md:text-[26px] font-medium text-brand-pacific-dusk mb-3 group-hover:text-brand-deep-water transition-colors">
                Team Competition
              </h3>
              <p className="font-sans text-[15px] text-brand-pacific-dusk/60 leading-relaxed mb-4">
                LBTA fields teams in the USTA SoCal Orange County league area.
                Weekly matches against OC clubs, plus coached practice every week
                with Andrew.
              </p>
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                  From {leaguesPricing.perWeekApprox}/week
                </span>
                <span className="font-sans text-[13px] font-medium text-brand-sunset-cliff group-hover:underline">
                  Learn more &rarr;
                </span>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      {/* ── 6. LiveBall & Cardio Tennis ── */}
      <section className="bg-brand-sandstone/40">
        <div className="container-lbta section">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
                Fitness &amp; Community
              </span>
              <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
                LiveBall &amp; Cardio Tennis
              </h2>
              <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-xl mx-auto leading-relaxed">
                High-energy, coach-fed sessions open to all levels. 150–200 ball
                contacts per session. Drop in anytime.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* LiveBall */}
            <AnimatedSection>
              <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] overflow-hidden h-full">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={PROGRAM_IMAGES['liveball'].src}
                    alt={PROGRAM_IMAGES['liveball'].alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: PROGRAM_IMAGES['liveball'].objectPosition }}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    quality={85}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-headline text-[22px] font-medium text-brand-pacific-dusk mb-2">
                    LiveBall
                  </h3>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed mb-3">
                    Coach-fed, high-tempo sessions. Intermediate and Advanced
                    (3.5+) formats. 90 minutes of structured play.
                  </p>
                  <p className="font-sans text-[13px] text-brand-pacific-dusk/45 mb-4">
                    Thu · Sat · Sun &middot; NTRP 2.5+
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                      $150/mo · $50 drop-in
                    </span>
                    <Link
                      href="/fitness"
                      className="font-sans text-[13px] font-medium text-brand-sunset-cliff hover:underline min-h-[48px] inline-flex items-center"
                    >
                      View schedule &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Cardio Tennis */}
            <AnimatedSection delay={100}>
              <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] overflow-hidden h-full">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={PROGRAM_IMAGES['cardio-tennis'].src}
                    alt={PROGRAM_IMAGES['cardio-tennis'].alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: PROGRAM_IMAGES['cardio-tennis'].objectPosition }}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    quality={85}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="font-headline text-[22px] font-medium text-brand-pacific-dusk mb-2">
                    Cardio Tennis
                  </h3>
                  <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed mb-3">
                    Tennis-based fitness. High-intensity rallies, movement drills,
                    and competitive games — all coach-fed. All levels welcome.
                  </p>
                  <p className="font-sans text-[13px] text-brand-pacific-dusk/45 mb-4">
                    Friday 9 AM · LBHS · Robert LeBuhn
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                      $150/mo · $50 drop-in
                    </span>
                    <Link
                      href="/fitness"
                      className="font-sans text-[13px] font-medium text-brand-sunset-cliff hover:underline min-h-[48px] inline-flex items-center"
                    >
                      View schedule &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <HorizonDivider />

      {/* ── 7. Camps Highlight ── */}
      <section className="container-lbta section bg-brand-morning-light">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-eyebrow text-brand-sunset-cliff mb-4 block">
              Seasonal &amp; Holiday
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              Camps
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-xl mx-auto leading-relaxed">
              Summer, spring break, Thanksgiving, and winter break. Two tracks
              by age — all at LBTA locations in Laguna Beach.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto mb-10">
          <AnimatedSection>
            <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] overflow-hidden h-full">
              <div className="relative aspect-[16/9]">
                <Image
                  src={PROGRAM_IMAGES['camps'].src}
                  alt={PROGRAM_IMAGES['camps'].alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: PROGRAM_IMAGES['camps'].objectPosition }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  quality={85}
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="text-eyebrow text-brand-victoria-cove mb-2 block">Ages 5–11</span>
                <h3 className="font-headline text-[22px] font-medium text-brand-pacific-dusk mb-2">
                  Tennis &amp; Adventure Camp
                </h3>
                <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed mb-3">
                  Tennis instruction, field games, arts and crafts, pickleball, and Water Day
                  Thursdays. Grouped by age — Explorers (5–7) and Trailblazers (8–11).
                </p>
                <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                  From $325/week · Full day $495/week
                </span>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] overflow-hidden h-full">
              <div className="relative aspect-[16/9]">
                <Image
                  src={PROGRAM_IMAGES['high-performance'].src}
                  alt="Competitive junior training during summer camp at LBTA"
                  fill
                  className="object-cover"
                  style={{ objectPosition: PROGRAM_IMAGES['high-performance'].objectPosition }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  quality={85}
                />
              </div>
              <div className="p-6 md:p-8">
                <span className="text-eyebrow text-brand-sunset-cliff mb-2 block">Ages 12–17 · By Application</span>
                <h3 className="font-headline text-[22px] font-medium text-brand-pacific-dusk mb-2">
                  Summer Training Camp
                </h3>
                <p className="font-sans text-[14px] text-brand-pacific-dusk/60 leading-relaxed mb-3">
                  Week-long training for competitive juniors. Technical drilling, tactical
                  development, match play, and physical conditioning — grouped by UTR level.
                </p>
                <span className="font-sans text-[13px] text-brand-pacific-dusk/45">
                  From $325/week · Full day $595/week
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="text-center">
            <Link
              href="/camps"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2"
            >
              View All Camps
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <HorizonDivider />

      {/* ── 8. Private Coaching ── */}
      <section className="container-lbta section bg-brand-sandstone/40">
        <AnimatedSection>
          <div className="text-center mb-12">
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
              One-on-One
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              Private Coaching
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-xl mx-auto leading-relaxed">
              Personal sessions built around your goals. Book with any coach
              on the team.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
          {privateRates.map((coach, i) => (
            <AnimatedSection key={coach.coach} delay={i * 60}>
              <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] p-6 h-full flex flex-col">
                <h3 className="font-headline text-[18px] font-medium text-brand-pacific-dusk mb-1">
                  {coach.coach}
                </h3>
                <span className="font-sans text-[12px] text-brand-pacific-dusk/50 mb-4 block">
                  {coach.specialty}
                </span>
                <div className="mt-auto space-y-1.5">
                  <div className="flex justify-between font-sans text-[13px] text-brand-pacific-dusk/65">
                    <span>60 min</span>
                    <span className="font-medium text-brand-pacific-dusk">${coach.rate_60}</span>
                  </div>
                  <div className="flex justify-between font-sans text-[13px] text-brand-pacific-dusk/65">
                    <span>90 min</span>
                    <span className="font-medium text-brand-pacific-dusk">${coach.rate_90}</span>
                  </div>
                  {coach.pack_10 && (
                    <div className="flex justify-between font-sans text-[12px] text-brand-pacific-dusk/45 pt-1 border-t border-brand-pacific-dusk/5">
                      <span>10-pack</span>
                      <span>${coach.pack_10}</span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="text-center">
            <Link
              href="/book"
              className="font-sans text-[14px] font-medium text-brand-sunset-cliff hover:text-brand-sunset-cliff/80 transition-colors inline-flex items-center gap-1 min-h-[48px]"
            >
              Book a private lesson &rarr;
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <HorizonDivider />

      {/* ── 9. Ways to Save ── */}
      <section className="container-lbta section bg-brand-morning-light">
        <AnimatedSection>
          <div className="text-center mb-10">
            <span className="text-eyebrow text-brand-victoria-cove mb-4 block">
              Investment
            </span>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,3rem)] font-medium text-brand-pacific-dusk leading-[1.15] mb-4">
              Ways to Save
            </h2>
            <p className="font-sans text-body text-brand-pacific-dusk/65 max-w-lg mx-auto leading-relaxed">
              No hidden fees. No contracts. Seasonal pricing calculated the same way for
              every program: per-week rate times number of weeks.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {savings.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 50}>
              <div className="bg-white border border-brand-pacific-dusk/5 rounded-[2px] p-5 h-full">
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-sans text-[15px] font-medium text-brand-pacific-dusk">
                    {s.label}
                  </h3>
                  <span className="font-sans text-[12px] font-medium text-brand-victoria-cove">
                    {s.discount}
                  </span>
                </div>
                <p className="font-sans text-[13px] text-brand-pacific-dusk/50 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </AnimatedSection>
          ))}
          <AnimatedSection delay={savings.length * 50}>
            <div className="bg-brand-deep-water/[0.03] border border-brand-pacific-dusk/5 rounded-[2px] p-5 h-full">
              <h3 className="font-sans text-[15px] font-medium text-brand-pacific-dusk mb-1">
                Scholarship Program
              </h3>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/50 leading-relaxed">
                $25,000 annual budget. 25–50% coverage.{' '}
                <Link href="/apply-scholarship" className="text-brand-victoria-cove hover:underline">
                  Apply here
                </Link>.
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection>
          <div className="text-center">
            <Link
              href="/schedules"
              className="font-sans text-[14px] font-medium text-brand-sunset-cliff hover:text-brand-sunset-cliff/80 transition-colors inline-flex items-center gap-1 min-h-[48px]"
            >
              View full pricing &rarr;
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* ── 10. Dark CTA ── */}
      <DarkSection className="py-20 md:py-28">
        <div className="max-w-[640px] mx-auto text-center">
          <AnimatedSection>
            <h2 className="font-headline text-[clamp(1.5rem,4vw,2.5rem)] font-medium text-white leading-[1.2] mb-4">
              Start training with purpose.
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <p className="font-sans text-[16px] md:text-[17px] text-white/60 mb-9 leading-relaxed">
              Book a complimentary trial to find your level and meet the coaching
              team — or view the full schedule and pricing for every program.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-white text-brand-deep-water font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                Book a Trial
              </Link>
              <Link
                href="/schedules"
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/20 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              >
                View Schedules
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </DarkSection>
    </>
  )
}
