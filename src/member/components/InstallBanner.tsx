import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearDeferredInstall, getDeferredInstall } from '../lib/installPrompt'
import { useAppStore } from '../store/appStore'
import { trackEvent } from '@/lib/analytics'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIos() {
  return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function InstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(() => getDeferredInstall())
  const [showIosHelp, setShowIosHelp] = useState(false)
  const setPreferences = useAppStore((s) => s.setPreferences)
  const ios = useMemo(() => isIos(), [])

  useEffect(() => {
    const sync = () => setDeferred(getDeferredInstall())
    window.addEventListener('ao-bip-ready', sync)
    sync()
    return () => window.removeEventListener('ao-bip-ready', sync)
  }, [])

  if (isStandalone()) return null

  const dismiss = () => {
    void setPreferences({ installDismissed: true })
    try {
      localStorage.setItem('ao_pwa_dismiss', '1')
    } catch {
      /* ignore */
    }
  }

  if (deferred) {
    return (
      <div className="border-b border-gold/25 bg-wine/30 px-4 py-3 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-ivory">Instalar aplicación</p>
            <p className="text-xs text-ivory-muted">
              Ábrela como app: pantalla completa y acceso rápido a tu proyecto.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="min-h-10 border border-gold/40 bg-elevated px-3 text-sm font-semibold text-ivory"
              onClick={async () => {
                trackEvent('InstallPromptViewed', {})
                await deferred.prompt()
                const choice = await deferred.userChoice
                if (choice.outcome === 'accepted') trackEvent('PWAInstalled', {})
                clearDeferredInstall()
                setDeferred(null)
              }}
            >
              Instalar
            </button>
            <button type="button" className="min-h-10 px-3 text-sm text-ivory-faint" onClick={dismiss}>
              Ahora no
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-gold/25 bg-wine/25 px-4 py-3 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ivory">Úsala como aplicación</p>
          <p className="text-xs text-ivory-muted">
            {ios
              ? 'En Safari: Compartir → Añadir a pantalla de inicio.'
              : 'Instálala para abrirla sin pestañas del navegador.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/entregavel/instalar"
            className="inline-flex min-h-10 items-center border border-gold/40 bg-elevated px-3 text-sm text-ivory no-underline"
            onClick={() => trackEvent('InstallPromptViewed', { source: 'guide' })}
          >
            Cómo instalar
          </Link>
          {ios ? (
            <button
              type="button"
              className="min-h-10 border border-white/15 px-3 text-sm text-ivory-muted"
              onClick={() => setShowIosHelp((v) => !v)}
            >
              {showIosHelp ? 'Ocultar' : 'Ver pasos'}
            </button>
          ) : null}
          <button type="button" className="min-h-10 px-3 text-sm text-ivory-faint" onClick={dismiss}>
            Cerrar
          </button>
        </div>
      </div>
      {showIosHelp ? (
        <ol className="mx-auto mt-3 max-w-3xl list-decimal space-y-1 pl-5 text-xs text-ivory-muted">
          <li>Abre esta página en Safari.</li>
          <li>Toca Compartir.</li>
          <li>Elige «Añadir a pantalla de inicio».</li>
        </ol>
      ) : null}
    </div>
  )
}
