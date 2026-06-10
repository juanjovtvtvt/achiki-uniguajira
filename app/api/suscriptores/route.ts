import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, message: 'Correo invalido' }, { status: 400 })
  }

  await prisma.subscriber.upsert({
    where: { email },
    create: { email, active: true },
    update: { active: true },
  })

  return NextResponse.redirect(new URL('/', request.url))
}
