import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import EnhancedMarkdown from '@/components/EnhancedMarkdown'
import Link from 'next/link'

interface ResearchPageProps {
  params: Promise<{ slug: string }>
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { slug } = await params

  const research = await prisma.research.findUnique({
    where: { slug }
  })

  if (!research || !research.publishedAt || research.publishedAt > new Date()) {
    notFound()
  }

  const tagList = research.tags ? research.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  // Get related research (same tags)
  const relatedResearch = tagList.length > 0
    ? await prisma.research.findMany({
      where: {
        id: { not: research.id },
        publishedAt: { not: null, lte: new Date() },
        tags: {
          contains: tagList[0]
        }
      },
      take: 3,
      orderBy: {
        publishedAt: 'desc'
      }
    })
    : []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <header className="mb-12 border-b border-gray-200 pb-8">
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 tracking-tight leading-tight">{research.title}</h1>
          {research.description && (
            <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">{research.description}</p>
          )}
          <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-wide">
            {research.publishedAt && (
              <time dateTime={research.publishedAt.toISOString()} className="font-light">
                {research.publishedAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
            {tagList.length > 0 && (
              <div className="flex gap-2">
                {tagList.map((tag) => (
                  <Link
                    key={tag}
                    href={`/research?tag=${encodeURIComponent(tag)}`}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors font-light uppercase tracking-wide"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12">
          <EnhancedMarkdown content={research.content} />
        </div>

        {relatedResearch.length > 0 && (
          <aside className="border-t border-gray-200 pt-12 mt-16">
            <h2 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">Related Research</h2>
            <ul className="space-y-4">
              {relatedResearch.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/research/${related.slug}`}
                    className="text-gray-900 hover:text-gray-600 transition-colors font-light"
                  >
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </div>
  )
}
