import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug }
  })

  if (!article || !article.publishedAt || article.publishedAt > new Date()) {
    notFound()
  }

  const tagList = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  // Get related articles (same tags)
  const relatedArticles = tagList.length > 0
    ? await prisma.article.findMany({
      where: {
        id: { not: article.id },
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
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 tracking-tight leading-tight">{article.title}</h1>
          {article.description && (
            <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">{article.description}</p>
          )}
          <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-wide">
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()} className="font-light">
                {article.publishedAt.toLocaleDateString('en-US', {
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
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => {
                // Convert Imgur page URLs to direct image URLs
                let src = props.src || ''
                if (src.includes('imgur.com/') && !src.includes('i.imgur.com')) {
                  // Extract the image ID from imgur.com/ID or imgur.com/a/ID
                  const match = src.match(/imgur\.com\/(?:a\/)?([a-zA-Z0-9]+)/)
                  if (match && match[1]) {
                    src = `https://i.imgur.com/${match[1]}.jpg`
                  }
                }
                return (
                  <img
                    {...props}
                    src={src}
                    alt={props.alt || ''}
                    className="rounded-lg my-8 max-w-full h-auto"
                    loading="lazy"
                  />
                )
              }
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {relatedArticles.length > 0 && (
          <aside className="border-t border-gray-200 pt-12 mt-16">
            <h2 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">Related Articles</h2>
            <ul className="space-y-4">
              {relatedArticles.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/articles/${related.slug}`}
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
