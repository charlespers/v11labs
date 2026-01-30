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
  let researchCount = 0
  let projectCount = 0
  let websiteCount = 0
  
  try {
    articleCount = await prisma.article.count()
    researchCount = await prisma.research.count()
    projectCount = await prisma.project.count()
    websiteCount = await prisma.website.count()
  } catch (error) {
    console.error('Database error:', error)
    // Return zeros if database is not available
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Articles</h3>
          <p className="text-3xl font-bold text-blue-600">{articleCount}</p>
          <Link href="/admin/articles" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Research</h3>
          <p className="text-3xl font-bold text-purple-600">{researchCount}</p>
          <Link href="/admin/research" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Projects</h3>
          <p className="text-3xl font-bold text-green-600">{projectCount}</p>
          <Link href="/admin/projects" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Websites</h3>
          <p className="text-3xl font-bold text-orange-600">{websiteCount}</p>
          <Link href="/admin/websites" className="text-sm text-gray-500 hover:text-gray-700 mt-2 inline-block">
            View all →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Article
          </Link>
          <Link
            href="/admin/research/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            New Research
          </Link>
          <Link
            href="/admin/projects/new"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            New Project
          </Link>
          <Link
            href="/admin/websites/new"
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            New Website
          </Link>
        </div>
      </div>
    </div>
  )
}
