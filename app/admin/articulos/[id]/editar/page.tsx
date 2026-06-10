import { notFound } from 'next/navigation'
import { updateArticle } from '@/app/admin/actions'
import { ArticleForm } from '@/components/admin/article-form'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface EditArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const articleId = Number(id)

  if (!Number.isFinite(articleId)) {
    notFound()
  }

  const [publication, categories, authors] = await Promise.all([
    prisma.publication.findUnique({
      where: { id: articleId },
      include: { images: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ where: { role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] } }, orderBy: { name: 'asc' } }),
  ])

  if (!publication) {
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Editar contenido</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Editar articulo
        </h1>
      </div>
      <ArticleForm
        action={updateArticle.bind(null, publication.id)}
        categories={categories}
        authors={authors}
        publication={publication}
        submitLabel="Actualizar articulo"
      />
    </main>
  )
}
