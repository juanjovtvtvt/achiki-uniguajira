import { createEvent } from '@/app/admin/actions'
import { EventForm } from '@/components/admin/event-form'

export const dynamic = 'force-dynamic'

export default function NewEventPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Nuevo evento</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Crear evento
        </h1>
      </div>
      <EventForm action={createEvent} submitLabel="Guardar evento" />
    </main>
  )
}
