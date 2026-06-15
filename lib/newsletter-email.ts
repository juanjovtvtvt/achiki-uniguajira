type WelcomeEmailResult = {
  status: 'sent' | 'skipped' | 'failed'
  detail?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function welcomeNewsletterHtml(email: string) {
  const safeEmail = escapeHtml(email)

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bienvenido al boletin ACHIKI</title>
  </head>
  <body style="margin:0;background:#f5f1e8;color:#241f1b;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fffaf0;border:1px solid #d7c8ad;">
            <tr>
              <td style="padding:28px 28px 18px;border-bottom:4px solid #175c2f;">
                <p style="margin:0 0 8px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#175c2f;">ACHIKI Uniguajira</p>
                <h1 style="margin:0;font-size:34px;line-height:1.05;color:#111;">Ya haces parte del boletin</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px 8px;">
                <p style="margin:0 0 18px;font-size:17px;line-height:1.65;color:#4b4038;">
                  Hola, <strong style="color:#111;">${safeEmail}</strong>. Desde ahora recibiras las noticias mas importantes de la Universidad de La Guajira, eventos, convocatorias y publicaciones destacadas de la comunidad universitaria.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #d7c8ad;border-bottom:1px solid #d7c8ad;margin:22px 0;">
                  <tr>
                    <td style="padding:16px 0;font:700 12px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#175c2f;">Que recibiras</td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 18px;font-size:15px;line-height:1.7;color:#4b4038;">
                      Noticias verificadas, publicacion del dia, eventos del campus, novedades academicas y contenidos editoriales pensados para estudiantes, docentes y egresados.
                    </td>
                  </tr>
                </table>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://achiki-uniguajira.vercel.app'}" style="display:inline-block;background:#175c2f;color:#fff;text-decoration:none;padding:12px 18px;font:700 13px Arial,sans-serif;letter-spacing:.5px;">
                  Abrir ACHIKI
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 28px;">
                <p style="margin:0;font:12px Arial,sans-serif;line-height:1.6;color:#7a6a5c;">
                  Recibiste este correo porque te suscribiste al boletin de ACHIKI. Este es un mensaje automatico de confirmacion.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export async function sendWelcomeNewsletterEmail(email: string): Promise<WelcomeEmailResult> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.NEWSLETTER_FROM_EMAIL || process.env.MAIL_FROM

  if (!apiKey || !from) {
    return {
      status: 'skipped',
      detail: 'Faltan RESEND_API_KEY y NEWSLETTER_FROM_EMAIL o MAIL_FROM.',
    }
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Bienvenido al boletin de ACHIKI',
      html: welcomeNewsletterHtml(email),
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => 'Error desconocido del proveedor de correo.')
    return { status: 'failed', detail }
  }

  return { status: 'sent' }
}
