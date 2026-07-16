import { APP_CONFIG } from '@/config'
import { CTAButton } from '@/components/CTAButton'
import { goToCheckout } from '@/lib/analytics'

type Props = {
  title?: string
  ctaLabel?: string
  ctaId?: string
}

export function OfferBox({
  title = 'Accede hoy a Autora Oculta',
  ctaLabel = 'Desbloquear mi proyecto ahora',
  ctaId = 'offer',
}: Props) {
  return (
    <div id="oferta" className="rounded-[2px] border border-gold/35 bg-gradient-to-b from-wine/30 to-bg p-6 text-center shadow-[0_0_60px_rgba(92,26,46,0.25)] md:p-8">
      <p className="font-accent text-[0.68rem] tracking-[0.2em] text-gold uppercase">Oferta de lanzamiento</p>
      <h3 className="font-display mt-3 text-3xl text-ivory md:text-4xl">{title}</h3>
      <p className="mt-4 text-ivory-faint">
        Precio normal: <s>{APP_CONFIG.PRICE_REFERENCE}</s>
      </p>
      <p className="font-display mt-1 text-5xl text-gold-soft">{APP_CONFIG.PRICE_CURRENT}</p>
      <p className="mt-2 text-sm text-ivory-faint">Un solo pago.</p>
      <div className="mt-6">
        <CTAButton full onClick={() => goToCheckout(ctaId)}>
          {ctaLabel}
        </CTAButton>
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-ivory-faint" role="list">
        <li>Acceso digital inmediato</li>
        <li>Pago seguro</li>
        <li>Compatible con celular y computadora</li>
        <li>Garantía de 7 días</li>
      </ul>
    </div>
  )
}
