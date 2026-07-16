type Props = {
  current: number
  total: number
  label?: string
}

export function ProgressBar({ current, total, label }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div
      className="w-full"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={label ?? `Pregunta ${current} de ${total}`}
    >
      <div className="mb-2 flex items-center justify-between text-sm text-ivory-muted">
        <span>{label ?? `Pregunta ${current} de ${total}`}</span>
        <span className="font-accent text-[0.65rem] tracking-[0.16em] text-gold uppercase">
          Autora Oculta
        </span>
      </div>
      <div className="h-[2px] w-full overflow-hidden bg-white/10" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-wine to-gold transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
