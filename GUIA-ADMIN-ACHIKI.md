# Guia de administracion ACHIKI

## Enlaces principales

- Sitio local: http://localhost:3000
- Admin local: http://localhost:3000/admin
- Sitio en Vercel: https://achiki-uniguajira.vercel.app
- Admin en Vercel: https://achiki-uniguajira.vercel.app/admin

## Acceso admin

- Usuario: `uniguajiraadmin`
- Clave: la clave configurada en el entorno local y en Vercel.

Tambien existe inicio de sesion para usuarios registrados. Los autores sembrados en la base pueden entrar con su correo institucional y la clave inicial:

- Clave inicial de autores: `achiki2026`
- Ejemplo: `camila.ipuana@uniguajira.edu.co`

El admin protege estas secciones:

- Dashboard: resumen general.
- Articulos: crear, editar y ver publicaciones.
- Categorias: administrar categorias editoriales.
- Eventos: crear y editar eventos.
- Usuarios: administrar autores y perfiles editoriales.
- Suscriptores: revisar, activar/desactivar o eliminar correos del boletin.
- Sistema: ver estado, conteos y descargar respaldo JSON.

## Base de datos

En local se usa SQLite:

- Archivo: `prisma/achiki.db`
- Esquema: `prisma/schema.prisma`
- Carga inicial: `prisma/seed.ts`
- Creacion manual de tablas: `prisma/init-sqlite.py`

Comandos utiles:

```bash
pnpm db:reset
pnpm db:seed
pnpm db:studio
pnpm build
pnpm dev
```

## Respaldo

Desde el admin:

1. Entra a `/admin`.
2. Abre `Sistema`.
3. Pulsa `Descargar JSON`.

La ruta protegida del respaldo es:

```text
/api/admin/export
```

Ese respaldo incluye programas, usuarios, categorias, ediciones, publicaciones, imagenes, etiquetas, eventos y suscriptores.

## Produccion en Vercel

El sitio ya funciona en Vercel. Para que el admin no aparezca en blanco, se incluyo la base SQLite dentro del despliegue y se copia a `/tmp/achiki.db` cuando corre en Vercel.

Importante: esto sirve para demo y verificacion. En Vercel, `/tmp` es temporal, asi que los cambios hechos desde el admin pueden perderse cuando Vercel reinicia una funcion o crea una nueva instancia.

## Login con Google

El flujo de Google OAuth ya esta implementado en:

- `/api/auth/google`
- `/api/auth/google/callback`

Para activarlo en produccion se deben configurar estas variables de entorno en Vercel:

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

En Google Cloud Console, el redirect URI debe ser:

```text
https://achiki-uniguajira.vercel.app/api/auth/google/callback
```

Si esas variables no existen, el boton `Continuar con Google` muestra un aviso de configuracion pendiente.

## Siguiente paso recomendado

Para produccion real, conectar una base PostgreSQL permanente, por ejemplo:

- Vercel Postgres
- Supabase
- Neon

Despues de eso se debe cambiar `DATABASE_URL` en Vercel a la conexion PostgreSQL, ajustar Prisma para PostgreSQL y correr las migraciones.
