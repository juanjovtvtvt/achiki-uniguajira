# ACHIKI Uniguajira

ACHIKI Uniguajira es un periódico universitario digital pensado para la Universidad de La Guajira y su comunidad académica. La aplicación reúne noticias, artículos, columnas, eventos, rutas, comentarios, reacciones, boletín por correo, autenticación de usuarios y panel administrativo en una plataforma web.

Autores:

- Juan Villalba
- Yeimer Pimienta

Sitios desplegados:

- Sitio principal: https://achiki.space
- Panel demo temporal: https://achiki-admin-demo.vercel.app

## Problema Que Resuelve

La Universidad de La Guajira no cuenta con un espacio digital propio, ordenado y permanente donde la comunidad pueda consultar y expresar noticias universitarias más allá de redes sociales. Las redes sociales ayudan a difundir información, pero no funcionan como archivo editorial, no organizan publicaciones por categorías académicas, no ofrecen un flujo claro de revisión, no centralizan eventos, no guardan comentarios en torno a una publicación y no dan una identidad periodística estable.

ACHIKI responde a ese vacío con un periódico universitario digital. La plataforma permite que estudiantes, lectores, autores y equipo editorial participen en un mismo ecosistema: leer noticias, reaccionar, comentar, suscribirse al boletín, consultar rutas universitarias y administrar contenidos desde un panel protegido.

El valor principal del proyecto está en darle voz a la comunidad estudiantil y crear un lugar propio para que la vida universitaria tenga memoria, organización y visibilidad.

## Objetivo General

Construir una aplicación web funcional para gestionar, publicar y consultar contenido periodístico universitario de Uniguajira, con persistencia real en base de datos, autenticación de usuarios, integración con servicios externos y una interfaz clara para lectores y administradores.

## Objetivos Específicos

- Centralizar noticias universitarias en una portada digital.
- Organizar publicaciones por categorías editoriales.
- Permitir lectura completa de artículos, columnas y eventos.
- Permitir registro e inicio de sesión de usuarios.
- Integrar inicio de sesión con Google OAuth.
- Permitir comentarios asociados a cada publicación.
- Permitir reacciones únicas por usuario y publicación.
- Guardar usuarios, comentarios, reacciones, boletines, publicaciones y eventos en una base de datos permanente.
- Enviar confirmación real de boletín mediante Resend.
- Mostrar rutas universitarias en mapa real de Riohacha.
- Ofrecer un panel administrativo para crear, editar, publicar, archivar y eliminar contenido.
- Ofrecer un panel demo separado donde los cambios se reinician al recargar.
- Preparar una estructura de código organizada para sustentación y mantenimiento.

## Funcionalidades Del Periódico

### Portada Principal

La portada presenta el periódico digital con una identidad visual de estilo editorial. Incluye encabezado, fecha, modo claro y oscuro, acceso de usuario, categorías, publicación destacada, encuesta, rutas, artículos principales y columna editorial.

Desde la portada se puede:

- Ver la publicación del día.
- Leer el resumen de publicaciones principales.
- Entrar a artículos completos.
- Cambiar entre categorías.
- Consultar eventos.
- Suscribirse al boletín.
- Acceder al login.
- Acceder a cuenta de usuario cuando hay sesión activa.
- Acceder al panel administrativo si el usuario tiene rol autorizado.

### Publicaciones

Cada publicación contiene:

- Título.
- Categoría.
- Fecha.
- Autor.
- Resumen.
- Imagen principal.
- Cuerpo del contenido.
- Etiquetas.
- Reacciones.
- Comentarios.

Las publicaciones están conectadas a la base de datos. El panel administrativo puede cambiar su estado entre borrador, revisión, publicado y archivado.

### Categorías

El periódico organiza el contenido en secciones editoriales:

- Universidad.
- Región.
- Cultura.
- Investigación.
- Deportes.
- Opinión.
- Eventos.

Cada categoría permite filtrar el contenido de la portada y navegar a una página propia con sus publicaciones.

### Reacciones

