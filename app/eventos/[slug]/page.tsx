import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { formatDate, getEventBySlug } from '@/lib/content'

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-primary hover:gap-3 transition-all mb-8">
          <ArrowLeft size={14} />
          Volver a portada
        </Link>

        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-accent mb-3">
          Evento universitario
        </p>
        <h1
          className="font-display text-3xl md:text-5xl font-bold leading-tight text-foreground mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {event.title}
        </h1>

        <div className="space-y-3 border-y border-border py-5 mb-7">
          <p className="flex items-center gap-2 font-sans text-sm text-foreground/80">
            <CalendarDays size={16} className="text-primary" />
            {formatDate(event.startsAt)}
          </p>
          {event.location && (
            <p className="flex items-center gap-2 font-sans text-sm text-foreground/80">
              <MapPin size={16} className="text-primary" />
              {event.location}
            </p>
          )}
        </div>

        <p className="font-sans text-base leading-8 text-foreground/80">
          {event.description ?? 'Este evento forma parte de la agenda editorial y academica de ACHIKI.'}
        </p>
      </section>
    </main>
  )
}
