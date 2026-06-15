import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]

  if (host === 'demo.achiki.space' && request.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/demo-admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
