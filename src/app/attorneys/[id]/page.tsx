import { Navbar } from '@/components/navbar'
import { AttorneyProfile } from '@/components/attorney-profile'

interface AttorneyProfilePageProps {
  params: {
    id: string
  }
}

export default function AttorneyProfilePage({ params }: AttorneyProfilePageProps) {
  return (
    <div>
      <Navbar />
      <AttorneyProfile attorneyId={params.id} />
    </div>
  )
}