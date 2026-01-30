import { prisma } from '@/lib/db'
import ArticlesList from '@/components/ArticlesList'
import { Research } from '@prisma/client'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ResearchPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function ResearchPage({ searchParams }: ResearchPageProps) {
  const { tag } = await searchParams

  let research: Research[] = []
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

    // Get all research that are published (publishedAt is not null and <= now + buffer)
    research = await prisma.research.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc'
      }
    })


    // Extract all unique tags
    allTags = Array.from(
      new Set(
        research
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

  // Convert Research to Article-like format for ArticlesList component
  const articlesForList = research.map(item => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    tags: item.tags,
    publishedAt: item.publishedAt,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    content: item.content,
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-medium text-gray-900 mb-12 tracking-tight uppercase">Research</h1>

      {research.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            No published research articles found. Make sure items are published in the admin panel.
          </p>
        </div>
      )}

      <ArticlesList articles={articlesForList} allTags={allTags} selectedTag={tag || null} basePath="/research" />
    </div>
  )
}
