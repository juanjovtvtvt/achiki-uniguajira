import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function prepareSqliteForServerless() {
  if (!process.env.VERCEL) return
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) return

  const bundledDb = path.join(process.cwd(), 'prisma', 'achiki.db')
  const tmpDb = path.join('/tmp', 'achiki.db')

  if (fs.existsSync(bundledDb)) {
    fs.copyFileSync(bundledDb, tmpDb)
  }

  process.env.DATABASE_URL = `file:${tmpDb}`
}

prepareSqliteForServerless()

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
