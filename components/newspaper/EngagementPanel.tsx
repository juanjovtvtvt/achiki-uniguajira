'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Bus, Heart, MessageCircle, Sparkles, ThumbsUp } from 'lucide-react'
import type { HomePoll, HomeRoute, PublicationOfDay } from '@/lib/content'

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
  routes: HomeRoute[]
  isAuthenticated?: boolean
}

export function EngagementPanel({ publicationOfDay, activePoll, routes, isAuthenticated = false }: EngagementPanelProps) {
  return (
    <div className="space-y-6">
      <EngagementSpotlight publicationOfDay={publicationOfDay} activePoll={activePoll} isAuthenticated={isAuthenticated} />
      <CampusRouteSection routes={routes} />
    </div>
  )
}

export function EngagementSpotlight({ publicationOfDay, activePoll, isAuthenticated = false }: Pick<EngagementPanelProps, 'publicationOfDay' | 'activePoll' | 'isAuthenticated'>) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 border-y border-border bg-background" aria-label="Destacados interactivos">
      <div className="lg:border-r border-border min-h-[48vh]">
        <PublicationOfDayCard publication={publicationOfDay} variant="hero" isAuthenticated={isAuthenticated} />
      </div>
      <div className="min-h-[48vh]">
        <DailyPollCard poll={activePoll} variant="hero" />
      </div>
    </section>
  )
}

export function CampusRouteSection({ routes }: Pick<EngagementPanelProps, 'routes'>) {
  return <CampusRouteMap routes={routes} />
}

function PublicationOfDayCard({ publication, variant = 'compact', isAuthenticated = false }: { publication: PublicationOfDay | null; variant?: 'compact' | 'hero'; isAuthenticated?: boolean }) {
  const [counts, setCounts] = useState(() => publication?.reactionCounts ?? [])
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | null>(() =>
    isReactionType(publication?.myReaction) ? publication.myReaction : null,
  )
  const [reactionNotice, setReactionNotice] = useState<string | null>(null)
  const [pendingReaction, setPendingReaction] = useState<ReactionType | null>(null)
  const total = counts.reduce((sum, reaction) => sum + reaction.count, 0)

  if (!publication) return null

  const react = async (type: ReactionType) => {
    if (!isAuthenticated) {
      setReactionNotice('Inicia sesion para reaccionar.')
      return
    }
    if (selectedReaction === type) {
      setReactionNotice('Ya tienes esta reaccion registrada.')
      return
    }

    setReactionNotice(null)
    setPendingReaction(type)

    const response = await fetch('/api/reacciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicationId: publication.id, type }),
    })

    if (response.ok) {
      const data = await response.json()
      setCounts(data.reactionCounts)
      setSelectedReaction(data.myReaction)
    } else if (response.status === 401) {
      setReactionNotice('Inicia sesion para reaccionar.')
    }

    setPendingReaction(null)
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
      <article className={hero ? 'h-full flex flex-col' : 'border border-border bg-background p-3'}>
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
                disabled={pendingReaction !== null}
                onClick={() => react(type)}
                className={`reaction-pop flex items-center justify-center gap-2 border px-2 py-3 transition-colors disabled:opacity-70 ${selectedReaction === type ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-primary hover:border-primary/50'}`}
                title={reactionLabels[type]}
              >
                <Icon size={hero ? 17 : 14} />
                <span className="font-sans text-xs font-semibold">{count}</span>
              </button>
            )
          })}
        </div>
        {reactionNotice && (
          <Link href="/login" className="mt-3 inline-block font-sans text-xs font-semibold text-primary hover:underline">
            {reactionNotice}
          </Link>
        )}
      </article>
    </section>
  )
}

function isReactionType(value: string | null | undefined): value is ReactionType {
  return value === 'LIKE' || value === 'INSIGHTFUL' || value === 'SUPPORT'
}

const tileSize = 256
const mapZoom = 14
const mapWidth = 1000
const mapHeight = 520

function lngToWorldX(lng: number) {
  return ((lng + 180) / 360) * Math.pow(2, mapZoom) * tileSize
}

