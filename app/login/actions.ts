'use server'

import { redirect } from 'next/navigation'
import { authenticateWithPassword, createSession, destroySession, isAdminRole } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '').trim()

  const user = await authenticateWithPassword(username, password)
  if (!user) {
    redirect('/login?error=1')
  }

  await createSession({
    userId: user.id,
    username: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    provider: user.authProvider,
  })

  if (next.startsWith('/') && !next.startsWith('//')) {
    redirect(next)
  }

  redirect(isAdminRole(user.role) ? '/admin' : '/cuenta')
}

export async function logoutAction() {
  await destroySession()
  redirect('/login')
}
