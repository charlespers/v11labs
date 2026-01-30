import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import EnhancedMarkdown from '@/components/EnhancedMarkdown'
import Link from 'next/link'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug }
  })

  if (!project || !project.publishedAt || project.publishedAt > new Date()) {
    notFound()
  }

  const tagList = project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : []

  // Get related projects (same tags)
  const relatedProjects = tagList.length > 0
    ? await prisma.project.findMany({
      where: {
        id: { not: project.id },
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
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 tracking-tight leading-tight">{project.title}</h1>
          {project.description && (
            <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">{project.description}</p>
          )}
          
          {/* Media Display */}
          {(project.imageUrl || project.videoUrl) && (
            <div className="mb-6">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full rounded-lg my-8 max-w-full h-auto"
                />
              ) : project.videoUrl ? (
                <div className="aspect-video rounded-lg overflow-hidden my-8">
                  <iframe
                    src={project.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-wide">
            {project.publishedAt && (
              <time dateTime={project.publishedAt.toISOString()} className="font-light">
                {project.publishedAt.toLocaleDateString('en-US', {
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
                    href={`/projects?tag=${encodeURIComponent(tag)}`}
                    className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors font-light uppercase tracking-wide"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {project.content && (
          <div className="prose prose-lg max-w-none mb-12">
            <EnhancedMarkdown content={project.content} />
          </div>
        )}

        {relatedProjects.length > 0 && (
          <aside className="border-t border-gray-200 pt-12 mt-16">
            <h2 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">Related Projects</h2>
            <ul className="space-y-4">
              {relatedProjects.map((related) => (
                <li key={related.id}>
                  <Link
                    href={`/projects/${related.slug}`}
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
