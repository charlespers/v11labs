import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import EnhancedMarkdown from '@/components/EnhancedMarkdown'
import Link from 'next/link'

interface WebsitePageProps {
  params: Promise<{ slug: string }>
}

export default async function WebsitePage({ params }: WebsitePageProps) {
  const { slug } = await params

  const website = await prisma.website.findUnique({
    where: { slug }
  })

  if (!website || !website.publishedAt || website.publishedAt > new Date()) {
    notFound()
  }

  const tagList = website.tags ? website.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  // Get related websites (same tags)
  const relatedWebsites = tagList.length > 0
    ? await prisma.website.findMany({
      where: {
        id: { not: website.id },
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
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 tracking-tight leading-tight">{website.title}</h1>
          {website.description && (
            <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">{website.description}</p>
          )}
          
          {/* Media Display */}
          {(website.imageUrl || website.videoUrl) && (
            <div className="mb-6">
              {website.imageUrl ? (
                <img
                  src={website.imageUrl}
                  alt={website.title}
                  className="w-full rounded-lg my-8 max-w-full h-auto"
                />
              ) : website.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden my-8">
                  <iframe
                    src={website.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-wide">
            {website.publishedAt && (
              <time dateTime={website.publishedAt.toISOString()} className="font-light">
                {website.publishedAt.toLocaleDateString('en-US', {
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
                    href={`/websites?tag=${encodeURIComponent(tag)}`}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors font-light uppercase tracking-wide"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {website.content && (
          <div className="prose prose-lg max-w-none mb-12">
            <EnhancedMarkdown content={website.content} />
          </div>
        )}

        {relatedWebsites.length > 0 && (
          <aside className="border-t border-gray-200 pt-12 mt-16">
            <h2 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">Related Websites</h2>
            <ul className="space-y-4">
              {relatedWebsites.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/websites/${related.slug}`}
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
