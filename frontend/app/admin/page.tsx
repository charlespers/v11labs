import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
  const articleCount = await prisma.article.count()
  const publishedCount = await prisma.article.count({
    where: {
      publishedAt: {
        not: null,
        lte: new Date()
      }
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Articles</h3>
          <p className="text-3xl font-bold text-blue-600">{articleCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Published</h3>
          <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Link
          href="/admin/articles/new"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Article
        </Link>
      </div>
    </div>
  )
}
