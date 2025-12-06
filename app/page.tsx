'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import CountUp from 'react-countup'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SeamlessLogo from '@/components/ui/SeamlessLogo'
import PhotoVideoGallery from '@/components/ui/PhotoVideoGallery'
import PartnershipSection from '@/components/ui/PartnershipSection'

// Stats data for Stats Strip section
const statsStripData = [
  { value: 200, suffix: "+", label: "Students Enrolled" },
  { value: 20, suffix: "+", label: "College Placements" },
  { value: 3, suffix: "", label: "Laguna Beach Facilities" },
  { value: "6:1", suffix: "", label: "Maximum Student Ratio" },
]

// StatItem Component
interface StatItemProps {
  value: number | string
  suffix?: string
  label: string
  index: number
}

const StatItem = ({ value, suffix = "", label, index }: StatItemProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.7 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="text-[64px] md:text-[48px] font-medium text-[#e5e7eb] leading-none tracking-tight">
        {isInView && typeof value === 'number' ? (
          <CountUp
            end={value}
            duration={1.8}
            separator=","
            suffix={suffix}
            useEasing={true}
            easingFn={(t: number, b: number, c: number, d: number) => {
              // Custom easing: ease-out with slight bounce
              return c * ((t = t / d - 1) * t * t + 1) + b
            }}
          />
        ) : (
          `${value}${suffix}`
        )}
      </div>

      <div className="text-[13px] md:text-[12px] font-normal text-white/60 uppercase tracking-wider mt-3">
        {label}
      </div>
    </motion.div>
  )
}

// Junior Programs data
const juniorProgramsData = {
  sectionLabel: "Programs",
  headline: "Junior Development",
  subheadline: "Three pathways for junior players. From foundational skills to competitive excellence.",
  programs: [
    {
      badge: "Ages 5–10",
      title: "Junior Champions",
      description: "Fundamental technique and rally skills. Movement patterns. Hand-eye coordination. Game-based learning that keeps young players engaged and progressing.",
      ctaText: "Learn More",
      ctaHref: "/programs/junior",
      featured: false,
    },
    {
      badge: "Ages 8–18",
      title: "Youth Development",
      description: "Technical refinement. Court awareness. Tactical understanding. Match play integration. The core pathway for juniors committed to consistent improvement. Most popular program.",
      ctaText: "Learn More",
      ctaHref: "/programs/junior",
      featured: true,
    },
    {
      badge: "Ages 12+ (Selective)",
      title: "High Performance",
      description: "Tournament preparation. Integrated conditioning. Mental training. College recruitment support. For athletes targeting competitive junior tennis and collegiate placement.",
      ctaText: "Learn More",
      ctaHref: "/programs/high-performance",
      featured: false,
    },
  ],
}

// ProgramCard Component
interface ProgramCardProps {
  badge: string
  title: string
  description: string
  ctaText: string
  ctaHref: string
  featured?: boolean
  index: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

const ProgramCard = ({
  badge,
  title,
  description,
  ctaText,
  ctaHref,
  featured = false,
  index,
}: ProgramCardProps) => {
  const cardPadding = featured ? 'p-12 md:p-8' : 'p-10 md:p-8'
  const titleSize = featured ? 'text-[28px] md:text-[24px]' : 'text-[24px] md:text-[22px]'
  const descSize = featured ? 'text-[16px]' : 'text-[15px]'

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={cardVariants}
      whileHover={{ y: -2 }}
      className={`group relative bg-white shadow-md overflow-hidden h-full flex flex-col
                  hover:shadow-xl hover:border-b-2 hover:border-[#f8a121]
                  transition-all duration-300 ${cardPadding}`}
    >
      {/* Badge with orange left border - ONLY orange element */}
      <div className="inline-block bg-black/75 text-white text-[11px] uppercase tracking-wide px-3 py-1.5 mb-6 relative border-l-4 border-[#f8a121] self-start">
        {badge}
      </div>

      {/* Title */}
      <h3 className={`${titleSize} font-medium text-black mb-4 leading-tight`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`${descSize} md:text-[14px] font-light text-gray-500 leading-relaxed mb-8 flex-grow`}>
        {description}
      </p>

      {/* CTA */}
      <Link
        href={ctaHref}
        className="inline-block border border-black text-black px-6 py-2.5 text-[14px] font-medium tracking-wide hover:bg-[#f04e23] hover:text-white hover:border-[#f04e23] transition-all duration-300 self-start"
      >
        {ctaText}
      </Link>
    </motion.div>
  )
}

