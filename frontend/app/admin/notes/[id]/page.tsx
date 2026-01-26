import { isAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import NoteEditor from '@/components/admin/NoteEditor'
import { prisma } from '@/lib/db'

interface EditNotePageProps {
  params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  const { id } = await params
  const note = await prisma.note.findUnique({
    where: { id }
  })

  if (!note) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Note</h1>
      <NoteEditor note={note} />
    </div>
  )
}
