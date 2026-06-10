import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getAnonymousId() {
  const cookieStore = await cookies()
  const existing = cookieStore.get('achiki_anon_id')?.value
  if (existing) return { id: existing, fresh: false }
  return { id: crypto.randomBytes(16).toString('hex'), fresh: true }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const pollId = Number(body?.pollId)
  const optionId = Number(body?.optionId)

  if (!Number.isInteger(pollId) || !Number.isInteger(optionId)) {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
  }

  const option = await prisma.pollOption.findFirst({
    where: { id: optionId, pollId },
    select: { id: true },
  })

  if (!option) {
    return NextResponse.json({ error: 'Invalid option' }, { status: 400 })
  }

  const session = await getSession()
  const anonymous = await getAnonymousId()

  await prisma.pollVote.upsert({
    where: {
      pollId_anonymousId: {
        pollId,
        anonymousId: anonymous.id,
      },
    },
    create: {
      pollId,
      optionId,
      anonymousId: anonymous.id,
      userId: session?.userId ?? null,
    },
    update: {
      optionId,
      userId: session?.userId ?? null,
    },
  })

  const options = await prisma.pollOption.findMany({
    where: { pollId },
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: { id: 'asc' },
  })

  const response = NextResponse.json({
    options: options.map((pollOption) => ({
      id: pollOption.id,
      label: pollOption.label,
      votes: pollOption._count.votes,
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
