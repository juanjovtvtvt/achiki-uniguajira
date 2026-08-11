'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { hashPassword, requireAdmin } from '@/lib/auth'

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function numberValue(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? '').trim()
  if (!raw) return null

  const value = Number(raw)
  return Number.isFinite(value) ? value : null
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(base: string, ignoreId?: number) {
  let candidate = base || 'publicacion'
  let suffix = 2

  while (true) {
    const existing = await prisma.publication.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing || existing.id === ignoreId) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

function normalizeStatus(value: string) {
  const allowed = new Set(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'])
  return allowed.has(value) ? value : 'DRAFT'
}

export async function createArticle(formData: FormData) {
  await requireAdmin()

  const title = text(formData, 'title')
  const summary = text(formData, 'summary')
  const content = text(formData, 'content')
  const imageUrl = text(formData, 'imageUrl') || '/placeholder.jpg'
  const authorId = numberValue(formData, 'authorId')
  const categoryId = numberValue(formData, 'categoryId')
  const status = normalizeStatus(text(formData, 'status'))
  const featured = formData.get('featured') === 'on'
  const slug = await uniqueSlug(slugify(text(formData, 'slug') || title))

  if (!title || !summary || !authorId || !categoryId) {
    throw new Error('Faltan campos obligatorios para crear el articulo.')
  }

  await prisma.publication.create({
    data: {
      title,
      slug,
      summary,
      content,
      authorId,
      categoryId,
      type: 'ARTICLE',
      status,
      featured,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      images: {
        create: {
          url: imageUrl,
          description: title,
          isPrimary: true,
        },
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
  redirect('/admin/articulos')
}

export async function updateArticle(id: number, formData: FormData) {
  await requireAdmin()

  const title = text(formData, 'title')
  const summary = text(formData, 'summary')
  const content = text(formData, 'content')
  const imageUrl = text(formData, 'imageUrl') || '/placeholder.jpg'
  const authorId = numberValue(formData, 'authorId')
  const categoryId = numberValue(formData, 'categoryId')
  const status = normalizeStatus(text(formData, 'status'))
  const featured = formData.get('featured') === 'on'
  const slug = await uniqueSlug(slugify(text(formData, 'slug') || title), id)

  if (!title || !summary || !authorId || !categoryId) {
    throw new Error('Faltan campos obligatorios para actualizar el articulo.')
  }

  const current = await prisma.publication.findUnique({
    where: { id },
    select: { publishedAt: true },
  })

  await prisma.publication.update({
    where: { id },
    data: {
      title,
      slug,
      summary,
      content,
      authorId,
      categoryId,
      status,
      featured,
      publishedAt: status === 'PUBLISHED' ? current?.publishedAt ?? new Date() : null,
    },
  })

  const primaryImage = await prisma.publicationImage.findFirst({
    where: { publicationId: id, isPrimary: true },
    select: { id: true },
  })

  if (primaryImage) {
    await prisma.publicationImage.update({
      where: { id: primaryImage.id },
      data: { url: imageUrl, description: title },
    })
  } else {
    await prisma.publicationImage.create({
      data: {
        publicationId: id,
        url: imageUrl,
        description: title,
        isPrimary: true,
      },
    })
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
  revalidatePath(`/articulos/${slug}`)
  redirect('/admin/articulos')
}

export async function deleteComment(id: number, publicationId: number) {
  await requireAdmin()

  const publication = await prisma.publication.findUnique({
    where: { id: publicationId },
    select: { slug: true },
  })

  await prisma.comment.deleteMany({
    where: { id, publicationId },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
  revalidatePath(`/admin/articulos/${publicationId}/editar`)

  if (publication) {
    revalidatePath(`/articulos/${publication.slug}`)
  }
}

export async function setArticleStatus(id: number, status: string) {
  await requireAdmin()

  const normalized = normalizeStatus(status)

  await prisma.publication.update({
    where: { id },
    data: {
      status: normalized,
      publishedAt: normalized === 'PUBLISHED' ? new Date() : null,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
}

export async function deleteArticle(id: number) {
  await requireAdmin()

  await prisma.publication.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/articulos')
}

export async function createCategory(formData: FormData) {
  await requireAdmin()

  const name = text(formData, 'name')
  const slug = await uniqueCategorySlug(slugify(text(formData, 'slug') || name))

  if (!name) {
    throw new Error('El nombre de la categoria es obligatorio.')
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      colorClass: 'text-primary border-primary',
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/categorias')
  redirect('/admin/categorias')
}

export async function updateCategory(id: number, formData: FormData) {
  await requireAdmin()

  const name = text(formData, 'name')
  const slug = await uniqueCategorySlug(slugify(text(formData, 'slug') || name), id)

  if (!name) {
    throw new Error('El nombre de la categoria es obligatorio.')
  }

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/categorias')
  revalidatePath(`/categorias/${slug}`)
  redirect('/admin/categorias')
}

export async function deleteCategory(id: number) {
  await requireAdmin()

  const related = await prisma.publication.count({
    where: { categoryId: id },
  })

  if (related > 0) {
    throw new Error('No se puede eliminar una categoria con publicaciones asociadas.')
  }

  await prisma.category.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/categorias')
}

export async function createEvent(formData: FormData) {
  await requireAdmin()

  const title = text(formData, 'title')
  const slug = await uniqueEventSlug(slugify(text(formData, 'slug') || title))
  const description = text(formData, 'description')
  const location = text(formData, 'location')
  const startsAt = text(formData, 'startsAt')
  const endsAt = text(formData, 'endsAt')

  if (!title || !startsAt) {
    throw new Error('Titulo y fecha de inicio son obligatorios.')
  }

  await prisma.event.create({
    data: {
      title,
      slug,
      description,
      location,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  redirect('/admin/eventos')
}

export async function updateEvent(id: number, formData: FormData) {
  await requireAdmin()

  const title = text(formData, 'title')
  const slug = await uniqueEventSlug(slugify(text(formData, 'slug') || title), id)
  const description = text(formData, 'description')
  const location = text(formData, 'location')
  const startsAt = text(formData, 'startsAt')
  const endsAt = text(formData, 'endsAt')

  if (!title || !startsAt) {
    throw new Error('Titulo y fecha de inicio son obligatorios.')
  }

  await prisma.event.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      location,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : null,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
  revalidatePath(`/eventos/${slug}`)
  redirect('/admin/eventos')
}

export async function deleteEvent(id: number) {
  await requireAdmin()

  await prisma.event.delete({
    where: { id },
  })

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/eventos')
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const name = text(formData, 'name')
  const email = text(formData, 'email').toLowerCase()
  const role = normalizeRole(text(formData, 'role'))
  const programId = numberValue(formData, 'programId')
  const publicSignature = text(formData, 'publicSignature') || name
  const password = String(formData.get('password') ?? '')

  if (!name || !email) {
    throw new Error('Nombre y correo son obligatorios.')
  }

  await prisma.user.create({
    data: {
      name,
      email,
      role,
      programId,
      publicSignature,
      status: 'ACTIVE',
      passwordHash: password ? hashPassword(password) : null,
      authProvider: password ? 'credentials' : 'credentials',
    },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

export async function updateUser(id: number, formData: FormData) {
  await requireAdmin()

  const name = text(formData, 'name')
  const email = text(formData, 'email').toLowerCase()
  const role = normalizeRole(text(formData, 'role'))
  const programId = numberValue(formData, 'programId')
  const publicSignature = text(formData, 'publicSignature') || name
  const status = text(formData, 'status') === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
  const password = String(formData.get('password') ?? '')

  if (!name || !email) {
    throw new Error('Nombre y correo son obligatorios.')
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      programId,
      publicSignature,
      status,
      ...(password ? { passwordHash: hashPassword(password), authProvider: 'credentials' } : {}),
    },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

export async function deleteUser(id: number) {
  const session = await requireAdmin()

  if (session.userId === id) {
    throw new Error('No puedes eliminar la cuenta con la que tienes la sesion activa.')
  }

  const replacement = await prisma.user.findFirst({
    where: {
      id: { not: id },
      role: { in: ['ADMIN', 'EDITOR'] },
      status: 'ACTIVE',
    },
    orderBy: { id: 'asc' },
    select: { id: true },
  })

  const fallbackAuthor = replacement ?? (await prisma.user.upsert({
    where: { email: 'archivo@achiki.local' },
    create: {
      name: 'Archivo ACHIKI',
      email: 'archivo@achiki.local',
      role: 'ADMIN',
      status: 'ACTIVE',
      publicSignature: 'Archivo ACHIKI',
      authProvider: 'credentials',
    },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    select: { id: true },
  }))

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { userId: id } }),
    prisma.publicationReaction.deleteMany({ where: { userId: id } }),
    prisma.pollVote.deleteMany({ where: { userId: id } }),
    prisma.eventRegistration.deleteMany({ where: { userId: id } }),
    prisma.publication.updateMany({
      where: { authorId: id },
      data: { authorId: fallbackAuthor.id },
    }),
    prisma.user.delete({ where: { id } }),
  ])

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/usuarios')
  revalidatePath('/admin/articulos')
}

export async function setSubscriberActive(id: number, active: boolean) {
  await requireAdmin()

  await prisma.subscriber.update({
    where: { id },
    data: { active },
  })

  revalidatePath('/admin')
  revalidatePath('/admin/suscriptores')
}

export async function deleteSubscriber(id: number) {
  await requireAdmin()

  await prisma.subscriber.delete({ where: { id } })
  revalidatePath('/admin')
  revalidatePath('/admin/suscriptores')
}

async function uniqueCategorySlug(base: string, ignoreId?: number) {
  let candidate = base || 'categoria'
  let suffix = 2

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing || existing.id === ignoreId) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

async function uniqueEventSlug(base: string, ignoreId?: number) {
  let candidate = base || 'evento'
  let suffix = 2

  while (true) {
    const existing = await prisma.event.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing || existing.id === ignoreId) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}

function normalizeRole(value: string) {
  const allowed = new Set(['READER', 'AUTHOR', 'EDITOR', 'ADMIN'])
  return allowed.has(value) ? value : 'READER'
}
