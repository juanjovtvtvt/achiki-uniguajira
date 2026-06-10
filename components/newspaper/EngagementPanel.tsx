'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bus, Heart, MapPin, MessageCircle, Navigation, Sparkles, ThumbsUp } from 'lucide-react'
import type { HomePoll, HomeRoutePoint, PublicationOfDay } from '@/lib/content'

const reactionLabels = {
  LIKE: 'Me gusta',
  INSIGHTFUL: 'Interesante',
  SUPPORT: 'Apoyo',
}

const reactionIcons = {
  LIKE: ThumbsUp,
  INSIGHTFUL: Sparkles,
  SUPPORT: Heart,
}

type ReactionType = keyof typeof reactionLabels

interface EngagementPanelProps {
  publicationOfDay: PublicationOfDay | null
  activePoll: HomePoll | null
  routePoints: HomeRoutePoint[]
}

export function EngagementPanel({ publicationOfDay, activePoll, routePoints }: EngagementPanelProps) {
  return (
    <div className="space-y-6">
      <EngagementSpotlight publicationOfDay={publicationOfDay} activePoll={activePoll} />
      <CampusRouteMap routePoints={routePoints} />
    </div>
  )
}

export function EngagementSpotlight({ publicationOfDay, activePoll }: Pick<EngagementPanelProps, 'publicationOfDay' | 'activePoll'>) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border-y border-border bg-background" aria-label="Destacados interactivos">
      <div className="lg:border-r border-border min-h-[48vh]">
        <PublicationOfDayCard publication={publicationOfDay} variant="hero" />
      </div>
      <div className="min-h-[48vh]">
        <DailyPollCard poll={activePoll} variant="hero" />
      </div>
    </section>
  )
}

export function CampusRouteSection({ routePoints }: Pick<EngagementPanelProps, 'routePoints'>) {
  return <CampusRouteMap routePoints={routePoints} />
}

function PublicationOfDayCard({ publication, variant = 'compact' }: { publication: PublicationOfDay | null; variant?: 'compact' | 'hero' }) {
  const [counts, setCounts] = useState(() => publication?.reactionCounts ?? [])
  const total = counts.reduce((sum, reaction) => sum + reaction.count, 0)

  if (!publication) return null

  const react = async (type: ReactionType) => {
    setCounts((current) => bumpReaction(current, type))

    const response = await fetch('/api/reacciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicationId: publication.id, type }),
    })

    if (response.ok) {
      const data = await response.json()
      setCounts(data.reactionCounts)
    }
  }

  const hero = variant === 'hero'

  return (
    <section aria-label="Publicacion del dia" className={hero ? 'h-full p-5 md:p-7 flex flex-col' : ''}>
      {!hero && (
        <div className="border-b-2 border-foreground pb-2 mb-3">
          <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Publicacion del dia
          </h2>
        </div>
      )}
      <article className={`${hero ? 'h-full flex flex-col' : 'border border-border bg-background p-3'}`}>
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary mb-2">Publicacion del dia / {publication.category}</p>
        <h3 className={`font-display font-bold leading-tight text-foreground mb-3 ${hero ? 'text-3xl md:text-5xl text-balance' : 'text-base leading-snug'}`} style={{ fontFamily: 'var(--font-display)' }}>
          <Link href={`/articulos/${publication.slug}`} className="hover:text-primary transition-colors">
            {publication.title}
          </Link>
        </h3>
        <p className={`font-sans leading-relaxed text-muted-foreground mb-4 ${hero ? 'text-base md:text-lg line-clamp-5' : 'text-xs line-clamp-3'}`}>{publication.summary}</p>
        <div className="flex items-center justify-between gap-2 mb-4 mt-auto">
          <span className="font-sans text-xs text-muted-foreground">{total} reacciones</span>
          <Link href={`/articulos/${publication.slug}`} className="font-sans text-xs font-semibold text-primary hover:underline">
            Leer
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(reactionLabels) as ReactionType[]).map((type) => {
            const Icon = reactionIcons[type]
            const count = counts.find((reaction) => reaction.type === type)?.count ?? 0
            return (
              <button
                key={type}
                type="button"
                onClick={() => react(type)}
                className="flex items-center justify-center gap-2 border border-border px-2 py-3 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                title={reactionLabels[type]}
              >
                <Icon size={hero ? 17 : 14} />
                <span className="font-sans text-xs font-semibold">{count}</span>
              </button>
            )
          })}
        </div>
      </article>
    </section>
  )
}

function bumpReaction(counts: { type: string; count: number }[], type: string) {
  const found = counts.find((reaction) => reaction.type === type)
  if (found) {
    return counts.map((reaction) => reaction.type === type ? { ...reaction, count: reaction.count + 1 } : reaction)
  }
  return [...counts, { type, count: 1 }]
}

