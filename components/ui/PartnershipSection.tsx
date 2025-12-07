'use client'

import AnimatedSection from '@/components/ui/AnimatedSection'

// Partnership logos - Using placeholder text until PNGs are uploaded
// User has PNGs ready: Fit4Tennis, VYLO, Racket Rescue, RacquetIQ, GPTCA, Toroline, LBHS, City of LB
const partners = [
  {
    name: "Fit4Tennis",
    description: "Movement & Performance",
    logo: "/logos/fit4tennis.png", // Upload PNG here
    url: "https://fit4tennis.com"
  },
  {
    name: "VYLO",
    description: "Performance Institute",
    logo: "/logos/vylo.png", // Upload PNG here
    url: "/vylo"
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
    <section className={`section-spacing bg-white border-t border-gray-200 ${className}`}>
      <div className="container-lbta">
        <AnimatedSection className="text-center mb-16">
          <p className="text-overline mb-6">Our Network</p>
          <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
            Partnership & Community
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
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
                    <img
                      src={partner.logo}
                      alt={`${partner.name} - ${partner.description}`}
                      className="max-h-20 max-w-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-sans text-center group-hover:text-gray-700 transition-colors">
                    {partner.description}
                  </p>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>

        <AnimatedSection delay={0.8} className="text-center mt-16">
          <p className="text-sm text-gray-500 font-sans">
            Interested in partnership opportunities? <a href="/contact" className="text-lbta-burnt hover:underline">Contact us</a>
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
