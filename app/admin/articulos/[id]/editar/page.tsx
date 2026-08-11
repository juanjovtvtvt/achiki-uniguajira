import { notFound } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteComment, updateArticle } from '@/app/admin/actions'
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
      include: {
        images: true,
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
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

      <section className="mt-8 bg-background border border-border">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
          <h2 className="font-sans text-sm font-bold text-foreground">Comentarios de la publicacion</h2>
          <span className="text-xs font-sans text-muted-foreground">
            {publication.comments.length} {publication.comments.length === 1 ? 'comentario' : 'comentarios'}
          </span>
        </div>

        {publication.comments.length === 0 ? (
          <p className="px-4 py-6 text-sm font-sans text-muted-foreground">Esta publicacion todavia no tiene comentarios.</p>
        ) : (
          <div className="divide-y divide-border">
            {publication.comments.map((comment) => (
              <article key={comment.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {comment.user.avatarUrl ? (
                      <img src={comment.user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-border flex items-center justify-center text-xs font-sans font-bold text-primary">
                        {comment.user.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-sans text-sm font-semibold text-foreground">{comment.user.name}</p>
                      <p className="font-sans text-xs text-muted-foreground">{comment.user.email}</p>
                    </div>
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-foreground whitespace-pre-wrap">{comment.content}</p>
                  <p className="font-sans text-[11px] text-muted-foreground mt-2">
                    {new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(comment.createdAt)}
                  </p>
                </div>

                <form action={deleteComment.bind(null, comment.id, publication.id)} className="shrink-0">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-semibold border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 size={13} />
                    Eliminar
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
