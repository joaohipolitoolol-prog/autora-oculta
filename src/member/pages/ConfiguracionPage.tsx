import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accent, Card, Notice } from '../components/ui'
import { useAppStore } from '../store/appStore'
import { APP_CONFIG } from '@/config'

export function ConfiguracionPage() {
  const preferences = useAppStore((s) => s.preferences)
  const setPreferences = useAppStore((s) => s.setPreferences)
  const exportBackup = useAppStore((s) => s.exportBackup)
  const importBackup = useAppStore((s) => s.importBackup)
  const wipeAll = useAppStore((s) => s.wipeAll)
  const saveState = useAppStore((s) => s.saveState)
  const online = useAppStore((s) => s.online)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <Accent>Cuenta</Accent>
      <h1 className="font-display mt-2 text-3xl">Configuración</h1>
      <p className="mt-2 text-ivory-muted">
        Datos en este dispositivo. No hay cuenta en la nube en esta versión.
      </p>

      <Card>
        <h2 className="font-display text-xl">Estado</h2>
        <ul className="mt-3 space-y-1 text-sm text-ivory-muted">
          <li>{online ? 'En línea' : 'Sin conexión'} — el trabajo sigue guardado aquí</li>
          <li>
            Autoguardado:{' '}
            {saveState === 'saving' ? 'guardando…' : saveState === 'saved' ? 'al día' : 'listo'}
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-xl">Instalación (PWA)</h2>
        <p className="mt-2 text-sm text-ivory-muted">
          Puedes volver a ver el aviso de instalación si lo cerraste antes.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/entregavel/instalar"
            className="inline-flex min-h-11 items-center border border-gold/40 px-4 text-sm text-ivory no-underline"
          >
            Cómo instalar
          </Link>
          <button
            type="button"
            className="min-h-11 border border-white/15 px-4 text-sm text-ivory-muted"
            onClick={() => {
              void setPreferences({ installDismissed: false })
              try {
                localStorage.removeItem('ao_pwa_dismiss')
              } catch {
                /* ignore */
              }
              setMsg('Aviso de instalación reactivado.')
            }}
          >
            Reactivar aviso
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl">Copia de seguridad</h2>
        <p className="mt-2 text-sm text-ivory-muted">
          Exporta JSON completo (proyecto, capítulos, personajes, progreso). Úsalo al cambiar de
          teléfono.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-11 border border-gold/40 px-4 text-sm text-ivory"
            onClick={async () => {
              const data = await exportBackup()
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `autora-oculta-backup-${new Date().toISOString().slice(0, 10)}.json`
              a.click()
              URL.revokeObjectURL(url)
              setMsg('Copia descargada.')
            }}
          >
            Descargar copia (.json)
          </button>
          <button
            type="button"
            className="min-h-11 border border-white/15 px-4 text-sm"
            onClick={() => fileRef.current?.click()}
          >
            Restaurar copia
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              try {
                const text = await file.text()
                const parsed = JSON.parse(text) as unknown
                await importBackup(parsed)
                setMsg('Copia restaurada en este dispositivo.')
              } catch {
                setMsg('Archivo inválido o corrupto.')
              }
              e.target.value = ''
            }}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl">Tema</h2>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            className={`min-h-11 border px-4 text-sm ${preferences?.theme === 'dark' ? 'border-gold/40' : 'border-white/15'}`}
            onClick={() => void setPreferences({ theme: 'dark' })}
          >
            Oscuro (predeterminado)
          </button>
          <button
            type="button"
            className={`min-h-11 border px-4 text-sm ${preferences?.theme === 'lectura' ? 'border-gold/40' : 'border-white/15'}`}
            onClick={() => void setPreferences({ theme: 'lectura' })}
          >
            Lectura clara
          </button>
        </div>
        <p className="mt-2 text-xs text-ivory-faint">
          Lectura clara suaviza el fondo para sesiones largas (clase en el shell).
        </p>
      </Card>

      <Card>
        <h2 className="font-display text-xl">Zona de peligro</h2>
        <p className="mt-2 text-sm text-ivory-muted">
          Borra todos los datos locales de Autora Oculta en este navegador. Irreversible sin copia.
        </p>
        <button
          type="button"
          className="mt-3 min-h-11 border border-red-900/60 px-4 text-sm text-red-200"
          onClick={async () => {
            if (
              confirm(
                '¿Borrar TODOS los datos locales de Autora Oculta en este dispositivo? Esta acción no se puede deshacer.',
              )
            ) {
              await wipeAll()
              setMsg('Datos locales eliminados.')
              window.location.href = '/entregavel'
            }
          }}
        >
          Borrar todos los datos locales
        </button>
      </Card>

      {msg ? <p className="text-sm text-gold-soft">{msg}</p> : null}

      <Notice>
        Contacto del producto: {APP_CONFIG.CONTACT_EMAIL}. No enviamos el contenido de tu historia a
        analytics.
      </Notice>
    </div>
  )
}
