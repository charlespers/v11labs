import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'

export default async function NewArticlePage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Article</h1>
      <ArticleEditor />
    </div>
  )
}
