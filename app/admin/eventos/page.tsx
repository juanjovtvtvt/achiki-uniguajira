import Link from 'next/link'
import { Eye, Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { deleteEvent } from '@/app/admin/actions'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startsAt: 'asc' },
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Agenda</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
            Eventos
          </h1>
        </div>
        <Link href="/admin/eventos/nuevo" className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <PlusCircle size={16} />
          Crear evento
        </Link>
      </div>

      <section className="bg-background border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Evento</th>
                <th className="text-left px-4 py-2 font-semibold">Fecha</th>
                <th className="text-left px-4 py-2 font-semibold">Lugar</th>
                <th className="text-left px-4 py-2 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 min-w-[320px]">
                    <p className="font-semibold text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">/{event.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(event.startsAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{event.location ?? '-'}</td>
                  <td className="px-4 py-3 min-w-[240px]">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/eventos/${event.slug}`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                        <Eye size={13} />
                        Ver
                      </Link>
                      <Link href={`/admin/eventos/${event.id}/editar`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                        <Pencil size={13} />
                        Editar
                      </Link>
                      <form action={deleteEvent.bind(null, event.id)}>
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
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
