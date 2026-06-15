import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

const allowed = new Set(['LIKE', 'INSIGHTFUL', 'SUPPORT'])
const reactionTypes = ['LIKE', 'INSIGHTFUL', 'SUPPORT'] as const

async function resolveReactionUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  if (session.userId) {
    const existing = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    })
    if (existing) return existing
  }

  if (!session.email) return null

  return prisma.user.upsert({
    where: { email: session.email.toLowerCase() },
    create: {
      name: session.name || session.email,
      email: session.email.toLowerCase(),
      role: session.role || 'READER',
      status: 'ACTIVE',
      authProvider: session.provider || 'credentials',
      publicSignature: session.name || session.email,
      lastLoginAt: new Date(),
    },
    update: {
      name: session.name || undefined,
      status: 'ACTIVE',
      lastLoginAt: new Date(),
    },
    select: { id: true },
  })
}

function normalizeCounts(reactions: { type: string; _count: { type: number } }[]) {
  return reactionTypes.map((type) => ({
    type,
    count: reactions.find((reaction) => reaction.type === type)?._count.type ?? 0,
  }))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const publicationId = Number(body?.publicationId)
  const type = String(body?.type ?? 'LIKE')

  if (!Number.isInteger(publicationId) || !allowed.has(type)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 })
  }

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  const publication = await prisma.publication.findUnique({
    where: { id: publicationId },
    select: { id: true },
  })

  if (!publication) {
    return NextResponse.json({ error: 'Publication not found' }, { status: 404 })
  }

  const user = await resolveReactionUser(session)
  if (!user) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  try {
    await prisma.publicationReaction.upsert({
      where: {
        publicationId_userId: {
          publicationId,
          userId: user.id,
        },
      },
      create: {
        publicationId,
        type,
        userId: user.id,
      },
      update: {
        type,
      },
    })
  } catch (error) {
    console.error('Could not save publication reaction', error)
    return NextResponse.json({ error: 'No fue posible guardar la reaccion.' }, { status: 500 })
  }

  const reactions = await prisma.publicationReaction.groupBy({
    by: ['type'],
    where: { publicationId },
    _count: { type: true },
  })

  return NextResponse.json({
    myReaction: type,
    reactionCounts: normalizeCounts(reactions),
  })
}
