import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()
const DEFAULT_USER_PASSWORD = 'achiki2026'

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

const categories = [
  { name: 'Universidad', slug: 'universidad', colorClass: 'text-primary border-primary' },
  { name: 'Region', slug: 'region', colorClass: 'text-accent border-accent' },
  { name: 'Cultura', slug: 'cultura', colorClass: 'text-[oklch(0.62_0.14_35)] border-[oklch(0.62_0.14_35)]' },
  { name: 'Investigacion', slug: 'investigacion', colorClass: 'text-primary border-primary' },
  { name: 'Deportes', slug: 'deportes', colorClass: 'text-[oklch(0.5_0.15_25)] border-[oklch(0.5_0.15_25)]' },
  { name: 'Opinion', slug: 'opinion', colorClass: 'text-muted-foreground border-muted-foreground' },
  { name: 'Eventos', slug: 'eventos', colorClass: 'text-golden border-golden' },
]

const programs = [
  { name: 'Comunicacion Social', faculty: 'Ciencias Sociales', campus: 'Riohacha' },
  { name: 'Diseno', faculty: 'Arte y Cultura', campus: 'Riohacha' },
  { name: 'Ingenieria Ambiental', faculty: 'Ingenierias', campus: 'Riohacha' },
  { name: 'Filosofia y Humanidades', faculty: 'Humanidades', campus: 'Riohacha' },
  { name: 'Sociologia Aplicada', faculty: 'Ciencias Sociales', campus: 'Riohacha' },
  { name: 'Ingenieria Electrica', faculty: 'Ingenierias', campus: 'Riohacha' },
]

const articles = [
  {
    category: 'Universidad',
    title: 'Uniguajira abre convocatoria para 1.200 nuevos cupos en pregrado para el segundo semestre del 2025',
    summary:
      'La institucion amplia su oferta academica con tres nuevos programas en ciencias del mar, energias renovables y gestion cultural wayuu, fortaleciendo su compromiso con el desarrollo regional.',
    author: 'Camila Ipuana',
    email: 'camila.ipuana@uniguajira.edu.co',
    program: 'Comunicacion Social',
    date: new Date('2025-05-14T09:00:00-05:00'),
    image: '/images/featured-article.jpg',
    featured: true,
    slug: 'uniguajira-convocatoria-cupos-2025',
    tags: ['Uniguajira', 'Admisiones', 'Pregrado'],
  },
  {
    category: 'Cultura',
    title: 'Mujeres wayuu tejedoras: guardianas del conocimiento ancestral en La Guajira',
    summary:
      'Un colectivo de estudiantes del programa de Diseno documenta las tecnicas milenarias del tejido wayuu para preservar el legado cultural en el mundo digital.',
    author: 'Laura Pushaina',
    email: 'laura.pushaina@uniguajira.edu.co',
    program: 'Diseno',
    date: new Date('2025-05-12T10:00:00-05:00'),
    image: '/images/article-cultura.jpg',
    featured: false,
    slug: 'mujeres-wayuu-tejedoras-ancestral',
    tags: ['Wayuu', 'Cultura', 'Memoria'],
  },
  {
    category: 'Investigacion',
    title: 'Grupo de investigacion GISA logra avance en purificacion de agua salobre en comunidades rurales',
    summary:
      'Mediante filtros de bajo costo fabricados con arcilla local, el grupo interdisciplinario beneficiara a mas de 40 comunidades indigenas de la alta Guajira.',
    author: 'Andres Epieyu',
    email: 'andres.epieyu@uniguajira.edu.co',
    program: 'Ingenieria Ambiental',
    date: new Date('2025-05-10T08:30:00-05:00'),
    image: '/images/article-investigacion.jpg',
    featured: false,
    slug: 'gisa-purificacion-agua-comunidades',
    tags: ['Investigacion', 'Agua', 'Comunidades'],
  },
  {
    category: 'Deportes',
    title: 'Seleccion de futbol de Uniguajira clasifica al torneo interuniversitario del Caribe colombiano',
    summary:
      'Tras una contundente victoria 3-0 ante la Uniatlantico, el equipo guajiro se prepara para el campeonato regional que se disputara en Barranquilla en junio.',
    author: 'Tomas Gonzales',
    email: 'tomas.gonzales@uniguajira.edu.co',
    program: 'Comunicacion Social',
    date: new Date('2025-05-09T15:00:00-05:00'),
    image: '/images/article-deportes.jpg',
    featured: false,
    slug: 'seleccion-futbol-torneo-interuniversitario',
    tags: ['Deportes', 'Futbol', 'Interuniversitario'],
  },
  {
    category: 'Region',
    title: 'Flamingos regresan al Cabo de la Vela: senal de recuperacion ambiental en el desierto guajiro',
    summary:
      'Investigadores de biologia marina de Uniguajira registraron el retorno de colonias de flamencos rosados a las lagunas costeras como indicador de la mejora ecosistemica.',
    author: 'Valentina Araujo',
    email: 'valentina.araujo@uniguajira.edu.co',
    program: 'Ingenieria Ambiental',
    date: new Date('2025-05-07T11:00:00-05:00'),
    image: '/images/article-region.jpg',
    featured: false,
    slug: 'flamingos-cabo-vela-recuperacion-ambiental',
    tags: ['Region', 'Ambiente', 'Cabo de la Vela'],
  },
]

