import Link from 'next/link'
import Image from 'next/image'
import HorizonDivider from '@/components/ui/HorizonDivider'
import DarkSection from '@/components/ui/DarkSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import StickyCTA from '@/components/StickyCTA'
import { getLiveBallContent } from '@/lib/liveball-content'
import { getLiveBallSeasonSnapshot } from '@/lib/programs-data'

/** Editorial frame: full image visible (letterbox) — avoids harsh crops on mixed aspect ratios. */
function ContainedShot({
  src,
  alt,
  sizes,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  priority?: boolean
}) {
  return (
    <div
      className={`relative w-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px] rounded-[3px] overflow-hidden bg-brand-deep-water ring-1 ring-black/[0.06] shadow-[0_12px_40px_rgba(15,34,55,0.12)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain object-center"
        sizes={sizes}
        quality={92}
        priority={priority}
      />
    </div>
  )
}

export default function LiveBallPage() {
  const content = getLiveBallContent()
  const liveBallSeason = getLiveBallSeasonSnapshot()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Fitness', href: '/fitness' }, { label: 'LiveBall' }]} />

      {/* Hero: split on lg so photography uses half the viewport — less edge crop than full-bleed */}
      <section className="bg-brand-deep-water">
        <div className="lg:grid lg:grid-cols-2 lg:min-h-[min(88vh,900px)] lg:max-w-[1600px] lg:mx-auto">
          <div className="relative z-10 flex flex-col justify-center px-4 pt-28 pb-14 md:px-10 md:pt-32 md:pb-20 lg:px-12 lg:py-24 xl:px-16 order-2 lg:order-1">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-brand-victoria-cove mb-4">
              Fitness & community
            </p>
            <h1 className="font-headline text-[clamp(2.25rem,5vw,3.75rem)] font-medium text-white leading-[1.05] tracking-[-0.02em] mb-5">
              LiveBall at LBTA
            </h1>
            <p className="font-headline text-[clamp(1.2rem,2.4vw,1.55rem)] font-light text-white/95 max-w-xl mb-5 leading-snug">
              {content.outcomeLine}
            </p>
            <p className="font-sans text-[17px] md:text-[18px] leading-[1.65] text-white/88 max-w-xl mb-10 border-l-[3px] border-brand-victoria-cove/80 pl-5">
              {content.sessionObjective}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-white text-black font-sans font-semibold text-[13px] tracking-[0.14em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:bg-brand-sandstone hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-deep-water"
              >
                Book a trial
              </Link>
              <Link
                href="/schedules#fitness"
                className="inline-flex items-center justify-center bg-transparent text-white font-sans font-semibold text-[13px] tracking-[0.14em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] border border-white/30 transition-all duration-300 hover:border-white/60 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
              >
                View schedule
              </Link>
            </div>
          </div>
          <div className="relative min-h-[48vh] lg:min-h-full order-1 lg:order-2">
            <Image
              src="https://res.cloudinary.com/dv033eo0x/image/upload/v1774485572/Advanced_liveball_iyooh6.jpg"
              alt="LiveBall session — high-energy coach-fed point play"
              fill
              className="object-cover object-[center_42%] lg:object-[center_40%]"
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority
              quality={93}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-brand-deep-water via-brand-deep-water/25 to-transparent lg:bg-gradient-to-l lg:from-brand-deep-water/90 lg:via-transparent lg:to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-brand-deep-water/25 lg:hidden" aria-hidden="true" />
          </div>
        </div>
      </section>

      <HorizonDivider />

      <section className="bg-brand-morning-light py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-6">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/55">
                What to expect
              </p>
              <h2 className="font-headline text-[clamp(1.75rem,3.5vw,2.35rem)] text-brand-pacific-dusk leading-tight">
                How we run LiveBall
              </h2>
              <ul className="space-y-5 font-sans text-[17px] leading-[1.65] text-black/85 list-none p-0 m-0">
                {content.howItWorks.map((line, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      className="font-headline text-[1.1rem] text-brand-victoria-cove/90 shrink-0 w-8 tabular-nums"
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <ContainedShot
                src="https://res.cloudinary.com/dv033eo0x/image/upload/v1774485572/Liveball_Intermediate_exqowf.jpg"
                alt="Cardio Tennis fitness-focused hitting session"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative py-20 md:py-28 bg-brand-sandstone border-y border-black/[0.05] overflow-hidden"
        aria-labelledby="liveball-quote"
      >
        <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(46,139,139,0.12),transparent_55%)]" aria-hidden />
        <div className="relative max-w-[720px] mx-auto px-4 md:px-8">
          <blockquote className="section-quote my-0 border-l-[3px] border-brand-victoria-cove pl-6 md:pl-8">
            <p
              id="liveball-quote"
              className="font-headline text-[clamp(1.35rem,3vw,1.85rem)] font-light text-brand-pacific-dusk leading-relaxed"
            >
              {content.testimonial.quote}
            </p>
            <footer className="mt-8 font-sans border-t border-black/[0.08] pt-6">
              <p className="text-[14px] font-medium text-brand-pacific-dusk">{content.testimonial.author}</p>
              <p className="text-[13px] text-black/55 mt-1">{content.testimonial.role}</p>
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[720px] mx-auto px-4 md:px-8">
          <h2 className="font-headline text-[clamp(1.5rem,3vw,1.85rem)] text-brand-pacific-dusk mb-4">{content.firstBall.title}</h2>
          <p className="font-sans text-[17px] leading-[1.65] text-black/82 mb-8">{content.firstBall.intro}</p>
          <ul className="space-y-4 font-sans text-[16px] md:text-[17px] leading-[1.65] text-black/85 list-none pl-0 m-0">
            {content.firstBall.bullets.map((b, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-victoria-cove" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-morning-light py-20 md:py-28 border-t border-black/[0.06]">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-14 md:mb-16">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/55 mb-3">
              Session flow
            </p>
            <h2 className="font-headline text-[clamp(1.75rem,4vw,2.5rem)] text-brand-pacific-dusk mb-4 leading-tight">
              {content.sessionStructure.title}
            </h2>
            <p className="font-sans text-[17px] text-black/72 leading-relaxed">{content.sessionStructure.subtitle}</p>
            <div className="section-horizon mt-8 opacity-80 max-w-xs" aria-hidden="true" />
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 list-none p-0 m-0">
            {content.sessionStructure.blocks.map((b, i) => (
              <li
                key={b.label}
                className="group bg-white border border-black/[0.07] p-7 rounded-[3px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-brand-victoria-cove/25 hover:shadow-[0_8px_28px_rgba(15,34,55,0.08)]"
              >
                <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/45 mb-3">
                  {b.label}
                </p>
                <h3 className="font-headline text-[1.28rem] text-brand-pacific-dusk mb-3 leading-snug">{b.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-black/75">{b.detail}</p>
                <span className="sr-only">
                  {i + 1} of {content.sessionStructure.blocks.length}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="bg-white py-20 md:py-28 border-t border-black/[0.06]"
        aria-labelledby="liveball-schedule-heading"
      >
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/55 mb-3">
              Membership
            </p>
            <h2 id="liveball-schedule-heading" className="font-headline text-[clamp(1.65rem,3.5vw,2.15rem)] text-brand-pacific-dusk mb-5 leading-tight">
              Weekly times &amp; pricing
            </h2>
            <p className="font-sans text-[17px] text-black/78 leading-[1.65]">
              LiveBall runs on a <span className="font-medium text-brand-pacific-dusk">monthly membership</span> with{' '}
              <span className="font-medium text-brand-pacific-dusk">drop-in</span> options—no quarterly session dates to track.
              Times and fees match{' '}
              <Link
                href="/schedules#fitness"
                className="text-brand-victoria-cove underline underline-offset-[5px] decoration-brand-victoria-cove/35 hover:decoration-brand-victoria-cove focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove/40 rounded-sm"
              >
                Schedule &amp; Pricing → Fitness
              </Link>
              .
            </p>
          </div>

          <div className="space-y-12 md:space-y-14">
            {liveBallSeason.programs.map((prog) => (
              <article
                key={prog.id}
                className="rounded-[4px] overflow-hidden border border-black/[0.08] bg-brand-morning-light/40 shadow-[0_4px_32px_rgba(15,34,55,0.06)]"
              >
                <div className="px-6 py-7 md:px-10 md:py-9 bg-gradient-to-br from-white to-brand-morning-light/90 border-b border-black/[0.06]">
                  <h3 className="font-headline text-[1.45rem] md:text-[1.6rem] text-brand-pacific-dusk mb-3 leading-tight">
                    {prog.program}
                  </h3>
                  <p className="font-sans text-[15px] md:text-[16px] text-black/78 leading-relaxed">
                    <span className="font-medium text-brand-pacific-dusk">Ages</span> {prog.ages}
                    <span className="text-black/35 mx-2">·</span>
                    {prog.duration}
                    <span className="text-black/35 mx-2">·</span>
                    {prog.location}
                  </p>
                </div>
                <div className="overflow-x-auto bg-white">
                  <table className="w-full min-w-[560px] border-collapse font-sans text-[15px]">
                    <caption className="sr-only">
                      Weekly times for {prog.program}: {prog.ages}
                    </caption>
                    <thead>
                      <tr className="border-b border-black/[0.08] bg-brand-pacific-dusk/[0.04] text-left text-[10px] font-medium uppercase tracking-[0.16em] text-brand-pacific-dusk/65">
                        <th scope="col" className="py-3.5 px-5 md:px-8 font-medium">
                          Day
                        </th>
                        <th scope="col" className="py-3.5 px-5 md:px-8 font-medium">
                          Time
                        </th>
                        <th scope="col" className="py-3.5 px-5 md:px-8 font-medium">
                          Location
                        </th>
                        <th scope="col" className="py-3.5 px-5 md:px-8 font-medium">
                          Coach
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prog.schedule.map((row, idx) => (
                        <tr
                          key={`${prog.id}-${row.day}-${idx}`}
                          className="border-b border-black/[0.04] last:border-0 hover:bg-brand-morning-light/50 transition-colors"
                        >
                          <td className="py-4 px-5 md:px-8 text-black/90 font-medium">{row.day}</td>
                          <td className="py-4 px-5 md:px-8 text-black/90 whitespace-nowrap">{row.time}</td>
                          <td className="py-4 px-5 md:px-8 text-black/78">
                            {row.location?.trim() ? row.location : prog.location}
                          </td>
                          <td className="py-4 px-5 md:px-8 text-black/85">{row.coach ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-7 md:px-10 md:py-8 space-y-3 bg-brand-morning-light/30 border-t border-black/[0.05]">
                  <p className="font-sans text-[15px] md:text-[16px] text-black/88">
                    <span className="font-medium text-brand-pacific-dusk">Monthly membership:</span> {prog.monthlyLabel}
                    <span className="text-black/30 mx-2">·</span>
                    <span className="font-medium text-brand-pacific-dusk">Drop-in:</span> {prog.dropInLabel}
                  </p>
                  <p className="font-sans text-[14px] md:text-[15px] leading-relaxed text-black/65">{prog.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-sandstone py-20 md:py-28 border-t border-black/[0.06]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <ContainedShot
              src="https://res.cloudinary.com/dv033eo0x/image/upload/v1774485572/Advanced_liveball_iyooh6.jpg"
              alt="LiveBall session at Laguna Beach Tennis Academy"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
          <div className="lg:col-span-6 space-y-6">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-pacific-dusk/55">On court</p>
            <div className="bg-white border border-black/[0.06] rounded-[3px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <p className="font-sans text-[16px] leading-[1.65] text-black/82 mb-6">{content.culture.communication}</p>
              <p className="font-sans text-[15px] leading-[1.65] text-black/70">{content.culture.safety}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[300px] md:min-h-[320px] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dv033eo0x/image/upload/v1774485572/Liveball_Intermediate_exqowf.jpg"
            alt="LiveBall players during an evening session at LBTA"
            fill
            className="object-cover object-[center_38%]"
            sizes="100vw"
            quality={88}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-water/95 via-brand-deep-water/55 to-brand-deep-water/35" aria-hidden="true" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="font-sans text-[16px] md:text-[17px] text-white/92 leading-[1.65]">
            LiveBall sits alongside Cardio Tennis in our Fitness lineup—monthly membership, clear weekly times, room to try a
            session or drop in when space allows.
          </p>
        </div>
      </section>

      <DarkSection className="py-20 md:py-28">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-white/55 mb-4">Next step</p>
          <h2 className="font-headline text-[clamp(1.85rem,4vw,2.4rem)] text-brand-sandstone mb-8 leading-tight">
            Ready to try a session?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-white text-black font-sans font-semibold text-[13px] tracking-[0.14em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:bg-brand-sandstone focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Book a trial
            </Link>
            <Link
              href="/schedules#fitness"
              className="inline-flex items-center justify-center border border-white/40 text-white font-sans font-semibold text-[13px] tracking-[0.14em] uppercase py-4 px-8 rounded-[2px] min-h-[48px] transition-all duration-300 hover:border-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-brand-deep-water"
            >
              Schedule &amp; pricing
            </Link>
          </div>
          <p className="mt-10">
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
