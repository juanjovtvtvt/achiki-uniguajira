import Link from 'next/link'
import type { Event } from '@prisma/client'

interface EventFormProps {
  action: (formData: FormData) => Promise<void>
  event?: Event
  submitLabel: string
}

function formatInputDate(date?: Date | null) {
  if (!date) return ''
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

export function EventForm({ action, event, submitLabel }: EventFormProps) {
  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
      <section className="bg-background border border-border p-4 md:p-5 space-y-5">
        <Field label="Titulo" htmlFor="title" required>
          <input id="title" name="title" required defaultValue={event?.title} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
        </Field>
        <Field label="Slug" htmlFor="slug">
          <input id="slug" name="slug" defaultValue={event?.slug} placeholder="se-genera-automaticamente" className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
        </Field>
        <Field label="Descripcion" htmlFor="description">
          <textarea id="description" name="description" rows={8} defaultValue={event?.description ?? ''} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary resize-y" />
        </Field>
      </section>

      <aside className="space-y-4">
        <section className="bg-background border border-border p-4 space-y-4">
          <Field label="Lugar" htmlFor="location">
            <input id="location" name="location" defaultValue={event?.location ?? ''} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
          </Field>
          <Field label="Fecha inicio" htmlFor="startsAt" required>
            <input id="startsAt" name="startsAt" type="datetime-local" required defaultValue={formatInputDate(event?.startsAt)} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
          </Field>
          <Field label="Fecha fin" htmlFor="endsAt">
            <input id="endsAt" name="endsAt" type="datetime-local" defaultValue={formatInputDate(event?.endsAt)} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
          </Field>
        </section>

        <div className="bg-background border border-border p-4 flex flex-col gap-2">
          <button className="w-full px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            {submitLabel}
          </button>
          <Link href="/admin/eventos" className="w-full px-4 py-2 text-sm font-sans font-semibold border border-border text-center hover:bg-muted transition-colors">
            Cancelar
          </Link>
        </div>
      </aside>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
    </div>
  )
}
