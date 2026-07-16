import { Link } from 'react-router-dom'
import { GROUP_LABELS, NAV_ITEMS, type NavItem } from '../data/nav'
import { useMember } from '../context/MemberContext'
import { Accent } from '../components/ui'

function groupItems(group: NavItem['group']) {
  return NAV_ITEMS.filter((i) => i.group === group)
}

export function MenuPage() {
  const { progress, stats } = useMember()

  return (
    <div>
      <Accent>Menú</Accent>
      <h1 className="font-display mt-2 text-3xl">Todos los módulos</h1>
      <p className="mt-2 text-sm text-ivory-muted">
        Progreso general {stats.overall}% · {stats.modulesDone}/{stats.modulesTotal} módulos
      </p>

      {(Object.keys(GROUP_LABELS) as NavItem['group'][]).map((group) => (
        <section key={group} className="mt-6">
          <h2 className="font-accent text-[0.65rem] tracking-widest text-gold uppercase">
            {GROUP_LABELS[group]}
          </h2>
          <ul className="mt-2 space-y-1">
            {groupItems(group).map((item) => {
              const done = progress.completedModules.includes(item.id)
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className="flex min-h-12 items-center justify-between border border-white/10 bg-elevated/60 px-3 text-sm text-ivory no-underline hover:border-gold/30"
                  >
                    <span>{item.label}</span>
                    {item.module && done ? (
                      <span className="text-gold-soft">✓</span>
                    ) : (
                      <span className="text-ivory-faint">→</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <div className="mt-8 space-y-2">
        <Link
          to="/entregavel/instalar"
          className="flex min-h-12 items-center border border-gold/35 px-3 text-sm text-gold-soft no-underline"
        >
          Instalar app (PWA)
        </Link>
        <Link
          to="/entregavel/buscar"
          className="flex min-h-12 items-center border border-white/10 px-3 text-sm text-ivory-muted no-underline"
        >
          Buscar en el método
        </Link>
      </div>
    </div>
  )
}
