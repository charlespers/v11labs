'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ArticleCard from './ArticleCard'
import TagFilter from './TagFilter'

interface Article {
  id: string
  title: string
  slug: string
  description: string | null
  tags: string | null
  publishedAt: Date | null
}

interface ArticlesListProps {
  articles: Article[]
  allTags: string[]
  selectedTag: string | null
  basePath?: string
}

export default function ArticlesList({ articles, allTags, selectedTag, basePath = '/articles' }: ArticlesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTagSelect = (tag: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tag) {
      params.set('tag', tag)
    } else {
      params.delete('tag')
    }
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <>
      <TagFilter 
        tags={allTags} 
        selectedTag={selectedTag} 
        onTagSelect={handleTagSelect} 
      />
      
      {articles.length === 0 ? (
        <p className="text-gray-600 text-center py-12">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.description || undefined}
              slug={article.slug}
              tags={article.tags || undefined}
              publishedAt={article.publishedAt || undefined}
              basePath={basePath}
            />
          ))}
        </div>
      )}
    </>
  )
}