Cada publicación permite reaccionar con una sola reacción activa por usuario. Las reacciones disponibles son:

- Me gusta.
- Interesante.
- Apoyo.

Reglas de reacción:

- Para reaccionar se necesita una cuenta.
- Un usuario solo puede tener una reacción al mismo tiempo en una publicación.
- Si cambia de reacción, la anterior se reemplaza.
- Los conteos se guardan en PostgreSQL mediante Neon.
- Las reacciones permanecen aunque el usuario cierre sesión o se reinicie el servidor.

### Comentarios

Los usuarios registrados pueden comentar en las publicaciones. Cada comentario queda asociado a:

- Publicación.
- Usuario.
- Nombre o firma pública.
- Foto de perfil si existe.
- Fecha de creación.
- Estado de publicación.

Los comentarios se guardan en la base de datos y permanecen visibles después de recargar la página.

### Usuarios

La aplicación maneja usuarios lectores, autores, editores y administradores. Cada usuario puede tener:

- Nombre.
- Correo.
- Contraseña local.
- Proveedor de autenticación.
- Google ID cuando inicia con Google.
- Foto de perfil.
- Biografía.
- Firma pública.
- Rol.
- Estado.

Los usuarios pueden iniciar sesión, crear cuenta y actualizar su perfil.

### Inicio De Sesión

El login ofrece dos caminos:

- Inicio de sesión con correo o usuario y contraseña.
- Inicio de sesión con Google.

También permite:

- Crear cuenta local.
- Crear cuenta con Google.
- Redirigir al periódico después del inicio de sesión.
- Mantener acceso a acciones como comentar, reaccionar y enviar publicaciones.

### Google OAuth

Google OAuth se usa para permitir ingreso con cuentas reales. La app usa:

- `GOOGLE_CLIENT_ID`.
- `GOOGLE_CLIENT_SECRET`.
- Callback: `https://achiki.space/api/auth/google/callback`.

Cuando Google devuelve el perfil, la aplicación crea o actualiza el usuario en base de datos y abre una sesión propia.

### Perfil De Usuario

La sección de cuenta permite:

- Ver datos del usuario.
- Cambiar nombre.
- Cambiar firma pública.
- Cambiar biografía.
- Cambiar foto de perfil por enlace.
- Subir foto de perfil local.
- Revisar publicaciones enviadas.
- Entrar a la sección de envío de contenido.

### Envío De Publicaciones

Los usuarios con sesión pueden enviar una publicación desde la interfaz de cuenta. El envío queda preparado para revisión editorial. Incluye:

- Título.
- Resumen.
- Categoría.
- Contenido.
- Autor asociado.
- Estado inicial.

### Panel Administrativo Real

El panel administrativo permite gestionar el periódico desde una interfaz protegida por rol. Incluye:

- Dashboard con métricas.
- Gestión de publicaciones.
- Creación de artículos.
- Edición de artículos.
- Vista previa administrativa.
- Publicación o paso a borrador.
- Eliminación de artículos.
- Gestión de categorías.
- Gestión de eventos.
- Gestión de usuarios.
- Gestión de suscriptores.
- Exportación JSON de respaldo.
- Estado del sistema.

El panel real trabaja con la base de datos de Neon y por tanto sus cambios son persistentes.

### Panel Demo Temporal

El proyecto incluye un panel demo separado en:

https://achiki-admin-demo.vercel.app

Este demo sirve para mostrar el flujo administrativo sin tocar la base real. Permite:

- Crear artículos temporales.
- Editar artículos temporales.
- Cambiar categorías.
- Cambiar estados.
- Eliminar artículos.
- Ver una mini vista del periódico dentro del mismo demo.
- Reiniciar todo con F5.

El demo no redirecciona al sitio oficial y no escribe en Neon.

### Boletín Por Correo

El boletín permite registrar correos y enviar una confirmación real con Resend. El flujo guarda:

- Suscriptor.
- Boletín generado.
- Entrega del correo.
- Estado de entrega.

Variables necesarias:

- `RESEND_API_KEY`.
- `NEWSLETTER_FROM_EMAIL`.
- `NEXT_PUBLIC_APP_URL`.

