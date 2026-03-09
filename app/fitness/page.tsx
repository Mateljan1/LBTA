import Link from 'next/link'
import Image from 'next/image'
import StickyCTA from '@/components/StickyCTA'
import DarkSection from '@/components/ui/DarkSection'
import HorizonDivider from '@/components/ui/HorizonDivider'
import { getFitnessClasses } from '@/lib/programs-data'

export default function FitnessPage() {
  const fitnessClasses = getFitnessClasses()
  return (
    <>
      {/* HERO */}
      <DarkSection className="min-h-[65vh] md:min-h-[75vh] flex items-center justify-center py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-headline text-[36px] md:text-[60px] font-semibold leading-[1.05] text-brand-sandstone mb-6">
            Fitness & Community at LBTA
          </h1>
          <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/90 mb-10 max-w-[85%] mx-auto">
            Build endurance, sharpen movement, and connect through the game.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-black text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-[2px] transition-all duration-200 min-h-[48px] hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Join a Session →
          </Link>
        </div>
      </DarkSection>

      <HorizonDivider />
      {/* CARDIO TENNIS */}
      <section className="bg-brand-sandstone py-16 md:py-24">
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
              <h2 className="font-headline text-[32px] md:text-[44px] font-semibold text-brand-pacific-dusk">
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
                className="inline-block bg-black hover:bg-lbta-black text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-[2px] transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
              >
                View Schedule →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LIVEBALL */}
      <section className="bg-brand-morning-light py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6 md:order-1">
              <h2 className="font-headline text-[32px] md:text-[44px] font-semibold text-brand-pacific-dusk">
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
                className="inline-block bg-black hover:bg-lbta-black text-white font-sans font-semibold text-[14px] md:text-[15px] py-3 px-8 rounded-[2px] transition-all duration-200 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
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

      <HorizonDivider />
      {/* SCHEDULE SNIPPET */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6">
          <h2 className="font-headline text-[28px] md:text-[36px] font-semibold text-brand-pacific-dusk mb-8 text-center">
            Weekly Fitness Sessions
          </h2>
          
          <div className="bg-brand-morning-light rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-black/10">
              {fitnessClasses.map((session, index) => (
                <div key={index} className="p-5 md:p-6 hover:bg-white/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="font-headline text-[18px] md:text-[20px] font-semibold text-black mb-1">
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
                        className="bg-black hover:bg-lbta-black text-white px-5 py-2 rounded-[2px] font-sans font-semibold text-[13px] md:text-[14px] transition-all duration-200 whitespace-nowrap min-h-[48px] flex items-center focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
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
              className="inline-block font-sans text-[15px] text-black hover:underline transition-all focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 rounded-sm"
            >
              View Full Schedule →
            </Link>
          </div>
        </div>
      </section>

      <HorizonDivider />
      {/* CTA */}
      <DarkSection className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-headline text-[36px] md:text-[52px] font-semibold text-brand-sandstone mb-8 leading-[1.15]">
            Join a Session
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] leading-[1.6] text-white/90 mb-10">
            Movement. Craft. Community — for every player.
          </p>
          <Link 
            href="/book"
            className="inline-block bg-black text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-[2px] transition-all duration-200 min-h-[48px] hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
          >
            Book a Class →
          </Link>
        </div>
      </DarkSection>
      
      {/* Sticky Mobile CTA */}
      <StickyCTA text="Join a Session" href="/book" showAfterScroll={600} />
    </>
  )
}
