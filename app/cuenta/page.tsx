import Link from 'next/link'
import { FileText, LogOut, Pencil, ShieldCheck, UserCircle } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'
import { requireSession, isAdminRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface AccountPageProps {
  searchParams: Promise<{
    sent?: string
  }>
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await requireSession()
  const { sent } = await searchParams
  const publications = session.userId
    ? await prisma.publication.findMany({
        where: { authorId: session.userId },
        include: { category: true },
        orderBy: { updatedAt: 'desc' },
        take: 12,
      })
    : []

  return (
    <main className="min-h-screen bg-muted/25">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Cuenta ACHIKI</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              Hola, {session.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex items-center justify-center px-3 py-2 text-xs font-sans border border-border bg-background hover:bg-muted transition-colors">
              Ir al sitio
            </Link>
            {isAdminRole(session.role) && (
              <Link href="/admin" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <ShieldCheck size={13} />
                Admin
              </Link>
            )}
            <form action={logoutAction}>
              <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-sans border border-border bg-background hover:bg-muted transition-colors">
                <LogOut size={13} />
                Salir
              </button>
            </form>
          </div>
        </div>

        {sent === '1' && (
          <div className="mb-6 border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-sans text-foreground">
            Publicacion enviada a revision editorial.
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <aside className="bg-background border border-border p-5 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle size={34} className="text-primary" />
              <div className="min-w-0">
                <p className="font-sans font-bold text-foreground truncate">{session.name}</p>
                <p className="font-sans text-xs text-muted-foreground truncate">{session.email}</p>
              </div>
            </div>
            <dl className="space-y-3 font-sans text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Rol</dt>
                <dd className="font-semibold text-foreground">{labelRole(session.role)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Ingreso</dt>
                <dd className="font-semibold text-foreground">{session.provider === 'google' ? 'Google' : 'Correo y clave'}</dd>
              </div>
            </dl>
            <Link href="/cuenta/enviar" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Pencil size={15} />
              Enviar publicacion
            </Link>
          </aside>

          <section className="bg-background border border-border">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
              <h2 className="font-sans text-sm font-bold text-foreground">Mis publicaciones</h2>
              <FileText size={16} className="text-primary" />
            </div>
            {publications.length === 0 ? (
              <div className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
                Todavia no tienes publicaciones enviadas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">Titulo</th>
                      <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                      <th className="text-left px-4 py-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publications.map((publication) => (
                      <tr key={publication.id} className="border-t border-border">
                        <td className="px-4 py-3 min-w-[300px]">
                          <p className="font-semibold text-foreground">{publication.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">/{publication.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{publication.category.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground">
                            {labelStatus(publication.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

function labelRole(role: string) {
  return {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    AUTHOR: 'Autor',
    READER: 'Usuario',
  }[role] ?? role
}

function labelStatus(status: string) {
  return {
    PUBLISHED: 'Publicado',
    DRAFT: 'Borrador',
    REVIEW: 'En revision',
    ARCHIVED: 'Archivado',
  }[status] ?? status
}
