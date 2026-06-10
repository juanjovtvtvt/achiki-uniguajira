'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { Category } from '@/lib/articles'

interface CategoryDrawerProps {
  open: boolean
  activeCategory: Category | null
  onCategoryChange: (cat: Category | null) => void
  onClose: () => void
  categories: Category[]
}

export function CategoryDrawer({
  open,
  activeCategory,
  onCategoryChange,
  onClose,
  categories,
}: CategoryDrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleSelect = (category: Category | null) => {
    onCategoryChange(category)
    onClose()
  }

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-40 bg-foreground/30 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        id="category-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de categorias"
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-72 max-w-[80vw] bg-background border-r border-border shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="font-display font-bold text-base text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              Secciones
            </p>
            <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest mt-0.5">
              Navegar por categoria
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar menu"
            className="w-8 h-8 flex items-center justify-center border border-border text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <nav aria-label="Categorias" className="flex-1 overflow-y-auto py-3">
          <button
            onClick={() => handleSelect(null)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
              activeCategory === null
                ? 'bg-primary/8 text-primary border-l-2 border-primary'
                : 'text-foreground hover:bg-muted border-l-2 border-transparent'
            }`}
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest">Todo</span>
          </button>

          <div className="my-2 mx-5 h-px bg-border" />

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                activeCategory === category
                  ? 'bg-primary/8 text-primary border-l-2 border-primary'
                  : 'text-foreground hover:bg-muted border-l-2 border-transparent'
              }`}
            >
              <span className="font-sans text-xs font-semibold uppercase tracking-widest">{category}</span>
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-border">
          <p className="font-sans text-[10px] text-muted-foreground leading-relaxed">
            &ldquo;Un espacio para contar la universidad, la region y las voces que merecen ser leidas.&rdquo;
          </p>
          <p className="font-sans text-[10px] text-accent mt-1 font-semibold tracking-wide">
            - Achiki Uniguajira
          </p>
        </div>
      </div>
    </>
  )
}
