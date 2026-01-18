'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Content (Markdown)
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>
      {showPreview ? (
        <div className="border border-gray-300 rounded-md p-4 bg-white min-h-[400px] prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Write your article in Markdown..."
        />
      )}
      <p className="mt-2 text-sm text-gray-500">
        Tip: Use Markdown syntax. For images, use: ![alt text](/images/your-image.jpg)
      </p>
    </div>
  )
}
