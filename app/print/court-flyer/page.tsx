/**
 * Court flyer print view. Spring session only.
 * Data: spring-summer-2026.json (schedule, pricing, label/dates), year2026.json (camps), flyer-config (courts, contact, discount line).
 */
import CourtFlyer from '@/components/print/CourtFlyer'
import { getFlyerCoaches } from '@/lib/flyer-data'
import { getPrivateRates } from '@/lib/programs-data'
import { getScheduleByLocationByDay, getSeasonDates, getSeasonLabel } from '@/lib/calendar-schedule'
import { getSpringSummer2026 } from '@/lib/programs-data'
import { getCourtFlyerProgramPricingRows, getYouthDevelopmentUtrPlacementForFlyer } from '@/lib/flyer-pricing'
import { COURT_FLYER_DISCOUNT_LINE, FLYER_OTHER_LOCATIONS_NOTE } from '@/lib/flyer-config'
import year2026Data from '@/data/year2026.json'

const FLYER_LOCATION_KEYS = ['Moulton', 'LBHS', 'Alta'] as const
type FlyerLocationKey = (typeof FLYER_LOCATION_KEYS)[number]

function isFlyerLocation(s: string | undefined): s is FlyerLocationKey {
  return s === 'Moulton' || s === 'LBHS' || s === 'Alta'
}

export default async function CourtFlyerPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>
}) {
  const params = await searchParams
  const locationFilter = isFlyerLocation(params.location) ? params.location : undefined
  const otherLocationsNote = locationFilter ? FLYER_OTHER_LOCATIONS_NOTE : undefined
  const coaches = getFlyerCoaches()
  const privateRates = getPrivateRates()
  const scheduleByLocation = getScheduleByLocationByDay('spring')
  const seasonLabel = getSeasonLabel('spring')
  const seasonDates = getSeasonDates('spring')
  const springSummer = getSpringSummer2026()
  const weeks = springSummer.spring.weeks ?? 10

  const { juniorPricing, adultProgrammingPricing, monthlyAdultPricing } =
    getCourtFlyerProgramPricingRows('spring')
  const youthDevelopmentUtrDetail = getYouthDevelopmentUtrPlacementForFlyer()

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
      price: `$${springBreakCamp?.price ?? 325}/wk`,
      location: springBreakCamp?.location ?? 'Alta Laguna Park',
    },
    {
      label: 'Summer',
      dates: springSummer.camps.summer.dates,
      ages: summerCamp?.ages ?? '5-17',
      price: `$${summerCamp?.price ?? 415}/wk`,
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

  const discountLine = COURT_FLYER_DISCOUNT_LINE

  const privateRatesOrder = ['Andrew Mateljan', 'Peter DeFrantz', 'Allison Cronk']
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
      adultProgrammingPricing={adultProgrammingPricing}
      monthlyAdultPricing={monthlyAdultPricing}
      camps={camps}
      discountLine={discountLine}
      youthDevelopmentUtrDetail={youthDevelopmentUtrDetail}
      locationFilter={locationFilter}
      otherLocationsNote={otherLocationsNote}
    />
  )
}
