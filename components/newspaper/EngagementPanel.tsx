'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, MessageCircle, Sparkles, ThumbsUp } from 'lucide-react'
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
    <div className="space-y-8">
      <PublicationOfDayCard publication={publicationOfDay} />
      <CampusRouteMap routePoints={routePoints} />
      <DailyPollCard poll={activePoll} />
    </div>
  )
}

function PublicationOfDayCard({ publication }: { publication: PublicationOfDay | null }) {
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

  return (
    <section aria-label="Publicacion del dia">
      <div className="border-b-2 border-foreground pb-2 mb-3">
        <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Publicacion del dia
        </h2>
      </div>
      <article className="border border-border bg-background p-3">
        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-primary mb-2">{publication.category}</p>
        <h3 className="font-display text-base font-bold leading-snug text-foreground mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          <Link href={`/articulos/${publication.slug}`} className="hover:text-primary transition-colors">
            {publication.title}
          </Link>
        </h3>
        <p className="font-sans text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-3">{publication.summary}</p>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-sans text-[10px] text-muted-foreground">{total} reacciones</span>
          <Link href={`/articulos/${publication.slug}`} className="font-sans text-[10px] font-semibold text-primary hover:underline">
            Leer
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.keys(reactionLabels) as ReactionType[]).map((type) => {
            const Icon = reactionIcons[type]
            const count = counts.find((reaction) => reaction.type === type)?.count ?? 0
            return (
              <button
                key={type}
                type="button"
                onClick={() => react(type)}
                className="flex flex-col items-center justify-center gap-1 border border-border px-1.5 py-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                title={reactionLabels[type]}
              >
                <Icon size={14} />
                <span className="font-sans text-[10px] font-semibold">{count}</span>
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
    <section aria-label="Ruta a tiempo real">
      <div className="border-b-2 border-foreground pb-2 mb-3">
        <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Ruta a tiempo real
        </h2>
      </div>
      <div className="border border-border bg-background p-3 overflow-hidden">
        <div className="relative h-40 border border-border bg-muted/30 mb-3">
          <div className="absolute inset-3">
            <div className="absolute left-[12%] top-[70%] right-[12%] h-px bg-border" />
            <div className="absolute left-[12%] top-[70%] w-[76%] h-px bg-primary route-line" />
            <div className="absolute left-[10%] top-[63%] w-4 h-4 bg-primary rotate-45" />
            <div className="absolute right-[10%] top-[63%] w-4 h-4 bg-accent rotate-45" />
            <div className="route-vehicle absolute top-[58%] w-5 h-5 rounded-full bg-golden border-2 border-background shadow-sm" />
            {routePoints.slice(1, -1).map((point) => (
              <span
                key={point.id}
                className="absolute top-[66%] w-2 h-2 bg-foreground/60 rotate-45"
                style={{ left: `${12 + point.progress * 0.76}%` }}
                title={point.title}
              />
            ))}
          </div>
          <div className="absolute left-3 top-3">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">Sale</p>
            <p className="font-sans text-xs font-semibold text-foreground">{first.title}</p>
          </div>
          <div className="absolute right-3 bottom-3 text-right">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">Llega</p>
            <p className="font-sans text-xs font-semibold text-foreground">{last.title}</p>
          </div>
        </div>
        <div className="space-y-2">
          {routePoints.map((point) => (
            <div key={point.id} className="flex items-start gap-2">
              <MapPin size={12} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-sans text-xs font-semibold text-foreground">{point.title}</p>
                {point.description && <p className="font-sans text-[10px] leading-relaxed text-muted-foreground">{point.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DailyPollCard({ poll }: { poll: HomePoll | null }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [options, setOptions] = useState(() => poll?.options ?? [])
  const totalVotes = useMemo(() => options.reduce((sum, option) => sum + option.votes, 0), [options])

  if (!poll) return null

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
    <section aria-label="Encuesta diaria">
      <div className="border-b-2 border-foreground pb-2 mb-3">
        <h2 className="font-display font-bold text-sm uppercase tracking-wide text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
          Encuesta diaria
        </h2>
      </div>
      <div className="border border-border bg-background p-3">
        <div className="flex items-start gap-2 mb-3">
          <MessageCircle size={15} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="font-sans text-sm font-semibold leading-snug text-foreground">{poll.question}</p>
        </div>
        <div className="space-y-2">
          {options.map((option) => {
            const percent = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100)
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => vote(option.id)}
                className={`w-full text-left border px-2.5 py-2 transition-colors ${selected === option.id ? 'border-primary text-primary' : 'border-border text-foreground hover:border-primary/50'}`}
              >
                <span className="flex items-center justify-between gap-2 font-sans text-xs font-semibold">
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
        <p className="font-sans text-[10px] text-muted-foreground mt-3">{totalVotes} votos registrados</p>
      </div>
    </section>
  )
}
