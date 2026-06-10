import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { categoryColors } from '@/lib/articles'
import { formatDate, getArticleBySlug } from '@/lib/content'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isAdminPreview = preview === 'admin'
  const publication = await getArticleBySlug(slug, { includeDrafts: isAdminPreview })

  if (!publication) {
    notFound()
  }

  const image = publication.images[0]?.url
  const colorClass = categoryColors[publication.category.name] ?? 'text-primary border-primary'
  const body = publication.content ?? publication.summary

  return (
    <main className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href={isAdminPreview ? '/admin/articulos' : '/'} className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-primary hover:gap-3 transition-all mb-8">
          <ArrowLeft size={14} />
          {isAdminPreview ? 'Volver al admin' : 'Volver a portada'}
        </Link>

        {isAdminPreview && publication.status !== 'PUBLISHED' && (
          <div className="mb-6 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
            Vista previa administrativa: este articulo esta en estado <strong>{publication.status}</strong> y no aparece en la portada publica hasta publicarlo.
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-sans font-semibold tracking-[0.2em] uppercase border-b pb-0.5 ${colorClass}`}>
            {publication.category.name}
          </span>
          <span className="text-muted-foreground/50 text-xs">·</span>
          <time className="text-xs text-muted-foreground font-sans">{formatDate(publication.publishedAt)}</time>
        </div>

        <h1
          className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4 text-balance"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {publication.title}
        </h1>

        <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/75 mb-5">
          {publication.summary}
        </p>

        <p className="text-sm font-sans text-muted-foreground mb-8">
          Por <strong className="text-foreground">{publication.author.publicSignature ?? publication.author.name}</strong>
          {publication.author.program?.name ? ` · ${publication.author.program.name}` : ''}
        </p>

        {image && (
          <div className="relative w-full aspect-[16/9] overflow-hidden mb-8 border border-border">
            <Image src={image} alt={publication.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        <div className="font-sans text-base leading-8 text-foreground/85 space-y-5">
          {body.split('\n').filter(Boolean).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {publication.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
            {publication.tags.map(({ tag }) => (
              <span key={tag.id} className="text-[10px] font-sans font-semibold uppercase tracking-widest border border-border px-2 py-1 text-muted-foreground">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
