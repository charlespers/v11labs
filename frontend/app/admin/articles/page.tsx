import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Article } from '@prisma/client'

export default async function ArticlesPage() {
  let articles: Article[] = []

  try {
    const result = await prisma.article.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    articles = result
  } catch (error) {
    console.error('Database error:', error)
    // Return empty array if database is not available
    articles = []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Article
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Published</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{article.title}</div>
                </td>
                <td className="px-6 py-4">
                  {article.publishedAt && article.publishedAt <= new Date() ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.tags || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {article.publishedAt ? (
                    <div>
                      <div>{article.publishedAt.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {article.publishedAt.toLocaleTimeString()}
                      </div>
                      {article.publishedAt > new Date() && (
                        <div className="text-xs text-orange-600 mt-1">
                          (Future date)
                        </div>
                      )}
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No articles yet. Create your first article!
          </div>
        )}
      </div>
    </div>
  )
}
