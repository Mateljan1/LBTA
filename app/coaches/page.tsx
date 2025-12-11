import Link from 'next/link'
import Image from 'next/image'

const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director & Head Coach",
    specialization: "ATP/WTA Tour Coach",
    bio: "20 years developing competitive players. Former #3 SoCal, #12 nationally ranked junior. Seven years coaching internationally across Spain, Croatia, and Norway. Currently coaches ATP #262 Karue Sell. Training history: Max McKennon (ATP #458), Ryan Seggerman (ATP #63 Doubles, #348 Singles). Masters 1000 experience at Indian Wells. Founder of Fit4Tennis (100K+ users).",
    credentials: "Former Top Junior • ATP/WTA Tour Coach • 20+ D1 Placements",
    rate: "$250/hour",
    image: "/images/coaches/andrew.webp",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialization: "College Recruitment Specialist",
    bio: "Over 20 D1 college placements. Kevin specializes in NCAA recruitment strategy, tournament preparation, and developing college-bound athletes. His systematic approach has helped countless families navigate the college tennis process successfully.",
    credentials: "20+ D1 Placements • NCAA Recruitment Expert • USPTA Elite",
    rate: "$150/hour",
    image: "/images/coaches/kevin.webp",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialization: "Junior Development (Ages 3-12)",
    bio: "Engaging, patient approach that builds confidence and love for tennis while developing proper technique. Michelle creates the perfect learning environment for young children through age-appropriate activities and positive reinforcement.",
    credentials: "Youth Development Specialist • Red/Orange Ball Certified • 95% Parent Satisfaction",
    rate: "$120/hour",
    image: "/images/coaches/michelle.webp",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance Coach",
    specialization: "ATP Pro #556",
    bio: "Professional tour experience brings real-world competitive insights to high-performance training. Savriyan specializes in advanced technique development, match strategy, and preparing players for competitive success.",
    credentials: "ATP Professional • 8 Years Tour Experience • Match Strategy Expert",
    rate: "$120/hour",
    image: "/images/coaches/savriyan.webp",
  },
  {
    name: "Andy Wu",
    title: "Program Coach",
    specialization: "Junior & Adult Development",
    bio: "Solid fundamentals and progressive skill development define Andy's coaching philosophy. Works with all ages and skill levels with focus on building proper technique from the ground up.",
    credentials: "USPTA Certified • EdD Educational Leadership • Fundamentals Specialist",
    rate: "$100/hour",
    image: "/images/coaches/andy.webp",
  }
]

export default function CoachesPage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-5.webp"
            alt="LBTA coaching team"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 50%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] mb-6 text-shadow">
            Your Coaches. Your Champions.
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
            The same methods and structure used at the highest levels — now accessible to every player.
          </p>
          <a 
            href="#team-grid"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Meet the Team ↓
          </a>
        </div>
      </section>

      {/* TEAM GRID - Quick Overview */}
      <section id="team-grid" className="bg-[#FAF8F3] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {coaches.map((coach) => (
              <div key={coach.name} className="text-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-soft">
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: '50% 30%' }}
                    sizes="200px"
                  />
                </div>
                <h3 className="font-serif text-[20px] md:text-[24px] font-semibold text-black mb-1">
                  {coach.name}
                </h3>
                <p className="font-sans text-[14px] md:text-[15px] text-lbta-orange font-medium mb-2">
                  {coach.title}
                </p>
                <p className="font-sans text-[13px] md:text-[14px] text-black/60">
                  {coach.specialization}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED: ANDREW MATELJAN */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative aspect-[3/2] md:aspect-[3/4] overflow-hidden">
              <Image
                src="/images/founder/andrew-portrait.webp"
                alt="Andrew Mateljan, Director & Head Coach"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 20%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-[32px] md:text-[48px] font-bold text-black mb-2 leading-tight">
                  Andrew Mateljan
                </h2>
                <p className="font-sans text-[18px] md:text-[20px] text-lbta-orange font-semibold mb-4">
                  Director & Head Coach
                </p>
                <p className="font-sans text-[14px] md:text-[15px] text-black/70 italic">
                  ATP/WTA Tour Coach
                </p>
              </div>
              
              <div className="space-y-4 font-sans text-[15px] md:text-[16px] leading-relaxed text-black/85">
                <p>
                  20 years developing competitive players. Former #3 SoCal, #12 nationally ranked junior.
                </p>
                <p>
                  Seven years coaching internationally across Spain, Croatia, and Norway. 
                  Currently coaches ATP #262 Karue Sell.
                </p>
                <p>
                  Training history: Max McKennon (ATP #458), Ryan Seggerman (ATP #63 Doubles, #348 Singles). 
                  Masters 1000 experience at Indian Wells.
                </p>
                <p>
                  Founder of Fit4Tennis (100K+ users).
                </p>
              </div>
              
              <div className="pt-6">
                <p className="font-sans text-[16px] md:text-[18px] text-lbta-orange font-semibold mb-4">
                  {coaches[0].rate}
                </p>
                <Link
                  href="/book"
                  className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-3 px-8 rounded-full transition-all duration-200 min-h-[48px]"
                >
                  Book Private Lesson →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COACHING TEAM - Alternating Layouts */}
      {coaches.slice(1).map((coach, index) => (
        <section 
          key={coach.name} 
          className={`${index % 2 === 0 ? 'bg-[#FAF8F3]' : 'bg-white'} py-16 md:py-20`}
        >
          <div className="max-w-[1200px] mx-auto px-4 md:px-12">
            <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`relative aspect-[3/2] overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <Image
                  src={coach.image}
                  alt={coach.name}
                  fill
                  className="object-cover rounded"
                  style={{ objectPosition: '50% 30%' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              <div className={`space-y-4 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div>
                  <h3 className="font-serif text-[28px] md:text-[36px] font-semibold text-black mb-2">
                    {coach.name}
                  </h3>
                  <p className="font-sans text-[16px] md:text-[18px] text-lbta-orange font-semibold mb-1">
                    {coach.title}
                  </p>
                  <p className="font-sans text-[14px] md:text-[15px] text-black/70 italic">
                    {coach.specialization}
                  </p>
                </div>
                
                <p className="font-sans text-[15px] md:text-[16px] leading-relaxed text-black/85">
                  {coach.bio}
                </p>
                
                <p className="font-sans text-[14px] md:text-[15px] text-black/60">
                  {coach.credentials}
                </p>
                
                <div className="pt-4">
                  <p className="font-sans text-[16px] md:text-[17px] text-lbta-orange font-semibold mb-4">
                    {coach.rate}
                  </p>
                  <Link
                    href="/book"
                    className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-full transition-all duration-200 min-h-[44px]"
                  >
                    Schedule Lesson →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* PHILOSOPHY QUOTE */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-4 md:px-6 text-center">
          <blockquote className="font-serif italic text-[24px] md:text-[32px] leading-[1.4] text-black mb-6 border-l-4 border-lbta-orange pl-8 text-left">
            "Great coaching isn't about producing players — it's about producing people who play with clarity, discipline, and joy."
          </blockquote>
          <p className="font-sans text-[15px] md:text-[16px] text-black/70 text-left pl-8">
            — Andrew Mateljan, Director
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset"
            fill
            className="object-cover cta-img"
            sizes="100vw"
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold mb-8 leading-[1.2] text-shadow">
            Work with Our Coaches
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 mb-10">
            Schedule a private session or trial with the LBTA team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
            >
              Book a Private Lesson →
            </Link>
            <Link
              href="/schedules"
              className="inline-block border-2 border-white hover:bg-white hover:text-black text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
            >
              Schedule a Trial →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
