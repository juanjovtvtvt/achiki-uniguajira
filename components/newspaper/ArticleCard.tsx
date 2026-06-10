import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/articles'
import { categoryColors } from '@/lib/articles'
import { ArrowRight } from 'lucide-react'

interface ArticleCardProps {
  article: Article
  layout?: 'vertical' | 'horizontal'
}

export function ArticleCard({ article, layout = 'vertical' }: ArticleCardProps) {
  const colorClass = categoryColors[article.category] ?? 'text-primary border-primary'

  if (layout === 'horizontal') {
    return (
      <article className="group flex gap-4 py-4 border-b border-border last:border-b-0">
        <Link href={`/articulos/${article.slug}`} className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="96px"
          />
        </Link>
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <span className={`text-[10px] font-sans font-semibold tracking-[0.18em] uppercase border-b pb-0.5 ${colorClass}`}>
              {article.category}
            </span>
            <h3
              className="font-display font-bold text-sm leading-snug mt-1.5 text-foreground line-clamp-2 text-pretty"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <Link href={`/articulos/${article.slug}`} className="hover:text-primary transition-colors">
                {article.title}
              </Link>
            </h3>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <time className="text-[10px] text-muted-foreground font-sans">{article.date}</time>
            <Link href={`/articulos/${article.slug}`} className="flex items-center gap-1 text-[10px] font-sans font-semibold text-primary hover:gap-1.5 transition-all">
              Leer mas <ArrowRight size={10} />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group border-b border-border pb-5 last:border-b-0">
      <Link href={`/articulos/${article.slug}`} className="relative block w-full aspect-[4/3] overflow-hidden mb-3">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-600 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>

      <span className={`text-[10px] font-sans font-semibold tracking-[0.18em] uppercase border-b pb-0.5 ${colorClass}`}>
        {article.category}
      </span>

      <h3
        className="font-display font-bold text-base sm:text-lg leading-snug mt-2 mb-2 text-foreground text-pretty line-clamp-3 break-words max-w-full"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Link href={`/articulos/${article.slug}`} className="hover:text-primary transition-colors">
          {article.title}
        </Link>
      </h3>

      <p className="font-sans text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-3 break-words">
        {article.summary}
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="min-w-0">
          <p className="text-xs font-sans text-foreground/70 break-words">
            Por <span className="font-semibold text-foreground">{article.author}</span>
          </p>
          <time className="text-[10px] text-muted-foreground font-sans">{article.date}</time>
        </div>
        <Link href={`/articulos/${article.slug}`} className="flex items-center gap-1.5 text-xs font-sans font-semibold text-primary hover:gap-2 transition-all duration-200 group/btn flex-shrink-0">
          Leer mas
          <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </article>
  )
}
