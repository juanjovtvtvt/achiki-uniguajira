'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, LogIn, Pencil, Newspaper, Settings, UserCircle } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  onMenuOpen: () => void
  session: {
    name: string
    email: string
    role: string
  } | null
}

export function Header({ onMenuOpen, session }: HeaderProps) {
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }))
  }, [])

  return (
    <header className="w-full bg-background border-b border-border">
      <div className="border-b border-border/60 px-4 md:px-6 py-1.5 flex items-center justify-between gap-4">
        <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest hidden sm:block capitalize">
          {today || 'Medio estudiantil independiente'}
        </p>
        <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest sm:hidden">
          Medio estudiantil independiente
        </p>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserActions session={session} />
        </div>
      </div>

      <div className="px-4 md:px-6 py-5 md:py-7 flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="micro-lift lg:hidden flex items-center justify-center w-9 h-9 border border-border text-foreground hover:bg-muted transition-colors flex-shrink-0"
          aria-label="Abrir menu de categorias"
          aria-expanded="false"
          aria-controls="category-drawer"
        >
          <Menu size={18} />
        </button>

        <Link href="/" className="flex-1 flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5 mb-1">
            <Newspaper size={20} className="text-primary flex-shrink-0 hidden sm:block" aria-hidden="true" />
            <h1
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Achiki
            </h1>
          </div>
          <p className="text-[10px] font-sans uppercase tracking-[0.15em] sm:tracking-[0.22em] text-muted-foreground max-w-full px-2 text-center break-words">
            Medio digital estudiantil - Uniguajira y La Guajira
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="h-px w-12 bg-primary/40" />
            <div className="w-1.5 h-1.5 bg-golden rotate-45" />
            <div className="h-px w-12 bg-accent/40" />
          </div>
        </Link>

        <div className="w-9 flex-shrink-0 lg:hidden" aria-hidden="true" />
      </div>
    </header>
  )
}

function UserActions({ session }: { session: HeaderProps['session'] }) {
  if (!session) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/login"
          className="micro-lift flex items-center justify-center gap-1.5 text-[11px] font-sans text-foreground/65 hover:text-foreground transition-colors"
          aria-label="Iniciar sesion"
        >
          <LogIn size={13} />
          <span className="hidden sm:inline">Ingresar</span>
        </Link>
      </div>
    )
  }

  const isAdmin = ['ADMIN', 'EDITOR'].includes(session.role)

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link
        href="/cuenta"
        className="micro-lift flex items-center justify-center gap-1.5 text-[11px] font-sans text-foreground/65 hover:text-foreground transition-colors max-w-[150px]"
        aria-label="Mi cuenta"
      >
        <UserCircle size={13} />
        <span className="hidden sm:inline truncate">{session.name}</span>
      </Link>
      <div className="w-px h-3 bg-border" />
      <Link
        href="/cuenta/enviar"
        className="micro-lift flex items-center justify-center gap-1.5 text-[11px] font-sans font-semibold bg-primary text-primary-foreground px-2 py-1 hover:bg-primary/90 transition-colors"
        aria-label="Enviar publicacion"
      >
        <Pencil size={11} />
        <span className="hidden sm:inline">Enviar</span>
      </Link>
      {isAdmin && (
        <Link
          href="/admin"
          className="micro-lift flex items-center justify-center gap-1.5 text-[11px] font-sans text-foreground/65 hover:text-foreground transition-colors"
          aria-label="Editar sitio"
        >
          <Settings size={12} />
          <span className="hidden sm:inline">Editar</span>
        </Link>
      )}
    </div>
  )
}
