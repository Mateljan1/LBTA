'use client'

import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

interface Program {
  name: string
  day: string
  time: string
  ages: string
  duration: string
  price: string
  location: string
  coach: string
  category: string
}

interface CalendarEvent {
  title: string
  start: Date
  end: Date
  resource: Program
}

interface ScheduleCalendarProps {
  programs: Program[]
  onEventClick: (program: Program) => void
}

// Convert "Monday 3:30-4:30 PM" format to Date objects
function programToEvent(program: Program, baseDate: Date): CalendarEvent | null {
  const dayMap: { [key: string]: number } = {
    'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
    'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0
  }
  
  const dayOfWeek = dayMap[program.day]
  if (dayOfWeek === undefined) return null
  
  // Split time range (handle both – and - dashes)
  const timeMatch = program.time.match(/(\d+):(\d+)\s*(AM|PM)\s*[-–]\s*(\d+):(\d+)\s*(AM|PM)/i)
  if (!timeMatch) {
    console.warn(`Could not parse time: ${program.time}`)
    return null
  }
  
  let startHour = parseInt(timeMatch[1])
  const startMin = parseInt(timeMatch[2])
  const startPeriod = timeMatch[3].toUpperCase()
  let endHour = parseInt(timeMatch[4])
  const endMin = parseInt(timeMatch[5])
  const endPeriod = timeMatch[6].toUpperCase()
  
  // Convert to 24-hour format
  if (startPeriod === 'PM' && startHour !== 12) startHour += 12
  if (startPeriod === 'AM' && startHour === 12) startHour = 0
  if (endPeriod === 'PM' && endHour !== 12) endHour += 12
  if (endPeriod === 'AM' && endHour === 12) endHour = 0
  
  // Create dates for this week
  const start = new Date(baseDate)
  start.setDate(baseDate.getDate() - baseDate.getDay() + dayOfWeek)
  start.setHours(startHour, startMin, 0, 0)
  
  const end = new Date(start)
  end.setHours(endHour, endMin, 0, 0)
  
  return {
    title: `${program.name} - ${program.coach}`,
    start,
    end,
    resource: program
  }
}

export default function ScheduleCalendar({ programs, onEventClick }: ScheduleCalendarProps) {
  const events: CalendarEvent[] = programs
    .map(p => programToEvent(p, new Date()))
    .filter(e => e !== null)
  
  const eventStyleGetter = (event: CalendarEvent) => {
    const location = event.resource.location.toLowerCase()
    let backgroundColor = '#F8A121' // Default orange (Moulton)
    
    if (location.includes('lbhs')) {
      backgroundColor = '#F04E23' // Red
    } else if (location.includes('alta')) {
      backgroundColor = '#F8E6BB' // Beige
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: location.includes('alta') ? '#000' : '#fff',
        border: '0px',
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
      }
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '75vh', minHeight: '600px' }}
        defaultView={'week' as View}
        views={['week']}
        toolbar={false}
        min={new Date(2024, 0, 1, 7, 0, 0)} // 7 AM
        max={new Date(2024, 0, 1, 21, 0, 0)} // 9 PM
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => onEventClick(event.resource)}
        className="lbta-calendar"
      />
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-sm font-sans">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F8A121]"></div>
          <span className="text-black/70">Moulton</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F04E23]"></div>
          <span className="text-black/70">LBHS</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#F8E6BB] border border-gray-300"></div>
          <span className="text-black/70">Alta Laguna</span>
        </div>
      </div>
    </div>
  )
}
