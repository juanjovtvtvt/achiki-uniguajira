/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/admin/**/*': ['./prisma/achiki.db'],
    '/login': ['./prisma/achiki.db'],
    '/api/**/*': ['./prisma/achiki.db'],
    '/articulos/**/*': ['./prisma/achiki.db'],
    '/categorias/**/*': ['./prisma/achiki.db'],
    '/eventos/**/*': ['./prisma/achiki.db'],
  },
}

export default nextConfig
