import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Accent } from '../components/ui'
import { NAV_ITEMS } from '../data/nav'
import { PROMPTS } from '../data/prompts'
import { CHAPTERS } from '../data/chapters'
import { PLAN_7 } from '../data/plan7'

type Hit = { title: string; blurb: string; to: string; kind: string }

export function SearchPage() {
  const [q, setQ] = useState('')

  const hits = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 2) return [] as Hit[]

    const out: Hit[] = []

    for (const n of NAV_ITEMS) {
      if (`${n.label} ${n.short}`.toLowerCase().includes(query)) {
        out.push({ title: n.label, blurb: 'Módulo', to: n.path, kind: 'Módulo' })
      }
    }
    for (const p of PROMPTS) {
      if (`${p.title} ${p.body}`.toLowerCase().includes(query)) {
        out.push({
          title: p.title,
          blurb: p.category,
          to: '/entregavel/prompts',
          kind: 'Prompt',
        })
      }
    }
    for (const c of CHAPTERS) {
      if (`${c.function} ${c.cliff}`.toLowerCase().includes(query)) {
        out.push({
          title: `Capítulo ${c.n}`,
          blurb: c.function,
          to: '/entregavel/estructura',
          kind: 'Capítulo',
        })
      }
    }
    for (const d of PLAN_7) {
      if (`${d.objective} ${d.deliverable} ${d.tips.join(' ')}`.toLowerCase().includes(query)) {
        out.push({
          title: `Día ${d.day}: ${d.objective}`,
          blurb: d.deliverable,
          to: '/entregavel/plan7',
          kind: 'Plan 7',
        })
      }
    }
    return out.slice(0, 40)
  }, [q])

  return (
    <div>
      <Accent>Buscar</Accent>
      <h1 className="font-display mt-2 text-3xl">Buscar en el método</h1>
      <p className="mt-2 text-sm text-ivory-muted">Módulos, prompts, capítulos y plan de 7 días.</p>
      <input
        type="search"
        autoFocus
        placeholder="Ej. cliffhanger, seudónimo, día 3…"
        className="mt-4 min-h-12 w-full border border-white/15 bg-elevated px-3 text-ivory"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <ul className="mt-4 space-y-2">
        {hits.map((h, i) => (
          <li key={`${h.to}-${h.title}-${i}`}>
            <Link
              to={h.to}
              className="block border border-white/10 bg-elevated/70 px-3 py-3 no-underline hover:border-gold/30"
            >
              <span className="font-accent text-[0.6rem] tracking-widest text-gold uppercase">
                {h.kind}
              </span>
              <p className="font-display text-lg text-ivory">{h.title}</p>
              <p className="text-xs text-ivory-muted">{h.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
      {q.trim().length >= 2 && hits.length === 0 ? (
        <p className="mt-4 text-sm text-ivory-muted">Sin resultados. Prueba otra palabra.</p>
      ) : null}
    </div>
  )
}
