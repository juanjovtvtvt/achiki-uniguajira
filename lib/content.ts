import { prisma } from '@/lib/db'
import type { Article, Column, EventItem } from '@/lib/articles'

export type HomeReactionCount = {
  type: string
  count: number
}

export type PublicationOfDay = Article & {
  reactionCounts: HomeReactionCount[]
  myReaction: string | null
}

export type HomePoll = {
  id: number
  question: string
  options: {
    id: number
    label: string
    votes: number
  }[]
}

export type HomeRoutePoint = {
  id: number
  routeKey: string
  title: string
  description: string | null
  lat: number
  lng: number
  progress: number
  order: number
  isStop: boolean
}

export type HomeRoute = {
  key: string
  name: string
  points: HomeRoutePoint[]
}

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

export async function getPublicationOfDay(userId?: number | null): Promise<PublicationOfDay | null> {
  const publication = await prisma.publication.findFirst({
    where: {
      type: 'ARTICLE',
      status: 'PUBLISHED',
    },
    include: publicationInclude,
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  if (!publication) return null

  const reactions = await prisma.publicationReaction.groupBy({
    by: ['type'],
    where: { publicationId: publication.id },
    _count: { type: true },
  })
  const myReaction = userId
    ? await prisma.publicationReaction.findUnique({
        where: {
          publicationId_userId: {
            publicationId: publication.id,
            userId,
          },
        },
        select: { type: true },
      })
    : null

  return {
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
    reactionCounts: reactions.map((reaction) => ({
      type: reaction.type,
      count: reaction._count.type,
    })),
    myReaction: myReaction?.type ?? null,
  }
}

export async function getActivePoll(): Promise<HomePoll | null> {
  const poll = await prisma.dailyPoll.findFirst({
    where: { active: true },
    include: {
      options: {
        include: {
          _count: {
            select: { votes: true },
          },
        },
        orderBy: { id: 'asc' },
      },
    },
    orderBy: { startsAt: 'desc' },
  })

  if (!poll) return null

  return {
    id: poll.id,
    question: poll.question,
    options: poll.options.map((option) => ({
      id: option.id,
      label: option.label,
      votes: option._count.votes,
    })),
  }
}

export async function getCampusRoute(): Promise<HomeRoutePoint[]> {
  return prisma.routePoint.findMany({
    where: { routeKey: 'uniguajira-riohacha' },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      routeKey: true,
      title: true,
      description: true,
      lat: true,
      lng: true,
        progress: true,
        order: true,
        isStop: true,
      },
    })
}

const routeNames: Record<string, string> = {
  marbella: 'Marbella',
  majayura: 'Majayura',
  '15-de-mayo': '15 de Mayo',
  '15-derecho': '15 Derecho',
  'centro-coquivacoa': 'Centro Coquivacoa',
  dividivi: 'Dividivi',
  'la-20': 'La 20',
  '27-37': '27-37',
}

export async function getCampusRoutes(): Promise<HomeRoute[]> {
  const points = await prisma.routePoint.findMany({
    orderBy: [{ routeKey: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      routeKey: true,
      title: true,
      description: true,
      lat: true,
      lng: true,
        progress: true,
        order: true,
        isStop: true,
      },
    })

  const grouped = new Map<string, HomeRoutePoint[]>()
  for (const point of points) {
    grouped.set(point.routeKey, [...(grouped.get(point.routeKey) ?? []), point])
  }

  return Array.from(grouped.entries()).map(([key, routePoints]) => ({
    key,
    name: routeNames[key] ?? key,
    points: routePoints,
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
