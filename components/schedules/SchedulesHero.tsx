import Image from 'next/image'

interface SchedulesHeroProps {
  ctaText?: string
}

export default function SchedulesHero({ ctaText }: SchedulesHeroProps) {
  return (
    <section className="relative h-[30vh] min-h-[200px] max-h-[320px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/programs/schedules-hero.webp"
          alt="Laguna Beach Tennis Academy courts at sunset"
          fill
          priority
          className="object-cover"
          quality={90}
          style={{ objectPosition: '50% 70%' }}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 text-center text-white px-4 md:px-6">
        <h1 className="font-serif text-[32px] md:text-[48px] font-bold leading-[1.1] tracking-[-0.5px] mb-2">
          Schedules & Pricing
        </h1>
        <p className="font-sans text-[14px] md:text-[16px] text-white/90 font-medium">
          {ctaText || 'Registration open for upcoming seasons'}
        </p>
      </div>
    </section>
  )
}
