import Link from 'next/link'

const footerCategories = [
  { name: 'Universidad', slug: 'universidad' },
  { name: 'Region', slug: 'region' },
  { name: 'Cultura', slug: 'cultura' },
  { name: 'Investigacion', slug: 'investigacion' },
  { name: 'Deportes', slug: 'deportes' },
  { name: 'Opinion', slug: 'opinion' },
  { name: 'Eventos', slug: 'eventos' },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-[#3a2a22] bg-[#1b130f] text-[#f5f1e8] mt-12">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h2
              className="font-display text-3xl font-bold text-[#f5f1e8] mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Achiki
            </h2>
            <p className="text-xs text-[#f5f1e8]/60 tracking-widest uppercase font-sans mb-3">
              Uniguajira
            </p>
            <p className="font-sans text-xs text-[#f5f1e8]/70 leading-relaxed">
              Medio digital estudiantil independiente sobre Uniguajira y La Guajira. Una voz desde Riohacha para el mundo.
            </p>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#f5f1e8]/50 mb-3">
              Secciones
            </h3>
            <ul className="space-y-1.5">
              {footerCategories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/categorias/${category.slug}`} className="font-sans text-xs text-[#f5f1e8]/80 hover:text-[#f5f1e8] transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#f5f1e8]/50 mb-3">
              Universidad
            </h3>
            <ul className="space-y-1.5">
              {['Acerca de Achiki', 'Contacto', 'Equipo editorial', 'Convocatoria de escritores', 'Archivo'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-sans text-xs text-[#f5f1e8]/80 hover:text-[#f5f1e8] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#f5f1e8]/50 mb-3">
              Redes sociales
            </h3>
            <ul className="space-y-1.5">
              {['Instagram', 'Facebook', 'Twitter / X', 'YouTube'].map((red) => (
                <li key={red}>
                  <a href="#" className="font-sans text-xs text-[#f5f1e8]/80 hover:text-[#f5f1e8] transition-colors">
                    {red}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-t border-[#f5f1e8]/10 pt-6">
          <p className="font-sans text-[10px] text-[#f5f1e8]/50 tracking-wide">
            (c) 2025 Achiki - Periodico Universitario de la Universidad de La Guajira - Riohacha, Colombia
          </p>
          <div className="flex items-center gap-4">
            {['Politica de privacidad', 'Terminos de uso'].map((link) => (
              <a key={link} href="#" className="font-sans text-[10px] text-[#f5f1e8]/50 hover:text-[#f5f1e8]/80 transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
