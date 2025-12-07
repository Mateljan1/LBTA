import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Home() {
  return (
    <>
      {/* ============================================
          HERO — Real LBTA photography, optimized
          ============================================ */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/photos/hero-main.jpg"
            alt="Laguna Beach Tennis Academy courts at golden hour"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="relative z-10 w-full">
          <div className="container-lbta px-6 md:px-30">
            <div className="max-w-3xl">
              <AnimatedSection>
                {/* Blueprint Display Typography */}
                <h1 className="display text-white mb-8">
                  Tennis as it<br />
                  should be taught.
                </h1>

                {/* Blueprint Subhead */}
                <p className="body-lg text-white/90 mb-12" style={{ fontWeight: 400 }}>
                  Movement. Discipline. Belonging.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-start mb-12">
                  <Link
                    href="/book"
                    className="btn-accent"
                  >
                    Book Trial
                  </Link>
                </div>

                {/* Blueprint Subtext */}
                <p className="body-sm text-white/60" style={{ fontWeight: 300 }}>
                  ATP/WTA-backed training. Laguna Beach, California.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="eyebrow text-white/40">Scroll</p>
        </div>
      </section>


      {/* ============================================
          ATP STORY — Editorial 7+5 + Blueprint typography
          ============================================ */}
      <section className="relative min-h-screen flex items-center bg-lbta-bone py-60">
        <div className="container-lbta">
          <div className="grid lg:grid-cols-12 gap-0 items-center">
            {/* Left: Image takes 7 columns - Real Karue photo */}
            <div className="lg:col-span-7 -mx-6 md:-mx-30 lg:mx-0">
              <AnimatedSection>
                <div className="relative aspect-[4/3] lg:aspect-[3/4]">
                  <Image
                    src="/photos/atp-story-karue.jpg"
                    alt="Karue Sell - ATP #258 training at LBTA"
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                    priority
                  />
                  {/* Blueprint-style badge overlay */}
                  <div className="absolute bottom-8 right-8 bg-lbta-sand/95 backdrop-blur-sm px-8 py-6 border border-lbta-primary/8">
                    <p className="eyebrow mb-2">ATP/WTA COACHING</p>
                    <p className="text-5xl font-display font-normal text-lbta-primary" style={{ lineHeight: 1 }}>
                      #258
                    </p>
                    <p className="body-sm text-lbta-secondary mt-2" style={{ fontWeight: 400, opacity: 0.7 }}>
                      Karue Sell, 2024
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right: Content - 5 columns */}
            <div className="lg:col-span-5 px-6 md:px-16 lg:px-20 py-20 lg:py-0">
              <AnimatedSection delay={0.2}>
                <div className="max-w-md">
                  {/* Blueprint Eyebrow */}
                  <p className="eyebrow mb-6">REAL RESULTS</p>

                  {/* Blueprint Headline */}
                  <h2 className="headline mb-10">
                    #858 to #258.<br />
                    Twelve months.
                  </h2>

                  {/* Blueprint Body */}
                  <div className="space-y-6 mb-10">
                    <p className="body text-lbta-secondary">
                      Karue Sell. ATP #258.<br />
                      Max McKennon. ATP #458.
                    </p>

                    <p className="body text-lbta-secondary">
                      Twenty D1 scholarships.<br />
                      Hundreds of adults who stopped blaming their racket.
                    </p>

                    <p className="body text-lbta-secondary">
                      One system. Every level.
                    </p>
                  </div>

                  {/* Blueprint Link */}
                  <a href="/success-stories" className="link-animated">
                    See results →
                  </a>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          PHILOSOPHY — Refined minimal grid
          ============================================ */}
      <section className="py-48 bg-lbta-sand">
        <div className="container-lbta px-6 md:px-30">
          <AnimatedSection className="text-center mb-20">
            <p className="eyebrow mb-6 text-lbta-secondary">
              THE APPROACH
            </p>
          </AnimatedSection>

          {/* Minimal three-column grid with large numbers */}
          <div className="grid md:grid-cols-3 gap-16 md:gap-20 max-w-6xl mx-auto">
            <AnimatedSection delay={0.1}>
              <div className="text-center md:text-left">
                <div className="text-8xl font-display font-light text-lbta-coral/20 mb-6" style={{ lineHeight: 0.9 }}>
                  01
                </div>
                <h3 className="subhead text-lbta-primary mb-4">
                  Small groups.
                </h3>
                <p className="body-sm text-lbta-secondary">
                  Four to eight students. Personal attention. Real coaching.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center md:text-left">
                <div className="text-8xl font-display font-light text-lbta-coral/20 mb-6" style={{ lineHeight: 0.9 }}>
                  02
                </div>
                <h3 className="subhead text-lbta-primary mb-4">
                  ATP/WTA systems.
                </h3>
                <p className="body-sm text-lbta-secondary">
                  Twenty years on tour. Same patterns. Your level.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center md:text-left">
                <div className="text-8xl font-display font-light text-lbta-coral/20 mb-6" style={{ lineHeight: 0.9 }}>
                  03
                </div>
                <h3 className="subhead text-lbta-primary mb-4">
                  It works.
                </h3>
                <p className="body-sm text-lbta-secondary">
                  Three tour players. Twenty D1 scholarships. Proven results.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Minimal CTA */}
          <AnimatedSection delay={0.4} className="text-center mt-20">
            <a href="/philosophy" className="link-animated">
              Our philosophy →
            </a>
          </AnimatedSection>
        </div>
      </section>


      {/* ============================================
          PROGRAMS — Magazine full-bleed + Blueprint typography
          ============================================ */}
      <section className="bg-lbta-sand">
        <div className="container-lbta px-0">
          {/* Junior Program - Real on-court training photo */}
          <AnimatedSection>
            <Link href="/programs/junior" className="group block relative overflow-hidden">
              <div className="relative h-[70vh] md:h-[80vh]">
                <Image
                  src="/photos/junior-program-hero.jpg"
                  alt="Junior development on-court training at LBTA"
                  fill
                  quality={95}
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-[1500ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 md:pb-16">
                  <div className="max-w-xl">
                    {/* Blueprint Eyebrow */}
                    <p className="eyebrow text-white mb-4">
                      AGES 3–18
                    </p>

                    {/* Blueprint Subhead */}
                    <h3 className="subhead-sm text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      Junior<br />
                      Development
                    </h3>

                    {/* Blueprint Body */}
                    <p className="body-sm text-white mb-6 max-w-sm">
                      From first lesson to D1 scholarship. Little Stars (ages 3-4) through High Performance training.
                    </p>

                    {/* Blueprint Link */}
                    <div className="inline-flex items-center gap-2 body-sm text-white pb-1 border-b border-white/60 group-hover:border-white transition-colors">
                      Explore →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </AnimatedSection>

          {/* Adult & High Performance - Side by Side */}
          <div className="grid md:grid-cols-2">
            <AnimatedSection delay={0.1}>
              <Link href="/programs/adult" className="group block relative overflow-hidden">
                <div className="relative h-[60vh]">
                  <Image
                    src="/photos/adult-program.jpg"
                    alt="Adult programs - Professional training environment"
                    fill
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 md:pb-16">
                    <p className="eyebrow text-white mb-4">
                      ALL LEVELS
                    </p>
                    <h3 className="subhead-sm text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      Adult<br />
                      Programs
                    </h3>
                    <p className="body-sm text-white mb-6 max-w-sm">
                      Beginner through USTA 4.0+. Same ATP/WTA coaching systems.
                    </p>
                    <div className="inline-flex items-center gap-2 body-sm text-white pb-1 border-b border-white/60 group-hover:border-white transition-colors">
                      View details →
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Link href="/programs/high-performance" className="group block relative overflow-hidden">
                <div className="relative h-[60vh]">
                  <Image
                    src="/photos/high-performance.jpg"
                    alt="High Performance - ATP/WTA tour preparation"
                    fill
                    quality={95}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-[1500ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 md:pb-16">
                    <p className="eyebrow text-white mb-4">
                      COMPETITIVE
                    </p>
                    <h3 className="subhead-sm text-white mb-4" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                      High<br />
                      Performance
                    </h3>
                    <p className="body-sm text-white mb-6 max-w-sm">
                      College recruitment and ATP/WTA tour preparation.
                    </p>
                    <div className="inline-flex items-center gap-2 body-sm text-white pb-1 border-b border-white/60 group-hover:border-white transition-colors">
                      Apply →
                    </div>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ============================================
          COACHING — Andrew + Team unified section
          ============================================ */}
      <section className="bg-lbta-charcoal py-48">
        <div className="container-lbta px-6 md:px-30">
          {/* Andrew - Refined */}
          <div className="grid lg:grid-cols-5 gap-12 items-start mb-20">
            {/* Image: 2 columns, smaller */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="relative aspect-[3/4] max-w-xs mx-auto lg:mx-0">
                  <Image
                    src="/photos/andrew-portrait.jpg"
                    alt="Andrew Mateljan - Founder"
                    fill
                    quality={95}
                    sizes="(max-width: 1024px) 60vw, 25vw"
                    className="object-cover object-center"
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* Content: 3 columns */}
            <div className="lg:col-span-3">
              <AnimatedSection delay={0.2}>
                <p className="eyebrow mb-4 text-lbta-coral">
                  FOUNDER & DIRECTOR
                </p>

                <h2 className="headline-sm text-lbta-bone mb-6">
                  Andrew Mateljan
                </h2>

                <div className="w-12 h-px bg-lbta-bone/20 mb-6" />

                <div className="body-sm text-lbta-bone/80 space-y-3 max-w-lg">
                  <p>
                    20 years developing competitive players. Former #3 SoCal, #12 nationally ranked junior.
                  </p>

                  <p>
                    Seven years coaching internationally across Spain, Croatia, Norway. Currently coaches ATP #262 Karue Sell.
                  </p>

                  <p>
                    Training history: Max McKennon, Ryan Seggerman, Colton Smith. ATP Masters 1000 experience. Founder, Fit4Tennis (100K+).
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Development Team */}
          <div className="border-t border-lbta-bone/10 pt-16">
            <AnimatedSection delay={0.3} className="text-center mb-12">
              <p className="eyebrow text-lbta-coral mb-2">
                DEVELOPMENT TEAM
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
              <AnimatedSection delay={0.4}>
                <Link href="/coaches" className="group block">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                    <Image
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png"
                      alt="Kevin Jackson"
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="subhead-sm text-lbta-bone mb-1">Kevin Jackson</h4>
                  <p className="body-sm text-lbta-bone/60 mb-2">Head Coach</p>
                  <p className="eyebrow text-lbta-coral">COLLEGE RECRUITMENT</p>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <Link href="/coaches" className="group block">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                    <Image
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png"
                      alt="Michelle Bevins"
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="subhead-sm text-lbta-bone mb-1">Michelle Bevins</h4>
                  <p className="body-sm text-lbta-bone/60 mb-2">Youth Director</p>
                  <p className="eyebrow text-lbta-coral">AGES 3-12</p>
                </Link>
              </AnimatedSection>

              <AnimatedSection delay={0.6}>
                <Link href="/coaches" className="group block">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden">
                    <Image
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png"
                      alt="Savriyan Danilov"
                      fill
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <h4 className="subhead-sm text-lbta-bone mb-1">Savriyan Danilov</h4>
                  <p className="body-sm text-lbta-bone/60 mb-2">High Performance</p>
                  <p className="eyebrow text-lbta-coral">ATP PRO #556</p>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================
          VIDEO TESTIMONIAL — Blueprint typography
          ============================================ */}
      <section className="py-60 bg-lbta-sand border-y border-lbta-primary/6">
        <div className="container-lbta px-6 md:px-30">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center mb-20">
              {/* Blueprint Eyebrow */}
              <p className="eyebrow mb-6 text-lbta-secondary">
                IN THEIR WORDS
              </p>

              {/* Blueprint Headline */}
              <h2 className="headline-md text-lbta-primary">
                Member stories.
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="aspect-video overflow-hidden bg-lbta-charcoal">
                <iframe
                  src="https://player.vimeo.com/video/1134930901?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Member testimonials"
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="text-center mt-12">
              <a href="/success-stories" className="link-animated">
                More stories →
              </a>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ============================================
          PARTNERSHIP — Minimal, cohesive, refined
          ============================================ */}
      <section className="py-32 bg-lbta-bone border-y border-lbta-primary/6">
        <div className="container-lbta px-6 md:px-30">
          <div className="max-w-5xl mx-auto">
            {/* City Partnership - Prominent */}
            <AnimatedSection className="text-center mb-16">
              <div className="relative w-full max-w-lg h-72 mx-auto mb-6">
                <Image
                  src="/logos/city-laguna-beach.png"
                  alt="City of Laguna Beach - Official Partner"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 90vw, 512px"
                  className="object-contain"
                  style={{ mixBlendMode: 'darken', opacity: 0.65 }}
                />
              </div>

              <h3 className="subhead text-lbta-primary mb-4">
                Official City Partner
              </h3>

              <p className="body-sm text-lbta-secondary mb-8">
                Laguna Beach High School • Alta Laguna Park • Moulton Meadows Park
              </p>
            </AnimatedSection>

            {/* Partner Logos - ONE single row, MORE visible */}
            <AnimatedSection delay={0.2}>
              <div className="flex items-center justify-center gap-10 md:gap-14 overflow-x-auto no-scrollbar">
                <div className="relative h-14 w-32 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/fit4tennis.png"
                    alt="Fit4Tennis"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-14 w-32 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/racketrescue.png"
                    alt="Racket Rescue"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-14 w-32 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/vylo.png"
                    alt="VYLO"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-12 w-28 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/racquetiq.png"
                    alt="RacquetIQ"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-12 w-28 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/tennisbeast.png"
                    alt="Tennis Beast"
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="relative h-12 w-28 flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <Image
                    src="/logos/lbhs.png"
                    alt="Laguna Beach HS"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ============================================
          FINAL CTA — Aspirational, not transactional
          ============================================ */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/photos/final-cta.jpg"
            alt="Championship courts at Laguna Beach Tennis Academy"
            fill
            quality={95}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 container-lbta px-6 md:px-30">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="headline text-white mb-10">
                Begin your<br />development.
              </h2>

              <p className="body text-white/80 mb-12 max-w-md mx-auto">
                Free trial session. No commitment.
              </p>

              <Link
                href="/book"
                className="btn-accent px-14 py-5"
              >
                Book Trial
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
