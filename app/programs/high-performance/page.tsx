import { redirect } from 'next/navigation'

// Single source of truth: All programs live on /schedules
export default function HighPerformancePage() {
  redirect('/schedules#programs')
}
