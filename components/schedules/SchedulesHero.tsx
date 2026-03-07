import Image from 'next/image'
import Link from 'next/link'

interface SchedulesHeroProps {
  heroParallax: number
}

export default function SchedulesHero({ heroParallax }: SchedulesHeroProps) {
  return (
    <section className="relative min-h-[65vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/programs/schedules-hero.webp"
          alt="Laguna Beach Tennis Academy training at sunset"
          fill
          priority
          className="object-cover"
          quality={90}
          style={{ 
            objectPosition: '50% 70%',
            transform: `translateY(${heroParallax}px)`
          }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 md:px-6 max-w-4xl mx-auto py-24">
        <p className="font-sans text-[12px] md:text-[14px] uppercase tracking-[3px] text-white/70 mb-4">
          Plan Your 2026
        </p>
        <h1 className="font-serif text-[36px] md:text-[60px] font-bold leading-[1.1] tracking-[-0.5px] mb-6 text-shadow">
          Schedule & Pricing
        </h1>
        <p className="font-sans text-[16px] md:text-[20px] leading-[1.6] text-white/95 mb-4 max-w-[90%] mx-auto">
          Four seasons of structured training, holiday camps, and competitive league play
        </p>
        <p className="font-sans text-[14px] md:text-[16px] text-white/90 font-semibold mb-8">
          Winter 2026 Registration Now Open — Save $50 with Early Bird
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="#programs"
            className="inline-block bg-black hover:bg-lbta-black text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            View Programs
          </Link>
          <Link 
            href="#pricing"
            className="inline-block border-2 border-white hover:bg-white/10 text-white font-sans font-semibold text-[15px] md:text-[16px] py-4 px-10 rounded-full transition-all duration-200 min-h-[48px]"
          >
            See Pricing
          </Link>
        </div>
      </div>
    </section>
  )
}
