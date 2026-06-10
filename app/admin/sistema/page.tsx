import Link from 'next/link'
import { Activity, Database, Download, ShieldCheck } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminSystemPage() {
  const [publications, categories, events, users, subscribers] = await Promise.all([
    prisma.publication.count(),
    prisma.category.count(),
    prisma.event.count(),
    prisma.user.count(),
    prisma.subscriber.count(),
  ])

  const isVercel = Boolean(process.env.VERCEL)
  const databaseUrl = process.env.DATABASE_URL ?? 'sin configurar'
  const sqliteMode = databaseUrl.startsWith('file:')

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Estado del sistema</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Sistema y respaldos
        </h1>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatusCard icon={<Activity size={18} />} title="Aplicacion" value={isVercel ? 'Vercel activo' : 'Local activo'} />
        <StatusCard icon={<Database size={18} />} title="Base de datos" value={sqliteMode ? 'SQLite' : 'Base externa'} />
        <StatusCard icon={<ShieldCheck size={18} />} title="Admin" value="Protegido por login" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="bg-background border border-border p-5">
          <h2 className="font-sans text-sm font-bold text-foreground mb-4">Resumen de datos</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm">
            <Row label="Publicaciones" value={publications} />
            <Row label="Categorias" value={categories} />
            <Row label="Eventos" value={events} />
            <Row label="Usuarios" value={users} />
            <Row label="Suscriptores" value={subscribers} />
            <Row label="Entorno" value={isVercel ? 'Produccion' : 'Local'} />
          </dl>
        </div>

        <aside className="space-y-4">
          <div className="bg-background border border-border p-5">
            <h2 className="font-sans text-sm font-bold text-foreground mb-3">Exportar respaldo</h2>
            <p className="font-sans text-xs leading-relaxed text-muted-foreground mb-4">
              Descarga una copia JSON de publicaciones, categorias, usuarios, eventos y suscriptores.
            </p>
            <Link href="/api/admin/export" className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Download size={15} />
              Descargar JSON
            </Link>
          </div>

          <div className="bg-background border border-border p-5">
            <h2 className="font-sans text-sm font-bold text-foreground mb-3">Nota de produccion</h2>
            <p className="font-sans text-xs leading-relaxed text-muted-foreground">
              SQLite en Vercel sirve para demo y verificacion. Para guardar cambios permanentemente en internet, el siguiente paso es conectar PostgreSQL.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}

function StatusCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-background border border-border p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-primary">{icon}</span>
        <span className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">{title}</span>
      </div>
      <p className="font-sans text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-border px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground mt-1">{value}</dd>
    </div>
  )
}
