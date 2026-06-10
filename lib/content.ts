import { prisma } from '@/lib/db'
import type { Article, Column, EventItem } from '@/lib/articles'

function formatDate(date?: Date | null) {
  if (!date) return ''
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

const publicationInclude = {
  author: {
    include: {
      program: true,
    },
  },
  category: true,
  images: {
    orderBy: [{ isPrimary: 'desc' as const }, { id: 'asc' as const }],
  },
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { id: 'asc' },
  })
}

export async function getArticles(): Promise<Article[]> {
  const publications = await prisma.publication.findMany({
    where: {
      type: 'ARTICLE',
      status: 'PUBLISHED',
    },
    include: publicationInclude,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  return publications.map((publication) => ({
    id: publication.id,
    category: publication.category.name,
    title: publication.title,
    summary: publication.summary,
    author: publication.author.publicSignature ?? publication.author.name,
    date: formatDate(publication.publishedAt),
    image: publication.images[0]?.url ?? '/placeholder.jpg',
    featured: publication.featured,
    slug: publication.slug,
    content: publication.content,
  }))
}

export async function getColumns(): Promise<Column[]> {
  const publications = await prisma.publication.findMany({
    where: {
      type: 'COLUMN',
      status: 'PUBLISHED',
    },
    include: publicationInclude,
    orderBy: { publishedAt: 'desc' },
  })

  return publications.map((publication) => ({
    id: publication.id,
    date: formatDate(publication.publishedAt),
    title: publication.title,
    excerpt: publication.excerpt ?? publication.summary,
    author: publication.author.publicSignature ?? publication.author.name,
    program: publication.author.program?.name ?? 'Achiki',
    slug: publication.slug,
  }))
}

export async function getEvents(): Promise<EventItem[]> {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: 'asc' },
    take: 6,
  })

  return events.map((event) => ({
    id: event.id,
    date: formatEventDate(event.startsAt),
    title: event.title,
    slug: event.slug,
    location: event.location,
  }))
}

export async function getArticleBySlug(slug: string, options?: { includeDrafts?: boolean }) {
  return prisma.publication.findFirst({
    where: {
      slug,
      ...(options?.includeDrafts ? {} : { status: 'PUBLISHED' }),
    },
    include: {
      ...publicationInclude,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
  })
}

export async function getArticlesByCategorySlug(slug: string): Promise<Article[]> {
  const publications = await prisma.publication.findMany({
    where: {
      type: 'ARTICLE',
      status: 'PUBLISHED',
      category: {
        slug,
      },
    },
    include: publicationInclude,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  return publications.map((publication) => ({
    id: publication.id,
    category: publication.category.name,
    title: publication.title,
    summary: publication.summary,
    author: publication.author.publicSignature ?? publication.author.name,
    date: formatDate(publication.publishedAt),
    image: publication.images[0]?.url ?? '/placeholder.jpg',
    featured: publication.featured,
    slug: publication.slug,
    content: publication.content,
  }))
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
  })
}

export { formatDate }
