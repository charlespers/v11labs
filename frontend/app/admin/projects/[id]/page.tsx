import { isAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import ProjectEditor from '@/components/admin/ProjectEditor'
import { prisma } from '@/lib/db'

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id }
  })

  if (!project) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Project</h1>
      <ProjectEditor project={project} />
    </div>
  )
}
