import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { categoryColors } from '@/lib/articles'
import { formatDate, getArticleBySlug, getPublicationReactionState } from '@/lib/content'
import { getSession } from '@/lib/auth'
import { PublicationReactionBar } from '@/components/newspaper/EngagementPanel'
import { addComment } from './actions'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    preview?: string
    comment?: string
  }>
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params
  const { preview, comment } = await searchParams
  const isAdminPreview = preview === 'admin'
  const publication = await getArticleBySlug(slug, { includeDrafts: isAdminPreview })
  const session = await getSession()

  if (!publication) {
    notFound()
  }

  const image = publication.images[0]?.url
  const colorClass = categoryColors[publication.category.name] ?? 'text-primary border-primary'
  const body = publication.content ?? publication.summary
  const reactionState = await getPublicationReactionState(publication.id, session?.userId)

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
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-widest text-muted-foreground">Temas</span>
            {publication.tags.map(({ tag }) => (
              <span key={tag.id} className="text-[10px] font-sans font-semibold uppercase tracking-widest border border-border px-2 py-1 text-muted-foreground/85">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <section className="mt-6 border-y border-border py-5" aria-label="Reacciones de la publicacion">
          <div className="mb-4">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold">Reacciones</p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">
              Elige una sola reaccion para esta publicacion. Puedes cambiarla cuando quieras.
            </p>
          </div>
          <PublicationReactionBar
            publicationId={publication.id}
            reactionCounts={reactionState.reactionCounts}
            myReaction={reactionState.myReaction}
            isAuthenticated={Boolean(session)}
            loginHref={`/login?next=/articulos/${publication.slug}`}
          />
        </section>

        <section id="comentarios" className="mt-6 pt-5 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold">Comunidad</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                Comentarios
              </h2>
            </div>
            <span className="text-xs font-sans text-muted-foreground">
              {publication.comments.length} {publication.comments.length === 1 ? 'comentario' : 'comentarios'}
            </span>
          </div>

          {comment === '1' && (
            <div className="mb-4 border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-sans text-foreground">
              Comentario publicado.
            </div>
          )}

          {comment === 'invalid' && (
            <div className="mb-4 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
              Escribe un comentario entre 2 y 800 caracteres.
            </div>
          )}

          {session ? (
            <form action={addComment.bind(null, publication.slug, publication.id)} className="mb-8 border border-border bg-muted/20 p-4 transition-colors duration-200 focus-within:border-primary/50">
              <label htmlFor="content" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Comentar como {session.name}
              </label>
              <textarea
                id="content"
                name="content"
                rows={4}
                maxLength={800}
                required
                placeholder="Aporta una idea, contexto o una reaccion respetuosa..."
                className="w-full resize-y border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <div className="flex justify-end mt-3">
                <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-sans font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all">
                  Publicar comentario
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-8 border border-border bg-muted/20 p-4 font-sans text-sm text-muted-foreground">
              Para comentar necesitas una cuenta.
              <Link href={`/login?next=/articulos/${publication.slug}`} className="ml-2 font-bold text-primary hover:underline">
                Iniciar sesion
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {publication.comments.length === 0 ? (
              <p className="font-sans text-sm text-muted-foreground">Todavia no hay comentarios. Se el primero en abrir la conversacion.</p>
            ) : (
              publication.comments.map((item) => (
                <article key={item.id} className="flex gap-3 border border-border bg-background p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
                  <ProfileAvatar name={item.user.publicSignature ?? item.user.name} avatarUrl={item.user.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-sans text-sm font-bold text-foreground">{item.user.publicSignature ?? item.user.name}</p>
                      <time className="font-sans text-xs text-muted-foreground">{formatDate(item.createdAt)}</time>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap break-words font-sans text-sm leading-6 text-foreground/80">{item.content}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </article>
    </main>
  )
}

function ProfileAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'A'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Foto de ${name}`}
        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover bg-muted"
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-sans text-sm font-bold text-primary">
      {initial}
    </div>
  )
}
