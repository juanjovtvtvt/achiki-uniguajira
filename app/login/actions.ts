'use server'

import { redirect } from 'next/navigation'
import { authenticateWithPassword, createSession, destroySession, hashPassword, isAdminRole } from '@/lib/auth'
import { prisma } from '@/lib/db'

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? '').trim().toLowerCase()
}

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? '').trim()
  return next.startsWith('/') && !next.startsWith('//') ? next : '/cuenta'
}

function displayNameFromEmail(email: string) {
  return email.split('@')[0]?.replace(/[._-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || email
}

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

export async function registerAction(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const email = normalizeEmail(formData.get('email'))
  const password = String(formData.get('password') ?? '')
  const next = safeNext(formData.get('next'))

  if (!email.includes('@') || password.length < 6) {
    redirect('/login?register=invalid')
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    redirect('/login?register=exists')
  }

  const user = await prisma.user.create({
    data: {
      name: name || displayNameFromEmail(email),
      email,
      passwordHash: hashPassword(password),
      authProvider: email.endsWith('@gmail.com') ? 'gmail' : 'credentials',
      role: 'READER',
      status: 'ACTIVE',
      publicSignature: name || displayNameFromEmail(email),
      lastLoginAt: new Date(),
    },
  })

  await createSession({
    userId: user.id,
    username: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    provider: user.authProvider,
  })

  redirect(next)
}

export async function gmailQuickAction(formData: FormData) {
  const email = normalizeEmail(formData.get('email'))
  const name = String(formData.get('name') ?? '').trim() || displayNameFromEmail(email)
  const next = safeNext(formData.get('next'))

  if (!email.endsWith('@gmail.com')) {
    redirect('/login?gmail=invalid')
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      name,
      email,
      authProvider: 'gmail',
      role: 'READER',
      status: 'ACTIVE',
      publicSignature: name,
      lastLoginAt: new Date(),
    },
    update: {
      name,
      authProvider: 'gmail',
      status: 'ACTIVE',
      lastLoginAt: new Date(),
    },
  })

  await createSession({
    userId: user.id,
    username: user.email,
    email: user.email,
    name: user.name,
    role: user.role,
    provider: user.authProvider,
  })

  redirect(next)
}
