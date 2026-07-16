import { useMemo, useState } from 'react'
import { Accent, Card } from '../components/ui'
import { APP_CONFIG } from '@/config'

const HELP = [
  {
    id: 'primeros',
    title: 'Primeros pasos',
    body: 'Importa el resultado del test (mismo navegador) o crea el proyecto a mano. Completa título, seudónimo y protagonistas. Luego abre «Tu próxima acción» en Inicio.',
  },
  {
    id: 'prompts',
    title: 'Cómo usar prompts',
    body: 'Copia un prompt personalizado, pégalo en ChatGPT, Claude o Gemini, genera una escena o bloque, y pega el resultado en Capítulos o en el campo de respuesta del módulo. Siempre edita: la IA externa no sustituye tu criterio.',
  },
  {
    id: 'continuidad',
    title: 'Cómo mantener continuidad',
    body: 'Usa el Prompt Maestro del proyecto al iniciar una conversación nueva. Resume capítulos previos en notas. No pidas «escribe el libro entero».',
  },
  {
    id: 'offline',
    title: 'Modo sin conexión',
    body: 'Tus datos viven en este dispositivo (IndexedDB). La app cachea la interfaz. Las fuentes o recursos externos pueden faltar offline; el proyecto sigue editable.',
  },
  {
    id: 'backup',
    title: 'Exportar y no perder trabajo',
    body: 'Configuración → Descargar copia (.json). Guárdala fuera del navegador antes de borrar datos o cambiar de teléfono.',
  },
  {
    id: 'instalar',
    title: 'Instalar la aplicación',
    body: 'Android/Chrome: Instalar aplicación. iPhone: Safari → Compartir → Añadir a pantalla de inicio. Guía completa en Instalar.',
  },
  {
    id: 'privacidad',
    title: 'Seudónimo y privacidad',
    body: 'Un seudónimo editorial no es anonimato jurídico o fiscal. No publiques datos personales. Revisa las leyes de tu país para publicar y cobrar.',
  },
  {
    id: 'ia',
    title: 'Límites de esta versión',
    body: 'Autora Oculta no incluye IA interna. No genera novelas automáticamente. Te organiza el método y los prompts para herramientas externas.',
  },
]

export function AyudaPage() {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return HELP
    return HELP.filter((h) => `${h.title} ${h.body}`.toLowerCase().includes(query))
  }, [q])

  return (
    <div>
      <Accent>Soporte</Accent>
      <h1 className="font-display mt-2 text-3xl">Ayuda</h1>
      <input
        type="search"
        className="mt-4 min-h-12 w-full border border-white/15 bg-elevated px-3 text-ivory"
        placeholder="Buscar en ayuda…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="mt-4 space-y-3">
        {list.map((h) => (
          <Card key={h.id}>
            <h2 className="font-display text-xl">{h.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ivory-muted">{h.body}</p>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-sm text-ivory-faint">
        Contacto: <a href={`mailto:${APP_CONFIG.CONTACT_EMAIL}`}>{APP_CONFIG.CONTACT_EMAIL}</a>
      </p>
    </div>
  )
}
