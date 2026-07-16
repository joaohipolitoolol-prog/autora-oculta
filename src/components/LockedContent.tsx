import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Chapter = {
  title: string
  teaser: string
}

type Props = {
  openChapters: Chapter[]
  femaleName?: string
  maleName?: string
  ctaId?: string
}

/** Prévia de 3 capítulos + resto bloqueado. Preço logo em seguida (OfferBox). */
export function LockedContent({
  openChapters,
  femaleName = 'la protagonista',
  maleName = 'él',
  ctaId = 'locked_structure',
}: Props) {
  return (
    <section className="rounded-[2px] border border-gold/30 bg-elevated/90 p-5 md:p-7">
      <p className="font-accent text-[0.68rem] tracking-[0.18em] text-gold uppercase">
        Vista previa del método
      </p>
      <h3 className="font-display mt-2 text-3xl text-ivory md:text-4xl">
        Tres capítulos revelados. El resto espera adentro.
      </h3>
      <p className="mt-3 text-base text-ivory-muted">
        Esto es la dirección de tu proyecto — no el libro terminado.
      </p>

      <div className="mt-8">
        <h4 className="font-accent text-[0.68rem] tracking-[0.16em] text-gold uppercase">
          Estructura (vista previa)
        </h4>
        <div className="mt-3 space-y-3">
          {openChapters.map((ch) => (
            <article key={ch.title} className="border border-white/12 bg-bg/40 px-4 py-3 text-left">
              <p className="font-display text-xl text-ivory">{ch.title}</p>
              <p className="mt-1 text-base text-ivory-muted">{ch.teaser}</p>
            </article>
          ))}
        </div>
        <div className="relative mt-3 overflow-hidden border border-gold/20 bg-bg/60 px-4 py-6 text-center">
          <div className="select-none blur-[5px]" aria-hidden="true">
            <p className="font-display text-lg text-ivory">Capítulo 4: Las reglas de {maleName}</p>
            <p className="mt-2 font-display text-lg text-ivory">
              Capítulo 5: Lo que {femaleName} no debía encontrar
            </p>
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/75">
            <p className="font-accent text-[0.65rem] tracking-[0.14em] text-gold uppercase">
              Capítulos 4 a 25 bloqueados
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="font-accent text-[0.68rem] tracking-[0.16em] text-gold uppercase">
          También bloqueado
        </h4>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2" role="list">
          {[
            'Fichas profundas de personajes',
            'Más de 40 prompts conectados',
            'Plan de publicación',
            'Guía de sinopsis comercial',
          ].map((item) => (
            <li
              key={item}
              className="border border-gold/20 bg-wine/10 px-3 py-2.5 text-left text-sm text-ivory-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          DESBLOQUEAR MI PROYECTO POR {APP_CONFIG.PRICE_CURRENT}
        </CTAButton>
      </div>
    </section>
  )
}
