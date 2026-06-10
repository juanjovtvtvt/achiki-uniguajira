import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'
import { submitPublication } from '@/app/cuenta/actions'
import { requireSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface SubmitPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  await requireSession()
  const { error } = await searchParams
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <main className="min-h-screen bg-muted/25">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <Link href="/cuenta" className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-primary hover:gap-3 transition-all mb-6">
          <ArrowLeft size={14} />
          Volver a mi cuenta
        </Link>

        <section className="bg-background border border-border">
          <div className="px-5 py-5 border-b border-border">
            <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Participacion</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              Enviar publicacion
            </h1>
            <p className="font-sans text-sm text-muted-foreground mt-2">
              Tu texto quedara en revision antes de publicarse.
            </p>
          </div>

          <form action={submitPublication} className="px-5 py-5 space-y-4">
            {error && (
              <div className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-sans text-destructive">
                Completa titulo, resumen, contenido y categoria.
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Titulo
              </label>
              <input
                id="title"
                name="title"
                required
                className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Categoria
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              >
                <option value="">Selecciona una categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="summary" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Resumen
              </label>
              <textarea
                id="summary"
                name="summary"
                required
                rows={3}
                className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
                Texto completo
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={10}
                className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Send size={15} />
                Enviar a revision
              </button>
              <Link href="/cuenta" className="inline-flex items-center justify-center px-4 py-2 text-sm font-sans font-semibold border border-border hover:bg-muted transition-colors">
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