const columns = [
  {
    title: 'El desierto como aula: repensar la educacion desde la Guajira profunda',
    summary:
      'Educar en La Guajira no puede ignorar el territorio. La aridez, el viento y el silencio del desierto tambien ensenan.',
    author: 'Prof. Simon Iguaran',
    email: 'simon.iguaran@uniguajira.edu.co',
    program: 'Filosofia y Humanidades',
    date: new Date('2025-05-14T07:00:00-05:00'),
    slug: 'desierto-como-aula-guajira-profunda',
  },
  {
    title: 'Por que los jovenes wayuu siguen saliendo de La Guajira para estudiar',
    summary:
      'Mientras la universidad crece en oferta, la migracion estudiantil hacia otras ciudades no cede. Hay que revisar que estamos ofreciendo.',
    author: 'Adriana Mengual',
    email: 'adriana.mengual@uniguajira.edu.co',
    program: 'Sociologia Aplicada',
    date: new Date('2025-05-07T07:00:00-05:00'),
    slug: 'jovenes-wayuu-salen-guajira-estudiar',
  },
  {
    title: 'Energia solar y soberania energetica: una oportunidad que La Guajira no puede desperdiciar',
    summary:
      'El departamento mas soleado de Colombia sigue siendo uno de los menos electrificados. La academia debe liderar esta conversacion.',
    author: 'Ing. Rafael Montiel',
    email: 'rafael.montiel@uniguajira.edu.co',
    program: 'Ingenieria Electrica',
    date: new Date('2025-05-01T07:00:00-05:00'),
    slug: 'energia-solar-soberania-energetica-guajira',
  },
]

const events = [
  { title: 'Feria del libro universitaria', slug: 'feria-libro-universitaria', location: 'Plaza Mayor', startsAt: new Date('2025-05-19T09:00:00-05:00') },
  { title: 'Congreso de Investigacion GISA 2025', slug: 'congreso-investigacion-gisa-2025', location: 'Auditorio principal', startsAt: new Date('2025-05-24T08:00:00-05:00') },
  { title: 'Festival de Musica Vallenata Estudiantil', slug: 'festival-musica-vallenata-estudiantil', location: 'Campus Riohacha', startsAt: new Date('2025-06-02T16:00:00-05:00') },
  { title: 'Semana de la Cultura Wayuu', slug: 'semana-cultura-wayuu', location: 'Campus Riohacha', startsAt: new Date('2025-06-14T10:00:00-05:00') },
]

