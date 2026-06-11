'use client'

import { useState } from 'react'
import type { Article, Category, Column, EventItem } from '@/lib/articles'
import { Header } from '@/components/newspaper/Header'
import { CategoryDrawer } from '@/components/newspaper/CategoryDrawer'
import { CategorySidebar } from '@/components/newspaper/CategorySidebar'
import { NewsFeed } from '@/components/newspaper/NewsFeed'
import { EditorialColumn } from '@/components/newspaper/EditorialColumn'
import { CampusRouteSection, EngagementSpotlight } from '@/components/newspaper/EngagementPanel'
import { Footer } from '@/components/newspaper/Footer'
import Link from 'next/link'
import type { HomePoll, HomeRoute, PublicationOfDay } from '@/lib/content'

type MobileTab = 'noticias' | 'columna'
type PublicSession = {
  name: string
  email: string
  role: string
} | null

const TICKER_TEXT =
  'Rector de Uniguajira firma convenio con universidades de Mexico y Brasil · Festival Wayuu de Arte y Ciencia 2025: inscripciones abiertas · Nueva biblioteca digital disponible · Semillero de investigacion gana premio nacional · '

interface HomeClientProps {
  articles: Article[]
  columns: Column[]
  categories: Category[]
  events: EventItem[]
  session: PublicSession
  publicationOfDay: PublicationOfDay | null
  activePoll: HomePoll | null
  routes: HomeRoute[]
}

export function HomeClient({ articles, columns, categories, events, session, publicationOfDay, activePoll, routes }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('noticias')

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden w-full">
      <CategoryDrawer
        open={drawerOpen}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
      />

      <Header onMenuOpen={() => setDrawerOpen(true)} session={session} />

      <div className="w-full max-w-full bg-primary text-primary-foreground border-b border-primary/40" style={{ overflow: 'hidden' }}>
        <div className="flex items-stretch">
          <span className="flex-shrink-0 flex items-center px-3 py-1.5 bg-golden text-golden-foreground text-[10px] font-sans font-bold uppercase tracking-widest z-10">
            Ultimo
          </span>
          <div className="flex-1 min-w-0" style={{ overflow: 'hidden' }}>
            <p
              className="py-1.5 px-2 text-xs font-sans whitespace-nowrap"
              style={{ animation: 'marquee 35s linear infinite', display: 'inline-block' }}
              aria-label="Noticias de ultimo momento"
            >
              {TICKER_TEXT}{TICKER_TEXT}
            </p>
          </div>
        </div>
      </div>

      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <EngagementSpotlight publicationOfDay={publicationOfDay} activePoll={activePoll} isAuthenticated={Boolean(session)} />
      </section>

      <CampusRouteSection routes={routes} />

      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 overflow-x-hidden">
        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)_220px] lg:gap-0 py-8">
          <aside className="hidden lg:block lg:pr-7 lg:border-r lg:border-border min-w-0" aria-label="Secciones y estadisticas">
            <div className="sticky top-6">
              <CategorySidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categories={categories}
              />
            </div>
          </aside>

          <section aria-label="Noticias principales" className="lg:px-8 min-w-0 max-w-full">
            <div className="lg:hidden flex border-b border-border mb-6" role="tablist" aria-label="Secciones movil">
              <button
                role="tab"
                aria-selected={mobileTab === 'noticias'}
                onClick={() => setMobileTab('noticias')}
                className={`flex-1 py-2.5 text-xs font-sans font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                  mobileTab === 'noticias'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Noticias
              </button>
              <button
                role="tab"
                aria-selected={mobileTab === 'columna'}
                onClick={() => setMobileTab('columna')}
                className={`flex-1 py-2.5 text-xs font-sans font-semibold uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                  mobileTab === 'columna'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Columna
              </button>
            </div>

            <div role="tabpanel" aria-label="Noticias" className={mobileTab === 'noticias' ? 'block' : 'hidden lg:block'}>
              <NewsFeed activeCategory={activeCategory} articles={articles} />
            </div>

            <div role="tabpanel" aria-label="Columna, eventos y boletin" className={mobileTab === 'columna' ? 'block lg:hidden' : 'hidden'}>
              <div className="space-y-8">
                <EditorialColumn columns={columns} />
                <Divider />
                <EventsSidebar events={events} />
                <NewsletterBox />
              </div>
            </div>
          </section>

          <aside className="hidden lg:block lg:pl-7 lg:border-l lg:border-border min-w-0" aria-label="Columna editorial y eventos">
            <div className="sticky top-6 space-y-8">
              <EditorialColumn columns={columns} />
              <Divider />
              <EventsSidebar events={events} />
              <NewsletterBox />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-border" />
      <div className="w-2 h-2 bg-golden rotate-45 flex-shrink-0" />
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function EventsSidebar({ events }: { events: EventItem[] }) {
  return (
    <section aria-label="Proximos eventos">
      <div className="border-b-2 border-foreground pb-2 mb-4">
        <h2
          className="font-display font-bold text-sm uppercase tracking-wide text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Eventos
        </h2>
      </div>
      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="flex gap-3 items-start border-b border-border pb-3 last:border-b-0 last:pb-0">
            <span className="text-[10px] font-sans font-bold text-accent-foreground bg-accent px-1.5 py-1 whitespace-nowrap leading-none flex-shrink-0 mt-0.5">
              {event.date}
            </span>
            <Link href={`/eventos/${event.slug}`} className="text-xs font-sans text-foreground/80 leading-snug hover:text-primary transition-colors">
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function NewsletterBox() {
  return (
    <section aria-label="Boletin semanal">
      <div className="border-b-2 border-foreground pb-2 mb-3">
        <h2
          className="font-display font-bold text-sm uppercase tracking-wide text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Boletin
        </h2>
      </div>
      <p className="font-sans text-xs text-muted-foreground mb-3 leading-relaxed">
        Recibe las noticias mas importantes de Uniguajira directamente en tu correo.
      </p>
      <form action="/api/suscriptores" method="post" className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          placeholder="tu@correo.edu.co"
          aria-label="Correo electronico para boletin"
          className="w-full text-xs font-sans px-3 py-2 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        <button className="w-full text-xs font-sans font-semibold bg-primary text-primary-foreground py-2 hover:bg-primary/90 transition-colors uppercase tracking-wider">
          Suscribirse
        </button>
      </form>
    </section>
  )
}
