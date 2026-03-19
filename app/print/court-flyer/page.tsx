import CourtFlyer from '@/components/print/CourtFlyer'
import { getFlyerCoaches } from '@/lib/flyer-data'
import { getPrivateRates } from '@/lib/programs-data'
import { getScheduleByLocationByDay, getSeasonDates, getSeasonLabel } from '@/lib/calendar-schedule'
import { getSpringSummer2026 } from '@/lib/programs-data'
import { getCourtFlyerProgramPricingRows } from '@/lib/flyer-pricing'
import year2026Data from '@/data/year2026.json'
import siteStats from '@/data/site-stats.json'

export default function CourtFlyerPage() {
  const coaches = getFlyerCoaches()
  const privateRates = getPrivateRates()
  const scheduleByLocation = getScheduleByLocationByDay('spring')
  const seasonLabel = getSeasonLabel('spring')
  const seasonDates = getSeasonDates('spring')
  const springSummer = getSpringSummer2026()
  const weeks = springSummer.spring.weeks ?? 10

  const { juniorPricing, adultPricing } = getCourtFlyerProgramPricingRows('spring')

  const year2026 = year2026Data as {
    camps?: Array<{
      id: string
      name: string
      dates: string
      ages: string
      price?: number
      halfDay?: number
      fullDayPrice?: number
      location?: string
    }>
  }
  const thanksgivingCamp = year2026.camps?.find((c) => c.id === 'thanksgiving')
  const swimTennis = year2026.camps?.find((c) => c.id === 'swim-tennis')
  const summerCamp = year2026.camps?.find((c) => c.id === 'summer')
  const springBreakCamp = year2026.camps?.find((c) => c.id === 'spring-break')
  const camps: Array<{ label: string; dates: string; ages: string; price: string; location: string }> = [
    {
      label: 'Swim & Tennis',
      dates: swimTennis?.dates ?? 'Jun 16–Aug 14',
      ages: swimTennis?.ages ?? '5-11',
      price: `$${swimTennis?.price ?? 495}/wk`,
      location: swimTennis?.location ?? 'Alta Laguna Park',
    },
    {
      label: 'Spring Break',
      dates: springSummer.camps.springBreak.dates,
      ages: springBreakCamp?.ages ?? '5-14',
      price: `$${springBreakCamp?.price ?? 295}/wk`,
      location: springBreakCamp?.location ?? 'Alta Laguna Park',
    },
    {
      label: 'Summer',
      dates: springSummer.camps.summer.dates,
      ages: summerCamp?.ages ?? '5-17',
      price: `$${summerCamp?.price ?? 495}/wk`,
      location: summerCamp?.location ?? 'Alta Laguna Park / Laguna Beach High School',
    },
    ...(thanksgivingCamp
      ? [
          {
            label: 'Thanksgiving',
            dates: thanksgivingCamp.dates,
            ages: thanksgivingCamp.ages,
            price: `$${thanksgivingCamp.price ?? 221}/wk`,
            location: (thanksgivingCamp as { location?: string }).location ?? 'Alta Laguna Park / Laguna Beach High School',
          },
        ]
      : []),
  ]

  const discountLine = (siteStats as { discounts?: { discountLine?: string } }).discounts?.discountLine ??
    '$50 off early bird · 10% second child · 5% multi-program · 10% full year'

  const privateRatesOrder = ['Andrew Mateljan', 'Robert LeBuhn', 'Peter DeFrantz', 'Allison Cronk']
  let orderedPrivateRates = privateRatesOrder.map((name) => privateRates.find((r) => r.coach === name)).filter(Boolean)
  if (orderedPrivateRates.length === 0) orderedPrivateRates = [...privateRates]

  return (
    <CourtFlyer
      coaches={coaches}
      privateRates={orderedPrivateRates as typeof privateRates}
      scheduleByLocation={scheduleByLocation}
      seasonLabel={seasonLabel}
      seasonDates={seasonDates}
      weeks={weeks}
      juniorPricing={juniorPricing}
      adultPricing={adultPricing}
      camps={camps}
      discountLine={discountLine}
    />
  )
}
