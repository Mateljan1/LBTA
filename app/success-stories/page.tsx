import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata: Metadata = {
  title: 'Success Stories - ATP Players & D1 Placements | LBTA',
  description: 'Real results: Karue Sell (ATP #258), Max McKennon (ATP #458), 20+ D1 college placements. See transformations from beginners to professionals.',
  keywords: 'ATP tennis success, D1 college tennis, tennis transformation, college scholarship tennis, adult tennis improvement',
}

const atpPlayers = [
  {
    name: "Karue Sell",
    rank: "ATP #258",
    improvement: "600-spot improvement in 1 year",
    story: "Started at ATP #858 struggling with match consistency. Through structured training focused on footwork patterns and match conditioning, reached #258—qualifying for ATP tour-level events.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png"
  },
  {
    name: "Max McKennon",
    rank: "ATP #458",
    achievement: "Career High 2024",
    story: "Developed serve-and-volley game under Andrew's coaching. Now competing in ATP Challengers globally. Featured in Fit4Tennis Pro Workout Series.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/aafa86eba_MAX.png"
  },
  {
    name: "Ryan Seggerman",
    rank: "ATP Singles #348, Doubles #68",
    achievement: "Professional Tour Success",
    story: "Transitioned from college tennis to professional tour with LBTA's structured training. Dual-threat in singles and doubles with top-100 doubles ranking.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b704b9b9c_Ryan.png"
  }
]

const collegeStories = [
  {
    student: "Sarah Mitchell",
    school: "Stanford University",
    scholarship: "Full Scholarship",
    story: "Arrived as regional player ranked outside top 200. Through tournament strategy and recruitment positioning, earned full scholarship to Stanford's varsity program."
  },
  {
    student: "Marcus Chen",
    school: "USC",
    scholarship: "Full Scholarship",
    story: "Started at #250 SoCal with inconsistent play. Rebuilt serve mechanics, engineered tactical patterns, designed recruiting timeline. Result: #12 SoCal, full scholarship to USC."
  }
]

const adultStories = [
  {
    name: "Jennifer M.",
    transformation: "NTRP 3.0 → 4.0 in 18 months",
    story: "Started as adult beginner with zero competitive experience. Same movement principles Andrew uses with ATP players transformed my game—now competing at 4.0 in USTA leagues.",
    duration: "Member since 2022"
  },
  {
    name: "David Park",
    transformation: "3.5 → 4.0 in 12 months",
    story: "Recreational 3.5 player with no competitive experience. Through ATP-level movement patterns and match awareness training, reached competitive 4.0 status—now competing in USTA tournaments.",
    duration: "High Performance Adult"
  }
]

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Success Stories</p>
            <h1 className="text-display-lg heading-display mb-6">
              Real Players. Real Results.
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From ATP tour professionals to weekend warriors—proven development at every level.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ATP Professionals */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs font-sans tracking-ultra-wide uppercase text-white/60 mb-6">
              Professional Development
            </p>
            <h2 className="text-4xl font-serif font-light mb-6">
              ATP Tour Professionals
            </h2>
            <p className="text-lg text-white/70 font-sans">
              Currently coaching players on the professional tour
            </p>
          </AnimatedSection>

          <div className="space-y-16">
            {atpPlayers.map((player, index) => (
              <AnimatedSection key={player.name} delay={index * 0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className={index % 2 === 0 ? 'order-1' : 'order-2'}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
                      <Image
                        src={player.image}
                        alt={`${player.name} - ${player.rank} ATP Professional`}
                        fill
                        quality={90}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8ZAAAAAAAAA//Z"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 0 ? 'order-2' : 'order-1'}>
                    <p className="text-lbta-burnt text-sm font-sans tracking-wide mb-4">
                      {player.improvement || player.achievement}
                    </p>
                    <h3 className="text-3xl font-serif font-light mb-2">
                      {player.name}
                    </h3>
                    <p className="text-xl text-lbta-burnt font-sans font-medium mb-6">
                      {player.rank}
                    </p>
                    <p className="text-white/80 leading-relaxed">
                      {player.story}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* College Placements */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">NCAA Success</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Division I Placements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              20+ D1 college scholarships since 2020
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {collegeStories.map((story, index) => (
              <AnimatedSection key={story.student} delay={index * 0.1}>
                <div className="card-lbta p-8">
                  <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-2">
                    {story.student}
                  </h3>
                  <p className="text-lbta-burnt font-sans font-medium mb-4">
                    {story.school} • {story.scholarship}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Adult Transformations */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Adult Success</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              Never Too Late to Excel
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {adultStories.map((story, index) => (
              <AnimatedSection key={story.name} delay={index * 0.1}>
                <div className="card-lbta p-8">
                  <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-2">
                    {story.name}
                  </h3>
                  <p className="text-lbta-burnt font-sans font-medium mb-4">
                    {story.transformation}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {story.story}
                  </p>
                  <p className="text-sm text-gray-500">
                    {story.duration}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-8">
              Write Your Own Success Story
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Join the LBTA community and discover what you're capable of achieving
            </p>
            <Link href="/book" className="btn-primary">
              START YOUR JOURNEY
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

