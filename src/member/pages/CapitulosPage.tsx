import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Accent, Card, Field, ModuleDoneButton, Notice, PromptCard } from '../components/ui'
import { useAppStore } from '../store/appStore'
import type { ChapterStatus } from '../db/schema'
import { PROMPTS } from '../data/prompts'

const STATUS_LABEL: Record<ChapterStatus, string> = {
  idea: 'Idea',
  planned: 'Planificado',
  drafting: 'Borrador',
  reviewing: 'Revisión',
  completed: 'Completado',
}

export function CapitulosPage() {
  const chapters = useAppStore((s) => s.chapters)
  const project = useAppStore((s) => s.project)
  const updateChapter = useAppStore((s) => s.updateChapter)
  const setChapterStatus = useAppStore((s) => s.setChapterStatus)
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<'all' | ChapterStatus>('all')
  const [view, setView] = useState<'lista' | 'detalle'>('lista')

  const selectedN = Number(params.get('n') || 0)
  const selected = chapters.find((c) => c.number === selectedN) ?? chapters[0]

  const list = useMemo(
    () => chapters.filter((c) => filter === 'all' || c.status === filter),
    [chapters, filter],
  )

  const warnings = chapters.filter(
    (c) => (c.status === 'drafting' || c.status === 'planned') && (!c.conflict || !c.cliffhanger),
  )

  const chapterPrompt = PROMPTS.find((p) => p.id === 'capitulo-n')

  if (!project) {
    return (
      <div>
        <Accent>Capítulos</Accent>
        <h1 className="font-display mt-2 text-3xl">Capítulos</h1>
        <Notice>
          Primero crea o importa tu proyecto.{' '}
          <Link to="/entregavel/proyecto" className="text-gold-soft">
            Ir a Mi Proyecto →
          </Link>
        </Notice>
      </div>
    )
  }

  return (
    <div>
      <Accent>Escritura</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Capítulos</h1>
      <p className="mt-2 text-ivory-muted">
        Gestiona cada capítulo: objetivo, conflicto, gancho, texto pegado desde tu IA externa y
        revisión. Autora Oculta no genera el libro por ti.
      </p>

      {warnings.length > 0 ? (
        <Notice>
          {warnings.length} capítulo(s) sin conflicto o sin gancho. Completa eso antes de pedir
          prosa a la IA.
        </Notice>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className={`min-h-10 border px-3 text-sm ${view === 'lista' ? 'border-gold/40 bg-wine/30' : 'border-white/10'}`}
          onClick={() => setView('lista')}
        >
          Lista
        </button>
        <button
          type="button"
          className={`min-h-10 border px-3 text-sm ${view === 'detalle' ? 'border-gold/40 bg-wine/30' : 'border-white/10'}`}
          onClick={() => setView('detalle')}
        >
          Detalle
        </button>
        {(
          [
            ['all', 'Todos'],
            ['idea', 'Idea'],
            ['planned', 'Planificado'],
            ['drafting', 'Borrador'],
            ['reviewing', 'Revisión'],
            ['completed', 'Completado'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`min-h-10 border px-3 text-sm ${filter === id ? 'border-gold/40 text-ivory' : 'border-white/10 text-ivory-muted'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'lista' ? (
        <ul className="mt-4 space-y-2">
          {list.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="flex w-full min-h-14 items-center gap-3 border border-white/10 bg-elevated/70 px-3 text-left hover:border-gold/30"
                onClick={() => {
                  setParams({ n: String(c.number) })
                  setView('detalle')
                }}
              >
                <span className="font-display w-8 text-gold-soft">{c.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-ivory">
                    {c.title || c.objective || c.beatFunction || `Capítulo ${c.number}`}
                  </span>
                  <span className="text-xs text-ivory-faint">
                    {STATUS_LABEL[c.status as ChapterStatus]}
                  </span>
                </span>
                {!c.conflict || !c.cliffhanger ? (
                  <span className="text-xs text-gold">Pendiente</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : selected ? (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl">Capítulo {selected.number}</h2>
            <select
              className="min-h-11 border border-white/15 bg-bg px-2 text-sm text-ivory"
              value={selected.status}
              onChange={(e) =>
                void setChapterStatus(selected.id, e.target.value as ChapterStatus)
              }
            >
              {(Object.keys(STATUS_LABEL) as ChapterStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <Field
            id="ch_title"
            label="Título"
            value={selected.title}
            onChange={(v) => void updateChapter(selected.id, { title: v })}
          />
          <Field
            id="ch_obj"
            label="Objetivo de la escena"
            textarea
            value={selected.objective}
            onChange={(v) => void updateChapter(selected.id, { objective: v })}
          />
          <Field
            id="ch_conflict"
            label="Conflicto"
            textarea
            value={selected.conflict}
            onChange={(v) => void updateChapter(selected.id, { conflict: v })}
          />
          <Field
            id="ch_cliff"
            label="Gancho final"
            textarea
            value={selected.cliffhanger}
            onChange={(v) => void updateChapter(selected.id, { cliffhanger: v })}
          />
          <Field
            id="ch_emotion"
            label="Emoción dominante"
            value={selected.emotion}
            onChange={(v) => void updateChapter(selected.id, { emotion: v })}
          />
          <Field
            id="ch_draft"
            label="Texto pegado desde tu IA (ChatGPT / Claude / Gemini)"
            textarea
            value={selected.externalDraft}
            placeholder="Pega aquí el resultado. Luego revísalo con tu criterio."
            onChange={(v) => void updateChapter(selected.id, { externalDraft: v })}
          />
          <Field
            id="ch_rev"
            label="Notas de revisión"
            textarea
            value={selected.revisionNotes}
            onChange={(v) => void updateChapter(selected.id, { revisionNotes: v })}
          />
          {chapterPrompt ? (
            <div className="mt-4">
              <PromptCard
                title={`Prompt · Capítulo ${selected.number}`}
                body={chapterPrompt.body}
                needsChapter
              />
            </div>
          ) : null}
        </Card>
      ) : null}

      <ModuleDoneButton moduleId="capitulos" />
    </div>
  )
}
