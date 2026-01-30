import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ResearchEditor from '@/components/admin/ResearchEditor'

export default async function NewResearchPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Research</h1>
      <ResearchEditor />
    </div>
  )
}
