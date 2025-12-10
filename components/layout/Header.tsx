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
            ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-black/5 py-4 md:py-5' 
            : 'bg-white/90 backdrop-blur-md py-6 md:py-8'
        }`}
      >
        <nav className="container-lbta">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <Image 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
                alt="Laguna Beach Tennis Academy"
                width={120}
                height={56}
                className="h-12 md:h-14 w-auto group-hover:opacity-80 transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-body text-[#134252] hover:text-[#E76F51] transition-colors duration-300 tracking-wide"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/book"
                className="bg-[#E76F51] text-white px-6 py-3 rounded-full text-xs font-semibold hover:bg-[#d86247] transition-all uppercase tracking-wide"
              >
                BOOK TRIAL
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-3 text-[#134252] bg-white rounded z-[100] relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Simplified */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl overflow-y-auto">
            <div className="p-8 pt-24">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-xl font-body text-[#134252] hover:text-[#E76F51] py-4 border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                href="/book"
                className="block w-full mt-8 text-center bg-[#E76F51] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#d86247] uppercase tracking-wide text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                BOOK TRIAL
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
