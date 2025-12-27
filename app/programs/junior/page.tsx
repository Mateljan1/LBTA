import { redirect } from 'next/navigation'

// Single source of truth: All programs live on /schedules
// Junior Pathway redirects to schedules with Junior filter applied
export default function JuniorProgramsPage() {
  redirect('/schedules#programs')
}
