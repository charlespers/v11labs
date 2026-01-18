import { prisma } from '@/lib/db'
import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/admin/LogoutButton'

export default async function AdminDashboard() {
  // Check authentication
  const authenticated = await isAuthenticated()
  
  if (!authenticated) {
    redirect('/admin/login')
  }
  let articleCount = 0
  let publishedCount = 0
  
  try {
    articleCount = await prisma.article.count()
    publishedCount = await prisma.article.count({
      where: {
        publishedAt: {
          not: null,
          lte: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    // Return zeros if database is not available
  }

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
