type Props = {
  title: string
  items: string[]
  previews?: string[]
}

export function LockedContent({ title, items, previews = [] }: Props) {
  return (
    <section className="rounded-[2px] border border-gold/25 bg-elevated/90 p-5 md:p-6">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">Bloqueado</p>
      <h3 className="font-display mt-2 text-2xl text-ivory md:text-3xl">{title}</h3>

      {previews.length > 0 && (
        <ul className="mt-4 space-y-2 border-b border-white/10 pb-4" role="list">
          {previews.map((p) => (
            <li key={p} className="text-ivory-muted">
              {p}
            </li>
          ))}
        </ul>
      )}

      <ul className="mt-4 space-y-3" role="list">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-ivory-muted">
            <span className="mt-1 text-gold" aria-hidden="true">
              🔒
            </span>
            <span className="blur-[0.4px]">{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ivory-faint">Ver estructura completa — disponible al desbloquear.</p>
    </section>
  )
}
