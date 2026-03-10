import { getCoachesForSchema } from '@/lib/coaches-data'
import CoachesPageClient from '@/components/coaches/CoachesPageClient'

export default function CoachesPage() {
  const coachesSchema = getCoachesForSchema()

  return (
    <>
      <script
        id="coaches-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coachesSchema) }}
      />

      <CoachesPageClient />
    </>
  )
}
