import { notFound } from 'next/navigation'
import { updateEvent } from '@/app/admin/actions'
import { EventForm } from '@/components/admin/event-form'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface EditEventPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const eventId = Number(id)

  if (!Number.isFinite(eventId)) {
    notFound()
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!event) {
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Editar evento</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Editar evento
        </h1>
      </div>
      <EventForm action={updateEvent.bind(null, event.id)} event={event} submitLabel="Actualizar evento" />
    </main>
  )
}
