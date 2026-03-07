'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const programsDropdown = [
  {
    name: 'All Programs',
    href: '/programs',
    desc: 'Ages 3–17 and adults, pathway to college',
  },
  {
    name: 'Camps',
    href: '/camps',
    desc: 'Seasonal camps, swim & tennis, holiday breaks',
  },
  {
    name: 'Fitness',
    href: '/fitness',
    desc: 'Cardio Tennis, LiveBall, weekly community sessions',
  },
  {
    name: 'Leagues & Circuit',
    href: '/programs/leagues',
    desc: 'USTA Adult League, UTR Match Play Series',
  },
]

const navigation = [
  { name: 'Schedule', href: '/schedules' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap: focus first focusable inside the menu panel after paint
      requestAnimationFrame(() => {
        const panel = mobileMenuRef.current
        if (!panel) return
        const focusable = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        if (first) first.focus()
      })
    } else {
      document.body.style.overflow = ''
      // Return focus to menu button when closing
      if (mobileMenuButtonRef.current) {
        mobileMenuButtonRef.current.focus({ preventScroll: true })
      }
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Focus trap: keep Tab/Shift+Tab within mobile menu panel
  useEffect(() => {
    if (!mobileMenuOpen || !mobileMenuRef.current) return
    const panel = mobileMenuRef.current
    const getFocusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      )
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusables = getFocusables()
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const programsPanelRef = useRef<HTMLDivElement>(null)

  const openDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setProgramsOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    timeoutRef.current = setTimeout(() => setProgramsOpen(false), 150)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProgramsOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // When Programs dropdown opens, focus first menuitem for keyboard users
  useEffect(() => {
    if (!programsOpen) return
    const id = requestAnimationFrame(() => {
      const first = programsPanelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')
      first?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [programsOpen])

  // Arrow key navigation in Programs dropdown
  const handleProgramsPanelKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!programsOpen) return
    const panel = programsPanelRef.current
    if (!panel) return
    const items = Array.from(
      panel.querySelectorAll<HTMLElement>('[role="menuitem"], a[href="/schedules"]')
    )
    if (items.length === 0) return
    const current = document.activeElement as HTMLElement | null
    const idx = current ? items.indexOf(current) : -1
    if (e.key === 'ArrowDown' && idx < items.length - 1) {
      e.preventDefault()
      items[idx + 1].focus()
    } else if (e.key === 'ArrowUp' && idx > 0) {
      e.preventDefault()
      items[idx - 1].focus()
    } else if (e.key === 'ArrowUp' && idx === 0) {
      e.preventDefault()
      dropdownRef.current?.querySelector('button')?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0].focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1].focus()
    }
  }, [programsOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-morning-light/98 backdrop-blur-xl shadow-lg shadow-brand-pacific-dusk/5 py-3 md:py-3'
            : 'bg-brand-morning-light/90 backdrop-blur-md py-4 md:py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex-shrink-0">
              <Image
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/55664e8d1_LagunaBeachTennisAcademy_FC-STACKED.png"
                alt="Laguna Beach Tennis Academy"
                width={120}
                height={56}
                className="h-10 md:h-12 w-auto group-hover:opacity-80 transition-opacity duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Programs dropdown trigger */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-sans font-medium text-brand-pacific-dusk hover:text-brand-sunset-cliff transition-colors duration-300 tracking-wide whitespace-nowrap"
                  aria-expanded={programsOpen}
                  aria-controls="programs-panel"
                  onClick={() => setProgramsOpen(!programsOpen)}
                >
                  Programs
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${programsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Mega-panel */}
                {programsOpen && (
                  <div
                    ref={programsPanelRef}
                    id="programs-panel"
                    role="menu"
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] bg-white rounded-lg shadow-elevated border border-brand-pacific-dusk/5 overflow-hidden"
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                    onKeyDown={handleProgramsPanelKeyDown}
                    style={{ animation: 'fadeInDown 0.2s ease-out forwards' }}
                  >
                    <div className="p-2">
                      <p className="px-4 pt-3 pb-2 text-eyebrow text-brand-victoria-cove">
                        Explore Programs
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {programsDropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            role="menuitem"
                            className="group/item flex flex-col gap-1 px-4 py-3 rounded-md hover:bg-brand-sandstone transition-colors duration-200"
                            onClick={() => setProgramsOpen(false)}
                          >
                            <span className="text-[14px] font-sans font-medium text-brand-pacific-dusk group-hover/item:text-brand-sunset-cliff transition-colors">
                              {item.name}
                            </span>
                            <span className="text-[12px] font-sans font-light text-brand-pacific-dusk/60 leading-snug">
                              {item.desc}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="horizon-line-thin mx-4 mt-2" />
                      <Link
                        href="/schedules"
                        className="flex items-center gap-2 mx-4 my-3 text-[12px] font-sans font-medium text-brand-victoria-cove hover:text-brand-sunset-cliff tracking-wide uppercase transition-colors"
                        onClick={() => setProgramsOpen(false)}
                      >
                        View Full Schedule & Pricing
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-[13px] font-sans font-medium text-brand-pacific-dusk hover:text-brand-sunset-cliff transition-colors duration-300 tracking-wide whitespace-nowrap relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-brand-sunset-cliff scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}

              <Link
                href="/book"
                className="ml-4 btn-primary text-[11px] px-6 py-2.5 whitespace-nowrap shadow-sm hover:shadow-md"
              >
                Book Trial
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex lg:hidden items-center gap-3">
              <a
                href="tel:9494646645"
                className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center text-brand-pacific-dusk hover:text-brand-sunset-cliff transition-colors"
                aria-label="Call us"
              >
                <Phone className="h-5 w-5" />
              </a>
              <button
                ref={mobileMenuButtonRef}
                type="button"
                className="p-3 text-brand-pacific-dusk bg-brand-sandstone/60 hover:bg-brand-sandstone rounded-lg transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-brand-deep-water/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={mobileMenuRef}
            className="absolute right-0 top-0 bottom-0 w-[320px] max-w-[88vw] bg-brand-morning-light shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            style={{ animation: 'slideInRight 0.3s ease-out forwards' }}
          >
            <div className="p-6 pt-20">
              <button
                type="button"
                className="absolute top-4 right-4 p-3 text-brand-pacific-dusk hover:text-brand-sunset-cliff transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full hover:bg-brand-sandstone"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Programs — card-style block */}
              <div className="mb-6">
                <p className="text-eyebrow text-brand-victoria-cove mb-3">Programs</p>
                <div className="grid grid-cols-2 gap-2">
                  {programsDropdown.map((item, i) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex flex-col gap-1 p-4 bg-white rounded-lg border border-brand-pacific-dusk/5 hover:border-brand-sunset-cliff/20 hover:shadow-soft transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        animation: `fadeInUp 0.25s ease-out ${i * 0.05}s forwards`,
                        opacity: 0,
                      }}
                    >
                      <span className="text-[14px] font-sans font-medium text-brand-pacific-dusk">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-sans font-light text-brand-pacific-dusk/50 leading-snug">
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="horizon-line-thin mb-4" />

              {/* Standard nav links */}
              <nav className="space-y-0.5">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-[16px] font-sans font-medium text-brand-pacific-dusk hover:text-brand-sunset-cliff py-3.5 border-b border-brand-pacific-dusk/5 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      animation: `fadeInUp 0.25s ease-out ${(index + 4) * 0.05}s forwards`,
                      opacity: 0,
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              <Link
                href="/book"
                className="block w-full mt-8 text-center btn-primary py-4 text-[12px] min-h-[48px]"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'fadeInUp 0.25s ease-out 0.45s forwards',
                  opacity: 0,
                }}
              >
                Book Your Trial
              </Link>

              {/* Contact info */}
              <div className="mt-8 pt-6 border-t border-brand-pacific-dusk/5 space-y-3">
                <a
                  href="tel:9494646645"
                  className="flex items-center gap-3 text-[15px] text-brand-pacific-dusk hover:text-brand-sunset-cliff py-2 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  (949) 464-6645
                </a>
                <a
                  href="mailto:support@lagunabeachtennisacademy.com"
                  className="block text-[13px] text-brand-pacific-dusk/50 hover:text-brand-victoria-cove py-2 transition-colors break-all"
                >
                  support@lagunabeachtennisacademy.com
                </a>

                <div className="mt-6 pt-4 border-t border-brand-pacific-dusk/5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-sandstone to-brand-sunset-cliff/20 border-2 border-white"
                        />
                      ))}
                    </div>
                    <p className="text-[12px] text-brand-pacific-dusk/50">
                      <span className="font-medium text-brand-pacific-dusk">500+</span> players trained
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