// Adult Programs data
const adultProgramsData = {
  sectionLabel: "Adult Programs",
  headline: "Start at Any Age,\nAny Level",
  subheadline: "Whether you're learning tennis for the first time or played competitively years ago, we meet you where you are.",
  bodyParagraph: "Train at the same facilities with the same ATP/WTA coaching expertise we bring to junior development. Adult programs emphasize technique, fitness, and match play—adapted to your schedule and goals.",
  programList: [
    {
      title: "Beginner 12-Week Program",
      description: "Foundation skills, court confidence, and rally development. Small groups, patient instruction, zero judgment.",
    },
    {
      title: "Cardio Tennis & Live Ball",
      description: "High-energy fitness training with continuous movement and shot repetition. Burns calories, builds stamina, improves consistency.",
    },
    {
      title: "Private Lessons & Clinics",
      description: "One-on-one instruction or small group sessions. Custom focus areas from serve mechanics to competitive strategy.",
    },
  ],
  ctaText: "View Adult Programs",
  ctaHref: "/programs/adult",
  imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png",
  imageAlt: "Adult tennis players training at Laguna Beach Tennis Academy",
}

// ProgramListItem Component
interface ProgramListItemProps {
  title: string
  description: string
  index: number
}

const ProgramListItem = ({ title, description, index }: ProgramListItemProps) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-start gap-3 group mb-6 last:mb-0"
    >
      {/* Optional hover dot - only orange element */}
      <div className="w-2 h-2 rounded-full bg-[#f8a121] opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1.5 hidden lg:block" />

      <div className="flex-1">
        <h4 className="text-[17px] md:text-[16px] font-medium text-black mb-2">
          {title}
        </h4>
        <p className="text-[15px] md:text-[14px] font-light text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// Coach Profiles data
interface Coach {
  name: string
  title: string
  credential: string
  imageSrc: string
  imageAlt: string
  profileUrl?: string
}

const coachProfilesData = {
  sectionLabel: "Your Development Team",
  headline: "Our Team",
  subheadline: "Each coach brings unique expertise from professional tours to collegiate success. Your development is guided by proven experience.",
  coaches: [
    {
      name: "Andrew Mateljan",
      title: "Director",
      credential: "ATP/WTA Tour Coach",
      imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
      imageAlt: "Andrew Mateljan, Director and ATP/WTA Tour Coach",
    },
    {
      name: "Kevin Jackson",
      title: "Head Coach",
      credential: "College Recruitment",
      imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
      imageAlt: "Kevin Jackson, Head Coach specializing in College Recruitment",
    },
    {
      name: "Michelle Bevins",
      title: "Youth Director",
      credential: "Ages 3-12",
      imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
      imageAlt: "Michelle Bevins, Youth Director for Ages 3-12",
    },
    {
      name: "Savriyan Danilov",
      title: "High Performance",
      credential: "ATP Pro #556",
      imageSrc: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png",
      imageAlt: "Savriyan Danilov, High Performance Coach and ATP Pro",
    },
  ],
  ctaText: "Meet the Full Team",
  ctaHref: "/coaches",
}

// CoachCard Component
interface CoachCardProps {
  name: string
  title: string
  credential: string
  imageSrc: string
  imageAlt: string
  profileUrl?: string
  index: number
}

const coachCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

const CoachCard = ({
  name,
  title,
  credential,
  imageSrc,
  imageAlt,
  profileUrl,
  index,
}: CoachCardProps) => {
  const CardContent = (
    <>
      {/* Image with aspect ratio 4:5 (condensed layout) */}
      <div className="relative aspect-[4/5] overflow-hidden border-2 border-transparent group-hover:border-[#f8a121] shadow-md group-hover:shadow-xl transition-all duration-400">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-400"
        />
      </div>

      {/* Text (condensed spacing) */}
      <h3 className="text-[20px] md:text-[18px] font-medium text-black mt-4 mb-1.5 group-hover:underline decoration-1">
        {name}
      </h3>
      <p className="text-[15px] md:text-[14px] font-normal text-gray-700">
        {title}
      </p>
      <p className="text-[13px] md:text-[12px] font-medium text-[#f8a121] tracking-wide mt-1">
        {credential}
      </p>
    </>
  )

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={coachCardVariants}
      className={profileUrl ? 'group cursor-pointer' : 'group'}
    >
      {profileUrl ? (
        <Link href={profileUrl}>{CardContent}</Link>
      ) : (
        <div>{CardContent}</div>
      )}
    </motion.div>
  )
}

// Training Methodology data
interface MethodologyBlock {
  focusLabel: string
  heading: string
  body: string
  listHeading: string
  listItems: string[]
}

