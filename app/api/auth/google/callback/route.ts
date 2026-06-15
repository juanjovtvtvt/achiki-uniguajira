import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

type GoogleUser = {
  sub: string
  email: string
  email_verified?: boolean
  name?: string
  picture?: string
}

function getBaseUrl(request: Request) {
  const url = new URL(request.url)
  return process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const state = requestUrl.searchParams.get('state')
  const cookieStore = await cookies()
  const expectedState = cookieStore.get('achiki_google_state')?.value
  const next = cookieStore.get('achiki_google_next')?.value || '/'

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/login?google=state', request.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?google=missing', request.url))
  }

  try {
    const redirectUri = `${getBaseUrl(request)}/api/auth/google/callback`
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const tokenError = await tokenResponse.text().catch(() => 'unknown token error')
      console.error('Google OAuth token exchange failed', tokenResponse.status, tokenError)
      return NextResponse.redirect(new URL('/login?google=token', request.url))
    }

    const tokenData = await tokenResponse.json()
    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    if (!userResponse.ok) {
      const profileError = await userResponse.text().catch(() => 'unknown profile error')
      console.error('Google OAuth profile fetch failed', userResponse.status, profileError)
      return NextResponse.redirect(new URL('/login?google=profile', request.url))
    }

    const googleUser = (await userResponse.json()) as GoogleUser
    if (!googleUser.email || googleUser.email_verified === false) {
      return NextResponse.redirect(new URL('/login?google=profile', request.url))
    }

    const existing = await prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
    })

    const user = await prisma.user.upsert({
      where: { email: googleUser.email.toLowerCase() },
      create: {
        name: googleUser.name || googleUser.email,
        email: googleUser.email.toLowerCase(),
        role: 'READER',
        status: 'ACTIVE',
        authProvider: 'google',
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture,
        publicSignature: googleUser.name || googleUser.email,
        lastLoginAt: new Date(),
      },
      update: {
        authProvider: existing?.authProvider === 'credentials' ? existing.authProvider : 'google',
        googleId: googleUser.sub,
        avatarUrl: googleUser.picture,
        name: existing?.name || googleUser.name || googleUser.email,
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
      provider: 'google',
    })

    const response = NextResponse.redirect(new URL(next.startsWith('/') && !next.startsWith('//') ? next : '/', request.url))
    response.cookies.delete('achiki_google_state')
    response.cookies.delete('achiki_google_next')
    return response
  } catch (error) {
    console.error('Google OAuth database/session failed', error)
    return NextResponse.redirect(new URL('/login?google=database', request.url))
  }
}
