import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Chapter = {
  title: string
  teaser: string
}

type Props = {
  openChapters: Chapter[]
  lockedCount?: number
  ctaId?: string
}

/** Documento parcial: 3 capítulos abiertos + resto bloqueado */
export function LockedContent({
  openChapters,
  lockedCount = 22,
  ctaId = 'locked_structure',
}: Props) {
  return (
    <section className="rounded-[2px] border border-gold/30 bg-elevated/90 p-5 md:p-7">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">
        Vista previa del documento
      </p>
      <h3 className="font-display mt-2 text-3xl text-ivory md:text-4xl">Estructura de capítulos</h3>
      <p className="mt-3 text-base text-ivory-muted">
        Tu historia no está terminada. Está lista para ser desarrollada.
      </p>

      <div className="mt-6 space-y-4" role="list">
        {openChapters.map((ch) => (
          <article
            key={ch.title}
            className="border border-white/12 bg-bg/40 px-4 py-4 text-left"
            role="listitem"
          >
            <h4 className="font-display text-xl text-ivory">{ch.title}</h4>
            <p className="mt-2 text-base leading-relaxed text-ivory-muted">{ch.teaser}</p>
          </article>
        ))}
      </div>

      <div className="relative mt-4 overflow-hidden border border-gold/20 bg-bg/60 px-4 py-8 text-center">
        <div className="select-none blur-[5px]" aria-hidden="true">
          <p className="font-display text-xl text-ivory">Capítulo 4: La deuda vuelve a hablar</p>
          <p className="mt-2 text-ivory-muted">Una cláusula olvidada cambia el equilibrio entre ellos…</p>
          <p className="mt-4 font-display text-xl text-ivory">Capítulo 5: Lo que ella no debía encontrar</p>
          <p className="mt-2 text-ivory-muted">El secreto deja de ser un rumor y se convierte en prueba.</p>
        </div>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-bg/40 via-bg/75 to-bg/90">
          <p className="font-accent text-[0.65rem] tracking-[0.16em] text-gold uppercase">
            Capítulos 4 a {3 + lockedCount} bloqueados
          </p>
          <p className="mt-2 max-w-xs text-base text-ivory-muted">
            Perfiles, evolución del romance, clímax, prompts y plan de publicación
          </p>
        </div>
      </div>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          Desbloquear la estructura completa · {APP_CONFIG.PRICE_CURRENT}
        </CTAButton>
      </div>
    </section>
  )
}
