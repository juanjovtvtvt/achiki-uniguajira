import { createArticle } from '@/app/admin/actions'
import { ArticleForm } from '@/components/admin/article-form'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function NewArticlePage() {
  const [categories, authors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.user.findMany({ where: { role: { in: ['AUTHOR', 'EDITOR', 'ADMIN'] } }, orderBy: { name: 'asc' } }),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Nuevo contenido</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Crear articulo
        </h1>
      </div>
      <ArticleForm action={createArticle} categories={categories} authors={authors} submitLabel="Guardar articulo" />
    </main>
  )
}