Para envío real a cualquier correo, el dominio debe estar verificado en Resend.

### Rutas En Mapa Real

El periódico incluye una sección de ruta universitaria sobre mapa real de Riohacha. Usa teselas de OpenStreetMap y recorridos definidos con coordenadas.

Rutas disponibles:

- Marbella.
- Majayura.
- 15 de Mayo.
- 15 Derecho.
- Centro Coquivacoa.
- Dividivi.
- La 20.
- 27-37.

Cada ruta muestra:

- Mapa real.
- Trazado superior.
- Bus simulado en movimiento.
- Paradas.
- Nombre de ruta.
- Puntos del recorrido.

### Encuesta

La portada incluye una encuesta activa. Permite votar y visualizar porcentajes de respuesta. Los votos se guardan en base de datos.

### Eventos

Los eventos tienen:

- Título.
- Slug.
- Descripción.
- Ubicación.
- Fecha de inicio.
- Fecha de finalización.
- Registro de usuarios.

Desde el admin se pueden crear y editar eventos.

### Exportación De Datos

El panel de sistema permite descargar una copia JSON con datos relevantes del periódico:

- Publicaciones.
- Categorías.
- Usuarios.
- Eventos.
- Suscriptores.

## Tecnologías Usadas

### Frontend

- Next.js 16.
- React 19.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- Componentes Radix UI.
- CSS personalizado.

### Backend

- Next.js App Router.
- Route Handlers.
- Server Actions.
- Prisma ORM.
- Autenticación con cookies firmadas.
- Validación de sesión por rol.

### Base De Datos

- PostgreSQL.
- Neon.
- Prisma Client.
- Prisma Schema.
- Prisma Seed.

### Servicios Externos

- Google OAuth para inicio de sesión.
- Resend para envío de correos.
- OpenStreetMap para mapas.
- Vercel para despliegue.
- Vercel Analytics.

### Herramientas De Desarrollo

- Node.js.
- pnpm.
- Prisma CLI.
- TypeScript.
- Vercel CLI.
- Git.
- GitHub.

## Estructura Del Proyecto

```txt
ACHIKI/
  app/
    admin/
    api/
    articulos/
    categorias/
    cuenta/
    demo-admin/
    eventos/
    login/
    globals.css
    layout.tsx
    page.tsx
  components/
    admin/
    newspaper/
    ui/
  hooks/
  lib/
    articles.ts
    auth.ts
    content.ts
    db.ts
    newsletter-email.ts
    utils.ts
  prisma/
    schema.prisma
    seed.ts
  public/
    images/
  admin-demo-static/
    index.html
  package.json
  pnpm-lock.yaml
  README.md
```

## Explicación De Carpetas

### `app`

Contiene las rutas principales de Next.js. Aquí viven las páginas públicas, páginas administrativas, APIs, autenticación, artículos, eventos, cuenta de usuario y layout general.

### `app/admin`

Contiene el panel administrativo real. Sus páginas consultan y modifican la base de datos mediante Prisma y Server Actions.

### `app/api`

Contiene endpoints internos:

- Exportación de datos.
- Google OAuth.
- Votación de encuestas.
- Estado de salud.
- Reacciones.
- Suscriptores.

### `app/articulos`

Contiene la vista pública de cada publicación y la acción de comentar.

### `app/cuenta`

Contiene perfil, actualización de datos, subida de foto y envío de publicaciones.

### `app/login`

Contiene formulario de login, creación de cuenta y acciones de autenticación.

### `components/admin`

Contiene formularios reutilizables para artículos y eventos.

### `components/newspaper`

Contiene componentes visuales del periódico:

- Tarjetas de artículos.
- Portada destacada.
- Encabezado.
- Sidebar de categorías.
- Drawer móvil.
- Panel de reacciones.
- Mapa de rutas.
- Encuesta.
- Modo claro y oscuro.

### `components/ui`

Contiene componentes base de interfaz reutilizables.

### `lib`

Contiene lógica compartida:

