import { AttorneySearch, Navbar } from '@/components'

export default function AttorneysPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <AttorneySearch />
    </div>
  )
}