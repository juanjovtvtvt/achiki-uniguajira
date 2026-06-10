import { HomeClient } from '@/app/home-client'
import { getSession } from '@/lib/auth'
import { getArticles, getCategories, getColumns, getEvents } from '@/lib/content'

export default async function HomePage() {
  const [articles, columns, categories, events, session] = await Promise.all([
    getArticles(),
    getColumns(),
    getCategories(),
    getEvents(),
    getSession(),
  ])

  return (
    <HomeClient
      articles={articles}
      columns={columns}
      categories={categories.map((category) => category.name)}
      events={events}
      session={session}
    />
  )
}