- Datos editoriales.
- Autenticación.
- Consultas a base de datos.
- Cliente Prisma.
- Plantilla de correo.
- Utilidades.

### `prisma`

Contiene el esquema de base de datos y la carga inicial de datos.

### `admin-demo-static`

Contiene el panel demo estático desplegado en otro host de Vercel. Este demo no modifica la base real.

## Modelo De Datos

El esquema de base de datos incluye:

- `Program`: programas académicos.
- `User`: usuarios del sistema.
- `Category`: categorías editoriales.
- `Edition`: ediciones del periódico.
- `Publication`: publicaciones y columnas.
- `PublicationReaction`: reacciones por publicación.
- `PublicationImage`: imágenes de publicaciones.
- `Tag`: etiquetas.
- `PublicationTag`: relación entre publicaciones y etiquetas.
- `Comment`: comentarios.
- `DailyPoll`: encuestas.
- `PollOption`: opciones de encuesta.
- `PollVote`: votos.
- `RoutePoint`: puntos de rutas.
- `Event`: eventos.
- `EventRegistration`: registros a eventos.
- `Subscriber`: suscriptores.
- `Newsletter`: boletines.
- `NewsletterDelivery`: entregas de boletines.

Relaciones importantes:

- Un programa puede tener muchos usuarios.
- Un usuario puede tener muchas publicaciones.
- Un usuario puede tener muchos comentarios.
- Un usuario puede tener muchas reacciones.
- Una categoría puede tener muchas publicaciones.
- Una publicación puede tener muchas imágenes.
- Una publicación puede tener muchos comentarios.
- Una publicación puede tener muchas reacciones.
- Una publicación puede tener muchas etiquetas.
- Una encuesta puede tener muchas opciones.
- Una opción puede tener muchos votos.
- Un evento puede tener muchos registros.
- Un suscriptor puede tener muchas entregas de boletín.

## Requisitos Previos

Para ejecutar el proyecto se necesita:

- Node.js 20 o superior.
- pnpm.
- Git.
- Cuenta de Neon.
- Base PostgreSQL en Neon.
- Cuenta de Google Cloud con OAuth configurado.
- Cuenta de Resend con dominio verificado.
- Cuenta de Vercel para despliegue.

## Instalación Desde Cero

### 1. Clonar El Repositorio

```bash
git clone https://github.com/juanjovtvt/achiki-uniguajira.git
cd achiki-uniguajira
```

### 2. Instalar Dependencias

```bash
pnpm install
```

Si `pnpm` no está instalado:

```bash
npm install -g pnpm
pnpm install
```

### 3. Crear Archivo De Entorno

Crear un archivo llamado `.env` en la raíz del proyecto.

Puede partirse de `.env.example`:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Configurar Variables De Entorno

El archivo `.env` debe tener:

```env
DATABASE_URL="postgresql://usuario:clave@host.neon.tech/neondb?sslmode=require"
AUTH_SECRET="un-secreto-largo-y-dificil"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
NEWSLETTER_FROM_EMAIL="ACHIKI <boletin@tudominio.com>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxx"
```

### 5. Configurar Neon

Entrar a Neon y crear un proyecto PostgreSQL.

Copiar el connection string de la rama principal.

Ejemplo de formato:

```txt
postgresql://usuario:clave@host.neon.tech/neondb?sslmode=require
```

Pegar ese valor en `DATABASE_URL`.

### 6. Crear Tablas Con Prisma

```bash
pnpm db:push
```

Este comando ejecuta:

```bash
prisma db push
prisma generate
```

### 7. Cargar Datos Iniciales

```bash
pnpm db:seed
```

Esto crea:

- Categorías.
- Programas.
- Autores.
- Publicaciones iniciales.
- Columnas.
- Eventos.
- Rutas.
- Encuesta.
- Reacciones iniciales.
- Usuario administrador base.
- Suscriptor base.

### 8. Ejecutar En Desarrollo

```bash
pnpm dev
```

Abrir:

```txt
http://localhost:3000
```

### 9. Entrar Al Panel Administrativo

