import Image from 'next/image'
import Link from 'next/link'

interface SchedulesCTAProps {
  ctaHeadline?: string
  ctaSubline?: string
}

export default function SchedulesCTA({ ctaHeadline, ctaSubline }: SchedulesCTAProps) {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero/laguna-horizon.webp"
          alt="Laguna Beach sunset"
          fill
          className="object-cover"
          sizes="100vw"
          loading="lazy"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 text-center text-white px-6 py-20">
        <p className="font-sans text-[12px] md:text-[14px] uppercase tracking-[3px] text-white/70 mb-4">
          {ctaHeadline || 'Registration Open'}
        </p>
        <h2 className="font-serif text-[36px] md:text-[48px] font-semibold mb-4 leading-[1.2] text-shadow">
          Ready to Start Training?
        </h2>
        <p className="font-sans text-[16px] md:text-[18px] text-white/90 mb-8 max-w-xl mx-auto">
          {ctaSubline || 'View schedules and pricing for all programs.'}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/book"
            className="bg-black hover:bg-lbta-black text-white font-sans font-semibold text-[16px] py-4 px-10 rounded-[2px] transition-all shadow-md hover:shadow-lg min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
          >
            Book Trial
          </Link>
          <Link
            href="/contact"
            className="border-2 border-white text-white hover:bg-white/10 font-sans font-semibold text-[16px] py-4 px-10 rounded-[2px] transition-all min-h-[48px] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
