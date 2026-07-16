type Props = {
  title: string
  penName: string
  tags: string[]
  impactLine?: string
}

export function StoryCover({ title, penName, tags, impactLine }: Props) {
  return (
    <div className="relative overflow-hidden rounded-[2px] border border-gold/35 bg-gradient-to-br from-[#2a1018] via-[#120b10] to-[#0a0608] px-6 py-10 text-center md:px-10 md:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 15%, rgba(184,151,90,0.28), transparent 42%), radial-gradient(circle at 20% 85%, rgba(92,26,46,0.45), transparent 48%)',
        }}
      />
      <p className="font-accent relative text-[0.68rem] tracking-[0.22em] text-gold uppercase">
        Tu proyecto inicial
      </p>
      <h2 className="font-display relative mt-5 text-4xl leading-[1.1] text-balance text-ivory italic md:text-5xl lg:text-6xl">
        {title}
      </h2>
      <p className="font-accent relative mt-5 text-[0.85rem] tracking-[0.14em] text-gold-soft uppercase">
        Por {penName}
      </p>
      {impactLine ? (
        <p className="font-display relative mx-auto mt-8 max-w-xl text-2xl leading-snug text-ivory-muted italic md:text-3xl">
          {impactLine}
        </p>
      ) : null}
      <div className="relative mt-8 flex flex-wrap justify-center gap-2">
        {tags.slice(0, 4).map((t) => (
          <span key={t} className="border border-gold/30 px-3 py-1.5 text-sm text-gold-soft">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
