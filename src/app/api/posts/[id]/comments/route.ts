import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id)
    const body = await request.json()
    const { content, authorName, authorEmail } = body

    if (!content || !authorName) {
      return NextResponse.json(
        { error: 'Content and author name are required' },
        { status: 400 }
      )
    }

    // If database is not available, return error
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available. Comments are not supported in demo mode.' },
        { status: 503 }
      )
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorName,
        authorEmail,
        postId
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}