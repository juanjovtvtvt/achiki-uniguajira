import Link from 'next/link'
import { FileText, LogOut, Pencil, ShieldCheck, UserCircle } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'
import { requireSession, isAdminRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateProfile } from './actions'

export const dynamic = 'force-dynamic'

interface AccountPageProps {
  searchParams: Promise<{
    sent?: string
    profile?: string
  }>
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const session = await requireSession()
  const { sent, profile } = await searchParams
  const [user, publications] = session.userId
    ? await Promise.all([
        prisma.user.findUnique({
          where: { id: session.userId },
          select: {
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        }),
        prisma.publication.findMany({
          where: { authorId: session.userId },
          include: { category: true },
          orderBy: { updatedAt: 'desc' },
          take: 12,
        }),
      ])
    : [null, []]
  const publicAvatarUrl = user?.avatarUrl?.startsWith('http') ? user.avatarUrl : ''

  return (
    <main className="min-h-screen bg-muted/25">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Cuenta ACHIKI</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
              Hola, {session.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex items-center justify-center px-3 py-2 text-xs font-sans border border-border bg-background hover:bg-muted transition-colors">
              Ir al sitio
            </Link>
            {isAdminRole(session.role) && (
              <Link href="/admin" className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                <ShieldCheck size={13} />
                Admin
              </Link>
            )}
            <form action={logoutAction}>
              <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-sans border border-border bg-background hover:bg-muted transition-colors">
                <LogOut size={13} />
                Salir
              </button>
            </form>
          </div>
        </div>

        {sent === '1' && (
          <div className="mb-6 border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-sans text-foreground">
            Publicacion enviada a revision editorial.
          </div>
        )}

        {profile === '1' && (
          <div className="mb-6 border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-sans text-foreground">
            Perfil actualizado.
          </div>
        )}

        {profile === 'invalid' && (
          <div className="mb-6 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
            Escribe un nombre visible de al menos 2 caracteres.
          </div>
        )}

        {profile === 'url' && (
          <div className="mb-6 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
            La foto debe ser un enlace publico que empiece por http o https.
          </div>
        )}

        {profile === 'image' && (
          <div className="mb-6 border border-golden/50 bg-golden/10 px-4 py-3 text-sm font-sans text-foreground">
            Sube una imagen JPG, PNG, WebP o GIF de maximo 1.5 MB.
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <aside className="bg-background border border-border p-5 h-fit">
            <div className="flex items-center gap-3 mb-4">
              <AccountAvatar name={user?.name ?? session.name} avatarUrl={user?.avatarUrl ?? null} />
              <div className="min-w-0">
                <p className="font-sans font-bold text-foreground truncate">{user?.name ?? session.name}</p>
                <p className="font-sans text-xs text-muted-foreground truncate">{user?.email ?? session.email}</p>
              </div>
            </div>
            <dl className="space-y-3 font-sans text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Rol</dt>
                <dd className="font-semibold text-foreground">{labelRole(session.role)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Ingreso</dt>
                <dd className="font-semibold text-foreground">{labelProvider(session.provider)}</dd>
              </div>
            </dl>
            <Link href="/cuenta/enviar" className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Pencil size={15} />
              Enviar publicacion
            </Link>

            <form action={updateProfile} className="mt-6 pt-5 border-t border-border space-y-3">
              <div>
                <label htmlFor="name" className="block text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Nombre visible
                </label>
                <input
                  id="name"
                  name="name"
                  defaultValue={user?.name ?? session.name}
                  minLength={2}
                  required
                  className="w-full border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label htmlFor="avatarUrl" className="block text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Foto de perfil
                </label>
                <input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  defaultValue={publicAvatarUrl}
                  placeholder="https://..."
                  className="w-full border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <p className="mt-1 font-sans text-[11px] leading-4 text-muted-foreground">
                  Puedes pegar un enlace publico o subir una imagen abajo.
                </p>
              </div>
              <div>
                <label htmlFor="avatarFile" className="block text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Subir imagen
                </label>
                <input
                  id="avatarFile"
                  name="avatarFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="w-full border border-border bg-background px-3 py-2 font-sans text-xs text-foreground file:mr-3 file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="mt-1 font-sans text-[11px] leading-4 text-muted-foreground">
                  Si subes una imagen, reemplaza el enlace. Maximo 900 KB.
                </p>
              </div>
              <div>
                <label htmlFor="bio" className="block text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  maxLength={240}
                  defaultValue={user?.bio ?? ''}
                  className="w-full resize-y border border-border bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <button className="w-full px-4 py-2 text-sm font-sans font-bold border border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all">
                Guardar perfil
              </button>
            </form>
          </aside>

          <section className="bg-background border border-border">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
              <h2 className="font-sans text-sm font-bold text-foreground">Mis publicaciones</h2>
              <FileText size={16} className="text-primary" />
            </div>
            {publications.length === 0 ? (
              <div className="px-4 py-10 text-center font-sans text-sm text-muted-foreground">
                Todavia no tienes publicaciones enviadas.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead className="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold">Titulo</th>
                      <th className="text-left px-4 py-2 font-semibold">Categoria</th>
                      <th className="text-left px-4 py-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publications.map((publication) => (
                      <tr key={publication.id} className="border-t border-border">
                        <td className="px-4 py-3 min-w-[300px]">
                          <p className="font-semibold text-foreground">{publication.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">/{publication.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{publication.category.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-widest border border-border text-muted-foreground">
                            {labelStatus(publication.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

function AccountAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`Foto de ${name}`}
        className="h-12 w-12 shrink-0 rounded-full border border-border object-cover bg-muted"
        referrerPolicy="no-referrer"
      />
    )
  }

  return <UserCircle size={48} className="shrink-0 text-primary" />
}

function labelRole(role: string) {
  return {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    AUTHOR: 'Autor',
    READER: 'Usuario',
  }[role] ?? role
}

function labelProvider(provider: string) {
  return {
    google: 'Google',
    gmail: 'Gmail',
    credentials: 'Correo y clave',
  }[provider] ?? provider
}

function labelStatus(status: string) {
  return {
    PUBLISHED: 'Publicado',
    DRAFT: 'Borrador',
    REVIEW: 'En revision',
    ARCHIVED: 'Archivado',
  }[status] ?? status
}
