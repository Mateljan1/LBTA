import { Metadata } from 'next'
import Link from 'next/link'
import HorizonDivider from '@/components/ui/HorizonDivider'

export const metadata: Metadata = {
  alternates: { canonical: '/help' },
  title: 'Help & Support',
  description: 'Get help with programs, pricing, booking, and more. Contact us directly for immediate assistance.',
  openGraph: {
    title: 'Help & Support | Laguna Beach Tennis Academy',
    description: 'Get help with programs, pricing, booking, and more. Contact us directly.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-brand-sandstone py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16 text-center">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-brand-pacific-dusk mb-6">
            How Can We Help?
          </h1>
          <p className="font-body text-lg md:text-xl text-brand-pacific-dusk/70 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions or contact us directly for personalized assistance.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="font-headline text-3xl md:text-4xl text-brand-pacific-dusk mb-8">
            Quick Links
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Link
              href="/schedules"
              className="block p-6 bg-white border border-black/6 rounded-lg hover:border-black/10 hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">
                Programs & Pricing
              </h3>
              <p className="font-body text-sm text-brand-pacific-dusk/70">
                View all programs, schedules, and pricing information
              </p>
            </Link>
            <Link
              href="/book"
              className="block p-6 bg-white border border-black/6 rounded-lg hover:border-black/10 hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">
                Book a Trial
              </h3>
              <p className="font-body text-sm text-brand-pacific-dusk/70">
                Schedule a trial lesson to experience our coaching
              </p>
            </Link>
            <Link
              href="/coaches"
              className="block p-6 bg-white border border-black/6 rounded-lg hover:border-black/10 hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">
                Meet Our Coaches
              </h3>
              <p className="font-body text-sm text-brand-pacific-dusk/70">
                Learn about our coaching team and their expertise
              </p>
            </Link>
            <Link
              href="/contact"
              className="block p-6 bg-white border border-black/6 rounded-lg hover:border-black/10 hover:-translate-y-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2"
            >
              <h3 className="font-headline text-xl text-brand-pacific-dusk mb-2">
                Contact Us
              </h3>
              <p className="font-body text-sm text-brand-pacific-dusk/70">
                Send us a message or get directions to our facility
              </p>
            </Link>
          </div>

          <HorizonDivider className="my-16" />

          {/* Chat Widget Info */}
          <div className="mb-16 bg-white border border-black/6 rounded-lg p-8">
            <h2 className="font-headline text-3xl md:text-4xl text-brand-pacific-dusk mb-4">
              About the Chat Assistant
            </h2>
            <p className="font-body text-lg text-brand-pacific-dusk/70 mb-4">
              Our chat widget is a quick assistant that can help answer basic questions and direct you to the right resources. For detailed information about programs, schedules, and pricing, please use the links above or call us directly.
            </p>
            <p className="font-body text-sm text-brand-pacific-dusk/60">
              <strong>Note:</strong> The chat assistant does not use AI reasoning or provide live coach chat. For personalized coaching advice or complex questions, please call us at (949) 534-0457 or visit our facility.
            </p>
          </div>

          {/* FAQ Link */}
          <div className="mb-16">
            <h2 className="font-headline text-3xl md:text-4xl text-brand-pacific-dusk mb-6">
              Frequently Asked Questions
            </h2>
            <p className="font-body text-lg text-brand-pacific-dusk/70 mb-6">
              Browse our FAQ page for answers to common questions about programs, registration, and policies.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
            >
              View FAQ
            </Link>
          </div>

          {/* Contact Info */}
          <div className="bg-brand-sandstone p-8 md:p-12 rounded-lg">
            <h2 className="font-headline text-3xl md:text-4xl text-brand-pacific-dusk mb-6">
              Need Immediate Help?
            </h2>
            <p className="font-body text-lg text-brand-pacific-dusk/70 mb-8">
              Call us directly or visit our facility. We're here to help.
            </p>
            <div className="space-y-4">
              <div>
                <p className="font-sans text-sm font-semibold text-brand-pacific-dusk/60 uppercase tracking-wider mb-2">
                  Phone
                </p>
                <a
                  href="tel:9495340457"
                  className="font-body text-xl text-brand-pacific-dusk hover:text-brand-victoria-cove transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sandstone rounded-sm"
                >
                  (949) 534-0457
                </a>
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-brand-pacific-dusk/60 uppercase tracking-wider mb-2">
                  Email
                </p>
                <a
                  href="mailto:info@lagunabeachtennisacademy.com"
                  className="font-body text-xl text-brand-pacific-dusk hover:text-brand-victoria-cove transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-sandstone rounded-sm"
                >
                  info@lagunabeachtennisacademy.com
                </a>
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-brand-pacific-dusk/60 uppercase tracking-wider mb-2">
                  Location
                </p>
                <p className="font-body text-lg text-brand-pacific-dusk">
                  1098 Balboa Ave<br />
                  Laguna Beach, CA 92651
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
