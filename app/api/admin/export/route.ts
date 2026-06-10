import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  await requireAdmin()

  const [
    programs,
    users,
    categories,
    editions,
    publications,
    images,
    tags,
    publicationTags,
    events,
    subscribers,
  ] = await Promise.all([
    prisma.program.findMany(),
    prisma.user.findMany({
      select: {
        id: true,
        programId: true,
        name: true,
        email: true,
        authProvider: true,
        avatarUrl: true,
        role: true,
        status: true,
        bio: true,
        publicSignature: true,
        reviewArea: true,
        approvalLevel: true,
        systemPermissions: true,
        preferences: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.category.findMany(),
    prisma.edition.findMany(),
    prisma.publication.findMany(),
    prisma.publicationImage.findMany(),
    prisma.tag.findMany(),
    prisma.publicationTag.findMany(),
    prisma.event.findMany(),
    prisma.subscriber.findMany(),
  ])

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    source: 'ACHIKI admin export',
    schemaVersion: 1,
    counts: {
      programs: programs.length,
      users: users.length,
      categories: categories.length,
      editions: editions.length,
      publications: publications.length,
      images: images.length,
      tags: tags.length,
      publicationTags: publicationTags.length,
      events: events.length,
      subscribers: subscribers.length,
    },
    data: {
      programs,
      users,
      categories,
      editions,
      publications,
      images,
      tags,
      publicationTags,
      events,
      subscribers,
    },
  })
}
