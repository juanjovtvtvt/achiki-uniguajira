import Link from 'next/link'
import { CalendarDays, Database, FileText, Home, LogOut, Mail, PlusCircle, Settings, Tags, Users } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'
import { requireAdmin } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()

  return (
    <div className="min-h-screen bg-muted/25">
      <header className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2 font-sans font-bold text-foreground">
            <Database size={18} className="text-primary" />
            Admin ACHIKI
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <Home size={14} />
              Sitio
            </Link>
            <Link href="/admin/articulos" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <FileText size={14} />
              Articulos
            </Link>
            <Link href="/admin/categorias" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <Tags size={14} />
              Categorias
            </Link>
            <Link href="/admin/eventos" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <CalendarDays size={14} />
              Eventos
            </Link>
            <Link href="/admin/usuarios" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <Users size={14} />
              Usuarios
            </Link>
            <Link href="/admin/suscriptores" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <Mail size={14} />
              Suscriptores
            </Link>
            <Link href="/admin/sistema" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
              <Settings size={14} />
              Sistema
            </Link>
            <Link href="/admin/articulos/nuevo" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <PlusCircle size={14} />
              Nuevo
            </Link>
            <form action={logoutAction}>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={14} />
                Salir
              </button>
            </form>
          </nav>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-2 -mt-1">
          <p className="text-[10px] font-sans text-muted-foreground">
            Sesion activa: <span className="font-semibold text-foreground">{session.username}</span>
          </p>
        </div>
      </header>
      {process.env.VERCEL && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:')) && (
        <div className="border-b border-golden/40 bg-golden/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
            <p className="text-xs font-sans text-foreground/80">
              Modo demo en Vercel: SQLite permite visualizar y probar el admin, pero para guardar cambios de forma permanente en produccion se debe conectar PostgreSQL.
            </p>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
