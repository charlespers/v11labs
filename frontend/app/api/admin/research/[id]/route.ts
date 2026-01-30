import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, description, content, tags, publishedAt } = body

    const existing = await prisma.research.findUnique({
      where: { slug }
    })

    if (existing && existing.id !== id) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Ensure publishedAt is set correctly - if it's in the past or very close to now, set to now
    let publishedAtValue: Date | null = null
    if (publishedAt) {
      const publishDate = new Date(publishedAt)
      const now = new Date()
      // If the date is in the past or within 1 minute of now, set to current time
      if (publishDate <= now || Math.abs(publishDate.getTime() - now.getTime()) < 60000) {
        publishedAtValue = now
      } else {
        publishedAtValue = publishDate
      }
    }

    const research = await prisma.research.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        content,
        tags,
        publishedAt: publishedAtValue,
      }
    })

    return NextResponse.json(research)
  } catch (error) {
    console.error('Error updating research:', error)
    return NextResponse.json(
      { error: 'Failed to update research' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.research.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting research:', error)
    return NextResponse.json(
      { error: 'Failed to delete research' },
      { status: 500 }
    )
  }
}
