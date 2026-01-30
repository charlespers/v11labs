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

    // First, get all research with publishedAt set
    const allPublishedResearch = await prisma.research.findMany({
      where: {
        publishedAt: {
          not: null
        }
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // Filter in JavaScript to be more lenient with date comparison
    research = allPublishedResearch.filter(item => {
      if (!item.publishedAt) return false
      const publishedDate = new Date(item.publishedAt)
      // Include research published up to 5 minutes in the future (to handle timezone issues)
      return publishedDate <= cutoffDate
    })

    // Apply tag filter if specified
    if (tag) {
      research = research.filter(item =>
        item.tags?.toLowerCase().includes(tag.toLowerCase())
      )
    }

    // Sort by publishedAt descending
    research.sort((a, b) => {
      if (!a.publishedAt || !b.publishedAt) return 0
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
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

      <ArticlesList articles={articlesForList} allTags={allTags} selectedTag={tag || null} basePath="/research" />
    </div>
  )
}
