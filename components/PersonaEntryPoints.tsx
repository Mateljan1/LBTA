'use client'

import Link from 'next/link'
import { Users, User, Trophy } from 'lucide-react'

const personas = [
  {
    icon: Users,
    title: "I'm a parent",
    subtitle: "Looking for junior lessons",
    href: "/programs/junior",
    color: "bg-blue-50 hover:bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    icon: User,
    title: "I'm an adult",
    subtitle: "Starting or improving my game",
    href: "/programs/adult",
    color: "bg-green-50 hover:bg-green-100",
    iconColor: "text-green-600"
  },
  {
    icon: Trophy,
    title: "I'm competitive",
    subtitle: "Looking for high-performance training",
    href: "/programs/high-performance",
    color: "bg-orange-50 hover:bg-orange-100",
    iconColor: "text-orange-600"
  }
]

export default function PersonaEntryPoints() {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-center font-sans text-[13px] text-black/50 uppercase tracking-[2px] mb-6">
          Find Your Path
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <Link
              key={persona.title}
              href={persona.href}
              className={`
                group flex items-center gap-4 p-5 rounded-xl
                ${persona.color}
                transition-all duration-300
                hover:shadow-md hover:-translate-y-0.5
              `}
            >
              <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                <persona.icon className={`w-6 h-6 ${persona.iconColor}`} />
              </div>
              <div>
                <p className="font-sans text-[15px] font-semibold text-black">
                  {persona.title}
                </p>
                <p className="font-sans text-[13px] text-black/60">
                  {persona.subtitle}
                </p>
              </div>
              <svg 
                className="w-5 h-5 text-black/30 ml-auto group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

