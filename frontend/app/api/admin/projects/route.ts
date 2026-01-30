import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, description, content, imageUrl, videoUrl, tags, publishedAt } = body

    const existing = await prisma.project.findUnique({
      where: { slug }
    })

    if (existing) {
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

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        tags,
        publishedAt: publishedAtValue,
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
