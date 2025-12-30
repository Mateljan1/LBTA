'use client'

import './vylo.css'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useInView, useScroll } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useVYLOAnimations } from './useVYLOAnimations'

// Add font - Neue Haas Grotesk from Adobe Fonts
if (typeof document !== 'undefined') {
  const neueHaasLink = document.createElement('link')
  neueHaasLink.href = 'https://use.typekit.net/ayc1ohg.css'
  neueHaasLink.rel = 'stylesheet'
  document.head.appendChild(neueHaasLink)
}

// Animated Counter Component
function AnimatedCounter({ value, prefix = '', suffix = '', delay = 0 }: { value: number, prefix?: string, suffix?: string, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const startTime = Date.now() + delay * 1000
    const isDecimal = value % 1 !== 0

    const animate = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 4)
      const current = eased * value

      setDisplayValue(isDecimal ? Math.round(current * 10) / 10 : Math.round(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, delay])

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}

// Lab Card with 3D Tilt Effect
interface LabCardProps {
  lab: {
    title: string
    desc: string
    statValue: number
    statPrefix: string
    statSuffix: string
    statLabel: string
    statContext: string
    percent: number
    gradient: string
  }
  index: number
}

function LabCard({ lab, index }: LabCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-80px' })

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-100, 100], [8, -8])
  const rotateY = useTransform(x, [-100, 100], [-8, 8])

  const springConfig = { stiffness: 300, damping: 30 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const icons: { [key: string]: JSX.Element } = {
    'Technical Lab': (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <motion.circle
          cx="24" cy="24" r="18"
          stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx="24" cy="24" r="10"
          stroke="currentColor" strokeWidth="1" strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: index * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M24 6 L24 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
        />
        <motion.path
          d="M24 36 L24 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.7 }}
        />
        <motion.path
          d="M6 24 L12 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.8 }}
        />
        <motion.path
          d="M36 24 L42 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.9 }}
        />
        <motion.circle
          cx="24" cy="24" r="3" fill="currentColor"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 1, type: 'spring', stiffness: 200 }}
        />
        <motion.path
          d="M24 24 L32 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 1.1 }}
        />
      </svg>
    ),
    'Match Lab': (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <motion.rect
          x="6" y="10" width="36" height="28" rx="1"
          stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.line
          x1="24" y1="10" x2="24" y2="38" stroke="currentColor" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
        />
        <motion.line
          x1="6" y1="24" x2="42" y2="24" stroke="currentColor" strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
        />
        <motion.circle
          cx="14" cy="16" r="2.5" fill="currentColor" className="opacity-70"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.7, type: 'spring' }}
        />
        <motion.circle
          cx="34" cy="32" r="2.5" fill="currentColor" className="opacity-70"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.8, type: 'spring' }}
        />
        <motion.path
          d="M14 16 Q20 20 24 24 Q28 28 34 32"
          stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1, delay: index * 0.15 + 0.9 }}
        />
      </svg>
    ),
    'Strength & Movement': (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <motion.path
          d="M8 36 L16 18 L24 28 L32 10 L40 22"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.circle
          cx="16" cy="18" r="3" fill="currentColor" className="opacity-70"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.5, type: 'spring' }}
        />
        <motion.circle
          cx="32" cy="10" r="3" fill="currentColor"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.7, type: 'spring' }}
        />
        <motion.path
          d="M6 40 L42 40" stroke="currentColor" strokeWidth="1" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: index * 0.15 + 0.9 }}
        />
        <motion.path
          d="M32 10 L36 6 M32 10 L36 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.5, delay: index * 0.15 + 1.1 }}
        />
      </svg>
    ),
    'Mind & Lifestyle': (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <motion.rect
          x="12" y="8" width="24" height="32" rx="2"
          stroke="currentColor" strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.path
          d="M16 16 L32 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.5 }}
        />
        <motion.path
          d="M16 22 L32 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
        />
        <motion.path
          d="M16 28 L28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.7 }}
        />
        <motion.circle
          cx="24" cy="36" r="2" fill="currentColor"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15 + 0.9, type: 'spring' }}
        />
        <motion.path
          d="M18 12 Q24 8 30 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 1 }}
        />
      </svg>
    ),
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-white overflow-hidden cursor-pointer"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${lab.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div
        className="relative h-full"
        style={{
          border: '1px solid rgba(0, 0, 0, 0.06)',
          padding: '56px 44px',
          transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px] origin-left"
          style={{ background: 'linear-gradient(90deg, #F26522, #FF8C4D)' }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          className="w-14 h-14 mb-7 text-[#111111] group-hover:text-[#F26522] transition-colors duration-500"
          style={{ transform: 'translateZ(30px)' }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {icons[lab.title]}
        </motion.div>

        <h4
          className="uppercase mb-4"
          style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            color: '#111111',
            transform: 'translateZ(20px)',
          }}
        >
          {lab.title}
        </h4>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.8,
            color: 'rgba(0, 0, 0, 0.7)',
            marginBottom: '40px',
            fontWeight: 400,
            transform: 'translateZ(10px)',
          }}
        >
          {lab.desc}
        </p>

        <div className="pt-7 border-t border-black/6" style={{ transform: 'translateZ(15px)' }}>
          <div
            style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: '44px',
              fontWeight: 500,
              color: '#111111',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
              fontFeatureSettings: "'tnum' 1",
            }}
          >
            <AnimatedCounter
              value={lab.statValue}
              prefix={lab.statPrefix}
              suffix={lab.statSuffix}
              delay={index * 0.15 + 0.5}
            />
          </div>
          <div
            className="uppercase mb-1"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {lab.statLabel}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.35)', marginBottom: '14px', fontWeight: 400 }}>
            {lab.statContext}
          </div>

          <div className="relative h-1.5 bg-black/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${lab.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: index * 0.15 + 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #F26522 0%, #FF8C4D 100%)',
                boxShadow: '0 0 12px rgba(242, 101, 34, 0.4)',
              }}
            />
          </div>
        </div>

        <div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl"
          style={{ background: '#F26522' }}
        />
      </div>
    </motion.div>
  )
}

