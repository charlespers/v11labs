'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import 'katex/dist/katex.min.css'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
}

type ViewMode = 'edit' | 'preview' | 'split'

export default function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(content.length)
  }, [content])

  // Insert text at cursor position
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newContent =
      content.substring(0, start) +
      before +
      textToInsert +
      after +
      content.substring(end)

    onChange(newContent)

    // Set cursor position after inserted text
    setTimeout(() => {
      const newPosition = start + before.length + textToInsert.length + after.length
      textarea.focus()
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  // Insert text at the beginning of the current line
  const insertAtLineStart = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const lines = content.substring(0, start).split('\n')
    const currentLineIndex = lines.length - 1
    const currentLine = lines[currentLineIndex]
    const lineStart = start - currentLine.length

    const newContent =
      content.substring(0, lineStart) +
      text +
      content.substring(lineStart)

    onChange(newContent)

    setTimeout(() => {
      const newPosition = start + text.length
      textarea.focus()
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  // Insert table
  const insertTable = () => {
    const table = '\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n'
    insertText(table, '')
  }

  // Insert checkbox list
  const insertCheckbox = () => {
    insertAtLineStart('- [ ] ')
  }

  const toolbarButtons = [
    {
      group: 'Headings',
      buttons: [
        {
          label: 'H1',
          title: 'Heading 1 (Ctrl+1)',
          onClick: () => insertText('# ', '', 'Heading 1'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12M6 12h12M6 19h12" />
            </svg>
          ),
        },
        {
          label: 'H2',
          title: 'Heading 2 (Ctrl+2)',
          onClick: () => insertText('## ', '', 'Heading 2'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12M6 12h12" />
            </svg>
          ),
        },
        {
          label: 'H3',
          title: 'Heading 3 (Ctrl+3)',
          onClick: () => insertText('### ', '', 'Heading 3'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5h12M6 12h12" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Formatting',
      buttons: [
        {
          label: 'Bold',
          title: 'Bold (Ctrl+B)',
          onClick: () => insertText('**', '**', 'bold text'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            </svg>
          ),
          className: 'font-bold',
        },
        {
          label: 'Italic',
          title: 'Italic (Ctrl+I)',
          onClick: () => insertText('*', '*', 'italic text'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          className: 'italic',
        },
        {
          label: 'Strikethrough',
          title: 'Strikethrough',
          onClick: () => insertText('~~', '~~', 'strikethrough text'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          ),
          className: 'line-through',
        },
      ],
    },
    {
      group: 'Links',
      buttons: [
        {
          label: 'Link',
          title: 'Insert Link (Ctrl+K)',
          onClick: () => insertText('[', '](url)', 'link text'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
        },
        {
          label: 'Image',
          title: 'Insert Image',
          onClick: () => insertText('![', '](image-url)', 'alt text'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Lists',
      buttons: [
        {
          label: 'Bullet List',
          title: 'Bullet List',
          onClick: () => insertAtLineStart('- '),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ),
        },
        {
          label: 'Numbered List',
          title: 'Numbered List',
          onClick: () => insertAtLineStart('1. '),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          ),
        },
        {
          label: 'Checkbox',
          title: 'Checkbox List',
          onClick: insertCheckbox,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      group: 'Other',
      buttons: [
        {
          label: 'Quote',
          title: 'Blockquote',
          onClick: () => insertAtLineStart('> '),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          ),
        },
        {
          label: 'Code',
          title: 'Inline Code',
          onClick: () => insertText('`', '`', 'code'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          className: 'font-mono',
        },
        {
          label: 'Code Block',
          title: 'Code Block',
          onClick: () => insertText('```\n', '\n```', 'code'),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          className: 'font-mono',
        },
        {
          label: 'Table',
          title: 'Insert Table',
          onClick: insertTable,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          ),
        },
        {
          label: 'Divider',
          title: 'Horizontal Rule',
          onClick: () => insertText('\n---\n', ''),
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          ),
        },
      ],
    },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && textareaRef.current) {
        switch (e.key) {
          case 'b':
            e.preventDefault()
            insertText('**', '**', 'bold text')
            break
          case 'i':
            e.preventDefault()
            insertText('*', '*', 'italic text')
            break
          case 'k':
            e.preventDefault()
            insertText('[', '](url)', 'link text')
            break
          case '1':
            e.preventDefault()
            insertText('# ', '', 'Heading 1')
            break
          case '2':
            e.preventDefault()
            insertText('## ', '', 'Heading 2')
            break
          case '3':
            e.preventDefault()
            insertText('### ', '', 'Heading 3')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [content])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Content (Markdown)
        </label>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-500">
            {wordCount} words • {charCount} chars
          </div>
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === 'edit'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs font-medium transition-colors border-x border-gray-300 ${viewMode === 'split'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {viewMode !== 'preview' && (
        <div className="border border-gray-300 rounded-t-md bg-gradient-to-r from-gray-50 to-gray-100 p-2">
          <div className="flex flex-wrap gap-2">
            {toolbarButtons.map((group, groupIndex) => (
              <div key={group.group} className="flex items-center gap-2">
                {group.buttons.map((button) => (
                  <button
                    key={button.label}
                    type="button"
                    onClick={button.onClick}
                    title={button.title}
                    className={`px-2.5 py-1.5 text-xs border border-gray-300 rounded-md bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all shadow-sm ${button.className || ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {button.icon}
                      <span className="hidden sm:inline">{button.label}</span>
                    </span>
                  </button>
                ))}
                {groupIndex < toolbarButtons.length - 1 && (
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`grid ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-4 border border-gray-300 ${viewMode === 'preview' ? 'rounded-md' : viewMode === 'edit' ? 'rounded-b-md' : 'rounded-b-md'}`}>
        {viewMode !== 'preview' && (
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChange(e.target.value)}
              rows={25}
              className={`w-full px-4 py-3 border-0 font-mono text-sm focus:outline-none focus:ring-0 resize-none ${viewMode === 'split' ? 'border-r border-gray-300' : ''}`}
              placeholder="Start writing your article... Use the toolbar above or keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)"
            />
            {viewMode === 'split' && (
              <div className="absolute top-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                Markdown
              </div>
            )}
          </div>
        )}

        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="relative bg-white min-h-[400px] p-6 overflow-y-auto">
            {viewMode === 'split' && (
              <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                Preview
              </div>
            )}
            <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:font-bold">
              {content ? (
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
                          className="rounded-lg my-4 max-w-full h-auto"
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
              ) : (
                <p className="text-gray-400 italic">Preview will appear here...</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <span>💡 <strong>Tip:</strong> Select text and click a button to format, or use keyboard shortcuts</span>
          </div>
          <div className="flex gap-2">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+B</kbd>
            <span>Bold</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+I</kbd>
            <span>Italic</span>
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Ctrl+K</kbd>
            <span>Link</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-blue-800">
            <strong>📸 Image Tip:</strong> For Imgur images, use the direct URL format: <code className="bg-blue-100 px-1 rounded">https://i.imgur.com/IMAGE_ID.jpg</code>.
            If you paste an Imgur page URL (like <code className="bg-blue-100 px-1 rounded">imgur.com/KaXwgz8</code>), it will be automatically converted!
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-md px-3 py-2 text-purple-800">
            <strong>💻 Code Blocks:</strong> Use triple backticks with language name for syntax highlighting: <code className="bg-purple-100 px-1 rounded">```javascript</code> or <code className="bg-purple-100 px-1 rounded">```python</code>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-green-800">
            <strong>🔢 LaTeX Math:</strong> Use <code className="bg-green-100 px-1 rounded">$...$</code> for inline math and <code className="bg-green-100 px-1 rounded">$$...$$</code> for block math equations.
          </div>
        </div>
      </div>
    </div>
  )
}
