import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginClient } from './LoginClient'

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
    <LoginClient
      next={next}
      error={error}
      google={google}
      gmail={gmail}
      register={register}
      googleConfigured={googleConfigured}
    />
  )
}
