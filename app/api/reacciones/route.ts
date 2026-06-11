import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

const allowed = new Set(['LIKE', 'INSIGHTFUL', 'SUPPORT'])

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const publicationId = Number(body?.publicationId)
  const type = String(body?.type ?? 'LIKE')

  if (!Number.isInteger(publicationId) || !allowed.has(type)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 })
  }

  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  await prisma.publicationReaction.upsert({
    where: {
      publicationId_userId: {
        publicationId,
        userId: session.userId,
      },
    },
    create: {
      publicationId,
      type,
      userId: session.userId,
    },
    update: {
      type,
    },
  })

  const reactions = await prisma.publicationReaction.groupBy({
    by: ['type'],
    where: { publicationId },
    _count: { type: true },
  })

  return NextResponse.json({
    myReaction: type,
    reactionCounts: reactions.map((reaction) => ({
      type: reaction.type,
      count: reaction._count.type,
    })),
  })
}
