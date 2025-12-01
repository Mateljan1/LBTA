import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SeamlessLogo from '@/components/ui/SeamlessLogo'
import PhotoVideoGallery from '@/components/ui/PhotoVideoGallery'
import PartnershipSection from '@/components/ui/PartnershipSection'

const stats = [
  { value: "200+", label: "Active Members" },
  { value: "20+", label: "D1 Placements" },
  { value: "5", label: "Years" },
  { value: "3", label: "Locations" },
]

const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director",
    specialty: "ATP/WTA Tour Coach",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialty: "College Recruitment",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialty: "Ages 3-12",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance",
    specialty: "ATP Pro #556",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png",
  },
]

export default function Home() {

  return (
    <>
      {/* Hero - Refined & Elegant */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_HEROIMAGE-2.png?quality=95)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: '-webkit-optimize-contrast',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 container-narrow text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-8 tracking-tight" 
                style={{ lineHeight: 1.1, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
              Your Championship Journey
              <br />
              Starts in Laguna Beach.
            </h1>
            
            <p className="text-lg md:text-xl font-sans font-light text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
               style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
              Championship-level coaching. Individual attention. Proven results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link
                href="/book"
                className="btn-primary"
              >
                BEGIN YOUR JOURNEY
              </Link>

              <Link href="/programs" className="btn-secondary bg-white/10 border-white text-white hover:bg-white hover:text-lbta-charcoal">
                EXPLORE PROGRAMS
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm font-sans tracking-wide">
              <span>20 D1 Placements</span>
              <span className="hidden sm:inline">•</span>
              <span>ATP/WTA Coaching</span>
              <span className="hidden sm:inline">•</span>
              <span>City Partner Since 2020</span>
            </div>
          </div>
        </div>
      </section>


      {/* Principles - Quiet Confidence */}
      <section className="section-spacing bg-white">
        <div className="container-narrow">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Our Approach</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              How We Work
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">01</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  Real Experience
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  ATP/WTA tour coaches. Twenty years refining what works. We teach the way professionals train—adapted to where you are now.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">02</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  Small Groups
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Six students maximum. Your coach knows your name, your game, your goals. Every session is personal.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <div className="text-6xl font-serif font-light text-lbta-burnt/30 mb-6">03</div>
                <h3 className="text-xl font-sans font-medium text-lbta-charcoal mb-4">
                  It Works
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Twenty students earned D1 scholarships. Three train on the ATP tour. But most come for something simpler: to play better tennis and enjoy it more.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats - Premium */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">By the Numbers</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Results Measured
            </h2>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <div className="group cursor-default">
                  <div className="text-5xl md:text-6xl font-serif font-light text-lbta-charcoal mb-3 group-hover:text-lbta-burnt transition-colors duration-500">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 font-sans tracking-wide group-hover:text-gray-700 transition-colors duration-500">
                    {stat.label}
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300 mx-auto mt-4 group-hover:bg-lbta-burnt transition-colors duration-500" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Development - Refined */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <AnimatedSection>
              <div className="relative">
                <Image 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png"
                  alt="Andrew Mateljan coaching ATP professional Karue Sell"
                  width={1200}
                  height={800}
                  className="w-full h-auto rounded-sm"
                  loading="lazy"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    ATP Ranking
                  </p>
                  <p className="text-5xl font-serif font-light text-lbta-charcoal">
                    #258
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Content */}
            <AnimatedSection delay={0.2}>
              <p className="text-overline mb-6">Real Results</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-8 tracking-tight leading-tight">
                #858 to #258  
                in Twelve Months
              </h2>
              <p className="body-text mb-6">
                Karue Sell was talented but inconsistent. We worked on movement efficiency and match mindset. Twelve months later, he'd climbed 600 ATP ranking spots.
              </p>
              <p className="body-text mb-8">
                The breakthrough wasn't technical. It was mental. The same approach works whether you're eight years old or on tour.
              </p>
              <Link href="/coaches/andrew-mateljan" className="btn-secondary">
                MEET ANDREW
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* City Partnership - Museum Quality */}
      <section className="section-spacing bg-lbta-tan">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Official Partnership</p>
            <h2 className="text-5xl md:text-7xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              City of Laguna Beach
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-0.5 bg-lbta-burnt" />
              <p className="text-sm text-gray-500 font-sans tracking-wide">
                Since 2020
              </p>
              <div className="w-12 h-0.5 bg-lbta-burnt" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entrusted with developing tennis training across three premier city facilities. 
              A partnership built on proven results and community impact.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="flex justify-center mb-20">
            <img 
              src="/logos/city-laguna-beach.png"
              alt="City of Laguna Beach - Official Partner"
              className="h-64 md:h-80 w-auto opacity-90"
              style={{ 
                objectFit: 'contain',
                mixBlendMode: 'darken'
              }}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Laguna Beach High School", img: "0f3eda457_1.png" },
                { name: "Moulton Meadows Park", img: "d1706d2b0_2.png" },
                { name: "Alta Laguna Park", img: "0f3eda457_1.png" }
              ].map((facility) => (
                <div key={facility.name} className="group cursor-default">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-6 relative bg-gray-100">
                    <img 
                      src={`https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/${facility.img}?quality=95`}
                      alt={facility.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                    />
                    <div className="absolute inset-0 bg-lbta-charcoal/0 group-hover:bg-lbta-charcoal/10 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-sans tracking-wide group-hover:text-gray-700 transition-colors duration-500">
                      {facility.name}
                    </p>
                    <div className="w-6 h-0.5 bg-gray-300 mx-auto mt-3 group-hover:bg-lbta-burnt group-hover:w-10 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs - Minimal Grid */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Programs</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
              Junior and adult. Beginner to advanced. Group and private.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection delay={0.2}>
              <Link href="/programs/junior">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Junior Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ages 3-18. Foundation building through competitive development and college preparation.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Link href="/programs/adult">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Adult Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    All skill levels. Beginner instruction through competitive tournament training.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} className="text-center">
            <Link href="/programs" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              View Complete Program Overview
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Coaching Team - Refined Grid */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Your Development Team</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal tracking-tight">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              Each coach brings unique expertise from professional tours to collegiate success. Your development is guided by proven experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {coaches.map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.1}>
                <Link href="/coaches" className="group">
                  <div className="aspect-square overflow-hidden rounded-sm mb-4 relative">
                    <Image 
                      src={coach.image}
                      alt={coach.name}
                      width={300}
                      height={300}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-1 group-hover:text-lbta-burnt transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {coach.title}
                  </p>
                  <p className="text-xs text-lbta-burnt font-sans tracking-wide">
                    {coach.specialty}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5} className="text-center mt-16">
            <Link href="/coaches" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              Meet the Full Team
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Testimonials - Single Featured */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">In Their Words</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Member Stories
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-sm overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <iframe
                  src="https://player.vimeo.com/video/1134930901?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;title=0&amp;byline=0&amp;portrait=0"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Parent testimonial"
                ></iframe>
              </div>
              <div className="text-center mt-6">
                <Link href="/success-stories" className="text-sm font-sans text-gray-500 hover:text-lbta-charcoal transition-colors">
                  View more stories →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Photo & Program Video Gallery */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Our Community in Action</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Behind the Scenes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              Experience the energy and dedication that defines every day at LBTA. 
              From championship facilities to daily training sessions.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <PhotoVideoGallery className="max-w-5xl mx-auto" />
          </AnimatedSection>
        </div>
      </section>

      {/* Partnership Section */}
      <PartnershipSection />

      {/* CTA - Minimal */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 tracking-tight">
              Begin Your Tennis Journey
            </h2>
            <p className="text-lg font-sans font-light text-white/80 mb-10 leading-relaxed">
              Experience our approach firsthand. Complimentary trial. No pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                SCHEDULE TRIAL
              </Link>
              <a
                href="tel:9494646645"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-sans text-sm font-medium tracking-wide hover:border-white hover:bg-white/10 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Network - Moved to End */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">The Complete Experience</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Beyond the Court
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              The full tennis experience: training on court, conditioning off court, equipment when you need it.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Fit4Tennis */}
            <AnimatedSection delay={0.1}>
              <div className="card-lbta p-10 text-center h-full flex flex-col">
                <div className="h-20 mb-6 flex items-center justify-center bg-gray-50 rounded-sm -mx-10 -mt-10 mb-8 p-6">
                  <img
                    src="/logos/fit4tennis.png"
                    alt="Fit4Tennis"
                    className="h-16 w-auto opacity-90"
                  />
                </div>
                <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-4">
                  Fit4Tennis
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Andrew's global fitness platform. Workout programs, movement training, and conditioning protocols used by ATP/WTA players.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  100K+ followers worldwide
                </p>
                <a
                  href="https://fit4tennis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
                >
                  Visit Fit4Tennis →
                </a>
              </div>
            </AnimatedSection>

            {/* Racket Rescue */}
            <AnimatedSection delay={0.2}>
              <div className="card-lbta p-10 text-center h-full flex flex-col">
                <div className="h-20 mb-6 flex items-center justify-center bg-gray-50 rounded-sm -mx-10 -mt-10 mb-8 p-6">
                  <img
                    src="/logos/racketrescue.png"
                    alt="Racket Rescue"
                    className="h-16 w-auto opacity-90"
                  />
                </div>
                <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-4">
                  Racket Rescue
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Professional racket restringing and equipment services. Mobile pickup and delivery throughout Laguna Beach.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  (949) 534-0457
                </p>
                <a
                  href="https://racketrescue.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
                >
                  Visit Racket Rescue →
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  )
}
