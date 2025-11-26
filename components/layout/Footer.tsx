import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const programs = [
  { name: 'Junior Programs', href: '/programs/junior' },
  { name: 'Adult Programs', href: '/programs/adult' },
  { name: 'High Performance', href: '/programs/high-performance' },
  { name: 'Private Lessons', href: '/programs/private' },
]

const about = [
  { name: 'Our Coaches', href: '/coaches' },
  { name: 'Philosophy', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
]

export default function Footer() {
  return (
    <footer className="bg-lbta-charcoal text-white">
      <div className="container-lbta section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
              alt="LBTA"
              className="h-16 w-auto mb-8 opacity-90"
            />
            <p className="text-sm text-white/60 leading-relaxed max-w-md mb-8 font-sans">
              Championship-level tennis training in Laguna Beach.  
              Official City Partner since 2020.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/70">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-sans">1098 Balboa Ave, Laguna Beach, CA 92651</span>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:9494646645" className="text-sm font-sans hover:text-white transition-colors">
                  (949) 464-6645
                </a>
              </div>
              <div className="flex items-center space-x-3 text-white/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:support@lagunabeachtennisacademy.com" className="text-sm font-sans hover:text-white transition-colors">
                  support@lagunabeachtennisacademy.com
                </a>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-sans tracking-wider mb-6 text-white/90">Programs</h4>
            <ul className="space-y-3">
              {programs.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors font-sans"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-sans tracking-wider mb-6 text-white/90">Academy</h4>
            <ul className="space-y-3">
              {about.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors font-sans"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-white/50 font-sans tracking-wide">
              © {new Date().getFullYear()} Laguna Beach Tennis Academy
            </p>
            <div className="flex space-x-6 text-xs text-white/50 font-sans">
              <Link href="/privacy" className="hover:text-white/70 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white/70 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
