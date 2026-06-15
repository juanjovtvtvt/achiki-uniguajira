'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

async function resolveCommentUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
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

export async function addComment(slug: string, publicationId: number, formData: FormData) {
  const session = await getSession()
  const content = String(formData.get('content') ?? '').trim()

  if (!session) {
    redirect(`/login?next=/articulos/${slug}`)
  }

  if (content.length < 2 || content.length > 800) {
    redirect(`/articulos/${slug}?comment=invalid#comentarios`)
  }

  const [publication, user] = await Promise.all([
    prisma.publication.findUnique({
      where: { id: publicationId },
      select: { id: true },
    }),
    resolveCommentUser(session),
  ])

  if (!publication) {
    redirect('/?comment=missing')
  }

  if (!user) {
    redirect(`/login?next=/articulos/${slug}`)
  }

  await prisma.comment.create({
    data: {
      publicationId: publication.id,
      userId: user.id,
      content,
      status: 'PUBLISHED',
    },
  })

  revalidatePath(`/articulos/${slug}`)
  redirect(`/articulos/${slug}?comment=1#comentarios`)
}
