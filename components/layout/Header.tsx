'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'

const navigation = [
  { name: 'Programs', href: '/programs' },
  { name: 'Camps', href: '/camps' },
  { name: 'JTT', href: '/jtt' },
  { name: 'Fitness', href: '/fitness' },
  { name: 'Schedules', href: '/schedules' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled 
            ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5 py-3 md:py-4' 
            : 'bg-white/90 backdrop-blur-md py-4 md:py-6'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex-shrink-0">
              <Image 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
                alt="Laguna Beach Tennis Academy"
                width={120}
                height={56}
                className="h-10 md:h-12 w-auto group-hover:opacity-80 transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation - CSS-controlled with Tailwind (lg: = 1024px) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-[13px] font-sans font-medium text-[#1a1a1a] hover:text-lbta-orange transition-colors duration-300 tracking-wide whitespace-nowrap relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-lbta-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
              <Link
                href="/book"
                className="ml-4 bg-lbta-red text-white px-6 py-2.5 rounded-full text-[12px] font-semibold hover:bg-lbta-orange transition-all duration-300 uppercase tracking-[1.5px] whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Book Trial
              </Link>
            </div>

            {/* Mobile Menu Button - CSS-controlled (shows below lg: 1024px) */}
            <div className="flex lg:hidden items-center gap-3">
              <a 
                href="tel:9494646645" 
                className="p-2.5 text-[#134252] hover:text-lbta-orange transition-colors"
                aria-label="Call us"
              >
                <Phone className="h-5 w-5" />
              </a>
              <button
                type="button"
                className="p-3 text-[#134252] bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Enhanced with animations */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90]">
          {/* Backdrop with fade animation */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel with slide animation */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto animate-slide-in-right"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{
              animation: 'slideInRight 0.3s ease-out forwards'
            }}
          >
            <div className="p-6 pt-20">
              {/* Close button inside panel */}
              <button
                type="button"
                className="absolute top-4 right-4 p-3 text-[#134252] hover:text-lbta-orange transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              
              <nav className="space-y-1">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-[17px] font-sans font-medium text-[#1a1a1a] hover:text-lbta-orange py-4 border-b border-gray-100 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      animation: `fadeInUp 0.3s ease-out ${index * 0.05}s forwards`,
                      opacity: 0
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <Link
                href="/book"
                className="block w-full mt-8 text-center bg-lbta-red text-white px-8 py-4 rounded-full font-semibold hover:bg-lbta-orange transition-all uppercase tracking-[1.5px] text-[13px] min-h-[48px] shadow-md"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'fadeInUp 0.3s ease-out 0.4s forwards',
                  opacity: 0
                }}
              >
                Book Your Trial
              </Link>
              
              {/* Contact info in mobile menu */}
              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <a 
                  href="tel:9494646645" 
                  className="flex items-center gap-3 text-[15px] text-[#1a1a1a] hover:text-lbta-orange py-2 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (949) 464-6645
                </a>
                <a 
                  href="mailto:support@lagunabeachtennisacademy.com" 
                  className="block text-[14px] text-[#666] hover:text-lbta-orange py-2 transition-colors break-all"
                >
                  support@lagunabeachtennisacademy.com
                </a>
                
                {/* Social proof in menu */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-lbta-beige to-lbta-orange/20 border-2 border-white" />
                      ))}
                    </div>
                    <p className="text-[12px] text-[#666]">
                      <span className="font-semibold text-[#1a1a1a]">500+</span> players trained
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