// Rhythm Card Component for Daily Schedule
interface RhythmCardProps {
  block: {
    time: string
    hours: number
    title: string
    details: string[]
    color: string
    icon: JSX.Element
  }
  index: number
}

function RhythmCard({ block, index }: RhythmCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  const circumference = 2 * Math.PI * 42
  const progressPercent = block.hours > 0 ? (block.hours / 4) * 100 : 25
  const strokeDashoffset = circumference - (circumference * progressPercent) / 100

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative p-8 md:p-10 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          boxShadow: isHovered
            ? `0 25px 50px -12px ${block.color}20, 0 0 0 1px ${block.color}20`
            : '0 8px 32px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="2"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="42"
              stroke={block.color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset: strokeDashoffset } : { strokeDashoffset: circumference }}
              transition={{ duration: 1.5, delay: index * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {[0, 90, 180, 270].map((angle, i) => (
              <motion.line
                key={i}
                x1="48"
                y1="8"
                x2="48"
                y2="14"
                stroke="rgba(0,0,0,0.15)"
                strokeWidth="1"
                transform={`rotate(${angle} 48 48)`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: index * 0.15 + 0.5 + i * 0.1 }}
              />
            ))}
          </svg>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 + 0.6, type: 'spring', stiffness: 150 }}
          >
            {block.hours > 0 ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: 600, color: block.color, lineHeight: 1 }}>
                  {block.hours}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  hours
                </span>
              </>
            ) : (
              <div style={{ color: block.color }}>
                {block.icon}
              </div>
            )}
          </motion.div>
        </div>

        <div className="text-center mb-6">
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#111111',
              letterSpacing: '0.02em',
            }}
          >
            {block.time}
          </span>
        </div>

        <h4
          className="text-center uppercase mb-6"
          style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.12em',
            color: block.color,
          }}
        >
          {block.title}
        </h4>

        <div className="space-y-3">
          {block.details.map((detail, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 + 0.8 + i * 0.1 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                style={{ background: block.color }}
                whileHover={{ scale: 1.5 }}
              />
              <span style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(0, 0, 0, 0.7)', fontWeight: 400 }}>
                {detail}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-1"
          style={{ background: `linear-gradient(90deg, ${block.color}, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </motion.div>
  )
}

// Milestone Card Component for Long Arc Journey
interface MilestoneCardProps {
  milestone: {
    year: number | string
    phase: string
    timeframe: string
    desc: string
    position: { left: string, top: string }
    mobileOrder: number
  }
  index: number
}

function MilestoneCard({ milestone, index }: MilestoneCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute md:max-w-[260px] md:block hidden"
      style={{
        left: milestone.position.left,
        top: milestone.position.top,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative p-6 rounded-xl"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: isHovered
            ? '0 20px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            : '0 8px 24px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)',
          transition: 'box-shadow 0.4s ease, background 0.4s ease',
        }}
      >
        <motion.div
          style={{
            fontFamily: '"neue-haas-grotesk-display", sans-serif',
            fontSize: '36px',
            fontWeight: 500,
            color: '#111111',
            letterSpacing: '-0.02em',
            marginBottom: '4px',
          }}
        >
          {milestone.year}
        </motion.div>

        <h3
          style={{
            fontFamily: '"neue-haas-grotesk-display", sans-serif',
            fontSize: '18px',
            fontWeight: 500,
            color: '#111111',
            marginBottom: '6px',
          }}
        >
          {milestone.phase}
        </h3>

        <div
          className="inline-block mb-4"
          style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(0, 0, 0, 0.4)',
            background: 'rgba(0, 0, 0, 0.03)',
            padding: '4px 10px',
            borderRadius: '100px',
          }}
        >
          {milestone.timeframe}
        </div>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(0, 0, 0, 0.65)',
            fontWeight: 400,
          }}
        >
          {milestone.desc}
        </p>

        <motion.div
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: '#111111',
            left: '-24px',
            top: '24px',
            boxShadow: isHovered ? '0 0 16px rgba(0, 0, 0, 0.2)' : '0 0 8px rgba(0, 0, 0, 0.15)',
            transition: 'box-shadow 0.3s ease',
          }}
          animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
          transition={{ delay: 0.7 + index * 0.2, duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  )
}

// Simple counter for totals
function AnimatedCounterSimple({ target, duration = 2, delay = 0 }: { target: number, duration?: number, delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const durationMs = duration * 1000
    const startTime = Date.now() + delay * 1000

    const animate = () => {
      const now = Date.now()
      if (now < startTime) {
        requestAnimationFrame(animate)
        return
      }

      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 4)

      setDisplayValue(Math.round(eased * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration, delay])

  return (
    <span ref={ref} style={{ fontSize: '32px', fontWeight: 600, color: '#111111', letterSpacing: '-0.02em' }}>
      {displayValue}
    </span>
  )
}

const facilityImages = [
  { src: '/photos/LBCOURTSETTING.webp', caption: 'The Environment — Laguna Beach', alt: 'Court setting and environment' },
  { src: '/photos/VideoAnalysisRoom.webp', caption: 'Video Analysis Room — Tactical Review', alt: 'Video analysis and tactical review room' },
  { src: '/photos/IMG_3777 (1).JPG', caption: '7:32 AM — South Court 1', alt: 'Tennis court close-up training session' },
  { src: '/photos/GymSetting.webp', caption: 'Strength Lab — Performance Training', alt: 'Gym and fitness facility' },
  { src: '/photos/playerhousing.webp', caption: 'Athlete Housing — Ocean View Study', alt: 'Player housing with ocean view study area' },
]

export default function VYLOPage() {
  const [scrollHintVisible, setScrollHintVisible] = useState(true)
  const [heroTextVisible, setHeroTextVisible] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [navbarScrolled, setNavbarScrolled] = useState(false)

  const { scrollY } = useScroll()
  const heroScale = useTransform(scrollY, [0, 1000], [1, 1.15])

  useEffect(() => {
    const scrollTimer = setTimeout(() => setScrollHintVisible(false), 8000)
    const heroTimer = setTimeout(() => setHeroTextVisible(true), 4000)

    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const heroHeight = window.innerHeight // Hero is 100vh

      // Hide scroll hint
      if (currentScrollY > 100) setScrollHintVisible(false)

      // Only show navbar when scrolled past hero (section 2)
      setNavbarScrolled(currentScrollY > heroHeight - 100)

      // Smart navbar: hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > heroHeight) {
        // Scrolling down in section 2+
        setNavbarVisible(false)
      } else {
        // Scrolling up
        setNavbarVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(scrollTimer)
      clearTimeout(heroTimer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % facilityImages.length)
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + facilityImages.length) % facilityImages.length)

  useVYLOAnimations()

  return (
    <div className="vylo-page">
      {/* NO HEADER - Pure Aman aesthetic: complete immersion */}

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen bg-[#0A0A0A]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          <div className="lg:col-span-5 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-32 lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Logo - Aman-refined: understated */}
              <div style={{ marginBottom: '56px' }}>
                <Image
                  src="/logos/VYLO Icon_Word_Logo_Classic_Org_Wht.png"
                  alt="VYLO Performance Institute"
                  width={160}
                  height={53}
                  style={{ width: 'auto', height: 'auto', maxHeight: '40px' }}
                  priority
                />
              </div>

              <div style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#666666',
                marginBottom: '32px',
              }}>
                LAGUNA BEACH, CA
              </div>

              <h1
                style={{
                  fontFamily: '"neue-haas-grotesk-display", sans-serif',
                  fontSize: 'clamp(36px, 4.5vw, 58px)',
                  fontWeight: 500,
                  lineHeight: 1.15,
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  letterSpacing: '-0.015em',
                  textTransform: 'uppercase',
                }}
              >
                TEN ATHLETES.
                <br />
                DOCUMENTED PROGRESSION.
              </h1>

              <p
                style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: 'clamp(14px, 1.4vw, 15px)',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.6)',
                  maxWidth: '420px',
                  lineHeight: 1.8,
                  letterSpacing: '0.005em',
                  marginBottom: '48px',
                }}
              >
                30+ Division I placements. ATP/WTA coaching experience. A full-time system for ten athletes.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <Link
                  href="/book"
                  className="group inline-flex items-center gap-3 px-10 py-4 hover:bg-white/5 transition-all duration-700"
                  style={{
                    fontFamily: '"neue-haas-grotesk-text", sans-serif',
                    fontSize: '10px',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  APPLY NOW
                  <motion.span
                    className="text-white/50 group-hover:text-white/90"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </Link>
                <p style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.35)',
                  marginTop: '20px',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}>
                  Applications open — Founding Cohort January 2026
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 relative min-h-[60vh] lg:min-h-screen">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/photos/KarueFH2.webp"
                alt="Elite tennis training at VYLO Laguna Beach"
                className="w-full h-full object-cover"
                style={{
                  filter: 'saturate(0.9) contrast(1.05)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0A0A0A]/20 lg:to-[#0A0A0A]/60" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {scrollHintVisible && (
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* PREMISE SECTION */}
      <section style={{ padding: '120px 0', background: '#FFFFFF' }}>
        <div className="max-w-[1200px] mx-auto px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <p style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: 'clamp(36px, 4vw, 40px)',
              fontWeight: 500,
              lineHeight: 1.4,
              color: '#111111',
              textAlign: 'center',
              letterSpacing: '-0.01em',
            }}>
              Most programs promise development. We document it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section style={{ padding: '120px 0', background: '#111111' }}>
        <div className="max-w-[1200px] mx-auto px-8 md:px-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '80px' }}
          >
            <div style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '24px',
            }}>
              Philosophy
            </div>
            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '22px',
              lineHeight: 1.4,
              color: '#FFFFFF',
              fontWeight: 400,
              maxWidth: '700px',
              margin: '0 auto',
            }}>
              Small by design. Managed for outcomes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 max-w-[1200px] mx-auto">
            {[
              {
                title: 'Discipline Over Convenience',
                desc: 'We build systems that demand daily commitment, not shortcuts.',
              },
              {
                title: 'Identity Over Imitation',
                desc: 'Athletes develop games rooted in their strengths — not templates borrowed from others.',
              },
              {
                title: 'Depth Over Speed',
                desc: 'Long-term capability over short-term results.',
              },
              {
                title: 'Architecture Over Activity',
                desc: 'Every session exists within a framework. Training is designed, not accumulated.',
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                style={{
                  paddingLeft: i === 0 ? '0' : '32px',
                  paddingRight: i === 3 ? '0' : '32px',
                  borderRight: i === 3 ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <h3 style={{
                  fontFamily: '"neue-haas-grotesk-display", sans-serif',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  marginBottom: '16px',
                  letterSpacing: '-0.01em',
                }}>
                  {pillar.title}
                </h3>
                <p style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '16px',
                  lineHeight: 1.5,
                  color: '#999999',
                  fontWeight: 400,
                }}>
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SYSTEM - Enhanced with Sticky Layout */}
      <section style={{ padding: '120px 0', background: '#FFFFFF' }}>
        <div className="max-w-[1440px] mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Sticky Header - Left Column */}
            <motion.div
              className="lg:sticky lg:top-32 lg:self-start max-w-[500px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#888888',
                marginBottom: '24px',
              }}>
                The System
              </div>
              <h2 style={{
                fontFamily: '"neue-haas-grotesk-display", sans-serif',
                fontSize: '48px',
                fontWeight: 500,
                color: '#111111',
                marginBottom: '24px',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                Four Labs. One Trajectory.
              </h2>
              <p style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: '18px',
                lineHeight: 1.5,
                color: '#666666',
                fontWeight: 400,
              }}>
                Each athlete is developed across four integrated domains. Quarterly assessments. Documented progression.
              </p>
            </motion.div>

            {/* Scrolling Content - Right Column */}
            <div>
            {[
              {
                title: 'Technical',
                desc: 'Stroke mechanics refined through video analysis and biomechanical review. Adjustments anchored in data, not aesthetics.',
              },
              {
                title: 'Tactical',
                desc: 'Pattern recognition, match strategy, and opponent analysis. Competitive intelligence built through structured simulation.',
              },
              {
                title: 'Physical',
                desc: 'Sport-specific conditioning, movement efficiency, power development, and injury prevention protocols.',
              },
              {
                title: 'Mental',
                desc: 'Performance psychology, recovery architecture, nutrition coordination, and academic planning.',
              },
            ].map((area, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '30% 70%',
                  gap: '40px',
                  paddingTop: '40px',
                  paddingBottom: '40px',
                  borderBottom: i === 3 ? 'none' : '1px solid #E5E5E5',
                }}
              >
                <h3 style={{
                  fontFamily: '"neue-haas-grotesk-display", sans-serif',
                  fontSize: '20px',
                  fontWeight: 500,
                  color: '#111111',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  {area.title}
                </h3>
                <p style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#555555',
                  fontWeight: 400,
                }}>
                  {area.desc}
                </p>
              </motion.div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTION */}
      <section style={{ padding: '120px 0', background: '#111111' }}>
        <div className="max-w-[1200px] mx-auto px-8 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '32px',
            }}>
              Selection
            </div>

            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '28px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#FFFFFF',
              maxWidth: '700px',
              margin: '0 auto 24px',
            }}>
              UTR 9.0+. Upward trajectory. Full-time commitment. Family alignment.
            </p>

            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '16px',
              fontWeight: 400,
              color: '#888888',
              marginBottom: '48px',
            }}>
              January 2026 — Ten positions.
            </p>

            <Link
              href="/book"
              className="group inline-flex items-center gap-3 px-12 py-4 transition-all duration-500"
              style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                background: 'transparent',
                border: '1px solid #FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF'
                e.currentTarget.style.color = '#111111'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#FFFFFF'
              }}
            >
              Begin Application
            </Link>
          </motion.div>
        </div>
      </section>

      {/* TRAINING ENVIRONMENT */}
      <section style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1200px] mx-auto px-8 md:px-12" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '16px',
            }}>
              Laguna Beach
            </div>

            <h2 style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: '40px',
              fontWeight: 500,
              color: '#111111',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}>
              The Environment
            </h2>

            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '18px',
              lineHeight: 1.6,
              color: '#666666',
              fontWeight: 400,
              maxWidth: '600px',
            }}>
              Hardcourt training. Video analysis. Strength lab. Year-round California climate.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              src="https://player.vimeo.com/video/1141895131?background=1&autoplay=1&loop=1&muted=1"
              frameBorder="0"
              allow="autoplay; fullscreen"
              className="absolute top-0 left-0 w-full h-full"
              title="VYLO Training Environment"
            />
          </div>
        </motion.div>
      </section>

      {/* CO-FOUNDERS */}
      <section style={{ padding: '120px 0', background: '#FFFFFF' }}>
        <div className="max-w-[1200px] mx-auto px-8 md:px-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ marginBottom: '80px' }}
          >
            <div style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '16px',
            }}>
              Leadership
            </div>
            <h2 style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: '48px',
              fontWeight: 500,
              color: '#111111',
              letterSpacing: '-0.02em',
            }}>
              The Co-Founders
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Andrew Mateljan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <div className="aspect-[4/5] mb-8 overflow-hidden relative" style={{
                  border: '1px solid #EEEEEE',
                }}>
                  <Image
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png"
                    alt="Andrew Mateljan"
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <h3 style={{
                  fontFamily: '"neue-haas-grotesk-display", sans-serif',
                  fontSize: '28px',
                  fontWeight: 500,
                  color: '#111111',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  Andrew Mateljan
                </h3>

                <div style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '14px',
                  color: '#888888',
                  marginBottom: '24px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Co-Founder
                </div>

                <p style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#555555',
                  fontWeight: 400,
                }}>
                  20 years developing competitive players. Former #3 SoCal, #12 nationally ranked junior. Seven years coaching internationally across Spain, Croatia, and Norway. Currently coaches ATP-ranked Karue Sell (#262). Training history includes ATP professionals Max McKennon, Ryan Seggerman, and Colton Smith. ATP Masters 1000 experience at Indian Wells.
                </p>
              </div>
            </motion.div>

            {/* Kevin Jackson */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <div className="aspect-[4/5] mb-8 overflow-hidden relative" style={{
                  border: '1px solid #EEEEEE',
                }}>
                  <Image
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png"
                    alt="Kevin Jackson"
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <h3 style={{
                  fontFamily: '"neue-haas-grotesk-display", sans-serif',
                  fontSize: '28px',
                  fontWeight: 500,
                  color: '#111111',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  Kevin Jackson
                </h3>

                <div style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '14px',
                  color: '#888888',
                  marginBottom: '24px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Co-Founder
                </div>

                <p style={{
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#555555',
                  fontWeight: 400,
                }}>
                  20 years of elite coaching and academy leadership. USPTA Certified Professional 1. Multiple nationally ranked #1 juniors. Over 20 Division I placements including UCLA, Stanford, Texas, and Virginia. Currently leading VYLO's player placement strategy and family advisory process.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section style={{ padding: '160px 0', background: '#0A0A0A' }}>
        <div className="max-w-[900px] mx-auto px-8 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: 'clamp(24px, 3vw, 34px)',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              letterSpacing: '-0.005em',
              lineHeight: 1.4,
            }}
          >
            Ten athletes. One trajectory. January 2026.
          </motion.p>
        </div>
      </section>

      {/* FOOTER - Aman-refined */}
      <footer style={{ padding: '100px 0 60px', background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-[800px] mx-auto px-8 md:px-12 text-center">
          {/* Logo */}
          <div style={{ marginBottom: '48px' }}>
            <Image
              src="/logos/VYLO Icon_Word_Logo_Classic_Org_Wht.png"
              alt="VYLO Performance Institute"
              width={140}
              height={47}
              style={{ width: 'auto', height: 'auto', maxHeight: '32px', margin: '0 auto' }}
            />
          </div>

          {/* Contact */}
          <div style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: '13px',
            lineHeight: 2.2,
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}>
            <div>admissions@vylo.tennis</div>
            <div>(949) 464-6645</div>
            <div style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.35)', fontSize: '12px' }}>
              Laguna Beach, California
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
