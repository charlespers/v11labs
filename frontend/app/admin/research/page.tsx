import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Research } from '@prisma/client'

export default async function ResearchPage() {
  let research: Research[] = []

  try {
    const result = await prisma.research.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    research = result
  } catch (error) {
    console.error('Database error:', error)
    // Return empty array if database is not available
    research = []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research</h1>
        <Link
          href="/admin/research/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Research
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
            {research.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4">
                  {item.publishedAt && item.publishedAt <= new Date() ? (
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
                  {item.tags || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.publishedAt ? (
                    <div>
                      <div>{item.publishedAt.toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {item.publishedAt.toLocaleTimeString()}
                      </div>
                      {item.publishedAt > new Date() && (
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
                    href={`/admin/research/${item.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {research.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No research articles yet. Create your first research article!
          </div>
        )}
      </div>
    </div>
  )
}
