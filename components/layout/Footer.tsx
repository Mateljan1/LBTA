'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Philosophy', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Contact', href: '/contact' },
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
    <footer className="bg-[#F8E6BB]">
      {/* Newsletter Section */}
      <div className="border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-serif font-semibold mb-3 text-black">
              Stay Informed
            </h3>
            <p className="text-sm text-black/70 mb-6 font-sans">
              Tennis insights, program updates, and early access to Winter 2026 registration
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded bg-white/80 border border-black/10 text-black placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-lbta-orange transition-all font-sans text-[14px]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-lbta-orange text-white font-sans text-sm font-semibold tracking-wide hover:bg-lbta-red transition-all duration-200 rounded"
              >
                Subscribe
              </button>
            </form>
            
            {status === 'success' && (
              <p className="text-sm text-black/70 mt-3">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logos/LBTAblktext.png"
              alt="Laguna Beach Tennis Academy"
              width={200}
              height={60}
              className="mx-auto"
            />
          </div>
          
          {/* Navigation */}
          <nav className="mb-8">
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8 font-sans text-[14px] uppercase tracking-wide text-black/80">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="hover:text-lbta-orange transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Contact Info */}
          <div className="mb-8 space-y-2">
            <p className="font-sans text-[14px] text-black/70">
              1098 Balboa Ave, Laguna Beach, CA 92651
            </p>
            <p className="font-sans text-[14px] text-black/70">
              <a href="tel:9494646645" className="hover:text-lbta-orange transition-colors">
                (949) 464-6645
              </a>
              {' · '}
              <a href="mailto:support@lagunabeachtennisacademy.com" className="hover:text-lbta-orange transition-colors">
                support@lagunabeachtennisacademy.com
              </a>
            </p>
          </div>
          
          {/* Copyright & Legal */}
          <div className="pt-8 border-t border-black/10">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 text-[12px] text-black/60 font-sans">
              <p>© {new Date().getFullYear()} Laguna Beach Tennis Academy. All rights reserved.</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-black/80 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-black/80 transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