Abrir:

```txt
http://localhost:3000/admin
```

El acceso depende de las credenciales configuradas y de los usuarios sembrados. Para desarrollo local puede usarse el usuario administrador creado por el seed o las variables administrativas configuradas en el entorno.

### 10. Abrir Prisma Studio

```bash
pnpm db:studio
```

Prisma Studio permite revisar tablas y datos desde el navegador.

## Scripts Disponibles

```bash
pnpm dev
```

Ejecuta el servidor local en modo desarrollo.

```bash
pnpm build
```

Compila la aplicación para producción.

```bash
pnpm start
```

Ejecuta la versión compilada.

```bash
pnpm lint
```

Ejecuta revisión de tipos con TypeScript sin emitir archivos.

```bash
pnpm db:push
```

Sincroniza el esquema Prisma con la base de datos.

```bash
pnpm db:reset
```

Reinicia la base de datos, aplica el esquema y ejecuta el seed.

```bash
pnpm db:seed
```

Carga datos iniciales.

```bash
pnpm db:studio
```

Abre Prisma Studio.

## Configuración De Google OAuth

Entrar a Google Cloud Console.

Crear o abrir un OAuth Client ID de tipo aplicación web.

En `Authorized JavaScript origins`, agregar:

```txt
http://localhost:3000
https://achiki.space
```

En `Authorized redirect URIs`, agregar:

```txt
http://localhost:3000/api/auth/google/callback
https://achiki.space/api/auth/google/callback
```

Copiar:

- Client ID.
- Client Secret.

Pegarlos en:

```env
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Configuración De Resend

Entrar a Resend.

Crear una API Key.

Verificar el dominio que se usará para enviar correos.

Configurar en `.env`:

```env
RESEND_API_KEY="..."
NEWSLETTER_FROM_EMAIL="ACHIKI <boletin@tudominio.com>"
```

Para producción, el dominio debe estar verificado. Si no está verificado, Resend puede limitar el envío a ciertos correos.

## Configuración En Vercel

Crear un proyecto en Vercel conectado al repositorio.

Configurar variables de entorno en Production:

```env
DATABASE_URL="..."
AUTH_SECRET="..."
RESEND_API_KEY="..."
NEWSLETTER_FROM_EMAIL="..."
NEXT_PUBLIC_APP_URL="https://achiki.space"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Build command:

```bash
node .v0/inject-built-with-v0.mjs && prisma generate && next build
```

Dominio principal:

```txt
achiki.space
```

Panel demo:

```txt
achiki-admin-demo.vercel.app
```

## Flujo De Sustentación Recomendado

### 1. Mostrar Problema

Explicar que Uniguajira necesita un medio digital propio porque la información universitaria suele depender de redes sociales, donde se pierde organización, archivo y participación estructurada.

### 2. Mostrar Portada

Abrir `https://achiki.space` y explicar:

- Encabezado.
- Categorías.
- Publicación del día.
- Encuesta.
- Rutas.
- Artículos.
- Boletín.
- Modo claro y oscuro.

### 3. Mostrar Artículo

Abrir una publicación y explicar:

- Datos del artículo.
- Imagen.
- Contenido.
- Etiquetas.
- Reacciones.
- Comentarios.

### 4. Mostrar Login

Explicar:

- Cuenta local.
- Google OAuth.
- Sesión con cookie firmada.
- Redirección al periódico después del login.

### 5. Mostrar Interacción

Con un usuario autenticado:

- Reaccionar.
- Cambiar reacción.
- Comentar.
- Mostrar que se guarda.

### 6. Mostrar Admin

Entrar al panel administrativo y mostrar:

- Dashboard.
- Crear publicación.
- Editar publicación.
- Cambiar estado.
- Ver vista previa.
- Exportar datos.

### 7. Mostrar Base De Datos

Abrir Prisma Studio o Neon y explicar:

- Tablas.
- Relaciones.
- Persistencia.
- Reacciones por usuario.
- Comentarios por publicación.

### 8. Mostrar Demo Temporal