function latToWorldY(lat: number) {
  const sin = Math.sin((lat * Math.PI) / 180)
  return (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * Math.pow(2, mapZoom) * tileSize
}

function buildMapProjection(route: HomeRoute) {
  const worldPoints = route.points.map((point) => ({
    ...point,
    x: lngToWorldX(point.lng),
    y: latToWorldY(point.lat),
  }))
  const minX = Math.min(...worldPoints.map((point) => point.x))
  const maxX = Math.max(...worldPoints.map((point) => point.x))
  const minY = Math.min(...worldPoints.map((point) => point.y))
  const maxY = Math.max(...worldPoints.map((point) => point.y))
  const routeWidth = Math.max(maxX - minX, 1)
  const routeHeight = Math.max(maxY - minY, 1)
  const desiredAspect = mapWidth / mapHeight
  let viewWidth = Math.max(routeWidth * 2.7, 1300)
  let viewHeight = Math.max(routeHeight * 2.7, 760)

  if (viewWidth / viewHeight > desiredAspect) {
    viewHeight = viewWidth / desiredAspect
  } else {
    viewWidth = viewHeight * desiredAspect
  }

  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const left = centerX - viewWidth / 2
  const top = centerY - viewHeight / 2
  const projected = worldPoints.map((point) => ({
    ...point,
    px: ((point.x - left) / viewWidth) * mapWidth,
    py: ((point.y - top) / viewHeight) * mapHeight,
  }))
  const tiles = []
  const minTileX = Math.floor(left / tileSize)
  const maxTileX = Math.floor((left + viewWidth) / tileSize)
  const minTileY = Math.floor(top / tileSize)
  const maxTileY = Math.floor((top + viewHeight) / tileSize)

  for (let x = minTileX; x <= maxTileX; x += 1) {
    for (let y = minTileY; y <= maxTileY; y += 1) {
      tiles.push({
        x,
        y,
        left: ((x * tileSize - left) / viewWidth) * 100,
        top: ((y * tileSize - top) / viewHeight) * 100,
        width: (tileSize / viewWidth) * 100,
        height: (tileSize / viewHeight) * 100,
      })
    }
  }

  return { projected, tiles }
}

function pathFromProjected(points: { px: number; py: number }[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.px.toFixed(1)} ${point.py.toFixed(1)}`).join(' ')
}

function CampusRouteMap({ routes }: { routes: HomeRoute[] }) {
  const [selectedRouteKey, setSelectedRouteKey] = useState(routes[0]?.key ?? '')
  const selectedRoute = routes.find((route) => route.key === selectedRouteKey) ?? routes[0]

  if (!selectedRoute || selectedRoute.points.length === 0) return null

  const { projected, tiles } = buildMapProjection(selectedRoute)
  const stopPoints = projected.filter((point) => point.isStop)
  const visibleStops = selectedRoute.points.filter((point) => point.isStop)
  const first = stopPoints[0] ?? projected[0]
  const last = stopPoints[stopPoints.length - 1] ?? projected[projected.length - 1]
  const routePath = pathFromProjected(projected)

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
      <div className="border border-border bg-background overflow-hidden">
        <div className="route-plan-map relative h-[380px] md:h-[560px] w-full overflow-hidden border-b border-border bg-muted">
          {tiles.map((tile) => (
            <img
              key={`${tile.x}-${tile.y}`}
              src={`https://tile.openstreetmap.org/${mapZoom}/${tile.x}/${tile.y}.png`}
              alt=""
              aria-hidden="true"
              className="absolute max-w-none select-none"
              style={{
                left: `${tile.left}%`,
                top: `${tile.top}%`,
                width: `${tile.width}%`,
                height: `${tile.height}%`,
              }}
              draggable={false}
            />
          ))}
          <div className="absolute inset-0 bg-[rgba(245,241,232,0.18)]" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
            <path d={routePath} fill="none" stroke="rgba(255,255,255,0.92)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routePath} fill="none" stroke="rgba(36,31,27,0.26)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path className="route-plan-line" d={routePath} fill="none" stroke="var(--primary)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d={routePath} fill="none" stroke="var(--golden)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="9 10" />
            <g className="route-plan-bus">
              <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={routePath} />
              <circle cx="0" cy="0" r="13" fill="rgba(245,241,232,0.94)" stroke="rgba(36,31,27,0.38)" strokeWidth="2" />
              <rect x="-9" y="-6" width="18" height="12" rx="3" fill="var(--golden)" stroke="rgba(36,31,27,0.5)" strokeWidth="1.5" />
              <rect x="-5" y="-3" width="4" height="4" rx="1" fill="rgba(232,248,250,0.94)" />
              <rect x="2" y="-3" width="4" height="4" rx="1" fill="rgba(232,248,250,0.94)" />
            </g>
          </svg>
          {stopPoints.map((point, index) => (
            <div
              key={point.id}
              className="route-plan-stop"
              style={{ left: `${(point.px / mapWidth) * 100}%`, top: `${(point.py / mapHeight) * 100}%` }}
              title={point.title}
            >
              <span className="route-plan-stop-dot" />
              <span className="route-plan-stop-label">{index === 0 ? 'U' : index === stopPoints.length - 1 ? last.title : index + 1}</span>
            </div>
          ))}
          <div className="absolute left-4 bottom-4 rounded-sm bg-background/95 border border-border px-3 py-2 shadow-sm">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">Mapa real de Riohacha / Vista superior</p>
            <p className="font-sans text-xs font-semibold text-foreground">Ruta {selectedRoute.name}: {first.title} - {last.title}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <p className="font-sans text-xs leading-relaxed text-muted-foreground max-w-xl">
              Escoge la ruta para ver el recorrido simulado sobre mapa real de Riohacha.
            </p>
            <p className="font-sans text-[10px] uppercase tracking-widest text-primary">
              {selectedRoute.name} / {visibleStops.length} paradas
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {routes.map((route) => (
              <button
                key={route.key}
                type="button"
                onClick={() => setSelectedRouteKey(route.key)}
                className={`micro-lift border px-2 py-2 text-center font-sans text-[10px] font-semibold uppercase tracking-wide transition-colors min-h-11 ${selectedRoute.key === route.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:border-primary/60'}`}
              >
                {route.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {visibleStops.map((point) => (
              <div key={point.id} className="flex items-start gap-2 border border-border px-2.5 py-2">
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
                className={`micro-lift w-full text-left border px-3 py-3 transition-colors ${selected === option.id ? 'border-primary text-primary' : 'border-border text-foreground hover:border-primary/50'}`}
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
