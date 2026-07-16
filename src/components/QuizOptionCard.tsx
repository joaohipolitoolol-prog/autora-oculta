type Props = {
  title: string
  description: string
  selected?: boolean
  onSelect: () => void
}

const ICONS: Record<string, string> = {
  default: '◆',
}

export function QuizOptionCard({ title, description, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full rounded-[2px] border px-4 py-4 text-left transition ${
        selected
          ? 'border-gold/55 bg-wine/25 shadow-[0_0_0_1px_rgba(184,151,90,0.25)]'
          : 'border-white/10 bg-elevated/80 hover:border-gold/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 text-gold" aria-hidden="true">
          {ICONS.default}
        </span>
        <span>
          <span className="font-display block text-xl text-ivory">{title}</span>
          <span className="mt-1 block text-[0.98rem] leading-snug text-ivory-muted">{description}</span>
        </span>
      </div>
    </button>
  )
}
