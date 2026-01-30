import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProjectEditor from '@/components/admin/ProjectEditor'

export default async function NewProjectPage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Project</h1>
      <ProjectEditor />
    </div>
  )
}
