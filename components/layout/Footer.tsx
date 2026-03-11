import Link from 'next/link'
import Image from 'next/image'
import NewsletterForm from '@/components/NewsletterForm'

export default function Footer() {
  return (
    <footer className="bg-brand-deep-water text-white">
      <NewsletterForm />

      {/* JOIN OUR COMMUNITY — above main footer block */}
      <div className="container-lbta pt-8 pb-2">
        <h2 className="text-center font-headline text-[clamp(1.5rem,4vw,2rem)] font-light text-white/80 tracking-wide">
          JOIN OUR COMMUNITY
        </h2>
      </div>

      {/* Main Footer */}
      <div className="container-lbta py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm">
              <Image
                src="/logos/LBTAblktext.png"
                alt="Laguna Beach Tennis Academy"
                width={180}
                height={54}
                className="brightness-0 invert opacity-90"
              />
            </Link>

            <p className="text-[15px] font-sans font-light text-white/50 mb-3 max-w-sm leading-relaxed">
              Tennis, as it should be taught.
            </p>
            <p className="text-[13px] font-sans font-light text-white/50 mb-6 max-w-sm leading-relaxed">
              Movement &middot; Craft &middot; Community
            </p>

            <div className="flex gap-4">
              <a
                href="https://instagram.com/lagunabeachtennisacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-brand-victoria-cove/20 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/lagunabeachtennisacademy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-brand-victoria-cove/20 hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-eyebrow text-white/50 mb-5">Programs</h4>
                <ul className="space-y-3">
                  {[
                    { name: 'All Programs', href: '/programs' },
                    { name: 'Camps', href: '/camps' },
                    { name: 'Fitness', href: '/fitness' },
                    { name: 'Leagues & Circuit', href: '/programs/leagues' },
                    { name: 'Schedule & Pricing', href: '/schedules' },
                  ].map((item) => (
                    <li key={item.name}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center min-h-[48px] text-[14px] font-sans font-light text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-eyebrow text-white/50 mb-5">Academy</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '/about' },
                  { name: 'Our Coaches', href: '/coaches' },
                  { name: 'Book a Trial', href: '/book' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Racquet Rescue', href: '/racquet-rescue' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center min-h-[48px] text-[14px] font-sans font-light text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-eyebrow text-white/50 mb-5">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="tel:9495340457"
                      aria-label="Call (949) 534-0457"
                      className="inline-flex items-center min-h-[48px] text-[14px] font-sans font-light text-white/50 hover:text-brand-sunset-cliff transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                    >
                      (949) 534-0457
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@lagunabeachtennisacademy.com"
                      aria-label="Email support at support@lbta.com"
                      className="inline-flex items-center min-h-[48px] text-[14px] font-sans font-light text-white/50 hover:text-brand-sunset-cliff transition-colors duration-300 break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
                    >
                      support@lbta.com
                    </a>
                  </li>
                  <li className="pt-2">
                    <p className="text-[13px] font-sans font-light text-white/50 leading-relaxed">
                      Moulton Meadows Park<br />
                      1098 Balboa Ave<br />
                      Laguna Beach, CA 92651
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="container-lbta py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] font-sans font-light text-white/50">
              &copy; {new Date().getFullYear()} Laguna Beach Tennis Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="inline-flex items-center min-h-[48px] text-[12px] font-sans font-light text-white/50 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center min-h-[48px] text-[12px] font-sans font-light text-white/50 hover:text-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
