'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Programs', href: '/programs' },
  { name: 'Camps', href: '/camps' },
  { name: 'Fitness', href: '/fitness' },
  { name: 'Schedules', href: '/schedules' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Racquet Rescue', href: '/racquet-rescue' },
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
    return () => window.removeEventListener('scroll', handleScroll)
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
            ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5 py-4 lg:py-5' 
            : 'bg-white/90 backdrop-blur-md py-4 lg:py-8'
        }`}
      >
        <nav className="container-lbta">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex-shrink-0">
              <Image 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
                alt="Laguna Beach Tennis Academy"
                width={120}
                height={56}
                className="h-10 lg:h-14 w-auto group-hover:opacity-80 transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation - Only show on lg (1024px) and up */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-body text-[#134252] hover:text-[#E76F51] transition-colors duration-300 tracking-wide whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="bg-[#E76F51] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#d86247] transition-all uppercase tracking-wide whitespace-nowrap"
              >
                BOOK TRIAL
              </Link>
            </div>

            {/* Mobile Menu Button - Show on screens smaller than lg */}
            <button
              type="button"
              className="lg:hidden p-3 text-[#134252] bg-white rounded-lg z-[100] relative min-w-[48px] min-h-[48px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Enhanced - Show on screens smaller than lg */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="p-6 pt-20">
              {/* Close button inside panel */}
              <button
                type="button"
                className="absolute top-4 right-4 p-3 text-[#134252] hover:text-[#E76F51] transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-body text-[#134252] hover:text-[#E76F51] py-4 border-b border-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <Link
                href="/book"
                className="block w-full mt-8 text-center bg-[#E76F51] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#d86247] uppercase tracking-wide text-sm min-h-[48px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                BOOK TRIAL
              </Link>
              
              {/* Contact info in mobile menu */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <a 
                  href="tel:9494646645" 
                  className="block text-sm text-[#134252] hover:text-[#E76F51] py-2 transition-colors"
                >
                  (949) 464-6645
                </a>
                <a 
                  href="mailto:support@lagunabeachtennisacademy.com" 
                  className="block text-sm text-[#134252] hover:text-[#E76F51] py-2 transition-colors break-all"
                >
                  support@lagunabeachtennisacademy.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
