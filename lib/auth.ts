import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { prisma } from '@/lib/db'

const COOKIE_NAME = 'achiki_session'
const LEGACY_COOKIE_NAME = 'achiki_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 8
const FALLBACK_USERNAME = 'uniguajiraadmin'
const FALLBACK_PASSWORD_SALT = 'local-development-salt'
const FALLBACK_PASSWORD_HASH = 'disabled-without-env'
const FALLBACK_AUTH_SECRET = 'achiki-local-development-secret'

export type AuthSession = {
  userId: number | null
  username: string
  email: string
  name: string
  role: string
  provider: string
}

function getSecret() {
  return process.env.AUTH_SECRET ?? FALLBACK_AUTH_SECRET
}

function sign(value: string) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('hex')
}

function timingSafeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) return false
  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

function verifyLegacyAdminPassword(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? FALLBACK_USERNAME
  const salt = process.env.ADMIN_PASSWORD_SALT ?? FALLBACK_PASSWORD_SALT
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? FALLBACK_PASSWORD_HASH

  if (username !== expectedUsername || !salt || !expectedHash) return false

  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return timingSafeEqual(hash, expectedHash)
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

export function verifyStoredPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false
  const [salt, expectedHash] = storedHash.split(':')
  if (!salt || !expectedHash) return false
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return timingSafeEqual(hash, expectedHash)
}

function encodeSession(session: AuthSession) {
  const issuedAt = Date.now()
  const body = Buffer.from(JSON.stringify({ ...session, issuedAt }), 'utf8').toString('base64url')
  return `${body}.${sign(body)}`
}

function decodeSession(raw: string): (AuthSession & { issuedAt: number }) | null {
  const [body, signature] = raw.split('.')
  if (!body || !signature || !timingSafeEqual(sign(body), signature)) return null

  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    const ageMs = Date.now() - Number(parsed.issuedAt)
    if (!Number.isFinite(ageMs) || ageMs > SESSION_MAX_AGE * 1000) return null
    return parsed
  } catch {
    return null
  }
}

export async function createSession(session: AuthSession) {
  const cookieStore = await cookies()

  cookieStore.set(COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  cookieStore.delete(LEGACY_COOKIE_NAME)
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(COOKIE_NAME)?.value
  if (!raw) return null

  const session = decodeSession(raw)
  if (!session) return null

  return {
    userId: session.userId,
    username: session.username,
    email: session.email,
    name: session.name,
    role: session.role,
    provider: session.provider,
  }
}

export async function authenticateWithPassword(identifier: string, password: string) {
  if (verifyLegacyAdminPassword(identifier, password)) {
    const admin = await prisma.user.upsert({
      where: { email: 'uniguajiraadmin@achiki.local' },
      create: {
        name: 'Admin Uniguajira',
        email: 'uniguajiraadmin@achiki.local',
        role: 'ADMIN',
        status: 'ACTIVE',
        publicSignature: 'Admin ACHIKI',
        passwordHash: hashPassword(password),
        authProvider: 'credentials',
        lastLoginAt: new Date(),
      },
      update: {
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLoginAt: new Date(),
      },
    })

    return admin
  }

  const normalized = identifier.toLowerCase()
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalized }, { name: identifier }],
      status: 'ACTIVE',
    },
  })

  if (!user || !verifyStoredPassword(password, user.passwordHash)) return null

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return user
}

export function isAdminRole(role: string) {
  return ['ADMIN', 'EDITOR'].includes(role)
}

export async function requireSession() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function getAdminSession() {
  const session = await getSession()
  if (!session || !isAdminRole(session.role)) return null
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  if (!isAdminRole(session.role)) {
    redirect('/cuenta')
  }
  return session
}

export async function createAdminSession(username: string) {
  await createSession({
    userId: null,
    username,
    email: `${username}@achiki.local`,
    name: username,
    role: 'ADMIN',
    provider: 'credentials',
  })
}

export async function destroyAdminSession() {
  await destroySession()
}

export function verifyPassword(username: string, password: string) {
  return verifyLegacyAdminPassword(username, password)
}
