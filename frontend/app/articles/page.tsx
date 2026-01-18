import { prisma } from '@/lib/db'
import ArticlesList from '@/components/ArticlesList'

interface ArticlesPageProps {
  searchParams: Promise<{ tag?: string }>
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { tag } = await searchParams
  
  const articles = await prisma.article.findMany({
    where: {
      publishedAt: {
        not: null,
        lte: new Date()
      },
      ...(tag && {
        tags: {
          contains: tag
        }
      })
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })

  // Extract all unique tags
  const allTags = Array.from(
    new Set(
      articles
        .flatMap(article => article.tags?.split(',').map(t => t.trim()) || [])
        .filter(Boolean)
    )
  ).sort()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-medium text-gray-900 mb-12 tracking-tight uppercase">Articles</h1>
      
      <ArticlesList articles={articles} allTags={allTags} selectedTag={tag || null} />
    </div>
  )
}
