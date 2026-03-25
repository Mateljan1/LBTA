import Link from 'next/link'
import Image from 'next/image'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StickyCTA from '@/components/StickyCTA'
import { getLiveBallContent } from '@/lib/liveball-content'
import { getLiveBallSeasonSnapshot } from '@/lib/programs-data'

export default function LiveBallPage() {
  const content = getLiveBallContent()
  const liveBallSeason = getLiveBallSeasonSnapshot()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Fitness', href: '/fitness' }, { label: 'LiveBall' }]} />

      <section className="relative min-h-[58vh] md:min-h-[64vh] flex items-end md:items-center pb-16 md:pb-24 pt-28 md:pt-32 overflow-hidden bg-brand-deep-water">
        <div className="absolute inset-0">
          <Image
            src="/images/liveball/hero-doubles.webp"
            alt="Coach and players during a LiveBall doubles session at LBTA"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 45%' }}
            sizes="100vw"
            priority
            quality={92}
          />
          <div className="absolute inset-0 bg-brand-deep-water/75" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" aria-hidden="true" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 w-full">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-victoria-cove mb-3">
            Fitness & community
          </p>
          <h1 className="font-headline text-[clamp(2rem,6vw,3.5rem)] font-medium text-white leading-[1.08] mb-4">
            LiveBall at LBTA
          </h1>
          <p className="font-headline text-[clamp(1.15rem,2.8vw,1.5rem)] font-light text-white/95 max-w-2xl mb-4 leading-snug">
            {content.outcomeLine}
          </p>
          <p className="font-sans text-[17px] md:text-[18px] leading-relaxed text-white/90 max-w-2xl mb-8">
            {content.sessionObjective}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-black font-sans font-semibold text-[14px] tracking-[0.12em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Book a trial
            </Link>
            <Link
              href="/schedules#fitness"
              className="inline-flex items-center justify-center bg-transparent text-white font-sans font-semibold text-[14px] tracking-[0.12em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] border border-white/35 transition-all duration-300 hover:border-white hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              View schedule
            </Link>
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-brand-morning-light py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="space-y-6 order-2 md:order-1">
            <h2 className="font-headline text-headline-sm text-brand-pacific-dusk">How it works</h2>
            <ul className="space-y-4 font-sans text-[17px] leading-relaxed text-black/85 list-none p-0 m-0">
              {content.howItWorks.map((line, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-brand-victoria-cove shrink-0 mt-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm order-1 md:order-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <Image
              src="/images/liveball/patterns-ready.webp"
              alt="Players in ready position during a high-tempo LiveBall session on a blue court"
              fill
              className="object-cover"
              style={{ objectPosition: '50% 40%' }}
              sizes="(max-width: 768px) 100vw, 45vw"
              quality={90}
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-sandstone py-16 md:py-20 border-y border-black/[0.06]" aria-labelledby="liveball-quote">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          <blockquote className="section-quote my-0">
            <p id="liveball-quote" className="font-headline text-[clamp(1.2rem,2.8vw,1.65rem)] font-light text-brand-pacific-dusk leading-relaxed">
              {content.testimonial.quote}
            </p>
            <footer className="mt-6 font-sans">
              <p className="text-[14px] font-medium text-brand-pacific-dusk">{content.testimonial.author}</p>
              <p className="text-[13px] text-black/60 mt-1">{content.testimonial.role}</p>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-brand-morning-light py-16 md:py-24">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          <h2 className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">{content.firstBall.title}</h2>
          <p className="font-sans text-[17px] leading-relaxed text-black/85 mb-6">{content.firstBall.intro}</p>
          <ul className="space-y-3 font-sans text-[16px] md:text-[17px] leading-relaxed text-black/85 list-disc pl-5 marker:text-brand-victoria-cove">
            {content.firstBall.bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 border-t border-black/[0.06]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h2 className="font-headline text-[clamp(1.75rem,4vw,2.5rem)] text-brand-pacific-dusk mb-3">
              {content.sessionStructure.title}
            </h2>
            <p className="font-sans text-[17px] text-black/70">{content.sessionStructure.subtitle}</p>
            <div className="section-horizon mt-6 opacity-80 mx-auto max-w-xs" aria-hidden="true" />
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
            {content.sessionStructure.blocks.map((b, i) => (
              <li
                key={b.label}
                className="bg-brand-morning-light border border-black/[0.06] p-6 rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-brand-pacific-dusk/55 mb-2">
                  {b.label}
                </p>
                <h3 className="font-headline text-[1.35rem] text-brand-pacific-dusk mb-2">{b.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-black/78">{b.detail}</p>
                <span className="sr-only">{i + 1} of 6</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="bg-brand-morning-light py-16 md:py-24 border-t border-black/[0.06]"
        aria-labelledby="liveball-schedule-heading"
      >
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-10 md:mb-14">
            <h2 id="liveball-schedule-heading" className="font-headline text-headline-sm text-brand-pacific-dusk mb-3">
              Weekly times &amp; pricing
            </h2>
            <p className="font-sans text-[17px] text-black/80 leading-relaxed">
              LiveBall runs on a <span className="font-medium text-brand-pacific-dusk">monthly membership</span> with{' '}
              <span className="font-medium text-brand-pacific-dusk">drop-in</span> options—no quarterly session dates to track. Weekly
              court times and fees below are the same labels you see on{' '}
              <Link
                href="/schedules#fitness"
                className="text-brand-victoria-cove underline underline-offset-4 decoration-brand-victoria-cove/35 hover:decoration-brand-victoria-cove focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove/40 rounded-sm"
              >
                Schedule &amp; Pricing → Fitness &amp; Community
              </Link>{' '}
              (Cardio Tennis and the rest of Fitness live there too).
            </p>
          </div>

          <div className="space-y-10 md:space-y-12">
            {liveBallSeason.programs.map((prog) => (
              <article
                key={prog.id}
                className="bg-white border border-black/[0.06] rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-black/[0.06] bg-brand-morning-light/80">
                  <h3 className="font-headline text-[1.35rem] md:text-[1.5rem] text-brand-pacific-dusk mb-2">
                    {prog.program}
                  </h3>
                  <p className="font-sans text-[15px] md:text-[16px] text-black/80 leading-relaxed">
                    <span className="font-medium text-brand-pacific-dusk">Ages</span> {prog.ages}
                    <span className="text-black/40 mx-2" aria-hidden="true">
                      ·
                    </span>
                    {prog.duration}
                    <span className="text-black/40 mx-2" aria-hidden="true">
                      ·
                    </span>
                    {prog.location}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse font-sans text-[15px] leading-snug">
                    <caption className="sr-only">
                      Weekly times for {prog.program}: {prog.ages}
                    </caption>
                    <thead>
                      <tr className="border-b border-black/[0.08] bg-white text-left text-[11px] font-medium uppercase tracking-[0.14em] text-brand-pacific-dusk/70">
                        <th scope="col" className="py-3 px-4 md:px-6 font-medium">
                          Day
                        </th>
                        <th scope="col" className="py-3 px-4 md:px-6 font-medium">
                          Time
                        </th>
                        <th scope="col" className="py-3 px-4 md:px-6 font-medium">
                          Location
                        </th>
                        <th scope="col" className="py-3 px-4 md:px-6 font-medium">
                          Coach
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prog.schedule.map((row, idx) => (
                        <tr key={`${prog.id}-${row.day}-${idx}`} className="border-b border-black/[0.05] last:border-0">
                          <td className="py-3.5 px-4 md:px-6 text-black/90">{row.day}</td>
                          <td className="py-3.5 px-4 md:px-6 text-black/90 whitespace-nowrap">{row.time}</td>
                          <td className="py-3.5 px-4 md:px-6 text-black/80">
                            {row.location?.trim() ? row.location : prog.location}
                          </td>
                          <td className="py-3.5 px-4 md:px-6 text-black/80">{row.coach ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 md:px-8 md:pb-8 md:pt-6 space-y-3">
                  <p className="font-sans text-[15px] md:text-[16px] text-black/90">
                    <span className="font-medium text-brand-pacific-dusk">Monthly membership:</span>{' '}
                    {prog.monthlyLabel}
                    <span className="text-black/40 mx-2" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-medium text-brand-pacific-dusk">Drop-in:</span> {prog.dropInLabel}
                  </p>
                  <p className="font-sans text-[14px] md:text-[15px] leading-relaxed text-black/65">{prog.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-morning-light py-16 md:py-20 border-t border-black/[0.06]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <Image
              src="/images/liveball/lifestyle.webp"
              alt="Player on an outdoor tennis court during an LBTA session"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              quality={90}
            />
          </div>
          <div className="space-y-8">
            <div className="bg-white/80 border border-black/[0.06] rounded-sm p-6 space-y-4">
              <h3 className="font-headline text-lg text-brand-pacific-dusk">On court</h3>
              <p className="font-sans text-[15px] leading-relaxed text-black/80">{content.culture.communication}</p>
              <p className="font-sans text-[15px] leading-relaxed text-black/80">{content.culture.safety}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[280px] md:min-h-[320px] flex items-center py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/liveball/session-mood.webp"
            alt="Tennis court at dusk with warm light through the fence at LBTA"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 60%' }}
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-brand-deep-water/82" aria-hidden="true" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <p className="font-sans text-[15px] text-white/90 leading-relaxed">
            LiveBall runs alongside Cardio Tennis under our Fitness programming. One schedule, clear pricing—see times
            that fit your week, then book a trial or drop in when space allows.
          </p>
        </div>
      </section>

      <DarkSection className="py-20 md:py-24">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-headline text-[clamp(1.75rem,4vw,2.25rem)] text-brand-sandstone mb-6 leading-tight">
            Ready to try a session?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-black font-sans font-semibold text-[14px] tracking-[0.12em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:bg-brand-sandstone focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Book a trial
            </Link>
            <Link
              href="/schedules#fitness"
              className="inline-flex items-center justify-center border border-white/40 text-white font-sans font-semibold text-[14px] tracking-[0.12em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Schedule & pricing
            </Link>
          </div>
          <p className="mt-8">
            <Link
              href="/fitness"
              className="font-sans text-[15px] text-white/75 underline underline-offset-4 decoration-white/35 hover:decoration-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm"
            >
              Back to Fitness overview
            </Link>
          </p>
        </div>
      </DarkSection>

      <StickyCTA
        text="Book a trial"
        href="/book"
        secondaryText="Schedule"
        secondaryHref="/schedules#fitness"
        showAfterScroll={480}
      />
    </>
  )
}
