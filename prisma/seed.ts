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

const routeShapes: Record<string, [number, number][]> = {
  '15-de-mayo': [[11.525443, -72.923889], [11.525278, -72.923598], [11.525477, -72.922448], [11.525542, -72.91945], [11.526214, -72.916216], [11.528873, -72.916505], [11.530573, -72.918223], [11.533254, -72.917725], [11.535663, -72.917267], [11.538794, -72.916008], [11.541317, -72.911367], [11.543345, -72.907643], [11.544393, -72.907101], [11.544424, -72.906843], [11.541797, -72.905412], [11.539576, -72.906996]],
  '15-derecho': [[11.525443, -72.923889], [11.525303, -72.924144], [11.525354, -72.922698], [11.525501, -72.921514], [11.525555, -72.919033], [11.525988, -72.916192], [11.528681, -72.916256], [11.529484, -72.916608], [11.531078, -72.91813], [11.533254, -72.917725], [11.535663, -72.917267], [11.538534, -72.916463], [11.540321, -72.913153], [11.54204, -72.910059], [11.543419, -72.907561], [11.544193, -72.90718]],
  '27-37': [[11.525443, -72.923889], [11.525299, -72.92372], [11.525385, -72.922613], [11.525313, -72.921103], [11.522829, -72.92115], [11.521946, -72.918855], [11.522489, -72.916353], [11.523357, -72.911877], [11.524152, -72.908361], [11.524833, -72.905326], [11.524129, -72.903369], [11.522082, -72.903141], [11.52074, -72.903761], [11.518575, -72.904915], [11.51657, -72.905611], [11.5151, -72.906768]],
  'centro-coquivacoa': [[11.525443, -72.923889], [11.525327, -72.923247], [11.525511, -72.921076], [11.525612, -72.915996], [11.528804, -72.916238], [11.53084, -72.918174], [11.533798, -72.917627], [11.538534, -72.916463], [11.541125, -72.911714], [11.543419, -72.907561], [11.544509, -72.907024], [11.54472, -72.906703], [11.546566, -72.905942], [11.550078, -72.906612], [11.551181, -72.90691], [11.552706, -72.906116]],
  dividivi: [[11.525443, -72.923889], [11.525303, -72.924144], [11.525335, -72.923039], [11.525504, -72.921926], [11.524557, -72.921177], [11.521476, -72.921094], [11.522034, -72.918408], [11.522489, -72.916353], [11.523267, -72.912435], [11.523852, -72.909757], [11.524547, -72.906608], [11.525004, -72.904408], [11.526227, -72.903563], [11.528113, -72.903822], [11.529343, -72.903659], [11.531524, -72.905767]],
  'la-20': [[11.525443, -72.923889], [11.525299, -72.92372], [11.525354, -72.922698], [11.525511, -72.921076], [11.525559, -72.918638], [11.526214, -72.916216], [11.528804, -72.916238], [11.530292, -72.918276], [11.531656, -72.918022], [11.533798, -72.917627], [11.536633, -72.917083], [11.538794, -72.916008], [11.541125, -72.911714], [11.543122, -72.908047], [11.54279, -72.907246], [11.540226, -72.906668]],
  majayura: [[11.525443, -72.923889], [11.525278, -72.923598], [11.525436, -72.922539], [11.524557, -72.921177], [11.521633, -72.920333], [11.522361, -72.916841], [11.523267, -72.912435], [11.524152, -72.908361], [11.524833, -72.905326], [11.525196, -72.90282], [11.526239, -72.897617], [11.523548, -72.89804], [11.52141, -72.898388], [11.518767, -72.898856], [11.516174, -72.899317], [11.5162, -72.896628]],
  marbella: [[11.525443, -72.923889], [11.525303, -72.924144], [11.525354, -72.922698], [11.525501, -72.921514], [11.525542, -72.91945], [11.525988, -72.916192], [11.527924, -72.916327], [11.529064, -72.916622], [11.53084, -72.918174], [11.532695, -72.917829], [11.534772, -72.917443], [11.538388, -72.916741], [11.539445, -72.914793], [11.541317, -72.911367], [11.543261, -72.907759], [11.543057, -72.906664]],
}

const routeStops: Record<string, Record<number, [string, string]>> = {
  '15-de-mayo': { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 6: ['Calle 15', 'Ingreso al eje de la calle 15.'], 11: ['Centro historico', 'Paso por via principal.'], 15: ['15 de Mayo', 'Llegada al barrio 15 de Mayo.'] },
  '15-derecho': { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 6: ['Calle 15', 'Tramo directo por corredor vial.'], 12: ['Carrera 7', 'Conexion hacia el centro.'], 15: ['Centro derecho', 'Llegada por el costado derecho del centro.'] },
  '27-37': { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 5: ['Calle 27', 'Conexion hacia malla urbana.'], 10: ['Carrera 37', 'Giro hacia el corredor 37.'], 15: ['27-37', 'Llegada al corredor 27-37.'] },
  'centro-coquivacoa': { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 5: ['Calle 15', 'Conexion con corredor comercial.'], 10: ['Centro de Riohacha', 'Paso por el centro urbano.'], 15: ['Coquivacoa', 'Llegada al sector Coquivacoa.'] },
  dividivi: { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 5: ['Avenida Circunvalar', 'Tramo principal hacia el suroriente.'], 11: ['Calle interna', 'Cruce por via de barrio.'], 15: ['Dividivi', 'Llegada al sector Dividivi.'] },
  'la-20': { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 7: ['Calle 20', 'Ingreso al corredor de la calle 20.'], 12: ['Mercado nuevo', 'Paso por zona de comercio.'], 15: ['La 20', 'Llegada a la zona de La 20.'] },
  majayura: { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 4: ['Glorieta universitaria', 'Salida hacia el corredor oriental.'], 10: ['Via a Maicao', 'Conexion principal hacia el oriente.'], 15: ['Majayura', 'Llegada al sector Majayura.'] },
  marbella: { 0: ['Universidad de La Guajira', 'Salida desde el campus principal.'], 6: ['Calle 15', 'Ingreso al corredor urbano.'], 12: ['Centro historico', 'Conexion hacia zona norte.'], 15: ['Marbella', 'Llegada al sector Marbella.'] },
}

const routePoints = Object.entries(routeShapes).flatMap(([routeKey, points]) =>
  points.map(([lat, lng], index, all) => {
    const stop = routeStops[routeKey]?.[index]
    return {
      routeKey,
      title: stop?.[0] ?? `Trazado ${routeKey} ${index + 1}`,
      description: stop?.[1] ?? null,
      lat,
      lng,
      progress: Math.round((index / Math.max(all.length - 1, 1)) * 100),
      order: index + 1,
      isStop: Boolean(stop),
    }
  }),
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
