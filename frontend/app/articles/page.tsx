import { prisma } from '@/lib/db'
import ArticlesList from '@/components/ArticlesList'
import { Article } from '@prisma/client'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ArticlesPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { tag } = await searchParams

  let articles: Article[] = []
  let allTags: string[] = []

  try {
    const now = new Date()
    // Add a small buffer (5 minutes) to account for timezone differences and clock skew
    const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
    const cutoffDate = new Date(now.getTime() + bufferTime)

    // Get all articles that are published (publishedAt is not null and <= now + buffer)
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

    articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // Extract all unique tags
    allTags = Array.from(
      new Set(
        articles
          .flatMap(article => article.tags?.split(',').map(t => t.trim()) || [])
          .filter(Boolean)
      )
    ).sort()
  } catch (error) {
    console.error('Database error:', error)
    // Return empty arrays if database is not available
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-medium text-gray-900 mb-12 tracking-tight uppercase">Articles</h1>

      <ArticlesList articles={articles} allTags={allTags} selectedTag={tag || null} />
    </div>
  )
}
