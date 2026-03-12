'use client'

import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

// Partnership logos - Using placeholder text until PNGs are uploaded
const partners = [
  {
    name: "Fit4Tennis",
    description: "Movement & Performance",
    logo: "/logos/fit4tennis.png", // Upload PNG here
    url: "https://fit4tennis.com"
  },
  {
    name: "Racket Rescue",
    description: "Equipment Services",
    logo: "/logos/racketrescue.png", // Upload PNG here
    url: "https://racketrescue.com"
  },
  {
    name: "RacquetIQ",
    description: "Tennis Technology",
    logo: "/logos/racquetiq.png", // Upload PNG here
    url: "#"
  },
  {
    name: "GPTCA",
    description: "Professional Coaching",
    logo: "/logos/gptca.png", // Upload PNG here
    url: "#"
  },
  {
    name: "Toroline",
    description: "Court Equipment",
    logo: "/logos/toroline.png", // Upload PNG here
    url: "#"
  },
  {
    name: "Tennis Beast",
    description: "Tennis Apparel",
    logo: "/logos/tennisbeast.png", // Upload PNG here
    url: "#"
  },
  {
    name: "Laguna Beach High School",
    description: "School Partner",
    logo: "/logos/lbhs.png", // Upload PNG here
    url: "#"
  }
]

interface PartnershipSectionProps {
  className?: string
}

export default function PartnershipSection({ className = '' }: PartnershipSectionProps) {
  return (
    <section className={`section-spacing bg-white border-t border-black/6 ${className}`}>
      <div className="container-lbta">
        <AnimatedSection className="text-center mb-16">
          <p className="text-overline text-brand-pacific-dusk mb-6">Our Network</p>
          <h2 className="text-4xl font-headline font-light text-brand-pacific-dusk">
            Partnership & Community
          </h2>
          <p className="text-lg text-brand-pacific-dusk/80 max-w-2xl mx-auto mt-6">
            Building a comprehensive tennis ecosystem through strategic partnerships and community collaboration.
          </p>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto">
          {/* Single row of logos - horizontally scrollable on mobile */}
          <div className="flex items-center justify-center gap-10 md:gap-14 overflow-x-auto no-scrollbar pb-4">
            {partners.map((partner, index) => (
              <AnimatedSection key={partner.name} delay={index * 0.1}>
                <a
                  href={partner.url}
                  className="group block text-center flex-shrink-0"
                  title={`${partner.name} - ${partner.description}`}
                >
                  <div className="relative h-28 w-36 flex items-center justify-center transition-all duration-300">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} - ${partner.description}`}
                      width={144}
                      height={80}
                      sizes="144px"
                      className="max-h-20 max-w-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  <p className="text-xs text-brand-pacific-dusk/60 mt-3 font-sans text-center group-hover:text-brand-pacific-dusk transition-colors">
                    {partner.description}
                  </p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={0.8} className="text-center mt-16">
          <p className="text-sm text-brand-pacific-dusk/70 font-sans">
            Interested in partnership opportunities? <a href="/contact" className="text-brand-sunset-cliff hover:underline">Contact us</a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
