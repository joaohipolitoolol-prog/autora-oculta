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
          <li key={item} className="relative overflow-hidden rounded-[2px] border border-white/5">
            <div
              className="select-none px-3 py-2 text-ivory-muted blur-[6px]"
              aria-hidden="true"
            >
              {item}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/55">
              <span className="font-accent text-[0.62rem] tracking-[0.14em] text-gold uppercase">
                Desbloquear
              </span>
            </div>
            <span className="sr-only">{item} — disponible al desbloquear</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ivory-faint">
        Estructura completa disponible al desbloquear el método.
      </p>
    </section>
  )
}