Abrir `https://achiki-admin-demo.vercel.app` y explicar que es una versión para pruebas de interfaz que no escribe en la base real.

## Uso Con IA

Se usaron herramientas de inteligencia artificial como apoyo durante el desarrollo y la planeación técnica del proyecto.

La IA ayudó en:

- Modelar ideas iniciales para el diseño visual del periódico.
- Explorar propuestas de diseño 3D para la sección de rutas antes de llegar a la versión final en mapa superior.
- Generar y ajustar imágenes conceptuales usadas durante la exploración gráfica.
- Redactar, revisar y mejorar textos editoriales, mensajes de interfaz y documentación.
- Guiar la configuración del inicio de sesión con Google OAuth.
- Guiar la integración de Resend para el envío real del boletín.
- Explicar conceptos técnicos relacionados con recursividad y trazado de flujos.
- Ayudar a ordenar decisiones sobre base de datos, relaciones y persistencia.

La IA se usó como apoyo de orientación, diseño, documentación y depuración. El funcionamiento del proyecto puede explicarse revisando sus rutas, componentes, acciones, modelos y servicios.

## Seguridad Y Variables Sensibles

El repositorio no debe subir:

- `.env`.
- Claves de Resend.
- Secretos de Google OAuth.
- URL privada de base de datos con contraseña.
- Cookies locales.
- Logs de sesión.

Las variables sensibles se manejan desde `.env` local y desde el panel de variables de Vercel.

## Criterios De Calidad Técnica

El proyecto está separado por responsabilidades:

- `app` maneja rutas, páginas, APIs y acciones del servidor.
- `components` maneja interfaz reutilizable.
- `lib` maneja autenticación, base de datos, consultas y servicios.
- `prisma` maneja el esquema y datos iniciales.
- `admin-demo-static` maneja la demo aislada.

La lógica de datos no está mezclada directamente con estilos globales. El acceso a base de datos se centraliza con Prisma. Las variables sensibles no se escriben en el código fuente. La interfaz está organizada por componentes y las rutas del proyecto siguen la estructura de Next.js App Router.

## Casos De Prueba Manual

### Portada

1. Abrir la página principal.
2. Cambiar categoría.
3. Ver publicación destacada.
4. Revisar encuesta.
5. Revisar mapa de ruta.
6. Cambiar modo claro y oscuro.

### Autenticación

1. Abrir login.
2. Crear cuenta.
3. Iniciar sesión.
4. Cerrar sesión.
5. Iniciar con Google.

### Reacciones

1. Entrar con usuario.
2. Abrir un artículo.
3. Dar una reacción.
4. Cambiar la reacción.
5. Recargar la página.
6. Confirmar que el conteo permanece.

### Comentarios

1. Entrar con usuario.
2. Abrir artículo.
3. Escribir comentario.
4. Publicarlo.
5. Recargar.
6. Confirmar que permanece.

### Boletín

1. Ir a la sección de boletín.
2. Escribir correo.
3. Enviar.
4. Revisar mensaje de confirmación.
5. Verificar llegada del correo.

### Admin

1. Entrar al panel.
2. Crear artículo.
3. Editar artículo.
4. Cambiar estado.
5. Ver la publicación.
6. Exportar respaldo JSON.

### Demo Admin

1. Abrir `https://achiki-admin-demo.vercel.app`.
2. Crear un artículo.
3. Ver la mini vista.
4. Editar el artículo.
5. Cambiar estado.
6. Eliminar.
7. Recargar con F5.
8. Confirmar que vuelve al estado inicial.

## Estado Actual

El proyecto tiene:

- Aplicación web pública.
- Panel administrativo real.
- Panel demo independiente.
- Base de datos PostgreSQL persistente.
- Google OAuth.
- Resend.
- Rutas con mapa.
- Reacciones.
- Comentarios.
- Perfiles.
- Boletín.
- Exportación de datos.
- Despliegue en Vercel.

## Licencia Académica

Este proyecto fue desarrollado para fines académicos en la Universidad de La Guajira, asignatura Programación Avanzada, periodo 2026-I.
