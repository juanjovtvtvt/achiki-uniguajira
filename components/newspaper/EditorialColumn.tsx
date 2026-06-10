import Link from 'next/link'
import type { Column } from '@/lib/articles'
import { ArrowRight, Pen } from 'lucide-react'

interface ColumnCardProps {
  column: Column
  index: number
  total: number
}

function ColumnCard({ column, index, total }: ColumnCardProps) {
  return (
    <article className={`py-5 ${index < total - 1 ? 'border-b border-border' : ''}`}>
      <time className="text-[10px] font-sans tracking-widest text-muted-foreground uppercase block">
        {column.date}
      </time>
      <h3
        className="font-display font-bold text-base leading-snug mt-1.5 mb-2 text-foreground text-pretty"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <Link href={`/articulos/${column.slug}`} className="hover:text-accent transition-colors">
          {column.title}
        </Link>
      </h3>
      <p className="font-sans text-sm leading-relaxed text-foreground/75 line-clamp-4 mb-3 italic">
        &ldquo;{column.excerpt}&rdquo;
      </p>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div>
          <p className="text-xs font-sans font-semibold text-foreground">{column.author}</p>
          <p className="text-[10px] font-sans text-muted-foreground mt-0.5">{column.program}</p>
        </div>
        <Link href={`/articulos/${column.slug}`} className="flex items-center gap-1 text-[10px] font-sans font-semibold text-accent hover:gap-1.5 transition-all">
          Leer <ArrowRight size={10} />
        </Link>
      </div>
    </article>
  )
}

interface EditorialColumnProps {
  columns: Column[]
}

export function EditorialColumn({ columns }: EditorialColumnProps) {
  return (
    <aside aria-label="Columna de opinion" className="w-full">
      <div className="flex items-center gap-2 pb-3 border-b-2 border-foreground mb-1">
        <Pen size={14} className="text-accent flex-shrink-0" aria-hidden="true" />
        <h2
          className="font-display font-bold text-base tracking-wide text-foreground uppercase"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Columna
        </h2>
      </div>
      <p className="text-[10px] font-sans text-muted-foreground tracking-widest uppercase mb-1">
        Voces de la universidad
      </p>

      <div>
        {columns.map((column, index) => (
          <ColumnCard key={column.id} column={column} index={index} total={columns.length} />
        ))}
      </div>
    </aside>
  )
}
