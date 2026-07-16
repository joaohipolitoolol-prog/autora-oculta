type Props = {
  title: string
  penName: string
  tags: string[]
}

export function StoryCover({ title, penName, tags }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[2px] border border-gold/30 bg-gradient-to-br from-[#2a1018] via-[#120b10] to-[#0a0608] p-6 shadow-[0_0_60px_rgba(92,26,46,0.25)]">
      <div className="pointer-events-none absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(184,151,90,0.25), transparent 40%), radial-gradient(circle at 20% 80%, rgba(92,26,46,0.4), transparent 45%)',
      }} />
      <p className="font-accent relative text-[0.62rem] tracking-[0.2em] text-gold uppercase">Proyecto inicial</p>
      <h2 className="font-display relative mt-3 text-3xl leading-tight text-ivory italic md:text-4xl">{title}</h2>
      <p className="relative mt-3 text-ivory-muted">por {penName}</p>
      <div className="relative mt-5 flex flex-wrap gap-2">
        {tags.slice(0, 4).map((t) => (
          <span key={t} className="border border-gold/25 px-2 py-1 text-xs text-gold-soft">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
