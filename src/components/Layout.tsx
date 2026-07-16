import { Link, useLocation } from 'react-router-dom'
import { APP_CONFIG } from '@/config'
import type { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const showStartCta = pathname === '/' || pathname === '/terminos' || pathname === '/privacidad'
  const isProcessing = pathname === '/procesando' || pathname === '/processando'

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-3 focus:py-2 focus:text-bg"
      >
        Saltar al contenido
      </a>
      <header className="border-b border-white/5 px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="font-display text-2xl text-ivory no-underline">
            Autora Oculta
          </Link>
          {isProcessing ? (
            <span className="text-sm text-ivory-faint">Creando…</span>
          ) : showStartCta ? (
            <Link to="/quiz" className="text-sm text-gold-soft no-underline hover:text-ivory">
              Descubrir mi historia
            </Link>
          ) : pathname === '/resultado' ? (
            <Link
              to="/quiz?nuevo=1"
              className="text-sm text-ivory-faint no-underline hover:text-gold-soft"
            >
              Rehacer el test
            </Link>
          ) : (
            <span className="text-sm text-ivory-faint">Test</span>
          )}
        </div>
      </header>
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-white/10 px-5 py-10 text-sm text-ivory-faint">
        <div className="mx-auto max-w-5xl space-y-4">
          <p className="font-display text-xl text-ivory">Autora Oculta</p>
          <p>Producto digital educativo</p>
          <nav className="flex flex-wrap gap-4" aria-label="Enlaces legales">
            <Link to="/terminos" className="text-ivory-muted no-underline hover:text-gold-soft">
              Términos de uso
            </Link>
            <Link to="/privacidad" className="text-ivory-muted no-underline hover:text-gold-soft">
              Política de privacidad
            </Link>
            <a
              href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}
              className="text-ivory-muted no-underline hover:text-gold-soft"
            >
              Contacto
            </a>
          </nav>
          <p className="max-w-3xl leading-relaxed">
            Este producto ofrece herramientas educativas para la creación, publicación y presentación
            de proyectos digitales. No existe garantía de ingresos o resultados financieros. Los
            resultados dependen de la ejecución, calidad del proyecto, estrategia, mercado y otros
            factores individuales.
          </p>
        </div>
      </footer>
    </div>
  )
}
