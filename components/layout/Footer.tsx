'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'

const programs = [
  { name: 'Junior Programs', href: '/programs/junior' },
  { name: 'Adult Programs', href: '/programs/adult' },
  { name: 'High Performance', href: '/programs/high-performance' },
  { name: 'Match Play Friday', href: '/match-play' },
  { name: 'VYLO Institute', href: '/vylo' },
]

const about = [
  { name: 'Our Story', href: '/about' },
  { name: 'Our Coaches', href: '/coaches' },
  { name: 'Success Stories', href: '/success-stories' },
  { name: 'Pathway Planner', href: '/pathway-planner' },
  { name: 'Schedules', href: '/schedules' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
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