const trainingMethodologyData = {
  sectionLabel: "Our Methodology",
  headline: "How Training Works",
  subheadline: "A structured approach built on three integrated components. Each element reinforces the others, creating complete player development.",
  blocks: [
    {
      focusLabel: "Technical & Tactical Development",
      heading: "ON-COURT TRAINING",
      body: "Stroke mechanics, movement patterns, and tactical understanding developed through progressive skill work. Every session builds from fundamentals to match-realistic scenarios.",
      listHeading: "Session Structure:",
      listItems: [
        "Warm-up and movement prep",
        "Technical focus work",
        "Pattern-based drills",
        "Live point play",
        "Cool-down and review"
      ],
    },
    {
      focusLabel: "Fit4Tennis Integration",
      heading: "ATHLETIC DEVELOPMENT",
      body: "Speed, agility, strength, and conditioning work designed specifically for tennis demands. Programs scale from youth fundamentals to high-performance requirements.",
      listHeading: "Key Components:",
      listItems: [
        "Court-specific footwork patterns",
        "Rotational power development",
        "Mobility and flexibility work",
        "Tennis-specific conditioning",
        "Recovery protocols"
      ],
    },
    {
      focusLabel: "Match Readiness & Mental Skills",
      heading: "COMPETITIVE PREPARATION",
      body: "Tactical decision-making, emotional regulation, and competitive routines. Match play is integrated into training, not treated as separate from skill development.",
      listHeading: "Development Areas:",
      listItems: [
        "Shot selection under pressure",
        "Emotional regulation during competition",
        "Match strategy and adaptation",
        "Pre-match routines",
        "Post-match analysis"
      ],
    },
  ],
}

// MethodologyBlock Component
interface MethodologyBlockProps {
  focusLabel: string
  heading: string
  body: string
  listHeading: string
  listItems: string[]
  index: number
}

const methodologyBlockVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: 0.2 + i * 0.15,
      ease: 'easeOut',
    },
  }),
}

