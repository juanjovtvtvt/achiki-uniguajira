import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checkedAt = new Date().toISOString()

  try {
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      ok: true,
      app: 'ACHIKI',
      checkedAt,
      environment: process.env.VERCEL ? 'vercel' : 'local',
      database: 'reachable',
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        app: 'ACHIKI',
        checkedAt,
        environment: process.env.VERCEL ? 'vercel' : 'local',
        database: 'unreachable',
        error: error instanceof Error ? error.message : 'Unknown database error',
      },
      { status: 500 },
    )
  }
}
