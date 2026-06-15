import Link from 'next/link'
import { FileText, Mail, Tags, Users } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [publications, users, categories, subscribers, latest] = await Promise.all([
    prisma.publication.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.subscriber.count(),
    prisma.publication.findMany({
      include: { category: true, author: true },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Panel administrativo</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Base de datos editorial
          </h1>
        </div>
        <Link href="/admin/articulos/nuevo" className="inline-flex items-center justify-center px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Crear articulo
        </Link>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Metric href="/admin/articulos" icon={<FileText size={18} />} label="Publicaciones" value={publications} />
        <Metric href="/admin/usuarios" icon={<Users size={18} />} label="Usuarios" value={users} />
        <Metric href="/admin/categorias" icon={<Tags size={18} />} label="Categorias" value={categories} />
        <Metric href="/admin/suscriptores" icon={<Mail size={18} />} label="Suscriptores" value={subscribers} />
      </section>

      <section className="bg-background border border-border">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
          <h2 className="font-sans text-sm font-bold text-foreground">Publicaciones recientes</h2>
          <Link href="/admin/articulos" className="text-xs font-sans font-semibold text-primary hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Titulo</th>
                <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                <th className="text-left px-4 py-2 font-semibold">Autor</th>
                <th className="text-left px-4 py-2 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((publication) => (
                <tr key={publication.id} className="border-t border-border">
                  <td className="px-4 py-3 min-w-[320px]">
                    <Link href={`/admin/articulos/${publication.id}/editar`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {publication.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{publication.category.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{publication.author.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={publication.status} />
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

function Metric({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: number }) {
  return (
    <Link href={href} className="block bg-background border border-border px-4 py-4 hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-primary">{icon}</span>
        <span className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-foreground leading-none" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
      </p>
    </Link>
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
