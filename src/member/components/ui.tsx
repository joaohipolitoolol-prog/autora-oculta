import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { applyPlaceholders } from '../lib/placeholders'
import { useMember } from '../context/MemberContext'
import { CHAPTERS } from '../data/chapters'
import { NAV_ITEMS } from '../data/nav'

export function Accent({ children }: { children: ReactNode }) {
  return (
    <p className="font-accent text-[0.68rem] tracking-[0.16em] text-gold uppercase">{children}</p>
  )
}

export function Card({
  children,
  gold,
  className = '',
}: {
  children: ReactNode
  gold?: boolean
  className?: string
}) {
  return (
    <div
      className={[
        'my-4 border p-4',
        gold ? 'border-gold/35 bg-wine/20' : 'border-white/10 bg-elevated/80',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 border-l-[3px] border-gold bg-elevated/70 py-3 pr-3 pl-4 text-sm text-ivory-muted">
      {children}
    </div>
  )
}

export function ModuleDoneButton({ moduleId }: { moduleId: string }) {
  const { progress, toggleModuleDone, nextModulePath } = useMember()
  const done = progress.completedModules.includes(moduleId)
  const next = NAV_ITEMS.find((n) => n.path === nextModulePath)

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => toggleModuleDone(moduleId)}
        className={[
          'inline-flex min-h-11 items-center gap-2 border px-4 text-sm',
          done
            ? 'border-gold/40 bg-wine/30 text-gold-soft'
            : 'border-white/15 text-ivory-muted hover:border-gold/30 hover:text-ivory',
        ].join(' ')}
      >
        <span aria-hidden>{done ? '✓' : '○'}</span>
        {done ? 'Módulo marcado como hecho' : 'Marcar módulo como hecho'}
      </button>
      {done && next ? (
        <Link to={next.path} className="text-sm text-gold-soft no-underline hover:text-ivory">
          Siguiente: {next.short} →
        </Link>
      ) : null}
    </div>
  )
}

export function PromptCard({
  title,
  body,
  needsChapter,
}: {
  title: string
  body: string
  needsChapter?: boolean
}) {
  const { project, stats } = useMember()
  const [chapterN, setChapterN] = useState(3)
  const [copied, setCopied] = useState(false)
  const beat = CHAPTERS.find((c) => c.n === chapterN)
  const weak = stats.projectFill < 40

  const resolved = applyPlaceholders(body, project, {
    N: String(chapterN),
    FUNCION_CAPITULO: beat?.function ?? 'primer roce peligroso + cliffhanger',
    CLIFF: beat?.cliff ?? 'cliffhanger',
  })

  return (
    <div className="my-3 border border-white/10 bg-[#0d080b] p-4">
      <p className="font-accent text-[0.62rem] tracking-[0.14em] text-gold uppercase">{title}</p>
      {weak ? (
        <p className="mt-2 border border-gold/25 bg-wine/20 px-3 py-2 text-xs text-ivory-muted">
          Tu proyecto está incompleto ({stats.projectFill}%). Los prompts usarán placeholders
          genéricos.{' '}
          <Link to="/entregavel/proyecto" className="text-gold-soft">
            Completar proyecto →
          </Link>
        </p>
      ) : null}
      {needsChapter ? (
        <label className="mt-3 block text-sm text-ivory-muted">
          Número de capítulo
          <select
            className="mt-1 min-h-11 w-full border border-white/15 bg-elevated px-3 text-ivory"
            value={chapterN}
            onChange={(e) => setChapterN(Number(e.target.value))}
          >
            {CHAPTERS.map((c) => (
              <option key={c.n} value={c.n}>
                Cap {c.n} — {c.function}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <pre className="mt-3 whitespace-pre-wrap font-body text-sm leading-relaxed text-ivory-muted">
        {resolved}
      </pre>
      <button
        type="button"
        className="mt-3 min-h-10 border border-gold/40 px-3 text-sm text-ivory hover:bg-wine/35"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(resolved)
            setCopied(true)
            setTimeout(() => setCopied(false), 1600)
          } catch {
            setCopied(false)
            alert('No se pudo copiar. Selecciona el texto manualmente.')
          }
        }}
      >
        <span role="status" aria-live="polite">
          {copied ? 'Copiado' : 'Copiar prompt'}
        </span>
      </button>
    </div>
  )
}

export function Field({
  label,
  id,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  const cls =
    'mt-1 w-full min-h-11 border border-white/15 bg-elevated px-3 py-2 text-base text-ivory placeholder:text-ivory-faint'
  return (
    <label className="mt-3 block text-sm text-ivory-muted" htmlFor={id}>
      {label}
      {textarea ? (
        <textarea
          id={id}
          className={`${cls} min-h-[110px] resize-y`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className={cls}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}
