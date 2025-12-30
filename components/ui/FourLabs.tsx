'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Lab data with real metrics
const labs = [
  {
    id: 'technical',
    title: 'Technical Lab',
    description: 'Biomechanics measured in degrees and milliseconds. Every session filmed. Video-backed adjustments every 30 days.',
    stat: {
      value: '+11 mph',
      label: 'Average serve speed improvement',
      context: '12 months',
      percent: 75
    },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"/>
        <path d="M24 6 L24 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 36 L24 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 24 L12 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M36 24 L42 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="3" fill="currentColor"/>
        <path d="M24 24 L32 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'match',
    title: 'Match Lab',
    description: 'Pattern recognition and decision-making under pressure. Tactical sequences that hold when the score matters. Players who solve problems in real time.',
    stat: {
      value: '+47%',
      label: 'First-serve points won',
      context: '6-month average',
      percent: 87
    },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="6" y="10" width="36" height="28" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="1"/>
        <line x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1"/>
        <circle cx="14" cy="16" r="2.5" fill="currentColor" className="opacity-70"/>
        <circle cx="34" cy="32" r="2.5" fill="currentColor" className="opacity-70"/>
        <path d="M14 16 Q20 20 24 24 Q28 28 34 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round"/>
        <path d="M14 16 L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'strength',
    title: 'Strength & Movement',
    description: 'Sprint speed, power output, vertical jump tracked every 30 days. Programming adjusts with data. Zero season-ending injuries is the standard.',
    stat: {
      value: '20%',
      label: 'Average power gain',
      context: 'Year one',
      percent: 65
    },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M8 36 L16 18 L24 28 L32 10 L40 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="18" r="3" fill="currentColor" className="opacity-70"/>
        <circle cx="32" cy="10" r="3" fill="currentColor"/>
        <path d="M6 40 L42 40" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M32 10 L36 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M32 10 L36 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'mind',
    title: 'Mind & Lifestyle',
    description: 'Mental performance is trained, not discussed. Competition preparation, travel routines. Focus, preparation, recovery—trained like physical skills.',
    stat: {
      value: '8.7/10',
      label: 'Athlete confidence score',
      context: 'Program average',
      percent: 87
    },
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="12" y="8" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M16 16 L32 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 22 L32 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 28 L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="36" r="2" fill="currentColor"/>
        <path d="M18 12 Q24 8 30 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    )
  }
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

interface LabCardProps {
  lab: typeof labs[0]
  index: number
}

function LabCard({ lab, index }: LabCardProps) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="group relative bg-white border border-gray-100 overflow-hidden transition-all duration-700 ease-out hover:-translate-y-3"
      style={{
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}
      whileHover={{
        boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
        borderColor: 'rgba(0,0,0,0.12)'
      }}
    >
      {/* Top accent line - animates on hover */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-[2px] bg-lbta-burnt origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />
      
      <div className="p-12 md:p-16">
        {/* Icon */}
        <motion.div 
          className="w-16 h-16 mb-8 text-lbta-charcoal transition-all duration-500 group-hover:text-lbta-burnt group-hover:scale-110"
        >
          {lab.icon}
        </motion.div>
        
        {/* Title */}
        <h3 className="text-lg font-sans font-semibold tracking-[0.02em] uppercase text-lbta-charcoal mb-5">
          {lab.title}
        </h3>
        
        {/* Description */}
        <p className="text-base leading-[1.7] text-gray-600 mb-12">
          {lab.description}
        </p>
        
        {/* Stat Section */}
        <div className="pt-8 border-t border-gray-100">
          {/* Stat Value */}
          <motion.div 
            className="text-4xl md:text-5xl font-serif font-light text-lbta-burnt mb-2 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
            style={{ fontFeatureSettings: "'tnum' 1" }}
          >
            {lab.stat.value}
          </motion.div>
          
          {/* Stat Label */}
          <div className="text-xs font-sans font-semibold uppercase tracking-[0.08em] text-gray-500 mb-1">
            {lab.stat.label}
          </div>
          
          {/* Stat Context */}
          <div className="text-xs text-gray-400 mb-4">
            {lab.stat.context}
          </div>
          
          {/* Animated Progress Bar */}
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #C87941 0%, #E09962 100%)'
              }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${lab.stat.percent}%` } : { width: 0 }}
              transition={{ 
                duration: 1.4, 
                delay: index * 0.15 + 0.4,
                ease: [0.4, 0, 0.2, 1] 
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function FourLabs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" })
  
  return (
    <section 
      ref={sectionRef}
      className="py-32 md:py-40 lg:py-48"
      style={{ background: '#FAFAF9' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-lbta-charcoal mb-6">
            Built on Four Labs
          </h2>
          <p className="text-lg leading-relaxed text-gray-600 max-w-[700px] mx-auto">
            Every training day pulls from four connected systems. No lab operates in isolation.
          </p>
        </motion.div>
        
        {/* Labs Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {labs.map((lab, index) => (
            <LabCard key={lab.id} lab={lab} index={index} />
          ))}
        </motion.div>
        
        {/* Bottom connector line */}
        <motion.div 
          className="flex items-center justify-center mt-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center gap-4 text-gray-400">
            <div className="w-16 h-px bg-gray-300" />
            <span className="text-xs font-sans tracking-[0.15em] uppercase">
              Connected Systems
            </span>
            <div className="w-16 h-px bg-gray-300" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

