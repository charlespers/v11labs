import { prisma } from '@/lib/db'
import Link from 'next/link'
import type { Note } from '@prisma/client'

interface NotesPageProps {
  searchParams: Promise<{ tag?: string; search?: string }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { tag, search } = await searchParams
  
  let notes: Note[] = []
  let allTags: string[] = []
  
  try {
    const where: any = {}
    
    if (tag) {
      where.tags = {
        contains: tag,
        mode: 'insensitive'
      }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    notes = await prisma.note.findMany({
      where,
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Extract all unique tags
    allTags = Array.from(
      new Set(
        notes
          .flatMap(note => note.tags?.split(',').map(t => t.trim()) || [])
          .filter(Boolean)
      )
    ).sort()
  } catch (error) {
    console.error('Database error:', error)
    notes = []
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
        <Link
          href="/admin/notes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Note
        </Link>
      </div>

      {/* Search and Filter */}
      <form method="get" className="mb-6 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search notes..."
            defaultValue={search || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Search
        </button>
        {search && (
          <Link
            href="/admin/notes"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear
          </Link>
        )}
      </form>
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/admin/notes"
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                !tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/admin/notes?tag=${encodeURIComponent(t)}`}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  tag === t
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notes.map((note) => (
              <tr key={note.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{note.title}</div>
                </td>
                <td className="px-6 py-4">
                  {note.isPublic ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Public
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Private
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {note.tags || '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {note.updatedAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <Link
                    href={`/admin/notes/${note.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notes.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No notes found. Create your first note!
          </div>
        )}
      </div>
    </div>
  )
}
