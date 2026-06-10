import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ArticleCard } from '@/components/newspaper/ArticleCard'
import { getArticlesByCategorySlug, getCategoryBySlug } from '@/lib/content'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const [category, articles] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategorySlug(slug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-primary hover:gap-3 transition-all mb-8">
          <ArrowLeft size={14} />
          Volver a portada
        </Link>

        <div className="border-b-2 border-foreground pb-3 mb-8">
          <h1
            className="font-display text-3xl md:text-5xl font-bold text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {category.name}
          </h1>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <p className="font-sans text-sm text-muted-foreground">No hay publicaciones en esta categoria.</p>
        )}
      </section>
    </main>
  )
}
