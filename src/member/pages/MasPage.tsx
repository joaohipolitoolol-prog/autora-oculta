import { Link } from 'react-router-dom'
import { Accent } from '../components/ui'
import { MOBILE_MORE } from '../data/nav'
import { useAppStore } from '../store/appStore'

export function MasPage() {
  const overall = useAppStore((s) => s.stats().overall)

  return (
    <div>
      <Accent>Más</Accent>
      <h1 className="font-display mt-2 text-3xl">Todas las áreas</h1>
      <p className="mt-2 text-sm text-ivory-muted">Progreso general {overall}%</p>
      <ul className="mt-6 space-y-2">
        {MOBILE_MORE.map((item) => (
          <li key={item.id}>
            <Link
              to={item.path}
              className="flex min-h-12 items-center justify-between border border-white/10 bg-elevated/60 px-3 text-sm text-ivory no-underline hover:border-gold/30"
            >
              <span>{item.label}</span>
              <span className="text-ivory-faint">→</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/entregavel/instalar"
            className="flex min-h-12 items-center justify-between border border-gold/35 px-3 text-sm text-gold-soft no-underline"
          >
            <span>Instalar aplicación</span>
            <span>→</span>
          </Link>
        </li>
        <li>
          <Link
            to="/entregavel/buscar"
            className="flex min-h-12 items-center justify-between border border-white/10 px-3 text-sm text-ivory-muted no-underline"
          >
            <span>Buscar</span>
            <span>→</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
