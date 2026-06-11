import type { Category } from '@/lib/articles'

interface CategorySidebarProps {
  activeCategory: Category | null
  onCategoryChange: (cat: Category | null) => void
  categories: Category[]
}

export function CategorySidebar({ activeCategory, onCategoryChange, categories }: CategorySidebarProps) {
  return (
    <aside aria-label="Categorias" className="w-full">
      <div className="border-b-2 border-foreground pb-2 mb-4">
        <h2
          className="font-display font-bold text-sm uppercase tracking-wide text-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Secciones
        </h2>
      </div>

      <nav>
        <button
          onClick={() => onCategoryChange(null)}
          className={`micro-lift w-full flex items-center gap-2 py-2.5 border-b border-border text-left transition-colors group ${
            activeCategory === null ? 'text-primary' : 'text-foreground hover:text-primary'
          }`}
        >
          <span className={`w-1.5 h-1.5 rotate-45 flex-shrink-0 ${activeCategory === null ? 'bg-primary' : 'bg-border group-hover:bg-primary/50'}`} aria-hidden="true" />
          <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">Todo</span>
        </button>

        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`micro-lift w-full flex items-center gap-2 py-2.5 border-b border-border text-left transition-colors group ${
              activeCategory === category ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            <span className={`w-1.5 h-1.5 rotate-45 flex-shrink-0 ${activeCategory === category ? 'bg-primary' : 'bg-border group-hover:bg-primary/50'}`} aria-hidden="true" />
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest">{category}</span>
          </button>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1 py-5">
        <div className="w-px h-5 bg-border" />
        <div className="w-1.5 h-1.5 bg-accent rotate-45" />
        <div className="w-px h-5 bg-border" />
      </div>

      <div>
        <div className="border-b-2 border-foreground pb-2 mb-4">
          <h2
            className="font-display font-bold text-sm uppercase tracking-wide text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            En cifras
          </h2>
        </div>
        <p className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase mb-4">
          Uniguajira hoy
        </p>
        <ul className="space-y-4">
          {[
            { value: '12.400', desc: 'estudiantes matriculados' },
            { value: '48', desc: 'programas de pregrado' },
            { value: '7', desc: 'grupos de investigacion' },
            { value: '32', desc: 'anos formando profesionales' },
          ].map((item) => (
            <li key={item.desc} className="border-b border-border pb-4 last:border-b-0">
              <p
                className="font-display font-bold text-2xl text-primary leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {item.value}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1 leading-snug">{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center gap-1 py-5">
        <div className="w-px h-5 bg-border" />
        <div className="w-1.5 h-1.5 bg-golden rotate-45" />
        <div className="w-px h-5 bg-border" />
      </div>

      <div>
        <div className="border-b-2 border-foreground pb-2 mb-3">
          <h2
            className="font-display font-bold text-sm uppercase tracking-wide text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Achiki dice
          </h2>
        </div>
        <blockquote
          className="font-display italic text-sm leading-relaxed text-foreground/75"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          &ldquo;Un espacio para contar la universidad, la region y las voces que merecen ser leidas.&rdquo;
        </blockquote>
      </div>
    </aside>
  )
}
