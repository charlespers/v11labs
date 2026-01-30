import Link from 'next/link'

interface ArticleCardProps {
  title: string
  description?: string
  slug: string
  tags?: string
  publishedAt?: Date
  basePath?: string
}

export default function ArticleCard({ title, description, slug, tags, publishedAt, basePath = '/articles' }: ArticleCardProps) {
  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

  return (
    <Link href={`${basePath}/${slug}`} className="block group">
      <article className="border-b border-gray-200 py-8 hover:border-gray-400 transition-all bg-white">
        <h3 className="text-xl font-medium mb-3 text-gray-900 group-hover:text-gray-600 transition-colors tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2 font-light leading-relaxed">{description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          {publishedAt && (
            <time dateTime={publishedAt.toISOString()} className="font-light">
              {publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          )}
          {tagList.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tagList.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-sm text-xs font-light uppercase tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
