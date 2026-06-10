import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/articles'
import { categoryColors } from '@/lib/articles'
import { ArrowRight } from 'lucide-react'

interface FeaturedArticleProps {
  article: Article
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const colorClass = categoryColors[article.category] ?? 'text-primary border-primary'

  return (
    <article className="group">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-xs font-sans font-semibold tracking-[0.2em] uppercase border-b pb-0.5 ${colorClass}`}
        >
          {article.category}
        </span>
        <span className="text-xs text-muted-foreground font-sans tracking-wide">Articulo principal</span>
      </div>

      <Link href={`/articulos/${article.slug}`} className="relative block w-full aspect-[16/9] overflow-hidden mb-4">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
      </Link>

      <h2
        className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground mb-3 text-balance break-words max-w-full"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Link href={`/articulos/${article.slug}`} className="hover:text-primary transition-colors">
          {article.title}
        </Link>
      </h2>

      <div className="flex items-center gap-2 mb-3">
        <div className="h-px flex-1 bg-border" />
        <div className="h-1 w-6 bg-primary" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <p className="font-sans text-sm sm:text-base leading-relaxed text-foreground/80 mb-4 break-words">
        {article.summary}
      </p>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="text-xs text-muted-foreground font-sans">Por <strong className="text-foreground font-semibold">{article.author}</strong></span>
          <span className="text-muted-foreground/50 text-xs">·</span>
          <time className="text-xs text-muted-foreground font-sans">{article.date}</time>
        </div>
        <Link href={`/articulos/${article.slug}`} className="flex items-center gap-1.5 text-xs font-sans font-semibold text-primary hover:gap-2.5 transition-all duration-200 group/btn flex-shrink-0">
          Leer mas
          <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
