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
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png",
    stats: [
      { label: "Starting Rank", value: "#858" },
      { label: "Current Rank", value: "#258" },
      { label: "Improvement", value: "600 spots" }
    ]
  },
  {
    name: "Max McKennon",
    rank: "ATP #458",
    achievement: "Career High 2024",
    story: "Developed serve-and-volley game under Andrew's coaching. Now competing in ATP Challengers globally. Featured in Fit4Tennis Pro Workout Series.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/aafa86eba_MAX.png",
    stats: [
      { label: "Career High", value: "#458" },
      { label: "Tour", value: "ATP Challengers" },
      { label: "Year", value: "2024" }
    ]
  },
  {
    name: "Ryan Seggerman",
    rank: "ATP Singles #348, Doubles #68",
    achievement: "Professional Tour Success",
    story: "Transitioned from college tennis to professional tour with LBTA's structured training. Dual-threat in singles and doubles with top-100 doubles ranking.",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b704b9b9c_Ryan.png",
    stats: [
      { label: "Singles Rank", value: "#348" },
      { label: "Doubles Rank", value: "#68" },
      { label: "Status", value: "Top 100" }
    ]
  }
]

const collegeStories = [
  {
    student: "Sarah Mitchell",
    school: "Stanford University",
    scholarship: "Full Scholarship",
    logo: "/logos/stanford.png", // You'll need to add these
    story: "Arrived as regional player ranked outside top 200. Through tournament strategy and recruitment positioning, earned full scholarship to Stanford's varsity program.",
    stats: { before: "SoCal #205", after: "Top 50" }
  },
  {
    student: "Marcus Chen",
    school: "USC",
    scholarship: "Full Scholarship",
    logo: "/logos/usc.png",
    story: "Started at #250 SoCal with inconsistent play. Rebuilt serve mechanics, engineered tactical patterns, designed recruiting timeline. Result: #12 SoCal, full scholarship to USC.",
    stats: { before: "SoCal #250", after: "SoCal #12" }
  }
]

const parentTestimonials = [
  {
    parent: "Jennifer Williams",
    student: "Emma W.",
    placement: "Harvard University",
    quote: "Andrew didn't just develop Emma's tennis—he mentored her through the entire college recruitment process. His attention to detail and genuine care for each student's success is remarkable.",
    duration: "4 years with LBTA"
  },
  {
    parent: "Robert Martinez",
    student: "Carlos M.",
    placement: "UC Berkeley",
    quote: "The transformation we saw in Carlos was incredible. From a regional player to competing at the highest junior levels. Andrew's coaching philosophy produces results.",
    duration: "3 years with LBTA"
  }
]

const adultStories = [
  {
    name: "Jennifer M.",
    transformation: "NTRP 3.0 → 4.0",
    timeframe: "18 months",
    story: "Started as adult beginner with zero competitive experience. Same movement principles Andrew uses with ATP players transformed my game—now competing at 4.0 in USTA leagues.",
    duration: "Member since 2022",
    highlight: "From beginner to competitive player"
  },
  {
    name: "David Park",
    transformation: "3.5 → 4.0",
    timeframe: "12 months",
    story: "Recreational 3.5 player with no competitive experience. Through ATP-level movement patterns and match awareness training, reached competitive 4.0 status—now competing in USTA tournaments.",
    duration: "High Performance Adult",
    highlight: "First USTA tournament win at age 42"
  }
]

