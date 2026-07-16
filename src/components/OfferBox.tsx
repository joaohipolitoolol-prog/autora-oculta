import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  title?: string
  ctaLabel?: string
  ctaId?: string
  /** Solo el primer OfferBox de la página debe anclar #oferta */
  anchor?: boolean
}

export function OfferBox({
  title = 'Desbloquea el método para desarrollar tu historia',
  ctaLabel = 'Desbloquear ahora',
  ctaId = 'offer',
  anchor = false,
}: Props) {
  return (
    <div
      id={anchor ? 'oferta' : undefined}
      className="rounded-[2px] border border-gold/35 bg-gradient-to-b from-wine/30 to-bg p-6 text-center shadow-[0_0_60px_rgba(92,26,46,0.25)] md:p-8"
    >
      <p className="font-accent text-[0.68rem] tracking-[0.2em] text-gold uppercase">
        Acceso completo · {APP_CONFIG.PRICE_CURRENT}
      </p>
      <h3 className="font-display mt-3 text-3xl text-ivory md:text-4xl">{title}</h3>
      <p className="mx-auto mt-4 max-w-lg text-ivory-muted">
        Ya tienes el concepto. Ahora recibes la estructura, los prompts y el plan para convertirlo en un proyecto que puedas publicar — usando ChatGPT u otra IA.
      </p>

      <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-ivory-muted" role="list">
        {[
          'Estructura de capítulos + evolución del romance',
          'Prompts listos para desarrollar cada etapa',
          'Sinopsis, descripción de venta y seudónimo',
          'Guía de publicación y plan de 7 días',
        ].map((item) => (
          <li key={item} className="flex gap-2 border border-white/10 bg-elevated/50 px-3 py-2">
            <span className="text-gold" aria-hidden="true">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-ivory-faint">
        Precio normal <s>{APP_CONFIG.PRICE_REFERENCE}</s>
      </p>
      <p className="font-display text-5xl text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</p>
      <p className="mt-1 text-sm text-ivory-faint">Un solo pago · acceso inmediato</p>

      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          {ctaLabel} · {APP_CONFIG.PRICE_CURRENT}
        </CTAButton>
      </div>
      <p className="mt-3 text-sm text-ivory-faint">
        Prueba 7 días. Si no es para ti, reembolso según el checkout.
      </p>
    </div>
  )
}
