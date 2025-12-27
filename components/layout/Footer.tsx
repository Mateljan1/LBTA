'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        setStatus('success')
        setEmail('')
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <footer className="bg-lbta-black text-white">
      {/* Newsletter Section - Elevated Design */}
      <div className="border-b border-white/10">
        <div className="container-lbta py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            {/* Decorative element */}
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-auto mb-8" />
            
            <span className="text-eyebrow text-white/60 mb-4 block">
              Stay Connected
            </span>
            <h3 className="font-serif text-[28px] md:text-[36px] font-semibold mb-4 text-white">
              Join the LBTA Community
            </h3>
            <p className="text-body-sm text-white/60 mb-8 max-w-md mx-auto">
              Tennis insights, program updates, and early access to seasonal registration.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={status === 'loading' || status === 'success'}
                  className="
                    flex-1 px-5 py-4 
                    bg-white/5 backdrop-blur-sm
                    border border-white/10 
                    rounded-l-subtle
                    text-white placeholder-white/40 
                    font-sans text-body-sm
                    focus:outline-none focus:border-white/40 focus:bg-white/10
                    transition-all duration-300
                    disabled:opacity-50
                  "
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="
                    px-6 py-4 
                    bg-white text-black 
                    font-sans text-ui font-medium tracking-wide
                    rounded-r-subtle
                    hover:bg-gray-100
                    transition-all duration-300
                    disabled:opacity-70
                    flex items-center gap-2
                  "
                >
                  {status === 'loading' ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : status === 'success' ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Subscribe</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              
              {/* Status Messages */}
              {status === 'success' && (
                <p className="absolute -bottom-8 left-0 right-0 text-sm text-white">
                  Welcome to the community!
                </p>
              )}
              {status === 'error' && (
                <p className="absolute -bottom-8 left-0 right-0 text-sm text-red-400">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer - Asymmetric Layout */}
      <div className="container-lbta py-16 md:py-20">
        <div className="grid md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Column - Larger */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logos/LBTAblktext.png"
                alt="Laguna Beach Tennis Academy"
                width={180}
                height={54}
                className="brightness-0 invert opacity-90"
              />
            </Link>
            
            <p className="text-body-sm text-white/50 mb-6 max-w-sm leading-relaxed">
              Structure creates confidence. Discipline creates results. 
              Training the next generation of players in Laguna Beach since 2018.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/lagunabeachtennisacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com/lagunabeachtennisacademy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* Programs */}
              <div>
                <h4 className="text-eyebrow text-white/40 mb-5">Programs</h4>
                <ul className="space-y-3">
                  {[
                    { name: 'All Programs', href: '/schedules' },
                    { name: 'Camps', href: '/camps' },
                    { name: 'JTT', href: '/jtt' },
                    { name: 'Fitness', href: '/fitness' },
                    { name: 'Private Lessons', href: '/book' },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className="text-body-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-lbta-black rounded-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Academy */}
              <div>
                <h4 className="text-eyebrow text-white/40 mb-5">Academy</h4>
                <ul className="space-y-3">
                  {[
                    { name: 'About Us', href: '/about' },
                    { name: 'Our Coaches', href: '/coaches' },
                    { name: 'Schedules', href: '/schedules' },
                    { name: 'Success Stories', href: '/success-stories' },
                    { name: 'Racquet Rescue', href: '/racquet-rescue' },
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        className="text-body-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-lbta-black rounded-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-eyebrow text-white/40 mb-5">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="tel:9494646645"
                      className="text-body-sm text-white/60 hover:text-lbta-orange transition-colors duration-300"
                    >
                      (949) 464-6645
                    </a>
                  </li>
                  <li>
                    <a 
                      href="mailto:support@lagunabeachtennisacademy.com"
                      className="text-body-sm text-white/60 hover:text-lbta-orange transition-colors duration-300 break-all"
                    >
                      support@lbta.com
                    </a>
                  </li>
                  <li className="pt-2">
                    <p className="text-body-sm text-white/40 leading-relaxed">
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
      <div className="border-t border-white/10">
        <div className="container-lbta py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ui-sm text-white/40">
              © {new Date().getFullYear()} Laguna Beach Tennis Academy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link 
                href="/privacy" 
                className="text-ui-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-ui-sm text-white/40 hover:text-white/60 transition-colors"
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
