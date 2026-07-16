import { useEffect, useState } from 'react'
import { useMember } from '../context/MemberContext'

export function StatusChip() {
  const { online, saving, saveFlash, stats } = useMember()

  return (
    <div className="flex flex-wrap items-center gap-2 text-[0.65rem] text-ivory-faint">
      <span
        className={[
          'inline-flex items-center gap-1.5 border px-2 py-1',
          online ? 'border-white/10' : 'border-gold/40 text-gold-soft',
        ].join(' ')}
      >
        <span
          className={['size-1.5 rounded-full', online ? 'bg-emerald-500/80' : 'bg-gold'].join(' ')}
          aria-hidden
        />
        {online ? 'En línea' : 'Sin conexión · tus datos siguen aquí'}
      </span>
      <span className="border border-white/10 px-2 py-1" role="status" aria-live="polite">
        {saving ? 'Guardando…' : saveFlash || `Progreso ${stats.overall}%`}
      </span>
    </div>
  )
}

export function UpdateToast() {
  const [ready, setReady] = useState(false)
  const [updateFn, setUpdateFn] = useState<((reload?: boolean) => Promise<void>) | null>(null)

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ update?: (reload?: boolean) => Promise<void> }>).detail
      if (detail?.update) setUpdateFn(() => detail.update!)
      setReady(true)
    }
    window.addEventListener('ao-sw-update', onUpdate)
    return () => window.removeEventListener('ao-sw-update', onUpdate)
  }, [])

  if (!ready) return null

  return (
    <div className="fixed right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 max-w-xs border border-gold/40 bg-elevated p-3 shadow-xl lg:bottom-4">
      <p className="text-sm text-ivory">Hay una versión nueva del método.</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="min-h-9 flex-1 border border-gold/40 bg-wine/40 px-2 text-xs font-semibold text-ivory"
          onClick={() => {
            if (updateFn) void updateFn(true)
            else window.location.reload()
          }}
        >
          Actualizar
        </button>
        <button
          type="button"
          className="min-h-9 px-2 text-xs text-ivory-faint"
          onClick={() => setReady(false)}
        >
          Luego
        </button>
      </div>
    </div>
  )
}
