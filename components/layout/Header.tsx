'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navigation = [
  { name: 'Programs', href: '/programs' },
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container-lbta py-6 md:py-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
              alt="Laguna Beach Tennis Academy"
              className="h-12 md:h-14 w-auto group-hover:opacity-80 transition-opacity duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-sans text-lbta-charcoal hover:text-lbta-burnt transition-colors duration-300 tracking-wide"
              >
                {item.name}
              </Link>
            ))}
            <a 
              href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=nav&utm_campaign=nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xs py-3 px-6"
            >
              BOOK TRIAL
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-lbta-charcoal"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container-lbta py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-sans text-lbta-charcoal hover:text-lbta-burnt transition-colors tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://book.lagunabeachtennisacademy.com?utm_source=website&utm_medium=mobile_nav&utm_campaign=nextjs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full mt-4 text-center text-xs"
                onClick={() => setMobileMenuOpen(false)}
              >
                BOOK TRIAL
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
