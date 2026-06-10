import { NextResponse } from 'next/server'
import crypto from 'crypto'

function getBaseUrl(request: Request) {
  const url = new URL(request.url)
  return process.env.NEXT_PUBLIC_APP_URL || `${url.protocol}//${url.host}`
}

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?google=missing', request.url))
  }

  const requestUrl = new URL(request.url)
  const next = requestUrl.searchParams.get('next') || '/cuenta'
  const state = crypto.randomBytes(24).toString('hex')
  const redirectUri = `${getBaseUrl(request)}/api/auth/google/callback`
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  googleUrl.searchParams.set('client_id', clientId)
  googleUrl.searchParams.set('redirect_uri', redirectUri)
  googleUrl.searchParams.set('response_type', 'code')
  googleUrl.searchParams.set('scope', 'openid email profile')
  googleUrl.searchParams.set('state', state)
  googleUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(googleUrl)
  response.cookies.set('achiki_google_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  })
  response.cookies.set('achiki_google_next', next.startsWith('/') && !next.startsWith('//') ? next : '/cuenta', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10,
  })

  return response
}
