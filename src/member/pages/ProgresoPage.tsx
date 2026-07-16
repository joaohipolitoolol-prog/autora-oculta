import { Link } from 'react-router-dom'
import { Accent, Card, Notice } from '../components/ui'
import { useAppStore } from '../store/appStore'
import { PLAN_7 } from '../data/plan7'

const MILESTONES = [
  { id: 'proyecto_creado', label: 'Proyecto creado' },
  { id: 'universo', label: 'Universo definido' },
  { id: 'protagonistas', label: 'Protagonistas completos' },
  { id: 'conflicto', label: 'Conflicto definido' },
  { id: 'estructura', label: 'Estructura lista' },
  { id: 'primer_cap', label: 'Primer capítulo' },
  { id: 'mitad', label: 'Mitad de la historia' },
  { id: 'borrador', label: 'Borrador completo' },
  { id: 'revision', label: 'Revisión completa' },
  { id: 'publicar', label: 'Preparado para publicar' },
]

export function ProgresoPage() {
  const stats = useAppStore((s) => s.stats())
  const world = useAppStore((s) => s.world)
  const progress = useAppStore((s) => s.progress)
  const chapters = useAppStore((s) => s.chapters)
  const togglePlanDay = useAppStore((s) => s.togglePlanDay)
  const next = useAppStore((s) => s.nextAction())
  const project = useAppStore((s) => s.project)

  const half = Math.ceil(chapters.length / 2)
  const autoMilestones: Record<string, boolean> = {
    proyecto_creado: Boolean(project?.title),
    universo: Boolean(world?.where),
    protagonistas: Boolean(project?.femaleLead && project?.maleLead),
    conflicto: Boolean(project?.conflict),
    estructura: chapters.some((c) => c.status !== 'idea'),
    primer_cap: chapters.some((c) => c.externalDraft || c.status === 'completed'),
    mitad: chapters.filter((c) => c.status === 'completed').length >= half,
    borrador: chapters.filter((c) => c.status === 'completed').length >= chapters.length * 0.8,
    revision:
      chapters.filter((c) => c.status === 'reviewing' || c.status === 'completed').length >
      chapters.length / 2,
    publicar: Object.values(progress?.checklist ?? {}).filter(Boolean).length >= 4,
  }

  return (
    <div>
      <Accent>Seguimiento</Accent>
      <h1 className="font-display mt-2 text-3xl">Progreso</h1>
      <p className="mt-2 text-ivory-muted">
        Tu avance real en el proyecto. Sin juegos infantiles: solo claridad.
      </p>

      <Card gold>
        <p className="font-display text-4xl text-gold-soft">{stats.overall}%</p>
        <p className="mt-1 text-sm text-ivory-muted">Progreso general estimado</p>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={stats.overall}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-burgundy to-gold"
            style={{ width: `${stats.overall}%` }}
          />
        </div>
        <ul className="mt-4 grid gap-2 text-sm text-ivory-muted sm:grid-cols-2">
          <li>Proyecto: {stats.projectFill}%</li>
          <li>
            Capítulos: {stats.chaptersDone}/{stats.chaptersTotal}
          </li>
          <li>Etapas marcadas: {stats.stagesDone}</li>
          <li>Plan 7 días: {stats.planDone}/7</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-xl">{next.title}</h2>
        <p className="mt-2 text-sm text-ivory-muted">{next.body}</p>
        <p className="mt-1 text-xs text-ivory-faint">{next.minutes}</p>
        <Link
          to={next.to}
          className="mt-4 inline-flex min-h-11 items-center border border-gold/45 bg-gradient-to-br from-burgundy via-wine to-[#3d1020] px-4 font-semibold text-ivory no-underline"
        >
          Continuar proyecto
        </Link>
      </Card>

      <h2 className="font-display mt-8 text-2xl">Marcos</h2>
      <ul className="mt-3 space-y-2">
        {MILESTONES.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 border border-white/10 px-3 py-2 text-sm"
          >
            <span className={autoMilestones[m.id] ? 'text-gold-soft' : 'text-ivory-faint'}>
              {autoMilestones[m.id] ? '✓' : '○'}
            </span>
            <span className={autoMilestones[m.id] ? 'text-ivory' : 'text-ivory-muted'}>
              {m.label}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-8 text-2xl">Plan 7 días</h2>
      <Notice>Marca cada día al terminarlo. Es una guía de ritmo, no una obligación.</Notice>
      <div className="mt-3 space-y-2">
        {PLAN_7.map((d) => {
          const checked = Boolean(progress?.plan7?.[String(d.day)])
          return (
            <label
              key={d.day}
              className="flex min-h-12 cursor-pointer items-start gap-3 border border-white/10 px-3 py-3"
            >
              <input
                type="checkbox"
                className="mt-1 size-5 accent-gold"
                checked={checked}
                onChange={() => void togglePlanDay(d.day)}
              />
              <span>
                <span className="font-accent text-[0.65rem] tracking-widest text-gold uppercase">
                  Día {d.day}
                </span>
                <span className="block text-ivory">{d.objective}</span>
                <span className="text-xs text-ivory-faint">{d.deliverable}</span>
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
