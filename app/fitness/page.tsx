import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'

const fitnessClasses = [
  { name: "Cardio Tennis", day: "Tuesday", time: "6:00-7:00 PM", location: "Moulton", price: "$546/qtr" },
  { name: "Cardio Tennis", day: "Wednesday", time: "6:00-7:30 PM", location: "Moulton", price: "$756/qtr" },
  { name: "LiveBall - Beginner", day: "Thursday", time: "6:00-7:30 PM", location: "Moulton", price: "$756/qtr" },
  { name: "LiveBall - Intermediate", day: "Monday", time: "7:00-9:30 AM", location: "LBHS", price: "$756/qtr" },
  { name: "LiveBall - Int/Adv", day: "Saturday", time: "10:30 AM-12:00 PM", location: "LBHS", price: "$756/qtr" },
]

export default function FitnessPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[65vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/programs/fitness.webp"
            alt="LBTA community group in cardio tennis session under golden-hour lighting"
            fill
            className="object-cover fitness-img"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto py-24">
          <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.05] mb-6 text-shadow">
            Fitness & Community at LBTA
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-10 max-w-[85%] mx-auto">
            Build endurance, sharpen movement, and connect through the game.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Join a Session →
          </Link>
        </div>
      </section>

      {/* CARDIO TENNIS */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative aspect-[3/2] overflow-hidden rounded">
              <Image
                src="/images/community/community-7.webp"
                alt="Adult players rallying together during Cardio Tennis session at LBTA"
                fill
                className="object-cover"
                style={{ objectPosition: '50% 50%' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 overlay-light" />
            </div>
            
            <div className="space-y-6">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black">
                Cardio Tennis
              </h2>
              <p className="font-sans text-[16px] md:text-[17px] leading-relaxed text-black/85">
                Cardio Tennis blends drills, rhythm, and fun — high-tempo play designed to 
                elevate your fitness while keeping you engaged.
              </p>
              <p className="font-sans text-[15px] md:text-[16px] text-black/70">
                <strong>Format:</strong> Music-driven drills · 60-90 minutes · All skill levels welcome
              </p>
              <Link 
                href="/schedules#fitness"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-full transition-all duration-200 min-h-[44px]"
              >
                View Schedule →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LIVEBALL */}
      <section className="bg-[#FAF8F3] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:order-1">
              <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-black">
                LiveBall
              </h2>
              <p className="font-sans text-[16px] md:text-[17px] leading-relaxed text-black/85">
                LiveBall is competition in motion — no downtime, just fast-paced rallies that 
                test focus and fitness.
              </p>
              <p className="font-sans text-[15px] md:text-[16px] text-black/70">
                <strong>Format:</strong> Continuous doubles · Level-based groups · 90-150 minutes
              </p>
              <Link 
                href="/schedules#fitness"
                className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-full transition-all duration-200 min-h-[44px]"
              >
                View Schedule →
              </Link>
            </div>
            
            <div className="relative aspect-[3/2] overflow-hidden rounded md:order-2">
              <Image
                src="/images/philosophy/belonging.webp"
                alt="Players engaging in fast-paced LiveBall training under afternoon sun"
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

      {/* SCHEDULE SNIPPET */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6">
          <h2 className="font-serif text-[28px] md:text-[36px] font-semibold text-black mb-8 text-center">
            Weekly Fitness Sessions
          </h2>
          
          <div className="bg-[#FAF8F3] rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-black/10">
              {fitnessClasses.map((session, index) => (
                <div key={index} className="p-5 md:p-6 hover:bg-white/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-[18px] md:text-[20px] font-semibold text-black mb-1">
                        {session.name}
                      </h3>
                      <p className="font-sans text-[14px] md:text-[15px] text-black/70">
                        {session.day} · {session.time} · {session.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-[16px] md:text-[17px] font-semibold text-black">
                        {session.price}
                      </span>
                      <Link
                        href="/book"
                        className="bg-black hover:bg-[#1a1a1a] text-white px-5 py-2 rounded-full font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 whitespace-nowrap min-h-[44px] flex items-center"
                      >
                        Book →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/schedules"
              className="inline-block font-sans text-[15px] text-black hover:underline transition-all"
            >
              View Full Schedule →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/laguna-horizon.webp"
            alt="Aerial view of Laguna Beach Tennis Academy courts overlooking ocean horizon"
            fill
            className="object-cover cta-img"
            sizes="100vw"
          />
          <div className="absolute inset-0 overlay-strong" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-20">
          <h2 className="font-serif text-[36px] md:text-[52px] font-semibold mb-8 leading-[1.15] text-shadow">
            Join a Session
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/95 mb-10">
            Movement. Discipline. Belonging — for every player.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-black hover:bg-[#1a1a1a] text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Book a Class →
          </Link>
        </div>
      </section>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Join a Session" href="/book" showAfterScroll={600} />
    </>
  )
}
