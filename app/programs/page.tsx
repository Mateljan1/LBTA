import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { CourseSchema } from '../schema'

export const metadata: Metadata = {
  title: 'Programs | Laguna Beach Tennis Academy',
  description: 'Explore tennis programs for every age and level — from junior development to college-bound athletes and adult training — all built around movement, discipline and belonging.',
}

export default function Programs() {
  return (
    <>
      <CourseSchema />
      {/* SECTION 1: HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/hero.webp"
            alt="Laguna Beach Tennis Academy players training at sunset on coastal courts"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 70%' }}
            sizes="100vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-serif text-[48px] md:text-[64px] font-bold leading-[1.1] tracking-[-0.5px] mb-6">
            Programs for Every Player.
          </h1>
          <p className="font-sans text-[18px] md:text-[20px] leading-[1.6] text-white/90 mb-8 max-w-3xl mx-auto">
            From your child's first rally to college recruitment and lifelong play — 
            every program follows the same philosophy:
          </p>
          <p className="font-serif text-[24px] md:text-[28px] leading-[1.3] mb-10 text-white">
            Movement. Discipline. Belonging.
          </p>
          <Link 
            href="/schedules"
            className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200"
          >
            View Schedules →
          </Link>
        </div>
      </section>

      {/* SECTION 2: JUNIOR DEVELOPMENT (Ages 3-11) */}
      <section className="bg-[#FAF8F3] py-20 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image Left */}
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/programs/youth-dev-1.webp"
                alt="Young tennis players learning forehand technique during junior development class"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            
            {/* Text Right */}
            <div className="space-y-6">
              <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-black">
                Junior Development
                <span className="block text-[24px] font-sans font-normal text-black/70 mt-2">
                  Ages 3–11
                </span>
              </h2>
              <h3 className="font-serif text-[24px] text-black/70 italic">
                Where it begins.
              </h3>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                Our youngest players build coordination, rhythm, and love for the game.
              </p>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                Programs progress from Little Stars to Green Dot, blending fundamentals 
                with movement and fun discipline.
              </p>
              <div className="pt-4">
                <p className="font-sans text-[16px] text-black/70 mb-2">
                  <strong>Format:</strong> 45–60 min · Small groups · Quarterly billing
                </p>
                <blockquote className="font-serif italic text-[20px] text-black/70 border-l-2 border-black/30 pl-4 mt-6">
                  "Confidence before competition."
                </blockquote>
              </div>
              <Link 
                href="/schedules#junior"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-lg transition-all duration-200 mt-4"
              >
                View Junior Schedule →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: YOUTH DEVELOPMENT (Ages 11-18) */}
      <section className="bg-white py-20 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Text Left */}
            <div className="space-y-6 md:order-1">
              <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-black">
                Youth Development
                <span className="block text-[24px] font-sans font-normal text-black/70 mt-2">
                  Ages 11–18
                </span>
              </h2>
              <h3 className="font-serif text-[24px] text-black/70 italic">
                For players growing into competitors.
              </h3>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                Full-court training focused on technical precision, tactical awareness, 
                and structured match play.
              </p>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                Led by Andrew Mateljan and LBTA staff using tour-tested methodology.
              </p>
              <div className="pt-4">
                <p className="font-sans text-[16px] text-black/70 mb-2">
                  <strong>Format:</strong> 90 min · Max 6 per court · Moulton / LBHS
                </p>
                <blockquote className="font-serif italic text-[20px] text-black/70 border-l-2 border-black/30 pl-4 mt-6">
                  "Discipline creates confidence."
                </blockquote>
              </div>
              <Link 
                href="/schedules#youth"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-lg transition-all duration-200 mt-4"
              >
                View Youth Schedule →
              </Link>
            </div>
            
            {/* Image Right */}
            <div className="relative aspect-[3/2] overflow-hidden md:order-2">
              <Image
                src="/images/programs/youth-dev-2.webp"
                alt="Intermediate youth players in match play session at LBTA"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HIGH PERFORMANCE PATHWAY */}
      <section className="relative py-20 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/high-performance.webp"
            alt="High performance athletes training under pro supervision at Laguna Beach Tennis Academy"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 50%' }}
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40 text-white">
          <div className="max-w-3xl">
            <h2 className="font-serif text-[48px] md:text-[56px] leading-[1.1] font-bold mb-4">
              High Performance Pathway
            </h2>
            <p className="font-sans text-[20px] text-white/90 mb-6">
              UTR 5–8 & College Bound UTR 8+
            </p>
            <h3 className="font-serif text-[24px] text-black/70 italic mb-6">
              Where ambition meets structure.
            </h3>
            <p className="font-sans text-[18px] leading-[1.8] text-white/90 mb-4">
              Invitation-only training for advanced juniors preparing for tournaments 
              and collegiate play.
            </p>
            <p className="font-sans text-[18px] leading-[1.8] text-white/90 mb-6">
              Sessions combine tactical match-play, conditioning, and mindset development.
            </p>
            <div className="pt-4 mb-8">
              <p className="font-sans text-[16px] text-white/80">
                <strong>Format:</strong> 2 hrs · LBHS facility · Application required
              </p>
              <blockquote className="font-serif italic text-[20px] text-black/70 border-l-2 border-black/30 pl-4 mt-6">
                "We don't chase points — we build players who can win anywhere."
              </blockquote>
            </div>
            <Link 
              href="/apply-scholarship"
              className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200"
            >
              Apply for High Performance →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: ADULT PROGRAMS */}
      <section className="bg-white py-20 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="text-center mb-16">
            <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-black mb-4">
              Adult Programs
              <span className="block text-[24px] font-sans font-normal text-black/70 mt-2">
                Beginner – Advanced
              </span>
            </h2>
            <h3 className="font-serif text-[24px] text-black/70 italic">
              Progression with purpose.
            </h3>
            <p className="font-sans text-[18px] leading-[1.8] text-black/85 mt-6 max-w-3xl mx-auto">
              From fundamentals to competitive match-play, each program builds clarity, 
              skill, and confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {[
              {
                title: 'Beginner',
                level: '1.0 – 2.5',
                description: 'Learn the essentials.',
                image: '/images/programs/adult-beginner.webp',
                alt: 'Adult beginner group practicing rally drills on Laguna courts',
              },
              {
                title: 'Intermediate',
                level: '3.0 – 3.5',
                description: 'Refine technique & tactics.',
                image: '/images/programs/adult-intermediate.webp',
                alt: 'Adult intermediate tennis players in mid-court training session',
              },
              {
                title: 'Advanced',
                level: '4.0+',
                description: 'Compete & strategize.',
                image: '/images/programs/adult-advanced.webp',
                alt: 'Advanced adult players practicing doubles strategy under late-day sunlight',
              },
            ].map((program) => (
              <div key={program.title} className="text-center">
                <div className="relative aspect-[3/2] overflow-hidden mb-6 bg-gray-100">
                  <Image
                    src={program.image}
                    alt={program.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: '50% 30%' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <h3 className="font-serif text-[24px] font-semibold text-black mb-2">
                  {program.title}
                </h3>
                <p className="font-sans text-[16px] text-black/70 mb-2">
                  {program.level}
                </p>
                <p className="font-sans text-[16px] text-black/85">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center space-y-4">
            <p className="font-sans text-[16px] text-black/70">
              <strong>Format:</strong> 60–120 min · LBHS / Moulton · 13-week season
            </p>
            <blockquote className="font-serif italic text-[20px] text-black/70 max-w-2xl mx-auto">
              "Serious training, relaxed atmosphere."
            </blockquote>
            <div className="pt-4">
              <Link 
                href="/adult-trial"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200"
              >
                Book Adult Trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FITNESS & COMMUNITY */}
      <section className="bg-[#FAF8F3] py-20 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image Left */}
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/programs/fitness.webp"
                alt="LBTA community group in cardio tennis session under golden-hour lighting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
            
            {/* Text Right */}
            <div className="space-y-6">
              <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-black">
                Fitness & Community
                <span className="block text-[24px] font-sans font-normal text-black/70 mt-2">
                  Cardio / LiveBall
                </span>
              </h2>
              <h3 className="font-serif text-[24px] text-black/70 italic">
                Play harder. Move smarter.
              </h3>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                High-energy sessions combining fitness, competition, and fun.
              </p>
              <div className="space-y-3">
                <p className="font-sans text-[16px] text-black/85">
                  <strong>Cardio Tennis:</strong> music-driven drills for conditioning.
                </p>
                <p className="font-sans text-[16px] text-black/85">
                  <strong>LiveBall:</strong> continuous doubles competition by level.
                </p>
              </div>
              <div className="pt-4">
                <p className="font-sans text-[16px] text-black/70 mb-2">
                  <strong>Format:</strong> 90 min · Monthly · All levels welcome
                </p>
                <blockquote className="font-serif italic text-[20px] text-black/70 border-l-2 border-black/30 pl-4 mt-6">
                  "Community built through play."
                </blockquote>
              </div>
              <Link 
                href="/schedules#fitness"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-lg transition-all duration-200 mt-4"
              >
                Join a Session →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRIVATE & SPECIALTY TRAINING */}
      <section className="bg-white py-20 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 lg:px-40">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Text Left */}
            <div className="space-y-6 md:order-1">
              <h2 className="font-serif text-[40px] md:text-[48px] leading-[1.1] font-semibold text-black">
                Private & Specialty Training
              </h2>
              <h3 className="font-serif text-[24px] text-black/70 italic">
                Precision in every detail.
              </h3>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                One-on-one instruction and specialty programs including Serve Development 
                and Fitness Training.
              </p>
              <p className="font-sans text-[18px] leading-[1.8] text-black/85">
                Personalized movement analysis and match strategy from LBTA's professional staff.
              </p>
              <div className="pt-4">
                <p className="font-sans text-[16px] text-black/70 mb-4">
                  <strong>Rates:</strong>
                </p>
                <ul className="font-sans text-[16px] text-black/85 space-y-2">
                  <li>Andrew Mateljan: $250/hr</li>
                  <li>Head Coach: $150/hr</li>
                  <li>Staff Coach: $120/hr</li>
                </ul>
                <blockquote className="font-serif italic text-[20px] text-black/70 border-l-2 border-black/30 pl-4 mt-6">
                  "Every player deserves precision."
                </blockquote>
              </div>
              <Link 
                href="/book"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-3 px-8 rounded-lg transition-all duration-200 mt-4"
              >
                Request Private →
              </Link>
            </div>
            
            {/* Image Right */}
            <div className="relative aspect-[3/2] overflow-hidden md:order-2">
              <Image
                src="/images/programs/private-specialty.webp"
                alt="Private coaching session with LBTA coach providing one-on-one instruction"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CTA - "Start Training with Purpose" */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="View of Laguna Beach tennis courts overlooking ocean horizon at sunset"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/25" />
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[40px] md:text-[56px] font-semibold mb-6 leading-[1.2]">
            Start training with purpose.
          </h2>
          <p className="font-sans text-[18px] leading-[1.6] text-white/90 mb-10">
            View schedules, pricing, and book your first session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/schedules"
              className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200 w-full sm:w-auto"
            >
              View Schedules →
            </Link>
            <a 
              href="/LBTA_Winter2026_Optimized.pdf"
              download
              className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-lg transition-all duration-200 w-full sm:w-auto"
            >
              Download Winter 2026 Schedule
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
