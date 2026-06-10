import { HomeClient } from '@/app/home-client'
import { getSession } from '@/lib/auth'
import { getActivePoll, getArticles, getCampusRoute, getCategories, getColumns, getEvents, getPublicationOfDay } from '@/lib/content'

export default async function HomePage() {
  const [articles, columns, categories, events, session, publicationOfDay, activePoll, routePoints] = await Promise.all([
    getArticles(),
    getColumns(),
    getCategories(),
    getEvents(),
    getSession(),
    getPublicationOfDay(),
    getActivePoll(),
    getCampusRoute(),
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
      routePoints={routePoints}
    />
  )
}
