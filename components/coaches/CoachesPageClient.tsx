'use client'

import StickyCTA from '@/components/StickyCTA'
import HorizonDivider from '@/components/ui/HorizonDivider'
import { CoachesAnchorNav, CoachesCTA, CoachesHero, CoachingTeamSection } from './index'

export default function CoachesPageClient() {
  return (
    <>
      <CoachesAnchorNav />
      <CoachesHero />
      <HorizonDivider />
      <CoachingTeamSection />
      <HorizonDivider />
      <CoachesCTA />

      <StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />
    </>
  )
}
