'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { createSession, getSession, requireSession } from '@/lib/auth'

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(base: string) {
  let candidate = base || 'publicacion'
  let suffix = 2

  while (await prisma.publication.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }

  return candidate
}

async function resolveProfileUser(session: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  if (session.userId) {
    const existing = await prisma.user.findUnique({
      where: { id: session.userId },
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
  })
}

export async function submitPublication(formData: FormData) {
  const session = await requireSession()
  const title = text(formData, 'title')
  const summary = text(formData, 'summary')
  const content = text(formData, 'content')
  const categoryId = Number(formData.get('categoryId'))

  if (!session.userId || !title || !summary || !content || !Number.isInteger(categoryId)) {
    redirect('/cuenta/enviar?error=1')
  }

  const slug = await uniqueSlug(slugify(title))

  await prisma.publication.create({
    data: {
      authorId: session.userId,
      categoryId,
      type: 'ARTICLE',
      title,
      slug,
      summary,
      content,
      status: 'REVIEW',
      featured: false,
    },
  })

  revalidatePath('/cuenta')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
  redirect('/cuenta?sent=1')
}

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  const name = text(formData, 'name')
  const avatarUrl = text(formData, 'avatarUrl')
  const avatarFile = formData.get('avatarFile')
  const bio = text(formData, 'bio')

  if (!session) {
    redirect('/login?next=/cuenta')
  }

  if (name.length < 2) {
    redirect('/cuenta?profile=invalid')
  }

  const currentUser = await resolveProfileUser(session)
  if (!currentUser) {
    redirect('/login?next=/cuenta')
  }

  let storedAvatarUrl = avatarUrl || currentUser.avatarUrl || null

  if (avatarUrl && !/^https?:\/\/\S+\.\S+/i.test(avatarUrl)) {
    redirect('/cuenta?profile=url')
  }

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(avatarFile.type) || avatarFile.size > 900_000) {
      redirect('/cuenta?profile=image')
    }

    const bytes = Buffer.from(await avatarFile.arrayBuffer())
    storedAvatarUrl = `data:${avatarFile.type};base64,${bytes.toString('base64')}`
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name,
      publicSignature: name,
      avatarUrl: storedAvatarUrl,
      bio: bio || null,
    },
  })

  await createSession({
    userId: user.id,
    username: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    provider: user.authProvider,
  })

  revalidatePath('/cuenta')
  revalidatePath('/')
  redirect('/cuenta?profile=1')
}
