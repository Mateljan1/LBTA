'use client'

import Link from 'next/link'

interface Coach {
  coach: string
  title: string
  rate60: number
  rate90: number
  pack10: number
  pack20: number
  availability: string
}

interface MonthlyProgram {
  label: string
  subtitle: string
  duration: string
  price: number
  dropIn: number
}

interface PrivateCoachingSectionProps {
  coaches: Coach[]
  monthlyPrograms: Record<string, MonthlyProgram>
  discounts: {
    earlyBird: { amount: number; type: string; description: string }
    sibling: { amount: number; type: string; description: string }
    multiProgram: { amount: number; type: string; description: string }
    annual: { amount: number; type: string; description: string }
  }
  scholarships: {
    available: boolean
    coverage: string
    email: string
  }
}

export default function PrivateCoachingSection({
  coaches,
  monthlyPrograms,
  discounts,
  scholarships,
}: PrivateCoachingSectionProps) {
  const monthlyList = Object.values(monthlyPrograms)

  return (
    <section id="private" className="scroll-mt-28 bg-brand-morning-light py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        {/* Private Coaching */}
        <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
          ONE-ON-ONE
        </p>
        <h2 className="font-headline text-[32px] md:text-[44px] font-medium text-brand-pacific-dusk leading-[1.1] mb-3">
          Private Coaching
        </h2>
        <p className="font-sans text-[16px] md:text-[18px] text-brand-pacific-dusk/60 max-w-[600px] mb-10">
          One-on-one sessions tailored to your goals.
        </p>

        {/* Coach table — desktop */}
        <div className="hidden md:block bg-white border border-black/[0.06] rounded-lg overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-sandstone">
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-6 py-3">
                  Coach
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3">
                  Title
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3 text-right">
                  60 min
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3 text-right">
                  90 min
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3 text-right">
                  10-Pack
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3 text-right">
                  20-Pack
                </th>
                <th scope="col" className="font-sans text-[12px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.1em] px-4 py-3">
                  Availability
                </th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((c, i) => (
                <tr
                  key={c.coach}
                  className={i < coaches.length - 1 ? 'border-b border-black/[0.06]' : ''}
                >
                  <td className="font-headline text-[16px] font-medium text-brand-pacific-dusk px-6 py-4">
                    {c.coach}
                  </td>
                  <td className="font-sans text-[14px] text-brand-pacific-dusk/60 px-4 py-4">
                    {c.title}
                  </td>
                  <td className="font-sans text-[14px] text-brand-pacific-dusk px-4 py-4 text-right">
                    ${c.rate60}
                  </td>
                  <td className="font-sans text-[14px] text-brand-pacific-dusk px-4 py-4 text-right">
                    ${c.rate90}
                  </td>
                  <td className="font-sans text-[14px] text-brand-pacific-dusk px-4 py-4 text-right">
                    ${c.pack10.toLocaleString()}
                  </td>
                  <td className="font-sans text-[14px] text-brand-pacific-dusk px-4 py-4 text-right">
                    ${c.pack20.toLocaleString()}
                  </td>
                  <td className="font-sans text-[13px] text-brand-pacific-dusk/70 px-4 py-4">
                    {c.availability}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Coach cards — mobile */}
        <div className="md:hidden space-y-4 mb-6">
          {coaches.map((c) => (
            <div
              key={c.coach}
              className="bg-white border border-black/[0.06] rounded-lg p-5"
            >
              <h3 className="font-headline text-[18px] font-medium text-brand-pacific-dusk">
                {c.coach}
              </h3>
              <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mt-0.5">
                {c.title} · {c.availability}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
                <div>
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/60 uppercase tracking-wider">60 min</p>
                  <p className="font-sans text-[15px] text-brand-pacific-dusk font-medium">${c.rate60}</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/60 uppercase tracking-wider">90 min</p>
                  <p className="font-sans text-[15px] text-brand-pacific-dusk font-medium">${c.rate90}</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/60 uppercase tracking-wider">10-Pack</p>
                  <p className="font-sans text-[15px] text-brand-pacific-dusk font-medium">${c.pack10.toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] text-brand-pacific-dusk/60 uppercase tracking-wider">20-Pack</p>
                  <p className="font-sans text-[15px] text-brand-pacific-dusk font-medium">${c.pack20.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/book"
          className="inline-flex items-center justify-center bg-black text-white font-sans text-[11px] font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2"
        >
          Book a Private Lesson
        </Link>

        {/* Monthly Programs */}
        <div className="mt-16 md:mt-20">
          <p className="font-sans text-[11px] font-medium text-brand-pacific-dusk/60 uppercase tracking-[0.2em] mb-3">
            DROP-IN & MONTHLY
          </p>
          <h3 className="font-headline text-[24px] md:text-[28px] font-medium text-brand-pacific-dusk mb-6">
            Monthly Programs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyList.map((prog) => (
              <div
                key={prog.label}
                className="bg-white border border-black/[0.06] rounded-lg p-6 transition-all duration-500 ease-out hover:border-black/10 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.03),0_8px_16px_rgba(0,0,0,0.03)]"
              >
                <h4 className="font-headline text-[20px] font-medium text-brand-pacific-dusk">
                  {prog.label}
                </h4>
                <p className="font-sans text-[13px] text-brand-pacific-dusk/70 mt-1">
                  {prog.subtitle} · {prog.duration}
                </p>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-headline text-[22px] font-medium text-brand-pacific-dusk">
                    ${prog.price}
                    <span className="font-sans text-[12px] text-brand-pacific-dusk/70 ml-0.5">/mo</span>
                  </span>
                  <span className="font-sans text-[12px] text-brand-pacific-dusk/60">
                    Drop-in ${prog.dropIn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discounts & Scholarships */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-4">
              Available Discounts
            </h3>
            <ul className="space-y-2">
              {Object.values(discounts).map((d) => (
                <li key={d.description} className="font-sans text-[14px] text-brand-pacific-dusk/70">
                  <span className="font-medium text-brand-pacific-dusk">
                    {d.type === 'percent' ? `${d.amount}%` : `$${d.amount}`} off
                  </span>
                  {' — '}{d.description}
                </li>
              ))}
            </ul>
          </div>

          {scholarships.available && (
            <div>
              <h3 className="font-headline text-[20px] font-medium text-brand-pacific-dusk mb-4">
                Scholarships
              </h3>
              <p className="font-sans text-[14px] text-brand-pacific-dusk/70 mb-3">
                Need-based scholarships covering {scholarships.coverage} of tuition are available
                for qualified families.
              </p>
              <Link
                href="/apply-scholarship"
                className="font-sans text-[14px] font-medium text-brand-victoria-cove hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove/30 focus:ring-offset-2 rounded-sm"
              >
                Apply for a Scholarship
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
