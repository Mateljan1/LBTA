'use client'

interface CampModalData {
  id: string
  name: string
  dates: string
  days: string | number
  hours: string
  ages: string
  location: string
  price: number
  perDay?: number
  halfDay?: number
  description: string
  includes?: string[]
  safetyNote?: string
  featured?: boolean
  season?: string
  coaches?: string[]
}

interface JTTModalData {
  id: string
  name: string
  dates: string
  weeks: number
  matchDay: string
  divisions: { age: string; price: number }[]
  includes: string[]
  description: string
}

interface CampsJTTTabProps {
  camps: any[]
  jtt: any[]
  onCampRegister: (camp: CampModalData) => void
  onJTTRegister: (jtt: JTTModalData) => void
}

export default function CampsJTTTab({ camps, jtt, onCampRegister, onJTTRegister }: CampsJTTTabProps) {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        
        {/* Featured: Swim & Tennis Camp */}
        {camps.filter((c: any) => c.featured).map((camp: any) => (
          <div key={camp.id} className="mb-20 md:mb-28">
            <div className="text-center mb-12">
              <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/60 mb-3">
                Featured Program
              </p>
              <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1] mb-4">
                {camp.name}
              </h2>
              <p className="font-sans text-[15px] md:text-[17px] text-black/60 max-w-xl mx-auto leading-relaxed">
                {camp.description}
              </p>
            </div>
            
            <div className="bg-brand-morning-light rounded-[2px] overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Left: Details */}
                <div className="p-8 md:p-12">
                  <div className="space-y-6">
                    <div>
                      <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Led By</div>
                      <div className="font-sans text-[15px] text-black">{camp.coaches?.join(' & ')}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Dates</div>
                      <div className="font-sans text-[15px] text-black">{camp.dates}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Schedule</div>
                      <div className="font-sans text-[15px] text-black">{camp.days} · {camp.hours}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Ages</div>
                      <div className="font-sans text-[15px] text-black">{camp.ages}</div>
                    </div>
                    <div>
                      <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-1">Location</div>
                      <div className="font-sans text-[15px] text-black">{camp.location}</div>
                    </div>
                  </div>
                  
                  {/* Safety Note */}
                  {camp.safetyNote && (
                    <div className="mt-8 p-4 bg-gray-100 border-l-2 border-black">
                      <div className="font-sans text-[12px] font-semibold text-black uppercase tracking-wider mb-1">
                        Important
                      </div>
                      <p className="font-sans text-[13px] text-black/70">
                        {camp.safetyNote}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Right: Pricing & Includes */}
                <div className="p-8 md:p-12 bg-white border-t md:border-t-0 md:border-l border-black/5">
                  <div className="mb-8">
                    <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-2">Weekly Rate</div>
                    <div className="font-serif text-[48px] font-light text-black leading-none">${camp.price}</div>
                    <div className="font-sans text-[13px] text-black/50 mt-1">${camp.perDay}/day</div>
                  </div>
                  
                  <div>
                    <div className="font-sans text-[11px] uppercase tracking-[2px] text-black/40 mb-4">Includes</div>
                    <ul className="space-y-3">
                      {camp.includes.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0" />
                          <span className="font-sans text-[14px] text-black/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => onCampRegister(camp as CampModalData)}
                    className="mt-8 inline-block bg-black text-white font-sans text-[13px] font-medium tracking-[2px] uppercase py-4 px-8 hover:bg-lbta-black transition-colors duration-300 cursor-pointer"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Holiday Camps Section */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/40 mb-3">
              School Breaks
            </p>
            <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1]">
              Holiday Camps
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5">
            {camps.filter((c: any) => !c.featured).map((camp: any) => (
              <div key={camp.id} className="bg-white p-8 hover:bg-brand-morning-light transition-colors duration-300 flex flex-col">
                <div className="mb-6">
                  <h3 className="font-serif text-[20px] md:text-[24px] font-normal text-black mb-1">
                    {camp.name}
                  </h3>
                  <p className="font-sans text-[13px] text-black/50">{camp.dates}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Ages</span>
                    <span className="font-sans text-[13px] text-black">{camp.ages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Hours</span>
                    <span className="font-sans text-[13px] text-black">{camp.hours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-[12px] text-black/40 uppercase tracking-wider">Location</span>
                    <span className="font-sans text-[13px] text-black">{camp.location?.split(' ').slice(0, 2).join(' ')}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-black/5 flex-grow">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-[32px] font-light text-black">${camp.price}</span>
                    {camp.halfDay && (
                      <span className="font-sans text-[12px] text-black/50">Half-day: ${camp.halfDay}</span>
                    )}
                  </div>
                  <button
                    onClick={() => onCampRegister(camp as CampModalData)}
                    className="block w-full text-center bg-black text-white font-sans text-[12px] font-medium tracking-[1.5px] uppercase py-3 hover:bg-lbta-black transition-colors duration-300 cursor-pointer"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JTT Section */}
        <div>
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] md:text-[12px] uppercase tracking-[3px] text-black/40 mb-3">
              USTA League Competition
            </p>
            <h2 className="font-serif text-[32px] md:text-[48px] font-light text-black leading-[1.1] mb-4">
              Junior Team Tennis
            </h2>
            <p className="font-sans text-[15px] md:text-[17px] text-black/60 max-w-xl mx-auto leading-relaxed">
              Team practices, Sunday matches, uniforms, and USTA registration included
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-px bg-black/5">
            {jtt.map((season: any) => (
              <div key={season.id} className="bg-white flex flex-col">
                <div className="p-8 border-b border-black/5">
                  <h3 className="font-serif text-[24px] md:text-[28px] font-normal text-black mb-1">
                    {season.name}
                  </h3>
                  <p className="font-sans text-[13px] text-black/50">{season.dates}</p>
                  <p className="font-sans text-[12px] text-black/40 mt-2">
                    {season.weeks} weeks · {season.matchDay}
                  </p>
                </div>
                
                <div className="p-8 flex-grow">
                  <div className="space-y-0">
                    {season.divisions.map((div: any) => (
                      <div key={div.age} className="flex justify-between items-center py-4 border-b border-black/5 last:border-0">
                        <span className="font-sans text-[14px] text-black">{div.age}</span>
                        <span className="font-serif text-[20px] font-light text-black">${div.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => onJTTRegister(season as JTTModalData)}
                    className="mt-6 block w-full text-center bg-black text-white font-sans text-[12px] font-medium tracking-[1.5px] uppercase py-3 hover:bg-lbta-black transition-colors duration-300 cursor-pointer"
                  >
                    Register for {season.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* JTT Includes */}
          <div className="mt-8 p-8 bg-brand-morning-light">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {jtt[0]?.includes.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full" />
                  <span className="font-sans text-[13px] text-black/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
