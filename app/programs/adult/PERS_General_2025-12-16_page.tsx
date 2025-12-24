'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

export default function AdultIntermediateWinterPage() {
  return (
    <>
      <Breadcrumbs items={[
        { label: 'Programs', href: '/programs' },
        { label: 'Adult Intermediate' }
      ]} />

      {/* Hero */}
      <section className="relative bg-lbta-bone pt-32 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-6" style={{ color: '#E8956F' }}>
              Laguna Beach Tennis Academy
            </p>
            <h1 className="text-[84px] leading-[0.95] font-serif font-light mb-6" style={{ color: '#1A1A1A' }}>
              Adult Intermediate Tennis
            </h1>
            <p className="text-[32px] leading-[1.2] font-serif font-light mb-8" style={{ color: '#6B6B6B' }}>
              Winter 13-Week Program
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-lg font-sans" style={{ color: '#6B6B6B' }}>
              <div>
                <span className="font-medium" style={{ color: '#1A1A1A' }}>Level:</span> NTRP 3.0–3.5
              </div>
              <div className="hidden sm:block">•</div>
              <div>
                <span className="font-medium" style={{ color: '#1A1A1A' }}>Season:</span> January 6 – April 5, 2026
              </div>
              <div className="hidden sm:block">•</div>
              <div>
                <span className="font-medium" style={{ color: '#1A1A1A' }}>Duration:</span> 13 Weeks
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* A Program Designed for Consistency */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8" style={{ color: '#1A1A1A' }}>
              A Program Designed for Consistency
            </h2>
            <div className="space-y-6 text-[18px] leading-[1.6] font-sans" style={{ color: '#1A1A1A' }}>
              <p>
                Our Adult Intermediate program runs for 13 weeks—aligned with the City of Laguna Beach tennis season—giving you a focused, seasonal block to build your game. With a consistent schedule, structured drills, and live-point play every session, you'll refine stroke consistency, develop tactical awareness, and improve match confidence.
              </p>
              <p>
                Each 90-minute class blends targeted technique work with game-like scenarios, ensuring you walk away with skills you can immediately use in USTA league matches, club play, or friendly tournaments.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What You Can Expect */}
      <section className="section-spacing bg-lbta-sand">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8" style={{ color: '#1A1A1A' }}>
              What You Can Expect
            </h2>
            <ul className="space-y-4 text-[18px] leading-[1.6] font-sans" style={{ color: '#1A1A1A' }}>
              <li className="flex items-start gap-3">
                <span style={{ color: '#E8956F' }}>•</span>
                <span><strong>Stroke refinement:</strong> Serve, forehand, backhand, volley, and overhead with consistent depth and spin.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: '#E8956F' }}>•</span>
                <span><strong>Tactical training:</strong> Court positioning, doubles strategy, shot selection, and reading opponents.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: '#E8956F' }}>•</span>
                <span><strong>Live-point play:</strong> 30+ minutes every class dedicated to match situations and competitive drills.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: '#E8956F' }}>•</span>
                <span><strong>League preparation:</strong> Get match-ready for USTA or club leagues with simulated match pressure.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: '#E8956F' }}>•</span>
                <span><strong>Small group setting:</strong> Max 8 players per court, ensuring personal attention from our coaches.</span>
              </li>
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* Who This Program Suits */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8" style={{ color: '#1A1A1A' }}>
              Who This Program Suits
            </h2>
            <div className="space-y-6 text-[18px] leading-[1.6] font-sans" style={{ color: '#1A1A1A' }}>
              <p>
                <strong>NTRP 3.0–3.5 players</strong> ready to sharpen consistency and match strategy. Ideal if you:
              </p>
              <ul className="space-y-3 pl-6">
                <li className="flex items-start gap-3">
                  <span style={{ color: '#E8956F' }}>•</span>
                  <span>Can rally from the baseline with moderate consistency.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#E8956F' }}>•</span>
                  <span>Understand basic doubles positioning but want to refine shot selection.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#E8956F' }}>•</span>
                  <span>Are preparing for or currently playing USTA or club leagues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: '#E8956F' }}>•</span>
                  <span>Want structured, high-rep training in a supportive, competitive environment.</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Weekly Session Format */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8">
              Weekly Session Format
            </h2>
            <p className="text-[18px] leading-[1.6] font-sans mb-8" style={{ color: '#E5E5E5' }}>
              Every 90-minute session follows a proven structure designed to maximize improvement and keep training engaging:
            </p>
            <div className="space-y-6">
              <div className="border-l-2 pl-6" style={{ borderColor: '#E8956F' }}>
                <h3 className="text-[24px] font-serif font-light mb-2">Warm-Up & Movement (10 min)</h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#E5E5E5' }}>
                  Dynamic stretches, footwork patterns, and baseline rally drills to prepare your body and sharpen focus.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: '#E8956F' }}>
                <h3 className="text-[24px] font-serif font-light mb-2">Stroke Development (30 min)</h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#E5E5E5' }}>
                  Focused drills on groundstrokes, volleys, serves, and overheads. Emphasis on depth, spin, and placement.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: '#E8956F' }}>
                <h3 className="text-[24px] font-serif font-light mb-2">Tactical Training (20 min)</h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#E5E5E5' }}>
                  Doubles positioning, approach shots, transition play, and situational shot selection.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: '#E8956F' }}>
                <h3 className="text-[24px] font-serif font-light mb-2">Live-Point Play (30 min)</h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#E5E5E5' }}>
                  Competitive games, match scenarios, and live scoring to simulate real match pressure.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Winter 2026 Schedule */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8" style={{ color: '#1A1A1A' }}>
              Winter 2026 Schedule
            </h2>
            <p className="text-[18px] leading-[1.6] font-sans mb-12" style={{ color: '#6B6B6B' }}>
              All sessions are 90 minutes at Laguna Beach High School Tennis Courts. Choose the time(s) that fit your schedule:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-lbta p-8">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Weekday Morning
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  Tuesday & Thursday
                </h3>
                <p className="text-[18px] font-sans mb-2" style={{ color: '#1A1A1A' }}>
                  <strong>10:30 AM – 12:00 PM</strong>
                </p>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Perfect for flexible schedules, stay-at-home parents, retirees, or remote workers.
                </p>
              </div>
              <div className="card-lbta p-8">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Weekend Morning
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  Saturday
                </h3>
                <p className="text-[18px] font-sans mb-2" style={{ color: '#1A1A1A' }}>
                  <strong>10:00 AM – 11:30 AM</strong>
                </p>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Great for working professionals or anyone with weekday commitments.
                </p>
              </div>
              <div className="card-lbta p-8">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Weekend Morning
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  Sunday
                </h3>
                <p className="text-[18px] font-sans mb-2" style={{ color: '#1A1A1A' }}>
                  <strong>10:00 AM – 11:30 AM</strong>
                </p>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Start your Sunday with tennis before brunch or family time.
                </p>
              </div>
              <div className="card-lbta p-8 border-2" style={{ borderColor: '#E8956F' }}>
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Most Popular
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  2x Per Week
                </h3>
                <p className="text-[18px] font-sans mb-2" style={{ color: '#1A1A1A' }}>
                  <strong>Combine Any Two Sessions</strong>
                </p>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Maximize improvement with twice-weekly training. Save $68.85 on the 2x/week rate.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-spacing bg-lbta-sand">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-8 text-center" style={{ color: '#1A1A1A' }}>
              Winter 2026 Pricing
            </h2>
            <p className="text-[18px] leading-[1.6] font-sans mb-12 text-center max-w-2xl mx-auto" style={{ color: '#6B6B6B' }}>
              13-week program pricing. Pay quarterly upfront or drop in as you go.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card-lbta p-8 text-center">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Best Value
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  2x Per Week
                </h3>
                <div className="mb-6">
                  <div className="text-[48px] leading-[1] font-serif font-light" style={{ color: '#1A1A1A' }}>
                    $1,292.85
                  </div>
                  <p className="text-[14px] font-sans mt-2" style={{ color: '#6B6B6B' }}>
                    For 13 weeks (26 sessions)
                  </p>
                </div>
                <Link
                  href="/book"
                  className="btn-primary w-full justify-center"
                >
                  REGISTER NOW
                </Link>
              </div>
              <div className="card-lbta p-8 text-center">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#6B6B6B' }}>
                  Standard
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  1x Per Week
                </h3>
                <div className="mb-6">
                  <div className="text-[48px] leading-[1] font-serif font-light" style={{ color: '#1A1A1A' }}>
                    $680.85
                  </div>
                  <p className="text-[14px] font-sans mt-2" style={{ color: '#6B6B6B' }}>
                    For 13 weeks (13 sessions)
                  </p>
                </div>
                <Link
                  href="/book"
                  className="btn-secondary w-full justify-center"
                >
                  REGISTER NOW
                </Link>
              </div>
              <div className="card-lbta p-8 text-center">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#6B6B6B' }}>
                  Flexible
                </div>
                <h3 className="text-[32px] leading-[1.2] font-serif font-light mb-4" style={{ color: '#1A1A1A' }}>
                  Drop-In
                </h3>
                <div className="mb-6">
                  <div className="text-[48px] leading-[1] font-serif font-light" style={{ color: '#1A1A1A' }}>
                    $70
                  </div>
                  <p className="text-[14px] font-sans mt-2" style={{ color: '#6B6B6B' }}>
                    Per session
                  </p>
                </div>
                <Link
                  href="/book"
                  className="btn-secondary w-full justify-center"
                >
                  BOOK A SESSION
                </Link>
              </div>
            </div>
            <div className="card-lbta p-8 text-center" style={{ backgroundColor: '#E8956F10' }}>
              <p className="text-[18px] leading-[1.6] font-sans mb-2" style={{ color: '#1A1A1A' }}>
                <strong>Early Enrollment Discount:</strong> Register by December 15, 2025 and save $50.
              </p>
              <p className="text-[14px] font-sans" style={{ color: '#6B6B6B' }}>
                Use code <strong>WINTER2026</strong> at checkout.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How to Join */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-12 text-center" style={{ color: '#1A1A1A' }}>
              How to Join
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-[24px] font-serif font-light text-white" style={{ backgroundColor: '#E8956F' }}>
                  1
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Choose Your Schedule
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Select 1x or 2x per week from the available time slots (Tue/Thu mornings, Sat/Sun mornings).
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-[24px] font-serif font-light text-white" style={{ backgroundColor: '#E8956F' }}>
                  2
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Register Online
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Complete your registration through our online system. Payment secures your spot for the 13-week season.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-[24px] font-serif font-light text-white" style={{ backgroundColor: '#E8956F' }}>
                  3
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Start January 6
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Show up on the first day ready to train. We'll handle the rest—just bring your racquet and positive energy.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-lbta-bone">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-12 text-center" style={{ color: '#1A1A1A' }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="card-lbta p-8">
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Can I switch between time slots during the season?
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Yes, if space is available. Contact us 48 hours in advance to arrange a schedule change for a specific week.
                </p>
              </div>
              <div className="card-lbta p-8">
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  What happens if I miss a session?
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  You can make up missed sessions in any of the other weekly time slots, subject to availability. We recommend scheduling makeups in advance.
                </p>
              </div>
              <div className="card-lbta p-8">
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  What if I'm between NTRP 2.5 and 3.0?
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  This program is best for solid 3.0+ players. If you're closer to 2.5, we recommend starting with our Adult Beginner program, then transitioning to Intermediate once you're consistently rallying with depth.
                </p>
              </div>
              <div className="card-lbta p-8">
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Is there a refund policy?
                </h3>
                <p className="text-[16px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Full refunds are available if you withdraw before the first session. After the program starts, refunds are prorated based on remaining weeks, minus a $50 processing fee.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Other Programs */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-12 text-center" style={{ color: '#1A1A1A' }}>
              Explore Other Adult Programs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/beginner-program" className="card-lbta p-6 hover:shadow-lg transition-shadow">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  NTRP 1.0-2.5
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Beginner Program
                </h3>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Build fundamentals from scratch. Perfect for first-time players.
                </p>
              </Link>
              <Link href="/programs" className="card-lbta p-6 hover:shadow-lg transition-shadow">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  NTRP 4.0+
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Advanced Training
                </h3>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  High-intensity drills and competitive match play for 4.0+ players.
                </p>
              </Link>
              <Link href="/programs" className="card-lbta p-6 hover:shadow-lg transition-shadow">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  All Levels
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  LiveBall Sessions
                </h3>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  Drop-in match play with organized games and coaching oversight.
                </p>
              </Link>
              <Link href="/programs" className="card-lbta p-6 hover:shadow-lg transition-shadow">
                <div className="text-[11px] font-sans font-medium tracking-[0.2em] uppercase mb-3" style={{ color: '#E8956F' }}>
                  Fitness Focus
                </div>
                <h3 className="text-[24px] font-serif font-light mb-3" style={{ color: '#1A1A1A' }}>
                  Cardio Tennis
                </h3>
                <p className="text-[14px] leading-[1.6] font-sans" style={{ color: '#6B6B6B' }}>
                  High-energy workout meets tennis. All fitness levels welcome.
                </p>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-[64px] leading-[1.1] font-serif font-light mb-6">
              Reserve Your Spot
            </h2>
            <p className="text-[18px] leading-[1.6] font-sans mb-10 max-w-2xl mx-auto" style={{ color: '#E5E5E5' }}>
              Registration opens December 1, 2025. Early enrollment discount ends December 15.
            </p>
            <Link
              href="/book"
              className="inline-block px-12 py-4 text-white font-sans font-medium tracking-wide transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: '#E8956F' }}
            >
              REGISTER NOW
            </Link>
            <p className="text-[14px] font-sans mt-6" style={{ color: '#E5E5E5' }}>
              Questions? Email us at <a href="mailto:info@lagunabeachtennisacademy.com" className="underline">info@lagunabeachtennisacademy.com</a>
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
