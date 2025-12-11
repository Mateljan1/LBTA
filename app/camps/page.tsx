import Link from 'next/link'
import Image from 'next/image'

export default function CampsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[65vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-5.webp"
            alt="Junior tennis campers at Laguna Beach celebrating on courts at sunset"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 50%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-24">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.05] mb-6 text-shadow">
            Summer Tennis Camps 2026
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
            High-energy development for ages 6–16. Learn, compete, and belong in Laguna Beach.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Reserve Your Spot →
          </Link>
        </div>
      </section>

      {/* CAMP OVERVIEW */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black">
                Camp Details
              </h2>
              <div className="space-y-4 font-sans text-[15px] md:text-[16px] text-black/85 leading-relaxed">
                <p><strong>Location:</strong> Moulton Courts · Alta Laguna Park</p>
                <p><strong>Dates:</strong> June 10 – August 2, 2026</p>
                <p><strong>Time:</strong> 9:00 AM – 12:00 PM (Half-Day) · 9:00 AM – 3:00 PM (Full-Day)</p>
                <p><strong>Levels:</strong> Beginner – Advanced (Ages 6-16)</p>
                <p><strong>Tuition:</strong> $495/week (Half-Day) · $695/week (Full-Day)</p>
              </div>
              <Link 
                href="/schedules"
                className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-full transition-all duration-200 min-h-[44px]"
              >
                View Schedule →
              </Link>
            </div>
            
            <div className="relative aspect-[3/2] overflow-hidden rounded">
              <Image
                src="/images/community/community-4.webp"
                alt="Junior tennis campers at Moulton Courts practicing forehands during summer camp"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 50%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 overlay-light" />
            </div>
          </div>
        </div>
      </section>

      {/* CAMP HIGHLIGHTS */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black mb-12 text-center">
            What Makes LBTA Camps Different
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                image: '/images/programs/fitness.webp',
                title: 'Movement',
                description: 'Drills, agility, and dynamic learning.',
              },
              {
                image: '/images/programs/juniors.webp',
                title: 'Discipline',
                description: 'Consistency and feedback — improvement through structure.',
              },
              {
                image: '/images/hero/laguna-horizon.webp',
                title: 'Belonging',
                description: 'Team play, community, and confidence.',
              },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={pillar.image}
                    alt={`${pillar.title} - ${pillar.description}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 overlay-light" />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-[22px] md:text-[24px] font-semibold text-black mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[14px] md:text-[15px] text-black/80 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Laguna Beach sunset over tennis courts"
            fill
            className="object-cover cta-img"
            sizes="100vw"
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[36px] md:text-[52px] font-semibold mb-8 leading-[1.15] text-shadow">
            Reserve Your Spot
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/95 mb-10">
            Camp spaces fill quickly — secure your week today.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Book Camp Consultation →
          </Link>
        </div>
      </section>
    </>
  )
}
