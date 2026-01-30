import { isAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import ResearchEditor from '@/components/admin/ResearchEditor'
import { prisma } from '@/lib/db'

interface EditResearchPageProps {
  params: Promise<{ id: string }>
}

export default async function EditResearchPage({ params }: EditResearchPageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  const { id } = await params
  const research = await prisma.research.findUnique({
    where: { id }
  })

  if (!research) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Research</h1>
      <ResearchEditor research={research} />
    </div>
  )
}