const MethodologyBlock = ({
  focusLabel,
  heading,
  body,
  listHeading,
  listItems,
  index,
}: MethodologyBlockProps) => {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={methodologyBlockVariants}
      className="relative pl-12 md:pl-0"
    >
      {/* Orange marker (desktop only) */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.4,
          delay: 0.4 + index * 0.15,
          type: 'spring',
          stiffness: 200
        }}
        className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-[#f8a121] md:hidden"
      />

      <div>
        <p className="text-[12px] uppercase tracking-wider font-medium text-black mb-2">
          {focusLabel}
        </p>

        <h3 className="text-[24px] md:text-[22px] font-medium text-black mb-4">
          {heading}
        </h3>

        <p className="text-[16px] md:text-[15px] font-light text-gray-500 leading-relaxed mb-6">
          {body}
        </p>

        <div>
          <p className="text-[15px] font-medium text-gray-700 mb-3">
            {listHeading}
          </p>

          <ul className="space-y-2">
            {listItems.map((item, i) => (
              <li key={i} className="relative pl-4 text-[15px] md:text-[14px] font-light text-gray-500">
                <span className="absolute left-0 text-gray-400">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

// Video Testimonials data
const videoTestimonialsData = {
  sectionLabel: "In Their Words",
  headline: "Member Stories",
  videoSrc: "/videos/testimonial-primary.mp4", // Replace with actual video path
  videoPoster: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png",
  videoAlt: "LBTA member testimonial on court",
  ctaText: "View more stories",
  ctaHref: "/testimonials",
}

// Footer data
interface FooterLink {
  label: string
  href: string
}

interface EcosystemPartner {
  name: string
  description: string
  ctaText: string
  ctaHref: string
}

const footerData = {
  brandName: "Laguna Beach Tennis Academy",
  brandSubtitle: "Excellence Built Here",
  programLinks: [
    { label: "Junior Programs", href: "/programs/junior" },
    { label: "Adult Programs", href: "/programs/adult" },
    { label: "High Performance", href: "/programs/high-performance" },
    { label: "Private Lessons", href: "/book" },
  ],
  aboutLinks: [
    { label: "Our Philosophy", href: "/philosophy" },
    { label: "Coaches", href: "/coaches" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQ", href: "/faq" },
  ],
  contactLinks: [
    { label: "Book a Trial", href: "/book" },
    { label: "Contact Us", href: "/contact" },
    { label: "Pricing", href: "/pricing" },
    { label: "Schedules", href: "/schedules" },
  ],
  ecosystemPartners: [
    {
      name: "Fit4Tennis",
      description: "Athletic development and tennis-specific conditioning programs integrated into training.",
      ctaText: "Learn More",
      ctaHref: "https://www.fit4tennis.com",
    },
    {
      name: "VYLO",
      description: "Advanced player development system combining video analysis, coaching tools, and performance tracking.",
      ctaText: "Explore VYLO",
      ctaHref: "/vylo",
    },
  ],
  copyrightText: `© ${new Date().getFullYear()} Laguna Beach Tennis Academy. All rights reserved.`,
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
}

const coaches = [
  {
    name: "Andrew Mateljan",
    title: "Director",
    specialty: "ATP/WTA Tour Coach",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/b542dd0d0_AndrewMateljanPic.png",
  },
  {
    name: "Kevin Jackson",
    title: "Head Coach",
    specialty: "College Recruitment",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/0505f2a39_kevinJacksonPic.png",
  },
  {
    name: "Michelle Bevins",
    title: "Youth Director",
    specialty: "Ages 3-12",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/97b8fa461_MichelleBevinsPic.png",
  },
  {
    name: "Savriyan Danilov",
    title: "High Performance",
    specialty: "ATP Pro #556",
    image: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/57a63569f_Savriyan.png",
  },
]

export default function Home() {
  // Parallax scroll transform for background
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 250]) // 50% scroll speed

  return (
    <>
      {/* Hero - Premium Parallax */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Layer 1 - Background (z-10) with Parallax */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 z-10"
        >
          <Image
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/35885076d_HEROIMAGE-2.png"
            alt="Laguna Beach Tennis Academy courts at sunset with palm trees"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8ZAAAAAAAAA//Z"
          />
        </motion.div>

        {/* Layer 2 - Overlay (z-20) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

        {/* Layer 3 - Content (z-30) */}
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <div className="container-narrow text-center px-6">
            {/* Eyebrow - Animated (delay: 0s) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0 }}
              className="text-gray-300 mb-6"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Official City of Laguna Beach Tennis Partner
            </motion.p>

            {/* Headline - Animated (delay: 0.15s) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-white mb-8 font-medium tracking-tight"
              style={{
                fontSize: 'clamp(40px, 5vw, 68px)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              Your Tennis Journey
              <br />
              Starts in Laguna Beach.
            </motion.h1>

            {/* Subheadline - Animated (delay: 0.3s) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              style={{
                fontSize: 'clamp(16px, 1.5vw, 19px)',
              }}
            >
              Professional coaching. Individual attention. Proven development.
              <br />
              ATP/WTA expertise. 20+ D1 placements.
            </motion.p>

            {/* CTAs - Animated (delay: 0.45s) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
            >
              {/* Primary CTA - Red-Orange */}
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-4 font-sans text-sm font-medium tracking-wide text-white transition-all duration-500 hover:opacity-90"
                style={{
                  backgroundColor: '#f04e23',
                  minHeight: '48px',
                  letterSpacing: '1.5px',
                }}
              >
                SCHEDULE FREE TRIAL
              </Link>

              {/* Secondary CTA - White Outline */}
              <Link
                href="/programs"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/40 text-white font-sans text-sm font-medium tracking-wide hover:border-white hover:bg-white/10 transition-all duration-500"
                style={{
                  minHeight: '48px',
                  letterSpacing: '1.5px',
                }}
              >
                EXPLORE PROGRAMS
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy - Why LBTA (Three Pillars) */}
      <section className="bg-white py-40 md:py-24 px-16 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header Block - Centered */}
          <div className="text-center max-w-[720px] mx-auto mb-20 md:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal mb-4"
            >
              Our Approach
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-[48px] md:text-[32px] font-medium text-black leading-tight tracking-tight mb-6"
            >
              How We Develop Players
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="text-[18px] md:text-[16px] font-light text-gray-600 leading-relaxed"
            >
              Three principles guide every session. They apply whether you're learning your first forehand or preparing for Division I tennis.
            </motion.p>
          </div>

          {/* Pillar Grid */}
          <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-12 md:gap-10">
            {/* Pillar 1 - Technical Foundations */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
              className="group relative bg-gray-50 border border-gray-200 p-10 md:p-8 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 transition-all duration-300"
            >
              {/* 4px left accent bar - ONLY orange element */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f8a121] group-hover:w-1.5 transition-all duration-300" />

              <h3 className="text-[20px] md:text-[18px] font-medium text-black mb-4">
                Technical Foundations
              </h3>

              <p className="text-[16px] md:text-[15px] font-light text-gray-500 leading-relaxed">
                Clean mechanics. Efficient movement. Repeatable strokes under pressure. We build the technical framework that holds up in competition—from your first lesson through national tournaments.
              </p>
            </motion.div>

            {/* Pillar 2 - Athletic Development */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="group relative bg-gray-50 border border-gray-200 p-10 md:p-8 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 transition-all duration-300"
            >
              {/* 4px left accent bar - ONLY orange element */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f8a121] group-hover:w-1.5 transition-all duration-300" />

              <h3 className="text-[20px] md:text-[18px] font-medium text-black mb-4">
                Athletic Development
              </h3>

              <p className="text-[16px] md:text-[15px] font-light text-gray-500 leading-relaxed">
                Footwork. Agility. Strength. Endurance. Tennis-specific fitness integrated into every session. Our Fit4Tennis programming follows the same protocols used by ATP and WTA professionals.
              </p>
            </motion.div>

            {/* Pillar 3 - Competitive Mindset */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="group relative bg-gray-50 border border-gray-200 p-10 md:p-8 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 transition-all duration-300"
            >
              {/* 4px left accent bar - ONLY orange element */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f8a121] group-hover:w-1.5 transition-all duration-300" />

              <h3 className="text-[20px] md:text-[18px] font-medium text-black mb-4">
                Competitive Mindset
              </h3>

              <p className="text-[16px] md:text-[15px] font-light text-gray-500 leading-relaxed">
                Shot selection. Emotional regulation. Match strategy. Pattern recognition. The mental game separates good players from great ones. We teach you how to think on court.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip - Black Background with Animated Numbers */}
      <section className="bg-black py-20 md:py-14 px-16 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-2 gap-16 md:gap-10">
            {statsStripData.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Junior Programs - Bento Grid */}
      <section className="bg-[#fafafa] py-40 md:py-24 px-16 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header Block - Centered */}
          <div className="text-center max-w-[720px] mx-auto mb-20 md:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal mb-4"
            >
              {juniorProgramsData.sectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-[48px] md:text-[32px] font-medium text-black leading-tight tracking-tight mb-6"
            >
              {juniorProgramsData.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="text-[18px] md:text-[16px] font-light text-gray-600 leading-relaxed"
            >
              {juniorProgramsData.subheadline}
            </motion.p>
          </div>

          {/* Bento Grid - Asymmetric Layout */}
          <div className="grid grid-cols-12 lg:grid-cols-1 md:grid-cols-1 gap-6">
            {/* Junior Champions: 4 cols × 2 rows on desktop */}
            <div className="col-span-4 row-span-2 lg:col-span-1 lg:row-span-1">
              <ProgramCard
                {...juniorProgramsData.programs[0]}
                index={0}
              />
            </div>

            {/* Youth Development: 8 cols × 2 rows (FEATURED) on desktop */}
            <div className="col-span-8 row-span-2 lg:col-span-1 lg:row-span-1">
              <ProgramCard
                {...juniorProgramsData.programs[1]}
                index={1}
              />
            </div>

            {/* High Performance: 4 cols × 1 row on desktop */}
            <div className="col-span-4 lg:col-span-1">
              <ProgramCard
                {...juniorProgramsData.programs[2]}
                index={2}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Adult Programs - Sand Background with Image Reveal */}
      <section className="bg-[#f8e6bb] min-h-[90vh] md:min-h-0 flex items-center py-30 md:py-20 px-16 md:px-6">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="grid grid-cols-5 md:grid-cols-1 gap-20 md:gap-14 items-center">
            {/* Text Column (2 cols) */}
            <div className="col-span-2 md:col-span-1 relative">
              {/* 4px orange vertical bar - ONLY orange element on desktop */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute left-0 top-0 bottom-0 w-1 bg-[#f8a121] md:hidden"
              />

              {/* Mobile: horizontal bar instead */}
              <div className="hidden md:block w-full h-1 bg-[#f8a121] mb-6" />

              <div className="pl-8 md:pl-0">
                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0, ease: 'easeOut' }}
                  className="text-[11px] uppercase tracking-[0.15em] text-gray-500 mb-4"
                >
                  {adultProgramsData.sectionLabel}
                </motion.p>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                  className="text-[56px] md:text-[36px] font-medium text-black leading-[1.1] tracking-tight mb-6"
                >
                  {adultProgramsData.headline.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i === 0 && <br />}
                    </span>
                  ))}
                </motion.h2>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                  className="text-[19px] md:text-[17px] font-light text-gray-800 leading-relaxed max-w-[520px] mb-8"
                >
                  {adultProgramsData.subheadline}
                </motion.p>

                {/* Body Paragraph */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
                  className="text-[17px] md:text-[16px] font-light text-gray-700 leading-relaxed max-w-[520px] mb-10"
                >
                  {adultProgramsData.bodyParagraph}
                </motion.p>

                {/* Program List */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                  className="mb-12"
                >
                  {adultProgramsData.programList.map((program, index) => (
                    <ProgramListItem
                      key={index}
                      title={program.title}
                      description={program.description}
                      index={index}
                    />
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
                >
                  <Link
                    href={adultProgramsData.ctaHref}
                    className="inline-block bg-[#f04e23] text-white px-8 py-3.5 text-[15px] font-medium hover:bg-[#d63d12] hover:scale-[1.02] transition-all duration-250 ease-out tracking-wide"
                  >
                    {adultProgramsData.ctaText}
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Image Column (3 cols) */}
            <div className="col-span-3 md:col-span-1 relative h-[600px] md:h-[400px] overflow-hidden">
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                <Image
                  src={adultProgramsData.imageSrc}
                  alt={adultProgramsData.imageAlt}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Gradient overlay to blend with sand background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8e6bb] via-[#f8e6bb]/50 to-transparent" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Coach Profiles - Sand Background (Condensed) */}
      <section className="bg-[#f8e6bb] py-25 md:py-20 px-16 md:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Block */}
          <div className="text-center max-w-[640px] mx-auto mb-14 md:mb-12">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal mb-4"
            >
              {coachProfilesData.sectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="text-[48px] md:text-[32px] font-medium text-black leading-tight mb-6"
            >
              {coachProfilesData.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-[18px] md:text-[16px] font-light text-gray-800 leading-relaxed"
            >
              {coachProfilesData.subheadline}
            </motion.p>
          </div>

          {/* Coach Grid - 2x2 layout (Tighter spacing) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:gap-x-5 md:gap-y-10">
            {coachProfilesData.coaches.map((coach, index) => (
              <CoachCard
                key={coach.name}
                name={coach.name}
                title={coach.title}
                credential={coach.credential}
                imageSrc={coach.imageSrc}
                imageAlt={coach.imageAlt}
                index={index}
              />
            ))}
          </div>

          {/* Section CTA */}
          <div className="text-center mt-10 md:mt-10">
            <Link
              href={coachProfilesData.ctaHref}
              className="inline-block text-[15px] font-medium text-black underline decoration-1 hover:decoration-2 hover:decoration-[#f8a121] transition-all duration-250"
            >
              {coachProfilesData.ctaText}
            </Link>
          </div>
        </div>
      </section>

      {/* Training Methodology - Editorial Timeline */}
      <section className="bg-white py-40 md:py-24 px-16 md:px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header Block */}
          <div className="text-center max-w-[720px] mx-auto mb-20 md:mb-14">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal mb-4"
            >
              {trainingMethodologyData.sectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="text-[48px] md:text-[32px] font-medium text-black leading-tight mb-6"
            >
              {trainingMethodologyData.headline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-[18px] md:text-[16px] font-light text-gray-600 leading-relaxed"
            >
              {trainingMethodologyData.subheadline}
            </motion.p>
          </div>

          {/* Timeline Container */}
          <div className="relative mt-20 md:mt-14">
            {/* Vertical timeline line (desktop only) - grows on scroll */}
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute left-0 top-0 w-0.5 bg-gray-200 md:hidden"
            />

            {/* Methodology Blocks */}
            <div className="space-y-20 md:space-y-14">
              {trainingMethodologyData.blocks.map((block, index) => (
                <MethodologyBlock
                  key={index}
                  focusLabel={block.focusLabel}
                  heading={block.heading}
                  body={block.body}
                  listHeading={block.listHeading}
                  listItems={block.listItems}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials - Single Featured Hero */}
      <section className="bg-[#fafafa] py-30 md:py-20 px-16 md:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Block */}
          <div className="text-center mb-16 md:mb-12">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-[11px] uppercase tracking-[0.15em] text-gray-500 font-normal mb-4"
            >
              {videoTestimonialsData.sectionLabel}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="text-[48px] md:text-[32px] font-medium text-black leading-tight"
            >
              {videoTestimonialsData.headline}
            </motion.h2>
          </div>

          {/* Video Container */}
          <div className="max-w-[1000px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative aspect-video shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <video
                className="w-full h-full object-cover"
                poster={videoTestimonialsData.videoPoster}
                controls
                preload="metadata"
                aria-label={videoTestimonialsData.videoAlt}
              >
                <source src={videoTestimonialsData.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>

          {/* Section CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="text-center mt-10 md:mt-8"
          >
            <Link
              href={videoTestimonialsData.ctaHref}
              className="inline-flex items-center gap-2 text-[15px] font-medium text-gray-500 hover:text-black group transition-colors duration-250"
            >
              {videoTestimonialsData.ctaText}
              <span className="transition-all duration-250 group-hover:translate-x-1 group-hover:text-[#f8a121]">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Professional Development - Image Optimized */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Optimized Image */}
            <AnimatedSection>
              <div className="relative aspect-[3/2]">
                <Image
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/8b7ec1948_ATPTRANSFORMATIONSECTION-KarueAndrewinbackground.png"
                  alt="Andrew Mateljan coaching ATP professional Karue Sell"
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover rounded-sm"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-sm shadow-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                    ATP Ranking
                  </p>
                  <p className="text-5xl font-serif font-light text-lbta-charcoal">
                    #258
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Content */}
            <AnimatedSection delay={0.2}>
              <p className="text-overline mb-6">Real Results</p>
              <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-8 tracking-tight leading-tight">
                #858 to #258
                in Twelve Months
              </h2>
              <p className="body-text mb-6">
                Karue Sell was talented but inconsistent. We worked on movement efficiency and match mindset. Twelve months later, he'd climbed 600 ATP ranking spots.
              </p>
              <p className="body-text mb-8">
                The breakthrough wasn't technical. It was mental. The same approach works whether you're eight years old or on tour.
              </p>
              <Link href="/coaches/andrew-mateljan" className="btn-secondary">
                MEET ANDREW
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* City Partnership - Premium Quality */}
      <section className="section-spacing bg-lbta-tan">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Official Partnership</p>
            <h2 className="text-5xl md:text-7xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              City of Laguna Beach
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-0.5 bg-lbta-burnt" />
              <p className="text-sm text-gray-500 font-sans tracking-wide">
                Since 2020
              </p>
              <div className="w-12 h-0.5 bg-lbta-burnt" />
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entrusted with developing tennis training across three premier city facilities.
              A partnership built on proven results and community impact.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="flex justify-center mb-20">
            <div className="relative w-full max-w-md h-64 md:h-80">
              <Image
                src="/logos/city-laguna-beach.png"
                alt="City of Laguna Beach - Official Partner"
                fill
                quality={100}
                sizes="(max-width: 768px) 80vw, 448px"
                className="object-contain opacity-90"
                style={{ mixBlendMode: 'darken' }}
              />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Laguna Beach High School", img: "0f3eda457_1.png" },
                { name: "Moulton Meadows Park", img: "d1706d2b0_2.png" },
                { name: "Alta Laguna Park", img: "0f3eda457_1.png" }
              ].map((facility) => (
                <div key={facility.name} className="group cursor-default">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm mb-6 relative bg-gray-100">
                    <Image
                      src={`https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/690bf75d8cd1b88fbac92ad3/${facility.img}`}
                      alt={facility.name}
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-lbta-charcoal/0 group-hover:bg-lbta-charcoal/10 transition-all duration-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-sans tracking-wide group-hover:text-gray-700 transition-colors duration-500">
                      {facility.name}
                    </p>
                    <div className="w-6 h-0.5 bg-gray-300 mx-auto mt-3 group-hover:bg-lbta-burnt group-hover:w-10 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Programs - Clean Hierarchy */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Programs</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal mb-6 tracking-tight">
              Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
              Junior and adult. Beginner to advanced. Group and private.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <AnimatedSection delay={0.2}>
              <Link href="/programs/junior">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Junior Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Ages 3-18. Foundation building through competitive development and college preparation.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <Link href="/programs/adult">
                <div className="card-lbta p-10 hover:border-lbta-charcoal group cursor-pointer h-full">
                  <h3 className="text-2xl font-serif font-light text-lbta-charcoal mb-4 group-hover:text-lbta-burnt transition-colors">
                    Adult Programs
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    All skill levels. Beginner instruction through competitive tournament training.
                  </p>
                  <div className="text-sm font-sans text-lbta-burnt tracking-wide">
                    VIEW PROGRAMS →
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.4} className="text-center">
            <Link href="/programs" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              View Complete Program Overview
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Coaching Team - Optimized Images */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-20">
            <p className="text-overline mb-6">Your Development Team</p>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-lbta-charcoal tracking-tight">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              Each coach brings unique expertise from professional tours to collegiate success. Your development is guided by proven experience.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {coaches.map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.1}>
                <Link href="/coaches" className="group block">
                  <div className="aspect-square overflow-hidden rounded-sm mb-4 relative bg-gray-100">
                    <Image
                      src={coach.image}
                      alt={`${coach.name} - ${coach.title} at Laguna Beach Tennis Academy`}
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-base font-sans font-medium text-lbta-charcoal mb-1 group-hover:text-lbta-burnt transition-colors">
                    {coach.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {coach.title}
                  </p>
                  <p className="text-xs text-lbta-burnt font-sans tracking-wide">
                    {coach.specialty}
                  </p>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.5} className="text-center mt-16">
            <Link href="/coaches" className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1">
              Meet the Full Team
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">In Their Words</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Member Stories
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-sm overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <iframe
                  src="https://player.vimeo.com/video/1134930901?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;title=0&amp;byline=0&amp;portrait=0"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title="Parent testimonial"
                ></iframe>
              </div>
              <div className="text-center mt-6">
                <Link href="/success-stories" className="text-sm font-sans text-gray-500 hover:text-lbta-charcoal transition-colors">
                  View more stories →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Photo & Program Video Gallery */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">Our Community in Action</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Behind the Scenes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              Experience the energy and dedication that defines every day at LBTA.
              From championship facilities to daily training sessions.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <PhotoVideoGallery className="max-w-5xl mx-auto" />
          </AnimatedSection>
        </div>
      </section>

      {/* Partnership Section */}
      <PartnershipSection />

      {/* CTA - Refined */}
      <section className="section-spacing bg-lbta-charcoal text-white">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 tracking-tight">
              Begin Your Tennis Journey
            </h2>
            <p className="text-lg font-sans font-light text-white/80 mb-10 leading-relaxed">
              Experience our approach firsthand. Complimentary trial. No pressure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-lbta-charcoal font-sans text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                SCHEDULE TRIAL
              </Link>
              <a
                href="tel:9494646645"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-white/30 text-white font-sans text-sm font-medium tracking-wide hover:border-white hover:bg-white/10 transition-all duration-500"
                style={{ minHeight: '48px', letterSpacing: '1.5px' }}
              >
                (949) 464-6645
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Network - Optimized Logos */}
      <section className="section-spacing bg-white border-t border-gray-200">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <p className="text-overline mb-6">The Complete Experience</p>
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal">
              Beyond the Court
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
              The full tennis experience: training on court, conditioning off court, equipment when you need it.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Fit4Tennis */}
            <AnimatedSection delay={0.1}>
              <div className="card-lbta p-10 text-center h-full flex flex-col">
                <div className="h-40 mb-6 flex items-center justify-center bg-gray-50 rounded-sm -mx-10 -mt-10 mb-8 p-8 relative group transition-all duration-300 hover:bg-gray-100">
                  <Image
                    src="/logos/fit4tennis.png"
                    alt="Fit4Tennis Performance Training"
                    fill
                    quality={100}
                    sizes="400px"
                    className="object-contain opacity-100 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-4">
                  Fit4Tennis
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Andrew's global fitness platform. Workout programs, movement training, and conditioning protocols used by ATP/WTA players.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  100K+ followers worldwide
                </p>
                <a
                  href="https://fit4tennis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
                >
                  Visit Fit4Tennis →
                </a>
              </div>
            </AnimatedSection>

            {/* Racket Rescue */}
            <AnimatedSection delay={0.2}>
              <div className="card-lbta p-10 text-center h-full flex flex-col">
                <div className="h-40 mb-6 flex items-center justify-center bg-gray-50 rounded-sm -mx-10 -mt-10 mb-8 p-8 relative group transition-all duration-300 hover:bg-gray-100">
                  <Image
                    src="/logos/racketrescue.png"
                    alt="Racket Rescue Equipment Services"
                    fill
                    quality={100}
                    sizes="400px"
                    className="object-contain opacity-100 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-2xl font-sans font-medium text-lbta-charcoal mb-4">
                  Racket Rescue
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  Professional racket restringing and equipment services. Mobile pickup and delivery throughout Laguna Beach.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  (949) 534-0457
                </p>
                <a
                  href="https://racketrescue.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-sans text-lbta-charcoal tracking-wide hover:text-lbta-burnt transition-colors border-b border-gray-300 hover:border-lbta-burnt pb-1 inline-block"
                >
                  Visit Racket Rescue →
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer - Black Background */}
      <footer className="bg-black text-white py-20 md:py-16 px-16 md:px-6">
        <div className="max-w-[1440px] mx-auto">
          {/* Main Footer Grid - 3 Columns */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-16 md:gap-12 mb-16 md:mb-12">
            {/* Column 1: Brand */}
            <div>
              <h3 className="text-[22px] md:text-[20px] font-medium text-white mb-2">
                {footerData.brandName}
              </h3>
              <p className="text-[14px] font-light text-gray-400 mb-8">
                {footerData.brandSubtitle}
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-8 md:gap-6 col-span-1">
              {/* Programs */}
              <div>
                <h4 className="text-[13px] uppercase tracking-wider font-medium text-gray-400 mb-4">
                  Programs
                </h4>
                <ul className="space-y-3">
                  {footerData.programLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] font-light text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About */}
              <div>
                <h4 className="text-[13px] uppercase tracking-wider font-medium text-gray-400 mb-4">
                  About
                </h4>
                <ul className="space-y-3">
                  {footerData.aboutLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] font-light text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-[13px] uppercase tracking-wider font-medium text-gray-400 mb-4">
                  Contact
                </h4>
                <ul className="space-y-3">
                  {footerData.contactLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] font-light text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 3: Ecosystem Partners */}
            <div>
              <h4 className="text-[13px] uppercase tracking-wider font-medium text-gray-400 mb-6">
                Ecosystem
              </h4>
              <div className="space-y-6">
                {footerData.ecosystemPartners.map((partner) => (
                  <div key={partner.name}>
                    <h5 className="text-[16px] font-medium text-white mb-2">
                      {partner.name}
                    </h5>
                    <p className="text-[14px] font-light text-gray-400 leading-relaxed mb-3">
                      {partner.description}
                    </p>
                    <a
                      href={partner.ctaHref}
                      target={partner.ctaHref.startsWith('http') ? '_blank' : undefined}
                      rel={partner.ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-gray-300 hover:text-white group transition-colors duration-200"
                    >
                      <span>{partner.ctaText}</span>
                      <span className="text-gray-500 group-hover:text-[#f8a121] group-hover:translate-x-1 transition-all duration-200">
                        →
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bar - Copyright & Legal */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex justify-between items-center md:flex-col md:items-start md:gap-4">
              <p className="text-[13px] font-light text-gray-500">
                {footerData.copyrightText}
              </p>
              <div className="flex gap-6 md:gap-4">
                {footerData.legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] font-light text-gray-500 hover:text-gray-300 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