const routePoints = [
  ['marbella', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Avenida Circunvalar', 'Conexion hacia el norte urbano.', 11.5308, -72.9181],
    ['Calle 15', 'Tramo de integracion con barrios residenciales.', 11.5358, -72.9107],
    ['Marbella', 'Llegada al sector Marbella.', 11.5432, -72.9012],
  ]],
  ['majayura', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Glorieta universitaria', 'Salida hacia el corredor oriental.', 11.5224, -72.9167],
    ['Via a Maicao', 'Tramo hacia Majayura.', 11.5187, -72.9061],
    ['Majayura', 'Llegada al sector Majayura.', 11.5162, -72.8964],
  ]],
  ['15-de-mayo', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Calle 15', 'Ingreso al eje de la calle 15.', 11.5315, -72.9162],
    ['Sector comercial', 'Paso por zona de alto flujo.', 11.5366, -72.9074],
    ['15 de Mayo', 'Llegada al barrio 15 de Mayo.', 11.5396, -72.8997],
  ]],
  ['15-derecho', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Calle 15 derecho', 'Ruta directa por la calle 15.', 11.5326, -72.9154],
    ['Carrera 7', 'Conexion hacia el centro.', 11.5385, -72.9086],
    ['Centro derecho', 'Llegada por el costado derecho del centro.', 11.5442, -72.9028],
  ]],
  ['centro-coquivacoa', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Avenida Los Estudiantes', 'Tramo hacia el centro urbano.', 11.5322, -72.9152],
    ['Centro de Riohacha', 'Paso por el centro historico.', 11.5441, -72.9074],
    ['Coquivacoa', 'Llegada al sector Coquivacoa.', 11.5524, -72.8991],
  ]],
  ['dividivi', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Entrada suroriental', 'Salida hacia zona residencial.', 11.5211, -72.9151],
    ['Carrera intermedia', 'Conexion local de barrio.', 11.5264, -72.9063],
    ['Dividivi', 'Llegada al sector Dividivi.', 11.5311, -72.8976],
  ]],
  ['la-20', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Calle 20', 'Ingreso al corredor de la calle 20.', 11.5293, -72.9142],
    ['Mercado nuevo', 'Paso por zona de comercio.', 11.5351, -72.9059],
    ['La 20', 'Llegada a la zona de La 20.', 11.5402, -72.8977],
  ]],
  ['27-37', [
    ['Universidad de La Guajira', 'Salida desde el campus principal.', 11.5261, -72.9239],
    ['Calle 27', 'Conexion hacia la malla urbana occidental.', 11.5238, -72.9169],
    ['Carrera 37', 'Tramo interno de la ruta.', 11.5193, -72.9094],
    ['27-37', 'Llegada al corredor 27-37.', 11.5151, -72.9021],
  ]],
].flatMap(([routeKey, points]) =>
  (points as [string, string, number, number][]).map(([title, description, lat, lng], index, all) => ({
    routeKey: routeKey as string,
    title,
    description,
    lat,
    lng,
    progress: Math.round((index / Math.max(all.length - 1, 1)) * 100),
    order: index + 1,
  })),
)

