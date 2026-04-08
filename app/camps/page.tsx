'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import RegistrationModal from '@/components/RegistrationModal'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import HorizonDivider from '@/components/ui/HorizonDivider'
import AnimatedSection from '@/components/AnimatedSection'

const MON_WED_SCHEDULE = [
  ['9:00 AM', 'Camp Huddle - team assignments, daily challenge'],
  ['9:10 AM', 'Tennis Block 1 - skill drills by age group'],
  ['10:00 AM', 'Snack and shade break'],
  ['10:20 AM', 'Tennis games and skill application'],
  ['11:00 AM', 'Field Games - Capture the Flag, Gaga Ball, relays'],
  ['12:00 PM', 'AM half-day pickup - Full-day lunch at the pavilion'],
  ['12:30 PM', 'PM half-day drop-off - Arts and crafts (themed to the week)'],
  ['1:15 PM', 'Tennis Block 2 - match play and competition'],
  ['2:30 PM', 'Closing circle - MVP of the day, team points, high-five line'],
  ['3:00 PM', 'Pickup'],
] as const

const THURSDAY_SCHEDULE = [
  ['9:00 AM', 'Camp Huddle - Splash Wars team reveal'],
  ['9:10 AM', 'Tennis - fun format games, relay rally, Music Tennis'],
  ['10:05 AM', 'Splash Wars Round 1 - slip-n-slides, water balloons, sponge relays'],
  ['12:00 PM', 'AM half-day pickup - Full-day lunch'],
  ['12:30 PM', 'PM half-day drop-off - Splash Wars Round 2 - squirt guns, sprinkler games, ice excavation'],
  ['1:15 PM', "Tennis Block 2 - week's best matches"],
  ['2:30 PM', 'Week Closing - passport stamp, MVP, team standings'],
  ['3:00 PM', 'Pickup'],
] as const

const WEEKLY_THEMES = [
  ['Week 1', 'Jun 16-19', 'Explorer Week', 'Scavenger hunts, discovery games, and finding your tennis superpower'],
  ['Week 2', 'Jun 23-26', 'Target Week', 'Accuracy challenges on court, on the field, and in the water'],
  ['Week 3', 'Jun 30-Jul 3', 'Champions Week', 'Brackets, tournaments, and one camp champion crowned'],
  ['Week 4', 'Jul 7-10', 'Mad Scientist Week', 'Trick shots, wild experiments, and the strangest tennis games ever invented'],
  ['Week 5', 'Jul 14-17', 'Pirate Week', 'Treasure hunts, capture the treasure, and X marks the court'],
  ['Week 6', 'Jul 21-24', 'Carnival Week', 'Skill stations, prize tickets, and a full tennis carnival'],
  ['Week 7', 'Jul 28-31', 'Superhero Week', 'Team relay challenges and discovering your tennis superpower'],
  ['Week 8', 'Aug 4-7', 'Ultimate Splash Week', 'The biggest Splash Wars of the summer - two water days'],
  ['Week 9', 'Aug 11-14', 'Olympics Week', 'Opening ceremony, country teams, and a five-event decathlon'],
  ['Week 10', 'Aug 18-19', 'All-Star Finale', 'Best-of everything, camp awards, and the ultimate send-off (2 days)'],
] as const

const PARENT_FAQS = [
  {
    q: 'What should my child bring?',
    a: 'Water bottle, snack (half-day) or snack and lunch (full-day), sunscreen applied before drop-off, athletic shoes, and a hat. Thursdays: add a towel, change of clothes, and water shoes if they have them.',
  },
  {
    q: 'How do you handle the heat?',
    a: 'Sunscreen station at check-in. Reapplication at 10am and 12:30pm. Water breaks every 30 minutes. Shaded rest periods after lunch. Otter Pops on hot days. If it hits 95 degrees or above, afternoon activities move to shaded areas and we reduce court time.',
  },
  {
    q: 'What levels do you coach?',
    a: 'Three groups: Red Ball (ages 5-6, 36-foot court), Orange Ball (ages 7-8, 60-foot court), and Green Dot (ages 9-11, full court with green dot balls). Every child plays on the right court with the right equipment. No one-size-fits-all drills.',
  },
  {
    q: 'Can my child try a single day?',
    a: 'Yes. Drop-in is $85/day for half-day or $99/day for full-day, subject to availability. We recommend a full week - the rhythm of daily themes, team points, and the Achievement Band makes multi-day attendance a much better experience.',
  },
  {
    q: 'What about the pool?',
    a: "The Alta Laguna pool is closed for renovation this summer. In its place, every Thursday is Splash Wars - slip-n-slides, water balloons, squirt guns, and sprinkler games on the grass. It's become the highlight of the week.",
  },
  {
    q: 'How do I register?',
    a: 'Click "Reserve Your Week" above or contact us at support@lagunabeachtennisacademy.com / (949) 534-0457. Spaces are limited to 8 campers per week per age group. Multi-week and sibling discounts applied at checkout.',
  },
] as const

