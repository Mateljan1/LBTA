import CourtFlyer from '@/components/print/CourtFlyer'
import { getFlyerCoaches } from '@/lib/flyer-data'
import { getPrivateRates, getSpringProgramsForDisplay } from '@/lib/programs-data'
import { getScheduleByLocationByDay, getSeasonDates, getSeasonLabel } from '@/lib/calendar-schedule'
import { getSpringSummer2026 } from '@/lib/programs-data'
import year2026Data from '@/data/year2026.json'

export default function CourtFlyerPage() {
  const coaches = getFlyerCoaches()
  const privateRates = getPrivateRates()
  const scheduleByLocation = getScheduleByLocationByDay('spring')
  const seasonLabel = getSeasonLabel('spring')
  const seasonDates = getSeasonDates('spring')
  const springSummer = getSpringSummer2026()
  const weeks = springSummer.spring.weeks ?? 10

  const springPrograms = getSpringProgramsForDisplay()

  const formatPrice = (p: Record<string, unknown>): { price_1x: string; price_2x: string | null; dropIn: string } => {
    const monthly = typeof p.monthly === 'number' ? p.monthly : null
    const dropIn = typeof p.drop_in === 'number' ? p.drop_in : null
    const p1x = typeof p['1x'] === 'number' ? p['1x'] : monthly
    const p2x = typeof p['2x'] === 'number' ? p['2x'] : null
    return {
      price_1x: p1x != null ? (monthly != null ? `$${p1x}/mo` : `$${p1x}`) : '—',
      price_2x: p2x != null ? `$${p2x}` : null,
      dropIn: dropIn != null ? `$${dropIn}` : 'N/A',
    }
  }

  const juniorCategories = ['Junior', 'Youth']
  const juniorPricing = springPrograms
    .filter((p) => juniorCategories.includes(p.category))
    .map((p) => {
      const { price_1x, price_2x, dropIn } = formatPrice(p.pricing)
      return {
        name: p.program,
        duration: p.duration,
        price_1x,
        price_2x,
        dropIn,
      }
    })

  const adultCategories = ['Adult', 'Fitness']
  const adultPricing = springPrograms
    .filter((p) => adultCategories.includes(p.category))
    .map((p) => {
      const { price_1x, price_2x, dropIn } = formatPrice(p.pricing)
      return {
        name: p.program,
        duration: p.duration,
        price_1x,
        price_2x,
        dropIn,
      }
    })

  const year2026 = year2026Data as {
    camps?: Array<{
      id: string
      name: string
      dates: string
      ages: string
      price?: number
      halfDay?: number
      fullDayPrice?: number
    }>
  }
  const thanksgivingCamp = year2026.camps?.find((c) => c.id === 'thanksgiving')
  const swimTennis = year2026.camps?.find((c) => c.id === 'swim-tennis')
  const camps: Array<{ label: string; dates: string; ages: string; price: string }> = [
    {
      label: 'Swim & Tennis',
      dates: swimTennis?.dates ?? 'Jun 16–Aug 14',
      ages: swimTennis?.ages ?? '5-11',
      price: `$${swimTennis?.price ?? 495}/wk`,
    },
    {
      label: 'Spring Break',
      dates: springSummer.camps.springBreak.dates,
      ages: '5-14',
      price: '$295/wk',
    },
    {
      label: 'Summer',
      dates: springSummer.camps.summer.dates,
      ages: '5-17',
      price: '$495/wk',
    },
    ...(thanksgivingCamp
      ? [
          {
            label: 'Thanksgiving',
            dates: thanksgivingCamp.dates,
            ages: thanksgivingCamp.ages,
            price: `$${thanksgivingCamp.price ?? 221}/wk`,
          },
        ]
      : []),
  ]

  const discountLine =
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
