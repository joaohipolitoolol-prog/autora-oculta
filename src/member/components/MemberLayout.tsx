import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { GROUP_LABELS, NAV_ITEMS, type NavItem } from '../data/nav'
import { useMember } from '../context/MemberContext'
import { rememberContentRoute } from '../lib/storage'
import { InstallBanner } from './InstallBanner'
import { OnboardingModal } from './OnboardingModal'
import { BottomNav } from './BottomNav'
import { StatusChip, UpdateToast } from './StatusChip'

function groupItems(group: NavItem['group']) {
  return NAV_ITEMS.filter((i) => i.group === group)
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { progress, stats } = useMember()

  return (
    <nav className="flex flex-col gap-5" aria-label="Módulos del método">
      {(Object.keys(GROUP_LABELS) as NavItem['group'][]).map((group) => (
        <div key={group}>
          <p className="font-accent mb-2 px-2 text-[0.62rem] tracking-[0.16em] text-gold uppercase">
            {GROUP_LABELS[group]}
          </p>
          <ul className="flex flex-col gap-0.5">
            {groupItems(group).map((item) => {
              const done = progress.completedModules.includes(item.id)
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/entregavel'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      [
                        'flex items-center justify-between gap-2 border px-2.5 py-2 text-sm no-underline transition',
                        isActive
                          ? 'border-gold/35 bg-wine/25 text-ivory'
                          : 'border-transparent text-ivory-muted hover:border-white/10 hover:text-ivory',
                      ].join(' ')
                    }
                  >
                    <span>{item.label}</span>
                    {item.module && done ? (
                      <span className="text-[0.65rem] text-gold-soft" aria-label="Completado">
                        ✓
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              )
            })}
          </ul>
          {group === 'inicio' ? (
            <div className="mt-3 px-2">
              <div className="mb-1 flex justify-between text-[0.7rem] text-ivory-faint">
                <span>Progreso</span>
                <span>{stats.overall}%</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={stats.overall}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-burgundy to-gold transition-all duration-500"
                  style={{ width: `${stats.overall}%` }}
                />
              </div>
              <div className="mt-3 flex flex-col gap-1">
                <Link
                  to="/entregavel/buscar"
                  onClick={onNavigate}
                  className="text-xs text-gold-soft no-underline hover:text-ivory"
                >
                  Buscar →
                </Link>
                <Link
                  to="/entregavel/instalar"
                  onClick={onNavigate}
                  className="text-xs text-ivory-faint no-underline hover:text-gold-soft"
                >
                  Instalar app
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </nav>
  )
}

export function MemberLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { markVisited, onboardingDone } = useMember()

  useEffect(() => {
    rememberContentRoute(location.pathname)
    const item = NAV_ITEMS.find(
      (n) =>
        n.path === location.pathname ||
        (n.path !== '/entregavel' && location.pathname.startsWith(n.path)),
    )
    if (item) markVisited(item.id)
    const titleMap: Record<string, string> = {
      '/entregavel/instalar': 'Instalar app',
      '/entregavel/menu': 'Menú',
      '/entregavel/buscar': 'Buscar',
    }
    document.title = item
      ? `${item.label} · Autora Oculta`
      : titleMap[location.pathname]
        ? `${titleMap[location.pathname]} · Autora Oculta`
        : 'Autora Oculta — Método'
    setOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname, markVisited])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="member-shell min-h-dvh bg-bg text-ivory pt-[env(safe-area-inset-top)]">
      <a
        href="#member-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ivory focus:px-3 focus:py-2 focus:text-bg"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-elevated/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/15 text-ivory"
            aria-expanded={open}
            aria-controls="member-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
            <span aria-hidden className="flex w-5 flex-col gap-1">
              <span
                className={`h-0.5 bg-ivory transition ${open ? 'translate-y-1.5 rotate-45' : ''}`}
              />
              <span className={`h-0.5 bg-ivory transition ${open ? 'opacity-0' : ''}`} />
              <span
                className={`h-0.5 bg-ivory transition ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
              />
            </span>
          </button>
          <Link to="/entregavel" className="font-display text-xl text-ivory no-underline">
            Autora Oculta
          </Link>
          <Link
            to="/entregavel/instalar"
            className="font-accent text-[0.58rem] tracking-widest text-gold uppercase no-underline"
          >
            App
          </Link>
        </div>
        <div className="mt-2">
          <StatusChip />
        </div>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div className="lg:grid lg:min-h-dvh lg:grid-cols-[280px_1fr]">
        <aside
          id="member-drawer"
          className={[
            'fixed inset-y-0 left-0 z-50 w-[min(88vw,300px)] overflow-y-auto border-r border-white/10 bg-elevated px-4 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:z-0 lg:h-dvh lg:w-auto lg:translate-x-0',
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          <div className="mb-4 hidden lg:block">
            <p className="font-display text-2xl text-ivory">Autora Oculta</p>
            <p className="mt-1 text-sm text-ivory-faint">Método · App digital</p>
            <div className="mt-3">
              <StatusChip />
            </div>
          </div>
          <div className="mb-4 lg:hidden">
            <p className="font-display text-xl">Menú</p>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
          <p className="mt-8 text-xs text-ivory-faint">
            Datos en este dispositivo. Exporta una copia antes de cambiar de teléfono.
          </p>
        </aside>

        <div className="flex min-w-0 flex-col">
          {onboardingDone ? <InstallBanner /> : null}
          <main
            id="member-content"
            className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10 lg:pb-10"
          >
            <Outlet />
          </main>
          <footer className="mb-16 border-t border-white/10 px-4 py-6 text-xs text-ivory-faint sm:px-6 lg:mb-0 lg:px-10">
            <p>
              Autora Oculta · Área de miembros · Producto educativo · Sin garantía de ingresos
            </p>
          </footer>
        </div>
      </div>

      <BottomNav />
      <UpdateToast />
      {!onboardingDone ? <OnboardingModal /> : null}
    </div>
  )
}
