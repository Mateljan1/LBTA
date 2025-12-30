import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Racquet Rescue - Professional Racquet Stringing | Laguna Beach Tennis Academy',
  description: 'Expert racquet stringing services in Laguna Beach. Same-day service, premium strings, and professional customization for all skill levels.',
  keywords: 'racquet stringing Laguna Beach, tennis racquet restring, professional stringing service, racquet customization',
  openGraph: {
    title: 'Racquet Rescue | LBTA',
    description: 'Professional racquet stringing and customization services',
    type: 'website',
  },
}

export default function RacquetRescuePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/courts-aerial.webp"
            alt="Tennis courts at Laguna Beach Tennis Academy"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-lbta text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/logos/racketrescue.png"
                alt="Racquet Rescue"
                width={200}
                height={80}
                className="h-20 w-auto"
              />
            </div>

            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl mb-6">
              Racquet Rescue
            </h1>
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Professional racquet stringing and customization services. 
              Same-day service available for players who demand excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="#services"
                className="inline-flex items-center justify-center bg-lbta-orange text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-800 ease-cinematic hover:bg-lbta-red hover:-translate-y-0.5"
              >
                View Services
              </Link>
              <Link
                href="#booking"
                className="inline-flex items-center justify-center bg-transparent text-white border border-white/40 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-800 ease-cinematic hover:border-white hover:bg-white/10 hover:-translate-y-0.5"
              >
                Book Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-lbta-bone">
        <div className="container-lbta">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Why Choose Racquet Rescue
            </h2>
            <p className="font-body text-lg md:text-xl text-lbta-secondary leading-relaxed">
              Professional stringing services trusted by competitive players and recreational enthusiasts alike.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-8 border border-black/6 transition-all duration-1200 ease-cinematic hover:border-black/10 hover:-translate-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lbta-orange text-4xl mb-4">⚡</div>
              <h3 className="font-headline text-2xl mb-4">Same-Day Service</h3>
              <p className="font-body text-lbta-secondary leading-relaxed">
                Drop off before noon, pick up the same day. We understand the urgency of tournament preparation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 border border-black/6 transition-all duration-1200 ease-cinematic hover:border-black/10 hover:-translate-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lbta-orange text-4xl mb-4">🎯</div>
              <h3 className="font-headline text-2xl mb-4">Expert Precision</h3>
              <p className="font-body text-lbta-secondary leading-relaxed">
                Certified stringers with 25+ years experience. Every racquet strung to exact specifications.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 border border-black/6 transition-all duration-1200 ease-cinematic hover:border-black/10 hover:-translate-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03)]">
              <div className="text-lbta-orange text-4xl mb-4">🏆</div>
              <h3 className="font-headline text-2xl mb-4">Premium Strings</h3>
              <p className="font-body text-lbta-secondary leading-relaxed">
                Full selection of professional-grade strings from Luxilon, Babolat, Wilson, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Pricing Section */}
      <section id="services" className="py-24 md:py-32 bg-white">
        <div className="container-lbta">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Services & Pricing
            </h2>
            <p className="font-body text-lg md:text-xl text-lbta-secondary leading-relaxed">
              Professional stringing services with transparent pricing. String cost not included.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Standard Stringing */}
            <div className="bg-lbta-bone p-10 border border-black/6">
              <div className="mb-6">
                <h3 className="font-headline text-3xl mb-2">Standard Stringing</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl text-lbta-orange">$25</span>
                  <span className="font-body text-lbta-secondary">per racquet</span>
                </div>
              </div>
              <ul className="space-y-3 font-body text-lbta-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Professional stringing to your specifications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>2-3 day turnaround</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Tension range: 40-70 lbs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>String recommendations included</span>
                </li>
              </ul>
            </div>

            {/* Same-Day Stringing */}
            <div className="bg-lbta-beige p-10 border border-lbta-orange/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-lbta-orange text-white text-xs font-sans tracking-wider px-3 py-1 uppercase">
                Popular
              </div>
              <div className="mb-6">
                <h3 className="font-headline text-3xl mb-2">Same-Day Service</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl text-lbta-orange">$35</span>
                  <span className="font-body text-lbta-secondary">per racquet</span>
                </div>
              </div>
              <ul className="space-y-3 font-body text-lbta-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Drop off before noon, pick up same day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Priority service for tournament players</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>All standard service benefits</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Perfect for match preparation</span>
                </li>
              </ul>
            </div>

            {/* Racquet Customization */}
            <div className="bg-white p-10 border border-black/6">
              <div className="mb-6">
                <h3 className="font-headline text-3xl mb-2">Racquet Customization</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl text-lbta-orange">$50+</span>
                  <span className="font-body text-lbta-secondary">per racquet</span>
                </div>
              </div>
              <ul className="space-y-3 font-body text-lbta-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Weight and balance adjustments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Lead tape installation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Grip customization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Professional consultation included</span>
                </li>
              </ul>
            </div>

            {/* Grip Replacement */}
            <div className="bg-white p-10 border border-black/6">
              <div className="mb-6">
                <h3 className="font-headline text-3xl mb-2">Grip Replacement</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-5xl text-lbta-orange">$10</span>
                  <span className="font-body text-lbta-secondary">per racquet</span>
                </div>
              </div>
              <ul className="space-y-3 font-body text-lbta-secondary">
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Premium replacement grips</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Overgrip installation available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Multiple grip options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lbta-orange mt-1">✓</span>
                  <span>Quick turnaround</span>
                </li>
              </ul>
            </div>
          </div>

          {/* String Brands */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-lbta-bone p-8 border border-black/6">
              <h3 className="font-headline text-2xl mb-6 text-center">Premium String Selection</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-body text-lbta-secondary">
                <div>
                  <p className="font-semibold text-lbta-primary mb-1">Luxilon</p>
                  <p className="text-sm">$20-35</p>
                </div>
                <div>
                  <p className="font-semibold text-lbta-primary mb-1">Babolat</p>
                  <p className="text-sm">$18-30</p>
                </div>
                <div>
                  <p className="font-semibold text-lbta-primary mb-1">Wilson</p>
                  <p className="text-sm">$15-28</p>
                </div>
                <div>
                  <p className="font-semibold text-lbta-primary mb-1">Solinco</p>
                  <p className="text-sm">$15-25</p>
                </div>
              </div>
              <p className="text-center text-sm text-lbta-secondary mt-6">
                String prices vary by model. We'll help you choose the perfect string for your game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 md:py-32 bg-lbta-bone">
        <div className="container-lbta">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Book Your Service
            </h2>
            <p className="font-body text-lg md:text-xl text-lbta-secondary leading-relaxed">
              Fill out the form below and we'll confirm your appointment within 24 hours.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 border border-black/6">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                    FIRST NAME *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                    LAST NAME *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                  PHONE *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="service" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                  SERVICE TYPE *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                >
                  <option value="">Select a service</option>
                  <option value="standard">Standard Stringing ($25)</option>
                  <option value="same-day">Same-Day Service ($35)</option>
                  <option value="customization">Racquet Customization ($50+)</option>
                  <option value="grip">Grip Replacement ($10)</option>
                </select>
              </div>

              <div>
                <label htmlFor="racquets" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                  NUMBER OF RACQUETS
                </label>
                <input
                  type="number"
                  id="racquets"
                  name="racquets"
                  min="1"
                  max="10"
                  defaultValue="1"
                  className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block font-sans text-sm font-medium text-lbta-primary mb-2 tracking-wide">
                  ADDITIONAL NOTES
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="String preferences, tension, special requests..."
                  className="w-full px-4 py-3 border border-black/20 focus:border-lbta-orange focus:outline-none focus:ring-2 focus:ring-lbta-orange/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center bg-lbta-orange text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-800 ease-cinematic hover:bg-lbta-red hover:-translate-y-0.5"
              >
                Submit Request
              </button>

              <p className="text-center text-sm text-lbta-secondary">
                We'll confirm your appointment within 24 hours
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-lbta">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Location */}
            <div>
              <h3 className="font-headline text-3xl mb-6">Location</h3>
              <div className="space-y-4 font-body text-lbta-secondary">
                <p className="text-lg">
                  <strong className="text-lbta-primary">Laguna Beach Tennis Academy</strong><br />
                  1098 Balboa Ave<br />
                  Laguna Beach, CA 92651
                </p>
                <p>
                  Located at the beautiful Laguna Beach High School tennis facility.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-lbta-orange hover:text-lbta-red transition-colors"
                >
                  Get Directions →
                </Link>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-headline text-3xl mb-6">Service Hours</h3>
              <div className="space-y-3 font-body text-lbta-secondary">
                <div className="flex justify-between py-2 border-b border-black/10">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-lbta-primary">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-black/10">
                  <span>Saturday</span>
                  <span className="font-semibold text-lbta-primary">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-black/10">
                  <span>Sunday</span>
                  <span className="font-semibold text-lbta-primary">Closed</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-lbta-secondary">
                Same-day service: Drop off before noon for same-day pickup
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-lbta-beige">
        <div className="container-lbta text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl mb-6">
              Ready to Rescue Your Racquet?
            </h2>
            <p className="font-body text-lg md:text-xl text-lbta-secondary mb-8 leading-relaxed">
              Professional stringing services for players who demand excellence. Book your service today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#booking"
                className="inline-flex items-center justify-center bg-lbta-orange text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-800 ease-cinematic hover:bg-lbta-red hover:-translate-y-0.5"
              >
                Book Service
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-transparent text-lbta-primary border border-black/20 font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-800 ease-cinematic hover:border-black hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

