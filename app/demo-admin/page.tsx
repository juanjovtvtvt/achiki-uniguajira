import { prisma } from '@/lib/db'
import { DemoAdminClient } from './DemoAdminClient'

export const dynamic = 'force-dynamic'

export default async function DemoAdminPage() {
  const [publications, users, categories, events, subscribers] = await Promise.all([
    prisma.publication.findMany({
      where: { type: 'ARTICLE' },
      include: { category: true, author: true },
      orderBy: [{ updatedAt: 'desc' }],
      take: 12,
    }),
    prisma.user.count(),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.event.count(),
    prisma.subscriber.count(),
  ])

  return (
    <DemoAdminClient
      initialArticles={publications.map((publication) => ({
        id: publication.id,
        title: publication.title,
        slug: publication.slug,
        category: publication.category.name,
        author: publication.author.name,
        status: publication.status,
        summary: publication.summary,
      }))}
      categories={categories.map((category) => category.name)}
      baseMetrics={{
        users,
        categories: categories.length,
        events,
        subscribers,
      }}
    />
  )
}
