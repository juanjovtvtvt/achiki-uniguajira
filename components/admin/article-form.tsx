import Link from 'next/link'
import type { Category, Publication, PublicationImage, User } from '@prisma/client'

type PublicationWithImage = Publication & {
  images: PublicationImage[]
}

interface ArticleFormProps {
  action: (formData: FormData) => Promise<void>
  categories: Category[]
  authors: User[]
  publication?: PublicationWithImage
  submitLabel: string
}

export function ArticleForm({ action, categories, authors, publication, submitLabel }: ArticleFormProps) {
  const primaryImage = publication?.images.find((image) => image.isPrimary) ?? publication?.images[0]

  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
      <section className="bg-background border border-border p-4 md:p-5 space-y-5">
        <Field label="Titulo" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={publication?.title}
            className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
          />
        </Field>

        <Field label="Slug" htmlFor="slug">
          <input
            id="slug"
            name="slug"
            defaultValue={publication?.slug}
            placeholder="se-genera-automaticamente-si-lo-dejas-vacio"
            className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
          />
        </Field>

        <Field label="Resumen" htmlFor="summary" required>
          <textarea
            id="summary"
            name="summary"
            required
            rows={4}
            defaultValue={publication?.summary}
            className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary resize-y"
          />
        </Field>

        <Field label="Contenido" htmlFor="content">
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={publication?.content ?? ''}
            className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary resize-y"
          />
        </Field>
      </section>

      <aside className="space-y-4">
        <section className="bg-background border border-border p-4 space-y-4">
          <Field label="Categoria" htmlFor="categoryId" required>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={publication?.categoryId}
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Autor" htmlFor="authorId" required>
            <select
              id="authorId"
              name="authorId"
              required
              defaultValue={publication?.authorId}
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            >
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Estado" htmlFor="status">
            <select
              id="status"
              name="status"
              defaultValue={publication?.status ?? 'DRAFT'}
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            >
              <option value="DRAFT">Borrador</option>
              <option value="REVIEW">Revision</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="ARCHIVED">Archivado</option>
            </select>
          </Field>

          <label className="flex items-center gap-2 text-sm font-sans text-foreground">
            <input type="checkbox" name="featured" defaultChecked={publication?.featured} />
            Marcar como destacado
          </label>
        </section>

        <section className="bg-background border border-border p-4 space-y-4">
          <Field label="Imagen principal" htmlFor="imageUrl">
            <input
              id="imageUrl"
              name="imageUrl"
              defaultValue={primaryImage?.url ?? '/placeholder.jpg'}
              placeholder="/images/article-cultura.jpg"
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            />
          </Field>
          <p className="text-xs font-sans text-muted-foreground leading-relaxed">
            Por ahora usa una ruta existente dentro de <span className="font-semibold">public</span>, por ejemplo /images/featured-article.jpg.
          </p>
        </section>

        <div className="bg-background border border-border p-4 flex flex-col gap-2">
          <button className="w-full px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            {submitLabel}
          </button>
          <Link href="/admin/articulos" className="w-full px-4 py-2 text-sm font-sans font-semibold border border-border text-center hover:bg-muted transition-colors">
            Cancelar
          </Link>
        </div>
      </aside>
    </form>
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
