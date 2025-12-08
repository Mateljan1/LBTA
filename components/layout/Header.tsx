'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

  return (
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
                className="text-sm font-sans text-lbta-charcoal hover:text-lbta-burnt transition-colors duration-300 tracking-wide"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/book"
              className="btn-primary text-xs py-3 px-6"
            >
              BOOK TRIAL
            </Link>
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

      {/* Mobile Menu - Luxury Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-8">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-6 right-6 p-2 text-lbta-charcoal hover:text-lbta-burnt transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="mt-16 space-y-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-lg font-sans text-lbta-charcoal hover:text-lbta-burnt transition-colors tracking-wide"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    href="/book"
                    className="btn-primary w-full mt-8 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    BOOK TRIAL
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
