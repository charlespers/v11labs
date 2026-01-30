import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Project } from '@prisma/client'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ProjectsPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const { tag } = await searchParams

  let projects: Project[] = []
  let allTags: string[] = []

  try {
    const now = new Date()
    // Add a small buffer (5 minutes) to account for timezone differences and clock skew
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    const cutoffDate = new Date(now.getTime() + bufferTime)

    // Build where clause for Prisma query
    const whereClause: any = {
      publishedAt: {
        not: null,
        lte: cutoffDate
      }
    }

    // Apply tag filter if specified
    if (tag) {
      whereClause.tags = {
        contains: tag,
        mode: 'insensitive'
      }
    }

    // Get all projects that are published (publishedAt is not null and <= now + buffer)
    projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc'
      }
    })


    // Extract all unique tags
    allTags = Array.from(
      new Set(
        projects
          .flatMap(item => item.tags?.split(',').map(t => t.trim()) || [])
          .filter(Boolean)
      )
    ).sort()
  } catch (error) {
    console.error('Database error:', error)
    // Return empty arrays if database is not available
    // Check if it's a table doesn't exist error
    if (error instanceof Error && error.message.includes('does not exist')) {
      console.error('⚠️  Database tables may not exist. Run: npx prisma migrate deploy')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-medium text-gray-900 mb-12 tracking-tight uppercase">Projects</h1>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <div className="mb-8 flex gap-2 flex-wrap">
          <Link
            href="/projects"
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !tag
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/projects?tag=${encodeURIComponent(t)}`}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                tag === t
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No published projects found.</p>
          <p className="text-sm text-gray-500">Make sure projects are published in the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="block group">
              <article className="border-b border-gray-200 py-8 hover:border-gray-400 transition-all bg-white">
                {(project.imageUrl || project.videoUrl) && (
                  <div className="mb-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : project.videoUrl ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    ) : null}
                  </div>
                )}
                <h3 className="text-xl font-medium mb-3 text-gray-900 group-hover:text-gray-600 transition-colors tracking-tight">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2 font-light leading-relaxed">{project.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
                  {project.publishedAt && (
                    <time dateTime={project.publishedAt.toISOString()} className="font-light">
                      {project.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                  )}
                  {project.tags && (
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.split(',').slice(0, 3).map((tag) => (
                        <span
                          key={tag.trim()}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-sm text-xs font-light uppercase tracking-wide"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
