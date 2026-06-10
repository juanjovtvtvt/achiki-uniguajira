'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireSession } from '@/lib/auth'

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
