import { Link } from 'react-router-dom'
import { Accent, Card } from '../components/ui'

function isIos() {
  return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function InstallPage() {
  const ios = isIos()

  return (
    <div>
      <Accent>App · PWA</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Instalar Autora Oculta</h1>
      <p className="mt-3 text-ivory-muted">
        Es una app web progresiva (PWA): se instala desde el navegador, sin tienda. Tus datos siguen
        en este dispositivo.
      </p>

      <Card gold>
        <h2 className="font-display text-xl">Por qué instalarla</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ivory-muted">
          <li>Icono en la pantalla de inicio / escritorio</li>
          <li>Pantalla completa, sin barra del navegador</li>
          <li>Abre más rápido y funciona sin Wi‑Fi (shell + tu progreso local)</li>
          <li>Menos distracciones: solo el método</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{ios ? 'iPhone / iPad (Safari)' : 'Android (Chrome)'}</h2>
        {ios ? (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ivory-muted">
            <li>Abre esta URL en <strong className="text-ivory">Safari</strong> (no en Instagram).</li>
            <li>Toca <strong className="text-ivory">Compartir</strong> (□↑).</li>
            <li>Elige <strong className="text-ivory">Añadir a pantalla de inicio</strong>.</li>
            <li>Confirma <strong className="text-ivory">Añadir</strong>.</li>
            <li>Abre el icono «Autora Oculta».</li>
          </ol>
        ) : (
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ivory-muted">
            <li>Si aparece el banner <strong className="text-ivory">Descargar app</strong>, tócalo.</li>
            <li>
              O menú ⋮ del navegador → <strong className="text-ivory">Instalar aplicación</strong> /
              Añadir a pantalla de inicio.
            </li>
            <li>Abre Autora Oculta desde el cajón de apps o el escritorio.</li>
          </ol>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-xl">Escritorio (Windows / Mac)</h2>
        <p className="mt-2 text-sm text-ivory-muted">
          En Chrome o Edge, mira el icono de instalar en la barra de direcciones, o menú → Instalar
          Autora Oculta.
        </p>
      </Card>

      <p className="mt-4 text-sm text-ivory-faint">
        Tip: exporta una copia de seguridad en{' '}
        <Link to="/entregavel/proyecto" className="text-gold-soft">
          Tu proyecto
        </Link>{' '}
        antes de cambiar de teléfono.
      </p>
    </div>
  )
}
