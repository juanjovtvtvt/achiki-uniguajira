import { HomeClient } from '@/app/home-client'
import { getSession } from '@/lib/auth'
import { getActivePoll, getArticles, getCampusRoutes, getCategories, getColumns, getEvents, getPublicationOfDay } from '@/lib/content'

export default async function HomePage() {
  const [articles, columns, categories, events, session, publicationOfDay, activePoll, routes] = await Promise.all([
    getArticles(),
    getColumns(),
    getCategories(),
    getEvents(),
    getSession(),
    getPublicationOfDay(),
    getActivePoll(),
    getCampusRoutes(),
  ])

  return (
    <HomeClient
      articles={articles}
      columns={columns}
      categories={categories.map((category) => category.name)}
      events={events}
      session={session}
      publicationOfDay={publicationOfDay}
      activePoll={activePoll}
      routes={routes}
    />
  )
}
