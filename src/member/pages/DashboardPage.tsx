import { Link } from 'react-router-dom'
import { Accent, Card, Notice } from '../components/ui'
import { useAppStore } from '../store/appStore'
import { projectIsEmpty } from '../lib/storage'

export function DashboardPage() {
  const project = useAppStore((s) => s.project)
  const stats = useAppStore((s) => s.stats())
  const next = useAppStore((s) => s.nextAction())
  const quizAvailable = useAppStore((s) => s.quizAvailable)
  const importQuiz = useAppStore((s) => s.importQuiz)
  const online = useAppStore((s) => s.online)
  const progress = useAppStore((s) => s.progress)
  const saveState = useAppStore((s) => s.saveState)

  const empty = !project || projectIsEmpty({
    title: project.title,
    pen: project.penName,
    female: project.femaleLead,
    male: project.maleLead,
    premise: project.premise,
    hook: project.hook,
    conflict: project.conflict,
    tags: project.tags,
    promise: project.emotionalPromise,
  })

  return (
    <div className="animate-[ao-step-in_0.35s_ease]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Accent>Inicio</Accent>
        <span className="text-xs text-ivory-faint" role="status">
          {saveState === 'saving'
            ? 'Guardando…'
            : saveState === 'saved'
              ? 'Guardado en este dispositivo'
              : online
                ? 'En este dispositivo'
                : 'Sin conexión · datos locales'}
        </span>
      </div>

      <h1 className="font-display mt-2 text-3xl text-balance sm:text-4xl">
        {project?.title ? `«${project.title}»` : 'Tu proyecto empieza aquí'}
      </h1>
      <p className="mt-2 text-ivory-muted">
        {project?.penName
          ? `Escribes como ${project.penName}. Tu proyecto está listo para ser desarrollado — el método organiza; la prosa la haces con IA externa.`
          : 'Crea y desarrolla tu historia digital bajo seudónimo. Una acción clara a la vez.'}
      </p>

      {empty && quizAvailable ? (
        <Card gold>
          <h2 className="font-display text-xl">Resultado del test detectado</h2>
          <p className="mt-2 text-sm text-ivory-muted">
            Hay un concepto generado en este navegador. Impórtalo para no empezar de cero.
          </p>
          <button
            type="button"
            className="mt-3 min-h-11 border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-4 font-semibold text-ivory"
            onClick={() => void importQuiz()}
          >
            Importar mi resultado
          </button>
        </Card>
      ) : null}

      {!online ? (
        <Notice>Sin conexión. Puedes seguir editando: todo se guarda en este dispositivo.</Notice>
      ) : null}

      <Card gold className="mt-6">
        <p className="font-accent text-[0.65rem] tracking-widest text-gold uppercase">
          Tu próxima acción
        </p>
        <h2 className="font-display mt-2 text-2xl text-ivory">{next.body}</h2>
        <p className="mt-2 text-xs text-ivory-faint">{next.minutes}</p>
        <Link
          to={empty ? '/entregavel/proyecto' : next.to}
          className="mt-4 inline-flex min-h-12 items-center border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-5 font-semibold tracking-wide text-ivory no-underline uppercase"
        >
          Continuar proyecto
        </Link>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Proyecto', value: `${stats.projectFill}%`, to: '/entregavel/proyecto' },
          {
            label: 'Capítulos',
            value: `${stats.chaptersDone}/${stats.chaptersTotal}`,
            to: '/entregavel/capitulos',
          },
          { label: 'Plan 7', value: `${stats.planDone}/7`, to: '/entregavel/progreso' },
          { label: 'General', value: `${stats.overall}%`, to: '/entregavel/progreso' },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="border border-white/10 bg-elevated/80 px-4 py-3 no-underline hover:border-gold/30"
          >
            <p className="text-xs text-ivory-faint">{s.label}</p>
            <p className="font-display mt-1 text-2xl text-gold-soft">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/entregavel/capitulos"
          className="inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-ivory-muted no-underline hover:text-ivory"
        >
          Capítulos
        </Link>
        <Link
          to="/entregavel/prompts"
          className="inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-ivory-muted no-underline hover:text-ivory"
        >
          Prompts
        </Link>
        <Link
          to="/entregavel/recursos"
          className="inline-flex min-h-11 items-center border border-white/15 px-4 text-sm text-ivory-muted no-underline hover:text-ivory"
        >
          Prompt maestro
        </Link>
        <Link
          to="/entregavel/instalar"
          className="inline-flex min-h-11 items-center border border-gold/30 px-4 text-sm text-gold-soft no-underline"
        >
          Instalar app
        </Link>
      </div>

      {project?.premise ? (
        <Card>
          <h3 className="font-display text-lg">Resumen</h3>
          <p className="mt-2 text-sm text-ivory-muted">{project.premise}</p>
          {project.tags ? (
            <p className="mt-3 text-xs text-gold-soft">{project.tags}</p>
          ) : null}
        </Card>
      ) : null}

      <Notice>
        <strong className="text-ivory">Ruta rápida:</strong> Proyecto → Personajes → Capítulos →
        Prompts. Última ruta:{' '}
        {progress?.lastRoute?.replace('/entregavel/', '') || 'inicio'}.
      </Notice>
    </div>
  )
}
