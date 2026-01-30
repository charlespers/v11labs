import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import WebsiteEditor from '@/components/admin/WebsiteEditor'

export default async function NewWebsitePage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Website</h1>
      <WebsiteEditor />
    </div>
  )
}
