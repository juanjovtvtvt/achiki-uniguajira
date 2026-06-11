import Link from 'next/link'
import type { ReactNode } from 'react'
import { Lock, Mail, Newspaper, UserPlus } from 'lucide-react'
import { gmailQuickAction, loginAction, registerAction } from '@/app/login/actions'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface LoginPageProps {
  searchParams: Promise<{
    error?: string
    google?: string
    gmail?: string
    register?: string
    next?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, google, gmail, register, next } = await searchParams
  const session = await getSession()
  const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  if (session) {
    redirect(next || '/')
  }

  return (
    <main className="min-h-screen bg-muted/25 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-4xl bg-background border border-border shadow-sm">
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
            Entra para reaccionar, votar y enviar publicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr]">
          <div className="px-5 py-5 space-y-5 lg:border-r border-border">
            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="next" value={next ?? ''} />
              {error && <Alert tone="error">Usuario o clave incorrectos.</Alert>}
              {google === 'error' && <Alert tone="error">No fue posible iniciar sesion con Google. Intentalo de nuevo.</Alert>}
              {gmail === 'invalid' && <Alert tone="error">Usa un correo terminado en @gmail.com para el acceso rapido.</Alert>}

              <Field label="Correo o usuario" id="username" name="username" autoComplete="username" />
              <Field label="Clave" id="password" name="password" type="password" autoComplete="current-password" />

              <button className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Lock size={15} />
                Entrar
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">Gmail</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {googleConfigured && (
              <Link
                href={`/api/auth/google${next ? `?next=${encodeURIComponent(next)}` : ''}`}
                className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors"
              >
                <span className="font-bold">G</span>
                Continuar con Google
              </Link>
            )}

            <form action={gmailQuickAction} className="space-y-3 border border-border p-3">
              <input type="hidden" name="next" value={next ?? ''} />
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">Entrar con Gmail</p>
              <Field label="Tu Gmail" id="quick-email" name="email" type="email" autoComplete="email" placeholder="tu@gmail.com" />
              <Field label="Nombre visible" id="quick-name" name="name" autoComplete="name" required={false} />
              <button className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                <Mail size={15} />
                Entrar rapido
              </button>
            </form>
          </div>

          <form action={registerAction} className="px-5 py-5 space-y-4">
            <input type="hidden" name="next" value={next ?? ''} />
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-2">Crear cuenta</p>
              <h2 className="font-display text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                Crear cuenta
              </h2>
              <p className="font-sans text-sm text-muted-foreground mt-2">
                Registra tu correo para usar las funciones del periodico.
              </p>
            </div>
            {register === 'invalid' && <Alert tone="error">Correo invalido o clave menor a 6 caracteres.</Alert>}
            {register === 'exists' && <Alert tone="error">Ese correo ya existe. Inicia sesion o usa acceso rapido.</Alert>}
            <Field label="Nombre" id="register-name" name="name" autoComplete="name" />
            <Field label="Correo" id="register-email" name="email" type="email" autoComplete="email" />
            <Field label="Clave nueva" id="register-password" name="password" type="password" autoComplete="new-password" />
            <button className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <UserPlus size={15} />
              Crear cuenta
            </button>
          </form>
        </div>

        <div className="px-5 py-4 border-t border-border">
          <Link href="/" className="inline-block mt-3 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors">
            Volver al sitio
          </Link>
        </div>
      </section>
    </main>
  )
}

function Alert({ children, tone }: { children: ReactNode; tone: 'error' | 'soft' }) {
  const className = tone === 'error'
    ? 'border-destructive/30 bg-destructive/10 text-destructive'
    : 'border-golden/40 bg-golden/10 text-foreground'

  return <div className={`border px-3 py-2 text-sm font-sans ${className}`}>{children}</div>
}

function Field({
  label,
  id,
  name,
  type = 'text',
  autoComplete,
  placeholder,
  required = true,
}: {
  label: string
  id: string
  name: string
  type?: string
  autoComplete?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="w-full border border-border bg-background px-3 py-2 text-sm font-sans transition-colors focus:outline-none focus:border-primary focus:bg-muted/20"
      />
    </div>
  )
}