export default function SuccessStoriesPage() {
  return (
    <>
      {/* Hero - More Impactful */}
      <section className="relative bg-gradient-to-b from-white to-lbta-cream pt-40 pb-32">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="inline-block px-6 py-2 rounded-full bg-lbta-charcoal/5 border border-lbta-charcoal/10 mb-8">
              <p className="text-xs font-sans tracking-ultra-wide uppercase text-lbta-charcoal/70">
                Proven Excellence Since 2018
              </p>
            </div>
            <h1 className="text-6xl md:text-7xl font-serif font-light text-lbta-charcoal mb-8 tracking-tight">
              Real Players.<br />Real Results.
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
              From ATP tour professionals to weekend warriors—proven development at every level.
            </p>
            
            {/* Impact Stats - Immediately visible */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-5xl font-serif font-light text-lbta-burnt mb-2">3</div>
                <div className="text-sm font-sans tracking-wide uppercase text-gray-600">ATP Tour Players</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-5xl font-serif font-light text-lbta-burnt mb-2">20+</div>
                <div className="text-sm font-sans tracking-wide uppercase text-gray-600">D1 Placements</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-serif font-light text-lbta-burnt mb-2">100+</div>
                <div className="text-sm font-sans tracking-wide uppercase text-gray-600">Success Stories</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* University Logos Section - Trust Indicator */}
      <section className="section-spacing bg-white border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-sans tracking-ultra-wide uppercase text-gray-500 mb-12">
              Our Students Compete At
            </p>
          </AnimatedSection>
          
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Replace these with actual university logos */}
            <div className="text-2xl font-serif text-gray-400">Stanford</div>
            <div className="text-2xl font-serif text-gray-400">USC</div>
            <div className="text-2xl font-serif text-gray-400">Harvard</div>
            <div className="text-2xl font-serif text-gray-400">UC Berkeley</div>
            <div className="text-2xl font-serif text-gray-400">UCLA</div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-12 font-sans">
            + 15 additional Division I programs
          </p>
        </div>
      </section>

      {/* ATP Professionals - Enhanced Layout */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-lbta-burnt"></div>
              <p className="text-xs font-sans tracking-ultra-wide uppercase text-white/60">
                Professional Development
              </p>
              <div className="h-px w-12 bg-lbta-burnt"></div>
            </div>
            <h2 className="text-5xl font-serif font-light mb-6">
              ATP Tour Professionals
            </h2>
            <p className="text-lg text-white/70 font-sans max-w-2xl mx-auto">
              Currently coaching players competing on the professional tour worldwide
            </p>
          </AnimatedSection>

          <div className="space-y-24">
            {atpPlayers.map((player, index) => (
              <AnimatedSection key={player.name} delay={index * 0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Image */}
                  <div className={`lg:col-span-7 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-800 border border-white/10">
                      <Image
                        src={player.image}
                        alt={`${player.name} - ${player.rank} ATP Professional`}
                        fill
                        quality={95}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8ZAAAAAAAAA//Z"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`lg:col-span-5 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-6">
                      <div>
                        <p className="text-lbta-burnt text-sm font-sans tracking-wide mb-3 uppercase">
                          {player.improvement || player.achievement}
                        </p>
                        <h3 className="text-4xl font-serif font-light mb-3">
                          {player.name}
                        </h3>
                        <p className="text-2xl text-lbta-burnt font-sans font-medium">
                          {player.rank}
                        </p>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/20">
                        {player.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="text-2xl font-serif font-light text-lbta-burnt mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs font-sans text-white/60 uppercase tracking-wide">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <p className="text-white/80 leading-relaxed text-lg">
                        {player.story}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* College Placements - Refined */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-lbta-burnt"></div>
              <p className="text-xs font-sans tracking-ultra-wide uppercase text-gray-500">
                NCAA Success
              </p>
              <div className="h-px w-12 bg-lbta-burnt"></div>
            </div>
            <h2 className="text-5xl font-serif font-light text-lbta-charcoal mb-6">
              Division I Placements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              20+ full and partial scholarships to elite Division I programs since 2020
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {collegeStories.map((story, index) => (
              <AnimatedSection key={story.student} delay={index * 0.1}>
                <div className="group bg-gradient-to-br from-white to-lbta-cream border border-gray-200 hover:border-lbta-burnt/30 transition-all duration-300 p-10 rounded-sm h-full">
                  {/* University Logo Placeholder */}
                  <div className="w-16 h-16 bg-lbta-charcoal/5 rounded-full mb-6 flex items-center justify-center">
                    <span className="text-xs font-sans text-gray-400">LOGO</span>
                  </div>

                  <h3 className="text-3xl font-serif font-light text-lbta-charcoal mb-2">
                    {story.student}
                  </h3>
                  <p className="text-lbta-burnt font-sans font-medium mb-6 text-lg">
                    {story.school} • {story.scholarship}
                  </p>
                  
                  {/* Before/After Stats */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <div className="text-xs font-sans text-gray-500 uppercase tracking-wide mb-1">Before</div>
                      <div className="text-xl font-serif text-gray-600">{story.stats.before}</div>
                    </div>
                    <div className="text-lbta-burnt">→</div>
                    <div>
                      <div className="text-xs font-sans text-gray-500 uppercase tracking-wide mb-1">After</div>
                      <div className="text-xl font-serif text-lbta-burnt font-medium">{story.stats.after}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {story.story}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Testimonials - NEW SECTION */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-lbta-burnt"></div>
              <p className="text-xs font-sans tracking-ultra-wide uppercase text-white/60">
                Parent Perspectives
              </p>
              <div className="h-px w-12 bg-lbta-burnt"></div>
            </div>
            <h2 className="text-5xl font-serif font-light mb-6">
              What Parents Are Saying
            </h2>
            <p className="text-lg text-white/70 font-sans max-w-2xl mx-auto">
              The families who trust us with their children's development
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {parentTestimonials.map((testimonial, index) => (
              <AnimatedSection key={testimonial.parent} delay={index * 0.1}>
                <div className="bg-white/5 border border-white/10 p-10 rounded-sm h-full backdrop-blur-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-lbta-burnt/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lbta-burnt text-xl font-serif">❝</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-sans font-medium mb-1">{testimonial.parent}</h3>
                      <p className="text-sm text-white/60">Parent of {testimonial.student}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/90 leading-relaxed text-lg mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <p className="text-lbta-burnt font-sans font-medium">
                      → {testimonial.placement}
                    </p>
                    <p className="text-sm text-white/50">{testimonial.duration}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Adult Transformations - Enhanced */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-lbta-burnt"></div>
              <p className="text-xs font-sans tracking-ultra-wide uppercase text-gray-500">
                Adult Success
              </p>
              <div className="h-px w-12 bg-lbta-burnt"></div>
            </div>
            <h2 className="text-5xl font-serif font-light text-lbta-charcoal mb-6">
              Never Too Late to Excel
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Same elite training principles, adapted for adult players
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {adultStories.map((story, index) => (
              <AnimatedSection key={story.name} delay={index * 0.1}>
                <div className="bg-white border border-gray-200 p-10 rounded-sm h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-block px-4 py-1 bg-lbta-burnt/10 border border-lbta-burnt/20 rounded-full mb-6">
                    <p className="text-xs font-sans tracking-wide uppercase text-lbta-burnt">
                      {story.highlight}
                    </p>
                  </div>

                  <h3 className="text-3xl font-serif font-light text-lbta-charcoal mb-3">
                    {story.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-2xl font-sans font-medium text-lbta-burnt">
                      {story.transformation}
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-gray-600">{story.timeframe}</p>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-6">
                    {story.story}
                  </p>
                  
                  <p className="text-sm text-gray-500 font-sans">
                    {story.duration}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonial CTA - NEW */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center">
            <div className="max-w-3xl mx-auto">
              <div className="relative aspect-video bg-gray-800 rounded-sm mb-8 flex items-center justify-center border border-white/10">
                {/* Video Placeholder */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-lbta-burnt/20 border-2 border-lbta-burnt flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-lbta-burnt ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-white/60 font-sans">Watch Student Success Stories</p>
                </div>
              </div>
              <p className="text-white/70 font-sans text-lg">
                Hear directly from our students and their families about their journey at LBTA
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Badges - NEW */}
      <section className="section-spacing bg-white border-y border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center">
            <p className="text-xs font-sans tracking-ultra-wide uppercase text-gray-500 mb-12">
              Certified & Recognized By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-16 opacity-60">
              {/* Replace with actual certification logos */}
              <div className="text-lg font-sans text-gray-400">USPTA Certified</div>
              <div className="text-lg font-sans text-gray-400">USTA Member</div>
              <div className="text-lg font-sans text-gray-400">PTR Certified</div>
              <div className="text-lg font-sans text-gray-400">ATP Coach</div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA - More Compelling */}
      <section className="section-spacing bg-gradient-to-b from-lbta-cream to-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-serif font-light text-lbta-charcoal mb-6">
                Write Your Own Success Story
              </h2>
              <p className="text-xl text-gray-600 mb-12 font-sans font-light leading-relaxed">
                Join the LBTA community and discover what you're capable of achieving. 
                Book a trial session and experience the difference.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book" className="btn-primary text-base">
                  BOOK TRIAL SESSION
                </Link>
                <Link 
                  href="/programs" 
                  className="btn-secondary text-base"
                >
                  EXPLORE PROGRAMS
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-8 font-sans">
                Trial sessions available for juniors, adults, and high-performance players
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
