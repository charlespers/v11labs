'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownEditor from './MarkdownEditor'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  description: string | null
  tags: string | null
  publishedAt: Date | null
}

interface ArticleEditorProps {
  article?: Article
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [description, setDescription] = useState(article?.description || '')
  const [content, setContent] = useState(article?.content || '')
  const [tags, setTags] = useState(article?.tags || '')
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : ''
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const isPublished = article?.publishedAt && new Date(article.publishedAt) <= new Date()
  const articleUrl = article && slug ? `/articles/${slug}` : null

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  useEffect(() => {
    if (!article && title) {
      setSlug(generateSlug(title))
    }
  }, [title, article])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url = article ? `/api/admin/articles/${article.id}` : '/api/admin/articles'
      const method = article ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description: description || null,
          content,
          tags: tags || null,
          publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save article')
      }

      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSaving(false)
    }
  }

  const handleUnpublish = () => {
    if (confirm('Are you sure you want to unpublish this article? It will become a draft.')) {
      setPublishedAt('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isPublished && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">This article is published</span>
            {articleUrl && (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-900 underline ml-2 text-sm"
              >
                View Article →
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={handleUnpublish}
            className="text-sm px-3 py-1 bg-white border border-green-300 text-green-700 rounded hover:bg-green-100"
          >
            Unpublish
          </button>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug *
        </label>
        <input
          id="slug"
          type="text"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="gpu, hardware, tech"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
            Publish Date
          </label>
          {isPublished && (
            <span className="text-xs text-gray-500">
              Published: {article?.publishedAt ? new Date(article.publishedAt).toLocaleString() : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {publishedAt && (
            <button
              type="button"
              onClick={() => setPublishedAt('')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              title="Clear publish date to save as draft"
            >
              Save as Draft
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {publishedAt 
            ? 'Article will be published at the selected date/time' 
            : 'Leave empty to save as draft. You can publish later.'}
        </p>
      </div>

      <MarkdownEditor content={content} onChange={setContent} />

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {article ? 'Editing published article' : 'Creating new article'}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving...' : isPublished ? 'Update Published Article' : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  )
}
