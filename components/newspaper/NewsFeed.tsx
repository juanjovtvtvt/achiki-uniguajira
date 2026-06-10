import type { Article, Category } from '@/lib/articles'
import { FeaturedArticle } from './FeaturedArticle'
import { ArticleCard } from './ArticleCard'

interface NewsFeedProps {
  activeCategory: Category | null
  articles: Article[]
}

export function NewsFeed({ activeCategory, articles }: NewsFeedProps) {
  const filtered = activeCategory
    ? articles.filter((article) => article.category === activeCategory)
    : articles

  const featured = filtered.find((article) => article.featured) ?? filtered[0]
  const secondary = filtered.filter((article) => article.id !== featured?.id)

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground font-sans text-sm">
        No hay articulos en esta categoria por el momento.
      </div>
    )
  }

  return (
    <div className="w-full">
      {featured && (
        <div className="mb-8">
          <FeaturedArticle article={featured} />
        </div>
      )}

      {secondary.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Mas noticias
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
            {secondary.map((article) => (
              <ArticleCard key={article.id} article={article} layout="vertical" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
