import { Save, Trash2 } from 'lucide-react'
import { createUser, deleteUser, updateUser } from '@/app/admin/actions'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

const roles = [
  { value: 'READER', label: 'Lector' },
  { value: 'AUTHOR', label: 'Autor' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'ADMIN', label: 'Admin' },
]

export default async function AdminUsersPage() {
  const [users, programs] = await Promise.all([
    prisma.user.findMany({
      include: {
        program: true,
        _count: {
          select: { publications: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.program.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <p className="text-xs font-sans uppercase tracking-widest text-primary font-semibold">Equipo editorial</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: 'var(--font-display)' }}>
          Usuarios
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <section className="bg-background border border-border p-4 h-fit">
          <h2 className="font-sans text-sm font-bold text-foreground mb-4">Crear usuario</h2>
          <form action={createUser} className="space-y-4">
            <Input label="Nombre" name="name" required />
            <Input label="Correo" name="email" type="email" required />
            <Input label="Clave inicial" name="password" type="password" />
            <Input label="Firma publica" name="publicSignature" />
            <Select label="Rol" name="role" options={roles} />
            <ProgramSelect programs={programs} />
            <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-sans font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save size={15} />
              Guardar usuario
            </button>
          </form>
        </section>

        <section className="bg-background border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-semibold">Usuario</th>
                  <th className="text-left px-4 py-2 font-semibold">Rol</th>
                  <th className="text-left px-4 py-2 font-semibold">Programa</th>
                  <th className="text-left px-4 py-2 font-semibold">Publicaciones</th>
                  <th className="text-left px-4 py-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 min-w-[260px]">
                      <form id={`user-${user.id}`} action={updateUser.bind(null, user.id)} className="space-y-2">
                        <input name="name" defaultValue={user.name} className="w-full border border-border bg-background px-2 py-1.5 text-sm font-sans font-semibold focus:outline-none focus:border-primary" />
                        <input name="email" defaultValue={user.email} className="w-full border border-border bg-background px-2 py-1.5 text-xs font-sans text-muted-foreground focus:outline-none focus:border-primary" />
                        <input name="password" type="password" placeholder="Nueva clave (opcional)" className="w-full border border-border bg-background px-2 py-1.5 text-xs font-sans text-muted-foreground focus:outline-none focus:border-primary" />
                        <input name="publicSignature" defaultValue={user.publicSignature ?? ''} className="w-full border border-border bg-background px-2 py-1.5 text-xs font-sans text-muted-foreground focus:outline-none focus:border-primary" />
                      </form>
                    </td>
                    <td className="px-4 py-3 min-w-[140px]">
                      <select form={`user-${user.id}`} name="role" defaultValue={user.role} className="w-full border border-border bg-background px-2 py-1.5 text-sm font-sans focus:outline-none focus:border-primary">
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                      <select form={`user-${user.id}`} name="status" defaultValue={user.status} className="w-full border border-border bg-background px-2 py-1.5 text-xs font-sans mt-2 focus:outline-none focus:border-primary">
                        <option value="ACTIVE">Activo</option>
                        <option value="INACTIVE">Inactivo</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <select form={`user-${user.id}`} name="programId" defaultValue={user.programId ?? ''} className="w-full border border-border bg-background px-2 py-1.5 text-sm font-sans focus:outline-none focus:border-primary">
                        <option value="">Sin programa</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>{program.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user._count.publications}</td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="flex flex-wrap gap-2">
                        <button form={`user-${user.id}`} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-border text-foreground hover:bg-muted transition-colors">
                          <Save size={13} />
                          Guardar
                        </button>
                        <form action={deleteUser.bind(null, user.id)}>
                          <button disabled={user._count.publications > 0} className="inline-flex items-center gap-1.5 px-2 py-1 text-xs border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:pointer-events-none">
                            <Trash2 size={13} />
                            Eliminar
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}

function Input({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}{required ? ' *' : ''}
      </label>
      <input name={name} type={type} required={required} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary" />
    </div>
  )
}

function Select({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      <select name={name} className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary">
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

function ProgramSelect({ programs }: { programs: { id: number; name: string }[] }) {
  return (
    <div>
      <label className="block text-xs font-sans font-bold uppercase tracking-widest text-muted-foreground mb-2">Programa</label>
      <select name="programId" className="w-full border border-border bg-background px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary">
        <option value="">Sin programa</option>
        {programs.map((program) => (
          <option key={program.id} value={program.id}>{program.name}</option>
        ))}
      </select>
    </div>
  )
}
