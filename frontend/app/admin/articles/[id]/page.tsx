import { isAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import ArticleEditor from '@/components/admin/ArticleEditor'
import { prisma } from '@/lib/db'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  const { id } = await params
  const article = await prisma.article.findUnique({
    where: { id }
  })

  if (!article) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Article</h1>
      <ArticleEditor article={article} />
    </div>
  )
}
