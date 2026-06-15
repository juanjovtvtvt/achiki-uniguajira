import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendWelcomeNewsletterEmail, welcomeNewsletterHtml } from '@/lib/newsletter-email'

async function getSubscriptionEmail(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => null)
    return String(body?.email ?? '').trim().toLowerCase()
  }

  const formData = await request.formData()
  return String(formData.get('email') ?? '').trim().toLowerCase()
}

export async function POST(request: Request) {
  const email = await getSubscriptionEmail(request)

  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, message: 'Correo invalido' }, { status: 400 })
  }

  const subscriber = await prisma.subscriber.upsert({
    where: { email },
    create: { email, active: true },
    update: { active: true },
  })

  const newsletter = await prisma.newsletter.upsert({
    where: { id: 1 },
    create: {
      subject: 'Bienvenido al boletin de ACHIKI',
      content: welcomeNewsletterHtml(email),
      status: 'SENT',
      sentAt: new Date(),
    },
    update: {
      subject: 'Bienvenido al boletin de ACHIKI',
      content: welcomeNewsletterHtml(email),
      status: 'SENT',
      sentAt: new Date(),
    },
  })

  const emailResult = await sendWelcomeNewsletterEmail(email)

  await prisma.newsletterDelivery.upsert({
    where: {
      newsletterId_subscriberId: {
        newsletterId: newsletter.id,
        subscriberId: subscriber.id,
      },
    },
    create: {
      newsletterId: newsletter.id,
      subscriberId: subscriber.id,
      status: emailResult.status === 'sent' ? 'SENT' : emailResult.status.toUpperCase(),
    },
    update: {
      status: emailResult.status === 'sent' ? 'SENT' : emailResult.status.toUpperCase(),
    },
  })

  return NextResponse.json({
    ok: true,
    message: emailResult.status === 'sent'
      ? 'Listo. Revisa tu correo: te enviamos la bienvenida al boletin.'
      : 'Tu correo quedo guardado. Falta configurar la API de Resend para enviar la bienvenida real.',
    emailStatus: emailResult.status,
    emailDetail: emailResult.detail,
  })
}