function CampusRouteMap({ routePoints }: { routePoints: HomeRoutePoint[] }) {
  if (routePoints.length === 0) return null
  const first = routePoints[0]
  const last = routePoints[routePoints.length - 1]

  return (
    <section aria-label="Ruta a tiempo real" className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="border-b-2 border-foreground pb-2 mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Ruta a tiempo real
        </h2>
        <span className="inline-flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-primary">
          <Bus size={13} />
          Bus en movimiento
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] border border-border bg-background overflow-hidden">
        <div className="relative h-[360px] overflow-hidden border-b lg:border-b-0 lg:border-r border-border real-route-map">
          <div className="absolute inset-0 bg-background/5" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
            <path d="M150 380 C260 330 330 305 430 278 C555 242 650 204 835 118" fill="none" stroke="rgba(31, 97, 51, 0.25)" strokeWidth="22" strokeLinecap="round" />
            <path className="real-route-line" d="M150 380 C260 330 330 305 430 278 C555 242 650 204 835 118" fill="none" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" />
          </svg>
          <div className="absolute left-[13%] top-[72%] flex items-center gap-2 rounded-sm bg-background/95 border border-border px-2 py-1 shadow-sm">
            <MapPin size={13} className="text-primary" />
            <span className="font-sans text-xs font-semibold">{first.title}</span>
          </div>
          <div className="absolute right-[9%] top-[18%] flex items-center gap-2 rounded-sm bg-background/95 border border-border px-2 py-1 shadow-sm">
            <Navigation size={13} className="text-accent" />
            <span className="font-sans text-xs font-semibold">{last.title}</span>
          </div>
          <div className="real-route-bus absolute flex items-center justify-center w-9 h-9 rounded-full bg-golden text-golden-foreground border-2 border-background shadow-lg">
            <Bus size={18} />
          </div>
          <div className="absolute left-4 bottom-4 rounded-sm bg-background/95 border border-border px-3 py-2">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">Mapa real de Riohacha</p>
            <p className="font-sans text-xs font-semibold text-foreground">Simulacion de recorrido U - Centro</p>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <p className="font-sans text-xs leading-relaxed text-muted-foreground">
            Recorrido simulado en tiempo real sobre mapa real de Riohacha. El bus anima el trayecto desde el campus hacia el centro.
          </p>
          <div className="space-y-2">
            {routePoints.slice(1, -1).map((point) => (
              <div
                key={point.id}
                className="flex items-start gap-2 border border-border px-2.5 py-2"
              >
                <span className="mt-1 h-2 w-2 rotate-45 bg-primary flex-shrink-0" />
                <div>
                  <p className="font-sans text-xs font-semibold text-foreground">{point.title}</p>
                  {point.description && <p className="font-sans text-[10px] leading-relaxed text-muted-foreground">{point.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DailyPollCard({ poll, variant = 'compact' }: { poll: HomePoll | null; variant?: 'compact' | 'hero' }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [options, setOptions] = useState(() => poll?.options ?? [])
  const totalVotes = useMemo(() => options.reduce((sum, option) => sum + option.votes, 0), [options])

  if (!poll) return null
  const hero = variant === 'hero'

  const vote = async (optionId: number) => {
    setSelected(optionId)
    setOptions((current) => current.map((option) => option.id === optionId ? { ...option, votes: option.votes + 1 } : option))

    const response = await fetch('/api/encuestas/votar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pollId: poll.id, optionId }),
    })

    if (response.ok) {
      const data = await response.json()
      setOptions(data.options)
    }
  }

  return (
    <section aria-label="Encuesta diaria" className={hero ? 'h-full p-5 md:p-7 flex flex-col justify-center' : ''}>
      {!hero && (
        <div className="border-b-2 border-foreground pb-2 mb-3">
          <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Encuesta diaria
          </h2>
        </div>
      )}
      <div className={hero ? '' : 'border border-border bg-background p-3'}>
        <div className="flex items-start gap-2 mb-5">
          <MessageCircle size={hero ? 22 : 15} className="text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary mb-2">Encuesta diaria</p>
            <p className={`font-sans font-semibold leading-snug text-foreground ${hero ? 'text-2xl md:text-4xl' : 'text-sm'}`}>{poll.question}</p>
          </div>
        </div>
        <div className={hero ? 'space-y-3' : 'space-y-2'}>
          {options.map((option) => {
            const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100)
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => vote(option.id)}
                className={`w-full text-left border px-3 py-3 transition-colors ${selected === option.id ? 'border-primary text-primary' : 'border-border text-foreground hover:border-primary/50'}`}
              >
                <span className={`flex items-center justify-between gap-2 font-sans font-semibold ${hero ? 'text-sm md:text-base' : 'text-xs'}`}>
                  <span>{option.label}</span>
                  <span>{percent}%</span>
                </span>
                <span className="block h-1 bg-muted mt-2">
                  <span className="block h-1 bg-primary transition-all" style={{ width: `${percent}%` }} />
                </span>
              </button>
            )
          })}
        </div>
        <p className="font-sans text-xs text-muted-foreground mt-4">{totalVotes} votos registrados</p>
      </div>
    </section>
  )
}
