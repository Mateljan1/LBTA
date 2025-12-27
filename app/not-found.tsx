'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Phone, Mail, Calendar, Users } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/community/community-3.webp"
            alt="Tennis court at Laguna Beach"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="font-sans text-[11px] text-white/60 uppercase tracking-[3px] mb-4">
            Page Not Found
          </p>
          <h1 className="font-serif text-[80px] md:text-[120px] font-light text-white mb-4 leading-none">
            404
          </h1>
          <h2 className="font-serif text-[28px] md:text-[36px] font-semibold text-white mb-6">
            Out of Bounds
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] text-white/80 mb-10 leading-relaxed max-w-md mx-auto">
            The page you're looking for seems to have hit the net. 
            Let's get you back on court.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-white text-black font-sans font-semibold text-[14px] py-4 px-8 rounded-full transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5 min-h-[48px]"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-transparent text-white border border-white/30 font-sans font-semibold text-[14px] py-4 px-8 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/50 min-h-[48px]"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 md:py-24 bg-[#FAF8F3]">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="font-serif text-[24px] md:text-[28px] font-semibold text-black text-center mb-12">
            Popular Destinations
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Link 
              href="/schedules" 
              className="group bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="h-8 w-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
              <h4 className="font-sans text-[15px] font-semibold text-black mb-1">Schedules</h4>
              <p className="font-sans text-[13px] text-black/60">View programs & pricing</p>
            </Link>
            
            <Link 
              href="/book" 
              className="group bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="h-8 w-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
              <h4 className="font-sans text-[15px] font-semibold text-black mb-1">Book Trial</h4>
              <p className="font-sans text-[13px] text-black/60">Start your journey</p>
            </Link>
            
            <Link 
              href="/coaches" 
              className="group bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <Users className="h-8 w-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
              <h4 className="font-sans text-[15px] font-semibold text-black mb-1">Coaches</h4>
              <p className="font-sans text-[13px] text-black/60">Meet the team</p>
            </Link>
            
            <Link 
              href="/camps" 
              className="group bg-white p-6 rounded-lg border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <Calendar className="h-8 w-8 text-black/40 group-hover:text-black mb-4 transition-colors" />
              <h4 className="font-sans text-[15px] font-semibold text-black mb-1">Camps</h4>
              <p className="font-sans text-[13px] text-black/60">Summer & holiday</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-white border-t border-black/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-[15px] text-black/60 mb-6">
            Need help finding something specific?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="tel:9494646645" 
              className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="font-sans text-[15px]">(949) 464-6645</span>
            </a>
            <span className="hidden sm:block text-black/20">|</span>
            <a 
              href="mailto:support@lagunabeachtennisacademy.com" 
              className="inline-flex items-center gap-2 text-black hover:text-black/70 transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span className="font-sans text-[15px]">support@lagunabeachtennisacademy.com</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
