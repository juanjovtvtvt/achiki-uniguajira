import Link from 'next/link'
import { Eye, Save, Trash2 } from 'lucide-react'
import { createCategory, deleteCategory, updateCategory } from '@/app/admin/actions'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { publications: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Taxonomia editorial</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Categorias
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <section className="bg-background border border-border p-4 h-fit">
          <h2 className="font-sans text-sm font-bold text-foreground mb-4">Crear categoria</h2>
          <form action={createCategory} className="space-y-4">
            <Field label="Nombre" htmlFor="new-name" required>
              <input id="new-name" name="name" required className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
            </Field>
            <Field label="Slug" htmlFor="new-slug">
              <input id="new-slug" name="slug" placeholder="se-genera-automaticamente" className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
            </Field>
            <Field label="Clase de color" htmlFor="new-color">
              <input id="new-color" name="colorClass" defaultValue="text-primary border-primary" className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
            </Field>
            <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save size={15} />
              Guardar categoria
            </button>
          </form>
        </section>

        <section className="bg-background border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                  <th className="text-left px-4 py-2 font-semibold">Slug</th>
                  <th className="text-left px-4 py-2 font-semibold">Publicaciones</th>
                  <th className="text-left px-4 py-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 min-w-[220px]">
                      <form id={`category-${category.id}`} action={updateCategory.bind(null, category.id)} className="space-y-2">
                        <input name="name" defaultValue={category.name} className="w-full border border-border bg-background px-2 py-1.5 text-sm font-sans font-semibold focus:outline-none focus:border-primary" />
                        <input name="colorClass" defaultValue={category.colorClass ?? ''} className="w-full border border-border bg-background px-2 py-1.5 text-xs font-sans text-muted-foreground focus:outline-none focus:border-primary" />
                      </form>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <input form={`category-${category.id}`} name="slug" defaultValue={category.slug} className="w-full border border-border bg-background px-2 py-1.5 text-sm font-sans focus:outline-none focus:border-primary" />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{category._count.publications}</td>
                    <td className="px-4 py-3 min-w-[260px]">
                      <div className="flex flex-wrap gap-2">
                        <button form={`category-${category.id}`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          <Save size={13} />
                          Guardar
                        </button>
                        <Link href={`/categorias/${category.slug}`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          <Eye size={13} />
                          Ver
                        </Link>
                        <form action={deleteCategory.bind(null, category.id)}>
                          <button disabled={category._count.publications > 0} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:pointer-events-none">
                            <Trash2 size={13} />
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
        {required ? ' *' : ''}
      </label>
      {children}
    </div>
  )
}
