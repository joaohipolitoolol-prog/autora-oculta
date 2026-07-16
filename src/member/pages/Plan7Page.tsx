import { Link } from 'react-router-dom'
import { PLAN_7 } from '../data/plan7'
import { useMember } from '../context/MemberContext'
import { Accent, Card, ModuleDoneButton } from '../components/ui'

export function Plan7Page() {
  const { plan7, togglePlanDay, stats } = useMember()
  const done = stats.planDone

  return (
    <div>
      <Accent>Módulo 13</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Plan práctico de 7 días</h1>
      <p className="mt-3 text-ivory-muted">
        Marca cada día al terminarlo. Progreso: {done}/7.
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-burgundy to-gold transition-all"
          style={{ width: `${(done / 7) * 100}%` }}
        />
      </div>

      <div className="mt-6 space-y-3">
        {PLAN_7.map((d) => {
          const checked = Boolean(plan7[d.day])
          return (
            <div
              key={d.day}
              className={[
                'border p-4 transition',
                checked ? 'border-gold/35 bg-wine/20' : 'border-white/10 bg-elevated/80',
              ].join(' ')}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 size-5 accent-gold"
                    checked={checked}
                    onChange={() => togglePlanDay(d.day)}
                  />
                  <span>
                    <span className="font-accent text-[0.65rem] tracking-widest text-gold uppercase">
                      Día {d.day}
                    </span>
                    <h3
                      className={[
                        'font-display text-xl',
                        checked ? 'text-gold-soft line-through' : 'text-ivory',
                      ].join(' ')}
                    >
                      {d.objective}
                    </h3>
                    <p className="mt-1 text-sm text-ivory-muted">Entregable: {d.deliverable}</p>
                  </span>
                </label>
                <Link
                  to={d.linkTo}
                  className="min-h-10 border border-white/15 px-3 py-2 text-sm text-gold-soft no-underline hover:border-gold/30"
                >
                  Abrir
                </Link>
              </div>
              <ul className="mt-3 list-disc space-y-1 pl-8 text-xs text-ivory-faint">
                {d.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <Card gold className="mt-6">
        <h3 className="font-display text-xl">Si solo tienes 30 minutos al día</h3>
        <p className="mt-2 text-sm text-ivory-muted">
          Haz un capítulo corto (400–600 palabras) o solo el outline de 3 capítulos. La constancia
          gana a la perfección.
        </p>
      </Card>

      <p className="mt-4 text-sm text-ivory-muted">
        Cuando termines el día 7, vuelve a{' '}
        <Link to="/entregavel/publicar" className="text-gold-soft">
          Publicar
        </Link>{' '}
        y{' '}
        <Link to="/entregavel/anuncios" className="text-gold-soft">
          Anuncios
        </Link>
        .
      </p>

      <ModuleDoneButton moduleId="plan7" />
    </div>
  )
}
