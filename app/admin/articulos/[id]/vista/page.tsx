import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/content'

export const dynamic = 'force-dynamic'

interface AdminArticlePreviewPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AdminArticlePreviewPage({ params }: AdminArticlePreviewPageProps) {
  const { id } = await params
  const publicationId = Number(id)

  if (!Number.isInteger(publicationId)) {
    notFound()
  }

  const publication = await prisma.publication.findUnique({
    where: { id: publicationId },
    include: {
      author: {
        include: {
          program: true,
        },
      },
      category: true,
      images: {
        orderBy: [{ isPrimary: 'desc' }, { id: 'asc' }],
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!publication) {
    notFound()
  }

  const body = publication.content ?? publication.summary
  const image = publication.images[0]?.url

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <Link href="/admin/articulos" className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-primary hover:gap-3 transition-all">
          <ArrowLeft size={14} />
          Volver a articulos
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/articulos/${publication.id}/editar`} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-border text-foreground hover:bg-muted transition-colors">
            <Pencil size={13} />
            Editar
          </Link>
          {publication.status === 'PUBLISHED' && (
            <Link href={`/articulos/${publication.slug}`} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-border text-foreground hover:bg-muted transition-colors">
              <ExternalLink size={13} />
              Abrir publico
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
        Vista previa administrativa. Estado actual: <strong>{labelStatus(publication.status)}</strong>.
      </div>

      <article className="bg-background border border-border px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-sans font-semibold tracking-[0.2em] uppercase border-b border-primary text-primary pb-0.5">
            {publication.category.name}
          </span>
          {publication.publishedAt && (
            <time className="text-xs text-muted-foreground font-sans">{formatDate(publication.publishedAt)}</time>
          )}
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground mb-4 text-balance" style={{ fontFamily: 'var(--font-display)' }}>
          {publication.title}
        </h1>

        <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/75 mb-5">
          {publication.summary}
        </p>

        <p className="text-sm font-sans text-muted-foreground mb-8">
          Por <strong className="text-foreground">{publication.author.publicSignature ?? publication.author.name}</strong>
          {publication.author.program?.name ? ` - ${publication.author.program.name}` : ''}
        </p>

        {image && (
          <div className="relative w-full aspect-[16/9] overflow-hidden mb-8 border border-border">
            <Image src={image} alt={publication.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" priority />
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

function labelStatus(status: string) {
  return {
    PUBLISHED: 'Publicado',
    DRAFT: 'Borrador',
    REVIEW: 'Revision',
    ARCHIVED: 'Archivado',
  }[status] ?? status
}
