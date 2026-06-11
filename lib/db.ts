import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const DB_SCHEMA_VERSION = '2026-06-10-topdown-routes-auth-v3'

function prepareSqliteForServerless() {
  if (!process.env.VERCEL) return
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) return

  const bundledDb = path.join(process.cwd(), 'prisma', 'achiki.db')
  const tmpDb = path.join('/tmp', 'achiki.db')
  const marker = path.join('/tmp', 'achiki-db-version')
  const currentVersion = fs.existsSync(marker) ? fs.readFileSync(marker, 'utf8') : null

  if (fs.existsSync(bundledDb) && (!fs.existsSync(tmpDb) || currentVersion !== DB_SCHEMA_VERSION)) {
    fs.copyFileSync(bundledDb, tmpDb)
    fs.writeFileSync(marker, DB_SCHEMA_VERSION)
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
