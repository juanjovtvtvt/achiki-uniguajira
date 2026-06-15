'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Lock, Newspaper, UserPlus } from 'lucide-react'
import { loginAction, registerAction } from '@/app/login/actions'

interface LoginClientProps {
  next?: string
  error?: string
  google?: string
  gmail?: string
  register?: string
  googleConfigured: boolean
}

export function LoginClient({ next, error, google, gmail, register }: LoginClientProps) {
  const googleHref = `/api/auth/google${next ? `?next=${encodeURIComponent(next)}` : ''}`

  return (
    <main className="min-h-screen bg-muted/25 flex items-center justify-center px-4 py-8">
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
            Acceso ACHIKI
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2">
            Entra o crea tu cuenta para reaccionar, comentar y enviar publicaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <section className="px-5 py-5 space-y-5 category-panel lg:border-r border-border" aria-label="Iniciar sesion">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-2">Iniciar sesion</p>
              <h2 className="font-display text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                Ya tengo cuenta
              </h2>
            </div>

            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="next" value={next ?? ''} />
              {error && <Alert>Usuario o clave incorrectos.</Alert>}
              {google === 'error' && <Alert>No fue posible iniciar sesion con Google. Intentalo de nuevo.</Alert>}
              {google === 'state' && <Alert>La sesion de Google expiro. Vuelve a intentarlo desde este boton.</Alert>}
              {google === 'token' && <Alert>Google rechazo el acceso. Revisa que el callback autorizado sea el dominio actual.</Alert>}
              {google === 'profile' && <Alert>No pudimos leer el perfil de Google. Intenta con otra cuenta o revisa permisos.</Alert>}
              {google === 'database' && <Alert>Google entro, pero no pudimos guardar el usuario. Revisa la base de datos.</Alert>}
              {google === 'missing' && <Alert>Google ya esta listo en la interfaz. Falta configurar las credenciales OAuth en Vercel.</Alert>}
              {gmail === 'invalid' && <Alert>Usa un correo terminado en @gmail.com.</Alert>}

              <Field label="Correo o usuario" id="username" name="username" autoComplete="username" />
              <Field label="Clave" id="password" name="password" type="password" autoComplete="current-password" />

              <button className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <Lock size={15} />
                Entrar
              </button>
            </form>

            <Divider />

            <a
              href={googleHref}
              className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span className="font-bold">G</span>
              Entrar con Google
            </a>
          </section>

          <section className="px-5 py-5 space-y-5 category-panel" aria-label="Crear cuenta">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary mb-2">Crear cuenta</p>
              <h2 className="font-display text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                Soy nuevo
              </h2>
            </div>

            <form action={registerAction} className="space-y-4">
              <input type="hidden" name="next" value={next ?? ''} />
              {register === 'invalid' && <Alert>Correo invalido o clave menor a 6 caracteres.</Alert>}
              {register === 'exists' && <Alert>Ese correo ya existe. Inicia sesion o usa Google.</Alert>}
              <Field label="Nombre" id="register-name" name="name" autoComplete="name" />
              <Field label="Correo" id="register-email" name="email" type="email" autoComplete="email" />
              <Field label="Clave nueva" id="register-password" name="password" type="password" autoComplete="new-password" />
              <button className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <UserPlus size={15} />
                Crear cuenta
              </button>
            </form>

            <Divider />

            <a
              href={googleHref}
              className="micro-lift w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span className="font-bold">G</span>
              Crear cuenta con Google
            </a>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-border">
          <Link href="/" className="inline-block font-sans text-xs text-muted-foreground hover:text-foreground transition-colors">
            Volver al sitio
          </Link>
        </div>
      </section>
    </main>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground">o</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

function Alert({ children }: { children: ReactNode }) {
  return <div className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-sans text-destructive">{children}</div>
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
