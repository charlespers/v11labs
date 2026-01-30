import { isAuthenticated } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import WebsiteEditor from '@/components/admin/WebsiteEditor'
import { prisma } from '@/lib/db'

interface EditWebsitePageProps {
  params: Promise<{ id: string }>
}

export default async function EditWebsitePage({ params }: EditWebsitePageProps) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  const { id } = await params
  const website = await prisma.website.findUnique({
    where: { id }
  })

  if (!website) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Website</h1>
      <WebsiteEditor website={website} />
    </div>
  )
}
