'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

const navigation = [
  { name: 'Junior Programs', href: '/programs/junior' },
  { name: 'Adult Programs', href: '/programs/adult' },
  { name: 'High Performance', href: '/programs/high-performance' },
  { name: 'Our Coaches', href: '/coaches' },
  { name: 'Schedules', href: '/schedules' },
  { name: 'Pricing', href: '/pricing' },
]

const connect = [
  { name: 'About LBTA', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Fit4Tennis', href: 'https://fit4tennis.com', external: true },
  { name: 'Racket Rescue', href: 'https://racketrescue.com', external: true },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-lbta-charcoal text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-lbta py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-light mb-3 text-white">
              Stay Informed
            </h3>
            <p className="text-sm text-white/60 mb-6 font-sans">
              Tennis tips, program updates, and early access to Winter 2026 registration
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500 rounded-sm"
              >
                SUBSCRIBE
              </button>
            </form>
            
            {status === 'success' && (
              <p className="text-sm text-white/80 mt-3">Thank you for subscribing!</p>
            )}
            
            <p className="text-xs text-white/40 mt-3 font-sans">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="container-lbta section-spacing">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div>
            <div className="mb-8">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
                alt="LBTA"
                className="h-14 w-auto mb-3 opacity-90"
              />
              <div className="text-xs font-sans text-white/50 tracking-widest uppercase">
                Championship Training • Laguna Beach
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-md mb-8 font-sans">
              Championship-level tennis training in Laguna Beach.  
              Official City Partner since 2020.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-4 mb-8">
              <a 
                href="https://instagram.com/lagunabeachtennisacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://facebook.com/lagunabeachtennisacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://instagram.com/fit4tennis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Fit4Tennis Instagram"
                title="Fit4Tennis - 100K+ Followers"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>

            {/* Mobile App */}
            <div className="mb-8">
              <p className="text-sm text-white/60 mb-4 font-sans">
                Book sessions on the go
              </p>
              <div className="flex gap-3">
                <a 
                  href="https://apps.apple.com/us/app/lbta/id6746348933" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white rounded-sm border border-white/20 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="text-sm font-sans">App Store</span>
                  </div>
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.playbypoint.appx&pli=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3 px-6 py-3 bg-white/10 text-white rounded-sm border border-white/20 hover:bg-white/20 transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <span className="text-sm font-sans">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
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

          {/* Programs & Academy */}
          <div>
            <h4 className="text-sm font-sans tracking-wider mb-6 text-white/90">Explore</h4>
            <ul className="space-y-3">
              {navigation.map((item) => (
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

          {/* Connect */}
          <div>
            <h4 className="text-sm font-sans tracking-wider mb-6 text-white/90">Connect</h4>
            <ul className="space-y-3">
              {connect.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors font-sans"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm text-white/60 hover:text-white transition-colors font-sans"
                    >
                      {item.name}
                    </Link>
                  )}
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
