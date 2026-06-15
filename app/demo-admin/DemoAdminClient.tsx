'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { Archive, Eye, FileText, Mail, PlusCircle, RefreshCcw, Save, Tags, Trash2, Users, X } from 'lucide-react'

type DemoArticle = {
  id: number
  title: string
  slug: string
  category: string
  author: string
  status: string
  summary: string
}

type DemoAdminClientProps = {
  initialArticles: DemoArticle[]
  categories: string[]
  baseMetrics: {
    users: number
    categories: number
    events: number
    subscribers: number
  }
}

const statusLabels: Record<string, string> = {
  PUBLISHED: 'Publicado',
  DRAFT: 'Borrador',
  REVIEW: 'Revision',
  ARCHIVED: 'Archivado',
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function DemoAdminClient({ initialArticles, categories, baseMetrics }: DemoAdminClientProps) {
  const [articles, setArticles] = useState(initialArticles)
  const [editing, setEditing] = useState<DemoArticle | null>(null)
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState('Demo activo: los cambios no se guardan en la base de datos.')

  const metrics = useMemo(
    () => [
      { label: 'Publicaciones', value: articles.length, icon: FileText },
      { label: 'Usuarios', value: baseMetrics.users, icon: Users },
      { label: 'Categorias', value: baseMetrics.categories, icon: Tags },
      { label: 'Eventos', value: baseMetrics.events, icon: Archive },
      { label: 'Suscriptores', value: baseMetrics.subscribers, icon: Mail },
    ],
    [articles.length, baseMetrics],
  )

  function resetDemo() {
    setArticles(initialArticles)
    setEditing(null)
    setCreating(false)
    setNotice('Demo reiniciado. Tambien vuelve a cero con F5.')
  }

  function toggleStatus(article: DemoArticle) {
    const nextStatus = article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    setArticles((current) => current.map((item) => item.id === article.id ? { ...item, status: nextStatus } : item))
    setNotice(`"${article.title}" ahora aparece como ${statusLabels[nextStatus].toLowerCase()} solo en esta sesion.`)
  }

  function removeArticle(article: DemoArticle) {
    setArticles((current) => current.filter((item) => item.id !== article.id))
    setNotice(`"${article.title}" se elimino solo en esta demo.`)
  }

  function saveArticle(article: DemoArticle) {
    setArticles((current) => current.map((item) => item.id === article.id ? article : item))
    setEditing(null)
    setNotice(`"${article.title}" fue actualizado temporalmente.`)
  }

  function createArticle(article: Omit<DemoArticle, 'id'>) {
    const created = {
      ...article,
      id: Math.max(0, ...articles.map((item) => item.id)) + 1,
    }
    setArticles((current) => [created, ...current])
    setCreating(false)
    setNotice(`"${created.title}" fue creado solo en esta demo.`)
  }

  return (
    <main className="min-h-screen bg-muted/20">
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Panel demo</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              Admin ACHIKI temporal
            </h1>
            <p className="font-sans text-sm text-muted-foreground mt-2 max-w-2xl">
              Puedes crear, editar, publicar y eliminar sin tocar la base real. Al recargar con F5, todo vuelve al estado original.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="micro-lift inline-flex items-center justify-center px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors">
              Ver sitio
            </Link>
            <button onClick={resetDemo} className="micro-lift inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors">
              <RefreshCcw size={15} />
              Reiniciar demo
            </button>
            <button onClick={() => setCreating(true)} className="micro-lift inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <PlusCircle size={15} />
              Crear articulo
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-5 border border-golden/40 bg-golden/10 px-4 py-3 font-sans text-sm text-foreground">
          {notice}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="bg-background border border-border px-4 py-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <Icon size={18} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">{metric.label}</span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {metric.value}
                </p>
              </div>
            )
          })}
        </section>

        <section className="bg-background border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-4">
            <h2 className="font-sans text-sm font-bold text-foreground">Publicaciones demo</h2>
            <span className="font-sans text-xs text-muted-foreground">Estado local del navegador</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Titulo</th>
                  <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                  <th className="text-left px-4 py-2 font-semibold">Autor</th>
                  <th className="text-left px-4 py-2 font-semibold">Estado</th>
                  <th className="text-left px-4 py-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 min-w-[340px]">
                      <p className="font-semibold text-foreground">{article.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{article.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">{article.author}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3 min-w-[360px]">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/articulos/${article.slug}`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          <Eye size={13} />
                          Ver real
                        </Link>
                        <button onClick={() => setEditing(article)} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          Editar demo
                        </button>
                        <button onClick={() => toggleStatus(article)} className="inline-flex items-center px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          {article.status === 'PUBLISHED' ? 'Pasar a borrador' : 'Publicar'}
                        </button>
                        <button onClick={() => removeArticle(article)} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 size={13} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {editing && (
        <ArticleModal
          title="Editar articulo demo"
          article={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={saveArticle}
        />
      )}
      {creating && (
        <ArticleModal
          title="Crear articulo demo"
          categories={categories}
          onClose={() => setCreating(false)}
          onCreate={createArticle}
        />
      )}
    </main>
  )
}

function ArticleModal({
  title,
  article,
  categories,
  onClose,
  onSave,
  onCreate,
}: {
  title: string
  article?: DemoArticle
  categories: string[]
  onClose: () => void
  onSave?: (article: DemoArticle) => void
  onCreate?: (article: Omit<DemoArticle, 'id'>) => void
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const nextTitle = String(formData.get('title') ?? '').trim()
    const nextCategory = String(formData.get('category') ?? categories[0] ?? 'Universidad')
    const nextStatus = String(formData.get('status') ?? 'DRAFT')
    const nextSummary = String(formData.get('summary') ?? '').trim()
    const nextArticle = {
      title: nextTitle || 'Articulo sin titulo',
      slug: slugify(nextTitle || 'articulo-demo'),
      category: nextCategory,
      author: article?.author ?? 'Editor demo',
      status: nextStatus,
      summary: nextSummary || 'Resumen temporal de demostracion.',
    }

    if (article && onSave) {
      onSave({ ...article, ...nextArticle })
      return
    }

    onCreate?.(nextArticle)
  }

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 px-4 py-6 flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-2xl bg-background border border-border shadow-lg">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          <button type="button" onClick={onClose} className="micro-lift h-8 w-8 inline-flex items-center justify-center border border-border hover:bg-muted transition-colors" aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Titulo" name="title" defaultValue={article?.title ?? ''} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">Categoria</span>
              <select name="category" defaultValue={article?.category ?? categories[0]} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans outline-none focus:border-primary">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">Estado</span>
              <select name="status" defaultValue={article?.status ?? 'DRAFT'} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans outline-none focus:border-primary">
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">Resumen</span>
            <textarea name="summary" defaultValue={article?.summary ?? ''} rows={5} className="w-full resize-y border border-border bg-background px-3 py-2 text-sm font-sans outline-none focus:border-primary" />
          </label>
        </div>
        <div className="px-5 py-4 border-t border-border flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors">
            Cancelar
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Save size={15} />
            Guardar demo
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</span>
      <input name={name} defaultValue={defaultValue} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans outline-none focus:border-primary" />
    </label>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground">
      {statusLabels[status] ?? status}
    </span>
  )
}
