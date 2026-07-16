import { NavLink } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

const ITEMS = [
  { to: '/entregavel', label: 'Inicio', end: true },
  { to: '/entregavel/proyecto', label: 'Proyecto', end: false },
  { to: '/entregavel/prompts', label: 'Prompts', end: false },
  { to: '/entregavel/progreso', label: 'Progreso', end: false },
  { to: '/entregavel/mas', label: 'Más', end: false },
] as const

export function BottomNav() {
  const overall = useAppStore((s) => s.stats().overall)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-elevated/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {ITEMS.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 px-1 text-[0.65rem] no-underline',
                  isActive ? 'text-gold-soft' : 'text-ivory-faint',
                ].join(' ')
              }
            >
              <span className="font-display text-sm leading-none" aria-hidden>
                {item.label === 'Progreso' ? `${overall}%` : item.label.slice(0, 1)}
              </span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
