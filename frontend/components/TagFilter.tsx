'use client'

interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-12">
      <button
        onClick={() => onTagSelect(null)}
        className={`px-4 py-2 text-xs font-light uppercase tracking-wide transition-colors border ${
          selectedTag === null
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-4 py-2 text-xs font-light uppercase tracking-wide transition-colors border ${
            selectedTag === tag
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
