import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

const allowed = new Set(['LIKE', 'INSIGHTFUL', 'SUPPORT'])

async function getAnonymousId() {
  const cookieStore = await cookies()
  const existing = cookieStore.get('achiki_anon_id')?.value
  if (existing) return { id: existing, fresh: false }
  return { id: crypto.randomBytes(16).toString('hex'), fresh: true }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const publicationId = Number(body?.publicationId)
  const type = String(body?.type ?? 'LIKE')

  if (!Number.isInteger(publicationId) || !allowed.has(type)) {
    return NextResponse.json({ error: 'Invalid reaction' }, { status: 400 })
  }

  const session = await getSession()
  const anonymous = await getAnonymousId()

  await prisma.publicationReaction.create({
    data: {
      publicationId,
      type,
      anonymousId: `${anonymous.id}-${crypto.randomBytes(6).toString('hex')}`,
      userId: session?.userId ?? null,
    },
  })

  const reactions = await prisma.publicationReaction.groupBy({
    by: ['type'],
    where: { publicationId },
    _count: { type: true },
  })

  const response = NextResponse.json({
    reactionCounts: reactions.map((reaction) => ({
      type: reaction.type,
      count: reaction._count.type,
    })),
  })

  if (anonymous.fresh) {
    response.cookies.set('achiki_anon_id', anonymous.id, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }

  return response
}