async function main() {
  const seededPasswordHash = hashPassword(DEFAULT_USER_PASSWORD)

  await prisma.newsletterDelivery.deleteMany()
  await prisma.subscriber.deleteMany()
  await prisma.newsletter.deleteMany()
  await prisma.eventRegistration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.routePoint.deleteMany()
  await prisma.pollVote.deleteMany()
  await prisma.pollOption.deleteMany()
  await prisma.dailyPoll.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.publicationReaction.deleteMany()
  await prisma.publicationTag.deleteMany()
  await prisma.publicationImage.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.edition.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.program.deleteMany()

  const programByName = new Map<string, { id: number }>()
  for (const program of programs) {
    const created = await prisma.program.create({ data: program })
    programByName.set(program.name, created)
  }

  const categoryByName = new Map<string, { id: number }>()
  for (const category of categories) {
    const created = await prisma.category.create({ data: category })
    categoryByName.set(category.name, created)
  }

  const edition = await prisma.edition.create({
    data: {
      title: 'Edicion mayo 2025',
      slug: 'edicion-mayo-2025',
      publishedAt: new Date('2025-05-14T06:00:00-05:00'),
      status: 'PUBLISHED',
    },
  })

  const users = new Map<string, { id: number }>()
  async function ensureAuthor(name: string, email: string, programName: string) {
    if (users.has(email)) return users.get(email)!
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: seededPasswordHash,
        authProvider: 'credentials',
        role: 'AUTHOR',
        programId: programByName.get(programName)?.id,
        publicSignature: name,
      },
    })
    users.set(email, user)
    return user
  }

  for (const article of articles) {
    const author = await ensureAuthor(article.author, article.email, article.program)
    const publication = await prisma.publication.create({
      data: {
        authorId: author.id,
        categoryId: categoryByName.get(article.category)!.id,
        editionId: edition.id,
        type: 'ARTICLE',
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: `${article.summary}\n\nEsta publicacion es parte de la primera carga editorial de ACHIKI y puede ampliarse desde el panel administrativo en una siguiente fase.`,
        featured: article.featured,
        status: 'PUBLISHED',
        publishedAt: article.date,
        images: {
          create: {
            url: article.image,
            description: article.title,
            isPrimary: true,
          },
        },
      },
    })

    for (const tagName of article.tags) {
      const tag = await prisma.tag.upsert({
        where: { slug: tagName.toLowerCase().replaceAll(' ', '-') },
        create: { name: tagName, slug: tagName.toLowerCase().replaceAll(' ', '-') },
        update: {},
      })
      await prisma.publicationTag.create({ data: { publicationId: publication.id, tagId: tag.id } })
    }
  }

  const opinionCategory = categoryByName.get('Opinion')!
  for (const column of columns) {
    const author = await ensureAuthor(column.author, column.email, column.program)
    await prisma.publication.create({
      data: {
        authorId: author.id,
        categoryId: opinionCategory.id,
        editionId: edition.id,
        type: 'COLUMN',
        title: column.title,
        slug: column.slug,
        summary: column.summary,
        excerpt: column.summary,
        content: `${column.summary}\n\nTexto base de columna editorial para extender desde administracion.`,
        status: 'PUBLISHED',
        publishedAt: column.date,
      },
    })
  }

  for (const event of events) {
    await prisma.event.create({ data: event })
  }

  for (const point of routePoints) {
    await prisma.routePoint.create({ data: point })
  }

  const dailyPoll = await prisma.dailyPoll.create({
    data: {
      question: 'Que contenido deberia tener mas presencia esta semana en ACHIKI?',
      active: true,
      options: {
        create: [
          { label: 'Convocatorias y becas' },
          { label: 'Eventos del campus' },
          { label: 'Investigacion estudiantil' },
          { label: 'Cultura y territorio' },
        ],
      },
    },
    include: { options: true },
  })

  for (const [index, option] of dailyPoll.options.entries()) {
    for (let count = 0; count < index + 1; count += 1) {
      await prisma.pollVote.create({
        data: {
          pollId: dailyPoll.id,
          optionId: option.id,
          anonymousId: `seed-${option.id}-${count}`,
        },
      })
    }
  }

  const topPublication = await prisma.publication.findFirst({
    where: { type: 'ARTICLE', status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
  })

  if (topPublication) {
    for (const [index, type] of ['LIKE', 'INSIGHTFUL', 'SUPPORT'].entries()) {
      await prisma.publicationReaction.create({
        data: {
          publicationId: topPublication.id,
          type,
          anonymousId: `seed-reaction-${index}`,
        },
      })
    }
  }

  await prisma.user.create({
    data: {
      name: 'Admin Uniguajira',
      email: 'uniguajiraadmin@achiki.local',
      passwordHash: seededPasswordHash,
      authProvider: 'credentials',
      role: 'ADMIN',
      publicSignature: 'Admin ACHIKI',
      status: 'ACTIVE',
    },
  })

  await prisma.subscriber.create({
    data: { email: 'boletin@achiki.local', active: true },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
