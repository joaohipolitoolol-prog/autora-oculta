import { useMemo, useState } from 'react'
import { ACT_LABELS, CHAPTERS } from '../data/chapters'
import { PROMPTS } from '../data/prompts'
import { useMember } from '../context/MemberContext'
import type { ChapterStatus } from '../lib/storage'
import { Accent, Card, ModuleDoneButton, PromptCard } from '../components/ui'

const STATUS_OPTS: { value: ChapterStatus; label: string }[] = [
  { value: 'todo', label: 'Pendiente' },
  { value: 'outline', label: 'Esquema' },
  { value: 'draft', label: 'Borrador' },
  { value: 'done', label: 'Listo' },
]

export function EstructuraPage() {
  const { chapters, setChapterStatus, setChapterNotes, stats, project } = useMember()
  const [filter, setFilter] = useState<'all' | ChapterStatus>('all')
  const outlinePrompt = PROMPTS.find((p) => p.id === 'outline-25')!
  const chapterPrompt = PROMPTS.find((p) => p.id === 'capitulo-n')!

  const filtered = useMemo(
    () => CHAPTERS.filter((c) => filter === 'all' || chapters[c.n]?.status === filter),
    [chapters, filter],
  )

  const byAct = useMemo(() => {
    const map = new Map<number, typeof CHAPTERS>()
    for (const c of filtered) {
      const list = map.get(c.act) ?? []
      list.push(c)
      map.set(c.act, list)
    }
    return map
  }, [filtered])

  return (
    <div>
      <Accent>Módulo 5</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Estructura de Historia Magnética</h1>
      <p className="mt-3 text-ivory-muted">
        Hasta 25 capítulos. Marca el estado de cada uno. {project.title ? `Proyecto: «${project.title}».` : ''}{' '}
        Listos: {stats.chaptersDone}/25.
      </p>

      <Card gold>
        <h3 className="font-display text-xl">Arco en 5 actos</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ivory-muted">
          <li>
            <strong className="text-ivory">Caps 1–5:</strong> Gancho, encuentro, reglas, primer roce,
            primera grieta
          </li>
          <li>
            <strong className="text-ivory">Caps 6–10:</strong> Convivencia forzada, secretos a medias,
            celos o rival
          </li>
          <li>
            <strong className="text-ivory">Caps 11–15:</strong> Punto medio: revelación que cambia el
            tablero
          </li>
          <li>
            <strong className="text-ivory">Caps 16–20:</strong> Escalada, traición aparente, costo
            emocional
          </li>
          <li>
            <strong className="text-ivory">Caps 21–25:</strong> Clímax, verdad, elección, epílogo /
            serie
          </li>
        </ol>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { value: 'all' as const, label: 'Todos' },
            ...STATUS_OPTS,
          ] as { value: 'all' | ChapterStatus; label: string }[]
        ).map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setFilter(o.value)}
            className={[
              'min-h-10 border px-3 text-sm',
              filter === o.value
                ? 'border-gold/40 bg-wine/30 text-ivory'
                : 'border-white/10 text-ivory-muted',
            ].join(' ')}
          >
            {o.label}
          </button>
        ))}
      </div>

      {[1, 2, 3, 4, 5].map((act) => {
        const list = byAct.get(act)
        if (!list?.length) return null
        return (
          <section key={act} className="mt-6">
            <h2 className="font-accent text-[0.7rem] tracking-widest text-gold uppercase">
              {ACT_LABELS[act]}
            </h2>
            <div className="mt-2 space-y-2">
              {list.map((c) => {
                const st = chapters[c.n] ?? { status: 'todo' as const, notes: '' }
                return (
                  <details
                    key={c.n}
                    className="border border-white/10 bg-elevated/80 open:border-gold/25"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3">
                      <span className="font-display w-8 text-gold-soft">{c.n}</span>
                      <span className="min-w-0 flex-1 text-sm text-ivory">{c.function}</span>
                      <select
                        className="min-h-9 border border-white/15 bg-bg px-2 text-xs text-ivory"
                        value={st.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setChapterStatus(c.n, e.target.value as ChapterStatus)
                        }
                      >
                        {STATUS_OPTS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </summary>
                    <div className="border-t border-white/10 px-3 py-3">
                      <p className="text-xs text-ivory-faint">
                        Cierre (cliff): <span className="text-ivory-muted">{c.cliff}</span>
                      </p>
                      <label className="mt-2 block text-xs text-ivory-faint">
                        Notas del capítulo
                        <textarea
                          className="mt-1 min-h-20 w-full border border-white/15 bg-bg px-2 py-2 text-sm text-ivory"
                          value={st.notes}
                          onChange={(e) => setChapterNotes(c.n, e.target.value)}
                          placeholder="Ideas, continuidad, lo que falta…"
                        />
                      </label>
                    </div>
                  </details>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="mt-6">
        <PromptCard title={outlinePrompt.title} body={outlinePrompt.body} />
        <PromptCard
          title={chapterPrompt.title}
          body={chapterPrompt.body}
          needsChapter
        />
      </div>

      <ModuleDoneButton moduleId="estructura" />
    </div>
  )
}
