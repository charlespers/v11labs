import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NoteEditor from '@/components/admin/NoteEditor'

export default async function NewNotePage() {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Note</h1>
      <NoteEditor />
    </div>
  )
}
