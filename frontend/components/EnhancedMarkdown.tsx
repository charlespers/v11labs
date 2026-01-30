'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

interface EnhancedMarkdownProps {
  content: string
  className?: string
}

export default function EnhancedMarkdown({ content, className = '' }: EnhancedMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (!inline && language) {
              return (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={language}
                  PreTag="div"
                  className="rounded-lg my-4"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              )
            }
            
            // Inline code
            return (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props}>
                {children}
              </code>
            )
          },
          // Images with Imgur URL conversion
          img: ({ node, ...props }: any) => {
            let src = props.src || ''
            if (src.includes('imgur.com/') && !src.includes('i.imgur.com')) {
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
          },
          // Enhanced table styling
          table: ({ node, ...props }: any) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" {...props} />
            </div>
          ),
          th: ({ node, ...props }: any) => (
            <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b border-gray-300" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
