import type { Metadata } from 'next'
import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Achiki Uniguajira — Periódico Universitario Digital',
  description:
    'El periódico universitario digital de la Universidad de La Guajira. Noticias, cultura, investigación y vida universitaria desde Riohacha, Colombia.',
  keywords: 'Universidad de La Guajira, Uniguajira, periódico universitario, La Guajira, Colombia, Riohacha',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${playfairDisplay.variable} ${sourceSerif4.variable} bg-background`}>
      <body className="font-sans antialiased text-foreground overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
