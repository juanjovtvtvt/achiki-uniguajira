import Link from 'next/link'
import { Lock, Newspaper } from 'lucide-react'
import { loginAction } from '@/app/login/actions'
import { getSession, isAdminRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface LoginPageProps {
  searchParams: Promise<{
    error?: string
    google?: string
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, google, next } = await searchParams
  const session = await getSession()
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  if (session) {
    redirect(next || (isAdminRole(session.role) ? '/admin' : '/cuenta'))
  }

  return (
    <main className="min-h-screen bg-muted/25 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md bg-background border border-border">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={18} className="text-primary" />
            <p className="font-sans font-bold text-foreground">ACHIKI</p>
          </div>
          <h1
            className="font-display text-3xl font-bold text-foreground leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Iniciar sesion
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            Acceso para lectores registrados, autores y equipo editorial.
          </p>
        </div>

        <form action={loginAction} className="px-5 py-5 space-y-4">
          <input type="hidden" name="next" value={next ?? ''} />
          {error && (
            <div className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-sans text-destructive">
              Usuario o clave incorrectos.
            </div>
          )}
          {(google === 'missing' || !googleConfigured) && (
            <div className="border border-golden/40 bg-golden/10 px-3 py-2 text-sm font-sans text-foreground">
              El acceso con Google esta preparado, pero falta conectar las credenciales de Google en Vercel.
            </div>
          )}
          {google === 'error' && (
            <div className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-sans text-destructive">
              No fue posible iniciar sesion con Google. Intentalo de nuevo.
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Correo o usuario
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Clave
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
            />
          </div>

          <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Lock size={15} />
            Entrar
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">o</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {googleConfigured ? (
            <Link
              href={`/api/auth/google${next ? `?next=${encodeURIComponent(next)}` : ''}`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span className="font-bold">G</span>
              Continuar con Google
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-muted-foreground bg-muted/40 cursor-not-allowed"
            >
              <span className="font-bold">G</span>
              Google pendiente de configurar
            </button>
          )}
        </form>

        <div className="px-5 py-4 border-t border-border">
          <div className="font-sans text-xs text-muted-foreground leading-relaxed">
            Usuarios sembrados: autores con correos `@uniguajira.edu.co`. Clave inicial local: `achiki2026`.
          </div>
          <Link href="/" className="inline-block mt-3 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors">
            Volver al sitio
          </Link>
        </div>
      </section>
    </main>
  )
}
