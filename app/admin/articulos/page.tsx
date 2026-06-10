import Link from 'next/link'
import { Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { prisma } from '@/lib/db'
import { deleteArticle, setArticleStatus } from '@/app/admin/actions'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const publications = await prisma.publication.findMany({
    where: { type: 'ARTICLE' },
    include: {
      author: true,
      category: true,
    },
    orderBy: [{ updatedAt: 'desc' }],
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Contenido</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Articulos
          </h1>
        </div>
        <Link href="/admin/articulos/nuevo" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <PlusCircle size={16} />
          Crear articulo
        </Link>
      </div>

      <section className="bg-background border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Titulo</th>
                <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                <th className="text-left px-4 py-2 font-semibold">Autor</th>
                <th className="text-left px-4 py-2 font-semibold">Estado</th>
                <th className="text-left px-4 py-2 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {publications.map((publication) => (
                <tr key={publication.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 min-w-[340px]">
                    <p className="font-semibold text-foreground">{publication.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">/{publication.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{publication.category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{publication.author.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={publication.status} />
                  </td>
                  <td className="px-4 py-3 min-w-[300px]">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/articulos/${publication.id}/vista`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                        <Eye size={13} />
                        Ver
                      </Link>
                      <Link href={`/admin/articulos/${publication.id}/editar`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                        <Pencil size={13} />
                        Editar
                      </Link>
                      <form action={setArticleStatus.bind(null, publication.id, publication.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}>
                        <button className="inline-flex items-center px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          {publication.status === 'PUBLISHED' ? 'Pasar a borrador' : 'Publicar'}
                        </button>
                      </form>
                      <form action={deleteArticle.bind(null, publication.id)}>
                        <button className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 size={13} />
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const label = {
    PUBLISHED: 'Publicado',
    DRAFT: 'Borrador',
    REVIEW: 'Revision',
    ARCHIVED: 'Archivado',
  }[status] ?? status

  return (
    <span className="inline-flex px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground">
      {label}
    </span>
  )
}
