import { Mail, Trash2 } from 'lucide-react'
import { deleteSubscriber, setSubscriberActive } from '@/app/admin/actions'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Boletin</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Suscriptores
        </h1>
      </div>

      <section className="bg-background border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Correo</th>
                <th className="text-left px-4 py-2 font-semibold">Estado</th>
                <th className="text-left px-4 py-2 font-semibold">Fecha</th>
                <th className="text-left px-4 py-2 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-border">
                  <td className="px-4 py-3 min-w-[300px]">
                    <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                      <Mail size={14} className="text-primary" />
                      {subscriber.email}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground">
                      {subscriber.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(subscriber.createdAt)}</td>
                  <td className="px-4 py-3 min-w-[220px]">
                    <div className="flex flex-wrap gap-2">
                      <form action={setSubscriberActive.bind(null, subscriber.id, !subscriber.active)}>
                        <button className="inline-flex items-center px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          {subscriber.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </form>
                      <form action={deleteSubscriber.bind(null, subscriber.id)}>
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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
