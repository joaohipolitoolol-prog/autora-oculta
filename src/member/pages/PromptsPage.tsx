import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PROMPTS, PROMPT_CATEGORIES } from '../data/prompts'
import { useMember } from '../context/MemberContext'
import { Accent, ModuleDoneButton, Notice, PromptCard } from '../components/ui'

export function PromptsPage() {
  const { project, stats } = useMember()
  const [cat, setCat] = useState<string>('all')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    return PROMPTS.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (!q.trim()) return true
      const hay = `${p.title} ${p.body}`.toLowerCase()
      return hay.includes(q.trim().toLowerCase())
    })
  }, [cat, q])

  return (
    <div>
      <Accent>Módulo 7</Accent>
      <h1 className="font-display mt-2 text-3xl sm:text-4xl">Biblioteca de prompts</h1>
      <p className="mt-3 text-ivory-muted">
        Copia, pega, genera, edita. Los campos se rellenan con tu proyecto
        {project.title ? ` («${project.title}»)` : ''}.
      </p>

      {stats.projectFill < 40 ? (
        <Notice>
          Completa al menos título, nombres y premisa para prompts personalizados.{' '}
          <Link to="/entregavel/proyecto" className="text-gold-soft">
            Ir a Tu proyecto →
          </Link>
        </Notice>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar prompt…"
          className="min-h-11 flex-1 border border-white/15 bg-elevated px-3 text-ivory"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPT_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={[
              'min-h-10 border px-3 text-sm',
              cat === c.id
                ? 'border-gold/40 bg-wine/30 text-ivory'
                : 'border-white/10 text-ivory-muted',
            ].join(' ')}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-ivory-faint">{list.length} prompts</p>

      <div className="mt-2">
        {list.map((p) => (
          <PromptCard key={p.id} title={p.title} body={p.body} needsChapter={p.needsChapter} />
        ))}
        {list.length === 0 ? (
          <p className="text-sm text-ivory-muted">Ningún prompt coincide con tu búsqueda.</p>
        ) : null}
      </div>

      <ModuleDoneButton moduleId="prompts" />
    </div>
  )
}