export default function CampsPage() {
  const [activeSchedule, setActiveSchedule] = useState<'monWed' | 'thursday'>('monWed')
  const [selectedProgram, setSelectedProgram] = useState<{ name: string; details: string } | null>(null)

  const openCampModal = (name: string, details: string) => setSelectedProgram({ name, details })

  return (
    <>
      <section className="relative min-h-[min(85vh,820px)] overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dv033eo0x/image/upload/v1775614949/Summer-Tennis-Camps-Program-Photo-1200x851-2_ry29pi.jpg"
            alt="LBTA summer camp players on court in Laguna Beach"
            fill
            className="object-cover max-md:brightness-[0.92]"
            style={{ objectPosition: '50% 40%' }}
            sizes="100vw"
            priority
            quality={95}
          />
          <div className="absolute inset-0 hero-scrim-branded" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[min(85vh,820px)] max-w-[1200px] flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-24 md:pt-32 lg:justify-center lg:pb-28">
          <div className="max-w-[34rem] text-left">
            <p className="font-sans text-eyebrow mb-4 text-brand-victoria-cove text-shadow-hero-readable">
              Summer 2026
            </p>
            <h1 className="font-headline text-display-xl mb-5 text-white text-shadow-hero-readable">
              The Best Summer in Laguna Beach
            </h1>
            <p className="font-sans text-body-lg max-w-xl font-light text-white text-shadow-hero-readable max-md:text-white/95 md:text-white/90">
              Tennis, field games, arts and crafts, and Splash Wars every Thursday. Ages 5-11 at Alta Laguna Park.
              Mon-Thu, June 16 - August 19.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() =>
                  openCampModal(
                    'Summer Camp - Reserve Your Week',
                    'Ages 5-11 - Alta Laguna Park - Mon-Thu (June 16 - Aug 19)'
                  )
                }
                className="inline-flex min-h-[48px] items-center justify-center bg-white px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-brand-deep-water transition-all duration-300 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
              >
                Reserve Your Week
              </button>
              <Link
                href="#choose-schedule"
                className="inline-flex min-h-[48px] items-center justify-center border border-white/45 bg-transparent px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-[2px]"
              >
                Choose Your Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white pt-4">
        <Breadcrumbs items={[{ label: 'Camps' }]} />
      </div>

      <HorizonDivider />

      <section className="bg-brand-morning-light section">
        <div className="container-lbta space-y-16 md:space-y-20">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">What they&apos;ll do</p>
              <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">A week built for movement and joy</h2>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                <Image
                  src="/images/camps/camp-action-1.webp"
                  alt="Kids rallying on court in morning light at LBTA summer camp"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={92}
                />
              </div>
              <div>
                <h3 className="font-headline text-display-sm mb-3 text-brand-pacific-dusk">Real Tennis, Real Coaching</h3>
                <p className="font-sans text-body text-brand-pacific-dusk/80">
                  Every morning and afternoon starts on the court. Coach Peter DeFrantz runs age-appropriate groups - Red Ball for ages 5-6,
                  Orange Ball for 7-8, Green Dot for 9-11 - each on the right court with the right ball. Kids work on stroke fundamentals,
                  rally building, serve technique, and match play. Full-day campers get 10+ hours of court time per week.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1">
                <h3 className="font-headline text-display-sm mb-3 text-brand-pacific-dusk">Splash Wars Every Thursday</h3>
                <p className="font-sans text-body text-brand-pacific-dusk/80">
                  Thursday is the day they talk about all week. Slip-n-slides on the grass. Water balloon battles. Sponge relay races.
                  Sprinkler games. Full-day campers get two rounds - one before lunch, one after. Half-day campers get one.
                  Bring a towel, bring a change of clothes.
                </p>
              </div>
              <div className="order-1 md:order-2 relative aspect-[4/3] overflow-hidden rounded-[2px]">
                <Image
                  src="/images/camps/camp-action-2.webp"
                  alt="Campers in Splash Wars activities at Alta Laguna Park"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={92}
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
                <Image
                  src="/images/camps/camp-action-3.webp"
                  alt="Campers doing field games and crafts under the shade pavilion"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={92}
                />
              </div>
              <div>
                <h3 className="font-headline text-display-sm mb-3 text-brand-pacific-dusk">More Than Tennis</h3>
                <p className="font-sans text-body text-brand-pacific-dusk/80">
                  Between court sessions: Capture the Flag, Gaga Ball, relay races, obstacle courses, scavenger hunts, and arts and crafts
                  under the shade pavilion. Every week follows a different theme so no two weeks feel the same.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-white section">
        <div className="container-lbta">
          <AnimatedSection className="mb-8 md:mb-10">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">A day at camp</p>
            <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">Plan the week with confidence</h2>
          </AnimatedSection>

          <div className="mb-6 flex gap-2 border-b border-black/10">
            <button
              type="button"
              onClick={() => setActiveSchedule('monWed')}
              className={`min-h-[48px] border-b-2 px-4 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] ${
                activeSchedule === 'monWed'
                  ? 'border-brand-pacific-dusk text-brand-pacific-dusk'
                  : 'border-transparent text-brand-pacific-dusk/50'
              }`}
            >
              Mon-Wed
            </button>
            <button
              type="button"
              onClick={() => setActiveSchedule('thursday')}
              className={`min-h-[48px] border-b-2 px-4 py-3 font-sans text-[12px] font-semibold uppercase tracking-[0.14em] ${
                activeSchedule === 'thursday'
                  ? 'border-brand-pacific-dusk text-brand-pacific-dusk'
                  : 'border-transparent text-brand-pacific-dusk/50'
              }`}
            >
              Thursday (Splash Wars)
            </button>
          </div>

          <div className="overflow-x-auto rounded-[2px] border border-black/10 bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10 bg-brand-sandstone/40">
                  <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/60">Time</th>
                  <th className="px-4 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/60">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {(activeSchedule === 'monWed' ? MON_WED_SCHEDULE : THURSDAY_SCHEDULE).map(([time, activity]) => (
                  <tr key={`${time}-${activity}`}>
                    <td className="whitespace-nowrap px-4 py-3 font-sans text-[14px] font-medium text-brand-pacific-dusk">{time}</td>
                    <td className="px-4 py-3 font-sans text-[14px] text-brand-pacific-dusk/80">{activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-brand-morning-light section">
        <div className="container-lbta">
          <AnimatedSection className="mb-8 md:mb-10">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">Weekly themes</p>
            <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">10 Weeks. 10 Themes. No Repeats.</h2>
          </AnimatedSection>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {WEEKLY_THEMES.map(([week, dates, theme, desc]) => (
              <article key={week} className="rounded-[2px] border border-black/8 bg-white p-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-pacific-dusk/50">{week}</p>
                <p className="mt-1 font-sans text-[12px] text-brand-pacific-dusk/65">{dates}</p>
                <h3 className="mt-3 font-headline text-[1.3rem] leading-tight text-brand-pacific-dusk">{theme}</h3>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-brand-pacific-dusk/75">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section id="choose-schedule" className="bg-white section">
        <div className="container-lbta">
          <AnimatedSection className="mb-8 md:mb-10">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">Choose your schedule</p>
            <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">Pick the week that fits your family</h2>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[2px] border border-black/8 bg-brand-morning-light p-6">
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk">Half-Day</h3>
              <p className="mt-2 font-headline text-[2rem] text-brand-pacific-dusk">$325 / week</p>
              <p className="mt-3 font-sans text-[14px] text-brand-pacific-dusk/75">Monday-Thursday - AM 9am-12pm or PM 12pm-3pm</p>
              <ul className="mt-4 space-y-2 font-sans text-[14px] text-brand-pacific-dusk/80">
                <li>5+ hours of tennis coaching</li>
                <li>Field games or crafts (depending on session)</li>
                <li>One round of Splash Wars on Thursday</li>
                <li>LBTA Achievement Band</li>
              </ul>
              <p className="mt-4 font-sans text-[13px] text-brand-pacific-dusk/65">Drop-in: $85/day</p>
              <button
                type="button"
                onClick={() => openCampModal('Summer Camp - Half-Day', 'Ages 5-11 - Half-Day session - Alta Laguna Park')}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-[2px] border border-black/15 bg-transparent px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-brand-pacific-dusk transition-all duration-300 hover:border-black/35"
              >
                Reserve Half-Day
              </button>
            </article>

            <article className="rounded-[2px] border border-brand-pacific-dusk/20 bg-white p-6 shadow-[0_12px_28px_rgba(27,58,92,0.08)]">
              <p className="inline-block rounded-[2px] bg-brand-pacific-dusk px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                Most Popular
              </p>
              <h3 className="mt-3 font-headline text-display-sm text-brand-pacific-dusk">Full-Day</h3>
              <p className="mt-2 font-headline text-[2rem] text-brand-pacific-dusk">$495 / week</p>
              <p className="mt-3 font-sans text-[14px] text-brand-pacific-dusk/75">Monday-Thursday, 9am-3pm</p>
              <ul className="mt-4 space-y-2 font-sans text-[14px] text-brand-pacific-dusk/80">
                <li>10+ hours of tennis coaching</li>
                <li>All field games and all crafts</li>
                <li>Both rounds of Splash Wars on Thursday</li>
                <li>Camp Passport with weekly stamps</li>
              </ul>
              <p className="mt-4 font-sans text-[13px] text-brand-pacific-dusk/65">Drop-in: $99/day</p>
              <button
                type="button"
                onClick={() => openCampModal('Summer Camp - Full-Day', 'Ages 5-11 - Full-Day session - Alta Laguna Park')}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-[2px] bg-black px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:bg-gray-800"
              >
                Reserve Full-Day
              </button>
            </article>

            <article className="rounded-[2px] border border-black/8 bg-brand-morning-light p-6">
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk">Multi-Week</h3>
              <p className="mt-2 font-sans text-[15px] text-brand-pacific-dusk/80">Save when you commit</p>
              <ul className="mt-4 space-y-2 font-sans text-[14px] text-brand-pacific-dusk/80">
                <li>4+ weeks: 10% off</li>
                <li>Full summer (10 weeks): 15% off</li>
                <li>Siblings: 10% off second child (stacks with multi-week)</li>
              </ul>
              <button
                type="button"
                onClick={() => openCampModal('Summer Camp - Multi-Week Inquiry', 'Ages 5-11 - Multi-week and sibling discount inquiry')}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-[2px] border border-black/15 bg-transparent px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-brand-pacific-dusk transition-all duration-300 hover:border-black/35"
              >
                Contact for Multi-Week Pricing
              </button>
            </article>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-brand-sandstone/40 section">
        <div className="container-lbta">
          <article className="rounded-[2px] border border-black/10 bg-white p-6 md:p-8">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">For older players</p>
            <h2 className="font-headline text-display-sm mb-4 text-brand-pacific-dusk">Junior Development Camp - Ages 12-17</h2>
            <p className="font-sans text-body text-brand-pacific-dusk/80">
              Competitive training at Laguna Beach High School with Coach Peter DeFrantz. Stroke production, match play,
              point construction, and tactical development for tournament-level players. Half-day only.
            </p>
            <p className="mt-4 font-sans text-[14px] text-brand-pacific-dusk/75">
              Monday-Thursday - AM: 9am-12pm or PM: 1-4pm - $325/week
            </p>
            <button
              type="button"
              onClick={() => openCampModal('Junior Development Camp (12-17)', 'Laguna Beach High School - Half-Day only - $325/week')}
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-8 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:bg-gray-800"
            >
              Reserve Junior Dev Camp
            </button>
          </article>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-brand-deep-water section">
        <div className="container-lbta">
          <AnimatedSection className="mb-8 md:mb-10">
            <p className="font-sans text-eyebrow mb-3 text-white/65">Parent info</p>
            <h2 className="font-headline text-display mb-4 text-white">Everything parents ask before week one</h2>
          </AnimatedSection>
          <div className="divide-y divide-white/10 rounded-[2px] border border-white/10 bg-white/5">
            {PARENT_FAQS.map((faq) => (
              <details key={faq.q} className="group px-5 py-1 sm:px-6 open:bg-white/[0.03]">
                <summary className="cursor-pointer list-none py-4 font-sans text-[15px] font-medium leading-snug text-white outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.q}</span>
                    <span className="mt-0.5 shrink-0 text-white/50 transition-transform duration-300 group-open:rotate-180" aria-hidden="true">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </span>
                </summary>
                <p className="pb-4 pr-8 font-sans text-[14px] leading-relaxed text-white/80">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-white section">
        <div className="container-lbta">
          <AnimatedSection className="mb-8 md:mb-10">
            <p className="font-sans text-eyebrow mb-3 text-brand-victoria-cove">Camps all year</p>
            <h2 className="font-headline text-display mb-4 text-brand-pacific-dusk">We Run Camps Every School Break</h2>
          </AnimatedSection>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[2px] border border-black/8 bg-brand-morning-light p-5">
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk">Spring Break Camp</h3>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">4 days - Mon-Thu - Alta Laguna Park + LBHS</p>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">Ages 5-11 and 12-17</p>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">Full-Day $495 - Half-Day $325</p>
              <p className="mt-4 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/50">Completed - Spring 2026</p>
            </article>
            <article className="rounded-[2px] border border-brand-pacific-dusk/20 bg-white p-5 shadow-[0_12px_28px_rgba(27,58,92,0.08)]">
              <p className="inline-block rounded-[2px] bg-brand-pacific-dusk px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white">Now Enrolling</p>
              <h3 className="mt-3 font-headline text-display-sm text-brand-pacific-dusk">Summer Camp</h3>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">10 weeks - Mon-Thu - June 16-Aug 19</p>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">Ages 5-11 and 12-17</p>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">Full-Day $495/wk - Half-Day $325/wk</p>
              <button
                type="button"
                onClick={() => openCampModal('Summer Camp - Reserve Your Week', 'Ages 5-11 and 12-17 - Mon-Thu weeks')}
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-[2px] bg-black px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[2.5px] text-white transition-all duration-300 hover:bg-gray-800"
              >
                Reserve Your Week
              </button>
            </article>
            <article className="rounded-[2px] border border-black/8 bg-brand-morning-light p-5">
              <h3 className="font-headline text-display-sm text-brand-pacific-dusk">Thanksgiving Break Camp</h3>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">3 days - Mon-Wed - Nov 23-25</p>
              <p className="mt-2 font-sans text-[13px] text-brand-pacific-dusk/75">Ages 5-11: $221 - Ages 12-17: $244</p>
              <p className="mt-4 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-pacific-dusk/50">Registration opens October</p>
            </article>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="relative min-h-[420px] overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/camps/camp-action-4.webp"
            alt="Camp group at closing circle on court"
            fill
            className="object-cover"
            sizes="100vw"
            quality={92}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/25" />
        </div>
        <div className="relative z-10 container-lbta flex min-h-[420px] flex-col items-center justify-center text-center">
          <p className="max-w-3xl font-headline text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-white">
            8 kids per group. 10 themed weeks. One summer they&apos;ll remember.
          </p>
          <button
            type="button"
            onClick={() => openCampModal('Summer Camp - Reserve Your Week', 'Ages 5-11 - Mon-Thu - Alta Laguna Park')}
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-white px-10 py-4 font-sans text-sm font-medium uppercase tracking-[2.5px] text-brand-deep-water transition-all duration-300 hover:bg-gray-100"
          >
            Reserve Your Week
          </button>
        </div>
      </section>

      {selectedProgram && (
        <RegistrationModal
          programName={selectedProgram.name}
          programDetails={selectedProgram.details}
          isOpen={!!selectedProgram}
          onClose={() => setSelectedProgram(null)}
          registrationSource="camps_page_modal"
        />
      )}

      <StickyCTA
        text="Reserve Your Week"
        onClick={() =>
          openCampModal('Summer Camp - Reserve Your Week', 'Ages 5-11 - Mon-Thu (June 16 - Aug 19)')
        }
        showAfterScroll={500}
      />
    </>
  )
}
