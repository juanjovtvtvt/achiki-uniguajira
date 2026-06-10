export type Category = string

export interface Article {
  id: number
  category: Category
  title: string
  summary: string
  author: string
  date: string
  image: string
  featured?: boolean
  slug: string
  content?: string | null
}

export interface Column {
  id: number
  date: string
  title: string
  excerpt: string
  author: string
  program: string
  slug: string
}

export interface EventItem {
  id: number
  date: string
  title: string
  slug: string
  location?: string | null
}

export const categoryColors: Record<string, string> = {
  Universidad: 'text-primary border-primary',
  Region: 'text-accent border-accent',
  Cultura: 'text-[oklch(0.62_0.14_35)] border-[oklch(0.62_0.14_35)]',
  Investigacion: 'text-primary border-primary',
  Deportes: 'text-[oklch(0.5_0.15_25)] border-[oklch(0.5_0.15_25)]',
  Opinion: 'text-muted-foreground border-muted-foreground',
  Eventos: 'text-golden border-golden',
}
